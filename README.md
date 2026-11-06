# 📋 DeadlineDesk — College Assignment Tracker

A full-stack MERN web application that helps college students organise assignments, manage submission deadlines, and track completion status.

---

## Problem Statement

College students often struggle to keep track of multiple assignments across different subjects. Due dates get missed, priorities are unclear, and there's no single place to view everything at once. DeadlineDesk solves this by providing a clean, centralised dashboard to manage all assignments in one place.

---

## Project Objectives

- Allow students to add, view, edit, and delete assignments
- Display assignment status (Pending / Completed / Overdue)
- Show dashboard statistics calculated from live database data
- Enable search and filtering by title, subject, and status
- Provide a fully responsive interface usable on mobile and desktop

---

## Technologies Used

| Layer      | Technology                         |
|------------|------------------------------------|
| Frontend   | React.js (Vite), React Router, Axios, Lucide React, CSS |
| Backend    | Node.js, Express.js                |
| Database   | MongoDB Atlas (via Mongoose)       |
| Dev Tools  | Nodemon, dotenv                    |
| Deployment | Vercel (frontend), Render (backend) |

---

## Features

- ✅ Dashboard with live statistics (total, pending, completed, overdue)
- ✅ Add, edit, delete assignments (full CRUD)
- ✅ Search assignments by title
- ✅ Filter by subject and status
- ✅ Mark assignments as completed
- ✅ Overdue detection (calculated from due date, not stored)
- ✅ Upcoming deadlines widget (next 7 days)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Form validation (client-side and server-side)
- ✅ Loading and error states
- ✅ Empty state illustrations
- ✅ Delete confirmation modal

---

## MERN Architecture

```
Browser (React)
     │
     │ HTTP (Axios)
     ▼
Express.js Server (Node.js)
     │
     │ Mongoose ODM
     ▼
MongoDB Atlas (Cloud Database)
```

---

## Database Schema

**Collection:** `assignments`

| Field       | Type     | Required | Notes                              |
|-------------|----------|----------|------------------------------------|
| title       | String   | Yes      | Max 200 chars                      |
| subject     | String   | Yes      | Max 100 chars                      |
| description | String   | No       | Max 1000 chars                     |
| dueDate     | Date     | Yes      | Used for overdue calculation       |
| status      | String   | No       | "Pending" (default) or "Completed" |
| createdAt   | Date     | Auto     | Added by Mongoose timestamps       |
| updatedAt   | Date     | Auto     | Added by Mongoose timestamps       |

> **Note:** "Overdue" is not a stored status. It is calculated at runtime:  
> `overdue = (status === "Pending") && (dueDate < today)`

---

## API Endpoints

| Method | Endpoint                    | Description                         |
|--------|-----------------------------|-------------------------------------|
| GET    | /api/health                 | Backend health check                |
| GET    | /api/assignments            | Get all assignments (supports ?search, ?subject, ?status) |
| POST   | /api/assignments            | Create a new assignment             |
| GET    | /api/assignments/stats      | Get dashboard statistics            |
| GET    | /api/assignments/:id        | Get a single assignment             |
| PUT    | /api/assignments/:id        | Update an assignment                |
| DELETE | /api/assignments/:id        | Delete an assignment                |

---

## Folder Structure

