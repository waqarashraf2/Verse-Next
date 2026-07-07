<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

$backendPath = __DIR__.'/../versenext_backend';

if (file_exists($maintenance = $backendPath.'/storage/framework/maintenance.php')) {
    require $maintenance;
}

require $backendPath.'/vendor/autoload.php';

/** @var Application $app */
$app = require_once $backendPath.'/bootstrap/app.php';

$app->handleRequest(Request::capture());
