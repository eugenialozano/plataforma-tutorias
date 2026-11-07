"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { obtenerUsuarioYPerfil } from "@/lib/auth/perfil-actual";

export interface EstadoAsignacion {
  error?: string;
  ok?: boolean;
}

export async function asignarTutoradoAGrupo(
  _estadoPrevio: EstadoAsignacion,
  formData: FormData,
): Promise<EstadoAsignacion> {
  const sesion = await obtenerUsuarioYPerfil();
  if (sesion?.perfil?.rol !== "admin") {
    return { error: "Solo un administrador puede asignar tutorados." };
  }

  const tutoradoId = String(formData.get("tutorado_id") ?? "");
  const grupoId = String(formData.get("grupo_id") ?? "").trim();
  if (!tutoradoId) return { error: "Datos inválidos." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("tutorado")
    .upsert({ id: tutoradoId, grupo_id: grupoId || null });

  if (error) return { error: `No se pudo asignar: ${error.message}` };

  revalidatePath("/admin/asignar-tutorados");
  return { ok: true };
}
