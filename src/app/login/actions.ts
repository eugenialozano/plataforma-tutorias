"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface EstadoAuth {
  error?: string;
}

export async function iniciarSesion(
  _estadoPrevio: EstadoAuth,
  formData: FormData,
): Promise<EstadoAuth> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Ingresa tu correo y contraseña." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Correo o contraseña incorrectos." };
  }

  redirect("/dashboard");
}

export async function registrarse(
  _estadoPrevio: EstadoAuth,
  formData: FormData,
): Promise<EstadoAuth> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nombreCompleto = String(formData.get("nombre_completo") ?? "").trim();

  if (!email || !password || !nombreCompleto) {
    return { error: "Completa nombre, correo y contraseña." };
  }
  if (password.length < 8) {
    return { error: "La contraseña debe tener al menos 8 caracteres." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { nombre_completo: nombreCompleto } },
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function cerrarSesion() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
