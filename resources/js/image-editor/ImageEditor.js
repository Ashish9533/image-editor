class ImageEditor {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.originalImage = null;
        this.currentImage = null;
        this.tools = {};
        this.layerManager = null;
        this.historyManager = null;
        this.isInitialized = false;
    }

    async init() {
        try {
            // Import all tool modules
            const [
                { CropTool },
                { TextTool },
                { StickerTool },
                { LayerManager },
                { FilterTool },
                { HistoryManager }
            ] = await Promise.all([
                import('./CropTool.js'),
                import('./TextTool.js'),
                import('./StickerTool.js'),
                import('./LayerManager.js'),
                import('./FilterTool.js'),
                import('./HistoryManager.js')
            ]);

            // Get canvas element
            this.canvas = document.getElementById('main-canvas');
            this.ctx = this.canvas.getContext('2d');

            // Initialize managers
            this.layerManager = new LayerManager(this);
            this.historyManager = new HistoryManager(this);

            // Initialize tools
            this.tools.crop = new CropTool(this);
            this.tools.text = new TextTool(this);
            this.tools.sticker = new StickerTool(this);
            this.tools.filter = new FilterTool(this);

            // Setup event listeners
            this.setupEventListeners();
            
            this.isInitialized = true;
            console.log('Image Editor initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Image Editor:', error);
        }
    }

    setupEventListeners() {
        // Upload functionality
        const uploadBtn = document.getElementById('upload-btn');
        const fileInput = document.getElementById('image-upload');
        
        uploadBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => this.handleImageUpload(e));

        // Main controls
        document.getElementById('save-btn').addEventListener('click', () => this.saveImage());
        document.getElementById('reset-btn').addEventListener('click', () => this.resetImage());
        document.getElementById('undo-btn').addEventListener('click', () => this.historyManager.undo());
        document.getElementById('redo-btn').addEventListener('click', () => this.historyManager.redo());
    }

    async handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const image = await this.loadImage(file);
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

        // Show canvas, hide placeholder
        this.canvas.classList.remove('hidden');
        document.getElementById('upload-placeholder').classList.add('hidden');

        // Draw image on canvas
        this.drawImage();

        // Enable controls
        document.getElementById('save-btn').disabled = false;
        document.getElementById('reset-btn').disabled = false;

        // Initialize layer with the image
        this.layerManager.addLayer('Background', image);
        
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

    saveImage() {
        const link = document.createElement('a');
        link.download = 'edited-image.png';
        link.href = this.canvas.toDataURL();
        link.click();
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
}

// Make it globally available
window.ImageEditor = ImageEditor; 