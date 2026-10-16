<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    protected $primaryKey = 'member_id';

    protected $fillable = ['member_code', 'full_name', 'email', 'phone', 'address', 'joined_date', 'status'];

    protected $casts = ['status' => 'boolean', 'joined_date' => 'date:Y-m-d'];

    public function borrows()
    {
        return $this->hasMany(Borrow::class, 'member_id');
    }

    public static function nextCode(): string
    {
        $next = (int) static::max('member_id') + 1;
        return 'MBR-' . str_pad((string) $next, 4, '0', STR_PAD_LEFT);
    }
}
