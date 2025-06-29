export class FrameTool {
    constructor(editor) {
        this.editor = editor;
        this.isActive = false;
        this.frameLayerId = null;
        this.listenersAttached = false;

        this.properties = {
            type: 'solid',
            source: '#000000',
            gradient: { color1: '#4F46E5', color2: '#EC4899', direction: 'horizontal' },
            size_h: 50,
            size_v: 50,
            size_locked: false, // Unlocked by default as requested
            shape: 'rectangle',
            opacity: 1,
            blendMode: 'source-over',
            // Shape-specific properties
            cornerRadius: 20,
            frequency: 20,
            amplitude: 10,
            gap: 5,
            // Shadow properties
            shadowEnabled: false,
            shadowColor: '#000000',
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowOffsetY: 0
        };
    }

    setupEventListeners() {
        // Frame type and source
        document.querySelectorAll('.frame-type-btn').forEach(btn => btn.addEventListener('click', () => this.handlePropertyChange('type', btn.dataset.type, btn, true)));
        
        const frameColor = document.getElementById('frame-color');
        if (frameColor) frameColor.addEventListener('input', (e) => this.handlePropertyChange('source', e.target.value));
        
        document.querySelectorAll('.frame-option').forEach(btn => btn.addEventListener('click', () => { if (this.properties.type === 'pattern') this.handlePropertyChange('source', btn.dataset.frameSource, btn); }));
        
        const gradientColor1 = document.getElementById('gradient-color-1');
        if (gradientColor1) gradientColor1.addEventListener('input', (e) => this.handleGradientChange('color1', e.target.value));
        
        const gradientColor2 = document.getElementById('gradient-color-2');
        if (gradientColor2) gradientColor2.addEventListener('input', (e) => this.handleGradientChange('color2', e.target.value));
        
        const gradientDirection = document.getElementById('gradient-direction');
        if (gradientDirection) gradientDirection.addEventListener('change', (e) => this.handleGradientChange('direction', e.target.value));

        // Shapes
        document.querySelectorAll('.frame-shape-btn').forEach(btn => btn.addEventListener('click', () => this.handlePropertyChange('shape', btn.dataset.shape, btn, true)));
        
        // Contextual Shape Properties
        const shapeProps = ['corner-radius', 'frequency', 'amplitude', 'gap'];
        shapeProps.forEach(prop => {
            const input = document.getElementById(`prop-${prop}`);
            if (input) {
                const valueDisplay = document.getElementById(`prop-${prop}-value`);
                const propName = prop.replace(/-(\w)/g, (match, letter) => letter.toUpperCase());
                input.addEventListener('input', (e) => {
                    this.handlePropertyChange(propName, parseInt(e.target.value));
                    if (valueDisplay) valueDisplay.textContent = e.target.value;
                });
            }
        });

        // Sizing
        const sizeH = document.getElementById('frame-size-h');
        const sizeV = document.getElementById('frame-size-v');
        const lockBtn = document.getElementById('lock-frame-size');
        if(sizeH) sizeH.addEventListener('input', (e) => this.handleSizeChange(e.target.value, 'h'));
        if(sizeV) sizeV.addEventListener('input', (e) => this.handleSizeChange(e.target.value, 'v'));
        if(lockBtn) lockBtn.addEventListener('click', () => this.toggleSizeLock());

        // Opacity and Blend Mode
        const opacitySlider = document.getElementById('frame-opacity');
        if(opacitySlider) opacitySlider.addEventListener('input', (e) => this.handlePropertyChange('opacity', parseInt(e.target.value) / 100));
        
        const blendModeSelect = document.getElementById('frame-blend-mode');
        if(blendModeSelect) blendModeSelect.addEventListener('change', (e) => this.handlePropertyChange('blendMode', e.target.value));

        // Shadow
        const shadowEnable = document.getElementById('frame-shadow-enable');
        if(shadowEnable) shadowEnable.addEventListener('change', (e) => this.handlePropertyChange('shadowEnabled', e.target.checked, null, true));

        const shadowOffsetX = document.getElementById('shadow-offset-x');
        if(shadowOffsetX) shadowOffsetX.addEventListener('input', (e) => {
            this.handlePropertyChange('shadowOffsetX', parseInt(e.target.value));
            document.getElementById('shadow-offset-x-value').textContent = e.target.value;
        });

        const shadowOffsetY = document.getElementById('shadow-offset-y');
        if(shadowOffsetY) shadowOffsetY.addEventListener('input', (e) => {
            this.handlePropertyChange('shadowOffsetY', parseInt(e.target.value));
            document.getElementById('shadow-offset-y-value').textContent = e.target.value;
        });

        const shadowBlur = document.getElementById('shadow-blur');
        if(shadowBlur) shadowBlur.addEventListener('input', (e) => {
            this.handlePropertyChange('shadowBlur', parseInt(e.target.value));
            document.getElementById('shadow-blur-value').textContent = e.target.value;
        });

        const shadowColor = document.getElementById('shadow-color');
        if(shadowColor) shadowColor.addEventListener('input', (e) => this.handlePropertyChange('shadowColor', e.target.value));
        
        // Actions
        const applyFrame = document.getElementById('apply-frame');
        if(applyFrame) applyFrame.addEventListener('click', () => this.applyFrame());

        const removeFrame = document.getElementById('remove-frame');
        if(removeFrame) removeFrame.addEventListener('click', () => this.removeFrame());
    }
    
    handlePropertyChange(prop, value, element = null, toggle = false) {
        this.properties[prop] = value;
        if (element) {
            const group = element.parentElement.querySelectorAll(`.${element.className.split(' ').find(c => !c.includes('ring'))}`);
            group.forEach(b => b.classList.remove('ring-2', 'ring-blue-500'));
            element.classList.add('ring-2', 'ring-blue-500');
        }
        if (toggle) {
            this.toggleUISections();
        }
    }

    handleGradientChange(prop, value) { this.properties.gradient[prop] = value; }
    
    toggleUISections() {
        document.getElementById('solid-color-options').classList.toggle('hidden', this.properties.type !== 'solid');
        document.getElementById('gradient-options').classList.toggle('hidden', this.properties.type !== 'gradient');
        document.getElementById('pattern-options').classList.toggle('hidden', this.properties.type !== 'pattern');
        document.getElementById('prop-rounded').classList.toggle('hidden', this.properties.shape !== 'rounded');
        document.getElementById('prop-wave-jagged').classList.toggle('hidden', !['wave', 'jagged'].includes(this.properties.shape));
        document.getElementById('prop-double').classList.toggle('hidden', this.properties.shape !== 'double');
        document.getElementById('shadow-properties').classList.toggle('hidden', !this.properties.shadowEnabled);
    }
    
    handleSizeChange(value, direction) {
        const val = parseInt(value);
        if (this.properties.size_locked) {
            this.properties.size_h = val;
            this.properties.size_v = val;
            document.getElementById('frame-size-h').value = val;
            document.getElementById('frame-size-v').value = val;
        } else {
            this.properties[direction === 'h' ? 'size_h' : 'size_v'] = val;
        }
        this.updateSizeUI();
    }
    
    updateSizeUI() {
        document.getElementById('frame-size-h-value').textContent = `${this.properties.size_h}px`;
        document.getElementById('frame-size-v-value').textContent = `${this.properties.size_v}px`;
    }

    toggleSizeLock() {
        this.properties.size_locked = !this.properties.size_locked;
        if (this.properties.size_locked) {
            this.handleSizeChange(this.properties.size_h, 'h');
        }
        this.updateLockIcon();
    }

    updateLockIcon() {
        const lockBtn = document.getElementById('lock-frame-size');
        const lockedIcon = `<path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.665l3-3z"/><path d="M8.603 3.799a4.49 4.49 0 014.496 4.496l-1.224 1.224a.75.75 0 001.06 1.06l1.225-1.224a6 6 0 00-8.484-8.484l-3 3a6 6 0 008.484 8.484l1.224-1.224a.75.75 0 00-1.06-1.06l-1.224 1.224a4.5 4.5 0 01-6.364-6.364l3-3z"/>`;
        const unlockedIcon = `<path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.596a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>`;
        lockBtn.innerHTML = `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">${this.properties.size_locked ? lockedIcon : unlockedIcon}</svg>`;
        lockBtn.classList.toggle('text-blue-500', this.properties.size_locked);
        lockBtn.classList.toggle('text-gray-400', !this.properties.size_locked);
    }
    
    activate() { 
        this.isActive = true; 
        if (!this.listenersAttached) {
            this.setupEventListeners();
            this.listenersAttached = true;
        }
        this.updateUIFromProperties(); 
    }
    deactivate() { this.isActive = false; }

    applyFrame() {
        this.removeFrame(false);
        const frameCanvas = document.createElement('canvas');
        frameCanvas.width = this.editor.canvas.width;
        frameCanvas.height = this.editor.canvas.height;
        const frameCtx = frameCanvas.getContext('2d');

        const drawingPromise = this.drawCurrentFrame(frameCtx);
        
        Promise.resolve(drawingPromise).then(() => {
            const layer = this.editor.layerManager.addLayer('Frame', frameCanvas, 'frame');
            layer.opacity = this.properties.opacity;
            layer.blendMode = this.properties.blendMode;
            this.frameLayerId = layer.id;
            this.editor.layerManager.renderAllLayers();
            this.editor.historyManager.saveState();
        }).catch(error => console.error("Failed to draw frame:", error));
    }

    removeFrame(saveHistory = true) {
        if (this.frameLayerId !== null) {
            this.editor.layerManager.deleteLayer(this.frameLayerId);
            this.frameLayerId = null;
            if (saveHistory) this.editor.historyManager.saveState();
        }
    }
    
    drawCurrentFrame(ctx) {
        const { type, source, gradient, shape, shadowEnabled } = this.properties;

        if (shape === 'vignette') {
            const width = ctx.canvas.width;
            const height = ctx.canvas.height;
            const outerRadius = Math.sqrt(width*width + height*height) / 2;
            const vignette = ctx.createRadialGradient(width/2, height/2, outerRadius - this.properties.size_h, width/2, height/2, outerRadius);
            const color = type === 'solid' ? source : (gradient ? gradient.color1 : '#000000');
            vignette.addColorStop(0, `${color}00`);
            vignette.addColorStop(1, `${color}FF`);
            ctx.fillStyle = vignette;
            ctx.fillRect(0,0,width,height);
            return Promise.resolve();
        }
        
        const framePath = this.drawFrameShape(ctx);

        let fillPromise;
        switch (type) {
            case 'solid':
                ctx.fillStyle = source;
                fillPromise = Promise.resolve();
                break;
            case 'gradient':
                ctx.fillStyle = this.createGradient(ctx);
                fillPromise = Promise.resolve();
                break;
            case 'pattern':
                fillPromise = this.createPattern(ctx).then(p => {
                    ctx.fillStyle = p;
                });
                break;
        }
        
        return fillPromise.then(() => {
             ctx.fill(framePath, 'evenodd');
             if (shadowEnabled) {
                this.drawInnerShadow(ctx, framePath);
             }
        });
    }

    drawFrameShape(ctx) {
        const { size_h, size_v, shape, cornerRadius, frequency, amplitude, gap } = this.properties;
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const path = new Path2D();
        
        // Outer path
        path.rect(0, 0, width, height);

        // Inner path (the hole)
        switch (shape) {
            case 'rounded':
                const r = Math.min(cornerRadius, size_h, size_v);
                path.moveTo(size_h + r, size_v);
                path.arcTo(width - size_h, size_v, width - size_h, height - size_v, r);
                path.arcTo(width - size_h, height - size_v, size_h, height - size_v, r);
                path.arcTo(size_h, height - size_v, size_h, size_v, r);
                path.arcTo(size_h, size_v, width - size_h, size_v, r);
                break;
            case 'double':
                path.rect(size_h, size_v, width - size_h * 2, height - size_v * 2);
                const g = Math.min(gap, size_h / 2, size_v / 2);
                path.moveTo(size_h - g, size_v - g);
                path.rect(size_h - g, size_v - g, width - (size_h - g) * 2, height - (size_v - g) * 2);
                break;
            case 'wave':
            case 'jagged':
                const buildPath = (s_h, s_v) => {
                    path.moveTo(s_h, s_v);
                    for (let x = s_h; x < width - s_h; x++) {
                        path.lineTo(x, s_v + Math.sin((x / frequency) * Math.PI) * amplitude);
                    }
                    for (let y = s_v; y < height - s_v; y++) {
                        path.lineTo(width - s_h + Math.sin((y / frequency) * Math.PI) * amplitude, y);
                    }
                    for (let x = width - s_h; x > s_h; x--) {
                        path.lineTo(x, height - s_v + Math.sin((x / frequency) * Math.PI) * amplitude);
                    }
                    for (let y = height - s_v; y > s_v; y--) {
                        path.lineTo(s_h + Math.sin((y / frequency) * Math.PI) * amplitude, y);
                    }
                }
                buildPath(size_h, size_v);
                break;
            case 'ellipse':
                path.ellipse(width / 2, height / 2, Math.max(0, width/2 - size_h), Math.max(0, height/2 - size_v), 0, 0, 2 * Math.PI, true);
                break;
            case 'rectangle':
            default:
                path.rect(size_h, size_v, width - size_h * 2, height - size_v * 2);
                break;
        }
        path.closePath();
        return path;
    }

    drawInnerShadow(ctx, path) {
        ctx.save();
        ctx.clip(path, 'evenodd');
        ctx.shadowColor = this.properties.shadowColor;
        ctx.shadowBlur = this.properties.shadowBlur;
        ctx.shadowOffsetX = this.properties.shadowOffsetX + ctx.canvas.width;
        ctx.shadowOffsetY = this.properties.shadowOffsetY;
        ctx.fillStyle = 'black';
        ctx.fillRect(-ctx.canvas.width, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.restore();
    }
    
    createGradient(ctx) {
        const { color1, color2, direction } = this.properties.gradient;
        const {width, height} = ctx.canvas;
        let gradient;
        switch (direction) {
            case 'vertical': gradient = ctx.createLinearGradient(0, 0, 0, height); break;
            case 'diagonal': gradient = ctx.createLinearGradient(0, 0, width, height); break;
            case 'radial': gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)/2); break;
            default: gradient = ctx.createLinearGradient(0, 0, width, 0); break;
        }
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        return gradient;
    }

    createPattern(ctx) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            // Resolve the URL to be absolute to prevent pathing issues
            const absoluteUrl = new URL(this.properties.source, window.location.origin).href;
            img.src = absoluteUrl;

            img.onload = () => resolve(ctx.createPattern(img, 'repeat'));
            img.onerror = (err) => reject(err);
        });
    }
    
    getFrameState() { return { frameLayerId: this.frameLayerId, properties: JSON.parse(JSON.stringify(this.properties)) }; }

    restoreFrameState(state) {
        if (state && state.properties) {
            this.frameLayerId = state.frameLayerId;
            Object.assign(this.properties, state.properties);
            this.updateUIFromProperties();
        }
    }
    
    updateUIFromProperties() {
        try {
            this.handlePropertyChange('type', this.properties.type, document.querySelector(`.frame-type-btn[data-type="${this.properties.type}"]`));
            if(this.properties.type === 'solid') {
                 document.getElementById('frame-color').value = this.properties.source;
            } else if(this.properties.type === 'pattern' && this.properties.source.startsWith('/')) {
                 document.querySelectorAll('.frame-option').forEach(b => b.classList.remove('ring-2', 'ring-blue-500'));
                 document.querySelector(`.frame-option[data-frame-source="${this.properties.source}"]`)?.classList.add('ring-2', 'ring-blue-500');
            }
            if(this.properties.gradient) {
                document.getElementById('gradient-color-1').value = this.properties.gradient.color1;
                document.getElementById('gradient-color-2').value = this.properties.gradient.color2;
                document.getElementById('gradient-direction').value = this.properties.gradient.direction;
            }
            this.handlePropertyChange('shape', this.properties.shape, document.querySelector(`.frame-shape-btn[data-shape="${this.properties.shape}"]`), true);
            
            ['corner-radius', 'frequency', 'amplitude', 'gap'].forEach(p => {
                const propName = p.replace(/-(\w)/g, (m, l) => l.toUpperCase());
                document.getElementById(`prop-${p}`).value = this.properties[propName];
                document.getElementById(`prop-${p}-value`).textContent = this.properties[propName];
            });
            
            document.getElementById('frame-size-h').value = this.properties.size_h;
            document.getElementById('frame-size-v').value = this.properties.size_v;
            this.updateSizeUI();
            
            document.getElementById('frame-opacity').value = this.properties.opacity * 100;
            document.getElementById('opacity-value').textContent = `${Math.round(this.properties.opacity * 100)}%`;
            
            document.getElementById('frame-shadow-enable').checked = this.properties.shadowEnabled;
            document.getElementById('shadow-offset-x').value = this.properties.shadowOffsetX;
            document.getElementById('shadow-offset-x-value').textContent = this.properties.shadowOffsetX;
            document.getElementById('shadow-offset-y').value = this.properties.shadowOffsetY;
            document.getElementById('shadow-offset-y-value').textContent = this.properties.shadowOffsetY;
            document.getElementById('shadow-blur').value = this.properties.shadowBlur;
            document.getElementById('shadow-blur-value').textContent = this.properties.shadowBlur;
            document.getElementById('shadow-color').value = this.properties.shadowColor;
            
            document.getElementById('frame-blend-mode').value = this.properties.blendMode;
            
            this.updateLockIcon();
            this.toggleUISections();
        } catch(e) {
            console.warn("Could not update frame UI", e);
        }
    }
} 