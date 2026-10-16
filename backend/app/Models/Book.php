<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;
    protected $primaryKey = 'book_id';

    protected $fillable = [
        'book_lang_id',
        'title',
        'image',
        'qty',
        'price',
        'release_date',
        'isbn',
        'author_id',
        'category_id',
        'publisher',
        'published_year',
        'description',
        'cover',
        'shelf_location',
        'total_copies',
        'available_copies',
        'status',
    ];

    protected $casts = ['status' => 'boolean'];

    public function language()
    {
        return $this->belongsTo(BookLanguage::class, 'book_lang_id');
    }

    public function bookType()
    {
        return $this->hasMany(BookType::class, 'type_id');
    }

    public function bookAuthor()
    {
        return $this->belongsTo(BookAuthor::class, 'book_id');
    }

    public function orderDetail()
    {
        return $this->belongsTo(OderDetail::class, 'book_id');
    }

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
