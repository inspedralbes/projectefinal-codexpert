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
use App\Models\Tutorial_test_input;
use App\Models\Tutorial_test_output;
use Laravel\Sanctum\PersonalAccessToken;
class GameController extends Controller
{
    /**
     * This function creates a new game relationship in the database
     * @return object $newGame it's the object that has been created in the database
     */    
    private function createNewGame()
    {
        //Create a new empty game and return it.
        $newGame = new Game;
        $newGame -> save();

        return ($newGame);
    }

    /**
     * This function returns questions depending on the number that has been sent
     * @param int $numQuestions is the number of questions that have been requested
     * @return object $questions is an object containing the amount of questions requested
     */    
    private function getQuestions(Request $request)
    {        
        $questions = null;
        //Return X number of questions, where X is given by the frontend
        $questions = Question::inRandomOrder()->limit($request -> numQuestions)->get();

        return ($questions);
    }

    /**
     * This function creates the relationship between the game that we have created and the questions that we recieved from the database
     * @param object $newGame is game that has been created
     * @param object $getQuestions is the questions that be retrieved from the database.
     */     
    private function addQuestionsToGame($newGame, $getQuestions)
    {
        //Relate the given questions to the created game.
        for ($i = 0; $i < count($getQuestions); $i++) {
            $gameQuestion = new Game_question;
            $gameQuestion -> game_id = $newGame->id;
            $gameQuestion -> question_id = $getQuestions[$i]->id;
            $gameQuestion -> save();
        }
    }
    
    /**
     * This function triggers the functions that create the game, retrieve the questions and link the retrieved questions to the created game
     * @param int $numQuestions is the number of questions that we will retrieve from the database.
     * @return object $game is an object containing "error" if the game wasn't created. Otherwise it contains the gameId, it starts the winner as null, winner being the id from the person that has won, and and array named "allQuestions" with the questions that will be used this game
     */      
    public function startGame(Request $request)
    {
        $game = (object) [
            'error' => true,
        ];

        if ( !($request -> numQuestions == null || $request -> numQuestions == "null" || $request -> numQuestions == 0) ) {
            //Start an empty game
            $newGame = $this->createNewGame();

            //Get the questions that will be added to the game
            $getQuestions = $this->getQuestions($request);

            //Relate the questions to the game
            $this->addQuestionsToGame($newGame, $getQuestions);
            $allQuestions = [];

            //Unserialize the questions and add them to the array that will be returned
            for ($i = 0; $i < count($getQuestions); $i++) {
                $inputs = [];
                $outputs = [];
                $getInputs = Test_input::where('question_id', $getQuestions[$i] -> id)->get();
                $getOutputs = Test_output::where('question_id', $getQuestions[$i] -> id)->get();

                for ($j = 0; $j < count($getInputs); $j++) { 
                    $inputs[$j] = unserialize($getInputs[$j] -> input);
                    $outputs[$j] = unserialize($getOutputs[$j] -> output);
                }

                $getQuestions[$i] -> inputs = $inputs;
                $getQuestions[$i] -> outputs = $outputs;
                $allQuestions[$i] = $getQuestions[$i];
            }

            //Return object
            $game = (object) [
                'idGame' => $newGame -> id,
                'winner' => null,
                'questions' => $allQuestions
            ];
        }

        return response() -> json($game);
    }

