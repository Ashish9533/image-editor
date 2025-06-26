export class ModalController {
    constructor() {
        this.activeTab = 'crop';
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Tool tab switching
        const toolTabs = document.querySelectorAll('.tool-tab');
        toolTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const toolName = tab.dataset.tool;
                this.switchTab(toolName);
            });
        });

        // Close modal buttons
        const closeButtons = document.querySelectorAll('#close-modal, #close-modal-footer');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', this.closeModal);
        });

        // Download button
        const downloadBtn = document.getElementById('download-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', this.downloadImage);
        }

        // Zoom controls
        const zoomButtons = document.querySelectorAll('.zoom-btn');
        zoomButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const zoomType = e.currentTarget.dataset.zoom;
                this.handleZoom(zoomType);
            });
        });
    }

    switchTab(toolName) {
        // Update active tab
        document.querySelectorAll('.tool-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tool="${toolName}"]`).classList.add('active');

        // Show corresponding content
        document.querySelectorAll('.tool-panel-content').forEach(content => {
            content.classList.add('hidden');
        });
        document.getElementById(`tool-${toolName}`).classList.remove('hidden');

        this.activeTab = toolName;
    }

    closeModal() {
        const modal = document.getElementById('image-editor-modal');
        modal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    }

    downloadImage() {
        const canvas = document.getElementById('main-canvas');
        if (canvas && !canvas.classList.contains('hidden')) {
            const link = document.createElement('a');
            link.download = `edited-image-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png', 1.0);
            link.click();
        }
    }

    handleZoom(zoomType) {
        const canvas = document.getElementById('main-canvas');
        const zoomDisplay = document.getElementById('canvas-zoom');
        
        if (!canvas || canvas.classList.contains('hidden')) return;

        const currentScale = parseFloat(canvas.style.transform?.match(/scale\(([^)]+)\)/)?.[1] || '1');
        let newScale = currentScale;

        switch (zoomType) {
            case 'in':
                newScale = Math.min(currentScale * 1.2, 3);
                break;
            case 'out':
                newScale = Math.max(currentScale * 0.8, 0.1);
                break;
            case 'fit':
                newScale = 1;
                break;
        }

        canvas.style.transform = `scale(${newScale})`;
        canvas.style.transformOrigin = 'center';
        
        if (zoomDisplay) {
            zoomDisplay.textContent = `${Math.round(newScale * 100)}%`;
        }
    }

    updateImageInfo(imageData) {
        const imageInfo = document.getElementById('image-info');
        const dimensions = document.getElementById('image-dimensions');
        const size = document.getElementById('image-size');
        const format = document.getElementById('image-format');

        if (imageData && imageInfo) {
            imageInfo.classList.remove('hidden');
            
            if (dimensions) {
                dimensions.textContent = `${imageData.width} × ${imageData.height}`;
            }
            
            if (size && imageData.fileSize) {
                size.textContent = this.formatFileSize(imageData.fileSize);
            }
            
            if (format && imageData.format) {
                format.textContent = imageData.format.toUpperCase();
            }
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    enableControls() {
        const downloadBtn = document.getElementById('download-btn');
        if (downloadBtn) {
            downloadBtn.disabled = false;
        }
    }

    disableControls() {
        const downloadBtn = document.getElementById('download-btn');
        if (downloadBtn) {
            downloadBtn.disabled = true;
        }
    }
}

// Make it globally available
window.ModalController = ModalController; 