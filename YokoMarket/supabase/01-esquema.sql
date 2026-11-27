-- Ejecutar en SQL Editor de un proyecto Supabase nuevo.
-- Las contraseñas pertenecen a Auth; nunca a nuestras tablas.
begin;
create table if not exists public.perfiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null check (length(trim(nombre)) between 1 and 40),
  bio text not null default '' check (length(bio) <= 300)
);
create or replace function public.crear_perfil()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.perfiles(id, nombre)
  values (new.id, left(coalesce(nullif(trim(new.raw_user_meta_data->>'nombre'), ''), 'Fan'), 40))
  on conflict (id) do nothing;
  return new;
end;
$$;
drop trigger if exists al_registrar on auth.users;
create trigger al_registrar after insert on auth.users
for each row execute function public.crear_perfil();
-- También completa perfiles de cuentas creadas antes de ejecutar el script.
insert into public.perfiles(id, nombre)
select id, left(coalesce(nullif(trim(raw_user_meta_data->>'nombre'), ''), 'Fan'), 40)
from auth.users on conflict (id) do nothing;

create table if not exists public.productos (
  id text primary key,
  usuario_id uuid references auth.users(id) on delete cascade,
  datos jsonb not null,
  created_at timestamptz not null default now(),
  constraint producto_valido check (
    datos ?& array['id','nombre','precio','oficial','categoria','descripcion','tallas','resenas']
    and datos->>'id' = id
    and length(trim(datos->>'nombre')) between 1 and 100
    and jsonb_typeof(datos->'precio') = 'number'
    and (datos->>'precio')::numeric > 0
    and (datos->>'precio')::numeric <= 100000000
    and jsonb_typeof(datos->'tallas') = 'array'
    and jsonb_typeof(datos->'resenas') = 'array'
    and datos->>'categoria' in ('ropa','peluches','vinilos','bolsos','accesorios')
    and ((usuario_id is null and datos->'oficial' = 'true'::jsonb)
      or (usuario_id is not null and datos->'oficial' = 'false'::jsonb
        and datos->>'usuarioId' = usuario_id::text))
  )
);
create table if not exists public.comentarios (
  id uuid primary key default gen_random_uuid(),
  producto_id text not null references public.productos(id) on delete cascade,
  usuario_id uuid not null references auth.users(id) on delete cascade,
  autor text not null,
  estrellas text not null check (estrellas in ('★☆☆☆☆','★★☆☆☆','★★★☆☆','★★★★☆','★★★★★')),
  texto text not null check (length(trim(texto)) between 1 and 500),
  created_at timestamptz not null default now()
);
-- El servidor asigna el autor; el navegador no puede firmar como otra persona.
create or replace function public.autor_comentario()
returns trigger language plpgsql set search_path = '' as $$
begin
  select '@' || nombre into new.autor from public.perfiles where id = auth.uid();
  return new;
end;
$$;
drop trigger if exists firmar_comentario on public.comentarios;
create trigger firmar_comentario before insert on public.comentarios
for each row execute function public.autor_comentario();

alter table public.perfiles enable row level security;
alter table public.productos enable row level security;
alter table public.comentarios enable row level security;
-- Sin políticas de delete/update para productos: la interfaz de esta entrega no las ofrece.
drop policy if exists leer_perfil on public.perfiles;
create policy leer_perfil on public.perfiles for select to authenticated using (id = auth.uid());
drop policy if exists editar_perfil on public.perfiles;
create policy editar_perfil on public.perfiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
drop policy if exists leer_productos on public.productos;
create policy leer_productos on public.productos for select to anon, authenticated using (true);
drop policy if exists publicar_producto on public.productos;
create policy publicar_producto on public.productos for insert to authenticated
with check (usuario_id = auth.uid() and datos->'oficial' = 'false'::jsonb and datos->>'usuarioId' = auth.uid()::text);
drop policy if exists leer_comentarios on public.comentarios;
create policy leer_comentarios on public.comentarios for select to anon, authenticated using (true);
drop policy if exists comentar on public.comentarios;
create policy comentar on public.comentarios for insert to authenticated with check (usuario_id = auth.uid());
grant usage on schema public to anon, authenticated;
revoke all on public.perfiles, public.productos, public.comentarios from anon, authenticated;
grant select on public.productos, public.comentarios to anon, authenticated;
grant insert on public.productos, public.comentarios to authenticated;
grant select on public.perfiles to authenticated;
grant update (nombre, bio) on public.perfiles to authenticated;

-- Favoritos y bolsa: datos privados por cuenta, disponibles entre dispositivos.
create table if not exists public.listas (
  usuario_id uuid not null references auth.users(id) on delete cascade,
  tipo text not null check (tipo in ('favoritos', 'carrito')),
  datos jsonb not null default '[]'::jsonb check (jsonb_typeof(datos) = 'array'),
  primary key (usuario_id, tipo)
);
alter table public.listas enable row level security;
drop policy if exists leer_lista on public.listas;
create policy leer_lista on public.listas for select to authenticated using (usuario_id = auth.uid());
drop policy if exists crear_lista on public.listas;
create policy crear_lista on public.listas for insert to authenticated with check (usuario_id = auth.uid());
drop policy if exists editar_lista on public.listas;
create policy editar_lista on public.listas for update to authenticated using (usuario_id = auth.uid()) with check (usuario_id = auth.uid());
revoke all on public.listas from anon, authenticated;
grant select, insert, update on public.listas to authenticated;

-- Fotos públicas de productos, máximo 300 KB; solo el dueño sube/borra su carpeta.
insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values ('productos','productos',true,307200,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = true, file_size_limit = 307200,
allowed_mime_types = array['image/jpeg','image/png','image/webp'];
drop policy if exists subir_foto on storage.objects;
create policy subir_foto on storage.objects for insert to authenticated
with check (bucket_id = 'productos' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists leer_foto_propia on storage.objects;
create policy leer_foto_propia on storage.objects for select to authenticated
using (bucket_id = 'productos' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists borrar_foto on storage.objects;
create policy borrar_foto on storage.objects for delete to authenticated
using (bucket_id = 'productos' and (storage.foldername(name))[1] = auth.uid()::text);

-- Las tablas deben estar publicadas para recibir eventos entre navegadores.
do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'productos') then
    alter publication supabase_realtime add table public.productos;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'listas') then
    alter publication supabase_realtime add table public.listas;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'comentarios') then
    alter publication supabase_realtime add table public.comentarios;
  end if;
end $$;
commit;
