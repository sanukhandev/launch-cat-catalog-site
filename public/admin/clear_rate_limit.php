<?php
// Clear rate limiting locks
$tempDir = sys_get_temp_dir();
$lockFiles = glob($tempDir . '/rate_limit_*.lock');

echo "<h1>Rate Limiting Cleanup</h1>";
echo "<style>body{font-family:Arial;margin:20px;} .success{color:green;} .info{color:blue;}</style>";

if (empty($lockFiles)) {
    echo "<div class='info'>No rate limiting lock files found.</div>";
} else {
    echo "<div class='info'>Found " . count($lockFiles) . " rate limiting lock files:</div>";
    echo "<ul>";
    foreach ($lockFiles as $file) {
        if (unlink($file)) {
            echo "<li class='success'>Deleted: " . basename($file) . "</li>";
        } else {
            echo "<li style='color:red;'>Failed to delete: " . basename($file) . "</li>";
        }
    }
    echo "</ul>";
}

echo "<p><strong>Rate limiting has been cleared!</strong></p>";
echo "<p><a href='test_login.php'>Go to Login Test</a> | <a href='index.php'>Regular Login</a></p>";
