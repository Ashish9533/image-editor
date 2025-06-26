<div class="tool-panel" id="sticker-panel">
    <h3 class="font-semibold text-gray-800 mb-3 flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        Stickers
    </h3>
    
    <div class="space-y-3">
        <div class="grid grid-cols-4 gap-2" id="sticker-grid">
            <button class="sticker-btn bg-yellow-100 hover:bg-yellow-200 p-2 rounded text-lg" data-sticker="😀">😀</button>
            <button class="sticker-btn bg-yellow-100 hover:bg-yellow-200 p-2 rounded text-lg" data-sticker="😍">😍</button>
            <button class="sticker-btn bg-yellow-100 hover:bg-yellow-200 p-2 rounded text-lg" data-sticker="🎉">🎉</button>
            <button class="sticker-btn bg-yellow-100 hover:bg-yellow-200 p-2 rounded text-lg" data-sticker="❤️">❤️</button>
            <button class="sticker-btn bg-yellow-100 hover:bg-yellow-200 p-2 rounded text-lg" data-sticker="⭐">⭐</button>
            <button class="sticker-btn bg-yellow-100 hover:bg-yellow-200 p-2 rounded text-lg" data-sticker="🔥">🔥</button>
            <button class="sticker-btn bg-yellow-100 hover:bg-yellow-200 p-2 rounded text-lg" data-sticker="👍">👍</button>
            <button class="sticker-btn bg-yellow-100 hover:bg-yellow-200 p-2 rounded text-lg" data-sticker="✨">✨</button>
            <button class="sticker-btn bg-yellow-100 hover:bg-yellow-200 p-2 rounded text-lg" data-sticker="🌈">🌈</button>
            <button class="sticker-btn bg-yellow-100 hover:bg-yellow-200 p-2 rounded text-lg" data-sticker="🎈">🎈</button>
            <button class="sticker-btn bg-yellow-100 hover:bg-yellow-200 p-2 rounded text-lg" data-sticker="🎊">🎊</button>
            <button class="sticker-btn bg-yellow-100 hover:bg-yellow-200 p-2 rounded text-lg" data-sticker="🎯">🎯</button>
        </div>
        
        <div id="sticker-controls" class="space-y-2 hidden">
            <label class="block text-xs text-gray-600">Size</label>
            <input type="range" id="sticker-size" min="20" max="100" value="40" class="w-full">
            <span id="sticker-size-value" class="text-xs text-gray-600">40px</span>
        </div>
    </div>
</div> 