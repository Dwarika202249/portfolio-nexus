# 🏢 HCL – Service Xchange / Incident Management Dashboard
## Complete Interview Q&A — Senior-Level Structured Answers

> **Context:** Enterprise Incident Management Dashboard — React SPA with ITSM integrations (ServiceNow, BMC), eBonding sync, 10k+ record rendering, real-time SLA tracking.

---

# Q1. What was the overall architecture of the system?

## 🎯 30-Second Interview Answer
"The system was a React SPA consuming REST APIs from a Node.js backend, which integrated with ITSM tools like ServiceNow and BMC via an eBonding synchronization layer. The frontend was responsible for rendering real-time incident lifecycle data, KPI widgets, and advanced filtering — all while managing 10k+ records efficiently. The architecture was client-server with a clear separation: UI handled presentation and local state, APIs owned business logic, and the eBonding layer managed cross-tool data consistency."

## 🔬 Deep Technical Explanation

```
┌─────────────────────────────────────────────────────────────────┐
│                     HIGH-LEVEL ARCHITECTURE                      │
│                                                                   │
│  ┌──────────┐    REST APIs    ┌──────────────┐                   │
│  │  React   │ ←────────────→ │  Node.js API │                   │
│  │   SPA    │                │   Server     │                   │
│  │ (Vite/CRA│                └──────┬───────┘                   │
│  └──────────┘                       │                            │
│                              ┌──────┴────────┐                  │
│                              │   Database    │                  │
│                              │  (Relational  │                  │
│                              │  + Cache)     │                  │
│                              └──────┬────────┘                  │
│                                     │                            │
│                              ┌──────┴────────┐                  │
│                              │  eBonding     │                  │
│                              │  Layer        │                  │
│                              └──────┬────────┘                  │
│                           ┌─────────┴──────────┐               │
│                    ┌──────┴──┐              ┌───┴─────┐         │
│                    │Service  │              │  BMC    │         │
│                    │  Now    │              │ Remedy  │         │
│                    └─────────┘              └─────────┘         │
└─────────────────────────────────────────────────────────────────┘

DATA FLOW:
User Action → React Component → API Service Layer → Node.js Backend
                                                          ↓
                                               Business Logic + Auth
                                                          ↓
                                               DB Query / Cache Check
                                                          ↓
                                               eBonding Sync (if needed)
                                                          ↓
                                               Response → React State → UI
```

**Frontend Layer Responsibilities:**
- Rendering incident records with lifecycle status
- KPI summary widgets (open/closed/breached SLAs)
- Advanced multi-field filtering + debounced search
- Role-based UI rendering
- SLA countdown timers
- Error boundary handling for partial failures

**Backend Layer Responsibilities:**
- Authentication + JWT validation
- Incident CRUD operations
- Server-side filtering + pagination
- eBonding event handling
- SLA calculation logic

## 💡 Senior Insight
> The key architectural decision was keeping **filtering logic server-side** for datasets above 1k records. Client-side filtering looks simple but creates memory pressure, blocks the main thread during large array operations, and doesn't scale when the dataset grows. This decision alone significantly impacted the perceived performance of the dashboard.

---

# Q2. What was your exact responsibility?

## 🎯 30-Second Interview Answer
"I owned the entire frontend of the Incident Management Dashboard. My responsibilities included building the centralized incident grid with 10k+ record optimization, designing the KPI widget layer, implementing advanced multi-criteria filtering with debounce, handling eBonding sync state consistency in the UI, and improving navigation speed by approximately 20% through profiling and targeted optimizations."

## 🔬 Deep Technical Breakdown

| Responsibility | Technical Approach |
|---|---|
| Centralized Dashboard UI | React SPA, component-based architecture |
| Advanced Filtering & Search | Controlled inputs + debounced state + server-side query |
| 10k+ Record Rendering | Virtual scrolling / pagination + memoization |
| KPI Widgets | useMemo computed metrics + auto-refresh |
| eBonding UI Consistency | Idempotent state updates + conflict handling |
| 20% Navigation Improvement | Code splitting + lazy loading + route prefetching |

---

# Q3. How did you handle rendering 10,000+ records efficiently?

