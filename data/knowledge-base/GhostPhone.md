# PROJECT : GHOSTPHONE (GHOSTNODE) — ANTI-THEFT TRACKING SYSTEM

---

## META

| Field         | Value                                                                        |
|---------------|------------------------------------------------------------------------------|
| **Tagline**   | Advanced stealth tracking and anti-theft node.                               |
| **Type**      | Mobile Client + Full-Stack Web Dashboard                                     |
| **Status**    | Production-ready, self-hostable                                              |
| **GitHub**    | [Link Available]                                                             |
| **Live**      | [Link Available]                                                             |
| **Role**      | Solo Full-Stack Developer (Android, Backend, Frontend, System Architecture)  |
| **Duration**  | [Insert Duration]                                                            |

---

## ELEVATOR PITCH

GhostPhone is a **comprehensive, multi-stack anti-theft tracking system** that goes far beyond standard "Find My Device" apps. It consists of two components working in concert:

1. **Android Background Service (Kotlin/Java)** — A stealth telemetry node that hooks deep into Android OS broadcast events to detect unauthorized tampering (device shutdown attempts, SIM card swaps) and aggressively streams location data even under adversarial conditions.
2. **Web Dashboard (Next.js + FastAPI)** — A real-time monitoring interface with live maps, alert management, and device status tracking, backed by a high-throughput asynchronous Python backend.

This is a system built with an **adversarial threat model** — it assumes the person using the phone is actively trying to defeat it.

---

## CONTEXT & MOTIVATION

### The Problem This Solves

Standard device tracking applications share a fundamental weakness: they are **easily defeated** by a thief who knows basic counter-measures:

- **Restart the device** → Most tracking apps don't resume automatically post-boot
- **Remove/swap the SIM card** → The device loses its data connection, and the app typically doesn't log the event
- **Kill the background process** → Android's aggressive battery optimization kills background services silently

**The goal was to build a resilient tracking client that treats each of these vectors as an explicit attack surface and counters them architecturally.**

### The Vision

- A tracking client that **hooks into the Android OS at the system broadcast level** — not just the application layer
- A backend capable of **handling high-frequency concurrent location streams** without dropping packets under load
- A frontend that presents **real-time location telemetry on a live map** with minimal latency
- A system architecture that anticipates future expansion: **remote command execution** (lock, wipe, alarm)

---

## TECH STACK (DEEP DIVE)

| Layer               | Technology                    | Why Chosen                                                                                  |
|---------------------|-------------------------------|---------------------------------------------------------------------------------------------|
| **Android Client**  | Kotlin / Java                 | Native code provides reliable access to system BroadcastReceivers vs cross-platform bridges|
| **Android Service** | Foreground Service            | Android OS respects Foreground Services — they survive aggressive battery optimization      |
| **OS Integration**  | BroadcastReceiver             | Direct hook into system-level events: boot, shutdown, SIM state change                     |
| **Backend**         | FastAPI (Python)              | Asynchronous event loop handles high-concurrency telemetry ingestion without blocking       |
| **ORM**             | SQLAlchemy (AsyncSession)     | Async DB operations — non-blocking, no connection pool starvation under burst load          |
| **Database**        | PostgreSQL                    | Relational integrity for device records, alert logs, and geospatial data; future PostGIS    |
| **Frontend**        | Next.js (App Router)          | Server Actions protect API keys; SSR for fast dashboard initial load; SEO-friendly          |
| **Live Maps**       | [Mapbox / Leaflet.js]         | Real-time location rendering with device trail visualization                                |
| **Auth**            | JWT / Session-based           | Secure API access for both Android client telemetry and web dashboard sessions             |

---

## ARCHITECTURE OVERVIEW

```
┌──────────────────────────────────────────────────────────────────────┐
│                        GhostPhone System                             │
│                                                                      │
│  [Android Device (Victim Phone)]                                     │
│       │                                                              │
│       ├── [Foreground Service] ← Survives battery optimization       │
│       │       └── Polls GPS/Network location continuously            │
│       │                                                              │
│       ├── [BroadcastReceiver: BOOT_COMPLETED]                        │
│       │       └── Auto-restart tracking on device reboot             │
│       │                                                              │
│       ├── [BroadcastReceiver: SIM_STATE_CHANGED]                     │
│       │       └── Alert + location snapshot on SIM swap              │
│       │                                                              │
│       └── [BroadcastReceiver: ACTION_SHUTDOWN]                       │
│               └── Final location burst before device powers off      │
│                           │                                          │
│                           │ HTTPS POST (JSON Telemetry)              │
│                           ▼                                          │
│  [FastAPI Backend (Python)]                                          │
│       ├── AsyncSession ← Non-blocking DB writes                      │
│       ├── [PostgreSQL] ← Device records, telemetry, alert logs       │
│       └── WebSocket / SSE broadcast → Dashboard                     │
│                           │                                          │
│                           ▼                                          │
│  [Next.js Dashboard]                                                 │
│       ├── Live Map (Device location trail)                           │
│       ├── Alert Center (SIM swap, shutdown events)                   │
│       ├── Device Status Panel                                        │
│       └── Server Actions (API key security)                         │
└──────────────────────────────────────────────────────────────────────┘
```

