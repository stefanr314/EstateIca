# 🏠 Web-based System for Property Rentals

**Final thesis project** – a full-stack web application for property listing, booking, and management (conceptually similar to Airbnb).  
The system enables users to explore, reserve, and manage different types of estates (residential and business), with separate roles for guests, hosts, and admins.

---

## 🧩 Project Overview

The system enables:
- Property **advertisement and management** by verified hosts  
- **Search, filtering, and booking** of available properties by guests  
- Generation of **rental contracts** (PDF format)  
- Validation of property **availability via interactive calendars**  
- Handling of **short-term and long-term rental models**  
- Secure **authentication and role-based access control**  
- Asynchronous **background processing** with queues and workers  

From an academic perspective, the project illustrates how distributed systems, asynchronous processing, and RESTful APIs can be integrated into a cohesive and scalable application.  
From a practical standpoint, it provides a real example of a booking workflow that is modular, reusable, and easily extendable with microservice or cloud-based components.

---

## 🛠️ Technologies

**Backend**
- **Node.js + Express** – RESTful API architecture  
- **MongoDB (Mongoose)** – data modeling and schema validation  
- **Redis + BullMQ** – background jobs and queue processing  
- **JWT Authentication** – secure login and route protection  
- **ImageKit API** – image upload and optimization  
- **Google Places API** – address autocomplete and geolocation  

### **Frontend**
- **React + Vite** – modern SPA architecture  
- **React Query** – server-state management
- **React Router v6** – routing with loaders and actions   
- **Axios** – HTTP client  
- **React Router** – client-side routing  
- **Material UI (MUI)** – responsive and accessible UI  
- **Custom Theme System** – light/dark modes, custom “mint” palette  

---

## 📂 Project Structure
```bash
project-root/
│
├── server/ # Backend – Express, MongoDB, Redis, API routes
│
├── frontend/ # Frontend – React, Vite, MUI, Redux, React Query
│
└── README.md
```
---

## ✨ Core Features

- ✅ **User registration and authentication** (JWT-based login & roles)
- ✅ **Browsing and filtering estates** by type, location, and availability
- ✅ **Reservation system** for short-term and long-term rentals  
- ✅ **Contract generation** in PDF format for long-term rentals  
- ✅ **Image upload and optimization** (via ImageKit API)
- ✅ **Dynamic calendar validation** for booked dates
- ✅ **Google Places API** for address search and autocomplete
- ✅ **Redis Cloud + BullMQ** for scheduled background jobs  
- ✅ **Data validation and DTO mapping** with Zod
  
### **Planned / In progress**
- 🔄 Host dashboard (estate management)  
- 🔄 Wishlist (save / remove estates)  
- 🔄 Reviews and ratings  
- 🔄 Real-time chat between users  
- 🔄 Docker setup (Mongo, Redis, Server, Frontend)

---

### 🧭 Host Functionality
- Manage owned estates (create, edit, delete)
- View and confirm pending reservations
- Access detailed reservation and contract dashboards
- Handle guest reviews and ratings

### 👤 Guest Functionality
- Search and filter properties
- Make and manage reservations
- Request cancellation or date changes
- View generated contracts for long-term rentals
- Leave reviews and interact with hosts (planned)

### 🔧 Admin Tools
- User verification and host approval workflow
- System statistics and activity logging (planned)
- Content moderation (estates, reviews)

---

## 🚀 Running the Project

### 1️⃣ Clone the repository
```bash
git clone <repo-url>
cd <repo-name>
```

### 2️⃣ Backend setup
```bash
cd server
npm install
npm run dev
```

### 3️⃣ Frontend setup
```bash
cd frontend
npm install
npm run dev
```
The frontend runs on http://localhost:5173
The backend runs on http://localhost:3030 (configurable in .env)
---

## 🔑 Environment variables

Each part of the project contains an .env.example file.
Create a .env file and fill in your own values.

**Example (`server/.env.example`):**
```env
MONGO_URI=mongodb+srv://...
REDIS_URL=...
JWT_SECRET=...
IMAGEKIT_PUBLIC_KEY=...
IMAGEKIT_PRIVATE_KEY=...
GOOGLE_PLACES_API_KEY=...
```

> ⚠️ API keys and secrets are excluded from the repository for security reasons.

---

##🧱 Database Design (conceptual)

Key entities include:

- User – roles: guest, host, admin
- Estate – residential or business, linked to owner (host)
- Reservation – tracks period, price, and contract status
- Contract – generated PDF agreements linked to reservations
- Review – user feedback system 
- HostRequest – verification workflow for new hosts

---

##🧠 Technical Highlights

- Modular architecture with clear separation of concerns
- Data consistency ensured through Mongo transactions and DTO validation
- Integration with cloud APIs (Google, ImageKit)
- Background jobs for contract expiration, reminders, and data cleanup
- React Query caching for improved frontend performance
- Fully type-safe communication between frontend and backend using TypeScript

---

##📈 Current Status
The project is actively under development as part of the final university thesis.
Upcoming milestones include finishing the host dashboard, real-time features, and Docker deployment.

---

##👨‍💻 Author
Stefan R.
Faculty of Electrical Engineering, East Sarajevo
Field: Computer Engineering – Information Systems
