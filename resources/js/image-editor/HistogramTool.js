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
        this.curves[this.selectedChannel] = [{x: 0, y: 255}, {x: 255, y: 0}];
        this.draw();
        this.debouncedPreview();
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
        this.drawHistogram();
        this.drawCurve();
    }

    drawHistogram() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (!this.histograms) return;

        // 1. Draw Gradient Background
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
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 2. Draw Histogram Bars on top
        const histData = this.histograms[this.selectedChannel];
        const barColor = 'rgba(0, 0, 0, 0.4)'; // Dark, semi-transparent bars for contrast
        
        this.drawSingleHistogram(this.ctx, histData, barColor);
        this.displayStats(histData);
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
} 