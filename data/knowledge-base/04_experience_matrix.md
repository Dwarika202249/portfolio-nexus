# PROFESSIONAL EXPERIENCE MATRIX
> **NEXUS OS // CAREER INTELLIGENCE MODULE v2.0**
> *Classification: EMPLOYMENT RECORD — IMPACT-FIRST FORMAT*
> *Every entry answers: What problem existed? What did I do? What changed?*

---

## SYSTEM_OVERVIEW

This document contains the complete professional experience record for Dwarika Kumar, formatted for maximum impact in recruiter conversations. Every bullet point is built on the **PAR framework** (Problem → Action → Result). Where numbers are available, they are included. Where they are not, the technical complexity is the proof.

When a recruiter asks *"Walk me through your work experience"* or *"What did you actually do at HCLTech?"* — this file contains the honest, detailed, impact-driven answer.

---

## EXPERIENCE_TIMELINE

```
2018 ─────── 2022 ─────── Oct 2022 ─────────────────── Oct 2025 ─────── Present
  |             |               |                             |               |
B.Tech CSE   Graduated     Joined HCLTech            Left HCLTech       SaaS Founder +
CGPA 8.63    (8.63 CGPA)   Frontend Engineer          ~3 years         Active Job Search
                                                                         Remote Roles
```

---

## HCLTECH // FRONTEND ENGINEER

**Company:** HCL Technologies Limited (HCLTech)  
**Role:** Frontend Engineer (later operating as Full Stack contributor)  
**Location:** Noida, Uttar Pradesh, India  
**Employment Type:** Full-Time  
**Duration:** October 2022 – October 2025 (~3 years)  
**Team:** Enterprise Digital Services / IT Service Management (ITSM)  
**Domain:** Enterprise SaaS, IT Operations Management, Incident Lifecycle Management  

---

### COMPANY_CONTEXT

HCLTech is a global IT services company with $13B+ in revenue and 200,000+ employees across 60 countries. The team Dwarika joined was responsible for building internal enterprise tools — specifically the **ServiceXChange** platform, a custom Incident Management Dashboard used by enterprise clients (including Fortune 500 companies) to manage IT operations and SLA compliance.

This was not a startup environment. The codebase served 10,000+ real enterprise users. Production incidents had real-world consequences: SLA breaches meant contractual penalties. UI failures meant support engineers couldn't triage critical IT incidents. The stakes were genuine.

---

### IMPACT_1: Architecting the Incident Management Dashboard (Core Platform)

**Problem Context:**
Enterprise clients needed a centralized, real-time view of all IT incidents — from creation to resolution — with SLA monitoring baked in. Existing tooling was fragmented: engineers had to switch between ServiceNow, BMC Remedy, and internal tracking sheets. This fragmentation caused delayed responses, missed SLA deadlines, and poor visibility for management.

**What Dwarika Built:**
- Designed and developed the core **Incident Management Dashboard** as a React Single-Page Application (SPA)
- The dashboard provided a unified lifecycle view: Incident Created → Assigned → In Progress → Resolved → Closed
- Real-time SLA countdown timers for each incident, color-coded by urgency (Green/Yellow/Red/Breached)
- Status-based incident priority queue — Critical P1 incidents always surfaced to the top
- Incident detail panels: full conversation history, attachment management, assignment history
- Notification system: browser notifications + in-app alerts for SLA warning thresholds

**Technical Implementation:**
```jsx
// SLA Timer Component — Real-Time Countdown
const SLATimer = ({ slaStatus }) => {
  const { remainingSeconds, status } = slaStatus;
  const [displayTime, setDisplayTime] = useState(remainingSeconds);
  
  useEffect(() => {
    if (status === 'BREACHED') return;
    
    const interval = setInterval(() => {
      setDisplayTime(prev => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [status]);
  
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };
  
  return (
    <span className={`sla-timer sla-timer--${status.toLowerCase()}`}>
      {status === 'BREACHED' ? 'BREACHED' : formatTime(displayTime)}
    </span>
  );
};
```

