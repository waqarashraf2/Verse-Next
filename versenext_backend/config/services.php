<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'gemini' => [
        'key' => env('GEMINI_API_KEY'),
        'model' => env('GEMINI_MODEL', 'gemini-3.6-flash'),
        'timeout' => env('GEMINI_TIMEOUT', 12),
    ],

    'green_api' => [
        'host' => env('GREEN_API_HOST', 'https://7107.api.greenapi.com'),
        'id_instance' => env('GREEN_API_ID_INSTANCE', '710722718547'),
        'api_token' => env('GREEN_API_API_TOKEN_INSTANCE', 'f10a6688163e43afbbfb04bbe25869ad4a07c096eabf4518a1'),
        'admin_phone' => env('ADMIN_WHATSAPP_NUMBER', '923365968297'),
    ],

];
