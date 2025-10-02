'use client';

import { Buoy } from '@/types';
import { getStatusBgColor } from '@/lib/utils';
import Link from 'next/link';

interface BuoyHeaderProps {
  buoy: Buoy;
}

export default function BuoyHeader({ buoy }: BuoyHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{buoy.name}</h1>
            <p className="text-gray-600">Water Quality Monitoring Station</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {buoy.last_whi}/100
            </div>
            <div className="text-sm text-gray-500">Water Health Index</div>
          </div>
          
          <div className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusBgColor(buoy.last_status)}`}>
            {buoy.last_status}
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
