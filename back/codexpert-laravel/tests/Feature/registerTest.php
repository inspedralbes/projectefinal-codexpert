<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class registerTest extends TestCase
{
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_correct()
    {
        //Correct registration
        $response = $this->postJson("/register", ['name' => 'registertest', 'email' => 'registertest@gmail.com','password' => 'Qwerty123456.', 'password_confirmation' => 'Qwerty123456.']);

        $response
        ->assertStatus(200)
        ->assertJson([
            'valid' => true
        ]);
    } 

    public function test_name_already_used()
    {
        //Name already in use
        $response = $this->postJson("/register", ['name' => 'registertest', 'email' => 'registertest2@gmail.com','password' => 'Qwerty123456.', 'password_confirmation' => 'Qwerty123456.']);

        $response
        ->assertStatus(200)
        ->assertJson([
            'valid' => false,
            'message' => "Name already in use."
        ]);
    } 

    public function test_email_already_used()
    {
        //Email already in use.
        $response = $this->postJson("/register", ['name' => 'registertest2', 'email' => 'registertest@gmail.com','password' => 'Qwerty123456.', 'password_confirmation' => 'Qwerty123456.']);

        $response
        ->assertStatus(200)
        ->assertJson([
            'valid' => false,
            'message' => "Email already registered."
        ]);
    } 

    public function test_name_not_valid()
    {
        //Invalid name
        $response = $this->postJson("/register", ['name' => 'a', 'email' => 'registertest2@gmail.com','password' => 'Qwerty123456.', 'password_confirmation' => 'Qwerty123456.']);

        $response
        ->assertStatus(200)
        ->assertJson([
            'valid' => false,
            'message' => "Validation errors."
        ]);
    }     

    public function test_email_not_valid()
    {
        //Invalid email
        $response = $this->postJson("/register", ['name' => 'registertest2', 'email' => 'a','password' => 'Qwerty123456.', 'password_confirmation' => 'Qwerty123456.']);

        $response
        ->assertStatus(200)
        ->assertJson([
            'valid' => false,
            'message' => "Validation errors."
        ]);
    }     

    public function test_password_not_valid()
    {
        //Invalid password
        $response = $this->postJson("/register", ['name' => 'registertest2', 'email' => 'registertest2@gmail.com','password' => 'Qwerty123456', 'password_confirmation' => 'Qwerty123456.']);

        $response
        ->assertStatus(200)
        ->assertJson([
            'valid' => false,
            'message' => "Validation errors."
        ]);
    }     

    public function test_password_not_confirmed()
    {
        //Password not confirmed
        $response = $this->postJson("/register", ['name' => 'registertest2', 'email' => 'registertest2@gmail.com','password' => 'Qwerty123456.', 'password_confirmation' => 'Qwerty123456']);

        $response
        ->assertStatus(200)
        ->assertJson([
            'valid' => false,
            'message' => "Validation errors."
        ]);
    }    
    
    public function test_no_name()
    {
        //Name field empty
        $response = $this->postJson("/register", ['email' => 'registertest2@gmail.com','password' => 'Qwerty123456.', 'password_confirmation' => 'Qwerty123456']);

        $response
        ->assertStatus(200)
        ->assertJson([
            'valid' => false,
            'message' => "Validation errors."
        ]);
    }       

    public function test_no_email()
    {
        //Email field empty
        $response = $this->postJson("/register", ['name' => 'registertest2','password' => 'Qwerty123456.', 'password_confirmation' => 'Qwerty123456']);

        $response
        ->assertStatus(200)
        ->assertJson([
            'valid' => false,
            'message' => "Validation errors."
        ]);
    }     
    
}
