import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

export async function POST(request: NextRequest) {
  try {
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

    const { videoUrl, lessonScript } = await request.json();

    if (!videoUrl || !lessonScript) {
      return NextResponse.json(
        { error: "Video URL and lesson script are required" },
        { status: 400 }
      );
    }

    // Step 1: Generate audio from the lesson script using ElevenLabs
    console.log("Step 1: Generating audio with ElevenLabs...");
    
    const audioResult = await fal.subscribe("fal-ai/elevenlabs/text-to-speech/eleven-v3", {
      input: {
        text: lessonScript,
        voice: "JBFqnCBsd6RMkjVDRZzb", // George - clear male voice good for teaching
        model_id: "eleven_multilingual_v2",
      },
    });

    const audioUrl = (audioResult.data as { audio?: { url: string } })?.audio?.url;
    console.log("Generated audio URL:", audioUrl);

    if (!audioUrl) {
      throw new Error("Failed to generate audio");
    }

    // Step 2: Lipsync the teacher video with the generated audio
    console.log("Step 2: Creating lipsync video...");
    
    const lipsyncResult = await fal.subscribe("creatify/lipsync", {
      input: {
        video_url: videoUrl,
        audio_url: audioUrl,
      },
    });

    const finalVideoUrl = (lipsyncResult.data as { video?: { url: string } })?.video?.url;
    console.log("Generated lipsync video URL:", finalVideoUrl);

    return NextResponse.json({
      success: true,
      audioUrl,
      videoUrl: finalVideoUrl,
    });

  } catch (error) {
    console.error("Teacher video generation error:", error);
    return NextResponse.json(
      { error: "Video generation failed", details: String(error) },
      { status: 500 }
    );
  }
}

