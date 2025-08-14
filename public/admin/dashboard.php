<?php
require_once 'config.php';
require_once 'auth.php';

checkAuthentication();

$message = '';
$messageType = '';

// Handle form submissions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verifyCsrfToken($_POST['csrf_token'] ?? '')) {
        $message = 'Invalid security token. Please try again.';
        $messageType = 'error';
    } else {
        $action = $_POST['action'] ?? '';
        
        switch ($action) {
            case 'update_product':
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
                
                if (saveProductData($productId, $productData)) {
                    logActivity('Product Updated', "Product ID: $productId");
                    $message = 'Product updated successfully!';
                    $messageType = 'success';
                } else {
                    $message = 'Failed to update product.';
                    $messageType = 'error';
                }
                break;
                
            case 'delete_product':
                $productId = sanitizeInput($_POST['product_id'] ?? '');
                
                // Remove from manifest
                $manifest = getProductManifest();
                $manifest['products'] = array_filter($manifest['products'], function($id) use ($productId) {
                    return $id !== $productId;
                });
                
                if (deleteProduct($productId) && saveProductManifest($manifest)) {
                    logActivity('Product Deleted', "Product ID: $productId");
                    $message = 'Product deleted successfully!';
                    $messageType = 'success';
                } else {
                    $message = 'Failed to delete product.';
                    $messageType = 'error';
                }
                break;
        }
    }
}

