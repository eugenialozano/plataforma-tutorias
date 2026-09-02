import { createClient } from "@/lib/supabase/server";
import type { Perfil } from "@/types/database";

export async function obtenerUsuarioYPerfil(): Promise<{
  userId: string;
  email: string | null;
  perfil: Perfil | null;
} | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: perfil } = await supabase
    .from("perfil")
    .select("*")
    .eq("id", user.id)
    .single();

  return { userId: user.id, email: user.email ?? null, perfil: perfil ?? null };
}
