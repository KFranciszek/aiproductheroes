"use client";
import React from 'react';
import { TrendingUp, Activity, Clock, Calendar, BarChart3 } from 'lucide-react';
import { getAtlasMetrics, calculateBurndown } from '@/lib/demo7/data-aggregator';
import { getFlowEfficiency, getWIPLimits, getStoryBreakdown, getTimeMetrics } from '@/lib/demo7/mock-data';

interface Props {
  animateProgress: boolean;
}

const InfoBox = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 mt-0.5">
        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed">{children}</p>
    </div>
  </div>
);

export function NovaDeliveryView({ animateProgress }: Props) {
  const atlasMetrics = getAtlasMetrics();
  const burndownData = calculateBurndown();
  const timeMetrics = getTimeMetrics();
  const flowEfficiency = getFlowEfficiency();
  const wipLimits = getWIPLimits();
  const storyBreakdown = getStoryBreakdown();
  
  const cycleTime = timeMetrics.cycleTime;
  const leadTime = timeMetrics.leadTime;
  const throughput = atlasMetrics.activeSprintIssues.filter((i: any) => i.status === 'Done').length;
  const sprintDays = burndownData.sprintDays || 14;
  
  return (
    <div className="space-y-6">
      <InfoBox>
        Delivery Metrics śledzi wydajność zespołu w oparciu o dane z <strong>Atlas Sprintów</strong>. Velocity i Throughput są obliczane automatycznie z zamkniętych zadań, Cycle Time mierzy czas od "In Progress" do "Done", a Lead Time od utworzenia do zamknięcia. Burndown Chart pokazuje postęp aktualnego sprintu w czasie rzeczywistym.
      </InfoBox>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Delivery Metrics</h1>
          <p className="text-sm text-gray-600 mt-1">Sprint performance and throughput analysis</p>
        </div>
        <select className="px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 font-medium">
          <option>{atlasMetrics.activeSprint?.name || 'Sprint 59'}</option>
          <option>Sprint 58</option>
          <option>Sprint 57</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Velocity', value: `${Math.round(atlasMetrics.avgVelocity)} SP`, icon: TrendingUp, color: 'text-indigo-600', change: '+5%' },
          { label: 'Throughput', value: `${throughput} tasks`, icon: Activity, color: 'text-green-600', change: '+12%' },
          { label: 'Cycle Time', value: `${cycleTime}d`, icon: Clock, color: 'text-amber-600', change: '-8%' },
          { label: 'Lead Time', value: `${leadTime}d`, icon: Calendar, color: 'text-purple-600', change: '-5%' }
        ].map((metric, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">{metric.label}</div>
              <metric.icon className={metric.color} size={24} />
            </div>
            <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
            <div className={`text-xs mt-1 ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {metric.change} vs last sprint
            </div>
          </div>
        ))}
      </div>

      {/* Sprint Health */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="text-indigo-600" size={20} />
          <h2 className="font-semibold text-gray-900">{atlasMetrics.activeSprint?.name || 'Sprint 59'} Health</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Capacity', value: `${atlasMetrics.totalSP} SP`, color: 'text-gray-900' },
            { label: 'Committed', value: `${atlasMetrics.totalSP} SP`, color: 'text-blue-600' },
            { label: 'Completed', value: `${atlasMetrics.completedSP} SP (${Math.round((atlasMetrics.completedSP / atlasMetrics.totalSP) * 100)}%)`, color: 'text-green-600' },
            { label: 'Risk Level', value: atlasMetrics.completedSP / atlasMetrics.totalSP < 0.4 ? 'HIGH ⚠️' : 'MEDIUM', color: atlasMetrics.completedSP / atlasMetrics.totalSP < 0.4 ? 'text-red-600' : 'text-amber-600' }
          ].map((item, idx) => (
            <div key={idx}>
              <div className="text-xs text-gray-600 mb-1">{item.label}</div>
              <div className={`text-lg font-bold ${item.color}`}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Burndown Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Burndown Chart</h2>
        <div className="relative h-64 border-b border-l border-gray-300">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((percent) => (
            <div key={percent} className="absolute w-full border-t border-gray-100" 
                 style={{ bottom: `${percent}%` }}>
              <span className="absolute -left-10 -top-2 text-xs text-gray-500">
                {Math.round((burndownData.totalSP * (100 - percent)) / 100)}
              </span>
            </div>
          ))}
          
          {/* Ideal line */}
          <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
            <line x1="0" y1="0" x2="100%" y2="100%" 
                  stroke="#93C5FD" strokeWidth="2" strokeDasharray="5,5" />
          </svg>
          
          {/* Actual burndown line */}
          <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
            <polyline
              points={burndownData.actual.map((point: any) => 
                `${(point.day / sprintDays) * 100}%,${100 - (point.remaining / burndownData.totalSP) * 100}%`
              ).join(' ')}
              fill="none"
              stroke="#EF4444"
              strokeWidth="3"
              className={animateProgress ? 'opacity-100' : 'opacity-0'}
              style={{ transition: 'opacity 1s' }}
            />
            {/* Data points */}
            {burndownData.actual.map((point: any, idx: number) => (
              <circle
                key={idx}
                cx={`${(point.day / sprintDays) * 100}%`}
                cy={`${100 - (point.remaining / burndownData.totalSP) * 100}%`}
                r="4"
                fill="#EF4444"
                className={animateProgress ? 'opacity-100' : 'opacity-0'}
                style={{ transition: 'opacity 1s' }}
              />
            ))}
          </svg>
        </div>
        <div className="flex justify-between text-xs text-gray-600 mt-4 pl-4">
          <span>Day 1</span>
          <span>Day {Math.floor(sprintDays / 2)}</span>
          <span>Day {burndownData.daysPassed} (Today)</span>
        </div>
        <div className="mt-4 flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-blue-400 border-dashed"></div>
            <span className="text-gray-600">Ideal Burndown</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-red-500"></div>
            <span className="text-gray-600">Actual Progress</span>
          </div>
        </div>
      </div>

      {/* Story Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">By Type</h2>
          <div className="space-y-3">
            {[
              { type: 'Features', count: 12, percent: 45, color: 'bg-blue-500' },
              { type: 'Bugs', count: 8, percent: 30, color: 'bg-red-500' },
              { type: 'Tech Debt', count: 7, percent: 25, color: 'bg-amber-500' }
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">{item.type}</span>
                  <span className="text-sm font-semibold text-gray-900">{item.count} ({item.percent}%)</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} transition-all duration-1000`}
                       style={{ width: animateProgress ? `${item.percent}%` : '0%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">By Status</h2>
          <div className="space-y-3">
            {[
              { status: 'Done', count: atlasMetrics.completedSP, total: atlasMetrics.totalSP, color: 'bg-green-500' },
              { status: 'In Progress', count: Math.round(atlasMetrics.totalSP * 0.3), total: atlasMetrics.totalSP, color: 'bg-blue-500' },
              { status: 'To Do', count: Math.round(atlasMetrics.totalSP * 0.3), total: atlasMetrics.totalSP, color: 'bg-gray-400' }
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">{item.status}</span>
                  <span className="text-sm font-semibold text-gray-900">{item.count} SP</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} transition-all duration-1000`}
                       style={{ width: animateProgress ? `${(item.count / item.total) * 100}%` : '0%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Velocity Trend Analysis */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Velocity Trend Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-gray-600 mb-2">Current Sprint</div>
            <div className="text-3xl font-bold text-indigo-600">{Math.round(atlasMetrics.avgVelocity)} SP</div>
            <div className="text-xs text-green-600 mt-1">+5% vs average</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-2">6-Sprint Average</div>
            <div className="text-3xl font-bold text-gray-900">{Math.round(atlasMetrics.avgVelocity)} SP</div>
            <div className="text-xs text-gray-500 mt-1">Stable trend</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-2">Forecast Next</div>
            <div className="text-3xl font-bold text-purple-600">{Math.round(atlasMetrics.avgVelocity * 1.05)} SP</div>
            <div className="text-xs text-gray-500 mt-1">85% confidence</div>
          </div>
        </div>
      </div>

      {/* Flow Efficiency */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Flow Efficiency</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Active Work Time</span>
                <span className="text-sm font-semibold text-green-600">{flowEfficiency.activeWork}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all duration-1000"
                  style={{ width: animateProgress ? `${flowEfficiency.activeWork}%` : '0%' }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Wait Time</span>
                <span className="text-sm font-semibold text-amber-600">{flowEfficiency.waitTime}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 transition-all duration-1000"
                  style={{ width: animateProgress ? `${flowEfficiency.waitTime}%` : '0%' }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Blocked Time</span>
                <span className="text-sm font-semibold text-red-600">{flowEfficiency.blockedTime}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500 transition-all duration-1000"
                  style={{ width: animateProgress ? `${flowEfficiency.blockedTime}%` : '0%' }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">WIP Limits</h2>
          <div className="space-y-4">
            {[
              { stage: 'To Do', current: 15, limit: 20, color: 'green' },
              { stage: 'In Progress', current: 12, limit: 10, color: 'red' },
              { stage: 'In Review', current: 8, limit: 8, color: 'amber' },
              { stage: 'Done', current: 18, limit: null, color: 'gray' }
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">{item.stage}</span>
                  <span className={`text-sm font-semibold ${
                    item.limit && item.current > item.limit ? 'text-red-600' :
                    item.limit && item.current === item.limit ? 'text-amber-600' :
                    'text-green-600'
                  }`}>
                    {item.current}{item.limit ? ` / ${item.limit}` : ''}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      item.limit && item.current > item.limit ? 'bg-red-500' :
                      item.limit && item.current === item.limit ? 'bg-amber-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: animateProgress ? `${item.limit ? (item.current / item.limit) * 100 : 100}%` : '0%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Data Source Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded">Atlas Sprints</span>
          <span>+</span>
          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded">Atlas Issues</span>
          <span className="ml-2">→ Real-time Delivery Metrics</span>
        </div>
      </div>
    </div>
  );
}
