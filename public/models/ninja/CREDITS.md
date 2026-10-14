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
