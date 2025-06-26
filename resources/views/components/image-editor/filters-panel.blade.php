<div class="tool-panel" id="filters-panel">
    <h3 class="font-semibold text-gray-800 mb-3 flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"/>
        </svg>
        Filters
    </h3>
    
    <div class="space-y-3">
        <div class="space-y-2">
            <label class="block text-xs text-gray-600">Brightness</label>
            <input type="range" id="brightness" min="0" max="200" value="100" class="w-full">
            <span id="brightness-value" class="text-xs text-gray-600">100%</span>
        </div>
        
        <div class="space-y-2">
            <label class="block text-xs text-gray-600">Contrast</label>
            <input type="range" id="contrast" min="0" max="200" value="100" class="w-full">
            <span id="contrast-value" class="text-xs text-gray-600">100%</span>
        </div>
        
        <div class="space-y-2">
            <label class="block text-xs text-gray-600">Saturation</label>
            <input type="range" id="saturation" min="0" max="200" value="100" class="w-full">
            <span id="saturation-value" class="text-xs text-gray-600">100%</span>
        </div>
        
        <div class="space-y-2">
            <label class="block text-xs text-gray-600">Blur</label>
            <input type="range" id="blur" min="0" max="10" value="0" class="w-full">
            <span id="blur-value" class="text-xs text-gray-600">0px</span>
        </div>
        
        <div class="space-y-2">
            <label class="block text-xs text-gray-600">Hue</label>
            <input type="range" id="hue" min="0" max="360" value="0" class="w-full">
            <span id="hue-value" class="text-xs text-gray-600">0°</span>
        </div>
        
        <div class="grid grid-cols-2 gap-2">
            <button class="filter-preset bg-gray-200 hover:bg-gray-300 py-1 px-2 rounded text-xs" data-filter="grayscale">Grayscale</button>
            <button class="filter-preset bg-gray-200 hover:bg-gray-300 py-1 px-2 rounded text-xs" data-filter="sepia">Sepia</button>
            <button class="filter-preset bg-gray-200 hover:bg-gray-300 py-1 px-2 rounded text-xs" data-filter="vintage">Vintage</button>
            <button class="filter-preset bg-gray-200 hover:bg-gray-300 py-1 px-2 rounded text-xs" data-filter="reset">Reset</button>
        </div>
    </div>
</div> 