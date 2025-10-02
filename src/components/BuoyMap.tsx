'use client';

import { useEffect, useState } from 'react';

// Mock types for demo
interface Buoy {
  id: string;
  name: string;
  last_whi: number;
  last_status: string;
}

interface BuoyMapProps {
  buoys: Buoy[];
  onBuoyClick: (buoyId: string) => void;
}

// Mock data for demo
const mockBuoys: Buoy[] = [
  { id: '1', name: 'Kothri Pond #1', last_whi: 85, last_status: 'Good' },
  { id: '2', name: 'Kothri Pond #2', last_whi: 45, last_status: 'Poor' },
  { id: '3', name: 'Kothri Pond #3', last_whi: 65, last_status: 'Moderate' }
];

export default function BuoyMap({ buoys = mockBuoys, onBuoyClick = () => {} }: BuoyMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getStatusColor = (status: string) => {
    const normalized = status.toLowerCase();
    if (normalized === 'good') return 'bg-emerald-500';
    if (normalized === 'poor') return 'bg-red-500';
    if (normalized === 'moderate') return 'bg-amber-500';
    return 'bg-gray-400';
  };

  const getStatusBadgeColor = (status: string) => {
    const normalized = status.toLowerCase();
    if (normalized === 'good') return 'bg-emerald-50 text-emerald-700';
    if (normalized === 'poor') return 'bg-red-50 text-red-700';
    if (normalized === 'moderate') return 'bg-amber-50 text-amber-700';
    return 'bg-gray-100 text-gray-700';
  };

  if (!isClient) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-2xl flex items-center justify-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-400 shadow-lg">
      <div className="relative w-full px-6 py-8 md:px-10 md:py-12">
        <div className="text-center text-white mx-auto">
          {/* Header */}
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Regional Map</h2>
          <p className="text-white/90 text-sm mb-8">Interactive map will be displayed here</p>
          
          {/* Buoy Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {buoys.map((buoy) => (
              <div
                key={buoy.id}
                className="bg-white rounded-2xl shadow-sm p-6 border border-gray-50 hover:shadow-md transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
                onClick={() => onBuoyClick(buoy.id)}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(buoy.last_status)} flex-shrink-0`}></div>
                  <h3 className="font-semibold text-gray-900 text-left flex-1 text-base leading-snug">{buoy.name}</h3>
                </div>
                <div className="text-left space-y-2.5">
                  <div className="text-sm text-gray-600">
                    WHI: <span className="font-semibold text-gray-900">{buoy.last_whi}/100</span>
                  </div>
                  <span className={`inline-block px-3 py-1.5 rounded-lg text-xs font-medium ${getStatusBadgeColor(buoy.last_status)}`}>
                    {buoy.last_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Footer Messages */}
          <div className="space-y-1.5 text-sm text-white/85">
            <p>🗺️ Map integration will be added in the next update</p>
            <p>Click on any buoy card above to view details</p>
          </div>
        </div>
      </div>
    </div>
  );
}