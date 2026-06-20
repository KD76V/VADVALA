# Vadvala Real Estates

Website for Vadvala Real Estates, Ahmedabad — public listing browser + password-protected admin panel.

## What's inside

- `src/VadvalaApp.jsx` — the whole site (public view + admin dashboard)
- `public/logo.png` — your banyan tree logo (shown by default, can be replaced from Admin)
- Built with React + Vite

## Run it locally (optional, only if you have Node.js installed)

```
npm install
npm run dev
```

Then open the link it shows (usually `http://localhost:5173`).

## Deploy for free (recommended path)

1. Push this folder to a new GitHub repository.
2. Go to [vercel.com](https://vercel.com) → sign in with GitHub → "Add New Project" → select this repo.
3. Leave all settings as default (Vercel auto-detects Vite) → click **Deploy**.
4. You'll get a live link like `vadvala-real-estates.vercel.app`.
5. (Optional) Buy a domain like `vadvalarealestates.com` and connect it under Vercel → Project → Settings → Domains.

## Admin access

- Click **Admin** on the site → password: `vadvala2026`
- **Change this password** in `src/VadvalaApp.jsx` (search for `ADMIN_PASSWORD`) before sharing the live link publicly.
- From Admin you can: upload/replace the logo, add new listings (poster image + details), edit, and delete.

## Important limitation to know

Listing/logo data is currently saved using the browser's `localStorage`. This means:
- Changes you make in Admin on your phone/laptop will show on that same device/browser.
- They will **not** automatically appear for other visitors on their own devices.

This is fine for testing and personal use. For listings to update live for every visitor, the storage functions in `VadvalaApp.jsx` (`loadListings`, `saveListings`, `loadLogo`, `saveLogo`) need to be connected to a real backend — Firebase and Supabase both have free tiers that work well for this. The rest of the app does not need to change.

## Before going live, update

- `ADMIN_PASSWORD` in `src/VadvalaApp.jsx`
- The WhatsApp number `91XXXXXXXXXX` (appears in the listing detail modal) — replace with your real number
