Jasne, przygotuję bardzo szczegółowy opis procesów dodawania i edycji, a także zakładek AI & Automation i opcji w Ustawieniach.

Zacznę od analizy odpowiednich komponentów formularzy oraz widoków.

[6 tools called]

Oczywiście, oto bardzo dokładny opis wybranych przez Ciebie funkcjonalności.

### 1. Zarządzanie Zadaniami (Dodawanie i Edycja)

Logika dodawania i edycji zadań jest zamknięta w jednym, reużywalnym komponencie: `IssueForm`. Działa on jako okno modalne (dialogowe).

*   **UI/UX Formularza**:
    *   **Tytuł Modala**: Zmienia się dynamicznie na "Create New Issue" (dla nowego zadania) lub "Edit Issue" (dla istniejącego).
    *   **Pola Formularza**:
        *   **Title (Tytuł)**: Pole tekstowe (`Input`), obowiązkowe. Posiada walidację - jeśli jest puste, obramowanie zmienia kolor na czerwony i pojawia się komunikat "Title is required".
        *   **Description (Opis)**: Większe pole tekstowe (`Textarea`) na szczegółowy opis zadania. Jest opcjonalne.
        *   **Priority (Priorytet)**: Lista rozwijana (`Select`) z predefiniowanymi opcjami od P0 (krytyczny) do P5 (najniższy). Domyślnie ustawiony na "P3 - Normal".
        *   **Status**: Lista rozwijana (`Select`) ze statusami: "Todo", "In Progress", "In Review", "Done". Domyślnie ustawiony na "Todo".
        *   **Assignee (Przypisany)**: Pole tekstowe (`Input`), obowiązkowe. Wymaga wpisania imienia osoby odpowiedzialnej. Również posiada walidację.
        *   **Sprint (Opcjonalnie)**: Lista rozwijana (`Select`) pozwalająca przypisać zadanie do istniejącego sprintu lub pozostawić je w Backlogu ("No Sprint").
    *   **Przyciski Akcji**:
        *   **Cancel**: Anuluje operację i zamyka okno.
        *   **Create Issue / Update Issue**: Przycisk do zatwierdzenia formularza, którego etykieta zmienia się w zależności od kontekstu.

*   **Funkcjonalność**:
    *   **Tryb Dodawania**: Gdy formularz jest wywoływany bez przekazanego istniejącego zadania, wszystkie pola są puste (lub mają wartości domyślne). Po pomyślnym dodaniu, formularz jest resetowany.
    *   **Tryb Edycji**: Gdy do komponentu `IssueForm` przekazane zostanie istniejące zadanie (`issue` prop), formularz wypełnia się automatycznie jego danymi. Zapisanie zmian aktualizuje istniejący obiekt zadania.
    *   **Walidacja**: Prosta walidacja po stronie klienta sprawdza, czy kluczowe pola (tytuł, przypisany) nie są puste przed wysłaniem danych.

### 2. Zarządzanie Sprintami (Dodawanie i Edycja)

Podobnie jak w przypadku zadań, za sprinty odpowiada komponent `SprintForm`, działający jako okno modalne.

*   **UI/UX Formularza**:
    *   **Tytuł Modala**: Dynamicznie "Create New Sprint" lub "Edit Sprint".
    *   **Pola Formularza**:
        *   **Sprint Name (Nazwa Sprintu)**: Pole tekstowe (`Input`), obowiązkowe. Posiada walidację.
        *   **Start Date (Data Rozpoczęcia)**: Pole wyboru daty (`Input type="date"`), obowiązkowe.
        *   **End Date (Data Zakończenia)**: Pole wyboru daty (`Input type="date"`), obowiązkowe.
    *   **Przyciski Akcji**: "Cancel" i "Create Sprint" / "Update Sprint".

*   **Funkcjonalność**:
    *   **Tryb Dodawania vs Edycji**: Działa na tej samej zasadzie co formularz zadań – wypełnia się danymi, jeśli otrzyma istniejący sprint (`sprint` prop).
    *   **Walidacja**: Sprawdza, czy wszystkie pola są wypełnione. Dodatkowo, weryfikuje logikę dat – **data zakończenia musi być późniejsza niż data rozpoczęcia**. Jeśli warunek nie jest spełniony, pod polem `endDate` pojawia się błąd "End date must be after start date".

