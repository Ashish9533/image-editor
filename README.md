<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

You may also try the [Laravel Bootcamp](https://bootcamp.laravel.com), where you will be guided through building a modern Laravel application from scratch.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

# Image Editor

A modern web-based image editor built with Laravel and vanilla JavaScript. Features include crop, text, stickers, layers, and filters functionality with a component-based approach.

## Features

- **🖼️ Image Upload & Management**
  - Drag & drop or click to upload images
  - Support for common image formats (JPG, PNG, GIF, etc.)

- **✂️ Crop Tool**
  - Free-form cropping
  - Preset aspect ratios (1:1, 4:3, 16:9)
  - Draggable crop selection

- **📝 Text Tool**
  - Add custom text with various fonts
  - Font size, color, and style controls
  - Bold, italic, and underline formatting

- **😀 Sticker Tool**
  - Collection of emoji stickers
  - Adjustable sticker sizes
  - Click-to-place positioning

- **📚 Layer Management**
  - Multiple layer support
  - Layer opacity controls
  - Layer reordering (move up/down)
  - Individual layer visibility toggle

- **🎨 Filter System**
  - Brightness, contrast, and saturation controls
  - Blur and hue rotation effects
  - Preset filters (Grayscale, Sepia, Vintage)
  - Real-time preview

- **↩️ History Management**
  - Undo/Redo functionality
  - Keyboard shortcuts (Ctrl+Z, Ctrl+Y)
  - State preservation

## Installation

1. **Clone the repository:**
   ```bash
   git clone [repository-url]
   cd image-editor
   ```

2. **Install PHP dependencies:**
   ```bash
   composer install
   ```

3. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

4. **Set up environment:**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Build assets:**
   ```bash
   npm run build
   ```

6. **Start the development server:**
   ```bash
   php artisan serve
   ```

7. **Access the application:**
   - Open your browser and navigate to: `http://localhost:8000/image-editor`

## Development

### For development with hot reloading:

```bash
# Terminal 1: Start Laravel server
php artisan serve

# Terminal 2: Start Vite dev server
npm run dev
```

### Project Structure

```
image-editor/
├── resources/
│   ├── views/
│   │   ├── components/
│   │   │   └── image-editor/     # Blade components for UI
│   │   │       ├── main-editor.blade.php
│   │   │       ├── canvas-area.blade.php
│   │   │       ├── crop-panel.blade.php
│   │   │       ├── text-panel.blade.php
│   │   │       ├── sticker-panel.blade.php
│   │   │       ├── layers-panel.blade.php
│   │   │       └── filters-panel.blade.php
│   │   └── image-editor.blade.php # Main page template
│   ├── js/
│   │   └── image-editor/         # JavaScript modules
│   │       ├── ImageEditor.js    # Main controller
│   │       ├── CropTool.js      # Crop functionality
│   │       ├── TextTool.js      # Text functionality  
│   │       ├── StickerTool.js   # Sticker functionality
│   │       ├── LayerManager.js  # Layer management
│   │       ├── FilterTool.js    # Filter effects
│   │       └── HistoryManager.js # Undo/Redo system
│   └── css/
│       └── app.css              # Tailwind CSS + custom styles
└── routes/
    └── web.php                  # Application routes
```

## Usage

### Basic Workflow

1. **Upload an Image:**
   - Click "Upload Image" button
   - Select an image file from your computer
   - The image will appear on the canvas

2. **Crop the Image:**
   - Click "Start Crop" in the Crop panel
   - Select an aspect ratio or use free-form
   - Drag to select the crop area
   - Click "Apply" to crop

3. **Add Text:**
   - Click "Add Text" in the Text panel
   - Click on the canvas where you want the text
   - Type your text and customize formatting
   - Adjust font, size, color, and style

4. **Add Stickers:**
   - Select a sticker from the Stickers panel
   - Adjust the size with the slider
   - Click on the canvas to place the sticker

5. **Apply Filters:**
   - Use the sliders in the Filters panel
   - Try preset filters for quick effects
   - All changes are applied in real-time

6. **Manage Layers:**
   - View all layers in the Layers panel
   - Adjust opacity for individual layers
   - Reorder or delete layers as needed

7. **Save Your Work:**
   - Click "Save Image" to download the edited image
   - Use "Undo/Redo" to navigate through your edit history

### Keyboard Shortcuts

- `Ctrl + Z` - Undo last action
- `Ctrl + Y` or `Ctrl + Shift + Z` - Redo last undone action

## Architecture

### Component-Based Approach

The image editor uses Laravel's Blade component system for the UI, providing:
- **Modularity:** Each tool has its own component
- **Reusability:** Components can be easily reused or modified
- **Maintainability:** Clear separation of concerns

### JavaScript Module System

Each functionality is implemented as a separate ES6 module:
- **ImageEditor.js:** Main controller that orchestrates all tools
- **Individual Tool Modules:** Focused, single-responsibility classes
- **Manager Classes:** Handle cross-cutting concerns like layers and history

### State Management

- **Layer System:** Manages multiple image elements with opacity and ordering
- **History Management:** Tracks state changes for undo/redo functionality
- **Filter System:** Real-time CSS filter application with permanent application option

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open-sourced software licensed under the [MIT license](LICENSE).

## Technical Details

### Canvas Management
- Uses HTML5 Canvas API for image manipulation
- Supports high-DPI displays
- Efficient redrawing system

### Performance Optimizations
- Lazy loading of tool modules
- Debounced filter applications
- Efficient layer rendering

### Data Flow
1. User interaction triggers tool-specific handlers
2. Tools update their internal state
3. Layer manager coordinates changes
4. History manager captures state snapshots
5. Canvas is redrawn with new state
