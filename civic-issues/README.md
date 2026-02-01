# 🏛️ Civic Issues and Emergency Reporting Platform

A comprehensive full-stack web application for citizens to report civic issues and emergencies to relevant government departments with role-based access control (Citizens, Officers, Admin).

---

## 🎯 Project Overview

This platform enables:
- **Citizens** to report civic problems with proof (images/audio/video) and track status
- **Department Officers** to manage and resolve reports from their assigned departments
- **Admin** to oversee the entire system, manage officers, and monitor all activities

---

## ✨ Key Features

### 👥 For Citizens
- ✅ Self-registration with personal details
- ✅ Report civic issues (roads, electricity, garbage, water, etc.)
- ✅ Upload proof: Images (mandatory) + Audio/Video (optional)
- ✅ Automatic location capture (GPS coordinates)
- ✅ Track report status in real-time
- ✅ View transparent rejection reasons
- ✅ Emergency reporting (Police, Medical, Fire, Disaster)

### 👮 For Department Officers
- ✅ Department-specific report access
- ✅ Update report status (Taken Action → Process Underway → Resolved/Rejected)
- ✅ Provide mandatory rejection reasons
- ✅ View ALL emergency reports regardless of department
- ✅ Dashboard with pending/resolved analytics

### 🔧 For Admin
- ✅ Create and manage officer accounts
- ✅ Assign multiple departments to officers
- ✅ Dynamic department management (add/edit/disable)
- ✅ Audit all reports (read-only mode)
- ✅ Emergency oversight and escalation
- ✅ System-wide analytics

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework:** React.js 18.3
- **Routing:** React Router DOM 6.26
- **HTTP Client:** Axios
- **Notifications:** React Toastify
- **Styling:** Pure CSS (no frameworks)
- **Build Tool:** Vite

### **Backend**
- **Runtime:** Node.js
- **Framework:** Express.js 4.19
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** Firebase Auth + JWT
- **File Storage:** Cloudinary
- **Security:** Helmet, CORS, Rate Limiting
- **Validation:** Express Validator

### **Third-Party Services**
- **Firebase:** User authentication and verification
- **Cloudinary:** Media storage (images, audio, video)
- **MongoDB:** Database (local or Atlas)
- **Nodemailer:** Email notifications (optional)

---

## 📁 Project Structure
```
civic-issues/
├── public/              # Static assets
├── src/                 # React frontend
│   ├── assets/          # Images, styles, icons
│   ├── components/      # Reusable components
│   ├── pages/           # Page components
│   ├── layouts/         # Layout wrappers
│   ├── routes/          # Route configuration
│   ├── services/        # API services
│   ├── context/         # React context
│   ├── hooks/           # Custom hooks
│   ├── utils/           # Utility functions
│   └── config/          # Configuration files
├── server/              # Node.js backend
│   ├── controllers/     # Business logic
│   ├── models/          # Database schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── config/          # Configuration
│   ├── services/        # External services
│   └── utils/           # Helper functions
└── README.md
```

---

## 🚀 Installation & Setup

### **Prerequisites**
- Node.js (v18 or higher)
- MongoDB (local or Atlas account)
- Firebase account
- Cloudinary account
- Git

---

### **1. Clone the Repository**
```bash
git clone <your-repo-url>
cd civic-issues
```

---

### **2. Frontend Setup**

#### Install Dependencies
```bash
npm install
```

#### Configure Environment Variables
Create `.env` file in root directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
```

#### Start Development Server
```bash
npm run dev
```
Frontend runs on: **http://localhost:5173**

---

### **3. Backend Setup**

#### Navigate to Server Directory
```bash
cd server
```

#### Install Dependencies
```bash
npm install
```

#### Configure Environment Variables
Create `.env` file in `server/` directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/civic-issues-db
JWT_SECRET=your_jwt_secret_key_min_32_chars
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CORS_ORIGIN=http://localhost:5173
```

#### Start Development Server
```bash
npm run dev
```
Backend runs on: **http://localhost:5000**

---

## 📚 API Documentation

### **Authentication Routes** (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Citizen registration |
| POST | `/login` | User login (all roles) |
| POST | `/logout` | User logout |
| GET | `/me` | Get current user |

### **Report Routes** (`/api/reports`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all reports (role-based) |
| POST | `/` | Create new report |
| GET | `/:id` | Get report details |
| PUT | `/:id` | Update report status |
| DELETE | `/:id` | Delete report (admin) |

### **Emergency Routes** (`/api/emergency`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all emergencies |
| POST | `/` | Create emergency report |
| PUT | `/:id` | Update emergency status |

### **Department Routes** (`/api/departments`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all departments |
| POST | `/` | Create department (admin) |
| PUT | `/:id` | Update department (admin) |
| DELETE | `/:id` | Delete department (admin) |

### **Officer Routes** (`/api/officers`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all officers (admin) |
| POST | `/` | Create officer (admin) |
| PUT | `/:id` | Update officer (admin) |
| DELETE | `/:id` | Delete officer (admin) |

---

## 🔐 Environment Setup Guide

### **Firebase Setup**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication → Email/Password
4. Get Web API credentials from Project Settings
5. Download Service Account Key (for backend)

### **Cloudinary Setup**
1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for free account
3. Go to Dashboard → Settings
4. Get Cloud Name, API Key, API Secret
5. Create an unsigned upload preset

### **MongoDB Setup**
**Option 1: Local MongoDB**
```bash
# Install MongoDB Community Edition
# Start MongoDB service
mongod
```

**Option 2: MongoDB Atlas (Cloud)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Get connection string
4. Whitelist your IP address

---

## 🚢 Deployment

### **Frontend Deployment** (Vercel/Netlify)
```bash
npm run build
# Deploy 'dist' folder
```

### **Backend Deployment** (Render/Railway)
- Set environment variables in hosting platform
- Deploy from GitHub repository
- Update CORS_ORIGIN with frontend URL

---

## 🧪 Testing
```bash
# Frontend
npm run lint

# Backend
cd server
npm run lint
```

---

## 📝 License

MIT License - feel free to use this project for learning or production.

---

## 👨‍💻 Developer

Created with ❤️ for making civic management easier and more transparent.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📧 Support

For support, email your_email@example.com or open an issue in the repository.

---

**⭐ Star this repository if you find it helpful!**