/*
 * ESP32 Rescue Monitoring System - Example Code
 * 
 * This is example Arduino code for ESP32 to send telemetry data
 * to the Rescue Monitoring System backend API.
 * 
 * Required Libraries:
 * - WiFi (built-in)
 * - HTTPClient (built-in)
 * - ArduinoJson (install via Library Manager)
 * 
 * Hardware Connections:
 * - Heart Rate Sensor: Connect to I2C
 * - SpO2 Sensor: Connect to I2C
 * - Temperature Sensor: Connect to I2C
 * - Accelerometer: Connect to I2C
 * - Gas Sensors (Methane m2, CO m7): Connect to analog pins
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// WiFi Credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Backend API URL
const char* serverURL = "http://YOUR_SERVER_IP:5000/api/telemetry";

// ESP32 Device ID (should match the device ID mapped in admin panel)
const char* deviceId = "TX-44b7b3f8";

// Sensor pins (adjust based on your hardware)
const int methanePin = 34;  // Analog pin for Methane (m2)
const int coPin = 35;       // Analog pin for CO (m7)

// Variables to store sensor readings
float heartRate = 0;
float spO2 = 0;
float altitude = 0;
float temperature = 0;
float accelX = 0;
float accelY = 0;
float accelZ = 0;
int methane = 0;
int co = 0;

void setup() {
  Serial.begin(115200);
  delay(1000);

  // Initialize WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println();
  Serial.print("Connected! IP address: ");
  Serial.println(WiFi.localIP());

  // Initialize sensors (add your sensor initialization code here)
  initializeSensors();
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    // Read sensor values (replace with actual sensor reading functions)
    readSensors();
    
    // Create JSON payload
    String jsonPayload = createTelemetryJSON();
    
    // Send to backend
    sendTelemetry(jsonPayload);
    
    delay(5000); // Send every 5 seconds
  } else {
    Serial.println("WiFi disconnected. Reconnecting...");
    WiFi.reconnect();
    delay(5000);
  }
}

void initializeSensors() {
  // Initialize I2C sensors
  // Wire.begin();
  // Initialize your sensors here
  Serial.println("Sensors initialized");
}

void readSensors() {
  // Read Heart Rate (example - replace with actual sensor code)
  heartRate = 75 + random(-5, 5); // Simulated data
  
  // Read SpO2 (example - replace with actual sensor code)
  spO2 = 98 + random(-2, 2); // Simulated data
  
  // Read Temperature (example - replace with actual sensor code)
  temperature = 36.5 + random(-1, 1) * 0.1; // Simulated data
  
  // Read Altitude (example - replace with actual sensor code)
  altitude = 100 + random(-10, 10); // Simulated data
  
  // Read Accelerometer (example - replace with actual sensor code)
  accelX = (random(-100, 100)) / 100.0;
  accelY = (random(-100, 100)) / 100.0;
  accelZ = 10.0 + (random(-50, 50)) / 100.0;
  
  // Read Gas Sensors
  methane = analogRead(methanePin); // Convert to ppm based on sensor calibration
  co = analogRead(coPin); // Convert to ppm based on sensor calibration
  
  // Add timestamp (milliseconds since boot, or use NTP for real time)
  // For production, use NTP to get real timestamp
}

String createTelemetryJSON() {
  // Create JSON document
  StaticJsonDocument<512> doc;
  
  // Health data (w)
  JsonObject w = doc.createNestedObject("w");
  w["hr"] = heartRate;
  w["sp"] = spO2;
  w["al"] = altitude;
  w["tp"] = temperature;
  w["mx"] = accelX;
  w["my"] = accelY;
  w["mz"] = accelZ;
  w["ts"] = millis(); // Timestamp in milliseconds
  
  // Sensor data (s)
  JsonObject s = doc.createNestedObject("s");
  s["m2"] = methane; // Methane
  s["m7"] = co;      // CO
  
  // Device info (i)
  JsonObject i = doc.createNestedObject("i");
  i["id"] = deviceId;
  i["pn"] = 22; // Packet number (increment this)
  
  // Serialize to string
  String output;
  serializeJson(doc, output);
  
  return output;
}

void sendTelemetry(String jsonPayload) {
  HTTPClient http;
  
  http.begin(serverURL);
  http.addHeader("Content-Type", "application/json");
  
  int httpResponseCode = http.POST(jsonPayload);
  
  if (httpResponseCode > 0) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    
    String response = http.getString();
    Serial.println("Response: " + response);
  } else {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
  }
  
  http.end();
}

/*
 * NOTES:
 * 
 * 1. Replace sensor reading functions with actual hardware code
 * 2. Calibrate gas sensors to convert analog readings to ppm
 * 3. Use NTP for real timestamps in production
 * 4. Add error handling and retry logic
 * 5. Consider adding authentication/API key for production
 * 6. Implement deep sleep mode to save battery if needed
 * 7. Add watchdog timer for reliability
 */

