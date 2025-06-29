class ImageEditor {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.canvasContainer = null;
        this.originalImage = null;
        this.currentImage = null;
        this.tools = {};
        this.layerManager = null;
        this.historyManager = null;
        this.isInitialized = false;
        this.originalImageName = null; // Store original image name for saving
        this.zoomLevel = 1; // Add zoom level tracking
        this.originalCanvasSize = { width: 0, height: 0 }; // Store original size
        this.activeTool = null;
    }

    async init() {
        try {
            // Import all tool modules
            const [
                cropModule,
                textModule,
                stickerModule,
                shapesModule,
                layerManagerModule,
                filterModule,
                historyManagerModule,
                animationModule,
                frameModule,
                adjustmentsModule,
                histogramModule
            ] = await Promise.all([
                import('./CropTool.js'),
                import('./TextTool.js'),
                import('./StickerTool.js'),
                import('./ShapesTool.js'),
                import('./LayerManager.js'),
                import('./FilterTool.js'),
                import('./HistoryManager.js'),
                import('./AnimationTool.js'),
                import('./FrameTool.js'),
                import('./AdjustmentsTool.js'),
                import('./HistogramTool.js')
            ]);

            const { CropTool } = cropModule;
            const { TextTool } = textModule;
            const { StickerTool } = stickerModule;
            const { ShapesTool } = shapesModule;
            const { LayerManager } = layerManagerModule;
            const { FilterTool } = filterModule;
            const { HistoryManager } = historyManagerModule;
            const { AnimationTool } = animationModule;
            const { FrameTool } = frameModule;
            const { AdjustmentsTool } = adjustmentsModule;
            const { HistogramTool } = histogramModule;

            // Get canvas element
            this.canvas = document.getElementById('main-canvas');
            this.ctx = this.canvas.getContext('2d');
            this.canvasContainer = document.getElementById('canvas-container');

            // Initialize managers
            this.layerManager = new LayerManager(this);
            this.historyManager = new HistoryManager(this);

            // Initialize tools
            this.tools.crop = new CropTool(this);
            this.tools.text = new TextTool(this);
            this.tools.sticker = new StickerTool(this);
            this.tools.shapes = new ShapesTool(this);
            this.tools.filter = new FilterTool(this);
            this.tools.animation = new AnimationTool(this);
            this.tools.frames = new FrameTool(this);
            this.tools.adjustments = new AdjustmentsTool(this);
            this.tools.histogram = new HistogramTool(this);

            // Setup event listeners
            this.setupEventListeners();
            this.setupToolbarListeners();
            
            this.isInitialized = true;
            
            // Check for image to load from URL parameters
            await this.checkForImageToLoad();
            
            console.log('Image Editor initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Image Editor:', error);
        }
    }

    async checkForImageToLoad() {
        const urlParams = new URLSearchParams(window.location.search);
        const imageToLoad = urlParams.get('load');
        const imageName = urlParams.get('name');
        
        if (imageToLoad) {
            try {
                await this.loadImageFromUrl(imageToLoad, imageName);
                // Clean up URL parameters
                window.history.replaceState({}, document.title, window.location.pathname);
            } catch (error) {
                console.error('Failed to load image from URL:', error);
                this.showNotification('Failed to load image', 'error');
            }
        }
    }

    async loadImageFromUrl(imageUrl, imageName = null) {
        try {
            const image = await this.loadImageFromSrc(imageUrl);
            this.originalImageName = imageName || 'loaded-image';
            this.setImage(image);
            this.showNotification('Image loaded successfully!', 'success');
        } catch (error) {
            console.error('Error loading image from URL:', error);
            throw error;
        }
    }

    loadImageFromSrc(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous'; // Handle CORS if needed
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    setupEventListeners() {
        // Upload functionality
        const uploadBtn = document.getElementById('upload-btn');
        const fileInput = document.getElementById('image-upload');
        
        if (uploadBtn) uploadBtn.addEventListener('click', () => fileInput.click());
        if (fileInput) fileInput.addEventListener('change', (e) => this.handleImageUpload(e));

        // Main controls
        const saveDropdownBtn = document.getElementById('save-dropdown-btn');
        const saveOptionsMenu = document.getElementById('save-options-menu');
        
        if (saveDropdownBtn) {
            saveDropdownBtn.addEventListener('click', () => {
                if (saveOptionsMenu) saveOptionsMenu.classList.toggle('hidden');
            });
        }

        document.querySelectorAll('.save-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const format = e.target.dataset.format;
                const quality = e.target.dataset.quality ? parseFloat(e.target.dataset.quality) : 1.0;
                this.saveImage(format, quality);
                if (saveOptionsMenu) saveOptionsMenu.classList.add('hidden');
            });
        });

        // Save to system functionality
        const saveToSystemBtn = document.getElementById('save-to-system-btn');
        if (saveToSystemBtn) {
            saveToSystemBtn.addEventListener('click', () => this.saveToSystem());
        }

        // Browser navigation
        const browserBtn = document.getElementById('browser-btn');
        if (browserBtn) {
            browserBtn.addEventListener('click', () => {
                // Check if we have a modal close function (when opened from image browser)
                if (this.closeBrowserModal && typeof this.closeBrowserModal === 'function') {
                    this.closeBrowserModal();
                } else {
                    window.location.href = '/image-browser';
                }
            });
        }

        // Hide dropdown if clicked outside
        document.addEventListener('click', (e) => {
            if (saveOptionsMenu && !document.getElementById('save-options-container')?.contains(e.target)) {
                saveOptionsMenu.classList.add('hidden');
            }
        });

        const resetBtn = document.getElementById('reset-btn');
        const undoBtn = document.getElementById('undo-btn');
        const redoBtn = document.getElementById('redo-btn');
        
        if (resetBtn) resetBtn.addEventListener('click', () => this.resetImage());
        if (undoBtn) undoBtn.addEventListener('click', () => this.historyManager.undo());
        if (redoBtn) redoBtn.addEventListener('click', () => this.historyManager.redo());

        // Setup zoom controls with a delay to ensure DOM is ready
        setTimeout(() => this.setupZoomControls(), 500);
    }

    setupZoomControls() {
        // Zoom button controls
        const zoomBtns = document.querySelectorAll('.zoom-btn');
        
        zoomBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const zoomType = btn.dataset.zoom;
                this.handleZoom(zoomType);
            });
        });

        // Mouse wheel zoom on canvas
        if (this.canvas) {
            this.canvas.addEventListener('wheel', (e) => {
                if (e.ctrlKey) {
                    e.preventDefault();
                    const delta = e.deltaY > 0 ? -0.1 : 0.1;
                    this.setZoom(this.zoomLevel + delta);
                }
            });
        }

        console.log('Zoom controls setup complete');
    }

    handleZoom(zoomType) {
        switch (zoomType) {
            case 'in':
                this.setZoom(this.zoomLevel + 0.2);
                break;
            case 'out':
                this.setZoom(this.zoomLevel - 0.2);
                break;
            case 'fit':
                this.fitToContainer();
                break;
        }
    }

    setZoom(newZoom) {
        // Constrain zoom level
        newZoom = Math.max(0.1, Math.min(newZoom, 5));
        this.zoomLevel = newZoom;
        
        if (this.canvas && this.originalCanvasSize.width > 0) {
            // Apply zoom to canvas display
            this.canvas.style.width = (this.originalCanvasSize.width * newZoom) + 'px';
            this.canvas.style.height = (this.originalCanvasSize.height * newZoom) + 'px';
            
            // Update zoom display
            this.updateZoomDisplay();
        }
    }

    fitToContainer() {
        if (!this.canvas || this.originalCanvasSize.width === 0) return;
        
        const container = this.canvas.parentElement;
        if (!container) return;
        
        const containerRect = container.getBoundingClientRect();
        const containerWidth = containerRect.width - 40; // Some padding
        const containerHeight = containerRect.height - 40;
        
        const scaleX = containerWidth / this.originalCanvasSize.width;
        const scaleY = containerHeight / this.originalCanvasSize.height;
        const scale = Math.min(scaleX, scaleY, 1); // Don't zoom in beyond 100%
        
        this.setZoom(scale);
    }

    updateZoomDisplay() {
        const zoomDisplay = document.getElementById('canvas-zoom');
        if (zoomDisplay) {
            zoomDisplay.textContent = Math.round(this.zoomLevel * 100) + '%';
        }
    }

    async handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const image = await this.loadImage(file);
            this.originalImageName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
            this.setImage(image);
        } catch (error) {
            console.error('Error loading image:', error);
            alert('Error loading image. Please try again.');
        }
    }

    loadImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    setImage(image) {
        this.originalImage = image;
        this.currentImage = image;

        // Set canvas size to match image
        this.canvas.width = image.width;
        this.canvas.height = image.height;
        
        // Store original canvas size for zoom calculations
        this.originalCanvasSize = {
            width: image.width,
            height: image.height
        };

        // Show canvas, hide placeholder
        this.canvas.classList.remove('hidden');
        const placeholder = document.getElementById('upload-placeholder');
        if (placeholder) placeholder.classList.add('hidden');

        // Draw image on canvas
        this.drawImage();

        // Enable controls
        const saveDropdownBtn = document.getElementById('save-dropdown-btn');
        const resetBtn = document.getElementById('reset-btn');
        const saveToSystemBtn = document.getElementById('save-to-system-btn');
        
        if (saveDropdownBtn) saveDropdownBtn.disabled = false;
        if (resetBtn) resetBtn.disabled = false;
        if (saveToSystemBtn) saveToSystemBtn.disabled = false;

        // Initialize layer with the image
        this.layerManager.addLayer('Background', image);
        
        // Fit image to container initially
        setTimeout(() => this.fitToContainer(), 100);
        
        // Save initial state
        this.historyManager.saveState();
    }

    drawImage(image = this.currentImage) {
        if (!image) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(image, 0, 0);
    }

    redraw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.layerManager.renderAllLayers();
    }

    saveImage(format = 'png', quality = 1.0) {
        const mimeType = `image/${format}`;
        const link = document.createElement('a');
        const originalName = this.originalImageName || 'edited-image';
        link.download = `${originalName}-edited-${Date.now()}.${format}`;
        link.href = this.canvas.toDataURL(mimeType, quality);
        link.click();
    }

    async saveToSystem() {
        if (!this.canvas) {
            this.showNotification('No image to save', 'error');
            return;
        }

        try {
            const saveBtn = document.getElementById('save-to-system-btn');
            const originalText = saveBtn?.innerHTML;
            
            // Show loading state
            if (saveBtn) {
                saveBtn.disabled = true;
                saveBtn.innerHTML = `
                    <svg class="w-4 h-4 animate-spin mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"></path>
                    </svg>
                    Saving...
                `;
            }

            const imageData = this.canvas.toDataURL('image/png');
            const originalName = this.originalImageName || 'edited-image';
            
            console.log('Attempting to save image...', { 
                hasImageData: !!imageData, 
                originalName,
                dataUrlLength: imageData?.length
            });
            
            const response = await fetch('/api/images/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                },
                body: JSON.stringify({
                    image_data: imageData,
                    original_name: originalName,
                    filename: null // Let backend generate filename
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Save response:', result);

            if (result.success) {
                this.showNotification(`Image saved as ${result.filename}!`, 'success');
                
                // If opened in modal (has closeBrowserModal function), just show success
                if (this.closeBrowserModal && typeof this.closeBrowserModal === 'function') {
                    setTimeout(() => {
                        this.showNotification('Image saved! You can close the editor to see it in the gallery.', 'success');
                    }, 1500);
                } else {
                    // Original behavior for standalone editor
                    setTimeout(() => {
                        if (confirm('Image saved successfully! Would you like to view it in the browser?')) {
                            window.location.href = '/image-browser';
                        }
                    }, 2000);
                }
            } else {
                throw new Error(result.error || 'Failed to save image');
            }

        } catch (error) {
            console.error('Error saving image:', error);
            this.showNotification(`Failed to save image: ${error.message}`, 'error');
        } finally {
            // Reset button state
            const saveBtn = document.getElementById('save-to-system-btn');
            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.innerHTML = `
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    Save to System
                `;
            }
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 max-w-md p-4 rounded-lg shadow-lg z-[9999] transform translate-x-full transition-transform duration-300 ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
        }`;
        
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    ${type === 'success' ? 
                        '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>' :
                      type === 'error' ?
                        '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>' :
                        '<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>'
                    }
                </svg>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.remove('translate-x-full'), 100);
        
        // Hide notification after 4 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    resetImage() {
        if (!this.originalImage) return;
        
        this.currentImage = this.originalImage;
        this.layerManager.reset();
        this.layerManager.addLayer('Background', this.originalImage);
        this.tools.filter.reset();
        this.drawImage();
        this.historyManager.saveState();
    }

    getCurrentCanvasData() {
        return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }

    setCanvasData(imageData) {
        this.ctx.putImageData(imageData, 0, 0);
    }

    setupToolbarListeners() {
        // Custom tab/panel logic for all tools
        const toolTabs = document.querySelectorAll('.tool-tab');
        const toolPanels = document.querySelectorAll('.tool-panel-content');
        toolTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const toolName = tab.getAttribute('data-tool');
                // Remove active from all tabs
                toolTabs.forEach(t => t.classList.remove('active'));
                // Add active to clicked tab
                tab.classList.add('active');
                // Hide all panels
                toolPanels.forEach(panel => panel.classList.add('hidden'));
                // Show the selected panel
                const selectedPanel = document.getElementById(`tool-${toolName}`);
                if (selectedPanel) {
                    selectedPanel.classList.remove('hidden');
                }
                // Activate the tool in JS
                if (this.tools[toolName] && typeof this.setActiveTool === 'function') {
                    this.setActiveTool(toolName);
                }
            });
        });
    }

    setActiveTool(toolId) {
        const toolName = toolId ? toolId.replace(/-([a-z])/g, g => g[1].toUpperCase()) : null;
        const panelsContainer = document.getElementById('panels-container');

        // Deactivate the currently active tool first.
        if (this.activeTool && this.tools[this.activeTool]?.deactivate) {
            this.tools[this.activeTool].deactivate();
        }

        // Always hide all panels and deactivate all buttons to ensure a clean state.
        document.querySelectorAll('.image-editor-panel').forEach(p => p.classList.add('hidden'));
        document.querySelectorAll('[id^="tool-"]').forEach(b => b.classList.remove('active'));

        // If the same tool is clicked again, or if no tool is provided, turn everything off.
        if (!toolId || this.activeTool === toolName) {
            this.activeTool = null;
            if (panelsContainer) panelsContainer.style.width = '0';
            return;
        }

        const tool = this.tools[toolName];
        const panel = document.getElementById(`tool-${toolId}`);
        const button = document.getElementById(`tool-${toolId}`);

        if (!tool || !button) {
            console.error(`Components for tool '${toolId}' could not be found.`);
            this.activeTool = null;
            if (panelsContainer) panelsContainer.style.width = '0';
            return;
        }

        // Show the panel for the new tool.
        panel.classList.remove('hidden');
        button.classList.add('active');
        if (panelsContainer) {
            panelsContainer.style.width = '20rem';
        }
        
        // Set the new tool as active.
        this.activeTool = toolName;

        // Finally, run the tool's specific activation logic.
        if (typeof tool.activate === 'function') {
            tool.activate();
        }
    }
}

// Make it globally available
window.ImageEditor = ImageEditor; 