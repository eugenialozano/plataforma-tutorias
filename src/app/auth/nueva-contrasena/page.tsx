"use client";

import { useActionState } from "react";
import { cambiarContrasena, type EstadoAuth } from "@/app/login/actions";

const ESTADO_INICIAL: EstadoAuth = {};
const CLASE_INPUT =
  "rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800";

export default function PaginaNuevaContrasena() {
  const [estado, accion, pendiente] = useActionState(cambiarContrasena, ESTADO_INICIAL);

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-16 dark:bg-zinc-950">
      <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Nueva contraseña
        </h1>
        <p className="mt-1 text-sm text-zinc-500">Elige una contraseña de al menos 8 caracteres.</p>

        <form action={accion} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Nueva contraseña
            </label>
            <input id="password" name="password" type="password" required minLength={8} className={CLASE_INPUT} />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="confirmar" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Repite la contraseña
            </label>
            <input id="confirmar" name="confirmar" type="password" required minLength={8} className={CLASE_INPUT} />
          </div>

          {estado?.error && (
            <p role="alert" className="text-sm text-red-600">
              {estado.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pendiente}
            className="mt-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900"
          >
            {pendiente ? "Guardando..." : "Guardar contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
}
