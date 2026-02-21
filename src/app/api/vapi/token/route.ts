import { NextRequest, NextResponse } from "next/server";

const VAPI_PUBLIC_KEY = process.env.VAPI_PUBLIC_KEY;
const VAPI_ASSISTANT_ID_STEVE = process.env.VAPI_ASSISTANT_ID_STEVE;
const VAPI_ASSISTANT_ID_ALBERT = process.env.VAPI_ASSISTANT_ID_ALBERT;

type AssistantName = "steve" | "albert";

export async function POST(request: NextRequest) {
  // Web SDK tarayıcıda Public API Key ister; Private Key sunucu içindir
  if (!VAPI_PUBLIC_KEY) {
    return NextResponse.json(
      {
        error:
          "Vapi Web için VAPI_PUBLIC_KEY gerekli. Dashboard → API Keys bölümünde Public Key'i ekleyin.",
      },
      { status: 500 }
    );
  }

  const body = await request.json();
  const assistant = (body?.assistant ?? "").toLowerCase() as AssistantName;

  if (assistant !== "steve" && assistant !== "albert") {
    return NextResponse.json(
      { error: "Invalid assistant. Use 'steve' or 'albert'." },
      { status: 400 }
    );
  }

  const assistantId =
    assistant === "steve" ? VAPI_ASSISTANT_ID_STEVE : VAPI_ASSISTANT_ID_ALBERT;

  if (!assistantId) {
    return NextResponse.json(
      { error: `Vapi assistant ID for "${assistant}" is not configured` },
      { status: 500 }
    );
  }

  return NextResponse.json({ token: VAPI_PUBLIC_KEY.trim(), assistantId });
}
