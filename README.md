# Kisii Cluster Portal

A production-ready, mobile-first web application designed to provide an authorized and secure central platform where members and authorized administrators in **Kisii Cluster** can easily access approved cluster information, activities, schedules, resources, and announcements without repeatedly contacting one individual for routine information.

Built with a scalable multi-cluster architecture, starting with **Kisii Cluster** across its active operational localities: **Kisii Central**, **Kitutu Chache**, and **Nyaribari Chache**.

---

## 🌟 Key Features

1. **Public Website (`/`)**
   - Clean, trustworthy public landing page showcasing verified public activities and announcements.
   - Self-service **Request Access (`/request-access`)** flow with locality selection and administrative review.
   - Dedicated **Login (`/login`)** with instant 1-click test accounts for all roles.

2. **Authenticated Member Portal**
   - **Dashboard (`/dashboard`)**: Welcome banner, upcoming gatherings, recent notices, notification alerts, and quick actions.
   - **Activities (`/activities`) & Details (`/activities/[id]`)**: Filter by locality, activity type, and date; download `.ics` calendar events or add directly to Google Calendar.
   - **Interactive Calendar (`/calendar`)**: Full monthly grid view and upcoming list with personal calendar synchronization.
   - **Communities & Localities (`/communities`)**: Locality hubs displaying authorized activities, groups, resources, and notices.
   - **Cluster Groups (`/groups`)**: Registration and schedules for Study Circles, Devotional Meetings, Children's Classes, and Junior Youth Groups.
   - **Document Library (`/documents`)**: Categorized institutional guidelines, training materials, and forms.
   - **Announcements (`/announcements`)**: Verified announcements with role visibility filtering.
   - **User Profile (`/profile`)**: Granular permissions inspector and phone privacy visibility controls.

3. **Permission-Aware AI Cluster Assistant (`/assistant`)**
   - Answers natural language questions exclusively using approved cluster records.
   - **Zero Hallucination Guarantee**: If information cannot be found, it states: *"I couldn't find approved information about that in the cluster portal."*
   - Strictly enforces pre-retrieval authorization: private coordinator or admin records are never fed into the LLM context for regular members or public visitors.
   - Displays approved source citations linking directly to the relevant activity or document.

4. **Comprehensive Admin Console (`/admin`)**
   - **Admin Dashboard (`/admin`)**: Real-time KPI metrics and quick actions.
   - **Access Requests (`/admin/access-requests`)**: Review pending applications, assign roles, approve or reject with automatic audit logging.
   - **User Management (`/admin/users`)**: Search members, assign roles, activate or suspend accounts with escalation protection.
   - **Roles & Permissions (`/admin/roles`)**: 28 granular permissions across 5 roles.
   - **Localities (`/admin/localities`)**: Manage cluster localities with multi-cluster isolation.
   - **Content Approval CMS (`/admin/activities`, `/admin/documents`, `/admin/announcements`)**: Complete lifecycle workflow (`Draft` &rarr; `Pending Review` &rarr; `Approved` &rarr; `Published`).
   - **AI Knowledge Base (`/admin/knowledge`)**: pgvector chunk inspection and re-indexing status.
   - **Statistical Reporting (`/admin/reports`)**: Factual aggregates without personal rankings.
   - **Immutable Audit Trail (`/admin/audit`)**: Filterable logs tracking all administrative actions.
   - **Settings & Backup (`/admin/settings`)**: Multi-cluster configuration, JSON data export, and demo reset.
   - **Security Test Runner (`/admin/tests`)**: Automated verification of RLS barriers, URL tampering defenses, and AI context isolation.

5. **PWA & Mobile-First Excellence**
   - Offline-capable service worker (`/public/sw.js`).
   - Complete Web App Manifest (`/public/manifest.webmanifest`) and compliant icons.
   - In-app install button (`PWAInstallButton`) with guided modal for iOS Safari.
   - Live offline status banner (`OfflineIndicator`).

---