    /**
     * This function creates the relationship between the game and all the users from the lobby
     * @param array $users is an array made of objects, each object represents a user from the lobby, contains their id.
     * @param int $idGame is the id from the game that the members of the lobby are playing
     * @param int $heartAmount is the maximum amount of hearts that a player will have, this has been chosen from the game settings
     * @return object $gameStatus contains a message 'Assigned users to the game' alognside the status '200' if successful and '500' otherwise. 
     */     
    public function setUserGame(Request $request)
    {
        //Game members
        $members = $request -> users;
        $checkUserGames = [];
        
        //Related that users that are playing to the game
        for ($i = 0; $i < count($members); $i++) {
            $newUserGame = new User_game;
            $newUserGame -> game_id = $request -> idGame;
            $newUserGame -> user_id = $members[$i]['idUser'];

            if ($request -> heartAmount != null) {
                $newUserGame -> hearts_remaining = $request -> heartAmount;
            } else {
                $newUserGame -> hearts_remaining = 5;
            }

            $newUserGame -> save();
            $checkUserGames [$i] = $newUserGame;
        }
        
        if ($checkUserGames != null) {
            $gameStatus = 200;
        } else {
            $gameStatus = 500;
        }

        return response('Assigned users to the game', $gameStatus);
    }    

    /**
     * This function is triggered each time a user responds to a question from the game, it will check whether the user answers the question correctly or not
     * @param bool $evalPassed determines whether the user has passed all the internal tests for the question correctly or not
     * @param bool $idQuestion is the id of the question that has been answered
     * @param array $evalRes contains all the results from the evals (done in front) for each input test
     * @param int $idGame is the id from the game that the members of the lobby are playing
     * @param int $idUser is the id from the user that is currently answering the question
     * @param int $numQuestions is the number of questions that we will retrieve from the database
     * @param bool $unlimitedHearts if true it means that hearts won't be removed from the user if the question is answered incorrectly
     * @return object $returnObject contains the boolean 'correct' which determines if the question has indeed been answered correctly, 'testsPassed' is the number of tests that have been passed, if 'correct' is true it will mean that all tests have been passed, 'user_game' contains all the information in the relationship between game and user, therefore here we can see information like 'hearts_remaining' (the amount of hearts remaining) and 'question_at' (which question is the user at now) and 'game' which contains the id from the winner and the game id.
     */     
    public function checkAnswer(Request $request)
    {
        $returnObject = (object) [
            'correct'=> true,
            'user_game'=> null,
            'game' => null
        ];

        //Get the outputs and check if the tests are correct
        $outputs = [];
        $getOutputs = Test_output::where('question_id', $request -> idQuestion)->get();
        for ($i = 0; $i < count($getOutputs); $i++) { 
            $outputs[$i] = unserialize($getOutputs[$i] -> output);
        }
        $correct = $this->checkEval($request -> evalPassed, $outputs, $request -> evalRes);
        $returnObject -> correct = $correct;

        //Get the game being played and update accordingly
        $game = Game::where('id', $request -> idGame) -> first();
        $user_game = User_game::where('game_id', $request -> idGame) 
        -> where ('user_id', $request -> idUser)
        -> first();

        if ($user_game -> question_at < $request -> numQuestions) {
            //If the user responded correctly, we move his position and check if he has either won, or finished (this would mean someone else has won)
            if ($returnObject -> correct) {
                $user_game -> question_at += 1;
                if ($user_game -> question_at == $request -> numQuestions) {
                    $user_game -> finished = true;
                    if ($game -> winner_id == null) {
                        $game -> winner_id = $request -> idUser;
                    }
                }
            } else {
                //If he responded incorrectly we update their number of hearts. If he has 0 hearts it's game over.
                if (!$request -> unlimitedHearts) {
                    $user_game -> hearts_remaining -= 1;
                    if ($user_game -> hearts_remaining == 0) {
                        $user_game -> finished = true;
                        $user_game -> dead = true;
                    }
                }
            }
        }

        $user_game -> save();
        $game -> save();

        $returnObject -> user_game = $user_game;
        $returnObject -> game = $game;

        return response() -> json($returnObject);
    }    

