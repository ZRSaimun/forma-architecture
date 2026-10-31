# FORMA

[Open the live website](https://zrsaimun.github.io/forma-architecture/)
An original architectural presentation inspired by a construction-to-interior reel. This is not an exact reproduction of its imagery, source code or motion.

## Views
- Cinematic: four original generated architectural stills, with scroll-linked blended transitions and coordinated chapters. It is not a rendered video or a full frame-by-frame construction simulation.
- Explore 3D: real procedural Three.js geometry, staged structure/facade and a continuous camera path into a furnished interior. A Canvas 2D projected-geometry compatibility renderer is used if WebGL is unavailable.

Chapter buttons, range slider, playback, restart, motion preference and concept dialog work without a backend. On phones the composition crops to fit; controls remain touch/keyboard accessible. No real property claims or enquiry collection.

## Assets
`architectural-story.png` created using the built-in image generation tool. Prompt: original photorealistic four-panel architectural storyboard, construction frame, completed bronze/glass midrise, penthouse approach, furnished interior; coherent golden sunset, concrete/wood/travertine, no text or UI. No media copied from the Facebook reel.

Three.js 0.187.0, MIT licence in LICENSE. Fonts from Google Fonts, system fallbacks included. Buildless site; serve the repository root.

## Validation
JavaScript syntax checks passed. Browser verified cinematic view and controls. Cloud browser lacks WebGL; the projected-geometry compatibility view was tested. Full GPU rendering and physical phone performance remain unverified.
