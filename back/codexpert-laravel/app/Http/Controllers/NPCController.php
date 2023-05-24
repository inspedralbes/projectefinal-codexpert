<?php

namespace App\Http\Controllers;

use App\Models\Npc;
use App\Models\User_npc;
use App\Models\Dialogue;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;

class NPCController extends Controller
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
     * This function will return all the information from the npcs and the user relationship with it.
     * @param string $token is the session token
     * @return array $allNPCS is the array of all NPCS containing their information, and if logged in, if the user has already met the npc
     */     
    public function getAllNPCS(Request $request)
    {
        $npcList = [];
        $currentNPC = (object)[
            'id' => -1,
            'name' => '',
            'introduction' => '',
            'haveMet' => false,
            'dialogueOptions' => [],
        ];
        $allDialogues = [];
        $allDialogueOptions = [];

        //Get the id from the logged in user.
        $userId = $this -> getUserId($request -> token);

        //Get the list of all NPCs 
        $getNPCS = NPC::all();
        //For each NPC get id, name, introductionSentence, if they have already met and the dialogue options.
        for ($i=0; $i < count($getNPCS); $i++) { 
            $haveMet = false;
            if ($userId != null) {
                $userNPC = User_npc::where('npc_id', $getNPCS[$i] -> id) 
                -> where('user_id', $userId)
                -> first();
                if ($userNPC != null) {
                    $haveMet = $userNPC -> haveMet;
                }
            }

            $getNpcDialogues = Dialogue::where('npc_id', $getNPCS[$i] -> id) -> get();
            if ($getNpcDialogues != null) {
                for ($j=0; $j < count($getNpcDialogues); $j++) { 
                    $currentSentence = $getNpcDialogues[$j] -> sentence;
                    array_push($allDialogues, $currentSentence);
                }
            }

            $currentNPC = (object)[
                'id' => $getNPCS[$i] -> id,
                'name' => $getNPCS[$i] -> name,
                'introduction' => $getNPCS[$i] -> introduction,
                'haveMet' => $haveMet,
                'dialogues' => $allDialogues
            ];
            array_push($npcList, $currentNPC);
        }

        return response() -> json($npcList);
    } 

    /**
     * This function will create a relationship between all users if it doesn't exist 
     * @param int $npcId is the id from the npc
     * @param string $token is the session token
     */   
    public function setSpokenToNPC(Request $request)
    {
        $userNPC = (object)[];
        $userId = $this -> getUserId($request -> token);

        if ($userId != null) {
            //Check if the user has an existing relationship with the npc
            $userNPC = User_npc::where('npc_id', $request -> npcId) 
            -> where('user_id', $userId)
            -> first();
            if ($userNPC == null) {
                $userNPC = new User_npc;
                $userNPC -> npc_id = $request -> npcId;
                $userNPC -> user_id = $userId;
            }
            
            $userNPC -> haveMet = true;
            $userNPC -> save();
        }
        
    }     
}
