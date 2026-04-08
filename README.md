# SpendWise Frontend

Dashboard for the SpendWise email expense analyzer. Upload email data, view categorized spending transactions, and discover SaaS subscriptions. Connects to the SpendWise backend API.

## Overview

Single page application with three views: a home dashboard with upload and quick stats, a spending view with filterable transaction table, and a SaaS discovery view listing detected tools with their costs and signal types. Navigation is handled through a sidebar with state switching, no client-side router needed.

### Data Flow

```
Upload JSON file
  → Read file content in browser
  → POST to /api/emails/upload
  → Backend processes with AI
  → Response: upload summary (counts)
  → Refresh dashboard data

View spending / SaaS
  → GET /api/spending (with optional filters)
  → GET /api/spending/summary
  → GET /api/saas
  → GET /api/saas/summary
  → Render tables, cards, badges
```

### Views

| View               | What it shows                                                                                                                              |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Home**           | Upload section, spending total card, SaaS monthly cost card. Click either card to navigate                                                 |
| **Spending**       | Summary cards (total spend, top category, category count), filterable table (category, date range)                                         |
| **SaaS Discovery** | Summary cards (monthly spend, tools detected, signals count), list of detected tools with signal type, billing cycle, cost, and confidence |

## Technology Choices

| Technology                    | Why                                                                                                                                              |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **React 19 + React Compiler** | Using React Compiler via Babel plugin so no need for manual `useCallback`/`useMemo`. Cleaner code with automatic memoization                     |
| **Vite 8**                    | Fast dev server. Using `@rolldown/plugin-babel` for the React Compiler integration                                                               |
| **TypeScript 6**              | Strict types across API responses, entity models, and component props                                                                            |
| **Tailwind CSS 4**            | Utility first styling. Using the new CSS-based config with `@tailwindcss/vite` plugin                                                            |
| **shadcn/ui (radix-luma)**    | Accessible component primitives. Used Card, Badge, Table, Select, Input, Button, Separator. Saved a lot of time not building these from scratch  |
| **ofetch**                    | HTTP client with built-in retry, JSON parsing, and cleaner API than native fetch. Created a configured instance with base URL and retry settings |
| **sonner**                    | Toast notifications for upload success/error feedback                                                                                            |
| **Lucide React**              | Icon set, consistent with shadcn ecosystem                                                                                                       |

## Project Structure

```
src/
├── api/
│   ├── api-client.ts             # ofetch instance with base URL, retry config
│   ├── constants.ts              # API URL, retry settings from env
│   ├── types.ts                  # Request param types
│   ├── upload-services.ts        # POST /api/emails/upload
│   ├── spending-services.ts      # GET /api/spending, /api/spending/summary
│   └── saas-services.ts          # GET /api/saas, /api/saas/summary
├── components/
│   ├── blocks/
│   │   └── UploadSection.tsx     # Drag and drop file upload with loading/success states
│   ├── layout/
│   │   └── AppLayout.tsx         # Sidebar + main content area shell
│   └── ui/                       # shadcn components (card, badge, table, select, etc.)
├── constants/
│   ├── views.ts                  # View keys, nav items with icons
│   └── presets.ts                # Categories, signal types, billing cycles, styles (mirrors backend presets)
├── hooks/
│   └── useRequest.ts             # Generic async request hook with loading/error/data states
├── types/
│   ├── api.ts                    # API response wrapper, error types
│   └── entities.ts               # Spending, SaaSDiscovery, summary types
├── views/
│   ├── HomeView.tsx              # Dashboard with upload + summary cards
│   ├── SpendingView.tsx          # Summary cards + filters + transaction table
│   └── SaaSView.tsx              # Summary cards + detected tools list
├── lib/utils.ts                  # cn() utility (clsx + tailwind-merge)
├── App.tsx                       # Root component, view switching, toast provider
├── main.tsx                      # React DOM entry point
└── index.css                     # Tailwind imports, theme variables, fonts
```

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/) >= 24
- [pnpm](https://pnpm.io/) >= 10

> This project includes a `.node-version` file. If you use [fnm](https://github.com/Schniz/fnm), it will automatically switch to the correct Node version when you enter the project directory. If you do not have a version manager set up, fnm is a good option since it is fast and works across all platforms.

### Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8000
```

### Install and Run

```bash
pnpm install

# Development
pnpm dev

# Production build
pnpm build

# Preview production build
pnpm preview
```

### Linting

```bash
pnpm lint:type      # TypeScript type checking
pnpm lint:code      # ESLint
pnpm format:all     # Prettier format all files
```

## What I Would Improve Given More Time

- **Presets from API.** Fetch categories, signal types, billing cycles from backend instead of hardcoding. Right now if the backend adds a new category, the frontend filter dropdown would not show it until someone manually updates the constants file
- **Wider input support.** Accept CSV files alongside JSON. Also explore direct email integration (Gmail API, IMAP) so users can connect their inbox directly instead of exporting and uploading files manually
- **Streaming upload processing.** Currently the entire JSON file is sent and processed as one batch. For larger files, it would be better to chunk the data and process incrementally with progress feedback. If something fails midway, resume from the failure point instead of starting over
- **Data visualization.** A bar or pie chart for spending by category breakdown. Summary cards show numbers but a visual representation would make patterns easier to spot at a glance
- **Virtualized lists.** Right now all rows render at once which is fine for small datasets. But with hundreds or thousands of transactions, rendering performance would drop. Something like `react-window` or `tanstack-virtual` to only render visible rows
- **Responsive UI.** The sidebar layout works on desktop but breaks on smaller screens. Need a collapsible sidebar or bottom navigation for mobile, and make the table horizontally scrollable or switch to card layout on narrow viewports
- **Error boundary.** A React error boundary at the app level so unexpected runtime errors show a fallback UI instead of crashing the whole page
- **Upload history.** Show previously uploaded files or batches so users can see what has been processed and when. Useful for tracking whether a file was already uploaded or if something needs to be re-uploaded
- **User authentication.** For a production launch, users need their own accounts so their data is isolated. OAuth with Google would fit naturally since the long term goal is direct Gmail integration
- **Export and sharing.** Let users export their spending report or SaaS inventory as PDF or CSV. Useful for finance teams who want to share findings outside the app
- **Notifications and alerts.** Detect anomalies like unusual spending spikes or new SaaS tools appearing, and surface them proactively instead of waiting for the user to browse through data
