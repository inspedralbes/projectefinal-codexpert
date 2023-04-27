<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Game;
use App\Models\Question;
use App\Models\Test_input;
use App\Models\Test_output;
use App\Models\Game_question;
use App\Models\User_game;
use App\Models\User;
use PhpParser\Node\Stmt\For_;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        //Example 1
        $question = new Question;
        $question -> statement = "Sort Array in ASCENDING order";
        $question -> save();
        //Input 1
        $input = new Test_input;
        $input -> question_id = 1;
        $input -> input = serialize(array( 3, 7, 5 ));
        $input -> save();
        //Input 2
        $input = new Test_input;
        $input -> question_id = 1;
        $input -> input = serialize(array( 10, 3, 7 ));
        $input -> save();
        //Input 3
        $input = new Test_input;
        $input -> question_id = 1;
        $input -> input = serialize(array( 6, 2, 8 ));
        $input -> save();
        //Output 1
        $output = new Test_output;
        $output -> question_id = 1;
        $output -> output = serialize(array( 3, 5, 7 ));
        $output -> save();
        //Output 2
        $output = new Test_output;
        $output -> question_id = 1;
        $output -> output = serialize(array( 3, 7, 10 ));
        $output -> save();
        //Output 3
        $output = new Test_output;
        $output -> question_id = 1;
        $output -> output = serialize(array( 2, 6, 8 ));
        $output -> save();                

        
        //Example 2
        $question = new Question;
        $question -> statement = "Reverse the String";
        $question -> save();
        //Input 1
        $input = new Test_input;
        $input -> question_id = 2;
        $input -> input = serialize("Hello");
        $input -> save();
        //Input 2
        $input = new Test_input;
        $input -> question_id = 2;
        $input -> input = serialize("Howdy");
        $input -> save();
        //Input 3
        $input = new Test_input;
        $input -> question_id = 2;
        $input -> input = serialize("Greetings from Earth");
        $input -> save();
        //Output 1
        $output = new Test_output;
        $output -> question_id = 2;
        $output -> output = serialize("olleH");
        $output -> save();
        //Output 2
        $output = new Test_output;
        $output -> question_id = 2;
        $output -> output = serialize("ydwoH");
        $output -> save();
        //Output 3
        $output = new Test_output;
        $output -> question_id = 2;
        $output -> output = serialize("htraE morf sgniteerG");
        $output -> save();                
        
        
        //Example 3
        $question = new Question;
        $question -> statement = "Reverse the given Array";
        $question -> save();
        //Input 1
        $input = new Test_input;
        $input -> question_id = 3;
        $input -> input = serialize(array( 3, 7, 2, 4 ));
        $input -> save();
        //Input 2
        $input = new Test_input;
        $input -> question_id = 3;
        $input -> input = serialize(array( 5, 1, 4, 2, 3 ));
        $input -> save();
        //Input 3
        $input = new Test_input;
        $input -> question_id = 3;
        $input -> input = serialize(array( 7, 12, 3 ));
        $input -> save();
        //Output 1
        $output = new Test_output;
        $output -> question_id = 3;
        $output -> output = serialize(array( 4, 2, 7, 3 ));
        $output -> save();
        //Output 2
        $output = new Test_output;
        $output -> question_id = 3;
        $output -> output = serialize(array( 3, 2, 4, 1, 5 ));
        $output -> save();
        //Output 3
        $output = new Test_output;
        $output -> question_id = 3;
        $output -> output = serialize(array( 3, 12, 7 ));
        $output -> save();                


        //Example 4
        $question = new Question;
        $question -> statement = "Count number of odd numers in the Array";
        $question -> save();
        //Input 1
        $input = new Test_input;
        $input -> question_id = 4;
        $input -> input = serialize(array( 21, 32, 47, 52, 63 ));
        $input -> save();
        //Input 2
        $input = new Test_input;
        $input -> question_id = 4;
        $input -> input = serialize(array( -3, 80, 2 ));
        $input -> save();
        //Input 3
        $input = new Test_input;
        $input -> question_id = 4;
        $input -> input = serialize(array( 42, 8, 58, 8 ));
        $input -> save();
        //Output 1
        $output = new Test_output;
        $output -> question_id = 4;
        $output -> output = serialize(3);
        $output -> save();
        //Output 2
        $output = new Test_output;
        $output -> question_id = 4;
        $output -> output = serialize(1);
        $output -> save();
        //Output 3
        $output = new Test_output;
        $output -> question_id = 4;
        $output -> output = serialize(0);
        $output -> save();                
        

        //Example 5
        $question = new Question;
        $question -> statement = "Sort Array in ASCENDING order";
        $question -> save();
        //Input 1
        $input = new Test_input;
        $input -> question_id = 5;
        $input -> input = serialize(array( 3, 7, 5 ));
        $input -> save();
        //Input 2
        $input = new Test_input;
        $input -> question_id = 5;
        $input -> input = serialize(array( 10, 3, 7 ));
        $input -> save();
        //Input 3
        $input = new Test_input;
        $input -> question_id = 5;
        $input -> input = serialize(array( 6, 2, 8 ));
        $input -> save();
        //Output 1
        $output = new Test_output;
        $output -> question_id = 5;
        $output -> output = serialize(array( 3, 5, 7 ));
        $output -> save();
        //Output 2
        $output = new Test_output;
        $output -> question_id = 5;
        $output -> output = serialize(array( 3, 7, 10 ));
        $output -> save();
        //Output 3
        $output = new Test_output;
        $output -> question_id = 5;
        $output -> output = serialize(array( 2, 6, 8 ));
        $output -> save();                        
        
        //Example 5
        // $question = new Question;
        // $question -> statement = "Given an array of 5 numbers, where the first number is the integer to find. Count how many times this number appears in the array.";
        // $question -> userExpectedInput = serialize(array( 1, 20, 1, 1, 17 ));
        // $question -> userExpectedOutput = serialize(2);
        // $question -> testInput1 = serialize(array( 20, 0, -3, 20, 1 ));
        // $question -> testOutput1 = serialize(1);
        // $question -> testInput2 = serialize(array( 5, 90, 30, 1, 17 ));
        // $question -> testOutput2 = serialize(0);
        // $question -> save();      
        
        //When migrating it will always create this test user
        $user = new User;
        $user -> name = strtolower("codexpert_test");
        $user -> email = strtolower("codexpert_test@codexpert.com");
        $user -> password = Hash::make("Qwerty123456.");
        $user -> avatar = "https://api.dicebear.com/5.x/pixel-art/svg?seed=&backgroundColor=FFFFFF&clothing=variant12&clothingColor=ff6f69&hair=short19&hairColor=6E260E&skinColor=ffdbac&glasses=dark01&glassesColor=4b4b4b&glassesProbability=0&accessories=variant01&accessoriesColor=a9a9a9&accessoriesProbability=0&mouth=happy09&mouthColor=c98276&eyes=variant01&eyesColor=5b7c8b";
        $user -> save();

        //When migrating it will always create this test user 2
        $user = new User;
        $user -> name = strtolower("codexpert_test2");
        $user -> email = strtolower("codexpert_test2@codexpert.com");
        $user -> password = Hash::make("Qwerty123456.");
        $user -> avatar = "https://api.dicebear.com/5.x/pixel-art/svg?seed=&backgroundColor=FFFFFF&clothing=variant12&clothingColor=ff6f69&hair=short19&hairColor=6E260E&skinColor=ffdbac&glasses=dark01&glassesColor=4b4b4b&glassesProbability=0&accessories=variant01&accessoriesColor=a9a9a9&accessoriesProbability=0&mouth=happy09&mouthColor=c98276&eyes=variant01&eyesColor=5b7c8b";
        $user -> save();        

        //Create the first game for testing purposes
        $newGame = new Game;
        $newGame -> save();

        //Add question 1 to the game
        $gameQuestion = new Game_question;
        $gameQuestion -> game_id = 1;
        $gameQuestion -> question_id = 1;
        $gameQuestion -> save();

        //Add question 2 to the game
        $gameQuestion = new Game_question;
        $gameQuestion -> game_id = 1;
        $gameQuestion -> question_id = 2;
        $gameQuestion -> save();

        //Relate the user 1 to the game 1
        $newUserGame = new User_game;
        $newUserGame -> game_id = 1;
        $newUserGame -> user_id = 1;
        $newUserGame -> save();

        //Add testing user for teachers
        $user = new User;
        $user -> name = strtolower("pdaw");
        $user -> email = strtolower("pdaw@inspedralbes.cat");
        $user -> password = Hash::make("Pdaw2023!");
        $user -> save();

    }
}
