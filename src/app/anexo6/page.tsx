import { redirect } from "next/navigation";
import { obtenerUsuarioYPerfil } from "@/lib/auth/perfil-actual";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/app-shell";
import { Anexo6Form } from "./anexo6-form";
import type { Tutorado } from "@/types/database";

export default async function PaginaAnexo6() {
  const sesion = await obtenerUsuarioYPerfil();
  if (!sesion) redirect("/login");
  const { perfil, userId } = sesion;
  if (!perfil) redirect("/dashboard");

  if (perfil.rol !== "tutorado") {
    return (
      <AppShell perfil={perfil}>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Esta ficha la llena directamente el tutorado desde su propia cuenta.
        </p>
      </AppShell>
    );
  }

  const supabase = await createClient();
  const { data: tutorado } = await supabase
    .from("tutorado")
    .select("*")
    .eq("id", userId)
    .maybeSingle<Tutorado>();

  return (
    <AppShell perfil={perfil}>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Anexo 6 · Ficha de identificación del tutorado
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Este documento es confidencial; tus respuestas se usan para mejorar el acompañamiento que
        recibes durante tu proceso de tutoría.
      </p>
      <Anexo6Form datos={tutorado ?? null} />
    </AppShell>
  );
}
