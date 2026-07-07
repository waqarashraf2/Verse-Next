<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'name' => 'Verse Next API',
        'status' => 'ok',
        'frontend' => config('cors.allowed_origins')[0] ?? 'https://versenext.com',
    ]);
});
