<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Laravel\Sanctum\PersonalAccessToken;

class AuthController extends Controller
{
    /**
     * This function checks if an existing user is already created in the Database, it will check for email and name duplicates.
     * @param object $userData is an object containing the user information (email, name) 
     * @return bool $canCreate it's a variable that will return true or false, depending on if the user is duplicate dor not.
     */
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

    /**
     * This function will check what is duplicated, if the name or the email.
     * @param object $userData is an object containing the user email
     * @return bool $isDuplicated it's a variable that will return 'name' or 'email', depending on what is duplicated.
     */
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

    /**
     * This function will create the user if it's not duplicated and all fiels are validated.
     * @param name is the user name
     * @param email is the user email
     * @param password is the user password
     * @param password_confirmation is the user password confirmed
     * @return sendUser object contains fields 'valid', 'message' and 'token'. Valid is a boolean that will determine if the user has been created. Message will return the error if valid is false or will return the user Id if the user has been created. Token will only be present if the user has been created and will return the token id.
     */    
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

                //Save the user and the oken from the user to send it to frontend
                $userId = $user->id;
                $token = $user->createToken('token')->plainTextToken;
                
                $sendUser = (object) [
                    'valid' => true,
                    'userId' => $userId,
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

    /**
     * This function will check if a user exists with the given email and password.
     * @param string $email is the user email
     * @param string $password is the user password
     * @return object $sendUser object contains fields 'valid', 'message' and 'token'. Valid is a boolean that will determine if the user has successfully logged in. Message will return the error if valid is false or will return the user Id if the user has been created. Token will only be present if the user has logged in and will return the token id.
     */    
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
                $token = $user->createToken('token')->plainTextToken;
                $sendUser = (object) [
                    'valid' => true,
                    'message' => "Logged in successfully",
                    'userId' => $userFound -> id,
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

    /**
     * This function checks if an existing user is already created in the Database, it will check for email and name duplicates.
     * @param string $token is the session token for the logged in user. 
     * If no session is present or the session has expired it will delete the token from the database.
     * @return object $returnResponse is an object containing 'logout' on true.
     */    
    public function logout(Request $request)
    {   
        //Check if we have recieved a token
        if ( !($request -> token == null || $request -> token == "" || $request -> token == "null") ) {
            
            //Remove the token when logging out
            [$id, $token] = explode('|', $request -> token, 2);
            
            PersonalAccessToken::find($id)->delete();
        }        
     
        $returnResponse = (object)['logout' => true];
         
        return response() -> json($returnResponse);
    }

    /**
     * This function checks if an existing user is already created in the Database, it will check for email and name duplicates.
     * @param string $token is the session token for the logged in user. 
     * Given the token, it will extract the user id from the database and return the user information. If the token is null or doesn't exist in the database, it will return an error.
     * @return object $userFound is an object containing all the information from a user (name, email, elo, coins...) if the user has been found, or 'error' => true, if any error has occurred.
     */      
    public function getUserInfo(Request $request)
    {
        $returnUserId = null;
        $userFound = (object) [
            'error' => true,
        ];
        
        //Return the info from the user if the token is not null
        if ( !($request -> token == null || $request -> token == "" || $request -> token == "null") ) {
            [$id, $token] = explode('|', $request -> token, 2);
            $accessToken = PersonalAccessToken::find($id);

            if (hash_equals($accessToken->token, hash('sha256', $token))) {
                $returnUserId = $accessToken -> tokenable_id;
                $userFound = User::where('id', $returnUserId)->first();
            }
        }

        return response() -> json($userFound);
    }    

    /**
     * This function checks if an existing user is already created in the Database, it will check for email and name duplicates.
     * @param string $token is the session token for the logged in user. 
     * Given the token, it will extract the user id from the database and check if the token is valid.
     * @return object $logged is an object containing 'correct' if the user is logged in it will return true, otherwise it will return false.
     * 
     */      
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

            if ($accessToken != null) {
                if (hash_equals($accessToken->token, hash('sha256', $token))) {
                    $logged -> correct = true;
                }
            }

        }

        return response() -> json($logged);
    }   

}