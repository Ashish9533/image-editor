<div class="p-4 border-b">
    <div class="flex items-center justify-between mb-4">
        <div class="flex space-x-2">
            <button id="upload-btn" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                Upload Image
            </button>
            <button id="save-btn" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50" disabled>
                Save Image
            </button>
            <button id="reset-btn" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50" disabled>
                Reset
            </button>
        </div>
        <div class="flex space-x-2">
            <button id="undo-btn" class="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded disabled:opacity-50" disabled>
                ↶ Undo
            </button>
            <button id="redo-btn" class="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded disabled:opacity-50" disabled>
                ↷ Redo
            </button>
        </div>
    </div>
    <input type="file" id="image-upload" accept="image/*" class="hidden">
</div> 