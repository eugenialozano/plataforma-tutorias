"use client";

import { useActionState } from "react";
import { crearGrupo, type EstadoGrupo } from "./actions";
import type { Perfil } from "@/types/database";

const ESTADO_INICIAL: EstadoGrupo = {};

export function GrupoForm({ tutores }: { tutores: Perfil[] }) {
  const [estado, accion, pendiente] = useActionState(crearGrupo, ESTADO_INICIAL);

  return (
    <form action={accion} className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1">
        <label htmlFor="carrera" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Carrera</label>
        <input id="carrera" name="carrera" required className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="semestre" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Semestre</label>
        <input id="semestre" name="semestre" required className="w-24 rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="ciclo_escolar" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Ciclo escolar</label>
        <input id="ciclo_escolar" name="ciclo_escolar" placeholder="Agosto-Diciembre 2025" required className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="nombre" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Nombre (opcional)</label>
        <input id="nombre" name="nombre" className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="tutor_id" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Tutor</label>
        <select id="tutor_id" name="tutor_id" className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800">
          <option value="">Sin asignar</option>
          {tutores.map((tutor) => (
            <option key={tutor.id} value={tutor.id}>{tutor.nombre_completo}</option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={pendiente}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900"
      >
        {pendiente ? "Creando..." : "Crear grupo"}
      </button>
      {estado?.error && <p className="w-full text-sm text-red-600">{estado.error}</p>}
    </form>
  );
}
