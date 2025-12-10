🎬 YouTube Clone – MERN Full-Stack Project

A fully-functional YouTube-like video platform built using the MERN stack, featuring authentication, video uploads, YouTube video support, likes/dislikes, comments, channels, search, dashboard, and more.

This is a real-world full-stack clone designed to look and behave like YouTube (UI + features).

🚀 Tech Stack
Frontend (React + Vite)

React 18

React Router

Axios

React Icons

Context API (Auth State)

Modern CSS (YouTube-style UI)

Backend (Node + Express)

Express.js

MongoDB + Mongoose

Multer (file uploads)

JWT Authentication

Cookie Parser

CORS + Morgan

Database

MongoDB Atlas (Cloud Hosted)

🎯 Features
✅ User Authentication

Register

Login

JWT-based authentication

Secure cookie storage

🎥 Video System

Upload your own videos (MP4)

Add YouTube video links (auto-extracts youtubeId)

Edit & delete your videos

Auto-update view counts

Like & dislike system (1 user → 1 like/dislike max)

📺 Channel Pages

Create a channel

Upload avatar & banner

Edit channel info

Display all uploaded videos

“Customize Channel” + “Manage Videos” page

💬 Comments System

Add comments

Delete your own comments

Display comment username + timestamp

🔍 Search

Search videos by title

Instant filtering (YouTube-like)

Category filter chips (Music, Gaming, React, OOP, etc.)

📱 Responsive UI

YouTube-like:

Sidebar navigation

Top header with search bar

YouTube-style fonts & icons

youtube-clone/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Channel.js
│   │   └── Video.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── channelRoutes.js
│   │   ├── videoRoutes.js
│   │   └── commentRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── uploads/ (auto-generated)
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── api/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── public/
│
└── README.md


🛠️ Local Setup
1️⃣ Clone Repo
git clone https://github.com/YOUR-USERNAME/youtube-clone.git
cd youtube-clone

2️⃣ Install Dependencies
Backend
cd backend
npm install

Frontend
cd ../frontend
npm install

3️⃣ Create .env file (Backend)

Create backend/.env:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173

4️⃣ Start Servers
Backend
cd backend
npm start

Frontend
cd frontend
npm run dev


Backend runs at → http://localhost:5000

Frontend runs at → http://localhost:5173