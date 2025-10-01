# Jal Darpan - Water Quality Monitoring Platform

A comprehensive real-time web application for monitoring the health of agricultural water bodies, designed for the "Jal Jeevan" environmental project. Features advanced sensor data visualization, interactive maps, and automated treatment systems.

## 🚀 Features

### Core Features
- **Real-time Dashboard**: Live water health metrics, buoy status, and alert monitoring
- **Interactive Regional Map**: Geographic visualization of water monitoring stations
- **Buoy Management**: Detailed sensor readings, historical data, and treatment logs
- **Water Health Index (WHI)**: Comprehensive scoring system for water quality assessment
- **Automated Treatment**: Smart aeration and microbe mix systems based on sensor data
- **Historical Analytics**: Time-series charts and trend analysis for water quality

### Technical Features
- **Modern UI/UX**: Built with Next.js 15, TypeScript, and Tailwind CSS
- **Real-time Updates**: Live sensor data with WebSocket integration
- **Responsive Design**: Mobile-first approach with glass morphism effects
- **Firebase Integration**: Authentication, Firestore database, and cloud functions
- **ESP32 Integration**: Direct sensor data ingestion from IoT devices
- **Progressive Web App**: Installable with offline capabilities

## 🛠️ Technology Stack

- **Frontend**: Next.js 15 + TypeScript + React 19
- **Styling**: Tailwind CSS with custom design system
- **Backend**: Firebase (Firestore, Auth, Functions)
- **Charts**: Recharts for data visualization
- **Maps**: React-Leaflet for interactive mapping
- **IoT**: ESP32 microcontroller integration
- **Deployment**: Vercel-ready with static export

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jaldarpan
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your Firebase credentials
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── buoy/[buoyId]/     # Dynamic buoy detail pages
│   ├── login/             # Authentication page
│   ├── globals.css        # Global styles and Tailwind
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Main dashboard
├── components/             # Reusable UI components
│   ├── BuoyHeader.tsx     # Buoy detail header
│   ├── BuoyList.tsx       # Buoy table component
│   ├── BuoyMap.tsx        # Interactive map component
│   ├── DataChart.tsx      # Historical data charts
│   ├── Header.tsx         # Navigation header
│   ├── KeyMetrics.tsx     # Dashboard metrics cards
│   ├── LiveSensors.tsx    # Real-time sensor readings
│   └── TreatmentLog.tsx   # Treatment history
├── contexts/               # React Context providers
│   └── AuthContext.tsx    # Authentication state
├── lib/                   # Utility functions
│   ├── firebase.ts        # Firebase configuration
│   └── utils.ts           # Helper functions
└── types/                 # TypeScript definitions
    └── index.ts           # Application types
```

## 🎨 Design System

### Color Palette
- **Primary Blue**: #2563EB - Trust and reliability
- **Success Green**: #10B981 - Good water health
- **Warning Amber**: #F59E0B - Moderate water health
- **Danger Red**: #EF4444 - Poor water health
- **Neutral**: Modern grays for balance

### Visual Effects
- **Glass Morphism**: Translucent elements with backdrop blur
- **Gradient Backgrounds**: Beautiful blue-to-purple gradients
- **3D Card Effects**: Cards with shadows and hover animations
- **Status Indicators**: Glowing dots with pulse animations
- **Smooth Transitions**: Hover effects and micro-interactions

### Typography
- **Font Family**: Inter (Google Fonts)
- **Responsive**: Mobile-first design approach
- **Hierarchy**: Clear text sizing and spacing

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication, Firestore, and Functions
3. Copy your config to `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
ESP32_API_KEY=your_secure_api_key
```

### ESP32 Integration
The platform supports direct data ingestion from ESP32 microcontrollers:

```cpp
// Example ESP32 code for sensor data transmission
void sendSensorData() {
  HTTPClient http;
  http.begin("https://your-firebase-function-url");
  http.addHeader("Content-Type", "application/json");
  http.addHeader("X-API-Key", "your_esp32_api_key");
  
  String jsonData = "{\"buoy_id\":\"buoy_001\",\"ph\":7.2,\"turbidity\":15.3,\"dissolved_oxygen\":8.1}";
  http.POST(jsonData);
}
```

## 📱 Features in Detail

### 1. Dashboard
- **Key Metrics**: Overall water health, active buoys, recent alerts
- **Regional Map**: Interactive map with buoy locations and status
- **Buoy List**: Comprehensive table with status indicators
- **Real-time Updates**: Live data refresh every 30 seconds

### 2. Buoy Detail Pages
- **Live Sensor Readings**: Real-time pH, turbidity, DO, ORP, temperature
- **Historical Charts**: Time-series data with selectable time ranges
- **Treatment Log**: Automated aeration and microbe mix events
- **Status Monitoring**: WHI-based health indicators

### 3. Water Health Index (WHI)
- **Comprehensive Scoring**: Multi-parameter water quality assessment
- **Status Classification**: Good (80-100), Moderate (50-79), Poor (0-49)
- **Visual Indicators**: Color-coded status with animations
- **Trend Analysis**: Historical WHI progression

### 4. Automated Treatment Systems
- **Smart Aeration**: Automatic oxygen injection based on DO levels
- **Microbe Mix**: Beneficial bacteria dosing for water treatment
- **Event Logging**: Complete treatment history with timestamps
- **Performance Tracking**: Treatment effectiveness monitoring

### 5. Data Visualization
- **Interactive Charts**: Recharts integration for data analysis
- **Time Range Selection**: 24h, 7d, 30d historical views
- **Treatment Overlays**: Event markers on historical charts
- **Export Capabilities**: Data export for external analysis

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Upload out/ folder to Netlify
```

### Firebase Functions Deployment
```bash
cd functions
npm install
firebase deploy --only functions
```

## 🔮 Future Enhancements

### Planned Features
- **Advanced Analytics**: Machine learning for water quality prediction
- **Mobile App**: React Native companion app
- **API Integration**: Third-party weather and environmental data
- **Multi-language Support**: Internationalization for global deployment
- **Dark Mode**: Toggle with smooth transitions
- **Real-time Notifications**: Push notifications for critical alerts
- **Advanced Mapping**: Satellite imagery and terrain data
- **Social Features**: Community sharing and collaboration

### Technical Improvements
- **State Management**: Zustand or Redux Toolkit
- **Testing**: Jest and React Testing Library
- **Performance**: Code splitting and lazy loading
- **Monitoring**: Error tracking and analytics
- **Security**: Enhanced authentication and authorization
- **Scalability**: Microservices architecture

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team**: For the amazing React framework
- **Tailwind CSS**: For the utility-first CSS framework
- **Firebase**: For the comprehensive backend platform
- **Recharts**: For beautiful data visualization
- **React-Leaflet**: For interactive mapping
- **Jal Jeevan Initiative**: For the environmental mission

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation
- Email: support@jaldarpan.com

## 🌊 Mission

**Jal Darpan** - Monitoring water health for sustainable agriculture and environmental protection. Every drop matters, every reading counts.

---

**Jal Darpan** - Reflecting the true health of our water resources. 💧"# Jaldarpan" 
