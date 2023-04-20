<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class pLogoutTest extends TestCase
{
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_no_session()
    {
        //Given an existing id return the correct url.
        $response = $this->post("/logout");

        $response
        ->assertStatus(200)
        ->assertJson([
            'logout' => true        
        ]);
    }

    public function test_null_session()
    {
        //Given an existing id return the correct url.
        $response = $this->withSession(['token' => null])->post("/logout");

        $response
        ->assertStatus(200)
        ->assertJson([
            'logout' => true        
        ]);
    }
    
}
