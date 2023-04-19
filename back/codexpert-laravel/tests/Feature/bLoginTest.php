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
        //Given a correct userId but the new password is not valid
        $response = $this->postJson("/login", ['email' => 'codexpert_test@codexpert.com','password' => 'Qwerty123456']);

        $response
        ->assertStatus(200)
        ->assertJson([
            'valid' => false,
            'message' => "Password and e-mail don't match."
        ]);
    } 

    public function test_email_already_used()
    {
        //Given a correct userId but the new password is not valid
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
        //Given a correct userId but the new password is not valid
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
        //Given a correct userId but the new password is not valid
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
        //Given a correct userId but the new password is not valid
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
        //Given a correct userId but the new password is not valid
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
        //Given a correct userId but the new password is not valid
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
        //Given a correct userId but the new password is not valid
        $response = $this->postJson("/register", ['name' => 'registertest2','password' => 'Qwerty123456.', 'password_confirmation' => 'Qwerty123456']);

        $response
        ->assertStatus(200)
        ->assertJson([
            'valid' => false,
            'message' => "Validation errors."
        ]);
    }     
    
}
