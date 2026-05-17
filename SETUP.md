# Sit-In System — Developer Setup Guide

> **Role:** New developer onboarding
> **Rule:** Do not modify existing logic or architecture. This guide is for environment setup only.

---

## Prerequisites

Install the following tools before proceeding.

| Tool | Version | Download |
|------|---------|----------|
| Node.js | v18 or higher | https://nodejs.org |
| XAMPP | Latest | https://www.apachefriends.org |
| Git | Latest | https://git-scm.com |

> **Why XAMPP?** The backend runs on plain PHP with PDO + MySQL. XAMPP bundles Apache and MySQL locally on Windows with zero configuration overhead.

---

## 1. Clone the Repository

```bash
git clone <your-repository-url>
cd sit-in-system
```

> If you received the project as a ZIP, extract it and open the folder in VS Code.

---

## 2. Start XAMPP

1. Open **XAMPP Control Panel**
2. Start **Apache** and **MySQL**
3. Confirm both show green status indicators

---

## 3. Set Up the Database

### 3a. Open phpMyAdmin

Navigate to: [http://localhost/phpmyadmin](http://localhost/phpmyadmin)

### 3b. Create the Database

Click **New** in the left sidebar, enter the database name, then click **Create**.

```
Database name: sit_in_db
```

### 3c. Create the Tables

Select `sit_in_db`, click the **SQL** tab, paste the following, and click **Go**.

```sql
-- Users table
CREATE TABLE users (
  user_id INT(11) NOT NULL AUTO_INCREMENT,
  user_first_name VARCHAR(20) NOT NULL,
  user_last_name VARCHAR(20) NOT NULL,
  user_middle_name VARCHAR(20) NOT NULL,
  user_course_level VARCHAR(2) NOT NULL,
  user_course_name VARCHAR(20) NOT NULL,
  user_email VARCHAR(30) NOT NULL,
  user_address VARCHAR(100) NOT NULL,
  user_password VARCHAR(20) NOT NULL,
  user_is_active TINYINT(1) DEFAULT 0,
  is_created_at TIMESTAMP NOT NULL DEFAULT current_timestamp(),
  is_updated_at TIMESTAMP NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  remaining_sessions INT(11) NOT NULL DEFAULT 30,
  role VARCHAR(20) NOT NULL DEFAULT 'Student',
  PRIMARY KEY (user_id)
);

-- Sit-in history table
CREATE TABLE sit_in_history (
  history_id INT(11) NOT NULL AUTO_INCREMENT,
  user_id INT(11) NOT NULL,
  purpose VARCHAR(100) NOT NULL,
  lab VARCHAR(50) NOT NULL,
  time_in DATETIME DEFAULT current_timestamp(),
  time_out DATETIME DEFAULT NULL,
  status VARCHAR(20) DEFAULT 'Active',
  sessions_left INT(11) DEFAULT NULL,
  feedback TEXT DEFAULT NULL,
  PRIMARY KEY (history_id)
);

-- Announcements table
CREATE TABLE announcements (
  id INT(11) NOT NULL AUTO_INCREMENT,
  admin_name VARCHAR(100) DEFAULT 'CCS Admin',
  content TEXT NOT NULL,
  date_posted DATETIME DEFAULT current_timestamp(),
  PRIMARY KEY (id)
);

-- Notifications table
CREATE TABLE notifications (
  id INT(11) NOT NULL AUTO_INCREMENT,
  user_id INT(11) NOT NULL,
  type VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  is_read TINYINT(4) DEFAULT 0,
  created_at TIMESTAMP DEFAULT current_timestamp(),
  PRIMARY KEY (id),
  KEY user_id (user_id),
  KEY is_read (is_read)
);
```

---

## 4. Configure the Backend

Open `server/db.php` and update the credentials to match your local MySQL setup.

```php
<?php
$host = 'localhost';
$db   = 'sit_in_db';
$user = 'root';      // Default XAMPP MySQL user
$pass = '';          // Default XAMPP MySQL password is empty
$charset = 'utf8mb4';
```

> **Default XAMPP credentials:** username is `root`, password is blank. If you changed these during XAMPP setup, use your own credentials.

---

## 5. Serve the Backend via XAMPP

Place the entire project folder inside XAMPP's web root directory.

```
C:\xampp\htdocs\sit-in-system\
```

Your backend PHP scripts will then be accessible at:

```
http://localhost/sit-in-system/server/
```

> Example: `http://localhost/sit-in-system/server/login.php`

---

## 6. Set Up the Frontend

Open a terminal in the `Client/` directory.

### 6a. Install Dependencies

```bash
cd Client
npm install
```

### 6b. Configure the API Base URL

The frontend communicates with the PHP backend via HTTP. Locate where the API base URL is defined in the source (likely in `App.jsx` or a constants file) and confirm it points to your local backend:

```
http://localhost/sit-in-system/server/
```

> If no central config exists, search for `localhost` or `api.php` across the `src/` folder to find where requests are made.

### 6c. Start the Development Server

```bash
npm run dev
```

Vite will output a local URL, typically:

```
http://localhost:5173
```

Open that URL in your browser.

---

## 7. Verify the Setup

Work through this checklist to confirm everything is running correctly.

- [ ] XAMPP Apache and MySQL are both running
- [ ] `sit_in_db` database exists with all 4 tables (`users`, `sit_in_history`, `announcements`, `notifications`)
- [ ] `server/db.php` credentials match your local MySQL
- [ ] Project folder is inside `C:\xampp\htdocs\`
- [ ] `npm install` completed without errors inside `Client/`
- [ ] `npm run dev` starts without errors
- [ ] Landing page loads at `http://localhost:5173`
- [ ] Registration or login makes a successful API call (check browser DevTools → Network tab for any errors)

---

## Project Structure Reference

```
sit-in-system/
├── Client/                      # React frontend
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       │   └── modal/
│       │       └── NotificationDropdown.jsx
│       ├── pages/
│       │   ├── AdminDashboard.jsx
│       │   ├── AdminRecords.jsx
│       │   ├── AdminStudents.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Landing.jsx
│       │   └── StudentHistory.jsx
│       ├── uploads/
│       ├── App.css
│       ├── App.jsx
│       ├── index.css
│       └── main.jsx
│
└── server/                      # PHP backend (plain PHP + PDO)
    ├── db.php                   ← Database connection config
    ├── api.php
    ├── login.php
    ├── register.php
    ├── logout.php
    ├── check_session.php
    ├── end_session.php
    ├── sit_in.php
    ├── get_active_students.php
    ├── get_all_students.php
    ├── get_announcements.php
    ├── get_dashboard_stats.php
    ├── get_notifications.php
    ├── get_student_history.php
    ├── post_announcement.php
    ├── edit_announcement.php
    ├── edit_profile.php
    ├── edit_student.php
    ├── search_student.php
    ├── mark_notification_read.php
    ├── reset_all_sessions.php
    ├── init_notifications_table.php
    ├── admin_register.php
    └── ...
```

---

## Common Issues

**Apache port conflict**
If Apache fails to start, port 80 may be in use (commonly by IIS or another server).
Go to XAMPP → Apache → Config → `httpd.conf` and change `Listen 80` to `Listen 8080`. Update your backend URL accordingly.

**MySQL access denied**
Double-check the `$user` and `$pass` values in `db.php`. Default XAMPP credentials are `root` / *(empty)*.

**CORS errors in the browser**
The PHP scripts may need CORS headers. Check if `api.php` or individual scripts already include:
```php
header("Access-Control-Allow-Origin: http://localhost:5173");
```
Do not add or modify these headers without confirming with the team — this guide is read-only for existing logic.

**`npm install` fails**
Ensure Node.js v18+ is installed. Run `node -v` to confirm.

---

## Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, React Router v7, Tailwind CSS v4, Vite |
| Backend | PHP (plain, no framework), PDO |
| Database | MySQL via XAMPP |
| Dev Environment | Windows + XAMPP + Node.js |
