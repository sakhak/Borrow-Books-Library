<?php

namespace App\Http\Controllers\Action\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class RegisterController extends Controller
{
   public function register (Request $request) {

        // Validate data from user input

        $request -> validate([
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'full_name' => 'required|string',
            'email' => 'required|string|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'required',
            'age' => 'required|integer',
            'gender'        => 'required|in:male,female,other',
            'date_of_birth' => 'required|date',
            'address' => 'required',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'status' => 'nullable',

        ]);

        // create user 

        $imagePath = null;
        if($request->hasFile('image')){
            $imagePath = $request->file('image')->store('profiles' , 'public');
        };

        $user = User::create([

            "first_name" => $request->first_name,
            "last_name" => $request->last_name,
            "full_name" => $request->full_name,
            "email" => $request->email,
            "password" =>  Hash::make($request->password),
            "phone" => $request->phone,
            "age" => $request->age,
            "gender" => $request->gender,
            "date_of_birth" => $request->date_of_birth,
            "address" => $request->address,
            "image" => $imagePath,
            "status" => $request->status,

        ]);

        return response()->json([
            'user' => $user,
            'message'=> 'User register successfull'
        ], 201);
   }
   
}
