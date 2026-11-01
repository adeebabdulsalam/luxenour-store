# Luxe Nour by Nihla

Static catalogue for [Luxe Nour by Nihla](https://www.instagram.com/luxenourbynihla), a designer modest-wear studio. There is no backend. The shop is one page (`index.html`) that reads `data/catalog.json` and routes with the URL hash, so it deploys cleanly on GitHub Pages — including under the project path `/luxenour-store/`.

Live site, once Pages is enabled: <https://adeebabdulsalam.github.io/luxenour-store/>

## Preview locally

From the repository root:

```bash
python3 -m http.server 8080
```

Open <http://127.0.0.1:8080/>. Fetching the catalogue needs a local server; opening `index.html` as a file will not load the JSON.

## GitHub Pages

Pushes to `main` run `.github/workflows/pages.yml`, which publishes the repository root with GitHub Actions.

The first time, turn Pages on in the repository:

**Settings → Pages → Build and deployment → Source: GitHub Actions**

After that, every push to `main` deploys on its own. Asset links are relative (`css/styles.css`, `data/catalog.json`, `images/...`), so the site works at the project subpath without a build step.

## Colours and logo

`images/logo.jpg` is the public Instagram profile mark (gold mandala and script on deep teal). `images/logo.png` is the same mark with the teal field removed, used in the hero so it sits on the page colour. `images/mark.jpg` is the monogram, used in the header, footer, and favicon.

Colours sampled from that logo live as variables at the top of `css/styles.css`:

| Variable | Role | Value |
| --- | --- | --- |
| `--ink` | Logo background, header, hero | `#1c2f39` |
| `--ink-deep` | Footer | `#122229` |
| `--gold` | Lines and borders | `#c6b06a` |
| `--gold-bright` | Highlights and buttons | `#e6d7a2` |
| `--gold-deep` | Gold text on ivory | `#6e5b2e` |
| `--ivory` | Page background | `#f6f3ec` |

Change those variables to recolour the whole site. Product pictures in `images/` are original illustrations, not photographs. Replace any file with a `.jpg`, `.webp`, or `.svg` and point the catalogue at it.

## Catalogue

Everything the shop lists is in `data/catalog.json`.

`brand` holds the name, tagline, Instagram URL, and WhatsApp number (`whatsapp` is digits only, country code included, no `+`). Product enquiries and the general WhatsApp buttons use that number.

### Add or edit a category

`categories` is an array. Each entry needs:

- `id` — short slug, used in the URL (`#/category/kaftans`) and on each product
- `name` — label shown on the tile and filters
- `image` — path relative to the site root, for example `images/categories/kaftans.svg`

```json
{
  "id": "kaftans",
  "name": "Kaftans",
  "image": "images/categories/kaftans.svg"
}
```

To add one, copy an existing object, give it a new `id` and `name`, and set `image` to a picture in `images/`. Put the object in the order you want the tiles to appear. Removing a category hides its tile; products that still use that `id` stay in the full shop list and show the id as their category name until you move them.

### Add or edit a product

`products` is an array. Each entry needs:

| Field | What to put |
| --- | --- |
| `id` | Code sent on WhatsApp and used in the link (`#/product/LN-101`). Keep it unique. |
| `name` | Piece name |
| `category` | A category `id` |
| `price` | Number, without a currency symbol |
| `currency` | ISO code, such as `INR` |
| `description` | A short paragraph |
| `images` | Array of paths, first one used on the grid. Two or more make the gallery. |
| `sizes` | Array of labels, such as `"S"`, `"M"`, `"Custom"` |
| `colors` | Array of colour names. The shop spells the selected one “Colour” in the WhatsApp message. |
| `available` | `true` or `false`. Unavailable pieces can still be enquired about. |

`featured` is optional. Set it to `true` to show the piece on the home edit. Omit it, or set `false`, to keep the piece in its collection only.

```json
{
  "id": "LN-220",
  "name": "New Silk Dress",
  "category": "modal-silk",
  "price": 22000,
  "currency": "INR",
  "description": "A short description of the piece.",
  "images": [
    "images/products/ln-201-look.svg",
    "images/products/ln-201-detail.svg"
  ],
  "sizes": ["XS", "S", "M", "L", "XL", "Custom"],
  "colors": ["Ivory", "Gold"],
  "available": true,
  "featured": false
}
```

You can reuse an illustration while you wait for a photograph. Save new pictures under `images/products/` and list those paths in `images`. Keep the JSON valid: trailing commas are not allowed. Refresh the site after saving; there is no build.

## WhatsApp enquiries

Each product has an Enquire link. It opens `https://wa.me/917012884854` with a prefilled message: name, code, category, price, selected size and colour (or “not selected”), availability, and a link to that product on this site. The header, the home hero, the closing band, and the footer each have a general WhatsApp link that does not name a product.

The footer also links to Instagram: <https://www.instagram.com/luxenourbynihla>.
