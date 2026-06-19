# Martin's Auto Detailing — website

A fast, single-page marketing site for **Sandro Martin** — mobile auto detailing,
exterior home cleaning, and handyman help across MetroWest, MA.

Plain HTML/CSS/JS — **no build step, no framework, no dependencies.** It's designed to
be hosted free on **GitHub Pages** with the custom domain `martinsautodetailing.com`.

---

## Files

```
index.html        # the whole page
styles.css        # all styling (brand theme lives at the top in :root)
script.js         # menu, scroll reveals, before/after slider, quote form
404.html          # themed "page not found"
CNAME             # custom domain for GitHub Pages — do not delete
.nojekyll         # tells GitHub Pages to serve files as-is
robots.txt
sitemap.xml
assets/
  favicon.svg            # the logo mark (teal car + sparkle badge)
  apple-touch-icon.png   # iOS home-screen icon
  og-image.png/.svg      # social-share preview card
  before.svg / after.svg # before/after slider images (placeholders)
```

## Preview locally

From this folder:

```bash
python3 -m http.server 4321
# then open http://localhost:4321
```

---

## Deploy to GitHub Pages (free hosting)

You do **not** need a new GitHub organization. Your personal account
(`DavidWatkins`) already hosts `davidwatkins.github.io` as your *user site*; this
becomes a separate *project site* in its own repo, with its own custom domain.

> One caveat: on a free GitHub plan, Pages only serves **public** repos. The source
> here is just static HTML, so that's fine. (A private repo needs GitHub Pro.)

```bash
cd martinsautodetailing_website
git init
git add .
git commit -m "Initial site"

# create the public repo and push (gh is already authenticated as DavidWatkins)
gh repo create martinsautodetailing --public --source=. --remote=origin --push

# turn on Pages from the main branch root
gh api -X POST repos/DavidWatkins/martinsautodetailing/pages \
  -f source.branch=main -f source.path=/
```

Then in the repo: **Settings → Pages → Custom domain** should already read
`martinsautodetailing.com` (from the `CNAME` file). Tick **Enforce HTTPS** once the
certificate is issued (can take a few minutes to an hour).

### DNS at Porkbun

In the Porkbun DNS panel for `martinsautodetailing.com`, set:

| Type  | Host  | Answer / Value          |
|-------|-------|-------------------------|
| A     | (blank / `@`) | `185.199.108.153` |
| A     | `@`   | `185.199.109.153`       |
| A     | `@`   | `185.199.110.153`       |
| A     | `@`   | `185.199.111.153`       |
| CNAME | `www` | `davidwatkins.github.io.` |

(Optional IPv6 — add four `AAAA` records on `@`: `2606:50c0:8000::153`,
`...8001::153`, `...8002::153`, `...8003::153`.)

DNS can take anywhere from a few minutes to a day to propagate.

---

## How to maintain it (no coding needed for most edits)

**Change a price** — open `index.html`, find the `Pricing` section, edit the number
inside `<p class="price">`. Update the matching number in the JSON-LD block in
`<head>` too (helps Google).

**Change the phone number** — it appears as `tel:+15082023659`,
`sms:+15082023659`, and as visible text `508-202-3659`. Search-and-replace all of
them, plus `SANDRO_PHONE` in `script.js`.

**Edit any wording** — it's all plain text in `index.html`. Edit and save.

**Add real photos** (when Sandro has them):
- *Gallery:* in the `Recent jobs` grid, replace a tile's
  `<div class="shot-img">…</div>` with `<img src="assets/gallery/your-photo.jpg" alt="...">`.
  Drop the photo in `assets/gallery/`. Aim for landscape, ~1200px wide.
- *Before/after slider:* replace `assets/before.svg` and `assets/after.svg` with real
  photos of the same car from the same angle (keep the same filenames, or update the
  `src` in the `#beforeAfter` block).

**Recolor the brand** — every color is a CSS variable at the top of `styles.css`
(`:root`). `--teal` is the main brand color pulled from the van.

**Regenerate the logo / share image** — the source SVGs are in `assets/`. To re-export
PNGs after editing: `rsvg-convert -w 1200 -h 630 assets/og-image.svg -o assets/og-image.png`.

**After any change**, commit and push — Pages redeploys automatically:

```bash
git add . && git commit -m "Update prices" && git push
```

---

## The quote form

To keep things 100% static (no server, no monthly cost), the **Request a quote** form
opens a pre-filled **text message** to Sandro from the visitor's phone — leads go
straight to him. To switch to email or a hosted form later, see the comment near the
top of the form handler in `script.js` (a free [Formspree](https://formspree.io) endpoint
is the easiest upgrade).

## Notes / left intentionally blank

- **Photos** are on-brand placeholders until Sandro provides real ones.
- **Email address** is not published — phone/text is the contact method. If you set up
  email forwarding on Porkbun, you can add a `mailto:` link.
- **Social links** (Facebook/Instagram) aren't included yet — easy to add to the footer.
- Sandro's town (Framingham) is deliberately **not** mentioned; the site says
  "MetroWest" for the service area.
