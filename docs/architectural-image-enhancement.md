# Architectural image enhancement pipeline

This repository contains two different visual layers:

1. **Verified source layer** — the supplied reference sequence and original repository assets, preserved without pretending that missing pixels have been recovered.
2. **Illustrative reconstruction layer** — procedural Three.js geometry or future image-to-image candidates, clearly labelled as AI-assisted or illustrative where applicable.

## Pipeline contract

Every enhanced scene should be processed in this order:

1. Ingest the native-resolution source and preserve an immutable copy.
2. Record a scene inventory: objects, approximate positions, camera/framing, perspective, materials, light direction, atmosphere, and ambiguous regions.
3. Remove interface overlays only when the underlying scene can be separated safely; keep website controls in HTML/CSS.
4. Generate multiple image-to-image candidates with conservative structural guidance.
5. Use masked inpainting only for approved local regions.
6. Upscale the selected candidate to a 3840×2160 delivery target, with an optional 7680×4320 master.
7. Export WebP/AVIF for the website and retain the source, candidate, selected result, comparison, and change report.
8. Run visual QA at 100%: straight lines, perspective, object count/placement, glazing reflections, lighting direction, and text/blueprint accuracy.

## Architectural safety rules

- Never present AI-inferred details as verified design information.
- Preserve the original camera framing and major geometry whenever visible.
- Do not add or remove important structural elements without recording the change.
- Blueprint labels and dimensions must be recreated as vector/UI overlays or verified separately.
- Keep sunset direction and the warm cinematic palette consistent across scenes.
- Keep navigation, buttons, labels, and progress UI outside generated imagery.

## Suggested production implementation

A production generator should run outside GitHub Pages as a queued Python service:

- Pillow/OpenCV for ingestion, conservative denoising, colour correction, and comparisons.
- A licensed image-editing/image-to-image model for candidate reconstruction.
- Real-ESRGAN or another commercially compatible super-resolution model for upscaling.
- Segmentation plus masked inpainting for local corrections.
- SVG/Canvas for verified blueprint labels.
- A manifest-driven queue so every output can be traced to its source and prompt.

GitHub Pages remains the presentation layer. It should consume approved, versioned exports rather than expose model credentials in browser JavaScript.
