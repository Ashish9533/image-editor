<div class="tool-panel" id="layers-panel">
    <h3 class="font-semibold text-gray-800 mb-3 flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
        Layers
    </h3>
    <div class="space-y-4">
        <div id="layers-list" class="space-y-2 max-h-64 overflow-y-auto">
            <!-- Dynamic layer items will be injected here -->
        </div>

        <div class="flex items-center space-x-2 pt-2 border-t">
            <button id="move-layer-up" title="Move layer up" class="p-2 bg-gray-200 hover:bg-gray-300 rounded"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg></button>
            <button id="move-layer-down" title="Move layer down" class="p-2 bg-gray-200 hover:bg-gray-300 rounded"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></button>
            <button id="delete-layer" title="Delete selected layer" class="p-2 bg-red-200 hover:bg-red-300 text-red-700 rounded"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
            <div class="flex-1 space-y-1">
                <label for="layer-opacity" class="text-xs text-gray-600">Opacity: <span id="opacity-value">100%</span></label>
                <input type="range" id="layer-opacity" min="0" max="100" value="100" class="w-full">
            </div>
        </div>
    </div>
</div> 