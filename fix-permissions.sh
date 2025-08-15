#!/bin/bash

# Quick fix script for 403 Forbidden errors on static files
# Run this on your server: ssh a1633kje@candourautotech.com
# Then: cd launchtech.co.in && bash fix-permissions.sh

echo "🔧 Fixing file permissions and MIME types for Launch Tech website"
echo "================================================================="

# Set proper file permissions
echo "Setting file permissions..."
find . -type f \( -name "*.html" -o -name "*.css" -o -name "*.js" -o -name "*.json" -o -name "*.txt" -o -name "*.xml" -o -name "*.ico" -o -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.gif" -o -name "*.svg" -o -name "*.woff*" -o -name "*.ttf" -o -name "*.map" -o -name "*.webmanifest" \) -exec chmod 644 {} \;

# Set proper directory permissions
echo "Setting directory permissions..."
find . -type d -exec chmod 755 {} \;

# Create/Update .htaccess file
echo "Creating .htaccess with proper MIME types..."
cat > .htaccess << 'EOF'
# React Router - Handle client-side routing
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [QSA,L]

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options SAMEORIGIN
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# MIME types for static assets (fix 403 errors)
<IfModule mod_mime.c>
    AddType text/css .css
    AddType application/javascript .js
    AddType application/json .json
    AddType image/svg+xml .svg
    AddType font/woff .woff
    AddType font/woff2 .woff2
    AddType application/font-woff .woff
    AddType application/font-woff2 .woff2
    AddType text/plain .map
</IfModule>

# Force correct MIME type for JS files to prevent 403 errors
<FilesMatch "\.(js|mjs)$">
    ForceType application/javascript
    Header set Content-Type "application/javascript; charset=utf-8"
</FilesMatch>

# Force correct MIME type for CSS files
<FilesMatch "\.css$">
    ForceType text/css
    Header set Content-Type "text/css; charset=utf-8"
</FilesMatch>

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType font/woff "access plus 1 year"
    ExpiresByType font/woff2 "access plus 1 year"
    ExpiresByType application/font-woff "access plus 1 year"
    ExpiresByType application/font-woff2 "access plus 1 year"
</IfModule>

# Compress files for better performance
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
    AddOutputFilterByType DEFLATE image/svg+xml
</IfModule>

# Allow access to static directory and files
<Directory "static">
    Options -Indexes
    AllowOverride None
    Require all granted
</Directory>

# Ensure all static assets are accessible
<FilesMatch "\.(css|js|map|json|svg|woff|woff2|ttf|eot|ico|png|jpg|jpeg|gif)$">
    Require all granted
</FilesMatch>

# Prevent access to sensitive files
<FilesMatch "\.(env|log|bak|backup|old|orig|save|swp|tmp)$">
    Require all denied
</FilesMatch>
EOF

# Set .htaccess permissions
chmod 644 .htaccess

# Fix admin directory permissions if it exists
if [ -d "admin" ]; then
    echo "Fixing admin directory permissions..."
    chmod 755 admin
    find admin -type f \( -name "*.php" -o -name "*.html" -o -name ".htaccess" \) -exec chmod 644 {} \;
    find admin -type d -exec chmod 755 {} \;
    if [ -f "admin/activity.log" ]; then
        chmod 666 admin/activity.log
    fi
fi

echo ""
echo "✅ Permissions fixed! Checking files..."
echo "Files in current directory:"
ls -la | head -10

echo ""
if [ -d "static" ]; then
    echo "Static directory permissions:"
    ls -la static/ | head -5
    echo "Sample static file permissions:"
    find static -name "*.js" -o -name "*.css" | head -3 | xargs ls -la
else
    echo "⚠️ No static directory found"
fi

echo ""
echo "🎉 Fix completed! Your website should now load properly."
echo "Try refreshing https://launchtech.co.in"
