'use client';

import React, { useState, createContext, useContext, ReactNode } from 'react';
import Link from 'next/link';
import { Calendar, Clock, GitCommit, Package, TrendingUp, AlertCircle, CheckCircle, XCircle, Loader, ExternalLink, Search, Plus, Activity, Server, BarChart3, Filter, ChevronRight, ArrowUpRight, ArrowDownRight, Moon, Sun, ArrowLeft } from 'lucide-react';

// ============================================
// THEME CONTEXT
// ============================================

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}

// ============================================
// STORE
// ============================================

interface GitCommit {
  hash: string;
  message: string;
  author: string;
  timestamp: Date;
  linkedIssues: string[];
}

interface JiraIssue {
  id: string;
  key: string;
  summary: string;
  description: string;
  type: 'story' | 'bug' | 'task' | 'epic';
  status: 'todo' | 'in-progress' | 'in-review' | 'done';
  priority: 'highest' | 'high' | 'medium' | 'low' | 'lowest';
  assignee: string;
  reporter: string;
  storyPoints?: number;
  labels: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface DeploymentMetrics {
  buildTime: number;
  deployTime: number;
  errorRate: number;
  successRate: number;
  rollbackCount: number;
}

interface DeploymentPackage {
  id: string;
  name: string;
  version: string;
  status: 'draft' | 'ready' | 'deploying' | 'deployed' | 'failed' | 'rollback';
  environment: 'dev' | 'staging' | 'production';
  linkedIssues: string[];
  jiraIssues: JiraIssue[];
  commits: GitCommit[];
  createdAt: Date;
  scheduledAt?: Date;
  deployedAt?: Date;
  healthStatus: 'healthy' | 'warning' | 'critical';
  metrics?: DeploymentMetrics;
  createdBy: string;
}

interface Environment {
  name: 'dev' | 'staging' | 'production';
  url: string;
  lastDeployment?: DeploymentPackage;
  status: 'online' | 'offline' | 'degraded';
  uptime: number;
}

interface MonitoringContextType {
  packages: DeploymentPackage[];
  environments: Environment[];
  addPackage: (pkg: DeploymentPackage) => void;
  updatePackageStatus: (id: string, status: DeploymentPackage['status']) => void;
  simulateDeploy: (id: string) => Promise<void>;
}

const MonitoringContext = createContext<MonitoringContextType | undefined>(undefined);

const initialPackages: DeploymentPackage[] = [
  {
    id: 'pkg-001',
    name: 'Release 2.1.0',
    version: '2.1.0',
    status: 'ready',
    environment: 'staging',
    linkedIssues: ['TSK-042', 'TSK-045', 'TSK-048'],
    jiraIssues: [
      {
        id: 'jira-1',
        key: 'TSK-042',
        summary: 'Fix login authentication bug',
        description: 'Users are unable to login with SSO credentials. The OAuth flow is breaking at the callback step.',
        type: 'bug',
        status: 'done',
        priority: 'highest',
        assignee: 'Alice Johnson',
        reporter: 'Bob Smith',
        storyPoints: 5,
        labels: ['security', 'authentication', 'critical'],
        createdAt: new Date(Date.now() - 7 * 86400000),
        updatedAt: new Date(Date.now() - 86400000)
      },
      {
        id: 'jira-2',
        key: 'TSK-045',
        summary: 'Add dark mode toggle to settings',
        description: 'Implement a dark mode theme switcher in user settings panel with persistent preferences.',
        type: 'story',
        status: 'done',
        priority: 'medium',
        assignee: 'Bob Smith',
        reporter: 'Charlie Brown',
        storyPoints: 8,
        labels: ['ui', 'feature', 'settings'],
        createdAt: new Date(Date.now() - 5 * 86400000),
        updatedAt: new Date(Date.now() - 2 * 86400000)
      },
      {
        id: 'jira-3',
        key: 'TSK-048',
        summary: 'Optimize API response times',
        description: 'Reduce API latency by implementing caching and query optimization. Target: <200ms p95.',
        type: 'task',
        status: 'in-review',
        priority: 'high',
        assignee: 'Diana Prince',
        reporter: 'Alice Johnson',
        storyPoints: 13,
        labels: ['performance', 'backend', 'optimization'],
        createdAt: new Date(Date.now() - 4 * 86400000),
        updatedAt: new Date(Date.now() - 3600000)
      }
    ],
    commits: [
      { hash: 'abc123', message: 'feat: add dark mode toggle (TSK-045)', author: 'Bob Smith', timestamp: new Date(Date.now() - 2 * 3600000), linkedIssues: ['TSK-045'] },
      { hash: 'def456', message: 'fix: resolve login issue (TSK-042)', author: 'Alice Johnson', timestamp: new Date(Date.now() - 4 * 3600000), linkedIssues: ['TSK-042'] },
      { hash: 'ghi789', message: 'perf: add redis caching (TSK-048)', author: 'Diana Prince', timestamp: new Date(Date.now() - 6 * 3600000), linkedIssues: ['TSK-048'] }
    ],
    createdAt: new Date(Date.now() - 86400000),
    scheduledAt: new Date(Date.now() + 3600000),
    healthStatus: 'healthy',
    createdBy: 'Alice Johnson'
  },
  {
    id: 'pkg-002',
    name: 'Release 2.0.1',
    version: '2.0.1',
    status: 'deployed',
    environment: 'production',
    linkedIssues: ['TSK-038', 'TSK-040', 'TSK-041'],
    jiraIssues: [
      {
        id: 'jira-4',
        key: 'TSK-038',
        summary: 'Update dependencies to latest versions',
        description: 'Security update: upgrade all npm packages to patch CVE vulnerabilities.',
        type: 'task',
        status: 'done',
        priority: 'highest',
        assignee: 'Charlie Brown',
        reporter: 'Alice Johnson',
        storyPoints: 3,
        labels: ['security', 'maintenance', 'dependencies'],
        createdAt: new Date(Date.now() - 10 * 86400000),
        updatedAt: new Date(Date.now() - 2 * 86400000)
      },
      {
        id: 'jira-5',
        key: 'TSK-040',
        summary: 'Critical security patch for XSS vulnerability',
        description: 'Fix XSS vulnerability in user input fields. Sanitize all user-generated content.',
        type: 'bug',
        status: 'done',
        priority: 'highest',
        assignee: 'Charlie Brown',
        reporter: 'Security Team',
        storyPoints: 8,
        labels: ['security', 'critical', 'hotfix'],
        createdAt: new Date(Date.now() - 3 * 86400000),
        updatedAt: new Date(Date.now() - 86400000)
      },
      {
        id: 'jira-6',
        key: 'TSK-041',
        summary: 'Add monitoring alerts for error rates',
        description: 'Set up Datadog alerts for when error rate exceeds 1% over 5 minute window.',
        type: 'task',
        status: 'done',
        priority: 'high',
        assignee: 'Diana Prince',
        reporter: 'Bob Smith',
        storyPoints: 5,
        labels: ['monitoring', 'observability', 'alerts'],
        createdAt: new Date(Date.now() - 4 * 86400000),
        updatedAt: new Date(Date.now() - 86400000)
      }
    ],
    commits: [{ hash: 'ghi789', message: 'hotfix: critical security patch', author: 'Charlie Brown', timestamp: new Date(Date.now() - 86400000), linkedIssues: ['TSK-040'] }],
    createdAt: new Date(Date.now() - 172800000),
    deployedAt: new Date(Date.now() - 86400000),
    healthStatus: 'healthy',
    metrics: { buildTime: 210, deployTime: 252, errorRate: 0, successRate: 100, rollbackCount: 0 },
    createdBy: 'Charlie Brown'
  },
  {
    id: 'pkg-003',
    name: 'Release 2.0.0',
    version: '2.0.0',
    status: 'deployed',
    environment: 'production',
    linkedIssues: ['TSK-025', 'TSK-030', 'TSK-035'],
    jiraIssues: [
      {
        id: 'jira-7',
        key: 'TSK-025',
        summary: 'Redesign user dashboard',
        description: 'Complete UI overhaul of the main dashboard with new widgets and layout.',
        type: 'epic',
        status: 'done',
        priority: 'high',
        assignee: 'Diana Prince',
        reporter: 'Product Team',
        storyPoints: 21,
        labels: ['ui', 'design', 'dashboard', 'epic'],
        createdAt: new Date(Date.now() - 30 * 86400000),
        updatedAt: new Date(Date.now() - 3 * 86400000)
      },
      {
        id: 'jira-8',
        key: 'TSK-030',
        summary: 'Implement new component library',
        description: 'Migrate from old UI components to new shadcn/ui based design system.',
        type: 'story',
        status: 'done',
        priority: 'medium',
        assignee: 'Bob Smith',
        reporter: 'Diana Prince',
        storyPoints: 13,
        labels: ['ui', 'components', 'design-system'],
        createdAt: new Date(Date.now() - 20 * 86400000),
        updatedAt: new Date(Date.now() - 3 * 86400000)
      },
      {
        id: 'jira-9',
        key: 'TSK-035',
        summary: 'Add responsive mobile layout',
        description: 'Make dashboard fully responsive for mobile and tablet devices.',
        type: 'story',
        status: 'done',
        priority: 'medium',
        assignee: 'Alice Johnson',
        reporter: 'Diana Prince',
        storyPoints: 8,
        labels: ['ui', 'mobile', 'responsive'],
        createdAt: new Date(Date.now() - 15 * 86400000),
        updatedAt: new Date(Date.now() - 3 * 86400000)
      }
    ],
    commits: [{ hash: 'jkl012', message: 'feat: major UI overhaul', author: 'Diana Prince', timestamp: new Date(Date.now() - 259200000), linkedIssues: ['TSK-030'] }],
    createdAt: new Date(Date.now() - 345600000),
    deployedAt: new Date(Date.now() - 259200000),
    healthStatus: 'healthy',
    metrics: { buildTime: 320, deployTime: 410, errorRate: 2, successRate: 98, rollbackCount: 0 },
    createdBy: 'Diana Prince'
  },
  // Canis Releases
  {
    id: 'pkg-canis-100',
    name: 'R-100 (Canis)',
    version: 'R-100',
    status: 'deployed',
    environment: 'production',
    linkedIssues: ['SZ-1200', 'SZ-1201'],
    jiraIssues: [
      {
        id: 'canis-1',
        key: 'SZ-1200',
        summary: 'Initial payment gateway integration',
        description: 'Integrate with payment service provider for card processing',
        type: 'story',
        status: 'done',
        priority: 'highest',
        assignee: 'Jan Kowalski',
        reporter: 'Product Team',
        storyPoints: 13,
        labels: ['payments', 'integration', 'backend'],
        createdAt: new Date('2025-09-20'),
        updatedAt: new Date('2025-09-28')
      },
      {
        id: 'canis-2',
        key: 'SZ-1201',
        summary: 'Currency conversion bug fix',
        description: 'Fix incorrect EUR to PLN conversion rates',
        type: 'bug',
        status: 'done',
        priority: 'high',
        assignee: 'Anna Nowak',
        reporter: 'QA Team',
        storyPoints: 3,
        labels: ['payments', 'bugfix', 'currency'],
        createdAt: new Date('2025-09-25'),
        updatedAt: new Date('2025-09-28')
      }
    ],
    commits: [
      { hash: 'xyz789', message: 'feat: initial payment gateway integration', author: 'Jan Kowalski', timestamp: new Date('2025-09-28T10:00:00Z'), linkedIssues: ['SZ-1200'] },
      { hash: 'abc456', message: 'fix: currency conversion bug', author: 'Anna Nowak', timestamp: new Date('2025-09-28T11:30:00Z'), linkedIssues: ['SZ-1201'] }
    ],
    createdAt: new Date('2025-09-27'),
    deployedAt: new Date('2025-09-28T14:00:00Z'),
    healthStatus: 'healthy',
    metrics: { buildTime: 180, deployTime: 240, errorRate: 0.5, successRate: 99.5, rollbackCount: 0 },
    createdBy: 'Jan Kowalski'
  },
  {
    id: 'pkg-canis-101',
    name: 'R-101 (Canis)',
    version: 'R-101',
    status: 'deployed',
    environment: 'staging',
    linkedIssues: ['SZ-1250'],
    jiraIssues: [
      {
        id: 'canis-3',
        key: 'SZ-1250',
        summary: 'Add 3DS validation',
        description: 'Implement 3D Secure authentication for card payments above threshold',
        type: 'story',
        status: 'done',
        priority: 'highest',
        assignee: 'Jan Kowalski',
        reporter: 'Security Team',
        storyPoints: 8,
        labels: ['payments', '3ds', 'security'],
        createdAt: new Date('2025-10-01'),
        updatedAt: new Date('2025-10-04')
      }
    ],
    commits: [
      { hash: 'abc123', message: 'feat: add 3DS validation', author: 'Jan Kowalski', timestamp: new Date('2025-10-04T16:00:00Z'), linkedIssues: ['SZ-1250'] },
      { hash: 'def456', message: 'fix: handle edge cases', author: 'Anna Nowak', timestamp: new Date('2025-10-04T17:00:00Z'), linkedIssues: ['SZ-1250'] },
      { hash: 'ghi789', message: 'test: add integration tests', author: 'Piotr Wiśniewski', timestamp: new Date('2025-10-04T18:00:00Z'), linkedIssues: ['SZ-1250'] }
    ],
    createdAt: new Date('2025-10-03'),
    deployedAt: new Date('2025-10-04T18:30:00Z'),
    healthStatus: 'healthy',
    metrics: { buildTime: 195, deployTime: 265, errorRate: 1.2, successRate: 98.8, rollbackCount: 0 },
    createdBy: 'Jan Kowalski'
  },
  {
    id: 'pkg-canis-102',
    name: 'R-102 (Canis)',
    version: 'R-102',
    status: 'ready',
    environment: 'staging',
    linkedIssues: ['SZ-1234', 'SZ-1235'],
    jiraIssues: [
      {
        id: 'canis-4',
        key: 'SZ-1234',
        summary: 'Implement payment limits',
        description: 'Add configurable payment limits per merchant and transaction type',
        type: 'story',
        status: 'done',
        priority: 'high',
        assignee: 'Jan Kowalski',
        reporter: 'Product Team',
        storyPoints: 5,
        labels: ['payments', 'limits', 'configuration'],
        createdAt: new Date('2025-10-05'),
        updatedAt: new Date('2025-10-10')
      },
      {
        id: 'canis-5',
        key: 'SZ-1235',
        summary: 'Add 3DS flow',
        description: 'Complete 3DS authentication flow with redirect handling',
        type: 'story',
        status: 'in-review',
        priority: 'high',
        assignee: 'Anna Nowak',
        reporter: 'Security Team',
        storyPoints: 8,
        labels: ['payments', '3ds', 'authentication'],
        createdAt: new Date('2025-10-06'),
        updatedAt: new Date('2025-10-10')
      }
    ],
    commits: [
      { hash: 'jkl012', message: 'feat: implement payment limits', author: 'Jan Kowalski', timestamp: new Date('2025-10-10T14:00:00Z'), linkedIssues: ['SZ-1234'] },
      { hash: 'mno345', message: 'feat: add 3DS flow', author: 'Anna Nowak', timestamp: new Date('2025-10-10T15:00:00Z'), linkedIssues: ['SZ-1235'] },
      { hash: 'pqr678', message: 'fix: validation errors', author: 'Piotr Wiśniewski', timestamp: new Date('2025-10-10T16:00:00Z'), linkedIssues: ['SZ-1234'] },
      { hash: 'stu901', message: 'docs: update API documentation', author: 'Maria Kowalczyk', timestamp: new Date('2025-10-10T17:00:00Z'), linkedIssues: ['SZ-1234', 'SZ-1235'] },
      { hash: 'vwx234', message: 'test: e2e payment tests', author: 'Tomasz Lewandowski', timestamp: new Date('2025-10-10T18:00:00Z'), linkedIssues: ['SZ-1234', 'SZ-1235'] }
    ],
    createdAt: new Date('2025-10-09'),
    scheduledAt: new Date('2025-10-11T10:00:00Z'),
    healthStatus: 'healthy',
    createdBy: 'Jan Kowalski'
  },
  {
    id: 'pkg-canis-103',
    name: 'R-103 (Canis)',
    version: 'R-103',
    status: 'deployed',
    environment: 'production',
    linkedIssues: ['SZ-1234', 'SZ-1250', 'SZ-1260'],
    jiraIssues: [
      {
        id: 'canis-6',
        key: 'SZ-1260',
        summary: 'Webhook retry mechanism',
        description: 'Implement exponential backoff retry for failed webhook deliveries',
        type: 'story',
        status: 'done',
        priority: 'high',
        assignee: 'Piotr Wiśniewski',
        reporter: 'DevOps Team',
        storyPoints: 5,
        labels: ['webhooks', 'reliability', 'backend'],
        createdAt: new Date('2025-10-08'),
        updatedAt: new Date('2025-10-12')
      }
    ],
    commits: [
      { hash: 'uvw123', message: 'feat: webhook retry mechanism', author: 'Piotr Wiśniewski', timestamp: new Date('2025-10-12T10:00:00Z'), linkedIssues: ['SZ-1260'] },
      { hash: 'xyz456', message: 'feat: enhanced error logging', author: 'Maria Kowalczyk', timestamp: new Date('2025-10-12T11:00:00Z'), linkedIssues: ['SZ-1260'] },
      { hash: 'rst789', message: 'fix: 3DS redirect issue', author: 'Jan Kowalski', timestamp: new Date('2025-10-12T12:00:00Z'), linkedIssues: ['SZ-1234'] },
      { hash: 'lmn012', message: 'perf: optimize database queries', author: 'Anna Nowak', timestamp: new Date('2025-10-12T13:00:00Z'), linkedIssues: ['SZ-1250'] },
      { hash: 'opq345', message: 'test: add performance tests', author: 'Tomasz Lewandowski', timestamp: new Date('2025-10-12T14:00:00Z'), linkedIssues: ['SZ-1260'] },
      { hash: 'hij678', message: 'docs: update deployment guide', author: 'Maria Kowalczyk', timestamp: new Date('2025-10-12T15:00:00Z'), linkedIssues: ['SZ-1260'] }
    ],
    createdAt: new Date('2025-10-11'),
    deployedAt: new Date('2025-10-12T16:00:00Z'),
    healthStatus: 'healthy',
    metrics: { buildTime: 205, deployTime: 280, errorRate: 0.3, successRate: 99.7, rollbackCount: 0 },
    createdBy: 'Piotr Wiśniewski'
  }
];

const initialEnvironments: Environment[] = [
  { name: 'dev', url: 'https://dev.syzio.app', status: 'online', uptime: 99.2 },
  { name: 'staging', url: 'https://staging.syzio.app', status: 'degraded', uptime: 98.5 },
  { name: 'production', url: 'https://syzio.app', status: 'online', uptime: 99.9 }
];

function MonitoringProvider({ children }: { children: ReactNode }) {
  const [packages, setPackages] = useState<DeploymentPackage[]>(initialPackages);
  const [environments] = useState<Environment[]>(initialEnvironments);

  const addPackage = (pkg: DeploymentPackage) => setPackages(prev => [...prev, pkg]);
  const updatePackageStatus = (id: string, status: DeploymentPackage['status']) => {
    setPackages(prev => prev.map(pkg => pkg.id === id ? { ...pkg, status } : pkg));
  };
  const simulateDeploy = async (id: string) => {
    updatePackageStatus(id, 'deploying');
    await new Promise(resolve => setTimeout(resolve, 3000));
    updatePackageStatus(id, 'deployed');
  };

  return (
    <MonitoringContext.Provider value={{ packages, environments, addPackage, updatePackageStatus, simulateDeploy }}>
      {children}
    </MonitoringContext.Provider>
  );
}

function useMonitoringStore() {
  const context = useContext(MonitoringContext);
  if (!context) throw new Error('useMonitoringStore must be used within MonitoringProvider');
  return context;
}

// ============================================
// SHADCN-STYLE COMPONENTS
// ============================================

const Card = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  const { theme } = useTheme();
  return (
    <div className={`rounded-lg border shadow-sm ${theme === 'dark'
        ? 'border-[#3a4152] bg-[#232938]'
        : 'border-slate-200 bg-white'
      } ${className}`}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  const { theme } = useTheme();
  return (
    <h3 className={`text-lg font-semibold leading-none tracking-tight ${theme === 'dark' ? 'text-slate-50' : 'text-slate-900'
      } ${className}`}>
      {children}
    </h3>
  );
};

const CardDescription = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  const { theme } = useTheme();
  return (
    <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
      } ${className}`}>
      {children}
    </p>
  );
};

const CardContent = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, variant = 'default', className = '' }: { children: ReactNode; variant?: 'default' | 'success' | 'warning' | 'error' | 'secondary'; className?: string }) => {
  const { theme } = useTheme();

  const variants = theme === 'dark' ? {
    default: 'border-slate-700 bg-slate-800 text-slate-300',
    success: 'border-green-900 bg-green-950 text-green-400',
    warning: 'border-yellow-900 bg-yellow-950 text-yellow-400',
    error: 'border-red-900 bg-red-950 text-red-400',
    secondary: 'border-slate-700 bg-slate-800 text-slate-400'
  } : {
    default: 'border-slate-200 bg-slate-100 text-slate-700',
    success: 'border-green-200 bg-green-100 text-green-700',
    warning: 'border-yellow-200 bg-yellow-100 text-yellow-700',
    error: 'border-red-200 bg-red-100 text-red-700',
    secondary: 'border-slate-200 bg-slate-100 text-slate-600'
  };

  return (
    <div className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

const Button = ({ children, variant = 'default', size = 'default', className = '', onClick }: { children: ReactNode; variant?: 'default' | 'outline' | 'secondary' | 'ghost'; size?: 'default' | 'sm' | 'lg' | 'icon'; className?: string; onClick?: () => void }) => {
  const { theme } = useTheme();

  const variants = theme === 'dark' ? {
    default: 'bg-white text-slate-900 hover:bg-white/90',
    outline: 'border border-white bg-white text-slate-900 hover:bg-white/90',
    secondary: 'bg-[#232938] text-slate-50 hover:bg-[#2d3342]',
    ghost: 'hover:bg-[#2d3342] hover:text-slate-50'
  } : {
    default: 'bg-slate-900 text-slate-50 hover:bg-slate-900/90',
    outline: 'border border-slate-300 bg-transparent hover:bg-slate-100',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-100/80',
    ghost: 'hover:bg-slate-100'
  };

  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10'
  };

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 ${theme === 'dark' ? 'focus-visible:ring-slate-300' : 'focus-visible:ring-slate-700'
        } disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const configs: Record<string, { variant: 'success' | 'warning' | 'error' | 'secondary'; icon: ReactNode; label: string }> = {
    draft: { variant: 'secondary', icon: <Package className="w-3 h-3" />, label: 'Draft' },
    ready: { variant: 'warning', icon: <Clock className="w-3 h-3" />, label: 'Ready' },
    deploying: { variant: 'warning', icon: <Loader className="w-3 h-3 animate-spin" />, label: 'Deploying' },
    deployed: { variant: 'success', icon: <CheckCircle className="w-3 h-3" />, label: 'Deployed' },
    failed: { variant: 'error', icon: <XCircle className="w-3 h-3" />, label: 'Failed' },
    rollback: { variant: 'error', icon: <AlertCircle className="w-3 h-3" />, label: 'Rollback' },
    online: { variant: 'success', icon: <CheckCircle className="w-3 h-3" />, label: 'Online' },
    offline: { variant: 'error', icon: <XCircle className="w-3 h-3" />, label: 'Offline' },
    degraded: { variant: 'warning', icon: <AlertCircle className="w-3 h-3" />, label: 'Degraded' }
  };

  const config = configs[status] || configs.draft;

  return (
    <Badge variant={config.variant} className="gap-1">
      {config.icon}
      {config.label}
    </Badge>
  );
};

const Separator = ({ className = '' }: { className?: string }) => {
  const { theme } = useTheme();
  return (
    <div className={`h-px w-full ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'
      } ${className}`} />
  );
};

// JIRA Issue Type Badge
const IssueTypeBadge = ({ type }: { type: 'story' | 'bug' | 'task' | 'epic' }) => {
  const { theme } = useTheme();

  const configs = {
    story: {
      icon: <Package className="w-3 h-3" />,
      label: 'Story',
      color: theme === 'dark' ? 'bg-green-950 text-green-400 border-green-900' : 'bg-green-100 text-green-700 border-green-200'
    },
    bug: {
      icon: <AlertCircle className="w-3 h-3" />,
      label: 'Bug',
      color: theme === 'dark' ? 'bg-red-950 text-red-400 border-red-900' : 'bg-red-100 text-red-700 border-red-200'
    },
    task: {
      icon: <CheckCircle className="w-3 h-3" />,
      label: 'Task',
      color: theme === 'dark' ? 'bg-blue-950 text-blue-400 border-blue-900' : 'bg-blue-100 text-blue-700 border-blue-200'
    },
    epic: {
      icon: <Activity className="w-3 h-3" />,
      label: 'Epic',
      color: theme === 'dark' ? 'bg-purple-950 text-purple-400 border-purple-900' : 'bg-purple-100 text-purple-700 border-purple-200'
    }
  };

  const config = configs[type];

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${config.color}`}>
      {config.icon}
      {config.label}
    </div>
  );
};

