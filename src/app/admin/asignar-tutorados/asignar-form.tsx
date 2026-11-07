"use client";

import { useActionState } from "react";
import { asignarTutoradoAGrupo, type EstadoAsignacion } from "./actions";
import type { Grupo } from "@/types/database";

const ESTADO_INICIAL: EstadoAsignacion = {};

export function AsignarForm({
  tutoradoId,
  grupoActualId,
  grupos,
}: {
  tutoradoId: string;
  grupoActualId: string | null;
  grupos: Grupo[];
}) {
  const [estado, accion, pendiente] = useActionState(asignarTutoradoAGrupo, ESTADO_INICIAL);

  return (
    <form action={accion} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="tutorado_id" value={tutoradoId} />
      <select
        name="grupo_id"
        defaultValue={grupoActualId ?? ""}
        className="rounded-md border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-800"
      >
        <option value="">Sin grupo</option>
        {grupos.map((grupo) => (
          <option key={grupo.id} value={grupo.id}>
            {grupo.carrera}
            {grupo.nombre ? ` · ${grupo.nombre}` : ""} · {grupo.semestre} · {grupo.ciclo_escolar}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={pendiente}
        className="rounded-md border border-zinc-300 px-3 py-1 text-sm hover:bg-zinc-100 disabled:opacity-60 dark:border-zinc-700 dark:hover:bg-zinc-800"
      >
        {pendiente ? "Guardando..." : "Guardar"}
      </button>
      {estado?.ok && <span className="text-xs text-green-600">Guardado</span>}
      {estado?.error && <span className="text-xs text-red-600">{estado.error}</span>}
    </form>
  );
}
