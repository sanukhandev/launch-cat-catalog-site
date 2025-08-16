<?php
session_start();
require_once 'config.php';
setSecurityHeaders();

// Check if already logged in
if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    header('Location: dashboard.php');
    exit;
}

$error = '';
$loginAttempts = 0;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $clientIP = $_SERVER['REMOTE_ADDR'];
    
    // Rate limiting
    if (!checkRateLimit($clientIP, MAX_LOGIN_ATTEMPTS, LOCKOUT_TIME)) {
        $error = 'Too many login attempts. Please try again later.';
    } else {
        // Verify CSRF token
        if (!isset($_POST['csrf_token']) || !verifyCSRFToken($_POST['csrf_token'])) {
            // Debug: Log CSRF failure details
            error_log("CSRF Token Failure - POST: " . (isset($_POST['csrf_token']) ? $_POST['csrf_token'] : 'NOT_SET') . 
                     " SESSION: " . (isset($_SESSION['csrf_token']) ? $_SESSION['csrf_token'] : 'NOT_SET'));
            $error = 'Invalid request. Please refresh and try again.';
        } else {
            $username = sanitizeInput($_POST['username'] ?? '');
            $password = $_POST['password'] ?? '';
            
            if (empty($username) || empty($password)) {
                $error = 'Please enter both username and password.';
            } else {
                if ($username === ADMIN_USERNAME && password_verify($password, ADMIN_PASSWORD_HASH)) {
                    $_SESSION['admin_logged_in'] = true;
                    $_SESSION['admin_username'] = $username;
                    $_SESSION['login_time'] = time();
                    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
                    
                    header('Location: dashboard.php');
                    exit;
                } else {
                    $error = 'Invalid username or password.';
                }
            }
        }
    }
}

$csrfToken = generateCSRFToken();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login - Launch Tech MENA</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .login-container {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 400px;
        }
        
        .logo {
            text-align: center;
            margin-bottom: 2rem;
        }
        
        .logo h1 {
            color: #b91c3c;
            font-size: 2rem;
            font-weight: bold;
        }
        
        .logo p {
            color: #666;
            margin-top: 0.5rem;
        }
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        label {
            display: block;
            margin-bottom: 0.5rem;
            color: #333;
            font-weight: 500;
        }
        
        input[type="text"],
        input[type="password"] {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid #e1e5e9;
            border-radius: 6px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
        }
        
        input[type="text"]:focus,
        input[type="password"]:focus {
            outline: none;
            border-color: #b91c3c;
        }
        
        .btn {
            width: 100%;
            padding: 0.75rem;
            background: #b91c3c;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.3s ease;
        }
        
        .btn:hover {
            background: #991b3b;
        }
        
        .error {
            background: #fee;
            color: #c53030;
            padding: 0.75rem;
            border-radius: 6px;
            margin-bottom: 1rem;
            border: 1px solid #fed7d7;
        }
        
        .security-info {
            margin-top: 2rem;
            padding: 1rem;
            background: #f7fafc;
            border-radius: 6px;
            font-size: 0.875rem;
            color: #4a5568;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="logo">
            <h1>LAUNCH</h1>
            <p>Admin Panel</p>
        </div>
        
        <?php if ($error): ?>
            <div class="error"><?php echo htmlspecialchars($error); ?></div>
        <?php endif; ?>
        
        <form method="POST" id="loginForm">
            <input type="hidden" name="csrf_token" value="<?php echo $csrfToken; ?>">
            
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" required maxlength="50" autocomplete="username">
            </div>
            
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required maxlength="100" autocomplete="current-password">
            </div>
            
            <button type="submit" class="btn">Login</button>
        </form>
        
        <div class="security-info">
            <strong>Security Notice:</strong> This area is for authorized personnel only. 
            All login attempts are logged and monitored.
        </div>
    </div>

    <script>
        // Add basic client-side security
        (function() {
            'use strict';
            
            // Disable right-click context menu
            document.addEventListener('contextmenu', function(e) {
                e.preventDefault();
            });
            
            // Disable F12 and other dev tools shortcuts
            document.addEventListener('keydown', function(e) {
                if (e.key === 'F12' || 
                    (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                    (e.ctrlKey && e.shiftKey && e.key === 'C') ||
                    (e.ctrlKey && e.key === 'u')) {
                    e.preventDefault();
                    return false;
                }
            });
            
            // Form validation
            document.getElementById('loginForm').addEventListener('submit', function(e) {
                const username = document.getElementById('username').value.trim();
                const password = document.getElementById('password').value;
                
                if (!username || !password) {
                    e.preventDefault();
                    alert('Please fill in all fields.');
                    return false;
                }
                
                if (username.length < 3 || password.length < 6) {
                    e.preventDefault();
                    alert('Invalid credentials.');
                    return false;
                }
            });
            
            // Clear form on page load
            window.addEventListener('load', function() {
                document.getElementById('loginForm').reset();
            });
        })();
    </script>
</body>
</html>
