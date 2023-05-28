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
use App\Models\Npc;
use App\Models\Dialogue;
use App\Models\Tutorial_question;
use App\Models\Tutorial_test_input;
use App\Models\Tutorial_test_output;
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
        //Migrations for default questions
        {
            //Example 1
            $question = new Question;
            $question->title = "Array sort";
            $question->statement = "Sort Array in ASCENDING order";
            $question->public = true;
            $question->save();
            //Input 1
            $input = new Test_input;
            $input->question_id = 1;
            $input->input = serialize(array(3, 7, 5));
            $input->save();
            //Input 2
            $input = new Test_input;
            $input->question_id = 1;
            $input->input = serialize(array(10, 3, 7));
            $input->save();
            //Input 3
            $input = new Test_input;
            $input->question_id = 1;
            $input->input = serialize(array(6, 2, 8));
            $input->save();
            //Output 1
            $output = new Test_output;
            $output->question_id = 1;
            $output->output = serialize(array(3, 5, 7));
            $output->save();
            //Output 2
            $output = new Test_output;
            $output->question_id = 1;
            $output->output = serialize(array(3, 7, 10));
            $output->save();
            //Output 3
            $output = new Test_output;
            $output->question_id = 1;
            $output->output = serialize(array(2, 6, 8));
            $output->save();


            //Example 2
            $question = new Question;
            $question->title = "Array Addition";
            $question->statement = "Given an array of integers, find the sum of its elements";
            $question->public = true;
            $question->save();
            //Input 1
            $input = new Test_input;
            $input->question_id = 2;
            $input->input = serialize(array(1, 2));
            $input->save();
            //Input 2
            $input = new Test_input;
            $input->question_id = 2;
            $input->input = serialize(array(45, 10));
            $input->save();
            //Input 3
            $input = new Test_input;
            $input->question_id = 2;
            $input->input = serialize(array(90, 90));
            $input->save();
            //Output 1
            $output = new Test_output;
            $output->question_id = 2;
            $output->output = serialize(3);
            $output->save();
            //Output 2
            $output = new Test_output;
            $output->question_id = 2;
            $output->output = serialize(55);
            $output->save();
            //Output 3
            $output = new Test_output;
            $output->question_id = 2;
            $output->output = serialize(180);
            $output->save();


            //Example 3
            $question = new Question;
            $question->title = "Array reverse";
            $question->statement = "Reverse the given Array";
            $question->public = true;
            $question->save();
            //Input 1
            $input = new Test_input;
            $input->question_id = 3;
            $input->input = serialize(array(3, 7, 2, 4));
            $input->save();
            //Input 2
            $input = new Test_input;
            $input->question_id = 3;
            $input->input = serialize(array(5, 1, 4, 2, 3));
            $input->save();
            //Input 3
            $input = new Test_input;
            $input->question_id = 3;
            $input->input = serialize(array(7, 12, 3));
            $input->save();
            //Output 1
            $output = new Test_output;
            $output->question_id = 3;
            $output->output = serialize(array(4, 2, 7, 3));
            $output->save();
            //Output 2
            $output = new Test_output;
            $output->question_id = 3;
            $output->output = serialize(array(3, 2, 4, 1, 5));
            $output->save();
            //Output 3
            $output = new Test_output;
            $output->question_id = 3;
            $output->output = serialize(array(3, 12, 7));
            $output->save();


            //Example 4
            $question = new Question;
            $question->title = "Count odd numbers";
            $question->statement = "Count number of odd numers in the Array";
            $question->public = true;
            $question->save();
            //Input 1
            $input = new Test_input;
            $input->question_id = 4;
            $input->input = serialize(array(21, 32, 47, 52, 63));
            $input->save();
            //Input 2
            $input = new Test_input;
            $input->question_id = 4;
            $input->input = serialize(array(-3, 80, 2));
            $input->save();
            //Input 3
            $input = new Test_input;
            $input->question_id = 4;
            $input->input = serialize(array(42, 8, 58, 8));
            $input->save();
            //Output 1
            $output = new Test_output;
            $output->question_id = 4;
            $output->output = serialize(3);
            $output->save();
            //Output 2
            $output = new Test_output;
            $output->question_id = 4;
            $output->output = serialize(1);
            $output->save();
            //Output 3
            $output = new Test_output;
            $output->question_id = 4;
            $output->output = serialize(0);
            $output->save();

            //Example 5
            $question = new Question;
            $question->title = "Biggest Array Element";
            $question->statement = "Find the biggest element in the given array.";
            $question->public = true;
            $question->save();
            //Input 1
            $input = new Test_input;
            $input->question_id = 5;
            $input->input = serialize(array(1, 14, 6));
            $input->save();
            //Input 2
            $input = new Test_input;
            $input->question_id = 5;
            $input->input = serialize(array(78, 111, 39));
            $input->save();
            //Input 3
            $input = new Test_input;
            $input->question_id = 5;
            $input->input = serialize(array(1, 2, 3));
            $input->save();
            //Output 1
            $output = new Test_output;
            $output->question_id = 5;
            $output->output = serialize(14);
            $output->save();
            //Output 2
            $output = new Test_output;
            $output->question_id = 5;
            $output->output = serialize(111);
            $output->save();
            //Output 3
            $output = new Test_output;
            $output->question_id = 5;
            $output->output = serialize(3);
            $output->save();

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
        }

        //Test users migrations
        {
            //Test user 1
            $user = new User;
            $user->name = strtolower("codexpert_test");
            $user->email = strtolower("codexpert_test@codexpert.com");
            $user->password = Hash::make("Qwerty123456.");
            $user->avatar = "https://api.dicebear.com/5.x/pixel-art/svg?seed=&backgroundColor=FFFFFF&clothing=variant12&clothingColor=ff6f69&hair=short19&hairColor=6E260E&skinColor=ffdbac&glasses=dark01&glassesColor=4b4b4b&glassesProbability=0&accessories=variant01&accessoriesColor=a9a9a9&accessoriesProbability=0&mouth=happy09&mouthColor=c98276&eyes=variant01&eyesColor=5b7c8b";
            $user->save();

            //Test user 2            
            $user = new User;
            $user->name = strtolower("codexpert_test2");
            $user->email = strtolower("codexpert_test2@codexpert.com");
            $user->password = Hash::make("Qwerty123456.");
            $user->avatar = "https://api.dicebear.com/5.x/pixel-art/svg?seed=&backgroundColor=FFFFFF&clothing=variant12&clothingColor=ff6f69&hair=short19&hairColor=6E260E&skinColor=ffdbac&glasses=dark01&glassesColor=4b4b4b&glassesProbability=0&accessories=variant01&accessoriesColor=a9a9a9&accessoriesProbability=0&mouth=happy09&mouthColor=c98276&eyes=variant01&eyesColor=5b7c8b";
            $user->save();

            //Add testing user for teachers
            $user = new User;
            $user->name = strtolower("pdaw");
            $user->email = strtolower("pdaw@inspedralbes.cat");
            $user->password = Hash::make("Pdaw2023!");
            $user->save();
        }

        //Add game 1 with questions and player 1 related
        {
            //Create the first game for testing purposes
            $newGame = new Game;
            $newGame->save();

            //Add question 1 to the game
            $gameQuestion = new Game_question;
            $gameQuestion->game_id = 1;
            $gameQuestion->question_id = 1;
            $gameQuestion->save();

            //Add question 2 to the game
            $gameQuestion = new Game_question;
            $gameQuestion->game_id = 1;
            $gameQuestion->question_id = 2;
            $gameQuestion->save();

            //Relate the user 1 to the game 1
            $newUserGame = new User_game;
            $newUserGame->game_id = 1;
            $newUserGame->user_id = 1;
            $newUserGame->save();
        }

        //Migrations for tutorial questions
        //Migrations for default questions
        {
            //Level 1
            $tutorial_question = new Tutorial_question;
            $tutorial_question->title = "INTRODUCTION TO VARIABLES";
            $tutorial_question->statement = 'For this level, declare a variable using <span className=\'word__blue\'>let</span> and assign "Hello World!" to it. Then return your variable.';
            $tutorial_question->save();
            //Input 1
            $input = new Tutorial_test_input;
            $input->question_id = 1;
            $input->input = serialize('"Example Input"');
            $input->save();
            //Input 2
            $input = new Tutorial_test_input;
            $input->question_id = 1;
            $input->input = serialize('"Example Input"');
            $input->save();
            //Input 3
            $input = new Tutorial_test_input;
            $input->question_id = 1;
            $input->input = serialize('"Example Input"');
            $input->save();
            //Output 1
            $output = new Tutorial_test_output;
            $output->question_id = 1;
            $output->output = serialize('"Hello World!"');
            $output->save();
            //Output 2
            $output = new Tutorial_test_output;
            $output->question_id = 1;
            $output->output = serialize('"Hello World!"');
            $output->save();
            //Output 3
            $output = new Tutorial_test_output;
            $output->question_id = 1;
            $output->output = serialize('"Hello World!"');
            $output->save();

            //Level 2
            $tutorial_question = new Tutorial_question;
            $tutorial_question->title = "ARITHMETIC OPERATORS";
            $tutorial_question->statement = "For this level, declare a variable, with whatever name you like. Then, add 3 to this variable, and then add the value of our input to it.";
            $tutorial_question->hint = "First you need to declare a variable, then use the assign operator from lesson 0 to assign 3 to it. And then using the addition operator add the variable input.";
            $tutorial_question->save();
            //Input 1
            $input = new Tutorial_test_input;
            $input->question_id = 2;
            $input->input = serialize(9);
            $input->save();
            //Input 2
            $input = new Tutorial_test_input;
            $input->question_id = 2;
            $input->input = serialize(1);
            $input->save();
            //Input 3
            $input = new Tutorial_test_input;
            $input->question_id = 2;
            $input->input = serialize(2);
            $input->save();
            //Output 1
            $output = new Tutorial_test_output;
            $output->question_id = 2;
            $output->output = serialize(12);
            $output->save();
            //Output 2
            $output = new Tutorial_test_output;
            $output->question_id = 2;
            $output->output = serialize(4);
            $output->save();
            //Output 3
            $output = new Tutorial_test_output;
            $output->question_id = 2;
            $output->output = serialize(5);
            $output->save();


            //Example 3
            $tutorial_question = new Tutorial_question;
            $tutorial_question->title = "CONDITIONAL STATEMENTS";
            $tutorial_question->statement = "For this level, using the conditional statements if and else, and the comparison operator, declare a variable using let (choose whatever name you like) and assign true if input is 1, else, assign false to it.";
            $tutorial_question->hint = "To assign true or false, we simply write example = true, we don’t need to use quotation marks for true or false because they are a boolean expression, not a string.";
            $tutorial_question->save();
            //Input 1
            $input = new Tutorial_test_input;
            $input->question_id = 3;
            $input->input = serialize(4);
            $input->save();
            //Input 2
            $input = new Tutorial_test_input;
            $input->question_id = 3;
            $input->input = serialize(1);
            $input->save();
            //Input 3
            $input = new Tutorial_test_input;
            $input->question_id = 3;
            $input->input = serialize(0);
            $input->save();
            //Output 1
            $output = new Tutorial_test_output;
            $output->question_id = 3;
            $output->output = serialize(false);
            $output->save();
            //Output 2
            $output = new Tutorial_test_output;
            $output->question_id = 3;
            $output->output = serialize(true);
            $output->save();
            //Output 3
            $output = new Tutorial_test_output;
            $output->question_id = 3;
            $output->output = serialize(false);
            $output->save();


            //Level 4
            $tutorial_question = new Tutorial_question;
            $tutorial_question->title = "INTRODUCTION TO ARRAYS";
            $tutorial_question->statement = "Given an array of colors, return the third element of the given array. Remember to use the variable input!";
            $tutorial_question->hint = "Remember that the index of arrays starts counting on 0, therefore the first element of an array is not index = 1 but index = 0.";
            $tutorial_question->save();
            //Input 1
            $input = new Tutorial_test_input;
            $input->question_id = 4;
            $input->input = serialize(array("blue", "red", "green"));
            $input->save();
            //Input 2
            $input = new Tutorial_test_input;
            $input->question_id = 4;
            $input->input = serialize(array("blue", "green", "red"));
            $input->save();
            //Input 3
            $input = new Tutorial_test_input;
            $input->question_id = 4;
            $input->input = serialize(array("red", "green", "blue"));
            $input->save();
            //Output 1
            $output = new Tutorial_test_output;
            $output->question_id = 4;
            $output->output = serialize("green");
            $output->save();
            //Output 2
            $output = new Tutorial_test_output;
            $output->question_id = 4;
            $output->output = serialize("red");
            $output->save();
            //Output 3
            $output = new Tutorial_test_output;
            $output->question_id = 4;
            $output->output = serialize("blue");
            $output->save();


            //Level 5
            $tutorial_question = new Tutorial_question;
            $tutorial_question->title = "INTRODUCTION TO LOOPS";
            $tutorial_question->statement = "The length of an array determines the amount of elements that there are in an array. To get the length of an array we use input.length, where example is the name of the array. Determine the length of the array input and add up all the numbers inside the array, use whatever form of loop you like the most!";
            $tutorial_question->hint = "First we need to determine the length of the array with input.length. We can save this length in a variable for example. We want to declare another variable where we will add each number of the array inside, we can name it for example additionVariable. What we want to do is, execute the addition code inside a loop, get the current value from the variable additionVariable and add the current value from the array with input[i] where i is the index that will increment each time the code is executed, like in the examples shown before. Our starting point will be 0 and our ending point will be the input.length.";
            $tutorial_question->save();
            //Input 1
            $input = new Tutorial_test_input;
            $input->question_id = 5;
            $input->input = serialize(array(1, 2, 3));
            $input->save();
            //Input 2
            $input = new Tutorial_test_input;
            $input->question_id = 5;
            $input->input = serialize(array(1, 1, 1, 2));
            $input->save();
            //Input 3
            $input = new Tutorial_test_input;
            $input->question_id = 5;
            $input->input = serialize(array(7, 3));
            $input->save();
            //Output 1
            $output = new Tutorial_test_output;
            $output->question_id = 5;
            $output->output = serialize(6);
            $output->save();
            //Output 2
            $output = new Tutorial_test_output;
            $output->question_id = 5;
            $output->output = serialize(5);
            $output->save();
            //Output 3
            $output = new Tutorial_test_output;
            $output->question_id = 5;
            $output->output = serialize(10);
            $output->save();

            //Level 6
            $tutorial_question = new Tutorial_question;
            $tutorial_question->title = "CHALLENGE YOURSELF";
            $tutorial_question->statement = "Given an array of random numbers and length, using length, a loop and conditional statements, return how many times the number 3 is in the array. Remember to use the variable input!";
            $tutorial_question->save();
            //Input 1
            $input = new Tutorial_test_input;
            $input->question_id = 6;
            $input->input = serialize(array(7, 3, 2, 1, 3));
            $input->save();
            //Input 2
            $input = new Tutorial_test_input;
            $input->question_id = 6;
            $input->input = serialize(array(4, 1, 2));
            $input->save();
            //Input 3
            $input = new Tutorial_test_input;
            $input->question_id = 6;
            $input->input = serialize(array(3, 1, 2));
            $input->save();
            //Output 1
            $output = new Tutorial_test_output;
            $output->question_id = 6;
            $output->output = serialize(2);
            $output->save();
            //Output 2
            $output = new Tutorial_test_output;
            $output->question_id = 6;
            $output->output = serialize(0);
            $output->save();
            //Output 3
            $output = new Tutorial_test_output;
            $output->question_id = 6;
            $output->output = serialize(1);
            $output->save();
        }

        //Migrations for NPcs
        {
            //NPC 1
            { {
                    //Dialogue 1                    
                    $newNPC = new npc;
                    $newNPC->name = "Gaspar";
                    $newNPC->introduction = "Hi! My name is Gaspar. I love NodeJS :D";
                    $newNPC->save();

                    $newDialogueOption = new Dialogue;
                    $newDialogueOption->npc_id = $newNPC->id;
                    $newDialogueOption->sentence = "Did you know you could sort arrays with array.sort()?";
                    $newDialogueOption->save();

                    $newDialogueOption = new Dialogue;
                    $newDialogueOption->npc_id = $newNPC->id;
                    $newDialogueOption->sentence = "You can also declare variables with \"const\", but be careful! These cannot be changed!";
                    $newDialogueOption->save();
                } {
                    //Dialogue 2
                    $newNPC = new npc;
                    $newNPC->name = "Alessia";
                    $newNPC->introduction = "Welcome to CodeWorld! My name is Alessia, nice to meet you!";
                    $newNPC->save();

                    $newDialogueOption = new Dialogue;
                    $newDialogueOption->npc_id = $newNPC->id;
                    $newDialogueOption->sentence = "I've been hearing the old man down there for two whole months screaming his lungs out...";
                    $newDialogueOption->save();

                    $newDialogueOption = new Dialogue;
                    $newDialogueOption->npc_id = $newNPC->id;
                    $newDialogueOption->sentence = "You can convert string into uppercase characters with stringExample.toUpperCase()!";
                    $newDialogueOption->save();

                    $newDialogueOption = new Dialogue;
                    $newDialogueOption->npc_id = $newNPC->id;
                    $newDialogueOption->sentence = "You can convert string into lowercase characters with stringExample.toLowerCase()!";
                    $newDialogueOption->save();
                } {
                    //Dialogue 3
                    $newNPC = new npc;
                    $newNPC->name = "Paul";
                    $newNPC->introduction = "Hey you!! I'm The Fearless Paul, get away!";
                    $newNPC->save();

                    $newDialogueOption = new Dialogue;
                    $newDialogueOption->npc_id = $newNPC->id;
                    $newDialogueOption->sentence = "If I was Code World's leader, we would have voice chat!";
                    $newDialogueOption->save();

                    $newDialogueOption = new Dialogue;
                    $newDialogueOption->npc_id = $newNPC->id;
                    $newDialogueOption->sentence = "I told them that a voice chat wasn't that hard, but they didn't even try... Fools!!";
                    $newDialogueOption->save();

                    $newDialogueOption = new Dialogue;
                    $newDialogueOption->npc_id = $newNPC->id;
                    $newDialogueOption->sentence = "What are you still bothering me for? I'm a Senior. I'm not interested in your childish games.";
                    $newDialogueOption->save();

                    $newDialogueOption = new Dialogue;
                    $newDialogueOption->npc_id = $newNPC->id;
                    $newDialogueOption->sentence = "Keep quiet... I'm planning to take control of Code World and make the voice chat by myself.";
                    $newDialogueOption->save();
                } {
                    //Dialogue 4
                    $newNPC = new npc;
                    $newNPC->name = "Marti";
                    $newNPC->introduction = "Hey traveler, planning to live here? I'm Marti, nice to meet you!";
                    $newNPC->save();

                    $newDialogueOption = new Dialogue;
                    $newDialogueOption->npc_id = $newNPC->id;
                    $newDialogueOption->sentence = "I think React is way better than Vue or Angular.";
                    $newDialogueOption->save();

                    $newDialogueOption = new Dialogue;
                    $newDialogueOption->npc_id = $newNPC->id;
                    $newDialogueOption->sentence = "Arrow functions don't have their own bindings to \"this\", \"arguments\", or \"super\"";
                    $newDialogueOption->save();

                    $newDialogueOption = new Dialogue;
                    $newDialogueOption->npc_id = $newNPC->id;
                    $newDialogueOption->sentence = "You can use regular expressions to check if a string validates!";
                    $newDialogueOption->save();

                    $newDialogueOption = new Dialogue;
                    $newDialogueOption->npc_id = $newNPC->id;
                    $newDialogueOption->sentence = "The old man down there tried to create a tournament all by himself, but he didn't get away with it!";
                    $newDialogueOption->save();
                } {
                    //Dialogue 5
                    $newNPC = new npc;
                    $newNPC->name = "Iker";
                    $newNPC->introduction = "Hey there, I see you're new here! Welcome to my farm, I'm Iker.";
                    $newNPC->save();

                    $newDialogueOption = new Dialogue;
                    $newDialogueOption->npc_id = $newNPC->id;
                    $newDialogueOption->sentence = "As you can see, I produce most part of the energy and supplies in Code World.";
                    $newDialogueOption->save();

                    $newDialogueOption = new Dialogue;
                    $newDialogueOption->npc_id = $newNPC->id;
                    $newDialogueOption->sentence = "Did you know that the some() method tests whether at least one element in the array passes the test implemented by the provided function?";
                    $newDialogueOption->save();

                    $newDialogueOption = new Dialogue;
                    $newDialogueOption->npc_id = $newNPC->id;
                    $newDialogueOption->sentence = "I'm not a switch statement enthusiast, I just prefer using if-else like in my childhood!";
                    $newDialogueOption->save();
                } {
                    //Dialogue 6
                    $newNPC = new npc;
                    $newNPC->name = "Kenny";
                    $newNPC->introduction = "Hi!, I'm Kenny.";
                    $newNPC->save();

                    $newDialogueOption = new Dialogue;
                    $newDialogueOption->npc_id = $newNPC->id;
                    $newDialogueOption->sentence = "You cannot enter the city until you complete the challenges of the house next to me!";
                    $newDialogueOption->save();

                    $newDialogueOption = new Dialogue;
                    $newDialogueOption->npc_id = $newNPC->id;
                    $newDialogueOption->sentence = "We will test your programming skills before allowing you to enter.";
                    $newDialogueOption->save();

                    $newDialogueOption = new Dialogue;
                    $newDialogueOption->npc_id = $newNPC->id;
                    $newDialogueOption->sentence = "Don't worry, you can fail as much as you want, no one will judge you!";
                    $newDialogueOption->save();
                } {
                    //Dialogue 7
                    $newNPC = new npc;
                    $newNPC->name = "Lars";
                    $newNPC->introduction = "Hi!, I'm Lars, the shop keeper.";
                    $newNPC->save();

                    $newDialogueOption = new Dialogue;
                    $newDialogueOption->npc_id = $newNPC->id;
                    $newDialogueOption->sentence = "We're closed until further notice.";
                    $newDialogueOption->save();

                    $newDialogueOption = new Dialogue;
                    $newDialogueOption->npc_id = $newNPC->id;
                    $newDialogueOption->sentence = "We used to sell themes for the competitive mode...";
                    $newDialogueOption->save();

                    $newDialogueOption = new Dialogue;
                    $newDialogueOption->npc_id = $newNPC->id;
                    $newDialogueOption->sentence = "I'm sorry, come back later!";
                    $newDialogueOption->save();
                } {
                    //Dialogue 8
                    $newNPC = new npc;
                    $newNPC->name = "Iris";
                    $newNPC->introduction = "Hey, I'm Iris, nice to meet you.";
                    $newNPC->save();

                    $newDialogueOption = new Dialogue;
                    $newDialogueOption->npc_id = $newNPC->id;
                    $newDialogueOption->sentence = "You can find your house at the first right turn.";
                    $newDialogueOption->save();

                    $newDialogueOption = new Dialogue;
                    $newDialogueOption->npc_id = $newNPC->id;
                    $newDialogueOption->sentence = "You can find the competitive mode in the building located in the city center!";
                    $newDialogueOption->save();

                    $newDialogueOption = new Dialogue;
                    $newDialogueOption->npc_id = $newNPC->id;
                    $newDialogueOption->sentence = "I've been waiting for weeks for the market to reopen...";
                    $newDialogueOption->save();
                } {
                    //Dialogue 9
                    $newNPC = new npc;
                    $newNPC->name = "Asmae";
                    $newNPC->introduction = "Hello World,... I mean Hey! I'm Asmae, nice to meet you.";
                    $newNPC->save();

                    $newDialogueOption = new Dialogue;
                    $newDialogueOption->npc_id = $newNPC->id;
                    $newDialogueOption->sentence = "I've been coding for 9 hours straight, can't think properly.";
                    $newDialogueOption->save();

                    $newDialogueOption = new Dialogue;
                    $newDialogueOption->npc_id = $newNPC->id;
                    $newDialogueOption->sentence = "Be careful with Javascript array sort method... It's tricky.";
                    $newDialogueOption->save();

                    $newDialogueOption = new Dialogue;
                    $newDialogueOption->npc_id = $newNPC->id;
                    $newDialogueOption->sentence = "Some people like using W3Schools, I personally prefer using Mozilla Developer Network";
                    $newDialogueOption->save();
                } {
                    //Dialogue 10
                    $newNPC = new npc;
                    $newNPC->name = "Aitor";
                    $newNPC->introduction = "Yoo! I'm Aitor!!";
                    $newNPC->save();

                    $newDialogueOption = new Dialogue;
                    $newDialogueOption->npc_id = $newNPC->id;
                    $newDialogueOption->sentence = "I love taking care of the farm with Alessia! :D";
                    $newDialogueOption->save();

                    $newDialogueOption = new Dialogue;
                    $newDialogueOption->npc_id = $newNPC->id;
                    $newDialogueOption->sentence = "I barely managed to complete the tutorial before entering, even though I don't like programming...";
                    $newDialogueOption->save();

                    $newDialogueOption = new Dialogue;
                    $newDialogueOption->npc_id = $newNPC->id;
                    $newDialogueOption->sentence = "Maybe I'll try the competitive mode anyway.";
                    $newDialogueOption->save();
                } {
                    //Dialogue 11
                    $newNPC = new npc;
                    $newNPC->name = "???";
                    $newNPC->introduction = "What are you doing here?";
                    $newNPC->save();

                    $newDialogueOption = new Dialogue;
                    $newDialogueOption->npc_id = $newNPC->id;
                    $newDialogueOption->sentence = "Just leave me alone.";
                    $newDialogueOption->save();

                    $newDialogueOption = new Dialogue;
                    $newDialogueOption->npc_id = $newNPC->id;
                    $newDialogueOption->sentence = "Could you give me some space, please?";
                    $newDialogueOption->save();

                    $newDialogueOption = new Dialogue;
                    $newDialogueOption->npc_id = $newNPC->id;
                    $newDialogueOption->sentence = "I would appreciate it if you left me alone.";
                    $newDialogueOption->save();
                } {
                    //Dialogue 12
                    $newNPC = new npc;
                    $newNPC->name = "Strawberry";
                    $newNPC->introduction = "What's up!! I'm Strawberry";
                    $newNPC->save();

                    $newDialogueOption = new Dialogue;
                    $newDialogueOption->npc_id = $newNPC->id;
                    $newDialogueOption->sentence = "Happiness is a choice, so choose to be happy!";
                    $newDialogueOption->save();

                    $newDialogueOption = new Dialogue;
                    $newDialogueOption->npc_id = $newNPC->id;
                    $newDialogueOption->sentence = "May your day be filled with joy and laughter.";
                    $newDialogueOption->save();

                    $newDialogueOption = new Dialogue;
                    $newDialogueOption->npc_id = $newNPC->id;
                    $newDialogueOption->sentence = "Wishing you a lifetime of happiness and success.";
                    $newDialogueOption->save();
                }
            }
        }
    }
}
