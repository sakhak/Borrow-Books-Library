<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Borrow extends Model
{
    public const LOAN_DAYS = 14;
    public const MAX_ACTIVE_LOANS = 5;
    public const FINE_PER_DAY = 0.25;

    protected $primaryKey = 'borrow_id';

    protected $fillable = [
        'book_id', 'member_id', 'user_id', 'borrow_date', 'due_date', 'return_date', 'fine_amount', 'notes',
    ];

    protected $casts = [
        'borrow_date' => 'date:Y-m-d',
        'due_date' => 'date:Y-m-d',
        'return_date' => 'date:Y-m-d',
        'fine_amount' => 'decimal:2',
    ];

    protected $appends = ['is_overdue', 'days_overdue', 'current_fine'];

    public function book()
    {
        return $this->belongsTo(Book::class, 'book_id');
    }

    public function member()
    {
        return $this->belongsTo(Member::class, 'member_id');
    }

    public function librarian()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function getDaysOverdueAttribute(): int
    {
        if ($this->return_date || !$this->due_date) {
            return 0;
        }
        $today = now()->startOfDay();
        return $today->greaterThan($this->due_date) ? (int) abs($this->due_date->diffInDays($today)) : 0;
    }

    public function getIsOverdueAttribute(): bool
    {
        return $this->days_overdue > 0;
    }

    public function getCurrentFineAttribute(): string
    {
        return $this->return_date
            ? (string) $this->fine_amount
            : number_format($this->days_overdue * self::FINE_PER_DAY, 2, '.', '');
    }
}
