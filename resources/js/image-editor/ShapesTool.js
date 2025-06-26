export class ShapesTool {
    constructor(editor) {
        this.editor = editor;
        this.activeTool = null; // 'rectangle', 'ellipse', or 'drawing'
        this.isDrawing = false;
        this.startPos = { x: 0, y: 0 };
        this.currentPos = { x: 0, y: 0 };
        this.currentPath = [];

        this.properties = {
            fillEnabled: true,
            fillColor: '#4F46E5',
            strokeColor: '#000000',
            strokeWidth: 2,
        };

        this.tempLayer = null; // For live preview

        this.setupEventListeners();
    }

    setupEventListeners() {
        document.querySelectorAll('.drawing-tool-btn').forEach(btn => {
            btn.addEventListener('click', () => this.selectTool(btn.dataset.tool));
        });

        document.getElementById('cancel-shape').addEventListener('click', () => this.cancelDrawing());

        // Property controls
        document.getElementById('shape-fill-enable').addEventListener('change', (e) => this.properties.fillEnabled = e.target.checked);
        document.getElementById('shape-fill-color').addEventListener('input', (e) => this.properties.fillColor = e.target.value);
        document.getElementById('shape-stroke-color').addEventListener('input', (e) => this.properties.strokeColor = e.target.value);
        
        const strokeWidthSlider = document.getElementById('shape-stroke-width');
        strokeWidthSlider.addEventListener('input', (e) => {
            this.properties.strokeWidth = parseInt(e.target.value);
            document.getElementById('shape-stroke-width-value').textContent = `${this.properties.strokeWidth}px`;
        });

        // Canvas events
        this.editor.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.editor.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.editor.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
    }

    selectTool(tool) {
        this.activeTool = tool;
        
        // UI Updates
        document.querySelectorAll('.drawing-tool-btn').forEach(btn => btn.classList.remove('ring-2', 'ring-purple-500'));
        document.querySelector(`[data-tool="${tool}"]`).classList.add('ring-2', 'ring-purple-500');
        document.getElementById('shape-properties').classList.remove('hidden');
        document.getElementById('shape-instructions').classList.remove('hidden');
        this.editor.canvas.style.cursor = 'crosshair';

        // Toggle UI sections based on tool
        const isShape = tool === 'rectangle' || tool === 'ellipse';
        document.getElementById('fill-options').style.display = isShape ? 'block' : 'none';
        document.getElementById('properties-title').textContent = isShape ? 'Shape Properties' : 'Brush Properties';
        document.getElementById('stroke-brush-label').textContent = isShape ? 'Outline' : 'Brush';
    }
    
    cancelDrawing() {
        this.activeTool = null;
        this.isDrawing = false;
        document.querySelectorAll('.drawing-tool-btn').forEach(btn => btn.classList.remove('ring-2', 'ring-purple-500'));
        document.getElementById('shape-properties').classList.add('hidden');
        document.getElementById('shape-instructions').classList.add('hidden');
        this.editor.canvas.style.cursor = 'default';
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

    onMouseDown(e) {
        if (!this.activeTool) return;
        this.isDrawing = true;
        this.startPos = this.getCanvasCoordinates(e);
        this.currentPos = this.startPos;
        if (this.activeTool === 'drawing') {
            this.currentPath = [this.startPos];
        }
    }

    onMouseMove(e) {
        if (!this.isDrawing) return;
        this.currentPos = this.getCanvasCoordinates(e);

        if (this.activeTool === 'drawing') {
            this.currentPath.push(this.currentPos);
        }

        this.editor.redraw();
        this.drawPreview(this.editor.ctx);
    }

    onMouseUp() {
        if (!this.isDrawing) return;
        this.isDrawing = false;
        
        let layerData, layerName;
        const isShape = this.activeTool === 'rectangle' || this.activeTool === 'ellipse';

        if (isShape) {
            layerData = {
                type: this.activeTool,
                x: this.startPos.x, y: this.startPos.y,
                width: this.currentPos.x - this.startPos.x,
                height: this.currentPos.y - this.startPos.y,
                ...this.properties
            };
            layerName = `Shape: ${this.activeTool}`;
            // Don't add zero-size shapes
            if (Math.abs(layerData.width) < 5 || Math.abs(layerData.height) < 5) return;
        } else { // Drawing
            layerData = {
                type: 'drawing',
                path: this.currentPath,
                strokeColor: this.properties.strokeColor,
                strokeWidth: this.properties.strokeWidth,
            };
            layerName = 'Drawing';
            if (this.currentPath.length < 2) return;
        }
        
        this.editor.layerManager.addLayer(layerName, layerData, 'shape');
        this.editor.historyManager.saveState();
        this.currentPath = [];
        this.cancelDrawing();
        this.editor.redraw();
    }

    drawPreview(ctx) {
        ctx.save();
        const isShape = this.activeTool === 'rectangle' || this.activeTool === 'ellipse';
        if (isShape) {
            this.drawShape(ctx, {
                type: this.activeTool,
                x: this.startPos.x, y: this.startPos.y,
                width: this.currentPos.x - this.startPos.x,
                height: this.currentPos.y - this.startPos.y,
                ...this.properties
            });
        } else { // Drawing
            this.drawPath(ctx, {
                path: this.currentPath,
                strokeColor: this.properties.strokeColor,
                strokeWidth: this.properties.strokeWidth,
            });
        }
        ctx.restore();
    }
    
    renderShapeLayer(layer, ctx = this.editor.ctx) {
        const data = layer.data;
        if (data.type === 'rectangle' || data.type === 'ellipse') {
            this.drawShape(ctx, data, layer);
        } else if (data.type === 'drawing') {
            this.drawPath(ctx, data);
        }
    }

    drawPath(ctx, data) {
        if (data.path.length < 2) return;
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
        ctx.stroke();
        ctx.restore();
    }
    
    drawShape(ctx, shapeData, layer = null) {
        ctx.save();
        
        let x = shapeData.width > 0 ? shapeData.x : shapeData.x + shapeData.width;
        let y = shapeData.height > 0 ? shapeData.y : shapeData.y + shapeData.height;
        let width = Math.abs(shapeData.width);
        let height = Math.abs(shapeData.height);

        // Handle animated scale
        if (layer && layer.animationScale) {
            const scale = layer.animationScale;
            const newWidth = width * scale;
            const newHeight = height * scale;
            // Adjust position to scale from center
            x = x + (width - newWidth) / 2;
            y = y + (height - newHeight) / 2;
            width = newWidth;
            height = newHeight;
        }

        ctx.beginPath();
        if (shapeData.type === 'rectangle') {
            ctx.rect(x, y, width, height);
        } else if (shapeData.type === 'ellipse') {
            ctx.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, 2 * Math.PI);
        }

        if (shapeData.fillEnabled) {
            ctx.fillStyle = shapeData.fillColor;
            ctx.fill();
        }

        if (shapeData.strokeWidth > 0) {
            ctx.strokeStyle = shapeData.strokeColor;
            ctx.lineWidth = shapeData.strokeWidth;
            ctx.stroke();
        }
        
        ctx.restore();
    }
} 