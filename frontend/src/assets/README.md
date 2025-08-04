# Assets Folder

This folder contains static assets for the MSK Travels application.

## Images

### Package Images
To add package images, save them in the `images/` folder with these names:
- `1day-trip.jpg` - For 1 Day Trip package
- `3day-trip.jpg` - For 3 Days Trip package  
- `5day-trip.jpg` - For 5 Days Trip package

### Vehicle Images
Vehicle images are stored in the Django backend at `backend/media/vehicles/` and served through the API.

### Recommended Image Specifications:
- **Package Images**: 400x300 pixels, JPG format
- **Vehicle Images**: 600x400 pixels, JPG format
- **File Size**: Keep under 500KB for optimal loading

### Where to Find Free Images:
- [Unsplash](https://unsplash.com) - High-quality free photos
- [Pexels](https://pexels.com) - Free stock photos
- [Pixabay](https://pixabay.com) - Free images and illustrations

### Image Usage:
1. Download images related to travel, cars, or destinations
2. Rename them according to the naming convention above
3. Place them in the appropriate folder
4. The application will automatically use these images

## Current Implementation
The application currently uses CSS gradients for package cards, but you can replace them with actual images by:
1. Adding the image files to `src/assets/images/`
2. Importing them in `PackageCatalog.js`
3. Replacing the gradient divs with `<img>` elements 