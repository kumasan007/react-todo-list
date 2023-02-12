<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\ApiAuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// 認証ミドルウェア
Route::group(['middleware' => 'auth:sanctum'], function () {
    Route::apiResource('/v1/tasks', TaskController::class);
});

// 認証コントローラ
Route::post('/v1/register', [ApiAuthController::class, 'register']);
Route::post('/v1/login', [ApiAuthController::class, 'login']);
Route::post('/v1/logout', [ApiAuthController::class, 'logout']);
