-- Corrige recursión infinita en RLS: grupo_select consultaba tutorado y tutorado_propio
-- consultaba grupo, por lo que Postgres abortaba cualquier lectura de grupo.
-- La consulta a tutorado se mueve a una función security definer (ignora RLS) para romper el ciclo.

create or replace function public.es_tutorado_del_grupo(gid uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.tutorado t
    where t.grupo_id = gid and t.id = auth.uid()
  );
$$;

drop policy if exists "grupo_select" on public.grupo;

create policy "grupo_select" on public.grupo
  for select using (
    tutor_id = auth.uid()
    or (public.rol_actual() in ('coordinador', 'admin') and plantel_id = public.plantel_actual())
    or public.es_tutorado_del_grupo(id)
  );
