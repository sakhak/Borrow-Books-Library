<?php

use App\Http\Controllers\Action\Auth\LoginController;
use App\Http\Controllers\Action\Auth\RegisterController;
use App\Http\Controllers\Action\Employees\CreateEmployee;
use App\Http\Controllers\Action\Employees\DeleteEmployee;
use App\Http\Controllers\Action\Employees\GetAllEmployees;
use App\Http\Controllers\Action\Employees\UpdateEmployees;
use App\Http\Controllers\Action\User\GetSingleUser;
use App\Http\Controllers\Action\User\UpdateUser;
use App\Http\Controllers\Api\AuthorController;
use App\Http\Controllers\Api\BookController;
use App\Http\Controllers\Api\BorrowController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\MemberController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

// Public
Route::post('register', [RegisterController::class, 'register']);
Route::post('login', [LoginController::class, 'login']);

// Authenticated (JWT)
Route::middleware(['auth:api'])->group(function () {
    // Current user / staff accounts
    Route::get('getuserdata', [GetSingleUser::class, 'getSingleUser']);
    Route::get('users', [UserController::class, 'index']);
    Route::post('users', [UserController::class, 'store']);
    Route::put('updateuser/{id}', [UpdateUser::class, 'updateUser']);
    Route::delete('users/{id}', [UserController::class, 'destroy']);

    // Employees
    Route::post('createemployee', [CreateEmployee::class, 'createEmployee']);
    Route::get('getemployee', [GetAllEmployees::class, 'getAllEmployee']);
    Route::put('updateemployees/{id}', [UpdateEmployees::class, 'updateEmployees']);
    Route::delete('deleteemployee/{id}', [DeleteEmployee::class, 'deleteEmployee']);

    // Library
    Route::get('dashboard', [DashboardController::class, 'index']);

    Route::apiResource('categories', CategoryController::class)->except('show');
    Route::apiResource('authors', AuthorController::class)->except('show');
    Route::apiResource('members', MemberController::class)->except('show');
    Route::apiResource('books', BookController::class)->except('show');

    Route::get('inventory', [BookController::class, 'inventory']);
    Route::patch('books/{id}/stock', [BookController::class, 'updateStock']);

    Route::get('borrows', [BorrowController::class, 'index']);
    Route::post('borrows', [BorrowController::class, 'store']);
    Route::post('borrows/{id}/return', [BorrowController::class, 'returnBook']);
});
