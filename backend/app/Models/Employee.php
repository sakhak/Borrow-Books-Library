<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    //

    protected $primaryKey = 'employee_id';

    protected $casts = [
        'salary' => 'decimal:2' 
    ];

    protected $fillable = [
        'first_name',
        'last_name',
        'full_name',
        'phone',
        'date_of_birth',
        'salary',
        'hire_date',
        'image',
        'status',
    ];
}
