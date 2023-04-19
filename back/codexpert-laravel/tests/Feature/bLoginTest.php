<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class bLoginTest extends TestCase
{
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_correct()
    {
        //Given a correct userId but the new password is not valid
        $response = $this->postJson("/login", ['email' => 'codexpert_test@codexpert.com','password' => 'Qwerty123456.']);

        $response
        ->assertStatus(200)
        ->assertJson([
            'valid' => true,
            'message' => "Logged in successfully",
        ]);
    } 

    public function test_incorrect_password()
    {
        //Email registered, incorrect password
        $response = $this->postJson("/login", ['email' => 'codexpert_test@codexpert.com','password' => 'Qwerty123456']);

        $response
        ->assertStatus(200)
        ->assertJson([
            'valid' => false,
            'message' => "Password and e-mail don't match."
        ]);
    }   

    public function test_user_doesnt_exist()
    {
        //Email not registered
        $response = $this->postJson("/login", ['email' => 'incorrect_email@codexpert.com','password' => 'Qwerty123456.']);

        $response
        ->assertStatus(200)
        ->assertJson([
            'valid' => false,
            'message' => "User not found.",
        ]);
    }        

    public function test_no_email()
    {
        //Email field empty
        $response = $this->postJson("/login", ['password' => 'Qwerty123456.']);

        $response
        ->assertStatus(200)
        ->assertJson([
            'valid' => false,
            'message' => "User not found.",
        ]);
    }    
    
}
