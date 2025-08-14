<?php
require_once 'config.php';
require_once 'auth.php';

checkAuthentication();

$message = '';
$messageType = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verifyCsrfToken($_POST['csrf_token'] ?? '')) {
        $message = 'Invalid security token. Please try again.';
        $messageType = 'error';
    } else {
        $productId = sanitizeInput($_POST['product_id'] ?? '');
        $productData = [
            'name' => sanitizeInput($_POST['name'] ?? ''),
            'category' => sanitizeInput($_POST['category'] ?? ''),
            'categoryId' => sanitizeInput($_POST['categoryId'] ?? ''),
            'description' => sanitizeInput($_POST['description'] ?? ''),
            'image' => sanitizeInput($_POST['image'] ?? ''),
            'imageAlt' => sanitizeInput($_POST['imageAlt'] ?? ''),
            'price' => sanitizeInput($_POST['price'] ?? ''),
            'originalPrice' => sanitizeInput($_POST['originalPrice'] ?? ''),
            'features' => array_filter(array_map('trim', explode("\n", $_POST['features'] ?? ''))),
            'specifications' => array_filter(array_map('trim', explode("\n", $_POST['specifications'] ?? ''))),
            'translations' => json_decode($_POST['translations'] ?? '{}', true) ?: []
        ];
        
        // Validate required fields
        if (empty($productId) || empty($productData['name']) || empty($productData['categoryId'])) {
            $message = 'Product ID, name, and category are required.';
            $messageType = 'error';
        } else {
            // Add to manifest
            $manifest = getProductManifest();
            if (!in_array($productId, $manifest['products'])) {
                $manifest['products'][] = $productId;
            }
            
            if (saveProductData($productId, $productData) && saveProductManifest($manifest)) {
                logActivity('Product Created', "Product ID: $productId");
                $message = 'Product created successfully!';
                $messageType = 'success';
                
                // Reset form
                $_POST = [];
            } else {
                $message = 'Failed to create product.';
                $messageType = 'error';
            }
        }
    }
}

// Get categories
$categories = getCategoryList();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Product - Launch CAT Admin</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        brand: {
                            50: '#eff6ff',
                            500: '#3b82f6',
                            600: '#2563eb',
                            700: '#1d4ed8'
                        }
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-gray-50">
    <div class="min-h-screen">
        <!-- Header -->
        <header class="bg-white shadow-sm border-b">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center py-4">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-900">Create Product</h1>
                        <p class="text-sm text-gray-600">Add a new product to the catalog</p>
                    </div>
                    <div class="flex items-center space-x-4">
                        <a href="dashboard.php" class="text-brand-600 hover:text-brand-700">← Back to Dashboard</a>
                        <a href="logout.php" class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                            Logout
                        </a>
                    </div>
                </div>
            </div>
        </header>

        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Messages -->
            <?php if ($message): ?>
                <div class="mb-6 p-4 rounded-lg <?php echo $messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'; ?>">
                    <?php echo htmlspecialchars($message); ?>
                </div>
            <?php endif; ?>

            <!-- Create Product Form -->
            <div class="bg-white shadow rounded-lg">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h2 class="text-lg font-semibold text-gray-900">Product Details</h2>
                </div>
                
                <form method="POST" class="p-6">
                    <input type="hidden" name="csrf_token" value="<?php echo generateCsrfToken(); ?>">
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Product ID *</label>
                            <input type="text" name="product_id" value="<?php echo htmlspecialchars($_POST['product_id'] ?? ''); ?>" 
                                   class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-brand-500 focus:border-brand-500" 
                                   placeholder="e.g., launch-x431-pro" required>
                            <p class="text-xs text-gray-500 mt-1">Unique identifier for the product (lowercase, use hyphens)</p>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                            <input type="text" name="name" value="<?php echo htmlspecialchars($_POST['name'] ?? ''); ?>" 
                                   class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-brand-500 focus:border-brand-500" 
                                   placeholder="e.g., Launch X431 Pro" required>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                            <select name="categoryId" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-brand-500 focus:border-brand-500" required>
                                <option value="">Select a category</option>
                                <?php foreach ($categories as $category): ?>
                                    <option value="<?php echo htmlspecialchars($category['id']); ?>" 
                                            <?php echo ($_POST['categoryId'] ?? '') === $category['id'] ? 'selected' : ''; ?>>
                                        <?php echo htmlspecialchars($category['name']); ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Category Display Name</label>
                            <input type="text" name="category" value="<?php echo htmlspecialchars($_POST['category'] ?? ''); ?>" 
                                   class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-brand-500 focus:border-brand-500" 
                                   placeholder="e.g., Passenger Car Diagnostics">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Price</label>
                            <input type="text" name="price" value="<?php echo htmlspecialchars($_POST['price'] ?? ''); ?>" 
                                   class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-brand-500 focus:border-brand-500" 
                                   placeholder="e.g., 2999">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Original Price</label>
                            <input type="text" name="originalPrice" value="<?php echo htmlspecialchars($_POST['originalPrice'] ?? ''); ?>" 
                                   class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-brand-500 focus:border-brand-500" 
                                   placeholder="e.g., 3499">
                        </div>
                        
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea name="description" rows="3" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-brand-500 focus:border-brand-500" 
                                      placeholder="Brief description of the product"><?php echo htmlspecialchars($_POST['description'] ?? ''); ?></textarea>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                            <input type="url" name="image" value="<?php echo htmlspecialchars($_POST['image'] ?? ''); ?>" 
                                   class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-brand-500 focus:border-brand-500" 
                                   placeholder="https://example.com/image.jpg">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Image Alt Text</label>
                            <input type="text" name="imageAlt" value="<?php echo htmlspecialchars($_POST['imageAlt'] ?? ''); ?>" 
                                   class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-brand-500 focus:border-brand-500" 
                                   placeholder="Description of the image for accessibility">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Features (one per line)</label>
                            <textarea name="features" rows="4" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-brand-500 focus:border-brand-500" 
                                      placeholder="Advanced diagnostics&#10;Live data stream&#10;Bi-directional control"><?php echo htmlspecialchars($_POST['features'] ?? ''); ?></textarea>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Specifications (one per line)</label>
                            <textarea name="specifications" rows="4" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-brand-500 focus:border-brand-500" 
                                      placeholder="Operating System: Android&#10;Screen Size: 10.1 inch&#10;Battery Life: 8 hours"><?php echo htmlspecialchars($_POST['specifications'] ?? ''); ?></textarea>
                        </div>
                        
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Translations (JSON)</label>
                            <textarea name="translations" rows="8" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-brand-500 focus:border-brand-500 font-mono text-sm" 
                                      placeholder='{"ar": {"name": "اسم المنتج", "description": "وصف المنتج"}, "de": {"name": "Produktname", "description": "Produktbeschreibung"}}'><?php echo htmlspecialchars($_POST['translations'] ?? ''); ?></textarea>
                            <p class="text-xs text-gray-500 mt-1">JSON format for multilingual content (optional)</p>
                        </div>
                    </div>
                    
                    <div class="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                        <a href="dashboard.php" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</a>
                        <button type="submit" class="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700">Create Product</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</body>
</html>
