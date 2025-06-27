export class AnimationTool {
    constructor(editor) {
        this.editor = editor;
        this.activeAnimation = 'none';
        this.isPlaying = false;
        this.animationFrameId = null;
        this.isExporting = false;

        this.properties = {
            intensity: 50,
            duration: 2, // in seconds
            easing: 'easeOut' // New easing property
        };

        this.setupEventListeners();
        this.loadGifLibrary();
    }

    async loadGifLibrary() {
        // Load GIF.js library dynamically
        if (typeof GIF === 'undefined') {
            try {
                await this.loadScript('https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.js');
                console.log('GIF.js library loaded successfully');
            } catch (error) {
                console.error('Failed to load GIF.js library:', error);
            }
        }
    }

    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    setupEventListeners() {
        // Preset buttons
        document.querySelectorAll('.animation-preset-btn').forEach(btn => {
            btn.addEventListener('click', () => this.selectAnimation(btn.dataset.anim));
        });

        // Property sliders
        const intensitySlider = document.getElementById('animation-intensity');
        intensitySlider.addEventListener('input', (e) => {
            this.properties.intensity = parseInt(e.target.value);
            document.getElementById('animation-intensity-value').textContent = `${this.properties.intensity}%`;
        });

        const durationSlider = document.getElementById('animation-duration');
        durationSlider.addEventListener('input', (e) => {
            this.properties.duration = parseFloat(e.target.value);
            document.getElementById('animation-duration-value').textContent = `${this.properties.duration.toFixed(1)}s`;
        });

        // Easing dropdown
        const easingSelect = document.getElementById('animation-easing');
        if (easingSelect) {
            easingSelect.addEventListener('change', (e) => {
                this.properties.easing = e.target.value;
            });
        }
        
        // Main controls
        document.getElementById('play-animation-btn').addEventListener('click', () => this.playAnimation());
        document.getElementById('export-gif-btn').addEventListener('click', () => this.exportAsGif());
    }

    selectAnimation(animationName) {
        this.activeAnimation = animationName;

        // Update UI
        document.querySelectorAll('.animation-preset-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.anim === animationName);
        });
        
        const propertiesPanel = document.getElementById('animation-properties');
        if (animationName === 'none') {
            propertiesPanel.classList.add('hidden');
        } else {
            propertiesPanel.classList.remove('hidden');
            document.getElementById('animation-properties-title').textContent = `${animationName.charAt(0).toUpperCase() + animationName.slice(1)} Properties`;
        }
        
        // Assign animation to active layer
        if (this.editor.layerManager.activeLayer) {
            this.editor.layerManager.activeLayer.animation = {
                type: animationName,
                ...this.properties
            };
            this.editor.historyManager.saveState();
        }
    }

    // Enhanced easing functions
    getEasingFunction(type, progress) {
        switch (type) {
            case 'linear':
                return progress;
            case 'easeIn':
                return progress * progress;
            case 'easeOut':
                return 1 - Math.pow(1 - progress, 2);
            case 'easeInOut':
                return progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            case 'easeInCubic':
                return progress * progress * progress;
            case 'easeOutCubic':
                return 1 - Math.pow(1 - progress, 3);
            case 'easeInOutCubic':
                return progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            case 'bounce':
                if (progress < 1 / 2.75) {
                    return 7.5625 * progress * progress;
                } else if (progress < 2 / 2.75) {
                    return 7.5625 * (progress -= 1.5 / 2.75) * progress + 0.75;
                } else if (progress < 2.5 / 2.75) {
                    return 7.5625 * (progress -= 2.25 / 2.75) * progress + 0.9375;
                } else {
                    return 7.5625 * (progress -= 2.625 / 2.75) * progress + 0.984375;
                }
            case 'elastic':
                const c4 = (2 * Math.PI) / 3;
                return progress === 0 ? 0 : progress === 1 ? 1 : -Math.pow(2, 10 * progress - 10) * Math.sin((progress * 10 - 10.75) * c4);
            default:
                return 1 - Math.pow(1 - progress, 3); // Default to easeOut
        }
    }

    playAnimation() {
        const layer = this.editor.layerManager.activeLayer;

        // Add a guard clause to prevent animating the background layer.
        if (layer && layer.data instanceof HTMLImageElement) {
            alert('The background layer cannot be animated. Please add and select a different layer (e.g., text or a sticker) to apply an animation.');
            return;
        }

        if (this.isPlaying || !layer || this.activeAnimation === 'none') {
            console.warn('Cannot play animation. Ensure a layer and animation type are selected.');
            return;
        }

        this.isPlaying = true;
        const playBtn = document.getElementById('play-animation-btn');
        playBtn.disabled = true;
        playBtn.innerHTML = `
            <svg class="w-5 h-5 animate-spin" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"></path>
            </svg>
            <span>Playing...</span>
        `;
        
        // Store a complete snapshot of the original state
        const originalState = this.storeOriginalState(layer);
        
        let startTime = null;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const duration = this.properties.duration * 1000;
            let progress = Math.min(elapsed / duration, 1);

            // Apply easing
            const easedProgress = this.getEasingFunction(this.properties.easing, progress);

            // Apply the correct animation transformation
            this.applyFrame(layer, this.activeAnimation, easedProgress, originalState);
            
            // Redraw the entire canvas
            this.editor.redraw();

            if (progress < 1) {
                this.animationFrameId = requestAnimationFrame(animate);
            } else {
                this.stopAnimation(layer, originalState);
            }
        };

        this.animationFrameId = requestAnimationFrame(animate);
    }

    applyFrame(layer, anim, progress, state) {
        const intensity = this.properties.intensity / 100; // 0 to 1

        // Temporarily reset properties for this frame's calculation
        this.restoreOriginalState(layer, state);
        
        // Do not apply transform animations to the background image, which is an HTMLImageElement
        const canTransform = layer.data && !(layer.data instanceof HTMLImageElement);

        switch (anim) {
            case 'fade':
                layer.opacity = progress * state.opacity;
                break;
            case 'rise':
                if (canTransform) {
                    layer.data.y = state.y - (100 * intensity * (1 - progress));
                }
                layer.opacity = progress * state.opacity;
                break;
            case 'pan':
                if (canTransform) layer.data.x = state.x - (100 * intensity * (1 - progress));
                break;
            case 'pop':
                if (canTransform) {
                    layer.animationScale = 1 + (0.5 * intensity * Math.sin(progress * Math.PI));
                }
                break;
            case 'wipe':
                layer.animationProgress = progress;
                break;
            case 'blur':
                const maxBlur = 10 * intensity;
                const blurValue = maxBlur * (1 - progress);
                this.editor.tools.filter.setFilterValue('blur', blurValue);
                break;
            case 'breathe':
                if (canTransform) {
                    layer.animationScale = 1 + (0.1 * intensity * Math.sin(progress * 2 * Math.PI));
                }
                break;
            case 'rotate':
                if (canTransform) {
                    layer.data.rotation = state.rotation + (360 * progress * intensity);
                }
                break;
            case 'flicker':
                layer.opacity = Math.random() > 0.5 ? state.opacity : state.opacity * 0.5;
                break;
            case 'pulse':
                if (canTransform) {
                    layer.animationScale = 1 + (0.2 * intensity * Math.sin(progress * 4 * Math.PI));
                }
                break;
            case 'wiggly':
                if (canTransform) {
                    layer.data.x = state.x + ((Math.random() - 0.5) * 10 * intensity);
                    layer.data.y = state.y + ((Math.random() - 0.5) * 10 * intensity);
                }
                break;
            case 'swing':
                if (canTransform) {
                    layer.data.rotation = state.rotation + (30 * intensity * Math.sin(progress * 4 * Math.PI));
                }
                break;
            case 'bounce':
                if (canTransform) {
                    const bounceHeight = 50 * intensity;
                    layer.data.y = state.y - bounceHeight * Math.abs(Math.sin(progress * 3 * Math.PI));
                }
                break;
            case 'zoom':
                if (canTransform) {
                    layer.animationScale = 0.5 + (0.5 * progress);
                }
                break;
            case 'shake':
                if (canTransform) {
                    const shakeIntensity = 10 * intensity * (1 - progress);
                    layer.data.x = state.x + ((Math.random() - 0.5) * shakeIntensity);
                    layer.data.y = state.y + ((Math.random() - 0.5) * shakeIntensity);
                }
                break;
            case 'rainbow':
                if (layer.type === 'text') {
                    const hue = (progress * 360) % 360;
                    layer.data.color = `hsl(${hue}, 70%, 50%)`;
                }
                break;
        }
    }

    stopAnimation(layer, originalState) {
        this.isPlaying = false;
        cancelAnimationFrame(this.animationFrameId);
        
        this.restoreOriginalState(layer, originalState);

        // Reset animation-specific properties
        layer.animationProgress = null;
        layer.animationScale = null;
        if (this.activeAnimation === 'blur') {
            this.editor.tools.filter.setFilterValue('blur', 0);
        }

        this.editor.redraw();
        
        // Reset play button
        const playBtn = document.getElementById('play-animation-btn');
        playBtn.disabled = false;
        playBtn.innerHTML = `
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path>
            </svg>
            <span>Preview Animation</span>
        `;
    }
    
    storeOriginalState(layer) {
        const state = { opacity: layer.opacity };
        if (layer.data) {
            if (layer.data.x !== undefined) state.x = layer.data.x;
            if (layer.data.y !== undefined) state.y = layer.data.y;
            if (layer.data.size !== undefined) state.size = layer.data.size;
            if (layer.data.rotation !== undefined) state.rotation = layer.data.rotation;
            if (layer.data.color !== undefined) state.color = layer.data.color;
        }
        return state;
    }
    
    restoreOriginalState(layer, state) {
        layer.opacity = state.opacity;
        if (layer.data && !(layer.data instanceof HTMLImageElement)) {
             if (state.x !== undefined) layer.data.x = state.x;
             if (state.y !== undefined) layer.data.y = state.y;
             if (state.size !== undefined) layer.data.size = state.size;
             if (state.rotation !== undefined) layer.data.rotation = state.rotation;
             if (state.color !== undefined) layer.data.color = state.color;
        }
    }

    async exportAsGif() {
        if (this.isPlaying || this.isExporting || !this.editor.layerManager.activeLayer || this.activeAnimation === 'none') {
            alert('Please select a layer with an animation to export.');
            return;
        }

        if (typeof GIF === 'undefined') {
            alert('GIF library is not loaded. Please refresh the page and try again.');
            return;
        }

        this.isExporting = true;
        const exportBtn = document.getElementById('export-gif-btn');
        const progressContainer = document.getElementById('gif-progress-container');
        const progressBar = document.getElementById('gif-progress-bar');
        const progressText = document.getElementById('gif-progress-text');

        exportBtn.disabled = true;
        exportBtn.innerHTML = `
            <svg class="w-5 h-5 animate-spin" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"></path>
            </svg>
            <span>Preparing...</span>
        `;
        progressContainer.classList.remove('hidden');
        progressBar.style.width = '0%';
        progressText.textContent = '0%';

        try {
            const gif = new GIF({
                workers: 2,
                quality: 10,
                width: this.editor.canvas.width,
                height: this.editor.canvas.height,
                workerScript: 'https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.worker.js'
            });

            const layer = this.editor.layerManager.activeLayer;
            const originalState = this.storeOriginalState(layer);
            const duration = this.properties.duration * 1000;
            const frameDelay = 50; // ms per frame, ~20fps
            const frameCount = Math.ceil(duration / frameDelay);

            // Add frames with progress tracking
            for (let i = 0; i < frameCount; i++) {
                const progress = i / (frameCount - 1);
                const easedProgress = this.getEasingFunction(this.properties.easing, progress);
                
                this.applyFrame(layer, this.activeAnimation, easedProgress, originalState);
                this.editor.redraw();
                
                gif.addFrame(this.editor.ctx, { copy: true, delay: frameDelay });
                
                // Update frame generation progress (0-50%)
                const frameProgress = Math.round((i / frameCount) * 50);
                progressBar.style.width = `${frameProgress}%`;
                progressText.textContent = `${frameProgress}%`;
                
                // Allow UI to update
                await new Promise(resolve => setTimeout(resolve, 1));
            }

            // Set up progress tracking for encoding (50-100%)
            gif.on('progress', (p) => {
                const encodingProgress = 50 + Math.round(p * 50);
                progressBar.style.width = `${encodingProgress}%`;
                progressText.textContent = `${encodingProgress}%`;
            });

            gif.on('finished', (blob) => {
                progressText.textContent = 'Download ready!';
                
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.download = `animation-${this.activeAnimation}-${Date.now()}.gif`;
                link.href = url;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);

                // Reset UI after a short delay
                setTimeout(() => {
                    this.resetExportUI();
                    this.restoreOriginalState(layer, originalState);
                    this.editor.redraw();
                }, 1000);
            });

            gif.on('abort', () => {
                this.resetExportUI();
                alert('GIF export was aborted.');
            });

            progressText.textContent = 'Encoding...';
            gif.render();

        } catch (error) {
            console.error('Error exporting GIF:', error);
            alert('Error exporting GIF: ' + error.message);
            this.resetExportUI();
        }
    }

    resetExportUI() {
        this.isExporting = false;
        const exportBtn = document.getElementById('export-gif-btn');
        const progressContainer = document.getElementById('gif-progress-container');
        
        exportBtn.disabled = false;
        exportBtn.innerHTML = `
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 3.5a1.5 1.5 0 01.588 2.91l-2.01 1.005a3.501 3.501 0 00-4.032.57 1.5 1.5 0 11-2.12-.137 6.5 6.5 0 017.38-1.182l2.36-1.18a1.5 1.5 0 01-1.176-2.986zM15.5 6a1.5 1.5 0 012.122-.137 6.5 6.5 0 01-1.182 7.38l-1.005 2.01a1.5 1.5 0 01-2.91-.588l1.18-2.36a3.5 3.5 0 00-.57-4.032 1.5 1.5 0 01.137-2.122zM3.5 10a1.5 1.5 0 01.588-2.91l2.01-1.005a3.5 3.5 0 004.032-.57 1.5 1.5 0 112.12.137 6.5 6.5 0 01-7.38 1.182L3.51 9.24a1.5 1.5 0 01-.01-2.23z"></path>
            </svg>
            <span>Export as GIF</span>
        `;
        progressContainer.classList.add('hidden');
    }
} 