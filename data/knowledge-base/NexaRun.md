# PROJECT : NEXARUN — THE INFINITE CYBER SPRINT

---

## META

| Field         | Value                                                                |
|---------------|----------------------------------------------------------------------|
| **Tagline**   | The infinite cyber sprint, right in your browser.                   |
| **Type**      | 3D Endless Runner Game (Progressive Web App)                         |
| **Status**    | Shipped — Fully playable, offline-capable                           |
| **GitHub**    | [Link Available]                                                     |
| **Live**      | [Link Available]                                                     |
| **Role**      | Solo Developer (Game Design, Engineering, Performance Optimization)  |
| **Duration**  | [Insert Duration]                                                    |

---

## ELEVATOR PITCH

NexaRun is a **fast-paced, cyberpunk-themed 3D endless runner game** built entirely for the web — no app store, no downloads, no installs. Think Subway Surfers meets a neon-drenched hacker dystopia, running natively in the browser at a locked 60 FPS via hardware-accelerated WebGL.

By leveraging **Babylon.js**, **Havok physics**, **tile pooling**, and a full **PWA service worker**, NexaRun proves that production-quality 3D game development is not just possible on the web — it can be *exceptional*. Players dodge surveillance drones, collect NexaCoins, and unlock skins entirely within the browser. Zero friction. Pure speed.

---

## CONTEXT & MOTIVATION

### The Problem This Solves

Web-based 3D games have historically suffered from a combination of:
1. **Poor performance** — frame drops, GC stuttering, physics overhead
2. **Heavy initial load times** — unoptimized 3D assets bloating the first load
3. **No offline capability** — the game dies without a network connection
4. **Clunky physics** — manual collision detection in JavaScript doesn't scale

### The Vision

The goal was to engineer a **Subway Surfers-style experience that feels native but lives entirely on the web**, with:
- A locked 60 FPS target on mobile browsers — the hardest constraint
- Full offline playability via Service Worker (PWA)
- Zero memory leak tolerance in an infinite generation environment
- Hardware-accelerated physics via WebAssembly (Havok)

This project was intentionally chosen as a **performance engineering challenge** — the kind that separates developers who understand the browser runtime from those who don't.

---

## TECH STACK (DEEP DIVE)

| Layer               | Technology               | Why Chosen                                                                              |
|---------------------|--------------------------|------------------------------------------------------------------------------------------|
| **3D Engine**       | Babylon.js               | Built-in Havok physics, native collision detection, FollowCamera — no plugin juggling   |
| **Language**        | TypeScript               | Strong typing for complex game state, entity management, and scene graph interactions   |
| **Bundler**         | Vite                     | Extremely fast HMR during development, optimized production builds with tree-shaking    |
| **UI Overlay**      | HTML/CSS                 | DOM-based HUDs are infinitely easier to style with Tailwind than canvas-based GUIs      |
| **Physics Engine**  | Havok (via Babylon.js)   | WebAssembly-compiled physics — near-native collision detection performance               |
| **Persistence**     | IndexedDB (via `idb`)    | Async, non-blocking storage for game saves, coin counts, and unlocked skin inventories  |
| **PWA**             | Service Worker + Manifest| 100% offline gameplay; installable to home screen on iOS/Android                       |
| **Asset Format**    | GLB (GLTF Binary)        | Compressed 3D meshes — fastest possible load times for web delivery                    |

---

## ARCHITECTURE OVERVIEW

