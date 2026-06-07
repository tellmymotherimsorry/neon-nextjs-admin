# Neon Next.js Admin

Minimal Next.js + TypeScript app with Neon Postgres integration and simple admin UI.

Environment variables (server):

- `NEON_DATABASE_URL` — your Neon Postgres connection string
- `WRITE_SECRET` — server write secret (fallback: `mysecretkey123`)
- `READ_SECRET` — server read secret (fallback: `myreadsecret456`)

Environment variables (client):

- `NEXT_PUBLIC_WRITE_SECRET` — client write secret (fallback: `mysecretkey123`)
- `NEXT_PUBLIC_READ_SECRET` — client read secret (fallback: `myreadsecret456`)

Tables and seed:

Run the SQL in `sql/create_tables.sql` against your Neon database (for example with `psql`).

Deploying to Vercel:

1. Push this repo to GitHub.
2. Import the repo into Vercel.
3. In Vercel project settings, set the environment variables `NEON_DATABASE_URL`, `WRITE_SECRET`, `READ_SECRET`, `NEXT_PUBLIC_WRITE_SECRET`, and `NEXT_PUBLIC_READ_SECRET`.
4. Deploy — Vercel will run `npm install` and `npm run build`.

Notes:

- After deploying, run the `sql/create_tables.sql` SQL against your database to create tables and seed `trigger_state`.
- The frontend admin login is a simple client-side check for the string `ADMIN` and is not intended to be production authentication.

Git / Vercel push & deploy instructions

1. Create a new GitHub repository (via the website or `gh` CLI). Recommended name: `neon-nextjs-admin`.

2. From the project root, run:

```powershell
git init
git add .
git commit -m "Initial commit: Neon Next.js admin"
# Add remote (replace <your-github-repo-url> with the repository URL)
git remote add origin <your-github-repo-url>
git push -u origin main
```

3. Import the GitHub repo into Vercel (https://vercel.com/new). During import, set these Environment Variables in Vercel:

- `NEON_DATABASE_URL` = your Neon connection string
- `WRITE_SECRET` = mysecretkey123 (or your chosen secret)
- `READ_SECRET` = myreadsecret456 (or your chosen secret)
- `NEXT_PUBLIC_WRITE_SECRET` = same as `WRITE_SECRET` if you want client access (optional)
- `NEXT_PUBLIC_READ_SECRET` = same as `READ_SECRET` if you want client access (optional)

4. After Vercel deploy completes, run the SQL in `sql/create_tables.sql` against the Neon DB once to create the tables and seed state.

Automated deploy with Vercel CLI (optional):

```powershell
# Install Vercel CLI and log in
npm i -g vercel
vercel login
# From project root
vercel --prod
```

