import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const botToken = formData.get("botToken") as string;
    const chatId = formData.get("chatId") as string;
    const text = formData.get("text") as string | null;
    const file = formData.get("file") as File | null;
    const caption = formData.get("caption") as string | null;

    if (!botToken || !chatId) {
      return NextResponse.json({ error: "Bot token and chat ID required" }, { status: 400 });
    }

    const API = `https://api.telegram.org/bot${botToken}`;

    if (text) {
      const res = await fetch(`${API}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
      });
      const data = await res.json();
      if (!data.ok) return NextResponse.json({ error: data.description }, { status: 400 });
      return NextResponse.json({ success: true });
    }

    if (file) {
      const blob = new Blob([Buffer.from(await file.arrayBuffer())], { type: file.type });
      const form = new FormData();
      form.append("chat_id", chatId);
      if (caption) form.append("caption", caption);

      let endpoint = "sendDocument";
      if (file.type.startsWith("image/")) { endpoint = "sendPhoto"; form.append("photo", blob, file.name); }
      else if (file.type.startsWith("video/")) { endpoint = "sendVideo"; form.append("video", blob, file.name); }
      else if (file.type.startsWith("audio/")) { endpoint = "sendAudio"; form.append("audio", blob, file.name); }
      else { form.append("document", blob, file.name); }

      const res = await fetch(`${API}/${endpoint}`, { method: "POST", body: form });
      const data = await res.json();
      if (!data.ok) return NextResponse.json({ error: data.description }, { status: 400 });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Nothing to send" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
