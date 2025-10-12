<?php

namespace App\Http\Controllers\Action\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;

class GetSingleUser extends Controller
{
    public function getSingleUser (Request $request) {
        return $this->getUser($request);
    }

    private function getUser (Request $request) {
        try{
            $user = JWTAuth::parseToken()->authenticate();

            if(!$user) {
                return response()->json([
                    'message' => 'User not found',
                     
                ],404);
            }
        }catch(JWTException $e){
            return response()->json([
                'error' => 'Token is invalid or expired'
            ], $e);
        }
                return response()->json([
            'success' => true,
            'data' => $user,  // All user information
            'message' => 'User profile retrieved successfully'
        ], 200);
    }
}
