import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase-server";
import { decrypt } from "@/lib/encryption";

async function getUserBotToken(userId: string): Promise<string | null> {
  const serviceClient = createServiceClient();
  const { data: profile } = await serviceClient
    .from("profiles")
    .select("encrypted_bot_token")
    .eq("id", userId)
    .single();

  if (!profile?.encrypted_bot_token) return null;
  return decrypt(profile.encrypted_bot_token);
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const botToken = await getUserBotToken(user.id);
    if (!botToken) {
      return NextResponse.json(
        { error: "Bot not connected. Go to setup first." },
        { status: 400 }
      );
    }

    const TELEGRAM_API = `https://api.telegram.org/bot${botToken}`;
    const formData = await req.formData();
    const chatId = formData.get("chatId") as string;
    const text = formData.get("text") as string | null;
    const file = formData.get("file") as File | null;
    const caption = formData.get("caption") as string | null;

    if (!chatId) {
      return NextResponse.json({ error: "Chat ID is required" }, { status: 400 });
    }

    // Send text message
    if (text) {
      const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: "HTML",
        }),
      });

      const data = await res.json();
      if (!data.ok) {
        return NextResponse.json({ error: data.description }, { status: 400 });
      }

      return NextResponse.json({ success: true, message: "Text sent" });
    }

    // Send file
    if (file) {
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const blob = new Blob([fileBuffer], { type: file.type });

      const telegramForm = new FormData();
      telegramForm.append("chat_id", chatId);

      if (caption) {
        telegramForm.append("caption", caption);
      }

      let endpoint = "sendDocument";

      if (file.type.startsWith("image/")) {
        endpoint = "sendPhoto";
        telegramForm.append("photo", blob, file.name);
      } else if (file.type.startsWith("video/")) {
        endpoint = "sendVideo";
        telegramForm.append("video", blob, file.name);
      } else if (file.type.startsWith("audio/")) {
        endpoint = "sendAudio";
        telegramForm.append("audio", blob, file.name);
      } else {
        telegramForm.append("document", blob, file.name);
      }

      const res = await fetch(`${TELEGRAM_API}/${endpoint}`, {
        method: "POST",
        body: telegramForm,
      });

      const data = await res.json();
      if (!data.ok) {
        return NextResponse.json({ error: data.description }, { status: 400 });
      }

      return NextResponse.json({ success: true, message: "File sent" });
    }

    return NextResponse.json({ error: "Nothing to send" }, { status: 400 });
  } catch (error) {
    console.error("Send error:", error);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
