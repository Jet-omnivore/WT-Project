# MediRemind — Progress-1 Documentation Report

**Project Title:** MediRemind — A Smart Medicine & Health Appointment Tracker  
**Course:** Web Technologies (WT)  
**Semester:** 5th Semester, BTech IT  
**Team Members:** Avinash, Nitish, Animesh Singh Vijay, Amit Kumar Patel, Rahul  
**Date:** March 2025

---

# SECTION 1 — TOPIC OF THE PROJECT (1.5 Marks)

---

## 1A. Problem Statement

Managing personal health — especially daily medicines and doctor appointments — is a challenge for millions of people. The WHO reports that **50% of chronic disease patients don't follow their medication schedule properly**, leading to approximately 125,000 preventable deaths annually in the US alone.

**MediRemind** is a web-based health management app that helps users:
- Track daily medicines with one-click "Taken/Skip" logging
- Manage doctor appointments from a single dashboard
- View a monthly health calendar
- Allow caregivers to monitor patients remotely (planned)

### Target Users
- Elderly patients managing multiple daily prescriptions
- Working adults who forget doses due to busy schedules
- Parents tracking children's medication courses
- Caregivers monitoring patients from another city

### Current Solutions & Their Gaps

| Existing Tool | What It Does | What's Missing |
|---------------|-------------|----------------|
| Medisafe | Mobile medicine reminders | No web version |
| Practo | Doctor appointment booking | No medicine tracking |
| Tata 1mg / PharmEasy | Online pharmacy | No reminders or tracking |
| Google Calendar | General scheduling | Not built for health; no intake logging |
| MyTherapy | Health tracker + reports | Not India-focused; clinical UI |

MediRemind fills these gaps with a **simple web-based dashboard** that combines medicine tracking, appointment management, and health history in one place.

---

## 1B. Competitor Analysis Summary

We studied 6 platforms before building MediRemind:

| Platform | Main Feature | Biggest Gap | MediRemind Advantage |
|----------|-------------|-------------|---------------------|
| Medisafe | Medicine reminders (mobile) | No web version | Web-based, works on any device |
| Tata 1mg | Online pharmacy | No reminders | Combined reminders + tracking |
| Practo | Doctor booking | No medicine tracking | Integrated medicine + appointments |
| MyTherapy | Health reports | Not India-focused | Simple UI for Indian users |
| Google Calendar | General scheduling | Not for health | Purpose-built for medicines |
| PharmEasy | Online pharmacy | No tracking | Full health dashboard |

**Key Insight:** No single platform combines medicine reminders, appointment tracking, and a health dashboard in a simple web interface accessible from any device.

---

# SECTION 2 — STRUCTURE & TECHNOLOGY STACK (1.5 Marks)

---

## 2A. Sitemap

| Page | Route | Purpose |
|------|-------|---------|
| Home / Landing | `/` | Introduce the product to visitors |
| Login | `/login` | User login with email/password |
| Register | `/register` | New user signup with role selection |
| Dashboard | `/dashboard` | Medicine tracking + appointments overview |
| Medicines | `/medicines` | View, search, add, edit, delete medicines |
| Appointments | `/appointments` | Manage doctor appointments |
| Calendar | `/calendar` | Monthly view of appointments |
| Profile | `/profile` | User info, stats, and settings |
| About Us | `/about` | Team and project information |

---

## 2B. UI Design Principles