### 3. Zarządzanie Zespołami (Dodawanie i Edycja)

Analiza komponentów `TeamsView` i `TeamDetailView` wskazuje, że w obecnej wersji demonstracyjnej **funkcjonalność dodawania i edycji zespołów jest zaimplementowana tylko na poziomie interfejsu**, ale logika nie jest w pełni podłączona.

*   **UI/UX (Potencjalne)**:
    *   W widoku `TeamsView` znajduje się przycisk **"Nowy zespół"**.
    *   W widoku szczegółów zespołu (`TeamDetailView`) można by oczekiwać przycisku "Edytuj zespół".
    *   Formularz do tworzenia/edycji zespołu prawdopodobnie zawierałby pola:
        *   **Team Name**: Nazwa zespołu.
        *   **Team Lead**: Wybór lidera z listy użytkowników.
        *   **Members**: Możliwość dodawania/usuwania członków.
        *   **Description**: Opcjonalny opis celów zespołu.
        *   **Color**: Wybór koloru identyfikującego zespół.

*   **Aktualna Funkcjonalność w Demo**: Dane o zespołach są ładowane z mockowego pliku (`mock-data.ts`) i aplikacja nie zawiera gotowego formularza ani logiki do ich modyfikacji. Przycisk "Nowy zespół" jest widoczny, ale jego kliknięcie nie wywołuje żadnej akcji.

### 4. AI & Automation (`AIAutomationView`)

Ten ekran to złożony moduł, który składa się z kilku podzakładek, zarządzanych przez komponent `Tabs` z `shadcn/ui`.

#### a) Zakładka `Overview` (Przegląd)
*   **Komponent**: `AutomationDashboard`
*   **Cel**: Przedstawienie ogólnego obrazu działania automatyzacji i AI.
*   **Elementy UI/UX i Funkcjonalność**:
    *   **Karty z kluczowymi metrykami (KPIs)**: Wyświetlają podsumowania, takie jak "Zaoszczędzony czas" (w godzinach), "Liczba wykonanych automatyzacji", "Najczęściej używana reguła".
    *   **Wykres Aktywności**: Wykres liniowy lub słupkowy pokazujący liczbę uruchomień automatyzacji w czasie (np. w ciągu ostatnich 30 dni).
    *   **Lista Ostatnich Wniosków AI (AI Insights)**: Skrócona lista najważniejszych sugestii wygenerowanych przez AI (np. "Wykryto potencjalne wąskie gardło w etapie 'Review'").
    *   **Status Reguł**: Szybkie podsumowanie, ile reguł jest aktywnych, a ile nieaktywnych.

#### b) Zakładka `Rules` (Reguły)
*   **Komponent**: `AutomationRulesView`
*   **Cel**: Zarządzanie wszystkimi regułami automatyzacji.
*   **Elementy UI/UX i Funkcjonalność**:
    *   **Lista Reguł**: Tabela lub lista kart, gdzie każdy wiersz/karta to jedna reguła.
    *   **Elementy Reguły na liście**: Nazwa, krótki opis, przełącznik (`Switch`) do aktywacji/deaktywacji, oraz przyciski do edycji i usunięcia.
    *   **Przycisk "Create Rule"**: Otwiera modal (`AutomationRuleModal`) do tworzenia nowej reguły w logice "When... If... Then...".

#### c) Zakładka `Insights` (Wnioski)
*   **Komponent**: `AutomationInsightsView`
*   **Cel**: Przeglądanie i zarządzanie sugestiami od AI.
*   **Elementy UI/UX i Funkcjonalność**:
    *   **Lista Sugestii**: Każda sugestia to karta z opisem problemu, potencjalnym wpływem (np. "ryzyko opóźnienia sprintu") i proponowanymi akcjami.
    *   **Kategorie Wniosków**: Sugestie mogą być kategoryzowane (np. "Wydajność", "Ryzyko", "Jakość kodu").
    *   **Akcje**: Przy każdej sugestii znajdują się przyciski, np. "Dismiss" (Odrzuć), "Create Task" (Stwórz zadanie na podstawie sugestii), "Apply fix" (jeśli AI proponuje automatyczną naprawę).

