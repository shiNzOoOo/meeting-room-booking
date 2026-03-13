# Smart Meeting Room Booking System

A complete business application for managing and booking meeting rooms. Built with a pristine **.NET 10 Web API** backend, an **Angular 18** frontend, and a **MySQL** database.

The application features full Role-Based Access Control (RBAC), overlap-prevention, comprehensive dashboard logic, and a premium Glassmorphic UI design.

---

## 📸 Overview
* **Admin Role**: Manage available rooms, view global booking schedules, monitor all registered users, and delete bookings.
* **User Role**: View active rooms, book specific date/time slots, view personal booking history.
* **Smart Validation**: The system actively prevents double-booking using robust math (`StartTime < end && EndTime > start`) computed directly in the EF Core context.

## 🛠️ Technology Stack
* **Backend**: .NET 10 ASP.NET Core Web API, Entity Framework Core (Database-First), `BCrypt.Net-Next`, JWT Bearer Tokens.
* **Frontend**: Angular 18 (Standalone Components, Reactive Forms, Guards, Interceptors). Vanilla CSS.
* **Database**: MySQL Server 8.0.

---

## 🚀 Getting Started

To run this project locally, you will need **.NET 9+ SDK**, **Node.js + Angular CLI**, and **MySQL Server**.

### 1. Database Setup
A full database dump containing the tables and seeded demo accounts is included in the `/database` folder.

1. Open your MySQL command line or Workbench.
2. Run the included SQL file to create the schema and seed the initial data:
   ```bash
   mysql -u root -p < database/schema_and_data.sql
   ```
*(If your local MySQL root password is not `root`, or you have no password, update the connection string in `MeetingRoomAPI/appsettings.json` and `appsettings.Development.json` to match your local config!)*

---

### 2. Backend (.NET Web API) Setup

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd MeetingRoomAPI
   ```
2. Build the application and fetch dependencies:
   ```bash
   dotnet build
   ```
3. Run the API:
   ```bash
   dotnet run
   ```
   *The API will start running on `http://localhost:5158`. You can view the Swagger UI at `http://localhost:5158/swagger`.*

---

### 3. Frontend (Angular) Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd meeting-room-app
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Angular development server:
   ```bash
   npm start
   ```
   *The browser will be accessible at `http://localhost:4200`.*

---

## 🔑 Demo Accounts

The database `schema_and_data.sql` comes pre-seeded with the following accounts so you can test the application immediately:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@system.com` | `Admin@123` |
| **User** | `test@test.com` | `test123` |

*(We recommend logging in as the Admin first to see the Admin Dashboard, which includes the 4 pre-seeded meeting rooms!)*

---
## 📄 License
This codebase is intended as an architectural mockup and portfolio design. Feel free to clone, edit, and utilize internally.
