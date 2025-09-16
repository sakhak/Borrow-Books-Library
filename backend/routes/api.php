<?php

use App\Http\Controllers\Action\Auth\LoginController;
use App\Http\Controllers\Action\Auth\RegisterController;
use App\Http\Controllers\Action\Employees\CreateEmployee;
use App\Http\Controllers\Action\Employees\GetAllEmployees;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::post('register' , [RegisterController::class , 'register']);
Route::post('login', [LoginController::class , 'login']);


Route::middleware(['auth:api'])->group(function() {
    Route::post('createemployee', [CreateEmployee::class, 'createEmployee']);
    Route::get('getemployee' , [GetAllEmployees::class , 'getAllEmployee']);
});
