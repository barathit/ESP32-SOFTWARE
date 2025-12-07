# ESP32 Rescue Monitoring System - Project Summary

## ✅ Project Complete!

This is a fully functional web-based real-time rescue operation monitoring system for tracking the health and environmental safety of rescue commandos/firefighters using ESP32 sensor data.

## 📦 What's Included

### Backend (Node.js + Express)
- ✅ Complete REST API with JWT authentication
- ✅ MongoDB integration with 6 collections (users, commandos, fighters, pre_rescue, telemetry_readings, post_rescue)
- ✅ Real-time Socket.IO server for live updates
- ✅ Health status calculation (Normal/Need Attention/Emergency)
- ✅ Admin management APIs
- ✅ Telemetry processing and storage

### Frontend (React.js)
- ✅ Commando Dashboard
  - Login page
  - Home dashboard with active operations
  - Pre-Rescue operation form
  - Live monitoring dashboard with real-time updates
  - Post-Rescue operation form
- ✅ Super Admin Panel
  - Admin login
  - Commando registration & management
  - Fighter & Device mapping
  - Search functionality
  - Summary & Reports

### Features
- ✅ Real-time telemetry updates via Socket.IO
- ✅ Color-coded status indicators (🟢 Normal, 🟠 Need Attention, 🔴 Emergency)
- ✅ Role-based access control (Commando/Admin)
- ✅ Complete operation lifecycle management
- ✅ ESP32 device integration ready

## 📁 Project Structure

```
ESP32-software/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── middleware/
│   │   └── auth.js               # JWT authentication
│   ├── models/
│   │   ├── User.js               # User model
│   │   ├── Commando.js           # Commando model
│   │   ├── Fighter.js            # Fighter model
│   │   ├── PreRescue.js          # Pre-rescue operation model
│   │   ├── TelemetryReading.js   # Telemetry data model
│   │   └── PostRescue.js         # Post-rescue operation model
│   ├── routes/
│   │   ├── auth.js               # Authentication routes
│   │   ├── telemetry.js          # Telemetry API
│   │   ├── rescue.js             # Rescue operation routes
│   │   └── admin.js              # Admin management routes
│   ├── utils/
│   │   └── statusCalculator.js   # Health status calculation
│   ├── scripts/
│   │   └── seedAdmin.js          # Admin user seed script
│   └── server.js                 # Main server file
├── frontend/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   └── ProtectedRoute.js
│       ├── context/
│       │   └── AuthContext.js
│       ├── pages/
│       │   ├── Login.js
│       │   ├── CommandoDashboard.js
│       │   ├── PreRescueForm.js
│       │   ├── LiveMonitoring.js
│       │   ├── PostRescueForm.js
│       │   ├── AdminDashboard.js
│       │   ├── RegisterCommando.js
│       │   └── MapDevice.js
│       ├── services/
│       │   ├── api.js             # API service
│       │   └── socket.js          # Socket.IO client
│       ├── App.js
│       └── index.js
├── package.json
├── README.md
├── SETUP.md
├── ESP32_EXAMPLE.ino
└── PROJECT_SUMMARY.md
```

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   npm run install-all
   ```

2. **Configure Environment**
   - Create `backend/.env` file (see SETUP.md)

3. **Create Admin User**
   ```bash
   npm run seed-admin
   ```

4. **Start Application**
   ```bash
   npm run dev
   ```

5. **Access Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Default Admin: username `admin`, password `admin123`

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Telemetry
- `POST /api/telemetry` - Receive ESP32 telemetry data

### Rescue Operations
- `POST /api/rescue/pre-rescue` - Start rescue operation
- `GET /api/rescue/active` - Get active operations
- `GET /api/rescue/:operationId` - Get operation details
- `POST /api/rescue/post-rescue` - End rescue operation
- `POST /api/rescue/upload-operation/:id` - Mark as uploaded

### Admin
- `POST /api/admin/commando` - Register commando
- `PUT /api/admin/commando/:id` - Update commando
- `DELETE /api/admin/commando/:id` - Delete commando
- `GET /api/admin/commandos` - Get all commandos
- `POST /api/admin/map-device` - Map device to fighter
- `GET /api/admin/search` - Search operations
- `GET /api/admin/summary` - Get summary & reports
- `GET /api/admin/telemetry/:operationId` - Get telemetry history

## 📊 Health Status Rules

### 🔴 Emergency
- Heart Rate < 50 bpm
- SpO2 < 90%
- Accelerometer inactivity > 30 seconds

### 🟠 Need Attention
- CO (m7) > 200 ppm
- Methane (m2) > 50,000 ppm
- Temperature > 105°C

### 🟢 Normal
- All values within safe range

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Protected API routes
- CORS configuration

## 📡 ESP32 Integration

The system is ready to receive telemetry from ESP32 devices. See `ESP32_EXAMPLE.ino` for example Arduino code.

**Telemetry Endpoint:** `POST http://your-server:5000/api/telemetry`

## 🎯 Next Steps

1. **Deploy to Production**
   - Set up MongoDB Atlas
   - Deploy backend to cloud (Heroku, AWS, etc.)
   - Deploy frontend to hosting service (Netlify, Vercel, etc.)
   - Update environment variables

2. **Hardware Integration**
   - Connect actual sensors to ESP32
   - Calibrate gas sensors
   - Test telemetry transmission
   - Implement NTP for accurate timestamps

3. **Enhancements**
   - Add data visualization charts
   - Implement email/SMS alerts for emergencies
   - Add historical data analysis
   - Create mobile app (optional)
   - Add more sensor types

## 📝 Notes

- Change default admin password after first login
- Use strong JWT_SECRET in production
- Configure CORS properly for production
- Add rate limiting for API endpoints
- Implement API key authentication for ESP32 devices in production
- Add input validation and sanitization
- Set up proper error logging

## 🐛 Troubleshooting

See `SETUP.md` for detailed troubleshooting guide.

## 📄 License

ISC

---

**Project Status:** ✅ Complete and Ready for Deployment

