<?php

use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\ReportVoteController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('/reports', [ReportController::class, 'index']);
Route::get('/reports/{id}', [ReportController::class, 'show']);

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    // Reports
    Route::post('/reports', [ReportController::class, 'store']);
    Route::delete('/reports/{id}', [ReportController::class, 'destroy']);

    // Voting
    Route::post('/reports/{id}/vote', [ReportVoteController::class, 'toggle']);

    // Comments
    Route::post('/reports/{id}/comments', [CommentController::class, 'store']);
    Route::delete('/comments/{id}', [CommentController::class, 'destroy']);

    // Admin only - Update report status
    Route::patch('/reports/{id}/status', [ReportController::class, 'updateStatus']);
});