## 🏗️ Architecture

```
kisii-cluster-portal/
├── database/
│   └── schema.sql             # Complete PostgreSQL / Supabase schema & RLS policies
├── public/
│   ├── icon.svg               # Vector brand emblem
│   ├── manifest.webmanifest   # PWA Web App Manifest
│   ├── sw.js                  # Service worker caching engine
│   └── pwa-*.png              # 192px and 512px PWA icons
├── src/
│   ├── components/            # Reusable UI & Gate components
│   │   ├── AppShell.tsx       # Desktop sidebar + mobile bottom navigation
│   │   ├── ActivityCard.tsx
│   │   ├── CalendarView.tsx
│   │   ├── AssistantChat.tsx
│   │   ├── PWAInstallButton.tsx
│   │   └── ...
│   ├── lib/
│   │   ├── permissions.ts     # Granular role-permission engine
│   │   ├── storage.ts         # Persistent data layer & audit logger
│   │   ├── search.ts          # Permission-filtered global search
│   │   ├── ai-assistant.ts    # RAG pipeline with pre-retrieval authorization
│   │   └── pwa.ts             # PWA install & online detection hooks
│   ├── views/                 # Full route views
│   │   ├── admin/             # Administrative views
│   │   └── ...
│   ├── types/
│   │   └── index.ts           # Domain models & TypeScript interfaces
│   ├── App.tsx                # Client router & state orchestration
│   └── main.tsx
├── server.ts                  # Full-stack Express server with Gemini RAG API
└── package.json
```

---

## 🔐 Roles & Granular Permissions

| Role | Description | Key Permissions |
|---|---|---|
| **`public`** | Visitor / Prospective member | Public published activities and announcements |
| **`member`** | Approved cluster member | Internal activities, groups, documents, calendar, `ai.use` |
| **`coordinator`** | Activity / Group facilitator | `activities.create`, `groups.create`, `documents.upload`, `reports.view` |
| **`cluster_admin`** | Administrator for Kisii | `users.approve`, `activities.approve`, `documents.approve`, `announcements.publish`, `audit.view` |
| **`super_admin`** | System administrator | Full permissions including `settings.manage` and multi-cluster federation |

---

## 🚀 Local Installation & Setup

### 1. Prerequisites
- Node.js (v18 or v20+)
- npm or pnpm

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local` or `.env`:
```bash
cp .env.example .env
```
Fill in the values:
```env
GEMINI_API_KEY="your-google-gemini-api-key"
APP_URL="http://localhost:3000"
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-public-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-secret-key"
```

### 4. Supabase & Database Migration
1. Log in to your Supabase project dashboard.
2. Open the **SQL Editor**.
3. Paste the contents of `database/schema.sql` and click **Run**.
4. The script provisions:
   - `uuid-ossp` and `vector` (pgvector) extensions
   - All 15 relational tables
   - Granular permissions and initial roles
   - Row Level Security (RLS) policies for every table
   - Sample seeds for Kisii Cluster and its 3 localities

### 5. Running the Application
To run the full-stack server (Express backend + Vite client):
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🧪 Testing & Security Verification

The portal includes an interactive security test suite accessible at `/admin/tests`:
1. Sign in as **Cluster Admin** or **Super Admin**.
2. Navigate to **Administration &rarr; Security Tests** (or click the test button in Admin Dashboard).
3. Click **Execute Security Tests** to run automated assertions:
   - Verifies members cannot access the admin area by modifying the browser URL.
   - Verifies members cannot view confidential or unapproved documents.
   - Verifies global search omits restricted records.
   - Verifies the AI assistant refuses to leak private documents to unauthorized roles.
   - Verifies administrative actions record immutable audit logs.

---

## 📦 Production Deployment

Build the optimized production assets:
```bash
npm run build
```
Start the production server:
```bash
npm start
```
The server binds to `0.0.0.0:3000` (or `PORT` environment variable) and serves the static build with the integrated `/api/ai/chat` endpoint.
