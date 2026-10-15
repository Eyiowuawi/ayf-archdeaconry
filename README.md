# Parish Representatives — Diocese of Egba

A small Next.js app for collecting each parish's President & Secretary (or, where
there's none, two active members), organized by archdeaconry. Anyone with the link
can see what's already filled in, so entries don't get duplicated.

## How it's built (and why)

- **Frontend + backend in one app:** Next.js (App Router), with a server API route
  at `/api/data` handling reads and writes.
- **No separate database.** The list of archdeaconries/parishes is bundled in the
  code (`shared/data/parishes.ts`). The submissions people make (president/secretary/members)
  are stored in a single JSON file **inside this repo**, `data/fill-data.json`,
  which the API route reads and updates via the GitHub API. Every save is a real git
  commit to that file. This keeps things minimal — no database service to set up —
  at the cost of being best suited to moderate traffic (dozens of people filling
  this in over a few days), not high-frequency concurrent writes.
- `data/fill-data.json` already has the one entry that was filled in on the earlier
  version of this tool (Cathedral of St. Peter, Ake), so nothing is lost in the move.

## Public youth website

The same app also serves the public Anglican Youth Fellowship site:

| Route                                 | What it is                                                              |
| ------------------------------------- | ----------------------------------------------------------------------- |
| `/`                                   | Homepage: welcome, upcoming events, this week's devotional              |
| `/events`                             | Upcoming and past events                                                |
| `/devotionals`, `/devotionals/<slug>` | Weekly devotionals                                                      |
| `/contact`                            | Diocesan Secretariat address, email and office hours                    |
| `/register`                           | Membership registration form (preview: validates but does not save yet) |
| `/representatives`                    | The parish representatives tracker (previously at `/`)                  |

