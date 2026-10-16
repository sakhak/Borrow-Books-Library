<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Concerns\ListsRecords;
use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Borrow;
use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class BorrowController extends Controller
{
    use ListsRecords;

    public function index(Request $request)
    {
        $query = Borrow::with(['book:book_id,title,isbn', 'member:member_id,full_name,member_code'])
            ->orderByDesc('borrow_id');

        switch ($request->query('status')) {
            case 'borrowed':
                $query->whereNull('return_date');
                break;
            case 'overdue':
                $query->whereNull('return_date')->whereDate('due_date', '<', now()->toDateString());
                break;
            case 'returned':
                $query->whereNotNull('return_date');
                break;
        }

        if ($s = $request->query('search')) {
            $query->where(fn ($q) => $q
                ->whereHas('book', fn ($b) => $b->where('title', 'like', "%{$s}%")->orWhere('isbn', 'like', "%{$s}%"))
                ->orWhereHas('member', fn ($m) => $m->where('full_name', 'like', "%{$s}%")->orWhere('member_code', 'like', "%{$s}%")));
        }

        return $this->listResponse($query, $request);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'book_id' => 'required|exists:books,book_id',
            'member_id' => 'required|exists:members,member_id',
            'due_date' => 'nullable|date|after_or_equal:today',
            'notes' => 'nullable|string|max:255',
        ]);

        $borrow = DB::transaction(function () use ($data, $request) {
            $book = Book::lockForUpdate()->findOrFail($data['book_id']);
            $member = Member::findOrFail($data['member_id']);

            if (!$book->status) {
                throw ValidationException::withMessages(['book_id' => 'This book is inactive and cannot be borrowed.']);
            }
            if ($book->available_copies < 1) {
                throw ValidationException::withMessages(['book_id' => 'No copies of this book are available right now.']);
            }
            if (!$member->status) {
                throw ValidationException::withMessages(['member_id' => 'This member is inactive.']);
            }

            $active = Borrow::where('member_id', $member->member_id)->whereNull('return_date');
            if ((clone $active)->where('book_id', $book->book_id)->exists()) {
                throw ValidationException::withMessages(['book_id' => 'This member already has this book on loan.']);
            }
            if ((clone $active)->count() >= Borrow::MAX_ACTIVE_LOANS) {
                throw ValidationException::withMessages(['member_id' => 'Member has reached the limit of ' . Borrow::MAX_ACTIVE_LOANS . ' active loans.']);
            }

            $borrow = Borrow::create([
                'book_id' => $book->book_id,
                'member_id' => $member->member_id,
                'user_id' => optional($request->user('api'))->getKey(),
                'borrow_date' => now()->toDateString(),
                'due_date' => $data['due_date'] ?? now()->addDays(Borrow::LOAN_DAYS)->toDateString(),
                'notes' => $data['notes'] ?? null,
            ]);
            $book->decrement('available_copies');

            return $borrow;
        });

        return response()->json(['message' => 'Book borrowed', 'borrow' => $borrow->load('book', 'member')], 201);
    }

    public function returnBook($id)
    {
        $borrow = DB::transaction(function () use ($id) {
            $borrow = Borrow::lockForUpdate()->findOrFail($id);
            if ($borrow->return_date) {
                throw ValidationException::withMessages(['borrow' => 'This book has already been returned.']);
            }

            $fine = $borrow->days_overdue * Borrow::FINE_PER_DAY;
            $borrow->update(['return_date' => now()->toDateString(), 'fine_amount' => $fine]);
            Book::whereKey($borrow->book_id)->increment('available_copies');

            return $borrow->fresh();
        });

        return response()->json([
            'message' => $borrow->fine_amount > 0
                ? 'Book returned. Late fine: $' . number_format((float) $borrow->fine_amount, 2)
                : 'Book returned',
            'borrow' => $borrow->load('book', 'member'),
        ]);
    }
}
