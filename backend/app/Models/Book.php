<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;
    protected $fillable =[
        "book_lang_id",
        "title",
        "image",
        "qty",
        "price",
        "release_date",
    ];
     public function language()
    {
        return $this->belongsTo(BookLanguage::class, "book_lang_id");
    }
    public function bookType (){
        return $this->hasMany(BookType::class,"type_id");
    }

    public function bookAuthor(){
        return $this->belongsTo(BookAuthor::class,"book_id");
    }
    public function orderDetail(){
        return $this->belongsTo(OderDetail::class,"book_id");
    }
}