## 🎯 30-Second Interview Answer
"Rendering 10k records naively would mount 10k DOM nodes — causing layout thrashing, paint delays, and jank. I used a combination of server-side pagination to control data volume, virtual scrolling to render only visible rows, memoized row components to prevent unnecessary re-renders, and debounced search to avoid rapid re-renders during typing. The result was sub-100ms render time even with large datasets."

## 🔬 Deep Technical Explanation

### Why Naive Rendering Fails
```
10,000 rows × (1 div + 8 td) = ~90,000 DOM nodes
Browser creates layout boxes for ALL of them
→ Layout thrashing on every scroll
→ Paint time: 800ms+
→ Memory: 200MB+
→ Scroll FPS drops below 20
```

### Strategy 1: Virtual Scrolling
```
Physical DOM: Only ~20-30 rows rendered at any time

Container (fixed height: 600px, overflow: auto)
  ├── Spacer (height = 10000 * rowHeight = 400,000px) ← creates scrollbar
  └── Visible window (translateY to scroll position)
        ├── Row 47  ← startIndex (based on scrollTop)
        ├── Row 48
        ├── Row 49  ← visible
        ...
        └── Row 72  ← endIndex + overscan

Math:
  scrollTop = 1880px
  rowHeight = 40px
  startIndex = floor(1880 / 40) - overscan = 47 - 3 = 44
  visibleCount = ceil(600 / 40) = 15
  endIndex = 44 + 15 + 3 = 62
  Rendered: 18 rows only
```

### Strategy 2: Memoization
```javascript
// Memoize row component — only re-renders when row data changes
const IncidentRow = React.memo(({ incident, onSelect }) => {
  return (
    <tr>
      <td>{incident.id}</td>
      <td>{incident.title}</td>
      <td>
        <SLABadge status={incident.slaStatus} breachTime={incident.breachAt} />
      </td>
      <td>
        <PriorityBadge level={incident.priority} />
      </td>
    </tr>
  );
}, (prevProps, nextProps) => {
  // Custom comparison — only re-render if data actually changed
  return prevProps.incident.updatedAt === nextProps.incident.updatedAt;
});
```

### Strategy 3: Debounced Search
```javascript
function useIncidentSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchIncidents = useCallback(
    debounce(async (searchQuery, filters) => {
      setLoading(true);
      try {
        const data = await api.getIncidents({ q: searchQuery, ...filters });
        setResults(data.incidents);
      } finally {
        setLoading(false);
      }
    }, 400), // 400ms — balances responsiveness with API load
    []
  );

  return { query, setQuery, results, loading, fetchIncidents };
}
```

### Strategy 4: Stable Keys
```javascript
// BAD — index key causes React to reuse wrong DOM nodes on sort/filter
incidents.map((inc, i) => <IncidentRow key={i} incident={inc} />)

// GOOD — stable unique ID
incidents.map(inc => <IncidentRow key={inc.incidentId} incident={inc} />)
```

## ⚡ Edge Cases to Mention
1. **Variable row heights** — if rows have expandable detail sections, fixed-height virtual scroll breaks. Need measured heights or estimated height with correction.
2. **Sort + virtual scroll interaction** — sorting resets scroll position; scroll to top on sort change.
3. **Real-time updates** — new incident inserted at top shifts all indices. Use stable IDs, not index-based references.
4. **Filter + pagination** — reset to page 1 whenever filters change, otherwise stale page data.

## 🔥 Follow-Up Questions
- **"Why not just use pagination instead of virtual scroll?"**
  > Pagination forces user to navigate pages — bad UX for incident dashboards where analysts need to scroll continuously. Virtual scroll gives the feel of having all data available without DOM overhead.

- **"How do you handle variable row heights in virtual scroll?"**
  > Store measured heights in a Map after first render. Use estimated height initially, correct on measurement via ResizeObserver. Binary search for startIndex based on cumulative height offsets.

- **"What library did you use or did you implement custom?"**
  > For production, I'd use `@tanstack/react-virtual` — it handles variable heights, horizontal virtualization, and has no external dependencies. I understand the internals well enough to implement custom if needed.

## ❌ Mistakes That Will Cost You the Job
- Saying "I used pagination so it was fine" without explaining the trade-off
- Not knowing WHY virtual scroll is faster (DOM node count)
- Not mentioning memoization in context of virtual scroll (rows must be memoized or virtualization is wasted)
- Saying `key={index}` is acceptable for dynamic lists

---

# Q4. How did you measure the 20% performance improvement?

