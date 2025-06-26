<div class="relative bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden min-w-full min-h-full">
    <div id="canvas-container" class="relative w-full h-full flex items-center justify-center p-4">
        <canvas id="main-canvas" class="max-w-full max-h-full border border-gray-200 rounded-lg shadow-sm hidden"></canvas>
        <div id="upload-placeholder" class="text-center p-12">
            <div class="border-2 border-dashed border-gray-300 rounded-2xl p-12 bg-gradient-to-br from-gray-50 to-gray-100">
                <div class="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                    </svg>
                </div>
                <h3 class="text-xl font-semibold text-gray-700 mb-2">Upload Your Image</h3>
                <p class="text-gray-500 mb-4">Drag and drop an image here, or click "Upload" to get started</p>
                <div class="flex justify-center space-x-2 text-xs text-gray-400">
                    <span>JPG</span>
                    <span>•</span>
                    <span>PNG</span>
                    <span>•</span>
                    <span>GIF</span>
                    <span>•</span>
                    <span>WebP</span>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Advanced Crop Overlay -->
    <div id="crop-overlay" class="absolute inset-0 hidden pointer-events-none">
        <!-- Dark overlay to dim non-selected area -->
        <div id="crop-mask" class="absolute inset-0 bg-black bg-opacity-50"></div>
        
        <!-- Crop selection with dotted border -->
        <div id="crop-selection" class="absolute border-2 border-dashed border-white bg-transparent pointer-events-auto" style="box-shadow: 0 0 0 1px rgba(0,0,0,0.3);">
            <!-- Corner handles -->
            <div class="crop-handle absolute w-3 h-3 bg-white border border-gray-400 -top-1.5 -left-1.5 cursor-nw-resize hover:bg-blue-100"></div>
            <div class="crop-handle absolute w-3 h-3 bg-white border border-gray-400 -top-1.5 -right-1.5 cursor-ne-resize hover:bg-blue-100"></div>
            <div class="crop-handle absolute w-3 h-3 bg-white border border-gray-400 -bottom-1.5 -left-1.5 cursor-sw-resize hover:bg-blue-100"></div>
            <div class="crop-handle absolute w-3 h-3 bg-white border border-gray-400 -bottom-1.5 -right-1.5 cursor-se-resize hover:bg-blue-100"></div>
            
            <!-- Edge handles for resizing -->
            <div class="crop-handle absolute w-3 h-1 bg-white border border-gray-400 -top-0.5 left-1/2 transform -translate-x-1/2 cursor-n-resize hover:bg-blue-100"></div>
            <div class="crop-handle absolute w-1 h-3 bg-white border border-gray-400 -right-0.5 top-1/2 transform -translate-y-1/2 cursor-e-resize hover:bg-blue-100"></div>
            <div class="crop-handle absolute w-3 h-1 bg-white border border-gray-400 -bottom-0.5 left-1/2 transform -translate-x-1/2 cursor-s-resize hover:bg-blue-100"></div>
            <div class="crop-handle absolute w-1 h-3 bg-white border border-gray-400 -left-0.5 top-1/2 transform -translate-y-1/2 cursor-w-resize hover:bg-blue-100"></div>
            
            <!-- Move handle (center) -->
            <div id="crop-move-handle" class="absolute inset-0 cursor-move"></div>
            
            <!-- Rule of thirds grid (optional) -->
            <div id="crop-grid" class="absolute inset-0 pointer-events-none hidden">
                <!-- Vertical lines -->
                <div class="absolute w-px h-full bg-white bg-opacity-40 left-1/3"></div>
                <div class="absolute w-px h-full bg-white bg-opacity-40 left-2/3"></div>
                <!-- Horizontal lines -->
                <div class="absolute w-full h-px bg-white bg-opacity-40 top-1/3"></div>
                <div class="absolute w-full h-px bg-white bg-opacity-40 top-2/3"></div>
            </div>
        </div>
    </div>
</div> 