<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Concerns\ListsRecords;
use App\Http\Controllers\Controller;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class BookController extends Controller
{
    use ListsRecords;

    private function rules($id = null): array
    {
        return [
            'title' => 'required|string|max:255',
            'isbn' => ['nullable', 'string', 'max:30', Rule::unique('books', 'isbn')->ignore($id, 'book_id')],
            'author_id' => 'required|exists:authors,author_id',
            'category_id' => 'nullable|exists:categories,category_id',
            'publisher' => 'nullable|string|max:255',
            'published_year' => 'nullable|integer|min:1000|max:' . (date('Y') + 1),
            'description' => 'nullable|string',
            'shelf_location' => 'nullable|string|max:50',
            'total_copies' => 'required|integer|min:1|max:10000',
            'cover' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'status' => 'nullable',
        ];
    }

    public function index(Request $request)
    {
        $query = Book::with(['author:author_id,name', 'category:category_id,name'])->orderBy('title');

        if ($s = $request->query('search')) {
            $query->where(fn ($q) => $q->where('title', 'like', "%{$s}%")
                ->orWhere('isbn', 'like', "%{$s}%")
                ->orWhereHas('author', fn ($a) => $a->where('name', 'like', "%{$s}%")));
        }
        if ($cat = $request->query('category_id')) {
            $query->where('category_id', $cat);
        }
        if ($request->boolean('available')) {
            $query->where('status', true)->where('available_copies', '>', 0);
        }

        return $this->listResponse($query, $request);
    }

    public function store(Request $request)
    {
        $data = $request->validate($this->rules());
        $data['available_copies'] = $data['total_copies'];
        $data['status'] = $request->boolean('status', true);
        if ($request->hasFile('cover')) {
            $data['cover'] = $request->file('cover')->store('books', 'public');
        }
        $book = Book::create($data);

        return response()->json(['message' => 'Book created', 'book' => $book->load('author', 'category')], 201);
    }

    public function update(Request $request, $id)
    {
        $book = Book::findOrFail($id);
        $data = $request->validate($this->rules($id));
        unset($data['cover']);

        $borrowed = $book->total_copies - $book->available_copies;
        if ($data['total_copies'] < $borrowed) {
            return response()->json([
                'message' => "Total copies cannot be lower than the {$borrowed} copies currently on loan.",
                'errors' => ['total_copies' => ["Cannot be lower than the {$borrowed} copies currently on loan."]],
            ], 422);
        }
        $data['available_copies'] = $data['total_copies'] - $borrowed;
        $data['status'] = $request->boolean('status', true);

        if ($request->hasFile('cover')) {
            if ($book->cover) {
                Storage::disk('public')->delete($book->cover);
            }
            $data['cover'] = $request->file('cover')->store('books', 'public');
        }
        $book->update($data);

        return response()->json(['message' => 'Book updated', 'book' => $book->load('author', 'category')]);
    }

    public function destroy($id)
    {
        $book = Book::findOrFail($id);
        if ($book->borrows()->exists()) {
            return response()->json(['message' => 'This book has borrowing history and cannot be deleted. Mark it Inactive instead.'], 409);
        }
        if ($book->cover) {
            Storage::disk('public')->delete($book->cover);
        }
        $book->delete();

        return response()->json(['message' => 'Book deleted']);
    }

    /** Inventory overview: stock levels per book plus summary totals. */
    public function inventory(Request $request)
    {
        $lowStock = 1; // "low" = at most this many copies left on the shelf

        $query = Book::with(['author:author_id,name', 'category:category_id,name'])->orderBy('title');
        if ($s = $request->query('search')) {
            $query->where(fn ($q) => $q->where('title', 'like', "%{$s}%")->orWhere('isbn', 'like', "%{$s}%"));
        }
        if ($request->query('stock') === 'out') {
            $query->where('available_copies', 0);
        } elseif ($request->query('stock') === 'low') {
            $query->where('available_copies', '>', 0)->where('available_copies', '<=', $lowStock);
        }

        $page = $query->paginate(min(max($request->integer('per_page', 10), 1), 100));
        $page->getCollection()->transform(function ($b) use ($lowStock) {
            $b->borrowed_copies = $b->total_copies - $b->available_copies;
            $b->stock_level = $b->available_copies === 0 ? 'out' : ($b->available_copies <= $lowStock ? 'low' : 'ok');
            return $b;
        });

        $summary = [
            'titles' => Book::count(),
            'total_copies' => (int) Book::sum('total_copies'),
            'available_copies' => (int) Book::sum('available_copies'),
            'borrowed_copies' => (int) Book::sum('total_copies') - (int) Book::sum('available_copies'),
            'out_of_stock' => Book::where('available_copies', 0)->count(),
            'low_stock' => Book::where('available_copies', '>', 0)->where('available_copies', '<=', $lowStock)->count(),
        ];

        return response()->json(array_merge($page->toArray(), ['summary' => $summary]));
    }

    public function updateStock(Request $request, $id)
    {
        $book = Book::findOrFail($id);
        $data = $request->validate(['total_copies' => 'required|integer|min:0|max:10000']);

        $borrowed = $book->total_copies - $book->available_copies;
        if ($data['total_copies'] < $borrowed) {
            return response()->json([
                'message' => "Total copies cannot be lower than the {$borrowed} copies currently on loan.",
                'errors' => ['total_copies' => ["Cannot be lower than the {$borrowed} copies currently on loan."]],
            ], 422);
        }
        $book->update([
            'total_copies' => $data['total_copies'],
            'available_copies' => $data['total_copies'] - $borrowed,
        ]);

        return response()->json(['message' => 'Stock updated', 'book' => $book]);
    }
}
