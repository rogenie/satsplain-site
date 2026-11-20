# Article template

Copy this skeleton to `src/content/articles/<slug>.mdx`. Delete this intro note. The skeleton fails the quality gate until every placeholder is gone. Voice rules: [style-guide.md](style-guide.md).

```md
---
title: "REPLACE_ME"
description: "REPLACE_ME in 160 characters or fewer."
slug: replace-me
pillar: crypto-basics
tags:
  - beginners
publishDate: YYYY-MM-DD
updatedDate: YYYY-MM-DD
author: Satsplain Research Desk
readingLevel: beginner
featuredImage: "/images/articles/replace-me.svg"
featuredImageAlt: "REPLACE_ME with a sentence that describes the picture for someone who cannot see it."
featuredImageWidth: 800
featuredImageHeight: 450
keyTakeaways:
  - "REPLACE_ME"
  - "REPLACE_ME"
  - "REPLACE_ME"
sources:
  - title: "REPLACE_ME"
    url: "https://example.com/replace-me"
    publisher: "REPLACE_ME"
    accessed: "YYYY-MM-DD"
  - title: "REPLACE_ME"
    url: "https://example.com/replace-me-2"
    publisher: "REPLACE_ME"
    accessed: "YYYY-MM-DD"
  - title: "REPLACE_ME"
    url: "https://example.com/replace-me-3"
    publisher: "REPLACE_ME"
    accessed: "YYYY-MM-DD"
draft: true
---

You are in a specific moment. Name it in one or two lines.

Say why that moment is uncomfortable.

This guide will show one thing. It will not tell you to buy. Link the first source here.

## What is the problem, in the reader's words?

Answer that question in this first sentence, with a source link in the section.

A one-line punch is fine.

Put an inline link in this section: [source](https://example.com/replace-me).

## What does guessing cost?

Answer in the first sentence. Use a fact from a regulator or an official document. Do not invent a person or a loss amount.

Link it: [source](https://example.com/replace-me-2).

No countdown. No scarcity. If a scammer pressures people, describe that pressure and cite it. Do not add your own.

## What should the reader do?

Answer in the first sentence. Then give the steps.

Add at least two diagrams. Original SVG, with alt text, width, and height. The layout lazy-loads figures that use the Figure component.

```md
<Figure
  src="/diagrams/replace-me.svg"
  width={440}
  height={640}
  alt="REPLACE_ME with a sentence a person can understand without the picture."
  caption="One line on what the picture adds."
/>
```

Link the third source: [source](https://example.com/replace-me-3).

## What should you read next?

One action, named in the first sentence. The next page on the start-here path. No email signup here. The layout already reserves a newsletter slot that is turned off. The optional Safety Kit aside, when `safetyKitCta` is true, goes after this step and before the advice note. It is not a second path button.

<p class="next-step"><a href="/start-here/">Next: start here</a></p>

## A note on advice

This page is general education, not financial advice. It is not a recommendation to buy, sell, or hold anything. Read the [full disclaimer](/disclaimer/).
```

Pillar values: `crypto-basics`, `buying-and-apps`, `wallets-and-security`, `scams-and-safety`, `taxes-and-rules`, `trending-explained`.

`readingLevel` is `beginner` or `intermediate`.

Optional frontmatter:

```yaml
reviewedBy: "A real person's name"
faq:
  - question: "REPLACE_ME"
    answer: "Only restate a fact already cited in the body."
safetyKitCta: false
```

Set `safetyKitCta: true` only when the guide is about storage, wallets, or scams and a reader could use a written seed phrase. Then import the component and place it immediately before `## A note on advice`:

```md
import SafetyKitCTA from '../../components/SafetyKitCTA.astro';

<SafetyKitCTA />

## A note on advice
```

The callout is one short paragraph, one link, and the product disclosure. It does not replace the path button. It links to `/safety-kit/`, not to Stripe. While pre-orders are open, the wording says so and still says a paper backup is fine. Set `safetyKit.amazonUrl` to the https Amazon product URL when that listing exists. `status` becomes `amazon` (Amazon wins over the pre-order link), and the page and the callout switch to “View on Amazon” with `rel="sponsored nofollow"`. The disclosure stays. Do not add a rating, a fire or flood claim, or a comparison in that swap.

There are no affiliate links today. If a guide ever has one, place `<AffiliateDisclosure />` (optional `subject` for the company named in the link) beside that link. Our own Safety Kit uses `safetyKitDisclosure`, not the affiliate notice.

Do not put a banned hype phrase in the file, even to say you are avoiding it. The gate matches the word itself. The list is in [quality-gate.md](quality-gate.md).
