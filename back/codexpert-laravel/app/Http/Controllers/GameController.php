<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Game;
use App\Models\Question;
use App\Models\Game_question;
use App\Models\User_game;
use App\Models\User;

class GameController extends Controller
{
    private function createNewGame(Request $request)
    {
        //Create a new empty game and return it.
        $newGame = new Game;
        $newGame -> save();

        return ($newGame);
    }

    private function getQuestions(Request $request)
    {        
        //Return X number of questions, where X is given by the frontend
        $questions = Question::inRandomOrder()->limit($request -> numQuestions)->get();

        return ($questions);
    }

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
    
    public function startGame(Request $request)
    {
        //Start an empty game
        $newGame = $this->createNewGame($request);

        //Get the questions that will be added to the game
        $getQuestions = $this->getQuestions($request);

        //Relate the questions to the game
        $this->addQuestionsToGame($newGame, $getQuestions);
        $allQuestions = [];

        //Unserialize the questions and add them to the array that will be returned
        for ($i = 0; $i < count($getQuestions); $i++) {
            $getQuestions[$i] -> userExpectedInput = unserialize($getQuestions[$i] -> userExpectedInput);
            $getQuestions[$i] -> userExpectedOutput = unserialize($getQuestions[$i] -> userExpectedOutput);
            $getQuestions[$i] -> testInput1 = unserialize($getQuestions[$i] -> testInput1);
            $getQuestions[$i] -> testOutput1 = unserialize($getQuestions[$i] -> testOutput1);
            $getQuestions[$i] -> testInput2 = unserialize($getQuestions[$i] -> testInput2);
            $getQuestions[$i] -> testOutput2 = unserialize($getQuestions[$i] -> testOutput2);
            $getQuestions[$i] -> inputs = [$getQuestions[$i] -> userExpectedInput, $getQuestions[$i] -> testInput1, $getQuestions[$i] -> testInput2];
            $getQuestions[$i] -> outputs = [$getQuestions[$i] -> userExpectedOutput, $getQuestions[$i] -> testOutput1, $getQuestions[$i] -> testOutput2];
            $allQuestions[$i] = $getQuestions[$i];
        }

        //Return object
        $game = (object) [
            'idGame' => $newGame -> id,
            'winner' => null,
            'questions' => $allQuestions
        ];

        return response() -> json($game);
    }

    public function setUserGame(Request $request)
    {
        //Game members
        $members = $request -> users;

        //Related that users that are playing to the game
        for ($i = 0; $i < count($members); $i++) {
            $newUserGame = new User_game;
            $newUserGame -> game_id = $request -> idGame;
            $newUserGame -> user_id = $members[$i]['idUser'];
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
            $question = Question::where('id', $request -> idQuestion) -> first();
            $userExpectedOutput = unserialize($question -> userExpectedOutput);
            $testOutput1 = unserialize($question -> testOutput1);
            $testOutput2 = unserialize($question -> testOutput2);
            
            $output = [$userExpectedOutput, $testOutput1, $testOutput2];


            foreach($output as $key => $val) {
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
                $user_game -> hearts_remaining -= 1;
                if ($user_game -> hearts_remaining == 0) {
                    $user_game -> finished = true;
                    $user_game -> dead = true;
                }
            }
        }

        $user_game -> save();
        $game -> save();

        $returnObject -> user_game = $user_game;
        $returnObject -> game = $game;

        return response() -> json($returnObject);
    }    

    public function updateUserLvl(Request $request)
    {
        //In this function, given if the user has won, and their position, we update their elo, XP and number of coins.
        //If the user has won their multiplayer to all this is twice the multiplayer a user that hasn't won would be.
        //The higher the question_at (therefore, how many questions they have answered correctly), the higher the reward is.
        $updatedProfiles = [];

        $multiplier = 1;
        $members = $request -> users;
        $game = Game::where('id', $request -> idGame) -> first();
        
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

        return response() -> json($updatedProfiles);
    }   
     
}