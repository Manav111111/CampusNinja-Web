# 3D Ninja Asset — Credits & License

## Model: "NINJA CHARACTER" by styloo

- **File in this repo:** `public/models/ninja/ninja.glb` (1.44 MB)
- **Source:** https://styloo.itch.io/ninja
- **Author:** styloo (Styl0o_)
- **License:** **Creative Commons Zero v1.0 Universal (CC0)** — public domain.
  The author states on the source page: *"its cc0, you can do whatever you
  want with it"*. No attribution is legally required; this file credits the
  author voluntarily. No royalties, no commercial-use restriction.
- **Acquired:** 14 Oct 2026 via the page's free "No thanks, just take me to
  the downloads" flow (no account, no access-control bypass, no paywall
  circumvention — the free `ninjacharacter.zip` tier).
- **Original contents of `ninjacharacter.zip` (6.8 MB):** `ninja_root.glb`
  (2.61 MB), `ninjaEMIT_root.glb` (emissive variant, unused), `ninja_root.fbx`
  (unused), `Read Me .txt` (material guidance, followed: roughness raised,
  unlit-friendly lighting).
- **Local optimisation:** embedded 2048px PNG texture resized to 1024px
  (`@gltf-transform/cli resize`), structure otherwise byte-identical
  (77 nodes, 1 skinned mesh, 75-joint humanoid rig, 0 embedded animations).
  Verified by re-parsing the GLB JSON chunk after conversion.

## Rig & animation notes

- Full-body humanoid rig (`DEF-*` joints: spine chain, arms with articulated
  fingers, legs, eyes). The GLB ships **zero animation clips** (the author's
  demo animation exists only in the separate paid blend-files archive, which
  was not acquired).
- Walk-in and diagonal sword-slash motion are **procedurally authored at
  runtime** on the rig in `src/components/landing/NinjaScene.tsx`
  (no motion-capture data; no realism claims beyond stylised choreography).
- The katana is an authored low-poly mesh parented to the `DEF-hand.R` bone,
  so it follows the hand exactly during all movement.

## Sound design

- All intro audio is **procedurally synthesized at runtime** with the Web Audio
  API (`src/components/landing/introSound.ts`): footstep thumps, cloth swishes,
  katana draw, strike whoosh, cut transient + bass impact, ember ticks, logo
  reveal resonance, and a low room-tone bed behind a limiter.
- **No audio files, no samples, no licenses or attribution obligations.**
- Cues fire from the 3D scene clock at exact timeline crossings (footfalls,
  draw, strike start, blade impact), so sound cannot drift from the picture.
  The intro starts silent (browser autoplay rules) with a visible Sound on/off
  toggle; everything is a silent no-op until the user enables sound.

## Production-pipeline verdict (Oct 2026)

- Investigated: (1) rendering this rig offline (Blender or equivalent),
  (2) a purchasable/downloadable cinematic-grade ninja asset with explicit
  commercial rights, (3) hybrid 3D + DOM split, (4) real-time WebGL only.
- Outcome: this environment has **no Blender, no ffmpeg, no GPU render farm,
  and no licensed AI-video pipeline**, and the only verifiably licensed 3D
  ninja obtainable here is the stylised CC0 model above — re-rendering it
  offline would still be stylised, never photorealistic. No
  production-quality pre-rendered video was generated, and none is shipped.
- Shipped instead: genuine real-time 3D (full-body rig, procedural walk
  toward the camera, face-tracked eye-contact close-up, hand-parented katana
  slash) composited with a DOM screen-split and the real CampusNinja logo.
- **Not claimed:** photorealism, motion capture, or volumetric rendering.
- To reach true movie quality later: license or commission a high-fidelity PBR
  ninja (skin/cloth/steel scanned materials, facial rig with eyes), mocap or
  hand-keyed walk/slash, offline path-traced render to web-optimised
  MP4/WebM, and a studio sound mix — that is an asset-budget task, not a code
  task, and the current scene clock + `onSlashImpact` sync point are already
  shaped to drive a video element if one arrives.

## Candidates investigated and rejected

- `wolfxxx/GROKNinja` — Mixamo-derived character/animation takes stored in
  Git LFS; Mixamo assets require an Adobe account, forbid standalone
  redistribution, and the repo's code license does not clearly license the
  model takes. Rejected on licensing + size + access grounds.
- Sketchfab `ninja-a0bbe212318b4ee9bfaec55a3e060227` (Shadow Models 3D) —
  CC-BY, but download requires a Sketchfab account and the design is
  fan-art derived from a commercial game. Rejected (not acquirable here,
  style/license risk).
- Sketchfab `ninja-rigged-game-ready-8e9c855b3ef64126af17772f5981b256` —
  same account-gated download barrier; not acquired or inspected beyond the
  listing. Rejected (not verifiably obtainable).
- Quaternius Ultimate Animated Character Pack (CC0, quaternius.com) —
  license ideal and directly downloadable, but ships FBX/OBJ only with no
  ninja character confirmed in the lineup; conversion + retarget pipeline
  was a heavier, less certain path than the purpose-built CC0 ninja above.
  Kept as fallback.
