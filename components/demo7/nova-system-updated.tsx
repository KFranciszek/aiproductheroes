"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, Settings, Menu, ArrowLeft } from 'lucide-react';
import { 
  aggregateHealthScore, 
  generateAIInsights
} from '@/lib/demo7/data-aggregator';
import type { HealthScore, AIInsight } from '@/lib/demo7/types';
import { NovaDashboardView } from './nova-dashboard-view';
import { NovaOKRView } from './nova-okr-view';
import { NovaQualityView } from './nova-quality-view';
import { NovaDeliveryView } from './nova-delivery-view';
import { NovaTeamView } from './nova-team-view';

const NovaSystemUpdated = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [animateProgress, setAnimateProgress] = useState(false);
  const [healthScore, setHealthScore] = useState<HealthScore | null>(null);
  const [aiInsights, setAIInsights] = useState<AIInsight[]>([]);

  useEffect(() => {
    // Load real data
    const score = aggregateHealthScore();
    setHealthScore(score);
    setAIInsights(generateAIInsights());
    
    setTimeout(() => setAnimateProgress(true), 100);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <NovaDashboardView healthScore={healthScore} aiInsights={aiInsights} animateProgress={animateProgress} />;
      case 'okr':
        return <NovaOKRView animateProgress={animateProgress} />;
      case 'delivery':
        return <NovaDeliveryView animateProgress={animateProgress} />;
      case 'quality':
        return <NovaQualityView animateProgress={animateProgress} />;
      case 'team':
        return <NovaTeamView animateProgress={animateProgress} />;
      default:
        return <NovaDashboardView healthScore={healthScore} aiInsights={aiInsights} animateProgress={animateProgress} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'} z-10`}>
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <Star className="text-indigo-600" size={24} />
              <span className="font-bold text-lg">Pulsar Nova</span>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-gray-100 rounded">
            <Menu size={20} />
          </button>
        </div>
        
        <nav className="p-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'okr', label: 'OKR Tree', icon: '🎯' },
            { id: 'delivery', label: 'Delivery', icon: '🚀' },
            { id: 'quality', label: 'Quality', icon: '✅' },
            { id: 'team', label: 'Team', icon: '👥' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-indigo-50 text-indigo-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {sidebarOpen && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
              <div className="text-xs font-semibold text-indigo-900 mb-1">Data Sources</div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-indigo-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Atlas (Tasks)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-indigo-700">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Canis (Docs)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-indigo-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Helix (DevOps)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-5">
          <div className="flex items-center gap-4">
            <Link
              href="/demo-selector"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Back to Demos</span>
            </Link>
            <div className="h-4 w-px bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live Data</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Settings size={20} className="text-gray-600" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6 max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default NovaSystemUpdated;
