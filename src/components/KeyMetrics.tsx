'use client';

import { KeyMetrics as KeyMetricsType } from '@/types';
import { getStatusColor, getStatusFromWHI } from '@/lib/utils';

interface KeyMetricsProps {
  metrics: KeyMetricsType;
}

export default function KeyMetrics({ metrics }: KeyMetricsProps) {
  const overallStatus = getStatusFromWHI(metrics.overall_whi);
  const statusColor = getStatusColor(overallStatus);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
      {/* Overall Water Health */}
      <div className="stat-card group">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Overall Water Health</p>
                <p className="text-xs text-gray-500">Water Health Index</p>
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <p className={`text-4xl font-bold ${overallStatus === 'Good' ? 'text-status-good' : overallStatus === 'Moderate' ? 'text-status-moderate' : 'text-status-poor'}`}>
                {metrics.overall_whi}
              </p>
              <p className="text-lg text-gray-500">/100</p>
            </div>
            <div className="flex items-center mt-3">
              <div className={`status-indicator ${overallStatus.toLowerCase()}`}></div>
              <span className={`text-sm font-semibold ${overallStatus === 'Good' ? 'text-status-good' : overallStatus === 'Moderate' ? 'text-status-moderate' : 'text-status-poor'}`}>
                {overallStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Buoys */}
      <div className="stat-card group">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Active Buoys</p>
                <p className="text-xs text-gray-500">Sending data</p>
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <p className="text-4xl font-bold text-green-600">{metrics.active_buoys}</p>
              <p className="text-lg text-gray-500">buoys</p>
            </div>
            <div className="flex items-center mt-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-green-600 ml-2">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="stat-card group">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Recent Alerts</p>
                <p className="text-xs text-gray-500">Last 24 hours</p>
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <p className="text-4xl font-bold text-red-600">{metrics.recent_alerts}</p>
              <p className="text-lg text-gray-500">alerts</p>
            </div>
            <div className="flex items-center mt-3">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm font-semibold text-red-600 ml-2">Requires attention</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
