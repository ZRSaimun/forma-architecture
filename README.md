# The Penthouse — scroll reconstruction

[Open the live website](https://zrsaimun.github.io/forma-architecture/)

## Main experience
48 photographed display frames from the user-supplied wearebrand reel are mapped to scroll progress. The sequence shows the glowing plan/rebar, concrete construction, glass and lighting, pool terrace, approach and furnished interiors. Reverse scrolling selects earlier frames; this is not an autoplaying background video.

The monitor content was cropped and perspective-straightened. Frame tiles are 480×270 in an 8×6 JPEG atlas. Adjacent frames blend during scrubbing, except in reduced-motion mode. The limited source resolution, recording motion, perspective and compression prevent a pixel-perfect or full-frame-rate reproduction. Show full scene preserves the whole composition; Fill screen crops to the viewport. Chapter buttons, slider, playback, pause and restart are supported.

## Source and attribution
Source: [wearebrand reel](https://www.facebook.com/reel/1769516980890876), supplied by the user for reproduction. `reference-sequence.jpg` contains cropped scene captures, not original render assets. No licence or authorship of third-party imagery is claimed; this is a reference reconstruction and is not affiliated with the creator. No Facebook account UI or private account information is included.

## Separate 3D study
`study.html` preserves the original procedural Three.js construction study with independent geometry, PBR materials and a software fallback. It is an original approximation, not the reel's implementation. Three.js 0.187.0 is distributed under the MIT licence in LICENSE.

## Other assets
`architectural-story.png` is the earlier original generated four-panel storyboard; it is retained for provenance and is not used in the main reconstruction. Fonts use Google Fonts with local system fallbacks.

## Run
Serve this repository as a static site; no build step or API keys required.

## Display clarity
The canvas uses actual screen pixel density up to a 3840×2160-equivalent pixel budget, high-quality resampling and mild bounded source sharpening with a four-frame cache. Source frames remain 480×270. This is display enhancement, not recovered 4K detail or a claim of genuine 4K source quality. Original high-resolution renders/video are required for that.
