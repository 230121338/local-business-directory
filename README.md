# LocalLink — Community Business Directory

LocalLink is a directory website that helps people find local businesses —
restaurants, tradespeople, tutors, beauty studios and more — and helps small
business owners get discovered by their own neighbourhood. It was built to
satisfy the Khumalo Local Business Directory **User Requirements
Specification (URS)** and **Technical Requirement Specification (TRS)**.

Built with **Next.js 14 (App Router)**, **React 18** and **Tailwind CSS**, on
a local JSON data store — exactly the version-1 stack described in the TRS,
with clear seams for plugging in a real database and backend later.

---

## 1. What's included

| Area | Where | Notes |
|---|---|---|
| Homepage with hero search, featured listings, category grid | `app/page.js` | |
| Browse / search / filter businesses | `app/businesses/page.js` | Search by name, filter by category and area |
| Business detail page | `app/businesses/[id]/page.js` | Contact actions, hours, open-now status, reviews |
| Business submission form | `app/submit/page.js` | Client-side validation |
| Reviews & ratings | `app/businesses/[id]/ReviewsSection.js` | View + add a review |
| Administrator portal | `app/admin/page.js` | Password-gated demo dashboard: approve/reject listings, moderate reviews, export CSV reports |
| Sample data | `data/*.json` | 14 sample businesses, 8 categories, 10 sample reviews across South Africa |

### Design direction

The visual identity leans into the idea of a neighbourhood noticeboard: warm
paper background, a navy "ink" for structure, a clay-orange and marigold
accent pair, and a signature **hand-stamped "open now" badge** on every
listing — a nod to the hand-painted signage you'd see outside a real local
shop. Headings use **Fraunces** (a warm serif with personality), body copy
uses **Inter**, and data/labels use **IBM Plex Mono** to feel like a ledger
entry.

---

## 2. Running the project locally

You'll need [Node.js](https://nodejs.org) version 18 or later installed.

