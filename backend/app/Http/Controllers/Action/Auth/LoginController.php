<?php

namespace App\Http\Controllers\Action\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;


class LoginController extends Controller
{
    public function login (Request $request){
        
        $request->validate([
            'email'=> 'required|string|email',
            'password' => 'required|string'
        ]);

        // attempt verify credentials and create token
        if(!$token = JWTAuth::attempt($request->only('email' , 'password'))){
            return response()->json([
                'error' => 'Unauthorized'
            ],401);
        }

        return response()->json([
            "message" => "Login success",
            "user" => JWTAuth::user(),
            "access_token" => $token
        ]);
    }
}
