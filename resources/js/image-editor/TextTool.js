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
            wordColors: {} // Store individual word colors
        };
        
        this.setupEventListeners();
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
        
        if (this.isDragging && this.draggedTextElement) {
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
                this.editor.canvas.style.cursor = 'grab';
            } else if (!this.isActive) {
                this.editor.canvas.style.cursor = 'default';
            }
        }
    }

    onCanvasMouseUp(e) {
        if (this.isDragging && this.draggedTextElement) {
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
            wordColors: {} // Initialize empty word colors
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
        
        // Stop any ongoing drag
        this.isDragging = false;
        this.draggedTextElement = null;
        
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
}