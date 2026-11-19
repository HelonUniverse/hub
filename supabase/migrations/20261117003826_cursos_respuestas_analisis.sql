-- Reconstruida del esquema vivo. Respuestas de cursos y análisis de cierre; solo la propia persona los ve (RLS). Sin política de borrado a propósito.
create table if not exists public.curso_respuestas (
  usuario uuid not null references auth.users(id) on delete cascade,
  curso text not null check (char_length(curso) <= 60),
  datos jsonb not null default '{}'::jsonb,
  actualizado timestamptz not null default now(),
  primary key (usuario, curso)
);
create table if not exists public.curso_analisis (
  usuario uuid not null references auth.users(id) on delete cascade,
  curso text not null check (char_length(curso) <= 60),
  contenido jsonb not null,
  creado timestamptz not null default now(),
  primary key (usuario, curso)
);
alter table public.curso_respuestas enable row level security;
alter table public.curso_analisis enable row level security;
create policy cr_select_propio on public.curso_respuestas for select using ((select auth.uid()) = usuario);
create policy cr_insert_propio on public.curso_respuestas for insert with check ((select auth.uid()) = usuario);
create policy cr_update_propio on public.curso_respuestas for update using ((select auth.uid()) = usuario) with check ((select auth.uid()) = usuario);
create policy ca_select_propio on public.curso_analisis for select using ((select auth.uid()) = usuario);
create policy ca_insert_propio on public.curso_analisis for insert with check ((select auth.uid()) = usuario);
create policy ca_update_propio on public.curso_analisis for update using ((select auth.uid()) = usuario) with check ((select auth.uid()) = usuario);