**Impact:**
- Provided real-time lifecycle visibility to 10,000+ enterprise users across multiple clients
- Reduced mean time to acknowledge (MTTA) for P1 incidents by eliminating context-switching between tools
- Became the primary incident management interface for the enterprise support team, replacing manual spreadsheet tracking

---

### IMPACT_2: Advanced Search and Multi-Faceted Filtering System

**Problem Context:**
Support engineers regularly needed to isolate specific incidents within a pool of thousands: "Show me all Critical incidents assigned to Team A that are within 30 minutes of SLA breach." The previous approach was manual scrolling and crude CTRL+F searches — completely inadequate at scale.

**What Dwarika Built:**
- **Full-text search** across incident number, description, and assignment group
- **Multi-faceted filter panel** with:
  - Priority filter: Critical / High / Medium / Low
  - Status filter: Open / In Progress / Pending / Resolved / Closed
  - Assignment Group filter: Multi-select dropdown with autocomplete
  - SLA Status filter: Healthy / Warning / Breached
  - Date range filter: Created At, Updated At, Resolved At
  - Source system filter: ServiceNow / BMC / Internal
- **Saved filters:** Users could save frequently used filter combinations as named presets
- **Filter persistence:** Active filters persisted across page refreshes via URL query params

**Technical Implementation — Debounced Search with AbortController:**
```javascript
// useIncidentSearch.js
const useIncidentSearch = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef(null);
  
  const search = useCallback(
    debounce(async (searchParams) => {
      // Cancel previous request
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();
      
      setLoading(true);
      
      try {
        const queryString = buildQueryString(searchParams); // Serialize filters to URL params
        const response = await fetch(`/api/incidents?${queryString}`, {
          signal: abortControllerRef.current.signal
        });
        const data = await response.json();
        setResults(data.incidents);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Search failed:', err);
        }
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );
  
  return { results, loading, search };
};
```

**URL-Based Filter Persistence:**
```javascript
// Sync filters to URL params — allows sharing and browser back/forward
const syncFiltersToURL = (filters) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== 'all') params.set(key, value);
  });
  window.history.replaceState(null, '', `?${params.toString()}`);
};
```

**Impact:**
- Support engineers could isolate specific incident subsets in <5 seconds (previously 2-3 minutes of manual scanning)
- Saved filter presets reduced repetitive setup for common queries (e.g., "My Team's Open P1s")
- URL-based filters enabled sharing specific incident views across team members

---

### IMPACT_3: Dynamic Data Grids with Performance Optimization

**Problem Context:**
The incident grid was the most performance-sensitive component in the dashboard. With 10,000+ incidents, standard React rendering caused the browser to freeze for 2-4 seconds on initial load and during filter changes. On lower-end enterprise laptops (common in enterprise environments), this was completely unusable.

**Root Cause Analysis:**
- React attempted to render 10,000 DOM nodes synchronously
- Each `IncidentRow` component had multiple child components (SLA timers, badges, truncated text)
- Filter changes triggered full re-renders of the entire list
- No memoization on row components — identical incidents re-rendered on every parent state change

**Solution Implemented:**
1. **Virtual Scrolling:** Only DOM nodes visible in the viewport + 10-row buffer are rendered
2. **Row Memoization:** `React.memo` with custom equality function — row only re-renders if its `updatedAt` timestamp changes
3. **Pagination Hybrid:** Virtual scrolling within pages, pagination for dataset chunking (fetch 500 records at a time, not all 10,000)
4. **KPI Summary Cards:** Separate React Query cache for aggregate counts — no need to fetch all records just to show "Total Open: 847"

```jsx
// KPI Summary Cards — Separate lightweight API call
const IncidentKPICards = () => {
  const { data: kpis } = useQuery({
    queryKey: ['incident-kpis'],
    queryFn: fetchIncidentKPIs, // Aggregate endpoint — fast MongoDB $group query
    staleTime: 30000 // Acceptable staleness for summary counts
  });
  
  return (
    <div className="kpi-grid">
      <KPICard label="Total Open" value={kpis?.totalOpen} color="blue" />
      <KPICard label="Critical P1" value={kpis?.criticalCount} color="red" />
      <KPICard label="SLA Breached" value={kpis?.breachedCount} color="orange" />
      <KPICard label="Resolved Today" value={kpis?.resolvedToday} color="green" />
    </div>
  );
};
```

