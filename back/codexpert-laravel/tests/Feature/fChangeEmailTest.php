<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class fChangeEmailTest extends TestCase
{
    /**
     * A basic feature test example.
     *
     * @return void
     */
    
        public function test_same_email()
    {
        //Given a correct userId but the same email return that the email hasn't been changed
        $response = $this->withSession(['userId' => 1])
        ->postJson("/changeEmail", ['newEmail' => 'codexpert_test@codexpert.com', 'password' => 'Qwerty123456.']);

        $response
        ->assertStatus(200)
        ->assertJson([
            'error' => "Email has not been modified, no changes were made."
        ]);
    }
    
    public function test_email_not_valid()
    {
        //Given a correct userId but the email is too short return that the email hasn't been changed
        $response = $this->withSession(['userId' => 1])
        ->postJson("/changeEmail", ['newEmail' => 'co', 'password' => 'Qwerty123456.']);

        $response
        ->assertStatus(200)
        ->assertJson([
            'error' => "Email not valid."
        ]);
    } 

    public function test_no_email()
    {
        //Given a correct userId but no variable email
        $response = $this->withSession(['userId' => 1])
        ->postJson("/changeEmail", ['password' => 'Qwerty123456.']);

        $response
        ->assertStatus(200)
        ->assertJson([
            'error' => "Email not valid."
        ]);
    } 

    public function test_incorrect_password()
    {
        //Given a correct userId but password is incorrect
        $response = $this->withSession(['userId' => 1])
        ->postJson("/changeEmail", ['newEmail' => 'codexpert_test2@codexpert.com', 'password' => 'Qwerty123456']);

        $response
        ->assertStatus(200)
        ->assertJson([
            'error' => 'Password is incorrect.',
        ]);
    } 

    public function test_no_password()
    {
        //Given a correct userId but no password send
        $response = $this->withSession(['userId' => 1])
        ->postJson("/changeEmail", ['newEmail' => 'codexpert_test2@codexpert.com']);

        $response
        ->assertStatus(200)
        ->assertJson([
            'error' => 'Password is incorrect.',
        ]);
    } 

    public function test_incorrect_id()
    {
        //Given an id that doesn't exist return that the user doesn't exist
        $response = $this->withSession(['userId' => -1])
        ->postJson("/changeEmail", ['newEmail' => 'codexpert_test@codexpert.com', 'password' => 'Qwerty123456.']);

        $response
        ->assertStatus(200)
        ->assertJson([
            'error' => 'User is not logged in.',
        ]);
    }     

    public function test_null_id()
    {
        //Given a null id return return that the user doesn't exist
        $response = $this->withSession(['userId' => null])
        ->postJson("/changeEmail", ['newEmail' => 'codexpert_test@codexpert.com', 'password' => 'Qwerty123456.']);

        $response
        ->assertStatus(200)
        ->assertJson([
            'error' => 'User is not logged in.'
        ]);
    }     

    public function test_no_session()
    {
        //Given a null id return return that the user doesn't exist
        $response = $this->postJson("/changeEmail", ['newEmail' => 'codexpert_test@codexpert.com', 'password' => 'Qwerty123456.']);

        $response
        ->assertStatus(200)
        ->assertJson([
            'error' => 'User is not logged in.'
        ]);
    }        

    public function test_correct()
    {
        //Given everything correct update the user
        $response = $this->withSession(['userId' => 1])
        ->postJson("/changeEmail", ['newEmail' => 'test@gmail.com', 'password' => 'Qwerty123456.']);

        $response
        ->assertStatus(200)
        ->assertJson([
            'success' => "Email has been changed."
        ]);
    }         

    public function test_email_already_used()
    {
        //Given a email that another user has do not update
        $response = $this->withSession(['userId' => 1])
        ->postJson("/changeEmail", ['newEmail' => 'codexpert_test2@codexpert.com', 'password' => 'Qwerty123456.']);

        $response
        ->assertStatus(200)
        ->assertJson([
            'error' => "Email already in use."
        ]);
    } 
}
