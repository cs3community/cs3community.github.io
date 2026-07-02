# CS3 Community website

Be aware that the content of this repo is visible publicly at:
https://www.cs3community.org/

This is a [Hugo](https://gohugo.io/) site (set up as a Hugo Module - see `go.mod`).
Pushing to `master` triggers `.github/workflows/deploy.yml`, which builds
the site and deploys it to GitHub Pages. The workflow also runs on a daily
schedule to pick up date-driven changes (see below) and can be triggered
manually from the Actions tab.

**One-time manual step still needed:** in this repo's Settings → Pages,
set Source to "GitHub Actions" (it currently says "Deploy from a branch").
Until that's done, the workflow will build successfully but the deploy
step will fail.

## Editing conferences

Conference data lives in `data/conferences.toml` - one `[[conferences]]`
entry per year. See the comments at the top of that file for the field
reference. In short:

- Every entry needs `year`, `city`, `country`, `organizer`, `website`,
  `image` (a filename under `static/images/conferences/`), and optionally
  `programme`/`doi`.
- Only the conference matching the *current calendar year* also needs
  `start_date`/`end_date`/`register`/`abstract`/`[conferences.timeline]` -
  that's the one featured at the top of the homepage. Its Website/Abstract/
  Programme/Register links are shown or hidden automatically based on
  today's date vs. those fields.
- `organizers`/`sponsors`/`participants` reference logo slugs from
  `data/partners.toml`. Add the actual logo image files under
  `static/images/logos/{organizers,sponsors,participants}/` and register
  them in `data/partners.toml`, then reference the slugs from the
  conference entry. Until that's done for a given year, `logo_strip_image`
  is shown instead (a flat fallback image).

The "Important links" tiles on the homepage come from `data/links.toml`.

## Local development

```sh
hugo server -D
```

Requires Hugo 0.163+ extended and Go (for module support).

## Folder layout

- `content/`, `layouts/`, `data/`, `assets/`, `hugo.toml` - Hugo source.
- `static/images/` - conference photos, site branding, and partner logos.
- `static/vendor/` - vendored Bulma and Font Awesome (no CDN dependency).
- `ocm/` - a separately maintained static app (its own build, its own
  `main.css`/`js/`). It's mounted into the Hugo build as-is via
  `[[module.mounts]]` in `hugo.toml`, so it's still edited directly in
  place at the repo root, exactly as before - Hugo just publishes it
  unchanged under `/ocm/`.
