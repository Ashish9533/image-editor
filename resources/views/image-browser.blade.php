<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Image Browser & Editor</title>
    {{-- <script src="https://cdn.tailwindcss.com"></script> --}}
    {{-- <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet"> --}}
    <meta name="csrf-token" content="{{ csrf_token() }}">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <style>
        /* Tool tab active styles */
        .tool-tab.active {
            background-color: white !important;
            color: #1f2937 !important;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }
        
        .tool-tab {
            transition: all 0.2s ease;
        }
        
        .tool-tab:not(.active) {
            color: #6b7280;
        }
        
        .tool-tab:not(.active):hover {
            background-color: rgba(255, 255, 255, 0.1);
        }

        /* Ensure modal covers everything */
        #image-editor-modal {
            z-index: 9999;
        }
    </style>
</head>
<body class="bg-gray-50 min-h-screen">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="container mx-auto px-4 py-4">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <h1 class="text-2xl font-bold text-gray-800 flex items-center">
                        <i class="fas fa-images text-blue-600 mr-3"></i>
                        Image Browser & Editor
                    </h1>
                </div>
                <div class="flex items-center space-x-4">
                    <button id="uploadBtn" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
                        <i class="fas fa-upload"></i>
                        <span>Upload Images</span>
                    </button>
                    <input type="file" id="fileInput" multiple accept="image/*" class="hidden">
                    <a href="/image-editor" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
                        <i class="fas fa-edit"></i>
                        <span>New Editor</span>
                    </a>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
        <!-- Stats Bar -->
        <div class="mb-6 bg-white rounded-lg shadow-sm p-4">
            <div class="flex items-center justify-between">
                <div class="text-sm text-gray-600">
                    <span id="imageCount">0</span> images found
                </div>
                <div class="flex items-center space-x-4">
                    <button id="refreshBtn" class="text-gray-600 hover:text-gray-800 transition-colors">
                        <i class="fas fa-sync-alt"></i> Refresh
                    </button>
                    <div class="flex items-center space-x-2">
                        <label class="text-sm text-gray-600">Sort by:</label>
                        <select id="sortBy" class="text-sm border border-gray-300 rounded px-2 py-1">
                            <option value="modified">Modified Date</option>
                            <option value="name">Name</option>
                            <option value="size">Size</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div id="loadingState" class="flex items-center justify-center py-12">
            <div class="text-center">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p class="text-gray-600">Loading images...</p>
            </div>
        </div>

        <!-- Empty State -->
        <div id="emptyState" class="hidden flex items-center justify-center py-12">
            <div class="text-center">
                <i class="fas fa-images text-6xl text-gray-300 mb-4"></i>
                <h3 class="text-lg font-medium text-gray-900 mb-2">No images found</h3>
                <p class="text-gray-600 mb-4">Upload some images to get started!</p>
                <button onclick="document.getElementById('fileInput').click()" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
                    Upload Your First Image
                </button>
            </div>
        </div>

        <!-- Image Grid -->
        <div id="imageGrid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            <!-- Images will be dynamically loaded here -->
        </div>
    </main>

    <!-- Image Preview Modal -->
    <div id="imageModal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 hidden">
        <div class="bg-white rounded-lg max-w-4xl max-h-full m-4 overflow-hidden">
            <div class="flex items-center justify-between p-4 border-b">
                <h3 id="modalImageName" class="text-lg font-medium text-gray-900"></h3>
                <button id="closeModal" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            <div class="p-4">
                <img id="modalImage" class="max-w-full max-h-96 mx-auto" alt="">
                <div class="mt-4 flex items-center justify-center space-x-4">
                    <button id="editImageBtn" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2">
                        <i class="fas fa-edit"></i>
                        <span>Edit Image</span>
                    </button>
                    <button id="deleteImageBtn" class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2">
                        <i class="fas fa-trash"></i>
                        <span>Delete</span>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Image Editor Modal -->
    <x-image-editor.modal />

    <!-- Success Toast -->
    <div id="successToast" class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 z-50">
        <div class="flex items-center space-x-2">
            <i class="fas fa-check-circle"></i>
            <span id="successMessage">Success!</span>
        </div>
    </div>

    <!-- Error Toast -->
    <div id="errorToast" class="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 z-50">
        <div class="flex items-center space-x-2">
            <i class="fas fa-exclamation-circle"></i>
            <span id="errorMessage">Error!</span>
        </div>
    </div>

    <script>
        class ImageBrowser {
            constructor() {
                this.images = [];
                this.currentSort = 'modified';
                this.selectedImage = null;
                this.imageEditor = null;
                this.init();
            }

            async init() {
                this.setupEventListeners();
                await this.loadImages();
            }

            setupEventListeners() {
                document.getElementById('uploadBtn').addEventListener('click', () => {
                    document.getElementById('fileInput').click();
                });

                document.getElementById('fileInput').addEventListener('change', (e) => {
                    this.handleFileUpload(e);
                });

                document.getElementById('refreshBtn').addEventListener('click', () => {
                    this.loadImages();
                });

                document.getElementById('sortBy').addEventListener('change', (e) => {
                    this.currentSort = e.target.value;
                    this.renderImages();
                });

                // Preview modal events
                document.getElementById('closeModal').addEventListener('click', () => {
                    this.closeModal();
                });

                document.getElementById('editImageBtn').addEventListener('click', () => {
                    this.editImage();
                });

                document.getElementById('deleteImageBtn').addEventListener('click', () => {
                    this.deleteImage();
                });

                document.getElementById('imageModal').addEventListener('click', (e) => {
                    if (e.target.id === 'imageModal') {
                        this.closeModal();
                    }
                });
            }

            setupModalEventListeners() {
                const closeModalBtn = document.getElementById('close-modal');
                const closeModalFooterBtn = document.getElementById('close-modal-footer');
                const modalOverlay = document.getElementById('modal-overlay');

                if (closeModalBtn) {
                    closeModalBtn.addEventListener('click', () => this.closeEditorModal());
                }
                if (closeModalFooterBtn) {
                    closeModalFooterBtn.addEventListener('click', () => this.closeEditorModal());
                }
                if (modalOverlay) {
                    modalOverlay.addEventListener('click', (e) => {
                        if (e.target === modalOverlay) {
                            this.closeEditorModal();
                        }
                    });
                }
            }

            setupToolTabs() {
                const toolTabs = document.querySelectorAll('.tool-tab');
                const toolPanels = document.querySelectorAll('.tool-panel-content');

                if (toolTabs.length === 0 || toolPanels.length === 0) {
                    return; // Elements not ready yet
                }

                toolTabs.forEach(tab => {
                    tab.addEventListener('click', () => {
                        const toolName = tab.dataset.tool;
                        
                        // Remove active class from all tabs
                        toolTabs.forEach(t => {
                            t.classList.remove('active', 'bg-white', 'text-gray-800');
                            t.classList.add('text-gray-600');
                        });
                        
                        // Add active class to clicked tab
                        tab.classList.add('active', 'bg-white', 'text-gray-800');
                        tab.classList.remove('text-gray-600');
                        
                        // Hide all panels
                        toolPanels.forEach(panel => panel.classList.add('hidden'));
                        
                        // Show selected panel
                        const selectedPanel = document.getElementById(`tool-${toolName}`);
                        if (selectedPanel) {
                            selectedPanel.classList.remove('hidden');
                        }
                    });
                });
            }

            async loadImages() {
                try {
                    this.showLoading();
                    const response = await fetch('/api/images');
                    this.images = await response.json();
                    this.renderImages();
                } catch (error) {
                    console.error('Error loading images:', error);
                    this.showError('Failed to load images');
                }
            }

            renderImages() {
                const grid = document.getElementById('imageGrid');
                const loadingState = document.getElementById('loadingState');
                const emptyState = document.getElementById('emptyState');
                const imageCount = document.getElementById('imageCount');

                loadingState.classList.add('hidden');

                if (this.images.length === 0) {
                    emptyState.classList.remove('hidden');
                    grid.classList.add('hidden');
                    imageCount.textContent = '0';
                    return;
                }

                emptyState.classList.add('hidden');
                grid.classList.remove('hidden');
                imageCount.textContent = this.images.length;

                this.sortImages();
                grid.innerHTML = this.images.map(image => this.createImageCard(image)).join('');
            }

            sortImages() {
                this.images.sort((a, b) => {
                    switch (this.currentSort) {
                        case 'name':
                            return a.name.localeCompare(b.name);
                        case 'size':
                            return b.size - a.size;
                        case 'modified':
                        default:
                            return b.modified - a.modified;
                    }
                });
            }

            createImageCard(image) {
                const formatFileSize = (bytes) => {
                    if (bytes === 0) return '0 Bytes';
                    const k = 1024;
                    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
                    const i = Math.floor(Math.log(bytes) / Math.log(k));
                    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
                };

                const formatDate = (timestamp) => {
                    return new Date(timestamp * 1000).toLocaleDateString();
                };

                return `
                    <div class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 group">
                        <div class="relative aspect-square overflow-hidden">
                            <img src="${image.path}" alt="${image.name}" 
                                 class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200 cursor-pointer"
                                 onclick="imageBrowser.openModal('${image.name}', '${image.path}')">
                            <div class="absolute inset-0   group-hover:bg-opacity-20 transition-all duration-200"></div>
                            <button onclick="imageBrowser.editImageDirect('${image.path}', '${image.name}')" 
                                    class="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                                <i class="fas fa-edit text-sm"></i>
                            </button>
                        </div>
                        <div class="p-3">
                            <h3 class="font-medium text-gray-900 truncate mb-1" title="${image.name}">${image.name}</h3>
                            <div class="text-xs text-gray-500 space-y-1">
                                <div class="flex justify-between">
                                    <span>Size: ${formatFileSize(image.size)}</span>
                                    <span class="uppercase">${image.extension}</span>
                                </div>
                                <div>Modified: ${formatDate(image.modified)}</div>
                            </div>
                        </div>
                    </div>
                `;
            }

            async handleFileUpload(event) {
                const files = Array.from(event.target.files);
                if (files.length === 0) return;

                this.showSuccess(`Starting upload of ${files.length} file(s)...`);
                event.target.value = '';
                setTimeout(() => this.loadImages(), 1000);
            }

            openModal(imageName, imagePath) {
                this.selectedImage = { name: imageName, path: imagePath };
                document.getElementById('modalImageName').textContent = imageName;
                document.getElementById('modalImage').src = imagePath;
                document.getElementById('imageModal').classList.remove('hidden');
            }

            closeModal() {
                document.getElementById('imageModal').classList.add('hidden');
                this.selectedImage = null;
            }

            editImage() {
                if (this.selectedImage) {
                    this.editImageDirect(this.selectedImage.path, this.selectedImage.name);
                }
            }

            async editImageDirect(imagePath, imageName) {
                try {
                    // Close preview modal if open
                    this.closeModal();
                    
                    // Open editor modal
                    await this.openEditorModal(imagePath, imageName);
                } catch (error) {
                    console.error('Error opening editor:', error);
                    this.showError('Failed to open image editor');
                }
            }

            async openEditorModal(imagePath, imageName) {
                const modal = document.getElementById('image-editor-modal');
                
                // Show modal
                modal.classList.remove('hidden');
                document.body.classList.add('overflow-hidden');
                
                // Initialize image editor if not already done
                if (!this.imageEditor && window.ImageEditor) {
                    this.imageEditor = new ImageEditor();
                    
                    // Override the browser button to close modal instead
                    this.imageEditor.closeBrowserModal = () => this.closeEditorModal();
                    
                    await this.imageEditor.init();
                    
                    // Setup listeners now that the editor and its components are initialized
                    this.setupModalEventListeners();
                    this.setupToolTabs();
                }
                
                // Load the image
                if (this.imageEditor) {
                    try {
                        await this.imageEditor.loadImageFromUrl(imagePath, imageName);
                    } catch (error) {
                        console.error('Error loading image:', error);
                        this.showError('Failed to load image in editor');
                    }
                }
            }

            closeEditorModal() {
                const modal = document.getElementById('image-editor-modal');
                modal.classList.add('hidden');
                document.body.classList.remove('overflow-hidden');
                
                // Refresh images in case any were saved
                this.loadImages();
            }

            async deleteImage() {
                if (!this.selectedImage) return;

                if (!confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
                    return;
                }

                try {
                    const response = await fetch(`/api/images/${encodeURIComponent(this.selectedImage.name)}`, {
                        method: 'DELETE',
                        headers: {
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                        }
                    });

                    const result = await response.json();

                    if (result.success) {
                        this.showSuccess('Image deleted successfully');
                        this.closeModal();
                        this.loadImages();
                    } else {
                        this.showError(result.error || 'Failed to delete image');
                    }
                } catch (error) {
                    console.error('Error deleting image:', error);
                    this.showError('Failed to delete image');
                }
            }

            showLoading() {
                document.getElementById('loadingState').classList.remove('hidden');
                document.getElementById('emptyState').classList.add('hidden');
                document.getElementById('imageGrid').classList.add('hidden');
            }

            showSuccess(message) {
                const toast = document.getElementById('successToast');
                document.getElementById('successMessage').textContent = message;
                toast.classList.remove('translate-x-full');
                setTimeout(() => toast.classList.add('translate-x-full'), 3000);
            }

            showError(message) {
                const toast = document.getElementById('errorToast');
                document.getElementById('errorMessage').textContent = message;
                toast.classList.remove('translate-x-full');
                setTimeout(() => toast.classList.add('translate-x-full'), 3000);
            }
        }

        const imageBrowser = new ImageBrowser();
    </script>
    
    <!-- Load GIF.js for animations -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.js"></script>
</body>
</html>
