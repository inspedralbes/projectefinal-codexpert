<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FriendController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\TutorialController;
use App\Http\Controllers\NPCController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::group(['middleware' => ['web']], function () {
    Route::post('/register', [AuthController::class, 'register']); 

    Route::post('/login', [AuthController::class, 'login']); 

    Route::post('/isUserLogged', [AuthController::class, 'isUserLogged']);
    
    Route::post('/getUserInfo', [AuthController::class, 'getUserInfo']);    

    Route::post('/changeEmail', [UserController::class, 'changeEmail']);

    Route::post('/changePassword', [UserController::class, 'changePassword']);

    Route::post('/changeUsername', [UserController::class, 'changeUsername']);

    Route::post('/getAvatarFromOtherUser', [UserController::class, 'getAvatarFromOtherUser']);
    
    Route::post('/getAvatar', [UserController::class, 'getAvatar']);

    Route::post('/setAvatar', [UserController::class, 'setAvatar']);

    Route::post('/getUserData', [UserController::class, 'getUserData']); 

    Route::post('/getUserDataFromId', [UserController::class, 'getUserDataFromId']);    

    Route::post('/getAllQuestions', [GameController::class, 'getAllQuestions']);
    
    Route::post('/startGame', [GameController::class, 'startGame']);

    Route::post('/setUserGame', [GameController::class, 'setUserGame']);

    Route::post('/checkAnswer', [GameController::class, 'checkAnswer']);

    Route::post('/updateUserLvl', [GameController::class, 'updateUserLvl']);

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/ranking/{id}', [GameController::class, 'getRanking']);
    
    Route::post('/setExpertise', [TutorialController::class, 'setExpertise']);

    Route::post('/getTutorials', [TutorialController::class, 'getTutorials']);

    Route::post('/getTutorialFromId', [TutorialController::class, 'getTutorialFromId']);

    Route::post('/checkTutorialAnswer', [TutorialController::class, 'checkAnswer']);

    Route::post('/setUserTutorial', [TutorialController::class, 'setUserTutorial']);

    Route::post('/addNewQuestion', [GameController::class, 'addNewQuestion']);
    
    Route::post('/checkTutorialPassed', [TutorialController::class, 'checkTutorialPassed']);

    Route::post('/getMyQuestions', [GameController::class, 'getMyQuestions']);

    Route::post('/getMyQuestionWithId', [GameController::class, 'getMyQuestionWithId']);

    Route::post('/editMyQuestion', [GameController::class, 'editMyQuestion']);

    Route::post('/deleteMyQuestion', [GameController::class, 'deleteMyQuestion']);

    Route::post('/addFriend', [FriendController::class, 'addFriend']);

    Route::post('/acceptFriend', [FriendController::class, 'acceptFriend']);
    
    Route::post('/declineFriend', [FriendController::class, 'declineFriend']);    

    Route::post('/removeFriend', [FriendController::class, 'removeFriend']);  
    
    Route::post('/getFriendlist', [FriendController::class, 'getFriendlist']);  

    Route::post('/getPendingRequests', [FriendController::class, 'getPendingRequests']);  
    
    Route::post('/markNotificationsAsRead', [FriendController::class, 'markNotificationsAsRead']);  

    Route::post('/getAllNPCS', [NPCController::class, 'getAllNPCS']);  

    Route::post('/setSpokenToNPC', [NPCController::class, 'setSpokenToNPC']);  
});