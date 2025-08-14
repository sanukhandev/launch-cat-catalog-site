<?php
// Admin Configuration
define('ADMIN_USERNAME', 'admin');
define('ADMIN_PASSWORD_HASH', ''); // Default: admin123
define('SESSION_TIMEOUT', 3600); // 1 hour
define('MAX_LOGIN_ATTEMPTS', 5);
define('LOCKOUT_TIME', 1800); // 30 minutes

// Security headers
function setSecurityHeaders()
{
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('X-XSS-Protection: 1; mode=block');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    header('Content-Security-Policy: default-src \'self\'; script-src \'self\' \'unsafe-inline\'; style-src \'self\' \'unsafe-inline\'; img-src \'self\' data:;');
}

// CSRF Token functions
function generateCSRFToken()
{
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function verifyCSRFToken($token)
{
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

// Rate limiting
function checkRateLimit($identifier, $limit = 10, $window = 60)
{
    $lockfile = sys_get_temp_dir() . '/rate_limit_' . md5($identifier) . '.lock';
    $attempts = [];

    if (file_exists($lockfile)) {
        $attempts = json_decode(file_get_contents($lockfile), true) ?: [];
    }

    $now = time();
    $attempts = array_filter($attempts, function ($time) use ($now, $window) {
        return ($now - $time) < $window;
    });

    if (count($attempts) >= $limit) {
        return false;
    }

    $attempts[] = $now;
    file_put_contents($lockfile, json_encode($attempts), LOCK_EX);
    return true;
}

// Input sanitization
function sanitizeInput($input)
{
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

function validateJSON($json)
{
    json_decode($json);
    return json_last_error() === JSON_ERROR_NONE;
}
