<?php

namespace App\Http\Controllers\Action\Employees;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UpdateEmployees extends Controller
{
    //
    public function updateEmployees (Request $request , $id) {

        return $this->validateEmployees($request,$id);

    }

    private function validateEmployees (Request $request , $id) {
                
        $validated = $request->validate([
            'first_name' => 'required|string' ,
            'last_name' => 'required|string',
            'full_name' => 'required|string',
            'phone' => 'required|string|unique:employees,phone,' . $id . ',employee_id',
            'date_of_birth' => 'required|date' ,
            'salary' => 'required|numeric|min:0|max:99999.99',
            'hire_date' => 'required|date' ,
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'status' => 'nullable',
        ]);

       $employee = Employee::findOrFail($id);


        // This block handles the image update logic correctly.
        if ($request->hasFile('image')) {
            // 1. If an old image exists, delete it from storage.
            if ($employee->image && Storage::disk('public')->exists($employee->image)) {
                Storage::disk('public')->delete($employee->image);
            }
            // 2. Store the new image and update the path in the validated data array.
            $validated['image'] = $request->file('image')->store('employees', 'public');
        }
     


       $employee->update($validated);

       return response()->json([
        "message" => "Updated successfull",
        "employee" => $employee,
       ], 201);

    }
}
 