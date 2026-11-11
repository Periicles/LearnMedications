export const ROUTES = {
  home: "/",
  demo: "/demo",
  login: "/login",
  signup: "/signup",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  learn: "/learn",
  review: "/review",
  reviewSession: "/lesson/review",
  library: "/library",
  friends: "/friends",
  achievements: "/achievements",
  profile: "/profile",
} as const;

export function collectionRoute(collectionSlug: string): string {
  return `${ROUTES.learn}/${collectionSlug}`;
}

export function lessonRoute(collectionSlug: string, lessonKey: string): string {
  return `/lesson/${collectionSlug}/${lessonKey}`;
}
