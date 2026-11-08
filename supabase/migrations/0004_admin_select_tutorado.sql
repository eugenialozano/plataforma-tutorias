-- El admin debe poder ver todas las filas de `tutorado`, incluidas las que aún no tienen grupo.
-- Sin esto, el upsert de /admin/asignar-tutorados falla con "violates row-level security policy
-- (USING expression)" porque ON CONFLICT DO UPDATE exige que la fila existente sea visible.
create policy "tutorado_admin_select" on public.tutorado
  for select using (public.rol_actual() = 'admin');
