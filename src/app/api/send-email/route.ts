import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: NextRequest) {
  try {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not found in environment");
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
    }

    const resend = new Resend(RESEND_API_KEY);

    const { 
      toEmail, 
      childName, 
      originalDrawing, 
      mentorImageUrl 
    } = await request.json();

    if (!toEmail || !mentorImageUrl) {
      return NextResponse.json({ error: "Email and mentor image are required" }, { status: 400 });
    }

    // Send email with the mentor image
    const { data, error } = await resend.emails.send({
      from: "Scrollio <info@scrollio.co>",
      to: toEmail,
      subject: `${childName ? childName + "'in" : "Çocuğunuzun"} Scrollio Mentoru Hazır! 🎨`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #0a0a0f; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #ffffff; font-size: 28px; margin: 0;">
                <span style="background: linear-gradient(135deg, #a855f7, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                  Scrollio Kids
                </span>
              </h1>
            </div>
            
            <!-- Main Content -->
            <div style="background: linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.1)); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 30px; margin-bottom: 30px;">
              <h2 style="color: #ffffff; font-size: 24px; margin: 0 0 20px 0; text-align: center;">
                🎉 ${childName ? childName + "'in" : "Çocuğunuzun"} Mentoru Hazır!
              </h2>
              
              <p style="color: #9090a0; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0; text-align: center;">
                Çocuğunuzun hayal gücünden doğan özel mentor karakteri AI tarafından hayata geçirildi!
              </p>
              
              <!-- Mentor Image -->
              <div style="text-align: center; margin-bottom: 25px;">
                <p style="color: #ffffff; font-size: 14px; margin: 0 0 10px 0;">✨ AI Mentor Karakteri</p>
                <img src="${mentorImageUrl}" alt="Mentor Character" style="max-width: 100%; border-radius: 15px; border: 2px solid rgba(168, 85, 247, 0.3);">
              </div>
              
              ${originalDrawing ? `
              <!-- Original Drawing -->
              <div style="text-align: center; margin-bottom: 25px;">
                <p style="color: #ffffff; font-size: 14px; margin: 0 0 10px 0;">🎨 Orijinal Çizim</p>
                <img src="${originalDrawing}" alt="Original Drawing" style="max-width: 200px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1);">
              </div>
              ` : ""}
            </div>
            
            <!-- CTA -->
            <div style="text-align: center; margin-bottom: 30px;">
              <p style="color: #9090a0; font-size: 14px; margin: 0 0 15px 0;">
                Scrollio ile çocuğunuzun öğrenme yolculuğunu keşfedin
              </p>
              <a href="https://scrollio.co" style="display: inline-block; background: linear-gradient(135deg, #a855f7, #ec4899); color: white; text-decoration: none; padding: 15px 35px; border-radius: 30px; font-weight: 600; font-size: 16px;">
                Scrollio'yu Keşfet
              </a>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                Bu email, Scrollio Kids demo deneyiminiz sonucunda gönderilmiştir.<br>
                © 2024 Scrollio. Tüm hakları saklıdır.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    console.log("Email sent successfully:", data);
    return NextResponse.json({ success: true, emailId: data?.id });

  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      { error: "Email sending failed", details: String(error) },
      { status: 500 }
    );
  }
}

