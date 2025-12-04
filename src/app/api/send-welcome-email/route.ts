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
      name,
      role
    } = await request.json();

    if (!toEmail || !name) {
      return NextResponse.json({ error: "Email and name are required" }, { status: 400 });
    }

    // Role mapping to Turkish
    const roleMap: { [key: string]: string } = {
      learner: "Öğrenci (Genç / Yetişkin)",
      parent: "Ebeveyn",
      school: "Okul / Eğitimci",
      partner: "Potansiyel Partner",
      other: "Diğer"
    };
    const roleText = roleMap[role] || "Değerli Kullanıcı";

    // Send welcome email
    const { data, error } = await resend.emails.send({
      from: "Scrollio <info@scrollio.co>",
      to: toEmail,
      subject: "Aramıza Hoş Geldiniz! 🎉 | Scrollio Waitlist",
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
                <span style="background: linear-gradient(135deg, #f97316, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                  Scrollio
                </span>
              </h1>
            </div>
            
            <!-- Main Content -->
            <div style="background: linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(168, 85, 247, 0.1)); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 30px; margin-bottom: 30px;">
              <h2 style="color: #ffffff; font-size: 24px; margin: 0 0 20px 0; text-align: center;">
                🎉 Aramıza Hoş Geldiniz, ${name}!
              </h2>
              
              <p style="color: #9090a0; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Scrollio waitlist'ine kaydınızı aldık! Merak ve öğrenme tutkunuzu paylaştığınız için teşekkür ederiz.
              </p>
              
              <p style="color: #9090a0; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                <strong style="color: #ffffff;">${roleText}</strong> olarak, Scrollio'nun size özel öğrenme deneyimini ilk keşfedenlerden biri olacaksınız.
              </p>

              <!-- What's Next -->
              <div style="background: rgba(255,255,255,0.03); border-radius: 15px; padding: 20px; margin-bottom: 25px;">
                <h3 style="color: #ffffff; font-size: 18px; margin: 0 0 15px 0;">📬 Sırada Ne Var?</h3>
                <ul style="color: #9090a0; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li style="margin-bottom: 10px;">Beta sürümü hazır olduğunda size haber vereceğiz</li>
                  <li style="margin-bottom: 10px;">Özel güncellemeler ve içerikler paylaşacağız</li>
                  <li style="margin-bottom: 10px;">Ürünü şekillendirmemize yardımcı olabilirsiniz</li>
                  <li>Erken erişim avantajlarından yararlanacaksınız</li>
                </ul>
              </div>
            </div>
            
            <!-- CTA -->
            <div style="text-align: center; margin-bottom: 30px;">
              <p style="color: #9090a0; font-size: 14px; margin: 0 0 15px 0;">
                Scrollio hakkında daha fazla bilgi edinin
              </p>
              <a href="https://scrollio.co" style="display: inline-block; background: linear-gradient(135deg, #f97316, #a855f7); color: white; text-decoration: none; padding: 15px 35px; border-radius: 30px; font-weight: 600; font-size: 16px;">
                Scrollio'yu Keşfet
              </a>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
              <p style="color: #6b7280; font-size: 12px; margin: 0 0 10px 0;">
                Bize ulaşmak isterseniz: <a href="mailto:info@scrollio.co" style="color: #f97316; text-decoration: none;">info@scrollio.co</a>
              </p>
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
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

    console.log("Welcome email sent successfully:", data);
    return NextResponse.json({ success: true, emailId: data?.id });

  } catch (error) {
    console.error("Welcome email sending error:", error);
    return NextResponse.json(
      { error: "Email sending failed", details: String(error) },
      { status: 500 }
    );
  }
}

