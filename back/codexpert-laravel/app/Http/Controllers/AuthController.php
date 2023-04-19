<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Session;
use Laravel\Sanctum\HasApiTokens;
use Laravel\Sanctum\NewAccessToken;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\PersonalAccessToken;

class AuthController extends Controller
{
    private function checkUserDuplicated($userData)
    {
        //Check if any fields are duplicated
        $canCreate = true;

        $findDuplicated = User::where('email', strtolower($userData -> email))
        ->orwhere('name', strtolower($userData -> name))
        ->count();

        if ($findDuplicated != 0) {
            $canCreate = false;
        }

        return $canCreate;
    }

    private function findWhatIsDuplicated($userData)
    {
        //Check whether the user's name or the email is duplicated
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
        //Validate the fields
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
                'regex:/[@$!%*#?&;.]/', // must contain a special character
                'confirmed'
            ],
        ]);

        if ($validator->fails()) {
            $sendUser = (object) [
                'valid' => false,
                'message' => "Validation errors."
            ];
        } else {
            //If the validation doesn't fail we check if the user has already been created or any fields are repeated
            $createUser = $this->checkUserDuplicated($request);

            //If we can crete the user, we save the user in the database, all in lowercase and password hashed.
            if ($createUser) {
                $user = new User;
                $user -> name = strtolower($request -> name);
                $user -> email = strtolower($request -> email);
                $user -> password = Hash::make($request -> password);
                $user -> save();

                //Save the userId in the laravel session
                $request -> session()->put('userId', $user->id);
                $token = $user->createToken('token')->plainTextToken;
                
                $sendUser = (object) [
                    'valid' => true,
                    'message' => $request->session()->get("userId"),
                    'token' => $token
                ];
            } else {
                //If fields are valid but email or name are already in use we warn the user
                $duplicated = $this->findWhatIsDuplicated($request);
                $sendUser = (object) [
                    'valid' => false,
                    'message' => "Name already in use."
                ];
                
                if ($duplicated == 'email') {
                    $sendUser = (object) [
                        'valid' => false,
                        'message' => "Email already registered."
                    ];
                }
                
            }
        } 

        return response() -> json($sendUser);
    }

    public function login(Request $request)
    {   
        //If the user doesn't exist we warn the user
        $sendUser = (object) [
            'valid' => false,
            'message' => "User not found.",
            'token' => null
        ];

        $userFound = User::where('email', strtolower($request -> email))->first();

        //If the user has been found we check if the password and email match, if they do we log it in, if it doesn't we warn the user.
        if ($userFound != null) {
            if (Hash::check($request -> password, $userFound -> password)) {
                $user = $userFound;
                $request -> session()->put('userId', $user->id);
                $token = $user->createToken('token')->plainTextToken;
                $sendUser = (object) [
                    'valid' => true,
                    'message' => "Logged in successfully",
                    'token' => $token
                ];

            } else {
                $sendUser = (object) [
                    'valid' => false,
                    'message' => "Password and e-mail don't match.",
                    'token' => null
                ];
            }
        }

        return json_encode($sendUser);
    }

    public function logout(Request $request)
    {   
        //Remove the token when logging out
        [$id, $token] = explode('|', $request -> token, 2);
        
        PersonalAccessToken::find($id)->delete();
        Session::flush();
        
        $returnResponse = (object)['logout' => true];
        
        return response() -> json($returnResponse);
    }

    public function getUserInfo(Request $request)
    {
        $returnUserId = null;
        $userFound = null;
        
        //Return the info from the user if the token is not null
        if ($request -> token == null || $request -> token == "" || $request -> token == "null") {
            $userFound = null;
        } else { 
            [$id, $token] = explode('|', $request -> token, 2);
            $accessToken = PersonalAccessToken::find($id);

            if (hash_equals($accessToken->token, hash('sha256', $token))) {
                $returnUserId = $accessToken -> tokenable_id;
                $request -> session()->put('userId', $returnUserId);

                $userFound = User::where('id', $returnUserId)->first();
            }
        }

        return response() -> json($userFound);
    }    

    public function isUserLogged(Request $request)
    {
        $logged = (object) [
            'correct' => false,
        ];

        //Check if we have recieved a token
        if ( !($request -> token == null || $request -> token == "" || $request -> token == "null") ) {
            
            //Return if the user is logged in or not from the token
            [$id, $token] = explode('|', $request -> token, 2);
            $accessToken = PersonalAccessToken::find($id);

            if (hash_equals($accessToken->token, hash('sha256', $token))) {
                $logged -> correct = true;
            }
        }

        return response() -> json($logged);
    }   

}