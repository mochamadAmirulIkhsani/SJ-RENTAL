import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const BUCKET_NAME = "motor-images";

export async function uploadMotorImage(file: File, motorId: number): Promise<string | null> {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${motorId}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

    if (error) {
      console.error("Upload error:", error);
      return null;
    }

    // Get public URL
    const { data: publicData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

    return publicData.publicUrl;
  } catch (error) {
    console.error("Upload error:", error);
    return null;
  }
}

export async function deleteMotorImage(imageUrl: string): Promise<boolean> {
  try {
    // Extract file path from URL
    const urlParts = imageUrl.split(`/${BUCKET_NAME}/`);
    if (urlParts.length < 2) return false;

    const filePath = urlParts[1];

    const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath]);

    if (error) {
      console.error("Delete error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Delete error:", error);
    return false;
  }
}

export function getMotorImageUrl(fileName: string): string {
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);

  return data.publicUrl;
}