```
deadlinedesk/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   └── assignmentController.js  # All CRUD logic
│   ├── middleware/
│   │   └── errorHandler.js    # Centralised error handling
│   ├── models/
│   │   └── Assignment.js      # Mongoose schema
│   ├── routes/
│   │   └── assignmentRoutes.js # Express route definitions
│   ├── .env.example           # Environment variable template
│   ├── .gitignore
│   ├── package.json
│   ├── seed.js                # Optional: insert sample data
│   └── server.js              # Entry point
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── assets/
│   │   │   └── styles/
│   │   │       └── global.css     # All styles
│   │   ├── components/
│   │   │   ├── AssignmentCard.jsx # Single assignment card
│   │   │   ├── DeleteModal.jsx    # Confirmation dialog
│   │   │   ├── EmptyState.jsx     # Empty list placeholder
│   │   │   ├── LoadingSpinner.jsx # Loading indicator
│   │   │   ├── PageHeader.jsx     # Top bar with title
│   │   │   ├── Sidebar.jsx        # Navigation sidebar
│   │   │   └── StatCard.jsx       # Dashboard stat card
│   │   ├── pages/
│   │   │   ├── AssignmentForm.jsx     # Add / Edit form
│   │   │   ├── Assignments.jsx        # All assignments list
│   │   │   ├── CompletedAssignments.jsx
│   │   │   ├── Dashboard.jsx          # Home page
│   │   │   └── PendingAssignments.jsx
│   │   ├── services/
│   │   │   └── api.js             # Axios API functions
│   │   ├── App.jsx                # Routes
│   │   └── main.jsx               # Entry point
│   ├── .env.example
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## Installation & Setup

### Prerequisites

- Node.js v18 or higher
- A MongoDB Atlas account (free tier works fine)
- Git

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/deadlinedesk.git
cd deadlinedesk
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Edit `backend/.env` and add your MongoDB Atlas URI:

```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/deadlinedesk?retryWrites=true&w=majority
PORT=5000
FRONTEND_URL=http://localhost:5173
```

> **How to get a MongoDB URI:**  
> 1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free account  
> 2. Create a free M0 cluster  
> 3. Click "Connect" → "Drivers" → copy the connection string  
> 4. Replace `<password>` with your database user password  

Start the backend:

```bash
npm run dev
```

The server will run at `http://localhost:5000`  
Test it: `http://localhost:5000/api/health`

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Edit `frontend/.env`:

```
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

The app will open at `http://localhost:5173`

---

### 4. (Optional) Seed Sample Data

To insert 6 sample assignments for demonstration:

```bash
cd backend
node seed.js
```

---

## Deployment Instructions

### Backend → Render

1. Push the project to GitHub
2. Go to [render.com](https://render.com) and create a new **Web Service**
3. Connect your GitHub repository
4. Set the build settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add environment variables:
   - `MONGODB_URI` = your Atlas connection string
   - `PORT` = 5000
   - `FRONTEND_URL` = your Vercel frontend URL (add after deploying frontend)
6. Deploy

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) and create a new project
2. Connect your GitHub repository
3. Set:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add environment variable:
   - `VITE_API_URL` = your Render backend URL (e.g. `https://deadlinedesk-api.onrender.com`)
5. Deploy

> After deploying both, update the `FRONTEND_URL` on Render to match your Vercel URL to allow CORS.

---

## Team Members

| # | Name                  | Role                   |
|---|-----------------------|------------------------|
| 1 | [Member 1 Name]       | Backend Developer      |
| 2 | [Member 2 Name]       | Frontend Developer     |
| 3 | [Member 3 Name]       | Full Stack / Database  |

---

## Viva Notes for Students

When explaining this project:

1. **MongoDB** stores each assignment as a document with fields like title, subject, dueDate, and status.
2. **Mongoose** is the ODM (Object Data Modeling) library — it lets us define a schema and validate data before saving.
3. **Express.js** handles HTTP requests. Each route (`/api/assignments`) maps to a controller function.
4. **React.js** renders the UI. `useState` stores component data; `useEffect` runs code on mount/update.
5. **Axios** is the HTTP client used by React to call the Express API.
6. **CORS** is enabled on the backend to allow the React frontend (a different origin) to make requests.
7. **Overdue status** is calculated on the frontend — it is not stored in MongoDB. If `status === "Pending"` and `dueDate < today`, it is overdue.
8. **Environment variables** keep sensitive data like the database password out of source code.

---

*Built with ❤️ as a college MERN stack training project.*
