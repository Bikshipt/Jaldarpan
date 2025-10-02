# Jal Darpan Deployment Guide

This guide will walk you through deploying the Jal Darpan water quality monitoring dashboard to Firebase.

## Prerequisites

1. **Node.js 18+** installed on your system
2. **Firebase CLI** installed globally:
   ```bash
   npm install -g firebase-tools
   ```
3. **Git** for version control
4. **Firebase Account** with billing enabled (for Functions)

## Step 1: Firebase Project Setup

### 1.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `jal-darpan-project`
4. Enable Google Analytics (optional)
5. Click "Create project"

### 1.2 Enable Services

#### Authentication
1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Create a test user:
   - Email: `admin@jaldarpan.com`
   - Password: `securepassword123`

#### Firestore Database
1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your deployment region
5. Click "Done"

#### Firebase Functions
1. Go to "Functions"
2. Click "Get started"
3. Choose "Blaze" plan (required for external HTTP requests)
4. Select the same region as your Firestore database

### 1.3 Get Firebase Configuration
1. Go to "Project settings" (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" → "Web"
4. Register app with name "Jal Darpan Web"
5. Copy the configuration object

## Step 2: Environment Configuration

### 2.1 Create Environment File
Create `.env.local` in the project root:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=jal-darpan-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=jal-darpan-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=jal-darpan-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 2.2 Set Functions Environment Variables
```bash
firebase functions:config:set esp32.api_key="your-secure-esp32-api-key"
```

## Step 3: Deploy Firebase Functions

### 3.1 Install Functions Dependencies
```bash
cd functions
npm install
cd ..
```

### 3.2 Deploy Functions
```bash
firebase deploy --only functions
```

**Note**: This may take 5-10 minutes for the first deployment.

### 3.3 Verify Function Deployment
1. Go to Firebase Console → Functions
2. You should see the `ingestData` function listed
3. Copy the function URL for ESP32 configuration

## Step 4: Build and Deploy Frontend

### 4.1 Build the Application
```bash
npm run build
```

### 4.2 Deploy to Firebase Hosting
```bash
firebase deploy --only hosting
```

### 4.3 Verify Deployment
1. Visit your Firebase hosting URL
2. You should see the Jal Darpan login page
3. Login with the test credentials created earlier

## Step 5: ESP32 Configuration

### 5.1 Update ESP32 Code
In `esp32-example/esp32_water_monitor.ino`:

1. **WiFi Configuration**:
   ```cpp
   const char* ssid = "YOUR_WIFI_SSID";
   const char* password = "YOUR_WIFI_PASSWORD";
   ```

2. **Firebase Function URL**:
   ```cpp
   const char* firebaseFunctionUrl = "https://your-region-jal-darpan-project.cloudfunctions.net/ingestData";
   ```

3. **API Key**:
   ```cpp
   const char* apiKey = "your-secure-esp32-api-key";
   ```

### 5.2 Upload to ESP32
1. Open Arduino IDE
2. Install required libraries:
   - WiFi
   - HTTPClient
   - ArduinoJson
   - OneWire
   - DallasTemperature
3. Select ESP32 board
4. Upload the code

## Step 6: Data Population

### 6.1 Create Initial Buoy Data
Use Firebase Console or create a script to add initial buoy documents:

```javascript
// Example Firestore document structure
{
  "id": "1",
  "name": "Kothri Pond #1",
  "location": {
    "latitude": 28.6139,
    "longitude": 77.2090
  },
  "last_whi": 85,
  "last_status": "Good",
  "last_updated": Timestamp.now(),
  "is_active": true
}
```

### 6.2 Test Data Ingestion
Send a test POST request to your function:

```bash
curl -X POST https://your-region-jal-darpan-project.cloudfunctions.net/ingestData \
  -H "Content-Type: application/json" \
  -d '{
    "api_key": "your-secure-esp32-api-key",
    "data": {
      "buoy_id": "1",
      "ph": 7.2,
      "turbidity": 15.5,
      "dissolved_oxygen": 8.2,
      "orp": 150,
      "temperature": 24.5,
      "timestamp": 1640995200000
    }
  }'
```

## Step 7: Security Configuration

### 7.1 Firestore Security Rules
Update Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read all data
    match /buoys/{buoyId} {
      allow read: if request.auth != null;
      allow write: if false; // Only allow writes via Functions
      
      match /readings/{readingId} {
        allow read: if request.auth != null;
        allow write: if false;
      }
      
      match /events/{eventId} {
        allow read: if request.auth != null;
        allow write: if false;
      }
    }
  }
}
```

### 7.2 Hosting Security Headers
Add security headers to `firebase.json`:

```json
{
  "hosting": {
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          },
          {
            "key": "X-Frame-Options",
            "value": "DENY"
          },
          {
            "key": "X-XSS-Protection",
            "value": "1; mode=block"
          }
        ]
      }
    ]
  }
}
```

## Step 8: Monitoring and Maintenance

### 8.1 Firebase Console Monitoring
- **Functions**: Monitor execution times and errors
- **Firestore**: Monitor read/write operations
- **Authentication**: Monitor user sign-ins
- **Hosting**: Monitor traffic and performance

### 8.2 Logs and Debugging
```bash
# View function logs
firebase functions:log

# View hosting logs
firebase hosting:log

# Test functions locally
firebase emulators:start
```

### 8.3 Backup and Recovery
1. **Export Firestore Data**:
   ```bash
   firebase firestore:export ./backup
   ```

2. **Import Firestore Data**:
   ```bash
   firebase firestore:import ./backup
   ```

## Troubleshooting

### Common Issues

1. **Functions Deployment Fails**:
   - Ensure you're on Blaze plan
   - Check Node.js version (18+)
   - Verify billing is enabled

2. **Authentication Issues**:
   - Verify Firebase config in `.env.local`
   - Check if user exists in Firebase Console
   - Ensure Email/Password provider is enabled

3. **ESP32 Connection Issues**:
   - Verify WiFi credentials
   - Check function URL is correct
   - Ensure API key matches

4. **Map Not Loading**:
   - Check if Leaflet CSS is loading
   - Verify coordinates are valid
   - Check browser console for errors

### Performance Optimization

1. **Enable Firestore Caching**:
   ```javascript
   // In your Firebase config
   const db = getFirestore(app);
   enableNetwork(db); // Enable offline persistence
   ```

2. **Optimize Functions**:
   - Use batch writes for multiple operations
   - Implement proper error handling
   - Add request validation

3. **Hosting Optimization**:
   - Enable compression
   - Use CDN for static assets
   - Implement proper caching headers

## Production Checklist

- [ ] Firebase project created and configured
- [ ] Authentication enabled with test users
- [ ] Firestore database created with security rules
- [ ] Functions deployed and tested
- [ ] Environment variables configured
- [ ] Frontend built and deployed
- [ ] ESP32 code configured and tested
- [ ] Initial data populated
- [ ] Security headers configured
- [ ] Monitoring and logging enabled
- [ ] Backup strategy implemented
- [ ] Performance optimization applied

## Support

For deployment issues:
1. Check Firebase Console logs
2. Review function execution logs
3. Verify environment variables
4. Test with Firebase emulators
5. Contact Firebase support if needed

---

**Jal Darpan** - Successfully deployed and monitoring water quality! 🌊
