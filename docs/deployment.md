# Deployment

## 1. Supabase

1. Create a project on [supabase.com](https://supabase.com) (a European region such as Paris).
2. Apply the migrations (see [database.md](database.md)).
3. In **Authentication → URL Configuration**, set the Site URL to the production URL and add
   these redirect URLs:
   - `http://localhost:3000/auth/confirm`
   - `https://<production-domain>/auth/confirm`
   - `https://*-<vercel-team>.vercel.app/auth/confirm` for preview deployments
4. In **Authentication → Emails**, configure a custom SMTP provider before opening the app to
   real users: the built-in mailer only sends a few e-mails per hour.
5. Copy the project URL, the publishable key and the secret key from **Project Settings → API
   Keys**.

## 2. Environment variables

| Variable                               | Where            | Notes                            |
| -------------------------------------- | ---------------- | -------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`             | Browser + server | Project URL                      |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Browser + server | Publishable (anon) key           |
| `SUPABASE_SECRET_KEY`                  | Server only      | Secret key; never expose it      |
| `NEXT_PUBLIC_SITE_URL`                 | Browser + server | Public URL, used in e-mail links |

Locally they go in `.env.local` (see `.env.example`).

## 3. Vercel

1. Import the GitHub repository in Vercel; the framework is detected automatically.
2. Set **Production Branch** to `main`. Every push to `develop` and every pull request gets a
   preview deployment.
3. Add the environment variables for the Production and Preview environments.
   `NEXT_PUBLIC_SITE_URL` can be left empty for previews: the deployment URL is used instead.

Continuous deployment is handled by the Vercel Git integration; GitHub Actions only runs the
quality checks.

## 4. Custom domain (OVH)

To serve the app on a subdomain of `paulragueneau.com`, for example
`pharmalingo.paulragueneau.com`:

1. In Vercel, **Project → Settings → Domains**, add the subdomain.
2. In the OVH manager, **Web Cloud → Domain names → paulragueneau.com → DNS zone**, add a
   `CNAME` record for the subdomain pointing to the target shown by Vercel (usually
   `cname.vercel-dns.com.`).
3. Wait for DNS propagation; Vercel issues the TLS certificate automatically.
4. Update `NEXT_PUBLIC_SITE_URL` and the Supabase Site URL and redirect URLs with the domain.

## Installing on iPhone and iPad

The app is a PWA: open it in Safari, tap **Share → Add to Home Screen**. It then opens full
screen like a native app. There is no offline mode: lessons need a connection to be saved.
