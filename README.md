# ICY Platform — Influencer Collaboration & Intelligence

An MVP web platform that connects **brands** and **influencers** with:

- Role-based auth (brand / influencer)
- Influencer profiles
- Brand campaigns (briefs)
- A basic influencer marketplace
- Collaboration requests attached to specific campaigns
- Simple relevance scoring between campaigns and creators

Built with:

- **Next.js 16 (App Router, TypeScript)**
- **MongoDB + Mongoose**
- Tailwind-style utility classes for styling

---

## 1. Core Concept

Brands struggle to find the *right* creators for specific campaigns.  
ICY helps by:

- Letting influencers create structured profiles (niche, followers, links)
- Letting brands create structured campaign briefs
- Showing a **match score** between a brand’s latest campaign and each influencer
- Letting brands send **collaboration requests** tied to a specific campaign
- Letting influencers accept/reject these requests from an inbox

This is a focused MVP for **influencer–brand collaboration workflows**.

---

## 2. Features

### 2.1 Authentication & Roles

- `/signup` — create user (name, email, password, role)
- `/login` — log in, store user info in `localStorage` (`icy_user`)
- `/dashboard` — role-based dashboard:
  - Shows logged-in user & role
  - **Influencer**: quick links to Profile & Requests
  - **Brand**: quick links to Brand Profile, Discover, Campaigns
- Logout button — clears `localStorage`, redirects to `/login`

### 2.2 Influencer Flow

- `/influencer/profile`
  - Influencer can set:
    - bio
    - niche
    - followers
    - Instagram handle
    - YouTube link
  - Data stored in `InfluencerProfile` collection.

- `/influencer/requests`
  - Shows incoming collaboration requests from brands.
  - For each request:
    - Brand name + email
    - **Campaign name** (if attached)
    - Message
    - Status (`pending / accepted / rejected`)
    - Timestamp
  - Buttons:
    - **Accept** → updates status to `accepted`
    - **Reject** → updates status to `rejected`

### 2.3 Brand Flow

- `/brand/profile`
  - Basic brand details stored in `BrandProfile`.

- `/brand/campaigns`
  - Create campaign briefs:
    - name (required)
    - objective
    - budget
    - deliverables
  - Saved in `Campaign` collection.
  - Page lists all campaigns for that brand (newest first).

- `/brand/discover`
  - Shows all influencers with profile info (bio, niche, followers).
  - **Match Score**:
    - Uses the brand’s **latest campaign**.
    - Extracts keywords from:
      - campaign name + objective + deliverables
      - influencer bio + niche
    - Computes a simple overlap ratio and displays as `Match: XX%`.
  - Actions:
    - **View Profile** → `/influencer/[id]` public page
    - **Request Collab**:
      - Sends POST to `/api/collab/request`
      - Creates a `CollabRequest` including:
        - `brandId`
        - `influencerId`
        - `campaignId` (latest campaign)
        - message

### 2.4 Public Influencer Profiles

- `/influencer/[id]`
  - Public page that anyone (especially brands) can open.
  - Shows:
    - Influencer name
    - Niche
    - Bio
    - Followers
    - Instagram
    - YouTube
    - Contact email
  - Data fetched via `/api/influencer/single?id=...`.

---

## 3. Data Model (MongoDB)

### User

- `name`
- `email`
- `passwordHash` (in this MVP it may be simplified)
- `role`: `"brand"` or `"influencer"`

### InfluencerProfile

- `userId` (ref to `User`)
- `bio`
- `niche`
- `followers`
- `instagram`
- `youtube`

### BrandProfile

- `userId` (ref to `User`)
- `brandName`
- `website`
- `industry`
- `description`
- `budgetRange`

### Campaign

- `brandId` (ref to `User`)
- `name`
- `objective`
- `budget`
- `deliverables`
- `status`: `"draft" | "active" | "completed"`
- `createdAt`

### CollabRequest

- `brandId` (ref to `User`)
- `influencerId` (ref to `User`)
- `campaignId` (ref to `Campaign`, optional)
- `message`
- `status`: `"pending" | "accepted" | "rejected"`
- `createdAt`

---

## 4. Project Structure (relevant parts)

- `app/`
  - `page.tsx` — landing page
  - `login/page.tsx`
  - `signup/page.tsx`
  - `dashboard/page.tsx`
  - `brand/`
    - `profile/page.tsx`
    - `discover/page.tsx`
    - `campaigns/page.tsx`
  - `influencer/`
    - `profile/page.tsx`
    - `requests/page.tsx`
    - `[id]/page.tsx`
  - `api/`
    - `auth/` (signup, login)
    - `influencer/` (profile CRUD, `all`, `single`)
    - `brand/` (profile)
    - `campaign/` (`create`, `byBrand`)
    - `collab/` (`request`, `inbox`, `update`)
- `models/`
  - `User.ts`
  - `InfluencerProfile.ts`
  - `BrandProfile.ts`
  - `Campaign.ts`
  - `CollabRequest.ts`
- `lib/db.ts` — MongoDB connection helper

---

## 5. How to Run Locally

1. Clone the repo and install dependencies:

   ```bash
   npm install
# icy-platform