```
┌────────────────────────────────────────────────────────────────────┐
│                         NexaRun System                             │
│                                                                    │
│  [Vite Dev/Build]                                                  │
│       │                                                            │
│       ▼                                                            │
│  [Babylon.js Scene]                                                │
│       ├── [WebGL Renderer] ◄── Hardware GPU acceleration           │
│       ├── [Havok Physics Engine] ◄── WebAssembly compiled          │
│       ├── [Track.ts] ← Tile Pool (3 recycling tiles)               │
│       ├── [Runner.ts] ← Player Entity (Physics Impostor)           │
│       ├── [ObstacleManager.ts] ← Drone/Barrier spawner             │
│       ├── [CoinManager.ts] ← NexaCoin spawner + collector          │
│       └── [FollowCamera] ← Auto-tracks Runner position             │
│                                                                    │
│  [HTML/CSS UI Overlay]                                             │
│       ├── HUD (Score, Coin count, Speed meter)                     │
│       ├── Pause Menu                                               │
│       └── Shop/Skin Selector                                       │
│                                                                    │
│  [IndexedDB via idb]                                               │
│       ├── Player profile (coins, high score)                       │
│       └── Unlocked skin inventory                                  │
│                                                                    │
│  [Service Worker]                                                  │
│       └── Caches all assets → 100% offline playback               │
└────────────────────────────────────────────────────────────────────┘
```

**Game Loop (Per Frame):**
1. Babylon.js fires the render loop at the display's refresh rate (target: 60 FPS)
2. `Track.update()` checks if the first tile has passed the player → if yes, recycles it to the front
3. `Runner.update()` reads input (swipe/keyboard) and applies physics impulses
4. `ObstacleManager.update()` spawns drones/barriers at increasing frequency as speed rises
5. `CoinManager.update()` checks Havok collision events for coin collection
6. HUD re-renders score/coins via vanilla DOM manipulation (no React overhead in game loop)
7. On game-over → persist score and coins to IndexedDB asynchronously

---

## KEY TECHNICAL CHALLENGES & SOLUTIONS

### Challenge 1: Memory Leaks in Infinite Track Generation

**The Problem:**
An endless runner generates track indefinitely. The naive approach — instantiate a new 3D mesh segment as the player advances and `dispose()` old ones behind them — is catastrophically flawed:

- Each `new BABYLON.Mesh()` is a heap allocation
- Each `dispose()` frees memory, triggering the JavaScript **Garbage Collector (GC)**
- GC pauses in V8 can range from **5ms to 50ms** — in a 60 FPS game (16.6ms budget per frame), a single GC event causes a **visible stutter**
- In an *infinite* runner, these allocations compound: the GC fires constantly, making stable 60 FPS impossible

**The Solution — The Tile Pooling Pattern:**

Create a **fixed pool** of track tile meshes (e.g., exactly 3 tiles). When a tile moves behind the player beyond visibility, it is **mathematically teleported** to the front of the queue — it is never destroyed and never recreated.

```typescript
// src/game/Track.ts — Tile Recycling (Object Pooling)
const TILE_LENGTH = 50; // World units per tile
const POOL_SIZE = 3;

class Track {
  private tiles: BABYLON.Mesh[];
  private nextTileZ: number = POOL_SIZE * TILE_LENGTH;

  constructor(scene: BABYLON.Scene) {
    // One-time allocation — these 3 meshes exist for the entire session
    this.tiles = Array.from({ length: POOL_SIZE }, (_, i) =>
      this.createTileMesh(scene, i * TILE_LENGTH)
    );
  }

  update(runnerZ: number): void {
    const firstTile = this.tiles[0];

    // If this tile is behind the player's view threshold — recycle it
    if (firstTile.position.z < runnerZ - TILE_LENGTH) {
      firstTile.position.z = this.nextTileZ; // Teleport to front
      this.nextTileZ += TILE_LENGTH;

      // Rotate the array: [A, B, C] → [B, C, A]
      this.tiles.push(this.tiles.shift()!);

      // Optionally re-seed obstacles on the recycled tile here
    }
  }
}
```

**Why This Works:**
- **Zero allocations in the hot path** — the render loop never calls `new` or triggers GC
- Memory usage is **completely flat** throughout an infinite run
- The pattern is O(1) per frame — tile count is constant regardless of distance run
- The same pooling pattern is applied to **obstacles and coins** — nothing is ever garbage collected during gameplay

---

### Challenge 2: Physics and Collision Overhead

