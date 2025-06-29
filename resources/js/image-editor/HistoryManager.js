export class HistoryManager {
    constructor(editor) {
        this.editor = editor;
        this.history = [];
        this.currentIndex = -1;
        this.maxHistorySize = 20;
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Undo/Redo buttons are handled in the main ImageEditor class
        // This is just for keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'z' && !e.shiftKey) {
                    e.preventDefault();
                    this.undo();
                } else if ((e.key === 'z' && e.shiftKey) || e.key === 'y') {
                    e.preventDefault();
                    this.redo();
                }
            }
        });
    }

    saveState() {
        // Remove any future history if we're not at the end
        if (this.currentIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.currentIndex + 1);
        }

        // Create state snapshot
        const state = {
            canvasData: this.editor.getCurrentCanvasData(),
            layersData: this.editor.layerManager.getLayersData(),
            filtersState: this.editor.tools.filter.getFiltersState(),
            frameState: this.editor.tools.frames ? this.editor.tools.frames.getFrameState() : null,
            timestamp: Date.now()
        };

        this.history.push(state);
        this.currentIndex++;

        // Limit history size
        if (this.history.length > this.maxHistorySize) {
            this.history.shift();
            this.currentIndex--;
        }

        this.updateButtons();
    }

    undo() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.restoreState(this.history[this.currentIndex]);
            this.updateButtons();
        }
    }

    redo() {
        if (this.currentIndex < this.history.length - 1) {
            this.currentIndex++;
            this.restoreState(this.history[this.currentIndex]);
            this.updateButtons();
        }
    }

    restoreState(state) {
        // Restore canvas data
        this.editor.setCanvasData(state.canvasData);
        
        // Restore layers
        this.editor.layerManager.restoreLayersData(state.layersData);
        
        // Restore filters
        this.editor.tools.filter.restoreFiltersState(state.filtersState);

        // Restore frame tool state
        if (state.frameState && this.editor.tools.frames) {
            this.editor.tools.frames.restoreFrameState(state.frameState);
        }
    }

    updateButtons() {
        const undoBtn = document.getElementById('undo-btn');
        const redoBtn = document.getElementById('redo-btn');

        undoBtn.disabled = this.currentIndex <= 0;
        redoBtn.disabled = this.currentIndex >= this.history.length - 1;
    }

    clear() {
        this.history = [];
        this.currentIndex = -1;
        this.updateButtons();
    }
} 