'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import BuoyHeader from '@/components/BuoyHeader';
import LiveSensors from '@/components/LiveSensors';
import DataChart from '@/components/DataChart';
import TreatmentLog from '@/components/TreatmentLog';
import { Buoy, SensorReading, TreatmentEvent } from '@/types';

// Mock data for demonstration - replace with Firebase queries
const mockBuoy: Buoy = {
  id: '1',
  name: 'Kothri Pond #1',
  location: { latitude: 28.6139, longitude: 77.2090 },
  last_whi: 85,
  last_status: 'Good',
  last_updated: new Date(Date.now() - 5 * 60 * 1000),
  is_active: true,
};

const mockCurrentReading: SensorReading = {
  id: '1',
  buoy_id: '1',
  timestamp: new Date(),
  ph: 7.2,
  turbidity: 15.5,
  dissolved_oxygen: 8.2,
  orp: 150,
  temperature: 24.5,
  whi: 85,
};

const mockHistoricalData: SensorReading[] = Array.from({ length: 24 }, (_, i) => ({
  id: `${i}`,
  buoy_id: '1',
  timestamp: new Date(Date.now() - (23 - i) * 60 * 60 * 1000),
  ph: 7.0 + Math.random() * 0.8,
  turbidity: 10 + Math.random() * 20,
  dissolved_oxygen: 6 + Math.random() * 4,
  orp: 100 + Math.random() * 200,
  temperature: 20 + Math.random() * 10,
  whi: 70 + Math.random() * 30,
}));

const mockTreatmentEvents: TreatmentEvent[] = [
  {
    id: '1',
    buoy_id: '1',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    event_type: 'microbe_mix',
    description: 'Shuddhi Mix (5g) dispensed due to low DO levels',
    dosage: 5,
  },
  {
    id: '2',
    buoy_id: '1',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    event_type: 'aeration',
    description: 'Aeration system activated for 30 minutes',
    duration: 30,
  },
  {
    id: '3',
    buoy_id: '1',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    event_type: 'microbe_mix',
    description: 'Preventive microbe mix dispensed',
    dosage: 3,
  },
];

interface BuoyDetailPageProps {
  params: {
    buoyId: string;
  };
}

export default function BuoyDetailPage({ params }: BuoyDetailPageProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [buoy, setBuoy] = useState<Buoy | null>(null);
  const [currentReading, setCurrentReading] = useState<SensorReading | null>(null);
  const [historicalData, setHistoricalData] = useState<SensorReading[]>([]);
  const [treatmentEvents, setTreatmentEvents] = useState<TreatmentEvent[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    // TODO: Replace with real Firebase queries
    const fetchBuoyData = async () => {
      setDataLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setBuoy(mockBuoy);
      setCurrentReading(mockCurrentReading);
      setHistoricalData(mockHistoricalData);
      setTreatmentEvents(mockTreatmentEvents);
      
      setDataLoading(false);
    };

    if (user) {
      fetchBuoyData();
    }
  }, [user, params.buoyId]);

  if (loading || dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !buoy || !currentReading) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <BuoyHeader buoy={buoy} />
      
      <LiveSensors 
        currentReading={currentReading}
        historicalData={historicalData}
      />
      
      <DataChart 
        readings={historicalData}
        treatmentEvents={treatmentEvents}
      />
      
      <TreatmentLog events={treatmentEvents} />
    </div>
  );
}
