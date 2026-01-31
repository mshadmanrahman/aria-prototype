# Keystone Education Group – Technology Master Context Document

**Purpose:** Self-contained reference for all things technology at Keystone Education Group. Synthesizes Confluence documentation, platform architecture, and operational knowledge into one comprehensive resource.

**Last Updated:** January 2026

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Organizational Structure & Teams](#2-organizational-structure--teams)
3. [Platform Landscape](#3-platform-landscape)
4. [Technical Architecture](#4-technical-architecture)
5. [Core Technology Stacks](#5-core-technology-stacks)
6. [Developer Setup & Workflows](#6-developer-setup--workflows)
7. [GCP Functions & Services](#7-gcp-functions--services)
8. [Integration Flows](#8-integration-flows)
9. [Infrastructure & DevOps](#9-infrastructure--devops)
10. [Security, Privacy & Compliance](#10-security-privacy--compliance)
11. [Quality & Testing](#11-quality--testing)
12. [Data Platform & Analytics](#12-data-platform--analytics)
13. [AI & Machine Learning](#13-ai--machine-learning)
14. [Confluence Space Index](#14-confluence-space-index)
15. [Key URLs & Resources](#15-key-urls--resources)

---

## 1. Executive Summary

Keystone Education Group (KEG) operates a global education marketplace connecting students with educational institutions across 60+ markets. The technology organization supports multiple platforms serving different market segments:

**Key Numbers:**
- 134M+ annual users
- 60+ country markets
- 47 languages supported
- Multiple tech teams across Sweden, UK, and contractors

**Technology Vision:**
- Consolidate legacy platforms into unified KEG platform
- Move from Smarthub legacy backend to Sanity-based CMS
- Standardize on React/Next.js frontend, Elasticsearch search, AWS/GCP cloud
- Enable AI-powered student discovery and engagement

---

## 2. Organizational Structure & Teams

### 2.1 Engineering Teams

**Team "InSanity" (International/KAS)**
- ~7 developers based in Sweden and UK
- SpinnerLabs contractor support
- Owns: Search, Discovery, Monetization, Sponsored Listings
- Stack: React, Next.js, Sanity, Elasticsearch, Vercel

**Team "CoreX" (Domestic/EMG)**
- ~8 developers based in Stockholm
- Owns: educations.com and domestic platform
- Stack: ASP.NET MVC, .NET Core, C#, MSSQL, AWS

**FAU Team (First Advantage Unit)**
- ~7 developers based in Sheffield, UK
- Rackspace hosting
- Stack: VB, C#, ASP.NET

**Other Teams/Platforms:**
- Keystone Sports: WordPress sites, mobile apps, CRM tools
- Keystone Apply: ASP.NET MVC, C#, MSSQL
- Blueberry/Sonor: WordPress sites for academic agents
- Studddy: Typo3 CMS with PHP, AWS hosting
- UniQuest: Salesforce-based

### 2.2 Key Confluence Spaces by Team

| Space | Code | Focus |
|-------|------|-------|
| Keystone Technical Documentation | KTD | Group-wide standards & strategies |
| Technology Leadership Forum | TE | Tech decisions & investigations |
| Educations.com Tech | TI | Domestic web platform |
| Group Platform Re-engineering | KR | Unified KEG/KAS platform |
| Domestic Re-engineering (Delfi) | DR | EMG platform modernization |
| Engineering Data Products | EDP | Data products & analytics |
| AI Engineering Portal | AEP | AI/ML shared resources |
| Generative & Agentic AI | EGAA | Aria & AI capabilities |
| Design Team | DT | Design system & brand |

---

## 3. Platform Landscape

### 3.1 KAS/KEG Platform (International)

The international platform serves global markets through vertical-specific portals:

**Verticals:**
- masterstudies.com
- bachelorstudies.com
- lawstudies.com
- healthcarestudies.com
- onlinestudies.com
- coursesadvisor.com
- And 50+ more vertical sites

**Architecture:**
- Frontend: Next.js v12/v13 with React, TypeScript, Tailwind CSS
- CMS: Sanity.io (synced from Smarthub, not source of truth)
- Search: Elasticsearch via Elastic.co
- Hosting: Vercel
- Backend: Smarthub (PHP/Laravel/MySQL)

### 3.2 EMG Platform (Domestic)

The domestic platform serves primarily Nordic markets:

**Sites:**
- educations.com
- educations.se
- Related domestic portals

**Architecture:**
- Frontend: ASP.NET MVC, React components
- Backend: .NET Core, C#
- Database: MSSQL, DynamoDB, Redis, Elasticsearch
- Hosting: AWS

### 3.3 Platform Consolidation Roadmap

**Current State:**
- Multiple legacy platforms with different tech stacks
- Smarthub as source of truth for content
- Sanity as frontend CMS (sync from Smarthub)

**Target State:**
- Unified KEG platform
- Sanity as source of truth (Smarthub 2.0)
- Shared component library
- Consolidated search infrastructure

---

## 4. Technical Architecture

### 4.1 KAS Web Application Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Next.js v12/v13 Application                │   │
│  │    • TypeScript    • Tailwind CSS    • React            │   │
│  │    • Conventional Commits   • Release Please            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                         Vercel Edge                             │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                           APIS                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Web API    │  │ Lead Form API│  │   Elasticsearch      │  │
│  │  (GCP/AWS)   │  │              │  │   (Elastic.co)       │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │    Sanity    │  │   Smarthub   │  │      BigQuery        │  │
│  │     CMS      │  │   (Legacy)   │  │    (Analytics)       │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Integration Architecture

```
┌─────────────┐                    ┌─────────────────┐
│  Smarthub   │───────────────────▶│  GCP Pub/Sub    │
│  (Source)   │   Content Change   │                 │
└─────────────┘                    └────────┬────────┘
                                            │
                                            ▼
                            ┌───────────────────────────────┐
                            │ smarthub-integration-functions│
                            │        (GCP Cloud Run)        │
                            └───────────────┬───────────────┘
                                            │
                                            ▼
                            ┌───────────────────────────────┐
                            │          Sanity CMS           │
                            └───────────────┬───────────────┘
                                            │
                              ┌─────────────┴─────────────┐
                              │       Sanity Webhooks     │
                              └─────────────┬─────────────┘
                                            │
            ┌───────────────────────────────┼───────────────────────────────┐
            │                               │                               │
            ▼                               ▼                               ▼
┌───────────────────────┐    ┌───────────────────────┐    ┌───────────────────────┐
│ keg-revalidate-funcs  │    │ keystone-search-funcs │    │ keg-firestore-funcs   │
│    (Vercel API)       │    │    (GCP Cloud Run)    │    │    (GCP Cloud Run)    │
└───────────┬───────────┘    └───────────┬───────────┘    └───────────┬───────────┘
            │                            │                            │
            ▼                            ▼                            ▼
┌───────────────────────┐    ┌───────────────────────┐    ┌───────────────────────┐
│   Next.js Web App     │    │     Elasticsearch     │    │      Firestore        │
│   (Page Revalidate)   │    │   (Search Index)      │    │    (SSGTM Data)       │
└───────────────────────┘    └───────────────────────┘    └───────────────────────┘
```

### 4.3 Sanity Webhooks (6 Active)

| Webhook | Trigger Document Type | Target Service |
|---------|----------------------|----------------|
| Program Update | program | keg-revalidate-functions |
| Institution Update | institution | keg-revalidate-functions |
| Search Update | program, institution | keystone-search-functions |
| Firestore Sync | program | keg-firestore-integration-functions |
| Content Sync | article, page | keg-revalidate-functions |
| Translation | translatable documents | translation service |

---

## 5. Core Technology Stacks

### 5.1 KAS/KEG Frontend Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Framework | Next.js | v12/v13 |
| Language | TypeScript | Latest |
| Styling | Tailwind CSS | v3.x |
| CMS | Sanity | v3 |
| Search | Elasticsearch | 8.x |
| Hosting | Vercel | Edge |
| State | React Context/Hooks | - |

### 5.2 Backend & Infrastructure

| Component | Technology | Provider |
|-----------|------------|----------|
| Cloud (Primary) | AWS | Amazon |
| Cloud (Functions) | GCP | Google |
| Database (Legacy) | MySQL | Smarthub |
| Database (EMG) | MSSQL | AWS RDS |
| Cache | Redis | AWS ElastiCache |
| CDN | CloudFront | AWS |
| Monitoring | Grafana, Datadog | Mixed |
| Secrets | Doppler | - |

### 5.3 Development Tools

| Tool | Purpose |
|------|---------|
| GitHub | Source control (keystoneas org) |
| Jira | Project management |
| Confluence | Documentation |
| Figma | Design |
| Doppler | Secrets management |
| Vercel CLI | Deployment |
| GitHub Actions | CI/CD |
| SonarQube | Static analysis |

---

## 6. Developer Setup & Workflows

### 6.1 Web Project Setup

**Prerequisites:**
- Node.js (LTS version)
- npm or yarn
- Git access to keystoneas organization
- Doppler CLI installed

**Repository:**
```
https://github.com/keystoneas/keystone-study-program-sites
```

**Setup Steps:**

1. Clone the repository:
```bash
git clone https://github.com/keystoneas/keystone-study-program-sites.git
cd keystone-study-program-sites
```

2. Install Doppler CLI and authenticate:
```bash
brew install dopplerhq/cli/doppler
doppler login
doppler setup
```

3. Install dependencies:
```bash
npm install
```

4. Run development server:
```bash
doppler run -- npm run dev
```

### 6.2 API Dependencies

| API | Purpose | Environment Variable |
|-----|---------|---------------------|
| Web API | Backend services | WEB_API_URL |
| Lead Form API | Lead submission | LEAD_API_URL |
| Elasticsearch | Search | ES_CLOUD_ID, ES_API_KEY |
| Sanity | CMS content | SANITY_PROJECT_ID, SANITY_TOKEN |

### 6.3 CI/CD Workflow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Branch Push    │────▶│ Preview Deploy  │────▶│  PR Review      │
│                 │     │ (Vercel)        │     │                 │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                                                         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Production    │◀────│ Release Please  │◀────│  Merge to Main  │
│   Deploy        │     │ (Versioning)    │     │  (Stage Deploy) │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

**Commit Convention:** Conventional Commits
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `chore:` Maintenance
- `refactor:` Code restructure

**Release Process:** Google Release Please
- Automatic changelog generation
- Semantic versioning
- Production deployment on release

### 6.4 Adding a New Locale/Domain

**Step 1: Web Project Configuration**

File: `next-i18next.config.js`
- Add new locale code to locales array
- Configure default namespace

File: `verticalConfigConstants.ts`
- Add domain configuration
- Set locale mappings

**Step 2: Revalidate Functions**

Repository: `keg-revalidate-functions`
- Add locale support in revalidation logic
- Update path patterns

**Step 3: Geopoint Lookup**

Repository: `geopoint-lookup-functions`
- Add country/locale mapping
- Update geolocation rules

**Step 4: Web API**

Update web API to support new locale in:
- Routing
- Content delivery
- Lead form handling

**Step 5: Vercel Edge Config**

Update cached countries configuration for the new locale in Vercel Edge Config.

---

## 7. GCP Functions & Services

### 7.1 Overview

All GCP services are hosted in the `keystone-noa-project` project.

| Service | Type | Language | Purpose |
|---------|------|----------|---------|
| smarthub-integration-functions | Cloud Run | Node.js | Smarthub to Sanity sync |
| keg-revalidate-functions | Cloud Run | Node.js | Trigger page revalidation |
| keystone-search-functions | Cloud Run | Node.js | Elasticsearch updates |
| keg-firestore-integration-functions | Cloud Run | Node.js | Firestore for SSGTM |
| sitemap-generator | Cloud Functions | Python | Generate sitemaps |
| currency-update-functions | Cloud Functions | Python | Currency rate updates |
| geopoint-lookup-functions | Cloud Functions | Python | Geolocation service |

### 7.2 smarthub-integration-functions

**Purpose:** Sync content changes from Smarthub to Sanity CMS

**Flow:**
1. Smarthub publishes change to GCP Pub/Sub
2. Function receives message with document ID and type
3. Fetches full document from Smarthub API
4. Transforms to Sanity schema
5. Creates/updates document in Sanity

**Endpoint:** Pub/Sub triggered (no HTTP endpoint)

### 7.3 keg-revalidate-functions

**Purpose:** Trigger Next.js on-demand page revalidation

**Flow:**
1. Sanity webhook fires on document change
2. Function receives webhook payload
3. Determines affected pages
4. Calls Next.js revalidate API for each page

**Code Location:** `pages/api/revalidate/index.ts`

**Method:** `res.revalidate(path)` on NextApiResponse

### 7.4 keystone-search-functions

**Purpose:** Update Elasticsearch index when content changes

**Hosted:** GCP Cloud Run in `keystone-noa-project`

**Endpoint:** `/api/v1/${dataType}/update`
- `dataType`: program or institution

**Flow for Programs:**
1. Check which vertical the program belongs to
2. Check if request is delete or update
3. If delete: Find all indices containing the program, execute deletion
4. If update: Map data to Elasticsearch schema, send to Elasticsearch

**Flow for Institutions:**
Similar to programs with institution-specific schema mapping.

**Special Cases:**
- onlinestudies: Updates online programs across multiple verticals
- educations.com: Different publication settings requirements

### 7.5 keg-firestore-integration-functions

**Purpose:** Maintain Firestore database for Server-Side Google Tag Manager (SSGTM)

**Hosted:** GCP Cloud Run in `Keystone-SSGTM` project

**Endpoint:** `/api/v1/programs/update`

**Flow:**
1. Receive Sanity webhook for program changes
2. Check which vertical the program belongs to
3. If delete: Remove from Firestore
4. If update: Map to Firestore schema, upsert document

**Data Usage:** Program/school data used by SSGTM for analytics enrichment

### 7.6 CI/CD for GCP Functions

All GCP functions use Cloud Build with GitHub integration:

```yaml
# cloudbuild.yaml pattern
steps:
  - name: 'gcr.io/cloud-builders/npm'
    args: ['install']
  - name: 'gcr.io/cloud-builders/npm'
    args: ['run', 'build']
  - name: 'gcr.io/cloud-builders/gcloud'
    args: ['run', 'deploy', '${SERVICE_NAME}', '--region', 'europe-west1']
```

---

## 8. Integration Flows

### 8.1 Content Publishing Flow

```
┌────────────────────────────────────────────────────────────────────────────┐
│                           CONTENT PUBLISHING FLOW                           │
└────────────────────────────────────────────────────────────────────────────┘

1. CONTENT CREATION
   Editor creates/updates program in Smarthub
                    │
                    ▼
2. CHANGE DETECTION
   Smarthub publishes message to GCP Pub/Sub
                    │
                    ▼
3. SANITY SYNC
   smarthub-integration-functions:
   • Receives Pub/Sub message
   • Fetches document from Smarthub
   • Transforms to Sanity schema
   • Writes to Sanity CMS
                    │
                    ▼
4. WEBHOOK TRIGGERS (6 webhooks fire in parallel)
   ┌────────────────┼────────────────┐
   │                │                │
   ▼                ▼                ▼
5a. SEARCH        5b. WEB APP      5c. FIRESTORE
keystone-search   keg-revalidate   keg-firestore
-functions        -functions       -integration
   │                │                │
   ▼                ▼                ▼
Elasticsearch     Next.js          Firestore
Index Updated     Pages Cached     SSGTM Data

6. USER EXPERIENCE
   Student searches → Updated results appear within minutes
   (Previously 48 hours, now ~6 hours with 70% improvement)
```

### 8.2 Lead Submission Flow

```
Student submits interest form
           │
           ▼
┌─────────────────────┐
│    Lead Form API    │
│   (validates form)  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    Smarthub CRM     │
│  (stores lead)      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Institution       │
│   (receives lead)   │
└─────────────────────┘
```

### 8.3 Search Query Flow

```
Student enters search query
           │
           ▼
┌─────────────────────┐
│   Next.js Frontend  │
│   (debounce input)  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    Elasticsearch    │
│   (query + filter)  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Results Ranking   │
│  (relevance + ads)  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Display Results   │
│ (programs + schools)│
└─────────────────────┘
```

---

## 9. Infrastructure & DevOps

### 9.1 Cloud Architecture

**AWS (Primary for EMG/Domestic):**
- EC2: Application servers
- RDS: MSSQL databases
- ElastiCache: Redis caching
- CloudFront: CDN
- S3: Static assets
- Lambda: Serverless functions

**GCP (KAS/KEG Functions):**
- Cloud Run: Containerized services
- Cloud Functions: Serverless Python
- Pub/Sub: Message queue
- Firestore: NoSQL database
- BigQuery: Analytics warehouse

**Vercel (Frontend):**
- Edge Functions: SSR and ISR
- Edge Config: Feature flags
- Preview Deployments: PR previews

### 9.2 AWS Account Strategy

Separate AWS accounts by environment and sensitivity:
- Production accounts (highest security)
- Staging accounts
- Development accounts
- Shared services account

**Key Documentation:**
- Account Strategy: `KTD/pages/1409908751`
- IAM Permissions: `KTD/pages/1532002316`
- Network Design: `DO/pages/1366294542`

### 9.3 Observability Stack

| Tool | Purpose |
|------|---------|
| Grafana | Dashboards and visualization |
| Datadog | APM and infrastructure monitoring |
| Loggly | Log aggregation |
| Solarwinds | Network monitoring |
| Vercel Analytics | Frontend performance |

**Key Metrics Monitored:**
- Core Web Vitals (LCP, FID, CLS)
- API response times
- Error rates
- Search latency
- Lead conversion rates

### 9.4 CDN & Redirects

**CloudFront Redirect System:**
- Handle legacy URL redirects
- Geographic routing
- A/B test traffic splitting

**Next.js Middleware:**
- Vertical-specific redirects
- Locale detection and routing
- Feature flag routing

**Documentation:**
- Redirects Strategy: `KTD/pages/472219654`
- CloudFront System: `KTD/pages/320241715`
- Middleware Module: `KTD/pages/641499137`

---

## 10. Security, Privacy & Compliance

### 10.1 Cybersecurity Guidelines

**Key Principles:**
- GDPR compliance for EU users
- Data encryption at rest and in transit
- Least privilege access control
- Secure SDLC practices

**Cookie & CSP Guidelines:**
- Strict Content Security Policy
- SameSite cookie attributes
- Frame options for clickjacking prevention

### 10.2 Authentication & Authorization

**Framework:** Custom authn/authz architecture
- Documentation: `KTD/pages/89325569`

**Secrets Management:**
- Doppler for development and production secrets
- No secrets in code repositories
- Rotation policies for API keys

### 10.3 Data Retention

**Policy Documentation:** `KTD/pages/581664776`

**Key Retention Rules:**
- Lead data: Varies by region and consent
- Analytics data: Aggregated after 24 months
- Logs: 90 days operational, 7 years audit

### 10.4 Database Access

**Policy:** `KTD/pages/594935820`

**Access Controls:**
- Production access requires approval
- Read-only access for analytics
- Audit logging for all queries

---

## 11. Quality & Testing

### 11.1 Testing Strategy

**Layers:**
1. Unit tests: Component and function level
2. Integration tests: API and service integration
3. E2E tests: Full user journeys
4. Visual regression: UI consistency

**Frameworks:**
| Type | Framework |
|------|-----------|
| Unit (JS) | Vitest, Jest |
| Unit (.NET) | xUnit, NUnit |
| E2E | Playwright |
| Visual | Playwright screenshots |

### 11.2 Test Automation Framework

**Playwright TAF:**
- Cross-browser testing (Chrome, Firefox, Safari)
- Mobile viewport testing
- CI/CD integration
- Documentation: `KTD/pages/1392934931`

**UI Testability:**
- Test IDs required on interactive elements
- Guidelines: `KTD/pages/1219231751`

### 11.3 Static Code Analysis

**SonarQube:**
- Code quality gates
- Security vulnerability scanning
- Technical debt tracking
- Documentation: `KTD/pages/471531522`

### 11.4 Incident Management

**Process:** `KTD/pages/44662795`

**Severity Levels:**
- P1: Service down, revenue impact
- P2: Major feature broken
- P3: Minor issue, workaround exists
- P4: Enhancement request

---

## 12. Data Platform & Analytics

### 12.1 Data Architecture

**Primary Warehouse:** BigQuery

**Data Sources:**
- Smarthub (CRM and content)
- Vercel Analytics (frontend)
- Elasticsearch (search logs)
- GA4 (user behavior)

### 12.2 Navigator Data Product

**Backend Evaluation:** Cube.dev + GraphQL
- Documentation: `EDP personal space page`

**Semantic Layer:**
- Cube.dev for metrics definitions
- GraphQL API for data access
- Caching for performance

### 12.3 Core Web Vitals

**Monitored Metrics:**
- LCP (Largest Contentful Paint): < 2.5s target
- FID (First Input Delay): < 100ms target
- CLS (Cumulative Layout Shift): < 0.1 target

**Documentation:** `KTD/pages/210993153`

---

## 13. AI & Machine Learning

### 13.1 AI Engineering Portal

**Space:** AEP (AI Engineering Portal)
- GitHub Copilot guides
- Prompt engineering practices
- Cross-team AI initiatives

### 13.2 Aria (AI Assistant)

**Product Overview:** `EGAA/pages/1270317057`

**Purpose:** AI-powered student discovery assistant
- Answer questions about programs
- Personalized recommendations
- Multi-language support

### 13.3 Content Generation

**System:** Keystone Country Content Generation & Translation
- Documentation: `EGAA/pages/1213923333`

**Capabilities:**
- AI-generated country guides
- Automated translation with review
- SEO-optimized content

### 13.4 AI Categorization

**Documentation:** `DO/pages/932511756`

**Purpose:** Automatic program categorization
- Subject area classification
- Degree level detection
- Study mode identification

---

## 14. Confluence Space Index

### 14.1 Primary Spaces

| Space | Key | URL |
|-------|-----|-----|
| Keystone Technical Documentation | KTD | `keystoneedugroup.atlassian.net/wiki/spaces/KTD` |
| Technology Leadership Forum | TE | `keystoneedugroup.atlassian.net/wiki/spaces/TE` |
| Educations.com Tech | TI | `keystoneedugroup.atlassian.net/wiki/spaces/TI` |
| Group Platform Re-engineering | KR | `keystoneedugroup.atlassian.net/wiki/spaces/KR` |
| Domestic Re-engineering | DR | `keystoneedugroup.atlassian.net/wiki/spaces/DR` |

### 14.2 Specialized Spaces

| Space | Key | URL |
|-------|-----|-----|
| Engineering Data Products | EDP | `keystoneedugroup.atlassian.net/wiki/spaces/EDP` |
| AI Engineering Portal | AEP | `keystoneedugroup.atlassian.net/wiki/spaces/AEP` |
| Generative & Agentic AI | EGAA | `keystoneedugroup.atlassian.net/wiki/spaces/EGAA` |
| Design Team | DT | `keystoneedugroup.atlassian.net/wiki/spaces/DT` |
| DevOps | DO | `keystoneedugroup.atlassian.net/wiki/spaces/DO` |
| SEO | SEO | `keystoneedugroup.atlassian.net/wiki/spaces/SEO` |

### 14.3 Key Pages Quick Reference

**Strategy & Principles:**
- Technology Guidelines: `KTD/pages/84377601`
- Engineering Strategy: `KTD/pages/1236074497`
- Ways of Working: `KTD/pages/1395458051`

**Architecture:**
- Content Storage Strategy: `KTD/pages/28442628`
- Observability Strategy: `KTD/pages/39190553`
- Account Strategy: `KTD/pages/1409908751`

**Security:**
- Cybersecurity Guidelines: `KTD/pages/32604161`
- Data Retention Policy: `KTD/pages/581664776`

**Quality:**
- Testing Strategy: `KTD/pages/453804033`
- Incident Management: `KTD/pages/44662795`

---

## 15. Key URLs & Resources

### 15.1 Production URLs

| Environment | URL |
|-------------|-----|
| Sanity Studio (Prod) | sanity.keg.com |
| Sanity Studio (Stage) | beta.sanity.keg.com |
| Stage Web App | keystone-study-program-sites.vercel.app |

### 15.2 GitHub Repositories

**Organization:** keystoneas

| Repository | Purpose |
|------------|---------|
| keystone-study-program-sites | Main web application |
| keg-revalidate-functions | Page revalidation |
| keystone-search-functions | Elasticsearch updates |
| smarthub-integration-functions | Smarthub to Sanity sync |
| keg-firestore-integration-functions | Firestore sync |
| geopoint-lookup-functions | Geolocation service |

### 15.3 GCP Projects

| Project | Purpose |
|---------|---------|
| keystone-noa-project | Main KEG functions |
| Keystone-SSGTM | Server-side GTM |

### 15.4 External Services

| Service | Purpose | Provider |
|---------|---------|----------|
| Elasticsearch | Search | Elastic.co |
| Sanity | CMS | Sanity.io |
| Vercel | Hosting | Vercel |
| Doppler | Secrets | Doppler |
| Cloudinary | Media | Cloudinary |

---

## Appendix A: Challenges & Known Issues

### A.1 Current Technical Challenges

**Caching Complexity:**
- Multiple caching layers (Vercel, CloudFront, ISR)
- Cache invalidation timing
- Edge config synchronization

**Sanity Document Limit:**
- 1M document limit approaching
- Need archiving strategy
- Performance at scale

**App Router Migration:**
- Next.js 12 to 13 migration in progress
- Component migration complexity
- Documentation: `TI/pages/1102381073`

**Indexing Speed:**
- Improved from 48 hours to ~6 hours (70% faster)
- Target: Near real-time updates
- Bottleneck: Webhook processing queue

### A.2 Technical Debt

- Legacy Smarthub dependencies
- Multiple authentication systems
- Inconsistent logging across platforms
- Test coverage gaps in legacy code

---

## Appendix B: Onboarding Checklist

**Week 1:**
- [ ] Read this master context document
- [ ] Get GitHub access to keystoneas org
- [ ] Set up Doppler CLI
- [ ] Clone and run keystone-study-program-sites locally
- [ ] Access Confluence and find your team space
- [ ] Read Technology Guidelines page

**Week 2:**
- [ ] Review Engineering Strategy
- [ ] Understand your team's tech stack
- [ ] Complete first PR with code review
- [ ] Attend team ceremonies
- [ ] Review testing strategy for your area

**Week 3:**
- [ ] Understand integration flows
- [ ] Review relevant GCP functions
- [ ] Complete security awareness training
- [ ] Get production access (if needed)
- [ ] Contribute to documentation

---

## Document Maintenance

**How to Update:**
1. Create/update canonical Confluence page for new topics
2. Add one-line description and link to relevant section
3. Keep sections stable, extend with bullets
4. Align with org structure changes

**Review Cadence:** Quarterly review recommended

**Owner:** Engineering Leadership / Team InSanity

---

*This document consolidates information from Confluence documentation, internal presentations, and operational knowledge. For the most current information on specific topics, refer to the linked Confluence pages.*