## 🎯 30-Second Interview Answer
"I used a combination of Lighthouse for Core Web Vitals, Chrome DevTools Performance tab for render cycle analysis, and React DevTools Profiler for component-level flame graphs. I established a baseline before any changes, applied optimizations in isolation to measure individual impact, and validated the final improvement against the baseline. The 20% was primarily reflected in reduced scripting time and faster Time to Interactive."

## 🔬 Deep Technical Explanation

### Measurement Toolkit
```
1. Lighthouse (automated, repeatable)
   - Run in incognito (no extensions)
   - Run 3× and average
   - Track: TTI, LCP, TBT (Total Blocking Time)

2. Chrome DevTools → Performance Tab
   - Record full interaction
   - Look for: Long Tasks (>50ms), Layout events, Paint events
   - Flame chart: identify expensive JS functions

3. React DevTools Profiler
   - "Record" during interaction
   - Identify components with high render time
   - Check "Why did this render?" for unnecessary renders

4. Web Vitals (production)
   - navigator.sendBeacon() to analytics endpoint
   - Real User Monitoring (RUM) data
```

### What I Actually Measured
```
BEFORE optimization:
  Scripting time: ~1800ms
  Layout events: 47 during scroll
  Component renders: 412 on filter change
  TTI: 4.2s

AFTER optimization:
  Scripting time: ~1440ms  (→ 20% improvement)
  Layout events: 12 during scroll
  Component renders: 89 on filter change
  TTI: 3.1s
```

## 💡 Senior Insight
> Always establish a **repeatable benchmark** before claiming performance improvements. One Lighthouse run is not a benchmark — network variance alone can cause 10% swings. Run in throttled mode (4x CPU slowdown) to simulate low-end devices. The 20% number means something when it's consistently reproducible, not a one-time measurement.

---

# Q5. How did advanced filtering work internally?

## 🎯 30-Second Interview Answer
"The filter system had multiple dimensions — text search, priority dropdown, date range, status multi-select, and assignee. Each filter was a controlled input, and the combined filter state lived in a useReducer. Filter changes triggered a debounced API call with the full filter payload — server-side, because client-side filtering of 10k records blocks the main thread. The backend returned filtered, paginated results."

## 🔬 Deep Technical Explanation

```javascript
// Filter state managed with useReducer (complex interdependent state)
const initialFilterState = {
  search: '',
  priority: [],          // multi-select: ['P1', 'P2']
  status: [],            // multi-select: ['Open', 'InProgress']
  assignee: null,
  dateRange: { from: null, to: null },
  category: null,
};

function filterReducer(state, action) {
  switch (action.type) {
    case 'SET_SEARCH':
      return { ...state, search: action.payload };
    case 'TOGGLE_PRIORITY':
      const priorities = state.priority.includes(action.payload)
        ? state.priority.filter(p => p !== action.payload)
        : [...state.priority, action.payload];
      return { ...state, priority: priorities };
    case 'SET_DATE_RANGE':
      return { ...state, dateRange: action.payload };
    case 'RESET_FILTERS':
      return initialFilterState;
    default:
      return state;
  }
}

// API call — debounced, triggered on any filter change
const debouncedFetch = useCallback(
  debounce((filters) => {
    fetchIncidents(filters); // POST /api/incidents/search
  }, 400),
  []
);

useEffect(() => {
  debouncedFetch(filterState);
}, [filterState]);
```

### API Contract for Filtering
```javascript
// POST /api/incidents/search
{
  "search": "database timeout",
  "priority": ["P1", "P2"],
  "status": ["Open", "InProgress"],
  "dateRange": {
    "from": "2024-01-01T00:00:00Z",
    "to": "2024-01-31T23:59:59Z"
  },
  "page": 1,
  "pageSize": 50,
  "sortBy": "createdAt",
  "sortOrder": "desc"
}
```

### Edge Cases in Filtering
```javascript
// Handle null/empty fields
function buildQueryParams(filters) {
  const params = {};

  if (filters.search?.trim()) params.search = filters.search.trim();
  if (filters.priority?.length) params.priority = filters.priority;
  if (filters.status?.length) params.status = filters.status;

  // Date range — validate both ends present
  if (filters.dateRange.from && filters.dateRange.to) {
    if (new Date(filters.dateRange.from) > new Date(filters.dateRange.to)) {
      throw new Error('From date must be before To date');
    }
    params.dateRange = filters.dateRange;
  }

  return params;
}
```

