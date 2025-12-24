import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    // Configure fal client inside handler to ensure env is loaded
    const FAL_KEY = process.env.FAL_KEY;
    
    if (!FAL_KEY) {
      console.error("FAL_KEY not found in environment");
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    fal.config({
      credentials: FAL_KEY,
    });

    const { imageBase64, characterImageUrl, learningPrompt, generateVideo, email, childName } = await request.json();

    // If characterImageUrl is provided, skip to video generation
    if (characterImageUrl && generateVideo) {
      console.log("Direct video generation with existing character...");
      
      try {
        const videoResult = await fal.subscribe("fal-ai/sora-2/image-to-video", {
          input: {
            prompt: `A cute animated mentor character teaching a child about ${learningPrompt}. 
            The character is friendly, gently animated, making small movements, looking at the viewer warmly.
            Educational children's video style, colorful background, engaging, fun learning moment.`,
            image_url: characterImageUrl,
          },
        });
        
        const videoUrl = (videoResult.data as { video?: { url: string } })?.video?.url;
        console.log("Generated video URL:", videoUrl);
        
        return NextResponse.json({
          success: true,
          videoUrl,
        });
      } catch (videoError: unknown) {
        console.error("Video generation failed:", videoError);
        // Log full error details
        if (videoError && typeof videoError === 'object') {
          if ('body' in videoError) {
            console.error("Video error body:", JSON.stringify((videoError as { body: unknown }).body, null, 2));
          }
          if ('status' in videoError) {
            console.error("Video error status:", (videoError as { status: number }).status);
          }
          if ('message' in videoError) {
            console.error("Video error message:", (videoError as { message: string }).message);
          }
        }
        const errorDetails = videoError instanceof Error ? videoError.message : String(videoError);
        return NextResponse.json(
          { error: "Video generation failed", details: errorDetails },
          { status: 500 }
        );
      }
    }

    if (!imageBase64) {
      return NextResponse.json(
        { error: "Image is required" },
        { status: 400 }
      );
    }

    // Generate Pixar-style character using Nano Banana Pro (image-to-image)
    console.log("Generating mentor character with Nano Banana Pro image-to-image...");
    
    const pixarPrompt = `Transform the attached hand-drawn character into a high-fidelity 3D mascot in authentic Pixar animation style. The final result should feel as if the character belongs inside a Pixar film universe, with warmth, charm, emotional clarity, and cinematic polish.

Treat the drawing as a strict blueprint. Carefully analyze the drawing before generating the 3D version and preserve the exact silhouette, proportions, shape language, and overall structure. Maintain the original color palette exactly as it appears in the drawing, without reinterpretation or stylistic recoloring. All distinctive details, including facial features, accessories, asymmetries, and unique marks, must remain faithful to the original design.

Identify whether the subject is an animal, human, object, or hybrid and recreate it using soft, rounded Pixar-style 3D geometry. The character should feature large, expressive Pixar-style eyes, subtle facial nuance, and a friendly, emotionally readable personality that matches the mood and intention of the original drawing.

All materials and textures must follow Pixar's stylized realism approach. Fur should appear soft and touchable, petals should feel velvety and layered, and skin should be smooth and matte with a handcrafted feel. Surfaces should look warm and premium, avoiding photorealism or plastic-like finishes while remaining believable and rich in detail.

Use Pixar-style cinematic studio lighting to bring the character to life. The lighting should be soft and flattering, similar to clamshell or butterfly lighting, with gentle global illumination and subtle rim light to separate the character from the background while maintaining a friendly, magical atmosphere.

Enhance the drawing with true 3D depth, soft shadows, and natural dimensionality while staying completely faithful to the original design. Pose the character in a joyful, welcoming, high-energy Pixar-style stance that reinforces personality without altering proportions or structure.

Render the final output as a professional Pixar-quality 3D character reveal with ultra-clean presentation and high detail. Use a simple, whimsical, softly blurred background so the mascot remains the clear focus. The final image should feel like a Pixar movie poster or character introduction, presented with cinematic polish and 8K-level clarity.`;

    const imageResult = await fal.subscribe("fal-ai/nano-banana-pro/edit", {
      input: {
        prompt: pixarPrompt,
        image_urls: [imageBase64],
      },
    });

    const generatedImageUrl = (imageResult.data as { images?: Array<{ url: string }> })?.images?.[0]?.url;
    console.log("Generated mentor image URL:", generatedImageUrl);

    // Save to Supabase - original drawing and mentor image side by side
    if (generatedImageUrl) {
      try {
        const { error: dbError } = await supabase
          .from('drawings')
          .insert({
            original_drawing: imageBase64,
            mentor_image_url: generatedImageUrl,
            drawing_description: "Pixar-style 3D character transformation",
            user_email: email || null,
            child_name: childName || null,
            created_at: new Date().toISOString(),
          });

        if (dbError) {
          console.error("Supabase save error:", dbError);
        } else {
          console.log("Saved drawing pair to Supabase");
        }
      } catch (saveError) {
        console.error("Error saving to Supabase:", saveError);
        // Continue even if save fails
      }
    }

    // Step 3: Generate educational video (only if requested) using Sora 2
    let videoUrl = null;
    
    if (generateVideo && learningPrompt && generatedImageUrl) {
      console.log("Step 3: Generating educational video with Sora 2...");
      
      try {
        const videoResult = await fal.subscribe("fal-ai/sora-2/image-to-video", {
          input: {
            prompt: `A cute animated mentor character teaching a child about ${learningPrompt}. 
            The character is friendly, gently animated, making small movements, looking at the viewer warmly.
            Educational children's video style, colorful background, engaging, fun learning moment.
            The character seems to be explaining something with enthusiasm.`,
            image_url: generatedImageUrl,
          },
        });
        
        videoUrl = (videoResult.data as { video?: { url: string } })?.video?.url;
        console.log("Generated video URL:", videoUrl);
      } catch (videoError: unknown) {
        console.error("Video generation failed:", videoError);
        // Log full error details
        if (videoError && typeof videoError === 'object') {
          if ('body' in videoError) {
            console.error("Video error body:", JSON.stringify((videoError as { body: unknown }).body, null, 2));
          }
          if ('status' in videoError) {
            console.error("Video error status:", (videoError as { status: number }).status);
          }
          if ('message' in videoError) {
            console.error("Video error message:", (videoError as { message: string }).message);
          }
        }
        // Continue without video if it fails
      }
    }

    return NextResponse.json({
      success: true,
      drawingDescription: "Pixar-style 3D character transformation",
      characterImageUrl: generatedImageUrl,
      videoUrl,
    });

  } catch (error: unknown) {
    console.error("Generation error:", error);
    // Log full error details for debugging
    if (error && typeof error === 'object' && 'body' in error) {
      console.error("Error body:", JSON.stringify((error as { body: unknown }).body, null, 2));
    }
    return NextResponse.json(
      { error: "Generation failed", details: String(error) },
      { status: 500 }
    );
  }
}
