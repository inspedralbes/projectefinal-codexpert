<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use App\Models\User;

class UserController extends Controller
{
    public function getAvatar(Request $request)
    {
        if (Session::get('userId') != null) {
            $userFound = User::find('userId')->get();
            $returnAvatar = $userFound -> avatar;
        } else {
            $returnAvatar = 'null';
        }
        
        return json_encode($returnAvatar);
    }
    
    public function setAvatar(Request $request)
    {
        Session::get('userId');

        $userFound = User::find('userId')->get();
        $userFound -> avatar = $request -> newAvatar;
        $userFound -> save();
        
        return json_encode('Avatar saved.');
    }
}
