<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

Route::get('/', function () {
    return view('welcome');
});

Route::get('image-editor',function(){
    return view('image-editor');
});

// Image Browser Routes
Route::get('/image-browser', function () {
    return view('image-browser');
})->name('image.browser');

Route::get('/api/images', function () {
    $imageDirectory = public_path('images');
    
    // Create directory if it doesn't exist
    if (!File::exists($imageDirectory)) {
        File::makeDirectory($imageDirectory, 0755, true);
    }
    
    $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];
    $images = [];
    
    if (File::exists($imageDirectory)) {
        $files = File::files($imageDirectory);
        
        foreach ($files as $file) {
            $extension = strtolower($file->getExtension());
            if (in_array($extension, $allowedExtensions)) {
                $filename = $file->getFilename();
                $images[] = [
                    'name' => $filename,
                    'path' => '/images/' . $filename,
                    'size' => $file->getSize(),
                    'modified' => $file->getMTime(),
                    'extension' => $extension
                ];
            }
        }
    }
    
    // Sort by modification time (newest first)
    usort($images, function($a, $b) {
        return $b['modified'] - $a['modified'];
    });
    
    return response()->json($images);
})->name('api.images.list');

Route::post('/api/images/save', function (Request $request) {
    try {
        $imageData = $request->input('image_data');
        $originalName = $request->input('original_name', 'edited-image');
        $filename = $request->input('filename');
        
        // Remove the data URL prefix
        if (strpos($imageData, 'data:image/') === 0) {
            $imageData = substr($imageData, strpos($imageData, ',') + 1);
        }
        
        // Decode base64 image
        $decodedImage = base64_decode($imageData);
        
        if ($decodedImage === false) {
            return response()->json(['error' => 'Invalid image data'], 400);
        }
        
        // Generate filename if not provided
        if (!$filename) {
            $timestamp = now()->format('Y-m-d_H-i-s');
            $filename = "edited_{$originalName}_{$timestamp}.png";
        }
        
        // Ensure filename has proper extension
        if (!pathinfo($filename, PATHINFO_EXTENSION)) {
            $filename .= '.png';
        }
        
        $imageDirectory = public_path('images');
        $imagePath = $imageDirectory . '/' . $filename;
        
        // Create directory if it doesn't exist
        if (!File::exists($imageDirectory)) {
            File::makeDirectory($imageDirectory, 0755, true);
        }
        
        // Save the image
        if (File::put($imagePath, $decodedImage)) {
            return response()->json([
                'success' => true,
                'filename' => $filename,
                'path' => '/images/' . $filename,
                'message' => 'Image saved successfully!'
            ]);
        } else {
            return response()->json(['error' => 'Failed to save image'], 500);
        }
        
    } catch (\Exception $e) {
        return response()->json(['error' => 'Error saving image: ' . $e->getMessage()], 500);
    }
})->name('api.images.save');

Route::delete('/api/images/{filename}', function ($filename) {
    try {
        $imagePath = public_path('images/' . $filename);
        
        if (File::exists($imagePath)) {
            File::delete($imagePath);
            return response()->json(['success' => true, 'message' => 'Image deleted successfully']);
        } else {
            return response()->json(['error' => 'Image not found'], 404);
        }
    } catch (\Exception $e) {
        return response()->json(['error' => 'Error deleting image: ' . $e->getMessage()], 500);
    }
})->name('api.images.delete');