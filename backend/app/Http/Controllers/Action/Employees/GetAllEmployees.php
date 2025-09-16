<?php

namespace App\Http\Controllers\Action\Employees;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;

class GetAllEmployees extends Controller
{
    public function getAllEmployee(Request $request){
        return $this->get();
    }

    private function get(){
        $employee = Employee::all();

        return response()->json([
            "employees" => $employee
        ], 201);
    }
}
