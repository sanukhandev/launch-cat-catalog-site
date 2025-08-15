#!/bin/bash

# Local deployment script for testing
# This script builds and packages the application for manual deployment

set -e

echo "🚀 Launch CAT - Local Build & Package Script"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BUILD_DIR="build"
DEPLOY_DIR="deploy"
ARCHIVE_NAME="launch-cat-deploy.tar.gz"

# Functions
log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if npm is available
if ! command -v npm &> /dev/null; then
    log_error "npm is not installed or not in PATH"
    exit 1
fi

# Check if package.json exists
if [[ ! -f "package.json" ]]; then
    log_error "package.json not found. Please run this script from the project root."
    exit 1
fi

log_info "Starting build process..."

# Install dependencies if node_modules doesn't exist
if [[ ! -d "node_modules" ]]; then
    log_info "Installing dependencies..."
    npm install
    log_success "Dependencies installed"
else
    log_info "Dependencies already installed"
fi

# Clean previous build
if [[ -d "$BUILD_DIR" ]]; then
    log_info "Cleaning previous build..."
    rm -rf "$BUILD_DIR"
fi

if [[ -d "$DEPLOY_DIR" ]]; then
    log_info "Cleaning previous deployment package..."
    rm -rf "$DEPLOY_DIR"
fi

# Build the application
log_info "Building React application..."
npm run build

if [[ ! -d "$BUILD_DIR" ]]; then
    log_error "Build failed - no build directory created"
    exit 1
fi

log_success "Build completed successfully"

# Create deployment directory
mkdir -p "$DEPLOY_DIR"

# Copy build files to deployment directory
log_info "Preparing deployment package..."
cp -r "$BUILD_DIR"/* "$DEPLOY_DIR"/

# Copy additional files that should be included in deployment
if [[ -d "public/categories" ]]; then
    log_info "Including categories data..."
    mkdir -p "$DEPLOY_DIR/categories"
    cp -r public/categories/* "$DEPLOY_DIR/categories"/
fi

if [[ -d "public/products" ]]; then
    log_info "Including products data..."
    mkdir -p "$DEPLOY_DIR/products"
    cp -r public/products/* "$DEPLOY_DIR/products"/
fi

# Create .htaccess for React Router if it doesn't exist
if [[ ! -f "$DEPLOY_DIR/.htaccess" ]]; then
    log_info "Creating .htaccess for React Router..."
    cat > "$DEPLOY_DIR/.htaccess" << 'EOF'
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options SAMEORIGIN
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

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
</IfModule>

# Compress files
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
</IfModule>
EOF
    log_success ".htaccess created"
fi

# Create archive
log_info "Creating deployment archive..."
cd "$DEPLOY_DIR"
tar -czf "../$ARCHIVE_NAME" .
cd ..

# Get file sizes
BUILD_SIZE=$(du -sh "$BUILD_DIR" | cut -f1)
DEPLOY_SIZE=$(du -sh "$DEPLOY_DIR" | cut -f1)
ARCHIVE_SIZE=$(du -sh "$ARCHIVE_NAME" | cut -f1)

log_success "Deployment package created successfully"

echo ""
echo "📦 Package Information:"
echo "========================"
echo "Build directory size:     $BUILD_SIZE"
echo "Deploy directory size:    $DEPLOY_SIZE" 
echo "Archive size:             $ARCHIVE_SIZE"
echo "Archive location:         $(pwd)/$ARCHIVE_NAME"

echo ""
echo "📁 Deployment Contents:"
echo "======================"
cd "$DEPLOY_DIR"
find . -type f | head -20 | sed 's/^/  /'
TOTAL_FILES=$(find . -type f | wc -l)
if [[ $TOTAL_FILES -gt 20 ]]; then
    echo "  ... and $((TOTAL_FILES - 20)) more files"
fi
cd ..

echo ""
echo "🚀 Deployment Options:"
echo "====================="
echo "1. Manual Upload:"
echo "   - Upload $ARCHIVE_NAME to your server"
echo "   - Extract: tar -xzf $ARCHIVE_NAME"
echo "   - Remove archive: rm $ARCHIVE_NAME"
echo ""
echo "2. SCP Upload:"
echo "   scp $ARCHIVE_NAME user@server:/path/to/website/"
echo ""
echo "3. FTP Upload:"
echo "   - Use your FTP client to upload $ARCHIVE_NAME"
echo "   - Extract on server or upload contents of $DEPLOY_DIR/"
echo ""
echo "4. GitHub Actions:"
echo "   - Commit and push to trigger automatic deployment"
echo "   - Configure secrets in GitHub repository settings"

# Optional: Open deploy directory
if command -v explorer.exe &> /dev/null; then
    echo ""
    read -p "Open deployment directory in file explorer? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        explorer.exe "$(cygpath -w "$DEPLOY_DIR")" 2>/dev/null || true
    fi
elif command -v open &> /dev/null; then
    echo ""
    read -p "Open deployment directory in Finder? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        open "$DEPLOY_DIR"
    fi
fi

log_success "Build and package process completed!"

# Cleanup option
echo ""
read -p "Keep deployment files for manual upload? (Y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Nn]$ ]]; then
    rm -rf "$DEPLOY_DIR"
    log_info "Deployment directory cleaned up"
else
    log_info "Deployment files kept in $DEPLOY_DIR/"
fi

echo ""
log_success "🎉 Ready for deployment!"
