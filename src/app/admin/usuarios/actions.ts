"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { RolUsuario } from "@/types/database";

export interface EstadoUsuario {
  error?: string;
}

const ROLES_VALIDOS: RolUsuario[] = [
  "tutorado",
  "tutor",
  "psicologo",
  "medico",
  "coordinador",
  "admin",
];

export async function actualizarUsuario(
  _estadoPrevio: EstadoUsuario,
  formData: FormData,
): Promise<EstadoUsuario> {
  const perfilId = String(formData.get("perfil_id") ?? "");
  const rol = String(formData.get("rol") ?? "") as RolUsuario;
  const plantelId = String(formData.get("plantel_id") ?? "").trim();

  if (!perfilId || !ROLES_VALIDOS.includes(rol)) {
    return { error: "Datos inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("perfil")
    .update({ rol, plantel_id: plantelId || null })
    .eq("id", perfilId);

  if (error) return { error: `No se pudo actualizar: ${error.message}` };

  revalidatePath("/admin/usuarios");
  return {};
}
