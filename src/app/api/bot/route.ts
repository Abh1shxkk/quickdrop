import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase-server";
import { encrypt } from "@/lib/encryption";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    // Verify the token by calling Telegram's getMe
    const verifyRes = await fetch(
      `https://api.telegram.org/bot${token}/getMe`
    );
    const verifyData = await verifyRes.json();

    if (!verifyData.ok) {
      return NextResponse.json(
        { error: "Invalid bot token. Please check and try again." },
        { status: 400 }
      );
    }

    // Encrypt and store the token
    const encryptedToken = encrypt(token);
    const serviceClient = createServiceClient();

    const { error: upsertError } = await serviceClient
      .from("profiles")
      .upsert({
        id: user.id,
        name: user.user_metadata?.name || user.email,
        encrypted_bot_token: encryptedToken,
        bot_connected: true,
      });

    if (upsertError) {
      console.error("Profile upsert error:", upsertError);
      return NextResponse.json({ error: "Failed to save token" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      bot: {
        username: verifyData.result.username,
        name: verifyData.result.first_name,
      },
    });
  } catch (error) {
    console.error("Bot setup error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// GET - check if bot is connected
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
      .select("bot_connected, name")
      .eq("id", user.id)
      .single();

    return NextResponse.json({
      connected: profile?.bot_connected || false,
      name: profile?.name || user.user_metadata?.name || user.email,
    });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
