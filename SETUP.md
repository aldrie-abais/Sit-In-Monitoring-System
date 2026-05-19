# Sit-In System — Developer & Deployment Setup Guide

> **Role:** New developer onboarding / Deployment guide
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
4. If Apache uses port 8080 (which is the default configuration for this project), ensure it is running on 8080. If not, configure XAMPP Apache to listen on port 8080.

---

## 3. Set Up the Database

### 3a. Open phpMyAdmin

Navigate to: [http://localhost:8080/phpmyadmin](http://localhost:8080/phpmyadmin) (or `http://localhost/phpmyadmin` if using default port).

### 3b. Create the Database

Click **New** in the left sidebar, enter the database name, then click **Create**.

```
Database name: sit_in_db
```

### 3c. Run the Migration Script

Instead of running PHP scripts individually, you can use the complete migration script provided in the repository.

1. Select `sit_in_db` in phpMyAdmin.
2. Click the **Import** tab.
3. Choose the file: `server/migration.sql` from your project folder.
4. Click **Import** (or **Go**) at the bottom.

This script will automatically:
- Drop existing tables (if any)
- Create all required tables in the correct order to respect foreign key constraints
- Pre-populate all required configuration data (Default Admin, 6 Labs, PCs, Softwares, and Lab Software assignments)

> **Note:** The `migration.sql` script does NOT include dummy student data to ensure a clean slate for production.

---

## 4. Configure the Backend

Open `server/db.php` and update the credentials to match your local MySQL setup.

```php
<?php
$host = '127.0.0.1';
$port = '3306';      // Change to 3307 if your XAMPP MySQL uses it
$db   = 'sit_in_db';
$user = 'root';      // Default XAMPP MySQL user
$pass = '';          // Default XAMPP MySQL password is empty
$charset = 'utf8mb4';
```

> **Default XAMPP credentials:** username is `root`, password is blank. If you changed these during XAMPP setup, use your own credentials.

---

## 5. Serve the Backend via XAMPP

Place the entire project folder inside XAMPP's web root directory (if not already there).
Or configure your Apache DocumentRoot to point to your project folder.
The easiest method during development is using PHP's built in server from the `server` directory:

```bash
cd server
php -S localhost:8080
```

Your backend PHP scripts will then be accessible at:
```
http://localhost:8080/api.php
```

> The frontend defaults to requesting `http://localhost:8080/api/` (proxied in Vite to `http://localhost:8080/`).

---

## 6. Set Up the Frontend

Open a terminal in the `Client/` directory.

### 6a. Install Dependencies

```bash
cd Client
npm install
```

### 6b. Start the Development Server

```bash
npm run dev
```

Vite will output a local URL, typically:

```
http://localhost:5173
```

Open that URL in your browser.

---

## 7. Access the System

- **Student Portal:** Access the landing page at `http://localhost:5173`
- **Admin Dashboard:** Access at `http://localhost:5173/admin` or login using the default admin credentials:
  - **Email / ID:** admin123
  - **Password:** admin

---

## 8. Verify the Setup

Work through this checklist to confirm everything is running correctly.

- [ ] XAMPP Apache and MySQL are both running
- [ ] `sit_in_db` database exists with all tables created from `migration.sql`
- [ ] `server/db.php` credentials match your local MySQL
- [ ] `npm install` completed without errors inside `Client/`
- [ ] `npm run dev` starts without errors
- [ ] Landing page loads at `http://localhost:5173`
- [ ] Registration or login makes a successful API call (check browser DevTools → Network tab for any errors)

---

## Common Issues

**Database connection failed (Target machine actively refused it)**
Ensure MySQL is running in XAMPP. Double check the `$port` value in `db.php`. Some XAMPP installations use `3306` (default), while others use `3307`.

**MySQL access denied**
Double-check the `$user` and `$pass` values in `db.php`. Default XAMPP credentials are `root` / *(empty)*.

**CORS errors in the browser**
The PHP scripts use wildcard `Access-Control-Allow-Origin: *` to prevent CORS issues. Ensure the PHP development server is running on the correct port (8080).

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
