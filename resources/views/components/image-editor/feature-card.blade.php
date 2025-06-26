@props(['icon', 'title', 'description'])

<div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-gray-200/50">
    <div class="text-4xl mb-4">{{ $icon }}</div>
    <h3 class="text-xl font-bold text-gray-800 mb-2">{{ $title }}</h3>
    <p class="text-gray-600 leading-relaxed">{{ $description }}</p>
</div> 