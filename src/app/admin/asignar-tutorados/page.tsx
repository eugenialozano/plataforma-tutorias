import { redirect } from "next/navigation";
import { obtenerUsuarioYPerfil } from "@/lib/auth/perfil-actual";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/app-shell";
import { AsignarForm } from "./asignar-form";
import type { Grupo, Perfil } from "@/types/database";

export default async function PaginaAsignarTutorados() {
  const sesion = await obtenerUsuarioYPerfil();
  if (!sesion) redirect("/login");
  const { perfil } = sesion;
  if (!perfil) redirect("/dashboard");
  if (perfil.rol !== "admin") redirect("/dashboard");

  const supabase = await createClient();
  const [{ data: tutorados }, { data: grupos }, { data: filas }] = await Promise.all([
    supabase
      .from("perfil")
      .select("*")
      .eq("rol", "tutorado")
      .order("nombre_completo")
      .returns<Perfil[]>(),
    supabase
      .from("grupo")
      .select("*")
      .eq("plantel_id", perfil.plantel_id ?? "")
      .order("ciclo_escolar", { ascending: false })
      .returns<Grupo[]>(),
    supabase.from("tutorado").select("id, grupo_id").returns<{ id: string; grupo_id: string | null }[]>(),
  ]);

  const grupoPorTutorado = new Map((filas ?? []).map((f) => [f.id, f.grupo_id]));

  return (
    <AppShell perfil={perfil}>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Asignar tutorados a un grupo
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Elige el grupo de cada tutorado. El tutor de ese grupo podrá ver su avance.
      </p>

      {(grupos ?? []).length === 0 && (
        <p className="mt-4 text-sm text-amber-600">
          Tu plantel aún no tiene grupos. Crea uno primero en la sección Grupos.
        </p>
      )}

      <table className="mt-6 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
            <th className="py-2 font-medium">Nombre</th>
            <th className="py-2 font-medium">Correo</th>
            <th className="py-2 font-medium">Grupo</th>
          </tr>
        </thead>
        <tbody>
          {(tutorados ?? []).map((t) => (
            <tr key={t.id} className="border-b border-zinc-100 dark:border-zinc-900">
              <td className="py-2">{t.nombre_completo}</td>
              <td className="py-2 text-zinc-500">{t.email}</td>
              <td className="py-2">
                <AsignarForm
                  tutoradoId={t.id}
                  grupoActualId={grupoPorTutorado.get(t.id) ?? null}
                  grupos={grupos ?? []}
                />
              </td>
            </tr>
          ))}
          {(tutorados ?? []).length === 0 && (
            <tr>
              <td colSpan={3} className="py-4 text-zinc-500">
                No hay cuentas con rol tutorado todavía.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </AppShell>
  );
}
