-- Friend requests and friendships. A row is a request until the addressee accepts it.

create table public.friendships (
  requester_id uuid not null references public.profiles (id) on delete cascade,
  addressee_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted')),
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  primary key (requester_id, addressee_id),
  check (requester_id <> addressee_id)
);

-- Only one relation per pair of users, whatever the direction of the request.
create unique index friendships_pair_idx
  on public.friendships (least(requester_id, addressee_id), greatest(requester_id, addressee_id));

create index friendships_addressee_idx on public.friendships (addressee_id);

alter table public.friendships enable row level security;

create policy "Users see their own friendships"
  on public.friendships for select to authenticated
  using ((select auth.uid()) in (requester_id, addressee_id));

create policy "Users send friend requests as themselves"
  on public.friendships for insert to authenticated
  with check (requester_id = (select auth.uid()) and status = 'pending');

create policy "Addressees accept requests"
  on public.friendships for update to authenticated
  using (addressee_id = (select auth.uid()) and status = 'pending')
  with check (addressee_id = (select auth.uid()) and status = 'accepted');

create policy "Either side can remove a friendship"
  on public.friendships for delete to authenticated
  using ((select auth.uid()) in (requester_id, addressee_id));

revoke insert, update, delete on public.friendships from anon;
revoke update on public.friendships from authenticated;
grant update (status, responded_at) on public.friendships to authenticated;

-- The caller and their accepted friends, with the XP earned since Monday in the given time zone.
create function public.get_friend_leaderboard(p_time_zone text)
returns table (
  id uuid,
  username text,
  avatar text,
  total_xp integer,
  current_streak integer,
  last_active_on date,
  weekly_xp integer
)
language sql
stable
security definer
set search_path = ''
as $$
  with members as (
    select (select auth.uid()) as member_id
    union
    select case
      when friendships.requester_id = (select auth.uid()) then friendships.addressee_id
      else friendships.requester_id
    end
    from public.friendships
    where friendships.status = 'accepted'
      and (select auth.uid()) in (friendships.requester_id, friendships.addressee_id)
  )
  select
    profiles.id,
    profiles.username,
    profiles.avatar,
    profiles.total_xp,
    profiles.current_streak,
    profiles.last_active_on,
    coalesce((
      select sum(sessions.xp)::integer
      from public.study_sessions as sessions
      where sessions.user_id = profiles.id
        and sessions.created_at >= date_trunc('week', now() at time zone p_time_zone) at time zone p_time_zone
    ), 0) as weekly_xp
  from members
  join public.profiles on profiles.id = members.member_id
  where members.member_id is not null
  order by weekly_xp desc, profiles.total_xp desc, profiles.username;
$$;

revoke execute on function public.get_friend_leaderboard(text) from public, anon;
grant execute on function public.get_friend_leaderboard(text) to authenticated;
