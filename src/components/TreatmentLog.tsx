'use client';

import { TreatmentEvent } from '@/types';
import { formatTimestamp } from '@/lib/utils';

interface TreatmentLogProps {
  events: TreatmentEvent[];
}

export default function TreatmentLog({ events }: TreatmentLogProps) {
  const sortedEvents = [...events].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'microbe_mix':
        return (
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
        );
      case 'aeration':
        return (
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const getEventTypeLabel = (eventType: string) => {
    switch (eventType) {
      case 'microbe_mix':
        return 'Microbe Mix Dispensed';
      case 'aeration':
        return 'Aeration Activated';
      default:
        return 'Treatment Event';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Treatment Log</h2>
      
      {sortedEvents.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-500">No treatment events recorded yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedEvents.map((event, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              {getEventIcon(event.event_type)}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">
                    {getEventTypeLabel(event.event_type)}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {formatTimestamp(event.timestamp)}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mt-1">
                  {event.description}
                </p>
                
                {(event.dosage || event.duration) && (
                  <div className="mt-2 flex space-x-4 text-xs text-gray-500">
                    {event.dosage && (
                      <span>Dosage: {event.dosage}g</span>
                    )}
                    {event.duration && (
                      <span>Duration: {event.duration} minutes</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
