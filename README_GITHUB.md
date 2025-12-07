# 🚒 ESP32 Rescue Monitoring System

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/)

A comprehensive real-time IoT rescue operation monitoring system for tracking the health and environmental safety of rescue commandos/firefighters using ESP32 sensor data.

![System Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)

---

## 🌟 Features

- ✅ **Real-time Health Monitoring** - Heart Rate, SpO2, Temperature tracking
- ✅ **Environmental Sensors** - CO, Methane, Temperature monitoring
- ✅ **Motion Detection** - Accelerometer-based activity tracking
- ✅ **3-Tier Alert System** - Normal, Need Attention, Emergency
- ✅ **Live Operation Monitoring** - Real-time updates via Socket.IO
- ✅ **Role-Based Access** - Admin and Commando dashboards
- ✅ **Modern Responsive UI** - Works on mobile, tablet, and desktop
- ✅ **Complete Operation Lifecycle** - Pre-rescue, monitoring, post-rescue
- ✅ **ESP32 Integration** - Ready for hardware deployment

---

## 🎯 Demo

### Dashboard
![Dashboard Preview](https://via.placeholder.com/800x400/667eea/ffffff?text=Modern+Dashboard+UI)

### Live Monitoring
![Monitoring Preview](https://via.placeholder.com/800x400/10b981/ffffff?text=Real-time+Monitoring)

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16 or higher
- MongoDB Atlas account (free tier works)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/barathit/ESP32-SOFTWARE.git
cd ESP32-SOFTWARE

# Install all dependencies
npm run install-all

# Configure environment
# Create backend/.env file (see Configuration section)

# Create admin user
npm run seed-admin

# Start the application
npm run dev
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

**Default Admin Login:**
- Username: `admin`
- Password: `admin123`

---

## ⚙️ Configuration

Create `backend/.env` file:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rescue_monitoring?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

**Important:** Replace the values with your actual credentials.

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [📘 Client Delivery Guide](CLIENT_DELIVERY_GUIDE.md) | Complete 360° guide with everything |
| [🚀 Quick Start](QUICK_START.md) | Get running in 5 minutes |
| [📋 Project Handover](PROJECT_HANDOVER.md) | Official delivery document |
| [🔄 System Flow Diagrams](SYSTEM_FLOW_DIAGRAM.md) | Visual architecture guide |
| [🎨 UI Improvements](UI_IMPROVEMENTS.md) | UI enhancement details |
| [📚 Documentation Index](DOCUMENTATION_INDEX.md) | Complete documentation map |

---

## 🏗️ Tech Stack

### Frontend
- React 18.2
- React Router 6.20
- Socket.IO Client 4.6
- Axios 1.6
- React Icons 4.12

### Backend
- Node.js + Express 4.18
- MongoDB + Mongoose 8.0
- Socket.IO 4.6
- JWT Authentication
- bcryptjs 2.4

### Hardware
- ESP32 Development Board
- Heart Rate & SpO2 Sensors
- Temperature & Accelerometer
- Gas Sensors (MQ-2, MQ-7)

---

## 📁 Project Structure

```
ESP32-SOFTWARE/
├── backend/
│   ├── config/          # Database configuration
│   ├── middleware/      # Authentication middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── utils/           # Utility functions
│   ├── scripts/         # Seed scripts
│   └── server.js        # Main server file
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/  # React components
│       ├── context/     # Context providers
│       ├── pages/       # Page components
│       └── services/    # API & Socket services
├── docs/                # Documentation
└── ESP32_EXAMPLE.ino    # Arduino code
```

---

## 🎨 UI Features

### Modern Interface
- Professional gradient header
- Responsive sidebar navigation
- Stats cards with live data
- Color-coded status alerts
- Real-time updates
- Mobile-friendly design

### Status Colors
- 🟢 **Green** - Normal (all vitals safe)
- 🟠 **Orange** - Need Attention (warning conditions)
- 🔴 **Red** - Emergency (critical situation with pulse animation)

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Telemetry
- `POST /api/telemetry` - Receive ESP32 data

### Rescue Operations
- `POST /api/rescue/pre-rescue` - Start operation
- `GET /api/rescue/active` - Get active operations
- `GET /api/rescue/:operationId` - Get operation details
- `POST /api/rescue/post-rescue` - End operation

### Admin
- `POST /api/admin/commando` - Register commando
- `POST /api/admin/map-device` - Map device to fighter
- `GET /api/admin/search` - Search operations

[Full API Documentation →](CLIENT_DELIVERY_GUIDE.md#api-documentation)

---

## 🔌 ESP32 Integration

### Hardware Setup
1. Connect sensors to ESP32 (I2C and analog pins)
2. Install Arduino IDE and ESP32 board support
3. Install required libraries (ArduinoJson, WiFi, HTTPClient)

### Software Configuration
```cpp
// Update in ESP32_EXAMPLE.ino
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverURL = "http://YOUR_SERVER_IP:5000/api/telemetry";
const char* deviceId = "TX-44b7b3f8";
```

### Telemetry Format
```json
{
  "w": {
    "hr": 75,      // Heart Rate
    "sp": 98.5,    // SpO2
    "tp": 36.5,    // Temperature
    "mx": -0.21,   // Accel X
    "my": -0.21,   // Accel Y
    "mz": 10.00    // Accel Z
  },
  "s": {
    "m2": 240,     // Methane
    "m7": 48       // CO
  },
  "i": {
    "id": "TX-44b7b3f8",
    "pn": 22
  }
}
```

---

## 🚀 Deployment

### Backend (Heroku)
```bash
heroku create rescue-monitor-api
heroku config:set MONGODB_URI="your_uri"
heroku config:set JWT_SECRET="your_secret"
git push heroku main
```

### Frontend (Netlify/Vercel)
```bash
cd frontend
npm run build
# Deploy build folder to Netlify or Vercel
```

[Full Deployment Guide →](CLIENT_DELIVERY_GUIDE.md#deployment-guide)

---

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Protected API routes
- CORS configuration
- Environment variable management

---

## 🧪 Available Scripts

```bash
# Install all dependencies
npm run install-all

# Run development mode (both frontend & backend)
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

---

## 📊 Health Status Rules

### 🔴 Emergency
- Heart Rate < 50 bpm
- SpO2 < 90%
- No movement > 30 seconds

### 🟠 Need Attention
- CO > 200 ppm
- Methane > 50,000 ppm
- Temperature > 105°C

### 🟢 Normal
- All values within safe ranges

---

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify connection string in `.env`
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

### Socket.IO Not Connecting
- Verify backend is running
- Check CLIENT_URL in backend `.env`
- Check browser console for errors

[Full Troubleshooting Guide →](CLIENT_DELIVERY_GUIDE.md#troubleshooting)

---

## 📈 Roadmap

### Short-term
- [ ] Data visualization charts
- [ ] Email/SMS alerts
- [ ] Export reports (PDF/CSV)
- [ ] Mobile app (React Native)

### Long-term
- [ ] AI-based anomaly detection
- [ ] Predictive analytics
- [ ] Multi-language support
- [ ] Video streaming integration

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

**Barath**
- GitHub: [@barathit](https://github.com/barathit)

---

## 🙏 Acknowledgments

- ESP32 community for hardware support
- MongoDB Atlas for database hosting
- React community for frontend framework
- Socket.IO for real-time communication

---

## 📞 Support

For support and questions:
- 📖 Read the [Complete Documentation](CLIENT_DELIVERY_GUIDE.md)
- 🐛 Open an [Issue](https://github.com/barathit/ESP32-SOFTWARE/issues)
- 📧 Contact: [Your Email]

---

## ⭐ Star History

If you find this project useful, please consider giving it a star! ⭐

---

**Built with ❤️ for Rescue Operations Safety**

🚒 **Stay Safe, Monitor Smart!** 🔥
