<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Laravel\Sanctum\PersonalAccessToken;

class UserController extends Controller
{      
    /**
     * This function checks with the token recieved if the token is valid on the database, if it is it will return the user id
     * @param string $checkToken is the session token
     * @return int $userId is the user id found linked to the token in the database
     */     
    private function getUserId($checkToken)
    {
        $userId = null;
        //Check if we have recieved a token
        if ( !($checkToken == null || $checkToken == "" || $checkToken == "null") ) {
            
            //Return if the user is logged in or not from the token
            [$id, $token] = explode('|', $checkToken, 2);
            $accessToken = PersonalAccessToken::find($id);

            if ($accessToken != null) {
                if (hash_equals($accessToken->token, hash('sha256', $token))) {
                    $userId = $accessToken->tokenable_id;
                }
            }

        }


        return $userId;
    }     

    /**
     * This function will recieve the userId from the user token and will send the url from the user's avatar found in the database
     * @param string $token is the session token
     * @return object $returnAvatar is the object containing the url from the user's avatar
     */      
    public function getAvatar(Request $request)
    {
        $userFound = (object) ['url' => null];
        $returnAvatar = (object) ['url' => null];
        $userId = $this->getUserId($request->token);

        //Check if the user id is null, if not we get the user's avatar.
        if ($userId != null) {
            $userFound = User::where('id', $userId)->first();
            if ($userFound != null) {
                $returnAvatar = (object) [
                    'url' => $userFound -> avatar
                ];
            }
        } 
        
        return response() -> json($returnAvatar);
    }
    
    /**
     * This function will recieve the userId from and will send the url from the user's avatar
     * @param int $userId is id from the user that we want to get their avatar
     * @return object $returnAvatar is the object containing the url from the user's avatar
     */      
    public function getAvatarFromOtherUser(Request $request)
    {
        $userFound = (object) ['url' => null];
        $returnAvatar = (object) ['url' => null];

        //Check if the user id is null, if not we get the user's avatar.
        if ($request -> userId != null) {
            $userFound = User::where('id', $request -> userId)->first();
            if ($userFound != null) {
                $returnAvatar = (object) [
                    'url' => $userFound -> avatar
                ];
            }
        } 
        
        return response() -> json($returnAvatar);
    }

    /**
     * This function will recieve the userId from the user token and will check if the new avatar is valid, if valid it will change it, if not the avatar will remain unchanged
     * @param string $token is the session token
     * @param string $newAvatar is the url of the new avatar
     * @return object $returnResponse contains the boolean attribute 'changed', if true the avatar has been updated
     */       
    public function setAvatar(Request $request)
    {
        $returnResponse = (object) [
            'changed' => false
        ];
        $userId = $this->getUserId($request->token);

        //Check if the user is id null, if not we change the avatar.
        if ($userId != null) {
            $userFound = User::where('id', $userId)->first();
            if ($userFound != null) {
                if (Str::contains($request -> newAvatar, 'https://api.dicebear.com/5.x/pixel-art/svg')) {
                    $userFound -> avatar = $request -> newAvatar;
                    $userFound -> save();

                    $returnResponse = (object) [
                        'changed' => true
                    ];
                }
            }
        }  

        return response() -> json($returnResponse);
    }

    /**
     * This function will recieve the userId from the user token and will return the user information if the user is found
     * @param string $token is the session token
     * @return object $returnUser will return 'name', 'email' and 'avatar' from the requested user. If the user id is not valid or the user could't be found it will return an error message.
     */        
    public function getUserData(Request $request)
    {
        $returnUser = (object) [
            'error' => "User is not logged in."
        ];
        $userId = $this->getUserId($request->token);

        //If the user id is not null we return the information from the user (name, email, avatar)
        if ($userId != null) {
            $userFound = User::where('id', $userId)->first();
            if ($userFound != null) {
                $returnUser = (object) [
                    'name' => $userFound -> name,
                    'email' => $userFound -> email,
                    'avatar' => $userFound -> avatar,
                ];
            }
        }
        
        return response() -> json($returnUser);
    }

    /**
     * This function will recieve the userId from the user and will return the user information
     * @param int $userId is id from the user that we want to retrieve their information 
     * @return object $returnUser will return 'name', 'email' and 'avatar' from the requested user. If the user id is not valid or the user could't be found it will return an error message.
     */        
    public function getUserDataFromId(Request $request)
    {
        $returnUser = (object) [
            'error' => "User is not logged in."
        ];

        //If the user id is not null we return the information from the user (name, email, avatar)
        if ($request -> userId != null) {
            $userFound = User::where('id', $request -> userId)->first();
            if ($userFound != null) {
                $returnUser = (object) [
                    'name' => $userFound -> name,
                    'avatar' => $userFound -> avatar,
                ];
            }
        }
        
        return response() -> json($returnUser);
    }