## 💡 Senior Insight
> One subtle issue: when a user clears all filters rapidly, debounce means the last filter state might not be the empty state. Always **cancel in-flight API calls** when new filter state is dispatched. Use `AbortController` to cancel the previous fetch request. Otherwise, stale results from a previous filter can overwrite current results — classic race condition.

---

# Q6. How did eBonding synchronization work?

## 🎯 30-Second Interview Answer
"eBonding is a bidirectional synchronization mechanism between ITSM tools. An incident created in ServiceNow gets mirrored to our system, and updates from our system push back. My role was ensuring the UI handled sync state correctly — showing idempotent updates, preventing duplicate entries in the grid, managing conflict states where both systems updated the same incident simultaneously."

## 🔬 Deep Technical Explanation

```
EBONDING FLOW:

ServiceNow creates incident INC001234
         ↓
Webhook/API call → eBonding Layer
         ↓
Deduplication check (has INC001234 been synced?)
         ↓  NO
Create internal incident with external_id = "INC001234"
         ↓
Push to dashboard DB
         ↓
Frontend polling/WebSocket receives update
         ↓
Incident appears in grid

BIDIRECTIONAL:
Our system updates status → eBonding Layer → ServiceNow updated
ServiceNow updates status → eBonding Layer → Our system updated
                          CONFLICT ZONE ↑
```

### Conflict Resolution in UI
```javascript
// Idempotent state update — same incident arriving twice = no duplicate
function upsertIncident(state, newIncident) {
  const existingIndex = state.incidents.findIndex(
    i => i.id === newIncident.id || i.externalId === newIncident.externalId
  );

  if (existingIndex >= 0) {
    // Already exists — update only if newer
    const existing = state.incidents[existingIndex];
    if (new Date(newIncident.updatedAt) > new Date(existing.updatedAt)) {
      const updated = [...state.incidents];
      updated[existingIndex] = { ...existing, ...newIncident, _synced: true };
      return { ...state, incidents: updated };
    }
    return state; // Ignore older update
  }

  // New incident
  return { ...state, incidents: [newIncident, ...state.incidents] };
}
```

### UI State During Sync
```javascript
// Visual indicator for sync status
function SyncStatusBadge({ incident }) {
  const statusMap = {
    synced: { color: 'green', label: 'Synced' },
    pending: { color: 'yellow', label: 'Syncing...' },
    conflict: { color: 'orange', label: 'Conflict' },
    failed: { color: 'red', label: 'Sync Failed' },
  };

  const { color, label } = statusMap[incident.syncStatus] || statusMap.synced;
  return <Badge color={color}>{label}</Badge>;
}
```

## ⚡ Edge Cases to Mention
1. **Race condition** — two systems update same incident within milliseconds. Use timestamp precedence + backend "last-write-wins" with conflict flag.
2. **Duplicate incidents** — same incident arrives via two paths (webhook + polling). Use `externalId` as deduplication key.
3. **SLA inconsistency** — ServiceNow's SLA clock vs our system's SLA clock can drift. Always use server timestamps, never client `Date.now()`.
4. **Network partition** — if eBonding layer goes down, queue updates locally and replay on reconnect.

---

# Q7. How did you handle SLA tracking?

## 🎯 30-Second Interview Answer
"SLA tracking was time-critical data — I always used server-provided timestamps, never client-side `Date.now()`, to avoid clock drift. SLA deadlines were pre-calculated on the backend. The frontend computed remaining time as a countdown using `setInterval`, color-coded thresholds (green/yellow/red), and triggered visual alerts as breach approached. For real-time accuracy, SLA status was refreshed on a polling interval or via WebSocket event."

## 🔬 Deep Technical Explanation

```javascript
function SLATimer({ breachAt, createdAt }) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const calculateRemaining = () => {
      const now = Date.now();
      const breach = new Date(breachAt).getTime();
      const remaining = breach - now;
      setTimeLeft(remaining);
    };

    calculateRemaining();
    const interval = setInterval(calculateRemaining, 30000); // update every 30s

    return () => clearInterval(interval);
  }, [breachAt]);

  const formatRemaining = (ms) => {
    if (ms <= 0) return 'BREACHED';
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  const getColor = (ms) => {
    if (ms <= 0) return 'red';           // breached
    if (ms < 3600000) return 'orange';   // < 1 hour
    if (ms < 7200000) return 'yellow';   // < 2 hours
    return 'green';                       // safe
  };

  return (
    <span style={{ color: getColor(timeLeft) }}>
      {formatRemaining(timeLeft)}
    </span>
  );
}
```

