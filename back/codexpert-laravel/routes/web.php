<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\GameController;
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

Route::get('/', function () {
    return view('welcome');
});

Route::group(['middleware' => ['web']], function () {
    Route::post('/register', [AuthController::class, 'register']); 

    Route::post('/login', [AuthController::class, 'login']); 

    Route::post('/isUserLogged', [AuthController::class, 'isUserLogged']);
    
    Route::post('/getUserInfo', [AuthController::class, 'getUserInfo']);    

    Route::post('/changeEmail', [UserController::class, 'changeEmail']);

    Route::post('/changePassword', [UserController::class, 'changePassword']);

    Route::post('/changeUsername', [UserController::class, 'changeUsername']);
    
    Route::post('/getAvatar', [UserController::class, 'getAvatar']);

    Route::post('/setAvatar', [UserController::class, 'setAvatar']);

    Route::post('/getUserData', [UserController::class, 'getUserData']);

    Route::post('/startGame', [GameController::class, 'startGame']);

    Route::post('/setUserGame', [GameController::class, 'setUserGame']);

    Route::post('/checkAnswer', [GameController::class, 'checkAnswer']);

    Route::post('/updateUserLvl', [GameController::class, 'updateUserLvl']);

    Route::post('/logout', [AuthController::class, 'logout']);
});