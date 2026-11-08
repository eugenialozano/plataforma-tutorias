import Link from "next/link";
import { redirect } from "next/navigation";
import { obtenerUsuarioYPerfil } from "@/lib/auth/perfil-actual";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/app-shell";
import type { Perfil, Tutorado } from "@/types/database";

function siNo(valor: boolean | null) {
  if (valor === null) return null;
  return valor ? "Sí" : "No";
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string | number | null | undefined }) {
  return (
    <div>
      <dt className="text-xs text-zinc-500">{etiqueta}</dt>
      <dd className="text-sm text-zinc-900 dark:text-zinc-50">
        {valor === null || valor === undefined || valor === "" ? "—" : valor}
      </dd>
    </div>
  );
}

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">{titulo}</h2>
      <dl className="grid gap-4 sm:grid-cols-2">{children}</dl>
    </section>
  );
}

export default async function PaginaDetalleTutorado({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sesion = await obtenerUsuarioYPerfil();
  if (!sesion) redirect("/login");
  const { perfil } = sesion;
  if (!perfil) redirect("/dashboard");
  if (perfil.rol !== "tutor" && perfil.rol !== "coordinador" && perfil.rol !== "admin") {
    redirect("/dashboard");
  }

  // Las políticas de seguridad (RLS) limitan quién puede ver cada ficha.
  const supabase = await createClient();
  const [{ data: t }, { data: p }] = await Promise.all([
    supabase.from("tutorado").select("*").eq("id", id).maybeSingle<Tutorado>(),
    supabase.from("perfil").select("*").eq("id", id).maybeSingle<Perfil>(),
  ]);

  const volver = perfil.rol === "tutor" ? "/tutor" : "/admin/asignar-tutorados";

  if (!t || !p) {
    return (
      <AppShell perfil={perfil}>
        <p className="text-sm text-zinc-500">No se encontró al tutorado o no tienes acceso a su ficha.</p>
        <Link href={volver} className="mt-4 inline-block text-sm underline">Volver</Link>
      </AppShell>
    );
  }

  const nombre = t.apellido_paterno
    ? `${t.apellido_paterno} ${t.apellido_materno ?? ""} ${t.nombres ?? ""}`.trim()
    : p.nombre_completo;
  const completo = Boolean(t.apellido_paterno && t.numero_control);

  return (
    <AppShell perfil={perfil}>
      <Link href={volver} className="text-sm text-zinc-500 underline underline-offset-2">
        ← Volver
      </Link>
      <h1 className="mt-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{nombre}</h1>
      <p className="mt-1 text-sm text-zinc-500">
        {p.email} · Anexo 6: {completo ? "completo" : "pendiente de llenar"}
      </p>

      <Seccion titulo="Identificación">
        <Dato etiqueta="Número de control" valor={t.numero_control} />
        <Dato etiqueta="Carrera" valor={t.carrera} />
        <Dato etiqueta="Semestre" valor={t.semestre} />
        <Dato etiqueta="Sexo" valor={t.sexo} />
      </Seccion>

      <Seccion titulo="Datos generales">
        <Dato etiqueta="Fecha de nacimiento" valor={t.fecha_nacimiento} />
        <Dato etiqueta="Lugar de nacimiento" valor={t.lugar_nacimiento} />
        <Dato etiqueta="Estado civil" valor={t.estado_civil} />
        <Dato etiqueta="Número de hijos" valor={t.numero_hijos} />
      </Seccion>

      <Seccion titulo="Contacto y domicilio">
        <Dato etiqueta="Teléfono domicilio" valor={t.telefono_domicilio} />
        <Dato etiqueta="Celular 1" valor={t.celular1} />
        <Dato etiqueta="Celular 2" valor={t.celular2} />
        <Dato etiqueta="Domicilio actual" valor={t.domicilio_actual} />
      </Seccion>

      <Seccion titulo="Escolaridad previa y beca">
        <Dato etiqueta="Escolaridad previa" valor={t.escolaridad_previa} />
        <Dato etiqueta="Institución" valor={t.nombre_institucion_previa} />
        <Dato etiqueta="¿Becado?" valor={siNo(t.becado)} />
        <Dato etiqueta="Tipo de beca" valor={t.tipo_beca} />
      </Seccion>

      <Seccion titulo="Situación actual">
        <Dato etiqueta="Vivirá durante sus estudios" valor={t.vive_con} />
        <Dato etiqueta="¿Trabaja?" valor={siNo(t.trabaja)} />
        <Dato etiqueta="Empresa" valor={t.nombre_empresa} />
        <Dato etiqueta="Horario de trabajo" valor={t.horario_trabajo} />
      </Seccion>

      <Seccion titulo="Familia">
        <Dato etiqueta="Escolaridad del padre" valor={t.escolaridad_padre} />
        <Dato etiqueta="Escolaridad de la madre" valor={t.escolaridad_madre} />
        <Dato etiqueta="¿Padre vive?" valor={siNo(t.padre_vive)} />
        <Dato etiqueta="¿Madre vive?" valor={siNo(t.madre_vive)} />
        <Dato etiqueta="Trabajo del padre" valor={t.trabajo_padre} />
        <Dato etiqueta="Trabajo de la madre" valor={t.trabajo_madre} />
      </Seccion>

      <Seccion titulo="En caso de accidente avisar a">
        <Dato etiqueta="Nombre" valor={t.contacto_emergencia_nombre} />
        <Dato etiqueta="Teléfono" valor={t.contacto_emergencia_telefono} />
      </Seccion>
    </AppShell>
  );
}
