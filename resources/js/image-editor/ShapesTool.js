export class ShapesTool {
    constructor(editor) {
        this.editor = editor;
        this.mode = 'draw'; // 'draw' or 'select'
        this.activeTool = null;
        this.isDrawing = false;
        this.startPos = { x: 0, y: 0 };
        this.currentPos = { x: 0, y: 0 };
        this.currentPath = [];
        this.selectedShape = null;
        this.shapeCounter = 0;

        this.properties = {
            fillEnabled: true,
            fillType: 'solid',
            fillColor: '#4F46E5',
            fillOpacity: 1,
            gradientColor1: '#4F46E5',
            gradientColor2: '#EC4899',
            gradientDirection: 'horizontal',
            patternType: 'dots',
            strokeColor: '#000000',
            strokeWidth: 2,
            strokeStyle: 'solid',
            rotation: 0,
            shadow: false,
            shadowColor: '#000000'
        };

        this.tempLayer = null; // For live preview

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Mode switching
        document.getElementById('draw-mode-btn').addEventListener('click', () => this.setMode('draw'));
        document.getElementById('select-mode-btn').addEventListener('click', () => this.setMode('select'));

        // Drawing tools
        document.querySelectorAll('.drawing-tool-btn').forEach(btn => {
            btn.addEventListener('click', () => this.selectTool(btn.dataset.tool));
        });

        // Actions
        document.getElementById('cancel-shape').addEventListener('click', () => this.cancelDrawing());
        document.getElementById('delete-selected-shape').addEventListener('click', () => this.deleteSelectedShape());
        document.getElementById('duplicate-selected-shape').addEventListener('click', () => this.duplicateSelectedShape());
        document.getElementById('apply-shape-changes').addEventListener('click', () => this.applyShapeChanges());

        // Property controls
        this.setupPropertyControls();

        // Canvas events
        this.editor.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.editor.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.editor.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.editor.canvas.addEventListener('click', this.onCanvasClick.bind(this));
    }

    setupPropertyControls() {
        // Fill controls
        document.getElementById('shape-fill-enable').addEventListener('change', (e) => {
            this.properties.fillEnabled = e.target.checked;
            this.updateSelectedShape();
        });

        document.getElementById('fill-type').addEventListener('change', (e) => {
            this.properties.fillType = e.target.value;
            this.toggleFillOptions();
            this.updateSelectedShape();
        });

        document.getElementById('shape-fill-color').addEventListener('input', (e) => {
            this.properties.fillColor = e.target.value;
            this.updateSelectedShape();
        });

        document.getElementById('fill-opacity').addEventListener('input', (e) => {
            this.properties.fillOpacity = parseInt(e.target.value) / 100;
            document.getElementById('fill-opacity-value').textContent = `${e.target.value}%`;
            this.updateSelectedShape();
        });

        // Gradient controls
        document.getElementById('gradient-color1').addEventListener('input', (e) => {
            this.properties.gradientColor1 = e.target.value;
            this.updateSelectedShape();
        });

        document.getElementById('gradient-color2').addEventListener('input', (e) => {
            this.properties.gradientColor2 = e.target.value;
            this.updateSelectedShape();
        });

        document.getElementById('gradient-direction').addEventListener('change', (e) => {
            this.properties.gradientDirection = e.target.value;
            this.updateSelectedShape();
        });

        // Pattern controls
        document.getElementById('pattern-type').addEventListener('change', (e) => {
            this.properties.patternType = e.target.value;
            this.updateSelectedShape();
        });

        // Stroke controls
        document.getElementById('shape-stroke-color').addEventListener('input', (e) => {
            this.properties.strokeColor = e.target.value;
            this.updateSelectedShape();
        });

        const strokeWidthSlider = document.getElementById('shape-stroke-width');
        strokeWidthSlider.addEventListener('input', (e) => {
            this.properties.strokeWidth = parseInt(e.target.value);
            document.getElementById('shape-stroke-width-value').textContent = `${this.properties.strokeWidth}px`;
            this.updateSelectedShape();
        });

        document.getElementById('stroke-style').addEventListener('change', (e) => {
            this.properties.strokeStyle = e.target.value;
            this.updateSelectedShape();
        });

        // Advanced controls
        document.getElementById('shape-rotation').addEventListener('input', (e) => {
            this.properties.rotation = parseInt(e.target.value);
            document.getElementById('shape-rotation-value').textContent = `${this.properties.rotation}°`;
            this.updateSelectedShape();
        });

        document.getElementById('shape-shadow').addEventListener('change', (e) => {
            this.properties.shadow = e.target.checked;
            document.getElementById('shadow-color').disabled = !e.target.checked;
            this.updateSelectedShape();
        });

        document.getElementById('shadow-color').addEventListener('input', (e) => {
            this.properties.shadowColor = e.target.value;
            this.updateSelectedShape();
        });
    }

    setMode(mode) {
        this.mode = mode;
        this.selectedShape = null;
        
        // Update UI
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('bg-blue-500', 'text-white');
            btn.classList.add('bg-gray-200', 'hover:bg-gray-300', 'text-gray-700');
        });

        if (mode === 'draw') {
            document.getElementById('draw-mode-btn').classList.remove('bg-gray-200', 'hover:bg-gray-300', 'text-gray-700');
            document.getElementById('draw-mode-btn').classList.add('bg-blue-500', 'text-white');
            document.getElementById('drawing-tools').classList.remove('hidden');
            document.getElementById('shape-management').classList.add('hidden');
            this.editor.canvas.style.cursor = 'crosshair';
        } else {
            document.getElementById('select-mode-btn').classList.remove('bg-gray-200', 'hover:bg-gray-300', 'text-gray-700');
            document.getElementById('select-mode-btn').classList.add('bg-blue-500', 'text-white');
            document.getElementById('drawing-tools').classList.add('hidden');
            document.getElementById('shape-management').classList.remove('hidden');
            this.editor.canvas.style.cursor = 'pointer';
            this.updateShapesList();
        }

        this.cancelDrawing();
    }

    selectTool(tool) {
        if (this.mode !== 'draw') return;
        
        this.activeTool = tool;
        
        // UI Updates
        document.querySelectorAll('.drawing-tool-btn').forEach(btn => btn.classList.remove('ring-2', 'ring-purple-500'));
        document.querySelector(`[data-tool="${tool}"]`).classList.add('ring-2', 'ring-purple-500');
        document.getElementById('shape-properties').classList.remove('hidden');
        document.getElementById('shape-instructions').classList.remove('hidden');
        this.editor.canvas.style.cursor = 'crosshair';

        // Toggle UI sections based on tool
        const isShape = !['drawing', 'line'].includes(tool);
        document.getElementById('fill-options').style.display = isShape ? 'block' : 'none';
        document.getElementById('properties-title').textContent = isShape ? 'Shape Properties' : 'Brush Properties';
        document.getElementById('stroke-brush-label').textContent = isShape ? 'Outline' : 'Brush';

        this.toggleFillOptions();
    }

    toggleFillOptions() {
        const fillType = this.properties.fillType;
        document.getElementById('solid-fill').classList.toggle('hidden', fillType !== 'solid');
        document.getElementById('gradient-fill').classList.toggle('hidden', fillType !== 'gradient');
        document.getElementById('pattern-fill').classList.toggle('hidden', fillType !== 'pattern');
    }
    
    cancelDrawing() {
        this.activeTool = null;
        this.isDrawing = false;
        this.selectedShape = null;
        document.querySelectorAll('.drawing-tool-btn').forEach(btn => btn.classList.remove('ring-2', 'ring-purple-500'));
        document.getElementById('shape-properties').classList.add('hidden');
        document.getElementById('shape-instructions').classList.add('hidden');
        document.getElementById('apply-shape-changes').classList.add('hidden');
        document.getElementById('selection-actions').classList.add('hidden');
        this.editor.canvas.style.cursor = this.mode === 'select' ? 'pointer' : 'default';
        this.editor.redraw();
        this.updateShapesList();
    }

    updateShapesList() {
        const shapesList = document.getElementById('shapes-list');
        const shapeLayers = this.editor.layerManager.layers.filter(layer => layer.type === 'shape');
        
        if (shapeLayers.length === 0) {
            shapesList.innerHTML = '<div class="text-xs text-gray-500 text-center py-4">No shapes added yet</div>';
            return;
        }

        shapesList.innerHTML = shapeLayers.map(layer => `
            <div class="shape-item p-2 border rounded cursor-pointer hover:bg-gray-50 ${
                this.selectedShape && this.selectedShape.id === layer.id ? 'bg-blue-50 border-blue-300' : 'border-gray-200'
            }" data-shape-id="${layer.id}">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                        <div class="w-4 h-4 rounded" style="background-color: ${layer.data.fillColor || '#transparent'}; border: 1px solid ${layer.data.strokeColor || '#ccc'}"></div>
                        <span class="text-xs font-medium">${layer.name}</span>
                    </div>
                    <span class="text-xs text-gray-500">${layer.data.type}</span>
                </div>
            </div>
        `).join('');

        // Add click listeners to shape items
        document.querySelectorAll('.shape-item').forEach(item => {
            item.addEventListener('click', () => {
                const shapeId = parseInt(item.dataset.shapeId);
                this.selectShape(shapeId);
            });
        });
    }

    selectShape(layerId) {
        const layer = this.editor.layerManager.layers.find(l => l.id === layerId);
        if (!layer || layer.type !== 'shape') return;

        this.selectedShape = layer;
        this.loadShapeProperties(layer.data);
        
        document.getElementById('shape-properties').classList.remove('hidden');
        document.getElementById('apply-shape-changes').classList.remove('hidden');
        document.getElementById('selection-actions').classList.remove('hidden');
        
        this.updateShapesList();
        this.editor.redraw();
    }

    loadShapeProperties(shapeData) {
        // Load properties into UI
        document.getElementById('shape-fill-enable').checked = shapeData.fillEnabled;
        document.getElementById('fill-type').value = shapeData.fillType || 'solid';
        document.getElementById('shape-fill-color').value = shapeData.fillColor || '#4F46E5';
        document.getElementById('fill-opacity').value = (shapeData.fillOpacity || 1) * 100;
        document.getElementById('fill-opacity-value').textContent = `${Math.round((shapeData.fillOpacity || 1) * 100)}%`;
        
        document.getElementById('gradient-color1').value = shapeData.gradientColor1 || '#4F46E5';
        document.getElementById('gradient-color2').value = shapeData.gradientColor2 || '#EC4899';
        document.getElementById('gradient-direction').value = shapeData.gradientDirection || 'horizontal';
        document.getElementById('pattern-type').value = shapeData.patternType || 'dots';
        
        document.getElementById('shape-stroke-color').value = shapeData.strokeColor || '#000000';
        document.getElementById('shape-stroke-width').value = shapeData.strokeWidth || 2;
        document.getElementById('shape-stroke-width-value').textContent = `${shapeData.strokeWidth || 2}px`;
        document.getElementById('stroke-style').value = shapeData.strokeStyle || 'solid';
        
        document.getElementById('shape-rotation').value = shapeData.rotation || 0;
        document.getElementById('shape-rotation-value').textContent = `${shapeData.rotation || 0}°`;
        document.getElementById('shape-shadow').checked = shapeData.shadow || false;
        document.getElementById('shadow-color').value = shapeData.shadowColor || '#000000';
        document.getElementById('shadow-color').disabled = !shapeData.shadow;

        // Update internal properties
        Object.assign(this.properties, shapeData);
        this.toggleFillOptions();
    }

    updateSelectedShape() {
        if (!this.selectedShape) return;
        
        Object.assign(this.selectedShape.data, this.properties);
        this.editor.redraw();
    }

    applyShapeChanges() {
        if (this.selectedShape) {
            this.editor.historyManager.saveState();
            this.cancelDrawing();
        }
    }

    deleteSelectedShape() {
        if (!this.selectedShape) return;
        
        this.editor.layerManager.deleteLayer(this.selectedShape.id);
        this.selectedShape = null;
        this.editor.historyManager.saveState();
        this.cancelDrawing();
        this.editor.redraw();
    }

    duplicateSelectedShape() {
        if (!this.selectedShape) return;
        
        const originalData = this.selectedShape.data;
        const duplicatedData = {
            ...originalData,
            x: originalData.x + 20,
            y: originalData.y + 20
        };
        
        const newLayer = this.editor.layerManager.addLayer(
            `${this.selectedShape.name} Copy`,
            duplicatedData,
            'shape'
        );
        
        this.selectShape(newLayer.id);
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

    onCanvasClick(e) {
        if (this.mode === 'select' && !this.isDrawing) {
            const coords = this.getCanvasCoordinates(e);
            const clickedShape = this.findShapeAtPosition(coords.x, coords.y);
            
            if (clickedShape) {
                this.selectShape(clickedShape.id);
            } else {
                this.cancelDrawing();
            }
        }
    }

    findShapeAtPosition(x, y) {
        const shapeLayers = this.editor.layerManager.layers.filter(layer => layer.type === 'shape');
        
        // Check from top to bottom (reverse order)
        for (let i = shapeLayers.length - 1; i >= 0; i--) {
            const layer = shapeLayers[i];
            if (this.isPointInShape(x, y, layer.data)) {
                return layer;
            }
        }
        return null;
    }

    isPointInShape(x, y, shapeData) {
        switch (shapeData.type) {
            case 'rectangle':
                return x >= shapeData.x && x <= shapeData.x + shapeData.width &&
                       y >= shapeData.y && y <= shapeData.y + shapeData.height;
            
            case 'ellipse':
                const centerX = shapeData.x + shapeData.width / 2;
                const centerY = shapeData.y + shapeData.height / 2;
                const rx = Math.abs(shapeData.width) / 2;
                const ry = Math.abs(shapeData.height) / 2;
                return ((x - centerX) ** 2) / (rx ** 2) + ((y - centerY) ** 2) / (ry ** 2) <= 1;
            
            case 'triangle':
            case 'star':
            case 'polygon':
            case 'heart':
                // Simple bounding box check for complex shapes
                return x >= shapeData.x && x <= shapeData.x + shapeData.width &&
                       y >= shapeData.y && y <= shapeData.y + shapeData.height;
            
            case 'line':
            case 'arrow':
                // Check if point is near the line (within stroke width)
                const dist = this.distanceToLine(x, y, shapeData.x, shapeData.y, 
                    shapeData.x + shapeData.width, shapeData.y + shapeData.height);
                return dist <= (shapeData.strokeWidth || 2) + 5;
            
            case 'drawing':
                // Check if point is near any part of the path
                return this.isPointNearPath(x, y, shapeData.path, (shapeData.strokeWidth || 2) + 5);
        }
        return false;
    }

    distanceToLine(px, py, x1, y1, x2, y2) {
        const A = px - x1;
        const B = py - y1;
        const C = x2 - x1;
        const D = y2 - y1;

        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        let param = -1;
        if (lenSq !== 0) param = dot / lenSq;

        let xx, yy;
        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }

        const dx = px - xx;
        const dy = py - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }

    isPointNearPath(x, y, path, threshold) {
        for (let i = 0; i < path.length - 1; i++) {
            const dist = this.distanceToLine(x, y, path[i].x, path[i].y, path[i + 1].x, path[i + 1].y);
            if (dist <= threshold) return true;
        }
        return false;
    }

    onMouseDown(e) {
        if (this.mode !== 'draw' || !this.activeTool) return;
        
        this.isDrawing = true;
        this.startPos = this.getCanvasCoordinates(e);
        this.currentPos = this.startPos;
        
        if (this.activeTool === 'drawing') {
            this.currentPath = [this.startPos];
        }
    }

    onMouseMove(e) {
        if (!this.isDrawing || this.mode !== 'draw') return;
        
        this.currentPos = this.getCanvasCoordinates(e);

        if (this.activeTool === 'drawing') {
            this.currentPath.push(this.currentPos);
        }

        this.editor.redraw();
        this.drawPreview(this.editor.ctx);
    }

    onMouseUp() {
        if (!this.isDrawing || this.mode !== 'draw') return;
        
        this.isDrawing = false;
        
        let layerData, layerName;
        const isComplexShape = ['triangle', 'star', 'polygon', 'heart', 'arrow'].includes(this.activeTool);
        const isBasicShape = ['rectangle', 'ellipse'].includes(this.activeTool);
        const isLine = ['line', 'arrow'].includes(this.activeTool);

        if (isBasicShape || isComplexShape) {
            layerData = {
                type: this.activeTool,
                x: Math.min(this.startPos.x, this.currentPos.x),
                y: Math.min(this.startPos.y, this.currentPos.y),
                width: Math.abs(this.currentPos.x - this.startPos.x),
                height: Math.abs(this.currentPos.y - this.startPos.y),
                ...this.properties
            };
            layerName = `${this.activeTool.charAt(0).toUpperCase() + this.activeTool.slice(1)} ${++this.shapeCounter}`;
            
            // Don't add zero-size shapes
            if (layerData.width < 5 || layerData.height < 5) return;
            
        } else if (isLine) {
            layerData = {
                type: this.activeTool,
                x: this.startPos.x,
                y: this.startPos.y,
                width: this.currentPos.x - this.startPos.x,
                height: this.currentPos.y - this.startPos.y,
                strokeColor: this.properties.strokeColor,
                strokeWidth: this.properties.strokeWidth,
                strokeStyle: this.properties.strokeStyle
            };
            layerName = `${this.activeTool.charAt(0).toUpperCase() + this.activeTool.slice(1)} ${++this.shapeCounter}`;
            
        } else { // Drawing
            layerData = {
                type: 'drawing',
                path: this.currentPath,
                strokeColor: this.properties.strokeColor,
                strokeWidth: this.properties.strokeWidth,
                strokeStyle: this.properties.strokeStyle
            };
            layerName = `Drawing ${++this.shapeCounter}`;
            if (this.currentPath.length < 2) return;
        }
        
        this.editor.layerManager.addLayer(layerName, layerData, 'shape');
        this.editor.historyManager.saveState();
        this.currentPath = [];
        this.editor.redraw();
    }

    drawPreview(ctx) {
        if (!this.isDrawing) return;
        
        ctx.save();
        const isComplexShape = ['triangle', 'star', 'polygon', 'heart', 'arrow'].includes(this.activeTool);
        const isBasicShape = ['rectangle', 'ellipse'].includes(this.activeTool);
        const isLine = ['line', 'arrow'].includes(this.activeTool);

        if (isBasicShape || isComplexShape) {
            this.drawShape(ctx, {
                type: this.activeTool,
                x: Math.min(this.startPos.x, this.currentPos.x),
                y: Math.min(this.startPos.y, this.currentPos.y),
                width: Math.abs(this.currentPos.x - this.startPos.x),
                height: Math.abs(this.currentPos.y - this.startPos.y),
                ...this.properties
            });
        } else if (isLine) {
            this.drawLine(ctx, {
                type: this.activeTool,
                x: this.startPos.x,
                y: this.startPos.y,
                width: this.currentPos.x - this.startPos.x,
                height: this.currentPos.y - this.startPos.y,
                strokeColor: this.properties.strokeColor,
                strokeWidth: this.properties.strokeWidth,
                strokeStyle: this.properties.strokeStyle
            });
        } else { // Drawing
            this.drawPath(ctx, {
                path: this.currentPath,
                strokeColor: this.properties.strokeColor,
                strokeWidth: this.properties.strokeWidth,
                strokeStyle: this.properties.strokeStyle
            });
        }
        ctx.restore();
    }
    
    renderShapeLayer(layer, ctx = this.editor.ctx) {
        const data = layer.data;
        
        ctx.save();
        
        // Apply layer opacity
        ctx.globalAlpha = layer.opacity || 1;
        
        // Check if this shape is selected and in select mode
        const isSelected = this.mode === 'select' && this.selectedShape && this.selectedShape.id === layer.id;
        
        if (['rectangle', 'ellipse', 'triangle', 'star', 'polygon', 'heart'].includes(data.type)) {
            this.drawShape(ctx, data, layer);
        } else if (['line', 'arrow'].includes(data.type)) {
            this.drawLine(ctx, data);
        } else if (data.type === 'drawing') {
            this.drawPath(ctx, data);
        }
        
        // Draw selection indicator
        if (isSelected) {
            this.drawSelectionIndicator(ctx, data);
        }
        
        ctx.restore();
    }

    drawSelectionIndicator(ctx, shapeData) {
        ctx.save();
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        
        if (['rectangle', 'ellipse', 'triangle', 'star', 'polygon', 'heart'].includes(shapeData.type)) {
            ctx.strokeRect(shapeData.x - 5, shapeData.y - 5, shapeData.width + 10, shapeData.height + 10);
        } else if (['line', 'arrow'].includes(shapeData.type)) {
            const x1 = shapeData.x;
            const y1 = shapeData.y;
            const x2 = shapeData.x + shapeData.width;
            const y2 = shapeData.y + shapeData.height;
            const minX = Math.min(x1, x2) - 5;
            const minY = Math.min(y1, y2) - 5;
            const maxX = Math.max(x1, x2) + 5;
            const maxY = Math.max(y1, y2) + 5;
            ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
        }
        
        ctx.restore();
    }

    createFillStyle(ctx, shapeData, bounds) {
        if (!shapeData.fillEnabled) return null;
        
        switch (shapeData.fillType) {
            case 'solid':
                const color = this.hexToRgba(shapeData.fillColor, shapeData.fillOpacity || 1);
                return color;
                
            case 'gradient':
                return this.createGradient(ctx, shapeData, bounds);
                
            case 'pattern':
                return this.createPattern(ctx, shapeData);
                
            default:
                return shapeData.fillColor;
        }
    }

    createGradient(ctx, shapeData, bounds) {
        let gradient;
        const { x, y, width, height } = bounds;
        
        switch (shapeData.gradientDirection) {
            case 'horizontal':
                gradient = ctx.createLinearGradient(x, y, x + width, y);
                break;
            case 'vertical':
                gradient = ctx.createLinearGradient(x, y, x, y + height);
                break;
            case 'diagonal':
                gradient = ctx.createLinearGradient(x, y, x + width, y + height);
                break;
            case 'radial':
                gradient = ctx.createRadialGradient(x + width/2, y + height/2, 0, x + width/2, y + height/2, Math.max(width, height)/2);
                break;
            default:
                gradient = ctx.createLinearGradient(x, y, x + width, y);
        }
        
        gradient.addColorStop(0, shapeData.gradientColor1);
        gradient.addColorStop(1, shapeData.gradientColor2);
        return gradient;
    }

    createPattern(ctx, shapeData) {
        const canvas = document.createElement('canvas');
        const patternCtx = canvas.getContext('2d');
        const size = 20;
        canvas.width = size;
        canvas.height = size;
        
        patternCtx.fillStyle = '#ffffff';
        patternCtx.fillRect(0, 0, size, size);
        patternCtx.fillStyle = shapeData.fillColor;
        
        switch (shapeData.patternType) {
            case 'dots':
                patternCtx.beginPath();
                patternCtx.arc(size/2, size/2, 3, 0, Math.PI * 2);
                patternCtx.fill();
                break;
            case 'stripes':
                for (let i = 0; i < size; i += 4) {
                    patternCtx.fillRect(i, 0, 2, size);
                }
                break;
            case 'grid':
                patternCtx.fillRect(0, 0, size, 2);
                patternCtx.fillRect(0, 0, 2, size);
                break;
            case 'checkerboard':
                patternCtx.fillRect(0, 0, size/2, size/2);
                patternCtx.fillRect(size/2, size/2, size/2, size/2);
                break;
        }
        
        return ctx.createPattern(canvas, 'repeat');
    }

    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    applyStrokeStyle(ctx, strokeStyle) {
        switch (strokeStyle) {
            case 'dashed':
                ctx.setLineDash([10, 5]);
                break;
            case 'dotted':
                ctx.setLineDash([2, 3]);
                break;
            default:
                ctx.setLineDash([]);
        }
    }

    drawPath(ctx, data) {
        if (!data.path || data.path.length < 2) return;
        
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(data.path[0].x, data.path[0].y);
        for (let i = 1; i < data.path.length; i++) {
            ctx.lineTo(data.path[i].x, data.path[i].y);
        }
        
        ctx.strokeStyle = data.strokeColor;
        ctx.lineWidth = data.strokeWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        this.applyStrokeStyle(ctx, data.strokeStyle);
        ctx.stroke();
        ctx.restore();
    }

    drawLine(ctx, data) {
        ctx.save();
        
        // Apply shadow if enabled
        if (data.shadow) {
            ctx.shadowColor = data.shadowColor;
            ctx.shadowBlur = 5;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
        }
        
        const x1 = data.x;
        const y1 = data.y;
        const x2 = data.x + data.width;
        const y2 = data.y + data.height;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        
        if (data.type === 'arrow') {
            // Draw arrowhead
            const angle = Math.atan2(y2 - y1, x2 - x1);
            const headlen = 15;
            ctx.lineTo(x2 - headlen * Math.cos(angle - Math.PI / 6), y2 - headlen * Math.sin(angle - Math.PI / 6));
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - headlen * Math.cos(angle + Math.PI / 6), y2 - headlen * Math.sin(angle + Math.PI / 6));
        }
        
        ctx.strokeStyle = data.strokeColor;
        ctx.lineWidth = data.strokeWidth;
        ctx.lineCap = 'round';
        this.applyStrokeStyle(ctx, data.strokeStyle);
        ctx.stroke();
        ctx.restore();
    }
    
    drawShape(ctx, shapeData, layer = null) {
        ctx.save();
        
        let { x, y, width, height } = shapeData;
        
        // Handle animated scale
        if (layer && layer.animationScale) {
            const scale = layer.animationScale;
            const newWidth = width * scale;
            const newHeight = height * scale;
            x = x + (width - newWidth) / 2;
            y = y + (height - newHeight) / 2;
            width = newWidth;
            height = newHeight;
        }

        // Apply rotation if set
        if (shapeData.rotation) {
            const centerX = x + width / 2;
            const centerY = y + height / 2;
            ctx.translate(centerX, centerY);
            ctx.rotate((shapeData.rotation * Math.PI) / 180);
            ctx.translate(-centerX, -centerY);
        }

        // Apply shadow if enabled
        if (shapeData.shadow) {
            ctx.shadowColor = shapeData.shadowColor;
            ctx.shadowBlur = 5;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
        }

        ctx.beginPath();
        
        switch (shapeData.type) {
            case 'rectangle':
                ctx.rect(x, y, width, height);
                break;
                
            case 'ellipse':
                ctx.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, 2 * Math.PI);
                break;
                
            case 'triangle':
                ctx.moveTo(x + width / 2, y);
                ctx.lineTo(x + width, y + height);
                ctx.lineTo(x, y + height);
                ctx.closePath();
                break;
                
            case 'star':
                this.drawStar(ctx, x + width / 2, y + height / 2, 5, Math.min(width, height) / 2, Math.min(width, height) / 4);
                break;
                
            case 'polygon':
                this.drawPolygon(ctx, x + width / 2, y + height / 2, 5, Math.min(width, height) / 2);
                break;
                
            case 'heart':
                this.drawHeart(ctx, x, y, width, height);
                break;
        }

        // Fill shape
        const fillStyle = this.createFillStyle(ctx, shapeData, { x, y, width, height });
        if (fillStyle) {
            ctx.fillStyle = fillStyle;
            ctx.fill();
        }

        // Stroke shape
        if (shapeData.strokeWidth > 0) {
            ctx.strokeStyle = shapeData.strokeColor;
            ctx.lineWidth = shapeData.strokeWidth;
            this.applyStrokeStyle(ctx, shapeData.strokeStyle);
            ctx.stroke();
        }
        
        ctx.restore();
    }

    drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;

        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
    }

    drawPolygon(ctx, cx, cy, sides, radius) {
        const angle = (2 * Math.PI) / sides;
        ctx.moveTo(cx + radius, cy);
        for (let i = 1; i < sides; i++) {
            ctx.lineTo(cx + radius * Math.cos(i * angle), cy + radius * Math.sin(i * angle));
        }
        ctx.closePath();
    }

    drawHeart(ctx, x, y, width, height) {
        const topCurveHeight = height * 0.3;
        ctx.moveTo(x + width / 2, y + topCurveHeight);
        // Top left curve
        ctx.bezierCurveTo(x + width / 2, y, x, y, x, y + topCurveHeight);
        ctx.bezierCurveTo(x, y + (height + topCurveHeight) / 2, x + width / 2, y + (height + topCurveHeight) / 2, x + width / 2, y + height);
        ctx.bezierCurveTo(x + width / 2, y + (height + topCurveHeight) / 2, x + width, y + (height + topCurveHeight) / 2, x + width, y + topCurveHeight);
        // Top right curve
        ctx.bezierCurveTo(x + width, y, x + width / 2, y, x + width / 2, y + topCurveHeight);
        ctx.closePath();
    }
} 