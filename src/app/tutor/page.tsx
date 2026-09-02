import { redirect } from "next/navigation";
import { obtenerUsuarioYPerfil } from "@/lib/auth/perfil-actual";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/app-shell";
import type { Grupo, Perfil, Tutorado } from "@/types/database";

export default async function PaginaTutor() {
  const sesion = await obtenerUsuarioYPerfil();
  if (!sesion) redirect("/login");
  const { perfil, userId } = sesion;
  if (!perfil) redirect("/dashboard");
  if (perfil.rol !== "tutor") redirect("/dashboard");

  const supabase = await createClient();
  const { data: grupos } = await supabase
    .from("grupo")
    .select("*")
    .eq("tutor_id", userId)
    .order("ciclo_escolar", { ascending: false })
    .returns<Grupo[]>();

  const idsGrupos = (grupos ?? []).map((g) => g.id);

  let tutorados: Tutorado[] = [];
  let perfiles: Perfil[] = [];

  if (idsGrupos.length > 0) {
    const { data: tutoradosData } = await supabase
      .from("tutorado")
      .select("*")
      .in("grupo_id", idsGrupos)
      .returns<Tutorado[]>();
    tutorados = tutoradosData ?? [];

    if (tutorados.length > 0) {
      const { data: perfilesData } = await supabase
        .from("perfil")
        .select("*")
        .in("id", tutorados.map((t) => t.id))
        .returns<Perfil[]>();
      perfiles = perfilesData ?? [];
    }
  }

  const perfilPorId = new Map(perfiles.map((p) => [p.id, p]));

  return (
    <AppShell perfil={perfil}>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Mi grupo</h1>

      {(grupos ?? []).length === 0 && (
        <p className="mt-4 text-sm text-zinc-500">
          Todavía no tienes grupos asignados. Pide a coordinación de tutorías que te asigne uno.
        </p>
      )}

      {(grupos ?? []).map((grupo) => {
        const tutoradosDelGrupo = tutorados.filter((t) => t.grupo_id === grupo.id);
        return (
          <div key={grupo.id} className="mt-8">
            <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
              {grupo.carrera} · Semestre {grupo.semestre} · {grupo.ciclo_escolar}
            </h2>
            <table className="mt-3 w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
                  <th className="py-2 font-medium">Tutorado</th>
                  <th className="py-2 font-medium">Correo</th>
                  <th className="py-2 font-medium">Anexo 6 (ficha)</th>
                </tr>
              </thead>
              <tbody>
                {tutoradosDelGrupo.map((tutorado) => {
                  const p = perfilPorId.get(tutorado.id);
                  const completo = Boolean(tutorado.apellido_paterno && tutorado.numero_control);
                  return (
                    <tr key={tutorado.id} className="border-b border-zinc-100 dark:border-zinc-900">
                      <td className="py-2">
                        {tutorado.apellido_paterno
                          ? `${tutorado.apellido_paterno} ${tutorado.apellido_materno ?? ""} ${tutorado.nombres ?? ""}`
                          : p?.nombre_completo ?? "—"}
                      </td>
                      <td className="py-2 text-zinc-500">{p?.email ?? "—"}</td>
                      <td className="py-2">
                        <span
                          className={
                            completo
                              ? "rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                              : "rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                          }
                        >
                          {completo ? "Completo" : "Pendiente"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {tutoradosDelGrupo.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-4 text-zinc-500">
                      Ningún tutorado asignado a este grupo todavía.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );
      })}
    </AppShell>
  );
}
