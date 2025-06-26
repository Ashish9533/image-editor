<!-- Image Editor Modal -->
<div id="image-editor-modal" class="hidden fixed inset-0 z-50 overflow-hidden">
    <!-- Modal Overlay -->
    <div id="modal-overlay" class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
    
    <!-- Modal Container -->
    <div class="relative w-full h-full flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">
            
            <!-- Modal Header -->
            <div class="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <div class="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                    </div>
                    <div>
                        <h2 class="text-xl font-bold">Advanced Image Editor</h2>
                        <p class="text-gray-300 text-sm">Professional editing tools</p>
                    </div>
                </div>
                
                <!-- Header Controls -->
                <div class="flex items-center space-x-3">
                    <x-image-editor.main-toolbar />
                    <button id="close-modal" class="w-10 h-10 bg-red-500/20 hover:bg-red-500/30 rounded-lg flex items-center justify-center transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
            </div>
            
            <!-- Modal Body -->
            <div class="flex flex-1 overflow-hidden">
                
                <!-- Left Sidebar - Tools -->
                <div class="w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto">
                    <div class="p-4 space-y-4">
                        <!-- Tool Tabs -->
                        <div class="grid grid-cols-5 gap-1 bg-gray-200 p-1 rounded-lg">
                            <button class="tool-tab active px-3 py-2 rounded text-sm font-medium" data-tool="crop">
                                <svg class="w-4 h-4 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                </svg>
                                <span class="text-xs">Crop</span>
                            </button>
                            <button class="tool-tab px-3 py-2 rounded text-sm font-medium" data-tool="text">
                                <svg class="w-4 h-4 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"/>
                                </svg>
                                <span class="text-xs">Text</span>
                            </button>
                            <button class="tool-tab px-3 py-2 rounded text-sm font-medium" data-tool="sticker">
                                <svg class="w-4 h-4 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <span class="text-xs">Stickers</span>
                            </button>
                            <button class="tool-tab px-3 py-2 rounded text-sm font-medium" data-tool="layers">
                                <svg class="w-4 h-4 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                                </svg>
                                <span class="text-xs">Layers</span>
                            </button>
                            <button class="tool-tab px-3 py-2 rounded text-sm font-medium" data-tool="filters">
                                <svg class="w-4 h-4 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"/>
                                </svg>
                                <span class="text-xs">Filters</span>
                            </button>
                        </div>
                        
                        <!-- Tool Panels -->
                        <div class="tool-content">
                            <div id="tool-crop" class="tool-panel-content">
                                <x-image-editor.crop-panel />
                            </div>
                            <div id="tool-text" class="tool-panel-content hidden">
                                <x-image-editor.text-panel />
                            </div>
                            <div id="tool-sticker" class="tool-panel-content hidden">
                                <x-image-editor.sticker-panel />
                            </div>
                            <div id="tool-layers" class="tool-panel-content hidden">
                                <x-image-editor.layers-panel />
                            </div>
                            <div id="tool-filters" class="tool-panel-content hidden">
                                <x-image-editor.filters-panel />
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Center - Canvas Area -->
                <div class="flex-1 bg-gray-100 flex items-center justify-center p-6">
                    <x-image-editor.canvas-area />
                </div>
                
                <!-- Right Sidebar - Properties -->
                <div class="w-64 bg-white border-l border-gray-200 overflow-y-auto">
                    <div class="p-4">
                        <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                            Properties
                        </h3>
                        
                        <!-- Image Info -->
                        <div id="image-info" class="bg-gray-50 rounded-lg p-3 mb-4 hidden">
                            <h4 class="font-medium text-gray-700 mb-2">Image Details</h4>
                            <div class="text-sm text-gray-600 space-y-1">
                                <div>Dimensions: <span id="image-dimensions">-</span></div>
                                <div>File Size: <span id="image-size">-</span></div>
                                <div>Format: <span id="image-format">-</span></div>
                            </div>
                        </div>
                        
                        <!-- Quick Actions -->
                        <div class="space-y-3">
                            <button class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                                Reset to Original
                            </button>
                            <button class="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                                Auto Enhance
                            </button>
                            <button class="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                                Apply All Filters
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Modal Footer -->
            <div class="bg-gray-50 border-t border-gray-200 p-4 flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <div class="text-sm text-gray-600">
                        <span id="canvas-zoom">100%</span> zoom
                    </div>
                    <div class="flex space-x-2">
                        <button class="zoom-btn p-2 bg-white border border-gray-300 rounded hover:bg-gray-50" data-zoom="out">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"/>
                            </svg>
                        </button>
                        <button class="zoom-btn p-2 bg-white border border-gray-300 rounded hover:bg-gray-50" data-zoom="in">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/>
                            </svg>
                        </button>
                        <button class="zoom-btn p-2 bg-white border border-gray-300 rounded hover:bg-gray-50" data-zoom="fit">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <div class="flex space-x-3">
                    <button id="download-btn" class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50" disabled>
                        Download Image
                    </button>
                    <button id="close-modal-footer" class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors">
                        Close Editor
                    </button>
                </div>
            </div>
        </div>
    </div>
</div> 