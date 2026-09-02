-- Fase 0: fundamentos (planteles, usuarios/roles, grupos, ficha de identificación = Anexo 6)

create extension if not exists "pgcrypto";

create type public.rol_usuario as enum (
  'tutorado',
  'tutor',
  'psicologo',
  'medico',
  'coordinador',
  'admin'
);

create table public.plantel (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  clave text unique,
  created_at timestamptz not null default now()
);

create table public.perfil (
  id uuid primary key references auth.users (id) on delete cascade,
  plantel_id uuid references public.plantel (id),
  rol public.rol_usuario not null default 'tutorado',
  nombre_completo text not null,
  email text not null,
  created_at timestamptz not null default now()
);

create table public.grupo (
  id uuid primary key default gen_random_uuid(),
  plantel_id uuid not null references public.plantel (id),
  tutor_id uuid references public.perfil (id),
  carrera text not null,
  semestre text not null,
  ciclo_escolar text not null,
  nombre text,
  created_at timestamptz not null default now()
);

-- Anexo 6: Ficha de identificación del tutorado
create table public.tutorado (
  id uuid primary key references public.perfil (id) on delete cascade,
  grupo_id uuid references public.grupo (id),
  numero_control text unique,
  carrera text,
  semestre text,
  apellido_paterno text,
  apellido_materno text,
  nombres text,
  sexo text,
  fecha_nacimiento date,
  lugar_nacimiento text,
  estado_civil text,
  numero_hijos int,
  telefono_domicilio text,
  celular1 text,
  celular2 text,
  domicilio_actual text,
  escolaridad_previa text,
  nombre_institucion_previa text,
  becado boolean not null default false,
  tipo_beca text,
  vive_con text,
  trabaja boolean not null default false,
  nombre_empresa text,
  horario_trabajo text,
  escolaridad_padre text,
  escolaridad_madre text,
  padre_vive boolean,
  madre_vive boolean,
  trabajo_padre text,
  trabajo_madre text,
  contacto_emergencia_nombre text,
  contacto_emergencia_telefono text,
  updated_at timestamptz not null default now()
);

-- Crea automáticamente un perfil (rol tutorado por defecto) cuando alguien se registra.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.perfil (id, email, nombre_completo)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'nombre_completo', new.email));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Helpers para políticas RLS (evitan recursión y repetición)
create function public.rol_actual()
returns public.rol_usuario
language sql stable security definer set search_path = public
as $$
  select rol from public.perfil where id = auth.uid();
$$;

create function public.plantel_actual()
returns uuid
language sql stable security definer set search_path = public
as $$
  select plantel_id from public.perfil where id = auth.uid();
$$;

alter table public.plantel enable row level security;
alter table public.perfil enable row level security;
alter table public.grupo enable row level security;
alter table public.tutorado enable row level security;

-- plantel: cualquier usuario autenticado puede leer los planteles de su institución;
-- solo admin puede crear/editar.
create policy "plantel_select" on public.plantel
  for select using (auth.uid() is not null);

create policy "plantel_admin_write" on public.plantel
  for all using (public.rol_actual() = 'admin')
  with check (public.rol_actual() = 'admin');

-- perfil: cada quien ve/edita su propio perfil; coordinador ve los de su plantel;
-- admin ve todos (incluye usuarios recién registrados sin plantel_id, para poder asignarlos).
create policy "perfil_propio_select" on public.perfil
  for select using (
    id = auth.uid()
    or public.rol_actual() = 'admin'
    or (public.rol_actual() = 'coordinador' and plantel_id = public.plantel_actual())
  );

create policy "perfil_propio_update" on public.perfil
  for update using (id = auth.uid())
  with check (id = auth.uid());

create policy "perfil_admin_write" on public.perfil
  for update using (public.rol_actual() = 'admin')
  with check (public.rol_actual() = 'admin');

-- grupo: tutor ve/edita su(s) grupo(s); coordinador/admin ven todos los de su plantel.
create policy "grupo_select" on public.grupo
  for select using (
    tutor_id = auth.uid()
    or (public.rol_actual() in ('coordinador', 'admin') and plantel_id = public.plantel_actual())
    or exists (
      select 1 from public.tutorado t
      where t.grupo_id = grupo.id and t.id = auth.uid()
    )
  );

create policy "grupo_coordinador_write" on public.grupo
  for all using (
    public.rol_actual() in ('coordinador', 'admin') and plantel_id = public.plantel_actual()
  )
  with check (
    public.rol_actual() in ('coordinador', 'admin') and plantel_id = public.plantel_actual()
  );

-- tutorado: el propio tutorado ve/edita su ficha; su tutor y coordinación/admin de su
-- plantel pueden verla (no editarla, salvo admin).
create policy "tutorado_propio" on public.tutorado
  for select using (
    id = auth.uid()
    or exists (
      select 1 from public.grupo g
      where g.id = tutorado.grupo_id
        and (g.tutor_id = auth.uid()
             or (public.rol_actual() in ('coordinador', 'admin') and g.plantel_id = public.plantel_actual()))
    )
  );

create policy "tutorado_propio_write" on public.tutorado
  for update using (id = auth.uid())
  with check (id = auth.uid());

create policy "tutorado_propio_insert" on public.tutorado
  for insert with check (id = auth.uid());

create policy "tutorado_admin_write" on public.tutorado
  for update using (public.rol_actual() = 'admin')
  with check (public.rol_actual() = 'admin');
