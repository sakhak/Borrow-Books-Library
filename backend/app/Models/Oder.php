<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Oder extends Model
{
    use HasFactory;
    protected $fillable = [
        "user_id",
        "order_date",
        "status",
    ];
    public function oderDetail(){
        return $this->belongsTo(OderDetail::class,"order_id");
    }
}
