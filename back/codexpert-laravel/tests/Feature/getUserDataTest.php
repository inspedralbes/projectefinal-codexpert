<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class getUserDataTest extends TestCase
{
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_example()
    {
        //Given a correct userId get the info from the user.
        $response = $this->withSession(['userId' => 1])->get("/getUserData");

        $response
        ->assertStatus(200)
        ->assertJson([
            'name' => "codexpert_test",
            'email' => "codexpert_test@codexpert.com",
            'avatar' => "https://api.dicebear.com/5.x/pixel-art/svg?seed=&backgroundColor=FFFFFF&clothing=variant12&clothingColor=ff6f69&hair=short19&hairColor=6E260E&skinColor=ffdbac&glasses=dark01&glassesColor=4b4b4b&glassesProbability=0&accessories=variant01&accessoriesColor=a9a9a9&accessoriesProbability=0&mouth=happy09&mouthColor=c98276&eyes=variant01&eyesColor=5b7c8b",
        ]);

    }
    
    public function test_example2()
    {
        //Given a null id return that the avatar hasn't been changed.
        $response = $this->withSession(['userId' => null])->get("/getUserData");
        
        $response
        ->assertStatus(200)
        ->assertJson([
            'error' => "User is not logged in."
        ]);

    }    

    public function test_example3()
    {
        //Given an incorrect id return error code.
        $response = $this->withSession(['userId' => -1])->get("/getUserData");
        
        $response
        ->assertStatus(200)
        ->assertJson([
            'error' => "User is not logged in."
        ]);

    }  

    public function test_example4()
    {
        //No session.
        $response = $this->get("/getUserData");
        
        $response
        ->assertStatus(200)
        ->assertJson([
            'error' => "User is not logged in."
        ]);
        

    }  

}
