# yellow.ai | Triage Inbox

A highly interactive customer support Triage Inbox dashboard built with Next.js and Tailwind CSS. The system prioritizes customer conversations automatically based on urgency scores and customer tiers, allowing support agents to act on the most critical issues first.

---

##  Product Write-up & Features

The **Triage Inbox** is a specialized dashboard designed for support representatives to process escalated customer conversations. It eliminates manual prioritization by putting the most critical conversations directly in front of the agent.

### Core Features:
- **Smart Prioritization:** Automatically sorts active tickets using an urgency calculation (calculated out of 100) and applies a tiebreaker boost for **Enterprise** customers.
- **Detailed Conversation Cards:** Displays customer tier, communication channel (Email, Chat, Voice), calculated urgency score, specific escalation reasons, and the customer's last message.
- **Queue Health Analytics:** Displays real-time breakdown statistics (Critical, Medium, and Low priority counts) as well as total active vs. handled counters.
- **Keyboard Shortcuts (Speed Triage):**
  - Press `R` to **Resolve** the active conversation.
  - Press `A` to **Reassign** (flags the conversation as `in_review` and leaves it in the queue for team review).
  - Press `S` to trigger the **Skip Reason** picker.
  - Press `1`, `2`, or `3` to choose a skip reason (*"Not my area"*, *"Need context"*, or *"Escalate"*), or `Esc` to cancel.
- **Robust Network State & Retry Handling:** Simulates real-world API instability (with a 30% random failure rate). If an action fails, the UI guides the agent to retry. If it fails repeatedly, the system flags the issue to prevent blocking the queue.
- **Sidebar Navigation (Queue Rail):** Shows the upcoming queue ("Up Next") and previously processed tickets ("Handled").

---

## Setup & Installation

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18 or higher) and `npm` installed.

### 1. Install Dependencies
Clone the repository and install all required packages:
```bash
npm install
```

### 2. Run the Development Server
Start the local server with hot-reloading:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 3. Build for Production
To compile and optimize the application for production:
```bash
npm run build
```
This performs a static build of the Next.js app.

### 4. Start Production Server
Run the compiled build locally:
```bash
npm run start
```

---

## Architecture Overview

The application is structured as a client-first, single-page application built on Next.js:

```mermaid
graph TD
    A[MswProvider] -->|registers| B[Mock Service Worker]
    C[page.tsx Client Component] -->|client-side fetch| D[/api/conversations]
    B -->|intercepts & returns| D
    C -->|renders| E[ConversationCard]
    C -->|renders| F[QueueRail]
    C -->|renders| G[EmptyState]
    H[sortConversation.ts] -->|sorts active list| C
```

- **Frontend Framework:** Next.js 16 (React 19) utilizing the App Router. The core page ([app/page.tsx](file:///c:/Users/Vindhya%20M%20D/conversation-inbox/app/page.tsx)) is a Client Component.
- **Styling:** Styled with Tailwind CSS (v4) for a premium dark mode layout, using the *Inter* font for typography and *JetBrains Mono* for code/message layouts.
- **In-Browser API Mocking (MSW):** Instead of a dedicated backend database or server-side API routes, the app uses [Mock Service Worker (MSW)](https://mswjs.io/) (v2) to intercept all client-side network requests (`fetch('/api/...')`).
  - The worker is initialized in the browser via [MswProvider.tsx](file:///c:/Users/Vindhya%20M%20D/conversation-inbox/components/MswProvider.tsx) during the application mount.
  - The mock backend handler ([mocks/handlers.ts](file:///c:/Users/Vindhya%20M%20D/conversation-inbox/mocks/handlers.ts)) maintains a mutable in-memory array of conversations during the browser session, allowing you to resolve, reassign, skip, and reset tickets dynamically.
- **Sorting & Prioritization Logic:** Implemented in [lib/sortConversation.ts](file:///c:/Users/Vindhya%20M%20D/conversation-inbox/lib/sortConversation.ts). Conversations are sorted by `urgencyScore`. If a customer belongs to the `enterprise` tier, they receive an additional `+5` boost (`ENTERPRISE_TIEBREAKER_BOOST`) to push them higher in the priority queue.

---

## Known Limitations

1. **In-Memory State Reset:** Because the Mock Service Worker operates purely in the client's browser memory, **refreshing or reloading the page resets the queue state** back to the default mock conversations.
2. **No Server-Side Code:** There are no server-side Next.js route handlers (`app/api` directory is empty). All endpoints are simulated client-side by MSW.
3. **Simulated Network Errors:** The `/api/conversations/:id/action` endpoint has a simulated **30% failure rate** (`Math.random() < 0.3`). This is intentional to showcase the client's retry and error state design.
4. **Single User / No Authentication:** The application is designed as a standalone triage interface for a single agent; it does not support multiple user sessions or user authentication.

---

## ⏱️ Approximate Time Spent

- **Architecture Plan & Layout setup:** ~30 mins
- **UI Styling (Premium Dark Mode, Gauges, Sidebar):** ~1 hour
- **API Mocking (MSW Setup, mutable state, actions):** ~45 mins
- **Keyboard Shortcuts & Interaction Polish:** ~30 mins
- **Instability Retry / Error State Logic:** ~30 mins
- **Testing, Verification & Deployment Setup:** ~15 mins
- **Total Estimated Time:** **3 hours and 30 minutes**
