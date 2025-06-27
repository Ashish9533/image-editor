<div class="tool-panel" id="shapes-panel">
    <h3 class="font-semibold text-gray-800 mb-3 flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
        Shapes & Drawing
    </h3>

    <div class="space-y-4">
        <!-- Mode Selection -->
        <div>
            <label class="block text-xs font-medium text-gray-600 mb-2">Mode</label>
            <div class="grid grid-cols-2 gap-2">
                <button id="draw-mode-btn" class="mode-btn px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors">
                    ✏️ Draw
                </button>
                <button id="select-mode-btn" class="mode-btn px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                    👆 Select
                </button>
            </div>
        </div>

        <!-- Drawing Tools (shown in draw mode) -->
        <div id="drawing-tools">
            <label class="block text-xs font-medium text-gray-600 mb-2">Shape Tools</label>
            <div class="grid grid-cols-3 gap-2 mb-3">
                <!-- Basic Shapes -->
                <button class="drawing-tool-btn flex flex-col items-center justify-center p-2 bg-gray-100 hover:bg-purple-100 border border-gray-200 rounded-lg transition-colors" data-tool="rectangle">
                    <svg class="w-6 h-6 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="14" rx="2" ry="2"></rect></svg>
                    <span class="text-xs mt-1">Rectangle</span>
                </button>
                <button class="drawing-tool-btn flex flex-col items-center justify-center p-2 bg-gray-100 hover:bg-purple-100 border border-gray-200 rounded-lg transition-colors" data-tool="ellipse">
                    <svg class="w-6 h-6 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="12" cy="12" rx="10" ry="7"></ellipse></svg>
                    <span class="text-xs mt-1">Circle</span>
                </button>
                <button class="drawing-tool-btn flex flex-col items-center justify-center p-2 bg-gray-100 hover:bg-purple-100 border border-gray-200 rounded-lg transition-colors" data-tool="triangle">
                    <svg class="w-6 h-6 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2 L22 20 L2 20 Z"></path></svg>
                    <span class="text-xs mt-1">Triangle</span>
                </button>
                <button class="drawing-tool-btn flex flex-col items-center justify-center p-2 bg-gray-100 hover:bg-purple-100 border border-gray-200 rounded-lg transition-colors" data-tool="line">
                    <svg class="w-6 h-6 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="19" x2="19" y2="5"></line></svg>
                    <span class="text-xs mt-1">Line</span>
                </button>
                <button class="drawing-tool-btn flex flex-col items-center justify-center p-2 bg-gray-100 hover:bg-purple-100 border border-gray-200 rounded-lg transition-colors" data-tool="arrow">
                    <svg class="w-6 h-6 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7l7 7-7 7"></path></svg>
                    <span class="text-xs mt-1">Arrow</span>
                </button>
                <button class="drawing-tool-btn flex flex-col items-center justify-center p-2 bg-gray-100 hover:bg-purple-100 border border-gray-200 rounded-lg transition-colors" data-tool="star">
                    <svg class="w-6 h-6 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon></svg>
                    <span class="text-xs mt-1">Star</span>
                </button>
                <button class="drawing-tool-btn flex flex-col items-center justify-center p-2 bg-gray-100 hover:bg-purple-100 border border-gray-200 rounded-lg transition-colors" data-tool="polygon">
                    <svg class="w-6 h-6 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12,2 22,8.5 19,19 5,19 2,8.5"></polygon></svg>
                    <span class="text-xs mt-1">Pentagon</span>
                </button>
                <button class="drawing-tool-btn flex flex-col items-center justify-center p-2 bg-gray-100 hover:bg-purple-100 border border-gray-200 rounded-lg transition-colors" data-tool="heart">
                    <svg class="w-6 h-6 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    <span class="text-xs mt-1">Heart</span>
                </button>
                <button class="drawing-tool-btn flex flex-col items-center justify-center p-2 bg-gray-100 hover:bg-purple-100 border border-gray-200 rounded-lg transition-colors" data-tool="drawing">
                    <svg class="w-6 h-6 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20l9-9-4-4-9 9v4h4z"></path><path d="M16.5 3.5l4 4"></path></svg>
                    <span class="text-xs mt-1">Freehand</span>
                </button>
            </div>
            <p id="shape-instructions" class="text-xs text-gray-500 mt-2 hidden">Click and drag on the canvas to draw.</p>
        </div>

        <!-- Shape Management (shown in select mode) -->
        <div id="shape-management" class="hidden">
            <label class="block text-xs font-medium text-gray-600 mb-2">Shape Management</label>
            <div id="shapes-list" class="space-y-2 max-h-40 overflow-y-auto">
                <div class="text-xs text-gray-500 text-center py-4">No shapes added yet</div>
            </div>
            <div id="selection-actions" class="hidden mt-3 space-y-2">
                <button id="delete-selected-shape" class="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                    🗑️ Delete Selected
                </button>
                <button id="duplicate-selected-shape" class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                    📋 Duplicate Selected
                </button>
            </div>
        </div>

        <!-- Shape Properties -->
        <div id="shape-properties" class="space-y-4 pt-4 border-t hidden">
            <h4 id="properties-title" class="text-xs font-semibold text-gray-700">Shape Properties</h4>
            
            <!-- Fill Options -->
            <div id="fill-options" class="space-y-3">
                <div class="flex items-center justify-between">
                    <label class="flex items-center space-x-2">
                        <input type="checkbox" id="shape-fill-enable" class="rounded text-purple-500 focus:ring-purple-500" checked>
                        <span class="text-sm text-gray-600">Fill Shape</span>
                    </label>
                    <select id="fill-type" class="text-xs border border-gray-300 rounded px-2 py-1">
                        <option value="solid">Solid</option>
                        <option value="gradient">Gradient</option>
                        <option value="pattern">Pattern</option>
                    </select>
                </div>
                
                <!-- Solid Fill -->
                <div id="solid-fill" class="grid grid-cols-2 gap-2">
                    <input type="color" id="shape-fill-color" value="#4F46E5" class="w-full h-8 border border-gray-300 rounded">
                    <div>
                        <input type="range" id="fill-opacity" min="0" max="100" value="100" class="w-full">
                        <span id="fill-opacity-value" class="text-xs text-gray-600">100%</span>
                    </div>
                </div>

                <!-- Gradient Fill -->
                <div id="gradient-fill" class="hidden space-y-2">
                    <div class="grid grid-cols-2 gap-2">
                        <input type="color" id="gradient-color1" value="#4F46E5" class="w-full h-8 border border-gray-300 rounded">
                        <input type="color" id="gradient-color2" value="#EC4899" class="w-full h-8 border border-gray-300 rounded">
                    </div>
                    <select id="gradient-direction" class="w-full text-xs border border-gray-300 rounded px-2 py-1">
                        <option value="horizontal">Horizontal</option>
                        <option value="vertical">Vertical</option>
                        <option value="diagonal">Diagonal</option>
                        <option value="radial">Radial</option>
                    </select>
                </div>

                <!-- Pattern Fill -->
                <div id="pattern-fill" class="hidden">
                    <select id="pattern-type" class="w-full text-xs border border-gray-300 rounded px-2 py-1">
                        <option value="dots">Dots</option>
                        <option value="stripes">Stripes</option>
                        <option value="grid">Grid</option>
                        <option value="checkerboard">Checkerboard</option>
                    </select>
                </div>
            </div>

            <!-- Stroke Options -->
            <div class="space-y-3">
                <label id="stroke-brush-label" class="block text-xs font-medium text-gray-600">Outline</label>
                <div class="grid grid-cols-2 gap-2">
                    <input type="color" id="shape-stroke-color" value="#000000" class="w-full h-8 border border-gray-300 rounded">
                    <div>
                         <input type="range" id="shape-stroke-width" min="0" max="20" value="2" class="w-full">
                         <span id="shape-stroke-width-value" class="text-xs text-gray-600">2px</span>
                    </div>
                </div>
                <select id="stroke-style" class="w-full text-xs border border-gray-300 rounded px-2 py-1">
                    <option value="solid">Solid</option>
                    <option value="dashed">Dashed</option>
                    <option value="dotted">Dotted</option>
                </select>
            </div>

            <!-- Advanced Properties -->
            <div class="space-y-3">
                <label class="block text-xs font-medium text-gray-600">Advanced</label>
                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <label class="text-xs text-gray-600">Rotation</label>
                        <input type="range" id="shape-rotation" min="0" max="360" value="0" class="w-full">
                        <span id="shape-rotation-value" class="text-xs text-gray-600">0°</span>
                    </div>
                    <div>
                        <label class="text-xs text-gray-600">Shadow</label>
                        <input type="checkbox" id="shape-shadow" class="rounded text-purple-500 focus:ring-purple-500">
                        <input type="color" id="shadow-color" value="#000000" class="w-full h-6 border border-gray-300 rounded mt-1" disabled>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex space-x-2">
                <button id="apply-shape-changes" class="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors hidden">
                    ✓ Apply Changes
                </button>
                <button id="cancel-shape" class="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                    ✕ Cancel
                </button>
            </div>
        </div>
    </div>
</div> 