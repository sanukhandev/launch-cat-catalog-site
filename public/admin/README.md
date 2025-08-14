# Launch CAT Admin Panel

A secure PHP-based administrative interface for managing products and categories for the Launch CAT website.

## Features

- **Secure Authentication**: Password-protected access with CSRF protection
- **Rate Limiting**: Protection against brute force attacks
- **Product Management**: Create, edit, and delete products
- **Translation Support**: Manage multilingual product content
- **Activity Logging**: Track all administrative actions
- **File-Based Architecture**: Products and categories stored as JSON files

## Security Features

- Password hashing using PHP's `password_hash()` with bcrypt
- CSRF token protection on all forms
- Rate limiting with IP-based lockouts
- Session timeout protection
- Input sanitization and validation
- Security headers (X-Frame-Options, CSP, etc.)
- Protection against directory traversal attacks

## File Structure

```
admin/
├── index.php          # Login page
├── dashboard.php       # Main admin dashboard
├── create-product.php  # Product creation form
├── config.php          # Security configuration
├── auth.php            # Authentication middleware
├── logout.php          # Logout handler
├── .htaccess          # Apache security configuration
└── activity.log       # Activity log file (auto-created)
```

## Configuration

### Default Login Credentials

- **Username**: `admin`
- **Password**: `LaunchCAT2024!`

⚠️ **IMPORTANT**: Change the default password in `config.php` before deploying to production!

### Security Settings

Edit `config.php` to customize:

- `ADMIN_PASSWORD_HASH`: Hashed admin password
- `SESSION_TIMEOUT`: Session timeout in seconds (default: 30 minutes)
- `MAX_LOGIN_ATTEMPTS`: Maximum failed login attempts (default: 5)
- `LOCKOUT_TIME`: Lockout duration in seconds (default: 15 minutes)

### Changing the Admin Password

1. Generate a new password hash:
   ```php
   echo password_hash('your_new_password', PASSWORD_DEFAULT);
   ```

2. Update the `ADMIN_PASSWORD_HASH` constant in `config.php`

## Usage

### Accessing the Admin Panel

1. Navigate to `/admin/` in your browser
2. Enter the admin credentials
3. You'll be redirected to the dashboard

### Managing Products

**Create a Product:**
1. Click "Create Product" on the dashboard
2. Fill in the product details
3. Optionally add translations in JSON format
4. Click "Create Product"

**Edit a Product:**
1. Find the product on the dashboard
2. Click "Edit" next to the product
3. Modify the details in the modal
4. Click "Save Changes"

**Delete a Product:**
1. Find the product on the dashboard
2. Click "Delete" next to the product
3. Confirm the deletion

### Translation Format

Products support multilingual content using JSON format:

```json
{
  "ar": {
    "name": "اسم المنتج",
    "description": "وصف المنتج",
    "features": ["ميزة 1", "ميزة 2"],
    "specifications": ["مواصفة 1", "مواصفة 2"]
  },
  "de": {
    "name": "Produktname", 
    "description": "Produktbeschreibung",
    "features": ["Feature 1", "Feature 2"],
    "specifications": ["Spezifikation 1", "Spezifikation 2"]
  }
}
```

## Security Best Practices

1. **Change default credentials** before going live
2. **Use HTTPS** in production
3. **Restrict file permissions**: Set admin directory to 755, PHP files to 644
4. **Regular backups** of product data
5. **Monitor activity logs** for suspicious activity
6. **Keep PHP updated** to latest stable version

## File Permissions

Recommended file permissions:
```bash
chmod 755 admin/
chmod 644 admin/*.php
chmod 644 admin/.htaccess
chmod 666 admin/activity.log  # Must be writable for logging
```

## Troubleshooting

### Login Issues

- Check that the password hash is correct in `config.php`
- Verify that sessions are enabled in PHP configuration
- Check file permissions on the admin directory

### Product Creation Issues

- Ensure the `products/` directory is writable
- Check that JSON syntax is valid for translations
- Verify category IDs match existing categories

### Rate Limiting

If locked out due to rate limiting:
- Wait for the lockout period to expire
- Or manually delete the rate limit file in `/tmp/`

## Logging

All administrative actions are logged to `activity.log` including:
- Login/logout events
- Product creation, updates, and deletions
- Failed login attempts
- IP addresses and timestamps

## Development

To extend the admin panel:

1. Follow the existing authentication pattern using `checkAuthentication()`
2. Use CSRF tokens on all forms with `generateCsrfToken()` and `verifyCsrfToken()`
3. Sanitize all input with `sanitizeInput()`
4. Log activities with `logActivity()`
5. Follow the existing UI patterns using Tailwind CSS
