import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

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
        prompt: `Describe this child's drawing for an artist to recreate as a Pixar 3D character.

List: 1) What creature/character is it 2) ALL colors and where they appear 3) Body shape and parts 4) Face features 5) Any special details like hats, wings, patterns.

Be very specific and faithful to the drawing. Don't add features not present. English only, max 150 words.`,
      },
    });

    const drawingDescription = (visionResult.data as { output?: string })?.output || "A cute cartoon character";
    console.log("Drawing description:", drawingDescription);

    // Step 2: Generate Pixar-style character image using Nano Banana Pro
    console.log("Step 2: Generating mentor character with Nano Banana Pro...");
    
    const imagePrompt = `EXACTLY recreate this character: ${drawingDescription}

IMPORTANT: Keep the EXACT same colors, shapes, and features from the description above.
Render it in cute 3D animated style with soft lighting and white background. 
Do NOT change the character's design, colors, or features.`;

    const imageResult = await fal.subscribe("fal-ai/nano-banana-pro", {
      input: {
        prompt: imagePrompt,
        aspect_ratio: "1:1",
        resolution: "1K",
      },
    });

    const generatedImageUrl = (imageResult.data as { images?: Array<{ url: string }> })?.images?.[0]?.url;
    console.log("Generated mentor image URL:", generatedImageUrl);

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
