@echo off
setlocal enabledelayedexpansion

:: Local deployment script for Windows
:: This script builds and packages the application for manual deployment

echo.
echo 🚀 Launch CAT - Local Build ^& Package Script
echo ==============================================

:: Configuration
set BUILD_DIR=build
set DEPLOY_DIR=deploy
set ARCHIVE_NAME=launch-cat-deploy.zip

:: Check if npm is available
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ✗ npm is not installed or not in PATH
    pause
    exit /b 1
)

:: Check if package.json exists
if not exist "package.json" (
    echo ✗ package.json not found. Please run this script from the project root.
    pause
    exit /b 1
)

echo ℹ Starting build process...

:: Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo ℹ Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo ✗ Failed to install dependencies
        pause
        exit /b 1
    )
    echo ✓ Dependencies installed
) else (
    echo ℹ Dependencies already installed
)

:: Clean previous build
if exist "%BUILD_DIR%" (
    echo ℹ Cleaning previous build...
    rmdir /s /q "%BUILD_DIR%"
)

if exist "%DEPLOY_DIR%" (
    echo ℹ Cleaning previous deployment package...
    rmdir /s /q "%DEPLOY_DIR%"
)

if exist "%ARCHIVE_NAME%" (
    del "%ARCHIVE_NAME%"
)

:: Build the application
echo ℹ Building React application...
call npm run build

if not exist "%BUILD_DIR%" (
    echo ✗ Build failed - no build directory created
    pause
    exit /b 1
)

echo ✓ Build completed successfully

:: Create deployment directory
mkdir "%DEPLOY_DIR%"

:: Copy build files to deployment directory
echo ℹ Preparing deployment package...
xcopy "%BUILD_DIR%\*" "%DEPLOY_DIR%\" /e /i /h /y >nul

:: Copy additional files that should be included in deployment
if exist "public\categories" (
    echo ℹ Including categories data...
    mkdir "%DEPLOY_DIR%\categories" 2>nul
    xcopy "public\categories\*" "%DEPLOY_DIR%\categories\" /e /i /h /y >nul
)

if exist "public\products" (
    echo ℹ Including products data...
    mkdir "%DEPLOY_DIR%\products" 2>nul
    xcopy "public\products\*" "%DEPLOY_DIR%\products\" /e /i /h /y >nul
)

:: Create .htaccess for React Router if it doesn't exist
if not exist "%DEPLOY_DIR%\.htaccess" (
    echo ℹ Creating .htaccess for React Router...
    (
        echo Options -MultiViews
        echo RewriteEngine On
        echo RewriteCond %%{REQUEST_FILENAME} !-f
        echo RewriteRule ^^ index.html [QSA,L]
        echo.
        echo # Security headers
        echo ^<IfModule mod_headers.c^>
        echo     Header always set X-Content-Type-Options nosniff
        echo     Header always set X-Frame-Options SAMEORIGIN
        echo     Header always set X-XSS-Protection "1; mode=block"
        echo     Header always set Referrer-Policy "strict-origin-when-cross-origin"
        echo ^</IfModule^>
        echo.
        echo # Cache static assets
        echo ^<IfModule mod_expires.c^>
        echo     ExpiresActive on
        echo     ExpiresByType text/css "access plus 1 year"
        echo     ExpiresByType application/javascript "access plus 1 year"
        echo     ExpiresByType image/png "access plus 1 year"
        echo     ExpiresByType image/jpg "access plus 1 year"
        echo     ExpiresByType image/jpeg "access plus 1 year"
        echo     ExpiresByType image/gif "access plus 1 year"
        echo     ExpiresByType image/svg+xml "access plus 1 year"
        echo     ExpiresByType font/woff "access plus 1 year"
        echo     ExpiresByType font/woff2 "access plus 1 year"
        echo ^</IfModule^>
        echo.
        echo # Compress files
        echo ^<IfModule mod_deflate.c^>
        echo     AddOutputFilterByType DEFLATE text/plain
        echo     AddOutputFilterByType DEFLATE text/html
        echo     AddOutputFilterByType DEFLATE text/xml
        echo     AddOutputFilterByType DEFLATE text/css
        echo     AddOutputFilterByType DEFLATE application/xml
        echo     AddOutputFilterByType DEFLATE application/xhtml+xml
        echo     AddOutputFilterByType DEFLATE application/rss+xml
        echo     AddOutputFilterByType DEFLATE application/javascript
        echo     AddOutputFilterByType DEFLATE application/x-javascript
        echo ^</IfModule^>
    ) > "%DEPLOY_DIR%\.htaccess"
    echo ✓ .htaccess created
)

:: Create ZIP archive using PowerShell
echo ℹ Creating deployment archive...
powershell -command "Compress-Archive -Path '%DEPLOY_DIR%\*' -DestinationPath '%ARCHIVE_NAME%' -Force"

if %errorlevel% neq 0 (
    echo ✗ Failed to create archive
    pause
    exit /b 1
)

:: Get file sizes
for /f %%i in ('powershell -command "(Get-ChildItem '%BUILD_DIR%' -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB"') do set BUILD_SIZE=%%i
for /f %%i in ('powershell -command "(Get-ChildItem '%DEPLOY_DIR%' -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB"') do set DEPLOY_SIZE=%%i
for /f %%i in ('powershell -command "(Get-Item '%ARCHIVE_NAME%').Length / 1MB"') do set ARCHIVE_SIZE=%%i

echo ✓ Deployment package created successfully

echo.
echo 📦 Package Information:
echo ========================
echo Build directory size:     !BUILD_SIZE! MB
echo Deploy directory size:    !DEPLOY_SIZE! MB
echo Archive size:             !ARCHIVE_SIZE! MB
echo Archive location:         %cd%\%ARCHIVE_NAME%

echo.
echo 📁 Deployment Contents:
echo ======================
dir "%DEPLOY_DIR%" /b | head -20
for /f %%i in ('dir "%DEPLOY_DIR%" /s /a-d ^| find "File(s)"') do set TOTAL_FILES=%%i

echo.
echo 🚀 Deployment Options:
echo =====================
echo 1. Manual Upload:
echo    - Upload %ARCHIVE_NAME% to your server
echo    - Extract the ZIP file on your server
echo    - Remove archive after extraction
echo.
echo 2. FTP Upload:
echo    - Use FileZilla or your preferred FTP client
echo    - Upload %ARCHIVE_NAME% or contents of %DEPLOY_DIR%\
echo.
echo 3. cPanel File Manager:
echo    - Login to cPanel File Manager
echo    - Upload %ARCHIVE_NAME%
echo    - Extract using cPanel's extract feature
echo.
echo 4. GitHub Actions:
echo    - Commit and push to trigger automatic deployment
echo    - Configure secrets in GitHub repository settings

:: Open deploy directory
set /p REPLY="Open deployment directory in explorer? (y/N): "
if /i "!REPLY!"=="y" (
    explorer "%DEPLOY_DIR%"
)

echo.
echo ✓ Build and package process completed!

:: Cleanup option
echo.
set /p REPLY="Keep deployment files for manual upload? (Y/n): "
if /i "!REPLY!"=="n" (
    rmdir /s /q "%DEPLOY_DIR%"
    echo ℹ Deployment directory cleaned up
) else (
    echo ℹ Deployment files kept in %DEPLOY_DIR%\
)

echo.
echo ✓ 🎉 Ready for deployment!
echo.
pause
