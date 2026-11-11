import { APP_TIME_ZONE } from "../constants";

const DAY_IN_MS = 86_400_000;

/** Calendar day (YYYY-MM-DD) in the app time zone. */
export function toLocalDay(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: APP_TIME_ZONE }).format(date);
}

export function shiftDay(dayKey: string, offset: number): string {
  const shifted = new Date(Date.parse(`${dayKey}T00:00:00Z`) + offset * DAY_IN_MS);
  return shifted.toISOString().slice(0, 10);
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_IN_MS);
}

/** The last `count` calendar days ending today, oldest first. */
export function lastDays(today: string, count: number): string[] {
  return Array.from({ length: count }, (_unused, index) => shiftDay(today, index - count + 1));
}
