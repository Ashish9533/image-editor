<div class="tool-panel" id="animations-panel">
    <h3 class="font-semibold text-gray-800 mb-3 flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4"></path></svg>
        Animations
    </h3>

    <div class="space-y-4">
        <!-- Animation Presets -->
        <div>
            <label class="block text-xs font-medium text-gray-600 mb-2">Select Animation (for active layer)</label>
            <div class="grid grid-cols-3 gap-2">
                <button class="animation-preset-btn" data-anim="none">None</button>
                <button class="animation-preset-btn" data-anim="fade">Fade</button>
                <button class="animation-preset-btn" data-anim="rise">Rise</button>
                <button class="animation-preset-btn" data-anim="pan">Pan</button>
                <button class="animation-preset-btn" data-anim="pop">Pop</button>
                <button class="animation-preset-btn" data-anim="wipe">Wipe</button>
                <button class="animation-preset-btn" data-anim="blur">Blur</button>
                <button class="animation-preset-btn" data-anim="breathe">Breathe</button>
                <button class="animation-preset-btn" data-anim="baseline">Baseline</button>
                <button class="animation-preset-btn" data-anim="rotate">Rotate</button>
                <button class="animation-preset-btn" data-anim="flicker">Flicker</button>
                <button class="animation-preset-btn" data-anim="pulse">Pulse</button>
                <button class="animation-preset-btn" data-anim="wiggly">Wiggly</button>
            </div>
        </div>

        <!-- Animation Properties -->
        <div id="animation-properties" class="space-y-4 pt-4 border-t hidden">
            <h4 id="animation-properties-title" class="text-xs font-semibold text-gray-700">Animation Properties</h4>
            
            <div class="space-y-2">
                <label class="block text-xs font-medium text-gray-600 mb-1">Intensity</label>
                <div class="flex items-center space-x-2">
                    <input type="range" id="animation-intensity" min="1" max="100" value="50" class="w-full">
                    <span id="animation-intensity-value" class="text-xs text-gray-600">50%</span>
                </div>
            </div>

            <div class="space-y-2">
                <label class="block text-xs font-medium text-gray-600 mb-1">Duration (seconds)</label>
                <div class="flex items-center space-x-2">
                    <input type="range" id="animation-duration" min="0.5" max="10" step="0.1" value="2" class="w-full">
                    <span id="animation-duration-value" class="text-xs text-gray-600">2.0s</span>
                </div>
            </div>
        </div>
        
        <!-- Animation Preview -->
        <div id="animation-preview-controls" class="pt-4 border-t">
            <button id="play-animation-btn" class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path></svg>
                <span>Preview Animation</span>
            </button>
        </div>
        
        <!-- GIF Export -->
        <div id="animation-export-controls" class="pt-4 border-t">
             <button id="export-gif-btn" class="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 3.5a1.5 1.5 0 01.588 2.91l-2.01 1.005a3.501 3.501 0 00-4.032.57 1.5 1.5 0 11-2.12-.137 6.5 6.5 0 017.38-1.182l2.36-1.18a1.5 1.5 0 01-1.176-2.986zM15.5 6a1.5 1.5 0 012.122-.137 6.5 6.5 0 01-1.182 7.38l-1.005 2.01a1.5 1.5 0 01-2.91-.588l1.18-2.36a3.5 3.5 0 00-.57-4.032 1.5 1.5 0 01.137-2.122zM3.5 10a1.5 1.5 0 01.588-2.91l2.01-1.005a3.5 3.5 0 004.032-.57 1.5 1.5 0 112.12.137 6.5 6.5 0 01-7.38 1.182L3.51 9.24a1.5 1.5 0 01-.01-2.23z"></path></svg>
                <span>Export as GIF</span>
            </button>
            <div id="gif-progress-container" class="relative hidden mt-2">
                <div class="w-full bg-gray-200 rounded-full h-4">
                    <div id="gif-progress-bar" class="bg-purple-600 h-4 rounded-full transition-all duration-150" style="width: 0%"></div>
                </div>
                <p id="gif-progress-text" class="absolute inset-0 text-center text-xs font-medium text-white flex items-center justify-center">0%</p>
            </div>
        </div>
    </div>
</div>

<style>
.animation-preset-btn {
    @apply flex items-center justify-center p-2 bg-gray-100 hover:bg-purple-100 border border-gray-200 rounded-lg text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500;
}
.animation-preset-btn.active {
    @apply bg-purple-100 border-purple-400 ring-2 ring-purple-500 text-purple-800;
}
</style> 