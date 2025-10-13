"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, Settings, Menu, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Target, Rocket, BarChart3, FileText, Clock, Users, Download, MoreVertical, ChevronRight, Plus, Activity, Shield, Calendar, Zap, ArrowUpRight, ArrowLeft } from 'lucide-react';

const NovaSystem = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [animateProgress, setAnimateProgress] = useState(false);
  const [healthCount, setHealthCount] = useState(0);

  useEffect(() => {
    let count = 0;
    const target = 73;
    const duration = 1500;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
      count += increment;
      if (count >= target) {
        setHealthCount(target);
        clearInterval(timer);
      } else {
        setHealthCount(Math.floor(count));
      }
    }, 16);

    setTimeout(() => setAnimateProgress(true), 100);
    
    return () => clearInterval(timer);
  }, []);

  const Badge = ({ type, children }) => {
    const colors = {
      success: 'bg-green-100 text-green-700',
      warning: 'bg-amber-100 text-amber-700',
      danger: 'bg-red-100 text-red-700',
      info: 'bg-blue-100 text-blue-700'
    };
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[type]}`}>{children}</span>;
  };

  const InfoBox = ({ children }) => (
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

  const CircularProgress = ({ value, size = 80 }) => {
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
            strokeDashoffset={animateProgress ? offset : circumference}
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

  // ==================== DASHBOARD VIEW ====================
  const DashboardView = () => (
    <div className="space-y-6">
      <InfoBox>
        Dashboard agreguje kluczowe metryki z całego systemu Syzio. Health Score łączy dane z modułu Delivery (postęp sprintów), Quality Gates (pokrycie testami, błędy) oraz OKR (realizacja celów). Active Blockers pochodzą z modułu Issues, a AI Insights analizują dane z Activity Log i przewidują ryzyka na podstawie historycznych wzorców zespołu.
      </InfoBox>
      
      {/* Health Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Q4 2024 Overview</h1>
            <p className="text-sm text-gray-600 mt-1">Sprint 24 • 8 days remaining</p>
          </div>
          <div className="flex items-center gap-6">
            <CircularProgress value={healthCount} size={80} />
            <div className="space-y-2">
              {[
                { label: 'Outcome', value: 81, color: 'bg-indigo-500' },
                { label: 'Delivery', value: 89, color: 'bg-green-500' },
                { label: 'Quality', value: 76, color: 'bg-amber-500' }
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
      </div>

      {/* Critical Issues & AI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-red-500" size={20} />
              <h2 className="font-semibold text-gray-900">Active Blockers</h2>
              <Badge type="danger">5</Badge>
            </div>
          </div>
          <div className="p-4 space-y-2">
            {[
              { title: 'API Integration Dependencies', priority: 'HIGH', tasks: 3 },
              { title: 'Design System Approval', priority: 'MED', tasks: 5 },
              { title: 'Database Migration', priority: 'HIGH', tasks: 2 }
            ].map((blocker, idx) => (
              <div key={idx} className="p-3 border border-gray-200 rounded-lg hover:border-red-300 transition">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    blocker.priority === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>{blocker.priority}</span>
                  <span className="text-sm font-medium text-gray-900">{blocker.title}</span>
                </div>
                <div className="text-xs text-gray-600">{blocker.tasks} tasks affected</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="text-purple-500" size={20} />
              <h2 className="font-semibold text-gray-900">AI Insights</h2>
              <Badge type="info">Live</Badge>
            </div>
          </div>
          <div className="p-4 space-y-3">
            {[
              { icon: 'âš ď¸Ź', icon: '⚠️', title: 'Bottleneck Detected', desc: 'Code Review delaying 8 tasks', confidence: 94 },
              { icon: '👤', title: 'Resource Alert', desc: 'Sarah Chen at 150% capacity', confidence: 100 },
              { icon: '📈', title: 'Velocity Forecast', desc: 'Next sprint: 38-44 SP', confidence: 85 }
            ].map((insight, idx) => (
              <div key={idx} className="p-3 border-l-4 border-purple-400 bg-purple-50 rounded-r-lg">
                <div className="flex items-start gap-3">
                  <span className="text-xl">{insight.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-900">{insight.title}</div>
                    <div className="text-xs text-gray-600 mt-0.5">{insight.desc}</div>
                    <div className="text-xs text-gray-500 mt-1">{insight.confidence}% confidence</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Velocity Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-gray-900">Team Velocity</h2>
          <div className="text-right">
            <div className="text-xs text-gray-600">Average</div>
            <div className="text-2xl font-bold text-indigo-600">42 SP</div>
          </div>
        </div>
        <div className="h-48 flex items-end justify-between gap-3">
          {[38, 45, 41, 48, 39, 41].map((points, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center">
              <div className="w-full relative" style={{ height: '160px' }}>
                <div className="absolute bottom-0 w-full flex justify-center">
                  <div className="w-full rounded-t-lg bg-indigo-600 transition-all duration-1000"
                       style={{ height: animateProgress ? `${(points / 60) * 100}%` : '0%' }}>
                    <div className="text-white text-xs font-bold text-center pt-2">{points}</div>
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-600 mt-2">S{19 + idx}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ==================== OKR TREE VIEW ====================
  const OKRTreeView = () => (
    <div className="space-y-6">
      <InfoBox>
        OKR Tree wizualizuje hierarchię celów organizacji zgodnie z metodologią Objectives and Key Results. Cele firmowe kaskadują do celów zespołowych, które są powiązane z konkretnymi zadaniami w module Issues. Postęp OKR jest automatycznie aktualizowany na podstawie statusu zadań w Sprintach i Kanban, zapewniając real-time tracking realizacji strategii.
      </InfoBox>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">OKR Tree</h1>
            <p className="text-sm text-gray-600 mt-1">Hierarchical view of objectives and key results</p>
          </div>
          <div className="flex items-center gap-3">
            <select className="px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 font-medium">
              <option>Q4 2024</option>
              <option>Q3 2024</option>
            </select>
            <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 flex items-center gap-2">
              <Plus size={16} />
              Add Objective
            </button>
          </div>
        </div>

        {/* Company Objective */}
        <div className="space-y-4">
          <div className="border-l-4 border-indigo-600 bg-indigo-50 rounded-r-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Target className="text-indigo-600" size={24} />
              <div className="flex-1">
                <div className="font-bold text-lg text-gray-900">Achieve Product-Market Fit</div>
                <div className="text-sm text-gray-600">Company Objective • Q4 2024</div>
              </div>
              <Badge type="warning">65%</Badge>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden mt-3">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-green-500 transition-all duration-1000"
                   style={{ width: animateProgress ? '65%' : '0%' }} />
            </div>
          </div>

          {/* Team Objectives */}
          <div className="ml-8 space-y-3">
            {[
              { team: 'Engineering', title: 'Launch Mobile MVP', progress: 45, status: 'Blocked', type: 'danger', krs: 3 },
              { team: 'Marketing', title: 'User Acquisition & Retention', progress: 78, status: 'On Track', type: 'success', krs: 4 },
              { team: 'Product', title: 'Define Q1 2025 Roadmap', progress: 82, status: 'On Track', type: 'success', krs: 3 }
            ].map((obj, idx) => (
              <div key={idx} className="border-l-4 border-gray-300 bg-white rounded-r-lg p-4 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">{obj.team} Team</div>
                    <div className="font-semibold text-gray-900">{obj.title}</div>
                    <div className="text-xs text-gray-600 mt-1">{obj.krs} key results</div>
                  </div>
                  <Badge type={obj.type}>{obj.status}</Badge>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-3">
                  <div className="h-full bg-indigo-500 transition-all duration-1000"
                       style={{ width: animateProgress ? `${obj.progress}%` : '0%' }} />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-600">{obj.progress}% Complete</span>
                  <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                    View Details â†’
                  </button>
                </div>

                {/* Key Results */}
                {idx === 0 && (
                  <div className="mt-4 ml-4 space-y-2 border-l-2 border-gray-200 pl-4">
                    {[
                      { text: 'Complete UI/UX Design', done: true },
                      { text: 'Build Core Features', done: false, risk: true },
                      { text: 'Beta Testing with Users', done: false }
                    ].map((kr, krIdx) => (
                      <div key={krIdx} className="flex items-center gap-2 text-sm">
                        {kr.done ? (
                          <CheckCircle className="text-green-500" size={16} />
                        ) : kr.risk ? (
                          <AlertTriangle className="text-amber-500" size={16} />
                        ) : (
                          <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                        )}
                        <span className={kr.done ? 'text-gray-500 line-through' : 'text-gray-700'}>
                          {kr.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ==================== DELIVERY METRICS VIEW ====================
  const DeliveryMetricsView = () => (
    <div className="space-y-6">
      <InfoBox>
        Delivery Metrics śledzi wydajność zespołu w oparciu o dane ze Sprintów i Kanban. Velocity i Throughput są obliczane automatycznie z zamkniętych zadań, Cycle Time mierzy czas od "In Progress" do "Done", a Lead Time od utworzenia do zamknięcia. Burndown Chart pokazuje postęp aktualnego sprintu w czasie rzeczywistym, pomagając identyfikować opóźnienia i dostosowywać scope.
      </InfoBox>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Delivery Metrics</h1>
          <p className="text-sm text-gray-600 mt-1">Sprint performance and throughput analysis</p>
        </div>
        <select className="px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 font-medium">
          <option>Sprint 24</option>
          <option>Sprint 23</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Velocity', value: '41 SP', icon: TrendingUp, color: 'text-indigo-600' },
          { label: 'Throughput', value: '23 tasks', icon: Activity, color: 'text-green-600' },
          { label: 'Cycle Time', value: '4.2 days', icon: Clock, color: 'text-amber-600' },
          { label: 'Lead Time', value: '8.5 days', icon: Calendar, color: 'text-purple-600' }
        ].map((metric, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">{metric.label}</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</div>
              </div>
              <metric.icon className={metric.color} size={32} />
            </div>
          </div>
        ))}
      </div>

      {/* Sprint Health */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Sprint 24 Health</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Capacity', value: '48 SP' },
            { label: 'Committed', value: '45 SP' },
            { label: 'Completed', value: '18 SP (40%)' },
            { label: 'Risk Level', value: 'HIGH âš ď¸Ź' }
          ].map((item, idx) => (
            <div key={idx}>
              <div className="text-xs text-gray-600 mb-1">{item.label}</div>
              <div className="text-lg font-bold text-gray-900">{item.value}</div>
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
              <span className="absolute -left-8 -top-2 text-xs text-gray-500">
                {Math.round((45 * (100 - percent)) / 100)}
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
              points={[45, 42, 38, 35, 30, 28, 25, 23, 18].map((val, idx) => 
                `${(idx / 8) * 100}%,${100 - (val / 45) * 100}%`
              ).join(' ')}
              fill="none"
              stroke="#EF4444"
              strokeWidth="3"
              className={animateProgress ? 'opacity-100' : 'opacity-0'}
              style={{ transition: 'opacity 1s' }}
            />
            {/* Data points */}
            {[45, 42, 38, 35, 30, 28, 25, 23, 18].map((val, idx) => (
              <circle
                key={idx}
                cx={`${(idx / 8) * 100}%`}
                cy={`${100 - (val / 45) * 100}%`}
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
          <span>Day 5</span>
          <span>Day 10 (Today)</span>
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
              { status: 'Done', count: 18, color: 'bg-green-500' },
              { status: 'In Progress', count: 12, color: 'bg-blue-500' },
              { status: 'To Do', count: 15, color: 'bg-gray-400' }
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">{item.status}</span>
                  <span className="text-sm font-semibold text-gray-900">{item.count} tasks</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} transition-all duration-1000`}
                       style={{ width: animateProgress ? `${(item.count / 45) * 100}%` : '0%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ==================== QUALITY GATES VIEW ====================
  const QualityGatesView = () => (
    <div className="space-y-6">
      <InfoBox>
        Quality Gates monitoruje standardy jakości kodu i testów, integrując się z narzędziami CI/CD i repozytoriami kodu. Code Coverage i Test Pass Rate pochodzą z pipeline'ów automatyzacji, Bug Density jest obliczana z Issues oznaczonych jako "bug", a Tech Debt Ratio śledzi zadania z tagiem "technical-debt". Moduł blokuje merge do głównej gałęzi, gdy kluczowe metryki spadają poniżej progów.
      </InfoBox>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quality Gates</h1>
          <p className="text-sm text-gray-600 mt-1">Quality assurance and technical excellence</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge type="danger">2 Failing</Badge>
          <Badge type="success">8 Passing</Badge>
        </div>
      </div>

      {/* Gate Status Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Gate Status Overview</h2>
        <div className="space-y-3">
          {[
            { name: 'Code Coverage', value: '87%', target: '85%', status: 'pass' },
            { name: 'Bug Density', value: '2.3', target: '<2.0', status: 'fail' },
            { name: 'Test Pass Rate', value: '94%', target: '90%', status: 'pass' },
            { name: 'Tech Debt Ratio', value: '18%', target: '<15%', status: 'fail' },
            { name: 'Code Review Time', value: '1.8d', target: '<2d', status: 'pass' },
            { name: 'Security Score', value: 'A', target: 'A/B', status: 'pass' }
          ].map((gate, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                {gate.status === 'pass' ? (
                  <CheckCircle className="text-green-500" size={20} />
                ) : (
                  <AlertTriangle className="text-red-500" size={20} />
                )}
                <div>
                  <div className="font-medium text-gray-900">{gate.name}</div>
                  <div className="text-xs text-gray-600">Target: {gate.target}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold ${gate.status === 'pass' ? 'text-green-600' : 'text-red-600'}`}>
                  {gate.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Test Coverage & Bug Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Test Coverage</h2>
          <div className="mb-4">
            <div className="text-3xl font-bold text-gray-900">87%</div>
            <div className="text-sm text-green-600 mt-1">+2% this sprint</div>
          </div>
          <div className="space-y-3">
            {[
              { module: 'Auth Module', coverage: 95, color: 'bg-green-500' },
              { module: 'Payment Module', coverage: 78, color: 'bg-amber-500' },
              { module: 'Dashboard', coverage: 92, color: 'bg-green-500' }
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-700">{item.module}</span>
                  <span className="text-xs font-semibold text-gray-900">{item.coverage}%</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} transition-all duration-1000`}
                       style={{ width: animateProgress ? `${item.coverage}%` : '0%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Bug Analysis</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-2xl font-bold text-gray-900">47</div>
              <div className="text-xs text-gray-600">Open Bugs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">3.2d</div>
              <div className="text-xs text-gray-600">Avg Resolution</div>
            </div>
          </div>
          <div className="space-y-2">
            {[
              { severity: 'Critical', count: 2, color: 'bg-red-500' },
              { severity: 'High', count: 8, color: 'bg-orange-500' },
              { severity: 'Medium', count: 23, color: 'bg-amber-500' },
              { severity: 'Low', count: 14, color: 'bg-gray-400' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{item.severity}</span>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-2 ${item.color} rounded-full`} />
                  <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Technical Debt */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Technical Debt</h2>
        <div className="grid grid-cols-3 gap-6 mb-4">
          <div>
            <div className="text-2xl font-bold text-gray-900">23</div>
            <div className="text-sm text-gray-600">Total Items</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-600">34 SP</div>
            <div className="text-sm text-gray-600">Estimated Effort</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">18%</div>
            <div className="text-sm text-gray-600">Debt Ratio</div>
          </div>
        </div>
        <div className="space-y-2">
          {[
            { priority: 'Must Fix', count: 5, effort: '12 SP', color: 'border-red-500' },
            { priority: 'Should Fix', count: 11, effort: '18 SP', color: 'border-amber-500' },
            { priority: 'Nice to Fix', count: 7, effort: '4 SP', color: 'border-gray-400' }
          ].map((item, idx) => (
            <div key={idx} className={`p-3 border-l-4 ${item.color} bg-gray-50 rounded-r-lg`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{item.priority}</div>
                  <div className="text-xs text-gray-600">{item.count} items</div>
                </div>
                <div className="text-sm font-semibold text-gray-900">{item.effort}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ==================== TEAM PERFORMANCE VIEW ====================
  const TeamPerformanceView = () => (
    <div className="space-y-6">
      <InfoBox>
        Team Performance agreguje indywidualne metryki członków zespołu z modułu Activity i Issues. Workload jest obliczany na podstawie przypisanych zadań i ich Story Points, Velocity śledzi zamknięte zadania w czasie, a Status pokazuje obciążenie względem capacity. Dane pomagają w równoważeniu pracy zespołu i identyfikacji bottlenecków personalnych podczas planowania sprintów.
      </InfoBox>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Performance</h1>
          <p className="text-sm text-gray-600 mt-1">Analytics and individual metrics</p>
        </div>
        <select className="px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 font-medium">
          <option>Product Team</option>
          <option>Marketing Team</option>
        </select>
      </div>

      {/* Team Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Team Members', value: '12', icon: Users },
          { label: 'Active', value: '11', icon: Activity },
          { label: 'Avg Velocity', value: '42 SP', icon: TrendingUp },
          { label: 'Utilization', value: '87%', icon: BarChart3 }
        ].map((metric, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">{metric.label}</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</div>
              </div>
              <metric.icon className="text-indigo-600" size={32} />
            </div>
          </div>
        ))}
      </div>

      {/* Individual Performance */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Individual Performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-600 pb-3">Name</th>
                <th className="text-right text-xs font-semibold text-gray-600 pb-3">Completed</th>
                <th className="text-right text-xs font-semibold text-gray-600 pb-3">Velocity</th>
                <th className="text-right text-xs font-semibold text-gray-600 pb-3">Workload</th>
                <th className="text-right text-xs font-semibold text-gray-600 pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Sarah Chen', completed: 23, velocity: 18, load: 150, status: 'Over' },
                { name: 'Mike Kumar', completed: 18, velocity: 14, load: 95, status: 'Good' },
                { name: 'Lisa Brown', completed: 21, velocity: 16, load: 105, status: 'Good' },
                { name: 'Tom Wilson', completed: 15, velocity: 12, load: 85, status: 'Under' }
              ].map((member, idx) => (
                <tr key={idx} className="border-b border-gray-100">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-medium text-gray-900">{member.name}</span>
                    </div>
                  </td>
                  <td className="text-right text-sm text-gray-900">{member.completed} tasks</td>
                  <td className="text-right text-sm text-gray-900">{member.velocity} SP</td>
                  <td className="text-right">
                    <span className={`text-sm font-semibold ${
                      member.load > 120 ? 'text-red-600' : 
                      member.load > 100 ? 'text-amber-600' : 
                      'text-green-600'
                    }`}>
                      {member.load}%
                    </span>
                  </td>
                  <td className="text-right">
                    <Badge type={
                      member.status === 'Over' ? 'danger' : 
                      member.status === 'Under' ? 'warning' : 
                      'success'
                    }>
                      {member.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Workload & Cycle Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Workload Distribution</h2>
          <div className="space-y-3">
            {[
              { name: 'Sarah', sp: 18, percent: 24 },
              { name: 'Mike', sp: 14, percent: 19 },
              { name: 'Lisa', sp: 16, percent: 21 },
              { name: 'Tom', sp: 12, percent: 16 },
              { name: 'Others', sp: 15, percent: 20 }
            ].map((member, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">{member.name}</span>
                  <span className="text-sm font-semibold text-gray-900">{member.sp} SP ({member.percent}%)</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 transition-all duration-1000"
                       style={{ width: animateProgress ? `${member.percent}%` : '0%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Cycle Time Analysis</h2>
          <div className="mb-4">
            <div className="text-2xl font-bold text-gray-900">4.2 days</div>
            <div className="text-sm text-gray-600">Team Average</div>
          </div>
          <div className="space-y-2">
            {[
              { name: 'Mike', time: '2.1d', status: 'best' },
              { name: 'Lisa', time: '3.8d', status: 'good' },
              { name: 'Tom', time: '4.5d', status: 'avg' },
              { name: 'Sarah', time: '7.8d', status: 'needs-help' }
            ].map((member, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                <span className="text-sm text-gray-700">{member.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">{member.time}</span>
                  {member.status === 'best' && <TrendingDown className="text-green-500" size={16} />}
                  {member.status === 'needs-help' && <TrendingUp className="text-red-500" size={16} />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ==================== PREDICTIVE ANALYTICS VIEW ====================
  const PredictiveView = () => (
    <div className="space-y-6">
      <InfoBox>
        Predictive Analytics wykorzystuje machine learning do analizy historycznych danych z wszystkich modułów Syzio. Success Probability przewiduje szanse ukończenia sprintu na podstawie velocity, remaining work i historical patterns. Risk Assessment identyfikuje zagrożenia analizując dependencies, team capacity i quality metrics. AI Recommendations sugerują konkretne akcje optymalizacyjne oparte na podobnych projektach z przeszłości.
      </InfoBox>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Predictive Analytics</h1>
          <p className="text-sm text-gray-600 mt-1">AI-powered forecasting and risk analysis</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-semibold text-purple-700">AI Model Active</span>
        </div>
      </div>

      {/* Prediction Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mobile DAU Prediction */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Mobile DAU +30%</h3>
                <p className="text-xs text-gray-600 mt-0.5">Q1 2025 Target Prediction</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600">78%</div>
                <div className="text-xs text-gray-600">Success Probability</div>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="text-xs text-gray-600">Prediction Confidence</div>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 transition-all duration-1000"
                     style={{ width: animateProgress ? '85%' : '0%' }} />
              </div>
              <div className="text-xs font-semibold text-gray-900">85%</div>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-4">
              <div className="text-sm font-semibold text-gray-900 mb-3">Contributing Factors</div>
              <div className="space-y-3">
                {[
                  { name: 'Test Coverage', status: 'good', impact: 25, current: 85, target: 90 },
                  { name: 'Sprint Velocity', status: 'warning', impact: 30, current: 28, target: 32 },
                  { name: 'Bug Trend', status: 'warning', impact: 20, current: 5, target: 3 },
                  { name: 'Team Capacity', status: 'good', impact: 25, current: 90, target: 100 }
                ].map((factor, idx) => (
                  <div key={idx} className={`p-3 rounded-lg border ${
                    factor.status === 'good' ? 'bg-green-50 border-green-200' :
                    factor.status === 'warning' ? 'bg-amber-50 border-amber-200' :
                    'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {factor.status === 'good' ? (
                          <CheckCircle className="text-green-600" size={16} />
                        ) : factor.status === 'warning' ? (
                          <AlertTriangle className="text-amber-600" size={16} />
                        ) : (
                          <AlertTriangle className="text-red-600" size={16} />
                        )}
                        <span className="text-sm font-medium text-gray-900">{factor.name}</span>
                      </div>
                      <span className="text-xs font-semibold text-gray-600">Impact: {factor.impact}%</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span>Current: {factor.current}</span>
                      <ArrowUpRight size={12} />
                      <span>Target: {factor.target}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="text-sm font-semibold text-gray-900 mb-2">AI Recommendations</div>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-xs text-gray-700">
                  <span className="text-purple-600 mt-0.5">•</span>
                  <span>Increase test coverage by 5% to boost success probability to 82%</span>
                </li>
                <li className="flex items-start gap-2 text-xs text-gray-700">
                  <span className="text-purple-600 mt-0.5">•</span>
                  <span>Address 2 critical bugs to improve delivery confidence</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* API Response Time Prediction */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">API Response Time &lt;200ms</h3>
                <p className="text-xs text-gray-600 mt-0.5">Performance Target Prediction</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-amber-600">62%</div>
                <div className="text-xs text-gray-600">Success Probability</div>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="text-xs text-gray-600">Prediction Confidence</div>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 transition-all duration-1000"
                     style={{ width: animateProgress ? '78%' : '0%' }} />
              </div>
              <div className="text-xs font-semibold text-gray-900">78%</div>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-4">
              <div className="text-sm font-semibold text-gray-900 mb-3">Contributing Factors</div>
              <div className="space-y-3">
                {[
                  { name: 'Test Coverage', status: 'critical', impact: 25, current: 78, target: 90 },
                  { name: 'Code Complexity', status: 'warning', impact: 20, current: 45, target: 30 },
                  { name: 'Tech Debt', status: 'critical', impact: 25, current: 35, target: 20 },
                  { name: 'Performance Tests', status: 'critical', impact: 30, current: 12, target: 20 }
                ].map((factor, idx) => (
                  <div key={idx} className={`p-3 rounded-lg border ${
                    factor.status === 'good' ? 'bg-green-50 border-green-200' :
                    factor.status === 'warning' ? 'bg-amber-50 border-amber-200' :
                    'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {factor.status === 'good' ? (
                          <CheckCircle className="text-green-600" size={16} />
                        ) : factor.status === 'warning' ? (
                          <AlertTriangle className="text-amber-600" size={16} />
                        ) : (
                          <AlertTriangle className="text-red-600" size={16} />
                        )}
                        <span className="text-sm font-medium text-gray-900">{factor.name}</span>
                      </div>
                      <span className="text-xs font-semibold text-gray-600">Impact: {factor.impact}%</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span>Current: {factor.current}</span>
                      <ArrowUpRight size={12} />
                      <span>Target: {factor.target}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="text-sm font-semibold text-gray-900 mb-2">AI Recommendations</div>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-xs text-gray-700">
                  <span className="text-purple-600 mt-0.5">•</span>
                  <span>Prioritize technical debt reduction - could improve probability by 12%</span>
                </li>
                <li className="flex items-start gap-2 text-xs text-gray-700">
                  <span className="text-purple-600 mt-0.5">•</span>
                  <span>Add 8 more performance tests to cover critical paths</span>
                </li>
                <li className="flex items-start gap-2 text-xs text-gray-700">
                  <span className="text-purple-600 mt-0.5">•</span>
                  <span>Refactor high-complexity modules identified in code analysis</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sprint Burnout Risk */}
        <div className="bg-white rounded-lg shadow-sm border-l-4 border-amber-500 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <AlertTriangle className="text-amber-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Sprint Burnout Risk</h3>
                <p className="text-xs text-amber-600 font-medium mt-0.5">MEDIUM</p>
              </div>
            </div>
            <Badge type="warning">35%</Badge>
          </div>
          
          <p className="text-sm text-gray-700 mb-4">
            Sprint 23 has a 35% probability of team burnout
          </p>

          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div>
                <div className="text-sm font-medium text-gray-900">WIP Overload</div>
                <div className="text-xs text-gray-600 mt-0.5">12 items / 8 recommended</div>
              </div>
              <AlertTriangle className="text-amber-600" size={20} />
            </div>
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div>
                <div className="text-sm font-medium text-gray-900">PR Review Time</div>
                <div className="text-xs text-gray-600 mt-0.5">18h average (target: &lt;8h)</div>
              </div>
              <AlertTriangle className="text-amber-600" size={20} />
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <div>
                <div className="text-sm font-medium text-gray-900">Unplanned Work</div>
                <div className="text-xs text-gray-600 mt-0.5">25% of sprint capacity</div>
              </div>
              <AlertTriangle className="text-red-600" size={20} />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="text-sm font-semibold text-gray-900 mb-2">Recommended Actions</div>
            <p className="text-xs text-gray-700">
              Reduce WIP to 8 items and allocate dedicated PR review slots
            </p>
          </div>
        </div>

        {/* Technical Debt Forecast */}
        <div className="bg-white rounded-lg shadow-sm border-l-4 border-blue-500 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingDown className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Technical Debt Forecast</h3>
                <p className="text-xs text-blue-600 font-medium mt-0.5">DECLINING</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-600 mb-1">Current Score</div>
              <div className="text-2xl font-bold text-gray-900">72</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-xs text-gray-600 mb-1">Projected (30 days)</div>
              <div className="text-2xl font-bold text-blue-600">68</div>
            </div>
          </div>

          <div className="mb-4">
            <div className="text-xs text-gray-600 mb-2">30-Day Trend</div>
            <div className="h-24 flex items-end justify-between gap-1">
              {[72, 71, 70, 71, 70, 69, 69, 68].map((score, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-blue-400 rounded-t transition-all duration-1000"
                       style={{ height: animateProgress ? `${(score / 80) * 100}%` : '0%' }}>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Now</span>
              <span>+30d</span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="text-sm font-semibold text-gray-900 mb-2">Recommended Actions</div>
            <p className="text-xs text-gray-700">
              Schedule 2 debt-reduction sprints to prevent score dropping below 65
            </p>
          </div>
        </div>
      </div>

      {/* Model Information */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border border-purple-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="text-purple-600" size={20} />
          <h3 className="font-semibold text-gray-900">Model Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <div className="text-xs font-semibold text-gray-600 mb-2">Data Sources</div>
            <div className="text-sm font-bold text-gray-900 mb-1">3 Syzio Modules</div>
            <div className="text-xs text-gray-600">Dev Monitoring, Canis, PM</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-600 mb-2">Training Data</div>
            <div className="text-sm font-bold text-gray-900 mb-1">6 months history</div>
            <div className="text-xs text-gray-600">234 completed KRs</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-600 mb-2">Model Accuracy</div>
            <div className="text-sm font-bold text-green-600 mb-1">87% precision</div>
            <div className="text-xs text-gray-600">Validated on 50 KRs</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-600 mb-2">Last Update</div>
            <div className="text-sm font-bold text-gray-900 mb-1">Updated daily</div>
            <div className="text-xs text-gray-600">Next: Tomorrow 03:00</div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Model health: Excellent</span>
            </div>
            <button className="text-xs font-medium text-purple-600 hover:text-purple-700">
              View Technical Details â†’
            </button>
          </div>
        </div>
      </div>

      {/* Additional Predictions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Additional Predictions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { metric: 'Sprint Completion', current: 78, predicted: 82, trend: 'up', confidence: 91 },
            { metric: 'Code Quality Score', current: 72, predicted: 68, trend: 'down', confidence: 85 },
            { metric: 'Team Velocity (SP)', current: 41, predicted: 44, trend: 'up', confidence: 88 }
          ].map((pred, idx) => (
            <div key={idx} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium text-gray-900">{pred.metric}</div>
                {pred.trend === 'up' ? (
                  <TrendingUp className="text-green-500" size={20} />
                ) : (
                  <TrendingDown className="text-red-500" size={20} />
                )}
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-2xl font-bold text-gray-900">{pred.current}</span>
                <ArrowUpRight size={16} className="text-gray-400" />
                <span className="text-xl font-bold text-indigo-600">{pred.predicted}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">30-day forecast</span>
                <span className="font-semibold text-gray-900">{pred.confidence}% confident</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ==================== REPORTS VIEW ====================
  const ReportsView = () => (
    <div className="space-y-6">
      <InfoBox>
        Reports Center umożliwia generowanie raportów z dowolnego modułu Syzio w formatach PDF, Excel i CSV. Raporty mogą być tworzone ad-hoc lub automatycznie według harmonogramu (daily, weekly, monthly). Dane są agregowane z Issues, Sprints, OKR, Quality Gates i Team Performance, z możliwością filtrowania po datach, zespołach i projektach. Raporty mogą być udostępniane stakeholderom przez email lub link.
      </InfoBox>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports Center</h1>
          <p className="text-sm text-gray-600 mt-1">Generate and manage reports</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 flex items-center gap-2">
          <Plus size={16} />
          New Report
        </button>
      </div>

      {/* Report Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { icon: FileText, name: 'Executive Summary', desc: 'High-level overview for stakeholders', color: 'text-purple-600' },
          { icon: BarChart3, name: 'Sprint Retrospective', desc: 'Sprint performance analysis', color: 'text-blue-600' },
          { icon: Target, name: 'OKR Progress Report', desc: 'Objectives and key results tracking', color: 'text-green-600' },
          { icon: Users, name: 'Team Performance', desc: 'Individual and team metrics', color: 'text-indigo-600' },
          { icon: AlertTriangle, name: 'Risk & Issues', desc: 'Blockers and dependencies', color: 'text-red-600' },
          { icon: Shield, name: 'Quality Assurance', desc: 'Test coverage and quality gates', color: 'text-amber-600' }
        ].map((template, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gray-100 rounded-lg">
                <template.icon className={template.color} size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{template.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{template.desc}</p>
                <div className="flex items-center gap-3 mt-4">
                  <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
                    Generate
                  </button>
                  <button className="text-xs font-medium text-gray-600 hover:text-gray-700">
                    Schedule
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Recent Reports</h2>
        <div className="space-y-3">
          {[
            { name: 'Sprint 24 Retrospective', date: '2 hours ago', type: 'PDF', size: '12 pages' },
            { name: 'Q4 OKR Progress (Week 8)', date: 'Yesterday', type: 'Excel', size: '3 sheets' },
            { name: 'Team Performance - November', date: '3 days ago', type: 'PDF', size: '18 pages' }
          ].map((report, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              <div className="flex items-center gap-4">
                <FileText className="text-gray-400" size={24} />
                <div>
                  <div className="font-medium text-gray-900">{report.name}</div>
                  <div className="text-xs text-gray-600 mt-1">{report.date} • {report.type}, {report.size}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-200 rounded transition">
                  <Download size={16} className="text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-200 rounded transition">
                  <MoreVertical size={16} className="text-gray-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ==================== MAIN RENDER ====================
  const navigationItems = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3, badge: null },
    { id: 'okr-tree', name: 'OKR Tree', icon: Target, badge: null },
    { id: 'delivery', name: 'Delivery Metrics', icon: Rocket, badge: null },
    { id: 'quality', name: 'Quality Gates', icon: Shield, badge: '2' },
    { id: 'team', name: 'Team Performance', icon: Users, badge: null },
    { id: 'predictive', name: 'Predictive Analytics', icon: Zap, badge: 'AI' },
    { id: 'reports', name: 'Reports', icon: FileText, badge: null }
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-50 font-sans">
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <Menu size={20} className="text-gray-600" />
          </button>
          <div className="flex items-center gap-3">
            <Star className="text-indigo-600" size={24} fill="#6366F1" />
            <span className="text-lg font-semibold text-gray-900">Syzio Pulsar Nova</span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
            <span>S</span>
            <ChevronRight size={16} />
            <span className="text-gray-900 font-medium">
              {navigationItems.find(item => item.id === activeTab)?.name}
            </span>
          </div>
          <Link 
            href="/demo-selector"
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft size={16} />
            <span>Back to Demos</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <select className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900 font-medium">
            <option>Q4 2024</option>
            <option>Q3 2024</option>
          </select>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition">
            <Settings size={18} className="text-gray-600" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-white border-r border-gray-200 overflow-y-auto transition-all duration-300`}>
          <div className="p-4">
            <div className="mb-6 pb-4 border-b border-gray-200">
            </div>

            <nav className="space-y-1">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Navigation
              </div>
              {navigationItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === item.id
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} />
                    {item.name}
                  </div>
                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      item.badge === 'AI' 
                        ? 'bg-purple-100 text-purple-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-7xl mx-auto">
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'okr-tree' && <OKRTreeView />}
            {activeTab === 'delivery' && <DeliveryMetricsView />}
            {activeTab === 'quality' && <QualityGatesView />}
            {activeTab === 'team' && <TeamPerformanceView />}
            {activeTab === 'predictive' && <PredictiveView />}
            {activeTab === 'reports' && <ReportsView />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default NovaSystem;