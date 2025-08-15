# cPanel Build Fix Guide

## Issues Fixed for Shared cPanel Hosting

### 1. Asset Path Problems

**Problem**: Static assets using absolute paths (`/static/js/`) that don't work in subdirectories
**Solution**:

- Added `"homepage": "./"` to package.json for relative paths
- Added `PUBLIC_URL: "./"` environment variable in build
- Updated webpack config to use relative publicPath in production

### 2. Admin Directory Deployment

**Problem**: Admin panel not being deployed from build
**Solution**:

- Modified deployment script to include admin directory from build
- Preserves existing admin data files (logs, databases) during deployment
- Deploys new admin PHP scripts while keeping data intact

### 3. Shared Hosting Compatibility

**Problem**: React Router and static file serving issues on shared hosting
**Solution**:

- Enhanced .htaccess with proper MIME types and React Router support
- Added security headers and caching rules
- Fixed file permissions in deployment script

## Configuration Changes Made

### package.json

```json
{
  "homepage": "./"
}
```

### craco.config.js

```javascript
// Production optimizations for shared hosting
if (process.env.NODE_ENV === "production") {
  // Ensure assets use relative paths
  webpackConfig.output.publicPath = "./";
}
```

### Deploy Workflow

- Added `PUBLIC_URL: "./"` to build environment
- Deploy admin panel with data preservation during deployments
- Preserve existing admin directory on server

## Common cPanel Issues and Solutions

### File Permissions

The deployment script automatically sets:

- Files: 644 (readable by web server)
- Directories: 755 (accessible by web server)

### MIME Type Issues

The .htaccess file includes:

- Proper MIME types for JS, CSS, and other assets
- Force correct content types to prevent 403 errors
- Support for modern file types (woff2, svg, etc.)

### React Router

The .htaccess handles:

- Client-side routing fallback to index.html
- Preserves query parameters
- Works with subdirectory installations

## Testing the Fix

1. **Push changes to trigger deployment**
2. **Check build assets use relative paths**:
   - Open browser dev tools
   - Verify static files load from `./static/` not `/static/`
3. **Test React Router**:
   - Navigate to different pages
   - Refresh the page - should not show 404
4. **Verify admin panel**: Should remain untouched and accessible

## If Still Having Issues

### Check Server Logs

```bash
# SSH into your cPanel and check error logs
tail -f ~/logs/launchtech.co.in.error.log
```

### Verify File Structure

After deployment, your directory should look like:

```
~/public_html/launchtech.co.in/
├── admin/          (preserved, not touched)
├── static/
│   ├── css/
│   └── js/
├── index.html
├── .htaccess
└── other build files...
```

### Manual Fix Commands (if needed)

```bash
# Fix permissions manually
find ~/public_html/launchtech.co.in -type f -name "*.html" -o -name "*.css" -o -name "*.js" -exec chmod 644 {} \;
find ~/public_html/launchtech.co.in -type d -exec chmod 755 {} \;

# Check .htaccess is present
ls -la ~/public_html/launchtech.co.in/.htaccess
```

## Build Process Summary

1. **Build with relative paths**: `PUBLIC_URL="./" npm run build`
2. **Deploy admin panel**: Include admin directory from build with data preservation
3. **Deploy preserving server admin**: Exclude admin from extraction
4. **Set proper permissions**: 644 for files, 755 for directories
5. **Verify .htaccess**: Ensure React Router and MIME types work

This should resolve all common shared cPanel hosting issues with React applications.
