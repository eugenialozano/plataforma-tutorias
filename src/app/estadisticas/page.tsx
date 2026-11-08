import { redirect } from "next/navigation";
import { obtenerUsuarioYPerfil } from "@/lib/auth/perfil-actual";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/app-shell";
import type { Grupo } from "@/types/database";

type Sexo = "Femenino" | "Masculino" | "Sin dato";

// El campo "sexo" del Anexo 6 es texto libre: se agrupan las variantes comunes.
function normalizarSexo(valor: string | null): Sexo {
  const v = (valor ?? "").trim().toLowerCase();
  if (["f", "femenino", "mujer", "fem"].includes(v)) return "Femenino";
  if (["m", "masculino", "hombre", "masc"].includes(v)) return "Masculino";
  return "Sin dato";
}

const SEXOS: Sexo[] = ["Femenino", "Masculino", "Sin dato"];

function contar(filas: { sexo: string | null }[]) {
  const cuenta: Record<Sexo, number> = { Femenino: 0, Masculino: 0, "Sin dato": 0 };
  for (const f of filas) cuenta[normalizarSexo(f.sexo)] += 1;
  return cuenta;
}

function Barras({ cuenta, total }: { cuenta: Record<Sexo, number>; total: number }) {
  return (
    <ul className="space-y-2">
      {SEXOS.map((sexo) => {
        const pct = total ? Math.round((cuenta[sexo] / total) * 100) : 0;
        return (
          <li key={sexo} className="flex items-center gap-3 text-sm">
            <span className="w-24 text-zinc-600 dark:text-zinc-400">{sexo}</span>
            <div className="h-3 flex-1 rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div className="h-3 rounded-full bg-zinc-700 dark:bg-zinc-300" style={{ width: `${pct}%` }} />
            </div>
            <span className="w-24 text-right tabular-nums text-zinc-900 dark:text-zinc-50">
              {cuenta[sexo]} ({pct}%)
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export default async function PaginaEstadisticas() {
  const sesion = await obtenerUsuarioYPerfil();
  if (!sesion) redirect("/login");
  const { perfil } = sesion;
  if (!perfil) redirect("/dashboard");
  if (perfil.rol !== "tutor" && perfil.rol !== "coordinador" && perfil.rol !== "admin") {
    redirect("/dashboard");
  }

  // Las políticas de seguridad (RLS) ya limitan qué tutorados ve cada rol.
  const supabase = await createClient();
  const [{ data: tutorados }, { data: grupos }] = await Promise.all([
    supabase
      .from("tutorado")
      .select("grupo_id, sexo, apellido_paterno, numero_control")
      .not("grupo_id", "is", null)
      .returns<{ grupo_id: string; sexo: string | null; apellido_paterno: string | null; numero_control: string | null }[]>(),
    supabase.from("grupo").select("*").order("carrera").returns<Grupo[]>(),
  ]);

  const filas = tutorados ?? [];
  const total = filas.length;
  const fichasCompletas = filas.filter((f) => f.apellido_paterno && f.numero_control).length;
  const general = contar(filas);

  return (
    <AppShell perfil={perfil}>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Estadísticas</h1>
      <p className="mt-1 text-sm text-zinc-500">
        {perfil.rol === "tutor" ? "De los tutorados de tus grupos." : "De los tutorados con grupo asignado."}{" "}
        Los datos salen del Anexo 6; quien no lo ha llenado aparece como &quot;Sin dato&quot;.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          <div className="text-xs text-zinc-500">Tutorados</div>
          <div className="text-3xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">{total}</div>
        </div>
        <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          <div className="text-xs text-zinc-500">Anexo 6 completo</div>
          <div className="text-3xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
            {fichasCompletas} <span className="text-base font-normal text-zinc-500">de {total}</span>
          </div>
        </div>
      </div>

      <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-zinc-500">Por sexo</h2>
      <div className="mt-3">
        <Barras cuenta={general} total={total} />
      </div>

      <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-zinc-500">Por sexo y grupo</h2>
      <table className="mt-3 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
            <th className="py-2 font-medium">Grupo</th>
            <th className="py-2 text-right font-medium">Femenino</th>
            <th className="py-2 text-right font-medium">Masculino</th>
            <th className="py-2 text-right font-medium">Sin dato</th>
            <th className="py-2 text-right font-medium">Total</th>
          </tr>
        </thead>
        <tbody>
          {(grupos ?? []).map((g) => {
            const delGrupo = filas.filter((f) => f.grupo_id === g.id);
            const c = contar(delGrupo);
            return (
              <tr key={g.id} className="border-b border-zinc-100 dark:border-zinc-900">
                <td className="py-2">
                  {g.carrera}
                  {g.nombre ? ` · ${g.nombre}` : ""} · Semestre {g.semestre}
                </td>
                <td className="py-2 text-right tabular-nums">{c.Femenino}</td>
                <td className="py-2 text-right tabular-nums">{c.Masculino}</td>
                <td className="py-2 text-right tabular-nums">{c["Sin dato"]}</td>
                <td className="py-2 text-right tabular-nums">{delGrupo.length}</td>
              </tr>
            );
          })}
          {(grupos ?? []).length === 0 && (
            <tr>
              <td colSpan={5} className="py-4 text-zinc-500">
                Aún no hay grupos.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </AppShell>
  );
}
