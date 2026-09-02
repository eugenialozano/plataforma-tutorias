"use client";

import { useActionState } from "react";
import { guardarAnexo6, type EstadoAnexo6 } from "./actions";
import type { Tutorado } from "@/types/database";

const ESTADO_INICIAL: EstadoAnexo6 = {};

function Campo({
  label,
  name,
  defaultValue,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue ?? ""}
        className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
      />
    </div>
  );
}

function CampoSiNo({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue?: boolean | null;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</span>
      <div className="flex gap-4 text-sm">
        <label className="flex items-center gap-1">
          <input type="radio" name={name} value="si" defaultChecked={defaultValue === true} /> Sí
        </label>
        <label className="flex items-center gap-1">
          <input type="radio" name={name} value="no" defaultChecked={defaultValue !== true} /> No
        </label>
      </div>
    </div>
  );
}

export function Anexo6Form({ datos }: { datos: Tutorado | null }) {
  const [estado, accion, pendiente] = useActionState(guardarAnexo6, ESTADO_INICIAL);

  return (
    <form action={accion} className="mt-6 flex flex-col gap-8">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Campo label="Número de control" name="numero_control" defaultValue={datos?.numero_control} required />
        <Campo label="Carrera" name="carrera" defaultValue={datos?.carrera} required />
        <Campo label="Semestre" name="semestre" defaultValue={datos?.semestre} required />
        <Campo label="Sexo" name="sexo" defaultValue={datos?.sexo} />
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">Datos generales</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Campo label="Apellido paterno" name="apellido_paterno" defaultValue={datos?.apellido_paterno} required />
          <Campo label="Apellido materno" name="apellido_materno" defaultValue={datos?.apellido_materno} required />
          <Campo label="Nombre(s)" name="nombres" defaultValue={datos?.nombres} required />
          <Campo label="Fecha de nacimiento" name="fecha_nacimiento" type="date" defaultValue={datos?.fecha_nacimiento} />
          <Campo label="Lugar de nacimiento" name="lugar_nacimiento" defaultValue={datos?.lugar_nacimiento} />
          <Campo label="Estado civil" name="estado_civil" defaultValue={datos?.estado_civil} />
          <Campo label="Número de hijos" name="numero_hijos" type="number" defaultValue={datos?.numero_hijos?.toString()} />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">Contacto y domicilio</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Campo label="Teléfono domicilio" name="telefono_domicilio" defaultValue={datos?.telefono_domicilio} />
          <Campo label="Celular 1" name="celular1" defaultValue={datos?.celular1} />
          <Campo label="Celular 2" name="celular2" defaultValue={datos?.celular2} />
        </div>
        <div className="mt-4">
          <Campo label="Domicilio actual" name="domicilio_actual" defaultValue={datos?.domicilio_actual} />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">Escolaridad previa y beca</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Campo label="Escolaridad previa (preparatoria/bachillerato técnico)" name="escolaridad_previa" defaultValue={datos?.escolaridad_previa} />
          <Campo label="Nombre de la institución" name="nombre_institucion_previa" defaultValue={datos?.nombre_institucion_previa} />
          <CampoSiNo label="¿Has estado becado?" name="becado" defaultValue={datos?.becado} />
          <Campo label="Tipo de beca (si aplica)" name="tipo_beca" defaultValue={datos?.tipo_beca} />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">Situación actual</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Campo label="Durante tus estudios vivirás (con mi familia / con familiares cercanos / con otros estudiantes / solo)" name="vive_con" defaultValue={datos?.vive_con} />
          <CampoSiNo label="¿Trabajas?" name="trabaja" defaultValue={datos?.trabaja} />
          <Campo label="Nombre de la empresa (si trabajas)" name="nombre_empresa" defaultValue={datos?.nombre_empresa} />
          <Campo label="Horario de trabajo" name="horario_trabajo" defaultValue={datos?.horario_trabajo} />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">Familia</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Campo label="Máximo grado de escolaridad del padre" name="escolaridad_padre" defaultValue={datos?.escolaridad_padre} />
          <Campo label="Máximo grado de escolaridad de la madre" name="escolaridad_madre" defaultValue={datos?.escolaridad_madre} />
          <CampoSiNo label="¿Padre vive?" name="padre_vive" defaultValue={datos?.padre_vive} />
          <CampoSiNo label="¿Madre vive?" name="madre_vive" defaultValue={datos?.madre_vive} />
          <Campo label="Trabajo del padre" name="trabajo_padre" defaultValue={datos?.trabajo_padre} />
          <Campo label="Trabajo de la madre" name="trabajo_madre" defaultValue={datos?.trabajo_madre} />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">En caso de accidente avisar a</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Campo label="Nombre" name="contacto_emergencia_nombre" defaultValue={datos?.contacto_emergencia_nombre} required />
          <Campo label="Teléfono" name="contacto_emergencia_telefono" defaultValue={datos?.contacto_emergencia_telefono} required />
        </div>
      </section>

      {estado?.error && (
        <p role="alert" className="text-sm text-red-600">
          {estado.error}
        </p>
      )}
      {estado?.guardado && (
        <p role="status" className="text-sm text-emerald-600">
          Guardado correctamente.
        </p>
      )}

      <button
        type="submit"
        disabled={pendiente}
        className="w-fit rounded-md bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900"
      >
        {pendiente ? "Guardando..." : "Guardar ficha"}
      </button>
    </form>
  );
}
