<?php

namespace App\Http\Controllers\Action\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UpdateUser extends Controller
{
    //
    public function updateUser ( Request $request,$id) {

        return $this->update($request , $id);
    }

    private function update ( Request $request,$id) {

        $validated = $request->validate([
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'full_name' => 'required|string',
            'email' => 'required|string|email|unique:users,email,'. $id . ',user_id',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'required',
            'age' => 'required|integer',
            'gender'        => 'required|in:male,female,other',
            'date_of_birth' => 'required|date',
            'address' => 'required',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'status' => 'nullable',
        ]);

        $user = User::findOrFail($id);

        if($request->hasFile('image')) {
            if($user->image && Storage::disk('public')->exists($user->image)){
              Storage::disk('public')->delete($user->image);
            }

            $validated['image']= $request->file('image')->store('profiles' , 'public');
        }

       $user->update($validated);

       return response()->json([
        "message" => "Updated successfull",
        "user" => $user,
       ], 201);        

    }
}