#### d) Zakładka `Logs` (Dziennik)
*   **Komponent**: `AutomationLogsView`
*   **Cel**: Audyt i debugowanie wykonanych automatyzacji.
*   **Elementy UI/UX i Funkcjonalność**:
    *   **Tabela Logów**: Chronologiczna lista wszystkich uruchomień reguł.
    *   **Kolumny w tabeli**: Nazwa reguły, która została uruchomiona, czas wykonania, status (sukces/błąd), oraz szczegóły (np. jakich zadań dotyczyła zmiana).
    *   **Filtrowanie i Wyszukiwanie**: Możliwość filtrowania logów po nazwie reguły, dacie lub statusie, co jest kluczowe przy diagnozowaniu problemów.

#### e) Zakładka `Templates` (Szablony)
*   **Komponent**: `AutomationTemplatesView`
*   **Cel**: Przeglądanie gotowych do użycia szablonów automatyzacji.
*   **Elementy UI/UX i Funkcjonalność**:
    *   **Galeria Szablonów**: Zbiór kart, gdzie każda reprezentuje gotową regułę (np. "Gdy zadanie jest tworzone, dodaj domyślną checklistę", "Co piątek przypominaj o logowaniu czasu").
    *   **Przycisk "Use Template"**: Kliknięcie przycisku kopiuje szablon do edytora reguł, gdzie użytkownik może go dostosować i zapisać jako własną regułę.

### 5. Ustawienia (`SettingsView`)

Ekran ustawień również jest podzielony na zakładki.

#### a) Zakładka `General` (Ogólne)
*   **Opcje**:
    *   **Domyślny widok startowy**: Grupa pól typu `RadioGroup` pozwalająca wybrać, co użytkownik zobaczy zaraz po wejściu do aplikacji (Dashboard, Bieżący Sprint czy Lista Zadań).
    *   **Autosave**: Przełącznik (`Switch`) włączający/wyłączający automatyczne zapisywanie zmian w formularzach.
    *   **Konfirmacja przy usuwaniu**: Przełącznik (`Switch`) decydujący, czy aplikacja ma pokazywać okno z potwierdzeniem przed usunięciem np. zadania.

#### b) Zakładka `Appearance` (Wygląd)
*   **Opcje**:
    *   **Motyw**: Przycisk z ikonami słońca/księżyca (`ThemeToggle`), który przełącza interfejs między trybem jasnym i ciemnym. Zmiana jest globalna.
    *   **Gęstość interfejsu**: Grupa pól `RadioGroup` pozwalająca ustawić domyślną gęstość widoku listy zadań ("Compact", "Comfortable", "Spacious").

#### c) Zakładka `Notifications` (Powiadomienia)
*   **Opcje**: Lista przełączników (`Switch`) do włączania/wyłączania powiadomień dla konkretnych zdarzeń, takich jak:
    *   Przypisano Ci zadanie.
    *   Ktoś dodał komentarz w Twoim zadaniu.
    *   Zmieniono priorytet zadania na krytyczny.
    *   Sprint zbliża się do końca.

#### d) Zakładka `Data` (Dane)
*   **Komponent**: `DataManager`
*   **Opcje**:
    *   **Export Data**: Przycisk, który generuje i pobiera plik `.json` zawierający wszystkie dane z aplikacji demonstracyjnej (zadania, sprinty, komentarze itp.).
    *   **Import Data**: Przycisk, który otwiera okno wyboru pliku. Użytkownik może wgrać wcześniej wyeksportowany plik `.json`, aby przywrócić stan aplikacji do zapisanego punktu.
    *   **Statystyki**: Sekcja z informacjami o danych (np. rozmiar, data ostatniego backupu).

#### e) Zakładka `Shortcuts` (Skróty)
*   **Opcje**:
    *   **Lista Skrótów**: Statyczna lista informacyjna pokazująca najważniejsze skróty klawiaturowe dostępne w aplikacji (np. `Cmd+K` dla palety komend).
    *   **Przycisk "Dostosuj skróty"**: Sugeruje możliwość personalizacji skrótów, choć w wersji demo ta funkcja może nie być w pełni zaimplementowana.
    *   **Karta z Wskazówkami**: Kilka "pro-tipów" dotyczących efektywnego korzystania z aplikacji.Jasne, kontynuuję szczegółowy opis widoku Raportów, koncentrując się na poszczególnych dashboardach i funkcjach, o które pytasz.

