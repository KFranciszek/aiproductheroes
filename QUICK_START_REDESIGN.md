# 🚀 TaskFlow 2.0 - Quick Start Guide

## 5-Minutowy Przewodnik po Nowym Designie

---

## 🎯 Pierwsze Kroki

### 1. Uruchom aplikację
```bash
npm run dev
```

### 2. Otwórz w przeglądarce
```
http://localhost:3000
```

---

## ⚡ Nowe Funkcje - Jak Używać?

### 📱 Sidebar Navigation (NOWE!)
**Nawigacja z boku, nie z góry**

**Funkcje:**
- 📍 Wszystkie widoki w jednym miejscu
- 🔢 Badge z liczbą zadań (Issues, Favorites)
- 🎯 Aktywny widok wyróżniony
- ⬅️ Zwijalny sidebar (kliknij strzałkę)
- 💾 Stan zapisywany w localStorage

**Pro tip:** Kliknij strzałkę aby zwinąć do ikon i mieć więcej miejsca!

---

### 🔍 Command Palette (MUST TRY!)
**Najważniejsza nowa funkcja!**

1. Wciśnij `Cmd+K` (Mac) lub `Ctrl+K` (Windows)
2. Wpisz cokolwiek:
   - `TSK-123` → Otwiera zadanie
   - `sprinty` → Idzie do sprintów
   - `moje` → Filtruje Twoje zadania
3. Enter i gotowe!

**Pro tip:** To 10x szybsze niż klikanie!

---

### 🏠 Personal Dashboard
**Twoja nowa strona startowa**

Zobaczysz:
- ⚡ Pilne zadania (czerwone = P0/P1)
- 📋 Twoje zadania (Todo/In Progress/Review)
- 🎯 Postęp sprintu
- 📊 Szybkie akcje (4 przyciski)

**Kliknij** dowolne zadanie → Otwiera Split View!

---

### 📊 Density Control
**Dostosuj widok do siebie**

1. Idź do **Issues**
2. Zobacz 3 przyciski: **Compact / Comfortable / Spacious**
3. Wybierz:
   - **Compact** = Więcej zadań (50+)
   - **Comfortable** = Standardowy (domyślny)
   - **Spacious** = Karty z opisami

**Twoja preferencja zostanie zapisana!**

---

### 📱 Split View
**Zachowaj kontekst listy**

1. W **Issues** lub **Current Sprint**
2. Kliknij dowolne zadanie
3. Panel wysunie się z boku (60/40)
4. Lista pozostanie po lewej!
5. Zamknij przyciskiem "←" lub kliknij poza

**Nie tracisz już kontekstu!**

---

### 🎨 Calm Colors
**Spokojniejsze kolory**

**Zauważ:**
- Tylko **P0/P1** są kolorowe (🔴 czerwony, 🟠 pomarańczowy)
- **P2-P5** są szare (neutralne)
- Oko naturalnie idzie do **prawdziwych priorytetów**!

**Mniej kolorowego chaosu = Mniejsze zmęczenie**

---

### 🎯 WIP Limits (Kanban)
**Zapobiegaj przeciążeniu**

1. Idź do **Current Sprint**
2. Zobacz kolumny Kanban
3. Zauważ badge przy każdej kolumnie:
   - 🟢 `3/5` = OK
   - 🔴 `⚠️ 8/5` = Przekroczenie!

**To przypomina o skupieniu się na dokończeniu zadań!**

---

### 💡 AI Insights
**Inteligentne sugestie**

W **Current Sprint** zobaczysz kartę "💡 AI Insights" gdy:
- ⚠️ Są zablokowane zadania
- 🕐 Ryzyko niedokończenia sprintu
- 📈 Dobry postęp (pozytywny feedback!)

**AI pomaga Ci podejmować lepsze decyzje!**

---

### 📜 Enhanced Activity
**Przeglądaj historię**

1. Idź do **Activity**
2. Zobacz **3 statystyki** (7 dni)
3. Użyj **filtrów**:
   - Okres (24h/7dni/30dni)
   - Typ akcji
   - Użytkownik
