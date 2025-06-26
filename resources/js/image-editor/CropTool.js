export class CropTool {
    constructor(editor) {
        this.editor = editor;
        this.isActive = false;
        this.cropArea = { x: 0, y: 0, width: 0, height: 0 };
        this.aspectRatio = null;
        this.isDragging = false;
        this.isResizing = false;
        this.dragStart = { x: 0, y: 0 };
        this.resizeHandle = null;
        this.showGrid = false;
        
        // Keep track of canvas state
        this.canvasRect = null;
        this.originalCanvasStyle = {};
        this.minWidth = 50;
        this.minHeight = 50;
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        const cropToggle = document.getElementById('crop-toggle');
        const applyCrop = document.getElementById('apply-crop');
        const cancelCrop = document.getElementById('cancel-crop');
        const cropPresets = document.querySelectorAll('.crop-preset');
        const showGrid = document.getElementById('show-grid');
        const autoFit = document.getElementById('auto-fit');
        const minWidthInput = document.getElementById('min-width');
        const minHeightInput = document.getElementById('min-height');

        // Zoom controls
        const cropZoom = document.getElementById('crop-zoom');
        const zoomInCrop = document.getElementById('zoom-in-crop');
        const zoomOutCrop = document.getElementById('zoom-out-crop');

        if (cropToggle) cropToggle.addEventListener('click', () => this.toggleCrop());
        if (applyCrop) applyCrop.addEventListener('click', () => this.applyCrop());
        if (cancelCrop) cancelCrop.addEventListener('click', () => this.cancelCrop());
        if (showGrid) showGrid.addEventListener('change', (e) => this.toggleGrid(e.target.checked));
        if (autoFit) autoFit.addEventListener('change', (e) => this.setAutoFit(e.target.checked));
        
        if (minWidthInput) minWidthInput.addEventListener('change', (e) => this.setMinWidth(parseInt(e.target.value)));
        if (minHeightInput) minHeightInput.addEventListener('change', (e) => this.setMinHeight(parseInt(e.target.value)));

        // Zoom controls
        if (cropZoom) cropZoom.addEventListener('input', (e) => this.setZoomLevel(parseInt(e.target.value)));
        if (zoomInCrop) zoomInCrop.addEventListener('click', () => this.zoomIn());
        if (zoomOutCrop) zoomOutCrop.addEventListener('click', () => this.zoomOut());

        cropPresets.forEach(preset => {
            preset.addEventListener('click', (e) => {
                cropPresets.forEach(p => p.classList.remove('bg-blue-100', 'border-blue-500', 'text-blue-700'));
                e.currentTarget.classList.add('bg-blue-100', 'border-blue-500', 'text-blue-700');
                this.setAspectRatio(preset.dataset.ratio);
            });
        });

        this.setupCanvasEvents();
    }

    setupCanvasEvents() {
        const container = document.getElementById('canvas-container');
        
        if (container) {
            container.addEventListener('mousedown', (e) => this.onMouseDown(e));
            container.addEventListener('mousemove', (e) => this.onMouseMove(e));
            container.addEventListener('mouseup', (e) => this.onMouseUp(e));
            
            // Touch events
            container.addEventListener('touchstart', (e) => this.onTouchStart(e));
            container.addEventListener('touchmove', (e) => this.onTouchMove(e));
            container.addEventListener('touchend', (e) => this.onTouchEnd(e));
            
            // Wheel event for zoom
            container.addEventListener('wheel', (e) => this.onWheel(e));
        }
    }

    toggleCrop() {
        this.isActive = !this.isActive;
        const cropToggle = document.getElementById('crop-toggle');
        const cropControls = document.getElementById('crop-controls');
        const cropOverlay = document.getElementById('crop-overlay');

        if (this.isActive) {
            if (cropToggle) {
                cropToggle.textContent = 'Exit Crop Mode';
                cropToggle.classList.remove('bg-blue-500', 'hover:bg-blue-600');
                cropToggle.classList.add('bg-red-500', 'hover:bg-red-600');
            }
            if (cropControls) cropControls.classList.remove('hidden');
            if (cropOverlay) cropOverlay.classList.remove('hidden');
            
            this.initializeCropMode();
        } else {
            this.cancelCrop();
        }
    }

    initializeCropMode() {
        const canvas = this.editor.canvas;
        if (!canvas || canvas.classList.contains('hidden')) return;

        // Store current canvas style to preserve it
        this.storeOriginalCanvasStyle();
        
        // Get current canvas display dimensions (don't change them!)
        this.updateCanvasRect();
        
        // Show zoom controls if image is large
        this.updateZoomControls();
        
        // Initialize crop area based on current canvas size
        this.initializeCropArea();
        
        // Setup interactive handles
        this.setupCropHandles();
    }

    storeOriginalCanvasStyle() {
        const canvas = this.editor.canvas;
        if (!canvas) return;

        // Store the current canvas style so we can restore it
        this.originalCanvasStyle = {
            width: canvas.style.width,
            height: canvas.style.height,
            position: canvas.style.position,
            left: canvas.style.left,
            top: canvas.style.top,
            transform: canvas.style.transform
        };
    }

    updateCanvasRect() {
        const canvas = this.editor.canvas;
        if (!canvas) return;

        // Get the actual displayed size and position of the canvas
        this.canvasRect = canvas.getBoundingClientRect();
    }

    updateZoomControls() {
        const canvas = this.editor.canvas;
        const zoomControls = document.getElementById('crop-zoom-controls');
        if (!canvas || !zoomControls) return;

        // Show zoom controls if image is larger than container or user might need zoom
        const container = document.getElementById('canvas-container');
        const containerRect = container.getBoundingClientRect();
        
        const needsZoom = canvas.width > containerRect.width * 0.8 || 
                         canvas.height > containerRect.height * 0.8;

        if (needsZoom) {
            zoomControls.classList.remove('hidden');
            this.updateZoomDisplay();
        } else {
            zoomControls.classList.add('hidden');
        }
    }

    updateZoomDisplay() {
        const canvas = this.editor.canvas;
        if (!canvas) return;

        // Calculate current zoom level based on canvas display vs actual size
        const displayWidth = this.canvasRect.width;
        const actualWidth = canvas.width;
        const currentZoom = Math.round((displayWidth / actualWidth) * 100);

        const zoomValue = document.getElementById('crop-zoom-value');
        const zoomSlider = document.getElementById('crop-zoom');
        
        if (zoomValue) zoomValue.textContent = `${currentZoom}%`;
        if (zoomSlider) zoomSlider.value = currentZoom;
    }

    setZoomLevel(zoomPercent) {
        const canvas = this.editor.canvas;
        if (!canvas) return;

        const zoomFactor = zoomPercent / 100;
        
        // Calculate new display size
        const newWidth = canvas.width * zoomFactor;
        const newHeight = canvas.height * zoomFactor;
        
        // Apply zoom to canvas
        canvas.style.width = newWidth + 'px';
        canvas.style.height = newHeight + 'px';
        
        // Update our tracking
        this.updateCanvasRect();
        this.updateZoomDisplay();
        
        // Update crop area if active
        if (this.isActive) {
            this.constrainCropArea();
            this.updateCropDisplay();
        }
    }

    zoomIn() {
        const canvas = this.editor.canvas;
        if (!canvas) return;

        const currentZoom = (this.canvasRect.width / canvas.width) * 100;
        const newZoom = Math.min(currentZoom + 20, 300);
        this.setZoomLevel(newZoom);
    }

    zoomOut() {
        const canvas = this.editor.canvas;
        if (!canvas) return;

        const currentZoom = (this.canvasRect.width / canvas.width) * 100;
        const newZoom = Math.max(currentZoom - 20, 10);
        this.setZoomLevel(newZoom);
    }

    onWheel(e) {
        if (!this.isActive || !e.ctrlKey) return;
        
        e.preventDefault();
        const delta = e.deltaY > 0 ? -10 : 10;
        const canvas = this.editor.canvas;
        const currentZoom = (this.canvasRect.width / canvas.width) * 100;
        this.setZoomLevel(currentZoom + delta);
    }

    initializeCropArea() {
        // Initialize crop area to center 80% of current canvas display size
        const padding = this.canvasRect.width * 0.1;
        
        this.cropArea = {
            x: padding,
            y: padding,
            width: this.canvasRect.width - (padding * 2),
            height: this.canvasRect.height - (padding * 2)
        };
        
        // Apply aspect ratio if set
        if (this.aspectRatio) {
            this.adjustCropToAspectRatio();
        }
        
        this.constrainCropArea();
        this.updateCropDisplay();
    }

    constrainCropArea() {
        // Ensure crop area stays within current canvas display bounds
        const maxWidth = this.canvasRect.width;
        const maxHeight = this.canvasRect.height;
        
        // Apply minimum sizes
        this.cropArea.width = Math.max(this.minWidth, Math.min(this.cropArea.width, maxWidth));
        this.cropArea.height = Math.max(this.minHeight, Math.min(this.cropArea.height, maxHeight));
        
        // Constrain position
        this.cropArea.x = Math.max(0, Math.min(this.cropArea.x, maxWidth - this.cropArea.width));
        this.cropArea.y = Math.max(0, Math.min(this.cropArea.y, maxHeight - this.cropArea.height));
    }

    updateCropDisplay() {
        this.updateCropSelection();
        this.updateCropMask();
        this.updateCropInfo();
    }

    updateCropSelection() {
        const cropSelection = document.getElementById('crop-selection');
        if (!cropSelection) return;
        
        // Position relative to canvas current position
        const canvasRect = this.canvasRect;
        const left = canvasRect.left + this.cropArea.x;
        const top = canvasRect.top + this.cropArea.y;
        
        // Position relative to the container
        const container = document.getElementById('canvas-container');
        const containerRect = container.getBoundingClientRect();
        
        cropSelection.style.left = (left - containerRect.left) + 'px';
        cropSelection.style.top = (top - containerRect.top) + 'px';
        cropSelection.style.width = this.cropArea.width + 'px';
        cropSelection.style.height = this.cropArea.height + 'px';
    }

    updateCropMask() {
        const cropMask = document.getElementById('crop-mask');
        if (!cropMask) return;
        
        // Calculate mask coordinates relative to container
        const canvasRect = this.canvasRect;
        const container = document.getElementById('canvas-container');
        const containerRect = container.getBoundingClientRect();
        
        const left = canvasRect.left - containerRect.left + this.cropArea.x;
        const top = canvasRect.top - containerRect.top + this.cropArea.y;
        const right = left + this.cropArea.width;
        const bottom = top + this.cropArea.height;
        
        const clipPath = `polygon(
            0% 0%, 
            0% 100%, 
            ${left}px 100%, 
            ${left}px ${top}px, 
            ${right}px ${top}px, 
            ${right}px ${bottom}px, 
            ${left}px ${bottom}px, 
            ${left}px 100%, 
            100% 100%, 
            100% 0%
        )`;
        
        cropMask.style.clipPath = clipPath;
    }

    updateCropInfo() {
        const canvas = this.editor.canvas;
        if (!canvas) return;

        // Convert crop area to actual image coordinates
        const scaleX = canvas.width / this.canvasRect.width;
        const scaleY = canvas.height / this.canvasRect.height;
        
        const actualWidth = Math.round(this.cropArea.width * scaleX);
        const actualHeight = Math.round(this.cropArea.height * scaleY);
        const actualX = Math.round(this.cropArea.x * scaleX);
        const actualY = Math.round(this.cropArea.y * scaleY);
        
        // Calculate aspect ratio
        const gcd = this.calculateGCD(actualWidth, actualHeight);
        const ratioW = actualWidth / gcd;
        const ratioH = actualHeight / gcd;
        
        // Update display
        const dimensionsEl = document.getElementById('crop-dimensions');
        const ratioEl = document.getElementById('crop-ratio');
        const positionEl = document.getElementById('crop-position');
        
        if (dimensionsEl) dimensionsEl.textContent = `${actualWidth} × ${actualHeight}px`;
        if (ratioEl) ratioEl.textContent = `${ratioW}:${ratioH}`;
        if (positionEl) positionEl.textContent = `(${actualX}, ${actualY})`;
    }

    calculateGCD(a, b) {
        return b === 0 ? a : this.calculateGCD(b, a % b);
    }

    setupCropHandles() {
        const cropSelection = document.getElementById('crop-selection');
        if (!cropSelection) return;

        // Remove existing event listeners by cloning elements
        const handles = cropSelection.querySelectorAll('.crop-handle');
        handles.forEach(handle => {
            const newHandle = handle.cloneNode(true);
            handle.parentNode.replaceChild(newHandle, handle);
        });

        // Add new event listeners
        const newHandles = cropSelection.querySelectorAll('.crop-handle');
        newHandles.forEach(handle => {
            handle.addEventListener('mousedown', (e) => this.onHandleMouseDown(e));
            handle.addEventListener('touchstart', (e) => this.onHandleTouchStart(e));
        });

        // Setup move handle
        const moveHandle = document.getElementById('crop-move-handle');
        if (moveHandle) {
            const newMoveHandle = moveHandle.cloneNode(true);
            moveHandle.parentNode.replaceChild(newMoveHandle, moveHandle);
            
            newMoveHandle.addEventListener('mousedown', (e) => this.onMoveHandleMouseDown(e));
            newMoveHandle.addEventListener('touchstart', (e) => this.onMoveHandleTouchStart(e));
        }
    }

    onHandleMouseDown(e) {
        if (!this.isActive) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        this.isResizing = true;
        this.resizeHandle = this.getHandleType(e.target);
        this.dragStart = { x: e.clientX, y: e.clientY };
        
        document.addEventListener('mousemove', this.onHandleMouseMove.bind(this));
        document.addEventListener('mouseup', this.onHandleMouseUp.bind(this));
    }

    onMoveHandleMouseDown(e) {
        if (!this.isActive) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        this.isDragging = true;
        
        // Calculate position relative to canvas
        const canvasRect = this.canvasRect;
        const container = document.getElementById('canvas-container');
        const containerRect = container.getBoundingClientRect();
        
        const x = e.clientX - canvasRect.left;
        const y = e.clientY - canvasRect.top;
        
        this.dragStart = { 
            x: x - this.cropArea.x, 
            y: y - this.cropArea.y 
        };
        
        document.addEventListener('mousemove', this.onMoveMouseMove.bind(this));
        document.addEventListener('mouseup', this.onMoveMouseUp.bind(this));
    }

    getHandleType(element) {
        const classList = element.classList;
        if (classList.contains('cursor-nw-resize')) return 'nw';
        if (classList.contains('cursor-ne-resize')) return 'ne';
        if (classList.contains('cursor-sw-resize')) return 'sw';
        if (classList.contains('cursor-se-resize')) return 'se';
        if (classList.contains('cursor-n-resize')) return 'n';
        if (classList.contains('cursor-e-resize')) return 'e';
        if (classList.contains('cursor-s-resize')) return 's';
        if (classList.contains('cursor-w-resize')) return 'w';
        return null;
    }

    onHandleMouseMove(e) {
        if (!this.isResizing) return;
        
        e.preventDefault();
        const deltaX = e.clientX - this.dragStart.x;
        const deltaY = e.clientY - this.dragStart.y;
        
        this.resizeCropArea(deltaX, deltaY);
        this.dragStart = { x: e.clientX, y: e.clientY };
        
        this.constrainCropArea();
        this.updateCropDisplay();
    }

    onMoveMouseMove(e) {
        if (!this.isDragging) return;
        
        e.preventDefault();
        
        const canvasRect = this.canvasRect;
        const x = e.clientX - canvasRect.left;
        const y = e.clientY - canvasRect.top;
        
        this.cropArea.x = x - this.dragStart.x;
        this.cropArea.y = y - this.dragStart.y;
        
        this.constrainCropArea();
        this.updateCropDisplay();
    }

    resizeCropArea(deltaX, deltaY) {
        const originalArea = { ...this.cropArea };
        
        switch (this.resizeHandle) {
            case 'nw':
                this.cropArea.x += deltaX;
                this.cropArea.y += deltaY;
                this.cropArea.width -= deltaX;
                this.cropArea.height -= deltaY;
                break;
            case 'ne':
                this.cropArea.y += deltaY;
                this.cropArea.width += deltaX;
                this.cropArea.height -= deltaY;
                break;
            case 'sw':
                this.cropArea.x += deltaX;
                this.cropArea.width -= deltaX;
                this.cropArea.height += deltaY;
                break;
            case 'se':
                this.cropArea.width += deltaX;
                this.cropArea.height += deltaY;
                break;
            case 'n':
                this.cropArea.y += deltaY;
                this.cropArea.height -= deltaY;
                break;
            case 'e':
                this.cropArea.width += deltaX;
                break;
            case 's':
                this.cropArea.height += deltaY;
                break;
            case 'w':
                this.cropArea.x += deltaX;
                this.cropArea.width -= deltaX;
                break;
        }
        
        // Apply aspect ratio constraint if set
        if (this.aspectRatio) {
            this.maintainAspectRatio();
        }
        
        // Check minimum size
        if (this.cropArea.width < this.minWidth || this.cropArea.height < this.minHeight) {
            this.cropArea = originalArea;
        }
    }

    maintainAspectRatio() {
        const currentRatio = this.cropArea.width / this.cropArea.height;
        
        if (Math.abs(currentRatio - this.aspectRatio) > 0.01) {
            if (this.resizeHandle && (this.resizeHandle.includes('e') || this.resizeHandle.includes('w'))) {
                this.cropArea.height = this.cropArea.width / this.aspectRatio;
            } else {
                this.cropArea.width = this.cropArea.height * this.aspectRatio;
            }
        }
    }

    onHandleMouseUp(e) {
        this.isResizing = false;
        this.resizeHandle = null;
        
        document.removeEventListener('mousemove', this.onHandleMouseMove.bind(this));
        document.removeEventListener('mouseup', this.onHandleMouseUp.bind(this));
    }

    onMoveMouseUp(e) {
        this.isDragging = false;
        
        document.removeEventListener('mousemove', this.onMoveMouseMove.bind(this));
        document.removeEventListener('mouseup', this.onMoveMouseUp.bind(this));
    }

    // Touch event handlers
    onHandleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        this.onHandleMouseDown(mouseEvent);
    }

    onMoveHandleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        this.onMoveHandleMouseDown(mouseEvent);
    }

    onTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        this.onMouseDown(mouseEvent);
    }

    onTouchMove(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        this.onMouseMove(mouseEvent);
    }

    onTouchEnd(e) {
        e.preventDefault();
        const mouseEvent = new MouseEvent('mouseup', {});
        this.onMouseUp(mouseEvent);
    }

    // Legacy mouse events for fallback
    onMouseDown(e) {
        if (!this.isActive) return;
    }

    onMouseMove(e) {
        if (!this.isActive) return;
    }

    onMouseUp(e) {
        if (!this.isActive) return;
    }

    setAspectRatio(ratio) {
        if (ratio === 'free') {
            this.aspectRatio = null;
        } else {
            const [w, h] = ratio.split(':').map(Number);
            this.aspectRatio = w / h;
            
            if (this.isActive && this.cropArea.width > 0) {
                this.adjustCropToAspectRatio();
                this.updateCropDisplay();
            }
        }
    }

    adjustCropToAspectRatio() {
        const centerX = this.cropArea.x + this.cropArea.width / 2;
        const centerY = this.cropArea.y + this.cropArea.height / 2;
        
        // Calculate new dimensions maintaining aspect ratio
        if (this.cropArea.width / this.aspectRatio <= this.canvasRect.height) {
            this.cropArea.height = this.cropArea.width / this.aspectRatio;
        } else {
            this.cropArea.width = this.cropArea.height * this.aspectRatio;
        }
        
        // Reposition to keep centered
        this.cropArea.x = centerX - this.cropArea.width / 2;
        this.cropArea.y = centerY - this.cropArea.height / 2;
        
        this.constrainCropArea();
    }

    setAutoFit(enabled) {
        // This feature is now optional - doesn't force resize
        if (enabled && this.isActive) {
            const canvas = this.editor.canvas;
            const container = document.getElementById('canvas-container');
            const containerRect = container.getBoundingClientRect();
            
            const maxWidth = containerRect.width * 0.9;
            const maxHeight = containerRect.height * 0.9;
            
            if (canvas.width > maxWidth || canvas.height > maxHeight) {
                const scaleX = maxWidth / canvas.width;
                const scaleY = maxHeight / canvas.height;
                const scale = Math.min(scaleX, scaleY);
                
                this.setZoomLevel(scale * 100);
            }
        }
    }

    setMinWidth(width) {
        this.minWidth = Math.max(10, Math.min(width, 5000));
    }

    setMinHeight(height) {
        this.minHeight = Math.max(10, Math.min(height, 5000));
    }

    toggleGrid(show) {
        this.showGrid = show;
        const grid = document.getElementById('crop-grid');
        if (grid) {
            grid.classList.toggle('hidden', !show);
        }
    }

    cancelCrop() {
        this.isActive = false;
        this.aspectRatio = null;
        this.isDragging = false;
        this.isResizing = false;
        this.showGrid = false;
        
        // Restore original canvas style (keep original size!)
        const canvas = this.editor.canvas;
        if (canvas && this.originalCanvasStyle) {
            Object.assign(canvas.style, this.originalCanvasStyle);
        }
        
        const cropToggle = document.getElementById('crop-toggle');
        const cropControls = document.getElementById('crop-controls');
        const cropOverlay = document.getElementById('crop-overlay');
        const showGridCheckbox = document.getElementById('show-grid');
        const zoomControls = document.getElementById('crop-zoom-controls');

        if (cropToggle) {
            cropToggle.textContent = 'Start Crop';
            cropToggle.classList.remove('bg-red-500', 'hover:bg-red-600');
            cropToggle.classList.add('bg-blue-500', 'hover:bg-blue-600');
        }
        if (cropControls) cropControls.classList.add('hidden');
        if (cropOverlay) cropOverlay.classList.add('hidden');
        if (showGridCheckbox) showGridCheckbox.checked = false;
        if (zoomControls) zoomControls.classList.add('hidden');

        // Reset preset buttons
        document.querySelectorAll('.crop-preset').forEach(preset => {
            preset.classList.remove('bg-blue-100', 'border-blue-500', 'text-blue-700');
        });
    }

    applyCrop() {
        if (!this.isActive || this.cropArea.width === 0 || this.cropArea.height === 0) return;

        const canvas = this.editor.canvas;
        
        // Convert crop area to actual image coordinates
        const scaleX = canvas.width / this.canvasRect.width;
        const scaleY = canvas.height / this.canvasRect.height;
        
        const actualCrop = {
            x: Math.round(this.cropArea.x * scaleX),
            y: Math.round(this.cropArea.y * scaleY),
            width: Math.round(this.cropArea.width * scaleX),
            height: Math.round(this.cropArea.height * scaleY)
        };

        // Validate crop coordinates
        if (actualCrop.x < 0 || actualCrop.y < 0 || 
            actualCrop.x + actualCrop.width > canvas.width || 
            actualCrop.y + actualCrop.height > canvas.height) {
            console.error('Invalid crop coordinates:', actualCrop);
            return;
        }

        // Create new canvas with cropped image
        const croppedCanvas = document.createElement('canvas');
        const croppedCtx = croppedCanvas.getContext('2d');
        
        croppedCanvas.width = actualCrop.width;
        croppedCanvas.height = actualCrop.height;

        // Draw cropped portion
        croppedCtx.drawImage(
            canvas,
            actualCrop.x, actualCrop.y, actualCrop.width, actualCrop.height,
            0, 0, actualCrop.width, actualCrop.height
        );

        // Update main canvas
        canvas.width = actualCrop.width;
        canvas.height = actualCrop.height;
        this.editor.ctx.clearRect(0, 0, actualCrop.width, actualCrop.height);
        this.editor.ctx.drawImage(croppedCanvas, 0, 0);

        // Create new image from cropped canvas
        const croppedImage = new Image();
        croppedImage.onload = () => {
            this.editor.currentImage = croppedImage;
            
            // Update image info in modal if available
            if (this.editor.modalController) {
                this.editor.modalController.updateImageInfo({
                    width: actualCrop.width,
                    height: actualCrop.height,
                    format: 'PNG'
                });
            }
            
            this.editor.historyManager.saveState();
        };
        croppedImage.src = croppedCanvas.toDataURL();

        // Cancel crop mode
        this.cancelCrop();
    }
} 