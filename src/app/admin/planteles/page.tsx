import { redirect } from "next/navigation";
import { obtenerUsuarioYPerfil } from "@/lib/auth/perfil-actual";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/app-shell";
import { PlantelForm } from "./plantel-form";
import type { Plantel } from "@/types/database";

export default async function PaginaPlanteles() {
  const sesion = await obtenerUsuarioYPerfil();
  if (!sesion) redirect("/login");
  const { perfil } = sesion;
  if (!perfil) redirect("/dashboard");
  if (perfil.rol !== "admin" && perfil.rol !== "coordinador") redirect("/dashboard");

  const supabase = await createClient();
  const { data: planteles } = await supabase
    .from("plantel")
    .select("*")
    .order("nombre")
    .returns<Plantel[]>();

  return (
    <AppShell perfil={perfil}>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Planteles</h1>

      {perfil.rol === "admin" && (
        <div className="mt-6">
          <PlantelForm />
        </div>
      )}

      <table className="mt-8 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
            <th className="py-2 font-medium">Nombre</th>
            <th className="py-2 font-medium">Clave</th>
          </tr>
        </thead>
        <tbody>
          {(planteles ?? []).map((plantel) => (
            <tr key={plantel.id} className="border-b border-zinc-100 dark:border-zinc-900">
              <td className="py-2">{plantel.nombre}</td>
              <td className="py-2 text-zinc-500">{plantel.clave ?? "—"}</td>
            </tr>
          ))}
          {(planteles ?? []).length === 0 && (
            <tr>
              <td colSpan={2} className="py-4 text-zinc-500">
                Aún no hay planteles registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </AppShell>
  );
}
