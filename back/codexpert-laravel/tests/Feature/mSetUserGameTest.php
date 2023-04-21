<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use \stdClass;

class mSetUserGameTest extends TestCase
{
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_correct()
    {
        //Add the relation if the usres is correct and idGame is correct
        $user = new stdClass();//create a new 
        $user->idUser = 2;

        $response = $this->postJson("/setUserGame", ['users' => [$user], 'idGame' => 1]);

        $response
        ->assertStatus(200);
    }

    public function test_incorrect_users()
    {
        //Return 500 if no users are sent
        $user = new stdClass();//create a new 
        $user->idUser = 2;

        $response = $this->postJson("/setUserGame", ['idGame' => 1]);

        $response
        ->assertStatus(500);
    }

    public function test_incorrect_idGame()
    {
        //Return 500 if no users are sent
        $user = new stdClass();//create a new 
        $user->idUser = 2;

        $response = $this->postJson("/setUserGame", ['users' => [$user]]);

        $response
        ->assertStatus(500);
    }

}
