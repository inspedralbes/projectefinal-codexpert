<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use App\Models\User;

class UserController extends Controller
{
    public function getAvatar(Request $request)
    {
        if ($request -> session()->get('userId') != null) {
            $userFound = User::where('id', $request->session()->get('userId'))->first();
            $returnAvatar = (object) ['url' => $userFound -> avatar];
        } else {
            $returnAvatar = (object) ['url' => null];
        }
        
        return response() -> json($returnAvatar);
    }
    
    public function setAvatar(Request $request)
    {
        if ($request -> session()->get('userId') != null) {
            $userFound = User::where('id', $request->session()->get('userId'))->first();
            $userFound -> avatar = $request -> newAvatar;
            $userFound -> save();
            $returnResponse = (object) ['changed' => true];
        } else {
            $returnResponse = (object) ['changed' => null];
        }  
        return response() -> json($returnResponse);
    }

    public function getRanking(Request $request)
    {
        $ranking = User::orderBy('elo', 'DESC')->get();

        return response() -> json($ranking);
    }    
    
    public function getUserData(Request $request)
    {
        if ($request -> session()->get('userId') != null) {
            $userFound = User::where('id', $request->session()->get('userId'))->first();
            $returnUser = (object) ['name' => $userFound -> name,
                                    'email' => $userFound -> email,
                                    'avatar' => $userFound -> avatar,
                                    ];
        } else {
            $returnUser = (object) ['error' => "User is not logged in."];
        }
        
        return response() -> json($returnUser);
    }

    public function checkValidName($request, $userFound)
    {
        $nameRepeated = false;
        $validName = (object) ['willChange' => true];
        $validName = (object) ['willChange' => false,
                               'error' => "Name already in use."];      
                              
                              
        //Check if user has changed the name                      
        if ($request -> session()->get('userId') != null) {
            if ($userFound -> name == $request -> newName) {
                $validName = (object) ['changed' => false, 'error' => "Name has not been modified, no changes were made."];  
            } else {
                //If the name has been modified, we check that is valid.
                if (($request -> newName < 3) || ($request -> newName > 20)) {
                    $validName = (object) ['willChange' => false, 'error' => "Name must have a minimum amount of 3 characters and 20 max."];
                } else {
                    //If the name is valid we check if it's not repeated.
                    $getAllNames = User::get('name');
                    for ($i = 0; $i < count($getAllNames); $i++) { 
                        if ($request -> newName == $getAllNames[$i]) {
                            $nameRepeated = true;
                        }
                    }
                    if ($nameRepeated) {
                        $validName = (object) ['willChange' => false,
                        'error' => "Name already in use."]; 
                    } else {
                        $validName = (object) ['willChange' => true];
                    }
                }
            }
            
        } 
        return $validName;
    }
    
    public function setUsername(Request $request)
    {
        $validName = (object) ['willChange' => true];
        if ($request -> session()->get('userId') != null) {
            $userFound = User::where('id', $request->session()->get('userId'))->first();
            $validName = $this->checkValidName($request, $userFound);
            if ($validName -> willChange) {
                $userFound -> name = $request -> newName;
                $userFound -> save(); 
                $returnUser = (object) ['success' => "Name has been changed."];
            } else {
                $returnUser = (object) ['error' => $validName -> error];
            }
        } else {
            $returnUser = (object) ['error' => "User is not logged in."];
        }
        
        return response() -> json($returnUser);
    }
}