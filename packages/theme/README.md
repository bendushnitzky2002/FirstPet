# @firstpet/theme

Shared visual system for all three prototypes.

- `tailwind-preset.js`: colors, fonts, card radius. Each app lists it in `presets` in its `tailwind.config.js`.
- `base.css`: base typography and the `fp-card`, `fp-icon-teal`, `fp-icon-orange` classes. Each app imports it from `src/index.css`.
- `logo.png`: the FirstPet logo tile. The file in the repo is a placeholder. Replace it with the logo from the deck, keeping the same file name. Apps and the landing page pick it up on the next build.