## 💡 Senior Insight
> **Never calculate SLA on the client using `Date.now()`** across multiple sessions. A user's system clock can be wrong by hours. The breach time must come from the server as an absolute UTC timestamp. The client only does the subtraction from real-time. Also — suspend SLA timers during incident "hold" status (waiting for customer) — this is a common product requirement that trips up junior devs.

---

# Q8. How did you handle error states?

## 🎯 30-Second Interview Answer
"Error handling had multiple layers: API failures showed toast notifications with retry options, critical section failures used React Error Boundaries to prevent full page crash, loading states used skeleton loaders (not spinners alone), and partial data failure showed what we had with a warning banner. Every error was categorized — network error, auth error, data error — and handled differently."

## 🔬 Deep Technical Explanation

```javascript
// Categorized error handling
async function fetchIncidents(params) {
  try {
    const response = await api.get('/incidents', { params });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      // Auth error — redirect to login
      authService.logout();
      navigate('/login');
    } else if (error.response?.status === 403) {
      // Permission error — show access denied
      toast.error('You do not have permission to view these incidents');
    } else if (error.response?.status >= 500) {
      // Server error — show retry
      toast.error('Server error. Please try again.', {
        action: { label: 'Retry', onClick: () => fetchIncidents(params) }
      });
    } else if (!navigator.onLine || error.code === 'NETWORK_ERROR') {
      // Network offline
      setOfflineMode(true);
      toast.warning('You are offline. Showing cached data.');
    } else {
      // Generic error
      toast.error('Failed to load incidents.');
    }
  }
}

// Error Boundary for section isolation
class DashboardErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log to monitoring (Sentry, DataDog)
    errorMonitoring.capture(error, { componentStack: info.componentStack });
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          onRetry={() => this.setState({ hasError: false })}
        />
      );
    }
    return this.props.children;
  }
}
```

---

# Q9. What state management approach did you use?

## 🎯 30-Second Interview Answer
"I applied a layered state management approach: `useState` for simple local UI state like modal visibility, `useReducer` for complex filter state with many interdependent fields, and Context API for truly global state like user role and theme. Incident data itself was managed as server state — fetched, cached, and invalidated — not duplicated in client state. I deliberately avoided putting everything in global state, which would cause unnecessary re-renders across the tree."

## 🔬 State Architecture

```
State Layer Architecture:

┌─────────────────────────────────────────┐
│           GLOBAL (Context)              │
│   - Authenticated user                  │
│   - User role/permissions               │
│   - Theme/locale                        │
│   → Rarely changes → Low re-render risk │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│         PAGE-LEVEL (useReducer)         │
│   - Filter state (complex, many fields) │
│   - Selected incidents                  │
│   - Pagination state                    │
│   → Medium complexity → Reducer pattern │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│         COMPONENT (useState)            │
│   - Modal open/close                    │
│   - Tooltip hover state                 │
│   - Local input focus                   │
│   → Simple, isolated → useState         │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│         SERVER STATE (React Query)      │
│   - Incident records                    │
│   - KPI metrics                         │
│   → Fetched, cached, invalidated        │
└─────────────────────────────────────────┘
```

## 💡 Senior Insight
> The biggest mistake in enterprise dashboards is treating server data as client state — storing fetched data in Redux/Context and manually managing cache invalidation. Use **React Query or SWR** for server state. They handle caching, background refetching, stale data, loading states, and invalidation automatically. This removes 40% of the state management code in a typical dashboard.

---

# Q10. How would you improve this system now (with 3–5 YOE lens)?

## 🎯 30-Second Interview Answer
"With current knowledge, I'd make several targeted improvements: Replace polling with WebSockets for true real-time updates. Add React Query for server state management — eliminating manual loading/error state handling. Implement proper virtual scrolling with `@tanstack/react-virtual`. Add an observability layer — frontend error tracking via Sentry and performance monitoring via DataDog RUM. And add optimistic updates for status changes so the UI feels instant even before server confirmation."

