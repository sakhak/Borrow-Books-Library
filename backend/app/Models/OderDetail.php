<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OderDetail extends Model
{
    use HasFactory;
    protected $fillable =[
        "order_id",
        "book_id",
        "price",
        "qty",
        "amount",
    ];
    public function book(){
        return $this->hasMany(Book::class,"book_id");
    }
    public function oder(){
        return $this->hasMany(Oder::class,"order_id");
    }
}
