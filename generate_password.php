<?php
// Password Generator Script
// This script generates a secure password and its hash for the admin user

function generateSecurePassword($length = 12)
{
    $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    $password = '';
    $charLength = strlen($chars);

    for ($i = 0; $i < $length; $i++) {
        $password .= $chars[random_int(0, $charLength - 1)];
    }

    return $password;
}

// Generate a secure password
$password = generateSecurePassword(16);
$passwordHash = password_hash($password, PASSWORD_DEFAULT);

echo "Generated Admin Credentials:\n";
echo "============================\n";
echo "Username: admin\n";
echo "Password: " . $password . "\n";
echo "Password Hash: " . $passwordHash . "\n";
echo "\n";
echo "IMPORTANT: Please save the password securely and delete this file after use!\n";
echo "Copy the password hash to your config.php file.\n";

// Also save to a temporary file for easy copying
file_put_contents('admin_credentials.txt', "Admin Username: admin\nAdmin Password: $password\nPassword Hash: $passwordHash\n");
echo "\nCredentials also saved to 'admin_credentials.txt' (remember to delete it after use)\n";
