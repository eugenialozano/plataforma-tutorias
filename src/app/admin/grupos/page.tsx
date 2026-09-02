import { redirect } from "next/navigation";
import { obtenerUsuarioYPerfil } from "@/lib/auth/perfil-actual";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/app-shell";
import { GrupoForm } from "./grupo-form";
import type { Grupo, Perfil } from "@/types/database";

export default async function PaginaGrupos() {
  const sesion = await obtenerUsuarioYPerfil();
  if (!sesion) redirect("/login");
  const { perfil } = sesion;
  if (!perfil) redirect("/dashboard");
  if (perfil.rol !== "admin" && perfil.rol !== "coordinador") redirect("/dashboard");

  const supabase = await createClient();
  const [{ data: grupos }, { data: tutores }] = await Promise.all([
    supabase
      .from("grupo")
      .select("*")
      .eq("plantel_id", perfil.plantel_id ?? "")
      .order("ciclo_escolar", { ascending: false })
      .returns<Grupo[]>(),
    supabase
      .from("perfil")
      .select("*")
      .eq("plantel_id", perfil.plantel_id ?? "")
      .eq("rol", "tutor")
      .returns<Perfil[]>(),
  ]);

  const tutoresPorId = new Map((tutores ?? []).map((t) => [t.id, t.nombre_completo]));

  return (
    <AppShell perfil={perfil}>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Grupos</h1>

      {!perfil.plantel_id && (
        <p className="mt-4 text-sm text-amber-600">
          Tu cuenta no tiene un plantel asignado; pide a un administrador que te lo asigne antes
          de crear grupos.
        </p>
      )}

      {perfil.plantel_id && (
        <div className="mt-6">
          <GrupoForm tutores={tutores ?? []} />
        </div>
      )}

      <table className="mt-8 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
            <th className="py-2 font-medium">Carrera</th>
            <th className="py-2 font-medium">Semestre</th>
            <th className="py-2 font-medium">Ciclo escolar</th>
            <th className="py-2 font-medium">Tutor</th>
          </tr>
        </thead>
        <tbody>
          {(grupos ?? []).map((grupo) => (
            <tr key={grupo.id} className="border-b border-zinc-100 dark:border-zinc-900">
              <td className="py-2">{grupo.carrera}{grupo.nombre ? ` · ${grupo.nombre}` : ""}</td>
              <td className="py-2">{grupo.semestre}</td>
              <td className="py-2">{grupo.ciclo_escolar}</td>
              <td className="py-2 text-zinc-500">
                {grupo.tutor_id ? tutoresPorId.get(grupo.tutor_id) ?? "—" : "Sin asignar"}
              </td>
            </tr>
          ))}
          {(grupos ?? []).length === 0 && (
            <tr>
              <td colSpan={4} className="py-4 text-zinc-500">
                Aún no hay grupos registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </AppShell>
  );
}
