# Demo 5 - API Examples (Future Integration)

## Przegląd

Ten dokument zawiera przykłady API endpoints, które będą potrzebne do pełnej integracji Demo 5 z backendem.

---

## REST API Endpoints

### Deployment Packages

#### GET /api/deployments
Pobierz wszystkie deployment packages

```typescript
// Request
GET /api/deployments?environment=staging&status=ready

// Response
{
  "data": [
    {
      "id": "pkg-001",
      "name": "Release 2.1.0",
      "version": "2.1.0",
      "status": "ready",
      "environment": "staging",
      "linkedIssues": ["TSK-042", "TSK-045"],
      "createdAt": "2025-01-09T10:00:00Z",
      "createdBy": "alice@example.com"
    }
  ],
  "total": 1,
  "page": 1,
  "perPage": 10
}
```

#### GET /api/deployments/:id
Pobierz szczegóły deployment package

```typescript
// Request
GET /api/deployments/pkg-001

// Response
{
  "id": "pkg-001",
  "name": "Release 2.1.0",
  "version": "2.1.0",
  "status": "ready",
  "environment": "staging",
  "linkedIssues": ["TSK-042", "TSK-045"],
  "jiraIssues": [
    {
      "id": "jira-1",
      "key": "TSK-042",
      "summary": "Fix login authentication bug",
      "type": "bug",
      "status": "done",
      "priority": "highest",
      "assignee": "Alice Johnson",
      "storyPoints": 5
    }
  ],
  "commits": [
    {
      "hash": "abc123",
      "message": "fix: resolve login issue (TSK-042)",
      "author": "Alice Johnson",
      "timestamp": "2025-01-09T08:00:00Z"
    }
  ],
  "metrics": {
    "buildTime": 210,
    "deployTime": 252,
    "errorRate": 0,
    "successRate": 100
  }
}
```

#### POST /api/deployments
Utwórz nowy deployment package

```typescript
// Request
POST /api/deployments
Content-Type: application/json

{
  "name": "Release 2.2.0",
  "version": "2.2.0",
  "environment": "staging",
  "linkedIssues": ["TSK-050", "TSK-051"],
  "scheduledAt": "2025-01-11T14:00:00Z"
}

// Response
{
  "id": "pkg-004",
  "name": "Release 2.2.0",
  "version": "2.2.0",
  "status": "draft",
  "environment": "staging",
  "linkedIssues": ["TSK-050", "TSK-051"],
  "createdAt": "2025-01-10T10:00:00Z",
  "createdBy": "current-user@example.com"
}
```

#### PATCH /api/deployments/:id
Aktualizuj deployment package

```typescript
// Request
PATCH /api/deployments/pkg-001
Content-Type: application/json

{
  "status": "ready",
  "scheduledAt": "2025-01-11T16:00:00Z"
}

// Response
{
  "id": "pkg-001",
  "status": "ready",
  "scheduledAt": "2025-01-11T16:00:00Z",
  "updatedAt": "2025-01-10T11:00:00Z"
}
```

#### POST /api/deployments/:id/deploy
Rozpocznij deployment

```typescript
// Request
POST /api/deployments/pkg-001/deploy

// Response
{
  "id": "pkg-001",
  "status": "deploying",
  "deploymentStartedAt": "2025-01-10T12:00:00Z",
  "estimatedCompletionTime": "2025-01-10T12:05:00Z"
}
```

#### POST /api/deployments/:id/rollback
Rollback deployment

```typescript
// Request
POST /api/deployments/pkg-001/rollback
Content-Type: application/json

{
  "reason": "Critical bug found in production"
}

// Response
{
  "id": "pkg-001",
  "status": "rollback",
  "rollbackStartedAt": "2025-01-10T12:30:00Z",
  "rollbackReason": "Critical bug found in production"
}
```

---

### JIRA Integration

#### GET /api/jira/issues/:key
Pobierz szczegóły JIRA issue

```typescript
// Request
GET /api/jira/issues/TSK-042

// Response
{
  "id": "jira-1",
  "key": "TSK-042",
  "summary": "Fix login authentication bug",
  "description": "Users are unable to login with SSO credentials...",
  "type": "bug",
  "status": "done",
  "priority": "highest",
  "assignee": {
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "avatar": "https://..."
  },
  "reporter": {
    "name": "Bob Smith",
    "email": "bob@example.com"
  },
  "storyPoints": 5,
  "labels": ["security", "authentication", "critical"],
  "createdAt": "2025-01-03T10:00:00Z",
  "updatedAt": "2025-01-09T15:00:00Z"
}
```

#### GET /api/jira/issues
Pobierz wiele JIRA issues

```typescript
// Request
GET /api/jira/issues?keys=TSK-042,TSK-045,TSK-048

// Response
{
  "issues": [
    {
      "key": "TSK-042",
      "summary": "Fix login authentication bug",
      "status": "done",
      "type": "bug"
    },
    {
      "key": "TSK-045",
      "summary": "Add dark mode toggle",
      "status": "done",
      "type": "story"
    }
  ]
}
```

