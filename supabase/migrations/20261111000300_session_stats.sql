-- Aggregated counters about the caller's own sessions, used for statistics and achievements.

create function public.get_session_stats()
returns table (
  session_count integer,
  perfect_count integer,
  review_count integer,
  answer_count integer,
  correct_count integer
)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    count(*)::integer,
    count(*) filter (where sessions.correct_count = sessions.total_count)::integer,
    count(*) filter (where sessions.mode = 'review')::integer,
    coalesce(sum(sessions.total_count), 0)::integer,
    coalesce(sum(sessions.correct_count), 0)::integer
  from public.study_sessions as sessions
  where sessions.user_id = (select auth.uid());
$$;

revoke execute on function public.get_session_stats() from public, anon;
grant execute on function public.get_session_stats() to authenticated;

-- XP earned per calendar day (in the given time zone) for the caller, over the last days.
create function public.get_daily_xp(p_time_zone text, p_days integer)
returns table (day date, xp integer)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    (sessions.created_at at time zone p_time_zone)::date as day,
    sum(sessions.xp)::integer as xp
  from public.study_sessions as sessions
  where sessions.user_id = (select auth.uid())
    and sessions.created_at >= now() - make_interval(days => least(greatest(p_days, 1), 366))
  group by 1
  order by 1;
$$;

revoke execute on function public.get_daily_xp(text, integer) from public, anon;
grant execute on function public.get_daily_xp(text, integer) to authenticated;
