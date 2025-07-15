# Event Management API

This project is a RESTful API for managing events, users, and registrations, built with Node.js, Express, Sequelize, and PostgreSQL.

## 📝 Features

- Create events with title, date/time, location, and capacity
- Register users for events
- Cancel registrations
- View event details including registered users
- List upcoming events sorted by date and location
- View event statistics (registrations, remaining capacity, percentage used)
- Enforces constraints:
  - No duplicate registrations
  - Cannot register for past events
  - Cannot exceed event capacity

## 🛠 Technologies

- Node.js
- Express
- PostgreSQL
- Sequelize ORM

## 📂 Folder Structure

```
.
├── controllers/       # Route handlers
├── models/            # Sequelize models and associations
├── routes/            # Express routes
├── config/            # Database configuration
├── server.js          # Main application entry
```

## 🚀 Getting Started

### Prerequisites

- Node.js installed
- PostgreSQL database

### Setup

1. Clone the repository:

   ```
   git clone <your-repo-url>
   cd event-manager
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file in the root directory and configure:

   ```
   DB_URL=your_postgres_connection_url
   PORT=8081
   ```

4. Start the server:

   ```
   npm start
   ```

The server will run on `http://localhost:8081`.

---

## 📚 API Endpoints

### Create Event

- **POST /api/events**
- Body:
  ```json
  {
    "title": "Event Title",
    "location": "City",
    "dateTime": "2025-09-01T10:00:00Z",
    "capacity": 100
  }
  ```

---

### Get Event Details

- **GET /api/events/:id**

---

### Register User

- **POST /api/events/:id/register**
- Body:
  ```json
  {
    "userId": 1
  }
  ```

---

### Cancel Registration

- **DELETE /api/events/:id/register/:userId**

---

### Get Event Statistics

- **GET /api/events/:id/stats**

---

### List Upcoming Events

- **GET /api/events/upcoming**

---

## 🧠 Additional Notes

- All responses include a `success` flag and a message.
- Uses transactions and row locking to handle concurrent registrations safely.
- Input validation prevents invalid data.
- Custom sorting by date and location for upcoming events.

---

## ✨ Author

- Built for the Event Management Coding Challenge
