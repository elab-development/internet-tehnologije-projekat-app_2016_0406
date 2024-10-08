<?php

use App\Http\Controllers\AdminController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\DocumentTagController;
use App\Http\Controllers\TagController;

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


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');



Route::middleware('auth:sanctum')->group(function () {

    Route::get('/documents/{document}/tags', [DocumentController::class, 'getTags']);
    Route::post('/documents/{document}/tags', [DocumentController::class, 'addTag']);
    Route::delete('/tags/{tag}', [DocumentController::class, 'removeTag']);



    Route::get('/documents', [DocumentController::class, 'index']);
    Route::post('/documents', [DocumentController::class, 'store']);
    Route::get('/documents/{id}', [DocumentController::class, 'show']);
    Route::put('/documents/{id}', [DocumentController::class, 'update']);
    Route::delete('/documents/{id}', [DocumentController::class, 'destroy']);
    Route::get('/documents/search', [DocumentController::class, 'search']); // Ruta za pretragu

    Route::get('/document-tags', [DocumentTagController::class, 'index']);
    Route::post('/document-tags', [DocumentTagController::class, 'store']);
    Route::get('/document-tags/{id}', [DocumentTagController::class, 'show']);
    Route::put('/document-tags/{id}', [DocumentTagController::class, 'update']);
    Route::delete('/document-tags/{id}', [DocumentTagController::class, 'destroy']);

    Route::get('/tags', [TagController::class, 'index']);
    Route::post('/tags', [TagController::class, 'store']);
    Route::get('/tags/{id}', [TagController::class, 'show']);
    Route::put('/tags/{id}', [TagController::class, 'update']);
    Route::delete('/tags/{id}', [TagController::class, 'destroy']);


    
    Route::post('/comments', [CommentController::class, 'store']);
    Route::get('/comments/{id}', [CommentController::class, 'index']);  //vraca sve komentare za odredjeni dokument
    Route::put('/comments/{id}', [CommentController::class, 'update']);
    Route::delete('/comments/{id}', [CommentController::class, 'destroy']);

    Route::get('download', [DocumentController::class, 'download']);



});
Route::middleware('auth:sanctum')->get('/admin/users', [AdminController::class, 'getUsers']);
Route::middleware('auth:sanctum')->put('/admin/users/{user}', [AdminController::class, 'updateUserRole']);
Route::middleware('auth:sanctum')->get('admin/statistics', [AdminController::class, 'getStatistics']);
    
