<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use \stdClass;

class updateUserLvlTest extends TestCase
{
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_correct()
    {
        $user = new stdClass();//create a new 
        $user->idUser = 1;

        $response = $this->postJson("/updateUserLvl", ['users' => [$user], 'idGame' => 1]);

        $response
        ->assertStatus(200)
        ->assertJson([
        ]);
    }

    public function test_incorrect_users()
    {
        $user = new stdClass();//create a new 
        $user->idUser = 1;

        $response = $this->postJson("/updateUserLvl", ['idGame' => 1]);

        $response
        ->assertStatus(200)
        ->assertJson([
        ]);
    }

    public function test_incorrect_game_id()
    {
        $user = new stdClass();//create a new 
        $user->idUser = 1;

        $response = $this->postJson("/updateUserLvl", ['users' => [$user]]);

        $response
        ->assertStatus(200)
        ->assertJson([
        ]);
    }    
}
