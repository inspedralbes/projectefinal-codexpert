<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
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
     * This function sets the expertise in javascript of the user, if not logged in it doesn't set anything.
     * @param string $userExperience to set if the user is a beginner or an expert     
     * @param string $token is the session token
     * @return object $returnChanges returns if the user is logged in and if it has saved their expertise. 
     */       
    public function setExpertise(Request $request)
    {
        $returnChanges = (object) [
            'changed' => false,
            'loggedIn' => false,
        ];
        //Check if the user is logged.
        $userId = $this->getUserId($request -> token);

        if ($userId != null) {
            //Check if begginer or expert
            if ((strcmp($request -> userExperience, "beginner") == 0) || (strcmp($request -> userExperience, "expert") == 0) ) {
                $user = User::where('id', $userId) -> first();
                $user -> expertiseJS = $request -> userExperience;
                $user -> expertiseChosen = true;
                $user -> save();
                $returnChanges = (object) [
                    'changed' => true,
                    'loggedIn' => true,
                ];
            } else {
                $returnChanges = (object) [
                    'changed' => false,
                    'loggedIn' => true,
                ];
            }

        }

        return response() -> json($returnChanges);
 
    }  

    /**
     * This function creates the tutorial relationship between the tutorial questions and the logged in user.
     * @param string $userExperience to set if the user is a beginner or an expert     
     * @param int $userId is the id from the logged in user
     * @return object $returnChanges returns if the user is logged in and if it has saved their expertise. 
     */      
    private function createTutorial($userId, $userExperience)
    {
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
                //If the user has manually changed the code to ask for another experience that's not expert or beginner we will set it to beginner
                if ((strcmp($userExperience, "beginner") == 0) || (strcmp($userExperience, "expert") == 0) ) {
                    $userTutorial -> locked = (strcmp($userExperience, "beginner") == 0) ? true : false;    
                } else {
                    $userTutorial -> locked = true;
                }          
            }
            $userTutorial -> save();
        }
 
    }  

    /**
     * This function returns  the tutorials from the DB if the user is not logged in (therefore only id and title) or will return id, title, locked, passed from each tutorial if the user is logged in. If it's the first time the user canPlays the tutorial it will call the function createTutorial() to create it
     * @param string $token is the session token
     * @return array $allTutorials contains id and title from each level of the tutorial and if logged if the user has it locked or if has passed the tutorial.
     */     
    public function getTutorials(Request $request)
    {   
        $allTutorials = [];

        //Check if the user is logged.
        $userId = $this->getUserId($request->token);
        $userExperience = $request->userExperience;

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
            //Check if user has already started the tutorial, if not we create it.
            $userTutorialQuestionsFound = User_tutorial::where("user_id", $userId) -> count();
            if ($userTutorialQuestionsFound == 0) { 
                $this->createTutorial($userId, $userExperience);
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
     * This function returns all the information needed to play the tutorial question given an id, it will check if the user can play it (question not locked)
     * @param int $id is tutorial id
     * @param string $token is the session token
     * @return object $tutorial contains id, statement, hint, inputs and outputs from the tutorial question. If locked the object is empty.
     */       
    public function getTutorialFromId(Request $request)
    {
        $userId = $this->getUserId($request->token);
        $canPlay = true;
        $tutorial = (object)[];

        //Check if the user is logged in.
        //If logged in we check if the question is locked or not.
        if ($userId != null) {
            $getUserTutorial = User_tutorial::where("user_id", $userId)
            ->where("tutorial_question", $request -> id)
            ->first();
            if ($getUserTutorial -> locked) {
                $canPlay = false;
            }
        } 

        if ($canPlay) {
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
                $i++;
                $indexFromNextTutorial = $i;
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
     * This function is triggered once a logged in user has answered correctly to the tutorial
     * @param int $idUser is the id from the user that is currently answering the question
     */     
    private function updateUser($userId)
    {
        $user = User::where("id", $userId) -> first();
        $user -> tutorialPassed = true;
        $user -> save();
    }

    /**
     * This function once the user clicks submit, it will check if he has answered the question correctly or not. If logged in and answered correctly it will update the current tutorial to passed and the following one to unlocked. If the user is playing the last tutorial and answered correctly it will right it will call a function to set the user to tutorialPassed true
     * @param bool $evalPassed determines whether the user has passed all the internal tests for the question correctly or not
     * @param int $idQuestion is the id of the tutorial that has been answered
     * @param array $evalRes contains all the results from the evals (done in front) for each input test
     * @param string $token is the session token
     * @return object $returnObject correct that shows if the tutorial has been answered correctly, testsPassed show how many of the tests from the backend has it passed and finishedTutorial if the user has answered the last question correctly
     */     
    public function checkAnswer(Request $request)
    {
        $tutorialFinished = false;
        
        $returnObject = (object) [
            'correct'=> true,
            'testsPassed' => 0,
            'numberOfTests' => 0,
            'finishedTutorial' => false,
        ];
        $results = [];
        
        $results = json_decode($request -> evalRes);

        $evalPassed = json_decode($request -> evalPassed);

        //If any of the tests doesn't pass we return that it's not a correct answer.
        if ($evalPassed) {
            $outputs = [];
            $getOutputs = Tutorial_test_output::where('question_id', $request -> idQuestion)->get();
            for ($i = 0; $i < count($getOutputs); $i++) { 
                $outputs[$i] = unserialize($getOutputs[$i] -> output);
            }

            $returnObject -> numberOfTests = count($outputs);
            
            for ($i=0; $i < count($outputs); $i++) { 
                if ($outputs[$i] == $results[$i]) {
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

    /**
     * This function will relate a user that has logged in/registered to their tutorial data, this will be triggered if the user has completed some questions of the tutorial or the whole tutorial
     * @param string $token is the session token
     * @param array $tutorialsAnswered is an array of tutorial ids, showing which of the tutorials the user has answered correctly.
     * @param bool $tutorialPassed is a boolean that shows if the user has passed the tutorial
     * @param string $userExperience to set if the user is a beginner or an expert  
     * @return object $returnObject contains the boolean valid that shows if everything was ok to relate the user to the tutorial or not. If not it will mean there has been an issue with the token
     */  
    public function setUserTutorial(Request $request)
    {
        $tutorialsAnswered = json_decode($request -> tutorialsAnswered);

        $returnObject = (object)[
            "valid" => false,
        ];

        //Check if given token is valid and corresponds to the user id
        $userId = $this->getUserId($request -> token);

        if ($userId != null) {
            //Check if user had already started the tutorial or if we need to create it
            $userTutorialQuestionsFound = User_tutorial::where("user_id", $userId) -> count();
            if ($userTutorialQuestionsFound == 0) { 
                $this->createTutorial($userId, $request -> userExperience);
            }

            //Update each tutorial that the user has completed. Set to unlocked the following question.
            $getUserTutorial = User_tutorial::where("user_id", $userId)->get();
            for ($i=0; $i < count($getUserTutorial); $i++) { 
                for ($j=0; $j < count($tutorialsAnswered); $j++) { 
                    if ($getUserTutorial[$i] -> tutorial_question == $tutorialsAnswered[$j]) {
                        $currentTutorial = User_tutorial::where("id", $getUserTutorial[$i] -> id)->first();
                        $currentTutorial->passed = true;
                        $currentTutorial->locked = false;
                        $currentTutorial->save();

                        if (($i + 1) < (count($getUserTutorial))) {
                            $getFollowingUserTutorial = User_tutorial::where("id", $getUserTutorial[$i + 1] -> id)->first();
                            $getFollowingUserTutorial->locked = false;
                            $getFollowingUserTutorial->save();
                        }

                    }
                }

            }
                      
            //If the tutorial has been finished we need to update the user
            if (json_decode($request -> tutorialPassed)) {
                $this->updateUser($userId);
                $returnObject -> finishedTutorial = true;
            }

            $returnObject -> valid = true;
        }

        return response() -> json($returnObject);
    }       

    /**
     * This function will first check that the user is logged in, if logged in it will check if he has completed the tutorial
     * @param string $token is the session token
     * @return object $returnObject contains the boolean valid that shows if the user has completed the tutorial or not.
    */  
    public function checkTutorialPassed(Request $request)
    {
        $returnObject = (object)[
            "tutorialPassed" => false,
        ];

        $userId = $this->getUserId($request -> token); 
        if ($userId != null) {
            $user = User::where('id', $userId) -> first();
            if  ($user -> tutorialPassed) { 
                $returnObject -> tutorialPassed = true;
            }
        }

        return response() -> json($returnObject);
    }    
    
    /**
     * This function will first check that the user is logged in, if logged in it will check if he has chosen an expertise
     * @param string $token is the session token
     * @return object $returnObject contains the boolean started, that indicates if the user has chosen a difficulty for the tutorial
    */     
    public function checkExpertiseChosen(Request $request)
    {
        $returnObject = (object)[
            "chosenExpertise" => false,
        ];

        $userId = $this->getUserId($request -> token); 
        if ($userId != null) {
            $user = User::where('id', $userId) -> first();
            if  ($user -> expertiseChosen) { 
                $returnObject -> chosenExpertise = true;
            }
        }

        return response() -> json($returnObject);
    }     

}