<div id="histogram-panel" class="space-y-4">
    <h3 class="font-semibold text-gray-800 mb-2">Curves & Histogram</h3>

    <div class="space-y-2">
        <label for="histogram-channel-select" class="text-sm font-medium">Channel</label>
        <select id="histogram-channel-select" class="w-full p-2 mt-1 text-sm border rounded-lg bg-white">
            <option value="luminosity" selected>Luminosity</option>
            <option value="red">Red</option>
            <option value="green">Green</option>
            <option value="blue">Blue</option>
        </select>
    </div>

    <div class="relative">
        <canvas id="histogram-canvas" width="280" height="150" class="w-full bg-gray-100 border rounded-lg"></canvas>
        <canvas id="curves-canvas" width="280" height="150" class="absolute top-0 left-0 w-full h-full cursor-crosshair"></canvas>
    </div>
    
    <div class="pt-2 border-t">
        <h4 class="font-medium text-gray-700 mb-2">Channel Statistics</h4>
        <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600">
            <span>Mean:</span><span id="hist-mean" class="font-mono text-right">-</span>
            <span>Median:</span><span id="hist-median" class="font-mono text-right">-</span>
            <span>Std Dev:</span><span id="hist-std-dev" class="font-mono text-right">-</span>
            <span>Pixels:</span><span id="hist-pixels" class="font-mono text-right">-</span>
        </div>
    </div>

    <div class="pt-4 border-t flex space-x-2">
        <button id="reset-curves" class="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm">Reset Curve</button>
        <button id="apply-curves" class="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">Apply</button>
    </div>
</div> 