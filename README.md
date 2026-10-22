# Isagi Yoichi — More Than Just a Game

A responsive editorial poster built with semantic HTML, modern CSS, and dependency-free JavaScript. The supplied artwork is preserved at its native 4:3 ratio on desktop and art-directed for portrait screens.

## Run

```sh
npm install
npm run dev
```

## Production

```sh
npm run build
npm run preview
```

The optimized site is emitted to `dist/` and can be deployed to any static host.

## Details

- Faithful desktop composition with optimized WebP artwork and JPEG fallback
- Portrait-specific cropping for phones and tablets
- Cinematic navigation and an interactive, CSS-drawn tactical field map
- Keyboard-accessible artwork stories using a native `<dialog>`
- Restrained pointer depth, scroll progress, and IntersectionObserver reveals
- Reduced-motion support, visible focus states, and a skip link
- No runtime dependencies, external fonts, or third-party requests
