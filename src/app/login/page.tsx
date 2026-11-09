"use client";

import { Suspense, useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { iniciarSesion, recuperarContrasena, registrarse, type EstadoAuth } from "./actions";

const ESTADO_INICIAL: EstadoAuth = {};

function AvisoEnlaceInvalido() {
  const enlace = useSearchParams().get("enlace");
  if (enlace !== "invalido") return null;
  return (
    <p role="alert" className="mt-3 text-sm text-red-600">
      El enlace de recuperación ya no es válido o venció. Solicita uno nuevo con
      «¿Olvidaste tu contraseña?». Ábrelo en el mismo navegador donde lo pediste.
    </p>
  );
}

export default function PaginaLogin() {
  const [modo, setModo] = useState<"login" | "registro" | "recuperar">("login");
  const [estadoRecuperar, accionRecuperar, pendienteRecuperar] = useActionState(
    recuperarContrasena,
    ESTADO_INICIAL,
  );
  const [estadoLogin, accionLogin, pendienteLogin] = useActionState(
    iniciarSesion,
    ESTADO_INICIAL,
  );
  const [estadoRegistro, accionRegistro, pendienteRegistro] = useActionState(
    registrarse,
    ESTADO_INICIAL,
  );

  const estado =
    modo === "login" ? estadoLogin : modo === "registro" ? estadoRegistro : estadoRecuperar;
  const accion =
    modo === "login" ? accionLogin : modo === "registro" ? accionRegistro : accionRecuperar;
  const pendiente =
    modo === "login"
      ? pendienteLogin
      : modo === "registro"
        ? pendienteRegistro
        : pendienteRecuperar;

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-16 dark:bg-zinc-950">
      <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Plataforma de Tutorías
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          {modo === "login"
            ? "Inicia sesión para continuar."
            : modo === "registro"
              ? "Crea tu cuenta de tutorado o tutor."
              : "Escribe tu correo y te enviaremos un enlace para crear una nueva contraseña."}
        </p>
        <Suspense>
          <AvisoEnlaceInvalido />
        </Suspense>

        <form action={accion} className="mt-6 flex flex-col gap-4">
          {modo === "registro" && (
            <div className="flex flex-col gap-1">
              <label htmlFor="nombre_completo" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Nombre completo
              </label>
              <input
                id="nombre_completo"
                name="nombre_completo"
                type="text"
                required
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
              />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Correo institucional
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
            />
          </div>

          {modo !== "recuperar" && (
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
            />
          </div>
          )}

          {estado?.error && (
            <p role="alert" className="text-sm text-red-600">
              {estado.error}
            </p>
          )}

          {estado?.mensaje && (
            <p role="status" className="text-sm text-green-700 dark:text-green-500">
              {estado.mensaje}
            </p>
          )}

          <button
            type="submit"
            disabled={pendiente}
            className="mt-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900"
          >
            {pendiente
              ? "Procesando..."
              : modo === "login"
                ? "Iniciar sesión"
                : modo === "registro"
                  ? "Crear cuenta"
                  : "Enviar enlace"}
          </button>
        </form>

        {modo === "login" && (
          <button
            type="button"
            onClick={() => setModo("recuperar")}
            className="mt-4 block text-sm text-zinc-500 underline underline-offset-2 hover:text-zinc-800 dark:hover:text-zinc-200"
          >
            ¿Olvidaste tu contraseña?
          </button>
        )}

        <button
          type="button"
          onClick={() => setModo(modo === "login" ? "registro" : "login")}
          className="mt-4 text-sm text-zinc-500 underline underline-offset-2 hover:text-zinc-800 dark:hover:text-zinc-200"
        >
          {modo === "login"
            ? "¿Nuevo tutorado o tutor? Crea tu cuenta"
            : modo === "registro"
              ? "¿Ya tienes cuenta? Inicia sesión"
              : "Volver a iniciar sesión"}
        </button>
      </div>
    </div>
  );
}