**Styling:** the site uses Tailwind CSS v4 wired to design tokens in `app/theme.css`.
Colours (light and dark), radii and animations are defined there once and exposed as semantic
utilities (`bg-surface`, `text-ink`, `bg-primary`, `bg-accent`, `bg-sun`, `bg-night`, ...), so
changing a value in that file restyles the whole site. The colours follow the official AYF (Nig.) logo in `public/ayf-logo.png`: navy, laurel green and gold. Visitors can switch light/dark/device theme from the header (saved in their browser). Fonts (Bricolage Grotesque for headings, Plus Jakarta Sans
for text) are loaded with `next/font` in `app/layout.tsx`. Shared building blocks live in
`shared/ui/`. Buttons, cards, inputs, labels, selects and checkboxes are
[shadcn/ui](https://ui.shadcn.com) components (built on Radix UI), restyled with the theme tokens;
add more with `npx shadcn@latest add <name>` (config in `components.json`) and swap the shadcn
colour classes for the AYF ones. Page layout pieces are in `shared/ui/page-layout.tsx` and the animations (scroll reveals,
rotating headline word, count-up stats, marquee, drifting colour blobs) in
`shared/ui/motion.tsx`; all of them switch off for visitors who ask their device for
reduced motion. The parish representatives tracker
still uses its original CSS, scoped to that page in `features/representatives/components/tracker.css`.

Content lives in code, so updating it is an edit + commit:

- **Events:** `features/events/data/starter-events.ts` (starter events; once a database is connected, events are managed in the admin area). Events move from "Upcoming" to "Past" on their own once their date passes.
- **Fellowship facts, values, contact:** `features/site/data/site.ts`. Phone numbers stay hidden until `phonesConfirmed` is true.
- **Devotionals:** `features/devotionals/data/starter-devotionals.ts`. The newest by date is featured on the homepage.
- **Registration:** `features/members/components/registration-form.tsx`. It reuses the parish list from
  `shared/data/parishes.ts`. When a youth records database exists, send the form data there in
  `handleSubmit` and set `SAVES_ENABLED = true`. The record shape (including education levels)
  is in `features/members/utils/registrations.ts`, ready for the planned admin dashboard to list and approve.

## Admin area (`/admin`)

Sign in at `/admin`. There are two accounts for now:

- **Demo:** `demo@ayfegba.org` / `AYFdemo2026`. Works with no setup. It sees sample people, events and
  devotionals (changes reset when the server restarts) and the real parish representatives list, which is
  already public on `/representatives`. Its password is public in this repo, so it never sees real registrations.
- **Admin:** email `admin` and the password in the `ADMIN_PASSWORD` environment variable. Sees the real data.

From there you can:

- **Registrations:** see everyone who joined through the Join page, filter by status, search,
  approve or reject, and export to CSV (opens in Excel or Google Sheets).
- **Parish reps:** the representatives each parish sent through `/representatives`, with progress per
  archdeaconry, filters and CSV export.
- **Events:** add, edit, publish, unpublish or delete them. New events start unpublished. Each event can have
  a description, speakers, a flier (image or PDF), one day with a start and end time or several days, and
  registration with opening and closing times plus extra questions.
- **Check-in:** scan tickets with the phone or laptop camera (or type the code) at the entrance. Each event's
  **Attendees** page lists who registered and who has arrived, with CSV export.
- **Devotionals:** add, edit, hide or delete them. Changes appear on the website straight away.

## Event registration and tickets

Every member gets a **user code** (like `AYF-7KQ2MX`) when they join. On an event's page, returning members
type their user code or phone number to find their record; new members fill the Join form first. They are
then asked only for the event's extra details they have never given (answers are saved on their record),
and land on their **ticket**: a QR code they can share, send to WhatsApp, print or save as PDF. At the
entrance, the admin **Check-in** screen scans it and shows the person's name, or warns if the ticket was
already used or is for another event.

**No database is connected yet.** Until one is chosen, the live site shows the starter content in
`features/*/data/`, the Join form stays in preview mode, and the admin area says so. Locally,
`npm run dev` (or `CMS_LOCAL_STORE=1 npm start`) saves to a test file, `.data/cms.json`, so you can try
everything. To go live, implement the `Store` interface in `shared/db/store.ts` for the chosen database
and return it from `getStore()` in `shared/db/index.ts`; nothing else needs to change. Member details,
including under-18s, must go in that private database, never in this public repository.

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

| Name               | Value                                     |
| ------------------ | ----------------------------------------- |
| `GITHUB_TOKEN`     | the token from step 2                     |
| `GITHUB_OWNER`     | your GitHub username or org               |
| `GITHUB_REPO`      | the repo name                             |
| `GITHUB_BRANCH`    | `main` (or whatever branch you pushed to) |
| `GITHUB_DATA_PATH` | `data/fill-data.json`                     |

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

The layout follows the plug-admin-dashboard project: thin routes in `app/`, everything else grouped
by feature, shared building blocks in `shared/`, and small helpers in `utils/`.

```
app/                     Next.js routes only: each page.tsx renders its feature's page component
features/<name>/
  components/            <page>-page.tsx per route, plus forms and parts
  services/              Server actions and data access (<name>-actions.ts)
  types/index.ts         The feature's data shapes
  utils/  data/          Feature-local helpers and starter content
    auth/                Admin sign-in and sessions
    dashboard/           Admin dashboard
    events/              Events, registration, tickets, check-in
    devotionals/         Devotionals
    members/             Join form and member records
    representatives/     Parish representatives tracker
    site/                Home and contact pages
shared/
  ui/                    shadcn/ui-style Radix primitives restyled with AYF tokens
  layout/                Site header/footer/nav; the admin shell (sidebar, header with
                         breadcrumbs, page header) after plug-admin-dashboard; theme toggle
  store/ui-store.ts      Admin sidebar pin, mobile menu and breadcrumb titles (zustand)
  hooks/                 Shared React hooks
  db/                    Storage interface, local test store and demo account data
  data/parishes.ts       The 227 parishes across 30 archdeaconries
  types/                 Types used by more than one feature
utils/                   cn(), form helpers, CSV, codes, theme script
scripts/                 Tests, run with `npm test`
data/fill-data.json      Parish representatives submissions (committed to by the app)
```

## A note on scale

Because each save is a git commit via the GitHub API, two people saving at the exact
same moment can hit a write conflict — the app retries automatically (up to 4 times)
if that happens. This is fine for a diocese-wide rollout over days, but if you ever
need much higher write volume, swap `features/representatives/services/github-store.ts` for a real database (e.g.
Vercel Postgres or KV) — the rest of the app doesn't need to change.