**MongoDB Aggregation for KPIs:**
```javascript
const getIncidentKPIs = async (filters) => {
  const [result] = await Incident.aggregate([
    { $match: buildMongoFilter(filters) },
    {
      $group: {
        _id: null,
        totalOpen: { $sum: { $cond: [{ $in: ['$status', ['open', 'in_progress']] }, 1, 0] } },
        criticalCount: { $sum: { $cond: [{ $eq: ['$priority', 'critical'] }, 1, 0] } },
        breachedCount: { $sum: { $cond: [{ $eq: ['$slaStatus', 'breached'] }, 1, 0] } },
        resolvedToday: {
          $sum: {
            $cond: [
              { $and: [
                { $eq: ['$status', 'resolved'] },
                { $gte: ['$resolvedAt', new Date(new Date().setHours(0,0,0,0))] }
              ]},
              1, 0
            ]
          }
        }
      }
    }
  ]);
  return result;
};
```

**Impact:**
- Initial grid render improved from ~4.2 seconds to 680ms (84% improvement)
- Navigation speed improved by 20% (reduced time between filter application and results display)
- Zero layout thrashing complaints in production after deployment

---

### IMPACT_4: eBonding Synchronization with ServiceNow and BMC Remedy

**Problem Context:**
Enterprise clients used ServiceNow and BMC Remedy as their primary ITSM systems. The ServiceXChange dashboard needed to be a real-time mirror of those systems — any incident created, updated, or resolved in ServiceNow needed to instantly reflect in ServiceXChange, and vice versa.

This was called "eBonding" — bidirectional synchronization between two ITSM systems via API webhooks and polling. The challenge was ensuring data integrity and handling the inevitable conflicts that arise when both systems can modify the same incident.

**What Dwarika Built:**
- Webhook receiver endpoints that accepted ServiceNow/BMC push notifications
- Field mapping layer: ServiceNow's `incident.state` values mapped to ServiceXChange's internal `status` enum
- Conflict resolution strategy: "Last write wins" with timestamp comparison
- eBonding status indicator in the UI: showed whether each incident was "Synced", "Pending Sync", or "Sync Failed"
- Retry queue for failed sync attempts with exponential backoff

**Technical Implementation:**
```javascript
// Webhook receiver for ServiceNow eBonding
router.post('/webhooks/servicenow', 
  validateWebhookSignature('servicenow'), // HMAC verification
  async (req, res) => {
    const { sys_id, state, short_description, assigned_to, updated_on } = req.body;
    
    try {
      // Map ServiceNow fields to internal schema
      const incidentUpdate = {
        externalId: { servicenow: sys_id },
        status: mapServiceNowState(state),
        title: short_description,
        assignedTo: assigned_to?.display_value,
        externalUpdatedAt: new Date(updated_on),
        syncStatus: 'synced',
        lastSyncedAt: new Date()
      };
      
      // Upsert: create if doesn't exist, update if it does
      await Incident.findOneAndUpdate(
        { 'externalId.servicenow': sys_id },
        { $set: incidentUpdate },
        { upsert: true, new: true }
      );
      
      // Broadcast update to connected dashboard clients
      io.to(`restaurant:${incident.clientId}`).emit('incident_update', {
        type: 'EBONDING_SYNC',
        incidentId: sys_id
      });
      
      res.status(200).json({ status: 'accepted' });
    } catch (err) {
      // Queue for retry
      await SyncRetryQueue.add({ source: 'servicenow', payload: req.body });
      res.status(500).json({ error: 'SYNC_QUEUED_FOR_RETRY' });
    }
  }
);

// ServiceNow state mapping
const mapServiceNowState = (snState) => {
  const stateMap = {
    '1': 'open',           // New
    '2': 'in_progress',    // In Progress
    '3': 'on_hold',        // On Hold
    '6': 'resolved',       // Resolved
    '7': 'closed'          // Closed
  };
  return stateMap[String(snState)] ?? 'open';
};
```

