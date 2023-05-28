<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Laravel\Sanctum\PersonalAccessToken;
use App\Models\Friend;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

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
     * This function given the current user id, and the other user that will be added, check if the yalready have an ongoing relationship existing in the database
     * @param int $currentUserId is the id from the user that is logged in
     * @param int $otherUserId is the id from the user that will be added
     * @return int $notificationAlreadyReceived is the amount of relationships between the two users
     */     
    private function validateIfAdded($currentUserId, $otherUserId)
    {
        $notificationAlreadyReceived = -1;
        $notificationAlreadySent = -1;
        $alreadyAdded = -1;

        //First of all we check if the sender has already sent the request to this user before and it's still pending
        $notificationAlreadySent = Friend::where('sender_id', $currentUserId) 
        -> where('receiver_id', $otherUserId)
        -> where('status', 'pending')
        -> count();

        //Check if the users are already friends with the logged in user as the sender or reciever
        $alreadyAdded = DB::table('friends')
            ->where('sender_id', $currentUserId) 
            ->where('receiver_id', $otherUserId)
            ->where('status', 'accepted')
            ->orWhere( function ($query) use ($otherUserId, $currentUserId) {
                $query->where('sender_id', $otherUserId)
                      ->where('receiver_id', $currentUserId)
                      ->where('status', 'accepted');
            }) -> count();
            
        if ($notificationAlreadySent == 0 && $alreadyAdded == 0) {
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
            if ($currentUserId != $request -> otherUserId) {
                $notificationAlreadyReceived = $this -> validateIfAdded($currentUserId, $request -> otherUserId);
                if ($notificationAlreadyReceived > 0) {
                    $friendshipAccepted = $this -> acceptFriend($request);
                    $returnObject -> friendName = $friendshipAccepted -> friendAdded;
                } elseif ($notificationAlreadyReceived == 0) {
                    //It will mean we need to create the relationship since it doesn't exist yet
                    $createFriendship = new Friend;
                    $createFriendship -> sender_id = $currentUserId;
                    $createFriendship -> receiver_id = $request -> otherUserId;
                    $createFriendship -> save();

                    $returnObject -> notificationSent = true;
                }
            }
            
        } 
        
        return response() -> json($returnObject);
    }

    /**
     * This function given the token of the current logged in user and the id from the user that we will accept its request, modifies the row in the database to accept the request
     * @param string $token is the session token
     * @param int $otherUserId is the id from the user that will be added
     * @return object $returnObject contains the name of the new friend
     */        
    public function acceptFriend(Request $request)
    {
        $returnObject = (object) [
            'friendAccepted' => ''
        ];

        $currentUserId = $this->getUserId($request->token);

        if ($currentUserId != null) {
            //We accept the friend request, therefore remove the relationship in the database
            $getFriendship = Friend::where('sender_id', $request -> otherUserId) 
            -> where('receiver_id', $currentUserId)
            -> first();
            
            $getFriendship -> status = "accepted";
            $getFriendship -> save();

        }

        $userAccepted = User::where('id', $request -> otherUserId) -> first();
        $returnObject -> friendAccepted = $userAccepted -> name;

        return response() -> json($returnObject);
    }    

    /**
     * This function given the token of the current logged in user and the id from the user that we will decline its request, modifies the row in the database to accept the request
     * @param string $token is the session token
     * @param int $otherUserId is the id from the user that will be added
     * @return object $returnObject contains the name of the person that has been rejected
     */        
    public function declineFriend(Request $request)
    {
        $returnObject = (object) [
            'friendDeclined' => ''
        ];

        $currentUserId = $this->getUserId($request->token);

        if ($currentUserId != null) {
            //We decline the friend request, therefore remove the relationship in the database
            $getFriendship = Friend::where('sender_id', $request -> otherUserId) 
            -> where('receiver_id', $currentUserId)
            -> where('status', 'pending')
            -> delete();
        }

        $userRemoved = User::where('id', $request -> otherUserId) -> first();
        $returnObject -> friendDeclined = $userRemoved -> name;

        return response() -> json($returnObject);
    }           

    /**
     * This function given the token of the current logged in user and the id from the user that we will decline its request, modifies the row in the database to accept the request
     * @param string $token is the session token
     * @param int $otherUserId is the id from the user that will be added
     * @return object $returnObject contains if the petition has been sent successfully sent to the other user
     */        
    public function removeFriend(Request $request)
    {
        $returnObject = (object) [
            'friendRemoved' => ''
        ];

        $currentUserId = $this->getUserId($request->token);

        if ($currentUserId != null) {
            //We decline the friend request, therefore remove the relationship in the database
            DB::table('friends')
            ->where('sender_id', $currentUserId) 
            ->where('receiver_id', $request -> otherUserId)
            ->where('status', 'accepted')
            ->orWhere( function ($query) use ($request, $currentUserId) {
                $query->where('sender_id', $request -> otherUserId)
                    ->where('receiver_id', $currentUserId)
                    ->where('status', 'accepted');
            }) -> delete();
        }

        $userRemoved = User::where('id', $request -> otherUserId) -> first();
        $returnObject -> friendRemoved = $userRemoved -> name;

        return response() -> json($returnObject);
    }    


    /**
     * This function given the token from the logged in user returns the list of the friends where the status is accepted
     * @param string $token is the session token
     * @return array $friendlist is the list of friends where the status is accepted
     */        
    public function getFriendlist(Request $request)
    {
        $friendlist = [];
        $currentUserId = $this->getUserId($request->token);

        if ($currentUserId != null) {
        $friendlist = DB::table('friends')
            ->where('sender_id', $currentUserId) 
            ->where('status', 'accepted')
            ->orWhere( function ($query) use ($currentUserId) {
                $query->where('receiver_id', $currentUserId)
                      ->where('status', 'accepted');
            }) -> get();
        }

        return response() -> json($friendlist);
    }    
    
    /**
     * This function given the token from the logged in user returns the pending friend requests
     * @param string $token is the session token
     * @return object $returnFriendRequests is the list of friend requests
     */        
    public function getPendingRequests(Request $request)
    {
        $friendlist = [];
        $friendNotification = (object)[];
        $allFriendNotifications = [];
        $notificationUnread = false;
        $otherUserId = -1;
        $currentUserId = $this->getUserId($request->token);

        if ($currentUserId != null) {
        $friendlist = DB::table('friends')
            ->where('receiver_id', $currentUserId) 
            ->where('status', 'pending')
            -> get();
        }

        for ($i=0; $i < count($friendlist); $i++) { 
            if ( ($friendlist[$i] -> sender_id) != $currentUserId) {
                $otherUserId = $friendlist[$i] -> sender_id;
            } else {
                $otherUserId = $friendlist[$i] -> receiver_id;
            }
            $otherUserInfo = User::where("id", $otherUserId) -> first();
            $friendNotification = (object) [
                "userId" => $otherUserInfo -> id,
                "name" => $otherUserInfo -> name,
                "avatar" => $otherUserInfo -> avatar,
                "status" => $friendlist[$i] -> status,
                "showNotification" => $friendlist[$i] -> showNotification,
            ];
            array_push($allFriendNotifications, $friendNotification);
        }

        $unreadCount = DB::table('friends')
            ->where('receiver_id', $currentUserId) 
            ->where('status', 'pending')
            ->where('showNotification', true)
            -> count();

        if ($unreadCount > 0) {
            $notificationUnread = true;
        }

        $returnFriendRequests = (object) [
            'unread' => $notificationUnread,
            'list' => $allFriendNotifications
        ];

        return response() -> json($returnFriendRequests);
    }         
    
    /**
     * This function given the token from the logged in user returns the pending friend requests
     * @param string $token is the session token
     * @return array $friendlist is the list of friend requests
     */        
    public function markNotificationsAsRead(Request $request)
    {
        $friendlist = [];
        $currentUserId = $this->getUserId($request->token);

        if ($currentUserId != null) {
        $friendlist = DB::table('friends')
            ->where('sender_id', $currentUserId) 
            ->where('status', 'pending')
            ->orWhere( function ($query) use ($currentUserId) {
                $query->where('receiver_id', $currentUserId)
                      ->where('status', 'pending');
            }) -> get();
        }

        for ($i=0; $i < count($friendlist); $i++) { 
            $friendship = Friend::where('id',$friendlist[$i] -> id) -> first();
            $friendship -> showNotification = false;
            $friendship -> save();
        }
        
        return response() -> json($currentUserId);
    }    

    /**
     * This function will return the ids from the users that are added or with a pending requsts, therefore, the users we cannot add
     * @param string $token is the session token
     * @return array $friendsIds is the list of ids that the user cannot add
     */        
    public function getNotAddFriend(Request $request)
    {
        $currentUserId = $this->getUserId($request->token);
        $friendsIds = [];
        $friendlist = [];

        if ($currentUserId != null) {
            $friendlist = DB::table('friends')
                ->where('sender_id', $currentUserId) 
                ->where('status', 'accepted')
                ->orWhere( function ($query) use ($currentUserId) {
                    $query->where('sender_id', $currentUserId)
                        ->where('status', 'pending');
                }) -> get();

            for ($i=0; $i < count($friendlist); $i++) { 
                array_push($friendsIds, $friendlist[$i] -> receiver_id);
            }

            $friendlist = DB::table('friends')
                ->where('receiver_id', $currentUserId) 
                ->where('status', 'accepted')
                ->get();

            for ($i=0; $i < count($friendlist); $i++) { 
                array_push($friendsIds, $friendlist[$i] -> sender_id);
            }
        }
        
        return response() -> json($friendsIds);
    }  
}