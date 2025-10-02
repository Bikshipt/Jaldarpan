/*
 * Jal Darpan - ESP32 Water Quality Monitor
 * 
 * This code demonstrates how to send sensor data to the Jal Darpan dashboard
 * via the Firebase Functions ingestData endpoint.
 * 
 * Hardware Requirements:
 * - ESP32 Development Board
 * - pH Sensor (Analog)
 * - Turbidity Sensor (Analog)
 * - Dissolved Oxygen Sensor (Analog)
 * - ORP Sensor (Analog)
 * - Temperature Sensor (DS18B20 or similar)
 * - WiFi connectivity
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// WiFi Configuration
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Firebase Functions Configuration
const char* firebaseFunctionUrl = "https://your-region-your-project.cloudfunctions.net/ingestData";
const char* apiKey = "your-secure-api-key";
const char* buoyId = "1"; // Unique identifier for this buoy

// Sensor Pin Definitions
#define PH_PIN 36          // pH sensor analog pin
#define TURBIDITY_PIN 39   // Turbidity sensor analog pin
#define DO_PIN 34          // Dissolved Oxygen sensor analog pin
#define ORP_PIN 35         // ORP sensor analog pin
#define TEMP_PIN 4         // DS18B20 temperature sensor pin

// Sensor Calibration Values (adjust based on your sensors)
#define PH_OFFSET 0.00
#define PH_SLOPE 1.00
#define TURBIDITY_OFFSET 0
#define TURBIDITY_SLOPE 1
#define DO_OFFSET 0
#define DO_SLOPE 1
#define ORP_OFFSET 0
#define ORP_SLOPE 1

// Timing Configuration
const unsigned long SENSOR_READ_INTERVAL = 30000; // 30 seconds
const unsigned long UPLOAD_INTERVAL = 300000;     // 5 minutes
unsigned long lastSensorRead = 0;
unsigned long lastUpload = 0;

// Temperature sensor setup
OneWire oneWire(TEMP_PIN);
DallasTemperature tempSensor(&oneWire);

// Sensor data structure
struct SensorData {
  float ph;
  float turbidity;
  float dissolvedOxygen;
  float orp;
  float temperature;
  unsigned long timestamp;
};

SensorData currentData;

void setup() {
  Serial.begin(115200);
  
  // Initialize temperature sensor
  tempSensor.begin();
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println();
  Serial.println("WiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  
  // Initial sensor reading
  readAllSensors();
}

void loop() {
  unsigned long currentTime = millis();
  
  // Read sensors every 30 seconds
  if (currentTime - lastSensorRead >= SENSOR_READ_INTERVAL) {
    readAllSensors();
    lastSensorRead = currentTime;
  }
  
  // Upload data every 5 minutes
  if (currentTime - lastUpload >= UPLOAD_INTERVAL) {
    uploadData();
    lastUpload = currentTime;
  }
  
  delay(1000); // Small delay to prevent watchdog issues
}

void readAllSensors() {
  Serial.println("Reading sensors...");
  
  // Read pH
  currentData.ph = readPHSensor();
  
  // Read Turbidity
  currentData.turbidity = readTurbiditySensor();
  
  // Read Dissolved Oxygen
  currentData.dissolvedOxygen = readDOSensor();
  
  // Read ORP
  currentData.orp = readORPSensor();
  
  // Read Temperature
  currentData.temperature = readTemperatureSensor();
  
  // Set timestamp
  currentData.timestamp = millis();
  
  // Print readings to serial
  Serial.println("Sensor Readings:");
  Serial.printf("pH: %.2f\n", currentData.ph);
  Serial.printf("Turbidity: %.2f NTU\n", currentData.turbidity);
  Serial.printf("Dissolved Oxygen: %.2f mg/L\n", currentData.dissolvedOxygen);
  Serial.printf("ORP: %.2f mV\n", currentData.orp);
  Serial.printf("Temperature: %.2f °C\n", currentData.temperature);
  Serial.println();
}

float readPHSensor() {
  int rawValue = analogRead(PH_PIN);
  float voltage = (rawValue / 4095.0) * 3.3; // Convert to voltage (3.3V reference)
  float ph = PH_SLOPE * voltage + PH_OFFSET;
  return constrain(ph, 0, 14); // Constrain to valid pH range
}

float readTurbiditySensor() {
  int rawValue = analogRead(TURBIDITY_PIN);
  float voltage = (rawValue / 4095.0) * 3.3;
  float turbidity = TURBIDITY_SLOPE * voltage + TURBIDITY_OFFSET;
  return constrain(turbidity, 0, 1000); // Constrain to reasonable range
}

float readDOSensor() {
  int rawValue = analogRead(DO_PIN);
  float voltage = (rawValue / 4095.0) * 3.3;
  float do = DO_SLOPE * voltage + DO_OFFSET;
  return constrain(do, 0, 20); // Constrain to reasonable DO range
}

float readORPSensor() {
  int rawValue = analogRead(ORP_PIN);
  float voltage = (rawValue / 4095.0) * 3.3;
  float orp = ORP_SLOPE * voltage + ORP_OFFSET;
  return constrain(orp, -500, 500); // Constrain to reasonable ORP range
}

float readTemperatureSensor() {
  tempSensor.requestTemperatures();
  float temp = tempSensor.getTempCByIndex(0);
  return (temp != DEVICE_DISCONNECTED_C) ? temp : 25.0; // Default to 25°C if sensor error
}

void uploadData() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi not connected. Skipping upload.");
    return;
  }
  
  HTTPClient http;
  http.begin(firebaseFunctionUrl);
  http.addHeader("Content-Type", "application/json");
  
  // Create JSON payload
  DynamicJsonDocument doc(1024);
  doc["api_key"] = apiKey;
  
  JsonObject data = doc.createNestedObject("data");
  data["buoy_id"] = buoyId;
  data["ph"] = currentData.ph;
  data["turbidity"] = currentData.turbidity;
  data["dissolved_oxygen"] = currentData.dissolvedOxygen;
  data["orp"] = currentData.orp;
  data["temperature"] = currentData.temperature;
  data["timestamp"] = currentData.timestamp;
  
  String jsonString;
  serializeJson(doc, jsonString);
  
  Serial.println("Uploading data to Jal Darpan...");
  Serial.println(jsonString);
  
  int httpResponseCode = http.POST(jsonString);
  
  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.printf("HTTP Response code: %d\n", httpResponseCode);
    Serial.printf("Response: %s\n", response.c_str());
    
    // Parse response
    DynamicJsonDocument responseDoc(512);
    deserializeJson(responseDoc, response);
    
    if (responseDoc["success"]) {
      Serial.printf("Upload successful! WHI: %.0f, Status: %s\n", 
                   responseDoc["whi"].as<float>(), 
                   responseDoc["status"].as<const char*>());
    } else {
      Serial.println("Upload failed!");
    }
  } else {
    Serial.printf("HTTP Error: %s\n", http.errorToString(httpResponseCode).c_str());
  }
  
  http.end();
}

/*
 * Calibration Functions
 * Run these functions during sensor calibration to determine offset and slope values
 */

