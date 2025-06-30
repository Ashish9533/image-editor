<div id="histogram-panel" class="space-y-4 max-h-screen overflow-y-auto">
    <h3 class="font-semibold text-gray-800 mb-2">Professional Histogram Suite</h3>

    <!-- Display Mode and Channel Selection -->
    <div class="grid grid-cols-2 gap-2">
        <div>
            <label for="display-mode-select" class="text-sm font-medium">Display Mode</label>
            <select id="display-mode-select" class="w-full p-2 mt-1 text-sm border rounded-lg bg-white">
                <option value="histogram" selected>Histogram</option>
                <option value="waveform">Waveform</option>
                <option value="vectorscope">Vectorscope</option>
                <option value="parade">RGB Parade</option>
            </select>
        </div>
        <div>
            <label for="histogram-channel-select" class="text-sm font-medium">Channel</label>
            <select id="histogram-channel-select" class="w-full p-2 mt-1 text-sm border rounded-lg bg-white">
                <option value="luminosity" selected>Luminosity</option>
                <option value="red">Red</option>
                <option value="green">Green</option>
                <option value="blue">Blue</option>
            </select>
        </div>
    </div>

    <!-- Color Space and Advanced Options -->
    <div class="grid grid-cols-2 gap-2">
        <div>
            <label for="color-space-select" class="text-sm font-medium">Color Space</label>
            <select id="color-space-select" class="w-full p-2 mt-1 text-sm border rounded-lg bg-white">
                <option value="RGB" selected>RGB</option>
                <option value="LAB">LAB</option>
                <option value="HSV">HSV</option>
            </select>
        </div>
        <div class="space-y-1">
            <label class="text-sm font-medium">Advanced Options</label>
            <div class="grid grid-cols-2 gap-1 text-xs">
                <label class="flex items-center">
                    <input type="checkbox" id="rgb-overlay" class="mr-1 scale-75">
                    RGB Overlay
                </label>
                <label class="flex items-center">
                    <input type="checkbox" id="show-clipping" class="mr-1 scale-75">
                    Clipping
                </label>
                <label class="flex items-center">
                    <input type="checkbox" id="smooth-histogram" class="mr-1 scale-75">
                    Smooth
                </label>
                <label class="flex items-center">
                    <input type="checkbox" id="show-zone-system" class="mr-1 scale-75">
                    Zones
                </label>
                <label class="flex items-center">
                    <input type="checkbox" id="show-before-after" class="mr-1 scale-75">
                    Compare
                </label>
                <label class="flex items-center">
                    <input type="checkbox" id="show-dominant-colors" class="mr-1 scale-75">
                    Colors
                </label>
            </div>
        </div>
    </div>

    <!-- Main Display Canvas -->
    <div class="relative">
        <canvas id="histogram-canvas" width="280" height="150" class="w-full bg-gray-100 border rounded-lg"></canvas>
        <canvas id="curves-canvas" width="280" height="150" class="absolute top-0 left-0 w-full h-full cursor-crosshair"></canvas>
        <canvas id="waveform-canvas" width="280" height="150" class="absolute top-0 left-0 w-full h-full hidden"></canvas>
        <canvas id="vectorscope-canvas" width="280" height="150" class="absolute top-0 left-0 w-full h-full hidden"></canvas>
    </div>

    <!-- Auto Adjustment Tools -->
    <div class="space-y-2">
        <h4 class="font-medium text-gray-700 text-sm">Auto Adjustments</h4>
        <div class="grid grid-cols-3 gap-1">
            <button id="auto-levels" class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs">Auto Levels</button>
            <button id="auto-contrast" class="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs">Auto Contrast</button>
            <button id="auto-color" class="bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded text-xs">Auto Color</button>
        </div>
    </div>

    <!-- Color Balance Controls -->
    <div class="space-y-3">
        <h4 class="font-medium text-gray-700 text-sm">Color Balance</h4>
        
        <div class="space-y-2">
            <div class="flex justify-between items-center">
                <label class="text-xs text-gray-600">Temperature</label>
                <span id="temperature-value" class="text-xs text-gray-500">6500K</span>
            </div>
            <input type="range" id="temperature-slider" min="2000" max="12000" value="6500" step="100" class="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer">
        </div>

        <div class="space-y-2">
            <div class="flex justify-between items-center">
                <label class="text-xs text-gray-600">Tint</label>
                <span id="tint-value" class="text-xs text-gray-500">0</span>
            </div>
            <input type="range" id="tint-slider" min="-100" max="100" value="0" step="1" class="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer">
        </div>

        <div class="space-y-2">
            <div class="flex justify-between items-center">
                <label class="text-xs text-gray-600">Vibrance</label>
                <span id="vibrance-value" class="text-xs text-gray-500">0</span>
            </div>
            <input type="range" id="vibrance-slider" min="-100" max="100" value="0" step="1" class="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer">
        </div>

        <div class="space-y-2">
            <div class="flex justify-between items-center">
                <label class="text-xs text-gray-600">Saturation</label>
                <span id="saturation-value" class="text-xs text-gray-500">0</span>
            </div>
            <input type="range" id="saturation-slider" min="-100" max="100" value="0" step="1" class="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer">
        </div>
    </div>

    <!-- Manual Tone Adjustments -->
    <div class="space-y-3">
        <h4 class="font-medium text-gray-700 text-sm">Tone Adjustments</h4>
        
        <div class="space-y-2">
            <div class="flex justify-between items-center">
                <label class="text-xs text-gray-600">Shadows</label>
                <span id="shadows-value" class="text-xs text-gray-500">0</span>
            </div>
            <input type="range" id="shadows-slider" min="-100" max="100" value="0" step="1" class="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer">
        </div>

        <div class="space-y-2">
            <div class="flex justify-between items-center">
                <label class="text-xs text-gray-600">Highlights</label>
                <span id="highlights-value" class="text-xs text-gray-500">0</span>
            </div>
            <input type="range" id="highlights-slider" min="-100" max="100" value="0" step="1" class="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer">
        </div>

        <div class="space-y-2">
            <div class="flex justify-between items-center">
                <label class="text-xs text-gray-600">Midtones</label>
                <span id="midtones-value" class="text-xs text-gray-500">1.0</span>
            </div>
            <input type="range" id="midtones-slider" min="0.1" max="3.0" value="1.0" step="0.1" class="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer">
        </div>

        <div class="space-y-2">
            <div class="flex justify-between items-center">
                <label class="text-xs text-gray-600">Exposure</label>
                <span id="exposure-value" class="text-xs text-gray-500">0</span>
            </div>
            <input type="range" id="exposure-slider" min="-100" max="100" value="0" step="1" class="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer">
        </div>
    </div>

    <!-- Curve Presets -->
    <div class="space-y-2">
        <h4 class="font-medium text-gray-700 text-sm">Curve Presets</h4>
        <div class="grid grid-cols-2 gap-1">
            <button id="preset-linear" class="bg-gray-400 hover:bg-gray-500 text-white px-2 py-1 rounded text-xs">Linear</button>
            <button id="preset-s-curve" class="bg-gray-400 hover:bg-gray-500 text-white px-2 py-1 rounded text-xs">S-Curve</button>
            <button id="preset-inverse" class="bg-gray-400 hover:bg-gray-500 text-white px-2 py-1 rounded text-xs">Inverse</button>
            <button id="preset-brighten" class="bg-gray-400 hover:bg-gray-500 text-white px-2 py-1 rounded text-xs">Brighten</button>
        </div>
    </div>

    <!-- Professional Analysis Tools -->
    <div class="space-y-2">
        <h4 class="font-medium text-gray-700 text-sm">Analysis Tools</h4>
        <div class="grid grid-cols-2 gap-1">
            <button id="match-histogram" class="bg-indigo-500 hover:bg-indigo-600 text-white px-2 py-1 rounded text-xs">Match Histogram</button>
            <button id="analyze-image" class="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-xs">Analyze Image</button>
            <button id="export-histogram" class="bg-emerald-500 hover:bg-emerald-600 text-white px-2 py-1 rounded text-xs">Export Data</button>
            <button id="save-preset" class="bg-rose-500 hover:bg-rose-600 text-white px-2 py-1 rounded text-xs">Save Preset</button>
        </div>
    </div>
    
    <!-- Statistics -->
    <div class="pt-2 border-t">
        <h4 class="font-medium text-gray-700 mb-2 text-sm">Channel Statistics</h4>
        <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600">
            <span>Mean:</span><span id="hist-mean" class="font-mono text-right">-</span>
            <span>Median:</span><span id="hist-median" class="font-mono text-right">-</span>
            <span>Std Dev:</span><span id="hist-std-dev" class="font-mono text-right">-</span>
            <span>Pixels:</span><span id="hist-pixels" class="font-mono text-right">-</span>
        </div>
    </div>

    <!-- Action Buttons -->
    <div class="pt-4 border-t flex space-x-2">
        <button id="reset-curves" class="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm">Reset All</button>
        <button id="apply-curves" class="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">Apply</button>
    </div>
</div> 