<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class gChangePasswordTest extends TestCase
{
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_same_password()
    {
        //Given a correct userId but the same password return that the password hasn't been changed
        $response = $this->withSession(['userId' => 1])
        ->postJson("/changePassword", ['newPassword' => 'Qwerty123456.', 'newPassword_confirmation' => 'Qwerty123456.', 'currentPassword' => 'Qwerty123456.']);

        $response
        ->assertStatus(200)
        ->assertJson([
            'error' => "Password has not been modified, no changes were made."
        ]);
    }
    
    public function test_new_password_not_valid()
    {
        //Given a correct userId but the new password is not valid
        $response = $this->withSession(['userId' => 1])
        ->postJson("/changePassword", ['newPassword' => 'co', 'currentPassword' => 'Qwerty123456.']);

        $response
        ->assertStatus(200)
        ->assertJson([
            'error' => "Validation errors."
        ]);
    } 

    public function test_no_current_password()
    {
        //Given a correct userId but no variable currentPassword
        $response = $this->withSession(['userId' => 1])
        ->postJson("/changePassword", ['newPassword' => 'Qwerty123456']);

        $response
        ->assertStatus(200)
        ->assertJson([
            'error' => "Current password is incorrect."
        ]);
    } 

    public function test_incorrect_current_password()
    {
        //Given a correct userId but the currentPassword is incorrect
        $response = $this->withSession(['userId' => 1])
        ->postJson("/changePassword", ['newPassword' => 'Qwerty123456!', 'currentPassword' => 'Qwerty123456']);

        $response
        ->assertStatus(200)
        ->assertJson([
            'error' => "Current password is incorrect."
        ]);
    } 

    public function test_incorrect_confirmation_password()
    {
        //Given a correct userId, currentPassword and newPassword but the currentPassword_confirmation is incorrect
        $response = $this->withSession(['userId' => 1])
        ->postJson("/changePassword", ['newPassword' => 'Qwerty123456!', 'newPassword_confirmation' => 'Qwerty123456', 'currentPassword' => 'Qwerty123456']);

        $response
        ->assertStatus(200)
        ->assertJson([
            'error' => "Current password is incorrect."
        ]);
    } 

    public function test_no_new_password()
    {
        //Given a correct userId but no newPassword sent
        $response = $this->withSession(['userId' => 1])
        ->postJson("/changePassword", ['currentPassword' => 'Qwerty123456.']);

        $response
        ->assertStatus(200)
        ->assertJson([
            'error' => "Validation errors."
        ]);
    } 

    public function test_incorrect_id()
    {
        //Given an id that doesn't exist return that the user is not logged in
        $response = $this->withSession(['userId' => -1])
        ->postJson("/changePassword", ['newPassword' => 'Qwerty123456!', 'currentPassword' => 'Qwerty123456.']);

        $response
        ->assertStatus(200)
        ->assertJson([
            'error' => "User is not logged in."
        ]);
    }     

    public function test_null_id()
    {
        //Given a null id return return that the user is not logged in
        $response = $this->withSession(['userId' => null])
        ->postJson("/changePassword", ['newPassword' => 'Qwerty123456!', 'currentPassword' => 'Qwerty123456.']);

        $response
        ->assertStatus(200)
        ->assertJson([
            'error' => "User is not logged in."
        ]);
    }     

    public function test_no_session()
    {
        //Given a null id return return that the user is not logged in
        $response = $this->postJson("/changePassword", ['newPassword' => 'Qwerty123456!', 'currentPassword' => 'Qwerty123456.']);

        $response
        ->assertStatus(200)
        ->assertJson([
            'error' => "User is not logged in."
        ]);
    }        

    public function test_correct()
    {
        //Given everything correct update the user
        $response = $this->withSession(['userId' => 1])
        ->postJson("/changePassword", ['newPassword' => 'Qwerty123456!', 'newPassword_confirmation' => 'Qwerty123456!', 'currentPassword' => 'Qwerty123456.']);

        $response
        ->assertStatus(200)
        ->assertJson([
            'success' => "Password has been changed."
        ]);
    } 
}
