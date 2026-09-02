import { redirect } from "next/navigation";
import { obtenerUsuarioYPerfil } from "@/lib/auth/perfil-actual";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/app-shell";
import { UsuarioRowForm } from "./usuario-row-form";
import type { Perfil, Plantel } from "@/types/database";

export default async function PaginaUsuarios() {
  const sesion = await obtenerUsuarioYPerfil();
  if (!sesion) redirect("/login");
  const { perfil } = sesion;
  if (!perfil) redirect("/dashboard");
  if (perfil.rol !== "admin" && perfil.rol !== "coordinador") redirect("/dashboard");

  const supabase = await createClient();
  const [{ data: usuarios }, { data: planteles }] = await Promise.all([
    supabase.from("perfil").select("*").order("nombre_completo").returns<Perfil[]>(),
    supabase.from("plantel").select("*").order("nombre").returns<Plantel[]>(),
  ]);

  return (
    <AppShell perfil={perfil}>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Usuarios</h1>
      <p className="mt-1 text-sm text-zinc-500">
        {perfil.rol === "admin"
          ? "Asigna rol y plantel a cada cuenta registrada."
          : "Usuarios de tu plantel (solo un administrador puede cambiar rol o plantel)."}
      </p>

      <table className="mt-6 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
            <th className="py-2 font-medium">Nombre</th>
            <th className="py-2 font-medium">Correo</th>
            <th className="py-2 font-medium">Rol / Plantel</th>
          </tr>
        </thead>
        <tbody>
          {(usuarios ?? []).map((usuario) => (
            <tr key={usuario.id} className="border-b border-zinc-100 dark:border-zinc-900">
              <td className="py-2">{usuario.nombre_completo}</td>
              <td className="py-2 text-zinc-500">{usuario.email}</td>
              <td className="py-2">
                {perfil.rol === "admin" ? (
                  <UsuarioRowForm usuario={usuario} planteles={planteles ?? []} />
                ) : (
                  <span>{usuario.rol}</span>
                )}
              </td>
            </tr>
          ))}
          {(usuarios ?? []).length === 0 && (
            <tr>
              <td colSpan={3} className="py-4 text-zinc-500">
                No hay usuarios registrados todavía.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </AppShell>
  );
}
