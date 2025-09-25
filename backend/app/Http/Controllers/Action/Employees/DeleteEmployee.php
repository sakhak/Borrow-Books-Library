<?php

namespace App\Http\Controllers\Action\Employees;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DeleteEmployee extends Controller
{
    //

    public function deleteEmployee ($id) {
        return $this->delete($id);
    }
    
    private function delete( $id) {
        
        $employees = Employee::findOrFail($id);
        
        if($employees->image) {
            Storage::disk('public')->delete($employees->image);
        }

        $employees->delete();

        return response()->json([
            'message' => 'Employees deleted Successfull',
            'employee' => $employees
        ]);


    } 

}