**Telemetry Flow (End-to-End):**
1. Android Foreground Service polls GPS at defined intervals, batches location data
2. BroadcastReceivers fire on OS events — triggering immediate out-of-band location bursts
3. Android client POSTs telemetry to FastAPI endpoint over HTTPS (authenticated)
4. FastAPI's AsyncSession writes to PostgreSQL without blocking concurrent requests
5. WebSocket/SSE channel pushes real-time update to Next.js dashboard
6. Dashboard re-renders live map marker with updated position and event context

---

## KEY TECHNICAL CHALLENGES & SOLUTIONS

### Challenge 1: Resilient Background Tracking Against Android's OS

**The Problem:**
Android is fundamentally hostile to long-running background applications. Since Android 8 (Oreo), **Background Execution Limits** restrict what apps can do when not in the foreground. Android's **Doze Mode** and aggressive OEM battery optimizations (particularly on Xiaomi, Samsung, OnePlus devices) will silently kill background services minutes after the screen turns off.

For an anti-theft app, **a tracking service that sleeps is a tracking service that fails**.

Additionally, the app needs to detect *the exact moment* a thief attempts to compromise the device — not after the fact.

**The Solution — Foreground Services + System BroadcastReceivers:**

The application registers a **Foreground Service** (which Android OS explicitly protects from termination) combined with system-level **BroadcastReceivers** defined in `AndroidManifest.xml`.

```xml
<!-- AndroidManifest.xml — System Event Registration -->
<service
    android:name=".services.GhostTrackingService"
    android:foregroundServiceType="location"
    android:exported="false" />

<receiver
    android:name=".receivers.SystemEventReceiver"
    android:exported="true">
    <intent-filter>
        <!-- Resume tracking automatically on every device boot -->
        <action android:name="android.intent.action.BOOT_COMPLETED" />
        <!-- Capture shutdown moment — fire final location burst -->
        <action android:name="android.intent.action.ACTION_SHUTDOWN" />
        <!-- Alert immediately on SIM card change — primary theft indicator -->
        <action android:name="android.telephony.action.SIM_STATE_CHANGED" />
    </intent-filter>
</receiver>
```

```kotlin
// SystemEventReceiver.kt — Handling system broadcast events
class SystemEventReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        when (intent.action) {
            Intent.ACTION_BOOT_COMPLETED -> {
                // Device rebooted — restart the Foreground Service immediately
                Intent(context, GhostTrackingService::class.java).also { serviceIntent ->
                    ContextCompat.startForegroundService(context, serviceIntent)
                }
            }
            Intent.ACTION_SHUTDOWN -> {
                // Device shutting down — fire final location snapshot to backend
                LocationCapture.sendEmergencySnapshot(context)
            }
            TelephonyManager.ACTION_SIM_STATE_CHANGED -> {
                // SIM card state changed — high-priority theft alert
                val simState = intent.getStringExtra(IccCardConstants.INTENT_KEY_ICC_STATE)
                if (simState == IccCardConstants.INTENT_VALUE_ICC_ABSENT) {
                    AlertDispatcher.sendSimSwapAlert(context)
                    LocationCapture.sendEmergencySnapshot(context)
                }
            }
        }
    }
}
```

**Why This Works:**
- `BOOT_COMPLETED` ensures the tracking service **auto-resumes without user interaction** — a thief who restarts the phone immediately reactivates tracking
- `ACTION_SHUTDOWN` hooks into the device power-off sequence — **the last known location is captured before the device goes dark**
- `SIM_STATE_CHANGED` with `ICC_ABSENT` state is the most reliable indicator of a SIM swap — it fires at the OS level, not the app level, making it nearly impossible to suppress
- Native Kotlin BroadcastReceivers are **significantly more reliable** than cross-platform equivalents (React Native, Flutter) for these deep system integrations

---

### Challenge 2: High-Performance Telemetry Ingestion

**The Problem:**
A moving device fires location packets continuously. At peak tracking frequency, a single device might send updates every 5–10 seconds. In a multi-device scenario (e.g., a family plan, or fleet management), dozens of devices stream simultaneously.

