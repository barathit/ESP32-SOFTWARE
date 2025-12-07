# 🚀 ESP32 Rescue Monitoring System - Client Delivery Guide

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [What's Included](#whats-included)
3. [System Requirements](#system-requirements)
4. [Installation Guide](#installation-guide)
5. [Configuration](#configuration)
6. [Running the Application](#running-the-application)
7. [User Guide](#user-guide)
8. [ESP32 Device Setup](#esp32-device-setup)
9. [API Documentation](#api-documentation)
10. [Troubleshooting](#troubleshooting)
11. [Support & Maintenance](#support--maintenance)

---

## 📖 Project Overview

The ESP32 Rescue Monitoring System is a comprehensive real-time IoT solution for tracking the health and environmental safety of rescue commandos/firefighters during operations.

### Key Features
✅ Real-time health monitoring (Heart Rate, SpO2, Temperature)  
✅ Environmental sensors (CO, Methane, Temperature)  
✅ Motion detection via accelerometer  
✅ 3-tier alert system (Normal, Need Attention, Emergency)  
✅ Live operation monitoring with Socket.IO  
✅ Role-based access (Admin & Commando)  
✅ Complete operation lifecycle management  
✅ Modern, responsive UI with mobile support  

### Technology Stack
- **Frontend**: React.js 18 with React Router
- **Backend**: Node.js + Express.js
- **Database**: MongoDB Atlas
- **Real-time**: Socket.IO
- **Authentication**: JWT with bcrypt
- **IoT Device**: ESP32 with sensors

---

## 📦 What's Included

### Backend Components
```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── middleware/
│   └── auth.js              # JWT authentication
├── models/                  # Database schemas
│   ├── User.js
│   ├── Commando.js
│   ├── Fighter.js
│   ├── PreRescue.js
│   ├── TelemetryReading.js
│   └── PostRescue.js
├── routes/                  # API endpoints
│   ├── auth.js
│   ├── telemetry.js
│   ├── rescue.js
│   └── admin.js
├── utils/
│   └── statusCalculator.js  # Health status logic
├── scripts/                 # Utility scripts
│   ├── seedAdmin.js
│   ├── seedFighters.js
│   └── listCommandoCredentials.js
└── server.js               # Main server file
```

### Frontend Components
```
frontend/
├── public/
│   └── index.html
└── src/
    ├── components/
    │   ├── CommandoLayout.js    # NEW: Main layout wrapper
    │   └── ProtectedRoute.js
    ├── context/
    │   └── AuthContext.js
    ├── pages/
    │   ├── Login.js
    │   ├── CommandoDashboard.js  # UPDATED: Modern UI
    │   ├── PreRescueForm.js      # UPDATED: Enhanced form
    │   ├── LiveMonitoring.js     # UPDATED: Better monitoring
    │   ├── PostRescueForm.js     # UPDATED: Improved form
    │   ├── AdminDashboard.js
    │   ├── RegisterCommando.js
    │   ├── EditCommando.js
    │   └── MapDevice.js
    ├── services/
    │   ├── api.js               # API service
    │   └── socket.js            # Socket.IO client
    ├── App.js
    └── index.js
```

### Documentation
- `README.md` - Project overview
- `SETUP.md` - Setup instructions
- `PROJECT_SUMMARY.md` - Complete project summary
- `ESP32_EXAMPLE.ino` - Arduino code example
- `CLIENT_DELIVERY_GUIDE.md` - This document
- `UI_IMPROVEMENTS.md` - UI enhancement details

---

## 💻 System Requirements

### Development Environment
- **Node.js**: v16.x or higher
- **npm**: v8.x or higher
- **MongoDB**: Atlas account (free tier works)
- **Git**: For version control

### Production Environment
- **Server**: Linux/Windows with Node.js support
- **RAM**: Minimum 2GB
- **Storage**: 10GB minimum
- **Network**: Stable internet connection

### ESP32 Hardware
- ESP32 Development Board
- Heart Rate Sensor (I2C)
- SpO2 Sensor (I2C)
- Temperature Sensor
- Accelerometer (I2C)
- Gas Sensors (Methane MQ-2, CO MQ-7)
- WiFi connectivity

---

## 🔧 Installation Guide

### Step 1: Clone/Extract Project
```bash
# If using Git
git clone <repository-url>
cd ESP32-software

# Or extract the ZIP file
unzip ESP32-software.zip
cd ESP32-software
```

### Step 2: Install Dependencies

#### Install All Dependencies (Recommended)
```bash
npm run install-all
```

#### Or Install Separately
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Step 3: MongoDB Setup

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free account
   - Create a new cluster (free tier M0)

2. **Configure Database Access**
   - Go to "Database Access"
   - Add new database user
   - Set username and password
   - Grant "Read and write to any database" role

3. **Configure Network Access**
   - Go to "Network Access"
   - Add IP Address
   - For development: Add "0.0.0.0/0" (Allow from anywhere)
   - For production: Add your server's IP

4. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password

### Step 4: Environment Configuration

Create `.env` file in the `backend` directory:

```bash
# Navigate to backend folder
cd backend

# Create .env file (Windows)
type nul > .env

# Or create .env file (Linux/Mac)
touch .env
```

Add the following content to `backend/.env`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rescue_monitoring?retryWrites=true&w=majority

# JWT Secret (Change this to a random string)
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long

# Frontend URL
CLIENT_URL=http://localhost:3000
```

**⚠️ IMPORTANT**: 
- Replace `username:password` in MONGODB_URI with your actual credentials
- Change `JWT_SECRET` to a strong random string (minimum 32 characters)
- For production, use environment-specific values

### Step 5: Create Admin User

```bash
# From project root
npm run seed-admin
```

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`

**⚠️ SECURITY**: Change the admin password immediately after first login!

---

## ▶️ Running the Application

### Development Mode

#### Option 1: Run Both (Frontend + Backend)
```bash
# From project root
npm run dev
```

This will start:
- Backend API on `http://localhost:5000`
- Frontend React app on `http://localhost:3000`

#### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run client
```

### Production Mode

#### Build Frontend
```bash
cd frontend
npm run build
```

#### Start Backend
```bash
# From project root
npm start
```

#### Using PM2 (Recommended for Production)
```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start backend/server.js --name rescue-monitor

# View logs
pm2 logs rescue-monitor

# Restart
pm2 restart rescue-monitor

# Stop
pm2 stop rescue-monitor
```

---

## 🎯 User Guide

### Admin Panel

#### 1. Login as Admin
- URL: `http://localhost:3000/login`
- Username: `admin`
- Password: `admin123`

#### 2. Register Commandos
1. Click "Register New Commando"
2. Fill in commando details:
   - Commando ID (unique)
   - Name
   - Email
   - Phone
   - Username (for login)
   - Password
3. Click "Register"

#### 3. Map Devices to Fighters
1. Click "Map Device to Fighter"
2. Select Commando
3. Enter Fighter ID
4. Enter Fighter Name
5. Enter ESP32 Device ID (e.g., TX-44b7b3f8)
6. Click "Map Device"

#### 4. Search Operations
- Use search filters to find past operations
- View operation details and telemetry history

### Commando Dashboard

#### 1. Login as Commando
- URL: `http://localhost:3000/login`
- Use credentials provided by admin

#### 2. Start New Operation
1. Click "Start New Operation"
2. Fill in Pre-Rescue Form:
   - Location
   - Operation Type
   - Description
   - Add Fighters (Fighter ID + Device ID)
3. Click "Start Operation"

#### 3. Monitor Live Operation
- View real-time fighter status
- Color-coded alerts:
  - 🟢 **Green**: Normal - All vitals safe
  - 🟠 **Orange**: Need Attention - Warning conditions
  - 🔴 **Red**: Emergency - Critical situation
- Click on fighter card for detailed metrics
- Monitor:
  - Heart Rate (bpm)
  - SpO2 (%)
  - Temperature (°C)
  - Gas levels (CO, Methane)
  - Motion status

#### 4. End Operation
1. Click "End Operation"
2. Fill in Post-Rescue Form:
   - Number of casualties
   - Number rescued
   - Operation notes
3. Click "End Operation"

---

## 📡 ESP32 Device Setup

### Hardware Connections

```
ESP32 Pin Configuration:
├── I2C Sensors (SDA: GPIO21, SCL: GPIO22)
│   ├── Heart Rate Sensor
│   ├── SpO2 Sensor
│   ├── Temperature Sensor
│   └── Accelerometer
├── Analog Sensors
│   ├── Methane (MQ-2) → GPIO34
│   └── CO (MQ-7) → GPIO35
└── Power: 5V/3.3V depending on sensor
```

### Software Setup

#### 1. Install Arduino IDE
- Download from https://www.arduino.cc/en/software
- Install ESP32 board support:
  - File → Preferences
  - Add to "Additional Board Manager URLs":
    ```
    https://dl.espressif.com/dl/package_esp32_index.json
    ```
  - Tools → Board → Boards Manager
  - Search "ESP32" and install

#### 2. Install Required Libraries
- ArduinoJson (by Benoit Blanchon)
- WiFi (built-in)
- HTTPClient (built-in)
- Sensor-specific libraries (based on your hardware)

#### 3. Configure ESP32 Code

Open `ESP32_EXAMPLE.ino` and update:

```cpp
// WiFi Credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Backend API URL
const char* serverURL = "http://YOUR_SERVER_IP:5000/api/telemetry";

// ESP32 Device ID (must match device mapped in admin panel)
const char* deviceId = "TX-44b7b3f8";
```

#### 4. Upload Code
1. Connect ESP32 via USB
2. Select Board: "ESP32 Dev Module"
3. Select Port: COM port where ESP32 is connected
4. Click Upload

#### 5. Monitor Serial Output
- Open Serial Monitor (115200 baud)
- Verify WiFi connection
- Check telemetry transmission

### Telemetry Data Format

ESP32 sends JSON data every 5 seconds:

```json
{
  "w": {
    "hr": 75,           // Heart Rate (bpm)
    "sp": 98.5,         // SpO2 (%)
    "al": 100,          // Altitude (m)
    "tp": 36.5,         // Temperature (°C)
    "mx": -0.21,        // Accelerometer X
    "my": -0.21,        // Accelerometer Y
    "mz": 10.00,        // Accelerometer Z
    "ts": 80901         // Timestamp (ms)
  },
  "s": {
    "m2": 240,          // Methane (ppm)
    "m7": 48            // CO (ppm)
  },
  "i": {
    "id": "TX-44b7b3f8", // Device ID
    "pn": 22            // Packet number
  }
}
```

---

## 🔌 Socket.IO Real-Time Setup

### How It Works

1. **Backend** (server.js):
   - Socket.IO server runs on port 5000
   - Listens for client connections
   - Broadcasts telemetry updates to connected clients

2. **Frontend** (socket.js):
   - Connects to Socket.IO server
   - Joins operation-specific rooms
   - Receives real-time telemetry updates

3. **ESP32**:
   - Sends HTTP POST to `/api/telemetry`
   - Backend processes and broadcasts via Socket.IO

### Connection Flow

```
ESP32 → HTTP POST → Backend API
                        ↓
                   Process Data
                        ↓
                   Save to MongoDB
                        ↓
                Socket.IO Broadcast
                        ↓
            Frontend Clients (Live Update)
```

### Testing Socket Connection

1. Open browser console on Live Monitoring page
2. Check for: `"Socket connected: <socket-id>"`
3. Verify: `"Client joined operation <operation-id>"`

---

## 📚 API Documentation

### Base URL
```
Development: http://localhost:5000/api
Production: http://your-domain.com/api
```

### Authentication Endpoints

#### POST /api/auth/login
Login user (Admin or Commando)

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "admin",
    "role": "admin"
  }
}
```

### Telemetry Endpoints

#### POST /api/telemetry
Receive telemetry from ESP32 (No auth required)

**Request:**
```json
{
  "w": { "hr": 75, "sp": 98.5, ... },
  "s": { "m2": 240, "m7": 48 },
  "i": { "id": "TX-44b7b3f8", "pn": 22 }
}
```

**Response:**
```json
{
  "message": "Telemetry received",
  "status": "normal"
}
```

### Rescue Operation Endpoints

#### POST /api/rescue/pre-rescue
Start new rescue operation (Auth required)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request:**
```json
{
  "location": "Building A",
  "operationType": "Fire Rescue",
  "description": "3-story building fire",
  "fighters": [
    {
      "fighterId": "F001",
      "deviceId": "TX-44b7b3f8"
    }
  ]
}
```

#### GET /api/rescue/active
Get active operations (Auth required)

#### GET /api/rescue/:operationId
Get operation details (Auth required)

#### POST /api/rescue/post-rescue
End operation (Auth required)

**Request:**
```json
{
  "operationId": "OP-1234567890",
  "casualties": 0,
  "rescued": 5,
  "notes": "Operation completed successfully"
}
```

### Admin Endpoints

#### POST /api/admin/commando
Register new commando (Admin only)

**Request:**
```json
{
  "commandoId": "CMD001",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "username": "johndoe",
  "password": "secure_password"
}
```

#### POST /api/admin/map-device
Map device to fighter (Admin only)

**Request:**
```json
{
  "commandoId": "CMD001",
  "fighterId": "F001",
  "fighterName": "Fighter One",
  "deviceId": "TX-44b7b3f8"
}
```

#### GET /api/admin/search
Search operations (Admin only)

**Query Parameters:**
- `commandoId`: Filter by commando
- `startDate`: Filter by start date
- `endDate`: Filter by end date

---

## 🎨 UI Features (New)

### Modern Commando Dashboard
- **Professional Header**: Fixed gradient header with logo and user info
- **Responsive Sidebar**: Collapsible navigation (mobile-friendly)
- **Stats Cards**: Visual display of active operations and fighters
- **Operation Cards**: Modern cards with status badges and hover effects
- **Live Indicators**: Pulse animation for active operations
- **Empty States**: Helpful messages when no data available

### Enhanced Forms
- **Clean Layout**: Card-based design with proper spacing
- **Better Inputs**: Improved styling with focus states
- **Icon Buttons**: Visual feedback for actions
- **Validation**: Clear error messages
- **Responsive**: Works on all screen sizes

### Live Monitoring
- **Color-Coded Status**: 
  - 🟢 Green: Normal (all vitals safe)
  - 🟠 Orange: Need Attention (warning conditions)
  - 🔴 Red: Emergency (critical - with pulse animation)
- **Fighter Cards**: Click to view detailed metrics
- **Real-time Updates**: Instant data refresh via Socket.IO
- **Responsive Grid**: Adapts to screen size

### Professional Footer
- Copyright information
- Version number
- Emergency contact display

---

## 🔍 Health Status Rules

### 🔴 Emergency (Critical)
Triggers when ANY of these conditions are met:
- Heart Rate < 50 bpm
- SpO2 < 90%
- No movement detected for > 30 seconds (accelerometer)

### 🟠 Need Attention (Warning)
Triggers when ANY of these conditions are met:
- CO level > 200 ppm
- Methane level > 50,000 ppm
- Temperature > 105°C

### 🟢 Normal (Safe)
All values within safe ranges

---

## 🐛 Troubleshooting

### Backend Issues

#### MongoDB Connection Failed
```
Error: MongoNetworkError: failed to connect to server
```
**Solution:**
1. Check MONGODB_URI in `.env`
2. Verify IP whitelist in MongoDB Atlas
3. Check internet connection
4. Ensure database user has correct permissions

#### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

#### JWT Secret Error
```
Error: secretOrPrivateKey must have a value
```
**Solution:**
- Add JWT_SECRET to `.env` file
- Ensure it's at least 32 characters long

### Frontend Issues

#### Cannot Connect to Backend
**Solution:**
1. Verify backend is running on port 5000
2. Check proxy setting in `frontend/package.json`
3. Clear browser cache
4. Check CORS settings in `backend/server.js`

#### Socket.IO Not Connecting
**Solution:**
1. Check Socket.IO server is running (backend logs)
2. Verify CLIENT_URL in backend `.env`
3. Check browser console for errors
4. Ensure firewall allows WebSocket connections

### ESP32 Issues

#### WiFi Connection Failed
**Solution:**
1. Verify SSID and password
2. Check WiFi signal strength
3. Ensure 2.4GHz network (ESP32 doesn't support 5GHz)
4. Check router settings

#### HTTP POST Failed
**Solution:**
1. Verify server URL is correct
2. Check server is accessible from ESP32 network
3. Ensure device ID matches mapped device
4. Check Serial Monitor for error codes

#### Sensor Reading Errors
**Solution:**
1. Verify sensor connections (I2C, analog pins)
2. Check sensor power supply (3.3V or 5V)
3. Install required sensor libraries
4. Calibrate sensors according to datasheet

---

## 🔒 Security Best Practices

### Production Deployment

1. **Change Default Credentials**
   ```bash
   # Change admin password immediately
   ```

2. **Use Strong JWT Secret**
   ```env
   JWT_SECRET=use_a_very_long_random_string_min_32_chars
   ```

3. **Enable HTTPS**
   - Use SSL/TLS certificates
   - Configure reverse proxy (nginx)

4. **Restrict CORS**
   ```javascript
   // In server.js
   cors({
     origin: 'https://your-production-domain.com'
   })
   ```

5. **MongoDB Security**
   - Use strong database passwords
   - Whitelist specific IPs only
   - Enable MongoDB authentication

6. **Environment Variables**
   - Never commit `.env` to version control
   - Use environment-specific configs

7. **Rate Limiting**
   - Implement API rate limiting
   - Protect against DDoS attacks

---

## 📊 Database Collections

### users
- Stores admin and commando login credentials
- Password hashed with bcrypt

### commandos
- Commando profile information
- Links to user account

### fighters
- Individual rescue personnel
- Maps to ESP32 devices

### pre_rescue
- Operation start records
- Fighter assignments

### telemetry_readings
- Real-time sensor data
- Indexed for fast queries

### post_rescue
- Operation completion records
- Statistics and notes

---

## 🚀 Deployment Guide

### Deploy to Heroku (Backend)

```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create rescue-monitor-api

# Set environment variables
heroku config:set MONGODB_URI="your_mongodb_uri"
heroku config:set JWT_SECRET="your_jwt_secret"
heroku config:set NODE_ENV="production"

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Deploy Frontend (Netlify/Vercel)

#### Netlify
```bash
# Build frontend
cd frontend
npm run build

# Deploy
# Drag and drop 'build' folder to Netlify
# Or use Netlify CLI
npm install -g netlify-cli
netlify deploy --prod
```

#### Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel --prod
```

### Update API URL
After deployment, update frontend API URL:
```javascript
// frontend/src/services/api.js
const API_URL = 'https://your-backend-url.com/api';
```

---

## 📞 Support & Maintenance

### Logs Location
- **Backend**: Console output or PM2 logs
- **Frontend**: Browser console (F12)
- **ESP32**: Serial Monitor (115200 baud)

### Backup Database
```bash
# MongoDB Atlas automatic backups (enabled by default)
# Or manual export
mongodump --uri="your_mongodb_uri"
```

### Update Dependencies
```bash
# Check for updates
npm outdated

# Update packages
npm update

# Update frontend
cd frontend
npm update
```

### Monitoring
- Use PM2 for process monitoring
- Set up MongoDB Atlas alerts
- Monitor API response times
- Track error rates

---

## 📝 Quick Reference

### Useful Commands
```bash
# Install all dependencies
npm run install-all

# Run development mode
npm run dev

# Run backend only
npm run server

# Run frontend only
npm run client

# Create admin user
npm run seed-admin

# List all commandos
npm run list-commandos

# Production start
npm start
```

### Default Ports
- Backend API: `5000`
- Frontend Dev: `3000`
- Socket.IO: `5000` (same as backend)

### Default Credentials
- Admin Username: `admin`
- Admin Password: `admin123`
- **⚠️ Change immediately after first login!**

---

## 📄 License
ISC License

---

## 🎉 Project Delivered By
**Developer**: [Your Name]  
**Date**: December 2024  
**Version**: 1.0.0  

---

## ✅ Delivery Checklist

- [x] Source code (frontend + backend)
- [x] Database schemas and models
- [x] API documentation
- [x] ESP32 example code
- [x] Setup instructions
- [x] User guide
- [x] Troubleshooting guide
- [x] Deployment guide
- [x] UI improvements documentation
- [x] Security best practices

---

**For any questions or support, please contact the development team.**

**Thank you for choosing ESP32 Rescue Monitoring System!** 🚒🔥