#### POST /api/jira/sync
Synchronizuj dane z JIRA

```typescript
// Request
POST /api/jira/sync
Content-Type: application/json

{
  "issueKeys": ["TSK-042", "TSK-045", "TSK-048"]
}

// Response
{
  "synced": 3,
  "failed": 0,
  "issues": [...]
}
```

---

### Git Integration

#### GET /api/git/commits
Pobierz commity

```typescript
// Request
GET /api/git/commits?branch=main&since=2025-01-01

// Response
{
  "commits": [
    {
      "hash": "abc123def456",
      "shortHash": "abc123",
      "message": "fix: resolve login issue (TSK-042)",
      "author": {
        "name": "Alice Johnson",
        "email": "alice@example.com"
      },
      "timestamp": "2025-01-09T08:00:00Z",
      "linkedIssues": ["TSK-042"]
    }
  ],
  "total": 1
}
```

#### GET /api/git/commits/:hash
Pobierz szczegóły commita

```typescript
// Request
GET /api/git/commits/abc123def456

// Response
{
  "hash": "abc123def456",
  "shortHash": "abc123",
  "message": "fix: resolve login issue (TSK-042)",
  "author": {
    "name": "Alice Johnson",
    "email": "alice@example.com"
  },
  "timestamp": "2025-01-09T08:00:00Z",
  "linkedIssues": ["TSK-042"],
  "files": [
    {
      "path": "src/auth/login.ts",
      "additions": 15,
      "deletions": 8,
      "changes": 23
    }
  ],
  "stats": {
    "additions": 15,
    "deletions": 8,
    "files": 1
  }
}
```

#### POST /api/git/link-issues
Linkuj commity z issues

```typescript
// Request
POST /api/git/link-issues
Content-Type: application/json

{
  "commitHash": "abc123def456",
  "issueKeys": ["TSK-042"]
}

// Response
{
  "commitHash": "abc123def456",
  "linkedIssues": ["TSK-042"],
  "success": true
}
```

---

### Environments

#### GET /api/environments
Pobierz wszystkie środowiska

```typescript
// Request
GET /api/environments

// Response
{
  "environments": [
    {
      "name": "production",
      "url": "https://syzio.app",
      "status": "online",
      "uptime": 99.9,
      "lastDeployment": {
        "id": "pkg-002",
        "name": "Release 2.0.1",
        "deployedAt": "2025-01-09T10:00:00Z"
      },
      "healthChecks": {
        "api": "healthy",
        "database": "healthy",
        "cache": "healthy"
      }
    }
  ]
}
```

#### GET /api/environments/:name
Pobierz szczegóły środowiska

```typescript
// Request
GET /api/environments/production

// Response
{
  "name": "production",
  "url": "https://syzio.app",
  "status": "online",
  "uptime": 99.9,
  "lastDeployment": {
    "id": "pkg-002",
    "name": "Release 2.0.1",
    "version": "2.0.1",
    "deployedAt": "2025-01-09T10:00:00Z"
  },
  "metrics": {
    "requestsPerMinute": 1250,
    "averageResponseTime": 145,
    "errorRate": 0.02,
    "activeUsers": 342
  },
  "healthChecks": {
    "api": {
      "status": "healthy",
      "responseTime": 45,
      "lastCheck": "2025-01-10T12:00:00Z"
    },
    "database": {
      "status": "healthy",
      "connections": 25,
      "lastCheck": "2025-01-10T12:00:00Z"
    }
  }
}
```

#### GET /api/environments/:name/history
Pobierz historię deploymentów dla środowiska

```typescript
// Request
GET /api/environments/production/history?limit=10

// Response
{
  "deployments": [
    {
      "id": "pkg-002",
      "name": "Release 2.0.1",
      "version": "2.0.1",
      "deployedAt": "2025-01-09T10:00:00Z",
      "deployedBy": "alice@example.com",
      "status": "deployed",
      "duration": 252
    }
  ],
  "total": 1
}
```

---

### Metrics & Analytics

#### GET /api/metrics/deployments
Pobierz metryki deploymentów

```typescript
// Request
GET /api/metrics/deployments?from=2025-01-01&to=2025-01-10

// Response
{
  "period": {
    "from": "2025-01-01T00:00:00Z",
    "to": "2025-01-10T23:59:59Z"
  },
  "metrics": {
    "totalDeployments": 15,
    "successfulDeployments": 14,
    "failedDeployments": 1,
    "successRate": 93.3,
    "averageBuildTime": 245,
    "averageDeployTime": 312,
    "averageLeadTime": 86400,
    "deploymentFrequency": 1.5
  },
  "byEnvironment": {
    "production": {
      "deployments": 5,
      "successRate": 100
    },
    "staging": {
      "deployments": 10,
      "successRate": 90
    }
  }
}
```

