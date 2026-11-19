# Satsplain

Plain-English crypto guides for complete beginners. Satsplain is an independent research desk: we explain what regulators and official documents say, and we link the source on every factual claim.

The site is a static [Astro](https://astro.build) project. Articles are Markdown or MDX files in `src/content/articles`, so a new guide can arrive as a pull request.

## Develop

```bash
npm install
npm run dev
```

Other commands:

- `npm run build` writes the site to `dist/`
- `npm run preview` serves that build
- `npm run check:articles` runs the quality gate
- `npm run og` regenerates the flat PNG social images (needs Pillow locally; the PNGs are already committed)

Optional: copy `.env.example` to `.env` and set `PUBLIC_GOOGLE_SITE_VERIFICATION` when you are ready for Search Console. No analytics script is loaded.

## Repository map

- `src/content/articles/` published guides
- `src/pages/` home, hubs, policies, glossary
- `src/components/illustrations/` inline SVG
- `public/diagrams/` explanatory SVG diagrams
- `public/og/` Open Graph images
- `docs/style-guide.md` voice, including the guide shape
- `docs/quality-gate.md` automated and human checks
- `docs/publishing.md` how a guide ships
- `docs/article-template.md` the file to copy

## Enabling GitHub Pages

The deploy workflow is `.github/workflows/deploy.yml`. It runs on every push to `main`, builds the site, and publishes with GitHub Actions.

1. Open the repository on GitHub.
2. Go to **Settings > Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Push to `main` (or run the “Deploy to GitHub Pages” workflow by hand). The first successful run creates the Pages site.

`public/CNAME` contains `satsplain.com`, so the custom domain is part of the built site. After the first deploy, confirm the domain in **Settings > Pages**. Turn on **Enforce HTTPS** only after GitHub finishes issuing the certificate.

Branch protection is your choice, and it should stay strict: require the CI workflow, require a human review, and do not enable auto-merge. Articles are not published by a bot.

## Custom domain and DNS

At the DNS host for `satsplain.com`, point the apex at GitHub Pages:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |
| CNAME | `www` | `rogenie.github.io` |

GitHub’s own steps: [Managing a custom domain for your GitHub Pages site](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

Remove any old A or CNAME records that point the apex or `www` somewhere else. DNS can take a while. HTTPS will not succeed until it does.

## Search Console, analytics, and email

- Search Console: add the property `https://satsplain.com`, then put the verification token in the GitHub repository variable `PUBLIC_GOOGLE_SITE_VERIFICATION`. The next deploy prints it as a meta tag. The slot is `src/layouts/Base.astro`.
- Analytics: nothing is installed. When you want a tag, add it in `src/components/AnalyticsSlot.astro` and update the privacy policy in the same change, before the script ships.
- Email: the site names `hello@satsplain.com`. Create that mailbox, or change the address in `src/data/site.ts` and the pages that use it.
- About page: add a legal publisher name if you want one stated. The page does not invent one.
- Newsletter: the placeholder does not collect addresses. Wiring it up is a later project, and it needs a privacy-policy edit first.

## What you still do by hand

1. Settings > Pages > Source: **GitHub Actions**.
2. Confirm the custom domain `satsplain.com`.
3. Add the DNS records above.
4. Enforce HTTPS after the certificate exists.
5. Verify the site in Search Console and set the repository variable.
6. Create the mailbox.
7. Read the three starter guides against their sources before you merge them. CI cannot do that part.
