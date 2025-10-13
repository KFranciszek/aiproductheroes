"use client";
import React from 'react';
import { AlertTriangle, CheckCircle, Zap, TrendingUp, Activity, Clock, Calendar } from 'lucide-react';
import { getRecentActivity, getRiskAnalysis, getActiveBlockers, getAIInsightsMock, getTeamVelocity } from '@/lib/demo7/mock-data';
import type { AIInsight, HealthScore } from '@/lib/demo7/types';

interface Props {
  healthScore: HealthScore | null;
  aiInsights: AIInsight[];
  animateProgress: boolean;
}

const Badge = ({ type, children }: { type: 'success' | 'warning' | 'danger' | 'info'; children: React.ReactNode }) => {
  const colors = {
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700'
  };
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[type]}`}>{children}</span>;
};

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

const CircularProgress = ({ value, size = 80 }: { value: number; size?: number }) => {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E5E7EB" strokeWidth="6" />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="url(#gradient)"
          strokeWidth="6" strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round" className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold text-gray-900">{value}%</span>
      </div>
    </div>
  );
};

export function NovaDashboardView({ healthScore, aiInsights, animateProgress }: Props) {
  const blockedTasks = getActiveBlockers();
  const aiInsightsMock = getAIInsightsMock();
  const teamVelocity = getTeamVelocity();
  const avgVelocity = teamVelocity.reduce((sum, v) => sum + v.velocity, 0) / teamVelocity.length;
  
  return (
    <div className="space-y-6">
      <InfoBox>
        Dashboard agreguje kluczowe metryki z całego systemu Syzio. Health Score łączy dane z modułu <strong>Atlas</strong> (postęp sprintów), <strong>Canis</strong> (jakość dokumentacji) oraz <strong>Helix</strong> (stabilność deploymentów). Active Blockers pochodzą z rzeczywistych zależności zadań, a AI Insights analizują wzorce cross-system.
      </InfoBox>
      
      {/* Health Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Q4 2024 Overview</h1>
            <p className="text-sm text-gray-600 mt-1">
              Sprint 59 • 18 / 45 SP completed
            </p>
          </div>
          <div className="flex items-center gap-6">
            <CircularProgress value={healthScore?.overall || 0} size={80} />
            <div className="space-y-2">
              {[
                { label: 'Outcome', value: healthScore?.breakdown.outcome || 0, color: 'bg-indigo-500' },
                { label: 'Delivery', value: healthScore?.breakdown.delivery || 0, color: 'bg-green-500' },
                { label: 'Quality', value: healthScore?.breakdown.quality || 0, color: 'bg-amber-500' }
              ].map((metric, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-xs text-gray-600 w-20">{metric.label}</span>
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full ${metric.color} transition-all duration-1000`} 
                         style={{ width: animateProgress ? `${metric.value}%` : '0%' }} />
                  </div>
                  <span className="text-xs font-semibold text-gray-900 w-8">{metric.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded">Atlas</span>
            <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded">Canis</span>
            <span className="px-2 py-1 bg-green-50 text-green-700 rounded">Helix</span>
            <span className="ml-2">→ Unified Intelligence</span>
          </div>
        </div>
      </div>

      {/* Critical Issues & AI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-red-500" size={20} />
              <h2 className="font-semibold text-gray-900">Active Blockers</h2>
              <Badge type="danger">{blockedTasks.length}</Badge>
            </div>
            <span className="text-xs text-gray-500">from Atlas</span>
          </div>
          <div className="p-4 space-y-2">
            {blockedTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="mx-auto mb-2 text-green-500" size={32} />
                <p className="text-sm">No blockers detected</p>
              </div>
            ) : (
              blockedTasks.slice(0, 5).map((task: any, idx: number) => (
                <div key={idx} className="p-3 border border-gray-200 rounded-lg hover:border-red-300 transition">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      task.priority === 'P0' || task.priority === 'P1' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>{task.priority}</span>
                    <span className="text-sm font-medium text-gray-900 truncate">{task.title}</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    Blocked by {task.blockedBy} • {task.affectedTasks} tasks affected
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="text-purple-500" size={20} />
              <h2 className="font-semibold text-gray-900">AI Insights</h2>
              <Badge type="info">Live</Badge>
            </div>
            <span className="text-xs text-gray-500">cross-system</span>
          </div>
          <div className="p-4 space-y-3">
            {aiInsightsMock.map((insight, idx) => {
              const borderColor = insight.type === 'warning' ? 'border-amber-400' : 'border-purple-400';
              const bgColor = insight.type === 'warning' ? 'bg-amber-50' : 'bg-purple-50';
              
              return (
                <div key={idx} className={`p-3 border-l-4 ${borderColor} ${bgColor} rounded-r-lg`}>
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{insight.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-900">{insight.title}</div>
                      <div className="text-xs text-gray-600 mt-0.5">{insight.description}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="text-xs text-gray-500">{insight.confidence}% confidence</div>
                        <span className="text-xs px-1.5 py-0.5 bg-white rounded border border-gray-200">
                          {insight.source}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Velocity Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-semibold text-gray-900">Team Velocity</h2>
            <p className="text-xs text-gray-500 mt-1">Last 6 sprints</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-600">Average</div>
            <div className="text-2xl font-bold text-indigo-600">{Math.round(avgVelocity)} SP</div>
          </div>
        </div>
        <div className="h-48 flex items-end justify-between gap-3">
          {teamVelocity.map((sprint: any, idx: number) => (
            <div key={idx} className="flex-1 flex flex-col items-center">
              <div className="w-full relative" style={{ height: '160px' }}>
                <div className="absolute bottom-0 w-full flex justify-center">
                  <div className="w-full rounded-t-lg bg-indigo-600 transition-all duration-1000"
                       style={{ height: animateProgress ? `${(sprint.velocity / 60) * 100}%` : '0%' }}>
                    <div className="text-white text-xs font-bold text-center pt-2">{sprint.velocity}</div>
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-600 mt-2">{sprint.sprintName.replace('Sprint ', 'S')}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Velocity', value: `${Math.round(avgVelocity)} SP`, icon: TrendingUp, color: 'text-indigo-600', source: 'Mock Data', trend: '+5%' },
          { label: 'Throughput', value: '23 tasks', icon: Activity, color: 'text-green-600', source: 'Mock Data', trend: '+12%' },
          { label: 'Cycle Time', value: '4.2 days', icon: Clock, color: 'text-amber-600', source: 'Mock Data', trend: '-8%' },
          { label: 'Lead Time', value: '8.5 days', icon: Calendar, color: 'text-purple-600', source: 'Mock Data', trend: '-5%' }
        ].map((metric: any, idx: number) => (
          <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">{metric.label}</div>
              <metric.icon className={metric.color} size={24} />
            </div>
            <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
            <div className="flex items-center justify-between mt-1">
              <div className="text-xs text-gray-500">{metric.source}</div>
              <div className={`text-xs font-semibold ${metric.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {metric.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sprint Progress & Risk Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Sprint Progress</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Story Points</span>
                <span className="text-sm font-semibold text-gray-900">
                  18 / 45 SP
                </span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-green-500 transition-all duration-1000"
                  style={{ width: animateProgress ? '40%' : '0%' }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Tasks Completed</span>
                <span className="text-sm font-semibold text-gray-900">
                  18 / 45
                </span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all duration-1000"
                  style={{ width: animateProgress ? '40%' : '0%' }}
                />
              </div>
            </div>
            <div className="pt-3 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    18
                  </div>
                  <div className="text-xs text-gray-600">Done</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    12
                  </div>
                  <div className="text-xs text-gray-600">In Progress</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-600">
                    15
                  </div>
                  <div className="text-xs text-gray-600">To Do</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Risk Analysis</h2>
          <div className="space-y-3">
            {getRiskAnalysis().map((item, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{item.risk}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    item.color === 'red' ? 'bg-red-100 text-red-700' :
                    item.color === 'amber' ? 'bg-amber-100 text-amber-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {item.level}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                  <span>Impact: {item.impact}</span>
                  <span>•</span>
                  <span>Probability: {item.probability}%</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      item.color === 'red' ? 'bg-red-500' :
                      item.color === 'amber' ? 'bg-amber-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: animateProgress ? `${item.probability}%` : '0%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {getRecentActivity().map((activity, idx) => (
            <div key={idx} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition">
              <img src={activity.avatar} alt={activity.user} className="w-8 h-8 rounded-full" />
              <div className="flex-1">
                <div className="text-sm text-gray-900">
                  <span className="font-medium">{activity.user}</span>
                  {' '}<span className="text-gray-600">{activity.action}</span>
                  {' '}<span className="font-medium text-indigo-600">{activity.item}</span>
                </div>
                <div className="text-xs text-gray-500">{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
