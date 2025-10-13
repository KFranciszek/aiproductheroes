"use client";
import React from 'react';
import { CheckCircle, AlertTriangle, Shield } from 'lucide-react';
import { getQualityGates } from '@/lib/demo7/data-aggregator';

interface Props {
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

export function NovaQualityView({ animateProgress }: Props) {
  const qualityGates = getQualityGates();
  const passingGates = qualityGates.filter(g => g.status === 'pass').length;
  const failingGates = qualityGates.filter(g => g.status === 'fail').length;
  
  return (
    <div className="space-y-6">
      <InfoBox>
        Quality Gates monitoruje standardy jakości kodu i testów, integrując dane z <strong>Atlas</strong> (bug density, tech debt), <strong>Canis</strong> (dokumentacja) i <strong>Helix</strong> (deployment success rate). Bug Density jest obliczana z Issues oznaczonych jako "bug", a Tech Debt Ratio śledzi zadania typu "Chore". Moduł pokazuje które metryki wymagają uwagi.
      </InfoBox>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quality Gates</h1>
          <p className="text-sm text-gray-600 mt-1">Quality assurance and technical excellence</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge type="danger">{failingGates} Failing</Badge>
          <Badge type="success">{passingGates} Passing</Badge>
        </div>
      </div>

      {/* Gate Status Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="text-indigo-600" size={20} />
          <h2 className="font-semibold text-gray-900">Gate Status Overview</h2>
        </div>
        <div className="space-y-3">
          {qualityGates.map((gate, idx) => (
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
            <div className="text-xs text-gray-500 mt-1">from Helix metrics</div>
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
              <div className="text-2xl font-bold text-gray-900">
                {qualityGates.find(g => g.name === 'Bug Density')?.value || '2.3'}
              </div>
              <div className="text-xs text-gray-600">Bug Density</div>
              <div className="text-xs text-gray-500 mt-1">from Atlas issues</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">3.2d</div>
              <div className="text-xs text-gray-600">Avg Resolution</div>
              <div className="text-xs text-gray-500 mt-1">calculated</div>
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
            <div className="text-xs text-gray-500 mt-1">from Atlas</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-600">34 SP</div>
            <div className="text-sm text-gray-600">Estimated Effort</div>
            <div className="text-xs text-gray-500 mt-1">calculated</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">
              {qualityGates.find(g => g.name === 'Tech Debt Ratio')?.value || '18%'}
            </div>
            <div className="text-sm text-gray-600">Debt Ratio</div>
            <div className="text-xs text-gray-500 mt-1">from Atlas</div>
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

      {/* Code Quality Trends */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Code Quality Trends</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { metric: 'Code Smells', value: 23, trend: '-15%', color: 'green' },
            { metric: 'Duplications', value: '3.2%', trend: '-8%', color: 'green' },
            { metric: 'Complexity', value: 'Medium', trend: 'stable', color: 'amber' },
            { metric: 'Maintainability', value: 'A', trend: '+5%', color: 'green' }
          ].map((item, idx) => (
            <div key={idx} className="text-center">
              <div className="text-sm text-gray-600 mb-2">{item.metric}</div>
              <div className={`text-2xl font-bold mb-1 ${
                item.color === 'green' ? 'text-green-600' :
                item.color === 'amber' ? 'text-amber-600' :
                'text-red-600'
              }`}>
                {item.value}
              </div>
              <div className={`text-xs ${
                item.trend.startsWith('-') || item.trend.startsWith('+') && !item.trend.startsWith('-') ? 'text-green-600' : 'text-gray-500'
              }`}>
                {item.trend}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security & Compliance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Security Scan Results</h2>
          <div className="space-y-3">
            {[
              { severity: 'Critical', count: 0, color: 'green' },
              { severity: 'High', count: 2, color: 'red' },
              { severity: 'Medium', count: 8, color: 'amber' },
              { severity: 'Low', count: 15, color: 'gray' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    item.color === 'red' ? 'bg-red-500' :
                    item.color === 'amber' ? 'bg-amber-500' :
                    item.color === 'green' ? 'bg-green-500' :
                    'bg-gray-400'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-900">{item.severity}</span>
                </div>
                <span className={`text-lg font-bold ${
                  item.count === 0 ? 'text-green-600' :
                  item.color === 'red' ? 'text-red-600' :
                  item.color === 'amber' ? 'text-amber-600' :
                  'text-gray-600'
                }`}>
                  {item.count}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Last Scan</span>
              <span className="font-medium text-gray-900">2 hours ago</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Compliance Status</h2>
          <div className="space-y-4">
            {[
              { standard: 'OWASP Top 10', status: 'Compliant', score: 95 },
              { standard: 'GDPR', status: 'Compliant', score: 100 },
              { standard: 'SOC 2', status: 'In Progress', score: 78 },
              { standard: 'ISO 27001', status: 'Compliant', score: 92 }
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">{item.standard}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    item.status === 'Compliant' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      item.score >= 90 ? 'bg-green-500' : 'bg-amber-500'
                    }`}
                    style={{ width: animateProgress ? `${item.score}%` : '0%' }}
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
          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded">Atlas Issues</span>
          <span>+</span>
          <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded">Canis Findings</span>
          <span>+</span>
          <span className="px-2 py-1 bg-green-50 text-green-700 rounded">Helix Metrics</span>
          <span className="ml-2">→ Quality Gates</span>
        </div>
      </div>
    </div>
  );
}
