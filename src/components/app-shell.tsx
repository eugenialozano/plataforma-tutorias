import Link from "next/link";
import { cerrarSesion } from "@/app/login/actions";
import type { Perfil } from "@/types/database";

const ETIQUETAS_ROL: Record<Perfil["rol"], string> = {
  tutorado: "Tutorado",
  tutor: "Tutor",
  psicologo: "Psicología",
  medico: "Medicina",
  coordinador: "Coordinación de Tutorías",
  admin: "Administración",
};

const ENLACES_POR_ROL: Record<Perfil["rol"], { href: string; label: string }[]> = {
  tutorado: [
    { href: "/dashboard", label: "Inicio" },
    { href: "/anexo6", label: "Mi ficha de identificación" },
  ],
  tutor: [
    { href: "/dashboard", label: "Inicio" },
    { href: "/tutor", label: "Mi grupo" },
  ],
  psicologo: [{ href: "/dashboard", label: "Inicio" }],
  medico: [{ href: "/dashboard", label: "Inicio" }],
  coordinador: [
    { href: "/dashboard", label: "Inicio" },
    { href: "/admin/planteles", label: "Planteles" },
    { href: "/admin/grupos", label: "Grupos" },
    { href: "/admin/usuarios", label: "Usuarios" },
  ],
  admin: [
    { href: "/dashboard", label: "Inicio" },
    { href: "/admin/planteles", label: "Planteles" },
    { href: "/admin/grupos", label: "Grupos" },
    { href: "/admin/usuarios", label: "Usuarios" },
  ],
};

export function AppShell({
  perfil,
  children,
}: {
  perfil: Perfil;
  children: React.ReactNode;
}) {
  const enlaces = ENLACES_POR_ROL[perfil.rol];

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-6">
            <span className="font-semibold text-zinc-900 dark:text-zinc-50">
              Plataforma de Tutorías
            </span>
            <nav className="flex gap-4 text-sm text-zinc-600 dark:text-zinc-400">
              {enlaces.map((enlace) => (
                <Link key={enlace.href} href={enlace.href} className="hover:text-zinc-900 dark:hover:text-zinc-100">
                  {enlace.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-zinc-500">
              {perfil.nombre_completo} · {ETIQUETAS_ROL[perfil.rol]}
            </span>
            <form action={cerrarSesion}>
              <button type="submit" className="text-zinc-500 underline underline-offset-2 hover:text-zinc-800 dark:hover:text-zinc-200">
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
    </div>
  );
}
