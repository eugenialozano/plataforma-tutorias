"use client";

import { useActionState } from "react";
import { crearPlantel, type EstadoPlantel } from "./actions";

const ESTADO_INICIAL: EstadoPlantel = {};

export function PlantelForm() {
  const [estado, accion, pendiente] = useActionState(crearPlantel, ESTADO_INICIAL);

  return (
    <form action={accion} className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1">
        <label htmlFor="nombre" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Nombre del plantel
        </label>
        <input
          id="nombre"
          name="nombre"
          required
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="clave" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Clave (opcional)
        </label>
        <input
          id="clave"
          name="clave"
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
        />
      </div>
      <button
        type="submit"
        disabled={pendiente}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900"
      >
        {pendiente ? "Creando..." : "Crear plantel"}
      </button>
      {estado?.error && <p className="text-sm text-red-600">{estado.error}</p>}
    </form>
  );
}
