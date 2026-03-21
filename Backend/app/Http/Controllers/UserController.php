<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    public function register (Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = \App\Models\User::create([
            'name' => $validatedData['name'],
            'username' => $validatedData['username'],
            'password' => bcrypt($validatedData['password']),
            'exchange_rate' => 4000,
        ]);
        return response()->json(['message' => 'User registered successfully', 'user' => $user], 201);
    }
}
