<?php

namespace App\Http\Controllers\Action\Employees;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;

class CreateEmployee extends Controller
{
    //
    public function createEmployee (Request $request) {

        $request->validate([
           
            'first_name' => 'required|string' ,
            'last_name' => 'required|string',
            'full_name' => 'required|string',
            'phone' => 'required|string|unique:employees,phone',
            'date_of_birth' => 'required|date' ,
            'salary' => 'required|numeric|min:0|max:99999.99',
            'hire_date' => 'required|date' ,
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'status' => 'nullable',

        ]);

        
        $imagePath = null ;
        if($request->hasFile('image')){
                $imagePath = $request->file('image')->store('employees' , 'public');
            };
        
        // Get the authenticated user
        // $user = auth('api')->user();        
        
        $employee = Employee::create([
            'first_name' => $request->first_name ,
            'last_name' => $request->last_name,
            'full_name' => $request->full_name,
            'phone' => $request->phone,
            'date_of_birth' => $request->date_of_birth ,
            'salary' => $request->salary,
            'hire_date' => $request->hire_date ,
            'image' => $imagePath,
            'status' => $request->status,
        ]);

        return response()->json([
            'message' => 'Created employee successfull',
            'employee' => $employee,
        ],201);
    }      
}
