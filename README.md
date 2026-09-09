# EventScale

EventScale is a full-stack MERN application designed for event listing management, user authentication, and secure ticket booking workflows. The platform supports both organizer and customer roles, with role-based access control and concurrency-safe inventory handling to prevent overbooking.

## Project Overview

The system is structured to serve two distinct user groups:

- Organizers can create events, manage listings, and review attendee information
- Customers can browse events, apply filters, and book tickets securely

Core functionality includes:

- Protected authentication and authorization flows
- Event search and category-based filtering
- Ticket booking with inventory validation
- Organizer dashboards for event and sales summaries
- Modular frontend and backend architecture for maintainability

---

## Key Features

### Customer Features

- Browse upcoming events
- Search events by keyword and category
- View live event details and available ticket counts
- Reserve tickets through a validated booking workflow
- Access personal booking history

### Organizer Features

- Create and manage event listings
- Update event inventory details
- Review attendee records for each event
- Monitor booking activity and event-level performance

### Technical Highlights

- JWT-based authentication
- Role-based route protection
- Atomic MongoDB updates to preserve ticket integrity
- Responsive React frontend built with Vite and Tailwind CSS
- Express.js backend using a modular MVC structure

---

## Technology Stack

### Frontend

- React 18
- Vite
- Tailwind CSS
- React Router
- Axios
- React Hot Toast

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs

### Deployment

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

## Demo Credentials

| Role | Email | Password |
| --- | --- | --- |
| Organizer | `organizer@eventscale.com` | `password123` |
| Customer | `customer@eventscale.com` | `password123` |

---

## API Overview

### Authentication

- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Authenticate a user and return a JWT token
- `GET /api/auth/me` — Retrieve the authenticated user profile

### Public and Customer Endpoints

- `GET /api/events` — Retrieve upcoming events with optional filters
- `GET /api/events/:id` — Retrieve a single event and ticket availability
- `POST /api/events/:id/book` — Book tickets securely
- `GET /api/bookings/my-bookings` — Retrieve a customer’s booking history

### Organizer Endpoints

- `POST /api/events` — Create a new event listing
- `GET /api/events/organizer/my-events` — Retrieve organizer events and summary data
- `GET /api/events/:id/attendees` — Retrieve attendee details for a specific event

---

## Concurrency-Safe Booking

To prevent overbooking during concurrent transactions, the booking flow applies an atomic MongoDB update condition before reducing available inventory.

```javascript
const updatedEvent = await Event.findOneAndUpdate(
  {
    _id: eventId,
    availableTickets: { $gte: requestedTickets }
  },
  {
    $inc: { availableTickets: -requestedTickets }
  },
  { new: true }
);
```

If the available ticket count is lower than the requested quantity, the update is rejected, preserving inventory consistency and preventing race-condition errors under simultaneous requests.

---

## Local Development Setup

### Prerequisites

- Node.js v18 or later
- MongoDB Atlas account or local MongoDB instance

### 1. Clone the repository

```bash
git clone https://github.com/your-username/event-booking-portal.git
cd event-booking-portal
```

### 2. Configure the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_min_32_chars
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Run the backend:

```bash
npm run dev
```

### 3. Configure the frontend

Open a second terminal and run:

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Run the frontend:

```bash
npm run dev
```

Open the application in the browser at:

```text
http://localhost:5173
```

---

## Project Structure

```text
event-booking-portal/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vercel.json
│   └── package.json
│
├── README.md
└── LICENSE
```

---

## Submission Summary

This project demonstrates the implementation of a complete MERN-based event booking platform, including secure role-based access, transactional ticket inventory control, and a functional organizer/customer workflow suitable for technical assessment and portfolio review.

## License

This project is provided for educational and evaluation purposes.