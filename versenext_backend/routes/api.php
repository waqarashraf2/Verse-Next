<?php

use App\Http\Controllers\Api\Admin\AdminInquiryController;
use App\Http\Controllers\Api\Admin\AdminPlatformController;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\ChatbotController;
use App\Http\Controllers\Api\ConsultationController;
use App\Http\Controllers\Api\KnowledgeBaseController;
use App\Http\Controllers\Api\LeadController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProjectInquiryController;
use App\Http\Controllers\Api\Admin\AdminAuthController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'service' => 'Verse Next API',
    ]);
});



Route::middleware(['throttle:10,1'])->group(function () {
    Route::post('/project-inquiry', [ProjectInquiryController::class, 'store']);
    Route::post('/leads', [LeadController::class, 'store']);
    Route::post('/consultations', [ConsultationController::class, 'store']);
    Route::post('/chatbot/respond', [ChatbotController::class, 'respond']);
});

Route::get('/knowledge-base', [KnowledgeBaseController::class, 'index']);
Route::get('/site-settings', [KnowledgeBaseController::class, 'settings']);
Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/articles/{slug}', [ArticleController::class, 'show']);


// Admin login route (no auth middleware)
Route::post('/admin/login', [AdminAuthController::class, 'login']);


Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::get('/inquiries', [AdminInquiryController::class, 'index']);
    Route::get('/inquiries/{id}', [AdminInquiryController::class, 'show']);
    Route::patch('/inquiries/{id}/status', [AdminInquiryController::class, 'updateStatus']);
    Route::post('/inquiries/{id}/message', [AdminInquiryController::class, 'sendMessage']);

    Route::get('/dashboard', [AdminPlatformController::class, 'dashboard']);
    Route::get('/chat/presence', [AdminPlatformController::class, 'chatPresence']);
    Route::patch('/chat/presence', [AdminPlatformController::class, 'updateChatPresence']);
    Route::get('/leads', [AdminPlatformController::class, 'leads']);
    Route::patch('/leads/{lead}', [AdminPlatformController::class, 'updateLead']);
    Route::get('/consultations', [AdminPlatformController::class, 'consultations']);
    Route::patch('/consultations/{consultation}', [AdminPlatformController::class, 'updateConsultation']);

    Route::get('/articles', [AdminPlatformController::class, 'articles']);
    Route::post('/articles', [AdminPlatformController::class, 'storeArticle']);
    Route::patch('/articles/{article}', [AdminPlatformController::class, 'updateArticle']);
    Route::delete('/articles/{article}', [AdminPlatformController::class, 'destroyArticle']);

    Route::get('/knowledge-base', [AdminPlatformController::class, 'knowledge']);
    Route::post('/knowledge-base', [AdminPlatformController::class, 'storeKnowledge']);
    Route::patch('/knowledge-base/{entry}', [AdminPlatformController::class, 'updateKnowledge']);
    Route::delete('/knowledge-base/{entry}', [AdminPlatformController::class, 'destroyKnowledge']);
    Route::get('/chatbot-training', [AdminPlatformController::class, 'chatbotTraining']);

    Route::get('/site-settings', [AdminPlatformController::class, 'settings']);
    Route::post('/site-settings', [AdminPlatformController::class, 'upsertSetting']);
});
