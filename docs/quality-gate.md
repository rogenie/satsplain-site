# Quality gate

`npm run check:articles` checks every file in `src/content/articles`. It fails the command, and CI fails the pull request, when any check below fails. `npm run build` then `npm run check:articles -- --dist` also checks links in the built HTML.

The gate is mechanical. It cannot tell whether a sentence fairly represents its source. That is a human job, listed at the bottom. Voice rules are in [style-guide.md](style-guide.md).

## Automated checks

The script fails if an article:

- Is missing required frontmatter: `title`, `description`, `slug`, `pillar`, `tags`, `publishDate`, `updatedDate`, `sources`, `readingLevel`, `keyTakeaways`. `author` may be omitted and defaults to “Satsplain Research Desk.” `draft` defaults to false. `faq` and `reviewedBy` are optional.
- Has a `description` longer than 160 characters.
- Has a `slug` that is not lowercase kebab-case or does not match the filename.
- Uses a `pillar` outside the six hubs.
- Has fewer than 3 sources, or a source missing `title`, `url`, `publisher`, or `accessed`.
- Has a source URL that is not https, is not a real URL, or is not linked in the body.
- Links to an external URL that is not in the sources list.
- Has an introduction or `##` section with no inline link (a markdown link or an HTML link). Diagrams do not count as citations.
- Is missing the phrase “not financial advice.”
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

The deploy workflow on `main` repeats the gate and then publishes `dist` to GitHub Pages. Nothing merges automatically.

## Human checks

An editor does these before merging. The script cannot.

- **Accuracy against the sources.** Open each link. The sentence should be a fair reading, not a stretch. Numbers should match the cited report and name the year.
- **Original value.** The page should explain, sequence, or translate. A stack of quotes with no beginner framing is not enough.
- **Useful to a beginner.** A newcomer should know what to do next, including when the answer is to stop.
- **Not scaled thin content.** Do not publish a page that only rewords a source, swaps a coin name, or exists to catch a search query.
- **Voice.** Hook, short lines, one next step on the start-here path. No second pitch. No invented victim. See [style-guide.md](style-guide.md).
- **Diagrams.** If the page includes one, it should teach the same fact as the prose, with alt text a person could understand with the image turned off.
- **Links still resolve.** Click the external sources. The gate only checks internal links, because outside sites fail open and closed for reasons that are not our bug.

## Fixing a failure

The script prints the file and the rule. Edit the article, run `npm run check:articles` again, and push. Do not weaken the script to make a draft pass.