void calibratePHSensor() {
  Serial.println("pH Calibration Mode");
  Serial.println("Place sensor in pH 7 buffer solution and press any key...");
  while (!Serial.available()) delay(100);
  Serial.read(); // Clear buffer
  
  int rawValue = analogRead(PH_PIN);
  float voltage = (rawValue / 4095.0) * 3.3;
  Serial.printf("pH 7 reading: %d (%.2fV)\n", rawValue, voltage);
  
  Serial.println("Place sensor in pH 4 buffer solution and press any key...");
  while (!Serial.available()) delay(100);
  Serial.read();
  
  rawValue = analogRead(PH_PIN);
  voltage = (rawValue / 4095.0) * 3.3;
  Serial.printf("pH 4 reading: %d (%.2fV)\n", rawValue, voltage);
  
  Serial.println("Calibration complete. Update PH_OFFSET and PH_SLOPE values.");
}

/*
 * Error Handling and Recovery
 */

void checkWiFiConnection() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi connection lost. Reconnecting...");
    WiFi.reconnect();
    delay(5000);
  }
}

void printSystemStatus() {
  Serial.println("=== System Status ===");
  Serial.printf("WiFi Status: %s\n", WiFi.status() == WL_CONNECTED ? "Connected" : "Disconnected");
  Serial.printf("Free Heap: %d bytes\n", ESP.getFreeHeap());
  Serial.printf("Uptime: %lu seconds\n", millis() / 1000);
  Serial.println("===================");
}
