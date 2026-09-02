"use client";

import { useActionState } from "react";
import { actualizarUsuario, type EstadoUsuario } from "./actions";
import type { Perfil, Plantel, RolUsuario } from "@/types/database";

const ESTADO_INICIAL: EstadoUsuario = {};

const ROLES: RolUsuario[] = ["tutorado", "tutor", "psicologo", "medico", "coordinador", "admin"];

export function UsuarioRowForm({ usuario, planteles }: { usuario: Perfil; planteles: Plantel[] }) {
  const [estado, accion, pendiente] = useActionState(actualizarUsuario, ESTADO_INICIAL);

  return (
    <form action={accion} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="perfil_id" value={usuario.id} />
      <select
        name="rol"
        defaultValue={usuario.rol}
        className="rounded-md border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-800"
      >
        {ROLES.map((rol) => (
          <option key={rol} value={rol}>{rol}</option>
        ))}
      </select>
      <select
        name="plantel_id"
        defaultValue={usuario.plantel_id ?? ""}
        className="rounded-md border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-800"
      >
        <option value="">Sin plantel</option>
        {planteles.map((plantel) => (
          <option key={plantel.id} value={plantel.id}>{plantel.nombre}</option>
        ))}
      </select>
      <button
        type="submit"
        disabled={pendiente}
        className="rounded-md border border-zinc-300 px-3 py-1 text-sm hover:bg-zinc-100 disabled:opacity-60 dark:border-zinc-700 dark:hover:bg-zinc-800"
      >
        {pendiente ? "Guardando..." : "Guardar"}
      </button>
      {estado?.error && <span className="text-xs text-red-600">{estado.error}</span>}
    </form>
  );
}
