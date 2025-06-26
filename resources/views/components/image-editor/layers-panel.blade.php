<div class="tool-panel" id="layers-panel">
    <h3 class="font-semibold text-gray-800 mb-3 flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
        </svg>
        Layers
    </h3>
    
    <div class="space-y-3">
        <div id="layers-list" class="space-y-1 max-h-32 overflow-y-auto">
            <!-- Layers will be dynamically added here -->
        </div>
        
        <div class="space-y-2">
            <label class="block text-xs text-gray-600">Opacity</label>
            <input type="range" id="layer-opacity" min="0" max="100" value="100" class="w-full">
            <span id="opacity-value" class="text-xs text-gray-600">100%</span>
        </div>
        
        <div class="flex space-x-2">
            <button id="move-layer-up" class="flex-1 bg-gray-200 hover:bg-gray-300 py-1 px-2 rounded text-xs">↑</button>
            <button id="move-layer-down" class="flex-1 bg-gray-200 hover:bg-gray-300 py-1 px-2 rounded text-xs">↓</button>
            <button id="delete-layer" class="flex-1 bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded text-xs">🗑</button>
        </div>
    </div>
</div> 