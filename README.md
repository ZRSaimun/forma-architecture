# FORMA
An original architectural presentation inspired by a construction-to-interior reel. This is not an exact reproduction of its imagery, source code or motion.

## Continuous construction journey

Scroll controls the complete scene in both directions:
1. Blueprint grid and reinforcement.
2. Eight floors, each with separately staged slab, columns and beams.
3. Progressive installation of glass and bronze framing.
4. Finishing bands, warm lighting and the upper residence.
5. Continuous camera travel into the furnished interior.

The four-image crossfade is no longer used. Every visible construction state is computed from scroll progress; reverse scrolling dismantles the structure consistently. Chapter navigation, slider, play/pause, restart and reduced-motion mode remain available. A projected Canvas compatibility renderer is used if WebGL is unavailable. The procedural model remains an approximation, not a claim of the reference reel's photorealistic quality or exact geometry.

## Assets
`architectural-story.png` created using the built-in image generation tool. Prompt: original photorealistic four-panel architectural storyboard, construction frame, completed bronze/glass midrise, penthouse approach, furnished interior; coherent golden sunset, concrete/wood/travertine, no text or UI. No media copied from the Facebook reel.

Three.js 0.187.0, MIT licence in LICENSE. Fonts from Google Fonts, system fallbacks included. Buildless site; serve the repository root.

## Validation
JavaScript syntax checks passed. Browser verified progressive geometry, reversal and chapter controls. Cloud browser lacks WebGL; the projected-geometry compatibility view was tested. Full GPU rendering and physical phone performance remain unverified.
