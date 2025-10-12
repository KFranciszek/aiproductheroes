# Requirements Document - Demo 6 Canis UI Redesign

## Introduction

Ten dokument opisuje wymagania dla redesignu interfejsu użytkownika Demo 6 (Syzio Canis) na podstawie nowych makiet HTML. Celem jest aktualizacja istniejącego UI do nowego systemu designu, który jest bardziej spójny, nowoczesny i zgodny z najnowszymi standardami Syzio.

Nowy design wprowadza:
- Odświeżoną paletę kolorów z lepszym kontrastem
- Ulepszoną typografię z wykorzystaniem Inter
- Bardziej spójne komponenty UI
- Lepszą responsywność
- Material Icons zamiast Lucide
- Ujednolicony system spacingu i borderów

## Requirements

### Requirement 1: Aktualizacja Systemu Kolorów

**User Story:** Jako użytkownik, chcę aby interfejs używał nowej palety kolorów, aby zapewnić lepszy kontrast i spójność wizualną.

#### Acceptance Criteria

1. WHEN aplikacja jest wyświetlana THEN używa nowych zmiennych kolorów CSS zgodnych z makietami
2. WHEN tryb ciemny jest aktywny THEN kolory tła to `#111827` (background-dark) i `#1F2937` (surface-dark)
3. WHEN tryb jasny jest aktywny THEN kolory tła to `#FFFFFF` (background-light) i `#F9FAFB` (surface-light)
4. WHEN elementy interaktywne są wyświetlane THEN używają koloru primary `#4F46E5` (indigo)
5. WHEN granice są renderowane THEN używają `#E5E7EB` (light) lub `#374151` (dark)
6. WHEN tekst jest wyświetlany THEN używa `#1F2937` (light) lub `#F9FAFB` (dark) dla głównego tekstu
7. WHEN tekst pomocniczy jest wyświetlany THEN używa `#6B7280` (light) lub `#9CA3AF` (dark)

### Requirement 2: Aktualizacja Typografii

**User Story:** Jako użytkownik, chcę aby interfejs używał czcionki Inter, aby zapewnić lepszą czytelność i nowoczesny wygląd.

#### Acceptance Criteria

1. WHEN aplikacja się ładuje THEN importuje czcionkę Inter z Google Fonts
2. WHEN tekst jest renderowany THEN używa czcionki Inter jako domyślnej
3. WHEN nagłówki są wyświetlane THEN używają wag 600 lub 700
4. WHEN tekst podstawowy jest wyświetlany THEN używa wagi 400 lub 500
5. WHEN kod jest wyświetlany THEN używa czcionki monospace

### Requirement 3: Aktualizacja Header/TopBar

**User Story:** Jako użytkownik, chcę aby górny pasek nawigacyjny był bardziej przejrzysty i funkcjonalny.

#### Acceptance Criteria

1. WHEN header jest wyświetlany THEN zawiera logo z ikoną `auto_awesome` i tekstem "Syzio — Canis"
2. WHEN header jest wyświetlany THEN pokazuje selektor projektu w formacie "ACME / SHOP"
3. WHEN header jest wyświetlany THEN zawiera przyciski pomocy i ustawień po prawej stronie
4. WHEN header jest wyświetlany THEN ma border-bottom z kolorem border
5. WHEN header jest wyświetlany THEN używa padding `p-4`
6. IF wyszukiwarka jest dostępna THEN wyświetla pole z placeholderem "⌘K Szukaj..."

### Requirement 4: Aktualizacja Nawigacji Zakładek

**User Story:** Jako użytkownik, chcę aby nawigacja między zakładkami była bardziej wyraźna i intuicyjna.

#### Acceptance Criteria

1. WHEN zakładki są wyświetlane THEN używają border-bottom dla całej sekcji
2. WHEN zakładka jest aktywna THEN ma border-bottom-2 w kolorze primary
3. WHEN zakładka jest aktywna THEN tekst jest w kolorze primary i font-semibold
4. WHEN zakładka jest nieaktywna THEN tekst jest w kolorze text-secondary
5. WHEN użytkownik najedzie na nieaktywną zakładkę THEN tekst zmienia kolor na text-primary
6. WHEN zakładki są wyświetlane THEN mają padding-bottom `pb-3`

### Requirement 5: Redesign Widoku Chat

**User Story:** Jako użytkownik, chcę aby widok czatu był bardziej przejrzysty z lepszym układem kolumn.

#### Acceptance Criteria

