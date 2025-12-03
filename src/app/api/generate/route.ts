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

    const { imageBase64, characterImageUrl, learningPrompt, generateVideo } = await request.json();

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
      } catch (videoError) {
        console.error("Video generation failed:", videoError);
        return NextResponse.json(
          { error: "Video generation failed" },
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

    // Step 1: Analyze the drawing with LLaVA vision model
    console.log("Step 1: Analyzing drawing...");
    
    const visionResult = await fal.subscribe("fal-ai/llava-next", {
      input: {
        image_url: imageBase64,
        prompt: `You are an expert at analyzing children's drawings. Describe this drawing in EXTREME detail for a 3D artist to recreate it EXACTLY.

DESCRIBE PRECISELY:
1. CHARACTER TYPE: What is it? (animal, person, creature, robot, etc.)
2. EXACT COLORS: List EVERY color and EXACTLY where it appears (e.g., "blue body, red hat, yellow eyes")
3. BODY STRUCTURE: Shape, proportions, number of limbs, tail, wings, etc.
4. FACE: Eye shape/color/size, mouth style, nose, expression, any unique features
5. CLOTHING/ACCESSORIES: Hats, glasses, bows, jewelry, patterns on body
6. SPECIAL FEATURES: Spots, stripes, stars, hearts, or any decorations the child added
7. POSE: How is the character standing/sitting/positioned?

BE EXTREMELY FAITHFUL to the original drawing. Include imperfections and childlike qualities.
Do NOT add features that are not in the drawing.
English only, max 200 words.`,
      },
    });

    const drawingDescription = (visionResult.data as { output?: string })?.output || "A cute cartoon character";
    console.log("Drawing description:", drawingDescription);

    // Step 2: Generate Pixar-style character image using Nano Banana Pro
    console.log("Step 2: Generating mentor character with Nano Banana Pro...");
    
    const imagePrompt = `Turn this child's drawing into a fully detailed 3D Pixar-style character.

ORIGINAL DRAWING DESCRIPTION: ${drawingDescription}

CRITICAL REQUIREMENTS:
• Preserve ALL visual elements from the original drawing EXACTLY as they are
• Keep the EXACT colors, proportions, shapes, character features
• Maintain clothing, accessories, symbols, emotions from the drawing
• Keep any imperfections children naturally draw - these add charm
• The final character MUST clearly look like the same character created by the child
• Do NOT redesign or beautify the original intent

PIXAR/DISNEY 3D STYLE:
• Soft global illumination
• Subsurface scattering skin
• Glossy detailed eyes
• Expressive facial features
• Stylized proportions matching the child's drawing
• Smooth, high-poly sculpted body
• Detailed textures and materials
• Cinematic lighting (3-point light setup)
• Warm color palette
• Soft shadows

Pose the character in a friendly, welcoming stance.
Render in ultra-high resolution, full-body, centered, clean white background.`;

    const imageResult = await fal.subscribe("fal-ai/nano-banana-pro", {
      input: {
        prompt: imagePrompt,
        aspect_ratio: "1:1",
        resolution: "1K",
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
            drawing_description: drawingDescription,
            user_session: new Date().toISOString(),
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
      } catch (videoError) {
        console.error("Video generation failed:", videoError);
        // Continue without video if it fails
      }
    }

    return NextResponse.json({
      success: true,
      drawingDescription,
      characterImageUrl: generatedImageUrl,
      videoUrl,
    });

  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: "Generation failed", details: String(error) },
      { status: 500 }
    );
  }
}
