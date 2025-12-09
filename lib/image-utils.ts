/**
 * Compress and resize image file before upload
 * @param file - Original image file
 * @param maxWidth - Maximum width in pixels (default: 1200)
 * @param maxHeight - Maximum height in pixels (default: 800)
 * @param quality - Image quality 0-1 (default: 0.8)
 * @returns Compressed image file
 */
export async function compressImage(file: File, maxWidth: number = 1200, maxHeight: number = 800, quality: number = 0.8): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;

          if (width > height) {
            width = maxWidth;
            height = width / aspectRatio;
          } else {
            height = maxHeight;
            width = height * aspectRatio;
          }
        }

        // Create canvas and draw resized image
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        // Use better image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to compress image"));
              return;
            }

            // Create new file from blob
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });

            resolve(compressedFile);
          },
          file.type,
          quality
        );
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Format file size to human readable string
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * Validate image file
 * @param file - File to validate
 * @param maxSizeInMB - Maximum file size in MB (default: 5)
 * @returns Validation result
 */
export function validateImageFile(file: File, maxSizeInMB: number = 5): { valid: boolean; error?: string } {
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file type. Only JPEG, PNG, and WebP are allowed.",
    };
  }

  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    return {
      valid: false,
      error: `File size too large. Maximum ${maxSizeInMB}MB allowed.`,
    };
  }

  return { valid: true };
}
