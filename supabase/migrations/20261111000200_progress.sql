-- Learning progress. Rows are written by the server (service role) only; users can read their own.

create table public.study_sessions (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  mode text not null check (mode in ('learn', 'review')),
  xp integer not null check (xp >= 0),
  correct_count integer not null check (correct_count >= 0),
  total_count integer not null check (total_count >= correct_count),
  created_at timestamptz not null default now()
);

create index study_sessions_user_created_idx on public.study_sessions (user_id, created_at desc);

create table public.lesson_completions (
  user_id uuid not null references public.profiles (id) on delete cascade,
  collection_slug text not null,
  lesson_key text not null,
  best_accuracy real not null check (best_accuracy between 0 and 1),
  completions integer not null default 1 check (completions > 0),
  first_completed_at timestamptz not null default now(),
  last_completed_at timestamptz not null default now(),
  primary key (user_id, collection_slug, lesson_key)
);

create table public.substance_mastery (
  user_id uuid not null references public.profiles (id) on delete cascade,
  substance_slug text not null,
  strength smallint not null check (strength between 0 and 5),
  correct_count integer not null default 0 check (correct_count >= 0),
  wrong_count integer not null default 0 check (wrong_count >= 0),
  last_seen_at timestamptz not null default now(),
  next_review_at timestamptz not null,
  primary key (user_id, substance_slug)
);

create index substance_mastery_due_idx on public.substance_mastery (user_id, next_review_at);

create table public.user_achievements (
  user_id uuid not null references public.profiles (id) on delete cascade,
  achievement_key text not null,
  unlocked_at timestamptz not null default now(),
  primary key (user_id, achievement_key)
);

alter table public.study_sessions enable row level security;
alter table public.lesson_completions enable row level security;
alter table public.substance_mastery enable row level security;
alter table public.user_achievements enable row level security;

create policy "Users read their own sessions"
  on public.study_sessions for select to authenticated
  using (user_id = (select auth.uid()));

create policy "Users read their own completions"
  on public.lesson_completions for select to authenticated
  using (user_id = (select auth.uid()));

create policy "Users read their own mastery"
  on public.substance_mastery for select to authenticated
  using (user_id = (select auth.uid()));

-- Achievements are public among signed-in users so friends can see them.
create policy "Achievements are readable by signed-in users"
  on public.user_achievements for select to authenticated
  using (true);

revoke insert, update, delete
  on public.study_sessions, public.lesson_completions, public.substance_mastery, public.user_achievements
  from anon, authenticated;

-- Atomically stores the outcome of a finished session. The values are computed by the server.
create function public.apply_session_result(
  p_user_id uuid,
  p_mode text,
  p_xp integer,
  p_correct_count integer,
  p_total_count integer,
  p_today date,
  p_streak integer,
  p_lesson jsonb,
  p_mastery jsonb,
  p_achievements text[]
)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_total integer;
begin
  insert into public.study_sessions (user_id, mode, xp, correct_count, total_count)
  values (p_user_id, p_mode, p_xp, p_correct_count, p_total_count);

  update public.profiles
  set total_xp = total_xp + p_xp,
      current_streak = p_streak,
      longest_streak = greatest(longest_streak, p_streak),
      last_active_on = p_today
  where id = p_user_id
  returning total_xp into new_total;

  if new_total is null then
    raise exception 'Unknown profile %', p_user_id;
  end if;

  if p_lesson is not null then
    insert into public.lesson_completions (user_id, collection_slug, lesson_key, best_accuracy)
    values (
      p_user_id,
      p_lesson ->> 'collection_slug',
      p_lesson ->> 'lesson_key',
      (p_lesson ->> 'accuracy')::real
    )
    on conflict (user_id, collection_slug, lesson_key) do update
    set best_accuracy = greatest(public.lesson_completions.best_accuracy, excluded.best_accuracy),
        completions = public.lesson_completions.completions + 1,
        last_completed_at = now();
  end if;

  insert into public.substance_mastery
    (user_id, substance_slug, strength, correct_count, wrong_count, next_review_at)
  select
    p_user_id,
    item ->> 'substance_slug',
    (item ->> 'strength')::smallint,
    (item ->> 'correct_count')::integer,
    (item ->> 'wrong_count')::integer,
    (item ->> 'next_review_at')::timestamptz
  from jsonb_array_elements(coalesce(p_mastery, '[]'::jsonb)) as item
  on conflict (user_id, substance_slug) do update
  set strength = excluded.strength,
      correct_count = excluded.correct_count,
      wrong_count = excluded.wrong_count,
      last_seen_at = now(),
      next_review_at = excluded.next_review_at;

  insert into public.user_achievements (user_id, achievement_key)
  select p_user_id, unnest(coalesce(p_achievements, '{}'::text[]))
  on conflict do nothing;

  return new_total;
end;
$$;

revoke execute on function public.apply_session_result(
  uuid, text, integer, integer, integer, date, integer, jsonb, jsonb, text[]
) from public, anon, authenticated;
grant execute on function public.apply_session_result(
  uuid, text, integer, integer, integer, date, integer, jsonb, jsonb, text[]
) to service_role;
