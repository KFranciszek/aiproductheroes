# Requirements Document - Demo5 Mock Data Enhancement

## Introduction

Demo5 (Syzio Dev Monitoring) to system monitorowania deploymentów z integracją Jira i Git. Obecnie system posiada podstawowe dane mockowe w pliku. Celem jest rozszerzenie istniejących danych mockowych o więcej realistycznych pakietów, zadań Jira, commitów oraz dodanie funkcji Quick Actions do symulacji interakcji użytkownika z systemem.

## Requirements

### Requirement 1: Rozszerzenie Mock Data dla Deployment Packages

**User Story:** Jako tester systemu, chcę mieć więcej realistycznych danych mockowych dla pakietów deploymentowych, aby lepiej przetestować interfejs z różnymi scenariuszami.

#### Acceptance Criteria

1. WHEN system się ładuje THEN system SHALL zawierać co najmniej 15-20 pakietów deploymentowych
2. WHEN pakiety są generowane THEN pakiety SHALL mieć różne statusy: draft, ready, deploying, deployed, failed, rollback
3. WHEN pakiety są generowane THEN pakiety SHALL być przypisane do różnych środowisk: dev, staging, production
4. WHEN pakiety są generowane THEN każdy pakiet SHALL zawierać 2-6 zadań Jira
5. WHEN pakiety są generowane THEN każdy pakiet SHALL zawierać 3-10 commitów Git
6. WHEN pakiety są generowane THEN daty utworzenia SHALL być rozłożone w czasie (ostatnie 90 dni)
7. WHEN pakiety są generowane THEN pakiety SHALL mieć różne metryki: buildTime, deployTime, errorRate, successRate

### Requirement 2: Rozszerzenie Mock Data dla Jira Issues

**User Story:** Jako tester, chcę mieć różnorodne zadania Jira w pakietach, aby zobaczyć jak system wyświetla różne typy, priorytety i statusy zadań.

#### Acceptance Criteria

1. WHEN zadania są generowane THEN zadania SHALL mieć różne typy: story, bug, task, epic
2. WHEN zadania są generowane THEN zadania SHALL mieć różne priorytety: highest, high, medium, low, lowest
3. WHEN zadania są generowane THEN zadania SHALL mieć różne statusy: todo, in-progress, in-review, done
4. WHEN zadania są generowane THEN każde zadanie SHALL mieć unikalny key w formacie SZ-XXXX
5. WHEN zadania są generowane THEN zadania SHALL mieć realistyczne summary i description
6. WHEN zadania są generowane THEN zadania SHALL mieć story points (1, 2, 3, 5, 8, 13, 21)
7. WHEN zadania są generowane THEN zadania SHALL mieć labels odpowiednie do typu (np. security, ui, backend, performance)

### Requirement 3: Rozszerzenie Mock Data dla Git Commits

**User Story:** Jako tester, chcę mieć realistyczne commity Git powiązane z zadaniami Jira, aby zobaczyć jak system wyświetla historię zmian.

#### Acceptance Criteria

1. WHEN commity są generowane THEN każdy commit SHALL mieć unikalny hash (7 znaków)
2. WHEN commity są generowane THEN commity SHALL mieć conventional commit messages (feat:, fix:, perf:, docs:, test:)
3. WHEN commity są generowane THEN commity SHALL być powiązane z zadaniami Jira przez linkedIssues
4. WHEN commity są generowane THEN commity SHALL mieć różnych autorów z puli developerów
5. WHEN commity są generowane THEN commity SHALL mieć chronologiczne timestampy
6. WHEN commit jest powiązany z zadaniem THEN commit message SHALL zawierać key zadania (np. "feat: add login (SZ-1234)")

### Requirement 4: Quick Actions dla Deployment Packages

**User Story:** Jako użytkownik, chcę mieć dostęp do Quick Actions na pakietach, aby symulować podstawowe operacje deploymentowe.

#### Acceptance Criteria

1. WHEN użytkownik klika przycisk akcji na pakiecie THEN system SHALL wyświetlić dostępne akcje
2. WHEN pakiet ma status "ready" THEN system SHALL oferować akcję "Deploy" która zmienia status na "deployed"
3. WHEN pakiet ma status "deployed" THEN system SHALL oferować akcję "Rollback" która zmienia status na "rollback"
4. WHEN użytkownik wybierze akcję THEN system SHALL zaktualizować status pakietu
5. WHEN status się zmienia THEN system SHALL zaktualizować timestamp i metryki pakietu
