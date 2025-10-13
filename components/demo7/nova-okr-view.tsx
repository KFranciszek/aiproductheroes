"use client";
import React from 'react';
import { Target, CheckCircle, AlertTriangle, Plus } from 'lucide-react';
import { getOKRData } from '@/lib/demo7/data-aggregator';
import { getOKRTimeline } from '@/lib/demo7/mock-data';

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

export function NovaOKRView({ animateProgress }: Props) {
  const okrData = getOKRData();
  
  return (
    <div className="space-y-6">
      <InfoBox>
        OKR Tree wizualizuje hierarchię celów organizacji zgodnie z metodologią Objectives and Key Results. Cele firmowe kaskadują do celów zespołowych, które są powiązane z konkretnymi zadaniami z <strong>Atlas</strong>. Postęp OKR jest automatycznie aktualizowany na podstawie statusu zadań w Sprintach i Kanban, zapewniając real-time tracking realizacji strategii.
      </InfoBox>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">OKR Tree</h1>
            <p className="text-sm text-gray-600 mt-1">Hierarchical view of objectives and key results</p>
          </div>
          <div className="flex items-center gap-3">
            <select className="px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 font-medium">
              <option>{okrData.companyOKR.quarter}</option>
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
                <div className="font-bold text-lg text-gray-900">{okrData.companyOKR.title}</div>
                <div className="text-sm text-gray-600">Company Objective • {okrData.companyOKR.quarter}</div>
              </div>
              <Badge type={(okrData.companyOKR.progress >= 70 ? 'success' : 'warning') as 'success' | 'warning'}>
                {okrData.companyOKR.progress}%
              </Badge>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden mt-3">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-green-500 transition-all duration-1000"
                   style={{ width: animateProgress ? `${okrData.companyOKR.progress}%` : '0%' }} />
            </div>
            <div className="mt-3 text-xs text-gray-600">
              Calculated from {okrData.teamOKRs.length} team objectives
            </div>
          </div>

          {/* Team Objectives */}
          <div className="ml-8 space-y-3">
            {okrData.teamOKRs.map((obj, idx) => (
              <div key={idx} className="border-l-4 border-gray-300 bg-white rounded-r-lg p-4 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">{obj.team} Team</div>
                    <div className="font-semibold text-gray-900">{obj.title}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {obj.krs} key results • {obj.issueCount} linked issues from Atlas
                    </div>
                  </div>
                  <Badge type={obj.type as 'success' | 'warning' | 'danger'}>{obj.status}</Badge>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-3">
                  <div className="h-full bg-indigo-500 transition-all duration-1000"
                       style={{ width: animateProgress ? `${obj.progress}%` : '0%' }} />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-600">{obj.progress}% Complete</span>
                  <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                    View {obj.issueCount} Issues →
                  </button>
                </div>

                {/* Key Results for first team */}
                {idx === 0 && (
                  <div className="mt-4 ml-4 space-y-2 border-l-2 border-gray-200 pl-4">
                    {[
                      { text: 'Complete UI/UX Design', done: true },
                      { text: 'Build Core Features', done: false, risk: obj.progress < 50 },
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

        {/* Data Source Info */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded">Atlas Teams</span>
            <span>→</span>
            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded">Atlas Issues</span>
            <span>→</span>
            <span className="font-medium">Real-time OKR Progress</span>
          </div>
        </div>
      </div>

      {/* OKR Timeline */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">OKR Timeline</h2>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          <div className="space-y-6">
            {getOKRTimeline().map((item, idx) => (
              <div key={idx} className="relative pl-12">
                <div className={`absolute left-2 w-4 h-4 rounded-full border-2 ${
                  item.status === 'current' ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-300'
                }`}></div>
                <div className={`p-4 rounded-lg border ${
                  item.status === 'current' ? 'border-indigo-200 bg-indigo-50' : 'border-gray-200 bg-white'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-gray-900">{item.quarter}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{item.objectives} objectives</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        item.status === 'current' ? 'bg-indigo-100 text-indigo-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {item.progress}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${
                        item.status === 'current' ? 'bg-indigo-600' : 'bg-green-600'
                      }`}
                      style={{ width: animateProgress ? `${item.progress}%` : '0%' }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* OKR Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-sm text-gray-600 mb-2">On Track</div>
          <div className="text-3xl font-bold text-green-600 mb-1">
            {okrData.teamOKRs.filter(o => o.type === 'success').length}
          </div>
          <div className="text-xs text-gray-500">
            {Math.round((okrData.teamOKRs.filter(o => o.type === 'success').length / okrData.teamOKRs.length) * 100)}% of objectives
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-sm text-gray-600 mb-2">At Risk</div>
          <div className="text-3xl font-bold text-amber-600 mb-1">
            {okrData.teamOKRs.filter(o => o.type === 'warning').length}
          </div>
          <div className="text-xs text-gray-500">
            {Math.round((okrData.teamOKRs.filter(o => o.type === 'warning').length / okrData.teamOKRs.length) * 100)}% of objectives
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-sm text-gray-600 mb-2">Blocked</div>
          <div className="text-3xl font-bold text-red-600 mb-1">
            {okrData.teamOKRs.filter(o => o.type === 'danger').length}
          </div>
          <div className="text-xs text-gray-500">
            {Math.round((okrData.teamOKRs.filter(o => o.type === 'danger').length / okrData.teamOKRs.length) * 100)}% of objectives
          </div>
        </div>
      </div>
    </div>
  );
}
