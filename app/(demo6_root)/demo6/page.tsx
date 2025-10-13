"use client";

import { useState } from "react";
import Link from "next/link";
import { VerifyView, ReleaseQAView, SettingsView } from "./page-components";

export default function Demo6Page() {
  const [activeTab, setActiveTab] = useState("chat");
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-[#111827] text-[#1F2937] dark:text-[#F9FAFB]">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-[#E5E7EB] dark:border-[#374151]">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <svg
              width="24"
              height="24"
              viewBox="0 0 160 160"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Canis Core Fusion"
            >
              <g fill="none" stroke="#10B981" strokeWidth="10" strokeLinecap="round">
                <line x1="80" y1="20" x2="80" y2="52" />
                <line x1="80" y1="108" x2="80" y2="140" />
                <line x1="20" y1="80" x2="52" y2="80" />
                <line x1="108" y1="80" x2="140" y2="80" />
              </g>
              <circle cx="80" cy="80" r="16" fill="#F97316" />
            </svg>
            <h1 className="text-lg font-semibold">Syzio — Canis</h1>
          </div>
          <div className="flex items-center bg-[#F9FAFB] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-md px-2 py-1 text-sm">
            <span>System of Truth for knowledge & AI</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="/demo-selector"
            className="flex items-center space-x-1 text-sm text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#4F46E5] dark:hover:text-[#4F46E5] transition-colors"
          >
            <span className="material-icons text-base">arrow_back</span>
            <span>Back to Demos</span>
          </Link>
          <button className="text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1F2937] dark:hover:text-[#F9FAFB]">
            <span className="material-icons">help_outline</span>
          </button>
          <button className="text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1F2937] dark:hover:text-[#F9FAFB]">
            <span className="material-icons">settings</span>
          </button>
        </div>
      </header>

      <div className="flex-grow p-4 space-y-4 overflow-auto">
        {/* Navigation Tabs */}
        <nav>
          <ul className="flex space-x-8 border-b border-[#E5E7EB] dark:border-[#374151]">
            {["Chat", "Stories", "Test Data", "Verify", "Release Q&A", "Settings"].map((tab) => (
              <li key={tab}>
                <button
                  onClick={() => setActiveTab(tab.toLowerCase().replace(/\s+/g, "-"))}
                  className={`pb-3 ${activeTab === tab.toLowerCase().replace(/\s+/g, "-")
                    ? "border-b-2 border-[#4F46E5] text-[#4F46E5] font-semibold"
                    : "text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1F2937] dark:hover:text-[#F9FAFB]"
                    }`}
                >
                  {tab}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Conditional Content Based on Active Tab */}
        {activeTab === "chat" && (
          <ChatView showBanner={showBanner} setShowBanner={setShowBanner} />
        )}
        {activeTab === "stories" && <StoriesView />}
        {activeTab === "test-data" && <TestDataView />}
        {activeTab === "verify" && <VerifyView />}
        {activeTab === "release-q&a" && <ReleaseQAView />}
        {activeTab === "settings" && <SettingsView />}
      </div>
    </div>
  );
}

function ChatView({
  showBanner,
  setShowBanner,
}: {
  showBanner: boolean;
  setShowBanner: (show: boolean) => void;
}) {
  const [selectedThread, setSelectedThread] = useState("t-1");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [threadMessages, setThreadMessages] = useState<Record<string, Array<{role: 'user' | 'ai', content: string, citations?: string[]}>>>({
    "t-1": [
      {
        role: "ai",
        content: "W skrócie: 3DS wymagany dla kwot > 100 PLN, opcjonalny poniżej. Zgodnie z dokumentacją Checkout_v2.pdf i konfiguracją w payments.yaml.",
        citations: ["Checkout_v2.pdf p. 5", "payments.yaml threeDS"]
      }
    ],
    "t-2": [
      {
        role: "user",
        content: "Jaki jest limit transakcji?"
      },
      {
        role: "ai",
        content: "Znalazłem rozbieżność: Checkout_v2.pdf określa limit na 1000 PLN, ale payments.yaml ma 1500 PLN. Wymaga wyjaśnienia.",
        citations: ["Checkout_v2.pdf p.12", "payments.yaml limits"]
      }
    ],
    "t-3": [
      {
        role: "user",
        content: "Jak walidować numer karty kredytowej?"
      },
      {
        role: "ai",
        content: "Używamy algorytmu Luhn do walidacji PAN. Dodatkowo sprawdzamy BIN (pierwsze 6 cyfr) dla identyfikacji wydawcy karty.",
        citations: ["payments.yaml validation"]
      }
    ],
    "t-4": [
      {
        role: "user",
        content: "Co się dzieje gdy płatność się nie powiedzie?"
      },
      {
        role: "ai",
        content: "System implementuje retry policy z exponential backoff (3 próby). Po wyczerpaniu prób, transakcja jest oznaczana jako 'failed' i użytkownik otrzymuje notyfikację.",
        citations: ["ErrorHandling.md"]
      }
    ],
    "t-5": [
      {
        role: "user",
        content: "Jak obsługujemy webhooks od payment service provider?"
      },
      {
        role: "ai",
        content: "Webhooks są weryfikowane przez HMAC signature, następnie przetwarzane asynchronicznie przez queue worker. Status transakcji jest aktualizowany w bazie danych.",
        citations: ["PSP_Integration.pdf p.15", "architecture.yaml webhooks"]
      }
    ],
  });

  const threads = [
    { id: "t-1", title: "Wymagania 3DS", preview: "3DS obowiązkowy dla…" },
    { id: "t-2", title: "Limit transakcji", preview: "PDF mówi 1000, API 1500…" },
    { id: "t-3", title: "Walidacja karty", preview: "Algorytm Luhn dla PAN..." },
    { id: "t-4", title: "Obsługa błędów płatności", preview: "Retry policy i fallback..." },
    { id: "t-5", title: "Integracja z PSP", preview: "Webhook handling..." },
  ];

  const currentMessages = threadMessages[selectedThread] || [];

  const handleSend = () => {
    if (!message.trim()) return;
    
    const userMessage = message;
    setMessage("");
    
    // Add user message
    setThreadMessages(prev => ({
      ...prev,
      [selectedThread]: [...(prev[selectedThread] || []), { role: "user", content: userMessage }]
    }));
    
    setIsLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      const responses = [
        { content: "Dodaję AC do scenariuszy negatywnych. Chcesz wysłać do PM?", citations: ["Requirements.md"] },
        { content: "Znalazłem odpowiedź w dokumentacji. Czy to pomaga?", citations: ["Checkout_v2.pdf p.8"] },
        { content: "Wykryłem potencjalny konflikt z istniejącym wymaganiem. Sprawdź SZ-1234.", citations: ["PM:SZ-1234"] },
        { content: "Zgodnie z payments.yaml, ta konfiguracja jest poprawna.", citations: ["payments.yaml"] },
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      setThreadMessages(prev => ({
        ...prev,
        [selectedThread]: [...(prev[selectedThread] || []), { role: "ai", ...randomResponse }]
      }));
      setIsLoading(false);
    }, 800 + Math.random() * 400);
  };

  return (
    <>
      {/* Tip Banner */}
      {showBanner && (
        <div className="bg-[#F9FAFB] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-lg p-4 flex items-center justify-between animate-fade-in">
          <div className="flex items-center space-x-3">
            <span className="material-icons text-[#6B7280] dark:text-[#9CA3AF]">lightbulb</span>
            <div>
              <p className="font-medium">Wskazówka</p>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                Przeciągnij dokument PDF aby Canis mógł odpowiadać na pytania o jego zawartość
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600"
              onClick={() => alert("Upload funkcja (demo)")}
            >
              Prześlij dokument
            </button>
            <button
              onClick={() => setShowBanner(false)}
              className="text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1F2937] dark:hover:text-[#F9FAFB]"
            >
              <span className="material-icons">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-4 gap-4 flex-grow">
        {/* Threads Sidebar */}
        <div className="col-span-1 bg-[#F9FAFB] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-lg p-4 overflow-auto">
          <h2 className="text-sm font-semibold mb-2">Wątki</h2>
          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-4">Projekt płatności</p>
          <ul className="space-y-2">
            {threads.map((thread) => (
              <li key={thread.id}>
                <button
                  onClick={() => setSelectedThread(thread.id)}
                  className={`w-full text-left flex items-center space-x-2 p-2 rounded-md transition-colors ${
                    selectedThread === thread.id
                      ? "bg-[#E0E7FF] dark:bg-[#3730A3] text-[#3730A3] dark:text-white font-medium"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800 text-[#6B7280] dark:text-[#9CA3AF]"
                  }`}
                >
                  <span className="material-icons text-sm">chat_bubble_outline</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate">{thread.title}</div>
                    <div className="text-xs opacity-75 truncate">{thread.preview}</div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Chat Area */}
        <div className="col-span-2 bg-[#F9FAFB] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-lg flex flex-col p-4">
          <div className="flex-grow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="font-semibold">Chat Canis</h2>
                <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                  RAG nad dokumentacją i backlogiem
                </p>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">Docs</span>
                <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">API</span>
                <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">PM</span>
              </div>
            </div>
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {currentMessages.map((msg, i) => (
                <div key={i} className="space-y-2 animate-fade-in">
                  {msg.role === "user" ? (
                    <div className="flex justify-end">
                      <div className="bg-[#4F46E5] text-white rounded-lg px-4 py-2 max-w-[80%]">
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start space-x-2">
                        <span className="material-icons text-[#4F46E5] text-base mt-0.5">auto_awesome</span>
                        <div className="prose prose-sm dark:prose-invert max-w-none flex-1">
                          <p className="text-sm">{msg.content}</p>
                        </div>
                      </div>
                      {msg.citations && msg.citations.length > 0 && (
                        <div className="flex flex-wrap gap-2 text-sm ml-7">
                          {msg.citations.map((cite, ci) => (
                            <span
                              key={ci}
                              className="bg-[#E0E7FF] dark:bg-[#3730A3] text-[#3730A3] dark:text-white px-2 py-1 rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                            >
                              {cite}
                            </span>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center space-x-2 animate-pulse-subtle">
                  <span className="material-icons text-[#4F46E5]">auto_awesome</span>
                  <span className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Canis myśli...</span>
                </div>
              )}
            </div>
          </div>
          <div className="mt-4">
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-[#374151] rounded-lg p-3 pr-24 text-sm focus:ring-[#4F46E5] focus:border-[#4F46E5] resize-none"
                placeholder="Zadaj pytanie lub wklej fragment dokumentu..."
                rows={3}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <div className="absolute right-3 top-3 flex flex-col space-y-2">
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !message.trim()}
                  className="text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#4F46E5] disabled:opacity-50"
                >
                  <span className="material-icons">send</span>
                </button>
                <button 
                  onClick={() => alert("Settings (demo)")}
                  className="text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#4F46E5]"
                >
                  <span className="material-icons">tune</span>
                </button>
                <button 
                  onClick={() => alert("Upload (demo)")}
                  className="text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#4F46E5]"
                >
                  <span className="material-icons">upload_file</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sources Sidebar */}
        <div className="col-span-1 bg-[#F9FAFB] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-lg p-4">
          <h2 className="text-sm font-semibold mb-2">Źródła</h2>
          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-4">Najtrafniejsze fragmenty</p>
          <div className="space-y-3">
            <div className="border border-[#E5E7EB] dark:border-[#374151] rounded-lg p-3 text-sm hover:bg-white dark:hover:bg-gray-800 transition-colors cursor-pointer">
              <p className="font-medium">Checkout_v2.pdf</p>
              <p className="text-[#6B7280] dark:text-[#9CA3AF] text-xs">„3DS wymagany powyżej 100 PLN..."</p>
            </div>
            <div className="border border-[#E5E7EB] dark:border-[#374151] rounded-lg p-3 text-sm hover:bg-white dark:hover:bg-gray-800 transition-colors cursor-pointer">
              <p className="font-medium">payments.yaml</p>
              <p className="text-[#6B7280] dark:text-[#9CA3AF] text-xs font-mono">threeDS: default: true</p>
            </div>
            <div className="border border-[#E5E7EB] dark:border-[#374151] rounded-lg p-3 text-sm hover:bg-white dark:hover:bg-gray-800 transition-colors cursor-pointer">
              <p className="font-medium">Pricing.md</p>
              <p className="text-[#6B7280] dark:text-[#9CA3AF] text-xs">„Limit 1500 PLN"</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function StoriesView() {
  const [persona, setPersona] = useState("Buyer");
  const [goal, setGoal] = useState("Chce dodać opcję płatności kartą kredytową w sklepie");
  const [isGenerating, setIsGenerating] = useState(false);
  const [stories, setStories] = useState<any[]>([]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setStories([
        {
          id: 1,
          title: `Jako ${persona} chcę ${goal}`,
          estimate: "5sp",
          hasConflict: false,
          acceptanceCriteria: [
            "WHEN użytkownik wprowadza dane karty THEN system SHALL walidować format PAN",
            "IF kwota > 100 PLN THEN system SHALL wymagać 3DS",
            "WHEN płatność jest autoryzowana THEN system SHALL zapisać transakcję",
          ],
        },
        {
          id: 2,
          title: `Jako ${persona} chcę ${goal} z zabezpieczeniem 3DS`,
          estimate: "8sp",
          hasConflict: true,
          conflictDescription: "Istniejące story SZ-1234 definiuje próg 3DS na 150 PLN, a nie 100 PLN jak w Checkout_v2.pdf",
          acceptanceCriteria: [
            "WHEN kwota przekracza próg THEN system SHALL przekierować do 3DS",
            "IF autoryzacja 3DS się powiedzie THEN system SHALL sfinalizować płatność",
            "WHEN użytkownik anuluje 3DS THEN system SHALL zwrócić błąd",
          ],
        },
      ]);
      setIsGenerating(false);
    }, 1200);
  };

  const handleExport = (storyId: number) => {
    const taskId = `JIRA-${Math.floor(1000 + Math.random() * 9000)}`;
    alert(`Wyeksportowano do PM!\nUtworzono zadanie: ${taskId}`);
  };

  return (
    <div className="grid grid-cols-12 gap-6 h-[calc(100vh-150px)]">
      {/* Left Panel - Form */}
      <div className="col-span-4 bg-[#F9FAFB] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-lg p-6 flex flex-col">
        <h2 className="text-lg font-semibold mb-1">Stories Generator</h2>
        <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-6">
          Generowanie user stories z kryteriami akceptacji
        </p>

        <form className="flex-grow flex flex-col" onSubmit={(e) => { e.preventDefault(); handleGenerate(); }}>
          <div className="space-y-6 flex-grow">
            {/* Persona */}
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="persona">
                Persona
              </label>
              <input
                className="w-full bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-[#374151] rounded-md p-2 text-sm focus:ring-[#4F46E5] focus:border-[#4F46E5]"
                id="persona"
                name="persona"
                placeholder="np. Buyer, Admin"
                type="text"
                value={persona}
                onChange={(e) => setPersona(e.target.value)}
              />
            </div>

            {/* Goal */}
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="goal">
                Cel
              </label>
              <textarea
                className="w-full bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-[#374151] rounded-md p-2 text-sm focus:ring-[#4F46E5] focus:border-[#4F46E5]"
                id="goal"
                name="goal"
                placeholder="Opisz, co użytkownik chce osiągnąć"
                rows={4}
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />
            </div>

            {/* Sources */}
            <div>
              <label className="block text-sm font-medium mb-1">Źródła</label>
              <div className="flex items-center space-x-2">
                <button
                  className="px-3 py-1.5 text-sm rounded-md bg-[#4F46E5] text-white"
                  type="button"
                >
                  Wszystko
                </button>
                <button
                  className="px-3 py-1.5 text-sm rounded-md bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-[#374151] hover:bg-gray-50 dark:hover:bg-gray-700"
                  type="button"
                >
                  Dokumenty
                </button>
                <button
                  className="px-3 py-1.5 text-sm rounded-md bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-[#374151] hover:bg-gray-50 dark:hover:bg-gray-700"
                  type="button"
                >
                  API
                </button>
              </div>
            </div>

            {/* NFR */}
            <div>
              <label className="block text-sm font-medium mb-1">NFR</label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    className="h-4 w-4 rounded border-gray-300 text-[#4F46E5] focus:ring-[#4F46E5]"
                    id="p95"
                    name="p95"
                    type="checkbox"
                  />
                  <label className="ml-2 text-sm" htmlFor="p95">
                    P95 &lt; 300ms
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    className="h-4 w-4 rounded border-gray-300 text-[#4F46E5] focus:ring-[#4F46E5]"
                    id="wcag"
                    name="wcag"
                    type="checkbox"
                  />
                  <label className="ml-2 text-sm" htmlFor="wcag">
                    WCAG AA
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              className="w-full bg-[#4F46E5] text-white rounded-md py-2.5 text-sm font-semibold hover:bg-indigo-700 flex items-center justify-center space-x-2 disabled:opacity-50"
              type="submit"
              disabled={isGenerating}
            >
              <span className="material-icons">{isGenerating ? "hourglass_empty" : "auto_awesome"}</span>
              <span>{isGenerating ? "Generowanie..." : "Generuj Story"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Right Panel - Generated Stories */}
      <div className="col-span-8 flex flex-col space-y-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold">
            {stories.length > 0 ? `Wygenerowane Stories (${stories.length} warianty)` : "Wygenerowane Stories"}
          </h2>
        </div>

        {stories.length === 0 && !isGenerating && (
          <div className="bg-[#F9FAFB] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-lg p-8 text-center">
            <p className="text-[#6B7280] dark:text-[#9CA3AF]">
              Uzupełnij formularz i kliknij <strong>Generuj Story</strong> aby rozpocząć.
            </p>
          </div>
        )}

        {isGenerating && (
          <div className="bg-[#F9FAFB] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-lg p-8 text-center animate-pulse-subtle">
            <p className="text-[#6B7280] dark:text-[#9CA3AF]">Generowanie stories...</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-6 flex-grow">
          {stories.map((story, index) => (
            <div
              key={story.id}
              className={`bg-[#F9FAFB] dark:bg-[#1F2937] border ${
                story.hasConflict ? "border-[#F59E0B] border-2" : "border-[#E5E7EB] dark:border-[#374151]"
              } rounded-lg p-4 flex flex-col space-y-4 relative animate-fade-in`}
            >
              {story.hasConflict && (
                <div className="absolute -top-3 left-4 bg-[#F59E0B] text-white px-2 py-0.5 text-xs font-semibold rounded-full flex items-center space-x-1">
                  <span className="material-icons text-sm">warning_amber</span>
                  <span>Konflikt</span>
                </div>
              )}

              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">Wariant {index + 1}: {story.title.substring(0, 40)}...</h3>
                  <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">INVEST: ✅ | Estymata: {story.estimate}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <button 
                    className="p-1.5 text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1F2937] dark:hover:text-[#F9FAFB] rounded-md"
                    onClick={() => alert("Refine (demo)")}
                  >
                    <span className="material-icons text-base">edit</span>
                  </button>
                  <button 
                    className="p-1.5 text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1F2937] dark:hover:text-[#F9FAFB] rounded-md"
                    onClick={() => navigator.clipboard.writeText(story.title)}
                  >
                    <span className="material-icons text-base">content_copy</span>
                  </button>
                </div>
              </div>

              <div className="prose prose-sm dark:prose-invert max-w-none flex-grow">
                <p className="text-sm">{story.title}</p>
                <p className="font-semibold mt-4 text-sm">Kryteria akceptacji:</p>
                <ul className="text-xs space-y-1 mt-2">
                  {story.acceptanceCriteria.map((ac: string, i: number) => (
                    <li key={i}><code className="bg-gray-100 dark:bg-gray-900/50 px-1 py-0.5 rounded">{ac}</code></li>
                  ))}
                </ul>
              </div>

              {story.hasConflict && (
                <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#92400E] dark:text-[#FCD34D] p-3 rounded-md text-xs">
                  <p className="font-semibold">Konflikt z istniejącym backlogiem</p>
                  <p>{story.conflictDescription}</p>
                  <button 
                    className="mt-2 text-[#4F46E5] underline hover:no-underline"
                    onClick={() => alert("Otwieranie SZ-1234 (demo)")}
                  >
                    Zobacz SZ-1234
                  </button>
                </div>
              )}

              <div className="flex space-x-2">
                <button 
                  className="flex-1 bg-[#4F46E5] text-white rounded-md py-2 text-sm font-semibold hover:bg-indigo-700"
                  onClick={() => handleExport(story.id)}
                >
                  Eksportuj do Atlas
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TestDataView() {
  const [schema, setSchema] = useState("payments.yaml#/Card");
  const [recordCount, setRecordCount] = useState(500);
  const [isGenerating, setIsGenerating] = useState(false);
  const [data, setData] = useState<any[]>([]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newData = Array.from({ length: Math.min(recordCount, 10) }, (_, i) => {
        if (schema === "payments.yaml#/Card") {
          return {
            pan: `4539${Math.random().toString().slice(2, 14)}`,
            expiry: `${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}/2${7 + Math.floor(Math.random() * 3)}`,
            holder: `CARDHOLDER ${i + 1}`,
            brand: ["VISA", "MASTERCARD", "AMEX"][Math.floor(Math.random() * 3)],
            cvv: String(Math.floor(Math.random() * 900) + 100),
          };
        } else if (schema === "payments.yaml#/ChargeRequest") {
          return {
            amount: (Math.random() * 2000).toFixed(2),
            currency: ["PLN", "EUR", "USD"][Math.floor(Math.random() * 3)],
            pan: `4539${Math.random().toString().slice(2, 14)}`,
            threeDS: Math.random() > 0.5 ? "true" : "false",
            merchantId: `MERCH-${String(i + 1).padStart(4, "0")}`,
          };
        } else {
          return {
            id: `user-${i + 1}`,
            email: `user${i + 1}@example.com`,
            name: `User ${i + 1}`,
            role: ["admin", "user", "viewer"][Math.floor(Math.random() * 3)],
            createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          };
        }
      });
      setData(newData);
      setIsGenerating(false);
    }, 1000);
  };

  const handleExport = (format: string) => {
    alert(`Eksportowanie ${recordCount} rekordów do ${format.toUpperCase()}...\n(demo - plik zostałby pobrany)`);
  };

  return (
    <div className="flex-grow grid grid-cols-3 gap-6">
      {/* Left Column - Configuration */}
      <div className="col-span-1 flex flex-col space-y-6">
        {/* Generator Settings */}
        <div className="bg-[#F9FAFB] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-1">Generator danych testowych</h2>
          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-4">
            Tworzenie danych na podstawie OpenAPI/JSON Schema.
          </p>

          <div className="space-y-4">
            {/* Schema Select */}
            <div>
              <label
                className="block text-sm font-medium text-[#1F2937] dark:text-[#F9FAFB] mb-1"
                htmlFor="schema"
              >
                Schema
              </label>
              <div className="relative">
                <select
                  className="w-full bg-white dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-md pl-3 pr-10 py-2 text-sm focus:ring-[#4F46E5] focus:border-[#4F46E5]"
                  id="schema"
                  value={schema}
                  onChange={(e) => {
                    setSchema(e.target.value);
                    setData([]);
                  }}
                >
                  <option>payments.yaml#/Card</option>
                  <option>payments.yaml#/ChargeRequest</option>
                  <option>users.yaml#/User</option>
                </select>
              </div>
            </div>

            {/* Number of Records */}
            <div>
              <label
                className="block text-sm font-medium text-[#1F2937] dark:text-[#F9FAFB] mb-1"
                htmlFor="records"
              >
                Liczba rekordów
              </label>
              <input
                className="w-full bg-white dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-md px-3 py-2 text-sm focus:ring-[#4F46E5] focus:border-[#4F46E5]"
                id="records"
                type="number"
                value={recordCount}
                onChange={(e) => setRecordCount(Number(e.target.value))}
                min={1}
                max={10000}
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-[#4F46E5] hover:bg-[#3730A3] text-white rounded-md px-4 py-2 text-sm font-medium flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span className="material-icons text-base">{isGenerating ? "hourglass_empty" : "refresh"}</span>
              <span>{isGenerating ? "Generowanie..." : "Generuj"}</span>
            </button>
          </div>
        </div>

        {/* Rules Editor */}
        <div className="bg-[#F9FAFB] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-lg p-6 flex-grow">
          <h3 className="text-base font-semibold mb-2">Edytor reguł</h3>
          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-4">
            Dostosuj generowane dane za pomocą reguł w formacie YAML.
          </p>

          <div className="h-64 bg-white dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-md font-mono text-xs p-2 overflow-auto">
            <pre>
              <code>
                <span className="text-gray-400">1</span> card_number:{"\n"}
                <span className="text-gray-400">2</span>   <span className="text-purple-400">faker</span>: credit_card_number{"\n"}
                <span className="text-gray-400">3</span> expiry_date:{"\n"}
                <span className="text-gray-400">4</span>   <span className="text-purple-400">faker</span>: credit_card_expire{"\n"}
                <span className="text-gray-400">5</span> cvv:{"\n"}
                <span className="text-gray-400">6</span>   <span className="text-purple-400">faker</span>: credit_card_security_code{"\n"}
                <span className="text-gray-400">7</span> currency:{"\n"}
                <span className="text-gray-400">8</span>   <span className="text-purple-400">values</span>: ['PLN', 'EUR', 'USD']
              </code>
            </pre>
          </div>
        </div>

        {/* Edge Cases */}
        <div className="bg-[#F9FAFB] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-lg p-6">
          <h3 className="text-base font-semibold mb-4">Edge Cases</h3>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                className="form-checkbox h-4 w-4 rounded text-[#4F46E5] bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-[#4F46E5]"
                type="checkbox"
              />
              <span className="text-sm">Brakujące wartości (null)</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                className="form-checkbox h-4 w-4 rounded text-[#4F46E5] bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-[#4F46E5]"
                type="checkbox"
              />
              <span className="text-sm">Wartości puste (empty string)</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                className="form-checkbox h-4 w-4 rounded text-[#4F46E5] bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-[#4F46E5]"
                type="checkbox"
              />
              <span className="text-sm">Ekstremalne długości pól</span>
            </label>
          </div>
        </div>
      </div>

      {/* Right Column - Data Preview */}
      <div className="col-span-2 bg-[#F9FAFB] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-lg p-6 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold">Podgląd danych</h2>
            <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
              {data.length > 0 ? `Pierwsze ${data.length} z ${recordCount} rekordów` : "Kliknij Generuj aby utworzyć dane"}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative inline-block text-left">
              <select
                className="inline-flex justify-center rounded-md border border-[#E5E7EB] dark:border-[#374151] shadow-sm px-4 py-2 bg-white dark:bg-[#1F2937] text-sm font-medium text-[#1F2937] dark:text-[#F9FAFB] hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-[#4F46E5]"
                onChange={(e) => handleExport(e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>Eksportuj</option>
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
                <option value="sql">SQL</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Table */}
        {data.length > 0 ? (
          <div className="flex-grow overflow-x-auto border border-[#E5E7EB] dark:border-[#374151] rounded-md">
            <table className="min-w-full divide-y divide-[#E5E7EB] dark:divide-[#374151] text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {Object.keys(data[0]).map((key) => (
                    <th
                      key={key}
                      className="px-6 py-3 text-left font-medium text-[#6B7280] dark:text-[#9CA3AF] tracking-wider"
                      scope="col"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-[#1F2937] divide-y divide-[#E5E7EB] dark:divide-[#374151]">
                {data.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    {Object.values(row).map((val: any, j) => (
                      <td key={j} className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                        {String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex-grow flex items-center justify-center border border-[#E5E7EB] dark:border-[#374151] rounded-md">
            <p className="text-[#6B7280] dark:text-[#9CA3AF]">Brak danych do wyświetlenia</p>
          </div>
        )}
      </div>
    </div>
  );
}
