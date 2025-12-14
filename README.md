A full-stack todo management application featuring a responsive React frontend and a Node.js/Express backend.

## Features

- **Authentication**: Secure Signup/Login using JWT and bcrypt password hashing.
- **Dashboard**: Interactive task management with filtering, searching, and visual statistics.
- **Responsive Design**: Mobile-first UI built with Tailwind CSS.
- **CRUD Operations**: Create, Read, Update, and Delete tasks.
- **Mock Mode**: The frontend currently runs in "Mock Mode" using LocalStorage for zero-setup previews.

## Project Structure

```
├── components/       # Reusable UI components
├── context/          # React Context (AuthContext)
├── pages/            # Page components
├── services/         # API services
├── backend/          # Node.js/Express Backend
│   ├── config/       # Database configuration
│   ├── controllers/  # Route logic
│   ├── middleware/   # Auth middleware
│   ├── routes/       # API routes
│   └── server.js     # Entry point
└── main.tsx          # Frontend entry
```

## Setup & Installation

### Frontend

The frontend is built with Vite/React.

1. `npm install`
2. `npm run dev`

### Backend

The backend is located in the `backend/` directory.

1. `cd backend`
2. `npm install`
3. `npm start`
4. Set environment variables in a `.env` file: `JWT_SECRET`, `MONGO_URI`, `PORT`.
