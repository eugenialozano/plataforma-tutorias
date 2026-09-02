"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface EstadoAnexo6 {
  error?: string;
  guardado?: boolean;
}

const CAMPOS_TEXTO = [
  "numero_control",
  "carrera",
  "semestre",
  "apellido_paterno",
  "apellido_materno",
  "nombres",
  "sexo",
  "lugar_nacimiento",
  "estado_civil",
  "telefono_domicilio",
  "celular1",
  "celular2",
  "domicilio_actual",
  "escolaridad_previa",
  "nombre_institucion_previa",
  "tipo_beca",
  "vive_con",
  "nombre_empresa",
  "horario_trabajo",
  "escolaridad_padre",
  "escolaridad_madre",
  "trabajo_padre",
  "trabajo_madre",
  "contacto_emergencia_nombre",
  "contacto_emergencia_telefono",
] as const;

export async function guardarAnexo6(
  _estadoPrevio: EstadoAnexo6,
  formData: FormData,
): Promise<EstadoAnexo6> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Sesión expirada, vuelve a iniciar sesión." };

  const datos: Record<string, unknown> = { id: user.id };

  for (const campo of CAMPOS_TEXTO) {
    const valor = formData.get(campo);
    datos[campo] = valor ? String(valor).trim() || null : null;
  }

  const fechaNacimiento = formData.get("fecha_nacimiento");
  datos.fecha_nacimiento = fechaNacimiento ? String(fechaNacimiento) : null;

  const numeroHijos = formData.get("numero_hijos");
  datos.numero_hijos = numeroHijos ? Number(numeroHijos) : null;

  datos.becado = formData.get("becado") === "si";
  datos.trabaja = formData.get("trabaja") === "si";
  datos.padre_vive = formData.get("padre_vive") === "si";
  datos.madre_vive = formData.get("madre_vive") === "si";

  const { error } = await supabase.from("tutorado").upsert(datos);

  if (error) {
    return { error: `No se pudo guardar: ${error.message}` };
  }

  revalidatePath("/anexo6");
  return { guardado: true };
}
