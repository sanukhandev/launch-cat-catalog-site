<?php
// Simple login test without complex security checks
session_start();
require_once 'config.php';

echo "<h1>Admin Login Test</h1>";
echo "<style>body{font-family:Arial;margin:20px;} .success{color:green;} .error{color:red;} .info{color:blue;}</style>";

// Test the password hash
$testPassword = 'Zk9#mP2vN8qR5xL!';
$hashFromConfig = ADMIN_PASSWORD_HASH;

echo "<h2>Configuration Test:</h2>";
echo "<div class='info'>Username: " . ADMIN_USERNAME . "</div>";
echo "<div class='info'>Password Hash: " . htmlspecialchars($hashFromConfig) . "</div>";
echo "<div class='info'>Test Password: " . htmlspecialchars($testPassword) . "</div>";

// Test password verification
$passwordTest = password_verify($testPassword, $hashFromConfig);
echo "<div class='" . ($passwordTest ? 'success' : 'error') . "'>Password Verification: " . ($passwordTest ? 'PASSED ✓' : 'FAILED ✗') . "</div>";

// Test simple login
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    echo "<h2>Login Attempt:</h2>";
    echo "<div class='info'>Submitted Username: " . htmlspecialchars($username) . "</div>";
    echo "<div class='info'>Submitted Password: " . htmlspecialchars($password) . "</div>";

    if ($username === ADMIN_USERNAME) {
        echo "<div class='success'>Username Match: PASSED ✓</div>";
    } else {
        echo "<div class='error'>Username Match: FAILED ✗</div>";
    }

    if (password_verify($password, ADMIN_PASSWORD_HASH)) {
        echo "<div class='success'>Password Verification: PASSED ✓</div>";
        echo "<div class='success'><strong>LOGIN SUCCESSFUL!</strong></div>";
        echo "<p><a href='dashboard.php'>Go to Dashboard</a></p>";

        // Set session for successful login
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_username'] = $username;
        $_SESSION['login_time'] = time();
    } else {
        echo "<div class='error'>Password Verification: FAILED ✗</div>";
    }
}

// Session info
echo "<h2>Session Information:</h2>";
echo "<div class='info'>Session Status: " . (session_status() === PHP_SESSION_ACTIVE ? 'Active' : 'Inactive') . "</div>";
echo "<div class='info'>Session ID: " . session_id() . "</div>";
if (isset($_SESSION['admin_logged_in'])) {
    echo "<div class='success'>Already Logged In: YES</div>";
    echo "<p><a href='dashboard.php'>Go to Dashboard</a></p>";
}
?>

<h2>Simple Login Form:</h2>
<form method="POST" style="border:1px solid #ccc; padding:20px; max-width:400px;">
    <div style="margin-bottom:10px;">
        <label>Username:</label><br>
        <input type="text" name="username" value="admin" style="width:100%; padding:5px;">
    </div>
    <div style="margin-bottom:10px;">
        <label>Password:</label><br>
        <input type="password" name="password" value="Zk9#mP2vN8qR5xL!" style="width:100%; padding:5px;">
    </div>
    <button type="submit" style="padding:10px 20px; background:#007cba; color:white; border:none; cursor:pointer;">Test Login</button>
</form>

<p><a href="clear_session.php">Clear Session</a> | <a href="index.php">Regular Login Page</a></p>