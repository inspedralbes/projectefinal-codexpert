<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class getUserInfoTest extends TestCase
{
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_null_token()
    {
        //Email registered, incorrect password
        $response = $this->postJson("/getUserInfo", ['token' => null]);

        $response
        ->assertStatus(200)
        ->assertJson([
            'error' => true,
        ]);
    }   

    public function test_no_token()
    {
        //No token stored in front
        $response = $this->postJson("/getUserInfo");

        $response
        ->assertStatus(200)
        ->assertJson([
            'error' => true,
        ]);
    }      

    public function test_null_string_token()
    {
        //No token stored in front
        $response = $this->postJson("/getUserInfo", ['token' => "null"]);

        $response
        ->assertStatus(200)
        ->assertJson([
            'error' => true,
        ]);
        
    }  

}