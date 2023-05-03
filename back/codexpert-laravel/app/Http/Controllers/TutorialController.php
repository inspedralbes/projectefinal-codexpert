<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Game;
use App\Models\Question;
use App\Models\Test_input;
use App\Models\Test_output;
use App\Models\Game_question;
use App\Models\User_game;
use App\Models\User;
use App\Models\Tutorial_question;
use App\Models\Tutorial_test_input;
use App\Models\Tutorial_test_output;

class TutorialController extends Controller
{
    /**
     * This function creates the relationship between the game and all the users from the lobby
     * @param bool $expert determines if the user chooses if he is an expert or not, if exepert it will only show the last question
     * @return array $tutorial contains an object representing each tutorial question, if expert it will return only the last tutorial
     */     
    public function getTutorials(Request $request)
    {
        $tutorial = [];

        //If the user is an expert we return the last tutorial found in the database. If not we return all tutorials without the questions
        if ($request -> expert) {
            $tutorial = (object)[];
            $tutorial = Tutorial_question::orderBy('id', 'DESC')->first();
        } else {
            $tutorial = Tutorial_question::get();
        }

        return response() -> json($tutorial);


    }  
}