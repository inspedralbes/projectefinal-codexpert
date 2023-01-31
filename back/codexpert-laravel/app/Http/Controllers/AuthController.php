<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Session;
class AuthController extends Controller
{
    public function checkUserDuplicated($userData)
    {
        $canCreate = true;

        $findDuplicated = User::where('email', strtolower($userData -> email))
        ->orwhere('name', strtolower($userData -> name))
        ->count();

        if ($findDuplicated != 0) {
            $canCreate = false;
        }

        return $canCreate;
    }

    public function register(Request $request)
    {
        $validator =  Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'password' => 'required|string|min:4|confirmed'
        ]);

        if ($validator->fails()) {
            $user = "Validation errors.";
        } else {
            $createUser = $this->checkUserDuplicated($request);

            if ($createUser) {
                $user = new User;
                $user -> name = strtolower($request -> name);
                $user -> email = strtolower($request -> email);
                $user -> password = Hash::make($request -> password);
                $user -> save();
                
                Session::put('userId', $user -> id);
            } else {
                $user = "User already exists.";
            }
        } 

        return json_encode($user);
    }

    public function login(Request $request)
    {
        $user = "User not found.";

        $userFound = User::where('email', strtolower($request -> email))->first();
        if ($userFound != null) {
            if (Hash::check($request -> password, $userFound -> password)) {
                $user = $userFound;
                Session::put('userId', $user -> id);
            } else {
                $user = "Password and e-mail don't match.";
            }
        }

        return json_encode($user);
    }
}