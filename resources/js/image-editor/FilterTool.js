export class FilterTool {
    constructor(editor) {
        this.editor = editor;
        this.filters = {
            brightness: 100,
            contrast: 100,
            saturation: 100,
            blur: 0,
            hue: 0
        };
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Filter sliders
        const filterControls = {
            brightness: document.getElementById('brightness'),
            contrast: document.getElementById('contrast'),
            saturation: document.getElementById('saturation'),
            blur: document.getElementById('blur'),
            hue: document.getElementById('hue')
        };

        const filterValues = {
            brightness: document.getElementById('brightness-value'),
            contrast: document.getElementById('contrast-value'),
            saturation: document.getElementById('saturation-value'),
            blur: document.getElementById('blur-value'),
            hue: document.getElementById('hue-value')
        };

        // Setup slider event listeners
        Object.keys(filterControls).forEach(filterName => {
            const slider = filterControls[filterName];
            const valueDisplay = filterValues[filterName];
            
            slider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                this.filters[filterName] = value;
                
                // Update display
                let displayValue = value;
                let unit = '';
                
                switch (filterName) {
                    case 'brightness':
                    case 'contrast':
                    case 'saturation':
                        unit = '%';
                        break;
                    case 'blur':
                        unit = 'px';
                        break;
                    case 'hue':
                        unit = '°';
                        break;
                }
                
                valueDisplay.textContent = displayValue + unit;
                this.applyFilters();
            });
        });

        // Filter presets
        const filterPresets = document.querySelectorAll('.filter-preset');
        filterPresets.forEach(preset => {
            preset.addEventListener('click', () => this.applyPreset(preset.dataset.filter));
        });
    }

    applyFilters() {
        if (!this.editor.currentImage) return;

        // Build CSS filter string
        const filterString = this.buildFilterString();
        
        // Apply filters using CSS (for real-time preview)
        this.editor.canvas.style.filter = filterString;
    }

    buildFilterString() {
        const filters = [];
        
        if (this.filters.brightness !== 100) {
            filters.push(`brightness(${this.filters.brightness}%)`);
        }
        
        if (this.filters.contrast !== 100) {
            filters.push(`contrast(${this.filters.contrast}%)`);
        }
        
        if (this.filters.saturation !== 100) {
            filters.push(`saturate(${this.filters.saturation}%)`);
        }
        
        if (this.filters.blur > 0) {
            filters.push(`blur(${this.filters.blur}px)`);
        }
        
        if (this.filters.hue !== 0) {
            filters.push(`hue-rotate(${this.filters.hue}deg)`);
        }
        
        return filters.join(' ');
    }

    applyPreset(presetName) {
        switch (presetName) {
            case 'grayscale':
                this.setFilters({ brightness: 100, contrast: 120, saturation: 0, blur: 0, hue: 0 });
                break;
            case 'sepia':
                this.setFilters({ brightness: 110, contrast: 110, saturation: 80, blur: 0, hue: 20 });
                this.editor.canvas.style.filter += ' sepia(100%)';
                break;
            case 'vintage':
                this.setFilters({ brightness: 90, contrast: 130, saturation: 70, blur: 1, hue: 10 });
                break;
            case 'reset':
                this.reset();
                return;
        }
        
        this.updateSliders();
        this.applyFilters();
        this.editor.historyManager.saveState();
    }

    setFilters(newFilters) {
        Object.assign(this.filters, newFilters);
    }

    updateSliders() {
        document.getElementById('brightness').value = this.filters.brightness;
        document.getElementById('brightness-value').textContent = this.filters.brightness + '%';
        
        document.getElementById('contrast').value = this.filters.contrast;
        document.getElementById('contrast-value').textContent = this.filters.contrast + '%';
        
        document.getElementById('saturation').value = this.filters.saturation;
        document.getElementById('saturation-value').textContent = this.filters.saturation + '%';
        
        document.getElementById('blur').value = this.filters.blur;
        document.getElementById('blur-value').textContent = this.filters.blur + 'px';
        
        document.getElementById('hue').value = this.filters.hue;
        document.getElementById('hue-value').textContent = this.filters.hue + '°';
    }

    reset() {
        this.filters = {
            brightness: 100,
            contrast: 100,
            saturation: 100,
            blur: 0,
            hue: 0
        };
        
        this.updateSliders();
        this.editor.canvas.style.filter = '';
        this.editor.historyManager.saveState();
    }

    // Apply filters permanently to canvas data
    applyFiltersToCanvas() {
        if (!this.editor.currentImage) return;
        
        // Create temporary canvas for filter application
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        tempCanvas.width = this.editor.canvas.width;
        tempCanvas.height = this.editor.canvas.height;
        
        // Apply CSS filters to temporary canvas
        tempCtx.filter = this.buildFilterString();
        tempCtx.drawImage(this.editor.currentImage, 0, 0);
        
        // Copy filtered image back to main canvas
        this.editor.ctx.clearRect(0, 0, this.editor.canvas.width, this.editor.canvas.height);
        this.editor.ctx.drawImage(tempCanvas, 0, 0);
        
        // Reset CSS filters since they're now applied to the canvas data
        this.editor.canvas.style.filter = '';
        
        // Create new image from filtered canvas
        const filteredImage = new Image();
        filteredImage.onload = () => {
            this.editor.currentImage = filteredImage;
        };
        filteredImage.src = this.editor.canvas.toDataURL();
    }

    getFiltersState() {
        return { ...this.filters };
    }

    restoreFiltersState(filtersState) {
        this.filters = { ...filtersState };
        this.updateSliders();
        this.applyFilters();
    }
} 