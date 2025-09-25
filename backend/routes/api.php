<?php

use App\Http\Controllers\Action\Auth\LoginController;
use App\Http\Controllers\Action\Auth\RegisterController;
use App\Http\Controllers\Action\Employees\CreateEmployee;
use App\Http\Controllers\Action\Employees\DeleteEmployee;
use App\Http\Controllers\Action\Employees\GetAllEmployees;
use App\Http\Controllers\Action\Employees\UpdateEmployees;
use App\Http\Controllers\Action\User\UpdateUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::post('register' , [RegisterController::class , 'register']);
Route::post('login', [LoginController::class , 'login']);


Route::middleware(['auth:api'])->group(function() {

    
});
    Route::post('createemployee', [CreateEmployee::class, 'createEmployee']);
    Route::get('getemployee' , [GetAllEmployees::class , 'getAllEmployee']);
    Route::put('updateemployees/{id}' , [UpdateEmployees::class , 'updateEmployees']);

    Route::delete('deleteemployee/{id}' , [DeleteEmployee::class,'deleteEmployee']);

    Route::put('updateuser/{id}', [UpdateUser::class, 'updateUser']);

