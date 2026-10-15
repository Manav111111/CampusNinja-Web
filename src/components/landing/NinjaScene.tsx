'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {
  soundCloth,
  soundDraw,
  soundFootstep,
  soundImpact,
  soundWhoosh,
} from './introSound';

/**
 * Real-time 3D ninja cinematic (Three.js / WebGL).
 *
 * Asset: CC0 "NINJA CHARACTER" by styloo — full-body 75-joint humanoid rig
 * (`public/models/ninja/ninja.glb`, see CREDITS.md). The GLB ships zero
 * animation clips, so the walk-in, eye-contact hold and diagonal sword-slash
 * choreography is procedurally authored on the rig at runtime (stylised — no
 * mocap claims, no photorealism claims: this is genuine 3D, not a flat
 * illustration, but the source model is hand-painted low-poly. See CREDITS.md
 * for the production-pipeline verdict).
 * The katana is an authored mesh parented to the camera-side `DEF-hand.R`
 * bone, so it follows the hand exactly through every move.
 *
 * Timeline (scene clock t, seconds):
 *   0.2–2.6  Shot A — approach: full-body walk out of darkness TOWARD the
 *            camera (depth + lateral travel), footsteps drive the audio cues.
 *   2.6–3.4  Shot B — eye contact: planted close, camera pushes to a
 *            face-tracked close-up and holds so the eyes register.
 *   3.4–3.95 windup coil + fast pull-back, katana draw cue.
 *   3.95–4.32 Shot C — diagonal slash, screen top-left → bottom-right.
 *   4.07     Shot D — blade crosses frame centre: impact sound, ember burst,
 *            camera shake; parent fires the DOM screen-split from this exact
 *            frame (never on an independent timer).
 *   5.3      Shot E — sequence end; parent reveals the real CampusNinja logo.
 *
 * The parent drives the DOM screen-split/logo reveal from `onSlashImpact`,
 * fired on the exact frame the blade crosses frame centre.
 */

export interface NinjaSceneCallbacks {
  onReady: () => void;
  onSlashImpact: () => void;
  onSequenceEnd: () => void;
  onError: (message: string) => void;
}

interface NinjaSceneProps extends NinjaSceneCallbacks {
  /** QA hook: freeze the timeline clock at this second (screenshots). */
  freezeAt?: number | null;
}

// ── Tunable staging constants ─────────────────────────────────────────────
const MODEL_URL = '/models/ninja/ninja.glb';
const LOAD_TIMEOUT_MS = 12000;
const WALK_START_X = -2.9;
const WALK_START_Z = -2.2;
const WALK_END_Z = 0.55;
const WALK_END_X_DESKTOP = -0.2;
const WALK_END_X_PORTRAIT = -0.75;
const WALK_T0 = 0.2;
const WALK_T1 = 2.6;
/** Eye-contact hold window (planted close, face-tracked close-up). */
const HOLD_T1 = 3.4;
const WINDUP_T0 = 3.4;
const WINDUP_T1 = 3.95;
const STRIKE_T0 = 3.95;
const STRIKE_T1 = 4.32;
/**
 * Blade-crossing moment. The sweep uses easeOutCubic (explosive start), so the
 * blade crosses frame centre early in the window — same verified 0.32 ratio
 * as the previous timing, carried over to the retimed strike.
 */
const IMPACT_T = 4.07;
const SETTLE_T1 = 5.0;
const END_T = 5.3;
const ACTOR_SCALE = 1.18;
/**
 * Character walks screen-left → screen-right. Facing is biased so the
 * anatomical RIGHT side (sword side) turns 3/4 toward the camera, keeping the
 * katana readable in every frame while travel stays screen-right.
 */
const ACTOR_FACING_Y = Math.PI / 2 + 0.35;
/** Katana grip orientation inside the right-hand bone (tuned visually). */
const KATANA_ROT = { x: Math.PI / 2, y: 0, z: 0.55 };
const KATANA_POS = { x: 0, y: -0.02, z: 0.03 };

/**
 * QA hooks (URL params, invisible in production): `cock=ax,ay,az` and
 * `sweep=ax,ay,az` override the sword-arm cocked/swung euler pose,
 * `grip=gx,gy,gz` overrides the katana grip euler, `coil=c` scales the torso
 * coil. Combine with `freeze=<seconds>` for deterministic captures.
 */
function readVecParam(name: string, fallback: [number, number, number]): [number, number, number] {
  try {
    const v = new URLSearchParams(window.location.search).get(name);
    if (!v) return fallback;
    const parts = v.split(',').map(Number);
    if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return fallback;
    return [parts[0], parts[1], parts[2]];
  } catch {
    return fallback;
  }
}

const _euler = new THREE.Euler();
const _quat = new THREE.Quaternion();