4. Kliknij "Wyczyść filtry" aby zresetować

---

### ⚙️ Enhanced Settings
**Pełna personalizacja**

1. Idź do **Settings**
2. Zobacz **5 zakładek**:
   - **Ogólne** - Domyślny widok, autosave
   - **Wygląd** - Motyw, kolor, gęstość
   - **Powiadomienia** - 4 typy notyfikacji
   - **Dane** - Export/Import
   - **Skróty** - Lista wszystkich skrótów
3. Dostosuj do siebie!

---

## 🎮 Skróty Klawiaturowe

| Skrót | Akcja |
|-------|-------|
| `Cmd/Ctrl + K` | **Command Palette** 🔥 |
| `Ctrl + N` | Nowe zadanie |
| `Ctrl + S` | Przejdź do sprintów |
| `Ctrl + R` | Przejdź do raportów |
| `Alt + 1` | Dashboard |
| `Alt + 2` | Issues |
| `Alt + 3` | Favorites |
| `?` | Pokaż wszystkie skróty |

---

## 💡 Pro Tips

### 1. Użyj Cmd+K do wszystkiego
Zamiast klikać, **Cmd+K** i wpisz co chcesz. To game-changer!

### 2. Compact mode dla przeglądu
Gdy chcesz zobaczyć całość → **Compact**  
Gdy pracujesz nad 1 zadaniem → **Spacious**

### 3. Split View dla kontekstu
Przeglądaj listę z otwartymi szczegółami. Przełączaj między zadaniami bez tracenia miejsca.

### 4. Dashboard rano, Issues w ciągu dnia
**Dashboard** = "Co dziś muszę zrobić?"  
**Issues** = "Jestem w trybie pracy"

### 5. Zwróć uwagę na AI Insights
Jeśli widzisz ostrzeżenie → **To ważne!**  
Sprint ma problem → Rozwiąż go wcześniej.

---

## 🐛 Troubleshooting

### Command Palette nie działa?
- Sprawdź czy focus jest w aplikacji (nie w DevTools)
- Użyj `Ctrl+K` na Windows/Linux

### Split View nie zamyka się?
- Kliknij przycisk "← Cofnij" w Issue Details
- Lub zamknij Command Palette i otwórz ponownie widok

### Kolory się nie zmieniły?
- **Hard refresh**: `Cmd+Shift+R` (Mac) lub `Ctrl+Shift+R` (Windows)
- Wyczyść cache przeglądarki

### Density nie zapisuje się?
- Sprawdź czy localStorage jest włączony w przeglądarce
- Tryb incognito może blokować localStorage

---

## ✅ Checklist "Wypróbowałem wszystko"

- [ ] Otworzyłem Command Palette (`Cmd+K`)
- [ ] Zobaczyłem Personal Dashboard
- [ ] Przełączyłem między Compact/Comfortable/Spacious
- [ ] Otworzyłem zadanie w Split View
- [ ] Zauważyłem szare kolory P2-P5
- [ ] Zobaczyłem WIP warning na Kanban (jeśli > 5 w "In Progress")
- [ ] Sprawdziłem AI Insights w Current Sprint
- [ ] Przefiltrowałem Activity
- [ ] Otworzyłem Settings i przejrzałem zakładki
- [ ] Przetestowałem animacje (hover na kartach)

---

## 📞 Pomoc

### Dokumentacja:
- `REDESIGN_COMPLETED.md` - Pełny opis funkcji
- `REDESIGN_IMPLEMENTATION_GUIDE.md` - Szczegóły techniczne
- `new_design.md` - Design philosophy

### Problemy?
1. Sprawdź dokumentację
2. Otwórz DevTools Console (F12)
3. Sprawdź błędy
4. Hard refresh (`Cmd+Shift+R`)

---

## 🎊 Gotowe!

**Gratulacje!** Znasz już wszystkie nowe funkcje TaskFlow 2.0.

**Teraz czas na produktywność!** 🚀

---

*Quick Start Guide v2.0*  
*Ostatnia aktualizacja: 2025-10-04*

