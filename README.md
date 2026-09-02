# Plataforma de Tutorías (SNIT/TecNM)

Digitaliza el Programa Institucional de Tutorías: ficha de identificación, entrevista y demás
anexos, citas con psicología/medicina, detección temprana de riesgo y reportes. Ver el plan
completo del proyecto en `docs/` (por fases) y los anexos originales de referencia en
`docs/anexos-referencia/`.

Estado actual: **Fase 0** — autenticación por rol, alta de planteles/grupos/usuarios y
digitalización del Anexo 6 (ficha de identificación).

## Stack

Next.js (App Router) + Supabase (Postgres, Auth, Storage). Ver el plan en
`C:\Users\kenyj\.claude\plans\lively-juggling-rivest.md` para el roadmap completo por fases.

## Puesta en marcha (primera vez)

1. **Crear un proyecto en [supabase.com](https://supabase.com)** (capa gratuita alcanza para
   empezar).
2. **Aplicar el esquema de base de datos**: en el Dashboard de Supabase, abre el SQL Editor y
   pega el contenido de `supabase/migrations/0001_fase0_schema.sql`, luego ejecútalo.
3. **Variables de entorno**: copia `.env.local.example` a `.env.local` y llena
   `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Project Settings → API en
   Supabase).
4. **Instalar dependencias**: `npm install`.
5. **Crear tu primer usuario admin**:
   - Corre la app (`npm run dev`) y regístrate normalmente desde `/login` con tu correo.
   - Todo usuario nuevo se crea con rol `tutorado` por defecto. Para volverte `admin` la primera
     vez, ve al SQL Editor de Supabase y ejecuta:
     ```sql
     update public.perfil set rol = 'admin' where email = 'tu-correo@ejemplo.com';
     ```
   - Con esa cuenta ya puedes entrar a **Usuarios** dentro de la app y asignar rol/plantel al
     resto del personal (tutores, psicología, medicina, coordinación) sin volver a tocar SQL.
6. **Correr en desarrollo**: `npm run dev` y abre [http://localhost:3000](http://localhost:3000).

## Estructura relevante

- `src/app/login` — inicio de sesión y registro (Supabase Auth).
- `src/app/dashboard` — landing por rol.
- `src/app/admin/*` — administración de planteles, grupos y usuarios (rol `admin`/`coordinador`).
- `src/app/tutor` — vista del tutor: sus grupos y el avance de sus tutorados.
- `src/app/anexo6` — ficha de identificación del tutorado (Anexo 6).
- `src/proxy.ts` — protección de rutas por sesión (antes `middleware.ts`; renombrado porque
  Next.js 16 deprecó `middleware` en favor de `proxy`).
- `supabase/migrations/` — esquema SQL y políticas de seguridad a nivel de fila (RLS).

## Notas de seguridad

- El acceso a datos está controlado con **Row Level Security** en Postgres, no solo en la
  interfaz: cada tabla define quién puede leer/escribir cada fila según su rol y plantel.
  Cuando se agreguen instrumentos clínicos (Fase 2), el detalle de esas respuestas debe quedar
  restringido a psicología/medicina y al propio tutorado — nunca visible para tutor/coordinación
  más allá de la alerta y el estatus de canalización.
- `SUPABASE_SERVICE_ROLE_KEY` (en `.env.local.example`) nunca debe usarse desde el navegador ni
  comitearse; solo para scripts de administración que corran en el servidor.

## Próximos pasos (Fase 1)

Ver el plan completo para el detalle, en resumen: Anexo 8 (entrevista), Anexo 9 (línea de la
vida), Anexo 10 (FODA), Anexo 11 (encuesta de habilidades de estudio, con calificación
automática), Anexo 15 (registro de desempeño académico) y el módulo de citas con
psicología/medicina.
