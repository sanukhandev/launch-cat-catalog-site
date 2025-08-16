<?php
session_start();
session_destroy();
echo "Session cleared successfully!<br>";
echo "<a href='index.php'>Go back to login</a>";
?>