Na podstawie analizy struktury plików, główny widok `reports-view.tsx` prawdopodobnie działa jako kontener lub przełącznik dla różnych specjalistycznych dashboardów, które znajdują się w katalogu `components/demo/reports/`. Opiszę każdy z nich.

---

### 1. Sprint Health Dashboard (Kondycja Sprintu)

*   **Komponent**: `SprintHealthDashboard.tsx`
*   **Cel**: Zapewnienie szczegółowego wglądu w kondycję i postęp **bieżącego lub wybranego sprintu**. Jest to bardziej zaawansowana wersja widoku `CurrentSprintView`.
*   **Elementy UI/UX i Funkcjonalność**:
    *   **Selektor Sprintu**: Na górze znajduje się lista rozwijana, pozwalająca wybrać sprint do analizy (nie tylko aktywny, ale i historyczne).
    *   **Burndown Chart (Wykres Spalania)**: Kluczowy element tego dashboardu.
        *   **UI**: Wykres liniowy pokazujący dwie linie:
            1.  **Idealna linia spalania**: Prosta linia od całkowitej liczby Story Points na początku sprintu do zera na jego końcu. Pokazuje, jak praca *powinna* postępować.
            2.  **Rzeczywista linia spalania**: Linia pokazująca faktyczną liczbę pozostałych Story Points każdego dnia.
        *   **Funkcjonalność**: Pozwala na błyskawiczną ocenę, czy sprint jest na dobrej drodze (`on track`), opóźniony (`behind`), czy wyprzedza harmonogram (`ahead`). Nagłe spłaszczenie linii może sygnalizować problem lub blokadę.
    *   **Wykres Przepływu (Cumulative Flow Diagram)**:
        *   **UI**: Wykres warstwowy pokazujący, ile zadań znajdowało się w każdym statusie ("Todo", "In Progress", "In Review", "Done") w poszczególnych dniach sprintu.
        *   **Funkcjonalność**: Pomaga zidentyfikować "wąskie gardła". Jeśli np. warstwa "In Review" stale rośnie, oznacza to, że proces przeglądu jest niewydolny i blokuje postęp.
    *   **Zadania Dodane vs Ukończone**: Wykres słupkowy porównujący liczbę zadań dodanych do sprintu po jego rozpoczęciu (tzw. `scope creep`) z liczbą zadań ukończonych. Pomaga to ocenić stabilność planowania.
    *   **Lista Zadań Krytycznych**: Wyizolowana lista zadań, które są blokerami, mają najwyższy priorytet (P0) lub są znacząco opóźnione.

---

### 2. Team Performance Dashboard (Wydajność Zespołu)

*   **Komponent**: `TeamPerformanceDashboard.tsx`
*   **Cel**: Analiza i porównanie wydajności poszczególnych zespołów oraz ich członków.
*   **Elementy UI/UX i Funkcjonalność**:
    *   **Filtry**: Możliwość filtrowania danych po zespole, członku zespołu i zakresie czasowym.
    *   **Wykres Rozkładu Pracy (Workload Distribution)**:
        *   **UI**: Wykres kołowy lub słupkowy pokazujący, jak zadania lub Story Points są rozdzielone pomiędzy członków zespołu.
        *   **Funkcjonalność**: Umożliwia identyfikację osób przeciążonych lub tych, które mają zbyt mało pracy.
    *   **Średnia Completion Rate (Średni Wskaźnik Ukończenia)**:
        *   **UI**: Może być przedstawiony jako duża liczba procentowa na karcie KPI lub jako kolumna w tabeli porównującej zespoły.
        *   **Funkcjonalność**: Jest to metryka, którą wymieniłeś. Oblicza się ją jako `(liczba ukończonych zadań / całkowita liczba przypisanych zadań) * 100%`. Pokazuje, jak skuteczny jest zespół (lub osoba) w finalizowaniu powierzonej pracy w danym okresie.
    *   **Cycle Time / Lead Time**:
        *   **UI**: Wykresy pokazujące średni czas, jaki upływa od momentu rozpoczęcia pracy nad zadaniem do jego ukończenia (`Cycle Time`).
        *   **Funkcjonalność**: Pomaga w ocenie efektywności procesu. Długi czas cyklu może wskazywać na problemy, przestoje lub częste zmiany kontekstu.
    *   **Tabela Porównawcza Członków**: Tabela, w której wiersze to członkowie zespołu, a kolumny to metryki takie jak: "Liczba ukończonych zadań", "Suma Story Points", "Średni czas ukończenia zadania".

