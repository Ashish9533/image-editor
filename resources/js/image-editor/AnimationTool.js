export class AnimationTool {
    constructor(editor) {
        this.editor = editor;
        this.activeAnimation = 'none';
        this.isPlaying = false;
        this.animationFrameId = null;

        this.properties = {
            intensity: 50,
            duration: 2, // in seconds
        };

        this.setupEventListeners();
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
        document.getElementById('play-animation-btn').disabled = true;
        
        // Store a complete snapshot of the original state
        const originalState = this.storeOriginalState(layer);
        
        let startTime = null;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const duration = this.properties.duration * 1000;
            let progress = Math.min(elapsed / duration, 1);

            // Apply the correct animation transformation
            this.applyFrame(layer, this.activeAnimation, progress, originalState);
            
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
        const easedProgress = 1 - Math.pow(1 - progress, 3); // Ease-out cubic

        // Temporarily reset properties for this frame's calculation
        this.restoreOriginalState(layer, state);
        
        // Do not apply transform animations to the background image, which is an HTMLImageElement
        const canTransform = layer.data && !(layer.data instanceof HTMLImageElement);

        switch (anim) {
            case 'fade':
                layer.opacity = easedProgress * state.opacity;
                break;
            case 'rise':
                layer.data.y = state.y - (50 * intensity * (1 - easedProgress));
                layer.opacity = easedProgress * state.opacity;
                break;
            case 'pan':
                if (canTransform) layer.data.x = state.x - (50 * intensity * (1 - easedProgress));
                break;
            case 'pop':
                if (canTransform) {
                    layer.animationScale = 1 + (0.5 * intensity * Math.sin(progress * Math.PI));
                }
                break;
            case 'wipe':
                // The wipe animation is handled directly in the LayerManager's rendering logic
                // We just need to pass the progress to the layer.
                layer.animationProgress = easedProgress;
                break;
            case 'blur':
                const maxBlur = 10 * intensity;
                const blurValue = maxBlur * (1 - easedProgress);
                this.editor.tools.filter.setFilterValue('blur', blurValue);
                break;
            case 'breathe':
                if (canTransform) {
                    layer.animationScale = 1 + (0.1 * intensity * Math.sin(progress * 2 * Math.PI));
                }
                break;
            case 'baseline':
                 // Placeholder
                break;
            case 'rotate':
                layer.data.rotation = state.rotation + (360 * progress * intensity);
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
                layer.data.x = state.x + ((Math.random() - 0.5) * 10 * intensity);
                layer.data.y = state.y + ((Math.random() - 0.5) * 10 * intensity);
                break;
        }

        // Only restore transform data if the layer is not a raw image element
        if (canTransform) {
             if (state.x !== undefined) layer.data.x = state.x;
             if (state.y !== undefined) layer.data.y = state.y;
             if (state.size !== undefined) layer.data.size = state.size;
             if (state.rotation !== undefined) layer.data.rotation = state.rotation;
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
        document.getElementById('play-animation-btn').disabled = false;
    }
    
    storeOriginalState(layer) {
        const state = { opacity: layer.opacity };
        if (layer.data) {
            if (layer.data.x !== undefined) state.x = layer.data.x;
            if (layer.data.y !== undefined) state.y = layer.data.y;
            if (layer.data.size !== undefined) state.size = layer.data.size;
            if (layer.data.rotation !== undefined) state.rotation = layer.data.rotation;
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
        }
    }

    exportAsGif() {
        if (this.isPlaying || !this.editor.layerManager.activeLayer || this.activeAnimation === 'none') {
            alert('Please select a layer with an animation to export.');
            return;
        }

        const exportBtn = document.getElementById('export-gif-btn');
        const progressContainer = document.getElementById('gif-progress-container');
        const progressBar = document.getElementById('gif-progress-bar');
        const progressText = document.getElementById('gif-progress-text');

        exportBtn.disabled = true;
        progressContainer.classList.remove('hidden');
        progressBar.style.width = '0%';
        progressText.textContent = '0%';

        const gif = new GIF({
            workers: 2,
            quality: 10,
            width: this.editor.canvas.width,
            height: this.editor.canvas.height
        });

        const layer = this.editor.layerManager.activeLayer;
        const originalState = this.storeOriginalState(layer);
        const duration = this.properties.duration * 1000;
        const frameDelay = 50; // ms per frame, ~20fps
        const frameCount = duration / frameDelay;

        for (let i = 0; i < frameCount; i++) {
            const progress = i / frameCount;
            const percentage = Math.round((i / frameCount) * 100);
            
            this.applyFrame(layer, this.activeAnimation, progress, originalState);
            this.editor.redraw();
            gif.addFrame(this.editor.ctx, { copy: true, delay: frameDelay });
            
            // Update progress bar
            progressBar.style.width = `${percentage}%`;
            progressText.textContent = `${percentage}%`;
        }

        gif.on('finished', (blob) => {
            progressText.textContent = 'Done!';
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `animation-${this.activeAnimation}.gif`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);

            // Reset UI
            exportBtn.disabled = false;
            progressContainer.classList.add('hidden');
            
            // Restore layer state
            this.restoreOriginalState(layer, originalState);
            this.editor.redraw();
        });

        progressText.textContent = 'Encoding...';
        gif.render();
    }
} 