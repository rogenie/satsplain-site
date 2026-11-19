# Satsplain style guide

## Voice & style

Guides are written like a calm direct-response letter, not like a trading app and not like a legal memo. The shape is borrowed from plainspoken sales teaching (short lines, a hook, one next step). The pressure is not borrowed.

Use this shape for every article:

1. **Headline.** The title is a clear promise of understanding, specific enough to stand alone in a search result. It is not a price tease.
2. **Opening hook.** Start in a moment the reader recognizes: an app screen, a text from a stranger, a button they are afraid to tap. Second person. Two or three short lines.
3. **Problem.** Name what is confusing or risky before you teach the mechanism.
4. **Agitate.** Make the cost of guessing concrete, using a cited fact. A transfer that cannot be undone. A fee that appears when they try to leave. A key that cannot be reset. Do not invent a named victim, a dollar loss, or a fake countdown.
5. **Solution.** Give the explanation or the checklist in short paragraphs and one-line punches. Curiosity-driven subheads should pull the reader down the page and still tell the truth. A subhead may not manufacture scarcity or fear of missing a price move.
6. **Question headings.** Every `##` except “A note on advice” is a question. The first sentence is the answer. Key takeaways stay in the box above the story.
7. **Pictures.** A featured image at the top, plus at least two diagrams that teach a fact the prose also states. Original SVG. Descriptive alt text. No glowing coins, no rockets, no hotlinked stock.
8. **One call to action.** End with a single next step on the start-here path. That is the only button. Do not add a second offer.

Paragraphs are very short. One idea, then a break. A one-line sentence is allowed when it carries the point: "Sent is not the same word as settled."

Plain words. Define jargon in the sentence or send the reader to the glossary. No slogans.

### What the voice must not do

These rules outrank the style. If a punchy line needs a banned phrase to land, rewrite the line.

- No return promises, price targets, or "what it will be worth."
- No fake urgency: no "act now," "limited time," "last chance," "don't miss out," or "before it's too late." You may describe a scammer's pressure, with a citation. You may not add your own.
- No hype phrases. The quality gate rejects `guaranteed`, `to the moon`, `get rich`, `100x`, `risk-free`, and `risk free`, including in negation. Say "a promise that you cannot lose" instead of quoting the banned word.
- Every factual claim still has an inline link. Every `##` section needs one. The sources list repeats those links with the day we opened them.
- The page includes the sentence "not financial advice."
- Stories are patterns from a cited source, told in the second person. Do not invent a person, a city, or a loss amount.
- The newsletter block is a placeholder. It is not a call to action, and it does not collect an address.

Home, hub, glossary, and policy pages stay a little quieter than the guides. They can still be warm and direct. They do not use a sales-letter arc.

The article skeleton is [article-template.md](article-template.md).

## Visual system

Palette:

| Role | Hex | Use |
| --- | --- | --- |
| Navy | `#14213D` | Header, wordmark, dark bands |
| Amber | `#F2A541` | Primary buttons and small highlights. Dark text `#14213D` on amber (about 7.8:1). Never small amber text on the off-white background (about 1.9:1). |
| Teal | `#2A9D8F` | Diagram fills, positive marks, links in dark mode |
| Link teal | `#1F756A` | Link text on `#FAF8F3`. Same hue as the brand teal, darkened so normal text clears 4.5:1. The brand teal on that background is about 3.1:1 and fails for body links. |
| Background | `#FAF8F3` | Page |
| Body text | `#0F172A` | |
| Secondary text | `#475569` | |
| Warning | `#C2410C` | Scam labels on light backgrounds. Dark mode text uses `#E56A37` on `#2A120C`. |
| Dark background | `#0B1324` | |

Illustrations are original inline SVG or flat SVG files we drew. No stock photos. Article diagrams are lazy-loaded SVG files with width, height, and a real alt string. The home hero is inline SVG so it does not add a network request. Amber shapes on light backgrounds get a navy stroke so the edge is visible.

## Human checks before merge

- The hook is a real beginner moment, not a fabricated case study.
- Subheads are honest.
- There is one next step, and it is the next page on the path.
- The diagram, if any, matches the cited source and can be understood without the surrounding paragraph.
- Alt text describes the diagram, not "image" or "chart."
