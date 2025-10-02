'use client';

import { SensorReading } from '@/types';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

interface LiveSensorsProps {
  currentReading: SensorReading;
  historicalData: SensorReading[];
}

export default function LiveSensors({ currentReading, historicalData }: LiveSensorsProps) {
  const sensors = [
    {
      name: 'pH',
      value: currentReading.ph,
      unit: '',
      color: '#3B82F6',
      dataKey: 'ph',
    },
    {
      name: 'Dissolved Oxygen',
      value: currentReading.dissolved_oxygen,
      unit: 'mg/L',
      color: '#10B981',
      dataKey: 'dissolved_oxygen',
    },
    {
      name: 'Turbidity',
      value: currentReading.turbidity,
      unit: 'NTU',
      color: '#F59E0B',
      dataKey: 'turbidity',
    },
    {
      name: 'ORP',
      value: currentReading.orp,
      unit: 'mV',
      color: '#8B5CF6',
      dataKey: 'orp',
    },
    {
      name: 'Temperature',
      value: currentReading.temperature,
      unit: '°C',
      color: '#EF4444',
      dataKey: 'temperature',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Live Sensor Readings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {sensors.map((sensor) => (
          <div key={sensor.name} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">{sensor.name}</h3>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {sensor.value.toFixed(1)}
              <span className="text-sm font-normal text-gray-500 ml-1">{sensor.unit}</span>
            </div>
            <div className="h-16">
              {historicalData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historicalData.slice(-10)}>
                    <Line
                      type="monotone"
                      dataKey={sensor.dataKey}
                      stroke={sensor.color}
                      strokeWidth={2}
                      dot={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 text-xs">
                  No data
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