| Principle | How We Applied It |
|-----------|-------------------|
| **Visual Hierarchy** | Dashboard greeting is largest text; medicines section appears before less-urgent appointments |
| **Proximity (Gestalt)** | Each medicine card groups name, dosage, frequency, and time together inside a bordered card |
| **F-Pattern Layout** | Navbar at top catches eye first, then hero heading on left, features below |
| **Mobile-First** | Sidebar converts to bottom tab bar on mobile; cards stack vertically |
| **Feedback** | "Mark Taken" turns card green instantly; all buttons have hover effects |
| **Consistency** | All primary buttons use teal (#0D7377); Poppins for headings, Inter for body text |
| **Accessibility** | Dark text on light background for contrast; minimum 14px font; clear labels |

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary (Dark Teal) | `#0D7377` | Buttons, links, active states |
| Secondary (Medium Teal) | `#14A085` | Hover states |
| Background | `#F0F8FF` | Page backgrounds |
| Success (Green) | `#27AE60` | "Taken" buttons, active medicine borders |
| Warning (Amber) | `#F39C12` | Streak counter |
| Danger (Red) | `#E74C3C` | Delete buttons, errors |
| Text (Dark Blue) | `#1A3C5E` | All body text and headings |

### Fonts
- **Inter** — Body text (clean, readable, designed for UIs)
- **Poppins** — Headings (geometric, modern)

---

## 2C. Technology Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | React.js + Vite | Component-based UI with fast dev server |
| Styling | Tailwind CSS | Utility-first CSS for rapid development |
| Routing | React Router DOM | Client-side page navigation |
| Backend | Node.js + Express.js | JavaScript on server; simple API creation |
| Database | MongoDB + Mongoose | Flexible document storage with schema validation |
| Auth | JWT (jsonwebtoken) + bcryptjs | Stateless authentication with password hashing |
| Smart API | localStorage fallback | App works without backend server using browser storage |
| Version Control | Git + GitHub | Code collaboration and version tracking |
| Hosting (planned) | Vercel (frontend) + Render (backend) | Free hosting with auto-deploy from GitHub |

---

## 2D. Deployment Plan

1. Push code to GitHub (frontend + backend repos)
2. Create free MongoDB Atlas cluster for cloud database
3. Deploy Node.js backend to Render (free tier)
4. Deploy React frontend to Vercel (free tier)
5. Configure environment variables on both platforms
6. Test live URL across Chrome, Firefox, Safari, and mobile

---

## 2E. Data Flow

### How Data Flows Through MediRemind

1. **User registers/logs in** → Frontend sends credentials to `/api/auth` → Backend validates and returns JWT token
2. **User adds medicine** → Frontend sends data to `/api/medicines` → Backend saves to MongoDB → Returns saved record
3. **Dashboard loads** → Frontend calls `/api/medicines` and `/api/appointments` → Displays active medicines and upcoming appointments
4. **User marks medicine as taken** → Frontend updates the card UI immediately (client-side state)
5. **Offline mode** → If backend is unavailable, all data operations fall back to localStorage automatically

---

# SECTION 3 — IMPLEMENTATION STATUS (1 Mark)

---

## 3A. What's Built

| # | Component | Status | Built By |
|---|-----------|--------|----------|
| 1 | Project setup (React + Vite + Tailwind) | ✅ Done | Avinash |
| 2 | Navbar (sticky, responsive, hamburger menu) | ✅ Done | Nitish |
| 3 | Footer (links, contact info) | ✅ Done | Nitish |
| 4 | Home page (hero, features, how-it-works) | ✅ Done | Nitish |
| 5 | Login page (validation, show/hide password) | ✅ Done | Animesh |
| 6 | Register page (role selector, terms checkbox) | ✅ Done | Animesh |
| 7 | Sidebar (desktop sidebar + mobile tab bar) | ✅ Done | Animesh |
| 8 | Dashboard (greeting, medicines, appointments, stats) | ✅ Done | Avinash |
| 9 | Medicine Tracker (search, add/delete, cards) | ✅ Done | Animesh |
| 10 | Appointment Manager (add/delete, view details) | ✅ Done | Animesh |
| 11 | Calendar page (month grid, appointment dots) | ✅ Done | Avinash |
| 12 | Profile page (user info, stats, logout) | ✅ Done | Avinash |
| 13 | About Us page (team cards, mission) | ✅ Done | Rahul |
| 14 | Backend API (Express + JWT auth) | ✅ Done | Avinash, Amit |
| 15 | MongoDB models (User, Medicine, Appointment) | ✅ Done | Amit |
| 16 | Smart API with localStorage fallback | ✅ Done | Avinash |
| 17 | Caregiver Panel | 🔄 Planned | Avinash |
| 18 | Email Notifications | 🔄 Planned | Avinash, Amit |
| 19 | Deployment | 🔄 Planned | All |

---

## 3B. Page Descriptions

### Home Page
Hero section with bold heading "Never Miss a Dose. Never Miss an Appointment." in dark blue/teal, two CTA buttons, and animated health icons. Below: 4 feature cards in a grid, 3-step "How It Works" section. Fully responsive — stacks vertically on mobile.

> 📸 *Screenshot: Open the app at `http://localhost:5173/` to see the Home page*

### Login Page
Centered white card with email and password inputs. Real-time validation — red border for invalid input, green for valid. Show/hide password toggle. Full-width teal "Login" button.

> 📸 *Screenshot: Navigate to `/login` to see the Login page*

### Register Page
Similar layout to Login. Fields: Full Name, Email, Password, Confirm Password. Two clickable role cards ("Patient" / "Caregiver") — selected card gets teal border. Terms checkbox required before submitting.

> 📸 *Screenshot: Navigate to `/register` to see the Register page*

### Dashboard
Fixed sidebar on left (desktop) / bottom tab bar (mobile). Main area shows personalized greeting with today's date. "Today's Medicines" section with horizontal cards — each has "Mark Taken ✓" and "Skip" buttons. "Upcoming Appointments" cards below. Weekly summary stat boxes at the bottom.

> 📸 *Screenshot: Navigate to `/dashboard` to see the Dashboard*

### Medicine Tracker
Search bar filters medicines by name. Card grid shows each medicine with name, dosage, frequency, time, and status (active/completed). Edit and Delete buttons on each card. "Add Medicine" button opens a modal form.

> 📸 *Screenshot: Navigate to `/medicines` to see the Medicine Tracker*

### Appointment Manager
Appointment cards in a responsive grid showing doctor name, specialty badge, date, time, clinic. "View Details" button toggles notes. Delete button removes the appointment. "Add Appointment" button opens a modal form.

> 📸 *Screenshot: Navigate to `/appointments` to see the Appointment Manager*

### Calendar
Interactive monthly calendar with ◀/▶ navigation. Today's date highlighted. Appointment dates marked with dots. Clicking a date shows appointments for that day in a side panel.

> 📸 *Screenshot: Navigate to `/calendar` to see the Health Calendar*

### Profile
User avatar with initials, name, email, and role badge. Two stat cards (Total Medicines, Total Appointments). Account details table. Logout button.

> 📸 *Screenshot: Navigate to `/profile` to see the Profile page*

---

# SECTION 4 — FUTURE WORK & TEAMWORK (1 Mark)

---

## 4A. Remaining Work

| # | Task | Timeline | Who |
|---|------|----------|-----|
| 1 | Caregiver linking system (code-based sharing) | Week 3-4 | Avinash |
| 2 | Email notification system (Nodemailer + cron) | Week 4-5 | Avinash, Amit |
| 3 | Deploy frontend to Vercel + backend to Render | Week 5 | All |
| 4 | Cross-browser and mobile testing | Week 5-6 | All |
| 5 | PWA support (Add to Home Screen) | Week 6 | Nitish |

---

## 4B. Team Contribution Table

| Member | Role | What They Did | What They'll Do Next |
|--------|------|---------------|---------------------|
| Avinash | Backend Developer | Set up Node.js + Express backend. Created API routes for auth, medicines, appointments. Built Dashboard, Calendar, and Profile pages. Implemented smart localStorage fallback API. | Notification system, Caregiver panel, final deployment |
| Nitish | Frontend & UI/UX | Designed Figma wireframes. Built Navbar, Footer, and Home page with responsive layout. | Design polish, mobile testing, PWA setup |
| Animesh Singh Vijay | Frontend & UI/UX | Built Login, Register, Sidebar, Medicine Tracker, and Appointment Manager pages with form validation and modals. | Calendar UI enhancements, caregiver panel interface |
| Amit Kumar Patel | Backend Database | Created MongoDB Atlas cluster. Designed Mongoose schemas for Users, Medicines, Appointments. | Database optimization, complex queries |
| Rahul | Content Generator | Wrote Progress-1 documentation. Created About Us page. Generated dummy data for testing. | Progress-2 docs, presentation slides, user manual |

### Communication Tools

| Tool | Purpose |
|------|---------|
| WhatsApp Group | Daily updates and quick questions |
| GitHub | Code sharing and Pull Request reviews |
| Figma | Wireframe design and UI reviews |
| Google Meet | Weekly team video calls |

---

*End of Progress-1 Documentation Report*

*Prepared by Team MediRemind — Avinash, Nitish, Animesh Singh Vijay, Amit Kumar Patel, Rahul*

*© 2025 MediRemind. All rights reserved.*
