@extends('layouts.app')

@section('content')
<div class="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center p-4">
    <div class="max-w-6xl w-full">
        <!-- Hero Section -->
        <div class="text-center mb-8">
            <h1 class="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                Advanced Image Editor
            </h1>
            <p class="text-xl text-gray-600 mb-8">
                Professional image editing tools with layers, filters, and advanced features
            </p>
            
            <!-- Open Editor Button -->
            <button id="open-editor-modal" class="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <span class="flex items-center space-x-3">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                    <span>Open Image Editor</span>
                </span>
                <div class="absolute inset-0 rounded-xl bg-white opacity-20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
            </button>
        </div>

        <!-- Features Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <x-image-editor.feature-card 
                icon="✂️" 
                title="Smart Crop" 
                description="Intelligent cropping with preset ratios and custom selections"
            />
            <x-image-editor.feature-card 
                icon="📝" 
                title="Rich Text" 
                description="Add text with multiple fonts, colors, and styling options"
            />
            <x-image-editor.feature-card 
                icon="😀" 
                title="Stickers" 
                description="Extensive emoji and sticker collection for creative editing"
            />
            <x-image-editor.feature-card 
                icon="📚" 
                title="Layer System" 
                description="Professional multi-layer editing with opacity controls"
            />
            <x-image-editor.feature-card 
                icon="🎨" 
                title="Advanced Filters" 
                description="Real-time filters with professional presets and adjustments"
            />
            <x-image-editor.feature-card 
                icon="↩️" 
                title="Smart History" 
                description="Unlimited undo/redo with intelligent state management"
            />
        </div>
    </div>
</div>

<!-- Advanced Modal -->
<x-image-editor.modal />

@push('scripts')
<script type="module">
    document.addEventListener('DOMContentLoaded', async function() {
        // Initialize modal functionality
        const openBtn = document.getElementById('open-editor-modal');
        const modal = document.getElementById('image-editor-modal');
        const modalOverlay = document.getElementById('modal-overlay');
        
        let imageEditor = null;
        let modalController = null;
        
        // Open modal
        openBtn.addEventListener('click', async () => {
            modal.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');
            
            // Initialize controllers if not already done
            if (!modalController && window.ModalController) {
                modalController = new ModalController();
            }
            
            if (!imageEditor && window.ImageEditor) {
                imageEditor = new ImageEditor();
                if (modalController) {
                    imageEditor.modalController = modalController;
                }
                await imageEditor.init();
            }
        });
        
        // Close modal
        const closeModal = () => {
            modal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        };
        
        modalOverlay.addEventListener('click', closeModal);
        
        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                closeModal();
            }
        });
    });
</script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.js"></script>
@endpush
@endsection 