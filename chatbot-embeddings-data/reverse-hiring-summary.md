# TalentFirst — App Summary

## What Is TalentFirst?

TalentFirst is a **reverse job board platform**. Instead of talent applying to job postings, employers browse talent profiles and send personalized job proposals directly to candidates. Talent gets to choose which opportunities to accept.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui + Radix UI |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT / bcryptjs (custom session) |
| File Uploads | Cloudinary |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Runtime | React 19 |

---

## User Roles

- **TALENT** — Professionals who create profiles to get discovered.
- **EMPLOYER** — Companies/hiring managers who browse profiles and send proposals.

---

## Core Data Models

- **User** — email, password (hashed), name, role (TALENT | EMPLOYER)
- **TalentProfile** — title, bio, location, skills[], experience, hourly rate, availability, openToRemote, openToContract, portfolio links (LinkedIn, GitHub, website)
- **EmployerProfile** — companyName, industry, size, location, techStack[], benefits[], remotePolicy, description, culture, isHiring
- **Proposal** — position, budget, budgetType (hourly | fixed | salary), location, remote status, duration, startDate, message, status (pending | viewed | accepted | declined)
- **SavedTalent** — employer bookmarks of talent profiles

---

## App Flow

### Talent Flow
1. Sign up with TALENT role → redirected to `/create-profile`
2. Create profile (title, bio, skills, rate, availability, links)
3. Get discovered by employers browsing `/browse-talent`
4. Receive proposals at `/proposals` — view, accept, or decline
5. View recommendations at `/recommendations`

### Employer Flow
1. Sign up with EMPLOYER role → redirected to `/employer/profile`
2. Set up company profile (name, industry, tech stack, benefits, etc.)
3. Browse talent at `/browse-talent` or `/search`
4. View full talent profile at `/profile/[id]`
5. Send a proposal via `/send-proposal/[talentId]`
6. Track sent proposals and analytics at `/employer/dashboard`

---

## Pages

| Route | Description | Access |
|---|---|---|
| `/` | Landing page | Public |
| `/how-it-works` | Step-by-step platform guide | Public |
| `/for-employers` | Employer benefits page | Public |
| `/signup` | Register as talent or employer | Public |
| `/login` | Login | Public |
| `/forgot-password` | Password reset request | Public |
| `/create-profile` | Talent profile creation | Talent |
| `/proposals` | Talent's incoming proposals | Talent |
| `/recommendations` | Personalized talent/job recs | Talent |
| `/profile/[id]` | Public talent profile view | Authenticated |
| `/browse-talent` | Browse + filter talent profiles | Employer |
| `/search` | Advanced talent search | Employer |
| `/send-proposal/[talentId]` | Send a job proposal to talent | Employer |
| `/proposal-success` | Confirmation after sending | Employer |
| `/employer/profile` | Employer profile setup/edit | Employer |
| `/employer/dashboard` | Analytics + sent proposals | Employer |

---

## Key API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login, returns JWT |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Current user info |
| GET | `/api/talents` | List/search talents |
| GET | `/api/talents/[id]` | Single talent profile |
| POST | `/api/talents` | Create talent profile |
| GET | `/api/proposals` | List proposals (filtered) |
| POST | `/api/proposals` | Send a proposal |
| PUT | `/api/proposals/[id]` | Accept / decline proposal |
| GET | `/api/companies` | List company profiles |
| GET | `/api/saved-talents` | Employer's saved talent list |
| POST | `/api/saved-talents` | Save a talent |
| GET | `/api/recommendations/for-you` | Personalized recs |
| GET | `/api/recommendations/trending` | Trending talent |
| GET | `/api/analytics/employer` | Employer dashboard stats |

---

## Authentication

- Custom JWT-based auth (no third-party OAuth)
- Passwords hashed with bcryptjs
- Session stored as HTTP-only cookie
- Middleware protects routes based on user role

---

## Summary

TalentFirst flips hiring: talent lists themselves, employers come to them. The platform serves two distinct user types with separate onboarding flows, dashboards, and permissions. It is built as a full-stack Next.js app with PostgreSQL, Prisma ORM, and a custom JWT auth system.
