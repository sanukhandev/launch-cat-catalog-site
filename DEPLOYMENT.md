# GitHub Actions SSH Deployment to cPanel

This repository uses GitHub Actions to automatically build and deploy the React application to cPanel hosting via SSH.

## Required GitHub Secrets

To set up the deployment pipeline, you need to configure the following secrets in your GitHub repository:

### Navigation to GitHub Secrets

1. Go to your GitHub repository
2. Click on **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret** for each secret below

### Required Secrets

| Secret Name         | Description                        | Example                                  |
| ------------------- | ---------------------------------- | ---------------------------------------- |
| `CPANEL_HOST`       | Your cPanel server hostname or IP  | `yourdomain.com` or `192.168.1.100`      |
| `CPANEL_USERNAME`   | Your cPanel username               | `cpanel_user`                            |
| `CPANEL_PASSWORD`   | Your cPanel password               | `your_secure_password`                   |
| `CPANEL_PORT`       | SSH port (usually 22)              | `22`                                     |
| `CPANEL_TARGET_DIR` | Target directory for deployment    | `public_html` or `public_html/subdomain` |
| `WEBSITE_URL`       | Your website URL for health checks | `https://yourdomain.com`                 |

### Optional Configuration

- **CPANEL_PORT**: Defaults to `22` if not specified
- **CPANEL_TARGET_DIR**: Defaults to `public_html` if not specified
- **WEBSITE_URL**: Only required if you want automated health checks

## Deployment Process

The GitHub Actions workflow performs the following steps:

### 1. Build Process

- Checks out the code
- Sets up Node.js environment
- Installs dependencies with `npm ci`
- Builds the React application with `npm run build`
- Creates a compressed archive of the build files

### 2. Deployment Process

- Connects to your cPanel server via SSH
- Creates a backup of current files
- Removes old files (preserves admin directory and important files)
- Uploads and extracts new build files
- Sets proper file permissions
- Verifies the deployment

### 3. Protected Directories/Files

The deployment script preserves:

- `admin/` directory (your PHP admin panel)
- `.htaccess` files
- `cgi-bin/` directory
- `_logs/` and `_errors/` directories
- Any other system directories

## Triggering Deployments

Deployments are automatically triggered when:

- Code is pushed to the `main` branch
- A pull request is merged to `main`
- Manual trigger via GitHub Actions interface

## Security Features

### File Permissions

The deployment automatically sets secure file permissions:

- HTML, CSS, JS, JSON files: `644`
- Directories: `755`
- Admin PHP files: `644`
- Admin activity log: `666` (writable)

### Backup System

- Creates backup of current deployment before updating
- Stored in `backup/` directory on the server
- Can be used for quick rollback if needed

## Troubleshooting

### Common Issues

**SSH Connection Failed**

- Verify `CPANEL_HOST`, `CPANEL_USERNAME`, and `CPANEL_PASSWORD`
- Check if SSH is enabled on your cPanel hosting
- Confirm the SSH port (usually 22, sometimes 2222)

**Permission Denied**

- Ensure your cPanel user has SSH access
- Verify the target directory path
- Check if your hosting provider allows SSH connections

**Build Failures**

- Check Node.js version compatibility
- Verify all dependencies are in `package.json`
- Review build logs in GitHub Actions tab

**Admin Panel Not Working After Deployment**

- Admin directory is preserved during deployment
- Check file permissions: `find admin -type f -name "*.php" -exec chmod 644 {} \;`
- Ensure `activity.log` is writable: `chmod 666 admin/activity.log`

### Manual Deployment

If you need to deploy manually:

```bash
# Build the application
npm run build

# Create archive
cd build && tar -czf ../deploy.tar.gz . && cd ..

# Upload deploy.tar.gz to your server
# Extract in your target directory
tar -xzf deploy.tar.gz
rm deploy.tar.gz
```

## Health Checks

The workflow includes an optional health check that:

- Sends an HTTP request to your website
- Verifies the response code is 200
- Fails the deployment if the site is not accessible

## File Structure After Deployment

```
public_html/
├── index.html              # React app entry point
├── static/                 # Built CSS, JS, and assets
│   ├── css/
│   ├── js/
│   └── media/
├── admin/                  # PHP admin panel (preserved)
│   ├── index.php
│   ├── dashboard.php
│   ├── config.php
│   └── ...
├── categories/             # Category data files
├── products/               # Product data files
├── backup/                 # Deployment backup
└── manifest.json          # Build manifest
```

## Environment Variables

You can also set environment variables in the workflow for build-time configuration:

```yaml
- name: Build application
  run: npm run build
  env:
    CI: false
    GENERATE_SOURCEMAP: false
    REACT_APP_API_URL: ${{ secrets.API_URL }}
```

## Support

If you encounter issues with the deployment:

1. Check the GitHub Actions logs for detailed error messages
2. Verify all secrets are correctly configured
3. Test SSH connection manually to your cPanel server
4. Contact your hosting provider if SSH access issues persist

## Security Notes

- Never commit sensitive credentials to your repository
- Use strong passwords for your cPanel account
- Consider using SSH keys instead of passwords for enhanced security
- Regularly review and rotate your access credentials
- Monitor your deployment logs for any unauthorized access attempts
