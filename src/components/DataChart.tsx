'use client';

import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { SensorReading, TreatmentEvent } from '@/types';
import { formatTimestamp } from '@/lib/utils';

interface DataChartProps {
  readings: SensorReading[];
  treatmentEvents: TreatmentEvent[];
}

export default function DataChart({ readings, treatmentEvents }: DataChartProps) {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');

  const timeRanges = [
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
  ];

  // Filter data based on time range
  const getFilteredData = () => {
    const now = new Date();
    let cutoffTime: Date;

    switch (timeRange) {
      case '24h':
        cutoffTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        cutoffTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        cutoffTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        cutoffTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    return readings.filter(reading => reading.timestamp >= cutoffTime);
  };

  const filteredData = getFilteredData();

  // Filter treatment events for the selected time range
  const filteredEvents = treatmentEvents.filter(event => {
    const dataStart = filteredData[0]?.timestamp;
    const dataEnd = filteredData[filteredData.length - 1]?.timestamp;
    return event.timestamp >= dataStart && event.timestamp <= dataEnd;
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Historical Data</h2>
        <div className="flex space-x-2">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value as '24h' | '7d' | '30d')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                timeRange === range.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-96">
        {filteredData.length === 0 ? (
          <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-gray-400 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-gray-500">No data available for the selected time range</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(value) => formatTimestamp(new Date(value))}
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                labelFormatter={(value) => formatTimestamp(new Date(value))}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="dissolved_oxygen"
                stroke="#10B981"
                strokeWidth={2}
                name="Dissolved Oxygen (mg/L)"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="turbidity"
                stroke="#F59E0B"
                strokeWidth={2}
                name="Turbidity (NTU)"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="whi"
                stroke="#2563EB"
                strokeWidth={3}
                name="Water Health Index"
                dot={false}
              />
              
              {/* Treatment Event Markers */}
              {filteredEvents.map((event, index) => (
                <ReferenceLine
                  key={index}
                  x={event.timestamp}
                  stroke={event.event_type === 'microbe_mix' ? '#8B5CF6' : '#EF4444'}
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  label={{
                    value: event.event_type === 'microbe_mix' ? 'Microbe Mix' : 'Aeration',
                    position: 'top',
                    fontSize: 10,
                    fill: event.event_type === 'microbe_mix' ? '#8B5CF6' : '#EF4444',
                  }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
