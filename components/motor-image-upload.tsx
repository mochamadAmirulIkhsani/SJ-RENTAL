"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { compressImage, formatFileSize, validateImageFile } from "@/lib/image-utils";

interface MotorImageUploadProps {
  motorId: number;
  currentImageUrl?: string | null;
  onUploadSuccess?: (imageUrl: string) => void;
}

export function MotorImageUpload({ motorId, currentImageUrl, onUploadSuccess }: MotorImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(currentImageUrl || null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file, 10); // Allow up to 10MB before compression
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    setOriginalSize(file.size);
    setCompressing(true);

    try {
      // Compress image
      const compressedFile = await compressImage(file, 1200, 800, 0.85);
      setCompressedSize(compressedFile.size);
      setSelectedFile(compressedFile);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(compressedFile);
    } catch (error: any) {
      console.error("Compression error:", error);
      alert(error.message || "Failed to process image");
    } finally {
      setCompressing(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(`/api/motors/${motorId}/image`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setImageUrl(data.imageUrl);
      setPreviewUrl(null);
      setSelectedFile(null);

      if (onUploadSuccess) {
        onUploadSuccess(data.imageUrl);
      }

      alert("Image uploaded successfully!");
    } catch (error: any) {
      console.error("Upload error:", error);
      alert(error.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    setDeleting(true);

    try {
      const response = await fetch(`/api/motors/${motorId}/image`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Delete failed");
      }

      setImageUrl(null);
      setPreviewUrl(null);
      setSelectedFile(null);

      if (onUploadSuccess) {
        onUploadSuccess("");
      }

      alert("Image deleted successfully!");
    } catch (error: any) {
      console.error("Delete error:", error);
      alert(error.message || "Failed to delete image");
    } finally {
      setDeleting(false);
    }
  };

  const cancelPreview = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    setOriginalSize(0);
    setCompressedSize(0);
  };

  return (
    <div className="space-y-4">
      <Label>Motor Image</Label>

      {/* Current or Preview Image */}
      {(imageUrl || previewUrl) && (
        <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
          {previewUrl ? <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" /> : imageUrl ? <img src={imageUrl} alt="Motor" className="w-full h-full object-cover" /> : null}

          {imageUrl && !previewUrl && (
            <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={handleDelete} disabled={deleting}>
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
            </Button>
          )}

          {previewUrl && (
            <Button type="button" variant="secondary" size="sm" className="absolute top-2 right-2" onClick={cancelPreview}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {/* No Image Placeholder */}
      {!imageUrl && !previewUrl && (
        <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-400">
            <ImageIcon className="h-12 w-12 mx-auto mb-2" />
            <p className="text-sm">No image uploaded</p>
          </div>
        </div>
      )}

      {/* Compression Info */}
      {originalSize > 0 && compressedSize > 0 && (
        <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
          <p>Original: {formatFileSize(originalSize)}</p>
          <p>Compressed: {formatFileSize(compressedSize)}</p>
          <p className="text-green-600 font-medium">
            Saved: {formatFileSize(originalSize - compressedSize)} ({Math.round(((originalSize - compressedSize) / originalSize) * 100)}%)
          </p>
        </div>
      )}

      {/* Upload Controls */}
      {!previewUrl && (
        <div className="flex items-center gap-2">
          <Input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleFileSelect} disabled={uploading || compressing} />
          {compressing && (
            <div className="flex items-center text-sm text-gray-600">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Compressing...
            </div>
          )}
        </div>
      )}

      {previewUrl && (
        <Button type="button" onClick={handleUpload} disabled={uploading} className="w-full" style={{ backgroundColor: "#1ABC9C" }}>
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload Image
            </>
          )}
        </Button>
      )}

      <p className="text-xs text-gray-500">Accepted formats: JPEG, PNG, WebP. Images will be automatically compressed and resized to max 1200x800px.</p>
    </div>
  );
}