    /**
     * This function given a new user name, will check if the name is valid according to our validation rules or if the username is already used
     * @param string $token is the session token
     * @param string $newName is the new requested name
     * @return object $validName contains the boolean attribute 'willChange' that determines if the name is valid to be changed, otherwise it will contain a new attribute named 'error' with an error message explaining why the name can' be changed
     */      
    private function checkValidName($request, $userFound)
    {
        $validName = (object) [
            'willChange' => false,
            'error' => "User is not logged in."
        ]; 
        $nameRepeated = false;
        $userId = $this->getUserId($request->token);

        //Check if user has changed the name                      
        if ($userId != null) {
            if (strcmp($userFound -> name, $request -> newName) == 0) {
                $validName = (object) [
                    'willChange' => false, 
                    'error' => "Name has not been modified, no changes were made."
                ];  
            } else {
                //If the name has been modified, we check that is valid.
                if (( strlen ($request -> newName) < 3) || ( strlen($request -> newName) > 20)) {
                    $validName = (object) [
                        'willChange' => false, 
                        'error' => "Name must have a minimum amount of 3 characters and 20 max."
                    ];
                } else {
                    //If the name is valid we check if it's not repeated.
                    $getAllNames = User::get('name');
                    for ($i = 0; $i < count($getAllNames); $i++) { 
                        if (strcasecmp($request -> newName, $getAllNames[$i] -> name) == 0) {
                            $nameRepeated = true;
                        }
                    }
                    //Check if the name is repeated.
                    if ($nameRepeated) {
                        $validName = (object) [
                            'willChange' => false,
                            'error' => "Name already in use."
                        ]; 
                    } else {
                        $validName = (object) [
                            'willChange' => true
                        ];
                    }
                }
            }
        }

        return $validName;
    }
    
    /**
     * This function given a name and the user password, and after checking if both are valid, it will change it or return the error caught on the function checkValidName
     * @param string $token is the session token
     * @param string $newName is the new requested name
     * @param string $newPassword is the user's current password
     * @return object $returnUser will return the attribute 'error' with the error message, otherwise it will return 'success' and a success message
     */       
    public function changeUsername(Request $request)
    {
        $validName = (object) [
            'willChange' => true
        ];
        $returnUser = (object) [
            'error' => "User is not logged in."
        ];
        $userId = $this->getUserId($request->token);

        //Check if the user id is not, if not null we continue to check
        if ($userId != null) {
            $userFound = User::where('id', $userId)->first();
            if ($userFound  != null) {
                $validName = $this->checkValidName($request, $userFound);

                //Check if password is correct.
                if (Hash::check($request -> password, $userFound -> password)) {
                    //If after validating the name can be changed we change it, if not we return the error.
                    if ($validName -> willChange) {
                        $userFound -> name = $request -> newName;
                        $userFound -> save(); 
                        $returnUser = (object) [
                            'success' => "Name has been changed."
                        ];
                    } else {
                        $returnUser = (object) [
                            'error' => $validName -> error
                        ];
                    }
                } else {
                    $returnUser = (object) [
                        'error' => "Password is incorrect."
                    ];
                }
            }
        }
        
        return response() -> json($returnUser);
    }
    
    /**
     * This function given a new user email, will check if the email is valid according to our validation rules or if it's is already used
     * @param string $token is the session token
     * @param string $newEmail is the new requested email
     * @return object $validEmail contains the boolean attribute 'willChange' that determines if the email is valid to be changed, otherwise it will contain a new attribute named 'error' with an error message explaining why the name can' be changed
     */         
    private function checkValidEmail($request, $userFound)
    {
        $validEmail = (object) [
            'willChange' => false,
            'error' => "User is not logged in."
        ]; 
        $emailRepeated = false;
        $userId = $this->getUserId($request->token);

        //Check if user has changed the email                      
        if ($userId != null) {
            if (strcmp($userFound -> email, $request -> newEmail) == 0) {
                $validEmail = (object) [
                    'willChange' => false, 
                    'error' => "Email has not been modified, no changes were made."
                ];  
            } else {
                //If the email has been modified, we check that is valid.
                $validator =  Validator::make($request->all(), [
                    'newEmail' => 'required|string|email|max:255'
                ]);

                if ($validator->fails()) {
                    $validEmail = (object) [
                        'willChange' => false, 
                        'error' => "Email not valid."
                    ];  
                } else {
                    //If the email is valid we check if it's not repeated.
                    $getAllEmails = User::get('email');
                    for ($i = 0; $i < count($getAllEmails); $i++) { 
                        if (strcasecmp($request -> newEmail, $getAllEmails[$i] -> email) == 0) {
                            $emailRepeated = true;
                        }
                    }
                    //Check if the email is repeated.
                    if ($emailRepeated) {
                        $validEmail = (object) [
                            'willChange' => false,
                            'error' => "Email already in use."
                        ]; 
                    } else {
                        $validEmail = (object) [
                            'willChange' => true
                        ];
                    }
                }
            }
        } 

        return $validEmail;
    }

