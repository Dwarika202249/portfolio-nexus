# TECHNICAL ARSENAL & SKILL MATRIX
> **NEXUS OS // SKILLS MODULE v2.0**
> *Classification: CAPABILITY INDEX — SEARCHABLE BY RECRUITER QUERIES*
> *Proficiency Scale: LEARNING → FAMILIAR → PROFICIENT → ADVANCED → EXPERT*

---

## SYSTEM_OVERVIEW

This document is the comprehensive technical skills inventory for Dwarika Kumar. Every technology listed here is backed by production usage, project implementation, or deliberate deep-study. This is not a keyword list for ATS systems — it is an honest capability matrix with context on *how* each skill was acquired and *at what depth* it is applicable.

When a recruiter asks: *"What's your experience with X?"* — this file contains the honest, detailed answer.

---

## PROFICIENCY_LEGEND

| Level       | Meaning                                                                 |
|-------------|-------------------------------------------------------------------------|
| **EXPERT**      | Can architect complex systems, debug internals, mentor others           |
| **ADVANCED**    | Production-deployed, handles edge cases, understands internals          |
| **PROFICIENT**  | Comfortable building features, understands patterns and best practices  |
| **FAMILIAR**    | Has used in projects, needs occasional reference for complex cases      |
| **LEARNING**    | Actively studying, has built toy projects or tutorials                  |

---

## SECTION 1: LANGUAGES

### TypeScript
- **Proficiency:** ADVANCED
- **Years of Use:** 2.5+ years
- **Where Used:** DineOS, CodeWeavers, MockMate AI, HCLTech projects
- **Depth:**
  - Advanced generic typing: `<T extends keyof Schema>`, conditional types, mapped types
  - Utility types: `Partial<T>`, `Required<T>`, `Pick<T, K>`, `Omit<T, K>`, `Record<K, V>`, `ReturnType<T>`, `Parameters<T>`
  - Strict null checking, discriminated unions, and exhaustiveness checking with `never`
  - Interface vs Type alias decisions — knows when each is appropriate
  - TypeScript with Redux Toolkit: typed `RootState`, `AppDispatch`, `createSlice` with inferred action types
  - API contract typing: shared DTOs between frontend and backend via TypeScript interfaces
  - Enum patterns vs const objects vs union types — performance and DX tradeoffs
  - Declaration files (`.d.ts`) for untyped third-party libraries
  - TypeScript in Vite, Webpack, and Next.js build configurations
- **Can Answer:** "What is the difference between `interface` and `type` in TypeScript?" / "How do you type async Redux thunks?" / "Explain conditional types."

---

### JavaScript (ES6+)
- **Proficiency:** EXPERT
- **Years of Use:** 3+ years
- **Depth:**
  - **Event Loop Internals:** Call stack, Web APIs, microtask queue (Promises, queueMicrotask), macrotask queue (setTimeout, setInterval). Can predict execution order for complex async code.
  - **V8 Engine:** Hidden classes, inline caching, JIT compilation basics, what causes deoptimization
  - **Closures:** Lexical scope, closure over mutable variables, memory implications, practical uses (module pattern, memoization, currying)
  - **Prototypal Inheritance:** Prototype chain traversal, `Object.create`, `__proto__` vs `prototype`, class syntax as syntactic sugar
  - **Async Patterns:** Callbacks → Promises → async/await → Promise.all/allSettled/race/any, error propagation
  - **Generators & Iterators:** `function*`, `yield`, `[Symbol.iterator]`, lazy evaluation patterns
  - **Proxy & Reflect:** Building reactive systems, validation layers, observable objects
  - **WeakMap / WeakRef:** Memory-safe caching, private class data patterns
  - **Modules:** ESM vs CJS, named vs default exports, dynamic `import()`, tree-shaking implications
  - **Destructuring, Spread, Rest:** Advanced patterns including nested destructuring with renaming and defaults
  - **Regular Expressions:** Character classes, lookaheads, lookbehinds, named capture groups
- **Can Answer:** "Explain the event loop" / "What's the difference between microtask and macrotask queue?" / "How does closure work in a loop?"

---

