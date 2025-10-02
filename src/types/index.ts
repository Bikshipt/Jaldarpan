export interface Buoy {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
  last_whi: number;
  last_status: 'Good' | 'Moderate' | 'Poor';
  last_updated: Date;
  is_active: boolean;
}

export interface SensorReading {
  id: string;
  buoy_id: string;
  timestamp: Date;
  ph: number;
  turbidity: number;
  dissolved_oxygen: number;
  orp: number;
  temperature: number;
  whi: number;
}

export interface TreatmentEvent {
  id: string;
  buoy_id: string;
  timestamp: Date;
  event_type: 'microbe_mix' | 'aeration';
  description: string;
  dosage?: number;
  duration?: number;
}

export interface KeyMetrics {
  overall_whi: number;
  active_buoys: number;
  recent_alerts: number;
}
