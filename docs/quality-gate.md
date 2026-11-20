# Quality gate

`npm run check:articles` checks every file in `src/content/articles`. It fails the command, and CI fails the pull request, when any check below fails. `npm run build` then `npm run check:articles -- --dist` also checks links in the built HTML.

The gate is mechanical. It cannot tell whether a sentence fairly represents its source. That is a human job, listed at the bottom. Voice rules are in [style-guide.md](style-guide.md).

## Automated checks

The script fails if an article:

- Is missing required frontmatter: `title`, `description`, `slug`, `pillar`, `tags`, `publishDate`, `updatedDate`, `sources`, `readingLevel`, `keyTakeaways`. `author` may be omitted and defaults to “Satsplain Research Desk.” `draft` defaults to false. `faq`, `reviewedBy`, and `safetyKitCta` are optional. `safetyKitCta` defaults to false.
- Has a `description` longer than 160 characters.
- Has a `slug` that is not lowercase kebab-case or does not match the filename.
- Uses a `pillar` outside the six hubs.
- Is missing `featuredImage`, `featuredImageAlt`, `featuredImageWidth`, or `featuredImageHeight`. The image must be a file under `public/images/` (svg, webp, avif, or png). The alt text must be a real description of at least 40 characters, not a word like “image” or “diagram” on its own.
- Has fewer than two inline diagrams or figures with descriptive alt text of at least 24 characters. The answer to a section comes before the picture.
- Has an `##` heading, other than “A note on advice,” that is not a question, or whose opening sentence does not answer that question in plain words.
- Has fewer than 3 sources, or a source missing `title`, `url`, `publisher`, or `accessed`.
- Has a source URL that is not https, is not a real URL, or is not linked in the body.
- Links to an external URL that is not in the sources list.
- Has an introduction or `##` section with no inline link (a markdown link or an HTML link). Diagrams do not count as citations.
- Is missing the phrase “not financial advice.”
- Sets `safetyKitCta: true` without including `<SafetyKitCTA />` before the “A note on advice” section, or includes that component without the flag. The component must render `safetyKitDisclosure` from `src/data/site.ts`. That sentence has to say we have a financial interest, that articles never require buying anything, and that a paper backup is fine. The built-page check (`--dist`) fails if an opted-in guide’s HTML does not contain that disclosure before the advice note.
- The Safety Kit page is missing its disclosure, uses Product or Offer schema, drops the coming-soon / not-yet-for-sale note, or is absent from the footer (or header), the sitemap, or `llms.txt`. `WaitlistForm` must keep the empty-endpoint message “The waitlist opens soon,” post `waitlist.emailField`, and include the honeypot. The privacy page must describe the waitlist without naming a provider. About, the affiliate disclosure, and the editorial policy must mention the Safety Kit.
- Has a missing, impossible, or future `updatedDate`, or an `updatedDate` before `publishDate`. Dates must be `YYYY-MM-DD`.
- Contains a banned hype phrase, including inside a negation: `guaranteed`, `to the moon`, `get rich`, `100x`, `risk-free`, `risk free`.
- Contains fake-urgency language: `act now`, `limited time`, `last chance`, `don't miss out`, `before it's too late`.
- Contains `TODO`, `REPLACE_ME`, or lorem ipsum.
- Reuses another article’s title (case-insensitive) or slug.
- Links to an internal path or anchor that does not exist. Public files such as `/diagrams/*.svg` and `/og/*.png` count as real targets.

Drafts in `src/content/articles` are checked too. A draft is “ready but unpublished,” not a scratch file. Keep scraps outside that folder.

Source titles are not scanned for banned words, because a regulator’s own title may use them. Do not paste those words into our sentences.

## What CI runs

On every pull request, and on every push to `main`:

1. `npm ci`
2. `npm run check:articles`
3. `npm run build`
4. `npm run check:articles -- --dist`
5. `npm run check:redirects` confirms each published article has a noindex short URL at `/<slug>/` pointing at `/articles/<slug>/`, and that those stubs are absent from the sitemap and from `llms.txt`. A slug that matches an existing top-level route fails this check and is not given a redirect.

The deploy workflow on `main` repeats these checks and then publishes `dist` to GitHub Pages.

## Human checks

An editor does these before merging. The script cannot.

- **Accuracy against the sources.** Open each link. The sentence should be a fair reading, not a stretch. Numbers should match the cited report and name the year.
- **Original value.** The page should explain, sequence, or translate. A stack of quotes with no beginner framing is not enough.
- **Useful to a beginner.** A newcomer should know what to do next, including when the answer is to stop.
- **Not scaled thin content.** Do not publish a page that only rewords a source, swaps a coin name, or exists to catch a search query.
- **Voice.** Hook, short lines, one next step on the start-here path. The Safety Kit aside, if the article opts in, is disclosed and does not replace that step. No invented victim. See [style-guide.md](style-guide.md).
- **Diagrams.** Each picture should teach the same fact as the prose. Alt text should make sense with the image turned off.
- **Answer first.** A question heading’s first sentence should be the answer, not a warm-up. Key takeaways stay near the top.
- **AI search files.** `robots.txt` allows the named search and answer-engine crawlers. `llms.txt` and `llms-full.txt` are regenerated at build time from the article files.
- **Links still resolve.** Click the external sources. The gate only checks internal links, because outside sites fail open and closed for reasons that are not our bug.

## Fixing a failure

The script prints the file and the rule. Edit the article, run `npm run check:articles` again, and push. Do not weaken the script to make a draft pass.
