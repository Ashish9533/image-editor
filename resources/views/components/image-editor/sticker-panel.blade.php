<div class="tool-panel" id="sticker-panel">
    <h3 class="font-semibold text-gray-800 mb-3 flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        Stickers
    </h3>

    <div class="space-y-4">
        <div>
            <label class="block text-xs font-medium text-gray-600 mb-2">Select a sticker to add</label>
            <div class="grid grid-cols-5 gap-2" id="sticker-grid">
                 <button class="sticker-btn bg-gray-100 hover:bg-purple-100 p-2 rounded-lg text-2xl transition-all duration-150 transform hover:scale-110" data-sticker="😀">😀</button>
                 <button class="sticker-btn bg-gray-100 hover:bg-purple-100 p-2 rounded-lg text-2xl transition-all duration-150 transform hover:scale-110" data-sticker="😍">😍</button>
                 <button class="sticker-btn bg-gray-100 hover:bg-purple-100 p-2 rounded-lg text-2xl transition-all duration-150 transform hover:scale-110" data-sticker="🎉">🎉</button>
                 <button class="sticker-btn bg-gray-100 hover:bg-purple-100 p-2 rounded-lg text-2xl transition-all duration-150 transform hover:scale-110" data-sticker="❤️">❤️</button>
                 <button class="sticker-btn bg-gray-100 hover:bg-purple-100 p-2 rounded-lg text-2xl transition-all duration-150 transform hover:scale-110" data-sticker="⭐">⭐</button>
                 <button class="sticker-btn bg-gray-100 hover:bg-purple-100 p-2 rounded-lg text-2xl transition-all duration-150 transform hover:scale-110" data-sticker="🔥">🔥</button>
                 <button class="sticker-btn bg-gray-100 hover:bg-purple-100 p-2 rounded-lg text-2xl transition-all duration-150 transform hover:scale-110" data-sticker="👍">👍</button>
                 <button class="sticker-btn bg-gray-100 hover:bg-purple-100 p-2 rounded-lg text-2xl transition-all duration-150 transform hover:scale-110" data-sticker="✨">✨</button>
                 <button class="sticker-btn bg-gray-100 hover:bg-purple-100 p-2 rounded-lg text-2xl transition-all duration-150 transform hover:scale-110" data-sticker="🌈">🌈</button>
                 <button class="sticker-btn bg-gray-100 hover:bg-purple-100 p-2 rounded-lg text-2xl transition-all duration-150 transform hover:scale-110" data-sticker="🎈">🎈</button>
            </div>
             <p class="text-xs text-gray-500 mt-2">Click a sticker, then click on the canvas to place it.</p>
        </div>
        
        <div id="sticker-controls" class="space-y-4 hidden pt-4 border-t">
            <h4 class="text-xs font-semibold text-gray-700">Selected Sticker Properties</h4>

            <div class="space-y-2">
                <label class="block text-xs font-medium text-gray-600 mb-1">Size (<span id="sticker-size-value">50px</span>)</label>
                <input type="range" id="sticker-size" min="10" max="200" value="50" class="w-full">
            </div>

            <div class="space-y-2">
                <label class="block text-xs font-medium text-gray-600 mb-1">Rotation (<span id="sticker-rotation-value">0°</span>)</label>
                <input type="range" id="sticker-rotation" min="-180" max="180" value="0" class="w-full">
            </div>

            <div class="space-y-2">
                <label class="block text-xs font-medium text-gray-600 mb-1">Opacity (<span id="sticker-opacity-value">100%</span>)</label>
                <input type="range" id="sticker-opacity" min="0" max="100" value="100" class="w-full">
            </div>
            
            <div class="flex space-x-2 pt-2">
                <button id="sticker-duplicate" title="Duplicate selected sticker" class="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-2 rounded text-xs font-medium transition-colors flex items-center justify-center space-x-1">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M7 3a1 1 0 011-1h3a1 1 0 011 1v1h1a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2h1V3zm2 2v2H7a1 1 0 00-1 1v8a1 1 0 001 1h8a1 1 0 001-1V6a1 1 0 00-1-1h-2V5H9z" clip-rule="evenodd" fill-rule="evenodd"></path></svg>
                    <span>Duplicate</span>
                </button>
                <button id="sticker-delete" title="Delete selected sticker" class="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-2 rounded text-xs font-medium transition-colors flex items-center justify-center space-x-1">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 5a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zM4 9a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zm1 4a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
                    <span>Delete</span>
                </button>
            </div>
        </div>
    </div>
</div>

<style>
.sticker-btn {
    @apply flex items-center justify-center text-2xl p-1 bg-white hover:bg-purple-100 border border-gray-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500;
}
</style> 