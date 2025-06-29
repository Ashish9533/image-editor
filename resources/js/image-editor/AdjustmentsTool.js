export class AdjustmentsTool {
    constructor(editor) {
        this.editor = editor;
        this.isActive = false;
        this.values = {
            brightness: 100,
            contrast: 100,
            saturate: 100,
            'hue-rotate': 0,
            sepia: 0,
        };
    }

    setupEventListeners() {
        const sliders = {
            brightness: document.getElementById('adjustment-brightness'),
            contrast: document.getElementById('adjustment-contrast'),
            saturate: document.getElementById('adjustment-saturation'),
            'hue-rotate': document.getElementById('adjustment-hue'),
            sepia: document.getElementById('adjustment-sepia'),
        };

        Object.keys(sliders).forEach(filter => {
            if (sliders[filter]) {
                sliders[filter].addEventListener('input', (e) => {
                    this.values[filter] = parseInt(e.target.value, 10);
                    this.updateValueDisplay(filter, e.target.value);
                    this.applyFilters();
                });
            }
        });

        document.getElementById('adjustments-reset').addEventListener('click', () => this.reset());
        document.getElementById('adjustments-close').addEventListener('click', () => this.cancel());
        document.getElementById('adjustments-apply').addEventListener('click', () => this.applyAndClose());
    }
    
    activate() {
        this.isActive = true;
        this.originalFilters = this.editor.layerManager.activeLayer?.filters || { ...this.values };
        this.setupEventListeners();
    }

    deactivate() {
        this.isActive = false;
        // Revert to original filters if not applied
        if (this.editor.layerManager.activeLayer) {
             this.editor.layerManager.activeLayer.filters = this.originalFilters;
        }
        this.editor.redraw();
    }

    applyFilters() {
        const layer = this.editor.layerManager.activeLayer;
        if (!layer) return;

        layer.filters = { ...this.values };
        this.editor.redraw();
    }

    updateValueDisplay(filter, value) {
        let displayValue = value;
        let unit = '%';
        if (filter === 'hue-rotate') unit = '°';
        
        const el = document.getElementById(`${filter.replace('-rotate', '')}-value`);
        if (el) el.textContent = `${displayValue}${unit}`;
    }
    
    reset() {
        this.values = { brightness: 100, contrast: 100, saturate: 100, 'hue-rotate': 0, sepia: 0 };
        Object.keys(this.values).forEach(filter => {
            const slider = document.getElementById(`adjustment-${filter}`);
            if (slider) slider.value = this.values[filter];
            this.updateValueDisplay(filter, this.values[filter]);
        });
        this.applyFilters();
    }

    cancel() {
        this.deactivate();
        this.editor.setActiveTool('none');
    }

    applyAndClose() {
        const layer = this.editor.layerManager.activeLayer;
        if (layer) {
            layer.filters = { ...this.values };
            this.editor.historyManager.saveState();
        }
        this.editor.setActiveTool('none');
    }
} 