**The Problem:**
Manual collision detection in JavaScript — raycasting against mesh bounding boxes each frame — scales *terribly*. As obstacle and coin density increases (the game speeds up), checking N objects × M potential colliders every frame at 60 FPS becomes the performance ceiling. Pure JS math loops cannot match the frame budget.

**The Solution — Havok Physics Engine (WebAssembly):**

Babylon.js ships with native integration for the **Havok physics engine**, compiled to **WebAssembly**. By assigning Physics Impostors to meshes, collision detection is entirely delegated to compiled, multi-threaded native code.

```typescript
// Player capsule — rigid body with precise collision volume
runnerMesh.physicsImpostor = new BABYLON.PhysicsImpostor(
  runnerMesh,
  BABYLON.PhysicsImpostor.CapsuleImpostor, // Capsule = ideal for humanoid runner
  { mass: 1, restitution: 0.1, friction: 0.5 },
  scene
);

// Obstacle — static rigid body
obstacleMesh.physicsImpostor = new BABYLON.PhysicsImpostor(
  obstacleMesh,
  BABYLON.PhysicsImpostor.BoxImpostor,
  { mass: 0 }, // mass: 0 = static (immovable)
  scene
);

// Collision event — fired by Havok, not polled by JS
runnerMesh.physicsImpostor.registerOnPhysicsCollide(
  obstacleMesh.physicsImpostor,
  () => GameController.triggerGameOver()
);
```

**Why This Works:**
- Havok runs in a **WebAssembly worker thread** — physics computation doesn't compete with the render loop for the JS main thread
- Collision events are **push-based** (callback fired on collision) not **poll-based** (check every frame), eliminating per-frame iteration entirely
- CapsuleImpostor is mathematically optimal for humanoid characters — smooth, no edge-catching on ground geometry

---

### Challenge 3: Offline Capability & First Load Performance

**The Problem:**
3D assets (meshes, textures, shaders) make web games heavy. A 10-second load time destroys user retention. And without an internet connection, a web game is simply dead.

**The Solution — PWA + GLB Asset Optimization:**

A **Service Worker** intercepts every network request and serves assets from cache after the first visit. This delivers both offline capability and dramatically faster subsequent loads.

```javascript
// service-worker.js — Cache-first strategy for all game assets
const CACHE_NAME = 'nexarun-v1';
const ASSETS = [
  '/', '/index.html', '/main.js',
  '/assets/runner.glb', '/assets/track.glb',
  '/assets/drone.glb', '/assets/nexacoin.glb',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
```

**GLB (GLTF Binary) Format:**
- GLB bundles geometry, materials, and textures into a **single binary file** — no multi-asset waterfall requests
- All meshes are baked and optimized in Blender before export — polygon budgets enforced per asset
- Vite's build pipeline applies **code splitting** and **chunk hashing** — browsers cache JS bundles efficiently

---

## FEATURES (USER-FACING)

| Feature                    | Description                                                                  |
|----------------------------|------------------------------------------------------------------------------|
| **Infinite Procedural Track** | Recycled tile pool generates endless cyberpunk environment               |
| **Physics-Based Movement** | Havok-powered runner with lane-switching, jumping, and obstacle collision    |
| **Drone Obstacles**        | AI-pattern enemy drones dodge-or-lose encounters increasing in frequency    |
| **NexaCoins**              | Collectibles accumulated across runs, persisted to IndexedDB                |
| **Skin Unlock System**     | In-game shop — spend NexaCoins to unlock runner skins (stored offline)      |
| **Progressive Speed**      | Game accelerates dynamically — difficulty curve tied to distance run        |
| **PWA Install**            | "Add to Home Screen" on iOS/Android — plays like a native app               |
| **Offline Mode**           | 100% playable without internet after first load via Service Worker cache    |
| **High Score Board**       | Local leaderboard persisted to IndexedDB                                    |

---

## PERFORMANCE METRICS

