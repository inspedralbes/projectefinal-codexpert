<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class setAvatarTest extends TestCase
{
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_example()
    {
        //Given a correct userId change the avatar
        $response = $this->withSession(['userId' => 1])
        ->postJson("/setAvatar", ['newAvatar' => 'https://api.dicebear.com/5.x/pixel-art/svg?seed=&backgroundColor=FFFFFF&clothing=variant12&clothingColor=ff6f69&hair=short19&hairColor=6E260E&skinColor=ffdbac&glasses=dark01&glassesColor=4b4b4b&glassesProbability=0&accessories=variant01&accessoriesColor=a9a9a9&accessoriesProbability=0&mouth=happy09&mouthColor=c98276&eyes=variant01&eyesColor=5b7c8b']);

        $response
        ->assertStatus(200)
        ->assertJson([
            'changed' => true
        ]);
    }
    
    public function test_example2()
    {
        //Given a null id return that the avatar hasn't been changed.
        $response = $this->withSession(['userId' => null])
        ->postJson("/setAvatar", ['newAvatar' => 'https://api.dicebear.com/5.x/pixel-art/svg?seed=&backgroundColor=FFFFFF&clothing=variant12&clothingColor=ff6f69&hair=short19&hairColor=6E260E&skinColor=ffdbac&glasses=dark01&glassesColor=4b4b4b&glassesProbability=0&accessories=variant01&accessoriesColor=a9a9a9&accessoriesProbability=0&mouth=happy09&mouthColor=c98276&eyes=variant01&eyesColor=5b7c8b']);

        $response
        ->assertStatus(200)
        ->assertJson([
            'changed' => false
        ]);
    }    

    public function test_example3()
    {
        //Given an incorrect id return that the avatar hasn't been changed.
        $response = $this->withSession(['userId' => -1])
        ->postJson("/setAvatar", ['newAvatar' => 'https://api.dicebear.com/5.x/pixel-art/svg?seed=&backgroundColor=FFFFFF&clothing=variant12&clothingColor=ff6f69&hair=short19&hairColor=6E260E&skinColor=ffdbac&glasses=dark01&glassesColor=4b4b4b&glassesProbability=0&accessories=variant01&accessoriesColor=a9a9a9&accessoriesProbability=0&mouth=happy09&mouthColor=c98276&eyes=variant01&eyesColor=5b7c8b']);

        $response
        ->assertStatus(200)
        ->assertJson([
            'changed' => false
        ]);
    }  

    public function test_example4()
    {
        //Given a correct id but an incorrect avatar
        $response = $this->withSession(['userId' => 1])
        ->postJson("/setAvatar", ['newAvatar' => 'https://api.com/5.x/pixel-art/svg?seed=&backgroundColor=FFFFFF&clothing=variant12&clothingColor=ff6f69&hair=short19&hairColor=6E260E&skinColor=ffdbac&glasses=dark01&glassesColor=4b4b4b&glassesProbability=0&accessories=variant01&accessoriesColor=a9a9a9&accessoriesProbability=0&mouth=happy09&mouthColor=c98276&eyes=variant01&eyesColor=5b7c8b']);

        $response
        ->assertStatus(200)
        ->assertJson([
            'changed' => false
        ]);

    }  

    public function test_example5()
    {
        //Given an incorrect id return that the avatar hasn't been changed.
        $response = $this->postJson("/setAvatar", ['newAvatar' => 'https://api.dicebear.com/5.x/pixel-art/svg?seed=&backgroundColor=FFFFFF&clothing=variant12&clothingColor=ff6f69&hair=short19&hairColor=6E260E&skinColor=ffdbac&glasses=dark01&glassesColor=4b4b4b&glassesProbability=0&accessories=variant01&accessoriesColor=a9a9a9&accessoriesProbability=0&mouth=happy09&mouthColor=c98276&eyes=variant01&eyesColor=5b7c8b']);

        $response
        ->assertStatus(200)
        ->assertJson([
            'changed' => false
        ]);
    }    
}
