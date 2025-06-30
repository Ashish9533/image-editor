export class HistogramTool {
    constructor(editor) {
        this.editor = editor;
        this.isActive = false;
        this.canvas = null;
        this.ctx = null;
        this.curveCanvas = null;
        this.curveCtx = null;
        this.selectedChannel = 'luminosity';
        this.histograms = null;
        this.listenersAttached = false;
        
        this.curves = this.getDefaultCurves();
        this.activePoint = null;
        this.isDragging = false;
        this.debouncedPreview = this.debounce(() => this.previewCurve(), 50);
        
        // Enhanced histogram management
        this.showRGBOverlay = false;
        this.showClipping = false;
        this.autoLevelsEnabled = false;
        this.shadowsValue = 0;
        this.highlightsValue = 0;
        this.midtonesValue = 1;
        this.exposureValue = 0;
        
        // Advanced professional features
        this.displayMode = 'histogram'; // histogram, waveform, vectorscope, parade
        this.showZoneSystem = false;
        this.showBeforeAfter = false;
        this.originalHistograms = null;
        this.colorTemperature = 6500;
        this.colorTint = 0;
        this.vibrance = 0;
        this.saturation = 0;
        this.selectedColorSpace = 'RGB'; // RGB, LAB, HSV
        this.waveformCanvas = null;
        this.waveformCtx = null;
        this.vectorscopeCanvas = null;
        this.vectorscopeCtx = null;
        this.smoothHistogram = false;
        this.showDominantColors = false;
        this.dominantColors = [];
    }

    getDefaultCurves() {
        const defaultCurve = [{x: 0, y: 255}, {x: 255, y: 0}];
        return {
            luminosity: JSON.parse(JSON.stringify(defaultCurve)),
            red: JSON.parse(JSON.stringify(defaultCurve)),
            green: JSON.parse(JSON.stringify(defaultCurve)),
            blue: JSON.parse(JSON.stringify(defaultCurve))
        };
    }

    activate() {
        this.isActive = true;
        if (!this.listenersAttached) {
            this.canvas = document.getElementById('histogram-canvas');
            this.ctx = this.canvas.getContext('2d');
            this.curveCanvas = document.getElementById('curves-canvas');
            this.curveCtx = this.curveCanvas.getContext('2d');
            this.setupEventListeners();
            this.listenersAttached = true;
        }
        this.recalculate();
    }
    
    deactivate() {
        this.isActive = false;
    }

    setupEventListeners() {
        document.getElementById('histogram-channel-select').addEventListener('change', (e) => this.selectChannel(e.target.value));
        document.getElementById('reset-curves').addEventListener('click', () => this.resetCurve());
        document.getElementById('apply-curves').addEventListener('click', () => this.applyCurveToLayer());
        
        // Enhanced histogram controls
        document.getElementById('auto-levels').addEventListener('click', () => this.autoLevels());
        document.getElementById('auto-contrast').addEventListener('click', () => this.autoContrast());
        document.getElementById('auto-color').addEventListener('click', () => this.autoColor());
        document.getElementById('rgb-overlay').addEventListener('change', (e) => this.toggleRGBOverlay(e.target.checked));
        document.getElementById('show-clipping').addEventListener('change', (e) => this.toggleClipping(e.target.checked));
        
        // Manual adjustment controls with value updates
        document.getElementById('shadows-slider').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            document.getElementById('shadows-value').textContent = value;
            this.adjustShadows(value);
        });
        document.getElementById('highlights-slider').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            document.getElementById('highlights-value').textContent = value;
            this.adjustHighlights(value);
        });
        document.getElementById('midtones-slider').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            document.getElementById('midtones-value').textContent = value.toFixed(1);
            this.adjustMidtones(value);
        });
        document.getElementById('exposure-slider').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            document.getElementById('exposure-value').textContent = value;
            this.adjustExposure(value);
        });
        
        // Curve presets
        document.getElementById('preset-linear').addEventListener('click', () => this.applyCurvePreset('linear'));
        document.getElementById('preset-s-curve').addEventListener('click', () => this.applyCurvePreset('sCurve'));
        document.getElementById('preset-inverse').addEventListener('click', () => this.applyCurvePreset('inverse'));
        document.getElementById('preset-brighten').addEventListener('click', () => this.applyCurvePreset('brighten'));
        
        // Advanced display modes
        document.getElementById('display-mode-select').addEventListener('change', (e) => this.setDisplayMode(e.target.value));
        document.getElementById('color-space-select').addEventListener('change', (e) => this.setColorSpace(e.target.value));
        document.getElementById('smooth-histogram').addEventListener('change', (e) => this.toggleHistogramSmoothing(e.target.checked));
        document.getElementById('show-zone-system').addEventListener('change', (e) => this.toggleZoneSystem(e.target.checked));
        document.getElementById('show-before-after').addEventListener('change', (e) => this.toggleBeforeAfter(e.target.checked));
        document.getElementById('show-dominant-colors').addEventListener('change', (e) => this.toggleDominantColors(e.target.checked));
        
        // Color balance controls
        document.getElementById('temperature-slider').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            document.getElementById('temperature-value').textContent = value + 'K';
            this.adjustColorTemperature(value);
        });
        document.getElementById('tint-slider').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            document.getElementById('tint-value').textContent = value;
            this.adjustColorTint(value);
        });
        document.getElementById('vibrance-slider').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            document.getElementById('vibrance-value').textContent = value;
            this.adjustVibrance(value);
        });
        document.getElementById('saturation-slider').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            document.getElementById('saturation-value').textContent = value;
            this.adjustSaturation(value);
        });
        
        // Advanced tools
        document.getElementById('match-histogram').addEventListener('click', () => this.matchHistogram());
        document.getElementById('analyze-image').addEventListener('click', () => this.analyzeImage());
        document.getElementById('export-histogram').addEventListener('click', () => this.exportHistogramData());
        document.getElementById('save-preset').addEventListener('click', () => this.saveCustomPreset());
        
        this.curveCanvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        document.addEventListener('mouseup', () => this.onMouseUp());
        this.curveCanvas.addEventListener('contextmenu', (e) => this.onRightClick(e));
    }

    selectChannel(channel) {
        this.selectedChannel = channel;
        this.draw();
    }
    
    resetCurve() {
        this.resetAllAdjustments();
    }
    
    onMouseDown(e) {
        const rect = this.curveCanvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width * 255;
        const y = (e.clientY - rect.top) / rect.height * 255;
        
        this.activePoint = this.getPointAt(x, y);

        if (this.activePoint) {
            this.isDragging = true;
        } else {
            this.addPoint(x, 255 - y);
            this.activePoint = this.getPointAt(x,y);
            this.isDragging = true;
        }
    }

    onMouseMove(e) {
        if (!this.isDragging || !this.activePoint) return;
        const rect = this.curveCanvas.getBoundingClientRect();
        let x = (e.clientX - rect.left) / rect.width * 255;
        let y = (e.clientY - rect.top) / rect.height * 255;

        // Clamp to canvas bounds
        x = Math.max(0, Math.min(255, x));
        y = Math.max(0, Math.min(255, y));
        
        // Prevent default points from moving vertically
        const curve = this.curves[this.selectedChannel];
        const isDefaultPoint = (this.activePoint === curve[0] || this.activePoint === curve[curve.length-1]);
        if(isDefaultPoint && (this.activePoint.x === 0 || this.activePoint.x === 255)){
             y = this.activePoint.y;
        }

        this.activePoint.x = x;
        this.activePoint.y = 255 - y;

        this.draw();
        this.debouncedPreview();
    }

    onMouseUp() {
        this.isDragging = false;
        this.activePoint = null;
    }
    
    onRightClick(e) {
        e.preventDefault();
        const rect = this.curveCanvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width * 255;
        const y = (e.clientY - rect.top) / rect.height * 255;
        const point = this.getPointAt(x, y);
        if (point && this.curves[this.selectedChannel].length > 2) {
            this.removePoint(point);
            this.draw();
            this.debouncedPreview();
        }
    }

    getPointAt(x, y) {
        const curve = this.curves[this.selectedChannel];
        for (const p of curve) {
            const canvasX = p.x;
            const canvasY = 255 - p.y;
            const dist = Math.sqrt(Math.pow(x - canvasX, 2) + Math.pow(y - canvasY, 2));
            if (dist < 10) return p;
        }
        return null;
    }
    
    addPoint(x,y) {
        this.curves[this.selectedChannel].push({x,y});
    }

    removePoint(point) {
        const curve = this.curves[this.selectedChannel];
        this.curves[this.selectedChannel] = curve.filter(p => p !== point);
    }
    
    previewCurve() {
        const activeLayer = this.editor.layerManager.activeLayer;
        if (!activeLayer) return;
        activeLayer.curves = JSON.parse(JSON.stringify(this.curves));
        this.editor.layerManager.renderAllLayers();
        delete activeLayer.curves;
    }
    
    applyCurveToLayer() {
        const activeLayer = this.editor.layerManager.activeLayer;
        if (!activeLayer) return;

        const layerCanvas = document.createElement('canvas');
        layerCanvas.width = this.editor.canvas.width;
        layerCanvas.height = this.editor.canvas.height;
        const layerCtx = layerCanvas.getContext('2d');
        
        this.editor.layerManager.drawLayer(activeLayer, layerCtx);

        const imageData = layerCtx.getImageData(0, 0, layerCanvas.width, layerCanvas.height);
        this.applyCurve(imageData.data, this.curves);
        layerCtx.putImageData(imageData, 0, 0);

        activeLayer.data = layerCanvas;
        activeLayer.type = 'frame'; 
        
        this.editor.layerManager.renderAllLayers();
        this.editor.historyManager.saveState();
        this.recalculate();
    }
    
    recalculate() {
        const activeLayer = this.editor.layerManager.activeLayer;
        if (!activeLayer) {
             this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
             return;
        }

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.editor.canvas.width;
        tempCanvas.height = this.editor.canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        this.editor.layerManager.drawLayer(activeLayer, tempCtx);

        const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        this.histograms = this.calculateHistograms(imageData.data);
        this.draw();
    }
    
    calculateHistograms(data) {
        const red = new Array(256).fill(0), green = new Array(256).fill(0), blue = new Array(256).fill(0), luminosity = new Array(256).fill(0);
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i], g = data[i + 1], b = data[i + 2];
            red[r]++; green[g]++; blue[b]++;
            luminosity[Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b)]++;
        }
        return { red, green, blue, luminosity };
    }

    draw() {
        if (!this.canvas) return;
        
        switch (this.displayMode) {
            case 'histogram':
                this.drawHistogram();
                if (this.showZoneSystem) this.drawZoneSystem();
                break;
            case 'waveform':
                this.drawWaveform();
                break;
            case 'vectorscope':
                this.drawVectorscope();
                break;
            case 'parade':
                this.drawRGBParade();
                break;
        }
        
        this.drawCurve();
        
        if (this.showDominantColors && this.dominantColors.length > 0) {
            this.drawDominantColors();
        }
    }

    drawHistogram() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (!this.histograms) return;

        if (this.showRGBOverlay) {
            this.drawRGBOverlay();
        } else {
            // 1. Draw Gradient Background based on actual image colors
            const gradient = this.createImageBasedGradient();
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            // 2. Draw Histogram Bars on top
            const histData = this.histograms[this.selectedChannel];
            const barColor = 'rgba(0, 0, 0, 0.4)'; // Dark, semi-transparent bars for contrast
            
            this.drawSingleHistogram(this.ctx, histData, barColor);
        }
        
        // 3. Draw clipping warnings if enabled
        if (this.showClipping) {
            this.drawClippingWarnings();
        }
        
        this.displayStats(this.histograms[this.selectedChannel]);
    }

    createImageBasedGradient() {
        const activeLayer = this.editor.layerManager.activeLayer;
        if (!activeLayer) {
            // Fallback to default gradient if no active layer
            return this.createDefaultGradient();
        }

        // Get image data from active layer
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.editor.canvas.width;
        tempCanvas.height = this.editor.canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        this.editor.layerManager.drawLayer(activeLayer, tempCtx);
        const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        
        // Sample colors across the histogram range
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, 0);
        const sampledColors = this.sampleColorsFromImage(imageData.data);
        
        // Create gradient stops
        for (let i = 0; i < sampledColors.length; i++) {
            const position = i / (sampledColors.length - 1);
            gradient.addColorStop(position, sampledColors[i]);
        }
        
        return gradient;
    }

    sampleColorsFromImage(data) {
        const samples = 10; // Number of color samples across the gradient
        const colorSamples = [];
        
        // Create bins for sampling
        for (let s = 0; s < samples; s++) {
            const targetValue = Math.floor((s / (samples - 1)) * 255);
            const colors = { r: [], g: [], b: [] };
            
            // Collect pixels that match the target value range for the selected channel
            const tolerance = 15; // Allow some tolerance for finding matching pixels
            
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                
                let channelValue;
                switch (this.selectedChannel) {
                    case 'luminosity':
                        channelValue = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
                        break;
                    case 'red':
                        channelValue = r;
                        break;
                    case 'green':
                        channelValue = g;
                        break;
                    case 'blue':
                        channelValue = b;
                        break;
                }
                
                if (Math.abs(channelValue - targetValue) <= tolerance) {
                    colors.r.push(r);
                    colors.g.push(g);
                    colors.b.push(b);
                }
            }
            
            // Calculate average color for this sample
            if (colors.r.length > 0) {
                const avgR = Math.round(colors.r.reduce((a, b) => a + b, 0) / colors.r.length);
                const avgG = Math.round(colors.g.reduce((a, b) => a + b, 0) / colors.g.length);
                const avgB = Math.round(colors.b.reduce((a, b) => a + b, 0) / colors.b.length);
                colorSamples.push(`rgb(${avgR}, ${avgG}, ${avgB})`);
            } else {
                // Fallback color if no pixels found in this range
                colorSamples.push(this.getFallbackColor(targetValue));
            }
        }
        
        return colorSamples;
    }

    getFallbackColor(value) {
        const normalized = value / 255;
        switch (this.selectedChannel) {
            case 'luminosity':
                return `rgb(${value}, ${value}, ${value})`;
            case 'red':
                return `rgb(${value}, 0, 0)`;
            case 'green':
                return `rgb(0, ${value}, 0)`;
            case 'blue':
                return `rgb(0, 0, ${value})`;
            default:
                return `rgb(${value}, ${value}, ${value})`;
        }
    }

    createDefaultGradient() {
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, 0);
        const colorStops = {
            luminosity: { 0: '#000000', 1: '#FFFFFF' },
            red:        { 0: '#000000', 1: '#FF0000' },
            green:      { 0: '#000000', 1: '#00FF00' },
            blue:       { 0: '#000000', 1: '#0000FF' }
        };
        const stops = colorStops[this.selectedChannel];
        gradient.addColorStop(0, stops[0]);
        gradient.addColorStop(1, stops[1]);
        return gradient;
    }
    
    drawSingleHistogram(ctx, histData, color) {
        const maxVal = Math.max(...histData);
        if (maxVal === 0) return;
        
        const barWidth = ctx.canvas.width / 256;
        ctx.fillStyle = color;

        histData.forEach((val, i) => {
            const barHeight = (val / maxVal) * ctx.canvas.height;
            if (barHeight > 0) {
                ctx.fillRect(i * barWidth, ctx.canvas.height - barHeight, barWidth, barHeight);
            }
        });
    }

    drawCurve() {
        if (!this.curveCtx) return;
        const ctx = this.curveCtx;
        const points = this.curves[this.selectedChannel].sort((a,b) => a.x - b.x);
        const scaleX = ctx.canvas.width / 255;
        const scaleY = ctx.canvas.height / 255;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(points[0].x * scaleX, (255 - points[0].y) * scaleY);
        for(let i=1; i < points.length; i++) {
            ctx.lineTo(points[i].x * scaleX, (255 - points[i].y) * scaleY);
        }
        ctx.stroke();

        ctx.fillStyle = 'white';
        points.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x * scaleX, (255-p.y) * scaleY, 5, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
        });
    }

    generateLookupTable(channel) {
        const points = this.curves[channel].sort((a, b) => a.x - b.x);
        const table = [];
        let pointIndex = 0;
        for(let i=0; i<256; i++) {
            while(pointIndex < points.length - 2 && i > points[pointIndex+1].x) {
                pointIndex++;
            }
            const p1 = points[pointIndex];
            const p2 = points[pointIndex + 1];
            const t = (i - p1.x) / (p2.x - p1.x);
            table[i] = p1.y + (p2.y - p1.y) * t;
        }
        return table;
    }

    applyCurve(data, curves) {
        const lumLut = this.generateLookupTable('luminosity');
        const rLut = this.generateLookupTable('red');
        const gLut = this.generateLookupTable('green');
        const bLut = this.generateLookupTable('blue');

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i], g = data[i+1], b = data[i+2];
            const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            const lumFactor = lumLut[Math.round(lum)] / lum;
            
            data[i] = Math.max(0, Math.min(255, rLut[r] * (lum > 0 ? lumFactor : 1)));
            data[i+1] = Math.max(0, Math.min(255, gLut[g] * (lum > 0 ? lumFactor : 1)));
            data[i+2] = Math.max(0, Math.min(255, bLut[b] * (lum > 0 ? lumFactor : 1)));
        }
    }

    displayStats(histData) {
        let totalPixels = 0;
        let sum = 0;
        for(let i=0; i<256; i++) {
            const count = histData[i];
            totalPixels += count;
            sum += i * count;
        }

        if(totalPixels === 0) {
            // reset stats display
            return;
        };

        const mean = sum / totalPixels;

        let median = 0;
        let pixelsCounted = 0;
        const medianPosition = totalPixels / 2;
        for(let i=0; i<256; i++) {
            pixelsCounted += histData[i];
            if(pixelsCounted >= medianPosition) {
                median = i;
                break;
            }
        }
        
        let sumOfSquares = 0;
        for(let i=0; i<256; i++) {
            sumOfSquares += Math.pow(i - mean, 2) * histData[i];
        }
        const stdDev = Math.sqrt(sumOfSquares / totalPixels);

        document.getElementById('hist-mean').textContent = mean.toFixed(2);
        document.getElementById('hist-median').textContent = median;
        document.getElementById('hist-std-dev').textContent = stdDev.toFixed(2);
        document.getElementById('hist-pixels').textContent = totalPixels.toLocaleString();
    }

    debounce(func, delay) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    }

    // Enhanced Histogram Management Features

    toggleRGBOverlay(enabled) {
        this.showRGBOverlay = enabled;
        this.draw();
    }

    toggleClipping(enabled) {
        this.showClipping = enabled;
        this.draw();
    }

    drawRGBOverlay() {
        // Draw black background
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw RGB channels with transparency
        this.ctx.globalCompositeOperation = 'screen';
        
        this.drawSingleHistogram(this.ctx, this.histograms.red, 'rgba(255, 0, 0, 0.8)');
        this.drawSingleHistogram(this.ctx, this.histograms.green, 'rgba(0, 255, 0, 0.8)');
        this.drawSingleHistogram(this.ctx, this.histograms.blue, 'rgba(0, 0, 255, 0.8)');
        
        this.ctx.globalCompositeOperation = 'source-over';
    }

    drawClippingWarnings() {
        const histData = this.histograms[this.selectedChannel];
        const barWidth = this.canvas.width / 256;
        
        // Highlight clipped shadows (black areas)
        if (histData[0] > 0) {
            this.ctx.fillStyle = 'rgba(0, 0, 255, 0.6)'; // Blue for shadow clipping
            this.ctx.fillRect(0, 0, barWidth * 5, this.canvas.height);
        }
        
        // Highlight clipped highlights (white areas)
        if (histData[255] > 0) {
            this.ctx.fillStyle = 'rgba(255, 0, 0, 0.6)'; // Red for highlight clipping
            this.ctx.fillRect(this.canvas.width - barWidth * 5, 0, barWidth * 5, this.canvas.height);
        }
    }

    autoLevels() {
        const activeLayer = this.editor.layerManager.activeLayer;
        if (!activeLayer) return;

        const histData = this.histograms.luminosity;
        
        // Find shadow and highlight points (1% and 99% of pixels)
        const totalPixels = histData.reduce((sum, val) => sum + val, 0);
        const shadowThreshold = totalPixels * 0.01;
        const highlightThreshold = totalPixels * 0.99;
        
        let shadowPoint = 0, highlightPoint = 255;
        let pixelCount = 0;
        
        // Find shadow point
        for (let i = 0; i < 256; i++) {
            pixelCount += histData[i];
            if (pixelCount >= shadowThreshold) {
                shadowPoint = i;
                break;
            }
        }
        
        // Find highlight point
        pixelCount = 0;
        for (let i = 255; i >= 0; i--) {
            pixelCount += histData[i];
            if (pixelCount >= totalPixels - highlightThreshold) {
                highlightPoint = i;
                break;
            }
        }
        
        // Apply auto levels
        this.curves.luminosity = [
            {x: 0, y: 255 - (shadowPoint / 255) * 255},
            {x: 255, y: 255 - (highlightPoint / 255) * 255}
        ];
        
        this.draw();
        this.debouncedPreview();
    }

    autoContrast() {
        const channel = this.selectedChannel;
        const histData = this.histograms[channel];
        
        // Find min and max values with actual data
        let minVal = 0, maxVal = 255;
        for (let i = 0; i < 256; i++) {
            if (histData[i] > 0) {
                minVal = i;
                break;
            }
        }
        for (let i = 255; i >= 0; i--) {
            if (histData[i] > 0) {
                maxVal = i;
                break;
            }
        }
        
        // Apply contrast stretch
        this.curves[channel] = [
            {x: minVal, y: 255},
            {x: maxVal, y: 0}
        ];
        
        this.draw();
        this.debouncedPreview();
    }

    autoColor() {
        // Simple color balance based on histogram medians
        const channels = ['red', 'green', 'blue'];
        channels.forEach(channel => {
            const histData = this.histograms[channel];
            const totalPixels = histData.reduce((sum, val) => sum + val, 0);
            let pixelCount = 0;
            let median = 128;
            
            for (let i = 0; i < 256; i++) {
                pixelCount += histData[i];
                if (pixelCount >= totalPixels / 2) {
                    median = i;
                    break;
                }
            }
            
            // Adjust curve to center the median at 128
            const offset = 128 - median;
            this.curves[channel] = [
                {x: 0, y: Math.max(0, Math.min(255, 255 + offset))},
                {x: 255, y: Math.max(0, Math.min(255, 0 + offset))}
            ];
        });
        
        this.draw();
        this.debouncedPreview();
    }

    adjustShadows(value) {
        this.shadowsValue = value;
        this.applyTonalAdjustments();
    }

    adjustHighlights(value) {
        this.highlightsValue = value;
        this.applyTonalAdjustments();
    }

    adjustMidtones(value) {
        this.midtonesValue = value;
        this.applyTonalAdjustments();
    }

    adjustExposure(value) {
        this.exposureValue = value;
        this.applyTonalAdjustments();
    }

    applyTonalAdjustments() {
        const channel = this.selectedChannel;
        
        // Create a curve based on shadow/highlight/midtone adjustments
        const curve = [];
        for (let i = 0; i <= 255; i += 32) {
            let y = i;
            
            // Apply exposure (overall brightness)
            y += this.exposureValue * 30;
            
            // Apply shadows (affects darker tones more)
            if (i < 128) {
                const shadowFactor = (128 - i) / 128;
                y += this.shadowsValue * shadowFactor * 30;
            }
            
            // Apply highlights (affects brighter tones more)
            if (i > 128) {
                const highlightFactor = (i - 128) / 127;
                y += this.highlightsValue * highlightFactor * 30;
            }
            
            // Apply midtones (gamma adjustment)
            if (this.midtonesValue !== 1) {
                const normalized = i / 255;
                const gamma = 1 / this.midtonesValue;
                y = Math.pow(normalized, gamma) * 255;
            }
            
            curve.push({x: i, y: Math.max(0, Math.min(255, 255 - y))});
        }
        
        this.curves[channel] = curve;
        this.draw();
        this.debouncedPreview();
    }

    applyCurvePreset(preset) {
        const channel = this.selectedChannel;
        
        switch (preset) {
            case 'linear':
                this.curves[channel] = [{x: 0, y: 255}, {x: 255, y: 0}];
                break;
            case 'sCurve':
                this.curves[channel] = [
                    {x: 0, y: 255},
                    {x: 64, y: 192},
                    {x: 128, y: 128},
                    {x: 192, y: 64},
                    {x: 255, y: 0}
                ];
                break;
            case 'inverse':
                this.curves[channel] = [{x: 0, y: 0}, {x: 255, y: 255}];
                break;
            case 'brighten':
                this.curves[channel] = [
                    {x: 0, y: 255},
                    {x: 128, y: 160},
                    {x: 255, y: 0}
                ];
                break;
        }
        
        this.draw();
        this.debouncedPreview();
    }

    resetAllAdjustments() {
        this.shadowsValue = 0;
        this.highlightsValue = 0;
        this.midtonesValue = 1;
        this.exposureValue = 0;
        
        // Reset UI sliders
        document.getElementById('shadows-slider').value = 0;
        document.getElementById('highlights-slider').value = 0;
        document.getElementById('midtones-slider').value = 1;
        document.getElementById('exposure-slider').value = 0;
        
        this.resetCurve();
    }

    getHistogramInfo() {
        if (!this.histograms) return null;
        
        const info = {};
        ['luminosity', 'red', 'green', 'blue'].forEach(channel => {
            const histData = this.histograms[channel];
            const totalPixels = histData.reduce((sum, val) => sum + val, 0);
            
            // Calculate statistics
            let mean = 0, median = 0, mode = 0, maxCount = 0;
            let pixelCount = 0;
            
            for (let i = 0; i < 256; i++) {
                mean += i * histData[i];
                if (histData[i] > maxCount) {
                    maxCount = histData[i];
                    mode = i;
                }
                pixelCount += histData[i];
                if (pixelCount >= totalPixels / 2 && median === 0) {
                    median = i;
                }
            }
            
            mean = totalPixels > 0 ? mean / totalPixels : 0;
            
            info[channel] = {
                mean: mean.toFixed(2),
                median,
                mode,
                totalPixels
            };
        });
        
        return info;
    }

    // Advanced Professional Features

    setDisplayMode(mode) {
        this.displayMode = mode;
        this.initializeAdditionalCanvases();
        this.draw();
    }

    setColorSpace(space) {
        this.selectedColorSpace = space;
        this.recalculate();
    }

    initializeAdditionalCanvases() {
        if (this.displayMode === 'waveform' && !this.waveformCanvas) {
            this.waveformCanvas = document.getElementById('waveform-canvas');
            this.waveformCtx = this.waveformCanvas.getContext('2d');
        }
        if (this.displayMode === 'vectorscope' && !this.vectorscopeCanvas) {
            this.vectorscopeCanvas = document.getElementById('vectorscope-canvas');
            this.vectorscopeCtx = this.vectorscopeCanvas.getContext('2d');
        }
    }

    toggleHistogramSmoothing(enabled) {
        this.smoothHistogram = enabled;
        this.draw();
    }

    toggleZoneSystem(enabled) {
        this.showZoneSystem = enabled;
        this.draw();
    }

    toggleBeforeAfter(enabled) {
        this.showBeforeAfter = enabled;
        if (enabled && !this.originalHistograms) {
            this.saveOriginalHistograms();
        }
        this.draw();
    }

    toggleDominantColors(enabled) {
        this.showDominantColors = enabled;
        if (enabled) {
            this.calculateDominantColors();
        }
        this.draw();
    }

    saveOriginalHistograms() {
        this.originalHistograms = JSON.parse(JSON.stringify(this.histograms));
    }

    drawWaveform() {
        if (!this.waveformCtx) return;
        
        const activeLayer = this.editor.layerManager.activeLayer;
        if (!activeLayer) return;

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.editor.canvas.width;
        tempCanvas.height = this.editor.canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        this.editor.layerManager.drawLayer(activeLayer, tempCtx);
        const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);

        this.waveformCtx.clearRect(0, 0, this.waveformCanvas.width, this.waveformCanvas.height);
        
        // Draw waveform display
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        const scaleX = this.waveformCanvas.width / width;
        const scaleY = this.waveformCanvas.height / 255;

        for (let y = 0; y < height; y += 2) {
            for (let x = 0; x < width; x += 2) {
                const i = (y * width + x) * 4;
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                
                const plotX = x * scaleX;
                const plotY = this.waveformCanvas.height - (luma * scaleY);
                
                this.waveformCtx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.3)`;
                this.waveformCtx.fillRect(plotX, plotY, 1, 1);
            }
        }
    }

    drawVectorscope() {
        if (!this.vectorscopeCtx) return;
        
        const activeLayer = this.editor.layerManager.activeLayer;
        if (!activeLayer) return;

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.editor.canvas.width;
        tempCanvas.height = this.editor.canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        this.editor.layerManager.drawLayer(activeLayer, tempCtx);
        const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);

        this.vectorscopeCtx.clearRect(0, 0, this.vectorscopeCanvas.width, this.vectorscopeCanvas.height);
        
        // Draw vectorscope background
        const centerX = this.vectorscopeCanvas.width / 2;
        const centerY = this.vectorscopeCanvas.height / 2;
        const radius = Math.min(centerX, centerY) - 20;

        // Draw circular graticule
        this.vectorscopeCtx.strokeStyle = '#333';
        this.vectorscopeCtx.beginPath();
        this.vectorscopeCtx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        this.vectorscopeCtx.stroke();

        // Plot color vectors
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 16) { // Sample every 4th pixel for performance
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Convert RGB to UV coordinates
            const u = (b - (0.299 * r + 0.587 * g + 0.114 * b)) * 0.492;
            const v = (r - (0.299 * r + 0.587 * g + 0.114 * b)) * 0.877;
            
            const plotX = centerX + (u * radius / 128);
            const plotY = centerY - (v * radius / 128);
            
            this.vectorscopeCtx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.1)`;
            this.vectorscopeCtx.fillRect(plotX, plotY, 1, 1);
        }
    }

    drawZoneSystem() {
        if (!this.showZoneSystem) return;
        
        // Draw Ansel Adams zone system overlay
        const zoneHeight = 15;
        this.ctx.save();
        this.ctx.globalAlpha = 0.7;
        
        for (let zone = 0; zone <= 10; zone++) {
            const x = (zone / 10) * this.canvas.width;
            const width = this.canvas.width / 10;
            const brightness = zone * 25.5; // 0-255 range
            
            this.ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
            this.ctx.fillRect(x, this.canvas.height - zoneHeight, width, zoneHeight);
            
            // Zone numbers
            this.ctx.fillStyle = zone < 5 ? 'white' : 'black';
            this.ctx.font = '10px monospace';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(zone.toString(), x + width/2, this.canvas.height - 5);
        }
        
        this.ctx.restore();
    }

    adjustColorTemperature(kelvin) {
        this.colorTemperature = kelvin;
        this.applyColorBalance();
    }

    adjustColorTint(tint) {
        this.colorTint = tint;
        this.applyColorBalance();
    }

    adjustVibrance(vibrance) {
        this.vibrance = vibrance;
        this.applyColorEnhancement();
    }

    adjustSaturation(saturation) {
        this.saturation = saturation;
        this.applyColorEnhancement();
    }

    applyColorBalance() {
        // Convert temperature to RGB multipliers
        const temp = this.colorTemperature;
        let r, g, b;
        
        if (temp <= 6600) {
            r = 255;
            g = 99.4708025861 * Math.log(temp / 100) - 161.1195681661;
            b = temp >= 2000 ? 138.5177312231 * Math.log(temp / 100 - 10) - 305.0447927307 : 0;
        } else {
            r = 329.698727446 * Math.pow(temp / 100 - 60, -0.1332047592);
            g = 288.1221695283 * Math.pow(temp / 100 - 60, -0.0755148492);
            b = 255;
        }
        
        // Normalize to 0-2 range
        const rMult = Math.max(0, Math.min(2, r / 255));
        const gMult = Math.max(0, Math.min(2, g / 255));
        const bMult = Math.max(0, Math.min(2, b / 255));
        
        // Apply tint (green-magenta axis)
        const tintFactor = this.colorTint / 100;
        const gTint = 1 + tintFactor;
        const mTint = 1 - tintFactor;
        
        // Update curves for color balance
        this.curves.red = this.createBalanceCurve(rMult * mTint);
        this.curves.green = this.createBalanceCurve(gMult * gTint);
        this.curves.blue = this.createBalanceCurve(bMult * mTint);
        
        this.draw();
        this.debouncedPreview();
    }

    createBalanceCurve(multiplier) {
        const curve = [];
        for (let i = 0; i <= 255; i += 32) {
            const output = Math.max(0, Math.min(255, i * multiplier));
            curve.push({x: i, y: 255 - output});
        }
        return curve;
    }

    applyColorEnhancement() {
        // Apply vibrance and saturation adjustments
        const activeLayer = this.editor.layerManager.activeLayer;
        if (!activeLayer) return;
        
        // Vibrance affects less saturated colors more
        // Saturation affects all colors equally
        
        this.debouncedPreview();
    }

    calculateDominantColors() {
        const activeLayer = this.editor.layerManager.activeLayer;
        if (!activeLayer) return;

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.editor.canvas.width;
        tempCanvas.height = this.editor.canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        this.editor.layerManager.drawLayer(activeLayer, tempCtx);
        const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);

        // Use k-means clustering to find dominant colors
        this.dominantColors = this.kMeansColors(imageData.data, 5);
    }

    kMeansColors(data, k) {
        // Simplified k-means for color clustering
        const pixels = [];
        for (let i = 0; i < data.length; i += 16) { // Sample every 4th pixel
            pixels.push([data[i], data[i + 1], data[i + 2]]);
        }
        
        // Initialize centroids randomly
        const centroids = [];
        for (let i = 0; i < k; i++) {
            const randomPixel = pixels[Math.floor(Math.random() * pixels.length)];
            centroids.push([...randomPixel]);
        }
        
        // Iterate k-means
        for (let iter = 0; iter < 10; iter++) {
            const clusters = Array(k).fill().map(() => []);
            
            // Assign pixels to nearest centroid
            pixels.forEach(pixel => {
                let minDist = Infinity;
                let nearestCluster = 0;
                
                centroids.forEach((centroid, i) => {
                    const dist = Math.sqrt(
                        Math.pow(pixel[0] - centroid[0], 2) +
                        Math.pow(pixel[1] - centroid[1], 2) +
                        Math.pow(pixel[2] - centroid[2], 2)
                    );
                    if (dist < minDist) {
                        minDist = dist;
                        nearestCluster = i;
                    }
                });
                
                clusters[nearestCluster].push(pixel);
            });
            
            // Update centroids
            clusters.forEach((cluster, i) => {
                if (cluster.length > 0) {
                    centroids[i] = [
                        Math.round(cluster.reduce((sum, p) => sum + p[0], 0) / cluster.length),
                        Math.round(cluster.reduce((sum, p) => sum + p[1], 0) / cluster.length),
                        Math.round(cluster.reduce((sum, p) => sum + p[2], 0) / cluster.length)
                    ];
                }
            });
        }
        
        return centroids.map(c => ({r: c[0], g: c[1], b: c[2]}));
    }

    matchHistogram() {
        // Histogram matching functionality
        alert('Histogram matching feature - would match current image histogram to a reference image');
    }

    analyzeImage() {
        // Advanced image analysis
        const info = this.getAdvancedAnalysis();
        this.displayAnalysisResults(info);
    }

    getAdvancedAnalysis() {
        if (!this.histograms) return null;
        
        const analysis = {};
        
        // Calculate additional statistics
        ['luminosity', 'red', 'green', 'blue'].forEach(channel => {
            const histData = this.histograms[channel];
            const totalPixels = histData.reduce((sum, val) => sum + val, 0);
            
            // Calculate skewness and kurtosis
            let mean = 0, variance = 0, skewness = 0, kurtosis = 0;
            
            for (let i = 0; i < 256; i++) {
                mean += i * histData[i];
            }
            mean /= totalPixels;
            
            for (let i = 0; i < 256; i++) {
                const diff = i - mean;
                const weight = histData[i] / totalPixels;
                variance += weight * diff * diff;
                skewness += weight * diff * diff * diff;
                kurtosis += weight * diff * diff * diff * diff;
            }
            
            const stdDev = Math.sqrt(variance);
            skewness /= Math.pow(stdDev, 3);
            kurtosis = kurtosis / Math.pow(stdDev, 4) - 3;
            
            // Calculate entropy
            let entropy = 0;
            for (let i = 0; i < 256; i++) {
                const p = histData[i] / totalPixels;
                if (p > 0) entropy -= p * Math.log2(p);
            }
            
            analysis[channel] = {
                mean: mean.toFixed(2),
                variance: variance.toFixed(2),
                skewness: skewness.toFixed(3),
                kurtosis: kurtosis.toFixed(3),
                entropy: entropy.toFixed(3)
            };
        });
        
        return analysis;
    }

    displayAnalysisResults(analysis) {
        let result = 'Advanced Image Analysis:\n\n';
        
        Object.keys(analysis).forEach(channel => {
            const stats = analysis[channel];
            result += `${channel.toUpperCase()} Channel:\n`;
            result += `  Mean: ${stats.mean}\n`;
            result += `  Variance: ${stats.variance}\n`;
            result += `  Skewness: ${stats.skewness}\n`;
            result += `  Kurtosis: ${stats.kurtosis}\n`;
            result += `  Entropy: ${stats.entropy}\n\n`;
        });
        
        alert(result);
    }

    exportHistogramData() {
        if (!this.histograms) return;
        
        const data = {
            histograms: this.histograms,
            curves: this.curves,
            settings: {
                shadowsValue: this.shadowsValue,
                highlightsValue: this.highlightsValue,
                midtonesValue: this.midtonesValue,
                exposureValue: this.exposureValue,
                colorTemperature: this.colorTemperature,
                colorTint: this.colorTint,
                vibrance: this.vibrance,
                saturation: this.saturation
            }
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'histogram_data.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    saveCustomPreset() {
        const presetName = prompt('Enter preset name:');
        if (!presetName) return;
        
        const preset = {
            curves: JSON.parse(JSON.stringify(this.curves)),
            shadowsValue: this.shadowsValue,
            highlightsValue: this.highlightsValue,
            midtonesValue: this.midtonesValue,
            exposureValue: this.exposureValue,
            colorTemperature: this.colorTemperature,
            colorTint: this.colorTint,
            vibrance: this.vibrance,
            saturation: this.saturation
        };
        
        localStorage.setItem(`histogram_preset_${presetName}`, JSON.stringify(preset));
        alert(`Preset "${presetName}" saved!`);
    }

    drawRGBParade() {
        // RGB Parade display (professional video style)
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (!this.histograms) return;
        
        const sectionWidth = this.canvas.width / 3;
        
        // Draw R, G, B histograms side by side
        this.ctx.save();
        
        // Red section
        this.ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        this.ctx.fillRect(0, 0, sectionWidth, this.canvas.height);
        this.drawSingleHistogramInRegion(this.ctx, this.histograms.red, 0, 0, sectionWidth, this.canvas.height, 'rgba(255, 0, 0, 0.8)');
        
        // Green section
        this.ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
        this.ctx.fillRect(sectionWidth, 0, sectionWidth, this.canvas.height);
        this.drawSingleHistogramInRegion(this.ctx, this.histograms.green, sectionWidth, 0, sectionWidth, this.canvas.height, 'rgba(0, 255, 0, 0.8)');
        
        // Blue section
        this.ctx.fillStyle = 'rgba(0, 0, 255, 0.3)';
        this.ctx.fillRect(sectionWidth * 2, 0, sectionWidth, this.canvas.height);
        this.drawSingleHistogramInRegion(this.ctx, this.histograms.blue, sectionWidth * 2, 0, sectionWidth, this.canvas.height, 'rgba(0, 0, 255, 0.8)');
        
        this.ctx.restore();
    }

    drawSingleHistogramInRegion(ctx, histData, x, y, width, height, color) {
        const maxVal = Math.max(...histData);
        if (maxVal === 0) return;
        
        const barWidth = width / 256;
        ctx.fillStyle = color;

        histData.forEach((val, i) => {
            const barHeight = (val / maxVal) * height;
            if (barHeight > 0) {
                ctx.fillRect(x + i * barWidth, y + height - barHeight, barWidth, barHeight);
            }
        });
    }

    drawDominantColors() {
        if (!this.dominantColors.length) return;
        
        const colorSize = 20;
        const spacing = 5;
        let x = 10;
        const y = 10;
        
        this.ctx.save();
        
        this.dominantColors.forEach((color, i) => {
            this.ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
            this.ctx.fillRect(x, y, colorSize, colorSize);
            
            // Color border
            this.ctx.strokeStyle = '#333';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(x, y, colorSize, colorSize);
            
            x += colorSize + spacing;
        });
        
        this.ctx.restore();
    }
} 