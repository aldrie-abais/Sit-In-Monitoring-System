# Changelog

All notable changes to this project will be documented in this file.

This project adheres to [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) standards.

## [Unreleased]

### Added
- **Analytics Charts on Admin Dashboard** — Two animated charts powered by `chart.js` + `react-chartjs-2`:
  - **Donut Chart** — "Sit-In Hours Distribution" showing percentage breakdown of total sit-in hours per student (top 10 + Others)
  - **Bar Chart** — "Top Students by Sit-In Hours" showing ranked bars with animated grow-in effect
- Created `AnalyticsCharts.jsx` reusable component with full dark mode support, custom tooltips, and re-animation on page navigation
- Created `get_analytics.php` backend endpoint — calculates top 10 students by total sit-in hours from `sit_in_history`, with percentage breakdown and "Others" bucket
- Charts display a professional empty state when no sit-in history data exists
- Installed `chart.js` and `react-chartjs-2` dependencies

## [2026-05-19] — Dark Mode UI Audit (Complete)

### Fixed
- **Complete Dark Mode Audit** — Systematically applied `isDark` conditional styling to every card, modal, table, input, dropdown, and container across the entire application.

### Pages Updated
- `AdminDashboard.jsx` — Announcement textarea, announcement cards, post section
- `AdminReservation.jsx` — All 3 columns (Labs, Pending Queue, System Log), lab cards, pending request cards, system log cards, PC Status Management modal (header, grid area, footer)
- `AdminSoftware.jsx` — Page title, subtitle, all software cards (icon bg, text, lab tags, delete button)
- `AdminStudents.jsx` — Title, search/entries controls, data table (thead, tbody rows, footer)
- `AdminRecords.jsx` — Title, search input, data table, feedback modal (textarea, buttons)
- `Reservation.jsx` — Page title, lab cards (selected/unselected/unavailable states), reservation form (labels, inputs), request cards, PC Grid Selection modal, Reservation Detail modal
- `StudentHistory.jsx` — Title, subtitle, table wrapper, thead, tbody rows

### Modals Updated
- `LogoutModal.jsx` — Both admin (simple) and student (with summary) variants, added `isDark` from localStorage
- `SearchStudentModal.jsx` — Container, input, suggestion dropdown items
- `SitInFormModal.jsx` — Container, header, all labels/inputs, purpose & lab dropdowns, PC grid area, footer
- `FeedbackModal.jsx` — Container, icon area, feedback content area
- `EditAnnouncementModal.jsx` — Container, header, textarea, cancel button
- `AddSoftwareModal.jsx` — Container, all form labels/inputs/textareas/selects, lab deployment checkboxes, cancel button

### Design Tokens Used
- **Page background**: `bg-[#0f0520]`
- **Card/modal surface**: `bg-[#1e0838]`
- **Inner widget/section**: `bg-[#2d114d]/50`
- **Border**: `border-purple-500/20`
- **Text primary**: `text-white`, `text-purple-100`
- **Text secondary**: `text-purple-200`, `text-purple-300`
- **Text muted**: `text-purple-400`
- **Input fields**: `bg-white/5 border-purple-500/20 text-purple-100`
- **Accent**: `text-[#c89b2a]`

### Added
- Integrated the styled **Logout Modal** across all admin pages (`AdminDashboard.jsx`, `AdminReservation.jsx`, `AdminSoftware.jsx`, `AdminStudents.jsx`, `AdminRecords.jsx`) to confirm admin logout.
- Added role checking in `LogoutModal` to support both administrators and students gracefully.
- Created **Add Software** feature on the Admin Software page (moved from Reservation page), including the `AddSoftwareModal` dynamic popup form to add new software and schedule multi-classroom lab deployments.
- Implemented `add_software.php` backend API endpoint with self-healing database schema migrations to seamlessly handle software version, license type, installation date, and deployment notes.
- Implemented **Delete Software** feature on each software card, allowing deletion from the `softwares` table and clean up of `lab_softwares` table mappings.
- Implemented `delete_software.php` backend API endpoint to delete software records and related lab deployments cleanly.

### Changed
- Relocated the styled **Current Session** duration display in `LogoutModal.jsx` to be positioned cleanly above the *Your Sit-In Summary* box, rendering unconditionally.
- Simplified **Admin Logout Modal** to only show a minimal confirmation ("Ready to leave? Are you sure you want to log out?") and Cancel/Log Out buttons, removing all session, summary, and current session tracking details completely.

