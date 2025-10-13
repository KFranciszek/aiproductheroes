"use client";
import React from 'react';
import { Users, TrendingUp, Award, Target } from 'lucide-react';
import { getTeamComparison, getTopContributors } from '@/lib/demo7/mock-data';

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

export function NovaTeamView({ animateProgress }: Props) {
  const teamMetrics = getTeamComparison();
  const userPerformance = getTopContributors();
  
  return (
    <div className="space-y-6">
      <InfoBox>
        Team Performance agreguje metryki wydajności z <strong>Atlas Users, Teams i Issues</strong>. Velocity pokazuje sumę story points z ukończonych zadań, Utilization oblicza obciążenie względem capacity, a Quality Score mierzy stosunek zadań bez bugów. Dane są aktualizowane w czasie rzeczywistym na podstawie statusu zadań.
      </InfoBox>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Performance</h1>
          <p className="text-sm text-gray-600 mt-1">Individual and team productivity metrics</p>
        </div>
        <select className="px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 font-medium">
          <option>Current Sprint</option>
          <option>Last Sprint</option>
          <option>Last 30 Days</option>
        </select>
      </div>

      {/* Team Comparison */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="text-indigo-600" size={20} />
          <h2 className="font-semibold text-gray-900">Team Comparison</h2>
        </div>
        <div className="space-y-4">
          {teamMetrics.map((team: any, idx: number) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: team.color }}></div>
                  <div>
                    <div className="font-semibold text-gray-900">{team.name}</div>
                    <div className="text-xs text-gray-600">{team.memberCount} members</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">{team.velocity} SP</div>
                  <div className="text-xs text-gray-600">velocity</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-gray-600 mb-1">Throughput</div>
                  <div className="text-sm font-semibold text-gray-900">{team.throughput} tasks</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Quality Score</div>
                  <div className="text-sm font-semibold text-green-600">{Math.round(team.qualityScore)}%</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Capacity</div>
                  <div className="text-sm font-semibold text-gray-900">{team.capacity} SP</div>
                </div>
              </div>
              <div className="mt-3">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-1000" 
                    style={{ 
                      width: animateProgress ? `${(team.velocity / team.capacity) * 100}%` : '0%',
                      backgroundColor: team.color
                    }} 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Individual Performance */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="text-indigo-600" size={20} />
          <h2 className="font-semibold text-gray-900">Top Contributors</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Member</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Team</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600">Velocity</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600">Utilization</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600">Quality</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600">Tasks</th>
              </tr>
            </thead>
            <tbody>
              {userPerformance.map((user: any, idx: number) => {
                const team = teamMetrics.find((t: any) => t.id === user.teamId);
                return (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-xs text-gray-600">{user.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {team && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: team.color }}></div>}
                        <span className="text-sm text-gray-700">{team?.name || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <TrendingUp className="text-green-500" size={14} />
                        <span className="text-sm font-semibold text-gray-900">{user.velocity} SP</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-1000 ${
                              user.utilization > 100 ? 'bg-red-500' : 
                              user.utilization > 80 ? 'bg-amber-500' : 'bg-green-500'
                            }`}
                            style={{ width: animateProgress ? `${Math.min(user.utilization, 100)}%` : '0%' }}
                          />
                        </div>
                        <span className={`text-sm font-semibold ${
                          user.utilization > 100 ? 'text-red-600' : 
                          user.utilization > 80 ? 'text-amber-600' : 'text-green-600'
                        }`}>
                          {user.utilization}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm font-semibold text-green-600">{user.qualityScore}%</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="text-sm text-gray-900">
                        <span className="font-semibold">{user.tasksCompleted}</span>
                        <span className="text-gray-500"> / {user.tasksCompleted + user.tasksInProgress}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-3">
            <Target className="text-green-600" size={20} />
            <h3 className="font-semibold text-gray-900">High Performers</h3>
          </div>
          <div className="space-y-2">
            {userPerformance.slice(0, 3).map((user: any, idx: number) => (
              <div key={idx} className="flex items-center gap-2">
                <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full" />
                <span className="text-sm text-gray-700 flex-1">{user.name}</span>
                <span className="text-sm font-semibold text-green-600">{user.velocity} SP</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-3">
            <Award className="text-amber-600" size={20} />
            <h3 className="font-semibold text-gray-900">Quality Leaders</h3>
          </div>
          <div className="space-y-2">
            {userPerformance
              .sort((a: any, b: any) => b.qualityScore - a.qualityScore)
              .slice(0, 3)
              .map((user: any, idx: number) => (
                <div key={idx} className="flex items-center gap-2">
                  <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full" />
                  <span className="text-sm text-gray-700 flex-1">{user.name}</span>
                  <span className="text-sm font-semibold text-amber-600">{user.qualityScore}%</span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-3">
            <Users className="text-blue-600" size={20} />
            <h3 className="font-semibold text-gray-900">Team Stats</h3>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-gray-600">Total Members</div>
              <div className="text-2xl font-bold text-gray-900">
                {teamMetrics.reduce((sum: number, t: any) => sum + t.memberCount, 0)}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600">Avg Velocity</div>
              <div className="text-2xl font-bold text-indigo-600">
                {Math.round(teamMetrics.reduce((sum: number, t: any) => sum + t.velocity, 0) / teamMetrics.length)} SP
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Collaboration Metrics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Collaboration Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { metric: 'Code Reviews', value: 47, unit: 'this week', icon: '👀' },
            { metric: 'PR Comments', value: 156, unit: 'this week', icon: '💬' },
            { metric: 'Pair Programming', value: '12h', unit: 'this week', icon: '👥' },
            { metric: 'Knowledge Sharing', value: 8, unit: 'sessions', icon: '📚' }
          ].map((item, idx) => (
            <div key={idx} className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{item.value}</div>
              <div className="text-xs text-gray-600">{item.unit}</div>
              <div className="text-sm text-gray-700 mt-2">{item.metric}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Team Satisfaction</h2>
          <div className="space-y-4">
            {[
              { category: 'Work-Life Balance', score: 8.5, max: 10 },
              { category: 'Team Collaboration', score: 9.2, max: 10 },
              { category: 'Tools & Resources', score: 7.8, max: 10 },
              { category: 'Career Growth', score: 8.1, max: 10 }
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">{item.category}</span>
                  <span className="text-sm font-semibold text-gray-900">{item.score} / {item.max}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      item.score >= 8.5 ? 'bg-green-500' :
                      item.score >= 7 ? 'bg-amber-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: animateProgress ? `${(item.score / item.max) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Skill Distribution</h2>
          <div className="space-y-3">
            {[
              { skill: 'Frontend', members: 7, color: 'blue' },
              { skill: 'Backend', members: 8, color: 'green' },
              { skill: 'DevOps', members: 3, color: 'purple' },
              { skill: 'Mobile', members: 5, color: 'pink' },
              { skill: 'Design', members: 2, color: 'amber' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-24 text-sm text-gray-700">{item.skill}</div>
                <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full flex items-center justify-end pr-2 text-xs font-semibold text-white transition-all duration-1000 ${
                      item.color === 'blue' ? 'bg-blue-500' :
                      item.color === 'green' ? 'bg-green-500' :
                      item.color === 'purple' ? 'bg-purple-500' :
                      item.color === 'pink' ? 'bg-pink-500' :
                      'bg-amber-500'
                    }`}
                    style={{ width: animateProgress ? `${(item.members / 10) * 100}%` : '0%' }}
                  >
                    {item.members}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Capacity Planning */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Capacity Planning - Next 4 Weeks</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Week</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600">Available</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600">Planned</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600">Utilization</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { week: 'Week 42', available: 200, planned: 185, utilization: 92.5 },
                { week: 'Week 43', available: 200, planned: 210, utilization: 105 },
                { week: 'Week 44', available: 180, planned: 165, utilization: 91.7 },
                { week: 'Week 45', available: 200, planned: 175, utilization: 87.5 }
              ].map((item, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{item.week}</td>
                  <td className="py-3 px-4 text-right text-sm text-gray-700">{item.available}h</td>
                  <td className="py-3 px-4 text-right text-sm text-gray-700">{item.planned}h</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`text-sm font-semibold ${
                      item.utilization > 100 ? 'text-red-600' :
                      item.utilization > 90 ? 'text-amber-600' :
                      'text-green-600'
                    }`}>
                      {item.utilization}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      item.utilization > 100 ? 'bg-red-100 text-red-700' :
                      item.utilization > 90 ? 'bg-amber-100 text-amber-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {item.utilization > 100 ? 'Overbooked' : item.utilization > 90 ? 'At Capacity' : 'Available'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Source Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded">Atlas Users</span>
          <span>+</span>
          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded">Atlas Teams</span>
          <span>+</span>
          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded">Atlas Issues</span>
          <span className="ml-2">→ Team Performance Metrics</span>
        </div>
      </div>
    </div>
  );
}
