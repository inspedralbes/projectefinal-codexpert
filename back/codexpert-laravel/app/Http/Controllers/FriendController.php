<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Laravel\Sanctum\PersonalAccessToken;
use App\Models\Friend;

class FriendController extends Controller
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
     * This function checks with the token recieved if the token is valid on the database, if it is it will return the user id
     * @param int $currentUserId is the id from the user that is logged in
     * @param int $otherUserId is the id from the user that will be added
     * @return int $userId is the user id found linked to the token in the database
     */     
    private function validateIfAdded($currentUserId, $otherUserId)
    {
        $notificationAlreadyReceived = -1;
        $notificationAlreadySent = -1;

        //First of all we check if the sender has already sent the request to this user before and it's still pending
        $notificationAlreadySent = Friend::where('sender_id', $currentUserId) 
        -> where('receiver_id', $otherUserId)
        -> where('status', 'pending')
        -> count();

        if ($notificationAlreadySent == 0) {
            //If not found this relationship, we check if the sender has already recieved a request from this user and if not accepted it will be accepted now
            $notificationAlreadyReceived = Friend::where('sender_id', $otherUserId) 
            -> where('receiver_id', $currentUserId)
            -> where('status', 'pending')
            -> count();
        }

        return $notificationAlreadyReceived;
    }    

    /**
     * This function given the token of the current logged in user and the id from the user that wants to be added, will check if user has already sent a petition ,if not, it will create the relationship and notify the other user.
     * @param string $token is the session token
     * @param int $otherUserId is the id from the user that wants to be added
     * @return object $returnObject contains if the petition has been sent successfully sent to the other user
     */      
    public function addFriend(Request $request)
    {
        $returnObject = (object) [
            'notificationSent' => false
        ];

        $currentUserId = $this->getUserId($request->token);

        //Check if the user id is null, if not, we continue
        if ($currentUserId != null) {
            $notificationAlreadyReceived = $this -> validateIfAdded($currentUserId, $request -> otherUserId);
            if ($notificationAlreadyReceived > 0) {
                $friendshipAccepted = $this -> acceptFriend($request);
                $returnObject = $friendshipAccepted;
            } elseif ($notificationAlreadyReceived == 0) {
                //It will mean we need to create the relationship since it doesn't exist yet
                $createFriendship = new Friend;
                $createFriendship -> sender_id = $currentUserId;
                $createFriendship -> receiver_id = $request -> otherUserId;
                $createFriendship -> save();

                $returnObject -> notificationSent = true;
            }
            
        } 
        
        return response() -> json($returnObject);
    }

    /**
     * This function given the token of the current logged in user and the id from the user that wants to be added, will check if user has already sent a petition ,if not, it will create the relationship and notify the other user.
     * @param string $token is the session token
     * @param int $otherUserId is the id from the user that wants to be added
     * @return object $returnObject contains if the petition has been sent successfully sent to the other user
     */        
    public function acceptFriend(Request $request)
    {
        $returnObject = (object) [
            'friendAdded' => ''
        ];

        $currentUserId = $this->getUserId($request->token);

        if ($currentUserId != null) {
            //We accept the friend request
            $getFriendship = Friend::where('sender_id', $request -> otherUserId) 
            -> where('receiver_id', $currentUserId)
            -> first();

            $getFriendship -> status = 'accepted';
            $getFriendship -> save();
        }

        $userAdded = User::where('id', $request -> otherUserId) -> first();
        $returnObject -> friendAdded = $userAdded -> name;

        return response() -> json($returnObject);
    }    

}