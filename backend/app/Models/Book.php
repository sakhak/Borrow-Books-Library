<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    protected $primaryKey = 'book_id';

    protected $fillable = [
        'title', 'isbn', 'author_id', 'category_id', 'publisher', 'published_year',
        'description', 'cover', 'shelf_location', 'total_copies', 'available_copies', 'status',
    ];

    protected $casts = ['status' => 'boolean'];

    public function author()
    {
        return $this->belongsTo(Author::class, 'author_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function borrows()
    {
        return $this->hasMany(Borrow::class, 'book_id');
    }
}
