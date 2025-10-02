'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import BuoyMap from '@/components/BuoyMap';
import KeyMetrics from '@/components/KeyMetrics';
import BuoyList from '@/components/BuoyList';
import { Buoy, KeyMetrics as KeyMetricsType } from '@/types';

// Mock data for demonstration - replace with Firebase queries
const mockBuoys: Buoy[] = [
  {
    id: '1',
    name: 'Kothri Pond #1',
    location: { latitude: 28.6139, longitude: 77.2090 },
    last_whi: 85,
    last_status: 'Good',
    last_updated: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    is_active: true,
  },
  {
    id: '2',
    name: 'Kothri Pond #2',
    location: { latitude: 28.6145, longitude: 77.2095 },
    last_whi: 45,
    last_status: 'Poor',
    last_updated: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    is_active: true,
  },
  {
    id: '3',
    name: 'Kothri Pond #3',
    location: { latitude: 28.6140, longitude: 77.2085 },
    last_whi: 65,
    last_status: 'Moderate',
    last_updated: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    is_active: true,
  },
];

const mockMetrics: KeyMetricsType = {
  overall_whi: 65,
  active_buoys: 3,
  recent_alerts: 1,
};

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [buoys, setBuoys] = useState<Buoy[]>(mockBuoys);
  const [metrics, setMetrics] = useState<KeyMetricsType>(mockMetrics);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    // TODO: Replace with real Firebase queries
    // fetchBuoys();
    // fetchMetrics();
  }, []);

  const handleBuoyClick = (buoyId: string) => {
    router.push(`/buoy/${buoyId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600 text-lg">Real-time monitoring of agricultural water bodies</p>
      </div>

      {/* Key Metrics */}
      <KeyMetrics metrics={metrics} />

      {/* Map and Buoy List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Map */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Regional Map</h2>
          <BuoyMap buoys={buoys} onBuoyClick={handleBuoyClick} />
        </div>

        {/* Buoy List */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">All Buoys</h2>
          <BuoyList buoys={buoys} onBuoyClick={handleBuoyClick} />
        </div>
      </div>
    </div>
  );
}
