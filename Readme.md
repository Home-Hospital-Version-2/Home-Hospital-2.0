# 🏥 Hospital Scheduler v2.0

> **AI-Enhanced Home Hospital Scheduling System**
>
> Full-stack demo with approval workflow, session swap, and in-app notifications.

---

## ✨ New Features in v2.0

| Feature | Description |
|---------|-------------|
| **Availability with Preferences** | Professionals submit availability with travel/shift preferences |
| **Supervisor Approval Workflow** | Review, approve, modify, or reject availability submissions |
| **Individual Rules** | Set per-professional rules (max travel, overtime, priority patients) |
| **Active Rules System** | Approved availability becomes active scheduling rules |
| **Session Swap** | Professionals can swap sessions (>4 hours before) with eligible colleagues |
| **4-Hour Swap Window** | Swaps automatically disabled within 4 hours of session |
| **In-App Notifications** | Real-time notifications for all role types |
| **Swap Log** | Supervisors can monitor all session swaps |
| **Full Schedule Period View** | View entire 2-week schedule, not just today |

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start the server
npm start

# Open in browser
http://localhost:3000
```

---

## 📋 Workflow Overview

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. PROFESSIONAL submits availability                            │
│    → Days, hours, coverage areas                                │
│    → Preferences (travel: minimal/moderate/flexible)            │
│    → Special notes                                              │
└─────────────────────────┬───────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. SUPERVISOR reviews (Supervisor Dashboard)                    │
│    → Views pending submissions with preferences                 │
│    → APPROVE / MODIFY (direct) / REJECT                        │
│    → Sets individual rules per professional                     │
│    → Approved → becomes Active Rule                            │
└─────────────────────────┬───────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. COORDINATOR generates schedule (Coordinator Dashboard)       │
│    → Views ONLY approved availability                           │
│    → Sees active rules with preferences                         │
│    → Clicks "Run AI Scheduler"                                  │
│    → Exports schedule as CSV                                    │
└─────────────────────────┬───────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. PROFESSIONAL manages sessions (Professional Dashboard)       │
│    → Views full schedule period (2 weeks)                       │
│    → SWAP button (if >4 hours before session)                   │
│    → "Swap window closed" (if ≤4 hours before)                  │
│    → Direct swap with same-specialty colleagues                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🖥️ Dashboards

### 1. Coordinator Dashboard
- View approved staff availability
- View active scheduling rules
- Run AI Scheduler
- Filter and export schedule
- View all scheduled sessions

### 2. Supervisor Dashboard
- Review pending availability submissions
- Approve/Modify/Reject with individual rules
- View swap log
- Monitor staff workload

### 3. Professional Dashboard
- Submit weekly availability with preferences
- View all upcoming sessions (full period)
- Swap sessions with eligible colleagues
- View submission history and status

### 4. Patient Dashboard
- View upcoming visits
- See assigned caregiver details

---

## 🔌 API Endpoints

### Coordinator
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/coordinator` | Get all coordinator data |
| POST | `/api/coordinator/run-scheduler` | Generate optimized schedule |
| GET | `/api/coordinator/export-schedule` | Export schedule as CSV |

### Supervisor
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/supervisor` | Get supervisor overview |
| GET | `/api/supervisor/pending-availability` | Get pending submissions |
| PUT | `/api/supervisor/availability/:id/approve` | Approve with rules |
| PUT | `/api/supervisor/availability/:id/modify` | Modify and approve |
| PUT | `/api/supervisor/availability/:id/reject` | Reject with reason |
| GET | `/api/supervisor/swap-log` | Get all swap records |

### Professional
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/professional/:staffId` | Get professional data |
| POST | `/api/professional/availability/submit` | Submit availability |
| GET | `/api/professional/:staffId/availability` | Get own submissions |
| GET | `/api/professional/swap/eligible/:sessionId` | Get eligible swap staff |
| POST | `/api/professional/swap/execute` | Execute session swap |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications/:type/:id` | Get notifications |
| PUT | `/api/notifications/:id/read` | Mark as read |
| PUT | `/api/notifications/mark-all-read/:type/:id` | Mark all read |

---

## 📊 Mock Data

### Staff (5 professionals)
- Dr. Pekka (Doctor) - Palliative, Infection
- Dr. Teemu (Doctor) - Acute, Geriatrics
- Nurse Nuura - Infection, Palliative
- Nurse Anne - Palliative, Geriatrics
- Nurse Sanna - Acute

### Patients (5 with real Oulu coordinates)
- A. Marika - Oulu (Urgent, Palliative)
- T. Vikke - Oulu (Infection)
- T. Mäki - Kiiminki (Acute)
- Laouri - Kempele (Palliative)
- P. Laine - Oulu (Urgent, Geriatrics/Palliative)

### Locations
- Oulu, Kempele, Kiiminki (real Finnish locations)

---

## 🛠️ Technologies

- **Backend:** Node.js, Express.js
- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **Data:** In-memory (mock data for demo)
- **Fonts:** Inter, Space Grotesk

---

## 📁 File Structure

```
hospital-scheduler-v2/
├── server.js              # Express backend with all API endpoints
├── package.json           # Dependencies
├── README.md              # This file
└── public/
    ├── index.html         # Main HTML with all dashboards
    ├── css/
    │   └── styles.css     # Complete styling
    └── js/
        └── app.js         # Frontend application logic
```

---

## 🚀 Roadmap - Phase 2, 3, 4

### Phase 2: Coordinator Enhancements ✅ (Done in this release)
- Approved availability view
- Active rules display
- Enhanced AI Scheduler

### Phase 3: Swap System ✅ (Done in this release)
- Direct swap with 4-hour validation
- Same specialty matching
- Swap log for supervisors
- Notifications

### Phase 4: Mobile PWA (Coming Next)
- Separate mobile-optimized view
- PWA manifest & service worker
- Offline support
- Touch-friendly UI
- GPS navigation integration

---

## 📝 Notes

- All data is **in-memory** and resets on server restart
- This is a **demo/prototype** for presentations
- No real database or authentication
- Schedule period is 2 weeks by default

---

## 👥 Team

Built by the Home Hospital Team:
- Sujeewa Herath
- Hasitha Hiththatiyage
- Nipuni Kodikara
- Nadeesha Rathnayake


---

**Version:** 2.0.0  
**Last Updated:** January 2025