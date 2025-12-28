# 🚨 SentinelLink - Emergency Response Coordination Platform

**SentinelLink** is a real-time incident reporting and resource coordination platform designed to bridge the gap between citizens reporting emergencies and authorities responding to them.

Built for the **HACKATHON**, this platform leverages real-time sockets, geospatial visualization, and automated duplicate detection to streamline emergency response.

![Live Feed Status](https://img.shields.io/badge/Status-Live-green)
![Tech Stack](https://img.shields.io/badge/Stack-PERN-blue)
![License](https://img.shields.io/badge/License-MIT-purple)

---

## 🌐 Live Deployment

> ⚠️ This is a **hackathon demo environment** deployed for evaluation and testing.

- **Frontend (Vercel):** https://sentinel-link-xxys.vercel.app  
- **Backend API (Render):** https://sentinellink-backend.onrender.com  
- **API Health Check:** https://sentinellink-backend.onrender.com/health  

- **Frontend Repository:** https://github.com/mrtopr/SentinelLink-Frontend  
- **Backend Repository:** https://github.com/mrtopr/SentinelLink-Backend  

---

## ✨ Key Features

### 🌍 For Citizens
- **Instant Reporting**: Report incidents (Fire, Accident, Medical, etc.) with location detection and media upload.
- **Live Map View**: Visualize ongoing incidents in real-time on an interactive heatmap.
- **Community Validation**: Upvote feature to verify incident authenticity.
- **Responsive Design**: Mobile-first interface for on-the-go reporting.

### 🛡️ For Authorities (Admin)
- **Command Dashboard**: Centralized view of all active incidents, severities, and trends.
- **Real-Time Updates**: Instant notifications via Socket.IO when new incidents are reported.
- **Incident Management**: Verify, resolve, or flag incidents. Update severity levels.
- **Duplicate Detection**: Intelligent system to flag potential duplicate reports based on time and distance proximity (default: 200m, 10min).
- **Emergency Broadcast**: Trigger system-wide alerts to all connected users.

---

## 🛠️ Technology Stack

| Component | Technologies |
|---------|-------------|
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, Leaflet (Maps), Socket.IO Client |
| **Backend** | Node.js, Express, Prisma ORM, PostgreSQL, Socket.IO Server |
| **Integrations** | Cloudinary (Media Storage) |
| **DevOps** | TypeScript, ESLint |
| **Deployment** | Vercel (Frontend), Render (Backend) |

---

## 🧠 System Architecture & Scalability

### Architecture Overview
- Frontend communicates with backend via **REST APIs** and **WebSockets**
- Backend handles authentication, incident processing, duplicate detection, and real-time updates
- PostgreSQL stores structured incident, user, and verification data
- Cloudinary handles all media uploads
- Socket.IO ensures low-latency live updates

### Scalability Considerations
- Stateless backend design enables horizontal scaling
- WebSocket rooms reduce unnecessary broadcast traffic
- Duplicate detection minimizes noise during peak events
- Media offloaded to Cloudinary to reduce server load
- Database indexed on time and geolocation fields

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database
- Cloudinary Account (for media uploads)

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/mrtopr/SentinelLink.git
cd "Hackathon project"
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
PORT=3000
DATABASE_URL="postgresql://user:password@localhost:5432/anginat_db"
JWT_SECRET="super_secret_key_change_me"

CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

CORS_ORIGINS="http://localhost:5173,http://localhost:3000"
```

Run migrations and start server:
```bash
npx prisma migrate dev --name init
npx prisma generate
npm run dev
```

Backend runs on: `http://localhost:3000`

### 3️⃣ Frontend Setup
```bash
cd ../frontend
npm install
```

Create a `.env` file in `frontend/`:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Start frontend:
```bash
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## 📡 API Reference

**Base URL:** `/api`

### Incidents
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/incidents` | List incidents (with filters) |
| `POST` | `/incidents` | Report a new incident (multipart/form-data) |
| `GET` | `/incidents/:id` | Incident details |
| `PATCH` | `/incidents/:id/status` | Update status (Admin) |
| `PATCH` | `/incidents/:id/severity` | Update severity (Admin) |
| `DELETE` | `/incidents/:id` | Delete incident (Admin) |

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/login` | Admin login |

### Stats
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/incidents/stats` | Aggregate incident metrics |

---

## 🔐 Demo Credentials

> Available during live demo / presentation.

If required for evaluation:
- **Admin Email:** `admin@sentinellink.com`
- **Password:** `admin123`

---

## 🔮 Future Scope & Enhancements

- AI-based incident classification and severity prediction
- Blockchain-based incident integrity and audit trail
- Push notifications (Web Push / FCM)
- Role-based responder accounts (Police, Medical, Fire)
- Multi-city and regional deployment support

---

## 📂 Project Structure

```
Hackathon project/
├── backend/
│   ├── prisma/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   └── data/
```

---

## 🤝 Contribution

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License.
