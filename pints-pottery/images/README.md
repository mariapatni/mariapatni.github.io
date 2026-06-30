# Pints & Pottery images

Drop your photos here, then add a matching entry to `/pints-data.json`
(at the repo root) so the tile shows up on `pints-pottery.html`.

## Adding a new tile

1. Copy your photo into this folder, e.g. `pints-pottery/images/cortado.jpg`.
2. Open `/pints-data.json` and add an object to the array:

   ```json
   {
     "image": "/pints-pottery/images/cortado.jpg",
     "title": "",
     "description": "A short caption for the photo."
   }
   ```

   - `image` — root-relative path to the photo (must start with `/pints-pottery/images/`).
   - `description` — the short text under the photo. Required.
   - `title` — optional. Leave it as `""` to show just the photo + description;
     fill it in for a small heading above the description.

3. Tiles render in the order they appear in the JSON. Reorder the array to reorder the grid.

No build step is needed for this section — `pints-pottery.html` fetches
`pints-data.json` directly at page load, so committing the JSON + image is enough.