| Metric                  | Value / Target                                      |
|-------------------------|-----------------------------------------------------|
| **Frame Rate Target**   | Stable 60 FPS on mobile browsers                   |
| **Initial Load Time**   | < 5 seconds (GLB assets heavily optimized)          |
| **Offline Capability**  | 100% playable post-first-load (Service Worker)      |
| **Memory Usage Target** | < 150 MB RAM throughout infinite run               |
| **GC Events in Loop**   | Zero — object pooling eliminates all allocations    |
| **Physics Backend**     | WebAssembly (Havok) — sub-millisecond collision     |

---

## ARCHITECTURAL DECISIONS LOG

| Decision          | Chosen Approach          | Alternative Considered  | Rationale                                                                           |
|-------------------|--------------------------|-------------------------|-------------------------------------------------------------------------------------|
| 3D Engine         | Babylon.js               | Three.js                | Built-in Havok physics, FollowCamera, and collision APIs — no extra library juggling|
| Persistence       | IndexedDB (via `idb`)    | localStorage            | Async, non-blocking; handles larger binary game state; doesn't freeze render loop   |
| UI Overlay        | HTML/CSS                 | Babylon.js GUI          | DOM-based HUDs are styled effortlessly with Tailwind; canvas GUI is tedious         |
| Physics           | Havok                    | Cannon.js / Ammo.js     | Havok is Babylon's first-party engine — best integration, WebAssembly performance   |
| Asset Format      | GLB                      | OBJ / FBX               | Single binary bundle, embedded textures, smallest file size for web delivery        |
| Language          | TypeScript               | JavaScript              | Type safety is mandatory when managing complex scene graph and game state           |

---

## WHAT I LEARNED

- **The object pool pattern is essential for real-time loops.** Any allocation in a 60 FPS game loop is a latency vulnerability. The tile pooling pattern is a transferable concept — it applies to React component recycling, server-side request buffering, and any scenario with high-frequency object turnover.
- **WebAssembly changes the performance ceiling for browser apps.** Delegating physics to Havok/WASM demonstrated that browser applications can achieve near-native computational throughput for specific workloads.
- **PWA is a distribution strategy, not just a tech feature.** Eliminating the app store barrier for a game reduces acquisition friction dramatically.
- **3D game development surfaces problems common in enterprise apps** — memory management, event-driven architecture, state machine design — in an unusually visceral, measurable way.

---

## FUTURE EVOLUTION (ROADMAP)

| Feature                   | Description                                                                                   |
|---------------------------|-----------------------------------------------------------------------------------------------|
| **Ghost Multiplayer**     | WebSocket-based async multiplayer — race against recorded "ghost" playback of friends' runs  |
| **Custom Shaders**        | Post-processing pipeline: Bloom, Chromatic Aberration for enhanced neon cyberpunk aesthetic  |
| **Procedural Obstacle AI**| Machine learning-trained obstacle placement for adaptive difficulty per player skill level    |
| **Global Leaderboard**    | Backend + database integration for world rankings beyond local IndexedDB                     |
| **Sound Design**          | Web Audio API integration for reactive cyberpunk soundtrack and positional audio effects     |

---

## TALKING POINTS (FOR INTERVIEWS / CONCIERGE CONTEXT)

- *"NexaRun isn't just a game — it's a browser performance engineering case study. The tile pooling pattern I implemented is the same Object Pool design pattern used in game engines, render pipelines, and high-throughput servers."*
- *"I chose Babylon.js over Three.js specifically because of its first-party Havok physics integration — I didn't want to stitch together separate libraries for a physics-dependent application."*
- *"Achieving stable 60 FPS on mobile browsers in a 3D environment requires a fundamentally different mindset than building a React SPA — every allocation is a potential frame drop."*
- *"The PWA architecture wasn't just a 'nice to have' — it was a product decision. Eliminating the install barrier for a game changes its distribution model entirely."*
- *"IndexedDB over localStorage was a deliberate choice — async reads/writes don't block the render loop, which is critical in a game context."*