    /**
     * This function updates elo, coins and level experience of the users, depending on their question_at position and if they're the winner
     * @param array $users is an array made of objects, each object represents a user from the lobby, contains their id.
     * @param int $idGame is the id from the game that the members of the lobby are playing
     * @return array $updatedProfiles contains an object 'updatedStats' for each member of the lobby. This object contains 'idUser', 'xpEarned', coinsEarned and 'eloEarned'
     */         
    public function updateUserLvl(Request $request)
    {
        //In this function, given if the user has won, and their position, we update their elo, XP and number of coins.
        //If the user has won their multiplayer to all this is twice the multiplayer a user that hasn't won would be.
        //The higher the question_at (therefore, how many questions they have answered correctly), the higher the reward is.
        $updatedProfiles = [];

        $multiplier = 1;
        $members = $request -> users;
        $game = Game::where('id', $request -> idGame) -> first();
        
        if ($game != null) {
            if ( !($game -> winner_id == null || $members == null)) {
                for ($i = 0; $i < count($members); $i++) {
                    $myGame = User_game::where('game_id', $request -> idGame) 
                    -> where('user_id', $members[$i]['idUser'])
                    -> first();

                    $myProfile = User::where('id', $members[$i]['idUser']) -> first();

                    if ($game -> winner_id == $members[$i]['idUser']) {
                        $multiplier = 2;
                    }

                    $newXp = ($myGame -> question_at) * $multiplier;
                    $newCoins = ($myGame -> question_at) * $multiplier;
                    $newElo = (($myGame -> question_at) * 2) * $multiplier;

                    $myProfile -> xp += $newXp;
                    $myProfile -> coins += $newCoins;
                    $myProfile -> elo += $newElo;
                    
                    $updatedStats = (object) [
                        'idUser' =>  $members[$i]['idUser'],
                        'xpEarned' =>  $newXp,
                        'coinsEarned' => $newCoins,
                        'eloEarned' => $newElo,
                    ];

                    $updatedProfiles[$i] = $updatedStats;
                    
                    $myProfile -> save();
                }
            }
        }

        return response() -> json($updatedProfiles);
    }   

    /**
     * This function given a game id, returns the ranking from that game
     * @param int $id is the game id from the database.
     * @return array $ranking contains an ordered list of players that have played the game.
     */      
    public function getRanking($id)
    {
        $ranking = [];
        $player = (object) [
            'id' => 0,
            'avatar' => '',
            'name' => '',
            'elo' => 0,
            'xp' => 0,
            'heartsRemaining' => 0,
            'perksUsed' => 0,
            'questionAt' => 0,
            'winner' => false,
            'dead' => false
        ];
        $game = Game::where('id', $id) -> first();

        if ($game -> winner_id != null) {
            $winner = User::where('id', $game -> winner_id) -> first();
            $winnerGameData = User_game::where('game_id', $id) 
            -> where ('user_id', $game -> winner_id)
            -> first();
            $player -> id = $winner -> id;
            $player -> avatar = $winner -> avatar;
            $player -> name = $winner -> name;
            $player -> elo = $winner -> elo;
            $player -> xp = $winner -> xp;
            $player -> heartsRemaining = $winnerGameData -> hearts_remaining;
            $player -> perksUsed = $winnerGameData -> perks_used;
            $player -> questionAt = $winnerGameData -> question_at;
            $player -> winner = true;
            $player -> dead = ($winnerGameData -> dead == 0) ? false : true;
            
            array_push($ranking, $player);

            $allPlayers = User_game::where('game_id', $id) 
            -> where ('user_id', '!=', $game -> winner_id)
            -> orderBy ('question_at', 'DESC')
            -> get();

        } else {
            $allPlayers = User_game::where('game_id', $id) 
            -> orderBy ('question_at', 'DESC')
            -> get();
        }
        
        for ($i = 0; $i < count($allPlayers); $i++) { 
            $playerData = User::where('id', $allPlayers[$i] -> user_id) -> first();
            $player = (object) [
                'id' => 0,
                'avatar' => '',
                'name' => '',
                'elo' => 0,
                'xp' => 0,
                'heartsRemaining' => 0,
                'perksUsed' => 0,
                'questionAt' => 0,
                'winner' => false,
                'dead' => false

            ];
            $player -> id = $playerData -> id;
            $player -> avatar = $playerData -> avatar;
            $player -> name = $playerData -> name;
            $player -> elo = $playerData -> elo;
            $player -> xp = $playerData -> xp;
            $player -> heartsRemaining = $allPlayers[$i] -> hearts_remaining;
            $player -> perksUsed = $winnerGameData -> perks_used;
            $player -> questionAt = $allPlayers[$i] -> question_at;
            $player -> winner = false;
            $player -> dead = ($allPlayers[$i] -> dead == 0) ? false : true;

            array_push($ranking, $player);
        }
        
        return response() -> json($ranking);
    }     

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
     * This function recievs the statement for the next question and validates that it's correct
     * @param string $statement is the statement that will be validated
     * @return bool $canCreate is the boolean after the statement validation, true means it's valid
     */     
    private function checkStatement($statement)
    {
        $canCreate = false;
        if ($statement != null) {
            if ( (strlen($statement) > 10) && (strlen($statement) <= 500) ) {
                $canCreate = true;
            }
        }

        return $canCreate;
    }  

