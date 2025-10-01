<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookAuthor extends Model
{
    use HasFactory;
    protected $fillable = [
        "author_id",
        "book_id",
    ];
    public function book(){
        return $this->hasMany(Book::class,"book_id");
    }
    public function author_id(){
        return $this->belongsTo(Author::class,"author_id");
    }
    
}
