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


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});



Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('tasks', TaskController::class, ['except' => ['show', 'update', 'destroy']]);
    Route::get('/tasks/{id}', [TaskController::class, 'show'])->where('id', '[0-9]+');
    Route::put('/tasks/{id}', [TaskController::class, 'update'])->where('id', '[0-9]+');
    Route::delete('/tasks/{id}', [TaskController::class, 'destroy'])->where('id', '[0-9]+');
    Route::any('/logout', [TaskController::class, 'returnNotAllowed']);
    Route::delete('/logout', [ApiAuthController::class, 'logout']);
    Route::get('/logout', [TaskController::class, 'returnNotFound']);
});

Route::post('/register', [ApiAuthController::class, 'register']);
Route::post('/login', [ApiAuthController::class, 'login']);

Route::any('/{any}', [TaskController::class, 'returnNotAllowed'])->where('any', 'logout|register|login|tasks');
Route::get('/{any}', [TaskController::class, 'returnNotFound'])->where('any', '\S*');

Route::any('/tasks/{any}', [TaskController::class, 'returnNotAllowed'])->where('any', '\S*');
Route::get('/tasks/{any}', [TaskController::class, 'returnNotFound'])->where('any', '\S*');