**Impact:**
- Maintained bidirectional data integrity between ServiceXChange and ServiceNow/BMC
- Eliminated manual status updates that were previously required when incidents changed in external systems
- eBonding status visibility gave support engineers confidence in data accuracy

---

### IMPACT_5: Resolving the P1 DST Timezone Bug (Production Incident)

*(See full technical breakdown in 03_project_war_stories.md — SERVICE_XCHANGE section)*

**Summary:**
- **Severity:** P1 — contractual SLA implications
- **Root Cause:** Frontend computing SLA timers in browser local timezone vs UTC server timestamps
- **Resolution:** Moved all SLA computations server-side to Node.js (UTC-only environment)
- **Outcome:** Zero SLA calculation errors post-fix. Added regression tests for DST edge cases.
- **Post-Mortem:** Documented the incident with root cause, timeline, and prevention measures

---

### HCLTECH_SKILLS_DEVELOPED

**Technical Skills Hardened at HCLTech:**
- React.js at enterprise scale (10,000+ user production application)
- Performance optimization: virtual scrolling, memoization, debouncing, AbortController
- ITSM domain knowledge: Incident lifecycle, SLA management, eBonding
- Production incident response: triage, diagnosis, fix, post-mortem
- Enterprise API integration: ServiceNow REST API, BMC Remedy API
- Real-world state management with Context API and React Query
- UTC-first date/time handling in distributed systems
- Agile/Scrum in enterprise environment (Azure DevOps, 2-week sprints)

**Soft Skills Developed:**
- Stakeholder communication during production incidents
- Working within large codebases with strict code review processes
- Async collaboration with global teams across time zones
- Writing technical documentation for enterprise-grade systems
- Presenting performance improvement proposals to senior engineers

---

## FOUNDER & LEAD ENGINEER // SAAS VENTURES

**Role:** Founder & Full Stack Engineer  
**Projects:** DineOS | MockMate AI | CodeWeavers  
**Duration:** Concurrent with final phase at HCLTech and post-departure  
**Type:** Self-directed, product-led development  

---

### CONTEXT

After 3 years of building other companies' products, Dwarika began building his own. The SaaS ventures represent a different kind of engineering work — not just coding to specs, but making product decisions, architectural decisions, and business decisions simultaneously.

Building DineOS, MockMate AI, and CodeWeavers was not about portfolio points. It was about answering a question: *"Can I build something that could actually be a business?"*

The answer, based on the architecture and quality of these systems, is yes.

---

### SAAS_IMPACT_1: DineOS — Multi-Tenant Real-Time Restaurant OS

*(See full technical breakdown in 03_project_war_stories.md — DINEOS section)*

**Engineering Achievements:**
- Architected and solo-built a complete B2B2C SaaS platform from zero to production
- Designed and implemented multi-tenant data isolation (tenantId middleware pattern)
- Built a real-time synchronization engine (Socket.io rooms) serving 5 distinct user roles
- Integrated Groq LLM API with RAG for hallucination-free AI Concierge
- Implemented Firebase Phone Auth for bot-proof onboarding
- Deployed full stack on Render (Node.js backend) + Vercel (React frontend)

**Business Thinking Demonstrated:**
- Identified a market gap: restaurant management SaaS that's affordable and actually usable
- Designed for the B2B2C model: restaurants are the customers, their customers use the product
- Built subscription model architecture (multi-tenant infrastructure supports future billing)

---

### SAAS_IMPACT_2: MockMate AI — Intelligent Interview Simulation Platform

*(See full technical breakdown in 03_project_war_stories.md — MOCKMATE section)*

**Engineering Achievements:**
- Built RAG pipeline for resume-aware, hallucination-free interview question generation
- Implemented SSE streaming, reducing perceived LLM response latency by 91%
- Integrated OpenAI Whisper for voice-to-text interview responses
- Designed a quantitative grading rubric system backed by domain knowledge vector stores
- Solved concurrent audio/video stream handling in Node.js

---

### SAAS_IMPACT_3: CodeWeavers — Enterprise LMS SaaS