### Fixed
- Fixed a bug where **Current Session** was not displaying in the logout modal for users without active/ongoing lab sessions; it now fallback displays `—` correctly.
- Resolved a bug where the **Admin Logout Modal** fallback displayed the Student summary view instead of the simplified confirmation window; fixed the admin identifier check to be case-insensitive and support both `user.role` and `user.user_role` fields dynamically.

---

## [1.0.0] - 2025-05-17

Initial release of the Sit-In System — a web-based computer lab session management system for students and administrators.

### Added

#### Authentication & User Management
- Student registration with first name, last name, middle name, course level, course name, email, address, and password
- Admin registration via dedicated `admin_register.php`
- Login and logout functionality with PHP session handling (`login.php`, `logout.php`)
- Session validation on protected routes via `check_session.php`
- Profile editing for students (`edit_profile.php`)

#### Sit-In Session Management
- Students can log a sit-in session with purpose and lab selection (`sit_in.php`)
- Active session tracking with real-time status (`get_active_students.php`)
- Session ending and time-out logging (`end_session.php`)
- Each student starts with **30 remaining sessions** by default
- Bulk session reset for all students (`reset_all_sessions.php`)
- Student sit-in history per user (`get_student_history.php`)

#### Admin Features
- Admin dashboard with summary statistics (`get_dashboard_stats.php`)
- View and manage all registered students (`get_all_students.php`, `AdminStudents.jsx`)
- Edit individual student records (`edit_student.php`, `AdminRecords.jsx`)
- Search students by name or ID (`search_student.php`)
- Post, edit, and view announcements (`post_announcement.php`, `edit_announcement.php`, `get_announcements.php`)

#### Notifications
- Per-user notification system with read/unread state (`get_notifications.php`, `mark_notification_read.php`)
- Notification dropdown component in the UI (`NotificationDropdown.jsx`)
- Notifications table initialization script (`init_notifications_table.php`)

#### Frontend Pages
- `Landing.jsx` — public landing / login page
- `Dashboard.jsx` — student dashboard
- `StudentHistory.jsx` — student's personal sit-in history
- `AdminDashboard.jsx` — admin overview and statistics
- `AdminStudents.jsx` — admin student management
- `AdminRecords.jsx` — admin records and session logs

#### Backend (PHP Scripts)
- `db.php` — PDO MySQL database connection
- `api.php` — general API entry point
- `login.php` — user authentication
- `logout.php` — session destruction
- `register.php` — student registration
- `admin_register.php` — admin account registration
- `check_session.php` — session guard for protected routes
- `sit_in.php` — log a new sit-in session
- `end_session.php` — end an active sit-in session
- `get_active_students.php` — fetch currently active sit-in sessions
- `get_all_students.php` — fetch all registered students
- `get_dashboard_stats.php` — fetch admin dashboard statistics
- `get_announcements.php` — fetch all announcements
- `get_notifications.php` — fetch notifications for a user
- `get_student_history.php` — fetch sit-in history for a student
- `post_announcement.php` — create a new announcement
- `edit_announcement.php` — update an existing announcement
- `edit_profile.php` — update student profile
- `edit_student.php` — admin update of a student record
- `search_student.php` — search students by keyword
- `mark_notification_read.php` — mark notification(s) as read
- `reset_all_sessions.php` — reset remaining sessions for all students
- `init_notifications_table.php` — initialize the notifications table

#### Database
- `users` table — stores student and admin accounts with role, session count, and activity status
- `sit_in_history` table — logs all sit-in sessions with purpose, lab, time in/out, status, and feedback
- `announcements` table — stores admin-posted announcements with timestamp
- `notifications` table — stores per-user notifications with read state and type

#### Frontend Infrastructure
- React 19 with React Router v7 for client-side routing
- Tailwind CSS v4 for styling
- Vite v7 as the build tool and dev server
- ESLint configured for React with hooks and refresh plugins

---

## How to Add a New Entry

When making changes, add a new version block at the top (below `[Unreleased]`) using this format:

```markdown
## [1.1.0] - YYYY-MM-DD

### Added
- Brief description of new feature or file

### Changed
- Brief description of what was modified and why

### Fixed
- Brief description of bug and what was corrected

### Removed
- Brief description of what was deleted and why
```

> Only include sections that are relevant to the release. Omit empty sections.

--------------------------------------------------------------------------------------------------------------

## [Unreleased] - 2026-05-17