```bash
# 1. Move into the project folder
cd locallink

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open **http://localhost:3000** in your browser. The site reloads
automatically as you edit files.

To sign in to the admin portal at `/admin`, use the demo password:

```
locallink-admin
```

> This demo password is hardcoded in `app/admin/AdminGate.js` purely so
> reviewers can explore the dashboard without a backend. See section 5 below
> before using this anywhere real users can reach it.

---

## 3. Project structure

```
locallink/
├── app/                     # Next.js App Router pages
│   ├── page.js              # Homepage
│   ├── about/page.js
│   ├── businesses/
│   │   ├── page.js          # Search + filter listing page
│   │   └── [id]/
│   │       ├── page.js      # Business detail page
│   │       └── ReviewsSection.js
│   ├── submit/
│   │   ├── page.js
│   │   └── SubmitForm.js
│   ├── admin/
│   │   ├── page.js
│   │   ├── AdminGate.js
│   │   └── AdminDashboard.js
│   ├── layout.js            # Fonts, Navbar, Footer
│   └── globals.css
├── components/               # Shared UI: Navbar, Footer, BusinessCard, etc.
├── lib/
│   ├── data.js               # All data-fetching logic (JSON today, DB later)
│   └── utils.js               # Open/closed logic, formatting, validation
├── data/
│   ├── businesses.json
│   ├── categories.json
│   └── reviews.json
├── tailwind.config.js
└── package.json
```

---

## 4. How this maps to the URS / TRS

- **5.3–5.6 Business listings, search, category filtering, detail pages** —
  `lib/data.js` + `app/businesses/`
- **5.7 Contact and enquiries** — call, email and WhatsApp actions on the
  business detail page
- **5.8 Business submission** — `app/submit/`, with field validation matching
  the "prevent incomplete or invalid submissions" requirement
- **5.9 Reviews and ratings** — `ReviewsSection.js` (visitor side) and the
  admin **Reviews** tab (moderation side)
- **5.11 Reporting / Section 6 Administrative Portal** — the admin dashboard's
  Overview tab (listings by category, pending counts) and CSV export buttons
- **Section 7 Non-functional requirements** — mobile-responsive layout,
  visible keyboard focus states, reduced-motion support baked into
  `globals.css`
- **Section 8 Security (TRS)** — see section 5 below for what's simulated in
  this version vs. what a production build needs

---

## 5. Important limitations of this version (read before going live)

This is a **version-1, front-end-only build**, matching what the TRS
describes for the first release (JSON data store, no live backend yet). A
few things to know:

- **Data doesn't persist.** New business submissions, new reviews, and
  admin approve/reject actions only update the page's in-memory state. They
  reset on refresh. To make them permanent, connect a real database (the TRS
  suggests Firebase or Supabase) and replace the functions inside
  `lib/data.js` with real API calls — the rest of the app doesn't need to
  change, because every page reads through that one file.
- **The admin login is a demo, not real authentication.** It's a single
  hardcoded password checked in the browser, so it is **not secure** and
  must not be relied on to protect real business or user data. Before
  handling real submissions, replace it with proper server-side
  authentication (hashed passwords, sessions or a library like NextAuth.js),
  as described in TRS section 8.
- **PDF/Excel export isn't wired up yet** — CSV export is fully functional
  from the admin dashboard today; PDF and Excel formats mentioned in URS
  section 5.11 are a good next step once a backend exists to generate them
  server-side.
- **Images use placeholder stock photography** — swap the `image` field in
  `data/businesses.json` for real photos, or wire up an image upload flow
  once a backend/storage service is connected.

None of this blocks using the project as a working prototype, portfolio
piece, or the foundation for a real build — it just means the "future
backend" work described throughout the TRS is the natural next phase.

---

## 6. Uploading this project to GitHub

There are two ways to do this. Pick whichever feels more comfortable.

### Option A — using GitHub Desktop (no command line)

1. Download and install [GitHub Desktop](https://desktop.github.com) and
   sign in with your GitHub account.
2. Open GitHub Desktop → **File → Add Local Repository**.
3. Browse to and select the `locallink` folder, then click **Add
   Repository**. If it asks to create a repository because one doesn't
   exist yet, click **create a repository**.
4. Fill in a summary (e.g. "Initial commit — LocalLink directory") and click
   **Commit to main**.
5. Click **Publish repository** in the top bar. Choose a name (e.g.
   `locallink`), decide if it should be public or private, and click
   **Publish Repository**.
6. Your code is now on GitHub — GitHub Desktop will show a **View on
   GitHub** button to open it in your browser.

### Option B — using the command line (git)

1. Install [Git](https://git-scm.com/downloads) if you don't already have
   it, and create an empty repository on GitHub (github.com → **New
   repository** → give it a name like `locallink` → **do not** initialise it
   with a README, since this project already has one → **Create
   repository**).
2. In your terminal, move into the project folder and initialise git:

   ```bash
   cd locallink
   git init
   git add .
   git commit -m "Initial commit — LocalLink community business directory"
   git branch -M main
   ```

3. Copy the remote URL GitHub shows you after creating the repository (it
   looks like `https://github.com/your-username/locallink.git`), then run:

   ```bash
   git remote add origin https://github.com/your-username/locallink.git
   git push -u origin main
   ```

4. Refresh the repository page on GitHub — your files should now be there.

From then on, whenever you make changes:

```bash
git add .
git commit -m "Describe what you changed"
git push
```

### Deploying it live (optional)

The TRS recommends **Vercel** hosting, which is built by the same team as
Next.js and deploys straight from a GitHub repository:

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub
   account.
2. Click **Add New → Project**, then select your `locallink` repository.
3. Leave the default settings (Vercel auto-detects Next.js) and click
   **Deploy**.
4. After a minute or two you'll get a live URL you can share — every future
   `git push` to `main` will automatically redeploy the site.

---

## 7. Suggested next steps

- Connect a real database (Firebase/Supabase, per TRS section 3.3) and move
  the functions in `lib/data.js` over to it.
- Add server-side authentication for the admin portal and business owner
  accounts.
- Add image upload for business owners submitting their own photos.
- Wire up PDF/Excel report exports alongside the existing CSV export.
- Add map integration for the "location or area" search filter, as noted as
  a future integration in URS section 8.

---

Built as a professional, human-centred take on the Khumalo Local Business
Directory brief — designed to feel like a trustworthy community noticeboard,
not a generic template.