### Python
- **Proficiency:** PROFICIENT
- **Years of Use:** 1.5+ years
- **Where Used:** Flask backends, AI pipeline scripts, LangChain integrations
- **Depth:**
  - Flask application factory pattern, Blueprint-based modular routing
  - Decorators: understanding function wrapping, `functools.wraps`, class-based decorators
  - Async Python: `asyncio`, `await`, `aiohttp` for concurrent AI API calls
  - Context managers: `with` statement, `__enter__`/`__exit__`, custom context managers
  - List comprehensions, generator expressions, `map`/`filter`/`zip` functional patterns
  - Data classes and `dataclasses` module for structured data
  - `pydantic` for request/response validation in FastAPI-style architectures
  - Environment management: `venv`, `requirements.txt`, `pip`
  - LangChain: document loaders, text splitters (RecursiveCharacterTextSplitter), embedding models, vector store integration
  - OpenAI Python SDK: streaming responses, function calling, system/user/assistant message construction
  - Groq Python SDK: ultra-low latency inference calls
- **Can Answer:** "How do you build a RAG pipeline in Python?" / "Explain Flask's application context"

---

### HTML5
- **Proficiency:** ADVANCED
- **Years of Use:** 3+ years
- **Depth:**
  - Semantic HTML: `<article>`, `<section>`, `<nav>`, `<main>`, `<aside>`, `<figure>` — proper landmark usage for accessibility
  - ARIA attributes: `role`, `aria-label`, `aria-describedby`, `aria-expanded`, `aria-hidden` for screen reader support
  - Web APIs via HTML: `<canvas>`, `<video>`, `<audio>`, `<dialog>`, `<details>/<summary>`
  - Form validation: `required`, `pattern`, `min`/`max`, `novalidate`, custom validation with Constraint Validation API
  - Meta tags: Open Graph, Twitter Card, viewport, charset, `preload`/`prefetch` for performance
  - Custom Data Attributes: `data-*` for storing state in DOM without JavaScript globals
  - Iframe sandboxing: `sandbox` attribute, content security policies
  - `contenteditable`, `draggable` for rich editor interactions
- **Can Answer:** "What are semantic HTML elements and why do they matter?" / "How do ARIA attributes work?"

---

### CSS3 / Advanced CSS
- **Proficiency:** ADVANCED
- **Years of Use:** 3+ years
- **Depth:**
  - **Flexbox:** All flex properties, common layout patterns (holy grail, sticky footer, responsive cards)
  - **CSS Grid:** Named grid areas, `auto-fill` vs `auto-fit`, `minmax()`, subgrid concepts
  - **CSS Variables (Custom Properties):** Theming systems, dynamic values, fallback chains
  - **CSS Animations:** `@keyframes`, `animation` shorthand, `transition` timing functions, `will-change` for GPU compositing
  - **Pseudo-classes & Pseudo-elements:** `:nth-child()`, `:not()`, `:has()` (modern), `::before`/`::after`, `::selection`
  - **CSS Specificity:** Calculating specificity scores, avoiding `!important`, cascade management
  - **Responsive Design:** Mobile-first approach, `clamp()` for fluid typography, container queries (modern CSS)
  - **CSS Modules:** Scoped styles, composes, local vs global scope
  - **CSS-in-JS Context:** Understanding tradeoffs vs utility-first (Tailwind) vs CSS Modules
  - **Dark Mode:** `prefers-color-scheme`, CSS variable switching, class-based theming
  - **Performance:** CSS containment, `content-visibility`, avoiding layout thrashing (reading then writing DOM)
- **Can Answer:** "Explain the CSS cascade" / "How does CSS specificity work?" / "When would you use CSS Grid vs Flexbox?"

---

## SECTION 2: FRONTEND FRAMEWORKS & LIBRARIES

