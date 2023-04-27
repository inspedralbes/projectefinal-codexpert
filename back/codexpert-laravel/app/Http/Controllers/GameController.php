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
use PhpParser\Node\Stmt\For_;

class GameController extends Controller
{
    /**
     * This function creates a new game relationship in the database
     * @return object $newGame it's the object that has been created in the database
     */    
    private function createNewGame(Request $request)
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
            $newGame = $this->createNewGame($request);

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
            'testsPassed' => 0,
            'user_game'=> null,
            'game' => null
        ];

        //If any of the tests doesn't pass we return that it's not a correct answer.
        if ($request -> evalPassed) {
            $outputs = [];
            $getOutputs = Test_output::where('question_id', $request -> idQuestion)->get();
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
        //avatar, name, elo, xp,, 
        $ranking = [];
        $player = (object) [
            'avatar' => '',
            'name' => '',
            'elo' => 0,
            'xp' => 0
        ];
        $game = Game::where('id', $id) -> first();

        if ($game -> winner_id != null) {
            $winner = User_game::where('game_id', $id) 
            -> where ('user_id', $game -> winner_id)
            -> first();
            
            $allPlayers = User_game::where('game_id', $id) 
            -> where ('user_id', '!=', $game -> winner_id)
            -> orderBy ('question_at', 'DESC')
            -> get();

            array_push($ranking, $winner);
        } else {
            $allPlayers = User_game::where('game_id', $id) 
            -> orderBy ('question_at', 'DESC')
            -> get();
        }
        
        for ($i = 0; $i < count($allPlayers); $i++) { 
            $player = $allPlayers[$i];
            array_push($ranking, $player);
        }
        
        return response() -> json($ranking);
    }     
     
}