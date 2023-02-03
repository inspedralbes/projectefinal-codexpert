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
}
