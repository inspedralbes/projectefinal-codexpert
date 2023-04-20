<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class UserController extends Controller
{
    private function checkSessionId(Request $request)
    {
        $idInSession = null;

        if ($request -> session()->get('userId') != null) {
            $idInSession = session()->get('userId') ;
        }

        return $idInSession;
    }     

    public function getAvatar(Request $request)
    {
        $userFound = (object) ['url' => null];
        $returnAvatar = (object) ['url' => null];
        $userId = $this->checkSessionId($request);

        //Check if the user id is null, if not not we get the user's avatar.
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
    
    public function setAvatar(Request $request)
    {
        $returnResponse = (object) [
            'changed' => false
        ];
        $userId = $this->checkSessionId($request);

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

    public function getUserData(Request $request)
    {
        $returnUser = (object) [
            'error' => "User is not logged in."
        ];
        $userId = $this->checkSessionId($request);

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

    private function checkValidName($request, $userFound)
    {
        $validName = (object) [
            'willChange' => false,
            'error' => "User is not logged in."
        ]; 
        $nameRepeated = false;
        $userId = $this->checkSessionId($request);

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
    
    public function changeUsername(Request $request)
    {
        $validName = (object) [
            'willChange' => true
        ];
        $returnUser = (object) [
            'error' => "User is not logged in."
        ];
        $userId = $this->checkSessionId($request);

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
    
    private function checkValidEmail($request, $userFound)
    {
        $validEmail = (object) [
            'willChange' => false,
            'error' => "User is not logged in."
        ]; 
        $emailRepeated = false;
        $userId = $this->checkSessionId($request);

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

    public function changeEmail(Request $request)
    {
        $validEmail = (object) [
            'willChange' => true
        ];
        $returnUser = (object) [
            'error' => "User is not logged in."
        ];
        $userId = $this->checkSessionId($request);

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

    private function checkValidPassword($request, $userFound)
    {
        $validPassword = (object) [
            'willChange' => true
        ];
        $validPassword = (object) [
            'willChange' => false,
            'error' => "User is not logged in."
        ];
        $userId = $this->checkSessionId($request);

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
    
    public function changePassword(Request $request)
    {
        $validPassword = (object) [
            'willChange' => true
        ];
        $returnUser = (object) [
            'error' => "User is not logged in."
        ];
        $userId = $this->checkSessionId($request);

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