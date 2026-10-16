<?php

namespace App\Http\Controllers\Action\Employees;

use App\Http\Controllers\Concerns\ListsRecords;
use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;

class GetAllEmployees extends Controller
{
    use ListsRecords;

    public function getAllEmployee(Request $request)
    {
        $query = Employee::orderByDesc('employee_id');

        if ($s = $request->query('search')) {
            $query->where(fn ($q) => $q->where('full_name', 'like', "%{$s}%")->orWhere('phone', 'like', "%{$s}%"));
        }

        return $this->listResponse($query, $request);
    }
}
