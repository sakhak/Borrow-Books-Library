<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Author;
use App\Models\Book;
use App\Models\Borrow;
use App\Models\Member;

class DashboardController extends Controller
{
    public function index()
    {
        $today = now()->toDateString();

        $months = collect(range(5, 0))->map(fn ($i) => now()->startOfMonth()->subMonths($i));
        $counts = Borrow::where('borrow_date', '>=', $months->first()->toDateString())
            ->get(['borrow_date'])
            ->groupBy(fn ($b) => $b->borrow_date->format('Y-m'))
            ->map->count();

        $popular = Book::withCount('borrows')->with('author:author_id,name')
            ->whereHas('borrows')->orderByDesc('borrows_count')->limit(5)->get();

        return response()->json([
            'stats' => [
                'titles' => Book::count(),
                'copies' => (int) Book::sum('total_copies'),
                'available' => (int) Book::sum('available_copies'),
                'members' => Member::where('status', true)->count(),
                'authors' => Author::count(),
                'active_loans' => Borrow::whereNull('return_date')->count(),
                'overdue' => Borrow::whereNull('return_date')->whereDate('due_date', '<', $today)->count(),
                'borrowed_today' => Borrow::whereDate('borrow_date', $today)->count(),
                'returned_today' => Borrow::whereDate('return_date', $today)->count(),
            ],
            'monthly' => $months->map(fn ($m) => [
                'label' => $m->format('M'),
                'count' => (int) ($counts[$m->format('Y-m')] ?? 0),
            ])->values(),
            'recent' => Borrow::with(['book:book_id,title', 'member:member_id,full_name'])
                ->orderByDesc('borrow_id')->limit(6)->get(),
            'overdue_list' => Borrow::with(['book:book_id,title', 'member:member_id,full_name,phone'])
                ->whereNull('return_date')->whereDate('due_date', '<', $today)
                ->orderBy('due_date')->limit(6)->get(),
            'popular' => $popular,
        ]);
    }
}