### React.js
- **Proficiency:** ADVANCED
- **Years of Use:** 3+ years
- **Where Used:** All projects — HCLTech, DineOS, MockMate AI, CodeWeavers
- **Depth:**

  **Core Concepts:**
  - JSX compilation to `React.createElement`, Virtual DOM diffing algorithm (reconciliation)
  - Component lifecycle: mounting, updating, unmounting phases and their Hook equivalents
  - Controlled vs Uncontrolled components — when each is appropriate
  - Component composition patterns: Compound Components, Render Props, Higher-Order Components (HOC)
  - Forward Refs: `React.forwardRef`, imperative handle exposure with `useImperativeHandle`
  - Error Boundaries: class-based `getDerivedStateFromError`, `componentDidCatch`, wrapping strategy

  **React Hooks Mastery:**
  - `useState`: functional updates, lazy initialization, batching (React 18 automatic batching)
  - `useEffect`: dependency array semantics, cleanup functions, race condition prevention with flags/AbortController
  - `useReducer`: complex state machines, action dispatching patterns, vs useState decision framework
  - `useMemo`: expensive computation memoization, referential equality, when NOT to memoize (overhead analysis)
  - `useCallback`: function memoization for child component optimization, dependency management
  - `useRef`: mutable values without re-render, DOM references, previous value patterns, interval/timeout storage
  - `useContext`: provider/consumer pattern, performance implications (context split strategies)
  - `useId`: stable unique IDs for accessibility without SSR hydration mismatch
  - `useTransition`: marking state updates as non-urgent for concurrent mode
  - `useDeferredValue`: deferring expensive computations during concurrent rendering
  - Custom Hooks: extraction strategies, naming conventions, composability patterns

  **React Fiber Architecture:**
  - Fiber reconciliation vs Stack reconciliation
  - Concurrent Mode and time-slicing
  - Work loop, fiber nodes, alternate trees (current vs work-in-progress)
  - Priority scheduling (lanes model in React 18)
  - `startTransition` API for deferring non-critical updates

  **Performance Patterns:**
  - `React.memo` with custom equality functions (when default shallow equality is insufficient)
  - Key prop strategies for list optimization
  - Virtual scrolling with `react-window` or `@tanstack/virtual`
  - Code splitting: `React.lazy`, `Suspense`, dynamic imports with Webpack magic comments
  - Bundle analysis with `webpack-bundle-analyzer`, `rollup-plugin-visualizer`
  - Avoiding prop drilling without overusing Context (component composition patterns)
  - Batched state updates and their implications in React 17 vs React 18

  **React 18 Specific:**
  - `createRoot` API vs legacy `render`
  - Automatic batching in async functions and event handlers
  - Concurrent features: `useTransition`, `useDeferredValue`, Suspense for data fetching
  - Strict Mode double-rendering implications

- **Can Answer:** Any React interview question from beginner to senior level.

---

### Next.js
- **Proficiency:** PROFICIENT (actively deepening)
- **Where Used:** Portfolio projects, ongoing SaaS development
- **Depth:**
  - **App Router vs Pages Router:** File-based routing, nested layouts, route groups
  - **Server Components vs Client Components:** When to use each, "use client" boundary implications, data fetching patterns
  - **Rendering Strategies:** SSR (Server-Side Rendering), SSG (Static Site Generation), ISR (Incremental Static Regeneration), CSR comparison
  - **Data Fetching:** `fetch` with cache options in Server Components, `revalidate`, `no-store` vs `force-cache`
  - **Server Actions:** Form handling without API routes, progressive enhancement
  - **Middleware:** `middleware.ts`, matcher configuration, auth guards, rate limiting
  - **Image Optimization:** `next/image` component, layout strategies, `priority` prop for LCP images
  - **Font Optimization:** `next/font` with Google Fonts, `display: swap`
  - **API Routes:** `route.ts` handlers, HTTP method exports, streaming responses
  - **Metadata API:** Dynamic OG images, SEO optimization
  - **Deployment:** Vercel deployment, environment variables, build output analysis

---

### Redux Toolkit
- **Proficiency:** ADVANCED
- **Years of Use:** 2+ years
- **Where Used:** DineOS (complex multi-slice), HCLTech (global state management)
- **Depth:**
  - `configureStore`: middleware setup, DevTools integration, serialization checks
  - `createSlice`: action creator generation, case reducers, `extraReducers` pattern
  - `createAsyncThunk`: loading/error state patterns, `pending`/`fulfilled`/`rejected` lifecycle actions
  - `createEntityAdapter`: normalized state management for collections (byId + allIds pattern)
  - RTK Query: `createApi`, endpoint definitions, cache invalidation tags, auto-fetching, optimistic updates
  - **Complex Multi-Slice Architecture (DineOS):**
    - `authSlice`: user session, token management, role-based flags
    - `cartSlice`: item management, quantity updates, discount application, total calculation
    - `orderSlice`: order lifecycle state, socket event integration, status transitions
    - `restaurantSlice`: tenant-specific configuration, menu data, table management
    - Cross-slice selectors with `createSelector` (Reselect memoization)
  - Socket-Redux integration: dispatching Redux actions from Socket.io event handlers
  - Immer integration: understanding draft state mutations within reducers
  - DevTools: time-travel debugging, action replay, state diff inspection

