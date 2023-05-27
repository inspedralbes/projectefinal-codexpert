<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class startGameTest extends TestCase
{
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_correct()
    {
        //Given a correct userId change the avatar
        $response = $this->withSession(['userId' => 1])
        ->postJson("/startGame", ['numQuestions' => 2]);

        $response
        ->assertStatus(200)
        ->assertJson([
            'winner' => null,
        ]);
    }

    public function test_null_num_questions()
    {
        //Given a correct userId change the avatar
        $response = $this->withSession(['userId' => 1])
        ->postJson("/startGame", ['numQuestions' => 0]);

        $response
        ->assertStatus(200)
        ->assertJson([
            'error' => true,
        ]);
    }

    public function test_no_num_questions()
    {
        //Given a correct userId change the avatar
        $response = $this->withSession(['userId' => 1])
        ->postJson("/startGame", []);

        $response
        ->assertStatus(200)
        ->assertJson([
            'error' => true,
        ]);
    }

}
