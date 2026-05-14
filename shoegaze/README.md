# Shoegaze — Supramundane UI Theme Studio

A single-file theme studio for `@supramundane/ui`, analogous to the Shoelace Shoegaze.

## Running

From the project root:

```bash
npx vite
```

Then open `http://localhost:5173/shoegaze/index.html`.

Or open it directly in a browser (no server needed) — the importmap maps `lit` to esm.sh.

## Features

- **Palette picker**: Choose which named color palette (sky, blue, indigo, violet, etc.) maps to each semantic role (primary, success, warning, danger, neutral)
- **Font families**: Google Fonts picker for sans, serif, and mono
- **Font size scale**: Adjust all `--sm-font-size-*` tokens
- **Border radii**: Sliders for small / medium / large / x-large
- **Spacing**: Global spacing scale multiplier
- **Transitions**: Speed multiplier for all `--sm-transition-*` tokens
- **Focus ring**: Width and offset
- **Component tokens**: Form control heights, toggle sizes, panel borders, tooltip arrow, z-index stack
- **Dark mode toggle**
- **Save CSS**: Exports a `:root {}` block with all overrides
- **Load CSS**: Imports a previously saved CSS file
- **Reset**: Returns all settings to library defaults

## Live showcase

Demonstrates all major components: buttons, tags, form controls (input, textarea, select, checkbox, radio, range), rating, progress, avatar, card, tooltip, dropdown, dialog, drawer, tabbed pane, breadcrumb, tree, split panel, toolbar, copy button, and format utilities.
