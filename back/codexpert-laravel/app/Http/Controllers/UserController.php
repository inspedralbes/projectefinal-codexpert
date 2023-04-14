<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
class UserController extends Controller
{
    public function getAvatar(Request $request)
    {
        //Check if the user id is null, if not not we get the user's avatar.
        if ($request -> session()->get('userId') != null) {
            $userFound = User::where('id', $request->session()->get('userId'))->first();
            $returnAvatar = (object) [
                'url' => $userFound -> avatar
            ];
        } else {
            $returnAvatar = (object) [
                'url' => null
            ];
        }
        
        return response() -> json($returnAvatar);
    }
    
    public function setAvatar(Request $request)
    {
        //Check if the user is id null, if not we change the avatar.
        if ($request -> session()->get('userId') != null) {
            $userFound = User::where('id', $request->session()->get('userId'))->first();
            $userFound -> avatar = $request -> newAvatar;
            $userFound -> save();
            $returnResponse = (object) [
                'changed' => true
            ];
        } else {
            $returnResponse = (object) [
                'changed' => null
            ];
        }  

        return response() -> json($returnResponse);
    }

    public function getRanking(Request $request)
    {
        //Return the list of users ordered by their elo.
        $ranking = User::orderBy('elo', 'DESC')->get();

        return response() -> json($ranking);
    }    
    
    public function getUserData(Request $request)
    {
        //If the user id is not null we return the information from the user (name, email, avatar)
        if ($request -> session()->get('userId') != null) {
            $userFound = User::where('id', $request->session()->get('userId'))->first();
            $returnUser = (object) [
                'name' => $userFound -> name,
                'email' => $userFound -> email,
                'avatar' => $userFound -> avatar,
            ];
        } else {
            $returnUser = (object) [
                'error' => "User is not logged in."
            ];
        }
        
        return response() -> json($returnUser);
    }

    public function checkValidName($request, $userFound)
    {
        $nameRepeated = false;
        $validName = (object) [
            'willChange' => true
        ];
       
        //Check if user has changed the name                      
        if ($request -> session()->get('userId') != null) {
            if ($userFound -> name == $request -> newName) {
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
                        if ($request -> newName == $getAllNames[$i]) {
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
        } else {
            $validName = (object) [
                'willChange' => false,
                'error' => "User is not logged in."
            ]; 
        }

        return $validName;
    }
    
    public function changeUsername(Request $request)
    {
        $validName = (object) [
            'willChange' => true
        ];

        //Check if the user id is not, if not null we continue to check
        if ($request -> session()->get('userId') != null) {
            $userFound = User::where('id', $request->session()->get('userId'))->first();
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
        } else {
            $returnUser = (object) [
                'error' => "User is not logged in."
            ];
        }
        
        return response() -> json($returnUser);
    }
    
    public function checkValidEmail($request, $userFound)
    {
        $emailRepeated = false;
        $validEmail = (object) [
            'willChange' => true
        ];
       
        //Check if user has changed the email                      
        if ($request -> session()->get('userId') != null) {
            if ($userFound -> email == $request -> newEmail) {
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
                        if ($request -> newEmail == $getAllEmails[$i]) {
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
        } else {
            $validName = (object) [
                'willChange' => false,
                'error' => "User is not logged in."
            ]; 
        }

        return $validEmail;
    }

    public function changeEmail(Request $request)
    {
        $validEmail = (object) [
            'willChange' => true
        ];

        //Check if the user id is not, if not null we continue to check
        if ($request -> session()->get('userId') != null) {
            $userFound = User::where('id', $request->session()->get('userId'))->first();
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
        } else {
            $returnUser = (object) [
                'error' => "User is not logged in."
            ];
        }
        
        return response() -> json($returnUser);
    }

    public function checkValidPassword($request, $userFound)
    {
        $validPassword = (object) [
            'willChange' => true
        ];
       
        //To start checking the user must be logged in.
        if ($request -> session()->get('userId') != null) { 
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
        } else {
            $validPassword = (object) [
                'willChange' => false,
                'error' => "User is not logged in."
            ]; 
        }

        return $validPassword;
    }    
    
    public function changePassword(Request $request)
    {
        $validPassword = (object) [
            'willChange' => true
        ];

        //Check if the user id is not, if not null we continue to check
        if ($request -> session()->get('userId') != null) {
            $userFound = User::where('id', $request->session()->get('userId'))->first();
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
        } else {
            $returnUser = (object) [
                'error' => "User is not logged in."
            ];
        }
        
        return response() -> json($returnUser);
    }    

}