export class LayerManager {
    constructor(editor) {
        this.editor = editor;
        this.layers = [];
        this.activeLayer = null;
        this.layerCounter = 0;
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        const layerOpacity = document.getElementById('layer-opacity');
        const opacityValue = document.getElementById('opacity-value');
        const moveLayerUp = document.getElementById('move-layer-up');
        const moveLayerDown = document.getElementById('move-layer-down');
        const deleteLayer = document.getElementById('delete-layer');

        layerOpacity.addEventListener('input', (e) => {
            const opacity = parseInt(e.target.value);
            opacityValue.textContent = opacity + '%';
            this.setLayerOpacity(opacity / 100);
        });

        moveLayerUp.addEventListener('click', () => this.moveLayerUp());
        moveLayerDown.addEventListener('click', () => this.moveLayerDown());
        deleteLayer.addEventListener('click', () => this.deleteActiveLayer());
    }

    addLayer(name, data, type = 'image') {
        const layer = {
            id: this.layerCounter++,
            name: name,
            data: data,
            type: type, // 'image', 'text', 'sticker'
            opacity: 1,
            visible: true
        };

        this.layers.push(layer);
        this.activeLayer = layer;
        this.updateLayersList();
        this.renderAllLayers();
        
        return layer;
    }

    updateLayersList() {
        const layersList = document.getElementById('layers-list');
        layersList.innerHTML = '';

        // Reverse layers for display (top layer first)
        const reversedLayers = [...this.layers].reverse();

        reversedLayers.forEach((layer, index) => {
            const layerElement = this.createLayerElement(layer, this.layers.length - 1 - index);
            layersList.appendChild(layerElement);
        });
    }

    createLayerElement(layer, actualIndex) {
        const layerDiv = document.createElement('div');
        layerDiv.className = `layer-item p-2 border rounded cursor-pointer ${
            this.activeLayer && this.activeLayer.id === layer.id ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-300'
        }`;
        layerDiv.dataset.layerId = layer.id;
        layerDiv.dataset.layerIndex = actualIndex;

        layerDiv.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                    <input type="checkbox" ${layer.visible ? 'checked' : ''} 
                           class="layer-visibility" onclick="event.stopPropagation()">
                    <span class="text-sm font-medium truncate">${layer.name}</span>
                </div>
                <div class="text-xs text-gray-500">${Math.round(layer.opacity * 100)}%</div>
            </div>
        `;

        // Layer selection
        layerDiv.addEventListener('click', () => this.selectLayer(layer));

        // Visibility toggle
        const visibilityCheckbox = layerDiv.querySelector('.layer-visibility');
        visibilityCheckbox.addEventListener('change', (e) => {
            layer.visible = e.target.checked;
            this.renderAllLayers();
        });

        return layerDiv;
    }

    selectLayer(layer) {
        this.activeLayer = layer;
        this.updateLayersList();
        
        // Update opacity slider
        document.getElementById('layer-opacity').value = layer.opacity * 100;
        document.getElementById('opacity-value').textContent = Math.round(layer.opacity * 100) + '%';
    }

    setLayerOpacity(opacity) {
        if (!this.activeLayer) return;
        
        this.activeLayer.opacity = opacity;
        this.updateLayersList();
        this.renderAllLayers();
    }

    moveLayerUp() {
        if (!this.activeLayer) return;
        
        const currentIndex = this.layers.findIndex(l => l.id === this.activeLayer.id);
        if (currentIndex < this.layers.length - 1) {
            // Swap with layer above
            [this.layers[currentIndex], this.layers[currentIndex + 1]] = 
            [this.layers[currentIndex + 1], this.layers[currentIndex]];
            
            this.updateLayersList();
            this.renderAllLayers();
            this.editor.historyManager.saveState();
        }
    }

    moveLayerDown() {
        if (!this.activeLayer) return;
        
        const currentIndex = this.layers.findIndex(l => l.id === this.activeLayer.id);
        if (currentIndex > 0) {
            // Swap with layer below
            [this.layers[currentIndex], this.layers[currentIndex - 1]] = 
            [this.layers[currentIndex - 1], this.layers[currentIndex]];
            
            this.updateLayersList();
            this.renderAllLayers();
            this.editor.historyManager.saveState();
        }
    }

    deleteActiveLayer() {
        if (!this.activeLayer || this.layers.length <= 1) return;
        
        const layerIndex = this.layers.findIndex(l => l.id === this.activeLayer.id);
        this.layers.splice(layerIndex, 1);
        
        // Select next layer or previous if at end
        if (layerIndex < this.layers.length) {
            this.activeLayer = this.layers[layerIndex];
        } else if (this.layers.length > 0) {
            this.activeLayer = this.layers[this.layers.length - 1];
        } else {
            this.activeLayer = null;
        }
        
        this.updateLayersList();
        this.renderAllLayers();
        this.editor.historyManager.saveState();
    }

    renderAllLayers() {
        this.editor.ctx.clearRect(0, 0, this.editor.canvas.width, this.editor.canvas.height);
        
        this.layers.forEach(layer => {
            if (!layer.visible) return;
            
            this.editor.ctx.save();
            this.editor.ctx.globalAlpha = layer.opacity;
            
            switch (layer.type) {
                case 'image':
                    if (layer.data instanceof Image) {
                        this.editor.ctx.drawImage(layer.data, 0, 0);
                    }
                    break;
                case 'text':
                    this.editor.tools.text.renderTextLayer(layer);
                    break;
                case 'sticker':
                    this.editor.tools.sticker.renderStickerLayer(layer);
                    break;
            }
            
            this.editor.ctx.restore();
        });
    }

    reset() {
        this.layers = [];
        this.activeLayer = null;
        this.layerCounter = 0;
        this.updateLayersList();
    }

    getLayersData() {
        return this.layers.map(layer => ({
            ...layer,
            data: layer.type === 'image' ? layer.data.src : layer.data
        }));
    }

    restoreLayersData(layersData) {
        this.layers = layersData;
        this.updateLayersList();
        this.renderAllLayers();
    }
} 