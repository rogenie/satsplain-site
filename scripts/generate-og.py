#!/usr/bin/env python3
"""Generate flat branded PNG images. No stock art. Pillow is a local tool, not a site dependency."""

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


def main():
    card("Crypto, explained calmly.", "For complete beginners", OG / "default.png")
    card("What is Bitcoin? A plain-English guide for beginners", "Crypto basics", OG / "what-is-bitcoin.png")
    card("How to buy crypto safely for the first time", "Buying and apps", OG / "how-to-buy-crypto-safely.png")
    card("Crypto scams to avoid (and how to spot them)", "Scams and safety", OG / "crypto-scams-to-avoid.png")
    public = ROOT / "public"
    mark(512, public / "logo.png", 8)
    mark(180, public / "apple-touch-icon.png", 6)
    mark(32, public / "favicon-32.png", 2)


if __name__ == "__main__":
    main()
