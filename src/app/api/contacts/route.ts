import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase-server";
import { decrypt } from "@/lib/encryption";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const serviceClient = createServiceClient();
    const { data: profile } = await serviceClient
      .from("profiles")
      .select("encrypted_bot_token")
      .eq("id", user.id)
      .single();

    if (!profile?.encrypted_bot_token) {
      return NextResponse.json({ contacts: [], needsSetup: true });
    }

    const botToken = decrypt(profile.encrypted_bot_token);
    const TELEGRAM_API = `https://api.telegram.org/bot${botToken}`;

    const res = await fetch(`${TELEGRAM_API}/getUpdates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ limit: 100 }),
    });

    const data = await res.json();

    if (!data.ok) {
      return NextResponse.json({ error: data.description }, { status: 400 });
    }

    const chats = new Map<string, { id: number; name: string; type: string }>();

    for (const update of data.result) {
      const msg = update.message || update.edited_message;
      if (!msg?.chat) continue;

      const chat = msg.chat;
      const name =
        chat.title ||
        [chat.first_name, chat.last_name].filter(Boolean).join(" ") ||
        chat.username ||
        `Chat ${chat.id}`;

      chats.set(String(chat.id), {
        id: chat.id,
        name,
        type: chat.type,
      });
    }

    return NextResponse.json({
      contacts: Array.from(chats.values()),
    });
  } catch (error) {
    console.error("Contacts error:", error);
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 });
  }
}
