-- Un tutor debe poder leer el perfil (nombre, correo) de los tutorados de sus grupos.
-- Se usa una función security definer (ignora RLS) para no crear recursión entre
-- las políticas de perfil, tutorado y grupo.
create or replace function public.es_tutor_de(pid uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1
    from public.tutorado t
    join public.grupo g on g.id = t.grupo_id
    where t.id = pid and g.tutor_id = auth.uid()
  );
$$;

create policy "perfil_tutor_select" on public.perfil
  for select using (public.es_tutor_de(id));
