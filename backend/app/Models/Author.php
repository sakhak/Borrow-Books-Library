<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Author extends Model
{
    use HasFactory;

    protected $primaryKey = 'author_id';

    protected $fillable = [
        'name',
        'gender',
        'date_of_birth',
        'nationality',
        'bio',
        'image',
    ];

    public function bookAuthor()
    {
        return $this->hasMany(BookAuthor::class, 'author_id');
    }

    public function books()
    {
        return $this->hasMany(Book::class, 'author_id');
    }
}
