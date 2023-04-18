<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class getAvatarTest extends TestCase
{
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_correct()
    {
        //Given an existing id return the correct url.
        $response = $this->withSession(['userId' => 1])->post("/getAvatar");

        $response
        ->assertStatus(200)
        ->assertJson([
            'url' => 'https://api.dicebear.com/5.x/pixel-art/svg?seed=&backgroundColor=FFFFFF&clothing=variant12&clothingColor=ff6f69&hair=short19&hairColor=6E260E&skinColor=ffdbac&glasses=dark01&glassesColor=4b4b4b&glassesProbability=0&accessories=variant01&accessoriesColor=a9a9a9&accessoriesProbability=0&mouth=happy09&mouthColor=c98276&eyes=variant01&eyesColor=5b7c8b'  
        ]);
    }
    
    public function test_null_id()
    {
        //Given a null id return the correct url.
        $response = $this->withSession(['userId' => null])->post("/getAvatar");

        $response
        ->assertStatus(200)
        ->assertJson([
            'url' => null
        ]);
    }    

    public function test_incorrect_id()
    {
        //Given an exist that doesn't exist return null.
        $response = $this->withSession(['userId' => -1])->post("/getAvatar");

        $response
        ->assertStatus(200)
        ->assertJson([
            'url' => null
        ]);
    }      

    public function test_no_session()
    {
        //Given an exist that doesn't exist return null.
        $response = $this->post("/getAvatar");

        $response
        ->assertStatus(200)
        ->assertJson([
            'url' => null
        ]);
    }    

}
