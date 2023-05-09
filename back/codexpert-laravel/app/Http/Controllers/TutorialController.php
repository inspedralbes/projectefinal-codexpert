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
use App\Models\User_tutorial;
use App\Models\Tutorial_question;
use App\Models\Tutorial_test_input;
use App\Models\Tutorial_test_output;
use Laravel\Sanctum\PersonalAccessToken;

class TutorialController extends Controller
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
     * This function creates the relationship between the game and all the users from the lobby
     * @param string $token is the session token
     * @return array $allTutorials contains id and title from each level of the tutorial 
     */     
    public function getTutorials(Request $request)
    {   
        $allTutorials = [];

        //Check if the user is logged.
        $userId = $this->getUserId($request->token);
        $userExperience = $request->token;
        //If not logged we get all the tutorial questions.
        if ($userId == null) { 
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
                     
        } else {
            //Check if user has already started the tutorial
            $userTutorialQuestionsFound = User_tutorial::where("user_id", $userId) -> count();
            if ($userTutorialQuestionsFound == 0) { 
                //Check how many relationships need to be created
                $getTutorial = Tutorial_question::get();
                //Relate each question to the user.
                for ($i = 0; $i < count($getTutorial); $i++) {
                    $userTutorial = new User_tutorial;
                    $userTutorial -> tutorial_question = $getTutorial[$i] -> id;
                    $userTutorial -> user_id = $userId;
                    if ($i == 0) {
                        $userTutorial -> locked = false;                
                    } else {
                        $userTutorial -> locked = (strcmp($userExperience, "beginner") == 0) ? false : true;                   
                    }
                    $userTutorial -> save();
                }
            }

            $getUserTutorial = User_tutorial::where("user_id", $userId)->get();
            for ($i=0; $i < count($getUserTutorial); $i++) { 
                $getTutorial = Tutorial_question::where('id', $getUserTutorial[$i] -> tutorial_question) -> first();
                
                $tutorial = (object)[
                    'id' => $getTutorial -> id,
                    'title' => $getTutorial -> title,
                    'locked' => $getUserTutorial[$i] -> locked,
                    'passed' => $getUserTutorial[$i] -> passed,
                ];

                array_push($allTutorials, $tutorial);  
            }

        }

        return response() -> json($allTutorials);
    } 
    
    /**
     * This function creates the relationship between the game and all the users from the lobby
     * @param int $id is tutorial id
     * @param string $token is the session token
     * @return object $tutorial contains id, statement, hint, inputs and outputs from the tutorial question. 
     */       
    public function getTutorialFromId(Request $request)
    {
        $userId = $this->getUserId($request->token);
        $enter = true;
        $tutorial = (object)[];

        //Check if the user is logged in.
        //If logged in we check if the question is locked or not.
        if ($userId != null) {
            $getUserTutorial = User_tutorial::where("user_id", $userId)
            ->where("tutorial_question", $request -> id)
            ->first();
            if ($getUserTutorial -> locked) {
                $enter = false;
            }
        } 

        if ($enter) {
            $tutorialQuestion = Tutorial_question::where("id", $request -> id) -> first();
            $inputs = [];
            $output = '';
            $getInputs = Tutorial_test_input::where('question_id', $tutorialQuestion -> id)->get();
            $getOutputs = Tutorial_test_output::where('question_id', $tutorialQuestion -> id)->get();

            for ($j = 0; $j < count($getInputs); $j++) { 
                $inputs[$j] = unserialize($getInputs[$j] -> input);
            }

            $output = unserialize($getOutputs[0] -> output);

            $tutorial = (object)[
                'id' => $tutorialQuestion -> id,
                'statement' => $tutorialQuestion -> statement,
                'hint' => $tutorialQuestion -> hint,
                'inputs' => $inputs,
                'output' => $output
            ];
        }

        return response() -> json($tutorial);
    }  

    /**
     * This function is triggered each time a user responds to a question from the game, it will check whether the user answers the question correctly or not
     * @param int $questionId is the id of the question that has been answered
     * @param int $idUser is the id from the user that is currently answering the question
     * @return boolean $finishedTutorial determines if the user was on the last question therefore finished the tutorial
     */     
    private function updateTutorial($userId, $questionId)
    {
        $finishedTutorial = false;

        //Get the tutorial-user relationship
        $getUserTutorial = User_tutorial::where("user_id", $userId)
        ->where("tutorial_question", $questionId)
        ->first();

        //Update to passed the current tutorial question
        $getUserTutorial -> passed = true;
        $getUserTutorial -> save();
        
        //Update to locked false the following question from the tutorial
        $getAllTutorials = Tutorial_question::get();
        $tutorialFound = false;
        $i = 0; 
        while ( (!$tutorialFound) && ($i < count($getAllTutorials)) ) {
            if ( ($getAllTutorials[$i] -> id) == ($questionId) ) {
                $tutorialFound = true;
                $indexFromNextTutorial = $i++;
            } else {
                $i++;
            }
        }

        if ($indexFromNextTutorial < count($getAllTutorials)) {
            $nextTutorial = $getAllTutorials[$indexFromNextTutorial];
            $getUserTutorial = User_tutorial::where("user_id", $userId)
            ->where("tutorial_question", $nextTutorial -> id)
            ->first();
            $getUserTutorial -> locked = false;
            $getUserTutorial -> save();
        } else {
            $finishedTutorial = true;
        }

        return $finishedTutorial;
    }

    /**
     * This function is triggered each time a user responds to a question from the game, it will check whether the user answers the question correctly or not
     * @param int $idUser is the id from the user that is currently answering the question
     */     
    private function updateUser($userId)
    {
        $user = User::where("user_id", $userId);
        $user -> tutorialPassed = true;
        $user -> save();
    }

    /**
     * This function is triggered each time a user responds to a question from the game, it will check whether the user answers the question correctly or not
     * @param bool $evalPassed determines whether the user has passed all the internal tests for the question correctly or not
     * @param int $idQuestion is the id of the question that has been answered
     * @param array $evalRes contains all the results from the evals (done in front) for each input test
     * @param int $idUser is the id from the user that is currently answering the question
     * @return object $returnObject contains the boolean 'correct' which determines if the question has indeed been answered correctly, 'testsPassed' is the number of tests that have been passed, if 'correct' is true it will mean that all tests have been passed, 'user_game' contains all the information in the relationship between game and user, therefore here we can see information like 'hearts_remaining' (the amount of hearts remaining) and 'question_at' (which question is the user at now) and 'game' which contains the id from the winner and the game id.
     */     
    public function checkAnswer(Request $request)
    {
        $tutorialFinished = false;
        
        $returnObject = (object) [
            'correct'=> true,
            'testsPassed' => 0,
            'finishedTutorial' => false,
        ];
        
        //If any of the tests doesn't pass we return that it's not a correct answer.
        if ($request -> evalPassed) {
            $outputs = [];
            $getOutputs = Tutorial_test_output::where('question_id', $request -> idQuestion)->get();
            for ($i = 0; $i < count($getOutputs); $i++) { 
                $outputs[$i] = unserialize($getOutputs[$i] -> output);
            }

            foreach($outputs as $key => $val) {
                if ($val == $request -> evalRes[$key]) {
                    $returnObject -> testsPassed++;
                } else {
                    $returnObject -> correct = false;
                }
            }

        } else {
            $returnObject -> correct = false;
        }

        //If the user is correct and logged in we update their tutorial status and check if he has finished the tutorial
        $userId = $this->getUserId($request->token);

        if (($userId != null) && ($returnObject -> correct)) {
            $tutorialFinished = $this->updateTutorial($userId, $request -> idQuestion);
        }
        
        //If the tutorial has been finished we need to update the user
        if ($tutorialFinished) {
            $this->updateUser($userId);
            $returnObject -> finishedTutorial = true;
        }
       
        return response() -> json($returnObject);
    }       
}