// JIRA Priority Badge
const PriorityBadge = ({ priority }: { priority: 'highest' | 'high' | 'medium' | 'low' | 'lowest' }) => {
  const { theme } = useTheme();

  const configs = {
    highest: {
      icon: '🔴',
      label: 'Highest',
      color: theme === 'dark' ? 'text-red-400' : 'text-red-600'
    },
    high: {
      icon: '🟠',
      label: 'High',
      color: theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
    },
    medium: {
      icon: '🟡',
      label: 'Medium',
      color: theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
    },
    low: {
      icon: '🟢',
      label: 'Low',
      color: theme === 'dark' ? 'text-green-400' : 'text-green-600'
    },
    lowest: {
      icon: '⚪',
      label: 'Lowest',
      color: theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
    }
  };

  const config = configs[priority];

  return (
    <div className={`inline-flex items-center gap-1 text-xs font-medium ${config.color}`}>
      <span>{config.icon}</span>
      {config.label}
    </div>
  );
};

// JIRA Issue Status Badge
const IssueStatusBadge = ({ status }: { status: 'todo' | 'in-progress' | 'in-review' | 'done' }) => {
  const { theme } = useTheme();

  const configs = {
    'todo': {
      label: 'To Do',
      color: theme === 'dark' ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-200'
    },
    'in-progress': {
      label: 'In Progress',
      color: theme === 'dark' ? 'bg-blue-950 text-blue-400 border-blue-900' : 'bg-blue-100 text-blue-700 border-blue-200'
    },
    'in-review': {
      label: 'In Review',
      color: theme === 'dark' ? 'bg-purple-950 text-purple-400 border-purple-900' : 'bg-purple-100 text-purple-700 border-purple-200'
    },
    'done': {
      label: 'Done',
      color: theme === 'dark' ? 'bg-green-950 text-green-400 border-green-900' : 'bg-green-100 text-green-700 border-green-200'
    }
  };

  const config = configs[status];

  return (
    <div className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${config.color}`}>
      {config.label}
    </div>
  );
};

// ============================================
// VIEWS
// ============================================

const PackageDetailView = ({ packageId, onBack }: { packageId: string; onBack: () => void }) => {
  const { packages } = useMonitoringStore();
  const { theme } = useTheme();
  const pkg = packages.find(p => p.id === packageId);

  if (!pkg) {
    return (
      <div className="text-center py-12">
        <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>Package not found</p>
        <Button onClick={onBack} variant="outline" className="mt-4">
          ← Back to Deployments
        </Button>
      </div>
    );
  }

  const textPrimary = theme === 'dark' ? 'text-slate-50' : 'text-slate-900';
  const textSecondary = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';
  const iconColor = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';

  // Calculate stats
  const totalStoryPoints = pkg.jiraIssues.reduce((acc, issue) => acc + (issue.storyPoints || 0), 0);
  const completedIssues = pkg.jiraIssues.filter(i => i.status === 'done').length;
  const completionRate = Math.round((completedIssues / pkg.jiraIssues.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button onClick={onBack} variant="outline" size="icon">
          <ChevronRight className="h-4 w-4 rotate-180" />
        </Button>
        <div className="flex-1">
          <h1 className={`text-3xl font-bold ${textPrimary}`}>{pkg.name}</h1>
          <p className={`text-sm ${textSecondary} mt-1`}>
            Version {pkg.version} • {pkg.environment} • Created by {pkg.createdBy}
          </p>
        </div>
        <StatusBadge status={pkg.status} />
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${textSecondary}`}>Total Issues</p>
                <p className={`text-2xl font-bold ${textPrimary}`}>{pkg.jiraIssues.length}</p>
              </div>
              <Package className={`h-8 w-8 ${iconColor}`} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${textSecondary}`}>Story Points</p>
                <p className={`text-2xl font-bold ${textPrimary}`}>{totalStoryPoints}</p>
              </div>
              <TrendingUp className={`h-8 w-8 ${iconColor}`} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${textSecondary}`}>Completion</p>
                <p className={`text-2xl font-bold ${textPrimary}`}>{completionRate}%</p>
              </div>
              <CheckCircle className={`h-8 w-8 ${iconColor}`} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${textSecondary}`}>Commits</p>
                <p className={`text-2xl font-bold ${textPrimary}`}>{pkg.commits.length}</p>
              </div>
              <GitCommit className={`h-8 w-8 ${iconColor}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content - JIRA Issues */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Atlas Issues ({pkg.jiraIssues.length})</CardTitle>
              <CardDescription>Tasks and stories included in this deployment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pkg.jiraIssues.map((issue) => (
                <Card key={issue.id}>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      {/* Issue Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`font-mono text-sm font-medium ${textPrimary}`}>{issue.key}</span>
                            <IssueTypeBadge type={issue.type} />
                            <IssueStatusBadge status={issue.status} />
                          </div>
                          <h3 className={`text-base font-semibold ${textPrimary} mb-1`}>{issue.summary}</h3>
                          <p className={`text-sm ${textSecondary}`}>{issue.description}</p>
                        </div>
                        <PriorityBadge priority={issue.priority} />
                      </div>

                      <Separator />

                      {/* Issue Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className={textSecondary}>Assignee</p>
                          <p className={textPrimary}>{issue.assignee}</p>
                        </div>
                        <div>
                          <p className={textSecondary}>Reporter</p>
                          <p className={textPrimary}>{issue.reporter}</p>
                        </div>
                        {issue.storyPoints && (
                          <div>
                            <p className={textSecondary}>Story Points</p>
                            <p className={textPrimary}>{issue.storyPoints}</p>
                          </div>
                        )}
                        <div>
                          <p className={textSecondary}>Updated</p>
                          <p className={textPrimary}>{new Date(issue.updatedAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                      {/* Labels */}
                      {issue.labels.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {issue.labels.map((label) => (
                            <Badge key={label} variant="secondary" className="text-xs">
                              {label}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* Commits */}
          <Card>
            <CardHeader>
              <CardTitle>Git Commits ({pkg.commits.length})</CardTitle>
              <CardDescription>Code changes in this deployment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {pkg.commits.map((commit) => (
                <div key={commit.hash} className={`border-l-2 ${theme === 'dark' ? 'border-blue-500' : 'border-blue-600'
                  } pl-4 py-2`}>
                  <div className="flex items-start justify-between mb-1">
                    <p className={`font-medium ${textPrimary}`}>{commit.message}</p>
                    <span className={`text-xs font-mono ${textSecondary}`}>{commit.hash.slice(0, 7)}</span>
                  </div>
                  <p className={`text-sm ${textSecondary}`}>
                    by {commit.author} • {new Date(commit.timestamp).toLocaleString()}
                  </p>
                  {commit.linkedIssues.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {commit.linkedIssues.map(issueKey => (
                        <Badge key={issueKey} variant="secondary" className="text-xs font-mono">
                          {issueKey}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Package Info */}
          <Card>
            <CardHeader>
              <CardTitle>Package Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className={`text-sm ${textSecondary} mb-1`}>Environment</p>
                <Badge variant="secondary" className="capitalize">{pkg.environment}</Badge>
              </div>
              <div>
                <p className={`text-sm ${textSecondary} mb-1`}>Created</p>
                <p className={`text-sm ${textPrimary}`}>{new Date(pkg.createdAt).toLocaleString()}</p>
              </div>
              {pkg.scheduledAt && (
                <div>
                  <p className={`text-sm ${textSecondary} mb-1`}>Scheduled</p>
                  <p className={`text-sm ${textPrimary}`}>{new Date(pkg.scheduledAt).toLocaleString()}</p>
                </div>
              )}
              {pkg.deployedAt && (
                <div>
                  <p className={`text-sm ${textSecondary} mb-1`}>Deployed</p>
                  <p className={`text-sm ${textPrimary}`}>{new Date(pkg.deployedAt).toLocaleString()}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Metrics */}
          {pkg.metrics && (
            <Card>
              <CardHeader>
                <CardTitle>Deployment Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className={textSecondary}>Build Time</span>
                    <span className={textPrimary}>
                      {Math.floor(pkg.metrics.buildTime / 60)}m {pkg.metrics.buildTime % 60}s
                    </span>
                  </div>
                  <div className={`w-full h-2 rounded-full ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'
                    }`}>
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '70%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className={textSecondary}>Deploy Time</span>
                    <span className={textPrimary}>
                      {Math.floor(pkg.metrics.deployTime / 60)}m {pkg.metrics.deployTime % 60}s
                    </span>
                  </div>
                  <div className={`w-full h-2 rounded-full ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'
                    }`}>
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className={textSecondary}>Success Rate</span>
                    <span className="text-green-500 font-bold">{pkg.metrics.successRate}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className={textSecondary}>Error Rate</span>
                    <span className="text-red-500 font-bold">{pkg.metrics.errorRate}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className={textSecondary}>Rollbacks</span>
                    <span className={textPrimary}>{pkg.metrics.rollbackCount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Health Status */}
          <Card>
            <CardHeader>
              <CardTitle>Health Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${pkg.healthStatus === 'healthy'
                    ? theme === 'dark' ? 'bg-green-950' : 'bg-green-100'
                    : pkg.healthStatus === 'warning'
                      ? theme === 'dark' ? 'bg-yellow-950' : 'bg-yellow-100'
                      : theme === 'dark' ? 'bg-red-950' : 'bg-red-100'
                  }`}>
                  {pkg.healthStatus === 'healthy' ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : pkg.healthStatus === 'warning' ? (
                    <AlertCircle className="w-6 h-6 text-yellow-500" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500" />
                  )}
                </div>
                <div>
                  <p className={`font-semibold capitalize ${textPrimary}`}>{pkg.healthStatus}</p>
                  <p className={`text-sm ${textSecondary}`}>All systems operational</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const MonitoringDashboard = ({ onViewDetails }: { onViewDetails: (id: string) => void }) => {
  const { environments, packages } = useMonitoringStore();
  const { theme } = useTheme();

  const recentDeployments = packages
    .filter(p => p.status === 'deployed')
    .sort((a, b) => (b.deployedAt?.getTime() || 0) - (a.deployedAt?.getTime() || 0))
    .slice(0, 5);

  const avgDeployTime = packages
    .filter(p => p.metrics)
    .reduce((acc, p) => acc + (p.metrics?.deployTime || 0), 0) / packages.filter(p => p.metrics).length;

  const successRate = packages
    .filter(p => p.metrics)
    .reduce((acc, p) => acc + (p.metrics?.successRate || 0), 0) / packages.filter(p => p.metrics).length;

  const totalIssuesDeployed = packages.reduce((acc, p) => acc + p.linkedIssues.length, 0);
  const activePackages = packages.filter(p => p.status === 'ready' || p.status === 'deploying').length;

  const textPrimary = theme === 'dark' ? 'text-slate-50' : 'text-slate-900';
  const textSecondary = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';
  const iconColor = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Deploy Time</CardTitle>
            <Clock className={`h-4 w-4 ${iconColor}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${textPrimary}`}>
              {Math.round(avgDeployTime / 60)}m {Math.round(avgDeployTime % 60)}s
            </div>
            <p className={`text-xs ${textSecondary} flex items-center gap-1 mt-1`}>
              <ArrowDownRight className="h-3 w-3 text-green-500" />
              <span className="text-green-500">8.2%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className={`h-4 w-4 ${iconColor}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${textPrimary}`}>{Math.round(successRate)}%</div>
            <p className={`text-xs ${textSecondary} flex items-center gap-1 mt-1`}>
              <ArrowUpRight className="h-3 w-3 text-green-500" />
              <span className="text-green-500">2.1%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Issues Deployed</CardTitle>
            <Package className={`h-4 w-4 ${iconColor}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${textPrimary}`}>{totalIssuesDeployed}</div>
            <p className={`text-xs ${textSecondary} mt-1`}>Across all environments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Packages</CardTitle>
            <Activity className={`h-4 w-4 ${iconColor}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${textPrimary}`}>{activePackages}</div>
            <p className={`text-xs ${textSecondary} mt-1`}>Ready to deploy</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        {/* Environments */}
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Environments</CardTitle>
            <CardDescription>Monitor deployment environments in real-time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {environments.map((env) => (
              <div key={env.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'
                    }`}>
                    <Server className={`h-5 w-5 ${iconColor}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-medium ${textPrimary} capitalize`}>{env.name}</p>
                      <StatusBadge status={env.status} />
                    </div>
                    <p className={`text-xs ${textSecondary}`}>{env.url}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${textPrimary}`}>{env.uptime}%</div>
                  <div className={`text-xs ${textSecondary}`}>uptime</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common deployment tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Plus className="h-4 w-4" />
              New Deployment
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <BarChart3 className="h-4 w-4" />
              View Analytics
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <GitCommit className="h-4 w-4" />
              Commit History
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Activity className="h-4 w-4" />
              System Status
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Deployments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Deployments</CardTitle>
          <CardDescription>Latest deployment activity across all environments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className={`border-b ${theme === 'dark' ? 'border-[#3a4152]' : 'border-slate-200'}`}>
                <tr className={`border-b transition-colors ${theme === 'dark' ? 'border-[#3a4152] hover:bg-[#2d3342]/50' : 'border-slate-200 hover:bg-slate-50'
                  }`}>
                  <th className={`h-12 px-4 text-left align-middle font-medium ${textSecondary}`}>Package</th>
                  <th className={`h-12 px-4 text-left align-middle font-medium ${textSecondary}`}>Status</th>
                  <th className={`h-12 px-4 text-left align-middle font-medium ${textSecondary}`}>Environment</th>
                  <th className={`h-12 px-4 text-left align-middle font-medium ${textSecondary}`}>Issues</th>
                  <th className={`h-12 px-4 text-left align-middle font-medium ${textSecondary}`}>Deploy Time</th>
                  <th className={`h-12 px-4 text-left align-middle font-medium ${textSecondary}`}>Success Rate</th>
                  <th className={`h-12 px-4 text-left align-middle font-medium ${textSecondary}`}>Deployed</th>
                  <th className={`h-12 px-4 text-right align-middle font-medium ${textSecondary}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentDeployments.map((pkg) => (
                  <tr key={pkg.id} className={`border-b transition-colors ${theme === 'dark' ? 'border-[#3a4152] hover:bg-[#2d3342]/50' : 'border-slate-200 hover:bg-slate-50'
                    }`}>
                    <td className="p-4 align-middle">
                      <div>
                        <div className={`font-medium ${textPrimary}`}>{pkg.name}</div>
                        <div className={`text-xs ${textSecondary} font-mono`}>v{pkg.version}</div>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <StatusBadge status={pkg.status} />
                    </td>
                    <td className="p-4 align-middle">
                      <Badge variant="secondary" className="capitalize">{pkg.environment}</Badge>
                    </td>
                    <td className="p-4 align-middle">
                      <div className={`text-sm ${textSecondary}`}>{pkg.linkedIssues.length} issues</div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className={`text-sm ${textPrimary}`}>
                        {pkg.metrics ? `${Math.round(pkg.metrics.deployTime / 60)}m ${Math.round(pkg.metrics.deployTime % 60)}s` : '—'}
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className={`text-sm ${textPrimary}`}>
                        {pkg.metrics ? `${pkg.metrics.successRate}%` : '—'}
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className={`text-sm ${textSecondary}`}>
                        {pkg.deployedAt ? new Date(pkg.deployedAt).toLocaleDateString() : '—'}
                      </div>
                    </td>
                    <td className="p-4 align-middle text-right">
                      <Button variant="ghost" size="icon" onClick={() => onViewDetails(pkg.id)}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const DeploymentsView = ({ onViewDetails }: { onViewDetails: (id: string) => void }) => {
  const { packages, simulateDeploy } = useMonitoringStore();
  const { theme } = useTheme();
  const [filters, setFilters] = useState({ status: 'all', environment: 'all', search: '' });

  const filteredPackages = packages.filter((pkg) => {
    const matchesStatus = filters.status === 'all' || pkg.status === filters.status;
    const matchesEnv = filters.environment === 'all' || pkg.environment === filters.environment;
    const matchesSearch = pkg.name.toLowerCase().includes(filters.search.toLowerCase()) || pkg.version.includes(filters.search);
    return matchesStatus && matchesEnv && matchesSearch;
  });

  const textPrimary = theme === 'dark' ? 'text-slate-50' : 'text-slate-900';
  const textSecondary = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';
  const iconColor = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';
  const inputBorder = theme === 'dark' ? 'border-slate-800' : 'border-slate-300';
  const inputBg = theme === 'dark' ? 'bg-transparent' : 'bg-white';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold tracking-tight ${textPrimary}`}>Deployments</h2>
          <p className={textSecondary}>Manage and monitor your deployment packages</p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          New Package
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${iconColor}`} />
              <input
                type="text"
                placeholder="Search packages..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className={`flex h-10 w-full rounded-md border ${inputBorder} ${inputBg} px-3 py-2 pl-10 text-sm ${textPrimary} placeholder:${textSecondary} focus:outline-none focus:ring-1 ${theme === 'dark' ? 'focus:ring-slate-300' : 'focus:ring-slate-700'
                  }`}
              />
            </div>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className={`flex h-10 rounded-md border ${inputBorder} ${inputBg} px-3 py-2 text-sm ${textPrimary} focus:outline-none focus:ring-1 ${theme === 'dark' ? 'focus:ring-slate-300' : 'focus:ring-slate-700'
                }`}
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="ready">Ready</option>
              <option value="deploying">Deploying</option>
              <option value="deployed">Deployed</option>
            </select>
            <select
              value={filters.environment}
              onChange={(e) => setFilters({ ...filters, environment: e.target.value })}
              className={`flex h-10 rounded-md border ${inputBorder} ${inputBg} px-3 py-2 text-sm ${textPrimary} focus:outline-none focus:ring-1 ${theme === 'dark' ? 'focus:ring-slate-300' : 'focus:ring-slate-700'
                }`}
            >
              <option value="all">All Environments</option>
              <option value="dev">Development</option>
              <option value="staging">Staging</option>
              <option value="production">Production</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Packages Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredPackages.map((pkg) => (
          <Card key={pkg.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-base">{pkg.name}</CardTitle>
                  <CardDescription>Version {pkg.version}</CardDescription>
                </div>
                <StatusBadge status={pkg.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`flex items-center gap-4 text-sm ${textSecondary}`}>
                <div className="flex items-center gap-1">
                  <Server className="h-4 w-4" />
                  <span className="capitalize">{pkg.environment}</span>
                </div>
                <div className="flex items-center gap-1">
                  <GitCommit className="h-4 w-4" />
                  <span>{pkg.commits.length} commits</span>
                </div>
                <div className="flex items-center gap-1">
                  <Package className="h-4 w-4" />
                  <span>{pkg.jiraIssues.length} issues</span>
                </div>
              </div>

              <Separator />

              <div className="flex gap-2">
                {pkg.status === 'ready' && (
                  <Button size="sm" onClick={() => simulateDeploy(pkg.id)}>
                    Deploy Now
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={() => onViewDetails(pkg.id)}>
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const EnvironmentsView = () => {
  const { environments, packages } = useMonitoringStore();
  const { theme } = useTheme();

  const getEnvironmentDeployments = (envName: string) => {
    return packages
      .filter(p => p.environment === envName && p.status === 'deployed')
      .sort((a, b) => (b.deployedAt?.getTime() || 0) - (a.deployedAt?.getTime() || 0))
      .slice(0, 5);
  };

  const textPrimary = theme === 'dark' ? 'text-slate-50' : 'text-slate-900';
  const textSecondary = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-2xl font-bold tracking-tight ${textPrimary}`}>Environments</h2>
        <p className={textSecondary}>Monitor deployment environments and their history</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {environments.map((env) => {
          const deployments = getEnvironmentDeployments(env.name);
          const successfulDeploys = deployments.filter(d => d.metrics?.successRate === 100).length;

          return (
            <Card key={env.name}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="capitalize">{env.name}</CardTitle>
                    <CardDescription>{env.url}</CardDescription>
                  </div>
                  <StatusBadge status={env.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Uptime */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className={textSecondary}>Uptime</span>
                    <span className={`font-medium ${textPrimary}`}>{env.uptime}%</span>
                  </div>
                  <div className={`h-2 w-full overflow-hidden rounded-full ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'
                    }`}>
                    <div className="h-full bg-green-500 transition-all" style={{ width: `${env.uptime}%` }} />
                  </div>
                </div>

                <Separator />

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className={`text-2xl font-bold ${textPrimary}`}>{deployments.length}</div>
                    <div className={`text-xs ${textSecondary}`}>Total deploys</div>
                  </div>
                  <div className="space-y-1">
                    <div className={`text-2xl font-bold ${textPrimary}`}>
                      {deployments.length > 0 ? Math.round((successfulDeploys / deployments.length) * 100) : 0}%
                    </div>
                    <div className={`text-xs ${textSecondary}`}>Success rate</div>
                  </div>
                </div>

                <Separator />

                {/* Recent Deployments */}
                <div className="space-y-2">
                  <div className={`text-sm font-medium ${textPrimary}`}>Recent Deployments</div>
                  {deployments.length > 0 ? (
                    <div className="space-y-2">
                      {deployments.map((deployment) => (
                        <div key={deployment.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            {deployment.metrics?.successRate === 100 ? (
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            ) : (
                              <XCircle className="h-3 w-3 text-red-500" />
                            )}
                            <span className={`font-mono ${textPrimary}`}>{deployment.version}</span>
                          </div>
                          <span className={textSecondary}>{new Date(deployment.deployedAt || '').toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={`text-sm ${textSecondary}`}>No deployments yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

// ============================================
// MAIN APP
// ============================================

export function SyzioDevMonitoring() {
  const [activeView, setActiveView] = useState<'dashboard' | 'deployments' | 'environments'>('dashboard');

  return (
    <ThemeProvider>
      <MonitoringProvider>
        <AppContent activeView={activeView} setActiveView={setActiveView} />
      </MonitoringProvider>
    </ThemeProvider>
  );
}

function AppContent({ activeView, setActiveView }: {
  activeView: 'dashboard' | 'deployments' | 'environments';
  setActiveView: (view: 'dashboard' | 'deployments' | 'environments') => void
}) {
  const { theme, toggleTheme } = useTheme();
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);

  const handleViewDetails = (packageId: string) => {
    setSelectedPackageId(packageId);
  };

  const handleBackFromDetails = () => {
    setSelectedPackageId(null);
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'deployments', label: 'Deployments', icon: <Package className="h-4 w-4" /> },
    { id: 'environments', label: 'Environments', icon: <Server className="h-4 w-4" /> }
  ];

  const bgMain = theme === 'dark' ? 'bg-[#1a1f2e]' : 'bg-slate-50';
  const bgHeader = theme === 'dark' ? 'bg-[#1a1f2e]' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-[#3a4152]' : 'border-slate-200';
  const textPrimary = theme === 'dark' ? 'text-slate-50' : 'text-slate-900';
  const textSecondary = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';
  const iconBg = theme === 'dark' ? 'bg-[#232938] border-[#3a4152]' : 'bg-slate-100 border-slate-200';

  return (
    <div className={`min-h-screen ${bgMain} transition-colors duration-300`}>
      <div className={`border-b ${borderColor} ${bgHeader} transition-colors duration-300`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/demo-selector"
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${textSecondary} hover:${textPrimary} transition-colors`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back to Demos</span>
              </Link>
              <div className={`h-6 w-px ${borderColor}`} />
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg border ${iconBg}`}>
                  <Package className={`h-5 w-5 ${textPrimary}`} />
                </div>
                <div>
                  <h1 className={`text-xl font-bold ${textPrimary}`}>Syzio Helix</h1>
                  <p className={`text-sm ${textSecondary}`}>Deployment tracking system</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="transition-transform hover:scale-105"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4" />
                Documentation
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Tabs Navigation - Hide when viewing package details */}
        {!selectedPackageId && (
          <div className={`mb-6 border-b ${borderColor}`}>
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id as any)}
                  className={`flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium transition-colors ${activeView === tab.id
                      ? `${theme === 'dark' ? 'border-slate-50 text-slate-50' : 'border-slate-900 text-slate-900'}`
                      : `border-transparent ${textSecondary} ${theme === 'dark' ? 'hover:border-slate-700 hover:text-slate-300' : 'hover:border-slate-300 hover:text-slate-700'}`
                    }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        )}

        {/* Content */}
        {selectedPackageId ? (
          <PackageDetailView packageId={selectedPackageId} onBack={handleBackFromDetails} />
        ) : (
          <>
            {activeView === 'dashboard' && <MonitoringDashboard onViewDetails={handleViewDetails} />}
            {activeView === 'deployments' && <DeploymentsView onViewDetails={handleViewDetails} />}
            {activeView === 'environments' && <EnvironmentsView />}
          </>
        )}
      </div>
    </div>
  );
}