// Get all products
$manifest = getProductManifest();
$products = [];
foreach ($manifest['products'] as $productId) {
    $productData = getProductData($productId);
    if ($productData) {
        $products[$productId] = $productData;
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
    <title>Launch CAT - Admin Dashboard</title>
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
                        <h1 class="text-2xl font-bold text-gray-900">Launch CAT Admin</h1>
                        <p class="text-sm text-gray-600">Product Management Dashboard</p>
                    </div>
                    <div class="flex items-center space-x-4">
                        <span class="text-sm text-gray-600">
                            Welcome, <?php echo htmlspecialchars($_SESSION['admin_username'] ?? 'Admin'); ?>
                        </span>
                        <a href="logout.php" class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                            Logout
                        </a>
                    </div>
                </div>
            </div>
        </header>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Messages -->
            <?php if ($message): ?>
                <div class="mb-6 p-4 rounded-lg <?php echo $messageType === 'success' ? 'bg-green-100 border border-green-300 text-green-800' : 'bg-red-100 border border-red-300 text-red-800'; ?>">
                    <?php echo htmlspecialchars($message); ?>
                </div>
            <?php endif; ?>

            <!-- Stats -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div class="bg-white p-6 rounded-lg shadow">
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Total Products</h3>
                    <p class="text-3xl font-bold text-brand-600"><?php echo count($products); ?></p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow">
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Categories</h3>
                    <p class="text-3xl font-bold text-brand-600"><?php echo count($categories); ?></p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow">
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Last Updated</h3>
                    <p class="text-sm text-gray-600"><?php echo date('M j, Y H:i'); ?></p>
                </div>
            </div>

            <!-- Products Table -->
            <div class="bg-white shadow rounded-lg">
                <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 class="text-lg font-semibold text-gray-900">Products</h2>
                    <a href="create-product.php" class="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors">
                        Create Product
                    </a>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <?php foreach ($products as $productId => $product): ?>
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center">
                                            <img class="h-10 w-10 rounded object-cover" src="<?php echo htmlspecialchars($product['image'] ?? ''); ?>" alt="">
                                            <div class="ml-4">
                                                <div class="text-sm font-medium text-gray-900"><?php echo htmlspecialchars($product['name'] ?? ''); ?></div>
                                                <div class="text-sm text-gray-500"><?php echo htmlspecialchars($productId); ?></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <?php echo htmlspecialchars($product['category'] ?? ''); ?>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        $<?php echo htmlspecialchars($product['price'] ?? ''); ?>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button onclick="editProduct('<?php echo $productId; ?>')" class="text-brand-600 hover:text-brand-900 mr-4">Edit</button>
                                        <button onclick="deleteProduct('<?php echo $productId; ?>')" class="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Edit Product Modal -->
    <div id="editModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 hidden">
        <div class="flex items-center justify-center min-h-screen p-4">
            <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h3 class="text-lg font-semibold text-gray-900">Edit Product</h3>
                </div>
                <form id="editForm" method="POST" class="p-6">
                    <input type="hidden" name="action" value="update_product">
                    <input type="hidden" name="csrf_token" value="<?php echo generateCsrfToken(); ?>">
                    <input type="hidden" name="product_id" id="edit_product_id">
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                            <input type="text" name="name" id="edit_name" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-brand-500 focus:border-brand-500" required>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <select name="categoryId" id="edit_categoryId" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-brand-500 focus:border-brand-500" required>
                                <?php foreach ($categories as $category): ?>
                                    <option value="<?php echo htmlspecialchars($category['id']); ?>">
                                        <?php echo htmlspecialchars($category['name']); ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Price</label>
                            <input type="text" name="price" id="edit_price" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-brand-500 focus:border-brand-500" required>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Original Price</label>
                            <input type="text" name="originalPrice" id="edit_originalPrice" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-brand-500 focus:border-brand-500">
                        </div>
                        
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea name="description" id="edit_description" rows="3" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-brand-500 focus:border-brand-500"></textarea>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                            <input type="url" name="image" id="edit_image" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-brand-500 focus:border-brand-500">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Image Alt Text</label>
                            <input type="text" name="imageAlt" id="edit_imageAlt" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-brand-500 focus:border-brand-500">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Features (one per line)</label>
                            <textarea name="features" id="edit_features" rows="4" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-brand-500 focus:border-brand-500"></textarea>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Specifications (one per line)</label>
                            <textarea name="specifications" id="edit_specifications" rows="4" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-brand-500 focus:border-brand-500"></textarea>
                        </div>
                        
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Translations (JSON)</label>
                            <textarea name="translations" id="edit_translations" rows="6" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-brand-500 focus:border-brand-500 font-mono text-sm"></textarea>
                        </div>
                    </div>
                    
                    <div class="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
                        <button type="button" onclick="closeEditModal()" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
                        <button type="submit" class="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div id="deleteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 hidden">
        <div class="flex items-center justify-center min-h-screen p-4">
            <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div class="p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Delete Product</h3>
                    <p class="text-gray-600 mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
                    <form id="deleteForm" method="POST">
                        <input type="hidden" name="action" value="delete_product">
                        <input type="hidden" name="csrf_token" value="<?php echo generateCsrfToken(); ?>">
                        <input type="hidden" name="product_id" id="delete_product_id">
                        
                        <div class="flex justify-end space-x-4">
                            <button type="button" onclick="closeDeleteModal()" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
                            <button type="submit" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <script>
        const products = <?php echo json_encode($products); ?>;
        
        function editProduct(productId) {
            const product = products[productId];
            if (!product) return;
            
            document.getElementById('edit_product_id').value = productId;
            document.getElementById('edit_name').value = product.name || '';
            document.getElementById('edit_categoryId').value = product.categoryId || '';
            document.getElementById('edit_price').value = product.price || '';
            document.getElementById('edit_originalPrice').value = product.originalPrice || '';
            document.getElementById('edit_description').value = product.description || '';
            document.getElementById('edit_image').value = product.image || '';
            document.getElementById('edit_imageAlt').value = product.imageAlt || '';
            document.getElementById('edit_features').value = (product.features || []).join('\n');
            document.getElementById('edit_specifications').value = (product.specifications || []).join('\n');
            document.getElementById('edit_translations').value = JSON.stringify(product.translations || {}, null, 2);
            
            document.getElementById('editModal').classList.remove('hidden');
        }
        
        function closeEditModal() {
            document.getElementById('editModal').classList.add('hidden');
        }
        
        function deleteProduct(productId) {
            document.getElementById('delete_product_id').value = productId;
            document.getElementById('deleteModal').classList.remove('hidden');
        }
        
        function closeDeleteModal() {
            document.getElementById('deleteModal').classList.add('hidden');
        }
        
        // Close modals when clicking outside
        document.addEventListener('click', function(e) {
            if (e.target.id === 'editModal') {
                closeEditModal();
            }
            if (e.target.id === 'deleteModal') {
                closeDeleteModal();
            }
        });
    </script>
</body>
</html>