    /**
     * This function given a email and the user password, and after checking if both are valid, it will change it or return the error caught on the function checkValidEmail
     * @param string $token is the session token
     * @param string $newEmail is the new requested email
     * @param string $newPassword is the user's current password
     * @return object $returnUser will return the attribute 'error' with the error message, otherwise it will return 'success' and a success message
     */    
    public function changeEmail(Request $request)
    {
        $validEmail = (object) [
            'willChange' => true
        ];
        $returnUser = (object) [
            'error' => "User is not logged in."
        ];
        $userId = $this->getUserId($request->token);

        //Check if the user id is not, if not null we continue to check
        if ($userId != null) {
            $userFound = User::where('id', $userId)->first();
            if ($userFound  != null) {
                $validEmail = $this->checkValidEmail($request, $userFound);

                //Check if password is correct.
                if (Hash::check($request -> password, $userFound -> password)) {
                    //If after validating the email can be changed we change it, if not we return the error.
                    if ($validEmail -> willChange) {
                        $userFound -> email = $request -> newEmail;
                        $userFound -> save(); 
                        $returnUser = (object) [
                            'success' => "Email has been changed."
                        ];
                    } else {
                        $returnUser = (object) [
                            'error' => $validEmail -> error
                        ];
                    }
                } else {
                    $returnUser = (object) [
                        'error' => "Password is incorrect."
                    ];
                }
            }
        }
        
        return response() -> json($returnUser);
    }

    /**
     * This function given a new password and the password confirmation, will check if the password is valid 
     * @param string $token is the session token
     * @param string $newPassword is the new requested password
     * @return object $validPassword contains the boolean attribute 'willChange' that determines if the password is valid to be changed, otherwise it will contain a new attribute named 'error' with an error message explaining why the name can' be changed
     */       
    private function checkValidPassword($request, $userFound)
    {
        $validPassword = (object) [
            'willChange' => true
        ];
        $validPassword = (object) [
            'willChange' => false,
            'error' => "User is not logged in."
        ];
        $userId = $this->getUserId($request->token);

        //To start checking the user must be logged in.
        if ($userId != null) { 
            //We check if the currentPassword that the user has introduced is the same as the password in the database for that user.
            //if it's correct we continue
            if (Hash::check($request -> currentPassword, $userFound -> password)) {
                $validator =  Validator::make($request->all(), [
                    'newPassword' => [
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

                //If the validation fails we warn the user.
                if ($validator->fails()) {
                    $validPassword = (object) [
                        'willChange' => false,
                        'error' => "Validation errors."
                    ];
                    //If it doesn't fail we continue to change it.
                } else { 
                    if ((strcasecmp($request -> currentPassword, $request -> newPassword) == 0)) {
                        $validPassword = (object) [
                            'willChange' => false,
                            'error' => "Password has not been modified, no changes were made."
                        ];
                    } else {
                        $validPassword = (object) [
                            'willChange' => true
                        ];
                    }
                }
            } else {
                $validPassword = (object) [
                    'willChange' => false,
                    'error' => "Current password is incorrect."
                ];
            } 
        }

        return $validPassword;
    }    
    
    /**
     * This function given a password and the user current password, and after checking if both are valid, it will change it or return the error caught on the function checkValidPassword
     * @param string $token is the session token
     * @param string $newPassword is the new requested password
     * @param string $currentPassword is the user's current password
     * @param string $currentPassword_confirmation is the user's confirmation of the current password
     * @return object $returnUser will return the attribute 'error' with the error message, otherwise it will return 'success' and a success message
     */    
    public function changePassword(Request $request)
    {
        $validPassword = (object) [
            'willChange' => true
        ];
        $returnUser = (object) [
            'error' => "User is not logged in."
        ];
        $userId = $this->getUserId($request->token);

        //Check if the user id is not, if not null we continue to check
        if ($userId != null) {
            $userFound = User::where('id', $userId)->first();
            if ($userFound != null) {
                $validPassword = $this->checkValidPassword($request, $userFound);

                //If after validating the password can be changed we change it, if not we return the error.
                if ($validPassword -> willChange) {
                    $userFound -> password = Hash::make($request -> newPassword);
                    $userFound -> save(); 
                    $returnUser = (object) [
                        'success' => "Password has been changed."
                    ];
                } else {
                    $returnUser = (object) [
                        'error' => $validPassword -> error
                    ];
                }
            }
        } 
        return response() -> json($returnUser);
    }    
   
}