---

### React Query (TanStack Query)
- **Proficiency:** PROFICIENT
- **Where Used:** CodeWeavers LMS, HCLTech dashboard
- **Depth:**
  - `useQuery`: query keys, fetcher functions, stale time, cache time configuration
  - `useMutation`: optimistic updates, onSuccess/onError callbacks, cache invalidation
  - `useInfiniteQuery`: cursor/page-based infinite scroll implementation
  - Query invalidation strategies: `queryClient.invalidateQueries`, `refetchOnWindowFocus`
  - Background refetching and stale-while-revalidate pattern
  - `QueryClient` provider setup, default options configuration
  - Devtools integration for query state inspection
  - Comparison with SWR and when to choose each

---

### Tailwind CSS
- **Proficiency:** ADVANCED
- **Years of Use:** 2+ years
- **Where Used:** DineOS, MockMate AI, CodeWeavers, portfolio projects
- **Depth:**
  - Utility-first philosophy vs component-based CSS — tradeoffs and when Tailwind wins
  - Responsive design with breakpoint prefixes: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
  - Dark mode: `dark:` variant, class-based vs `prefers-color-scheme`
  - Custom theme configuration: `tailwind.config.js` — custom colors, spacing, fonts, breakpoints
  - `@apply` directive for component extraction — when appropriate vs when it defeats the purpose
  - Arbitrary values: `[value]` syntax for one-off customizations
  - JIT (Just-In-Time) mode and its implications for dynamic class generation
  - State variants: `hover:`, `focus:`, `active:`, `group-hover:`, `peer-hover:`
  - Animation utilities and `transition` classes
  - `clsx` / `cn` utility for conditional class application (Tailwind + shadcn pattern)
  - PurgeCSS integration: ensuring only used classes are in production bundle

---

