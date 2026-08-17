<?php
// api/products.php - مدیریت محصولات

require_once 'config.php';

// ==========================================
// مسیریابی
// ==========================================

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (int)$_GET['id'] : null;
$brand = isset($_GET['brand']) ? $_GET['brand'] : null;

switch ($method) {
    case 'GET':
        if ($id) {
            get_product($id);
        } elseif ($brand) {
            get_products_by_brand($brand);
        } else {
            get_all_products();
        }
        break;
    
    case 'POST':
        create_product();
        break;
    
    case 'PUT':
        if (!$id) error_response('شناسه محصول الزامی است');
        update_product($id);
        break;
    
    case 'DELETE':
        if (!$id) error_response('شناسه محصول الزامی است');
        delete_product($id);
        break;
    
    default:
        error_response('متود غیرمجاز', 405);
}

// ==========================================
// توابع
// ==========================================

function get_all_products() {
    $pdo = db_connect();
    $stmt = $pdo->query("SELECT * FROM products ORDER BY id");
    $products = $stmt->fetchAll();
    success_response($products);
}

function get_product($id) {
    $pdo = db_connect();
    $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
    $stmt->execute([$id]);
    $product = $stmt->fetch();
    
    if (!$product) {
        error_response('محصول یافت نشد', 404);
    }
    
    success_response($product);
}

function get_products_by_brand($brand) {
    $pdo = db_connect();
    $stmt = $pdo->prepare("SELECT * FROM products WHERE brand = ? ORDER BY id");
    $stmt->execute([$brand]);
    $products = $stmt->fetchAll();
    success_response($products);
}

function create_product() {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data) {
        error_response('داده‌های ورودی نامعتبر');
    }
    
    // اعتبارسنجی
    $required = ['name', 'model', 'brand', 'category', 'description'];
    foreach ($required as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            error_response("فیلد {$field} الزامی است");
        }
    }
    
    $pdo = db_connect();
    $stmt = $pdo->prepare("
        INSERT INTO products (name, model, brand, category, images, description, specs)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");
    
    $images = isset($data['images']) ? json_encode($data['images']) : '[]';
    $specs = isset($data['specs']) ? json_encode($data['specs']) : '{}';
    
    $stmt->execute([
        $data['name'],
        $data['model'],
        $data['brand'],
        $data['category'],
        $images,
        $data['description'],
        $specs
    ]);
    
    $id = $pdo->lastInsertId();
    success_response(['id' => $id], 'محصول با موفقیت اضافه شد');
}

function update_product($id) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data) {
        error_response('داده‌های ورودی نامعتبر');
    }
    
    $pdo = db_connect();
    
    // بررسی وجود محصول
    $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
    $stmt->execute([$id]);
    if (!$stmt->fetch()) {
        error_response('محصول یافت نشد', 404);
    }
    
    // ساخت کوئری داینامیک
    $fields = [];
    $values = [];
    
    $allowed_fields = ['name', 'model', 'brand', 'category', 'description'];
    foreach ($allowed_fields as $field) {
        if (isset($data[$field])) {
            $fields[] = "$field = ?";
            $values[] = $data[$field];
        }
    }
    
    if (isset($data['images'])) {
        $fields[] = "images = ?";
        $values[] = json_encode($data['images']);
    }
    
    if (isset($data['specs'])) {
        $fields[] = "specs = ?";
        $values[] = json_encode($data['specs']);
    }
    
    if (empty($fields)) {
        error_response('هیچ داده‌ای برای به‌روزرسانی ارسال نشده است');
    }
    
    $values[] = $id;
    $sql = "UPDATE products SET " . implode(', ', $fields) . " WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($values);
    
    success_response(null, 'محصول با موفقیت ویرایش شد');
}

function delete_product($id) {
    $pdo = db_connect();
    
    // بررسی وجود محصول
    $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
    $stmt->execute([$id]);
    if (!$stmt->fetch()) {
        error_response('محصول یافت نشد', 404);
    }
    
    // حذف
    $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
    $stmt->execute([$id]);
    
    success_response(null, 'محصول با موفقیت حذف شد');
}
