# ⚡ Quick Start Guide - ESP32 Rescue Monitoring System

## 🚀 Get Running in 5 Minutes

### Prerequisites
- Node.js v16+ installed
- MongoDB Atlas account (free)
- Code editor (VS Code recommended)

---

## Step 1: Install Dependencies (2 minutes)

```bash
# Navigate to project folder
cd ESP32-software

# Install everything
npm run install-all
```

---

## Step 2: Setup MongoDB (2 minutes)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account → Create cluster (M0 Free)
3. Database Access → Add User (username + password)
4. Network Access → Add IP → Allow from anywhere (0.0.0.0/0)
5. Connect → Connect your application → Copy connection string

---

## Step 3: Configure Environment (1 minute)

Create `backend/.env` file:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rescue_monitoring?retryWrites=true&w=majority
JWT_SECRET=my_super_secret_key_at_least_32_characters_long_12345
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

**Replace:**
- `username:password` with your MongoDB credentials
- `JWT_SECRET` with any random string (32+ chars)

---

## Step 4: Create Admin User (30 seconds)

```bash
npm run seed-admin
```

**Admin Login:**
- Username: `admin`
- Password: `admin123`

---

## Step 5: Start Application (30 seconds)

```bash
npm run dev
```

This starts:
- ✅ Backend: http://localhost:5000
- ✅ Frontend: http://localhost:3000

---

## Step 6: Login & Explore

1. Open browser: http://localhost:3000
2. Login with admin credentials
3. Register a commando
4. Map devices to fighters
5. Login as commando and start operation!

---

## 🎯 What to Do Next

### As Admin:
1. **Register Commando**
   - Click "Register New Commando"
   - Fill details and create account

2. **Map Devices**
   - Click "Map Device to Fighter"
   - Assign ESP32 device IDs to fighters

### As Commando:
1. **Start Operation**
   - Login with commando credentials
   - Click "Start New Operation"
   - Add fighters and device IDs
   - Begin monitoring!

2. **Monitor Live**
   - View real-time fighter status
   - Watch for alerts (🟢 🟠 🔴)
   - Click fighters for details

3. **End Operation**
   - Click "End Operation"
   - Fill post-rescue form
   - Submit completion report

---

## 📡 Connect ESP32 Device

### Quick Setup:
1. Open `ESP32_EXAMPLE.ino` in Arduino IDE
2. Update WiFi credentials:
   ```cpp
   const char* ssid = "YOUR_WIFI";
   const char* password = "YOUR_PASSWORD";
   ```
3. Update server URL:
   ```cpp
   const char* serverURL = "http://YOUR_IP:5000/api/telemetry";
   ```
4. Update device ID (must match mapped device):
   ```cpp
   const char* deviceId = "TX-44b7b3f8";
   ```
5. Upload to ESP32
6. Open Serial Monitor (115200 baud)
7. Watch telemetry being sent!

---

## 🎨 UI Features

### New Modern Interface:
- ✨ Professional header with gradient
- 📱 Responsive sidebar navigation
- 📊 Stats cards showing operations
- 🎯 Color-coded status alerts
- 🔄 Real-time updates via Socket.IO
- 📱 Mobile-friendly design

### Status Colors:
- 🟢 **Green** = Normal (all safe)
- 🟠 **Orange** = Need Attention (warning)
- 🔴 **Red** = Emergency (critical!)

---

## 🐛 Common Issues

### "Cannot connect to MongoDB"
- Check MONGODB_URI in `.env`
- Verify IP whitelist (0.0.0.0/0)
- Test internet connection

### "Port 5000 already in use"
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### "Frontend can't reach backend"
- Ensure backend is running (port 5000)
- Check `frontend/package.json` proxy setting
- Clear browser cache

### ESP32 not sending data
- Verify WiFi connection (Serial Monitor)
- Check server URL is correct
- Ensure device ID matches mapped device
- Confirm operation is active

---

## 📚 Full Documentation

For complete details, see:
- `CLIENT_DELIVERY_GUIDE.md` - Complete guide
- `README.md` - Project overview
- `SETUP.md` - Detailed setup
- `UI_IMPROVEMENTS.md` - UI changes

---

## 🎯 Testing Checklist

- [ ] Backend starts without errors
- [ ] Frontend loads at localhost:3000
- [ ] Can login as admin
- [ ] Can register commando
- [ ] Can map device to fighter
- [ ] Can login as commando
- [ ] Can start operation
- [ ] Can view live monitoring
- [ ] Can end operation
- [ ] Socket.IO shows "connected" in console

---

## 📞 Need Help?

Check the troubleshooting section in `CLIENT_DELIVERY_GUIDE.md`

---

**You're all set! Happy monitoring! 🚒🔥**
