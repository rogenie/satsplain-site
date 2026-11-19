#!/usr/bin/env python3
"""Generate flat branded Open Graph PNGs from article frontmatter. Pillow is installed in CI."""

import re
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OG = ROOT / "public" / "og"
OG.mkdir(parents=True, exist_ok=True)

NAVY = (20, 33, 61)
AMBER = (242, 165, 65)
TEAL = (42, 157, 143)
OFF = (250, 248, 243)
MUTED = (183, 195, 209)

SERIF = "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf"
SERIF_REG = "/usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf"
SANS = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
SANS_BOLD = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"


def font(path, size):
    return ImageFont.truetype(path, size)


def wrap(draw, text, face, max_width):
    lines, current = [], ""
    for word in text.split():
        trial = word if not current else f"{current} {word}"
        if draw.textlength(trial, font=face) <= max_width:
            current = trial
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def card(title, kicker, dest):
    image = Image.new("RGB", (1200, 630), NAVY)
    draw = ImageDraw.Draw(image)
    draw.rectangle((0, 0, 16, 630), fill=AMBER)
    draw.rectangle((0, 0, 1200, 8), fill=TEAL)
    draw.ellipse((78, 72, 168, 162), fill=AMBER)
    draw.ellipse((98, 92, 148, 142), fill=NAVY)
    draw.rounded_rectangle((114, 108, 132, 126), radius=3, fill=TEAL)

    word = font(SERIF, 58)
    italic = font(SERIF_REG, 58)
    draw.text((196, 86), "Sats", font=word, fill=OFF)
    width = draw.textlength("Sats", font=word)
    draw.text((196 + width + 4, 86), "plain", font=italic, fill=AMBER)

    kicker_font = font(SANS_BOLD, 26)
    draw.text((80, 210), kicker.upper(), font=kicker_font, fill=TEAL)

    title_font = font(SERIF, 58)
    y = 270
    for line in wrap(draw, title, title_font, 1020)[:4]:
        draw.text((80, y), line, font=title_font, fill=OFF)
        y += 70

    small = font(SANS, 26)
    draw.text((80, 560), "satsplain.com", font=small, fill=MUTED)
    note = "Not financial advice"
    note_w = draw.textlength(note, font=small)
    draw.text((1120 - note_w, 560), note, font=small, fill=MUTED)
    image.save(dest, optimize=True)
    print(dest.name, dest.stat().st_size)


def mark(size, dest, radius):
    image = Image.new("RGB", (size, size), NAVY)
    draw = ImageDraw.Draw(image)
    inset = int(size * 0.22)
    draw.ellipse((inset, inset, size - inset, size - inset), fill=AMBER)
    inner = int(size * 0.34)
    draw.ellipse((inner, inner, size - inner, size - inner), fill=NAVY)
    box = int(size * 0.42)
    span = int(size * 0.16)
    draw.rounded_rectangle((box, box, box + span, box + span), radius=radius, fill=TEAL)
    image.save(dest, optimize=True)
    print(dest.name, dest.stat().st_size)


PILLARS = {
    "crypto-basics": "Crypto basics",
    "buying-and-apps": "Buying and apps",
    "wallets-and-security": "Wallets and security",
    "scams-and-safety": "Scams and safety",
    "taxes-and-rules": "Taxes and rules",
    "trending-explained": "Trending explained",
}


def articles():
    folder = ROOT / "src/content/articles"
    found = []
    for path in sorted(folder.glob("*.md*")):
        text = path.read_text(encoding="utf-8")
        if re.search(r"(?m)^draft:\s*true\s*$", text):
            continue
        title = re.search(r'(?m)^title:\s*"(.*)"\s*$', text)
        slug = re.search(r"(?m)^slug:\s*([A-Za-z0-9-]+)\s*$", text)
        pillar = re.search(r"(?m)^pillar:\s*([A-Za-z0-9-]+)\s*$", text)
        if not title or not slug:
            continue
        clean = title.group(1).replace("\u2011", "-")
        label = PILLARS.get(pillar.group(1) if pillar else "", "Guide")
        found.append((clean, slug.group(1), label))
    return found


def main():
    card("Crypto, explained calmly.", "For complete beginners", OG / "default.png")
    for title, slug, pillar in articles():
        card(title, pillar, OG / f"{slug}.png")
    public = ROOT / "public"
    mark(512, public / "logo.png", 8)
    mark(180, public / "apple-touch-icon.png", 6)
    mark(32, public / "favicon-32.png", 2)


if __name__ == "__main__":
    main()
