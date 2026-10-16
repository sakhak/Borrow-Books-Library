<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookLanguage extends Model
{
    use HasFactory;
    protected $fillable = [
        "book_lang_id",
        "country",
        "language",
    ];
    public function books()
    {
        return $this->hasMany(Book::class, "book_lang_id", "book_lang_id");
    }
}

