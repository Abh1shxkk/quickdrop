import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase-server";

// GET profile info
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
      .select("name, bot_connected")
      .eq("id", user.id)
      .single();

    return NextResponse.json({
      email: user.email,
      name: profile?.name || user.user_metadata?.name || "",
      botConnected: profile?.bot_connected || false,
    });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// PATCH update profile
export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, currentPassword, newPassword } = body;

    // Update name in profiles table
    if (name !== undefined) {
      const serviceClient = createServiceClient();
      await serviceClient
        .from("profiles")
        .upsert({ id: user.id, name })
        .eq("id", user.id);

      // Also update user metadata
      await supabase.auth.updateUser({ data: { name } });
    }

    // Update email
    if (email && email !== user.email) {
      const { error: emailError } = await supabase.auth.updateUser({ email });
      if (emailError) {
        return NextResponse.json({ error: emailError.message }, { status: 400 });
      }
    }

    // Update password
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password is required" },
          { status: 400 }
        );
      }

      // Verify current password by re-authenticating
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: currentPassword,
      });

      if (signInError) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 400 }
        );
      }

      const { error: passError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (passError) {
        return NextResponse.json({ error: passError.message }, { status: 400 });
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
