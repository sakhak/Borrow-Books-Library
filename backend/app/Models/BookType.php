<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookType extends Model
{
     use HasFactory;
    protected $fillable = [
        "book_id"
    ];
    public function book_id() {
        return $this->belongsTo(Book::class, "book_id");
    }
    public function type_id(){
        return $this->hasMany(Type::class,"type_id");
    }
    
}
