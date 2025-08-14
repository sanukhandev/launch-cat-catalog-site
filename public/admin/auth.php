<?php
function checkAuthentication() {
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
    
    // Check if user is logged in
    if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
        header('Location: index.php');
        exit;
    }
    
    // Check session timeout
    if (isset($_SESSION['login_time']) && (time() - $_SESSION['login_time']) > SESSION_TIMEOUT) {
        session_destroy();
        header('Location: index.php?timeout=1');
        exit;
    }
    
    // Refresh session time
    $_SESSION['login_time'] = time();
}

function getProductsDirectory() {
    return dirname(__DIR__) . '/products/';
}

function getCategoriesDirectory() {
    return dirname(__DIR__) . '/categories/';
}

function getProductManifest() {
    $manifestPath = getProductsDirectory() . 'manifest.json';
    if (file_exists($manifestPath)) {
        $content = file_get_contents($manifestPath);
        return json_decode($content, true);
    }
    return ['products' => []];
}

function saveProductManifest($manifest) {
    $manifestPath = getProductsDirectory() . 'manifest.json';
    return file_put_contents($manifestPath, json_encode($manifest, JSON_PRETTY_PRINT), LOCK_EX);
}

function getProductData($productId) {
    $productPath = getProductsDirectory() . $productId . '/data.json';
    if (file_exists($productPath)) {
        $content = file_get_contents($productPath);
        return json_decode($content, true);
    }
    return null;
}

function saveProductData($productId, $data) {
    $productDir = getProductsDirectory() . $productId;
    if (!is_dir($productDir)) {
        mkdir($productDir, 0755, true);
    }
    
    $productPath = $productDir . '/data.json';
    return file_put_contents($productPath, json_encode($data, JSON_PRETTY_PRINT), LOCK_EX);
}

function deleteProduct($productId) {
    $productDir = getProductsDirectory() . $productId;
    if (is_dir($productDir)) {
        $files = array_diff(scandir($productDir), ['.', '..']);
        foreach ($files as $file) {
            unlink($productDir . '/' . $file);
        }
        return rmdir($productDir);
    }
    return false;
}

function getCategoryList() {
    $categoriesDir = getCategoriesDirectory();
    $manifest = $categoriesDir . 'manifest.json';
    
    if (file_exists($manifest)) {
        $content = file_get_contents($manifest);
        $data = json_decode($content, true);
        
        $categories = [];
        foreach ($data['categories'] as $categoryId) {
            $categoryPath = $categoriesDir . $categoryId . '/data.json';
            if (file_exists($categoryPath)) {
                $categoryData = json_decode(file_get_contents($categoryPath), true);
                $categories[] = [
                    'id' => $categoryId,
                    'name' => $categoryData['name'],
                    'slug' => $categoryData['slug']
                ];
            }
        }
        return $categories;
    }
    
    return [];
}

function logActivity($action, $details = '') {
    $logFile = dirname(__FILE__) . '/activity.log';
    $timestamp = date('Y-m-d H:i:s');
    $user = $_SESSION['admin_username'] ?? 'unknown';
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    
    $logEntry = "[$timestamp] User: $user, IP: $ip, Action: $action";
    if ($details) {
        $logEntry .= ", Details: $details";
    }
    $logEntry .= PHP_EOL;
    
    file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
}
?>