### Added
- `Reservation.jsx` — Overhauled reservation flow: Replaced the lab dropdown with interactive lab cards, introduced a PC grid modal for multi-PC selection based on actual physical lab coordinates, and changed the reservations table to standalone request cards with detail modals.
- `Reservation.jsx` — Implemented a frontend calculation override for the PC grid layout, distributing PCs strictly into 7 rows per column (ignoring the backend's 8-row structure) to naturally force a perfectly filled 4-major-column layout.
- Database: Created new `labs` and `pcs` tables to support per-lab PC tracking, including physical grid positioning (`row_position`, `col_position`) for future PC selection integration.
- Database: Executed an `ALTER TABLE` to add an `is_available BOOLEAN NOT NULL DEFAULT TRUE` column to the `labs` table to track lab status independently from PCs.
- `get_labs.php` — Created a new API endpoint to fetch all available labs (`is_available = TRUE`).
- `get_pcs_by_lab.php` — Created a new API endpoint to fetch PCs for a specific lab, with optional status filtering.
- `create_lab_schema.php` — Built and executed a script to seed 6 specific labs (524, 526, 528, 530, 542, 544), auto-generating 44-46 PCs per lab mapped to an 8-row layout, all defaulting to an "Available" status.
- `FeedbackModal.jsx` — Created a new reusable modal component to view admin feedback for a specific history record.
- `LogoutModal.jsx` — Added a "Current Session" row that dynamically appears during active sit-ins to show exactly how much time the student has spent in their current active session, preventing confusion with all-time historical totals.
- `Reservation.jsx` — new student-side reservation page with a form for purpose, laboratory, date, and time selection.
- `/reservation` protected route added to `App.jsx` for student role.
- `LogoutModal.jsx` — Created a new reusable confirmation modal for logging out, displaying computed sit-in statistics fetched from the server.
- `Reservation.jsx` — Added a "My Reservation Requests" card below the form to display the student's reservation history using a scrolling table with alternating row colors and dynamically styled status badges.
- Database: Created a new `reservations` table (id, user_id, lab, purpose, reservation_date, reservation_time, status) to store student reservation requests.
- `create_reservation.php` — new backend endpoint to handle creating reservation records in the database.
- `get_reservations.php` — new backend endpoint to fetch a student's reservation history from the database.

### Changed
- `Dashboard.jsx`, `StudentHistory.jsx`, `Reservation.jsx` — integrated `LogoutModal` to intercept the logout button click, presenting the user with their sit-in summary before confirming logout.
- `Dashboard.jsx` — updated "Reservation" nav item from a "Coming Soon" modal trigger to a functional `<Link>`.
- `StudentHistory.jsx` — same navigation update as Dashboard; removed `showReservationSoon` state and `FeatureComingSoonModal` references.
- `StudentHistory.jsx` — Modified the history table columns: Removed the inline "Admin Feedback" column and replaced it with a comment icon button that opens the new `FeedbackModal`.
- `StudentHistory.jsx` — Inserted placeholder columns for "Duration" and "PC Number" to match the updated column order requirements.
- `Reservation.jsx` — Updated the Purpose dropdown options to include the specific list of software/purposes required for lab sessions.
- `Reservation.jsx` — Reordered form to make "Laboratory" the first input and restricted options to `524, 526, 528, 530, 542, 544`.

### Fixed
- `LogoutModal.jsx` — Fixed a bug where total sit-in hours and session durations were calculated incorrectly (showing 23+ hours) due to improper parsing of AM/PM time strings by using a robust `Date` object parsing logic.
- `LogoutModal.jsx` — Fixed an issue where the currently active session (no `time_out` yet) was excluded from the statistics. Total Sit-In Hours, Average Session, and Longest Session now include ongoing live time.
- `LogoutModal.jsx` — Fixed time parsing failure when database time strings include date fragments (e.g., full ISO strings) by expanding the `Date` constructor fallback.
- `LogoutModal.jsx` — Fixed "Sessions Left" stalling on old localStorage data by querying `check_session.php` to instantly reflect real-time updates made by admins.
- `Reservation.jsx` — Implemented dynamic visibility so that Purpose, Date, and Time inputs only appear after a laboratory is selected.
- `Reservation.jsx` — Overhauled UI styling to strictly adhere to the mandatory UI Consistency Rule, standardizing the centered title block and card layout.
- `Reservation.jsx` — Added row expansion UI state to the reservations table, revealing details for Lab and Purpose matching the backend data.
- `Reservation.jsx` — Updated table headers in the requests card to use the deep purple color `#4a0080` for strict UI consistency.
- `Reservation.jsx` — Implemented dynamic filtering for the Purpose dropdown; it now properly populates with available software based on the selected laboratory room and resets correctly when the lab changes.
- `Reservation.jsx` — Disabled and grayed out the Purpose dropdown when no laboratory is selected, following strict UI rules.
- `Reservation.jsx` — Removed mock data and integrated fetch calls to `create_reservation.php` and `get_reservations.php` to handle reservations dynamically.