1. WHEN widok Chat jest otwarty THEN wyświetla 3 kolumny: Wątki (25%), Chat (50%), Źródła (25%)
2. WHEN lista wątków jest wyświetlana THEN każdy wątek ma rounded-md i hover:bg-gray-100/dark:hover:bg-gray-800
3. WHEN aktywny wątek jest wyświetlany THEN ma bg-primary-light/dark:bg-primary-dark
4. WHEN wiadomość AI jest wyświetlana THEN zawiera ikonę `auto_awesome` w kolorze primary
5. WHEN cytowania są wyświetlane THEN są jako badges w kolorze primary-light/dark:primary-dark
6. WHEN panel źródeł jest wyświetlany THEN pokazuje fragmenty dokumentów w kartach z border
7. WHEN banner z wskazówką jest wyświetlany THEN zawiera ikonę `lightbulb` i przycisk "Prześlij dokument"

### Requirement 6: Redesign Widoku Stories Generator

**User Story:** Jako użytkownik, chcę aby generator stories miał lepszy układ z wyraźnym podziałem na formularz i wyniki.

#### Acceptance Criteria

1. WHEN widok Stories jest otwarty THEN wyświetla 2 kolumny: Formularz (33%), Wyniki (67%)
2. WHEN formularz jest wyświetlany THEN zawiera pola: Persona, Cel, Źródła, NFR
3. WHEN przycisk generowania jest wyświetlany THEN ma ikonę `auto_awesome` i tekst "Generuj Story"
4. WHEN stories są wygenerowane THEN wyświetlają się jako karty w grid 2-kolumnowym
5. WHEN story card jest wyświetlana THEN zawiera tytuł, user story, kryteria akceptacji w formacie Gherkin
6. WHEN kryteria Gherkin są wyświetlane THEN słowa kluczowe (Given/When/Then) są w kolorze fioletowym (#D946EF)
7. WHEN konflikt jest wykryty THEN karta ma border-2 w kolorze warning (#F59E0B) i badge "Konflikt"
8. WHEN konflikt jest wyświetlany THEN pokazuje szczegóły w sekcji z bg-warning/10

### Requirement 7: Redesign Widoku Test Data Generator

**User Story:** Jako użytkownik, chcę aby generator danych testowych miał lepszy układ z edytorem reguł i podglądem.

#### Acceptance Criteria

1. WHEN widok Test Data jest otwarty THEN wyświetla 2 kolumny: Konfiguracja (33%), Podgląd (67%)
2. WHEN kolumna konfiguracji jest wyświetlana THEN zawiera: Schema selector, Liczba rekordów, Edytor reguł, Edge Cases
3. WHEN edytor reguł jest wyświetlany THEN pokazuje YAML z numerami linii i syntax highlighting
4. WHEN edge cases są wyświetlane THEN są jako checkboxy z opisami
5. WHEN podgląd danych jest wyświetlany THEN pokazuje tabelę z pierwszymi 5 rekordami
6. WHEN tabela jest wyświetlana THEN ma sticky header z bg-gray-50/dark:bg-gray-800
7. WHEN przyciski eksportu są wyświetlane THEN zawierają dropdown z opcjami formatu

### Requirement 8: Redesign Widoku Verify

**User Story:** Jako użytkownik, chcę aby widok weryfikacji miał lepszą wizualizację findings i trace matrix.

#### Acceptance Criteria

1. WHEN widok Verify jest otwarty THEN wyświetla tabelę findings i trace matrix
2. WHEN findings są wyświetlane THEN tabela ma kolumny: Typ, Ważność, Opis, Źródło, Akcja
3. WHEN severity badge jest wyświetlany THEN używa kolorów: High (czerwony), Medium (żółty), Low (szary)
4. WHEN trace matrix jest wyświetlana THEN pokazuje 3 kolumny: Dokumenty, Stories, Releasy
5. WHEN elementy w trace matrix są aktywne THEN mają bg-primary-light/dark:bg-primary-dark
6. WHEN przycisk "Create Task" jest wyświetlany THEN ma ikonę `add_task`

### Requirement 9: Redesign Widoku Release Q&A

**User Story:** Jako użytkownik, chcę aby widok Release Q&A był bardziej przejrzysty z lepszym układem pytań i odpowiedzi.

#### Acceptance Criteria

1. WHEN widok Release Q&A jest otwarty THEN wyświetla selektor wersji i obszar Q&A
2. WHEN quick questions są wyświetlane THEN są jako badges z możliwością kliknięcia
3. WHEN aktywne pytanie jest wyświetlane THEN badge ma bg-primary-light/dark:bg-primary-dark
4. WHEN odpowiedź AI jest wyświetlana THEN zawiera ikonę `auto_awesome` i sformatowany tekst
5. WHEN źródła są wyświetlane THEN pokazują badges z nazwami (PM, DevMon, Docs)
6. WHEN linki do zewnętrznych systemów są wyświetlane THEN mają ikonę `launch`

### Requirement 10: Redesign Widoku Settings

**User Story:** Jako użytkownik, chcę aby widok ustawień był bardziej zorganizowany z wyraźnymi sekcjami.

#### Acceptance Criteria

1. WHEN widok Settings jest otwarty THEN wyświetla sekcje: Connectors, Reguły i słownik, Strefa niebezpieczna
2. WHEN connectors są wyświetlane THEN każdy ma ikonę, nazwę, opis i toggle switch
3. WHEN status połączenia jest wyświetlany THEN używa ikony `check_circle` i koloru success dla połączonych
4. WHEN toggle switch jest wyświetlany THEN używa custom CSS z animacją
5. WHEN reguły NFR są wyświetlane THEN pokazują kod w bloku z bg-background-dark
6. WHEN strefa niebezpieczna jest wyświetlana THEN ma border w kolorze danger (czerwony)
7. WHEN przełącznik motywu jest wyświetlany THEN pokazuje 3 opcje: light_mode, dark_mode, bedtime

### Requirement 11: Aktualizacja Komponentów UI

**User Story:** Jako użytkownik, chcę aby wszystkie komponenty UI były spójne z nowym systemem designu.

#### Acceptance Criteria

1. WHEN karty są wyświetlane THEN używają rounded-lg i border z kolorem border
2. WHEN przyciski są wyświetlane THEN używają rounded-md i odpowiednich kolorów
3. WHEN inputy są wyświetlane THEN mają border, rounded-md i focus:ring-primary
4. WHEN badges są wyświetlane THEN używają rounded-md i odpowiednich kolorów tła
5. WHEN ikony są wyświetlane THEN używają Material Icons zamiast Lucide
6. WHEN spacing jest stosowany THEN używa wartości: space-x-2, space-x-4, space-y-4, space-y-6
7. WHEN padding jest stosowany THEN używa wartości: p-3, p-4, p-6

### Requirement 12: Responsywność

**User Story:** Jako użytkownik, chcę aby interfejs był w pełni responsywny na wszystkich urządzeniach.

#### Acceptance Criteria

1. WHEN aplikacja jest wyświetlana na mobile THEN kolumny układają się wertykalnie
2. WHEN aplikacja jest wyświetlana na tablet THEN używa 2-kolumnowego układu gdzie to możliwe
3. WHEN aplikacja jest wyświetlana na desktop THEN używa pełnego 3-kolumnowego układu
4. WHEN nawigacja jest wyświetlana na mobile THEN zakładki są scrollowalne
5. WHEN tabele są wyświetlane na mobile THEN mają horizontal scroll

### Requirement 13: Animacje i Interakcje

**User Story:** Jako użytkownik, chcę aby interfejs miał subtelne animacje zwiększające UX.

#### Acceptance Criteria

1. WHEN użytkownik najedzie na przycisk THEN zmienia kolor z animacją transition
2. WHEN użytkownik najedzie na kartę THEN pojawia się subtelny cień
3. WHEN nowa zawartość się ładuje THEN pojawia się z animacją fade-in
4. WHEN modal się otwiera THEN pojawia się z animacją slide-in
5. WHEN toast jest wyświetlany THEN pojawia się z animacją slide-in z prawej strony

### Requirement 14: Dostępność

**User Story:** Jako użytkownik korzystający z technologii asystujących, chcę aby interfejs był w pełni dostępny.

#### Acceptance Criteria

1. WHEN ikony są używane bez tekstu THEN mają aria-label
2. WHEN formularze są wyświetlane THEN wszystkie pola mają powiązane labele
3. WHEN interaktywne elementy są wyświetlane THEN są dostępne przez klawiaturę
4. WHEN focus jest na elemencie THEN jest wyraźnie widoczny
5. WHEN kontrast kolorów jest sprawdzany THEN spełnia WCAG AA (4.5:1)

### Requirement 15: Migracja z Lucide na Material Icons

**User Story:** Jako developer, chcę aby wszystkie ikony używały Material Icons dla spójności z makietami.

#### Acceptance Criteria

1. WHEN ikony są importowane THEN używają Material Icons zamiast Lucide
2. WHEN ikony są renderowane THEN używają klasy `material-icons`
3. WHEN rozmiar ikon jest ustawiany THEN używają klas `text-base`, `text-sm`, `text-lg`
4. WHEN mapowanie ikon jest wykonywane THEN wszystkie ikony Lucide mają odpowiedniki Material Icons
5. IF ikona nie ma odpowiednika THEN używa najbliższego wizualnie Material Icon

### Requirement 16: Aktualizacja Tailwind Config

**User Story:** Jako developer, chcę aby konfiguracja Tailwind była zgodna z nowym systemem designu.

#### Acceptance Criteria

1. WHEN tailwind.config.js jest aktualizowany THEN zawiera nowe zmienne kolorów
2. WHEN darkMode jest konfigurowany THEN używa strategii "class"
3. WHEN extend.colors jest definiowany THEN zawiera wszystkie kolory z makiet
4. WHEN extend.fontFamily jest definiowany THEN zawiera Inter jako sans
5. WHEN extend.borderRadius jest definiowany THEN DEFAULT to '0.5rem'
