import { Buoy, SensorReading } from '@/types';

export function calculateWHI(reading: {
  ph: number;
  turbidity: number;
  dissolved_oxygen: number;
  orp: number;
  temperature: number;
}): number {
  // Simplified WHI calculation based on key parameters
  const phScore = Math.max(0, 100 - Math.abs(reading.ph - 7) * 20);
  const doScore = Math.min(100, reading.dissolved_oxygen * 10);
  const turbidityScore = Math.max(0, 100 - reading.turbidity * 2);
  const orpScore = Math.max(0, Math.min(100, (reading.orp + 200) / 4));
  const tempScore = Math.max(0, 100 - Math.abs(reading.temperature - 25) * 2);

  return Math.round((phScore + doScore + turbidityScore + orpScore + tempScore) / 5);
}

export function getStatusFromWHI(whi: number): 'Good' | 'Moderate' | 'Poor' {
  if (whi >= 70) return 'Good';
  if (whi >= 50) return 'Moderate';
  return 'Poor';
}

export function getStatusColor(status: 'Good' | 'Moderate' | 'Poor'): string {
  switch (status) {
    case 'Good':
      return '#22C55E';
    case 'Moderate':
      return '#F59E0B';
    case 'Poor':
      return '#EF4444';
    default:
      return '#6B7280';
  }
}

export function getStatusBgColor(status: 'Good' | 'Moderate' | 'Poor'): string {
  switch (status) {
    case 'Good':
      return 'bg-green-100 text-green-800';
    case 'Moderate':
      return 'bg-yellow-100 text-yellow-800';
    case 'Poor':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function formatTimestamp(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return `${Math.floor(diffInMinutes / 1440)}d ago`;
}