*(See full technical breakdown in 03_project_war_stories.md — CODEWEAVERS section)*

**Engineering Achievements:**
- Designed 3-role RBAC architecture (Admin/College/Student) with JWT claim-based route protection
- Built ApexCharts analytics engine with MongoDB aggregation pipelines
- Implemented automated PDF certificate generation via Puppeteer
- Optimized data grids for 5,000+ record rendering with sub-second performance
- Built mobile-first responsive UI with Tailwind CSS

---

## EDUCATION_RECORD

### BP PODDAR INSTITUTE OF MANAGEMENT AND TECHNOLOGY
**Degree:** Bachelor of Technology (B.Tech)  
**Major:** Computer Science and Engineering  
**Location:** Kolkata, West Bengal, India  
**Duration:** 2018 – 2022  
**CGPA:** 8.63 / 10.0 (First Division with Distinction)  

---

### ACADEMIC_HIGHLIGHTS

**Core Computer Science Foundation:**
- Data Structures and Algorithms: Arrays, Linked Lists, Trees, Graphs, Hash Maps, Heaps
- Algorithm Analysis: Time/Space complexity, Big-O notation
- Database Management Systems: SQL, normalization, ACID properties, query optimization
- Operating Systems: Process management, memory management, threading, synchronization
- Computer Networks: TCP/IP, HTTP/HTTPS, DNS, routing protocols
- Object-Oriented Programming: Encapsulation, inheritance, polymorphism, design patterns
- Software Engineering: SDLC models, Agile methodology, design patterns (GOF), clean code principles
- Computer Architecture: CPU pipeline, cache hierarchy, memory models

**Mathematics Foundation:**
- Discrete Mathematics: Set theory, graph theory, combinatorics, logic
- Statistics and Probability: Probability distributions, hypothesis testing (foundational for ML)
- Linear Algebra: Vectors, matrices, transformations (foundational for AI/ML)

---

### WHY_CGPA_MATTERS

8.63 CGPA in Computer Science Engineering is a strong indicator of:
1. **Consistent performance** across 8 semesters
2. **Strong fundamentals** in CS theory (DSA, OS, Networks, DBMS)
3. **Learning aptitude** — Dwarika was not just interested in coding, but in understanding the foundations
4. **Work ethic** — sustained academic performance alongside learning to code professionally

---

## CAREER_GAP_EXPLANATION (If Asked)

**Q: Why did you leave HCLTech in October 2025?**

**A:** After nearly 3 years at HCLTech, I had grown significantly but felt the growth curve was flattening. I was doing excellent work but within a well-defined scope. To reach the next level — building complete systems rather than features within existing systems, working with modern GenAI tooling, and moving toward remote-first product companies — I needed to create space for deliberate skill expansion and independent building.

Since leaving, I've built DineOS (multi-tenant SaaS with real-time WebSockets + AI), MockMate AI (RAG-based interview platform with SSE streaming), and CodeWeavers (enterprise LMS with RBAC). These projects represent the architectural depth I was seeking — and they've made me a materially stronger engineer than I was when I left.

I'm now actively targeting remote full-stack / frontend engineering roles at product-first companies where I can apply this full breadth of skills.

---

## TOTAL_IMPACT_SUMMARY

| Dimension                  | Evidence                                                     |
|----------------------------|--------------------------------------------------------------|
| **Scale**                  | Built for 10,000+ enterprise users at HCLTech                |
| **Complexity**             | Multi-tenant SaaS, real-time WebSockets, RAG AI pipelines    |
| **Performance**            | 84% render improvement, 91% latency reduction                |
| **Production Experience**  | P1 incident resolution, enterprise eBonding, SLA systems     |
| **Breadth**                | Frontend, Backend, AI/ML integration, DevOps                |
| **Self-Direction**         | Solo-built 3 production-quality SaaS products                |
| **Academic Foundation**    | 8.63 CGPA in CSE — strong fundamentals                      |

---

*END OF MODULE: 04_EXPERIENCE_MATRIX*
*Next Module: 05_QA_BANK.md*
