'use client';

import { Buoy } from '@/types';
import { getStatusColor, formatRelativeTime } from '@/lib/utils';

interface BuoyListProps {
  buoys: Buoy[];
  onBuoyClick: (buoyId: string) => void;
}

export default function BuoyList({ buoys, onBuoyClick }: BuoyListProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="table-header">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>Buoy Name</span>
                </div>
              </th>
              <th className="table-header">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Status</span>
                </div>
              </th>
              <th className="table-header">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>WHI Score</span>
                </div>
              </th>
              <th className="table-header">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Last Updated</span>
                </div>
              </th>
              <th className="table-header">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Actions</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {buoys.map((buoy) => {
              const isPoorStatus = buoy.last_status === 'Poor';
              const isRecentPoor = isPoorStatus && 
                (new Date().getTime() - buoy.last_updated.getTime()) < 60 * 60 * 1000; // Last hour
              
              return (
                <tr key={buoy.id} className="table-row">
                  <td className="table-cell">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {buoy.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">{buoy.name}</div>
                        <div className="text-xs text-gray-500">Water monitoring station</div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-3">
                      <div className={`status-indicator ${buoy.last_status.toLowerCase()} ${isRecentPoor ? 'animate-pulse-slow' : ''}`}></div>
                      <span className={`text-sm font-bold ${buoy.last_status === 'Good' ? 'text-status-good' : buoy.last_status === 'Moderate' ? 'text-status-moderate' : 'text-status-poor'}`}>
                        {buoy.last_status}
                      </span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-2">
                      <div className="text-2xl font-bold text-gray-900">{buoy.last_whi}</div>
                      <div className="text-sm text-gray-500">/100</div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-600">{formatRelativeTime(buoy.last_updated)}</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <button
                      onClick={() => onBuoyClick(buoy.id)}
                      className="btn-primary text-sm flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>View Details</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
