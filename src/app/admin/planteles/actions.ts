"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface EstadoPlantel {
  error?: string;
}

export async function crearPlantel(
  _estadoPrevio: EstadoPlantel,
  formData: FormData,
): Promise<EstadoPlantel> {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const clave = String(formData.get("clave") ?? "").trim();

  if (!nombre) return { error: "El nombre del plantel es obligatorio." };

  const supabase = await createClient();
  const { error } = await supabase.from("plantel").insert({
    nombre,
    clave: clave || null,
  });

  if (error) return { error: `No se pudo crear: ${error.message}` };

  revalidatePath("/admin/planteles");
  return {};
}
