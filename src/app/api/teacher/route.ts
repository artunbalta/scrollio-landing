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

    const { videoUrl, topicPrompt } = await request.json();

    if (!videoUrl || !topicPrompt) {
      return NextResponse.json(
        { error: "Video URL and topic prompt are required" },
        { status: 400 }
      );
    }

    // Step 1: Generate detailed lesson script with Claude (in English for TTS compatibility)
    console.log("Step 1: Generating lesson script with Claude...");
    console.log("Topic:", topicPrompt);
    
    const llmResult = await fal.subscribe("fal-ai/any-llm", {
      input: {
        model: "anthropic/claude-3.5-sonnet",
        prompt: `You are an experienced teacher. Write a 20-SECOND lesson script about the following topic.

TOPIC: ${topicPrompt}

RULES:
- Script must be exactly 20 seconds when read aloud (approximately 50-60 words)
- Use conversational, natural language
- Address students warmly (Hello children, dear students, etc.)
- Explain the topic simply and clearly
- Be fun and engaging
- Write ONLY the script, no other explanations
- Write in ENGLISH only

WRITE ONLY THE SCRIPT:`,
      },
    });

    const generatedScript = (llmResult.data as { output?: string })?.output || "";
    console.log("Generated script:", generatedScript);

    if (!generatedScript) {
      throw new Error("Failed to generate lesson script");
    }

    // Step 2: Generate audio from the script using Kokoro TTS (English)
    console.log("Step 2: Generating audio with Kokoro TTS...");
    
    const audioResult = await fal.subscribe("fal-ai/kokoro", {
      input: {
        text: generatedScript,
        voice: "am_adam", // Clear male voice
      },
    });

    const audioData = audioResult.data as { audio_url?: string; audio?: { url: string } };
    const audioUrl = audioData.audio_url || audioData.audio?.url;
    console.log("Generated audio URL:", audioUrl);

    if (!audioUrl) {
      console.error("Audio result:", JSON.stringify(audioResult.data));
      throw new Error("Failed to generate audio");
    }

    // Step 3: Lipsync the teacher video with the generated audio using Sync Labs (faster)
    console.log("Step 3: Creating lipsync video with Sync Labs...");
    console.log("Video URL:", videoUrl);
    console.log("Audio URL:", audioUrl);
    
    const lipsyncResult = await fal.subscribe("fal-ai/sync-lipsync", {
      input: {
        video_url: videoUrl,
        audio_url: audioUrl,
      },
    });

    const lipsyncData = lipsyncResult.data as { video?: { url: string }; video_url?: string };
    const finalVideoUrl = lipsyncData.video?.url || lipsyncData.video_url;
    console.log("Generated lipsync video URL:", finalVideoUrl);

    if (!finalVideoUrl) {
      console.error("Lipsync result:", JSON.stringify(lipsyncResult.data));
      throw new Error("Failed to create lipsync video");
    }

    return NextResponse.json({
      success: true,
      generatedScript,
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