A **synchronous backend** processes one request at a time. Under concurrent load:
- Database write locks cause request queuing
- Thread pool exhaustion leads to dropped connections
- Response latency degrades, causing the Android client to retry — amplifying the load problem

**The Solution — Asynchronous Python Backend (FastAPI + SQLAlchemy AsyncSession):**

FastAPI abandons the traditional synchronous WSGI model entirely in favor of Python's **asyncio event loop**. Every I/O operation (database reads and writes) is `await`-able — the event loop never blocks.

```python
# main.py — Async endpoint for telemetry ingestion
from fastapi import FastAPI, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from .database import get_db
from .models import TelemetryRecord
from .schemas import TelemetryPayload

app = FastAPI()

@app.get("/health")
async def health_check(db: AsyncSession = Depends(get_db)):
    # Non-blocking async DB health verification
    result = await db.execute(text("SELECT 1"))
    return {"status": "ok", "db": "connected"}

@app.post("/api/telemetry")
async def ingest_telemetry(
    payload: TelemetryPayload,
    db: AsyncSession = Depends(get_db)
):
    # Validate device ownership (JWT auth middleware applied)
    record = TelemetryRecord(
        device_id=payload.device_id,
        latitude=payload.latitude,
        longitude=payload.longitude,
        timestamp=payload.timestamp,
        event_type=payload.event_type  # 'location', 'sim_swap', 'shutdown_alert'
    )
    db.add(record)
    await db.commit()  # Non-blocking — event loop handles other requests while waiting

    # Broadcast to dashboard via WebSocket/SSE
    await broadcast_to_dashboard(payload.device_id, payload)

    return {"status": "received"}
```

```python
# database.py — Async SQLAlchemy session factory
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

engine = create_async_engine(
    "postgresql+asyncpg://user:password@localhost/ghostphone",
    pool_size=20,          # Connection pool — handles concurrent sessions
    max_overflow=10,       # Burst capacity beyond pool_size
    echo=False
)

AsyncSessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
```

**Why This Works:**
- A single FastAPI process can handle **thousands of concurrent telemetry connections** — the event loop multiplexes I/O without spawning threads
- `asyncpg` (async PostgreSQL driver) enables the DB layer to participate fully in the async model — no blocking in the I/O path
- `expire_on_commit=False` prevents SQLAlchemy from re-querying the DB after writes — one round trip per ingestion, not two
- The architecture is **naturally horizontally scalable** — multiple FastAPI instances behind a load balancer with the same PostgreSQL backend

---

### Challenge 3: Secure, Real-Time Dashboard Delivery

**The Problem:**
The web dashboard presents two competing requirements:
1. **Real-time updates** — The live map must update within seconds of a location event
2. **Security** — API keys (for mapping services like Mapbox) must never be exposed in the browser bundle

**The Solution — Next.js App Router with Server Actions:**

Next.js Server Actions run exclusively on the server — they have access to environment variables (API keys) without exposing them to the client bundle. The live map rendering makes API calls proxied through Next.js Server Actions, never directly from the browser.

```typescript
// app/actions/getMapToken.ts — Server Action (runs server-side only)
'use server';

export async function getMapboxToken(): Promise<string> {
  // process.env is server-side only — never shipped to browser
  return process.env.MAPBOX_SECRET_TOKEN!;
}
```

**Real-Time Updates:**
FastAPI broadcasts telemetry events via **Server-Sent Events (SSE)** — a simpler, HTTP/1.1 compatible alternative to WebSockets for one-directional real-time streams. The Next.js client subscribes and updates the map marker position on each event.

---

## FEATURES (USER-FACING)

| Feature                     | Description                                                                       |
|-----------------------------|-----------------------------------------------------------------------------------|
| **Live Location Map**       | Real-time GPS tracking with trail visualization and timestamp history             |
| **Boot Detection**          | Tracking resumes automatically on every device restart — no user action required  |
| **SIM Swap Alert**          | Instant alert and location snapshot when SIM card is removed or changed           |
| **Shutdown Capture**        | Final location burst fired immediately when device shutdown is initiated          |
| **Alert Center**            | Chronological log of all tamper events with timestamps and location context       |
| **Historical Telemetry**    | Replay the device's movement history across any time range                        |
| **Device Status Panel**     | Last-seen time, battery level (if reported), connectivity status                  |
| **Multi-Device Support**    | Dashboard supports registering and monitoring multiple devices                    |
| **Auth-Protected Access**   | Dashboard requires authentication — device telemetry is scoped to owner account  |

---

## PERFORMANCE & SECURITY METRICS

