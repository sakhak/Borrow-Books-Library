<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Author extends Model
{
    protected $primaryKey = 'author_id';
    protected $fillable = ['name', 'nationality', 'bio', 'image'];

    public function books()
    {
        return $this->hasMany(Book::class, 'author_id');
    }
}
