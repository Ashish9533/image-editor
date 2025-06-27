<div class="tool-panel" id="animations-panel">
    <h3 class="font-semibold text-gray-800 mb-3 flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4"></path></svg>
        Animations
    </h3>

    <div class="space-y-4">
        <!-- Animation Presets -->
        <div>
            <label class="block text-xs font-medium text-gray-600 mb-2">Select Animation (for active layer)</label>
            
            <!-- Basic Animations -->
            <div class="mb-3">
                <label class="block text-xs font-semibold text-purple-600 mb-1">Basic</label>
                <div class="grid grid-cols-3 gap-2">
                    <button class="animation-preset-btn" data-anim="none">None</button>
                    <button class="animation-preset-btn" data-anim="fade">Fade</button>
                    <button class="animation-preset-btn" data-anim="zoom">Zoom</button>
                    <button class="animation-preset-btn" data-anim="rise">Rise</button>
                    <button class="animation-preset-btn" data-anim="pan">Pan</button>
                    <button class="animation-preset-btn" data-anim="wipe">Wipe</button>
                </div>
            </div>

            <!-- Transform Animations -->
            <div class="mb-3">
                <label class="block text-xs font-semibold text-blue-600 mb-1">Transform</label>
                <div class="grid grid-cols-3 gap-2">
                    <button class="animation-preset-btn" data-anim="rotate">Rotate</button>
                    <button class="animation-preset-btn" data-anim="swing">Swing</button>
                    <button class="animation-preset-btn" data-anim="bounce">Bounce</button>
                    <button class="animation-preset-btn" data-anim="shake">Shake</button>
                    <button class="animation-preset-btn" data-anim="pulse">Pulse</button>
                    <button class="animation-preset-btn" data-anim="breathe">Breathe</button>
                </div>
            </div>

            <!-- Effect Animations -->
            <div class="mb-3">
                <label class="block text-xs font-semibold text-green-600 mb-1">Effects</label>
                <div class="grid grid-cols-3 gap-2">
                    <button class="animation-preset-btn" data-anim="blur">Blur</button>
                    <button class="animation-preset-btn" data-anim="flicker">Flicker</button>
                    <button class="animation-preset-btn" data-anim="wiggly">Wiggly</button>
                    <button class="animation-preset-btn" data-anim="pop">Pop</button>
                    <button class="animation-preset-btn" data-anim="rainbow">Rainbow</button>
                </div>
            </div>
        </div>

        <!-- Animation Properties -->
        <div id="animation-properties" class="space-y-4 pt-4 border-t hidden">
            <h4 id="animation-properties-title" class="text-xs font-semibold text-gray-700 flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
                </svg>
                Animation Properties
            </h4>
            
            <div class="space-y-3">
                <!-- Intensity -->
                <div class="space-y-2">
                    <label class="block text-xs font-medium text-gray-600 mb-1">Intensity</label>
                    <div class="flex items-center space-x-2">
                        <input type="range" id="animation-intensity" min="1" max="100" value="50" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider">
                        <span id="animation-intensity-value" class="text-xs text-gray-600 min-w-[35px]">50%</span>
                    </div>
                </div>

                <!-- Duration -->
                <div class="space-y-2">
                    <label class="block text-xs font-medium text-gray-600 mb-1">Duration</label>
                    <div class="flex items-center space-x-2">
                        <input type="range" id="animation-duration" min="0.5" max="10" step="0.1" value="2" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider">
                        <span id="animation-duration-value" class="text-xs text-gray-600 min-w-[35px]">2.0s</span>
                    </div>
                </div>

                <!-- Easing -->
                <div class="space-y-2">
                    <label class="block text-xs font-medium text-gray-600 mb-1">Easing</label>
                    <select id="animation-easing" class="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                        <option value="linear">Linear</option>
                        <option value="easeIn">Ease In</option>
                        <option value="easeOut" selected>Ease Out</option>
                        <option value="easeInOut">Ease In Out</option>
                        <option value="easeInCubic">Ease In Cubic</option>
                        <option value="easeOutCubic">Ease Out Cubic</option>
                        <option value="easeInOutCubic">Ease In Out Cubic</option>
                        <option value="bounce">Bounce</option>
                        <option value="elastic">Elastic</option>
                    </select>
                </div>
            </div>
        </div>
        
        <!-- Animation Preview -->
        <div id="animation-preview-controls" class="pt-4 border-t">
            <button id="play-animation-btn" class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2 shadow-sm">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path></svg>
                <span>Preview Animation</span>
            </button>
        </div>
        
        <!-- GIF Export -->
        <div id="animation-export-controls" class="pt-4 border-t">
             <button id="export-gif-btn" class="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm transform hover:scale-105">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 3.5a1.5 1.5 0 01.588 2.91l-2.01 1.005a3.501 3.501 0 00-4.032.57 1.5 1.5 0 11-2.12-.137 6.5 6.5 0 017.38-1.182l2.36-1.18a1.5 1.5 0 01-1.176-2.986zM15.5 6a1.5 1.5 0 012.122-.137 6.5 6.5 0 01-1.182 7.38l-1.005 2.01a1.5 1.5 0 01-2.91-.588l1.18-2.36a3.5 3.5 0 00-.57-4.032 1.5 1.5 0 01.137-2.122zM3.5 10a1.5 1.5 0 01.588-2.91l2.01-1.005a3.5 3.5 0 004.032-.57 1.5 1.5 0 112.12.137 6.5 6.5 0 01-7.38 1.182L3.51 9.24a1.5 1.5 0 01-.01-2.23z"></path></svg>
                <span>Export as GIF</span>
            </button>
            
            <!-- Enhanced Progress Bar -->
            <div id="gif-progress-container" class="relative hidden mt-3">
                <div class="w-full bg-gray-200 rounded-full h-5 overflow-hidden">
                    <div id="gif-progress-bar" class="bg-gradient-to-r from-purple-500 to-purple-600 h-5 rounded-full transition-all duration-300 flex items-center justify-center" style="width: 0%">
                        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
                    </div>
                </div>
                <p id="gif-progress-text" class="absolute inset-0 text-center text-xs font-bold text-gray-700 flex items-center justify-center">0%</p>
            </div>

            <!-- Tips -->
            <div class="mt-3 p-2 bg-blue-50 rounded-lg">
                <p class="text-xs text-blue-700">
                    <svg class="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                    </svg>
                    💡 Select a text/sticker layer first, then choose an animation and click preview!
                </p>
            </div>
        </div>
    </div>
</div>

<style>
.animation-preset-btn {
    @apply flex items-center justify-center p-2 bg-white hover:bg-purple-50 border border-gray-200 rounded-lg text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 hover:border-purple-300 hover:shadow-sm transform hover:scale-105;
}
.animation-preset-btn.active {
    @apply bg-gradient-to-r from-purple-100 to-purple-200 border-purple-400 ring-2 ring-purple-500 text-purple-800 shadow-md scale-105;
}

/* Custom slider styles */
.slider::-webkit-slider-thumb {
    @apply appearance-none w-4 h-4 bg-purple-500 rounded-full cursor-pointer;
}

.slider::-moz-range-thumb {
    @apply w-4 h-4 bg-purple-500 rounded-full cursor-pointer border-0;
}

.slider:focus {
    @apply outline-none ring-2 ring-purple-500 ring-opacity-50;
}

/* Progress bar animation */
@keyframes progressPulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.7; }
}
</style> 