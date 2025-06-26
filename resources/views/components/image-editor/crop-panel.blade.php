<div class="tool-panel" id="crop-panel">
    <h3 class="font-semibold text-gray-800 mb-3 flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        Smart Crop
    </h3>
    
    <div class="space-y-4">
        <button id="crop-toggle" class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors">
            Start Crop
        </button>
        
        <div id="crop-controls" class="space-y-4 hidden">
            <!-- Aspect Ratio Presets -->
            <div>
                <label class="block text-xs font-medium text-gray-600 mb-2">Aspect Ratio</label>
                <div class="grid grid-cols-2 gap-2">
                    <button class="crop-preset bg-gray-100 hover:bg-blue-100 border border-gray-200 hover:border-blue-300 py-2 px-3 rounded-lg text-xs font-medium transition-colors" data-ratio="1:1">
                        Square<br><span class="text-gray-500">1:1</span>
                    </button>
                    <button class="crop-preset bg-gray-100 hover:bg-blue-100 border border-gray-200 hover:border-blue-300 py-2 px-3 rounded-lg text-xs font-medium transition-colors" data-ratio="4:3">
                        Photo<br><span class="text-gray-500">4:3</span>
                    </button>
                    <button class="crop-preset bg-gray-100 hover:bg-blue-100 border border-gray-200 hover:border-blue-300 py-2 px-3 rounded-lg text-xs font-medium transition-colors" data-ratio="16:9">
                        Widescreen<br><span class="text-gray-500">16:9</span>
                    </button>
                    <button class="crop-preset bg-gray-100 hover:bg-blue-100 border border-gray-200 hover:border-blue-300 py-2 px-3 rounded-lg text-xs font-medium transition-colors" data-ratio="free">
                        Free<br><span class="text-gray-500">Custom</span>
                    </button>
                </div>
            </div>
            
            <!-- Real-time Crop Info -->
            <div id="crop-info" class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 class="text-xs font-semibold text-blue-800 mb-2">Selection Info</h4>
                <div class="space-y-1 text-xs text-blue-700">
                    <div class="flex justify-between">
                        <span>Dimensions:</span>
                        <span id="crop-dimensions">-</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Aspect Ratio:</span>
                        <span id="crop-ratio">-</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Position:</span>
                        <span id="crop-position">-</span>
                    </div>
                </div>
            </div>
            
            <!-- Crop Options -->
            <div class="space-y-3">
                <div class="space-y-2">
                    <label class="flex items-center space-x-2">
                        <input type="checkbox" id="show-grid" class="rounded border-gray-300">
                        <span class="text-sm text-gray-600">Show rule of thirds</span>
                    </label>
                    <label class="flex items-center space-x-2">
                        <input type="checkbox" id="auto-fit" class="rounded border-gray-300" checked>
                        <span class="text-sm text-gray-600">Auto-fit large images</span>
                    </label>
                </div>
                
                <!-- Zoom Controls for Large Images -->
                <div id="crop-zoom-controls" class="hidden">
                    <label class="block text-xs font-medium text-gray-600 mb-2">Zoom Level</label>
                    <div class="flex items-center space-x-2">
                        <button id="zoom-out-crop" class="p-1 bg-gray-200 hover:bg-gray-300 rounded text-xs">-</button>
                        <input type="range" id="crop-zoom" min="10" max="200" value="100" class="flex-1">
                        <button id="zoom-in-crop" class="p-1 bg-gray-200 hover:bg-gray-300 rounded text-xs">+</button>
                    </div>
                    <div class="text-xs text-gray-500 text-center mt-1">
                        <span id="crop-zoom-value">100%</span>
                    </div>
                </div>
                
                <!-- Dimension Constraints -->
                <div class="space-y-2">
                    <label class="block text-xs font-medium text-gray-600">Size Constraints</label>
                    <div class="grid grid-cols-2 gap-2">
                        <div>
                            <label class="text-xs text-gray-500">Min Width</label>
                            <input type="number" id="min-width" value="50" min="10" max="5000" class="w-full border border-gray-300 rounded px-2 py-1 text-xs">
                        </div>
                        <div>
                            <label class="text-xs text-gray-500">Min Height</label>
                            <input type="number" id="min-height" value="50" min="10" max="5000" class="w-full border border-gray-300 rounded px-2 py-1 text-xs">
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Crop Actions -->
            <div class="flex space-x-2">
                <button id="apply-crop" class="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                    Apply Crop
                </button>
                <button id="cancel-crop" class="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                    Cancel
                </button>
            </div>
        </div>
    </div>
</div> 