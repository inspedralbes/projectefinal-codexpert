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
     * @return array $allTutorials contains id and title from each level of the tutorial 
     */     
    public function getTutorials()
    {   
        $allTutorials = [];

        //Get all the tutorial questions
        $getTutorial = Tutorial_question::get();
        
        //Get only id and title from each question
        for ($i=0; $i < count($getTutorial); $i++) { 
            $tutorial = (object)[
                'id' => $getTutorial[$i] -> id,
                'title' => $getTutorial[$i] -> title
            ];
        
            array_push($allTutorials, $tutorial);
        }

        return response() -> json($allTutorials);
    } 
    
    public function getTutorialFromId(Request $request)
    {
        $tutorialQuestion = Tutorial_question::where("id", $request -> id) -> first();
        $inputs = [];
        $outputs = [];
        $getInputs = Tutorial_test_input::where('question_id', $tutorialQuestion -> id)->get();
        $getOutputs = Tutorial_test_output::where('question_id', $tutorialQuestion -> id)->get();

        for ($j = 0; $j < count($getInputs); $j++) { 
            $inputs[$j] = unserialize($getInputs[$j] -> input);
            $outputs[$j] = unserialize($getOutputs[$j] -> output);
        }

        $tutorial = (object)[
            'id' => $tutorialQuestion -> id,
            'statement' => $tutorialQuestion -> statement,
            'hint' => $tutorialQuestion -> hint,
            'inputs' => $inputs,
            'outputs' => $outputs
        ];

        return response() -> json($tutorial);
    }  
}