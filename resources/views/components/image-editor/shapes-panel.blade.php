<div class="tool-panel" id="shapes-panel">
    <h3 class="font-semibold text-gray-800 mb-3 flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
        Shapes & Drawing
    </h3>

    <div class="space-y-4">
        <!-- Shape Selection -->
        <div>
            <label class="block text-xs font-medium text-gray-600 mb-2">Select a tool</label>
            <div class="grid grid-cols-3 gap-2">
                <button class="drawing-tool-btn flex flex-col items-center justify-center p-2 bg-gray-100 hover:bg-purple-100 border border-gray-200 rounded-lg transition-colors" data-tool="rectangle">
                    <svg class="w-8 h-8 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="14" rx="2" ry="2"></rect></svg>
                    <span class="text-xs mt-1">Rectangle</span>
                </button>
                <button class="drawing-tool-btn flex flex-col items-center justify-center p-2 bg-gray-100 hover:bg-purple-100 border border-gray-200 rounded-lg transition-colors" data-tool="ellipse">
                    <svg class="w-8 h-8 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="12" cy="12" rx="10" ry="7"></ellipse></svg>
                    <span class="text-xs mt-1">Ellipse</span>
                </button>
                <button class="drawing-tool-btn flex flex-col items-center justify-center p-2 bg-gray-100 hover:bg-purple-100 border border-gray-200 rounded-lg transition-colors" data-tool="drawing">
                    <svg class="w-8 h-8 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20l9-9-4-4-9 9v4h4z"></path><path d="M16.5 3.5l4 4"></path></svg>
                    <span class="text-xs mt-1">Freehand</span>
                </button>
            </div>
            <p id="shape-instructions" class="text-xs text-gray-500 mt-2 hidden">Click and drag on the canvas to draw.</p>
        </div>

        <!-- Shape Properties -->
        <div id="shape-properties" class="space-y-4 pt-4 border-t hidden">
            <h4 id="properties-title" class="text-xs font-semibold text-gray-700">Shape Properties</h4>
            
            <!-- Fill Color -->
            <div id="fill-options" class="space-y-2">
                <label class="flex items-center space-x-2">
                    <input type="checkbox" id="shape-fill-enable" class="rounded text-purple-500 focus:ring-purple-500" checked>
                    <span class="text-sm text-gray-600">Fill Shape</span>
                </label>
                <input type="color" id="shape-fill-color" value="#4F46E5" class="w-full h-8 border border-gray-300 rounded">
            </div>

            <!-- Stroke (Outline) / Brush -->
            <div class="space-y-2">
                <label id="stroke-brush-label" class="block text-xs font-medium text-gray-600 mb-1">Outline</label>
                <div class="grid grid-cols-2 gap-2">
                    <input type="color" id="shape-stroke-color" value="#000000" class="w-full h-8 border border-gray-300 rounded">
                    <div>
                         <input type="range" id="shape-stroke-width" min="1" max="50" value="2" class="w-full">
                         <span id="shape-stroke-width-value" class="text-xs text-gray-600">2px</span>
                    </div>
                </div>
            </div>
             <button id="cancel-shape" class="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors">Cancel Drawing</button>
        </div>
    </div>
</div> 