### Shadcn/UI
- **Proficiency:** PROFICIENT
- **Where Used:** Recent SaaS projects, portfolio
- **Depth:**
  - Component installation and customization philosophy (copy, don't install)
  - Radix UI primitives underlying shadcn components
  - `cn()` utility pattern for merging Tailwind classes
  - Theme customization via CSS variables
  - Building composite components from shadcn primitives
  - Form integration with React Hook Form + Zod

---

### Framer Motion
- **Proficiency:** FAMILIAR
- **Depth:**
  - `motion.div` and basic animation props (`initial`, `animate`, `exit`, `transition`)
  - `AnimatePresence` for exit animations
  - Layout animations with `layout` prop
  - Variants for orchestrating multi-element animations
  - `useAnimation` hook for imperative control
  - Gesture animations: `whileHover`, `whileTap`, `whileDrag`

---

### Socket.io (Client)
- **Proficiency:** ADVANCED
- **Where Used:** DineOS (core real-time engine)
- **Depth:**
  - Client-side `io()` connection setup with auth tokens
  - Event listener lifecycle management in React (connect/disconnect on mount/unmount)
  - Namespace and room subscription handling
  - Reconnection strategies and connection state management
  - Acknowledgment callbacks for guaranteed message delivery
  - Integration with Redux — dispatching actions from socket event handlers
  - Error handling: connection errors, timeout, network interruption recovery
  - Binary data transmission for file/image sharing scenarios

---

## SECTION 3: BACKEND TECHNOLOGIES

### Node.js
- **Proficiency:** ADVANCED
- **Years of Use:** 2+ years
- **Where Used:** DineOS backend, CodeWeavers API, MockMate AI server
- **Depth:**
  - **Event Loop in Node.js:** libuv thread pool, phases (timers, pending callbacks, I/O, poll, check, close), `process.nextTick` vs `setImmediate`
  - **Streams:** Readable, Writable, Transform, Duplex streams. Piping, backpressure management, stream events
  - **Worker Threads:** CPU-intensive task offloading, `workerData`, `parentPort` messaging
  - **Cluster Module:** Multi-core utilization, master/worker architecture, sticky sessions
  - **EventEmitter:** Custom event systems, memory leak prevention (max listener warnings), once vs on
  - **Buffer and Binary Data:** Encoding/decoding, binary protocol handling
  - **fs Module:** Async file operations, streams for large files, `fs.watch` for file system events
  - **path Module:** Cross-platform path manipulation, `__dirname` vs `import.meta.url` in ESM
  - **Environment Management:** `process.env`, `dotenv`, environment-specific configuration
  - **Error Handling:** Uncaught exception handlers, unhandled promise rejection tracking, domain-based error isolation

---

### Express.js
- **Proficiency:** ADVANCED
- **Years of Use:** 2+ years
- **Depth:**
  - Application factory pattern vs singleton pattern
  - Middleware pipeline architecture: order matters, `next()` call semantics
  - Error-handling middleware: 4-argument signature `(err, req, res, next)`
  - Router-level middleware: `express.Router()`, modular route organization
  - Request/Response lifecycle: parsing body (`express.json()`, `express.urlencoded()`), setting headers, status codes
  - **Authentication Middleware:**
    - JWT verification with `jsonwebtoken`
    - Role-based access control middleware (`requireRole('admin')`)
    - API key authentication for service-to-service calls
  - **Rate Limiting:** `express-rate-limit`, per-route and global limiting
  - **CORS:** `cors` middleware configuration for multi-origin support
  - **Helmet:** Security headers (X-Frame-Options, Content-Security-Policy, HSTS)
  - **Compression:** `compression` middleware for gzip/brotli response compression
  - **File Upload:** `multer` middleware for multipart form data, S3 upload integration
  - RESTful API design: resource naming, HTTP verb semantics, status code selection
  - API versioning strategies: URL versioning (`/v1/`), header versioning

---

### Flask (Python)
- **Proficiency:** PROFICIENT
- **Where Used:** AI pipeline APIs, LLM integration backends, prototype APIs
- **Depth:**
  - Application factory pattern with `create_app()`
  - Blueprints for modular route organization
  - Flask-CORS for cross-origin request handling
  - Request context: `request`, `g`, `session` globals
  - Before/after request hooks: `@app.before_request`, `@app.after_request`
  - Error handlers: `@app.errorhandler(404)`, `@app.errorhandler(Exception)`
  - Streaming responses: `Response(stream_with_context(...))` for SSE
  - Flask with Gunicorn for production deployment
  - Environment-based configuration classes (`DevelopmentConfig`, `ProductionConfig`)
  - Integration with SQLAlchemy for ORM, direct MongoDB with PyMongo

---

### REST API Design
- **Proficiency:** ADVANCED
- **Depth:**
  - Resource-based URL design (`/api/v1/restaurants/{id}/orders`)
  - HTTP methods semantic correctness: GET (idempotent, cacheable), POST (create), PUT (full update), PATCH (partial update), DELETE
  - Status codes: 200, 201, 204, 400, 401, 403, 404, 409, 422, 429, 500, 503
  - Request/Response body design: consistent envelope pattern `{ data, error, meta }`
  - Pagination: cursor-based vs offset-based, `next_cursor`, `total_count`
  - Filtering, sorting, field selection via query params
  - HATEOAS concepts and when to apply hypermedia links
  - API versioning: URL path versioning vs Accept header versioning
  - Rate limiting headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `Retry-After`
  - OpenAPI/Swagger documentation generation
  - Error response standardization: `{ error: { code, message, details } }`

---

### Microservices Architecture
- **Proficiency:** FAMILIAR → PROFICIENT
- **Where Used:** HCLTech ITSM platform (consuming microservices), DineOS (service decomposition planning)
- **Depth:**
  - Service decomposition by bounded context (Domain-Driven Design principles)
  - Inter-service communication: synchronous (REST/gRPC) vs asynchronous (message queues)
  - API Gateway pattern: single entry point, routing, auth, rate limiting
  - Service discovery basics (Consul, Kubernetes service mesh concepts)
  - Data isolation per service: each service owns its database
  - Circuit breaker pattern: preventing cascade failures
  - Event-driven microservices: publish/subscribe via message brokers
  - Docker Compose for local multi-service development

---

## SECTION 4: AI & GENERATIVE AI ENGINEERING

### LLM Integration (Groq API / OpenAI API)
- **Proficiency:** ADVANCED
- **Where Used:** DineOS (AI Concierge), MockMate AI (interview evaluation), portfolio projects
- **Depth:**
  - **Groq API:** Ultra-low latency inference with LLaMA/Mixtral models. Groq-specific rate limits and token optimization
  - **OpenAI API:** GPT-4o, GPT-4o-mini integration. Function calling / tool use. Structured output mode.
  - **Message Construction:** System prompt engineering, multi-turn conversation management, token counting
  - **Streaming Responses:** Server-Sent Events (SSE) for progressive rendering. `stream: true`, reading `ReadableStream`, chunk parsing
  - **Prompt Engineering:**
    - Role prompting (system/user/assistant distinction)
    - Chain-of-thought prompting for complex reasoning
    - Few-shot examples in system prompts
    - Output format enforcement: JSON mode, XML templates
    - Negative constraints: "Do not mention X", "Only discuss Y"
    - Handling multi-language queries
  - **Token Management:** Counting tokens with `tiktoken`, context window limits, truncation strategies
  - **Temperature and Parameters:** `temperature`, `top_p`, `max_tokens`, `frequency_penalty`, `presence_penalty`
  - **Error Handling:** Rate limit (429), context length exceeded (400), model unavailable (503), retry with exponential backoff

---

### RAG (Retrieval-Augmented Generation)
- **Proficiency:** ADVANCED
- **Where Used:** MockMate AI (core architecture), DineOS (menu knowledge base)
- **Depth:**
  - **Document Loading:** PDF loaders, web scrapers, text file processors via LangChain document loaders
  - **Text Chunking:**
    - `RecursiveCharacterTextSplitter` — chunk size, overlap configuration
    - Semantic chunking vs fixed-size chunking
    - Metadata preservation during chunking (source, page number, section)
  - **Embeddings:**
    - OpenAI `text-embedding-ada-002`, `text-embedding-3-small`
    - Sentence transformers (local embedding models)
    - Embedding dimensions, normalization
  - **Vector Stores:**
    - Pinecone: index creation, upsert, similarity search, metadata filtering
    - ChromaDB: local development vector store
    - Upstash Vector: serverless vector database for production
    - FAISS: local similarity search for development
  - **Retrieval Strategies:**
    - Similarity search with score threshold
    - MMR (Maximum Marginal Relevance) for diversity in retrieved chunks
    - Hybrid search: dense (vector) + sparse (BM25) retrieval
  - **Context Injection:** Building the final prompt with retrieved context, source attribution
  - **Re-ranking:** Cross-encoder re-ranking for improved retrieval precision
  - **Evaluation:** Context precision, context recall, answer relevancy metrics

---

### LangChain
- **Proficiency:** PROFICIENT
- **Depth:**
  - Document loaders: `PyPDFLoader`, `TextLoader`, `WebBaseLoader`
  - Text splitters: `RecursiveCharacterTextSplitter`, `CharacterTextSplitter`
  - Embeddings: `OpenAIEmbeddings`, `HuggingFaceEmbeddings`
  - Vector stores: `Chroma`, `FAISS`, `Pinecone` integration
  - Chains: `LLMChain`, `RetrievalQA`, `ConversationalRetrievalChain`
  - Memory: `ConversationBufferMemory`, `ConversationSummaryMemory`
  - Agents: `initialize_agent`, tool definitions, ReAct framework
  - Streaming with LangChain callbacks

---

### Whisper API (Voice-to-Text)
- **Proficiency:** PROFICIENT
- **Where Used:** MockMate AI (interview voice processing)
- **Depth:**
  - OpenAI Whisper API integration for transcription
  - Audio format handling: WAV, MP3, WEBM, M4A
  - Language detection and multi-language support
  - Browser MediaRecorder API for audio capture
  - Audio blob handling, FormData submission to transcription endpoint
  - Noise filtering considerations, transcript normalization
  - Chunked audio processing for long recordings

---

## SECTION 5: DATABASES

### MongoDB
- **Proficiency:** ADVANCED
- **Years of Use:** 2+ years
- **Where Used:** DineOS (multi-tenant schema), CodeWeavers (hierarchical course data), MockMate AI
- **Depth:**
  - **Schema Design:**
    - Embedding vs Referencing decision framework
    - One-to-many: embed small arrays, reference large collections
    - Many-to-many: reference with projection
    - Multi-tenant schema design: `tenantId` field on all documents, middleware enforcement
  - **Mongoose ORM:**
    - Schema definition with validation rules
    - Virtual fields, custom getters/setters
    - Pre/post middleware hooks: `save`, `findOneAndUpdate`, `deleteOne`
    - Population (populate) for references, nested population
    - Custom instance and static methods
    - Discriminators for polymorphic schemas
  - **Aggregation Pipeline:**
    - `$match`, `$group`, `$project`, `$sort`, `$limit`, `$skip`
    - `$lookup` for joins across collections
    - `$unwind` for array deconstruction
    - `$addFields`, `$set`, `$replaceRoot`
    - Aggregation for analytics dashboards (revenue, enrollment counts)
  - **Indexing:**
    - Single field, compound, text, and geospatial indexes
    - Index selectivity and query planning (`explain()`)
    - Partial indexes for sparse data
    - TTL indexes for automatic document expiration (sessions, tokens)
  - **Transactions:** ACID transactions for multi-document operations
  - **Atlas Search:** Full-text search with scoring and fuzzy matching

---

### PostgreSQL / MySQL
- **Proficiency:** FAMILIAR → PROFICIENT
- **Depth:**
  - DDL: `CREATE TABLE`, `ALTER TABLE`, constraints (PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK, NOT NULL)
  - DML: `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `UPSERT` (`INSERT ... ON CONFLICT`)
  - **Joins:** INNER JOIN, LEFT/RIGHT OUTER JOIN, FULL OUTER JOIN, CROSS JOIN, self-join
  - **Window Functions:** `ROW_NUMBER()`, `RANK()`, `DENSE_RANK()`, `LAG()`, `LEAD()`, `SUM() OVER (PARTITION BY...)`
  - Subqueries, CTEs (Common Table Expressions with `WITH`)
  - Indexing: B-Tree, Hash, GIN (for JSONB), index coverage
  - Transactions: `BEGIN`, `COMMIT`, `ROLLBACK`, isolation levels
  - `EXPLAIN ANALYZE` for query performance analysis
  - JSONB column type for semi-structured data
  - Stored procedures and triggers basics

---

### Redis
- **Proficiency:** PROFICIENT
- **Where Used:** DineOS (session management, Socket.io adapter), planned for horizontal scaling
- **Depth:**
  - Data structures: Strings, Lists, Sets, Sorted Sets, Hashes, Streams
  - Caching patterns: Cache-aside, Write-through, Write-behind, Read-through
  - TTL-based expiration: `SET key value EX seconds`
  - Pub/Sub for real-time messaging between services
  - Redis as Socket.io adapter for horizontal WebSocket scaling (`socket.io-redis`)
  - Distributed locking with Redlock algorithm
  - Redis Streams for event sourcing and message queues
  - Connection management with `ioredis` Node.js client
  - Persistence: RDB snapshots vs AOF (Append Only File)

---

## SECTION 6: CLOUD & DEVOPS

### Microsoft Azure
- **Proficiency:** FAMILIAR → PROFICIENT
- **Years of Use:** ~3 years (used at HCLTech)
- **Services Used:**
  - Azure DevOps: Boards (Agile/Scrum), Repos (Git), Pipelines (CI/CD)
  - Azure App Service: web app deployment, scaling configurations
  - Azure Blob Storage: file storage, CDN integration
  - Azure Active Directory: identity management, OAuth integration
  - Azure Monitor: application insights, logging, alerting

---

### Docker
- **Proficiency:** PROFICIENT
- **Depth:**
  - `Dockerfile` authoring: multi-stage builds for production optimization
  - Base image selection: `node:alpine` vs `node:slim` vs full images
  - Layer caching optimization: dependency install before code copy
  - `docker-compose.yml`: multi-service orchestration (Node.js + MongoDB + Redis)
  - Volume mounting for development hot-reload
  - Environment variable injection: `.env` files, `--env-file` flag
  - Networking: bridge networks, service discovery by container name
  - Health checks for container orchestration
  - Image tagging and Docker Hub push/pull
  - `.dockerignore` for build context optimization

---

### CI/CD (GitHub Actions)
- **Proficiency:** PROFICIENT
- **Depth:**
  - Workflow YAML syntax: `on`, `jobs`, `steps`, `uses`, `run`
  - Trigger events: `push`, `pull_request`, `workflow_dispatch`, `schedule`
  - Environment-specific workflows (dev, staging, production)
  - Secrets management: `${{ secrets.SECRET_NAME }}`
  - Matrix builds for multi-version testing
  - Caching: `actions/cache` for node_modules, pip packages
  - Deployment workflows: Vercel, Render, Docker Hub push
  - Status checks: branch protection with required passing workflows

---

### Vercel / Render
- **Proficiency:** PROFICIENT
- **Depth:**
  - Vercel: Next.js zero-config deployment, environment variables, preview deployments, custom domains
  - Render: Node.js/Flask service deployment, automatic deploys from GitHub, environment groups

---

## SECTION 7: DEVELOPER TOOLS & WORKFLOW

### Git & GitHub
- **Proficiency:** ADVANCED
- **Depth:**
  - Branching strategies: Gitflow, trunk-based development, feature flags
  - Interactive rebase: `git rebase -i`, squashing, editing, reordering commits
  - Cherry-pick for selective commit application
  - `git bisect` for binary search debugging
  - Stashing: `git stash push -m "name"`, `git stash pop`, partial stash
  - Resolving merge conflicts: 3-way merge, `ours`/`theirs` strategies
  - Reflog for recovering lost commits
  - Conventional Commits: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`
  - PR workflow: draft PRs, reviewers, labels, linked issues
  - GitHub Actions integration

---

### Vite / Webpack
- **Proficiency:** PROFICIENT
- **Depth:**
  - **Vite:** `vite.config.ts`, plugin system (React plugin, path aliases), dev server proxy, build optimization
  - **Webpack:** Entry, output, loaders (babel-loader, css-loader, style-loader), plugins (HtmlWebpackPlugin, MiniCssExtractPlugin), code splitting, tree shaking, bundle analysis

---

### Postman / API Testing
- **Proficiency:** ADVANCED
- **Depth:**
  - Collection organization, environment variables
  - Pre-request scripts for dynamic auth token injection
  - Test scripts for automated response validation
  - Mock server creation for frontend development
  - Collection runner for regression testing

---

### Browser DevTools
- **Proficiency:** ADVANCED
- **Depth:**
  - **Performance Tab:** Flame charts, long tasks identification, main thread blocking analysis
  - **Network Tab:** Request waterfall, response caching, WebSocket frame inspection
  - **React DevTools:** Component tree inspection, profiler, render count analysis
  - **Redux DevTools:** State timeline, action inspection, time-travel debugging
  - **Memory Tab:** Heap snapshots, memory leak detection, retained object analysis
  - **Sources Tab:** Breakpoints, conditional breakpoints, logpoints, call stack inspection
  - **Application Tab:** LocalStorage, SessionStorage, IndexedDB, Service Workers, PWA manifest

---

## SECTION 8: SKILLS_UNDER_ACTIVE_DEVELOPMENT

| Skill                        | Current Level  | Target Level | Notes                                    |
|------------------------------|----------------|--------------|------------------------------------------|
| Next.js (App Router)         | PROFICIENT     | ADVANCED     | Building projects with Server Components |
| Redis Pub/Sub Scaling        | FAMILIAR       | PROFICIENT   | DineOS horizontal scaling roadmap        |
| PostgreSQL                   | FAMILIAR       | PROFICIENT   | Adding to full-stack repertoire          |
| Kubernetes                   | LEARNING       | FAMILIAR     | Container orchestration basics           |
| Testing (Vitest/RTL)         | FAMILIAR       | PROFICIENT   | Adding test coverage to projects         |
| GraphQL                      | LEARNING       | FAMILIAR     | Exploring for complex data queries       |
| FastAPI (Python)             | LEARNING       | PROFICIENT   | Replacing Flask for typed Python APIs    |
| AWS (EC2/S3/Lambda)          | LEARNING       | FAMILIAR     | Expanding beyond Azure                   |

---

## SECTION 9: TOOLS_ECOSYSTEM

| Category            | Tools                                                                  |
|---------------------|------------------------------------------------------------------------|
| **IDE**             | VS Code (primary), with extensions: ES7+ React Snippets, Prettier, ESLint, GitLens |
| **API Testing**     | Postman, Thunder Client, Insomnia                                      |
| **Database GUI**    | MongoDB Compass, TablePlus, Redis Insight                              |
| **Design**          | Figma (reading designs, extracting specs, basic wireframing)           |
| **Documentation**   | Notion, Markdown                                                       |
| **Communication**   | Slack, Discord, Loom (async video)                                     |
| **Project Mgmt**    | GitHub Projects, Trello, Linear                                        |
| **Terminal**        | Zsh + Oh My Zsh, bash scripting basics                                |
| **Diagramming**     | draw.io, Excalidraw, Mermaid (in Markdown)                             |

---

*END OF MODULE: 02_TECHNICAL_ARSENAL*
*Next Module: 03_PROJECT_WAR_STORIES.md*
