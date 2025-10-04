// lib/rbac.ts
import type { UserRole, Issue, Permission } from "@/types"

export interface Permission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete';
}

const rolePermissions: Record<UserRole, Permission[]> = {
  Admin: [
    { resource: '*', action: 'create' },
    { resource: '*', action: 'read' },
    { resource: '*', action: 'update' },
    { resource: '*', action: 'delete' }
  ],
  'Product Owner': [
    { resource: 'issues', action: 'create' },
    { resource: 'issues', action: 'read' },
    { resource: 'issues', action: 'update' },
    { resource: 'sprints', action: 'read' },
    { resource: 'sprints', action: 'update' }
  ],
  Developer: [
    { resource: 'issues', action: 'read' },
    { resource: 'issues', action: 'update' }
  ],
  Designer: [
    { resource: 'issues', action: 'read' }
  ],
  Viewer: [
    { resource: 'issues', action: 'read' }
  ]
};

export class RBAC {
  static hasPermission(userRole: UserRole, resource: string, action: Permission['action']): boolean {
    const permissions = rolePermissions[userRole] || [];

    return permissions.some(permission => {
      const resourceMatch = permission.resource === '*' || permission.resource === resource;
      const actionMatch = permission.action === action || permission.action === '*';
      return resourceMatch && actionMatch;
    });
  }

  static canEditIssue(userRole: UserRole, issue: Issue, currentUserId: string): boolean {
    // Admin może edytować wszystko
    if (userRole === 'Admin') return true;

    // Właściciel zadania może je edytować
    if (issue.assignee === currentUserId) return true;

    // Product Owner może edytować zadania w swoim sprincie
    if (userRole === 'Product Owner') return true;

    return false;
  }
}

// Hook do używania RBAC w komponentach
export function useRBAC(userRole: UserRole, currentUserId: string) {
  const hasPermission = (resource: string, action: Permission['action']) => {
    return RBAC.hasPermission(userRole, resource, action);
  };

  const canEditIssue = (issue: Issue) => {
    return RBAC.canEditIssue(userRole, issue, currentUserId);
  };

  return { hasPermission, canEditIssue };
}


