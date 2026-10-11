"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "./auth";
import { createClient } from "./supabase";

export function useToken() {
  const { user, loading: authLoading } = useAuth();
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const prevUserId = useRef<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    const load = async () => {
      setIsLoading(true);

      if (user) {
        // User is logged in — always prefer their cloud token
        const supabase = createClient();
        const { data } = await supabase
          .from("user_tokens")
          .select("bot_token")
          .eq("user_id", user.id)
          .single();

        if (data?.bot_token) {
          // Cloud token exists — use it
          setToken(data.bot_token);
        } else {
          // No cloud token yet — check if guest had one to migrate
          const local = localStorage.getItem("qd_token") || "";
          if (local) {
            await supabase.from("user_tokens").upsert({
              user_id: user.id,
              bot_token: local,
              updated_at: new Date().toISOString(),
            });
            setToken(local);
          } else {
            setToken("");
          }
        }
      } else {
        // Guest mode — use localStorage only
        if (prevUserId.current) {
          // Just logged out — clear local token so it doesn't bleed
          localStorage.removeItem("qd_token");
          setToken("");
        } else {
          setToken(localStorage.getItem("qd_token") || "");
        }
      }

      prevUserId.current = user?.id || null;
      setIsLoading(false);
    };

    load();
  }, [user, authLoading]);

  const saveToken = async (t: string) => {
    setToken(t);

    if (user) {
      const supabase = createClient();
      await supabase.from("user_tokens").upsert({
        user_id: user.id,
        bot_token: t,
        updated_at: new Date().toISOString(),
      });
    } else {
      localStorage.setItem("qd_token", t);
    }
  };

  const clearToken = async () => {
    setToken("");
    localStorage.removeItem("qd_token");

    if (user) {
      const supabase = createClient();
      await supabase.from("user_tokens").delete().eq("user_id", user.id);
    }
  };

  return { token, saveToken, clearToken, isLoading };
}