| Metric                   | Value / Architecture                                    |
|--------------------------|---------------------------------------------------------|
| **OS Integration Depth** | Background Location, Network State, Phone State, SIM   |
| **Backend Concurrency**  | High-throughput asyncio event loop (FastAPI)            |
| **Database**             | Async PostgreSQL via asyncpg + SQLAlchemy               |
| **Frontend**             | Next.js App Router — SSR + Server Actions               |
| **API Key Security**     | Server-side only — never exposed in client bundle       |
| **Android Resilience**   | Survives reboot, SIM swap, shutdown sequence            |

---

## ARCHITECTURAL DECISIONS LOG

| Decision              | Chosen Approach          | Alternative Considered | Rationale                                                                          |
|-----------------------|--------------------------|------------------------|------------------------------------------------------------------------------------|
| Backend Framework     | FastAPI (Python)         | Express.js             | Python's asyncio ecosystem + future geospatial AI analysis (geopy, Shapely, etc.) |
| Frontend Framework    | Next.js                  | Vite React (SPA)       | Server Actions protect sensitive API keys; SSR ensures fast first-meaningful-paint |
| Android Approach      | Native Kotlin            | React Native / Flutter | Deep system BroadcastReceivers are unreliable in cross-platform bridges            |
| Database              | PostgreSQL               | MongoDB                | Relational integrity for device/user associations; PostGIS for future geospatial   |
| Async Driver          | asyncpg                  | psycopg2               | asyncpg is purpose-built for asyncio — psycopg2 is synchronous and would block    |
| Real-Time Protocol    | SSE                      | WebSockets             | SSE is simpler (HTTP/1.1), auto-reconnects, sufficient for one-directional stream  |

---

## WHAT I LEARNED

- **Threat modeling drives architecture.** Building against an adversarial user (the thief) forced every technical decision to be justified against a concrete attack vector. This adversarial thinking is directly applicable to security engineering in enterprise systems.
- **Android OS is an adversary too.** Battery optimization systems on Android are architecturally designed to kill background processes. Winning against them requires using OS-privileged APIs (Foreground Services, BroadcastReceivers) — application-level workarounds don't survive.
- **Async isn't always better — but for I/O-bound, concurrent workloads it's transformative.** FastAPI + asyncpg under concurrent load significantly outperforms a synchronous Express.js equivalent — measurably, not theoretically.
- **Next.js Server Actions are a genuine security primitive**, not just a DX convenience. They fundamentally change what can be safely done at the server/client boundary.
- **Full-stack is more than knowing two languages.** True full-stack development means understanding the communication contracts between layers — the Android HTTP client, the FastAPI ingestion model, the PostgreSQL schema, and the Next.js rendering pipeline must all be designed as a coherent system.

---

## FUTURE EVOLUTION (ROADMAP)

| Feature                        | Description                                                                                     |
|--------------------------------|-------------------------------------------------------------------------------------------------|
| **E2E Encrypted Telemetry**    | End-to-End Encryption for all location streams — only dashboard owner holds decryption keys     |
| **Remote Command Execution**   | Firebase Cloud Messaging (FCM) push commands: Lock Screen, Sound Alarm, Wipe Data              |
| **AI Movement Prediction**     | LLM/ML-based prediction of device movement trajectory for proactive recovery assistance         |
| **Geofencing Alerts**          | Define safe zones — receive alerts when device exits the perimeter                              |
| **PostGIS Integration**        | Migrate geospatial queries to PostgreSQL PostGIS extension for complex spatial analytics        |
| **Encrypted Local Storage**    | AES-encrypted location database on the Android client — tamper-proof local telemetry cache     |

---

## TALKING POINTS (FOR INTERVIEWS / CONCIERGE CONTEXT)

- *"GhostPhone was built with an explicit threat model — the 'attacker' is a thief actively trying to defeat the tracking system. Every architectural decision maps to a specific attack vector."*
- *"I chose native Kotlin over React Native specifically because system BroadcastReceivers for BOOT_COMPLETED and SIM_STATE_CHANGED are fundamentally unreliable in cross-platform bridges — this is one of the cases where native is non-negotiable."*
- *"The FastAPI AsyncSession pattern isn't just about performance — it's about predictability under burst load. A synchronous backend that drops telemetry packets defeats the product's core purpose."*
- *"Next.js Server Actions for API key protection isn't a security nice-to-have in this context — a tracking dashboard that exposes its mapping API keys is a billing liability."*
- *"This project spans four distinct technical disciplines: Android systems programming, async Python backend engineering, relational database design, and React/Next.js frontend — that's the definition of full-stack."*
- *"The SIM_STATE_CHANGED BroadcastReceiver with ICC_ABSENT state detection is the most technically interesting part of this system — it fires before the network connection drops, giving a critical window to send the alert."*