## Improvement Breakdown

| Area | Current | Improved |
|---|---|---|
| Real-time updates | Polling (interval) | WebSocket / SSE |
| Server state | Manual useState + fetch | React Query / SWR |
| Virtual scrolling | Custom or library | @tanstack/react-virtual |
| Error tracking | Console logs | Sentry + structured logging |
| Performance monitoring | Manual Lighthouse | DataDog RUM / Web Vitals API |
| Optimistic updates | None (wait for API) | Optimistic + rollback |
| Caching | None | React Query cache + stale-while-revalidate |

---

# Q11. What security considerations were involved?

## 🎯 30-Second Interview Answer
"Security was critical since this was an enterprise ITSM tool. I implemented role-based UI rendering — admins saw configuration options, analysts saw only their queue. JWT tokens were validated on every API call. The frontend never exposed raw incident data in localStorage — only user preferences were persisted client-side. API calls used HTTPS with proper CORS configuration, and I ensured no sensitive data leaked into browser console logs in production."

## 🔬 Security Implementation

```javascript
// RBAC - Role-based UI rendering
function IncidentGrid({ userRole }) {
  return (
    <div>
      <IncidentTable />
      {/* Only admins see bulk operations */}
      {userRole === 'ADMIN' && <BulkActionToolbar />}
      {/* Analysts see only their assigned incidents */}
      {userRole === 'ANALYST' && <MyQueueFilter />}
    </div>
  );
}

// Secure API call — token in header, not URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = tokenService.getToken(); // from memory or httpOnly cookie
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle token expiry globally
api.interceptors.response.use(
  response => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await authService.refreshToken();
        return api.request(error.config); // retry original request
      } catch {
        authService.logout();
      }
    }
    return Promise.reject(error);
  }
);
```

---

# Q12. Hardest bug you solved?

## 🎯 30-Second Interview Answer (Template — adapt to your experience)
"The hardest bug was a race condition in the filter + pagination combination. When a user changed filters rapidly while results were loading, the earlier API response would arrive after the later one — overwriting the correct results with stale data. The UI showed results for the old filter while the filter UI showed the new selection. I fixed it with AbortController to cancel in-flight requests when a new filter change was dispatched, ensuring only the latest request's results were applied."

## 🔬 Root Cause + Fix

```javascript
// THE BUG — race condition
function useFetch(url) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(url).then(r => r.json()).then(setData);
    // If url changes rapidly: request 1 > request 2
    // But request 2 resolves first → setData(result2)
    // Then request 1 resolves → setData(result1) ← STALE DATA WINS!
  }, [url]);
}

// THE FIX — AbortController
function useFetch(url) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(url, { signal: controller.signal })
      .then(r => r.json())
      .then(setData)
      .catch(err => {
        if (err.name !== 'AbortError') {
          setError(err);
        }
      });

    return () => controller.abort(); // cancel on URL change or unmount
  }, [url]);
}
```

---

# 📋 Rapid Revision Summary

```
ARCHITECTURE:
✓ React SPA → Node.js API → DB + eBonding Layer → ServiceNow/BMC
✓ Client = presentation only; API = business logic; eBonding = sync

PERFORMANCE:
✓ 10k+ records → virtual scroll + pagination + memoized rows
✓ Filtering → debounced + server-side + AbortController for race conditions
✓ Measurement → Lighthouse + DevTools Profiler + React Profiler → baseline first

EBONDING:
✓ Bidirectional sync → idempotent updates → externalId deduplication
✓ Conflicts → timestamp precedence (server) + conflict UI state
✓ Race conditions → AbortController + functional state updates

STATE MANAGEMENT:
✓ Local UI → useState | Complex filters → useReducer | Global → Context
✓ Server data → React Query (not Redux) | Stable deps in hooks

SECURITY:
✓ JWT in Authorization header | Role-based UI rendering | No sensitive data in localStorage
✓ Interceptors for token refresh + logout on 401

ERROR HANDLING:
✓ Categorized errors (401/403/500/network) | Error Boundaries | Toast with retry
✓ Loading → Skeleton (not spinner) | Partial failure → show what we have

WHAT I'D IMPROVE:
✓ Polling → WebSocket | Manual state → React Query | Logs → Sentry
✓ Optimistic updates | @tanstack/react-virtual | DataDog RUM
```
