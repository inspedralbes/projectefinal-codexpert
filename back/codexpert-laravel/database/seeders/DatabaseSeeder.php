<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Question;

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
        $question -> userExpectedInput = serialize(array( 3, 7, 5 ));
        $question -> userExpectedOutput = serialize(array( 3, 5, 7 ));
        $question -> testInput1 = serialize(array( 10, 3, 7 ));
        $question -> testOutput1 = serialize(array( 3, 7, 10 ));
        $question -> testInput2 = serialize(array( 6, 2, 8 ));
        $question -> testOutput2 = serialize(array( 2, 6, 8 ));
        $question -> save();

        //Example 2
        $question = new Question;
        $question -> statement = "Reverse the String";
        $question -> userExpectedInput = serialize("Hello");
        $question -> userExpectedOutput = serialize("olleH");
        $question -> testInput1 = serialize("Howdy");
        $question -> testOutput1 = serialize("ydwoH");
        $question -> testInput2 = serialize("Greetings from Earth");
        $question -> testOutput2 = serialize("htraE morf sgniteerG");
        $question -> save();

        //Example 3
        $question = new Question;
        $question -> statement = "Reverse the given Array";
        $question -> userExpectedInput = serialize(array( 3, 7, 2, 4 ));
        $question -> userExpectedOutput = serialize(array( 4, 2, 7, 3 ));
        $question -> testInput1 = serialize(array( 5, 1, 4, 2, 3 ));
        $question -> testOutput1 = serialize(array( 3, 2, 4, 1, 5 ));
        $question -> testInput2 = serialize(array( 7, 12, 3 ));
        $question -> testOutput2 = serialize(array( 3, 12, 7 ));
        $question -> save();
        
        //Example 4
        $question = new Question;
        $question -> statement = "Count number of odd numers in the Array";
        $question -> userExpectedInput = serialize(array( 21, 32, 47, 52, 63 ));
        $question -> userExpectedOutput = serialize(3);
        $question -> testInput1 = serialize(array( -3, 80, 2 ));
        $question -> testOutput1 = serialize(1);
        $question -> testInput2 = serialize(array( 42, 8, 58, 8 ));
        $question -> testOutput2 = serialize(0);
        $question -> save();
        
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
        $question = new Question;
        $question -> statement = "Sort Array in ASCENDING order";
        $question -> userExpectedInput = serialize(array( 3, 7, 5 ));
        $question -> userExpectedOutput = serialize(array( 3, 5, 7 ));
        $question -> testInput1 = serialize(array( 10, 3, 7 ));
        $question -> testOutput1 = serialize(array( 3, 7, 10 ));
        $question -> testInput2 = serialize(array( 6, 2, 8 ));
        $question -> testOutput2 = serialize(array( 2, 6, 8 ));
        $question -> save();
    }
}