function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}
function easeInOut(u: number): number {
  return u * u * (3 - 2 * u);
}
function easeOutCubic(u: number): number {
  return 1 - Math.pow(1 - u, 3);
}
function smoothstep(a: number, b: number, v: number): number {
  const u = clamp01((v - a) / (b - a));
  return u * u * (3 - 2 * u);
}

export default function NinjaScene({ onReady, onSlashImpact, onSequenceEnd, onError, freezeAt = null }: NinjaSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const cbRef = useRef({ onReady, onSlashImpact, onSequenceEnd, onError });
  const freezeRef = useRef<number | null>(freezeAt);

  // Keep mutable refs in sync outside of render.
  useEffect(() => {
    cbRef.current = { onReady, onSlashImpact, onSequenceEnd, onError };
    freezeRef.current = freezeAt;
  });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    // Non-null alias: narrowing does not propagate into nested closures.
    const host: HTMLDivElement = mount;
    let disposed = false;
    let raf = 0;

    const cb = () => cbRef.current;

    // QA: `hide=trail,arc,embers,katana,glow,ninja` selectively disables
    // scene systems (invisible in production; used to bisect render issues).
    const hideSet = new Set<string>();
    try {
      (new URLSearchParams(window.location.search).get('hide') || '')
        .split(',')
        .forEach((s) => {
          const k = s.trim();
          if (k) hideSet.add(k);
        });
    } catch {
      // keep default
    }
    const qaCock = readVecParam('cock', [-2.3, 0, -0.35]);
    const qaSweep = readVecParam('sweep', [0.8, -0.9, -0.2]);
    const qaGrip = readVecParam('grip', [KATANA_ROT.x, KATANA_ROT.y, KATANA_ROT.z]);
    let qaFace = ACTOR_FACING_Y;
    try {
      const rawFace = new URLSearchParams(window.location.search).get('facing');
      const parsedFace = rawFace == null ? NaN : Number(rawFace);
      if (Number.isFinite(parsedFace)) qaFace = parsedFace;
    } catch {
      // keep default
    }
    let qaCoil = 1;
    try {
      const raw = new URLSearchParams(window.location.search).get('coil');
      const parsed = raw == null ? NaN : Number(raw);
      if (Number.isFinite(parsed)) qaCoil = parsed;
    } catch {
      // keep default
    }

    // ── Renderer ──
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      cb().onError('WebGL unavailable');
      return;
    }
    const isCoarse = typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isCoarse ? 1.5 : 2));
    renderer.setSize(host.clientWidth || 2, host.clientHeight || 2);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.inset = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.setAttribute('aria-hidden', 'true');
    host.appendChild(renderer.domElement);

    // ── Scene / camera / lights ──
    const scene = new THREE.Scene();
    // Controlled haze: the ninja emerges from darkness and the far end of the
    // walk stays swallowed by it. Additive FX materials opt out (fog:false)
    // so embers/trails keep their energy at any distance.
    scene.fog = new THREE.FogExp2(0x060607, 0.055);
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 60);
    // Responsive framing: pull back + shift focus on narrow/portrait screens
    // so the full walk-in path and slash stay in frame on mobile.
    const camBase = new THREE.Vector3(0.15, 1.18, 5.0);
    const camLook = new THREE.Vector3(0.1, 1.02, 0);
    let walkEndX = WALK_END_X_DESKTOP;
    let portraitClose = false;
    function frameCamera() {
      const w = host.clientWidth || 2;
      const h = host.clientHeight || 2;
      const aspect = w / h;
      camera.aspect = aspect;
      if (aspect < 0.9) {
        camBase.set(-0.55, 1.25, 7.4);
        camLook.set(-0.55, 1.0, 0);
        walkEndX = WALK_END_X_PORTRAIT;
        portraitClose = true;
      } else {
        camBase.set(0.15, 1.18, 5.0);
        camLook.set(0.1, 1.02, 0);
        walkEndX = WALK_END_X_DESKTOP;
        portraitClose = false;
      }
      camera.updateProjectionMatrix();
    }
    camera.position.copy(camBase);
    camera.lookAt(camLook);

    scene.add(new THREE.HemisphereLight(0xffd9b0, 0x0a0a0d, 0.55));
    const key = new THREE.DirectionalLight(0xfff1dd, 1.7);
    key.position.set(2.5, 4, 3.5);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -3;
    key.shadow.camera.right = 3;
    key.shadow.camera.top = 4;
    key.shadow.camera.bottom = -1;
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xff7a1a, 2.4);
    rim.position.set(-3.5, 2.2, -2.5);
    scene.add(rim);
    const fill = new THREE.DirectionalLight(0x8ab4ff, 0.35);
    fill.position.set(-1.5, 1.2, 4);
    scene.add(fill);

    // ── Ground: shadow catcher + ember glow disc ──
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(24, 24),
      new THREE.ShadowMaterial({ opacity: 0.38 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = glowCanvas.height = 256;
    const gtx = glowCanvas.getContext('2d');
    if (gtx) {
      const grad = gtx.createRadialGradient(128, 128, 8, 128, 128, 128);
      grad.addColorStop(0, 'rgba(255,110,20,0.34)');
      grad.addColorStop(0.45, 'rgba(255,61,0,0.1)');
      grad.addColorStop(1, 'rgba(255,61,0,0)');
      gtx.fillStyle = grad;
      gtx.fillRect(0, 0, 256, 256);
    }
    const glowTex = new THREE.CanvasTexture(glowCanvas);
    const glowDisc = new THREE.Mesh(
      new THREE.PlaneGeometry(2.2, 2.2),
      new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }),
    );
    glowDisc.rotation.x = -Math.PI / 2;
    glowDisc.position.y = 0.01;
    if (hideSet.has('glow')) glowDisc.visible = false;
    scene.add(glowDisc);

    // ── Ember particles (ambient drift + impact burst share one system) ──
    const EMBERS = 140;
    const emberGeo = new THREE.BufferGeometry();
    const emberPos = new Float32Array(EMBERS * 3);
    const emberVel = new Float32Array(EMBERS * 3);
    const emberLife = new Float32Array(EMBERS);
    const emberSeed = new Float32Array(EMBERS * 2);
    for (let i = 0; i < EMBERS; i++) {
      emberSeed[i * 2] = (i * 137.5) % 100 / 100;
      emberSeed[i * 2 + 1] = (i * 89.3) % 100 / 100;
      // Golden-ratio hash scatter — avoids visible grid/column patterns.
      emberPos[i * 3] = (((i + 1) * 0.6180339887) % 1 - 0.5) * 8;
      emberPos[i * 3 + 1] = ((i + 1) * 0.7548776662) % 1 * 2.8;
      emberPos[i * 3 + 2] = -0.5 - (((i + 1) * 0.3819660113) % 1) * 2.5;
      emberLife[i] = -1; // -1 = ambient drifter
    }
    emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPos, 3));
    const emberMat = new THREE.PointsMaterial({
      color: 0xff8a2a,
      size: 0.03,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      fog: false,
    });
    const embers = new THREE.Points(emberGeo, emberMat);
    embers.frustumCulled = false;
    if (hideSet.has('embers')) embers.visible = false;
    scene.add(embers);

    const impactOrigin = new THREE.Vector3(0.35, 1.25, 0.6);
    function burstEmbers(n: number) {
      let spawned = 0;
      for (let i = 0; i < EMBERS && spawned < n; i++) {
        if (emberLife[i] >= 0) continue;
        emberLife[i] = 0.55 + ((i * 53.7) % 100) / 100 * 0.5;
        emberPos[i * 3] = impactOrigin.x + (((i * 31.7) % 100) / 100 - 0.5) * 0.3;
        emberPos[i * 3 + 1] = impactOrigin.y + (((i * 71.3) % 100) / 100 - 0.5) * 0.5;
        emberPos[i * 3 + 2] = impactOrigin.z + (((i * 17.9) % 100) / 100 - 0.5) * 0.3;
        const a = ((i * 43.1) % 100) / 100 * Math.PI * 2;
        const sp = 1.2 + ((i * 61.7) % 100) / 100 * 2.6;
        emberVel[i * 3] = Math.cos(a) * sp;
        emberVel[i * 3 + 1] = 1.5 + ((i * 23.3) % 100) / 100 * 2.4;
        emberVel[i * 3 + 2] = Math.sin(a) * sp * 0.5;
        spawned++;
      }
    }

    // ── Sword trail ribbon ──
    const TRAIL_N = 26;
    const trailGeo = new THREE.BufferGeometry();
    const trailPos = new Float32Array(TRAIL_N * 2 * 3);
    const trailCol = new Float32Array(TRAIL_N * 2 * 3);
    const trailIdx: number[] = [];
    for (let i = 0; i < TRAIL_N - 1; i++) {
      const a = i * 2;
      trailIdx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPos, 3));
    trailGeo.setAttribute('color', new THREE.BufferAttribute(trailCol, 3));
    trailGeo.setIndex(trailIdx);
    const trailMat = new THREE.MeshBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
      depthWrite: false,
      depthTest: false, // slash energy reads over the body — standard cinematic cheat
      blending: THREE.AdditiveBlending,
      fog: false,
    });
    const trail = new THREE.Mesh(trailGeo, trailMat);
    trail.frustumCulled = false;
    trail.renderOrder = 10;
    trail.visible = false;
    scene.add(trail);
    const trailPts: { tip: THREE.Vector3; base: THREE.Vector3; at: number }[] = [];
    let trailActive = false;
    const TRAIL_WINDOW = 0.24; // seconds of blade history — tight, bright head + fast fade

    // ── Impact shockwave ring: compact energy burst at the blade crossing ──
    // The motion-trail ribbon tracks the real blade sweep; the ring guarantees
    // a readable impact flash even on low-fps devices. A full expanding ring
    // needs no angle tuning and stays co-located with the blade by design.
    const arcGeo = new THREE.RingGeometry(0.3, 0.38, 48);
    const arcMat = new THREE.MeshBasicMaterial({
      color: 0xff8a2a,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      fog: false,
    });
    const arc = new THREE.Mesh(arcGeo, arcMat);
    arc.renderOrder = 11;
    arc.visible = false;
    arc.frustumCulled = false;
    scene.add(arc);
    const ARC_FLASH = 0.55; // seconds

    // ── Actor + rig ──
    let actor: THREE.Group | null = null;
    const bones = new Map<string, { obj: THREE.Object3D; base: THREE.Quaternion }>();
    let katanaTip: THREE.Object3D | null = null;
    let katanaBase: THREE.Object3D | null = null;

    function sanitizeBoneName(n: string): string {
      return n.replace(/[^a-zA-Z0-9_]/g, '');
    }
    function regBone(root: THREE.Object3D, name: string) {
      const want = sanitizeBoneName(name);
      const stack: THREE.Object3D[] = [root];
      while (stack.length > 0) {
        const current = stack.pop();
        if (!current) continue;
        if (sanitizeBoneName(current.name) === want) {
          bones.set(name, { obj: current, base: current.quaternion.clone() });
          return;
        }
        for (const child of current.children) stack.push(child);
      }
    }
    function poseBone(name: string, x: number, y: number, z: number) {
      const b = bones.get(name);
      if (!b) return;
      _euler.set(x, y, z);
      _quat.setFromEuler(_euler);
      b.obj.quaternion.copy(b.base).multiply(_quat);
    }

    function buildKatana(): THREE.Group {
      const katana = new THREE.Group();
      const steel = new THREE.MeshStandardMaterial({ color: 0xdfe6ee, metalness: 0.92, roughness: 0.22 });
      const brass = new THREE.MeshStandardMaterial({ color: 0x8a6b2f, metalness: 0.85, roughness: 0.4 });
      const grip = new THREE.MeshStandardMaterial({ color: 0x16110c, metalness: 0.1, roughness: 0.9 });
      const edgeGlow = new THREE.MeshBasicMaterial({ color: 0xffb066 });
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.98, 0.045), steel);
      blade.position.y = 0.62;
      blade.castShadow = true;
      katana.add(blade);
      const edge = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.98, 0.008), edgeGlow);
      edge.position.set(0, 0.62, 0.024);
      katana.add(edge);
      const tip = new THREE.Mesh(new THREE.ConeGeometry(0.024, 0.09, 4), steel);
      tip.position.y = 1.15;
      tip.rotation.y = Math.PI / 4;
      katana.add(tip);
      const guard = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.058, 0.014, 20), brass);
      guard.position.y = 0.125;
      katana.add(guard);
      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.021, 0.023, 0.26, 12), grip);
      handle.position.y = -0.01;
      katana.add(handle);
      const pommel = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.02, 12), brass);
      pommel.position.y = -0.15;
      katana.add(pommel);
      katanaTip = new THREE.Object3D();
      katanaTip.position.y = 1.18;
      katana.add(katanaTip);
      katanaBase = new THREE.Object3D();
      katanaBase.position.y = 0.14;
      katana.add(katanaBase);
      return katana;
    }

    // ── Timeline state ──
    let t = 0;
    let lastNow = -1;
    let impactFired = false;
    let endFired = false;
    let drawFired = false;
    let whooshFired = false;
    let lastStep = -1;
    let shake = 0;
    // Face-tracked close-up scratch objects (no per-frame allocation).
    const facePos = new THREE.Vector3(-0.2, 1.77, WALK_END_Z);
    const eyeL = new THREE.Vector3();
    const eyeR = new THREE.Vector3();
    const baseCamPos = new THREE.Vector3();
    const closeCamPos = new THREE.Vector3();
    const baseLook = new THREE.Vector3();

    function animate(now: number) {
      if (disposed) return;
      raf = requestAnimationFrame(animate);
      if (lastNow < 0) lastNow = now;
      let dt = Math.min(0.05, (now - lastNow) / 1000);
      lastNow = now;
      const freeze = freezeRef.current;
      if (freeze != null && t >= freeze) dt = 0;
      t += dt;

      // Camera: slow dolly-in, face-tracked close-up hold, fast pull-back.
      // wClose rises through the eye-contact beat and releases into the
      // windup, so the lens never cuts — one continuous move.
      const wClose =
        smoothstep(WALK_T1, WALK_T1 + 0.45, t) * (1 - smoothstep(HOLD_T1, WINDUP_T1, t));
      const eyeLBone = bones.get('DEF-eye.L');
      const eyeRBone = bones.get('DEF-eye.R');
      if (eyeLBone && eyeRBone) {
        eyeLBone.obj.getWorldPosition(eyeL);
        eyeRBone.obj.getWorldPosition(eyeR);
        facePos.copy(eyeL).add(eyeR).multiplyScalar(0.5);
      } else if (actor) {
        facePos.set(actor.position.x, 1.77 * ACTOR_SCALE, actor.position.z);
      }
      const dolly = easeInOut(clamp01(t / WALK_T1));
      baseCamPos.set(
        camBase.x,
        camBase.y,
        camBase.z - dolly * 0.55,
      );
      baseLook.copy(camLook);
      // Close-up: stay on the +Z side of the face, slight 3/4 offset so the
      // sword-side depth reads; wider distance on portrait screens.
      const closeDist = portraitClose ? 2.7 : 1.8;
      closeCamPos.set(
        facePos.x * 0.55 + 0.25,
        facePos.y + 0.08,
        facePos.z + closeDist,
      );
      camera.position.lerpVectors(baseCamPos, closeCamPos, wClose);
      camera.position.x += (Math.random() - 0.5) * shake;
      camera.position.y += (Math.random() - 0.5) * shake;
      camera.position.z += (Math.random() - 0.5) * shake;
      // Look target glides from the full-body mark to the face and back.
      camera.lookAt(
        baseLook.x + (facePos.x - baseLook.x) * wClose,
        baseLook.y + (facePos.y - baseLook.y) * wClose,
        baseLook.z + (facePos.z - baseLook.z) * wClose,
      );
      if (shake > 0) shake = Math.max(0, shake - dt * 1.4);

      // Ambient embers drift
      const pos = emberGeo.attributes.position as THREE.BufferAttribute;
      const arr = pos.array as Float32Array;
      for (let i = 0; i < EMBERS; i++) {
        if (emberLife[i] >= 0) {
          emberLife[i] -= dt;
          emberVel[i * 3 + 1] -= dt * 4.5;
          arr[i * 3] += emberVel[i * 3] * dt;
          arr[i * 3 + 1] += emberVel[i * 3 + 1] * dt;
          arr[i * 3 + 2] += emberVel[i * 3 + 2] * dt;
          if (emberLife[i] < 0 || arr[i * 3 + 1] < 0) {
            arr[i * 3] = (emberSeed[i * 2] - 0.5) * 7;
            arr[i * 3 + 1] = 2.4 + emberSeed[i * 2 + 1] * 0.4;
            arr[i * 3 + 2] = -1 - emberSeed[i * 2] * 2;
          }
        } else {
          arr[i * 3 + 1] += dt * (0.12 + emberSeed[i * 2 + 1] * 0.2);
          arr[i * 3] += Math.sin(t * 0.8 + emberSeed[i * 2] * 6.28) * dt * 0.08;
          if (arr[i * 3 + 1] > 2.9) arr[i * 3 + 1] = 0.1;
        }
      }
      pos.needsUpdate = true;

      if (actor) {
        // ── Locomotion: walk-in toward the camera, then plant ──
        const wu = easeInOut(clamp01((t - WALK_T0) / (WALK_T1 - WALK_T0)));
        const walking = t < WALK_T1;
        actor.position.x = WALK_START_X + (walkEndX - WALK_START_X) * wu;
        actor.position.z = WALK_START_Z + (WALK_END_Z - WALK_START_Z) * wu;
        if (walking) {
          glowDisc.position.x = actor.position.x + 0.2;
          glowDisc.position.z = actor.position.z;
        }
        // Footfalls drive the audio: two contacts per stride cycle, sides
        // alternating. Fired from this clock, so steps can never desync.
        if (walking && t >= WALK_T0) {
          const stepIdx = Math.floor((t - WALK_T0) * 1.15 * 2);
          if (stepIdx !== lastStep && stepIdx >= 0) {
            lastStep = stepIdx;
            soundFootstep(stepIdx % 2 === 0);
            if (stepIdx % 2 === 1) soundCloth();
          }
        }
        const wPhase = (t - WALK_T0) * Math.PI * 2 * 1.15;
        const wAmp = walking ? Math.min(1, (t - WALK_T0) * 3) * (1 - wu * 0.25) : 0;

        // Legs
        poseBone('DEF-thigh.L', Math.sin(wPhase) * 0.55 * wAmp, 0, 0.04);
        poseBone('DEF-thigh.R', Math.sin(wPhase + Math.PI) * 0.55 * wAmp, 0, -0.04);
        poseBone('DEF-shin.L', -Math.max(0, Math.sin(wPhase - 0.7)) * 0.9 * wAmp - 0.06, 0, 0);
        poseBone('DEF-shin.R', -Math.max(0, Math.sin(wPhase + Math.PI - 0.7)) * 0.9 * wAmp - 0.06, 0, 0);
        poseBone('DEF-foot.L', Math.sin(wPhase + 0.5) * 0.25 * wAmp, 0, 0);
        poseBone('DEF-foot.R', Math.sin(wPhase + Math.PI + 0.5) * 0.25 * wAmp, 0, 0);
        // Arms counter-swing
        poseBone('DEF-upper_arm.L', Math.sin(wPhase + Math.PI) * 0.42 * wAmp, 0, 0.1);
        poseBone('DEF-upper_arm.R', Math.sin(wPhase) * 0.42 * wAmp, 0, -0.1);
        poseBone('DEF-forearm.L', -0.35 - Math.max(0, Math.sin(wPhase + Math.PI)) * 0.25 * wAmp, 0, 0);
        poseBone('DEF-forearm.R', -0.35 - Math.max(0, Math.sin(wPhase)) * 0.25 * wAmp, 0, 0);
        // Torso: lean + bob + breathing
        const bob = walking ? Math.abs(Math.sin(wPhase)) * 0.045 * wAmp : Math.sin(t * 2.1) * 0.008;
        actor.position.y = bob;
        poseBone('DEF-spine', walking ? 0.1 : 0.02, 0, 0);
        poseBone('DEF-spine.001', walking ? 0.06 : 0.01, Math.sin(wPhase) * 0.05 * wAmp, 0);

        // ── Hold (eye contact) + windup + diagonal slash ──
        const windU = clamp01((t - WINDUP_T0) / (WINDUP_T1 - WINDUP_T0));
        const strikeU = clamp01((t - STRIKE_T0) / (STRIKE_T1 - STRIKE_T0));
        const strike = easeOutCubic(strikeU);
        const settleU = easeInOut(clamp01((t - STRIKE_T1) / (SETTLE_T1 - STRIKE_T1)));
        // Eye-contact beat: the upper body turns toward the lens while the
        // close-up holds, then unwinds INTO the slash. Feet stay planted —
        // the turn is distributed through the spine, not the root.
        const holdW = smoothstep(WALK_T1, WALK_T1 + 0.45, t) * (1 - strikeU);
        const turnToCam = -0.6 * holdW;

        if (!drawFired && t >= WINDUP_T0 + 0.05) {
          drawFired = true;
          soundDraw();
        }
        if (!whooshFired && t >= STRIKE_T0) {
          whooshFired = true;
          soundWhoosh(STRIKE_T1 - STRIKE_T0 + 0.12);
        }

        if (t >= WALK_T1) {
          // Coil: crouch, torso twists away, sword arm cocks up-back.
          // Sword is carried in the camera-side RIGHT hand; the strike is an
          // overhead diagonal chop travelling screen top-left → bottom-right.
          const crouch = Math.sin(Math.min(1, windU + strike * 0.4) * Math.PI * 0.5);
          actor.position.y = bob * (1 - windU) - crouch * 0.1 + strike * 0.06;
          actor.position.x = walkEndX + strike * 0.4 - settleU * 0.08;
          actor.rotation.y = qaFace - strike * 0.4 + settleU * 0.15;
          const coilYaw = (-0.7 * windU * (1 - strike) + 1.0 * strike - settleU * 0.3) * qaCoil;
          poseBone('DEF-spine', 0.16 * windU - 0.05 * strike, coilYaw * 0.35 + turnToCam * 0.3, 0);
          poseBone('DEF-spine.001', 0.1 * windU, coilYaw * 0.3 + turnToCam * 0.25, 0);
          poseBone('DEF-spine.002', 0, coilYaw * 0.2 + turnToCam * 0.2, 0);
          // Head stays readable: counter the torso twist so the face holds toward camera.
          poseBone('DEF-spine.006', -0.08 * strike - 0.04 * holdW, -coilYaw * 0.85 + 0.25 * windU + turnToCam * 0.45, 0);
          // Legs: lunge stance
          poseBone('DEF-thigh.L', 0.5 * windU - 0.15 * strike, 0, 0.06);
          poseBone('DEF-thigh.R', -0.45 * windU + 0.35 * strike, 0, -0.06);
          poseBone('DEF-shin.L', -0.7 * windU + 0.2 * strike, 0, 0);
          poseBone('DEF-shin.R', -0.25 * windU - 0.35 * strike, 0, 0);
          // Left arm counter-balance, kept low and across (never a T-pose)
          poseBone('DEF-upper_arm.L', -0.3 * windU - 0.2 * strike, 0, 0.3 * windU);
          poseBone('DEF-forearm.L', -0.9, 0, 0);
          // Right sword arm: cocked high then diagonal sweep down-across
          poseBone('DEF-upper_arm.R',
            qaCock[0] + (qaSweep[0] - qaCock[0]) * strike,
            qaCock[1] + (qaSweep[1] - qaCock[1]) * strike,
            qaCock[2] + (qaSweep[2] - qaCock[2]) * strike,
          );
          poseBone('DEF-forearm.R', -0.5 * windU * (1 - strike) - 0.12 * strike, 0, 0);
          poseBone('DEF-hand.R', 0, 0, -0.2 * strike);
        }

        // ── Trail sampling during the strike window ──
        // Raw tip/base samples are time-stamped; the ribbon is resampled to
        // evenly time-spaced nodes so low-fps devices get a smooth arc instead
        // of a few giant triangles.
        if (t >= STRIKE_T0 - 0.03 && t <= STRIKE_T1 + 0.3 && katanaTip && katanaBase && !hideSet.has('trail')) {
          if (!trailActive) {
            trailActive = true;
            trail.visible = true;
            trailPts.length = 0;
          }
          const tipW = new THREE.Vector3();
          const baseW = new THREE.Vector3();
          katanaTip.getWorldPosition(tipW);
          katanaBase.getWorldPosition(baseW);
          const lastSample = trailPts[trailPts.length - 1];
          if (!lastSample || tipW.distanceToSquared(lastSample.tip) > 1e-8) {
            trailPts.push({ tip: tipW, base: baseW, at: t });
          }
          while (trailPts.length > 2 && t - trailPts[0].at > TRAIL_WINDOW) trailPts.shift();
          while (trailPts.length > 64) trailPts.shift();
          const raw = trailPts;
          if (raw.length >= 2) {
            const tOldest = Math.max(raw[0].at, t - TRAIL_WINDOW);
            const tmpTip = new THREE.Vector3();
            const tmpBase = new THREE.Vector3();
            const sampleAt = (age: number, outTip: THREE.Vector3, outBase: THREE.Vector3) => {
              const target = t - age;
              let j = raw.length - 1;
              while (j > 0 && raw[j].at > target) j--;
              const a = raw[j];
              const b = raw[Math.min(j + 1, raw.length - 1)];
              const span = Math.max(1e-5, b.at - a.at);
              const f = clamp01((target - a.at) / span);
              outTip.copy(a.tip).lerp(b.tip, f);
              outBase.copy(a.base).lerp(b.base, f);
            };
            for (let i = 0; i < TRAIL_N; i++) {
              const age = ((TRAIL_N - 1 - i) / (TRAIL_N - 1)) * (t - tOldest);
              sampleAt(age, tmpTip, tmpBase);
              trailPos[i * 6] = tmpBase.x;
              trailPos[i * 6 + 1] = tmpBase.y;
              trailPos[i * 6 + 2] = tmpBase.z;
              trailPos[i * 6 + 3] = tmpTip.x;
              trailPos[i * 6 + 4] = tmpTip.y;
              trailPos[i * 6 + 5] = tmpTip.z;
              // Multiplicative age fade: under additive blending, old nodes
              // must go BLACK (invisible), not merely darker.
              const fade = Math.pow(i / (TRAIL_N - 1), 2.2);
              const s = 0.03 + 0.97 * fade;
              trailCol[i * 6] = 0.9 * s;
              trailCol[i * 6 + 1] = 0.36 * s;
              trailCol[i * 6 + 2] = 0.07 * s;
              trailCol[i * 6 + 3] = 1.0 * s;
              trailCol[i * 6 + 4] = 0.52 * s;
              trailCol[i * 6 + 5] = 0.16 * s;
            }
            (trailGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
            (trailGeo.attributes.color as THREE.BufferAttribute).needsUpdate = true;
          }
          trailMat.opacity = t > STRIKE_T1 ? Math.max(0, 0.6 - (t - STRIKE_T1) * 2.4) : 0.6;
        } else if (trailActive) {
          trailActive = false;
          trail.visible = false;
        }

        // ── Impact moment: exactly when the blade crosses frame centre ──
        if (!impactFired && t >= IMPACT_T) {
          impactFired = true;
          shake = 0.09;
          burstEmbers(90);
          soundImpact();
          try {
            if (katanaTip && katanaBase) {
              const tipW = new THREE.Vector3();
              const baseW = new THREE.Vector3();
              katanaTip.getWorldPosition(tipW);
              katanaBase.getWorldPosition(baseW);
              impactOrigin.copy(tipW).add(baseW).multiplyScalar(0.5);
            }
          } catch {
            // keep default impact origin
          }
          cb().onSlashImpact();
        }
        // Impact shockwave ring (faces the camera, centred on the blade)
        if (actor && t >= IMPACT_T && t <= IMPACT_T + ARC_FLASH && !hideSet.has('arc')) {
          const u = (t - IMPACT_T) / ARC_FLASH;
          arc.visible = true;
          arc.position.set(impactOrigin.x, impactOrigin.y, impactOrigin.z + 0.1);
          arc.lookAt(camera.position);
          const s = 0.6 + u * 0.9;
          arc.scale.set(s, s, 1);
          arcMat.opacity = (1 - u) * 0.7;
        } else if (arc.visible) {
          arc.visible = false;
          arcMat.opacity = 0;
        }
        if (!endFired && t >= END_T) {
          endFired = true;
          cb().onSequenceEnd();
        }
      }

      renderer.render(scene, camera);
    }

    // ── Resize ──
    const resize = () => {
      const w = host.clientWidth || 2;
      const h = host.clientHeight || 2;
      renderer.setSize(w, h);
      frameCamera();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    // ── Load model (with timeout) ──
    let timedOut = false;
    const timer = window.setTimeout(() => {
      timedOut = true;
      if (!actor && !disposed) cb().onError('Model load timed out');
    }, LOAD_TIMEOUT_MS);

    new GLTFLoader()
      .loadAsync(MODEL_URL)
      .then((gltf) => {
        if (disposed || timedOut) return;
        window.clearTimeout(timer);
        actor = new THREE.Group();
        const model = gltf.scene;
        model.traverse((o) => {
          const mesh = o as THREE.Mesh;
          if (mesh.isMesh) {
            mesh.castShadow = true;
            mesh.frustumCulled = false;
            const mat = mesh.material as THREE.MeshStandardMaterial;
            if (mat && 'roughness' in mat) {
              mat.roughness = Math.max(0.85, mat.roughness);
              mat.metalness = Math.min(0.1, mat.metalness);
            }
          }
        });
        actor.add(model);
        actor.scale.setScalar(ACTOR_SCALE);
        actor.rotation.y = qaFace;
        actor.position.set(WALK_START_X, 0, WALK_START_Z);
        scene.add(actor);

        const rigNames = [
          'DEF-spine', 'DEF-spine.001', 'DEF-spine.002', 'DEF-spine.003',
          'DEF-spine.006',
          'DEF-eye.L', 'DEF-eye.R',
          'DEF-shoulder.L', 'DEF-upper_arm.L', 'DEF-forearm.L', 'DEF-hand.L',
          'DEF-shoulder.R', 'DEF-upper_arm.R', 'DEF-forearm.R', 'DEF-hand.R',
          'DEF-thigh.L', 'DEF-shin.L', 'DEF-foot.L', 'DEF-toe.L',
          'DEF-thigh.R', 'DEF-shin.R', 'DEF-foot.R', 'DEF-toe.R',
        ];
        rigNames.forEach((n) => regBone(actor as THREE.Group, n));

        const hand = bones.get('DEF-hand.R');
        if (hand) {
          const katana = buildKatana();
          _euler.set(qaGrip[0], qaGrip[1], qaGrip[2]);
          katana.quaternion.setFromEuler(_euler);
          katana.position.set(KATANA_POS.x, KATANA_POS.y, KATANA_POS.z);
          if (hideSet.has('katana')) katana.visible = false;
          hand.obj.add(katana);
        }
        if (hideSet.has('ninja')) actor.visible = false;
        glowDisc.position.x = walkEndX + 0.2;
        glowDisc.position.z = WALK_END_Z;
        cb().onReady();
        raf = requestAnimationFrame(animate);
      })
      .catch(() => {
        if (!disposed) {
          window.clearTimeout(timer);
          cb().onError('Model failed to load');
        }
      });

    // QA handle (deterministic screenshots + rig debugging)
    const debugInfo = () => {
      const out: { t: number; hand: number[] | null; tip: number[] | null; bones: number; names: string[]; total: number } = {
        t,
        hand: null,
        tip: null,
        bones: bones.size,
        names: [],
        total: 0,
      };
      try {
        if (actor) {
          actor.traverse((o) => {
            out.total++;
            if (out.names.length < 40 && /hand|spine|thigh|arm/i.test(o.name)) out.names.push(`${o.type}:${o.name}`);
          });
        }
        const hand = bones.get('DEF-hand.R');
        if (hand) {
          const v = new THREE.Vector3();
          hand.obj.getWorldPosition(v);
          out.hand = [v.x, v.y, v.z];
        }
        if (katanaTip) {
          const v = new THREE.Vector3();
          katanaTip.getWorldPosition(v);
          out.tip = [v.x, v.y, v.z];
        }
      } catch {
        // non-fatal
      }
      return out;
    };
    try {
      (window as unknown as { __cnScene?: { getTime: () => number; debug: () => unknown } }).__cnScene = {
        getTime: () => t,
        debug: debugInfo,
      };
    } catch {
      // non-fatal
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      ro.disconnect();
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.isMesh) {
          mesh.geometry?.dispose();
          const m = mesh.material as THREE.Material | THREE.Material[] | undefined;
          if (Array.isArray(m)) m.forEach((x) => x.dispose());
          else m?.dispose();
        }
      });
      emberGeo.dispose();
      emberMat.dispose();
      trailGeo.dispose();
      trailMat.dispose();
      arcGeo.dispose();
      arcMat.dispose();
      glowTex.dispose();
      (glowDisc.material as THREE.Material).dispose();
      (glowDisc.geometry as THREE.BufferGeometry).dispose();
      (ground.geometry as THREE.BufferGeometry).dispose();
      (ground.material as THREE.Material).dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === host) host.removeChild(renderer.domElement);
      try {
        (window as unknown as { __cnScene?: unknown }).__cnScene = undefined;
      } catch {
        // non-fatal
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" />;
}
