# Requirements Document - Syzio Canis

## Introduction

**Syzio - Canis** to inteligentny moduł AI, który integruje się z ekosystemem Syzio jako oddzielna aplikacja. Canis działa jako "inteligentny partner projektowy" - nie jest to zwykły chatbot, ale system rozumiejący kontekst projektu, dokumentację i backlog. Głównym celem jest transformacja sposobu, w jaki zespoły deweloperskie wchodzą w interakcję z informacją projektową - od pasywnego przeszukiwania do aktywnego, konwersacyjnego dialogu prowadzącego do natychmiastowego działania.

Canis karmiony jest danymi z Syzio (dokumentacja, backlog, sprinty, release'y) i umożliwia:
- Konwersacyjny dialog z AI oparty o RAG (Retrieval-Augmented Generation)
- Generowanie user stories z kryteriami akceptacji
- Tworzenie danych testowych
- Weryfikację wymagań biznesowych i wykrywanie konfliktów
- Wizualizację zależności między zadaniami, dokumentacją i kodem

Filozofia projektu opiera się na trzech filarach:
1. **Inteligencja Kontekstowa** - rozumienie roli użytkownika i kontekstu pracy
2. **Przejrzystość i Wiarygodność** - każda odpowiedź AI z linkami do źródeł
3. **Płynność Pracy** - bezpośrednia integracja z Syzio, eliminacja przełączania kontekstu

## Requirements

### Requirement 1: Konwersacyjny Interfejs AI z RAG

**User Story:** Jako użytkownik Syzio (PM/Dev/QA), chcę zadawać pytania w naturalnym języku o projekt, dokumentację i backlog, aby szybko uzyskać kontekstowe odpowiedzi bez przeszukiwania wielu źródeł.

#### Acceptance Criteria

1. WHEN użytkownik wpisuje pytanie w interfejsie czatu THEN system przetwarza zapytanie i zwraca odpowiedź w ciągu 3 sekund
2. WHEN system generuje odpowiedź THEN każda odpowiedź zawiera klikalne "chipy" z cytatami źródłowymi
3. WHEN użytkownik kliknie chip źródłowy THEN wyświetla się Popover z podglądem fragmentu dokumentu/zadania
4. WHEN użytkownik zadaje pytanie THEN system automatycznie wykrywa kontekst (np. otwarte zadanie w Syzio) i uwzględnia go w odpowiedzi
5. IF użytkownik przeciągnie plik PDF/dokument na okno czatu THEN system przetwarza dokument i potwierdza gotowość do odpowiadania na pytania o jego zawartość
6. WHEN system nie znajduje odpowiedzi w dostępnych źródłach THEN informuje użytkownika o braku danych zamiast generować niepewne odpowiedzi

### Requirement 2: Generator User Stories z Kryteriami Akceptacji

**User Story:** Jako Product Owner, chcę automatycznie generować user stories z kryteriami akceptacji na podstawie dokumentacji, aby zaoszczędzić czas i zapewnić spójność z wymaganiami biznesowymi.

#### Acceptance Criteria

1. WHEN użytkownik poprosi o wygenerowanie stories z dokumentu THEN system generuje epikę i user stories w formacie INVEST
2. WHEN system generuje user story THEN każda story zawiera: tytuł, opis, kryteria akceptacji (format EARS/Gherkin), estymację i linki do źródeł w dokumentacji
3. WHEN stories są wygenerowane THEN wyświetlają się jako karty w widoku grid z możliwością edycji
4. WHEN użytkownik edytuje wygenerowaną story THEN zmiany są zapisywane lokalnie przed wysłaniem do Syzio
5. WHEN użytkownik kliknie "Wyślij do Syzio" THEN zaznaczone stories są tworzone jako zadania w backlogu Syzio PM
6. IF wygenerowana story koliduje z istniejącym zadaniem THEN system wyświetla ostrzeżenie z Badge i sugeruje akcje
7. WHEN system generuje kryteria akceptacji THEN używa formatu EARS (WHEN/IF/WHILE... THEN... SHALL) lub Gherkin (Given/When/Then)

### Requirement 3: Generator Danych Testowych

**User Story:** Jako QA Engineer, chcę generować realistyczne dane testowe (JSON/CSV/SQL) na podstawie schematów API i user stories, aby szybko przygotować środowisko testowe.

#### Acceptance Criteria

1. WHEN użytkownik wybierze schemat API lub story THEN system wyświetla formularz konfiguracji danych testowych
2. WHEN użytkownik definiuje parametry (ilość rekordów, przypadki brzegowe) THEN system generuje dane zgodne z wymaganiami
3. WHEN dane są wygenerowane THEN użytkownik może je podejrzeć w tabeli z możliwością edycji
4. WHEN użytkownik kliknie "Eksportuj" THEN system oferuje wybór formatu: JSON, CSV, SQL
5. IF użytkownik wybierze SQL THEN system generuje INSERT statements kompatybilne z PostgreSQL/MySQL
6. WHEN użytkownik zdefiniuje przypadki brzegowe (np. 10 rekordów z nieprawidłowym numerem karty) THEN system uwzględnia je w wygenerowanych danych
7. WHEN schemat API zawiera relacje (foreign keys) THEN system automatycznie generuje spójne dane dla powiązanych tabel

### Requirement 4: Weryfikacja Wymagań i Wykrywanie Konfliktów

**User Story:** Jako Developer, chcę analizować wpływ zmian w kodzie/API na dokumentację i zadania, aby uniknąć wprowadzenia konfliktów i błędów.

#### Acceptance Criteria

1. WHEN użytkownik zapyta o wpływ zmiany (np. "Wpływ zmiany pola limit w API płatności") THEN system wyświetla graf zależności
2. WHEN graf zależności jest wyświetlany THEN węzły reprezentują: zadania, dokumenty, testy, commity, a linie pokazują relacje
3. WHEN system wykryje konflikt THEN wyświetla Alert z opisem problemu i sugerowanymi akcjami
4. WHEN użytkownik kliknie węzeł w grafie THEN otwiera się Dialog z detalami (treść dokumentu, opis zadania, kod testu)
5. WHEN system wykryje sprzeczne wymagania w dokumentacji THEN oznacza je kolorem czerwonym i wyświetla szczegóły konfliktu
6. WHEN użytkownik kliknie "Utwórz task naprawczy" THEN system generuje zadanie w Syzio z opisem konfliktu i sugerowanym rozwiązaniem
7. IF zmiana nie wpływa na inne elementy THEN węzły są oznaczone kolorem cyjan (bezpieczne)

### Requirement 5: Release Q&A i Śledzenie Paczek

**User Story:** Jako Team Lead, chcę szybko uzyskać odpowiedź na pytanie "co weszło w release R-102", aby zrozumieć zakres zmian i komunikować się z interesariuszami.

#### Acceptance Criteria

1. WHEN użytkownik zapyta "co weszło w release R-102" THEN system wyświetla listę zadań, commitów i dokumentów związanych z tym release'm
2. WHEN lista jest wyświetlana THEN każdy element zawiera: ID, tytuł, status, autora i link do szczegółów
3. WHEN użytkownik kliknie element THEN otwiera się szczegółowy widok z pełnym kontekstem (story, commity, testy)
4. WHEN system prezentuje release THEN wizualizuje zależności między zadaniami jako "Konstelację Zależności"
5. IF release zawiera zadania z konfliktami THEN są one oznaczone Badge z ostrzeżeniem
6. WHEN użytkownik eksportuje raport release'u THEN system generuje dokument PDF/Markdown z podsumowaniem

### Requirement 6: Command Palette (⌘K) dla Szybkich Akcji

**User Story:** Jako użytkownik, chcę mieć szybki dostęp do wszystkich funkcji Canis bez odrywania rąk od klawiatury, aby zwiększyć efektywność pracy.

#### Acceptance Criteria

1. WHEN użytkownik naciśnie ⌘K (Ctrl+K na Windows) THEN otwiera się Command Palette jako modal overlay
2. WHEN Command Palette jest otwarta THEN użytkownik może wpisać akcję w naturalnym języku (np. "Generuj story", "Zweryfikuj wymagania")
3. WHEN użytkownik wybierze akcję THEN Command Palette zamyka się i akcja jest wykonywana
4. WHEN użytkownik wpisuje w Command Palette THEN wyniki są filtrowane w czasie rzeczywistym
5. WHEN Command Palette wyświetla akcje THEN każda akcja ma ikonę i skrót klawiszowy
6. IF użytkownik naciśnie Escape THEN Command Palette zamyka się bez wykonywania akcji

### Requirement 7: Responsywny UI z Motywem Kosmicznym

**User Story:** Jako użytkownik, chcę korzystać z Canis na różnych urządzeniach (desktop, tablet, mobile) z estetycznym i spójnym interfejsem, aby mieć komfortowe doświadczenie niezależnie od platformy.

#### Acceptance Criteria

1. WHEN użytkownik otwiera Canis na desktop THEN interfejs wyświetla sidebar, czat i zakładki w pełnym układzie
2. WHEN użytkownik otwiera Canis na mobile THEN sidebar jest ukryty, czat jest fullscreen, a zakładki dostępne przez menu
3. WHEN interfejs jest wyświetlany THEN używa motywu "Konstelacja Zależności" z tłem granatowo-grafitowym (dark mode)
4. WHEN użytkownik wykonuje akcję THEN aktywne elementy pulsują subtelnie (animacja jak gwiazdy)
5. WHEN dane są ładowane THEN wyświetla się animacja przypominająca formowanie się gwiazd
6. WHEN użytkownik najedzie na element interaktywny THEN element podświetla się kolorem fioletowym lub cyjanowym
7. IF użytkownik preferuje light mode THEN może przełączyć motyw przez Switch w sidebar

### Requirement 8: Integracja z Syzio PM i Dev Monitoring

**User Story:** Jako użytkownik ekosystemu Syzio, chcę aby Canis automatycznie synchronizował się z danymi z Syzio PM i Dev Monitoring, aby mieć zawsze aktualny kontekst.

#### Acceptance Criteria

1. WHEN Canis uruchamia się THEN automatycznie pobiera dane z Syzio PM (backlog, sprinty, zadania)
2. WHEN Canis pobiera dane THEN wyświetla status synchronizacji w sidebar (Badge z "Synchronizacja..." lub "Aktualne")
3. WHEN użytkownik tworzy zadanie przez Canis THEN zadanie pojawia się w Syzio PM w ciągu 5 sekund
4. WHEN zadanie w Syzio PM jest aktualizowane THEN Canis odświeża swój kontekst w czasie rzeczywistym
5. IF Canis nie może połączyć się z Syzio THEN wyświetla Alert z informacją o problemie i sugeruje sprawdzenie połączenia
6. WHEN Canis integruje się z Dev Monitoring THEN ma dostęp do danych o deploymentach, commitach i paczkach
7. WHEN użytkownik zapyta o deployment THEN Canis używa danych z Dev Monitoring do odpowiedzi

### Requirement 9: Proaktywne Sugestie i Alerty

**User Story:** Jako użytkownik, chcę otrzymywać proaktywne sugestie i alerty od Canis, aby zapobiegać problemom zanim się pojawią.

#### Acceptance Criteria

1. WHEN użytkownik otwiera zadanie bez kryteriów akceptacji THEN Canis wyświetla sugestię "Wygenerować kryteria akceptacji?"
2. WHEN system wykryje niejednoznaczne wymaganie (np. "musi być szybkie") THEN wyświetla Alert z sugestią doprecyzowania
3. WHEN użytkownik pracuje nad zadaniem powiązanym z dokumentacją THEN Canis automatycznie wyświetla linki do relevantnych fragmentów
4. WHEN sprint zbliża się do końca a zadania nie są ukończone THEN Canis sugeruje akcje (np. "Przenieść do następnego sprintu?")
5. IF nowe zadanie koliduje z istniejącym THEN Canis natychmiast wyświetla ostrzeżenie
6. WHEN użytkownik zamknie alert THEN nie wyświetla się ponownie dla tego samego kontekstu

### Requirement 10: Eksport Artefaktów i Raportowanie

**User Story:** Jako użytkownik, chcę eksportować wygenerowane artefakty (stories, dane testowe, raporty) w różnych formatach, aby móc je wykorzystać w innych narzędziach.

#### Acceptance Criteria

1. WHEN użytkownik kliknie "Eksportuj" w widoku stories THEN system oferuje formaty: Markdown, JSON, CSV
2. WHEN użytkownik wybierze format THEN plik jest pobierany na urządzenie
3. WHEN użytkownik eksportuje dane testowe THEN może wybrać format: JSON, CSV, SQL
4. WHEN użytkownik eksportuje raport release'u THEN może wybrać format: PDF, Markdown, HTML
5. IF eksport zawiera dane z Syzio THEN plik zawiera metadane (data eksportu, autor, źródło)
6. WHEN użytkownik eksportuje graf zależności THEN może wybrać format: PNG, SVG, JSON (dane grafu)
