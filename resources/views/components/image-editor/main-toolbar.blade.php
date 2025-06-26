<div class="flex items-center space-x-2">
    <button id="upload-btn" title="Upload a new image from your device" class="flex items-center space-x-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg text-sm font-medium transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
        </svg>
        <span>Upload</span>
    </button>
    
    <div class="flex space-x-1">
        <button id="undo-btn" class="p-2 bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 rounded-lg transition-colors disabled:opacity-50" disabled title="Undo (Ctrl+Z)">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
            </svg>
        </button>
        <button id="redo-btn" class="p-2 bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 rounded-lg transition-colors disabled:opacity-50" disabled title="Redo (Ctrl+Y)">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6-6m6 6l-6 6"/>
            </svg>
        </button>
    </div>
    
    <div class="relative" id="save-options-container">
        <button id="save-dropdown-btn" title="Save your image" class="flex items-center space-x-2 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg text-sm font-medium transition-colors disabled:opacity-50" disabled>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
            </svg>
            <span>Save</span>
             <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
        </button>
        <div id="save-options-menu" class="hidden absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg z-50">
            <a href="#" class="save-option block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600" data-format="png">Save as PNG</a>
            <a href="#" class="save-option block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600" data-format="jpeg" data-quality="0.95">Save as JPEG (High)</a>
            <a href="#" class="save-option block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600" data-format="jpeg" data-quality="0.75">Save as JPEG (Med)</a>
        </div>
    </div>
    
    <button id="reset-btn" title="Reset all changes and restore original image" class="flex items-center space-x-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm font-medium transition-colors disabled:opacity-50" disabled>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        <span>Reset</span>
    </button>
    
    <input type="file" id="image-upload" accept="image/*" class="hidden">
</div> 