    /**
     * This function recievs the inputs and if the eval has been passed, outputs, inputs and the result from the evals. It will check if there are enough tests, if the tests are valid and if the tests are repeated it will return which.
     * @param bool $evalPassed returns if the eval has been passed on frontend
     * @param array $outputs is the array of the outputs that the user wrote
     * @param array $evalRes is the array containing the results of each eval
     * @return bool $correct will compare the evals to the outputs, check if the amount of outputs and testspassed are the same
     */     
    private function checkEval($evalPassed, $outputs, $evalRes)
    {
        $correct = false;
        $testsPassed = 0;

        //If any of the tests doesn't pass we return that it's not a correct answer.
        if ($evalPassed) {
            foreach($outputs as $index => $outputValue) {
                if ($outputValue == $evalRes[$index]) {
                    $testsPassed++;
                }
            }
        }

        if ($testsPassed >= count($outputs)) {
            $correct = true;
        }

        return $correct;
    }     

    /**
     * This function recievs the inputs and if the eval has been passed, outputs, inputs and the result from the evals. It will check if there are enough tests, if the tests are valid and if the tests are repeated it will return which.
     * @param bool $evalPassed returns if the eval has been passed on frontend
     * @param array $outputs is the array of the outputs that the user wrote
     * @param array $evalRes is the array containing the results of each eval
     * @return object $returnObject containing correct will compare the evals to the outputs, check if the amount of outputs and testspassed are the same
     */     
    private function checkInputsAndOutputs($inputs, $outputs)
    {
        $returnObject = (object) [
            "correct" => false,
            "error" => ''
        ];

        if ( (count($inputs) == count($outputs)) && (count($inputs)) >= 3) {
            $i = 1;
            while ($i < count($inputs) && !$returnObject -> correct) {
                if ($inputs[0] !== $inputs[$i]) {
                    $returnObject -> correct = true;
                }
                $i++;
            }

            if ($returnObject -> correct) {
                $i = 0;
                while ($i < count($inputs) && $returnObject -> correct) {
                    if ($inputs[$i] === $outputs[$i]) {
                        $returnObject -> correct = false;
                    } 
                    $i++;
                }

                if (!$returnObject -> correct) {
                    $returnObject -> error  = "Input and output can't be the same.";
                }
                
            } else {
                $returnObject -> error  =  "Inputs can't all be the same.";
            }

        } else {
            $returnObject -> error = "Not enough tests or the amount of inputs and outputs are not equal.";
        }

        return $returnObject;
    }  

