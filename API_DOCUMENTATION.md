# 📡 API Documentation

## ESP32 Rescue Monitoring System - Complete API Reference

**Version**: 1.0.0  
**Base URL**: `http://localhost:5000/api` (Development)  
**Production URL**: `https://your-domain.com/api`

---

## 📋 Table of Contents

1. [Authentication](#authentication)
2. [Telemetry Endpoints](#telemetry-endpoints)
3. [Rescue Operations](#rescue-operations)
4. [Admin Endpoints](#admin-endpoints)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)
7. [WebSocket Events](#websocket-events)

---

## 🔐 Authentication

### Overview
The API uses JWT (JSON Web Token) for authentication. Include the token in the Authorization header for protected endpoints.

### Headers
```http
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

---

## 1️⃣ Authentication Endpoints

### POST /api/auth/login

Login user (Admin or Commando)

**Authentication**: None required

**Request Body**:
```json
{
  "username": "string",
  "password": "string"
}
```

**Success Response** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

**Error Responses**:

400 Bad Request:
```json
{
  "message": "Username and password are required"
}
```

401 Unauthorized:
```json
{
  "message": "Invalid credentials"
}
```

**Example**:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

---

## 2️⃣ Telemetry Endpoints

### POST /api/telemetry

Receive telemetry data from ESP32 devices

**Authentication**: None required (for ESP32 devices)

**Request Body**:
```json
{
  "w": {
    "hr": 75,           // Heart Rate (bpm)
    "sp": 98.5,         // SpO2 (%)
    "al": 100,          // Altitude (meters)
    "tp": 36.5,         // Temperature (°C)
    "mx": -0.21,        // Accelerometer X
    "my": -0.21,        // Accelerometer Y
    "mz": 10.00,        // Accelerometer Z
    "ts": 80901         // Timestamp (milliseconds)
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

**Success Response** (200 OK):
```json
{
  "message": "Telemetry received and processed",
  "status": "normal",
  "telemetryId": "507f1f77bcf86cd799439011",
  "timestamp": "2024-12-07T10:30:00.000Z"
}
```

**Error Responses**:

400 Bad Request:
```json
{
  "message": "Invalid telemetry data format"
}
```

404 Not Found:
```json
{
  "message": "Device not mapped to any fighter"
}
```

**Status Calculation**:
- `emergency`: HR < 50, SpO2 < 90%, or no movement > 30s
- `need_attention`: CO > 200ppm, Methane > 50000ppm, or Temp > 105°C
- `normal`: All values within safe ranges

**Example**:
```bash
curl -X POST http://localhost:5000/api/telemetry \
  -H "Content-Type: application/json" \
  -d '{
    "w": {"hr": 75, "sp": 98.5, "al": 100, "tp": 36.5, "mx": -0.21, "my": -0.21, "mz": 10.00, "ts": 80901},
    "s": {"m2": 240, "m7": 48},
    "i": {"id": "TX-44b7b3f8", "pn": 22}
  }'
```

**Socket.IO Broadcast**:
After processing, the server broadcasts to all clients in the operation room:
```javascript
socket.emit('telemetry_update', {
  operationId: "OP-1234567890",
  fighterId: "F001",
  deviceId: "TX-44b7b3f8",
  heartRate: 75,
  spO2: 98.5,
  temperature: 36.5,
  methane: 240,
  co: 48,
  status: "normal",
  timestamp: "2024-12-07T10:30:00.000Z"
});
```

---

## 3️⃣ Rescue Operations Endpoints

### POST /api/rescue/pre-rescue

Start a new rescue operation

**Authentication**: Required (Commando role)

**Request Body**:
```json
{
  "location": "Building A, 5th Floor",
  "operationType": "Fire Rescue",
  "description": "3-story building fire with trapped civilians",
  "fighters": [
    {
      "fighterId": "F001",
      "deviceId": "TX-44b7b3f8"
    },
    {
      "fighterId": "F002",
      "deviceId": "TX-55c8d4g9"
    }
  ]
}
```

**Success Response** (201 Created):
```json
{
  "message": "Operation started successfully",
  "operation": {
    "operationId": "OP-1733572800000",
    "commandoId": "CMD001",
    "location": "Building A, 5th Floor",
    "operationType": "Fire Rescue",
    "description": "3-story building fire with trapped civilians",
    "fighters": [
      {
        "fighterId": "F001",
        "deviceId": "TX-44b7b3f8"
      },
      {
        "fighterId": "F002",
        "deviceId": "TX-55c8d4g9"
      }
    ],
    "startTime": "2024-12-07T10:00:00.000Z",
    "status": "active",
    "createdAt": "2024-12-07T10:00:00.000Z"
  }
}
```

**Error Responses**:

400 Bad Request:
```json
{
  "message": "Location and operation type are required"
}
```

401 Unauthorized:
```json
{
  "message": "Authentication required"
}
```

**Example**:
```bash
curl -X POST http://localhost:5000/api/rescue/pre-rescue \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "location": "Building A",
    "operationType": "Fire Rescue",
    "description": "Emergency rescue",
    "fighters": [{"fighterId": "F001", "deviceId": "TX-44b7b3f8"}]
  }'
```

---

### GET /api/rescue/active

Get all active operations for the logged-in commando

**Authentication**: Required (Commando role)

**Query Parameters**: None

**Success Response** (200 OK):
```json
[
  {
    "operationId": "OP-1733572800000",
    "commandoId": "CMD001",
    "location": "Building A, 5th Floor",
    "operationType": "Fire Rescue",
    "description": "3-story building fire",
    "fighters": [
      {
        "fighterId": "F001",
        "deviceId": "TX-44b7b3f8"
      }
    ],
    "startTime": "2024-12-07T10:00:00.000Z",
    "status": "active",
    "createdAt": "2024-12-07T10:00:00.000Z"
  }
]
```

**Example**:
```bash
curl -X GET http://localhost:5000/api/rescue/active \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### GET /api/rescue/:operationId

Get details of a specific operation

**Authentication**: Required (Commando role)

**URL Parameters**:
- `operationId` (string): The operation ID

**Success Response** (200 OK):
```json
{
  "operationId": "OP-1733572800000",
  "commandoId": "CMD001",
  "location": "Building A, 5th Floor",
  "operationType": "Fire Rescue",
  "description": "3-story building fire",
  "fighters": [
    {
      "fighterId": "F001",
      "deviceId": "TX-44b7b3f8"
    }
  ],
  "startTime": "2024-12-07T10:00:00.000Z",
  "status": "active",
  "createdAt": "2024-12-07T10:00:00.000Z"
}
```

**Error Responses**:

404 Not Found:
```json
{
  "message": "Operation not found"
}
```

**Example**:
```bash
curl -X GET http://localhost:5000/api/rescue/OP-1733572800000 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### POST /api/rescue/post-rescue

End a rescue operation

**Authentication**: Required (Commando role)

**Request Body**:
```json
{
  "operationId": "OP-1733572800000",
  "casualties": 0,
  "rescued": 5,
  "notes": "Operation completed successfully. All civilians evacuated safely."
}
```

**Success Response** (200 OK):
```json
{
  "message": "Operation ended successfully",
  "postRescue": {
    "operationId": "OP-1733572800000",
    "commandoId": "CMD001",
    "endTime": "2024-12-07T12:00:00.000Z",
    "duration": 7200,
    "casualties": 0,
    "rescued": 5,
    "notes": "Operation completed successfully",
    "uploadedToCloud": false,
    "createdAt": "2024-12-07T12:00:00.000Z"
  }
}
```

**Error Responses**:

400 Bad Request:
```json
{
  "message": "Operation ID is required"
}
```

404 Not Found:
```json
{
  "message": "Operation not found"
}
```

**Example**:
```bash
curl -X POST http://localhost:5000/api/rescue/post-rescue \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "operationId": "OP-1733572800000",
    "casualties": 0,
    "rescued": 5,
    "notes": "Operation completed successfully"
  }'
```

---

### POST /api/rescue/upload-operation/:id

Mark operation data as uploaded to cloud

**Authentication**: Required (Commando role)

**URL Parameters**:
- `id` (string): The operation ID

**Success Response** (200 OK):
```json
{
  "message": "Operation marked as uploaded",
  "uploadedAt": "2024-12-07T12:30:00.000Z"
}
```

**Example**:
```bash
curl -X POST http://localhost:5000/api/rescue/upload-operation/OP-1733572800000 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 4️⃣ Admin Endpoints

### POST /api/admin/commando

Register a new commando

**Authentication**: Required (Admin role)

**Request Body**:
```json
{
  "commandoId": "CMD001",
  "name": "John Doe",
  "email": "john.doe@rescue.com",
  "phone": "+1234567890",
  "username": "johndoe",
  "password": "SecurePassword123!"
}
```

**Success Response** (201 Created):
```json
{
  "message": "Commando registered successfully",
  "commando": {
    "commandoId": "CMD001",
    "name": "John Doe",
    "email": "john.doe@rescue.com",
    "phone": "+1234567890",
    "userId": "507f1f77bcf86cd799439011",
    "isActive": true,
    "createdAt": "2024-12-07T10:00:00.000Z"
  },
  "credentials": {
    "username": "johndoe",
    "password": "SecurePassword123!"
  }
}
```

**Error Responses**:

400 Bad Request:
```json
{
  "message": "Commando ID already exists"
}
```

403 Forbidden:
```json
{
  "message": "Admin access required"
}
```

**Example**:
```bash
curl -X POST http://localhost:5000/api/admin/commando \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "commandoId": "CMD001",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "username": "johndoe",
    "password": "SecurePass123"
  }'
```

---

### GET /api/admin/commandos

Get all commandos

**Authentication**: Required (Admin role)

**Success Response** (200 OK):
```json
[
  {
    "commandoId": "CMD001",
    "name": "John Doe",
    "email": "john.doe@rescue.com",
    "phone": "+1234567890",
    "isActive": true,
    "createdAt": "2024-12-07T10:00:00.000Z"
  }
]
```

**Example**:
```bash
curl -X GET http://localhost:5000/api/admin/commandos \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

---

### PUT /api/admin/commando/:id

Update commando details

**Authentication**: Required (Admin role)

**URL Parameters**:
- `id` (string): The commando ID

**Request Body**:
```json
{
  "name": "John Doe Updated",
  "email": "john.updated@rescue.com",
  "phone": "+1234567891",
  "isActive": true
}
```

**Success Response** (200 OK):
```json
{
  "message": "Commando updated successfully",
  "commando": {
    "commandoId": "CMD001",
    "name": "John Doe Updated",
    "email": "john.updated@rescue.com",
    "phone": "+1234567891",
    "isActive": true
  }
}
```

**Example**:
```bash
curl -X PUT http://localhost:5000/api/admin/commando/CMD001 \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe Updated",
    "email": "john.updated@rescue.com"
  }'
```

---

### DELETE /api/admin/commando/:id

Delete a commando

**Authentication**: Required (Admin role)

**URL Parameters**:
- `id` (string): The commando ID

**Success Response** (200 OK):
```json
{
  "message": "Commando deleted successfully"
}
```

**Example**:
```bash
curl -X DELETE http://localhost:5000/api/admin/commando/CMD001 \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

---

### POST /api/admin/map-device

Map ESP32 device to a fighter

**Authentication**: Required (Admin role)

**Request Body**:
```json
{
  "commandoId": "CMD001",
  "fighterId": "F001",
  "fighterName": "Fighter One",
  "deviceId": "TX-44b7b3f8"
}
```

**Success Response** (200 OK):
```json
{
  "message": "Device mapped successfully",
  "fighter": {
    "fighterId": "F001",
    "name": "Fighter One",
    "deviceId": "TX-44b7b3f8",
    "commandoId": "CMD001",
    "isActive": true,
    "createdAt": "2024-12-07T10:00:00.000Z"
  }
}
```

**Error Responses**:

400 Bad Request:
```json
{
  "message": "Device ID already mapped to another fighter"
}
```

**Example**:
```bash
curl -X POST http://localhost:5000/api/admin/map-device \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "commandoId": "CMD001",
    "fighterId": "F001",
    "fighterName": "Fighter One",
    "deviceId": "TX-44b7b3f8"
  }'
```

---

### GET /api/admin/search

Search operations with filters

**Authentication**: Required (Admin role)

**Query Parameters**:
- `commandoId` (optional): Filter by commando ID
- `startDate` (optional): Filter by start date (ISO 8601)
- `endDate` (optional): Filter by end date (ISO 8601)
- `status` (optional): Filter by status (active, completed, cancelled)

**Success Response** (200 OK):
```json
{
  "operations": [
    {
      "operationId": "OP-1733572800000",
      "commandoId": "CMD001",
      "location": "Building A",
      "operationType": "Fire Rescue",
      "startTime": "2024-12-07T10:00:00.000Z",
      "status": "completed",
      "fighters": 2,
      "casualties": 0,
      "rescued": 5
    }
  ],
  "total": 1
}
```

**Example**:
```bash
curl -X GET "http://localhost:5000/api/admin/search?commandoId=CMD001&status=completed" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

---

### GET /api/admin/summary

Get system summary and statistics

**Authentication**: Required (Admin role)

**Success Response** (200 OK):
```json
{
  "totalCommandos": 5,
  "totalFighters": 20,
  "activeOperations": 2,
  "completedOperations": 45,
  "totalRescued": 230,
  "totalCasualties": 12,
  "recentOperations": [
    {
      "operationId": "OP-1733572800000",
      "location": "Building A",
      "startTime": "2024-12-07T10:00:00.000Z",
      "status": "active"
    }
  ]
}
```

**Example**:
```bash
curl -X GET http://localhost:5000/api/admin/summary \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

---

### GET /api/admin/telemetry/:operationId

Get telemetry history for an operation

**Authentication**: Required (Admin role)

**URL Parameters**:
- `operationId` (string): The operation ID

**Query Parameters**:
- `fighterId` (optional): Filter by fighter ID
- `limit` (optional): Limit number of results (default: 100)

**Success Response** (200 OK):
```json
{
  "operationId": "OP-1733572800000",
  "telemetry": [
    {
      "deviceId": "TX-44b7b3f8",
      "fighterId": "F001",
      "timestamp": "2024-12-07T10:30:00.000Z",
      "heartRate": 75,
      "spO2": 98.5,
      "temperature": 36.5,
      "altitude": 100,
      "accelX": -0.21,
      "accelY": -0.21,
      "accelZ": 10.00,
      "methane": 240,
      "co": 48,
      "status": "normal"
    }
  ],
  "total": 1
}
```

**Example**:
```bash
curl -X GET "http://localhost:5000/api/admin/telemetry/OP-1733572800000?limit=50" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

---

## 5️⃣ Error Handling

### Standard Error Response Format

```json
{
  "message": "Error description",
  "error": "Detailed error message (development only)",
  "statusCode": 400
}
```

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Authentication required or failed |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 500 | Internal Server Error | Server error |

---

## 6️⃣ Rate Limiting

**Current Status**: Not implemented (recommended for production)

**Recommended Limits**:
- Authentication: 5 requests per minute
- Telemetry: 1000 requests per minute per device
- Other endpoints: 100 requests per minute per user

**Implementation Example**:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## 7️⃣ WebSocket Events (Socket.IO)

### Connection

**Client → Server**:
```javascript
const socket = io('http://localhost:5000');

socket.on('connect', () => {
  console.log('Connected:', socket.id);
});
```

### Join Operation Room

**Client → Server**:
```javascript
socket.emit('join_operation', 'OP-1733572800000');
```

### Telemetry Updates

**Server → Client**:
```javascript
socket.on('telemetry_update', (data) => {
  console.log('New telemetry:', data);
  // {
  //   operationId: "OP-1733572800000",
  //   fighterId: "F001",
  //   deviceId: "TX-44b7b3f8",
  //   heartRate: 75,
  //   spO2: 98.5,
  //   temperature: 36.5,
  //   methane: 240,
  //   co: 48,
  //   status: "normal",
  //   timestamp: "2024-12-07T10:30:00.000Z"
  // }
});
```

### Disconnect

**Client → Server**:
```javascript
socket.on('disconnect', () => {
  console.log('Disconnected');
});
```

---

## 📊 Data Models

### User Model
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String (hashed),
  role: String (enum: ['commando', 'admin']),
  isActive: Boolean,
  createdAt: Date
}
```

### Commando Model
```javascript
{
  _id: ObjectId,
  commandoId: String (unique),
  name: String,
  email: String,
  phone: String,
  userId: ObjectId (ref: User),
  isActive: Boolean,
  createdAt: Date
}
```

### Fighter Model
```javascript
{
  _id: ObjectId,
  fighterId: String (unique),
  name: String,
  deviceId: String (unique),
  commandoId: String (ref: Commando),
  isActive: Boolean,
  createdAt: Date
}
```

### PreRescue Model
```javascript
{
  _id: ObjectId,
  operationId: String (unique),
  commandoId: String (ref: Commando),
  location: String,
  operationType: String,
  description: String,
  fighters: [{
    fighterId: String (ref: Fighter),
    deviceId: String
  }],
  startTime: Date,
  status: String (enum: ['active', 'completed', 'cancelled']),
  createdAt: Date
}
```

### TelemetryReading Model
```javascript
{
  _id: ObjectId,
  deviceId: String,
  fighterId: String (ref: Fighter),
  operationId: String (ref: PreRescue),
  timestamp: Date,
  heartRate: Number,
  spO2: Number,
  temperature: Number,
  altitude: Number,
  accelX: Number,
  accelY: Number,
  accelZ: Number,
  lastAccelTime: Date,
  methane: Number,
  co: Number,
  status: String (enum: ['normal', 'need_attention', 'emergency']),
  rawData: Mixed,
  createdAt: Date,
  updatedAt: Date
}
```

### PostRescue Model
```javascript
{
  _id: ObjectId,
  operationId: String (unique, ref: PreRescue),
  commandoId: String (ref: Commando),
  endTime: Date,
  duration: Number (seconds),
  casualties: Number,
  rescued: Number,
  notes: String,
  uploadedToCloud: Boolean,
  uploadedAt: Date,
  createdAt: Date
}
```

---

## 🔒 Security Best Practices

### 1. Authentication
- Always include JWT token in Authorization header
- Tokens expire after 24 hours (configurable)
- Use HTTPS in production

### 2. Password Requirements
- Minimum 6 characters
- Hashed using bcrypt (10 salt rounds)
- Never store plain text passwords

### 3. CORS Configuration
```javascript
// Development
cors({
  origin: 'http://localhost:3000'
})

// Production
cors({
  origin: 'https://your-production-domain.com'
})
```

### 4. Input Validation
- All inputs are validated using express-validator
- SQL injection prevention (using Mongoose)
- XSS prevention (sanitize inputs)

---

## 📝 Postman Collection

Import this collection to test all endpoints:

```json
{
  "info": {
    "name": "ESP32 Rescue Monitoring API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"username\": \"admin\",\n  \"password\": \"admin123\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{baseUrl}}/api/auth/login",
              "host": ["{{baseUrl}}"],
              "path": ["api", "auth", "login"]
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000"
    }
  ]
}
```

---

## 🧪 Testing Examples

### JavaScript (Axios)
```javascript
const axios = require('axios');

// Login
const login = async () => {
  const response = await axios.post('http://localhost:5000/api/auth/login', {
    username: 'admin',
    password: 'admin123'
  });
  return response.data.token;
};

// Get active operations
const getActiveOperations = async (token) => {
  const response = await axios.get('http://localhost:5000/api/rescue/active', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};
```

### Python (Requests)
```python
import requests

# Login
response = requests.post('http://localhost:5000/api/auth/login', json={
    'username': 'admin',
    'password': 'admin123'
})
token = response.json()['token']

# Get active operations
headers = {'Authorization': f'Bearer {token}'}
response = requests.get('http://localhost:5000/api/rescue/active', headers=headers)
operations = response.json()
```

### ESP32 (Arduino)
```cpp
#include <HTTPClient.h>
#include <ArduinoJson.h>

void sendTelemetry() {
  HTTPClient http;
  http.begin("http://your-server:5000/api/telemetry");
  http.addHeader("Content-Type", "application/json");
  
  StaticJsonDocument<512> doc;
  JsonObject w = doc.createNestedObject("w");
  w["hr"] = 75;
  w["sp"] = 98.5;
  // ... add other fields
  
  String output;
  serializeJson(doc, output);
  
  int httpResponseCode = http.POST(output);
  http.end();
}
```

---

## 📞 Support

For API support:
- 📖 Read the [Complete Documentation](CLIENT_DELIVERY_GUIDE.md)
- 🐛 Report issues on [GitHub](https://github.com/barathit/ESP32-SOFTWARE/issues)
- 📧 Contact: support@example.com

---

## 📄 Changelog

### Version 1.0.0 (2024-12-07)
- Initial API release
- Authentication endpoints
- Telemetry ingestion
- Rescue operation management
- Admin endpoints
- WebSocket real-time updates

---

**API Documentation Version**: 1.0.0  
**Last Updated**: December 7, 2024  
**Status**: Production Ready ✅
