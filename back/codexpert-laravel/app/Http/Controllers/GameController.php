<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Game;
use App\Models\Question;

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
        $question = Question::all()->random(1)->first();
        // $question = new Question;
        // $question -> statement = "Sort the following array";
        // $question -> userExpectedInput = serialize(array( 3, 7, 5 ));
        // $question -> userExpectedOutput = serialize(array( 3, 5, 7 ));
        // $question -> testInput1 = serialize(array( 10, 3, 7 ));
        // $question -> testOutput1 = serialize(array( 3, 7, 10 ));
        // $question -> testInput2 = serialize(array( 6, 2, 8 ));
        // $question -> testOutput2 = serialize(array( 2, 6, 8 ));
        // $question -> save();
        return ($question);
    }

    public function startGame(Request $request)
    {
        $newGame = $this->createNewGame($request);
        $getQuestions = $this->getQuestions($request);
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
                'input' => $getQuestions -> userExpectedInput,
                'expectedOutput' => $getQuestions -> userExpectedOutput, 
                'testInput1' => $getQuestions -> testInput1, 
                'testOutput1' => $getQuestions -> testOutput1, 
                'testInput2' => $getQuestions -> testInput2, 
                'testOutput2' => $getQuestions -> testOutput2                    
            ]
            ];

        return response() -> json($game);
    }

    public function checkAnswer(Request $request)
    {
        $answerValidation = [];
        
        $request -> idQuestion;
        $request -> idGame;
        $request -> idUser;
        $request -> evalRes;
        
        $question = Question::find($request -> idQuestion) -> first();
        $question -> userExpectedOutput = serialize(array( 3, 5, 7 ));

        return response() -> json($answerValidation);
    }    
    
}