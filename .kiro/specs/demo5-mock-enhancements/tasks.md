# Implementation Plan - Demo5 Mock Data Enhancement

- [x] 1. Create data generation helper functions


  - Create helper functions: generateId, generateHash, randomElement, randomDate
  - Create data pools: developers, issueTypes, priorities, statuses, environments, packageStatuses
  - Create label generator based on issue type
  - Create summary generator based on issue type
  - Create description generator based on issue type
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 3.1, 3.2, 3.4, 3.5_

- [x] 2. Generate Jira Issues mock data


  - Create generateIssue function that creates realistic JiraIssue objects
  - Implement random type selection with proper distribution (40% story, 30% bug, 25% task, 5% epic)
  - Implement random priority selection with proper distribution
  - Implement random status selection with proper distribution (55% done, 20% in-progress, 15% in-review, 10% todo)
  - Generate unique keys in format SZ-XXXX (starting from SZ-1200)
  - Generate realistic summaries based on issue type
  - Generate realistic descriptions based on issue type
  - Assign random story points from Fibonacci sequence (1, 2, 3, 5, 8, 13, 21)
  - Generate relevant labels based on issue type
  - Generate random assignee and reporter from developer pool
  - Generate realistic createdAt and updatedAt dates
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

- [x] 3. Generate Git Commits mock data


  - Create generateCommit function that creates GitCommit objects linked to issues
  - Generate 7-character random hashes
  - Create conventional commit messages with types: feat, fix, perf, docs, test, refactor, chore
  - Include issue key in commit message (e.g., "feat: add feature (SZ-1234)")
  - Assign commit author from issue assignee
  - Generate chronological timestamps between issue createdAt and updatedAt
  - Link commits to issues through linkedIssues array
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [x] 4. Generate Deployment Packages mock data


  - Create generatePackage function that creates complete DeploymentPackage objects
  - Generate 15-20 packages total
  - Assign random statuses with distribution: 2 draft, 4 ready, 1 deploying, 8-10 deployed, 2 failed, 1 rollback
  - Assign random environments with distribution: 5 dev, 5 staging, 5-10 production
  - Generate 2-6 Jira issues per package
  - Generate 3-10 commits per package (1-3 commits per issue)
  - Generate package names in format "R-XXX (Canis)" for Canis style packages
  - Generate realistic createdAt dates spread over last 90 days
  - Generate deployedAt dates after createdAt
  - Generate random healthStatus (healthy, warning, critical)
  - Generate realistic metrics: buildTime (120-600s), deployTime (180-600s), errorRate (0-10%), successRate (90-100%), rollbackCount (0-3)
  - Assign random creator from developer pool
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

- [x] 5. Replace initialPackages array with generated data


  - Keep existing 5 packages as examples
  - Add 10-15 newly generated packages
  - Ensure all packages have unique IDs
  - Ensure all issue keys are unique
  - Verify data consistency (commits linked to issues, dates in order, etc.)
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

- [x] 6. Add Quick Actions button to package cards


  - Add "..." button or action button to each package card in the UI
  - Position button in top-right corner of package card
  - Add hover effect to button
  - _Requirements: 4.1_

- [x] 7. Implement Quick Actions dropdown menu

  - Create dropdown menu component that appears on button click
  - Show "Deploy" action when package status is "ready"
  - Show "Rollback" action when package status is "deployed"
  - Hide menu when clicking outside
  - Add icons to actions using lucide-react
  - _Requirements: 4.1, 4.2, 4.3_

- [x] 8. Implement Quick Actions handlers


  - Implement handleDeploy function that changes status from "ready" to "deployed"
  - Implement handleRollback function that changes status from "deployed" to "rollback"
  - Update package deployedAt timestamp when deploying
  - Update package metrics when status changes
  - Close dropdown menu after action
  - _Requirements: 4.2, 4.3, 4.4, 4.5_

- [ ] 9. Test and verify implementation


  - Verify that 15-20 packages are displayed
  - Verify packages have different statuses, environments, and dates
  - Verify issues have different types, priorities, and statuses
  - Verify commits are linked to issues correctly
  - Test Deploy action on ready packages
  - Test Rollback action on deployed packages
  - Verify UI updates immediately after actions
  - Check that all data displays correctly in existing UI components
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 4.1, 4.2, 4.3, 4.4, 4.5_
