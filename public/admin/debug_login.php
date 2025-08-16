<?php
session_start();
require_once 'config.php';

// Debug information
echo "<h2>Debug Information</h2>";
echo "<p><strong>Session Status:</strong> " . session_status() . "</p>";
echo "<p><strong>Session ID:</strong> " . session_id() . "</p>";
echo "<p><strong>PHP Version:</strong> " . phpversion() . "</p>";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    echo "<h3>POST Data Received:</h3>";
    echo "<pre>";
    print_r($_POST);
    echo "</pre>";
    
    echo "<h3>Session Data:</h3>";
    echo "<pre>";
    print_r($_SESSION);
    echo "</pre>";
    
    // Test CSRF token
    if (isset($_POST['csrf_token'])) {
        echo "<p><strong>CSRF Token from POST:</strong> " . htmlspecialchars($_POST['csrf_token']) . "</p>";
        echo "<p><strong>CSRF Token from Session:</strong> " . (isset($_SESSION['csrf_token']) ? htmlspecialchars($_SESSION['csrf_token']) : 'NOT SET') . "</p>";
        echo "<p><strong>CSRF Verification:</strong> " . (verifyCSRFToken($_POST['csrf_token']) ? 'PASSED' : 'FAILED') . "</p>";
    }
    
    // Test password verification
    if (isset($_POST['password'])) {
        $testPassword = $_POST['password'];
        echo "<p><strong>Password Test:</strong> " . (password_verify($testPassword, ADMIN_PASSWORD_HASH) ? 'PASSED' : 'FAILED') . "</p>";
    }
}

$csrfToken = generateCSRFToken();
echo "<p><strong>Generated CSRF Token:</strong> " . htmlspecialchars($csrfToken) . "</p>";
?>

<!DOCTYPE html>
<html>
<head>
    <title>Login Debug</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .form-container { background: #f5f5f5; padding: 20px; border-radius: 5px; margin-top: 20px; }
        input, button { padding: 10px; margin: 5px; display: block; width: 200px; }
    </style>
</head>
<body>
    <h1>Login Debug Page</h1>
    
    <div class="form-container">
        <h3>Test Login Form</h3>
        <form method="POST">
            <input type="hidden" name="csrf_token" value="<?php echo $csrfToken; ?>">
            <input type="text" name="username" placeholder="Username" value="admin">
            <input type="password" name="password" placeholder="Password" value="Zk9#mP2vN8qR5xL!">
            <button type="submit">Test Login</button>
        </form>
    </div>
    
    <p><strong>Expected Username:</strong> <?php echo ADMIN_USERNAME; ?></p>
    <p><strong>Password Hash in Config:</strong> <?php echo htmlspecialchars(ADMIN_PASSWORD_HASH); ?></p>
</body>
</html>
