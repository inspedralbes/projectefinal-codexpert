<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class checkAnswerTest extends TestCase
{
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_correct()
    {
        //Given an existing id return the correct url.
        $response = $this->postJson("/checkAnswer", ['idQuestion' => 1, 'idGame' => 1, 'idUser' => 1,'evalRes' => [ [ 3, 5, 7 ], [ 3, 7, 10 ], [ 2, 6, 8 ] ], 'evalPassed' => true]);

        $response
        ->assertStatus(200)
        ->assertJson([
            'testsPassed' => 3,
        ]);
    }
    
    public function test_incorrect_2_passed()
    {
        //Given an existing id return the correct url.
        $response = $this->postJson("/checkAnswer", ['idQuestion' => 1, 'idGame' => 1, 'idUser' => 1,'evalRes' => [ [ 9, 5, 7 ], [ 3, 7, 10 ], [ 2, 6, 8 ] ], 'evalPassed' => true]);

        $response
        ->assertStatus(200)
        ->assertJson([
            'testsPassed' => 2,
        ]);
    }    

    public function test_incorrect_1_passed()
    {
        //Given an existing id return the correct url.
        $response = $this->postJson("/checkAnswer", ['idQuestion' => 1, 'idGame' => 1, 'idUser' => 1,'evalRes' => [ [ 1, 5, 7 ], [ 2, 7, 10 ], [ 2, 6, 8 ] ], 'evalPassed' => false]);

        $response
        ->assertStatus(200)
        ->assertJson([
            'testsPassed' => 0,
        ]);
    } 

    public function test_incorrect_0_passed()
    {
        //Given an existing id return the correct url.
        $response = $this->postJson("/checkAnswer", ['idQuestion' => 1, 'idGame' => 1, 'idUser' => 1,'evalRes' => [ [ 1, 5, 7 ], [ 2, 7, 10 ], [ 3, 6, 8 ] ], 'evalPassed' => false]);

        $response
        ->assertStatus(200)
        ->assertJson([
            'testsPassed' => 0,
        ]);
    } 
}
