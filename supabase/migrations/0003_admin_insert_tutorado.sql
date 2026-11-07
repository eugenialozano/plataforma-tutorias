-- Permite a un administrador crear la fila de `tutorado` de un alumno que aún no llena su
-- Anexo 6, para poder asignarlo a un grupo desde la pantalla /admin/asignar-tutorados.
create policy "tutorado_admin_insert" on public.tutorado
  for insert with check (public.rol_actual() = 'admin');
