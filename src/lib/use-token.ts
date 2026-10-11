"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./auth";
import { createClient } from "./supabase";

export function useToken() {
  const { user } = useAuth();
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const local = localStorage.getItem("qd_token") || "";

      if (user) {
        const supabase = createClient();
        const { data } = await supabase
          .from("user_tokens")
          .select("bot_token")
          .eq("user_id", user.id)
          .single();

        if (data?.bot_token) {
          setToken(data.bot_token);
          localStorage.setItem("qd_token", data.bot_token);
        } else if (local) {
          // Guest had a token, sync to cloud on first login
          await supabase.from("user_tokens").upsert({
            user_id: user.id,
            bot_token: local,
            updated_at: new Date().toISOString(),
          });
          setToken(local);
        }
      } else {
        setToken(local);
      }
      setIsLoading(false);
    };
    load();
  }, [user]);

  const saveToken = async (t: string) => {
    setToken(t);
    localStorage.setItem("qd_token", t);

    if (user) {
      const supabase = createClient();
      await supabase.from("user_tokens").upsert({
        user_id: user.id,
        bot_token: t,
        updated_at: new Date().toISOString(),
      });
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
