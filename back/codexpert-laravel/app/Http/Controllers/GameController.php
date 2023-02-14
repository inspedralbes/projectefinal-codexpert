<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Game;
use App\Models\Question;
use App\Models\Game_question;
use App\Models\User_game;

class GameController extends Controller
{
    public function createNewGame(Request $request)
    {
        $newGame = new Game;
        $newGame -> save();
        return ($newGame);
    }

    public function getQuestions(Request $request)
    {
        $questions = Question::all()->random(5);
        // $question = new Question;
        // $question -> statement = "Sort the following array";
        // $question -> userExpectedInput = serialize(array( 3, 7, 5 ));
        // $question -> userExpectedOutput = serialize(array( 3, 5, 7 ));
        // $question -> testInput1 = serialize(array( 10, 3, 7 ));
        // $question -> testOutput1 = serialize(array( 3, 7, 10 ));
        // $question -> testInput2 = serialize(array( 6, 2, 8 ));
        // $question -> testOutput2 = serialize(array( 2, 6, 8 ));
        // $question -> save();
        return ($questions);
    }

    public function addQuestionsToGame($newGame, $getQuestions)
    {
        for ($i = 0; $i < count($getQuestions); $i++) {
            $gameQuestion = new Game_question;
            $gameQuestion -> game_id = $newGame->id;
            $gameQuestion -> question_id = $getQuestions[$i]->id;
            $gameQuestion -> save();
        }
        // $gameQuestion = new Game_question;
        // $gameQuestion -> game_id = $newGame->id;
        // $gameQuestion -> question_id = $getQuestions->id;
        // $gameQuestion -> save();
    }
    
    public function startGame(Request $request)
    {
        $newGame = $this->createNewGame($request);
        $getQuestions = $this->getQuestions($request);
        $this->addQuestionsToGame($newGame, $getQuestions);
        $allQuestions = [];

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

        $game = (object) 
            ['idGame' => $newGame -> id,
            'winner' => null,
            'questions' => $allQuestions,
            ];
        return response() -> json($game);
    }

    public function setUserGame(Request $request)
    {
        $members = $request -> users;
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
        $returnObject = (object) 
            ['correct'=> false,
            'testsPassed' => null,
            'user_game'=> null,
            'game' => null
            ];

        $request -> idQuestion;
        $request -> idGame;
        $request -> idUser;
        $request -> evalRes;
        $request -> evalPassed; 

        if ($request -> evalPassed) {
            $question = Question::find($request -> idQuestion) -> first();
            $userExpectedOutput = unserialize($question -> userExpectedOutput);
            $testOutput1 = unserialize($question -> testOutput1);
            $testOutput2 = unserialize($question -> testOutput2);

            $returnObject -> correct = true;
            
            if ($userExpectedOutput == $request -> evalRes[0]) {
                $returnObject -> testsPassed++;
            } else {
                $returnObject -> correct = false;
            }

            if ($testOutput1 == $request -> evalRes[1]) {
                $returnObject -> testsPassed++;
            } else {
                $returnObject -> correct = false;
            }

            if ($testOutput2 == $request -> evalRes [2]) {
                $returnObject -> testsPassed++;
            } else {
                $returnObject -> correct = false;

            }
        }

        $game = Game::where('id', $request -> idGame) -> first();

        $user_game = User_game::where('game_id', $request -> idGame) 
        -> where ('user_id', $request -> idUser)
        -> first();

        if ($user_game -> question_at < 5) {
            if ($returnObject -> correct) {
                $user_game -> question_at = $user_game -> question_at + 1;
                if ($user_game -> question_at == 5) {
                    $user_game -> finished = true;
                    if ($game -> winner_id == null) {
                    $game -> winner_id = $request -> idUser;
                    
                    }
                }
            } else {
                $user_game -> hearts_remaining = $user_game -> hearts_remaining - 1;
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
    
}