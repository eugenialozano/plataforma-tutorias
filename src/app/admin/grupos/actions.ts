"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { obtenerUsuarioYPerfil } from "@/lib/auth/perfil-actual";

export interface EstadoGrupo {
  error?: string;
}

export async function crearGrupo(
  _estadoPrevio: EstadoGrupo,
  formData: FormData,
): Promise<EstadoGrupo> {
  const sesion = await obtenerUsuarioYPerfil();
  if (!sesion?.perfil?.plantel_id) {
    return { error: "Tu cuenta no tiene un plantel asignado." };
  }

  const carrera = String(formData.get("carrera") ?? "").trim();
  const semestre = String(formData.get("semestre") ?? "").trim();
  const cicloEscolar = String(formData.get("ciclo_escolar") ?? "").trim();
  const nombre = String(formData.get("nombre") ?? "").trim();
  const tutorId = String(formData.get("tutor_id") ?? "").trim();

  if (!carrera || !semestre || !cicloEscolar) {
    return { error: "Carrera, semestre y ciclo escolar son obligatorios." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("grupo").insert({
    plantel_id: sesion.perfil.plantel_id,
    carrera,
    semestre,
    ciclo_escolar: cicloEscolar,
    nombre: nombre || null,
    tutor_id: tutorId || null,
  });

  if (error) return { error: `No se pudo crear: ${error.message}` };

  revalidatePath("/admin/grupos");
  return {};
}
