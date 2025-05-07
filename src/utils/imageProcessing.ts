/**
 * Utility functions for processing images
 */

/**
 * Converts an image to grayscale
 * @param imageUrl - URL of the image to convert
 * @returns Promise with the grayscale image URL
 */
export const convertToGrayscale = async (imageUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw the original image
      ctx.drawImage(img, 0, 0);
      
      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Convert to grayscale
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;     // Red
        data[i + 1] = avg; // Green
        data[i + 2] = avg; // Blue
      }
      
      // Put the grayscale image data back
      ctx.putImageData(imageData, 0, 0);
      
      // Return as data URL
      resolve(canvas.toDataURL('image/jpeg'));
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for grayscale conversion'));
    };
    
    img.src = imageUrl;
  });
};

/**
 * Creates a heatmap visualization of the image
 * @param imageUrl - URL of the image to convert
 * @returns Promise with the heatmap image URL
 */
export const createHeatmap = async (imageUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw the original image
      ctx.drawImage(img, 0, 0);
      
      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Apply heatmap effect (highlight red channel for retinal vessels)
      for (let i = 0; i < data.length; i += 4) {
        // Extract RGB values
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Calculate vessel probability (simplified algorithm)
        // Retinal vessels often appear darker in the green channel
        const vesselProbability = 255 - g;
        
        // Apply color mapping for heatmap
        if (vesselProbability > 180) {
          // High probability (red)
          data[i] = 255;
          data[i + 1] = 0;
          data[i + 2] = 0;
        } else if (vesselProbability > 150) {
          // Medium-high probability (orange)
          data[i] = 255;
          data[i + 1] = 165;
          data[i + 2] = 0;
        } else if (vesselProbability > 120) {
          // Medium probability (yellow)
          data[i] = 255;
          data[i + 1] = 255;
          data[i + 2] = 0;
        } else if (vesselProbability > 90) {
          // Low-medium probability (blue)
          data[i] = 0;
          data[i + 1] = 0;
          data[i + 2] = 255;
        } else {
          // Low probability (black)
          data[i] = 0;
          data[i + 1] = 0;
          data[i + 2] = 0;
        }
      }
      
      // Put the heatmap image data back
      ctx.putImageData(imageData, 0, 0);
      
      // Return as data URL
      resolve(canvas.toDataURL('image/jpeg'));
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for heatmap conversion'));
    };
    
    img.src = imageUrl;
  });
};

// /**
//  * Creates a Grad-CAM heatmap visualization
//  * @param imageUrl - URL of the image to convert
//  * @returns Promise with the Grad-CAM heatmap image URL
//  */
// export const createGradCAM = async (imageUrl: string): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     const img = new Image();
//     img.crossOrigin = 'Anonymous';
//     img.onload = () => {
//       const canvas = document.createElement('canvas');
//       const ctx = canvas.getContext('2d');
      
//       if (!ctx) {
//         reject(new Error('Could not get canvas context'));
//         return;
//       }
      
//       canvas.width = img.width;
//       canvas.height = img.height;
      
//       // Draw the original image
//       ctx.drawImage(img, 0, 0);
      
//       // Get image data
//       const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//       const data = imageData.data;
      
//       // Apply Grad-CAM effect (simulated)
//       for (let i = 0; i < data.length; i += 4) {
//         // Extract RGB values
//         const r = data[i];
//         const g = data[i + 1];
//         const b = data[i + 2];
        
//         // Calculate intensity value (simplified Grad-CAM algorithm)
//         // Look at green channel intensity, which often shows vessel structures
//         const intensity = (g > 100) ? g / 255 : 0.1;
        
//         // Create a viridis-like colormap (blue -> green -> yellow -> red)
//         if (intensity < 0.25) {
//           // Cool blue
//           data[i] = 59;
//           data[i + 1] = 76;
//           data[i + 2] = 192;
//         } else if (intensity < 0.5) {
//           // Teal/cyan
//           data[i] = 44;
//           data[i + 1] = 162;
//           data[i + 2] = 95;
//         } else if (intensity < 0.75) {
//           // Yellow
//           data[i] = 255;
//           data[i + 1] = 211;
//           data[i + 2] = 0;
//         } else {
//           // Hot red
//           data[i] = 255;
//           data[i + 1] = 0;
//           data[i + 2] = 0;
//         }
        
//         // Adjust alpha for better visualization
//         data[i + 3] = Math.max(128, Math.floor(intensity * 255));
//       }

/**
 * Creates a simulated Grad-CAM heatmap visualization
 * @param imageUrl - URL of the image to convert
 * @returns Promise with the Grad-CAM heatmap image URL
 */
export const createGradCAM = async (imageUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // --- Simulate accurate Grad-CAM based on green channel intensity ---
      let maxIntensity = 0;
      let intensities: number[] = [];

      for (let i = 0; i < data.length; i += 4) {
        const g = data[i + 1];
        const intensity = g / 255;
        intensities.push(intensity);
        if (intensity > maxIntensity) maxIntensity = intensity;
      }

      // Normalize intensities to simulate class activation map (ReLU + normalize)
      for (let i = 0; i < intensities.length; i++) {
        intensities[i] = Math.max(0, intensities[i]) / maxIntensity;
      }

      // Apply colormap to simulate Grad-CAM (based on Python heatmap coloring)
      for (let i = 0; i < data.length; i += 4) {
        const intensity = intensities[i / 4];

        let r = 0, g = 0, b = 0;

        if (intensity < 0.25) {
          r = 59; g = 76; b = 192; // Blue
        } else if (intensity < 0.5) {
          r = 68; g = 90; b = 204; // Indigo
        } else if (intensity < 0.75) {
          r = 123; g = 204; b = 196; // Cyan-green
        } else {
          r = 255; g = 0; b = 0; // Hot red
        }

        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
        data[i + 3] = Math.floor(intensity * 255); // Adjust alpha
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL());
    };
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    img.src = imageUrl;
  });
};

      
      // Put the Grad-CAM image data back
      // ctx.putImageData(imageData, 0, 0);
      
      // Return as data URL
      // resolve(canvas.toDataURL('image/jpeg'));
    // };
    
    // img.onerror = () => {
    //   reject(new Error('Failed to load image for Grad-CAM conversion'));
    // };
    
//     img.src = imageUrl;
//   });
// };
