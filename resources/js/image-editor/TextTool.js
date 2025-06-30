export class TextTool {
    constructor(editor) {
        this.editor = editor;
        this.isActive = false;
        this.textElements = [];
        this.currentTextElement = null;
        this.textIdCounter = 0;
        this.selectedTextId = null;
        
        // Drag and drop properties
        this.isDragging = false;
        this.draggedTextElement = null;
        this.dragOffset = { x: 0, y: 0 };
        this.lastMousePos = { x: 0, y: 0 };
        
        // Word color properties
        this.selectedWordIndex = null;
        this.selectedWordElement = null;
        
        // Background resize properties
        this.isResizingBackground = false;
        this.resizeHandle = null;
        this.resizeStartPos = { x: 0, y: 0 };
        this.originalBackgroundPadding = { top: 0, right: 0, bottom: 0, left: 0 };
        
        // Advanced text features
        this.textPresets = this.getDefaultPresets();
        this.customFonts = [];
        this.animationFrameId = null;
        this.isAnimating = false;
        
        this.defaultSettings = {
            fontSize: 20,
            fontFamily: 'Arial',
            color: '#000000',
            backgroundColor: '#ffffff',
            backgroundEnabled: false,
            bold: false,
            italic: false,
            underline: false,
            shadow: false,
            opacity: 100,
            rotation: 0,
            align: 'left',
            letterSpacing: 0,
            lineHeight: 1.2,
            strokeEnabled: false,
            strokeColor: '#ffffff',
            strokeWidth: 1,
            gradientEnabled: false,
            gradientColor1: '#ff0000',
            gradientColor2: '#0000ff',
            gradientDirection: 'horizontal',
            wordColors: {}, // Store individual word colors
            
            // Advanced features
            animation: 'none',
            animationDuration: 2000,
            animationDirection: 'normal',
            animationLoop: false,
            
            // 3D effects
            perspective: 0,
            rotateX: 0,
            rotateY: 0,
            skewX: 0,
            skewY: 0,
            
            // Text effects
            glowEnabled: false,
            glowColor: '#ffff00',
            glowIntensity: 10,
            
            // Advanced typography
            textTransform: 'none',
            fontWeight: 400,
            fontStretch: 'normal',
            textDecoration: 'none',
            
            // Text warping
            warpType: 'none',
            warpIntensity: 0,
            warpDirection: 'horizontal',
            
            // Blending and filters
            blendMode: 'normal',
            filter: 'none',
            brightness: 100,
            contrast: 100,
            saturation: 100,
            
            // Advanced shadows
            shadowColor: '#000000',
            shadowBlur: 3,
            shadowOffsetX: 2,
            shadowOffsetY: 2,
            
            // Pattern and texture
            patternEnabled: false,
            patternType: 'dots',
            patternColor: '#000000',
            patternSize: 5,
            
            // Text outline variations
            multiStroke: false,
            strokeLayers: [
                { color: '#ffffff', width: 1 }
            ],
            
            // Background padding/sizing
            backgroundPadding: {
                top: 5,
                right: 10,
                bottom: 5,
                left: 10
            }
        };
        
        this.setupEventListeners();
        this.loadWebFonts();
        
        // Initialize presets dropdown
        setTimeout(() => this.updatePresetDropdown(), 500);
    }

    setupEventListeners() {
        const addTextBtn = document.getElementById('add-text');
        const textInput = document.getElementById('text-input');
        const fontSizeSlider = document.getElementById('font-size');
        const fontSizeValue = document.getElementById('font-size-value');
        const fontFamily = document.getElementById('font-family');
        const textColor = document.getElementById('text-color');
        const textBgColor = document.getElementById('text-bg-color');
        const textBgEnable = document.getElementById('text-bg-enable');
        const textOpacity = document.getElementById('text-opacity');
        const textOpacityValue = document.getElementById('text-opacity-value');
        const textRotation = document.getElementById('text-rotation');
        const textRotationValue = document.getElementById('text-rotation-value');
        
        // New controls
        const letterSpacing = document.getElementById('letter-spacing');
        const letterSpacingValue = document.getElementById('letter-spacing-value');
        const lineHeight = document.getElementById('line-height');
        const lineHeightValue = document.getElementById('line-height-value');
        const strokeEnable = document.getElementById('stroke-enable');
        const strokeColor = document.getElementById('stroke-color');
        const strokeWidth = document.getElementById('stroke-width');
        const strokeWidthValue = document.getElementById('stroke-width-value');
        const strokeOptions = document.getElementById('stroke-options');

        const gradientEnable = document.getElementById('gradient-enable');
        const gradientOptions = document.getElementById('gradient-options');
        const gradientColor1 = document.getElementById('gradient-color-1');
        const gradientColor2 = document.getElementById('gradient-color-2');
        const gradientDirection = document.getElementById('gradient-direction');

        // Style buttons
        const textBold = document.getElementById('text-bold');
        const textItalic = document.getElementById('text-italic');
        const textUnderline = document.getElementById('text-underline');
        const textShadow = document.getElementById('text-shadow');
        
        // Alignment buttons
        const alignLeft = document.getElementById('text-align-left');
        const alignCenter = document.getElementById('text-align-center');
        const alignRight = document.getElementById('text-align-right');
        
        // Action buttons
        const duplicateText = document.getElementById('duplicate-text');
        const deleteText = document.getElementById('delete-text');
        
        // Word color controls
        const selectedWordColor = document.getElementById('selected-word-color');
        const applyWordColor = document.getElementById('apply-word-color');
        const resetWordColors = document.getElementById('reset-word-colors');

        // Background padding controls
        const bgPaddingTop = document.getElementById('bg-padding-top');
        const bgPaddingBottom = document.getElementById('bg-padding-bottom');
        const bgPaddingLeft = document.getElementById('bg-padding-left');
        const bgPaddingRight = document.getElementById('bg-padding-right');

        if (addTextBtn) addTextBtn.addEventListener('click', () => this.addNewText());
        if (textInput) textInput.addEventListener('input', () => this.updateCurrentText());
        
        if (fontSizeSlider) {
            fontSizeSlider.addEventListener('input', (e) => {
                const size = parseInt(e.target.value);
                if (fontSizeValue) fontSizeValue.textContent = size;
                this.updateTextProperty('fontSize', size);
            });
        }

        if (fontFamily) fontFamily.addEventListener('change', (e) => this.updateTextProperty('fontFamily', e.target.value));
        if (textColor) textColor.addEventListener('change', (e) => this.updateTextProperty('color', e.target.value));
        if (textBgColor) textBgColor.addEventListener('change', (e) => this.updateTextProperty('backgroundColor', e.target.value));
        if (textBgEnable) textBgEnable.addEventListener('change', (e) => this.updateTextProperty('backgroundEnabled', e.target.checked));
        
        if (textOpacity) {
            textOpacity.addEventListener('input', (e) => {
                const opacity = parseInt(e.target.value);
                if (textOpacityValue) textOpacityValue.textContent = opacity + '%';
                this.updateTextProperty('opacity', opacity);
            });
        }
        
        if (textRotation) {
            textRotation.addEventListener('input', (e) => {
                const rotation = parseInt(e.target.value);
                if (textRotationValue) textRotationValue.textContent = rotation + '°';
                this.updateTextProperty('rotation', rotation);
            });
        }
        
        // New control listeners
        if (letterSpacing) {
            letterSpacing.addEventListener('input', (e) => {
                const spacing = parseInt(e.target.value);
                if (letterSpacingValue) letterSpacingValue.textContent = spacing + 'px';
                this.updateTextProperty('letterSpacing', spacing);
            });
        }
        
        if (lineHeight) {
            lineHeight.addEventListener('input', (e) => {
                const height = parseInt(e.target.value);
                if (lineHeightValue) lineHeightValue.textContent = height + '%';
                this.updateTextProperty('lineHeight', height / 100);
            });
        }

        if (strokeEnable) {
            strokeEnable.addEventListener('change', (e) => {
                const enabled = e.target.checked;
                this.updateTextProperty('strokeEnabled', enabled);
                strokeOptions.classList.toggle('hidden', !enabled);
            });
        }
        if (strokeColor) strokeColor.addEventListener('change', (e) => this.updateTextProperty('strokeColor', e.target.value));

        if (strokeWidth) {
            strokeWidth.addEventListener('input', (e) => {
                const width = parseInt(e.target.value);
                if (strokeWidthValue) strokeWidthValue.textContent = width + 'px';
                this.updateTextProperty('strokeWidth', width);
            });
        }

        if (gradientEnable) {
            gradientEnable.addEventListener('change', (e) => {
                const enabled = e.target.checked;
                this.updateTextProperty('gradientEnabled', enabled);
                gradientOptions.classList.toggle('hidden', !enabled);
            });
        }
        if (gradientColor1) gradientColor1.addEventListener('change', (e) => this.updateTextProperty('gradientColor1', e.target.value));
        if (gradientColor2) gradientColor2.addEventListener('change', (e) => this.updateTextProperty('gradientColor2', e.target.value));
        if (gradientDirection) gradientDirection.addEventListener('change', (e) => this.updateTextProperty('gradientDirection', e.target.value));

        // Style buttons
        if (textBold) textBold.addEventListener('click', () => this.toggleStyle('bold'));
        if (textItalic) textItalic.addEventListener('click', () => this.toggleStyle('italic'));
        if (textUnderline) textUnderline.addEventListener('click', () => this.toggleStyle('underline'));
        if (textShadow) textShadow.addEventListener('click', () => this.toggleStyle('shadow'));
        
        // Alignment buttons
        if (alignLeft) alignLeft.addEventListener('click', () => this.setAlignment('left'));
        if (alignCenter) alignCenter.addEventListener('click', () => this.setAlignment('center'));
        if (alignRight) alignRight.addEventListener('click', () => this.setAlignment('right'));
        
        // Action buttons
        if (duplicateText) duplicateText.addEventListener('click', () => this.duplicateCurrentText());
        if (deleteText) deleteText.addEventListener('click', () => this.deleteCurrentText());
        
        // Word color controls
        if (selectedWordColor) selectedWordColor.addEventListener('change', (e) => this.updateSelectedWordColor(e.target.value));
        if (applyWordColor) applyWordColor.addEventListener('click', () => this.applyWordColor());
        if (resetWordColors) resetWordColors.addEventListener('click', () => this.resetAllWordColors());

        // Background padding controls
        if (bgPaddingTop) {
            bgPaddingTop.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                document.getElementById('bg-padding-top-value').textContent = value + 'px';
                this.updateBackgroundPadding('top', value);
            });
        }
        if (bgPaddingBottom) {
            bgPaddingBottom.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                document.getElementById('bg-padding-bottom-value').textContent = value + 'px';
                this.updateBackgroundPadding('bottom', value);
            });
        }
        if (bgPaddingLeft) {
            bgPaddingLeft.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                document.getElementById('bg-padding-left-value').textContent = value + 'px';
                this.updateBackgroundPadding('left', value);
            });
        }
        if (bgPaddingRight) {
            bgPaddingRight.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                document.getElementById('bg-padding-right-value').textContent = value + 'px';
                this.updateBackgroundPadding('right', value);
            });
        }

        // Advanced feature controls
        this.setupAdvancedEventListeners();

        // Canvas mouse events for drag and drop and text placement
        this.editor.canvas.addEventListener('mousedown', (e) => this.onCanvasMouseDown(e));
        this.editor.canvas.addEventListener('mousemove', (e) => this.onCanvasMouseMove(e));
        this.editor.canvas.addEventListener('mouseup', (e) => this.onCanvasMouseUp(e));
        this.editor.canvas.addEventListener('click', (e) => this.onCanvasClick(e));
        
        // Prevent context menu on canvas
        this.editor.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    onCanvasMouseDown(e) {
        if (!this.isActive && this.textElements.length === 0) return;

        const coords = this.getCanvasCoordinates(e);
        const clickedText = this.findTextAtPosition(coords.x, coords.y);
        
        if (clickedText) {
            // Check if clicking on a background resize handle first
            const resizeHandle = this.getBackgroundResizeHandle(coords.x, coords.y, clickedText);
            
            if (resizeHandle && clickedText.backgroundEnabled) {
                // Start resizing background
                this.isResizingBackground = true;
                this.resizeHandle = resizeHandle;
                this.resizeStartPos = { x: coords.x, y: coords.y };
                this.originalBackgroundPadding = { ...clickedText.backgroundPadding };
                this.selectText(clickedText.id);
                this.editor.canvas.style.cursor = this.getResizeCursor(resizeHandle);
                e.preventDefault();
                return;
            }
            
            // Start dragging existing text
            this.isDragging = true;
            this.draggedTextElement = clickedText;
            this.selectText(clickedText.id);
            
            // Calculate offset from text position to mouse position
            this.dragOffset = {
                x: coords.x - clickedText.x,
                y: coords.y - clickedText.y
            };
            
            // Change cursor to grabbing
            this.editor.canvas.style.cursor = 'grabbing';
            
            // Store initial position for potential undo
            this.initialDragPosition = { x: clickedText.x, y: clickedText.y };
            
            e.preventDefault();
        }
    }

    onCanvasMouseMove(e) {
        const coords = this.getCanvasCoordinates(e);
        this.lastMousePos = coords;
        
        if (this.isResizingBackground && this.currentTextElement) {
            // Handle background resizing
            this.resizeBackgroundPadding(coords);
            this.editor.redraw();
            e.preventDefault();
        } else if (this.isDragging && this.draggedTextElement) {
            // Update text position
            this.draggedTextElement.x = coords.x - this.dragOffset.x;
            this.draggedTextElement.y = coords.y - this.dragOffset.y;
            
            // Constrain to canvas bounds
            this.constrainTextToCanvas(this.draggedTextElement);
            
            // Redraw canvas with updated position
            this.editor.redraw();
            
            e.preventDefault();
        } else if (this.textElements.length > 0) {
            // Update cursor based on hover state
            const hoveredText = this.findTextAtPosition(coords.x, coords.y);
            if (hoveredText) {
                // Check if hovering over a resize handle
                const resizeHandle = this.getBackgroundResizeHandle(coords.x, coords.y, hoveredText);
                if (resizeHandle && hoveredText.backgroundEnabled) {
                    this.editor.canvas.style.cursor = this.getResizeCursor(resizeHandle);
                } else {
                    this.editor.canvas.style.cursor = 'grab';
                }
            } else if (!this.isActive) {
                this.editor.canvas.style.cursor = 'default';
            }
        }
    }

    onCanvasMouseUp(e) {
        if (this.isResizingBackground) {
            // Finish resizing background
            this.isResizingBackground = false;
            this.resizeHandle = null;
            
            // Save state for undo/redo
            this.editor.historyManager.saveState();
            
            // Reset cursor
            const coords = this.getCanvasCoordinates(e);
            const hoveredText = this.findTextAtPosition(coords.x, coords.y);
            this.editor.canvas.style.cursor = hoveredText ? 'grab' : (this.isActive ? 'crosshair' : 'default');
        } else if (this.isDragging && this.draggedTextElement) {
            // Finish dragging
            this.isDragging = false;
            
            // Save state for undo/redo
            this.editor.historyManager.saveState();
            
            // Reset cursor
            const coords = this.getCanvasCoordinates(e);
            const hoveredText = this.findTextAtPosition(coords.x, coords.y);
            this.editor.canvas.style.cursor = hoveredText ? 'grab' : (this.isActive ? 'crosshair' : 'default');
            
            this.draggedTextElement = null;
            this.dragOffset = { x: 0, y: 0 };
        }
    }

    onCanvasClick(e) {
        // Only handle click for new text placement if not dragging
        if (this.isDragging || !this.isActive) return;

        const coords = this.getCanvasCoordinates(e);
        const clickedText = this.findTextAtPosition(coords.x, coords.y);
        
        if (clickedText) {
            this.selectText(clickedText.id);
        } else if (this.currentTextElement === null) {
            // Create new text at clicked position
            this.createTextAt(coords.x, coords.y);
        }
    }

    getCanvasCoordinates(e) {
        const rect = this.editor.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Scale coordinates to canvas size
        const scaleX = this.editor.canvas.width / rect.width;
        const scaleY = this.editor.canvas.height / rect.height;
        
        return {
            x: x * scaleX,
            y: y * scaleY
        };
    }

    constrainTextToCanvas(textElement) {
        const textWidth = this.measureTextWidth(textElement);
        const textHeight = textElement.fontSize;
        
        // Constrain X position
        if (textElement.align === 'left') {
            textElement.x = Math.max(0, Math.min(textElement.x, this.editor.canvas.width - textWidth));
        } else if (textElement.align === 'center') {
            textElement.x = Math.max(textWidth / 2, Math.min(textElement.x, this.editor.canvas.width - textWidth / 2));
        } else if (textElement.align === 'right') {
            textElement.x = Math.max(textWidth, Math.min(textElement.x, this.editor.canvas.width));
        }
        
        // Constrain Y position
        textElement.y = Math.max(0, Math.min(textElement.y, this.editor.canvas.height - textHeight));
    }

    findTextAtPosition(x, y) {
        // Check if click is near any existing text element (in reverse order for z-index)
        for (let i = this.textElements.length - 1; i >= 0; i--) {
            const textElement = this.textElements[i];
            if (this.isPointInText(x, y, textElement)) {
                return textElement;
            }
        }
        return null;
    }

    isPointInText(x, y, textElement) {
        const textWidth = this.measureTextWidth(textElement);
        const lines = textElement.text.split('\n');
        const lineHeight = textElement.fontSize * 1.2;
        const totalHeight = lines.length * lineHeight;
        
        let textX = textElement.x;
        let textY = textElement.y;
        let width = textWidth;
        let height = totalHeight;
        
        // Adjust for text alignment
        if (textElement.align === 'center') {
            textX -= textWidth / 2;
        } else if (textElement.align === 'right') {
            textX -= textWidth;
        }
        
        // Add padding for easier selection
        const padding = 10;
        
        return x >= textX - padding && 
               x <= textX + width + padding &&
               y >= textY - padding && 
               y <= textY + height + padding;
    }

    addNewText() {
        this.isActive = true;
        this.editor.canvas.style.cursor = 'crosshair';
        
        // Show text controls
        const textControls = document.getElementById('text-controls');
        if (textControls) textControls.classList.remove('hidden');
        
        // Prepare for new text
        this.currentTextElement = null;
        this.selectedTextId = null;
        
        // Reset input
        const textInput = document.getElementById('text-input');
        if (textInput) textInput.value = '';
        
        // Update button
        const addTextBtn = document.getElementById('add-text');
        if (addTextBtn) {
            addTextBtn.textContent = '✖ Cancel Adding Text';
            addTextBtn.classList.remove('bg-purple-500', 'hover:bg-purple-600');
            addTextBtn.classList.add('bg-red-500', 'hover:bg-red-600');
        }
        
        this.resetControlsToDefault();
    }

    measureTextWidth(textElement) {
        const ctx = this.editor.ctx;
        ctx.save();
        
        let fontString = '';
        if (textElement.italic) fontString += 'italic ';
        if (textElement.bold) fontString += 'bold ';
        fontString += `${textElement.fontSize}px ${textElement.fontFamily}`;
        
        ctx.font = fontString;
        
        // Measure the widest line
        const lines = textElement.text.split('\n');
        let maxWidth = 0;
        lines.forEach(line => {
            const lineWidth = ctx.measureText(line).width;
            maxWidth = Math.max(maxWidth, lineWidth);
        });
        
        ctx.restore();
        return maxWidth;
    }

    createTextAt(x, y) {
        const newText = {
            id: this.textIdCounter++,
            text: 'New Text',
            x: x,
            y: y,
            ...this.defaultSettings,
            wordColors: {}, // Initialize empty word colors
            backgroundPadding: { ...this.defaultSettings.backgroundPadding } // Ensure padding is copied
        };

        this.textElements.push(newText);
        this.currentTextElement = newText;
        this.selectedTextId = newText.id;
        
        // Focus text input
        const textInput = document.getElementById('text-input');
        if (textInput) {
            textInput.value = newText.text;
            textInput.focus();
            textInput.select();
        }
        
        this.drawText(newText);
        this.updateTextElementsList();
        this.updateControlsFromText(newText);
        this.updateWordPicker();
        
        // Add to layer manager
        const newLayer = this.editor.layerManager.addLayer(`Text: ${newText.text.substring(0, 10)}...`, newText, 'text');
        newText.layerId = newLayer.id;
        this.editor.historyManager.saveState();
    }

    selectText(textId) {
        this.selectedTextId = textId;
        this.currentTextElement = this.textElements.find(t => t.id === textId);
        
        if (this.currentTextElement) {
            this.updateControlsFromText(this.currentTextElement);
            this.highlightTextElement(textId);
            this.updateWordPicker();
            
            // Enable text controls if not already visible
            const textControls = document.getElementById('text-controls');
            if (textControls) textControls.classList.remove('hidden');
        }
        
        // Update layer manager
        if (this.currentTextElement.layerId) {
            this.editor.layerManager.updateLayer(this.currentTextElement.layerId, `Text: ${this.currentTextElement.text.substring(0, 10)}...`);
        }
    }

    updateCurrentText() {
        if (!this.currentTextElement) return;

        const textInput = document.getElementById('text-input');
        if (textInput) {
            const oldText = this.currentTextElement.text;
            const newText = textInput.value || 'New Text';
            
            // If text changed, reset word colors for new words
            if (oldText !== newText) {
                this.currentTextElement.text = newText;
                this.cleanupWordColors();
            }
        }

        this.editor.redraw();
        this.updateTextElementsList();
        this.updateWordPicker();
        
        // Update layer manager
        if (this.currentTextElement.layerId) {
            this.editor.layerManager.updateLayer(this.currentTextElement.layerId, `Text: ${this.currentTextElement.text.substring(0, 10)}...`);
        }
    }

    updateTextProperty(property, value) {
        if (!this.currentTextElement) return;

        this.currentTextElement[property] = value;
        this.editor.redraw();
        this.updateTextElementsList();
        
        // Update word picker if text color changed
        if (property === 'color') {
            this.updateWordPicker();
        }
    }

    updateBackgroundPadding(side, value) {
        if (!this.currentTextElement) return;

        if (!this.currentTextElement.backgroundPadding) {
            this.currentTextElement.backgroundPadding = { ...this.defaultSettings.backgroundPadding };
        }

        this.currentTextElement.backgroundPadding[side] = value;
        this.editor.redraw();
        this.editor.historyManager.saveState();
    }

    toggleStyle(style) {
        if (!this.currentTextElement) return;

        this.currentTextElement[style] = !this.currentTextElement[style];
        
        // Update button appearance
        const button = document.getElementById(`text-${style}`);
        if (button) {
            if (this.currentTextElement[style]) {
                button.classList.add('bg-blue-500', 'text-white');
                button.classList.remove('bg-gray-200');
            } else {
                button.classList.remove('bg-blue-500', 'text-white');
                button.classList.add('bg-gray-200');
            }
        }
        
        this.editor.redraw();
    }

    setAlignment(align) {
        if (!this.currentTextElement) return;

        this.currentTextElement.align = align;
        
        // Update button appearances
        ['left', 'center', 'right'].forEach(alignment => {
            const button = document.getElementById(`text-align-${alignment}`);
            if (button) {
                if (alignment === align) {
                    button.classList.add('bg-blue-500', 'text-white');
                    button.classList.remove('bg-gray-200');
                } else {
                    button.classList.remove('bg-blue-500', 'text-white');
                    button.classList.add('bg-gray-200');
                }
            }
        });
        
        this.editor.redraw();
    }

    duplicateCurrentText() {
        if (!this.currentTextElement) return;

        const duplicatedText = {
            ...this.currentTextElement,
            id: this.textIdCounter++,
            x: this.currentTextElement.x + 20,
            y: this.currentTextElement.y + 20,
            wordColors: { ...this.currentTextElement.wordColors } // Copy word colors
        };
        delete duplicatedText.layerId;

        this.textElements.push(duplicatedText);
        this.selectText(duplicatedText.id);
        
        this.editor.redraw();
        this.updateTextElementsList();
        const newLayer = this.editor.layerManager.addLayer(`Text: ${duplicatedText.text.substring(0, 10)}...`, duplicatedText, 'text');
        duplicatedText.layerId = newLayer.id;
        this.editor.historyManager.saveState();
    }

    deleteCurrentText() {
        if (!this.currentTextElement) return;

        if (this.currentTextElement.layerId) {
            this.editor.layerManager.deleteLayer(this.currentTextElement.layerId);
        }

        const index = this.textElements.findIndex(t => t.id === this.currentTextElement.id);
        if (index > -1) {
            this.textElements.splice(index, 1);
        }

        this.currentTextElement = null;
        this.selectedTextId = null;
        
        // Select another text if available
        if (this.textElements.length > 0) {
            this.selectText(this.textElements[0].id);
        } else {
            this.cancelTextMode();
        }
        
        this.editor.redraw();
        this.updateTextElementsList();
        this.editor.historyManager.saveState();
    }

    updateTextElementsList() {
        const container = document.getElementById('text-elements-container');
        const list = document.getElementById('text-elements-list');
        
        if (!container || !list) return;

        if (this.textElements.length === 0) {
            list.classList.add('hidden');
            return;
        }

        list.classList.remove('hidden');
        container.innerHTML = '';

        this.textElements.forEach(textElement => {
            const element = document.createElement('div');
            element.className = `text-element-item p-2 border rounded cursor-pointer transition-colors ${
                this.selectedTextId === textElement.id ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-300 hover:bg-gray-50'
            }`;
            
            element.innerHTML = `
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                        <div class="w-3 h-3 rounded-full" style="background-color: ${textElement.color}"></div>
                        <span class="text-xs font-medium truncate">${textElement.text.substring(0, 15)}${textElement.text.length > 15 ? '...' : ''}</span>
                    </div>
                    <div class="text-xs text-gray-500">${textElement.fontSize}px</div>
                </div>
            `;
            
            element.addEventListener('click', () => this.selectText(textElement.id));
            container.appendChild(element);
        });
    }

    highlightTextElement(textId) {
        const elements = document.querySelectorAll('.text-element-item');
        elements.forEach(el => {
            el.classList.remove('bg-blue-100', 'border-blue-500');
            el.classList.add('bg-white', 'border-gray-300');
        });
        
        // Highlight selected element
        this.updateTextElementsList();
    }

    updateControlsFromText(textElement) {
        const textInput = document.getElementById('text-input');
        const fontSizeSlider = document.getElementById('font-size');
        const fontSizeValue = document.getElementById('font-size-value');
        const fontFamily = document.getElementById('font-family');
        const textColor = document.getElementById('text-color');
        const textBgColor = document.getElementById('text-bg-color');
        const textBgEnable = document.getElementById('text-bg-enable');
        const textOpacity = document.getElementById('text-opacity');
        const textOpacityValue = document.getElementById('text-opacity-value');
        const textRotation = document.getElementById('text-rotation');
        const textRotationValue = document.getElementById('text-rotation-value');

        // New controls
        const letterSpacing = document.getElementById('letter-spacing');
        const letterSpacingValue = document.getElementById('letter-spacing-value');
        const lineHeight = document.getElementById('line-height');
        const lineHeightValue = document.getElementById('line-height-value');
        const strokeEnable = document.getElementById('stroke-enable');
        const strokeColor = document.getElementById('stroke-color');
        const strokeWidth = document.getElementById('stroke-width');
        const strokeWidthValue = document.getElementById('stroke-width-value');
        const strokeOptions = document.getElementById('stroke-options');

        const gradientEnable = document.getElementById('gradient-enable');
        const gradientOptions = document.getElementById('gradient-options');
        const gradientColor1 = document.getElementById('gradient-color-1');
        const gradientColor2 = document.getElementById('gradient-color-2');
        const gradientDirection = document.getElementById('gradient-direction');

        if (textInput) textInput.value = textElement.text;
        if (fontSizeSlider) fontSizeSlider.value = textElement.fontSize;
        if (fontSizeValue) fontSizeValue.textContent = textElement.fontSize + 'px';
        if (fontFamily) fontFamily.value = textElement.fontFamily;
        if (textColor) textColor.value = textElement.color;
        if (textBgColor) textBgColor.value = textElement.backgroundColor;
        if (textBgEnable) textBgEnable.checked = textElement.backgroundEnabled;
        if (textOpacity) textOpacity.value = textElement.opacity;
        if (textOpacityValue) textOpacityValue.textContent = textElement.opacity + '%';
        if (textRotation) textRotation.value = textElement.rotation;
        if (textRotationValue) textRotationValue.textContent = textElement.rotation + '°';

        // Update new controls
        if (letterSpacing) letterSpacing.value = textElement.letterSpacing;
        if (letterSpacingValue) letterSpacingValue.textContent = textElement.letterSpacing + 'px';
        if (lineHeight) lineHeight.value = textElement.lineHeight * 100;
        if (lineHeightValue) lineHeightValue.textContent = Math.round(textElement.lineHeight * 100) + '%';
        
        if (strokeEnable) strokeEnable.checked = textElement.strokeEnabled;
        if (strokeOptions) strokeOptions.classList.toggle('hidden', !textElement.strokeEnabled);
        if (strokeColor) strokeColor.value = textElement.strokeColor;
        if (strokeWidth) strokeWidth.value = textElement.strokeWidth;
        if (strokeWidthValue) strokeWidthValue.textContent = textElement.strokeWidth + 'px';

        if (gradientEnable) gradientEnable.checked = textElement.gradientEnabled;
        if (gradientOptions) gradientOptions.classList.toggle('hidden', !textElement.gradientEnabled);
        if (gradientColor1) gradientColor1.value = textElement.gradientColor1;
        if (gradientColor2) gradientColor2.value = textElement.gradientColor2;
        if (gradientDirection) gradientDirection.value = textElement.gradientDirection;

        // Update style buttons
        this.updateStyleButtons(textElement);
        this.updateAlignmentButtons(textElement);
        
        // Update background padding sliders
        if (textElement.backgroundPadding) {
            const bgPaddingTop = document.getElementById('bg-padding-top');
            const bgPaddingBottom = document.getElementById('bg-padding-bottom');
            const bgPaddingLeft = document.getElementById('bg-padding-left');
            const bgPaddingRight = document.getElementById('bg-padding-right');

            if (bgPaddingTop) {
                bgPaddingTop.value = textElement.backgroundPadding.top;
                document.getElementById('bg-padding-top-value').textContent = textElement.backgroundPadding.top + 'px';
            }
            if (bgPaddingBottom) {
                bgPaddingBottom.value = textElement.backgroundPadding.bottom;
                document.getElementById('bg-padding-bottom-value').textContent = textElement.backgroundPadding.bottom + 'px';
            }
            if (bgPaddingLeft) {
                bgPaddingLeft.value = textElement.backgroundPadding.left;
                document.getElementById('bg-padding-left-value').textContent = textElement.backgroundPadding.left + 'px';
            }
            if (bgPaddingRight) {
                bgPaddingRight.value = textElement.backgroundPadding.right;
                document.getElementById('bg-padding-right-value').textContent = textElement.backgroundPadding.right + 'px';
            }
        }
        
        // Reset word selection when switching text elements
        this.selectedWordIndex = null;
        this.selectedWordElement = null;
        
        const selectedWordColor = document.getElementById('selected-word-color');
        const applyWordColor = document.getElementById('apply-word-color');
        
        if (selectedWordColor && applyWordColor) {
            selectedWordColor.disabled = true;
            applyWordColor.disabled = true;
        }
    }

    updateStyleButtons(textElement) {
        ['bold', 'italic', 'underline', 'shadow'].forEach(style => {
            const button = document.getElementById(`text-${style}`);
            if (button) {
                if (textElement[style]) {
                    button.classList.add('bg-blue-500', 'text-white');
                    button.classList.remove('bg-gray-200');
                } else {
                    button.classList.remove('bg-blue-500', 'text-white');
                    button.classList.add('bg-gray-200');
                }
            }
        });
    }

    updateAlignmentButtons(textElement) {
        ['left', 'center', 'right'].forEach(alignment => {
            const button = document.getElementById(`text-align-${alignment}`);
            if (button) {
                if (alignment === textElement.align) {
                    button.classList.add('bg-blue-500', 'text-white');
                    button.classList.remove('bg-gray-200');
                } else {
                    button.classList.remove('bg-blue-500', 'text-white');
                    button.classList.add('bg-gray-200');
                }
            }
        });
    }

    resetControlsToDefault() {
        this.updateControlsFromText(this.defaultSettings);
    }

    cancelTextMode() {
        this.isActive = false;
        this.currentTextElement = null;
        this.selectedTextId = null;
        
        // Stop any ongoing drag or resize
        this.isDragging = false;
        this.draggedTextElement = null;
        this.isResizingBackground = false;
        this.resizeHandle = null;
        
        const addTextBtn = document.getElementById('add-text');
        const textControls = document.getElementById('text-controls');
        
        if (addTextBtn) {
            addTextBtn.textContent = '➕ Add New Text';
            addTextBtn.classList.remove('bg-red-500', 'hover:bg-red-600');
            addTextBtn.classList.add('bg-purple-500', 'hover:bg-purple-600');
        }
        
        if (textControls && this.textElements.length === 0) {
            textControls.classList.add('hidden');
        }
        
        this.editor.canvas.style.cursor = 'default';
    }

    drawText(textElement = null) {
        if (!textElement) {
            // Draw all text elements
            this.textElements.forEach(text => this.drawSingleText(text));
        } else {
            this.drawSingleText(textElement);
        }
    }

    drawTextSelectionIndicator(textElement) {
        const ctx = this.editor.ctx;
        ctx.save();
        
        const lines = textElement.text.split('\n');
        const lineHeight = textElement.fontSize * 1.2;
        const totalHeight = lines.length * lineHeight;
        const maxWidth = this.measureTextWidth(textElement);
        
        let x = textElement.x;
        let y = textElement.y;
        
        // Adjust for alignment
        if (textElement.align === 'center') {
            x -= maxWidth / 2;
        } else if (textElement.align === 'right') {
            x -= maxWidth;
        }
        
        // Draw selection border
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(x - 5, y - 5, maxWidth + 10, totalHeight + 10);
        
        // Draw corner handles
        const handleSize = 8;
        ctx.fillStyle = '#3b82f6';
        ctx.setLineDash([]);
        
        // Top-left handle
        ctx.fillRect(x - 5 - handleSize/2, y - 5 - handleSize/2, handleSize, handleSize);
        // Top-right handle
        ctx.fillRect(x + maxWidth + 5 - handleSize/2, y - 5 - handleSize/2, handleSize, handleSize);
        // Bottom-left handle
        ctx.fillRect(x - 5 - handleSize/2, y + totalHeight + 5 - handleSize/2, handleSize, handleSize);
        // Bottom-right handle
        ctx.fillRect(x + maxWidth + 5 - handleSize/2, y + totalHeight + 5 - handleSize/2, handleSize, handleSize);
        
        ctx.restore();
    }

    renderTextLayer(layer, ctx = this.editor.ctx) {
        // Pass the entire layer object so we can access animation-modified properties
        this.drawSingleText(layer.data, layer, ctx);
    }

    // Public method to get all text elements
    getAllTextElements() {
        return this.textElements;
    }

    // Public method to clear all text elements
    clearAllText() {
        this.textElements = [];
        this.currentTextElement = null;
        this.selectedTextId = null;
        this.isDragging = false;
        this.draggedTextElement = null;
        this.selectedWordIndex = null;
        this.selectedWordElement = null;
        this.updateTextElementsList();
        this.cancelTextMode();
    }

    // New word color methods
    updateWordPicker() {
        const wordPickerContainer = document.getElementById('word-picker-text');
        if (!wordPickerContainer || !this.currentTextElement) return;

        const words = this.getWordsFromText(this.currentTextElement.text);
        wordPickerContainer.innerHTML = '';

        words.forEach((word, index) => {
            if (word.trim() === '') return; // Skip empty words

            const wordSpan = document.createElement('span');
            wordSpan.textContent = word;
            wordSpan.className = 'word-item inline-block px-1 py-0.5 m-0.5 border rounded cursor-pointer transition-all hover:bg-purple-100';
            wordSpan.style.color = this.currentTextElement.wordColors[index] || this.currentTextElement.color;
            wordSpan.style.borderColor = this.selectedWordIndex === index ? '#7c3aed' : '#d1d5db';
            wordSpan.style.backgroundColor = this.selectedWordIndex === index ? '#ede9fe' : 'white';
            
            wordSpan.addEventListener('click', () => this.selectWord(index, wordSpan));
            wordPickerContainer.appendChild(wordSpan);
        });
    }

    getWordsFromText(text) {
        // This regex splits by any whitespace character while preserving them as tokens.
        // It correctly handles leading/trailing spaces and multiple spaces between words.
        return text.split(/(\s+)/).filter(s => s.length > 0);
    }

    selectWord(wordIndex, wordElement) {
        // Deselect previous word
        if (this.selectedWordElement) {
            this.selectedWordElement.style.borderColor = '#d1d5db';
            this.selectedWordElement.style.backgroundColor = 'white';
        }

        this.selectedWordIndex = wordIndex;
        this.selectedWordElement = wordElement;

        // Highlight selected word
        wordElement.style.borderColor = '#7c3aed';
        wordElement.style.backgroundColor = '#ede9fe';

        // Update color picker
        const selectedWordColor = document.getElementById('selected-word-color');
        const applyWordColor = document.getElementById('apply-word-color');
        
        if (selectedWordColor && applyWordColor) {
            const currentColor = this.currentTextElement.wordColors[wordIndex] || this.currentTextElement.color;
            selectedWordColor.value = currentColor;
            selectedWordColor.disabled = false;
            applyWordColor.disabled = false;
        }
    }

    updateSelectedWordColor(color) {
        if (this.selectedWordIndex !== null && this.selectedWordElement) {
            this.selectedWordElement.style.color = color;
        }
    }

    applyWordColor() {
        if (this.selectedWordIndex === null || !this.currentTextElement) return;

        const selectedWordColor = document.getElementById('selected-word-color');
        if (!selectedWordColor) return;

        const color = selectedWordColor.value;
        
        // Store the color for this word
        if (!this.currentTextElement.wordColors) {
            this.currentTextElement.wordColors = {};
        }
        
        this.currentTextElement.wordColors[this.selectedWordIndex] = color;
        
        // Update the visual picker
        if (this.selectedWordElement) {
            this.selectedWordElement.style.color = color;
        }
        
        // Redraw canvas
        this.editor.redraw();
        this.editor.historyManager.saveState();
    }

    resetAllWordColors() {
        if (!this.currentTextElement) return;

        this.currentTextElement.wordColors = {};
        this.selectedWordIndex = null;
        this.selectedWordElement = null;
        
        // Reset controls
        const selectedWordColor = document.getElementById('selected-word-color');
        const applyWordColor = document.getElementById('apply-word-color');
        
        if (selectedWordColor && applyWordColor) {
            selectedWordColor.disabled = true;
            applyWordColor.disabled = true;
        }
        
        // Update picker and redraw
        this.updateWordPicker();
        this.editor.redraw();
        this.editor.historyManager.saveState();
    }

    cleanupWordColors() {
        if (!this.currentTextElement || !this.currentTextElement.wordColors) return;

        const words = this.getWordsFromText(this.currentTextElement.text);
        const newWordColors = {};
        
        // Only keep colors for words that still exist
        Object.keys(this.currentTextElement.wordColors).forEach(index => {
            const wordIndex = parseInt(index);
            if (wordIndex < words.length && words[wordIndex].trim() !== '') {
                newWordColors[wordIndex] = this.currentTextElement.wordColors[wordIndex];
            }
        });
        
        this.currentTextElement.wordColors = newWordColors;
    }

    drawSingleText(textElement, layer = { data: textElement }, ctx = this.editor.ctx) {
        // Use the enhanced drawing method with all advanced features
        return this.drawSingleTextAdvanced(textElement, layer, ctx);
    }

    drawSingleTextOriginal(textElement, layer = { data: textElement }, ctx = this.editor.ctx) {
        ctx.save();

        // Use layer's opacity if available (for animations)
        ctx.globalAlpha = layer.opacity !== undefined ? layer.opacity : textElement.opacity / 100;
        
        // Handle animated scale
        const scale = layer.animationScale || 1;
        const finalFontSize = textElement.fontSize * scale;

        // Set font
        let fontString = '';
        if (textElement.italic) fontString += 'italic ';
        if (textElement.bold) fontString += 'bold ';
        fontString += `${finalFontSize}px ${textElement.fontFamily}`;
        
        ctx.font = fontString;
        ctx.letterSpacing = `${textElement.letterSpacing}px`;
        
        // Set text alignment
        ctx.textAlign = 'left'; // We do alignment manually for word-by-word coloring
        ctx.textBaseline = 'top';
        
        // Apply rotation if needed (use animated value if available)
        const rotation = layer.data.rotation !== undefined ? layer.data.rotation : textElement.rotation;
        if (rotation !== 0) {
            ctx.translate(textElement.x, textElement.y);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.translate(-textElement.x, -textElement.y);
        }
        
        // Draw shadow if enabled
        if (textElement.shadow) {
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 3;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
        }
        
        const allTokens = this.getWordsFromText(textElement.text);
        const lines = textElement.text.split('\n');
        let tokenIndex = 0;

        const lineMetrics = lines.map(line => {
            const lineTokens = [];
            let currentLineLength = 0;
            let startIndex = tokenIndex;
            
            while(tokenIndex < allTokens.length) {
                const token = allTokens[tokenIndex];
                lineTokens.push(token);
                currentLineLength += token.length;
                tokenIndex++;
                if (currentLineLength >= line.length) break;
            }

            // Account for the newline character in the token stream
            if (tokenIndex < allTokens.length && allTokens[tokenIndex] === '\n') {
                tokenIndex++;
            }
            
            return {
                text: line,
                tokens: lineTokens,
                startIndex: startIndex,
                width: this.measureLine(ctx, lineTokens, textElement.letterSpacing)
            };
        });

        lineMetrics.forEach((line, lineIndex) => {
            // Use animated values if available, otherwise use textElement's properties
            const currentX = layer.data.x || textElement.x;
            const currentY = layer.data.y || textElement.y;

            const lineY = currentY + (lineIndex * finalFontSize * textElement.lineHeight);
            
            let lineStartX = currentX;
            if (textElement.align === 'center') {
                lineStartX = currentX - line.width / 2;
            } else if (textElement.align === 'right') {
                lineStartX = currentX - line.width;
            }
            
            if (textElement.backgroundEnabled) {
                ctx.fillStyle = textElement.backgroundColor;
                ctx.fillRect(lineStartX - 2, lineY - 2, line.width + 4, finalFontSize * textElement.lineHeight + 4);
            }

            let currentTokenX = lineStartX;
            
            line.tokens.forEach((word, indexInLine) => {
                const absoluteTokenIndex = line.startIndex + indexInLine;
                
                let wordColor = textElement.wordColors[absoluteTokenIndex] || textElement.color;
                
                if (textElement.gradientEnabled) {
                    wordColor = this.getGradient(ctx, currentTokenX, lineY, textElement);
                }
                
                ctx.fillStyle = wordColor;
                
                if (textElement.strokeEnabled && textElement.strokeWidth > 0) {
                    ctx.strokeStyle = textElement.strokeColor;
                    ctx.lineWidth = textElement.strokeWidth;
                    ctx.strokeText(word, currentTokenX, lineY);
                }

                ctx.fillText(word, currentTokenX, lineY);

                const wordWidth = ctx.measureText(word).width + (word.length > 1 ? (word.length * textElement.letterSpacing) : 0);

                if (textElement.underline) {
                    const underlineY = lineY + finalFontSize + 2;
                    ctx.strokeStyle = wordColor;
                    ctx.lineWidth = Math.max(1, finalFontSize / 20);
                    ctx.beginPath();
                    ctx.moveTo(currentTokenX, underlineY);
                    ctx.lineTo(currentTokenX + wordWidth, underlineY);
                    ctx.stroke();
                }
                
                currentTokenX += wordWidth;
            });
        });

        if (this.selectedTextId === textElement.id && !this.isDragging) {
            this.drawTextSelectionIndicator(textElement);
        }

        ctx.restore();
    }
    
    getGradient(ctx, x, y, textElement) {
        let gradient;
        const width = this.measureTextWidth(textElement);
        const height = textElement.fontSize;

        switch (textElement.gradientDirection) {
            case 'vertical':
                gradient = ctx.createLinearGradient(x, y, x, y + height);
                break;
            case 'diagonal':
                gradient = ctx.createLinearGradient(x, y, x + width, y + height);
                break;
            case 'horizontal':
            default:
                gradient = ctx.createLinearGradient(x, y, x + width, y);
                break;
        }
        
        gradient.addColorStop(0, textElement.gradientColor1);
        gradient.addColorStop(1, textElement.gradientColor2);
        return gradient;
    }

    measureLine(ctx, words, letterSpacing) {
        let width = 0;
        words.forEach(word => {
            width += ctx.measureText(word).width;
            if (word.length > 1) { // Add letter spacing for words, not single chars like space
                 width += (word.length * letterSpacing);
            }
        });
        return width;
    }

    // Advanced Feature Methods

    setupAdvancedEventListeners() {
        // Animation controls
        const animationSelect = document.getElementById('text-animation');
        const animationDuration = document.getElementById('animation-duration');
        const animationLoop = document.getElementById('animation-loop');
        const animationPreview = document.getElementById('preview-animation');
        const animationStop = document.getElementById('stop-animation');

        // 3D controls
        const perspectiveSlider = document.getElementById('text-perspective');
        const rotateXSlider = document.getElementById('text-rotate-x');
        const rotateYSlider = document.getElementById('text-rotate-y');
        const skewXSlider = document.getElementById('text-skew-x');
        const skewYSlider = document.getElementById('text-skew-y');

        // Effects controls
        const glowEnable = document.getElementById('glow-enable');
        const glowColor = document.getElementById('glow-color');
        const glowIntensity = document.getElementById('glow-intensity');

        // Typography controls
        const textTransform = document.getElementById('text-transform');
        const fontWeight = document.getElementById('font-weight');
        const fontStretch = document.getElementById('font-stretch');

        // Warping controls
        const warpType = document.getElementById('warp-type');
        const warpIntensity = document.getElementById('warp-intensity');

        // Blending controls
        const blendMode = document.getElementById('blend-mode');
        const brightness = document.getElementById('text-brightness');
        const contrast = document.getElementById('text-contrast');
        const saturation = document.getElementById('text-saturation');

        // Pattern controls
        const patternEnable = document.getElementById('pattern-enable');
        const patternType = document.getElementById('pattern-type');
        const patternSize = document.getElementById('pattern-size');

        // Preset controls
        const presetSelect = document.getElementById('text-preset-select');
        const savePreset = document.getElementById('save-text-preset');
        const applyPreset = document.getElementById('apply-text-preset');

        // Advanced tools
        const textStats = document.getElementById('text-stats');
        const exportText = document.getElementById('export-text');
        const importText = document.getElementById('import-text');

        // Animation listeners
        if (animationSelect) animationSelect.addEventListener('change', (e) => this.updateTextProperty('animation', e.target.value));
        if (animationDuration) animationDuration.addEventListener('input', (e) => this.updateTextProperty('animationDuration', parseInt(e.target.value)));
        if (animationLoop) animationLoop.addEventListener('change', (e) => this.updateTextProperty('animationLoop', e.target.checked));
        if (animationPreview) animationPreview.addEventListener('click', () => this.previewAnimation());
        if (animationStop) animationStop.addEventListener('click', () => this.stopAnimation());

        // 3D listeners
        if (perspectiveSlider) perspectiveSlider.addEventListener('input', (e) => this.updateTextProperty('perspective', parseInt(e.target.value)));
        if (rotateXSlider) rotateXSlider.addEventListener('input', (e) => this.updateTextProperty('rotateX', parseInt(e.target.value)));
        if (rotateYSlider) rotateYSlider.addEventListener('input', (e) => this.updateTextProperty('rotateY', parseInt(e.target.value)));
        if (skewXSlider) skewXSlider.addEventListener('input', (e) => this.updateTextProperty('skewX', parseInt(e.target.value)));
        if (skewYSlider) skewYSlider.addEventListener('input', (e) => this.updateTextProperty('skewY', parseInt(e.target.value)));

        // Effects listeners
        if (glowEnable) glowEnable.addEventListener('change', (e) => this.updateTextProperty('glowEnabled', e.target.checked));
        if (glowColor) glowColor.addEventListener('change', (e) => this.updateTextProperty('glowColor', e.target.value));
        if (glowIntensity) glowIntensity.addEventListener('input', (e) => this.updateTextProperty('glowIntensity', parseInt(e.target.value)));

        // Typography listeners
        if (textTransform) textTransform.addEventListener('change', (e) => this.updateTextProperty('textTransform', e.target.value));
        if (fontWeight) fontWeight.addEventListener('change', (e) => this.updateTextProperty('fontWeight', parseInt(e.target.value)));
        if (fontStretch) fontStretch.addEventListener('change', (e) => this.updateTextProperty('fontStretch', e.target.value));

        // Warping listeners
        if (warpType) warpType.addEventListener('change', (e) => this.updateTextProperty('warpType', e.target.value));
        if (warpIntensity) warpIntensity.addEventListener('input', (e) => this.updateTextProperty('warpIntensity', parseInt(e.target.value)));

        // Blending listeners
        if (blendMode) blendMode.addEventListener('change', (e) => this.updateTextProperty('blendMode', e.target.value));
        if (brightness) brightness.addEventListener('input', (e) => this.updateTextProperty('brightness', parseInt(e.target.value)));
        if (contrast) contrast.addEventListener('input', (e) => this.updateTextProperty('contrast', parseInt(e.target.value)));
        if (saturation) saturation.addEventListener('input', (e) => this.updateTextProperty('saturation', parseInt(e.target.value)));

        // Pattern listeners
        if (patternEnable) patternEnable.addEventListener('change', (e) => this.updateTextProperty('patternEnabled', e.target.checked));
        if (patternType) patternType.addEventListener('change', (e) => this.updateTextProperty('patternType', e.target.value));
        if (patternSize) patternSize.addEventListener('input', (e) => this.updateTextProperty('patternSize', parseInt(e.target.value)));

        // Preset listeners
        if (applyPreset) applyPreset.addEventListener('click', () => this.applyTextPreset());
        if (savePreset) savePreset.addEventListener('click', () => this.saveTextPreset());

        // Tool listeners
        if (textStats) textStats.addEventListener('click', () => this.showTextStatistics());
        if (exportText) exportText.addEventListener('click', () => this.exportTextData());
        if (importText) importText.addEventListener('click', () => this.importTextData());
    }

    loadWebFonts() {
        // Load Google Fonts and other web fonts
        const webFonts = [
            'Open Sans',
            'Roboto',
            'Lato',
            'Montserrat',
            'Source Sans Pro',
            'Raleway',
            'Poppins',
            'Nunito',
            'Playfair Display',
            'Merriweather',
            'Dancing Script',
            'Pacifico',
            'Lobster',
            'Great Vibes'
        ];

        webFonts.forEach(font => {
            const link = document.createElement('link');
            link.href = `https://fonts.googleapis.com/css2?family=${font.replace(' ', '+')}&display=swap`;
            link.rel = 'stylesheet';
            document.head.appendChild(link);
        });

        // Update font family dropdown
        setTimeout(() => this.updateFontList(webFonts), 1000);
    }

    updateFontList(additionalFonts) {
        const fontFamily = document.getElementById('font-family');
        if (!fontFamily) return;

        additionalFonts.forEach(font => {
            const option = document.createElement('option');
            option.value = font;
            option.textContent = font;
            fontFamily.appendChild(option);
        });
    }

    getDefaultPresets() {
        return {
            'glow': {
                glowEnabled: true,
                glowColor: '#00ffff',
                glowIntensity: 15,
                color: '#ffffff',
                strokeEnabled: true,
                strokeColor: '#000000',
                strokeWidth: 2
            },
            'neon': {
                glowEnabled: true,
                glowColor: '#ff00ff',
                glowIntensity: 20,
                color: '#ffffff',
                backgroundColor: '#000000',
                backgroundEnabled: true
            },
            '3d': {
                perspective: 50,
                rotateX: 15,
                rotateY: 15,
                strokeEnabled: true,
                strokeColor: '#666666',
                strokeWidth: 3
            },
            'rainbow': {
                gradientEnabled: true,
                gradientColor1: '#ff0000',
                gradientColor2: '#0000ff',
                gradientDirection: 'horizontal',
                fontSize: 36,
                bold: true
            },
            'vintage': {
                fontFamily: 'Georgia',
                color: '#8b4513',
                shadow: true,
                shadowColor: '#d2b48c',
                shadowBlur: 5,
                textTransform: 'uppercase',
                letterSpacing: 2
            }
        };
    }

    // Animation Methods
    previewAnimation() {
        if (!this.currentTextElement || this.isAnimating) return;

        this.isAnimating = true;
        const startTime = Date.now();
        const duration = this.currentTextElement.animationDuration;
        const animation = this.currentTextElement.animation;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            this.applyAnimationFrame(this.currentTextElement, animation, progress);
            this.editor.redraw();

            if (progress < 1) {
                this.animationFrameId = requestAnimationFrame(animate);
            } else {
                this.isAnimating = false;
                if (this.currentTextElement.animationLoop) {
                    setTimeout(() => this.previewAnimation(), 100);
                }
            }
        };

        this.animationFrameId = requestAnimationFrame(animate);
    }

    stopAnimation() {
        this.isAnimating = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        this.editor.redraw();
    }

    applyAnimationFrame(textElement, animation, progress) {
        const easedProgress = this.easeInOutCubic(progress);

        switch (animation) {
            case 'fadeIn':
                textElement.animatedOpacity = easedProgress * (textElement.opacity / 100);
                break;
            case 'slideIn':
                textElement.animatedX = textElement.x - (100 * (1 - easedProgress));
                break;
            case 'bounce':
                const bounce = Math.sin(progress * Math.PI * 4) * (1 - progress) * 20;
                textElement.animatedY = textElement.y + bounce;
                break;
            case 'rotate':
                textElement.animatedRotation = progress * 360;
                break;
            case 'scale':
                textElement.animatedScale = 0.5 + (easedProgress * 0.5);
                break;
            case 'pulse':
                textElement.animatedScale = 1 + Math.sin(progress * Math.PI * 6) * 0.2;
                break;
            case 'typewriter':
                const textLength = textElement.text.length;
                const visibleLength = Math.floor(progress * textLength);
                textElement.animatedText = textElement.text.substring(0, visibleLength);
                break;
        }
    }

    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

    // 3D and Transform Effects
    apply3DTransform(ctx, textElement) {
        if (textElement.perspective || textElement.rotateX || textElement.rotateY || textElement.skewX || textElement.skewY) {
            ctx.save();
            
            const centerX = textElement.x;
            const centerY = textElement.y;
            
            ctx.translate(centerX, centerY);
            
            // Apply 3D perspective (simulated)
            if (textElement.perspective > 0) {
                const scale = 1 - (textElement.perspective / 200);
                ctx.scale(scale, scale);
            }
            
            // Apply rotations
            if (textElement.rotateX !== 0) {
                const skewY = Math.sin(textElement.rotateX * Math.PI / 180) * 0.5;
                ctx.transform(1, skewY, 0, 1, 0, 0);
            }
            
            if (textElement.rotateY !== 0) {
                const skewX = Math.sin(textElement.rotateY * Math.PI / 180) * 0.5;
                ctx.transform(1, 0, skewX, 1, 0, 0);
            }
            
            // Apply skew
            if (textElement.skewX !== 0 || textElement.skewY !== 0) {
                const skewXRad = textElement.skewX * Math.PI / 180;
                const skewYRad = textElement.skewY * Math.PI / 180;
                ctx.transform(1, Math.tan(skewYRad), Math.tan(skewXRad), 1, 0, 0);
            }
            
            ctx.translate(-centerX, -centerY);
            
            return true;
        }
        return false;
    }

    // Text Effects
    applyGlowEffect(ctx, textElement) {
        if (!textElement.glowEnabled) return;

        ctx.save();
        ctx.shadowColor = textElement.glowColor;
        ctx.shadowBlur = textElement.glowIntensity;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        // Draw multiple glow layers for intensity
        for (let i = 0; i < 3; i++) {
            ctx.shadowBlur = textElement.glowIntensity * (i + 1);
            this.drawTextContent(ctx, textElement);
        }
        
        ctx.restore();
    }

    applyPatternFill(ctx, textElement) {
        if (!textElement.patternEnabled) return null;

        const patternCanvas = document.createElement('canvas');
        patternCanvas.width = textElement.patternSize;
        patternCanvas.height = textElement.patternSize;
        const patternCtx = patternCanvas.getContext('2d');

        switch (textElement.patternType) {
            case 'dots':
                patternCtx.fillStyle = textElement.patternColor;
                patternCtx.beginPath();
                patternCtx.arc(textElement.patternSize / 2, textElement.patternSize / 2, textElement.patternSize / 4, 0, 2 * Math.PI);
                patternCtx.fill();
                break;
            case 'stripes':
                patternCtx.fillStyle = textElement.patternColor;
                patternCtx.fillRect(0, 0, textElement.patternSize / 2, textElement.patternSize);
                break;
            case 'checkers':
                patternCtx.fillStyle = textElement.patternColor;
                patternCtx.fillRect(0, 0, textElement.patternSize / 2, textElement.patternSize / 2);
                patternCtx.fillRect(textElement.patternSize / 2, textElement.patternSize / 2, textElement.patternSize / 2, textElement.patternSize / 2);
                break;
        }

        return ctx.createPattern(patternCanvas, 'repeat');
    }

    // Text Warping
    applyTextWarp(ctx, textElement, text, x, y) {
        if (textElement.warpType === 'none' || textElement.warpIntensity === 0) {
            ctx.fillText(text, x, y);
            return;
        }

        const chars = text.split('');
        let currentX = x;

        chars.forEach((char, index) => {
            const charWidth = ctx.measureText(char).width;
            let offsetX = 0;
            let offsetY = 0;

            switch (textElement.warpType) {
                case 'wave':
                    offsetY = Math.sin((index / chars.length) * Math.PI * 2) * textElement.warpIntensity;
                    break;
                case 'arc':
                    const angle = (index / chars.length) * Math.PI * 0.5;
                    offsetX = Math.sin(angle) * textElement.warpIntensity;
                    offsetY = (1 - Math.cos(angle)) * textElement.warpIntensity;
                    break;
                case 'flag':
                    offsetX = Math.sin((index / chars.length) * Math.PI * 3) * textElement.warpIntensity;
                    break;
            }

            ctx.fillText(char, currentX + offsetX, y + offsetY);
            currentX += charWidth + textElement.letterSpacing;
        });
    }

    // Advanced Typography
    applyAdvancedTypography(ctx, textElement) {
        // Apply text transform
        let processedText = textElement.text;
        switch (textElement.textTransform) {
            case 'uppercase':
                processedText = processedText.toUpperCase();
                break;
            case 'lowercase':
                processedText = processedText.toLowerCase();
                break;
            case 'capitalize':
                processedText = processedText.replace(/\b\w/g, l => l.toUpperCase());
                break;
        }

        // Apply font weight and stretch
        let fontString = '';
        if (textElement.italic) fontString += 'italic ';
        fontString += `${textElement.fontWeight} `;
        if (textElement.fontStretch !== 'normal') fontString += `${textElement.fontStretch} `;
        fontString += `${textElement.fontSize}px ${textElement.fontFamily}`;
        
        ctx.font = fontString;
        return processedText;
    }

    // Preset Management
    applyTextPreset() {
        const presetSelect = document.getElementById('text-preset-select');
        if (!presetSelect || !this.currentTextElement) return;

        const presetName = presetSelect.value;
        const preset = this.textPresets[presetName];
        
        if (preset) {
            Object.keys(preset).forEach(key => {
                this.currentTextElement[key] = preset[key];
            });
            
            this.updateControlsFromText(this.currentTextElement);
            this.editor.redraw();
        }
    }

    saveTextPreset() {
        const presetName = prompt('Enter preset name:');
        if (!presetName || !this.currentTextElement) return;

        const preset = {};
        const presetProperties = [
            'fontSize', 'fontFamily', 'color', 'bold', 'italic', 'underline',
            'shadow', 'strokeEnabled', 'strokeColor', 'strokeWidth',
            'gradientEnabled', 'gradientColor1', 'gradientColor2', 'gradientDirection',
            'glowEnabled', 'glowColor', 'glowIntensity', 'perspective', 'rotateX', 'rotateY',
            'textTransform', 'fontWeight', 'warpType', 'warpIntensity', 'blendMode'
        ];

        presetProperties.forEach(prop => {
            if (this.currentTextElement[prop] !== this.defaultSettings[prop]) {
                preset[prop] = this.currentTextElement[prop];
            }
        });

        this.textPresets[presetName] = preset;
        this.updatePresetDropdown();
        
        // Save to localStorage
        localStorage.setItem('textPresets', JSON.stringify(this.textPresets));
        alert(`Preset "${presetName}" saved!`);
    }

    updatePresetDropdown() {
        const presetSelect = document.getElementById('text-preset-select');
        if (!presetSelect) return;

        // Clear existing options except the first one
        presetSelect.innerHTML = '<option value="">Choose a preset...</option>';
        
        Object.keys(this.textPresets).forEach(presetName => {
            const option = document.createElement('option');
            option.value = presetName;
            option.textContent = presetName.charAt(0).toUpperCase() + presetName.slice(1);
            presetSelect.appendChild(option);
        });
    }

    // Text Statistics and Analysis
    showTextStatistics() {
        if (!this.currentTextElement) return;

        const text = this.currentTextElement.text;
        const stats = {
            characters: text.length,
            charactersNoSpaces: text.replace(/\s/g, '').length,
            words: text.split(/\s+/).filter(word => word.length > 0).length,
            lines: text.split('\n').length,
            paragraphs: text.split('\n\n').filter(p => p.trim().length > 0).length,
            averageWordLength: text.split(/\s+/).filter(word => word.length > 0).reduce((sum, word) => sum + word.length, 0) / text.split(/\s+/).filter(word => word.length > 0).length || 0,
            fontSize: this.currentTextElement.fontSize,
            fontFamily: this.currentTextElement.fontFamily,
            estimatedWidth: this.measureTextWidth(this.currentTextElement),
            estimatedHeight: this.currentTextElement.fontSize * text.split('\n').length * this.currentTextElement.lineHeight
        };

        const statsText = `Text Statistics:
        
Characters: ${stats.characters}
Characters (no spaces): ${stats.charactersNoSpaces}
Words: ${stats.words}
Lines: ${stats.lines}
Paragraphs: ${stats.paragraphs}
Average word length: ${stats.averageWordLength.toFixed(1)}
Font: ${stats.fontFamily} ${stats.fontSize}px
Estimated dimensions: ${Math.round(stats.estimatedWidth)}×${Math.round(stats.estimatedHeight)}px`;

        alert(statsText);
    }

    // Import/Export Functions
    exportTextData() {
        const data = {
            textElements: this.textElements,
            presets: this.textPresets,
            version: '1.0'
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'text-data.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    importTextData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    if (data.textElements) {
                        // Import text elements
                        data.textElements.forEach(textElement => {
                            textElement.id = this.textIdCounter++;
                            this.textElements.push(textElement);
                        });
                    }
                    
                    if (data.presets) {
                        // Import presets
                        Object.assign(this.textPresets, data.presets);
                        this.updatePresetDropdown();
                    }
                    
                    this.updateTextElementsList();
                    this.editor.redraw();
                    alert('Text data imported successfully!');
                } catch (error) {
                    alert('Error importing text data: ' + error.message);
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    }

    // Enhanced Drawing with Advanced Features
    drawTextContent(ctx, textElement) {
        // This method is called by effect methods to draw the actual text
        const processedText = this.applyAdvancedTypography(ctx, textElement);
        
        if (textElement.warpType !== 'none') {
            this.applyTextWarp(ctx, textElement, processedText, textElement.x, textElement.y);
        } else {
            ctx.fillText(processedText, textElement.x, textElement.y);
        }
    }

    // Override the original drawSingleText method to include advanced features
    drawSingleTextAdvanced(textElement, layer = { data: textElement }, ctx = this.editor.ctx) {
        ctx.save();

        // Apply blending mode
        if (textElement.blendMode !== 'normal') {
            ctx.globalCompositeOperation = textElement.blendMode;
        }

        // Apply filters
        if (textElement.filter !== 'none') {
            ctx.filter = `brightness(${textElement.brightness}%) contrast(${textElement.contrast}%) saturate(${textElement.saturation}%)`;
        }

        // Use layer's opacity if available (for animations)
        const opacity = textElement.animatedOpacity !== undefined ? textElement.animatedOpacity : (layer.opacity !== undefined ? layer.opacity : textElement.opacity / 100);
        ctx.globalAlpha = opacity;

        // Apply 3D transforms
        const has3D = this.apply3DTransform(ctx, textElement);

        // Apply animated properties
        const finalX = textElement.animatedX !== undefined ? textElement.animatedX : textElement.x;
        const finalY = textElement.animatedY !== undefined ? textElement.animatedY : textElement.y;
        const finalRotation = textElement.animatedRotation !== undefined ? textElement.animatedRotation : textElement.rotation;
        const finalScale = textElement.animatedScale !== undefined ? textElement.animatedScale : 1;
        const finalText = textElement.animatedText !== undefined ? textElement.animatedText : textElement.text;

        // Apply scale
        if (finalScale !== 1) {
            ctx.scale(finalScale, finalScale);
        }

        // Set up font and text properties
        const processedText = this.applyAdvancedTypography(ctx, textElement);
        ctx.letterSpacing = `${textElement.letterSpacing}px`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        // Apply rotation
        if (finalRotation !== 0) {
            ctx.translate(finalX, finalY);
            ctx.rotate((finalRotation * Math.PI) / 180);
            ctx.translate(-finalX, -finalY);
        }

        // Apply glow effect
        this.applyGlowEffect(ctx, textElement);

        // Set up fill style (pattern, gradient, or solid color)
        const pattern = this.applyPatternFill(ctx, textElement);
        if (pattern) {
            ctx.fillStyle = pattern;
        } else if (textElement.gradientEnabled) {
            ctx.fillStyle = this.getGradient(ctx, finalX, finalY, textElement);
        } else {
            ctx.fillStyle = textElement.color;
        }

        // Draw the text with all effects
        const lines = finalText.split('\n');
        const lineHeight = textElement.fontSize * textElement.lineHeight;

        // Draw unified background if enabled (before drawing text)
        if (textElement.backgroundEnabled) {
            const bounds = this.getBackgroundBounds(textElement);
            ctx.fillStyle = textElement.backgroundColor;
            ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
            
            // Restore fill style
            if (pattern) {
                ctx.fillStyle = pattern;
            } else if (textElement.gradientEnabled) {
                ctx.fillStyle = this.getGradient(ctx, finalX, finalY, textElement);
            } else {
                ctx.fillStyle = textElement.color;
            }
        }

        lines.forEach((line, lineIndex) => {
            const lineY = finalY + (lineIndex * lineHeight);
            let lineX = finalX;

            // Adjust for text alignment
            if (textElement.align === 'center') {
                const lineWidth = ctx.measureText(line).width;
                lineX = finalX - lineWidth / 2;
            } else if (textElement.align === 'right') {
                const lineWidth = ctx.measureText(line).width;
                lineX = finalX - lineWidth;
            }

            // Draw stroke if enabled
            if (textElement.strokeEnabled && textElement.strokeWidth > 0) {
                ctx.strokeStyle = textElement.strokeColor;
                ctx.lineWidth = textElement.strokeWidth;
                if (textElement.warpType !== 'none') {
                    this.applyTextWarp(ctx, textElement, line, lineX, lineY);
                } else {
                    ctx.strokeText(line, lineX, lineY);
                }
            }

            // Draw main text with word coloring
            if (textElement.wordColors && Object.keys(textElement.wordColors).length > 0) {
                this.drawLineWithWordColors(ctx, line, lineX, lineY, textElement);
            } else {
                if (textElement.warpType !== 'none') {
                    this.applyTextWarp(ctx, textElement, line, lineX, lineY);
                } else {
                    ctx.fillText(line, lineX, lineY);
                }
            }

            // Draw underline if enabled
            if (textElement.underline) {
                const lineWidth = ctx.measureText(line).width;
                const underlineY = lineY + textElement.fontSize + 2;
                ctx.strokeStyle = ctx.fillStyle;
                ctx.lineWidth = Math.max(1, textElement.fontSize / 20);
                ctx.beginPath();
                ctx.moveTo(lineX, underlineY);
                ctx.lineTo(lineX + lineWidth, underlineY);
                ctx.stroke();
            }
        });

        // Draw selection indicator if selected
        if (this.selectedTextId === textElement.id && !this.isDragging) {
            this.drawTextSelectionIndicator(textElement);
        }

        ctx.restore();

        // Draw background resize handles (after restoring context)
        if (this.selectedTextId === textElement.id && textElement.backgroundEnabled && !this.isDragging && !this.isResizingBackground) {
            this.drawBackgroundResizeHandles(textElement);
        }
    }

    drawLineWithWordColors(ctx, line, x, y, textElement) {
        const words = this.getWordsFromText(line);
        let currentX = x;

        words.forEach((word, index) => {
            const wordColor = textElement.wordColors[index] || textElement.color;
            ctx.fillStyle = wordColor;
            
            const wordWidth = ctx.measureText(word).width;
            ctx.fillText(word, currentX, y);
            currentX += wordWidth;
        });
    }

    // Background Resize Methods

    getBackgroundResizeHandle(x, y, textElement) {
        if (!textElement.backgroundEnabled) return null;

        const bounds = this.getBackgroundBounds(textElement);
        const handleSize = 8;
        const tolerance = 5;

        // Check corner handles
        const handles = [
            { name: 'nw', x: bounds.x - handleSize/2, y: bounds.y - handleSize/2 },
            { name: 'ne', x: bounds.x + bounds.width - handleSize/2, y: bounds.y - handleSize/2 },
            { name: 'sw', x: bounds.x - handleSize/2, y: bounds.y + bounds.height - handleSize/2 },
            { name: 'se', x: bounds.x + bounds.width - handleSize/2, y: bounds.y + bounds.height - handleSize/2 },
            { name: 'n', x: bounds.x + bounds.width/2 - handleSize/2, y: bounds.y - handleSize/2 },
            { name: 's', x: bounds.x + bounds.width/2 - handleSize/2, y: bounds.y + bounds.height - handleSize/2 },
            { name: 'w', x: bounds.x - handleSize/2, y: bounds.y + bounds.height/2 - handleSize/2 },
            { name: 'e', x: bounds.x + bounds.width - handleSize/2, y: bounds.y + bounds.height/2 - handleSize/2 }
        ];

        for (const handle of handles) {
            if (x >= handle.x - tolerance && x <= handle.x + handleSize + tolerance &&
                y >= handle.y - tolerance && y <= handle.y + handleSize + tolerance) {
                return handle.name;
            }
        }

        return null;
    }

    getBackgroundBounds(textElement) {
        const textWidth = this.measureTextWidth(textElement);
        const lines = textElement.text.split('\n');
        const lineHeight = textElement.fontSize * textElement.lineHeight;
        const totalHeight = lines.length * lineHeight;

        let textX = textElement.x;
        let textY = textElement.y;

        // Adjust for text alignment
        if (textElement.align === 'center') {
            textX -= textWidth / 2;
        } else if (textElement.align === 'right') {
            textX -= textWidth;
        }

        const padding = textElement.backgroundPadding || this.defaultSettings.backgroundPadding;

        return {
            x: textX - padding.left,
            y: textY - padding.top,
            width: textWidth + padding.left + padding.right,
            height: totalHeight + padding.top + padding.bottom
        };
    }

    getResizeCursor(handle) {
        const cursors = {
            'nw': 'nw-resize',
            'ne': 'ne-resize',
            'sw': 'sw-resize',
            'se': 'se-resize',
            'n': 'n-resize',
            's': 's-resize',
            'w': 'w-resize',
            'e': 'e-resize'
        };
        return cursors[handle] || 'default';
    }

    resizeBackgroundPadding(coords) {
        if (!this.currentTextElement || !this.resizeHandle) return;

        const deltaX = coords.x - this.resizeStartPos.x;
        const deltaY = coords.y - this.resizeStartPos.y;
        const padding = this.currentTextElement.backgroundPadding;

        // Clone original padding to avoid mutations
        const originalPadding = { ...this.originalBackgroundPadding };

        switch (this.resizeHandle) {
            case 'nw':
                padding.left = Math.max(0, originalPadding.left - deltaX);
                padding.top = Math.max(0, originalPadding.top - deltaY);
                break;
            case 'ne':
                padding.right = Math.max(0, originalPadding.right + deltaX);
                padding.top = Math.max(0, originalPadding.top - deltaY);
                break;
            case 'sw':
                padding.left = Math.max(0, originalPadding.left - deltaX);
                padding.bottom = Math.max(0, originalPadding.bottom + deltaY);
                break;
            case 'se':
                padding.right = Math.max(0, originalPadding.right + deltaX);
                padding.bottom = Math.max(0, originalPadding.bottom + deltaY);
                break;
            case 'n':
                padding.top = Math.max(0, originalPadding.top - deltaY);
                break;
            case 's':
                padding.bottom = Math.max(0, originalPadding.bottom + deltaY);
                break;
            case 'w':
                padding.left = Math.max(0, originalPadding.left - deltaX);
                break;
            case 'e':
                padding.right = Math.max(0, originalPadding.right + deltaX);
                break;
        }
    }

    drawBackgroundResizeHandles(textElement) {
        if (!textElement.backgroundEnabled || this.selectedTextId !== textElement.id) return;

        const ctx = this.editor.ctx;
        const bounds = this.getBackgroundBounds(textElement);
        const handleSize = 8;

        ctx.save();
        ctx.fillStyle = '#3b82f6';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;

        // Draw corner handles
        const handles = [
            { x: bounds.x - handleSize/2, y: bounds.y - handleSize/2 },
            { x: bounds.x + bounds.width - handleSize/2, y: bounds.y - handleSize/2 },
            { x: bounds.x - handleSize/2, y: bounds.y + bounds.height - handleSize/2 },
            { x: bounds.x + bounds.width - handleSize/2, y: bounds.y + bounds.height - handleSize/2 },
            { x: bounds.x + bounds.width/2 - handleSize/2, y: bounds.y - handleSize/2 },
            { x: bounds.x + bounds.width/2 - handleSize/2, y: bounds.y + bounds.height - handleSize/2 },
            { x: bounds.x - handleSize/2, y: bounds.y + bounds.height/2 - handleSize/2 },
            { x: bounds.x + bounds.width - handleSize/2, y: bounds.y + bounds.height/2 - handleSize/2 }
        ];

        handles.forEach(handle => {
            ctx.fillRect(handle.x, handle.y, handleSize, handleSize);
            ctx.strokeRect(handle.x, handle.y, handleSize, handleSize);
        });

        // Draw background border
        ctx.strokeStyle = '#3b82f6';
        ctx.setLineDash([3, 3]);
        ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
        ctx.setLineDash([]);

        ctx.restore();
    }
}