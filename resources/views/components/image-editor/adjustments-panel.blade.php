<div id="adjustments-panel" class="image-editor-panel hidden">
    <div class="panel-header">
        <h3 class="panel-title">Adjustments</h3>
        <button id="adjustments-close" class="close-panel-btn">&times;</button>
    </div>
    <div class="panel-content">
        <div class="space-y-4">
            <!-- Brightness -->
            <div>
                <label for="adjustment-brightness" class="font-semibold text-gray-300 text-sm">Brightness</label>
                <div class="flex items-center space-x-2 mt-2">
                    <input type="range" id="adjustment-brightness" min="0" max="200" value="100" class="w-full">
                    <span id="brightness-value" class="text-sm text-gray-400 w-10 text-center">100%</span>
                </div>
            </div>
            <!-- Contrast -->
            <div>
                <label for="adjustment-contrast" class="font-semibold text-gray-300 text-sm">Contrast</label>
                <div class="flex items-center space-x-2 mt-2">
                    <input type="range" id="adjustment-contrast" min="0" max="200" value="100" class="w-full">
                    <span id="contrast-value" class="text-sm text-gray-400 w-10 text-center">100%</span>
                </div>
            </div>
            <!-- Saturation -->
            <div>
                <label for="adjustment-saturation" class="font-semibold text-gray-300 text-sm">Saturation</label>
                <div class="flex items-center space-x-2 mt-2">
                    <input type="range" id="adjustment-saturation" min="0" max="200" value="100" class="w-full">
                    <span id="saturation-value" class="text-sm text-gray-400 w-10 text-center">100%</span>
                </div>
            </div>
             <!-- Vibrance -->
            <div>
                <label for="adjustment-vibrance" class="font-semibold text-gray-300 text-sm">Vibrance</label>
                <div class="flex items-center space-x-2 mt-2">
                    <input type="range" id="adjustment-vibrance" min="0" max="200" value="100" class="w-full" disabled>
                     <span id="vibrance-value" class="text-sm text-gray-400 w-10 text-center">N/A</span>
                </div>
                <p class="text-xs text-gray-500 mt-1">Vibrance is not yet supported.</p>
            </div>
            <!-- Hue -->
            <div>
                <label for="adjustment-hue" class="font-semibold text-gray-300 text-sm">Hue</label>
                <div class="flex items-center space-x-2 mt-2">
                    <input type="range" id="adjustment-hue" min="0" max="360" value="0" class="w-full">
                    <span id="hue-value" class="text-sm text-gray-400 w-10 text-center">0°</span>
                </div>
            </div>
             <!-- Sepia -->
            <div>
                <label for="adjustment-sepia" class="font-semibold text-gray-300 text-sm">Sepia</label>
                <div class="flex items-center space-x-2 mt-2">
                    <input type="range" id="adjustment-sepia" min="0" max="100" value="0" class="w-full">
                    <span id="sepia-value" class="text-sm text-gray-400 w-10 text-center">0%</span>
                </div>
            </div>

            <!-- Actions -->
            <div class="pt-4 space-y-2">
                <button id="adjustments-apply" class="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold transition-colors">
                    Apply Adjustments
                </button>
                <button id="adjustments-reset" class="w-full py-2 px-4 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-semibold transition-colors">
                    Reset All
                </button>
            </div>
        </div>
    </div>
</div> 