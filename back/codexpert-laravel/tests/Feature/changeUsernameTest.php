<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class changeUsernameTest extends TestCase
{
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_same_name()
    {
        //Given a correct userId but the same name return that the name hasn't been changed
        $response = $this->withSession(['userId' => 1])
        ->postJson("/changeUsername", ['newName' => 'codexpert_test', 'password' => 'Qwerty123456!']);

        $response
        ->assertStatus(200)
        ->assertJson([
            'error' => "Name has not been modified, no changes were made."
        ]);
    }
    
    public function test_name_too_short()
    {
        //Given a correct userId but the name is too short return that the name hasn't been changed
        $response = $this->withSession(['userId' => 1])
        ->postJson("/changeUsername", ['newName' => 'co', 'password' => 'Qwerty123456!']);

        $response
        ->assertStatus(200)
        ->assertJson([
            'error' => "Name must have a minimum amount of 3 characters and 20 max."
        ]);
    }

    public function test_name_too_long()
    {
        //Given a correct userId but the name is too long return that the name hasn't been changed
        $response = $this->withSession(['userId' => 1])
        ->postJson("/changeUsername", ['newName' => 'djasdhkjadhkjhakdkhadkjhaskdkhakdsahka', 'password' => 'Qwerty123456!']);

        $response
        ->assertStatus(200)
        ->assertJson([
            'error' => "Name must have a minimum amount of 3 characters and 20 max."
        ]);
    }    

    public function test_no_name()
    {
        //Given a correct userId but no variable name
        $response = $this->withSession(['userId' => 1])
        ->postJson("/changeUsername", ['password' => 'Qwerty123456!']);

        $response
        ->assertStatus(200)
        ->assertJson([
            'error' => "Name must have a minimum amount of 3 characters and 20 max."
        ]);
    } 

    public function test_incorrect_password()
    {
        //Given a correct userId but password is incorrect
        $response = $this->withSession(['userId' => 1])
        ->postJson("/changeUsername", ['newName' => 'codexpert_test2', 'password' => 'Qwerty123456']);

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
        ->postJson("/changeUsername", ['newName' => 'codexpert_test2']);

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
        ->postJson("/changeUsername", ['newName' => 'codexpert_test', 'password' => 'Qwerty123456!']);

        $response
        ->assertStatus(200)
        ->assertJson([
            'error' => "User is not logged in."
        ]);
    }     

    public function test_null_id()
    {
        //Given a null id return return that the user doesn't exist
        $response = $this->withSession(['userId' => null])
        ->postJson("/changeUsername", ['newName' => 'codexpert_test', 'password' => 'Qwerty123456!']);

        $response
        ->assertStatus(200)
        ->assertJson([
            'error' => 'User is not logged in.'
        ]);
    }     

    public function test_no_session()
    {
        //Given a null id return return that the user doesn't exist
        $response = $this->postJson("/changeUsername", ['newName' => 'codexpert_test', 'password' => 'Qwerty123456!']);

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
        ->postJson("/changeUsername", ['newName' => 'codexpert_test.', 'password' => 'Qwerty123456!']);

        $response
        ->assertStatus(200)
        ->assertJson([
            'success' => "Name has been changed."
        ]);
    }         

    public function test_name_already_used()
    {
        //Given a name that another user has do not update
        $response = $this->withSession(['userId' => 1])
        ->postJson("/changeUsername", ['newName' => 'codexpert_test2', 'password' => 'Qwerty123456!']);

        $response
        ->assertStatus(200)
        ->assertJson([
            'error' => "Name already in use."
        ]);
    } 

}