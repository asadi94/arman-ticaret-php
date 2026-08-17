<?php
// api/content.php - مدیریت محتوای سایت

require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        get_content();
        break;
    
    case 'PUT':
        update_content();
        break;
    
    default:
        error_response('متود غیرمجاز', 405);
}

function get_content() {
    $pdo = db_connect();
    $stmt = $pdo->query("SELECT * FROM content");
    $rows = $stmt->fetchAll();
    
    // تبدیل به فرمت nested
    $content = [];
    foreach ($rows as $row) {
        $keys = explode('.', $row['key']);
        $current = &$content;
        foreach ($keys as $key) {
            if (!isset($current[$key])) {
                $current[$key] = [];
            }
            $current = &$current[$key];
        }
        $current = json_decode($row['value'], true) ?? $row['value'];
    }
    
    success_response($content);
}

function update_content() {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data) {
        error_response('داده‌های ورودی نامعتبر');
    }
    
    $pdo = db_connect();
    
    // تبدیل nested به flat
    $flat = [];
    array_walk_recursive($data, function($value, $key) use (&$flat, $data) {
        // یافتن مسیر کامل
        $path = find_path($data, $key, $value);
        if ($path) {
            $flat[$path] = is_array($value) ? json_encode($value) : $value;
        }
    });
    
    // به‌روزرسانی هر کلید
    foreach ($flat as $key => $value) {
        $stmt = $pdo->prepare("
            INSERT INTO content (key, value) 
            VALUES (?, ?) 
            ON DUPLICATE KEY UPDATE value = ?
        ");
        $stmt->execute([$key, $value, $value]);
    }
    
    success_response(null, 'محتوای سایت با موفقیت به‌روزرسانی شد');
}

function find_path($array, $target_key, $target_value, $path = '') {
    foreach ($array as $key => $value) {
        $new_path = $path ? $path . '.' . $key : $key;
        if ($value === $target_value && $key === $target_key) {
            return $new_path;
        }
        if (is_array($value)) {
            $result = find_path($value, $target_key, $target_value, $new_path);
            if ($result) return $result;
        }
    }
    return null;
}
