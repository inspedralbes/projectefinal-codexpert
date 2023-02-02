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

    public function findWhatIsDuplicated($userData)
    {
        $isDuplicated = 'name';

        $emailDuplicated = User::where('email', strtolower($userData -> email))
        ->count();

        if ($emailDuplicated != 0) {
            $isDuplicated = 'email';
        }

        return $isDuplicated;
    }

    public function register(Request $request)
    {
        $validator =  Validator::make($request->all(), [
            'name' => 'required|string|min:3|max:20',
            'email' => 'required|string|email|max:255',
            'password' => [
                'required',
                'string',
                'min:6',             // must be at least 6 characters in length
                'regex:/[a-z]/',      // must contain at least one lowercase letter
                'regex:/[A-Z]/',      // must contain at least one uppercase letter
                'regex:/[0-9]/',      // must contain at least one digit
                'regex:/[@$!%*#?&.]/', // must contain a special character
            ],
        ]);

        if ($validator->fails()) {
            $user = (object) ['message' => ""];
            $user -> message = "Validation errors.";
        } else {
            $createUser = $this->checkUserDuplicated($request);

            if ($createUser) {
                $user = new User;
                $user -> name = strtolower($request -> name);
                $user -> email = strtolower($request -> email);
                $user -> password = Hash::make($request -> password);
                $user -> save();
                $request -> session()->put('userId', $user->id);
                //Session::put('userId', $user -> id);
            } else {
                $duplicated = $this->findWhatIsDuplicated($request);
                $user = "Name already in use.";
                
                if ($duplicated == 'email') {
                    $user = "Email already registered."; 
                }
                
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
                $request -> session()->put('userId', $user->id);

                //Session::put('userId', $user -> id);
            } else {
                $user = "Password and e-mail don't match.";
            }
        }

        return json_encode($user);
    }

    public function logout(Request $request)
    {
        Session::flush();

        return json_encode("Logged out.");
    }
}