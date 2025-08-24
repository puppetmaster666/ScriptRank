// lib/profile-utils.ts
// Profile picture handling utilities with size validation

/**
 * Compress and resize image to optimal size
 */
export async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Calculate new dimensions (max 500x500)
        let width = img.width;
        let height = img.height;
        const maxSize = 500;
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convert to base64 with compression
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
        resolve(compressedBase64);
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Validate file size and type
 */
export function validateProfileImage(file: File): {
  valid: boolean;
  error?: string;
  warning?: string;
} {
  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Please upload a valid image file (JPEG, PNG, GIF, or WebP)'
    };
  }
  
  // Check file size
  const maxSize = 5 * 1024 * 1024; // 5MB
  const warningSize = 1 * 1024 * 1024; // 1MB
  
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large! Maximum size is 5MB (your file: ${(file.size / 1024 / 1024).toFixed(2)}MB)`
    };
  }
  
  if (file.size > warningSize) {
    return {
      valid: true,
      warning: `Large file (${(file.size / 1024 / 1024).toFixed(2)}MB). Image will be compressed for better performance.`
    };
  }
  
  return { valid: true };
}
