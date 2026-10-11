import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { botToken } = await req.json();
    if (!botToken) return NextResponse.json({ error: "Bot token required" }, { status: 400 });

    const res = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ limit: 100 }),
    });

    const data = await res.json();
    if (!data.ok) return NextResponse.json({ error: data.description }, { status: 400 });

    const chats = new Map<string, { id: number; name: string; type: string }>();
    for (const update of data.result) {
      const msg = update.message || update.edited_message;
      if (!msg?.chat) continue;
      const c = msg.chat;
      chats.set(String(c.id), {
        id: c.id,
        name: c.title || [c.first_name, c.last_name].filter(Boolean).join(" ") || c.username || `Chat ${c.id}`,
        type: c.type,
      });
    }

    return NextResponse.json({ contacts: Array.from(chats.values()) });
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
