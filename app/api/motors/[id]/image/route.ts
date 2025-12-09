import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const BUCKET_NAME = "motor-images";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only JPEG, PNG, and WebP are allowed." }, { status: 400 });
    }

    // Validate file size (max 10MB after client-side compression)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File size too large. Max 10MB allowed." }, { status: 400 });
    }

    // Get existing motor to check if image exists
    const { data: motor } = await supabase.from("Motor").select("image").eq("id", parseInt(id)).single();

    // Delete old image if exists
    if (motor?.image) {
      const urlParts = motor.image.split(`/${BUCKET_NAME}/`);
      if (urlParts.length >= 2) {
        const oldFilePath = urlParts[1];
        await supabase.storage.from(BUCKET_NAME).remove([oldFilePath]);
      }
    }

    // Upload new image
    const fileExt = file.name.split(".").pop();
    const fileName = `${id}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage.from(BUCKET_NAME).upload(fileName, file, {
      cacheControl: "3600",
      upsert: true,
    });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
    }

    // Get public URL
    const { data: publicData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);

    // Update motor record with image URL
    const { data: updatedMotor, error: updateError } = await supabase.from("Motor").update({ image: publicData.publicUrl }).eq("id", parseInt(id)).select().single();

    if (updateError) {
      console.error("Update error:", updateError);
      return NextResponse.json({ error: "Failed to update motor record" }, { status: 500 });
    }

    return NextResponse.json({
      message: "Image uploaded successfully",
      imageUrl: publicData.publicUrl,
      motor: updatedMotor,
    });
  } catch (error) {
    console.error("Upload motor image error:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Get motor to get image URL
    const { data: motor } = await supabase.from("Motor").select("image").eq("id", parseInt(id)).single();

    if (!motor?.image) {
      return NextResponse.json({ error: "No image found" }, { status: 404 });
    }

    // Delete image from storage
    const urlParts = motor.image.split(`/${BUCKET_NAME}/`);
    if (urlParts.length >= 2) {
      const filePath = urlParts[1];
      const { error: deleteError } = await supabase.storage.from(BUCKET_NAME).remove([filePath]);

      if (deleteError) {
        console.error("Delete error:", deleteError);
        return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
      }
    }

    // Update motor record to remove image URL
    const { error: updateError } = await supabase.from("Motor").update({ image: null }).eq("id", parseInt(id));

    if (updateError) {
      console.error("Update error:", updateError);
      return NextResponse.json({ error: "Failed to update motor record" }, { status: 500 });
    }

    return NextResponse.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Delete motor image error:", error);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
