# SSH Deployment Configuration for candourautotech.com

Based on your SSH connection: `ssh -p 22 a1633kje@candourautotech.com`

## 🔐 GitHub Secrets Configuration

Add these **exact values** to your GitHub repository secrets:

### **Step-by-Step Setup:**

1. **Go to GitHub Repository**: https://github.com/sanukhandev/launch-cat-catalog-site
2. **Click Settings** → **Secrets and variables** → **Actions**
3. **Add New Repository Secret** for each:

| Secret Name | Value | Notes |
|-------------|-------|-------|
| `CPANEL_HOST` | `candourautotech.com` | Your server hostname |
| `CPANEL_USERNAME` | `a1633kje` | Your SSH username |
| `CPANEL_PASSWORD` | `[your_actual_password]` | Your SSH/cPanel password |
| `CPANEL_PORT` | `22` | SSH port (already default) |
| `CPANEL_TARGET_DIR` | `launchtech.co.in` | Deploy to ~/launchtech.co.in directory |
| `WEBSITE_URL` | `https://launchtech.co.in` | For health checks |

## 🚀 Deployment Process

When you **push to main branch** or **manually trigger**, the workflow will:

1. **Build** your React application
2. **Connect** to `candourautotech.com` via SSH
3. **Navigate** to `~/launchtech.co.in` directory
4. **Backup** existing files
5. **Deploy** new build files
6. **Preserve** your admin panel
7. **Set** proper permissions
8. **Verify** deployment success

## 🛡️ What Gets Preserved

The deployment **automatically preserves**:
- ✅ `/admin/` directory (your PHP admin panel)
- ✅ `.htaccess` files
- ✅ `/cgi-bin/` directory
- ✅ `/_logs/` and `/_errors/` directories
- ✅ Any existing configuration files

## 📂 Directory Structure After Deployment

```
~/launchtech.co.in/
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
├── backup/                 # Automatic backup of previous deployment
└── .htaccess              # Apache configuration
```

## 🔧 Manual SSH Test

Before running the automation, you can test manually:

```bash
# Connect to your server
ssh -p 22 a1633kje@candourautotech.com

# Navigate to deployment directory
cd launchtech.co.in

# Check current files
ls -la

# Check if admin panel exists
ls -la admin/
```

## ⚠️ Important Notes

1. **Password Security**: Make sure your cPanel password is strong
2. **SSH Access**: Ensure SSH is enabled in your hosting account
3. **Directory Permissions**: The workflow will set proper permissions automatically
4. **Admin Panel**: Your existing admin panel will be preserved and remain functional
5. **Backup**: Each deployment creates a backup in the `backup/` directory

## 🚀 First Deployment

To trigger your first deployment:

1. **Add all secrets** to GitHub (as listed above)
2. **Push any change** to the main branch, or
3. **Go to Actions tab** → **Deploy to cPanel via SSH** → **Run workflow**

## 🔍 Monitoring Deployment

Watch the deployment progress:
1. **GitHub** → **Actions tab**
2. **Click on the running workflow**
3. **Expand each step** to see detailed logs

## 🆘 Troubleshooting

**If deployment fails:**

1. **Check SSH connection manually**: `ssh -p 22 a1633kje@candourautotech.com`
2. **Verify directory exists**: `ls -la ~/launchtech.co.in`
3. **Check GitHub Actions logs** for specific error messages
4. **Ensure all secrets are correctly configured**

**Common Issues:**
- **SSH not enabled**: Contact your hosting provider
- **Wrong directory**: Verify `~/launchtech.co.in` exists
- **Permission denied**: Check if your user has write access to the directory
- **Port blocked**: Some networks block SSH; try from a different connection

## 🎯 Success Indicators

After successful deployment, you should see:
- ✅ **React app** accessible at `https://launchtech.co.in`
- ✅ **Admin panel** working at `https://launchtech.co.in/admin/`
- ✅ **All product data** preserved and functional
- ✅ **Categories and products** loading correctly

Your Launch CAT website will be automatically deployed to `launchtech.co.in` with full admin panel functionality! 🎉
