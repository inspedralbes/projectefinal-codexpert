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
        for ($i = 0; count($getQuestions); $i++) {
            $gameQuestion = new Game_question;
            $gameQuestion -> game_id = $newGame->id;
            $gameQuestion -> question_id = $getQuestions->id;
            $gameQuestion -> save();
        }
        $gameQuestion = new Game_question;
        $gameQuestion -> game_id = $newGame->id;
        $gameQuestion -> question_id = $getQuestions->id;
        $gameQuestion -> save();
    }
    
    public function startGame(Request $request)
    {
        $newGame = $this->createNewGame($request);
        $getQuestions = $this->getQuestions($request);
        $this->addQuestionsToGame($newGame, $getQuestions);

        $getQuestions -> userExpectedInput = unserialize($getQuestions -> userExpectedInput);
        $getQuestions -> userExpectedOutput = unserialize($getQuestions -> userExpectedOutput);
        $getQuestions -> testInput1 = unserialize($getQuestions -> testInput1);
        $getQuestions -> testOutput1 = unserialize($getQuestions -> testOutput1);
        $getQuestions -> testInput2 = unserialize($getQuestions -> testInput2);
        $getQuestions -> testOutput2 = unserialize($getQuestions -> testOutput2);

        $game = (object) 
            ['idGame' => $newGame -> id,
            'winner' => null,
            'question' => (object) [
                'idQuestion' => $getQuestions -> id,
                'statement' => $getQuestions -> statement,
                'inputs' => [$getQuestions -> userExpectedInput, $getQuestions -> testInput1, $getQuestions -> testInput2],
                'outputs' => [$getQuestions -> userExpectedOutput, $getQuestions -> testOutput1, $getQuestions -> testOutput2]
            ]
            ];
        return response() -> json($game);
    }

    public function checkAnswer(Request $request)
    {
        $answerValidation = (object) 
            ['correct' => false,
            'winner' => null,
            'finished' => false
            ];

        $request -> idQuestion;
        $request -> idGame;
        $request -> idUser;
        $request -> evalRes;
        
        $question = Question::find($request -> idQuestion) -> first();

        if ($question -> userExpectedOutput == $request -> evalRes [0] && $question -> testInput1 == $request -> evalRes [1] && $question -> testInput2 == $request -> evalRes [2]) {
            $answerValidation -> correct = true;
        }


        return response() -> json($answerValidation);
    }    
    
}