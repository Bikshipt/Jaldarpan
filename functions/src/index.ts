import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const db = admin.firestore();

interface SensorData {
  buoy_id: string;
  ph: number;
  turbidity: number;
  dissolved_oxygen: number;
  orp: number;
  temperature: number;
  timestamp: number;
}

interface IngestRequest {
  api_key: string;
  data: SensorData;
}

export const ingestData = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { api_key, data }: IngestRequest = req.body;

    // Validate API key (replace with your actual API key)
    const validApiKey = process.env.ESP32_API_KEY || 'your-secure-api-key';
    if (api_key !== validApiKey) {
      res.status(401).json({ error: 'Invalid API key' });
      return;
    }

    // Validate data
    if (!data || !data.buoy_id || typeof data.ph !== 'number' || 
        typeof data.turbidity !== 'number' || typeof data.dissolved_oxygen !== 'number' ||
        typeof data.orp !== 'number' || typeof data.temperature !== 'number') {
      res.status(400).json({ error: 'Invalid sensor data' });
      return;
    }

    const timestamp = new Date(data.timestamp || Date.now());

    // Calculate WHI
    const whi = calculateWHI({
      ph: data.ph,
      turbidity: data.turbidity,
      dissolved_oxygen: data.dissolved_oxygen,
      orp: data.orp,
      temperature: data.temperature,
    });

    const status = getStatusFromWHI(whi);

    // Create reading document
    const readingData = {
      buoy_id: data.buoy_id,
      timestamp: admin.firestore.Timestamp.fromDate(timestamp),
      ph: data.ph,
      turbidity: data.turbidity,
      dissolved_oxygen: data.dissolved_oxygen,
      orp: data.orp,
      temperature: data.temperature,
      whi: whi,
    };

    // Write to Firestore
    const batch = db.batch();

    // Add reading to readings subcollection
    const readingRef = db.collection('buoys').doc(data.buoy_id).collection('readings').doc();
    batch.set(readingRef, readingData);

    // Update buoy document with latest data
    const buoyRef = db.collection('buoys').doc(data.buoy_id);
    batch.update(buoyRef, {
      last_whi: whi,
      last_status: status,
      last_updated: admin.firestore.Timestamp.fromDate(timestamp),
      is_active: true,
    });

    await batch.commit();

    // Check if treatment is needed
    if (whi < 50) {
      // Log treatment event
      const treatmentEvent = {
        buoy_id: data.buoy_id,
        timestamp: admin.firestore.Timestamp.fromDate(timestamp),
        event_type: 'microbe_mix',
        description: `Shuddhi Mix dispensed due to low WHI (${whi})`,
        dosage: 5,
      };

      const eventRef = db.collection('buoys').doc(data.buoy_id).collection('events').doc();
      await eventRef.set(treatmentEvent);
    }

    res.status(200).json({ 
      success: true, 
      whi: whi, 
      status: status,
      message: 'Data ingested successfully' 
    });

  } catch (error) {
    console.error('Error ingesting data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

function calculateWHI(reading: {
  ph: number;
  turbidity: number;
  dissolved_oxygen: number;
  orp: number;
  temperature: number;
}): number {
  const phScore = Math.max(0, 100 - Math.abs(reading.ph - 7) * 20);
  const doScore = Math.min(100, reading.dissolved_oxygen * 10);
  const turbidityScore = Math.max(0, 100 - reading.turbidity * 2);
  const orpScore = Math.max(0, Math.min(100, (reading.orp + 200) / 4));
  const tempScore = Math.max(0, 100 - Math.abs(reading.temperature - 25) * 2);

  return Math.round((phScore + doScore + turbidityScore + orpScore + tempScore) / 5);
}

function getStatusFromWHI(whi: number): 'Good' | 'Moderate' | 'Poor' {
  if (whi >= 70) return 'Good';
  if (whi >= 50) return 'Moderate';
  return 'Poor';
}
