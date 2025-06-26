<div class="tool-panel" id="text-panel">
    <h3 class="font-semibold text-gray-800 mb-3 flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"/>
        </svg>
        Advanced Text
    </h3>
    
    <div class="space-y-4">
        <!-- Add Text Button -->
        <button id="add-text" title="Add a new text layer to the canvas" class="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" fill-rule="evenodd"></path></svg>
            <span>Add New Text</span>
        </button>
        
        <!-- Text Elements List -->
        <div id="text-elements-list" class="space-y-2 max-h-32 overflow-y-auto hidden">
            <h4 class="text-xs font-semibold text-gray-600 border-b pb-1">Text Layers</h4>
            <div id="text-elements-container">
                <!-- Text elements will be added here dynamically -->
            </div>
        </div>
        
        <!-- Text Controls (shows when text is selected) -->
        <div id="text-controls" class="space-y-4 hidden">
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <h4 class="text-xs font-semibold text-gray-700 mb-2">Edit Text Content</h4>
                <textarea id="text-input" placeholder="Enter your text here..." class="w-full border border-gray-300 rounded px-2 py-2 text-sm resize-none focus:ring-purple-500 focus:border-purple-500" rows="3"></textarea>
            </div>
            
            <!-- Individual Word Colors -->
            <details class="bg-gray-50 border border-gray-200 rounded-lg group">
                <summary class="text-xs font-semibold text-gray-700 p-3 cursor-pointer group-open:border-b">
                    ✨ Individual Word Colors
                </summary>
                <div class="p-3 space-y-2">
                    <p class="text-xs text-gray-600">Click on words below to change their color:</p>
                    <div class="bg-white border border-gray-300 rounded p-2 min-h-[40px] max-h-20 overflow-y-auto">
                        <div id="word-picker-text" class="text-sm leading-relaxed cursor-pointer"></div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <input type="color" id="selected-word-color" value="#000000" class="w-8 h-6 border border-gray-300 rounded" disabled>
                        <button id="apply-word-color" title="Apply selected color to the chosen word" class="flex-1 bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded text-xs font-medium transition-colors" disabled>Apply Color</button>
                        <button id="reset-word-colors" title="Remove all individual word colors" class="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs font-medium transition-colors">Reset All</button>
                    </div>
                </div>
            </details>
            
            <!-- Font & Style -->
            <details class="bg-gray-50 border border-gray-200 rounded-lg group" open>
                <summary class="text-xs font-semibold text-gray-700 p-3 cursor-pointer group-open:border-b">
                    🎨 Font & Style
                </summary>
                <div class="p-3 space-y-4">
                    <div class="space-y-2">
                        <label class="block text-xs font-medium text-gray-600 mb-1">Font Family</label>
                        <select id="font-family" class="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:ring-purple-500 focus:border-purple-500">
                            <option value="Arial">Arial</option>
                            <option value="Verdana">Verdana</option>
                            <option value="Georgia">Georgia</option>
                            <option value="Times New Roman">Times New Roman</option>
                            <option value="Courier New">Courier New</option>
                            <option value="Impact">Impact</option>
                            <option value="Comic Sans MS">Comic Sans</option>
                            <option value="Roboto">Roboto</option>
                            <option value="Poppins">Poppins</option>
                            <option value="Montserrat">Montserrat</option>
                            <option value="Lobster">Lobster</option>
                            <option value="Pacifico">Pacifico</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-gray-600 mb-1">Font Size</label>
                        <div class="flex items-center space-x-2">
                            <input type="range" id="font-size" min="8" max="150" value="20" class="flex-1 w-full">
                            <span id="font-size-value" class="text-xs text-gray-600 w-10 text-right">20px</span>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-medium text-gray-600 mb-1">Default Color</label>
                            <input type="color" id="text-color" value="#000000" class="w-full h-8 border border-gray-300 rounded">
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-600 mb-1">Background</label>
                            <div class="flex items-center space-x-1">
                                <input type="color" id="text-bg-color" value="#ffffff" class="flex-1 h-8 border border-gray-300 rounded">
                                <input type="checkbox" id="text-bg-enable" class="rounded text-purple-500 focus:ring-purple-500">
                            </div>
                        </div>
                    </div>
                    <div class="flex space-x-1">
                        <button id="text-bold" title="Toggle bold" class="flex-1 bg-gray-200 hover:bg-gray-300 py-2 px-2 rounded text-xs font-bold transition-colors">B</button>
                        <button id="text-italic" title="Toggle italic" class="flex-1 bg-gray-200 hover:bg-gray-300 py-2 px-2 rounded text-xs italic transition-colors">I</button>
                        <button id="text-underline" title="Toggle underline" class="flex-1 bg-gray-200 hover:bg-gray-300 py-2 px-2 rounded text-xs underline transition-colors">U</button>
                        <button id="text-shadow" title="Toggle shadow" class="flex-1 bg-gray-200 hover:bg-gray-300 py-2 px-2 rounded text-xs transition-colors flex justify-center items-center">S</button>
                    </div>
                </div>
            </details>

            <!-- Spacing & Transform -->
            <details class="bg-gray-50 border border-gray-200 rounded-lg group">
                <summary class="text-xs font-semibold text-gray-700 p-3 cursor-pointer group-open:border-b">
                    📐 Spacing & Transform
                </summary>
                <div class="p-3 space-y-4">
                    <div class="grid grid-cols-3 gap-1">
                        <button id="text-align-left" class="bg-gray-200 hover:bg-gray-300 py-1 px-2 rounded text-xs transition-colors flex justify-center items-center"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg></button>
                        <button id="text-align-center" class="bg-gray-200 hover:bg-gray-300 py-1 px-2 rounded text-xs transition-colors flex justify-center items-center"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 110-2h6a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg></button>
                        <button id="text-align-right" class="bg-gray-200 hover:bg-gray-300 py-1 px-2 rounded text-xs transition-colors flex justify-center items-center"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm10 5a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg></button>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-medium text-gray-600 mb-1">Letter Spacing</label>
                            <input type="range" id="letter-spacing" min="-5" max="20" value="0" class="w-full">
                            <span id="letter-spacing-value" class="text-xs text-gray-600">0px</span>
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-600 mb-1">Line Height</label>
                            <input type="range" id="line-height" min="80" max="200" value="120" class="w-full">
                            <span id="line-height-value" class="text-xs text-gray-600">120%</span>
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-gray-600 mb-1">Rotation</label>
                        <div class="flex items-center space-x-2">
                            <input type="range" id="text-rotation" min="-180" max="180" value="0" class="flex-1">
                            <span id="text-rotation-value" class="text-xs text-gray-600 w-10 text-right">0°</span>
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-gray-600 mb-1">Opacity</label>
                         <div class="flex items-center space-x-2">
                            <input type="range" id="text-opacity" min="0" max="100" value="100" class="flex-1">
                            <span id="text-opacity-value" class="text-xs text-gray-600 w-10 text-right">100%</span>
                        </div>
                    </div>
                </div>
            </details>

            <!-- Stroke Options -->
            <details class="bg-gray-50 border border-gray-200 rounded-lg group">
                <summary class="text-xs font-semibold text-gray-700 p-3 cursor-pointer group-open:border-b">
                    ✒️ Text Stroke (Outline)
                </summary>
                <div class="p-3 space-y-4">
                     <label class="flex items-center space-x-2">
                        <input type="checkbox" id="stroke-enable" class="rounded text-purple-500 focus:ring-purple-500">
                        <span class="text-sm text-gray-600">Enable Stroke</span>
                    </label>
                    <div class="grid grid-cols-2 gap-4" id="stroke-options" class="hidden">
                        <div>
                            <label class="block text-xs font-medium text-gray-600 mb-1">Stroke Color</label>
                            <input type="color" id="stroke-color" value="#ffffff" class="w-full h-8 border border-gray-300 rounded">
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-600 mb-1">Stroke Width</label>
                            <input type="range" id="stroke-width" min="0" max="10" value="1" class="w-full">
                            <span id="stroke-width-value" class="text-xs text-gray-600">1px</span>
                        </div>
                    </div>
                </div>
            </details>

            <!-- Gradient Options -->
            <details class="bg-gray-50 border border-gray-200 rounded-lg group">
                <summary class="text-xs font-semibold text-gray-700 p-3 cursor-pointer group-open:border-b">
                    🌈 Text Gradient
                </summary>
                <div class="p-3 space-y-4">
                     <label class="flex items-center space-x-2">
                        <input type="checkbox" id="gradient-enable" class="rounded text-purple-500 focus:ring-purple-500">
                        <span class="text-sm text-gray-600">Enable Gradient</span>
                    </label>
                    <div id="gradient-options" class="space-y-4 hidden">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-medium text-gray-600 mb-1">Color 1</label>
                                <input type="color" id="gradient-color-1" value="#ff0000" class="w-full h-8 border border-gray-300 rounded">
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-gray-600 mb-1">Color 2</label>
                                <input type="color" id="gradient-color-2" value="#0000ff" class="w-full h-8 border border-gray-300 rounded">
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-600 mb-1">Direction</label>
                            <select id="gradient-direction" class="w-full border border-gray-300 rounded px-2 py-1 text-xs">
                                <option value="horizontal">Horizontal</option>
                                <option value="vertical">Vertical</option>
                                <option value="diagonal">Diagonal</option>
                            </select>
                        </div>
                    </div>
                </div>
            </details>
            
            <!-- Actions -->
            <div class="flex space-x-2 pt-2">
                <button id="duplicate-text" title="Duplicate current text layer" class="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-2 rounded text-xs font-medium transition-colors flex items-center justify-center space-x-1">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M7 3a1 1 0 011-1h3a1 1 0 011 1v1h1a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2h1V3zm2 2v2H7a1 1 0 00-1 1v8a1 1 0 001 1h8a1 1 0 001-1V6a1 1 0 00-1-1h-2V5H9z" clip-rule="evenodd" fill-rule="evenodd"></path></svg>
                    <span>Duplicate</span>
                </button>
                <button id="delete-text" title="Delete current text layer" class="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-2 rounded text-xs font-medium transition-colors flex items-center justify-center space-x-1">
                     <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 5a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zM4 9a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zm1 4a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
                    <span>Delete</span>
                </button>
            </div>
        </div>
    </div>
</div> 