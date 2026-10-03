# Parish Representatives — Diocese of Egba

A small Next.js app for collecting each parish's President & Secretary (or, where
there's none, two active members), organized by archdeaconry. Anyone with the link
can see what's already filled in, so entries don't get duplicated.

## How it's built (and why)

- **Frontend + backend in one app:** Next.js (App Router), with a server API route
  at `/api/data` handling reads and writes.
- **No separate database.** The list of archdeaconries/parishes is bundled in the
  code (`lib/parishes.ts`). The submissions people make (president/secretary/members)
  are stored in a single JSON file **inside this repo**, `data/fill-data.json`,
  which the API route reads and updates via the GitHub API. Every save is a real git
  commit to that file. This keeps things minimal — no database service to set up —
  at the cost of being best suited to moderate traffic (dozens of people filling
  this in over a few days), not high-frequency concurrent writes.
- `data/fill-data.json` already has the one entry that was filled in on the earlier
  version of this tool (Cathedral of St. Peter, Ake), so nothing is lost in the move.

## One-time setup

### 1. Push this to GitHub

```bash
cd parish-tracker
git init
git add .
git commit -m "Parish representatives tracker"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

### 2. Create a GitHub personal access token

The app needs write access to this one repo so it can commit updates to
`data/fill-data.json`.

1. Go to **github.com → Settings → Developer settings → Fine-grained personal
   access tokens → Generate new token**.
2. Under **Repository access**, choose **Only select repositories** and pick this repo.
3. Under **Permissions → Repository permissions**, set **Contents** to **Read and write**.
4. Generate the token and copy it — you won't see it again.

### 3. Import the repo into Vercel

1. On vercel.com, **Add New → Project**, and import this GitHub repo.
2. Before the first deploy, open **Environment Variables** and add:

| Name | Value |
|---|---|
| `GITHUB_TOKEN` | the token from step 2 |
| `GITHUB_OWNER` | your GitHub username or org |
| `GITHUB_REPO` | the repo name |
| `GITHUB_BRANCH` | `main` (or whatever branch you pushed to) |
| `GITHUB_DATA_PATH` | `data/fill-data.json` |

3. Deploy.

Once it's live, share the Vercel URL — no separate sharing/permissions step needed,
unlike a claude.ai artifact link. Everyone who opens it can view and submit.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in the same 5 values as above
npm run dev
```

## Project structure

```
app/
  page.tsx              Server component — loads current data, renders the tracker
  layout.tsx
  globals.css
  api/data/route.ts     GET (read all entries) / POST (validate + save one entry)
components/
  ParishTracker.tsx     All the interactive UI: search, accordion, add/edit forms
lib/
  parishes.ts           The 227 parishes across 30 archdeaconries (static)
  github-store.ts       Reads/writes data/fill-data.json via the GitHub Contents API
  types.ts
data/
  fill-data.json        The actual submissions (this file gets committed to by the app)
```

## A note on scale

Because each save is a git commit via the GitHub API, two people saving at the exact
same moment can hit a write conflict — the app retries automatically (up to 4 times)
if that happens. This is fine for a diocese-wide rollout over days, but if you ever
need much higher write volume, swap `lib/github-store.ts` for a real database (e.g.
Vercel Postgres or KV) — the rest of the app doesn't need to change.