#### GET /api/metrics/dora
Pobierz DORA metrics

```typescript
// Request
GET /api/metrics/dora?from=2025-01-01&to=2025-01-10

// Response
{
  "period": {
    "from": "2025-01-01T00:00:00Z",
    "to": "2025-01-10T23:59:59Z"
  },
  "metrics": {
    "deploymentFrequency": {
      "value": 1.5,
      "unit": "per day",
      "rating": "elite"
    },
    "leadTimeForChanges": {
      "value": 24,
      "unit": "hours",
      "rating": "high"
    },
    "timeToRestoreService": {
      "value": 2,
      "unit": "hours",
      "rating": "elite"
    },
    "changeFailureRate": {
      "value": 6.7,
      "unit": "percent",
      "rating": "high"
    }
  }
}
```

---

## WebSocket Events (Real-time Updates)

### Connection
```typescript
const ws = new WebSocket('wss://api.syzio.app/ws/deployments');

ws.onopen = () => {
  console.log('Connected to deployment updates');
};
```

### Events

#### deployment.status.changed
```typescript
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  if (data.type === 'deployment.status.changed') {
    console.log('Deployment status changed:', data.payload);
    // {
    //   deploymentId: 'pkg-001',
    //   oldStatus: 'deploying',
    //   newStatus: 'deployed',
    //   timestamp: '2025-01-10T12:05:00Z'
    // }
  }
};
```

#### deployment.progress
```typescript
// {
//   type: 'deployment.progress',
//   payload: {
//     deploymentId: 'pkg-001',
//     progress: 75,
//     currentStep: 'Running database migrations',
//     totalSteps: 5,
//     currentStepNumber: 4
//   }
// }
```

#### environment.health.changed
```typescript
// {
//   type: 'environment.health.changed',
//   payload: {
//     environment: 'production',
//     oldStatus: 'online',
//     newStatus: 'degraded',
//     reason: 'High error rate detected',
//     timestamp: '2025-01-10T12:10:00Z'
//   }
// }
```

---

## Przykładowa implementacja w React

### Custom Hook dla API

```typescript
// hooks/use-deployments.ts
import { useState, useEffect } from 'react';

export function useDeployments() {
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDeployments();
  }, []);

  const fetchDeployments = async () => {
    try {
      const response = await fetch('/api/deployments');
      const data = await response.json();
      setDeployments(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createDeployment = async (deployment) => {
    const response = await fetch('/api/deployments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deployment)
    });
    const newDeployment = await response.json();
    setDeployments([...deployments, newDeployment]);
    return newDeployment;
  };

  const deployPackage = async (id) => {
    await fetch(`/api/deployments/${id}/deploy`, { method: 'POST' });
    await fetchDeployments();
  };

  return {
    deployments,
    loading,
    error,
    createDeployment,
    deployPackage,
    refresh: fetchDeployments
  };
}
```

### WebSocket Hook

```typescript
// hooks/use-deployment-updates.ts
import { useEffect } from 'react';

export function useDeploymentUpdates(onUpdate) {
  useEffect(() => {
    const ws = new WebSocket('wss://api.syzio.app/ws/deployments');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onUpdate(data);
    };

    return () => ws.close();
  }, [onUpdate]);
}
```

### Użycie w komponencie

```typescript
function DeploymentDashboard() {
  const { deployments, loading, deployPackage } = useDeployments();

  useDeploymentUpdates((update) => {
    if (update.type === 'deployment.status.changed') {
      // Refresh deployments
      refresh();
    }
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {deployments.map(deployment => (
        <DeploymentCard
          key={deployment.id}
          deployment={deployment}
          onDeploy={() => deployPackage(deployment.id)}
        />
      ))}
    </div>
  );
}
```

---

## Authentication

Wszystkie API endpoints wymagają autentykacji:

```typescript
// Headers
Authorization: Bearer <jwt_token>
```

Przykład:
```typescript
const response = await fetch('/api/deployments', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

---

## Rate Limiting

- **Standard**: 100 requests/minute
- **WebSocket**: 1 connection per user
- **Bulk operations**: 10 requests/minute

---

## Error Handling

Wszystkie błędy zwracają standardowy format:

```typescript
{
  "error": {
    "code": "DEPLOYMENT_NOT_FOUND",
    "message": "Deployment with ID pkg-999 not found",
    "details": {},
    "timestamp": "2025-01-10T12:00:00Z"
  }
}
```

Kody błędów:
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (np. deployment już w trakcie)
- `429` - Too Many Requests
- `500` - Internal Server Error

---

## Następne kroki

1. Zaimplementuj backend endpoints
2. Dodaj authentication/authorization
3. Skonfiguruj WebSocket server
4. Zintegruj z JIRA API
5. Zintegruj z Git provider (GitHub/GitLab)
6. Dodaj monitoring i logging
7. Skonfiguruj rate limiting
8. Dodaj testy API