    /**
     * This functions adds a new question to the database, relating the user to it as the creator.
     * @param string $statement is the statement from the question
     * @param string $hint is a hint so the users can have a better understanding of the statement if needed
     * @param int $creatorId is id from the logged in user
     * @return object $questionAdded is the row that has been added to the database
     */     
    private function createNewQuestion($statement, $hint, $creatorId)
    {
        $questionAdded = new Question;
        $questionAdded -> statement = $statement;
        $questionAdded -> hint = $hint;
        $questionAdded -> creatorId = $creatorId;
        $questionAdded -> save();

        return $questionAdded;
    } 

    /**
     * This functions adds the test inputs that the user has created to the question that has just been created.
     * @param int $question_id is id from the question that has just been created
     * @param array $inputs is an array of all the test inputs
     */     
    private function addInputsToQuestion($question_id, $inputs)
    {
        for ($i = 0; $i < count($inputs); $i++) { 
            $input = new Tutorial_test_input;
            $input -> question_id = $question_id;
            $input -> input = serialize($inputs[$i]);
            $input -> save();
        }

    } 
    
    /**
     * This functions adds the test outputs that the user has created to the question that has just been created.
     * @param int $question_id is id from the question that has just been created
     * @param array $outputs is an array of all the test outputs
     */      
    private function addOutputsToQuestion($question_id, $outputs)
    {
        for ($i = 0; $i < count($outputs); $i++) { 
            $output = new Tutorial_test_output;
            $output -> question_id = $question_id;
            $output -> output = serialize($outputs[$i]);
            $output -> save();
        }

    } 

    /**
     * This function will validate and create the given question and relate it to the logged in user.
     * @param string $checkToken is the session token
     * @param string $statement is the statement for the question, where the exercise is explained
     * @param array $outputs is the array of outputs that the user is intering
     * @param array $inputs is the array of inputs that the user is intering
     * @param string $hint is a hint to make the question a bit easier
     * @return object $returnObject contains 'created', will return true if the question has been added to the database, and 'loggedIn', will return true if the user is logged in.
     */      
    public function addNewQuestion(Request $request)
    {
        $returnObject = (object) [
            'created' => false,
            'loggedIn' => false
        ];

        //Check if the user is logged in, if not we don't create and notify front end that the user is not logged in
        $userId = $this->getUserId($request -> token);
        
        //Decode the given arrays
        $outputs = json_decode($request -> outputs);
        $inputs = json_decode($request -> evalRes);

        if ($userId != null) {
            //If logged in we run all the validations
            $validStatement = $this->checkStatement($request -> statement);
            $correctInputsAndOutputs = $this->checkInputsAndOutputs($inputs, $outputs);
            if ($validStatement && $correctInputsAndOutputs -> correct) {
                $createdQuestion = $this->createNewQuestion($request -> statement, $request -> hint, $request -> userId);
                $this->addInputsToQuestion($createdQuestion -> id, $inputs);
                $this->addOutputsToQuestion($createdQuestion -> id, $outputs);      
                $returnObject = (object) [
                    'created' => true,
                    'loggedIn' => true
                ];
            } else {
                if ( ($correctInputsAndOutputs -> error != null) || ($correctInputsAndOutputs -> error != "")) {
                    $returnObject = (object) [
                        'loggedIn' => true,
                        'error' => $correctInputsAndOutputs -> error
                    ];
                } else {
                    $returnObject = (object) [
                        'loggedIn' => true,
                        'error' => 'Statement is not valid.'
                    ];
                }

            }
            
        }
        
        return response() -> json($returnObject);
    }    
    
    /**
     * This function will return all the questions that the user has created
     * @param string $checkToken is the session token
     * @return array $myQuestions returns all the questions where the user is the creator
     */      
    public function getMyQuestions(Request $request)
    {  
        //Check if the user is logged in, if not array myQuestions is empty
        $userId = $this->getUserId($request -> token);

        if ($userId != null) {
            $myQuestions = Question::where('creatorId', $userId) -> get();
        }
        
        return response() -> json($myQuestions);
    }  
     
}