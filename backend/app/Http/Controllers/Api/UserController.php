<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Concerns\ListsRecords;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    use ListsRecords;

    public function index(Request $request)
    {
        $query = User::orderBy('full_name');
        if ($s = $request->query('search')) {
            $query->where(fn ($q) => $q->where('full_name', 'like', "%{$s}%")->orWhere('email', 'like', "%{$s}%")->orWhere('phone', 'like', "%{$s}%"));
        }
        return $this->listResponse($query, $request);
    }

    /** Create a staff account without logging in as it (unlike /register). */
    public function store(Request $request)
    {
        $data = $request->validate([
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'full_name' => 'required|string',
            'email' => 'required|string|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'required',
            'age' => 'required|integer|min:4|max:100',
            'gender' => 'required|in:male,female,other',
            'date_of_birth' => 'required|date',
            'address' => 'required',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'status' => 'nullable',
        ]);
        $data['status'] = $request->boolean('status', true);
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('profiles', 'public');
        }

        return response()->json(['message' => 'User created', 'user' => User::create($data)], 201);
    }

    public function destroy(Request $request, $id)
    {
        $user = User::findOrFail($id);
        if ((int) $request->user('api')->getKey() === (int) $user->getKey()) {
            return response()->json(['message' => 'You cannot delete your own account.'], 409);
        }
        if ($user->image) {
            Storage::disk('public')->delete($user->image);
        }
        $user->delete();

        return response()->json(['message' => 'User deleted']);
    }
}
