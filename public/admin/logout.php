<?php
require_once 'config.php';
require_once 'auth.php';

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Log the logout activity
if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    logActivity('Logout', 'Admin logged out');
}

// Destroy session
session_destroy();

// Clear session cookie
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// Redirect to login page
header('Location: index.php?logged_out=1');
exit;
?>
