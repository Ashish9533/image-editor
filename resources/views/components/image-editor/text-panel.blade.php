<div class="tool-panel" id="text-panel">
    <h3 class="font-semibold text-gray-800 mb-3 flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"/>
        </svg>
        Advanced Text
    </h3>
    
    <div class="space-y-4">
        <!-- Add Text Button -->
        <button id="add-text" class="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors">
            ➕ Add New Text
        </button>
        
        <!-- Text Elements List -->
        <div id="text-elements-list" class="space-y-2 max-h-32 overflow-y-auto hidden">
            <h4 class="text-xs font-semibold text-gray-600 border-b pb-1">Text Elements</h4>
            <div id="text-elements-container">
                <!-- Text elements will be added here dynamically -->
            </div>
        </div>
        
        <!-- Text Controls (shows when text is selected) -->
        <div id="text-controls" class="space-y-3 hidden">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 class="text-xs font-semibold text-blue-800 mb-2">Editing Text</h4>
                <textarea id="text-input" placeholder="Enter your text here..." class="w-full border border-gray-300 rounded px-2 py-2 text-sm resize-none" rows="3"></textarea>
            </div>
            
            <!-- Word Color Picker Section -->
            <div id="word-color-section" class="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-3">
                <h4 class="text-xs font-semibold text-purple-800 mb-2">✨ Individual Word Colors</h4>
                <div class="space-y-2">
                    <p class="text-xs text-purple-700">Click on words below to change their colors:</p>
                    <div id="word-picker-container" class="bg-white border border-purple-200 rounded p-2 min-h-[40px] max-h-20 overflow-y-auto">
                        <div id="word-picker-text" class="text-sm leading-relaxed cursor-pointer">
                            <!-- Words will be displayed here as clickable spans -->
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <label class="text-xs font-medium text-purple-700">Selected Word Color:</label>
                        <input type="color" id="selected-word-color" value="#000000" class="w-8 h-6 border border-purple-300 rounded" disabled>
                        <button id="apply-word-color" class="bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded text-xs font-medium transition-colors" disabled>
                            Apply
                        </button>
                        <button id="reset-word-colors" class="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs font-medium transition-colors">
                            Reset All
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Font Settings -->
            <div class="grid grid-cols-2 gap-2">
                <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Font</label>
                    <select id="font-family" class="w-full border border-gray-300 rounded px-2 py-1 text-xs">
                        <option value="Arial">Arial</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Helvetica">Helvetica</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Verdana">Verdana</option>
                        <option value="Impact">Impact</option>
                        <option value="Comic Sans MS">Comic Sans</option>
                        <option value="Courier New">Courier New</option>
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Size</label>
                    <div class="flex items-center space-x-1">
                        <input type="range" id="font-size" min="8" max="100" value="20" class="flex-1">
                        <span id="font-size-value" class="text-xs text-gray-600 w-8">20</span>
                    </div>
                </div>
            </div>
            
            <!-- Color and Style -->
            <div class="space-y-2">
                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <label class="block text-xs font-medium text-gray-600 mb-1">Default Text Color</label>
                        <input type="color" id="text-color" value="#000000" class="w-full h-8 border border-gray-300 rounded">
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-gray-600 mb-1">Background</label>
                        <div class="flex items-center space-x-1">
                            <input type="color" id="text-bg-color" value="#ffffff" class="flex-1 h-8 border border-gray-300 rounded">
                            <input type="checkbox" id="text-bg-enable" class="rounded">
                        </div>
                    </div>
                </div>
                
                <!-- Style Buttons -->
                <div class="flex space-x-1">
                    <button id="text-bold" class="flex-1 bg-gray-200 hover:bg-gray-300 py-2 px-2 rounded text-xs font-bold transition-colors">B</button>
                    <button id="text-italic" class="flex-1 bg-gray-200 hover:bg-gray-300 py-2 px-2 rounded text-xs italic transition-colors">I</button>
                    <button id="text-underline" class="flex-1 bg-gray-200 hover:bg-gray-300 py-2 px-2 rounded text-xs underline transition-colors">U</button>
                    <button id="text-shadow" class="flex-1 bg-gray-200 hover:bg-gray-300 py-2 px-2 rounded text-xs transition-colors">S</button>
                </div>
            </div>
            
            <!-- Advanced Options -->
            <div class="space-y-2">
                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <label class="block text-xs font-medium text-gray-600 mb-1">Opacity</label>
                        <input type="range" id="text-opacity" min="0" max="100" value="100" class="w-full">
                        <span id="text-opacity-value" class="text-xs text-gray-600">100%</span>
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-gray-600 mb-1">Rotation</label>
                        <input type="range" id="text-rotation" min="-180" max="180" value="0" class="w-full">
                        <span id="text-rotation-value" class="text-xs text-gray-600">0°</span>
                    </div>
                </div>
                
                <div class="grid grid-cols-3 gap-1">
                    <button id="text-align-left" class="bg-gray-200 hover:bg-gray-300 py-1 px-2 rounded text-xs transition-colors">⬅</button>
                    <button id="text-align-center" class="bg-gray-200 hover:bg-gray-300 py-1 px-2 rounded text-xs transition-colors">↔</button>
                    <button id="text-align-right" class="bg-gray-200 hover:bg-gray-300 py-1 px-2 rounded text-xs transition-colors">➡</button>
                </div>
            </div>
            
            <!-- Text Actions -->
            <div class="flex space-x-2">
                <button id="duplicate-text" class="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-2 rounded text-xs font-medium transition-colors">
                    📋 Duplicate
                </button>
                <button id="delete-text" class="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-2 rounded text-xs font-medium transition-colors">
                    🗑 Delete
                </button>
            </div>
        </div>
    </div>
</div> 