---

### 3. Project Overview Dashboard (Ogólny Przegląd Projektu)

*   **Komponent**: `ProjectOverviewDashboard.tsx`
*   **Cel**: Prezentacja "widoku z lotu ptaka" na cały projekt, agregując dane ze wszystkich zespołów i sprintów.
*   **Elementy UI/UX i Funkcjonalność**:
    *   **Główne Wskaźniki Projektu (KPIs)**: Duże, czytelne karty z najważniejszymi danymi:
        *   **Aktywni członkowie**: To metryka, o którą pytałeś. Karta pokazywałaby np. **"23 z 25"**, informując, ilu członków zespołu jest obecnie aktywnych (np. zalogowanych, z przypisanymi zadaniami) w stosunku do wszystkich członków w projekcie.
        *   **Project Health**: Ogólny wskaźnik "zdrowia" projektu (np. w formie ikony: zielony, żółty, czerwony) bazujący na postępie, budżecie i terminach.
        *   **Całkowity Postęp**: Procentowy postęp w kierunku ukończenia całego projektu lub kamienia milowego.
    *   **Roadmapa / Oś Czasu (Timeline)**: Wizualna reprezentacja głównych faz projektu, kamieni milowych i ich statusu.
    *   **Podział Zadań wg Typu/Statusu**: Wykresy kołowe pokazujące, ile w całym projekcie jest zadań typu "Bug", "Feature", "Task" oraz ile zadań znajduje się w poszczególnych statusach.
    *   **Budżet i Zasoby**: (Jeśli aplikacja by to wspierała) Wykresy pokazujące wykorzystanie budżetu lub alokację zasobów.

---

### 4. Velocity Trends Dashboard (Trendy "Velocity")

*   **Komponent**: `VelocityTrendsDashboard.tsx`
*   **Cel**: Śledzenie i analiza "velocity" zespołu, czyli miary ilości pracy (zazwyczaj w Story Points), jaką zespół jest w stanie wykonać w trakcie jednego sprintu.
*   **Elementy UI/UX i Funkcjonalność**:
    *   **Velocity Chart**:
        *   **UI**: Wykres słupkowy, gdzie każdy słupek reprezentuje jeden zakończony sprint. Wysokość słupka odpowiada liczbie Story Points dostarczonych w tym sprincie. Często na wykresie znajduje się też linia pokazująca średnią `velocity` z ostatnich kilku sprintów.
        *   **Funkcjonalność**: Jest to kluczowe narzędzie do planowania. Stabilne `velocity` pozwala z dużą dozą prawdopodobieństwa przewidzieć, ile pracy zespół może wziąć na siebie w kolejnym sprincie. Nagłe spadki lub wzrosty wymagają analizy.
    *   **Tabela Porównawcza Sprintów**: Szczegółowa tabela, gdzie każdy wiersz to sprint, a kolumny to "Zaplanowane SP", "Dostarczone SP", "Różnica (%)".

---

### 5. Time Tracking Dashboard (Śledzenie Czasu)

*   **Komponent**: `TimeTrackingDashboard.tsx`
*   **Cel**: Agregacja i analiza danych z logowania czasu pracy.
*   **Elementy UI/UX i Funkcjonalność**:
    *   **Filtry**: Możliwość filtrowania po projekcie, zespole, osobie, typie zadania i okresie.
    *   **Podsumowanie Czasu**: Karty pokazujące łączną liczbę zalogowanych godzin w wybranym okresie.
    *   **Wykres Czasu wg Projektu/Zadania**: Wykres kołowy lub słupkowy pokazujący, na co poświęcono najwięcej czasu.
    *   **Szczegółowy Timesheet**: Tabela z listą wszystkich wpisów czasu pracy, zawierająca informacje o tym, kto, kiedy i do jakiego zadania zalogował czas.

---

### 6. Export (Eksport Raportów)

