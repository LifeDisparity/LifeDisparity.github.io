# FQE Website

Static site for Financial Quants & Engineers (FQE) at Baruch, served by GitHub Pages at https://baruchfqe.github.io/.

There is no build step. Edit the HTML directly and preview by opening a page in a browser, or run a local server:

```sh
python3 -m http.server 8000
```

## Layout

| File | Contents |
|---|---|
| `index.html` | Home: hero with matrix rain, overview, events + Google Calendar, alumni logo marquee. Also redirects old `#/...` links from the previous single-page site. |
| `about.html` | About, leadership (`#leadership`), alumni and alumni stories (`#alumni`) |
| `projects.html` | Current projects (PDF links) and the past-projects archive filtered by year |
| `competitions.html` | Trading and applied math competitions (`#applied` opens the applied math tab) |
| `join.html` | Application steps, interview structure (`#interview`), contact (`#contact`) |
| `alpha-cheese.html` | Hidden easter egg (linked from the final "." in the home page footer) |
| `404.html` | Not-found page; uses root-absolute paths because Pages serves it at any depth |
| `resources/` | FQE Resources guide (copied from the private `LifeDisparity/quant_resources` repo): a single-page app with its own `css/` and `js/`, linked from the header's Resources tab. Its masthead has a "Main Site" back button. Update by re-copying `index.html`, `css/` and `js/` from that repo, then re-applying the back button, favicons and `../index.html` club links |
| `styles.css` | Shared styles. Page-specific rules live in each page's `<style>` block. |
| `fx.js` | Background effects (matrix rain, ASCII chart and torus, WebGL pixel pattern), enabled with `data-fx` on a section |
| `images/` | `leadership/` headshots, `site/` photos, `logos/` alumni company logos, `advisors/` advisor headshots |
| `project-pdfs/` | PDFs linked from `projects.html` |

The header and footer are repeated in each page, so update all pages when changing them.

## Deploying

`.github/workflows/deploy.yml` copies the files listed above into `_site` and publishes it on every push to `main`. Add new top-level folders to the "Assemble site" step.
