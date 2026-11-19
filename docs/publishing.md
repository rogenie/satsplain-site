# Publishing

Articles are researched and drafted with automated tools, fact-checked in a second pass against primary sources, and published only after they pass the automated quality gate. Corrections are welcome on the contact page.

```
research and draft with automated tools
    -> fact-check pass against primary sources
        -> CI quality gate
            -> publish
                -> GitHub Actions deploys to Pages
```

## 1. Research the question

Start from what a beginner is actually asking. Prefer a regulator page, an official project document, a statute, or a peer-reviewed paper. A headline can suggest the topic. It cannot be the only source. Read [style-guide.md](style-guide.md) and [quality-gate.md](quality-gate.md) before writing.

## 2. Draft the file on a branch

Copy [article-template.md](article-template.md) to `src/content/articles/<slug>.md` or `.mdx`.

- One topic. Beginner reading level unless the editor agrees otherwise.
- Frontmatter matches the template. `slug` matches the filename.
- Add `public/images/articles/<slug>.svg` (or webp, avif, or png) and set `featuredImage` plus a descriptive `featuredImageAlt`. This is the picture at the top of the guide. Width and height must match the file.
- Add at least two inline diagrams with alt text. Put the answer sentence first, then the picture. Original SVG is the default. Do not hotlink, and do not use stock art of glowing coins or rockets.
- Write `##` headings as questions, except the closing “A note on advice.” The first sentence under each question is the answer.
- Voice: hook, problem, agitate, solution, one next step.
- If the guide is a procedure, add optional `howTo` steps that match the visible list. The page emits HowTo structured data only then.
- At least three real https sources, each linked in the body.
- Every `##` section has an inline link.
- End with “not financial advice” and a link to `/disclaimer/`.
- One call to action: the next page on the start-here path.
- Diagrams, if you add one, are original SVG with alt text, width, and height. Lazy-load anything below the fold.
- `draft: true` still has to pass the gate. Use it only when the file is complete and you want it held back from the site.

Do not put the unfinished template itself in `src/content/articles`. It will fail the gate, which is what we want.

## 3. Open a pull request

Push the branch and open a PR into `main`. Describe which sources you relied on and what a beginner can do after reading.

## 4. CI runs the quality gate

The PR must be green. If the gate fails, fix the file. Do not skip the check.

## 5. Fact-check, then the gate

A second pass checks the draft against the primary sources it cites. Continuous integration then runs the quality gate. A file that fails the gate is not published. The checklist in [quality-gate.md](quality-gate.md) is what that gate enforces, plus the judgment items a fact-check should still apply: accuracy, usefulness, and no thin paraphrase.

## 6. Publish

After the fact-check and a green quality gate, the guide is published. The deploy build writes an Open Graph PNG from the article title, rewrites `llms.txt` and `llms-full.txt`, adds a short URL at `/<slug>/` that points at `/articles/<slug>/`, and GitHub Actions updates the site. A slug that matches a top-level page such as `about` or `glossary` fails the build instead of replacing that page.

## 7. After publication

If a fact was wrong, follow the corrections policy on the site and add a row to the corrections log in the same pull request as the fix. Update `updatedDate`.

## Suggested branch name

`guide/<slug>` is enough for human writers. Automation that this repository’s cloud agent uses has its own branch prefix. Either way, the article file is the unit of review.
