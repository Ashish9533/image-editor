export class StickerTool {
    constructor(editor) {
        this.editor = editor;
        this.activeStickerLayer = null; // The currently selected sticker *layer* object
        this.selectedStickerEmoji = null; // The emoji string to be placed from the panel
        
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Panel controls
        const stickerButtons = document.querySelectorAll('.sticker-btn');
        stickerButtons.forEach(btn => {
            btn.addEventListener('click', () => this.onSelectStickerFromPanel(btn.dataset.sticker));
        });

        // Property controls
        const sizeSlider = document.getElementById('sticker-size');
        const rotationSlider = document.getElementById('sticker-rotation');
        const opacitySlider = document.getElementById('sticker-opacity');

        if (sizeSlider) sizeSlider.addEventListener('input', (e) => this.updateActiveStickerProperty('size', parseInt(e.target.value)));
        if (rotationSlider) rotationSlider.addEventListener('input', (e) => this.updateActiveStickerProperty('rotation', parseInt(e.target.value)));
        if (opacitySlider) opacitySlider.addEventListener('input', (e) => {
            if (this.activeStickerLayer) {
                const newOpacity = parseInt(e.target.value) / 100;
                this.activeStickerLayer.opacity = newOpacity; // Directly update layer opacity
                this.updateControls(); // This will update the slider text
                this.editor.redraw(); // Redraw with new opacity
            }
        });
        
        // Action buttons
        const duplicateBtn = document.getElementById('sticker-duplicate');
        const deleteBtn = document.getElementById('sticker-delete');

        if (duplicateBtn) duplicateBtn.addEventListener('click', () => this.duplicateActiveSticker());
        if (deleteBtn) deleteBtn.addEventListener('click', () => this.deleteActiveSticker());

        // Canvas events
        this.editor.canvas.addEventListener('mousedown', this.onCanvasMouseDown.bind(this));
        this.editor.canvas.addEventListener('mousemove', this.onCanvasMouseMove.bind(this));
        this.editor.canvas.addEventListener('mouseup', this.onCanvasMouseUp.bind(this));
        
        // Touch events
        this.editor.canvas.addEventListener('touchstart', (e) => { e.preventDefault(); this.onCanvasMouseDown(e.touches[0]); }, { passive: false });
        this.editor.canvas.addEventListener('touchmove', (e) => { e.preventDefault(); this.onCanvasMouseMove(e.touches[0]); }, { passive: false });
        this.editor.canvas.addEventListener('touchend', (e) => { e.preventDefault(); this.onCanvasMouseUp(e.changedTouches[0]); }, { passive: false });
    }

    onSelectStickerFromPanel(stickerEmoji) {
        this.selectedStickerEmoji = stickerEmoji;
        this.editor.canvas.style.cursor = 'copy';
        this.setActiveStickerLayer(null);

        document.querySelectorAll('.sticker-btn').forEach(btn => btn.classList.remove('ring-2', 'ring-purple-500'));
        document.querySelector(`[data-sticker="${stickerEmoji}"]`).classList.add('ring-2', 'ring-purple-500');
    }

    placeSticker(x, y) {
        if (!this.selectedStickerEmoji) return;

        const stickerData = {
            id: Date.now(), // Unique ID for the sticker data itself
            emoji: this.selectedStickerEmoji,
            x, y,
            size: 50,
            rotation: 0,
            opacity: 1,
        };

        const newLayer = this.editor.layerManager.addLayer(`Sticker: ${stickerData.emoji}`, stickerData, 'sticker');
        this.setActiveStickerLayer(newLayer);

        this.selectedStickerEmoji = null;
        this.editor.canvas.style.cursor = 'default';
        document.querySelectorAll('.sticker-btn').forEach(btn => btn.classList.remove('ring-2', 'ring-purple-500'));
        
        this.editor.historyManager.saveState();
        this.editor.redraw();
    }
    
    getCanvasCoordinates(e) {
        const rect = this.editor.canvas.getBoundingClientRect();
        const scaleX = this.editor.canvas.width / rect.width;
        const scaleY = this.editor.canvas.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }
    
    findStickerAtPosition(x, y) {
        const stickerLayers = this.editor.layerManager.layers.filter(l => l.type === 'sticker');
        // Iterate backwards to select the top-most sticker layer
        for (let i = stickerLayers.length - 1; i >= 0; i--) {
            const layer = stickerLayers[i];
            const sticker = layer.data;
            const dx = x - sticker.x;
            const dy = y - sticker.y;
            // Simple bounding box check based on size
            if (Math.abs(dx) < sticker.size / 2 && Math.abs(dy) < sticker.size / 2) {
                return layer; // Return the entire layer
            }
        }
        return null;
    }

    onCanvasMouseDown(e) {
        const coords = this.getCanvasCoordinates(e);

        if (this.selectedStickerEmoji) {
            this.placeSticker(coords.x, coords.y);
            return;
        }

        const clickedStickerLayer = this.findStickerAtPosition(coords.x, coords.y);
        this.setActiveStickerLayer(clickedStickerLayer);

        if (clickedStickerLayer) {
            this.isDragging = true;
            this.dragOffset = {
                x: coords.x - clickedStickerLayer.data.x,
                y: coords.y - clickedStickerLayer.data.y
            };
            this.editor.canvas.style.cursor = 'grabbing';
        }
        this.editor.redraw();
    }
    
    onCanvasMouseMove(e) {
        if (this.isDragging && this.activeStickerLayer) {
            const coords = this.getCanvasCoordinates(e);
            this.activeStickerLayer.data.x = coords.x - this.dragOffset.x;
            this.activeStickerLayer.data.y = coords.y - this.dragOffset.y;
            this.editor.redraw();
        }
    }

    onCanvasMouseUp() {
        if (this.isDragging) {
            this.editor.historyManager.saveState();
        }
        this.isDragging = false;
        this.editor.canvas.style.cursor = 'default';
    }

    setActiveStickerLayer(layer) {
        this.activeStickerLayer = layer;
        const controls = document.getElementById('sticker-controls');
        if (layer) {
            controls.classList.remove('hidden');
            this.updateControls();
            this.editor.layerManager.selectLayer(layer);
        } else {
            controls.classList.add('hidden');
        }
    }

    updateControls() {
        if (!this.activeStickerLayer) return;
        const stickerData = this.activeStickerLayer.data;
        document.getElementById('sticker-size').value = stickerData.size;
        document.getElementById('sticker-size-value').textContent = `${stickerData.size}px`;
        document.getElementById('sticker-rotation').value = stickerData.rotation;
        document.getElementById('sticker-rotation-value').textContent = `${stickerData.rotation}°`;
        document.getElementById('sticker-opacity').value = this.activeStickerLayer.opacity * 100;
        document.getElementById('sticker-opacity-value').textContent = `${Math.round(this.activeStickerLayer.opacity * 100)}%`;
    }

    updateActiveStickerProperty(prop, value) {
        if (!this.activeStickerLayer) return;
        this.activeStickerLayer.data[prop] = value;
        this.updateControls();
        this.editor.redraw();
    }

    deleteActiveSticker() {
        if (!this.activeStickerLayer) return;
        this.editor.layerManager.deleteLayer(this.activeStickerLayer.id);
        this.setActiveStickerLayer(null);
        this.editor.historyManager.saveState();
        this.editor.redraw();
    }
    
    duplicateActiveSticker() {
        if (!this.activeStickerLayer) return;

        const oldStickerData = this.activeStickerLayer.data;
        const newStickerData = {
            ...oldStickerData,
            id: Date.now(),
            x: oldStickerData.x + 20,
            y: oldStickerData.y + 20,
        };

        const newLayer = this.editor.layerManager.addLayer(`Sticker: ${newStickerData.emoji}`, newStickerData, 'sticker');
        this.setActiveStickerLayer(newLayer);
        this.editor.historyManager.saveState();
        this.editor.redraw();
    }
    
    renderStickerLayer(layer, ctx = this.editor.ctx) {
        this.drawSticker(layer, ctx);
    }
    
    drawSticker(layer, ctx = this.editor.ctx) {
        const stickerData = layer.data;
        ctx.save();
        
        ctx.globalAlpha = layer.opacity;
        ctx.translate(stickerData.x, stickerData.y);
        ctx.rotate(stickerData.rotation * Math.PI / 180);
        
        const scale = layer.animationScale || 1;
        const finalSize = stickerData.size * scale;

        ctx.font = `${finalSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(stickerData.emoji, 0, 0);

        // Draw selection indicator if this sticker is active
        if (this.activeStickerLayer && this.activeStickerLayer.id === layer.id) {
            const size = finalSize;
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.strokeRect(-size / 2, -size / 2, size, size);
        }
        
        ctx.restore();
    }
} 