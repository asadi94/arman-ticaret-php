<?php
// api/index.php - مسیریاب اصلی API

require_once 'config.php';

// دریافت endpoint
$endpoint = isset($_GET['endpoint']) ? $_GET['endpoint'] : '';

switch ($endpoint) {
    case 'products':
        require_once 'products.php';
        break;
    
    case 'content':
        require_once 'content.php';
        break;
    
    case 'auth':
        require_once 'auth.php';
        break;
    
    case 'health':
        json_response([
            'status' => 'ok',
            'message' => 'Arman Tejarat API is running!'
        ]);
        break;
    
    default:
        error_response('Endpoint نامعتبر', 404);
}
