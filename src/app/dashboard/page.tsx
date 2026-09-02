import { redirect } from "next/navigation";
import { obtenerUsuarioYPerfil } from "@/lib/auth/perfil-actual";
import { AppShell } from "@/components/app-shell";

export default async function PaginaDashboard() {
  const sesion = await obtenerUsuarioYPerfil();
  if (!sesion) redirect("/login");

  const { perfil, email } = sesion;

  if (!perfil) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-16 text-center">
        <p className="text-sm text-zinc-500">
          Tu cuenta ({email}) todavía no tiene un perfil asignado. Contacta a la coordinación de
          tutorías para que te asigne un plantel y rol.
        </p>
      </div>
    );
  }

  return (
    <AppShell perfil={perfil}>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Hola, {perfil.nombre_completo.split(" ")[0]}
      </h1>

      {perfil.rol === "tutorado" && (
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Aquí podrás llenar tu ficha de identificación, la entrevista y los demás anexos de tu
          proceso de tutoría. Empieza por{" "}
          <a href="/anexo6" className="underline underline-offset-2">
            tu ficha de identificación
          </a>
          .
        </p>
      )}

      {perfil.rol === "tutor" && (
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Desde{" "}
          <a href="/tutor" className="underline underline-offset-2">
            Mi grupo
          </a>{" "}
          puedes ver a tus tutorados y su avance.
        </p>
      )}

      {(perfil.rol === "coordinador" || perfil.rol === "admin") && (
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Gestiona planteles, grupos y usuarios desde el menú de administración.
        </p>
      )}

      {(perfil.rol === "psicologo" || perfil.rol === "medico") && (
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          El módulo de citas y expedientes llega en la Fase 1 del proyecto.
        </p>
      )}
    </AppShell>
  );
}
