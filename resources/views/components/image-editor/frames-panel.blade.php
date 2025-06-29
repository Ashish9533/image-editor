<div id="frames-panel" class="space-y-4">
    <!-- Frame Type -->
    <div>
        <h3 class="font-semibold text-gray-800 mb-2">Frame Type</h3>
        <div class="grid grid-cols-3 gap-2">
            <button id="frame-type-solid" class="frame-type-btn p-2 bg-white border rounded-lg hover:border-blue-500 ring-2 ring-blue-500" data-type="solid">
                <div class="w-full h-10 bg-gray-800 rounded"></div>
                <div class="text-xs mt-1">Solid</div>
            </button>
            <button id="frame-type-gradient" class="frame-type-btn p-2 bg-white border rounded-lg hover:border-blue-500" data-type="gradient">
                <div class="w-full h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded"></div>
                <div class="text-xs mt-1">Gradient</div>
            </button>
            <button id="frame-type-pattern" class="frame-type-btn p-2 bg-white border rounded-lg hover:border-blue-500" data-type="pattern">
                <img src="{{ asset('images/patterns/pattern1.png') }}" class="w-full h-10 object-cover rounded">
                <div class="text-xs mt-1">Pattern</div>
            </button>
        </div>
    </div>

    <!-- Source Options -->
    <div id="source-options" class="space-y-2 border-t pt-4 mt-4">
        <!-- Solid Color Options -->
        <div id="solid-color-options" class="space-y-2">
            <label for="frame-color" class="text-sm font-medium">Frame Color</label>
            <input type="color" id="frame-color" value="#000000" class="w-full h-10 p-1 border rounded-lg">
        </div>

        <!-- Gradient Options -->
        <div id="gradient-options" class="hidden space-y-2">
            <div class="grid grid-cols-2 gap-2">
                <div>
                    <label for="gradient-color-1" class="text-xs font-medium">Color 1</label>
                    <input type="color" id="gradient-color-1" value="#4F46E5" class="w-full h-8 p-1 border rounded-lg">
                </div>
                <div>
                    <label for="gradient-color-2" class="text-xs font-medium">Color 2</label>
                    <input type="color" id="gradient-color-2" value="#EC4899" class="w-full h-8 p-1 border rounded-lg">
                </div>
            </div>
            <div>
                <label for="gradient-direction" class="text-xs font-medium">Direction</label>
                <select id="gradient-direction" class="w-full p-2 mt-1 text-sm border rounded-lg bg-white">
                    <option value="horizontal">Horizontal</option>
                    <option value="vertical">Vertical</option>
                    <option value="diagonal">Diagonal</option>
                    <option value="radial">Radial</option>
                </select>
            </div>
        </div>

        <!-- Pattern Options -->
        <div id="pattern-options" class="hidden space-y-2">
            <label class="text-sm font-medium">Choose Pattern</label>
            <div class="grid grid-cols-3 gap-2">
                 <button class="frame-option p-1 bg-white border rounded-lg hover:border-blue-500 ring-2 ring-blue-500" data-frame-source="{{ asset('images/patterns/pattern1.png') }}">
                    <img src="{{ asset('images/patterns/pattern1.png') }}" class="w-full h-10 object-cover rounded">
                </button>
                <button class="frame-option p-1 bg-white border rounded-lg hover:border-blue-500" data-frame-source="{{ asset('images/patterns/pattern2.png') }}">
                    <img src="{{ asset('images/patterns/pattern2.png') }}" class="w-full h-10 object-cover rounded">
                </button>
                <button class="frame-option p-1 bg-white border rounded-lg hover:border-blue-500" data-frame-source="{{ asset('images/patterns/pattern3.png') }}">
                    <img src="{{ asset('images/patterns/pattern3.png') }}" class="w-full h-10 object-cover rounded">
                </button>
            </div>
        </div>
    </div>

    <!-- General Properties -->
    <div class="space-y-4 pt-4 mt-4 border-t">
         <div>
            <label class="text-sm font-medium">Frame Shape</label>
            <div class="grid grid-cols-4 gap-2 mt-1">
                <button class="frame-shape-btn p-2 text-xs bg-white border rounded-lg hover:border-blue-500 ring-2 ring-blue-500" data-shape="rectangle">Rect</button>
                <button class="frame-shape-btn p-2 text-xs bg-white border rounded-lg hover:border-blue-500" data-shape="rounded">Rounded</button>
                <button class="frame-shape-btn p-2 text-xs bg-white border rounded-lg hover:border-blue-500" data-shape="ellipse">Ellipse</button>
                <button class="frame-shape-btn p-2 text-xs bg-white border rounded-lg hover:border-blue-500" data-shape="vignette">Vignette</button>
                <button class="frame-shape-btn p-2 text-xs bg-white border rounded-lg hover:border-blue-500" data-shape="wave">Wave</button>
                <button class="frame-shape-btn p-2 text-xs bg-white border rounded-lg hover:border-blue-500" data-shape="jagged">Jagged</button>
                <button class="frame-shape-btn p-2 text-xs bg-white border rounded-lg hover:border-blue-500" data-shape="double">Double</button>
            </div>
        </div>

        <!-- Contextual Shape Properties -->
        <div id="shape-properties" class="space-y-2 pt-2 border-t">
            <!-- Rounded -->
            <div id="prop-rounded" class="hidden space-y-2">
                <label for="prop-corner-radius" class="text-sm font-medium">Corner Radius: <span id="prop-corner-radius-value">20</span>px</label>
                <input type="range" id="prop-corner-radius" min="0" max="100" value="20" class="w-full">
            </div>
            <!-- Wave / Jagged -->
            <div id="prop-wave-jagged" class="hidden space-y-2">
                <div>
                    <label for="prop-frequency" class="text-sm font-medium">Frequency: <span id="prop-frequency-value">20</span></label>
                    <input type="range" id="prop-frequency" min="1" max="100" value="20" class="w-full">
                </div>
                <div>
                    <label for="prop-amplitude" class="text-sm font-medium">Amplitude: <span id="prop-amplitude-value">10</span>px</label>
                    <input type="range" id="prop-amplitude" min="1" max="50" value="10" class="w-full">
                </div>
            </div>
             <!-- Double -->
            <div id="prop-double" class="hidden space-y-2">
                <div>
                    <label for="prop-gap" class="text-sm font-medium">Gap: <span id="prop-gap-value">5</span>px</label>
                    <input type="range" id="prop-gap" min="1" max="50" value="5" class="w-full">
                </div>
            </div>
        </div>

        <div class="space-y-2">
            <div class="flex items-center justify-between">
                <label class="text-sm font-medium">Frame Size</label>
                <button id="lock-frame-size" class="p-1 text-gray-400 hover:bg-blue-100 rounded-full" title="Link sizes">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.596a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                    </svg>
                </button>
            </div>
            <div class="flex items-center space-x-2">
                <label for="frame-size-h" class="text-xs w-10">Horiz</label>
                <input type="range" id="frame-size-h" min="1" max="300" value="50" class="w-full">
                <span id="frame-size-h-value" class="text-sm w-12 text-right">50px</span>
            </div>
            <div class="flex items-center space-x-2">
                <label for="frame-size-v" class="text-xs w-10">Vert</label>
                <input type="range" id="frame-size-v" min="1" max="300" value="50" class="w-full">
                <span id="frame-size-v-value" class="text-sm w-12 text-right">50px</span>
            </div>
        </div>

        <div class="space-y-2">
            <label for="frame-opacity" class="text-sm font-medium">Opacity</label>
            <div class="flex items-center space-x-2">
                <input type="range" id="frame-opacity" min="0" max="100" value="100" class="w-full">
                <span id="frame-opacity-value" class="text-sm w-12 text-right">100%</span>
            </div>
        </div>
        
        <div class="pt-2 border-t">
            <label for="frame-shadow-enable" class="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" id="frame-shadow-enable" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                <span class="text-sm font-medium">Enable Inner Shadow</span>
            </label>
            <div id="shadow-properties" class="hidden space-y-2 mt-2">
                 <div class="grid grid-cols-2 gap-2">
                    <div>
                        <label for="shadow-offset-x" class="text-xs font-medium">Offset X: <span id="shadow-offset-x-value">0</span>px</label>
                        <input type="range" id="shadow-offset-x" min="-20" max="20" value="0" class="w-full">
                    </div>
                    <div>
                        <label for="shadow-offset-y" class="text-xs font-medium">Offset Y: <span id="shadow-offset-y-value">0</span>px</label>
                        <input type="range" id="shadow-offset-y" min="-20" max="20" value="0" class="w-full">
                    </div>
                </div>
                <div>
                    <label for="shadow-blur" class="text-xs font-medium">Blur: <span id="shadow-blur-value">10</span>px</label>
                    <input type="range" id="shadow-blur" min="0" max="50" value="10" class="w-full">
                </div>
                <div>
                    <label for="shadow-color" class="text-xs font-medium">Shadow Color</label>
                    <input type="color" id="shadow-color" value="#000000" class="w-full h-8 p-1 border rounded-lg">
                </div>
            </div>
        </div>

        <div>
            <label for="frame-blend-mode" class="text-sm font-medium">Blend Mode</label>
            <select id="frame-blend-mode" class="w-full p-2 mt-1 text-sm border rounded-lg bg-white">
                <option value="source-over">Normal</option>
                <option value="multiply">Multiply</option>
                <option value="screen">Screen</option>
                <option value="overlay">Overlay</option>
                <option value="darken">Darken</option>
                <option value="lighten">Lighten</option>
                <option value="color-dodge">Color Dodge</option>
                <option value="color-burn">Color Burn</option>
                <option value="hard-light">Hard Light</option>
                <option value="soft-light">Soft Light</option>
                <option value="difference">Difference</option>
                <option value="exclusion">Exclusion</option>
                <option value="hue">Hue</option>
                <option value="saturation">Saturation</option>
                <option value="color">Color</option>
                <option value="luminosity">Luminosity</option>
            </select>
        </div>
    </div>

    <div class="flex space-x-2 pt-4 border-t">
        <button id="apply-frame" class="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">Apply Frame</button>
        <button id="remove-frame" class="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm">Remove Frame</button>
    </div>
</div> 