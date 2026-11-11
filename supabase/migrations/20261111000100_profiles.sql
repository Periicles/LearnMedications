-- Profiles: one public row per authenticated user.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique check (username ~ '^[a-z0-9_]{3,20}$'),
  avatar text not null default '💊' check (char_length(avatar) between 1 and 16),
  total_xp integer not null default 0 check (total_xp >= 0),
  current_streak integer not null default 0 check (current_streak >= 0),
  longest_streak integer not null default 0 check (longest_streak >= 0),
  last_active_on date,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Any signed-in user can read profiles (needed for friends and leaderboards).
create policy "Profiles are readable by signed-in users"
  on public.profiles for select
  to authenticated
  using (true);

-- Users may only edit their own identity fields; progress columns are server-managed.
create policy "Users update their own profile"
  on public.profiles for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

revoke insert, update, delete on public.profiles from anon, authenticated;
grant update (username, avatar) on public.profiles to authenticated;

-- Creates the profile when a user signs up, using the username sent as sign-up metadata.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  wanted text := lower(coalesce(new.raw_user_meta_data ->> 'username', ''));
  candidate text;
begin
  if wanted !~ '^[a-z0-9_]{3,20}$' then
    wanted := 'user';
  end if;
  candidate := wanted;
  while exists (select 1 from public.profiles where username = candidate) loop
    candidate := left(wanted, 15) || '_' || substr(md5(random()::text), 1, 4);
  end loop;
  insert into public.profiles (id, username) values (new.id, candidate);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Lets the sign-up form check a username before creating the account.
create function public.is_username_available(wanted text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select not exists (select 1 from public.profiles where username = lower(wanted));
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.is_username_available(text) from public;
grant execute on function public.is_username_available(text) to anon, authenticated;
