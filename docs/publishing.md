# Publishing

Articles start as pull requests. Nothing auto-merges. The site deploys only after a human merges to `main`.

```
trend research
    -> draft article file on a branch
        -> pull request
            -> CI quality gate
                -> human review
                    -> merge
                        -> GitHub Actions deploys to Pages
```

## 1. Research the question

Start from what a beginner is actually asking. Prefer a regulator page, an official project document, a statute, or a peer-reviewed paper. A headline can suggest the topic. It cannot be the only source. Read [style-guide.md](style-guide.md) and [quality-gate.md](quality-gate.md) before writing.

## 2. Draft the file on a branch

Copy [article-template.md](article-template.md) to `src/content/articles/<slug>.md` or `.mdx`.

- One topic. Beginner reading level unless the editor agrees otherwise.
- Frontmatter matches the template. `slug` matches the filename.
- Voice: hook, problem, agitate, solution, one next step.
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

## 5. A human reviews

Use the human checklist in [quality-gate.md](quality-gate.md). Open the links. Confirm the page adds an explanation, not just a paraphrase. Confirm there is one next step and no hype.

The owner should turn on branch protection that requires this check and one review, and should leave auto-merge off.

## 6. Merge

Merging to `main` runs the deploy workflow. GitHub Pages publishes the built site. There is no separate publish button in the app, and no bot merges the PR.

## 7. After publication

If a fact was wrong, follow the corrections policy on the site and add a row to the corrections log in the same pull request as the fix. Update `updatedDate`.

## Suggested branch name

`guide/<slug>` is enough for human writers. Automation that this repository’s cloud agent uses has its own branch prefix. Either way, the article file is the unit of review.