*   **Komponent**: `ExportReports.tsx`
*   **Cel**: Umożliwienie użytkownikowi pobrania danych z raportów do dalszej analizy w zewnętrznych narzędziach.
*   **Elementy UI/UX i Funkcjonalność**:
    *   **Interfejs Eksportu**: Zazwyczaj jest to osobny modal lub sekcja na każdym dashboardzie.
    *   **Opcje Eksportu**:
        *   **Format**: Użytkownik może wybrać format pliku, np. **PDF** (dla wizualnej prezentacji), **CSV** lub **Excel** (dla danych surowych do analizy w arkuszach kalkulacyjnych).
        *   **Zakres Danych**: Możliwość wyboru, czy eksportować tylko dane z aktualnego widoku (wykresu), czy pełny zestaw danych z dashboardu.
    *   **Przycisk "Export"**: Inicjuje proces generowania i pobierania pliku.### 1. Okno: "Nowy Task" / "Nowy Issue" To okno służy do tworzenia nowego zadania w systemie. Jest to kluczowy i najczęściej używany formularz. * **Komponent**: IssueForm.tsx * **Wygląd i Interfejs (UI)**: * Pojawia się jako wyśrodkowane okno modalne (Dialog) nad resztą aplikacji, która staje się wyszarzona. * **Tytuł**: "Create New Issue" (Stwórz Nowe Zadanie). * **Pola formularza**: * **Title (Tytuł)**: Duże, wyraźne pole tekstowe (Input) na samej górze. Jest oznaczone jako pole wymagane. * **Description (Opis)**: Większe, wieloliniowe pole tekstowe (Textarea) przeznaczone na szczegóły zadania, kroki do odtworzenia błędu, kryteria akceptacji itp. * **Priority (Priorytet)**: Lista rozwijana (Select) z opcjami od "P0 - Critical" do "P5 - Lowest". Umożliwia szybkie określenie wagi zadania. * **Status**: Lista rozwijana (Select) pozwalająca ustawić początkowy stan zadania (zazwyczaj domyślnie "Todo"). * **Assignee (Osoba Przypisana)**: Pole tekstowe (Input), w które wpisuje się imię i nazwisko osoby odpowiedzialnej za zadanie. Jest to pole wymagane. * **Sprint**: Lista rozwijana (Select), która pozwala od razu przypisać zadanie do konkretnego, istniejącego sprintu lub pozostawić je w "Backlogu" (opcja "No Sprint"). * **Funkcjonalność i Logika (UX)**: * **Walidacja w Czasie Rzeczywistym**: Po próbie wysłania pustego formularza, pola Title i Assignee zostają podświetlone na czerwono i pojawiają się pod nimi komunikaty o błędach, informując użytkownika, co musi poprawić. * **Logika Przycisków**: * **"Cancel"**: Zamyka okno bez zapisywania jakichkolwiek zmian. * **"Create Issue"**: Przycisk ten jest aktywny. Po kliknięciu najpierw uruchamia walidację. Jeśli wszystko jest w porządku, wysyła dane, tworzy nowe zadanie, a następnie automatycznie zamyka okno i czyści formularz, przygotowując go do ewentualnego ponownego użycia. --- ### 2. Okno: "Nowy Sprint" To okno służy do definiowania nowego cyklu pracy (sprintu). * **Komponent**: SprintForm.tsx * **Wygląd i Interfejs (UI)**: * Również pojawia się jako wyśrodkowany modal. Jest zazwyczaj węższy niż formularz zadania, ponieważ zawiera mniej pól. * **Tytuł**: "Create New Sprint" (Stwórz Nowy Sprint). * **Pola formularza**: * **Sprint Name (Nazwa Sprintu)**: Pole tekstowe (Input) na nazwę, np. "Q4-Week1-Frontend" lub "Sprint #12". Jest to pole wymagane. * **Start Date (Data Rozpoczęcia)**: Pole z kalendarzem (Input type="date") do wybrania daty, od której sprint ma się rozpocząć. Wymagane. * **End Date (Data Zakończenia)**: Pole z kalendarzem do wybrania daty końca sprintu. Wymagane. * **Funkcjonalność i Logika (UX)**: * **Walidacja Dat**: Oprócz sprawdzania, czy wszystkie pola są wypełnione, formularz posiada kluczową walidację logiczną: **data zakończenia musi być późniejsza niż data rozpoczęcia**. Jeśli użytkownik wybierze nieprawidłowy zakres dat, pod polem "End Date" pojawi się komunikat błędu, uniemożliwiając utworzenie sprintu. * **Logika Przycisków**: * **"Cancel"**: Anuluje tworzenie sprintu. * **"Create Sprint"**: Po pomyślnej walidacji tworzy nowy, "Planowany" sprint i zamyka okno. --- ### 3. Okno: "Nowy Zespół" **Uwaga**: W analizowanym kodzie aplikacji demonstracyjnej przycisk "Nowy zespół" jest widoczny w interfejsie (TeamsView), ale **nie ma pod niego podłączonego żadnego okna ani formularza**. Poniższy opis jest więc **hipotetyczny** i bazuje na typowych rozwiązaniach w tego typu aplikacjach oraz na strukturze danych widocznej w kodzie. * **Komponent**: (Brak, opis hipotetyczny) * **Wygląd i Interfejs (UI)**: * Prawdopodobnie byłoby to kolejne okno modalne. * **Tytuł**: "Create New Team" (Stwórz Nowy Zespół). * **Pola formularza (przewidywane)**: * **Team Name (Nazwa Zespołu)**: Pole tekstowe, wymagane. * **Team Lead (Lider Zespołu)**: Lista rozwijana (Select) lub pole z autouzupełnianiem do wybrania lidera spośród wszystkich użytkowników systemu. * **Members (Członkowie)**: Pole typu "multi-select" lub interfejs z wyszukiwarką, pozwalający na dodanie wielu użytkowników do zespołu. * **Description (Opis)**: Opcjonalne, wieloliniowe pole tekstowe na opisanie celów i zakresu odpowiedzialności zespołu. * **Team Color (Kolor Zespołu)**: Paleta kolorów do wybrania barwy, która będzie wizualnie identyfikować zespół w różnych miejscach aplikacji (np. na wykresach, przy etykietach). * **Funkcjonalność i Logika (UX)**: * **Walidacja**: Formularz sprawdzałby przynajmniej, czy nazwa zespołu została podana. * **Interaktywność**: Pole do dodawania członków pozwalałoby na dynamiczne wyszukiwanie i dodawanie/usuwanie osób z listy. * **Logika Przycisków**: Standardowo "Cancel" i "Create Team". Po utworzeniu, nowy zespół pojawiłby się jako kolejna karta w widoku TeamsView. Doskonałe pytanie. Na podstawie dotychczasowej analizy i standardów dla tego typu aplikacji, można wskazać kilka kluczowych obszarów, w których brakuje funkcjonalności lub które są zaimplementowane w sposób szczątkowy (tylko na poziomie interfejsu, bez pełnej logiki). Oto lista brakujących elementów i funkcji, które zazwyczaj dodaje się w tego typu aplikacjach: ### 1. Uzupełnienie Istniejących, ale Niepełnych Funkcji Te elementy są już w jakiś sposób obecne w UI, ale brakuje im pełnej funkcjonalności do zarządzania. * **Pełne Zarządzanie Zespołami (Teams)**: * **Co jest**: Widok listy zespołów i ich szczegółów. * **Czego brakuje**: * **Formularza Tworzenia/Edycji Zespołu**: Jak wspomniałem, przycisk "Nowy zespół" istnieje, ale nie ma za nim żadnej akcji. Brakuje okna modalnego do definiowania nazwy zespołu, wybierania lidera i dodawania członków. * **Zarządzania Członkami**: Interfejsu do dodawania lub usuwania użytkowników z istniejącego zespołu. * **Definiowania Lidera Zespołu**: Możliwości oznaczenia jednej osoby jako "Team Lead". * **Zarządzanie Użytkownikami (Users)**: * **Co jest**: Aplikacja korzysta z mockowych danych użytkowników (mock-data.ts) i hardkodowanego CurrentUser. * **Czego brakuje**: * **Systemu Uwierzytelniania**: Ekranu logowania, rejestracji, resetowania hasła. * **Panelu Zarządzania Użytkownikami**: Miejsca, gdzie administrator mógłby zapraszać nowych użytkowników, dezaktywować konta lub edytować ich dane. * **Strony Profilowej**: Każdy użytkownik powinien mieć własną stronę profilową, gdzie może zmienić swoje dane, awatar, hasło itp. * **Zarządzanie Zależnościami Między Zadaniami (Dependencies)**: * **Co jest**: W kodzie pojawiają się wzmianki o zadaniach "zablokowanych", co sugeruje istnienie zależności. * **Czego brakuje**: * **Interfejsu do Definiowania Zależności**: W widoku szczegółów zadania (IssueDetailView) brakuje sekcji, w której użytkownik mógłby zdefiniować relacje, np. "To zadanie **blokuje** inne zadanie" lub "To zadanie **jest blokowane przez** inne zadanie". ### 2. Kluczowe Funkcjonalności Biznesowe To są zupełnie nowe, duże moduły, które są standardem w dojrzałych narzędziach do zarządzania projektami. * **Role i Uprawnienia (RBAC - Role-Based Access Control)**: * **Czego brakuje**: Całego systemu, który określałby, co dany użytkownik może robić w aplikacji. Obecnie każdy może wszystko. Wdrożenie tego obejmowałoby: * **Definiowanie Ról**: Np. Administrator (pełny dostęp), Członek Zespołu (może tworzyć i edytować zadania), Gość/Klient (może tylko przeglądać i komentować). * **Przypisywanie Ról do Użytkowników**. * **Logika w całej aplikacji**, która sprawdza uprawnienia przed wykonaniem akcji (np. czy użytkownik może usunąć zadanie). * **Zarządzanie Projektami (Projects)**: * **Czego brakuje**: Aplikacja działa w kontekście jednego, nienazwanego projektu. Brakuje: * **Możliwości tworzenia wielu projektów**: Każdy z własnym zestawem zadań, sprintów i zespołów. * **Przełącznika Projektów**: Globalnego elementu UI (np. w nagłówku lub sidebarze), który pozwalałby na łatwe przełączanie się między projektami. * **Ustawień na poziomie projektu**: Każdy projekt mógłby mieć własne unikalne ustawienia (np. statusy zadań, niestandardowe pola). * **Niestandardowe Pola (Custom Fields)**: * **Czego brakuje**: Możliwości dodawania własnych pól do zadań. Poza standardowymi (tytuł, opis, priorytet), użytkownicy często potrzebują pól specyficznych dla ich biznesu, np. "Numer faktury", "ID klienta", "Wersja oprogramowania". ### 3. Usprawnienia dla Zaawansowanych Użytkowników (Power-User Features) * **Zaawansowany Język Wyszukiwania (np. JQL)**: * **Co jest**: Prosty SearchBar z filtrami. * **Czego brakuje**: Możliwości wpisywania złożonych zapytań tekstowych, np. status = "In Progress" AND assignee = "Jan Kowalski" ORDER BY priority DESC. * **Widok typu Roadmapa / Gantt Chart**: * **Czego brakuje**: Wizualnego przedstawienia planu projektu w czasie. Widok ten pokazywałby zadania, sprinty i kamienie milowe na osi czasu, wraz z ich zależnościami. Jest to kluczowe dla planowania długoterminowego. * **Globalne Centrum Powiadomień**: * **Co jest**: Ustawienia powiadomień. * **Czego brakuje**: Rzeczywistego miejsca w interfejsie (np. ikony dzwonka w nagłówku), gdzie zbierałyby się wszystkie powiadomienia dla użytkownika (np. "@-wzmianki", przypisania zadań, zmiany statusu). ### 4. Drobne, ale Ważne Elementy UX * **Edytor Tekstu Sformatowanego (Rich Text Editor)**: * **Co jest**: Zwykłe pola <textarea> dla opisów i komentarzy. * **Czego brakuje**: Edytora WYSIWYG lub opartego na Markdown, który pozwalałby na formatowanie tekstu (nagłówki, listy, pogrubienie), wstawianie obrazków i bloków kodu. * **Wzmianki Użytkowników (@-mentions)**: * **Czego brakuje**: W polach komentarzy i opisów brakuje możliwości wpisania @nazwa_uzytkownika, aby go oznaczyć i wysłać mu powiadomienie. Jest to absolutny standard we współczesnych narzędziach do współpracy.