import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Recibe el enlace del correo de recuperación y abre una sesión temporal
// para que la persona pueda elegir una contraseña nueva.
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const siguiente = searchParams.get("next") ?? "/auth/nueva-contrasena";
  const destino = siguiente.startsWith("/") && !siguiente.startsWith("//")
    ? siguiente
    : "/auth/nueva-contrasena";

  const supabase = await createClient();
  let error: unknown = new Error("enlace inválido");

  if (code) {
    ({ error } = await supabase.auth.exchangeCodeForSession(code));
  } else if (tokenHash && type) {
    ({ error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash }));
  }

  const url = request.nextUrl.clone();
  url.search = "";
  if (error) {
    url.pathname = "/login";
    url.searchParams.set("enlace", "invalido");
  } else {
    url.pathname = destino;
  }
  return NextResponse.redirect(url);
}
