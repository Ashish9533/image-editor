export class StickerTool {
    constructor(editor) {
        this.editor = editor;
        this.isActive = false;
        this.selectedSticker = null;
        this.stickerSize = 40;
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        const stickerButtons = document.querySelectorAll('.sticker-btn');
        const stickerSizeSlider = document.getElementById('sticker-size');
        const stickerSizeValue = document.getElementById('sticker-size-value');

        stickerButtons.forEach(btn => {
            btn.addEventListener('click', () => this.selectSticker(btn.dataset.sticker));
        });

        stickerSizeSlider.addEventListener('input', (e) => {
            this.stickerSize = parseInt(e.target.value);
            stickerSizeValue.textContent = this.stickerSize + 'px';
        });

        // Canvas click to place sticker
        this.editor.canvas.addEventListener('click', (e) => this.onCanvasClick(e));
    }

    selectSticker(sticker) {
        this.selectedSticker = sticker;
        this.isActive = true;
        
        // Highlight selected sticker
        document.querySelectorAll('.sticker-btn').forEach(btn => {
            btn.classList.remove('ring-2', 'ring-blue-500');
        });
        
        const selectedBtn = document.querySelector(`[data-sticker="${sticker}"]`);
        selectedBtn.classList.add('ring-2', 'ring-blue-500');
        
        // Show controls
        document.getElementById('sticker-controls').classList.remove('hidden');
        
        // Change cursor
        this.editor.canvas.style.cursor = 'crosshair';
        
        // Show size in real-time preview
        this.showStickerPreview();
    }

    showStickerPreview() {
        // Remove existing preview
        const existingPreview = document.getElementById('sticker-preview');
        if (existingPreview) {
            existingPreview.remove();
        }

        // Create preview element
        const preview = document.createElement('div');
        preview.id = 'sticker-preview';
        preview.style.cssText = `
            position: fixed;
            pointer-events: none;
            z-index: 1000;
            font-size: ${this.stickerSize}px;
            opacity: 0.7;
            display: none;
        `;
        preview.textContent = this.selectedSticker;
        document.body.appendChild(preview);

        // Track mouse movement
        const onMouseMove = (e) => {
            if (!this.isActive) {
                preview.style.display = 'none';
                return;
            }
            preview.style.display = 'block';
            preview.style.left = (e.clientX + 10) + 'px';
            preview.style.top = (e.clientY - 10) + 'px';
        };

        document.addEventListener('mousemove', onMouseMove);

        // Clean up preview when mode changes
        const originalCancelMode = () => {
            preview.remove();
            document.removeEventListener('mousemove', onMouseMove);
        };

        // Store cleanup function
        this.cleanupPreview = originalCancelMode;
    }

    onCanvasClick(e) {
        if (!this.isActive || !this.selectedSticker) return;

        const rect = this.editor.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Scale coordinates to canvas size
        const scaleX = this.editor.canvas.width / rect.width;
        const scaleY = this.editor.canvas.height / rect.height;
        
        const canvasX = x * scaleX;
        const canvasY = y * scaleY;

        this.addStickerAt(canvasX, canvasY);
    }

    addStickerAt(x, y) {
        const stickerData = {
            emoji: this.selectedSticker,
            x: x,
            y: y,
            size: this.stickerSize
        };

        this.drawSticker(stickerData);
        this.editor.layerManager.addLayer(`Sticker: ${this.selectedSticker}`, stickerData, 'sticker');
        this.editor.historyManager.saveState();
    }

    drawSticker(stickerData) {
        const ctx = this.editor.ctx;
        ctx.save();

        // Scale font size appropriately for canvas
        const rect = this.editor.canvas.getBoundingClientRect();
        const scaleX = this.editor.canvas.width / rect.width;
        const fontSize = stickerData.size * scaleX;

        ctx.font = `${fontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Draw emoji
        ctx.fillText(stickerData.emoji, stickerData.x, stickerData.y);

        ctx.restore();
    }

    renderStickerLayer(layer) {
        this.drawSticker(layer.data);
    }

    cancelStickerMode() {
        this.isActive = false;
        this.selectedSticker = null;
        
        // Remove highlighting
        document.querySelectorAll('.sticker-btn').forEach(btn => {
            btn.classList.remove('ring-2', 'ring-blue-500');
        });
        
        // Hide controls
        document.getElementById('sticker-controls').classList.add('hidden');
        
        // Reset cursor
        this.editor.canvas.style.cursor = 'default';
        
        // Clean up preview
        if (this.cleanupPreview) {
            this.cleanupPreview();
        }
    }
} 