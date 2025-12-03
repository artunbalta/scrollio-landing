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

    // Step 1: Generate detailed lesson script with Claude
    console.log("Step 1: Generating lesson script with Claude...");
    
    const llmResult = await fal.subscribe("fal-ai/any-llm", {
      input: {
        model: "anthropic/claude-3.5-sonnet",
        prompt: `Sen deneyimli bir öğretmensin. Aşağıdaki konu hakkında TAM 20 SANİYELİK bir ders scripti yaz.

KONU: ${topicPrompt}

KURALLAR:
- Script tam olarak 20 saniyede okunabilecek uzunlukta olmalı (yaklaşık 50-60 kelime)
- Konuşma dili kullan, doğal ve akıcı olsun
- Öğrencilere hitap et (Merhaba çocuklar, sevgili öğrenciler gibi)
- Konuyu basit ve anlaşılır anlat
- Eğlenceli ve ilgi çekici ol
- Sadece scripti yaz, başka açıklama ekleme
- Türkçe yaz

SADECE SCRIPTİ YAZ:`,
      },
    });

    const generatedScript = (llmResult.data as { output?: string })?.output || "";
    console.log("Generated script:", generatedScript);

    if (!generatedScript) {
      throw new Error("Failed to generate lesson script");
    }

    // Step 2: Generate audio from the script using ElevenLabs
    console.log("Step 2: Generating audio with ElevenLabs...");
    
    const audioResult = await fal.subscribe("fal-ai/elevenlabs/text-to-speech/eleven-v3", {
      input: {
        text: generatedScript,
        voice: "JBFqnCBsd6RMkjVDRZzb", // George - clear male voice good for teaching
        model_id: "eleven_multilingual_v2",
      },
    });

    const audioUrl = (audioResult.data as { audio?: { url: string } })?.audio?.url;
    console.log("Generated audio URL:", audioUrl);

    if (!audioUrl) {
      throw new Error("Failed to generate audio");
    }

    // Step 3: Lipsync the teacher video with the generated audio
    console.log("Step 3: Creating lipsync video...");
    
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
