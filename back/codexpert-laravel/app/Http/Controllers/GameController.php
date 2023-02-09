<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GameController extends Controller
{
    public function createNewGame(Request $request)
    {
        $newGame;
        return response() -> json($newGame);
    }

    public function startGame(Request $request)
    {
        $newGame = $this->createNewGame($request);
        $game = (object) 
            ['idGame' => null,
            'winner' => null,
            'question' => (object) [
                'idQuestion' => null,
                'statement' => "",
                'input' => "",
                'expectedOutput' => "" 
            ]
            ];
        return response() -> json($game);
    }
}
