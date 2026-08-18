<?php

define('DB_HOST', 'localhost');
define('DB_NAME', 'arman_tejarat');
define('DB_USER', 'u2811866_arman_tejarat_admin');      
define('DB_PASS', 'xi{8$7kMeBO{EXH^');       

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}



function db_connect() {
    try {
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
            DB_USER,
            DB_PASS
        );
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        return $pdo;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'خطا در اتصال به دیتابیس: ' . $e->getMessage()
        ]);
        exit();
    }
}

function json_response($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit();
}

function error_response($message, $status = 400) {
    json_response([
        'success' => false,
        'message' => $message
    ], $status);
}

function success_response($data, $message = null) {
    json_response([
        'success' => true,
        'data' => $data,
        'message' => $message
    ]);
}
