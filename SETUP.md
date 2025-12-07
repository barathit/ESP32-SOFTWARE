# Setup Guide - ESP32 Rescue Monitoring System

## Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- Git

## Step 1: Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

Or use the convenience script:
```bash
npm run install-all
```

## Step 2: Configure Environment Variables

Create a `.env` file in the `backend` directory with the following:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rescue_monitoring?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

**Important:**
- Replace `MONGODB_URI` with your MongoDB Atlas connection string
- Change `JWT_SECRET` to a strong random string in production
- Update `CLIENT_URL` if your frontend runs on a different port

## Step 3: Create Admin User

Run the seed script to create the default admin user:

```bash
node backend/scripts/seedAdmin.js
```

Default admin credentials:
- Username: `admin`
- Password: `admin123`

**⚠️ Change the password immediately after first login!**

## Step 4: Start the Application

### Development Mode (Both Backend and Frontend)

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend React app on `http://localhost:3000`

### Run Separately

**Backend only:**
```bash
npm run server
```

**Frontend only:**
```bash
npm run client
```

## Step 5: Initial Setup (Admin Panel)

1. Login as admin (username: `admin`, password: `admin123`)
2. Register commandos via Admin Dashboard
3. Create fighters and map ESP32 devices to fighters
4. Commandos can now login and start rescue operations

## ESP32 Integration

Your ESP32 device should send POST requests to:
```
http://your-server-ip:5000/api/telemetry
```

With the following JSON format:
```json
{
  "w": {
    "hr": 105,
    "sp": 83.2,
    "al": 3,
    "tp": 28.4,
    "mx": -0.21,
    "my": -0.21,
    "mz": 10.00,
    "ts": 80901
  },
  "s": {
    "m2": 240,
    "m7": 48
  },
  "i": {
    "id": "TX-44b7b3f8",
    "pn": 22
  }
}
```

## Troubleshooting

### MongoDB Connection Issues
- Verify your MongoDB Atlas connection string
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure the database name is correct

### Port Already in Use
- Change the PORT in `.env` file
- Or kill the process using the port

### Frontend Not Connecting to Backend
- Check the proxy setting in `frontend/package.json`
- Verify `CLIENT_URL` in backend `.env` matches frontend URL
- Check CORS settings in `backend/server.js`

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use a strong `JWT_SECRET`
3. Update `CLIENT_URL` to your production frontend URL
4. Build frontend: `cd frontend && npm run build`
5. Use a process manager like PM2 for the backend
6. Set up reverse proxy (nginx) for production

