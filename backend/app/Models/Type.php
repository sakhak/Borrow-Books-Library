<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Type extends Model
{
    use HasFactory;
    protected $fillable = [
        "type"
    ];
    public function bookType(){
        return $this->belongsTo(BookType::class,"type_id");
    }
}
