"use client";

import { useState } from "react";
import Link from "next/link";

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
            <span>System of Truth for knowledge & AI

            </span>
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
  return (
    <>
      {/* Tip Banner */}
      {showBanner && (
        <div className="bg-[#F9FAFB] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-lg p-4 flex items-center justify-between">
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
            <button className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600">
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
          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-4">ACME / SHOP</p>
          <ul>
            <li className="mb-2">
              <a
                href="#"
                className="flex items-center space-x-2 p-2 rounded-md bg-[#E0E7FF] dark:bg-[#3730A3] text-[#3730A3] dark:text-white font-medium"
              >
                <span className="material-icons text-sm">chat_bubble_outline</span>
                <span>Wymagania 3DS</span>
              </a>
            </li>
            <li className="mb-2">
              <a
                href="#"
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-[#6B7280] dark:text-[#9CA3AF]"
              >
                <span className="material-icons text-sm">chat_bubble_outline</span>
                <span>Limit transakcji</span>
              </a>
            </li>
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
            <div className="space-y-4">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p>
                  W skrócie: 3DS wymagany dla kwot &gt; 100 PLN, opcjonalny poniżej. Zgodnie z
                  dokumentacją Checkout_v2.pdf i konfiguracją w payments.yaml.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="bg-[#E0E7FF] dark:bg-[#3730A3] text-[#3730A3] dark:text-white px-2 py-1 rounded-md cursor-pointer">
                  Checkout_v2.pdf p. 5
                </span>
                <span className="bg-[#E0E7FF] dark:bg-[#3730A3] text-[#3730A3] dark:text-white px-2 py-1 rounded-md cursor-pointer">
                  payments.yaml threeDS
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="relative">
              <textarea
                className="w-full bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-[#374151] rounded-lg p-3 pr-24 text-sm focus:ring-[#4F46E5] focus:border-[#4F46E5]"
                placeholder="Zadaj pytanie lub wklej fragment dokumentu..."
                rows={3}
              />
              <div className="absolute right-3 top-3 flex flex-col space-y-2">
                <button className="text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#4F46E5]">
                  <span className="material-icons">send</span>
                </button>
                <button className="text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#4F46E5]">
                  <span className="material-icons">tune</span>
                </button>
                <button className="text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#4F46E5]">
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
            <div className="border border-[#E5E7EB] dark:border-[#374151] rounded-lg p-3 text-sm">
              <p className="font-medium">Checkout_v2.pdf</p>
              <p className="text-[#6B7280] dark:text-[#9CA3AF]">„3DS wymagany powyżej 100 PLN..."</p>
            </div>
            <div className="border border-[#E5E7EB] dark:border-[#374151] rounded-lg p-3 text-sm">
              <p className="font-medium">payments.yaml</p>
              <p className="text-[#6B7280] dark:text-[#9CA3AF]">threeDS: default: true</p>
            </div>
            <div className="border border-[#E5E7EB] dark:border-[#374151] rounded-lg p-3 text-sm">
              <p className="font-medium">Pricing.md</p>
              <p className="text-[#6B7280] dark:text-[#9CA3AF]">„Limit 1500 PLN"</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function StoriesView() {
  return (
    <div className="grid grid-cols-12 gap-6 h-[calc(100vh-150px)]">
      {/* Left Panel - Form */}
      <div className="col-span-4 bg-[#F9FAFB] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-lg p-6 flex flex-col">
        <h2 className="text-lg font-semibold mb-1">Stories Generator</h2>
        <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-6">
          Generowanie user stories z kryteriami akceptacji
        </p>

        <form className="flex-grow flex flex-col">
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
                defaultValue="Buyer"
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
                defaultValue="Chce dodać opcję płatności kartą kredytową w sklepie"
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
              className="w-full bg-[#4F46E5] text-white rounded-md py-2.5 text-sm font-semibold hover:bg-indigo-700 flex items-center justify-center space-x-2"
              type="submit"
            >
              <span className="material-icons">auto_awesome</span>
              <span>Generuj Story</span>
            </button>
          </div>
        </form>
      </div>

      {/* Right Panel - Generated Stories */}
      <div className="col-span-8 flex flex-col space-y-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold">Wygenerowane Stories (2 warianty)</h2>
        </div>

        <div className="grid grid-cols-2 gap-6 flex-grow">
          {/* Variant 1 */}
          <div className="bg-[#F9FAFB] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-lg p-4 flex flex-col space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">Wariant 1: Podstawowa płatność</h3>
                <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">INVEST: ✅</p>
              </div>
              <div className="flex items-center space-x-1">
                <button className="p-1.5 text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1F2937] dark:hover:text-[#F9FAFB] rounded-md">
                  <span className="material-icons text-base">edit</span>
                </button>
                <button className="p-1.5 text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1F2937] dark:hover:text-[#F9FAFB] rounded-md">
                  <span className="material-icons text-base">content_copy</span>
                </button>
              </div>
            </div>

            <div className="prose prose-sm dark:prose-invert max-w-none flex-grow">
              <p>
                <strong>Jako</strong> Kupujący,
                <br />
                <strong>chcę</strong> móc zapłacić kartą kredytową,
                <br />
                <strong>aby</strong> szybko sfinalizować zakup.
              </p>
              <p className="font-semibold mt-4">Kryteria akceptacji:</p>
              <pre className="bg-gray-100 dark:bg-gray-900/50 p-3 rounded-md text-xs">
                <code>
                  <span className="gherkin-keyword">Given</span> jestem na stronie płatności{"\n"}
                  <span className="gherkin-keyword">When</span> wybieram opcję "Karta kredytowa"
                  {"\n"}
                  <span className="gherkin-keyword">And</span> podaję poprawne dane karty{"\n"}
                  <span className="gherkin-keyword">And</span> klikam "Zapłać"{"\n"}
                  <span className="gherkin-keyword">Then</span> transakcja jest pomyślnie
                  zakończona{"\n"}
                  <span className="gherkin-keyword">And</span> widzę potwierdzenie zamówienia
                </code>
              </pre>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 bg-[#4F46E5] text-white rounded-md py-2 text-sm font-semibold hover:bg-indigo-700">
                Eksportuj do Atlas
              </button>
            </div>
          </div>

          {/* Variant 2 - With Conflict */}
          <div className="bg-[#F9FAFB] dark:bg-[#1F2937] border-2 border-[#F59E0B]/50 rounded-lg p-4 flex flex-col space-y-4 relative">
            <div className="absolute -top-3 left-4 bg-[#F59E0B] text-white px-2 py-0.5 text-xs font-semibold rounded-full flex items-center space-x-1">
              <span className="material-icons text-sm">warning_amber</span>
              <span>Konflikt</span>
            </div>

            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">Wariant 2: Płatność z 3D Secure</h3>
                <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">INVEST: ✅</p>
              </div>
              <div className="flex items-center space-x-1">
                <button className="p-1.5 text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1F2937] dark:hover:text-[#F9FAFB] rounded-md">
                  <span className="material-icons text-base">edit</span>
                </button>
                <button className="p-1.5 text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1F2937] dark:hover:text-[#F9FAFB] rounded-md">
                  <span className="material-icons text-base">content_copy</span>
                </button>
              </div>
            </div>

            <div className="prose prose-sm dark:prose-invert max-w-none flex-grow">
              <p>
                <strong>Jako</strong> Kupujący,
                <br />
                <strong>chcę</strong> móc zapłacić kartą z 3D Secure,
                <br />
                <strong>aby</strong> zapewnić bezpieczeństwo transakcji.
              </p>
              <p className="font-semibold mt-4">Kryteria akceptacji:</p>
              <pre className="bg-gray-100 dark:bg-gray-900/50 p-3 rounded-md text-xs">
                <code>
                  <span className="gherkin-keyword">Given</span> kwota zamówienia przekracza 100
                  PLN{"\n"}
                  <span className="gherkin-keyword">When</span> wybieram opcję "Karta kredytowa"
                  {"\n"}
                  <span className="gherkin-keyword">And</span> podaję dane karty{"\n"}
                  <span className="gherkin-keyword">And</span> jestem przekierowany na stronę 3DS
                  {"\n"}
                  <span className="gherkin-keyword">And</span> pomyślnie autoryzuję transakcję
                  {"\n"}
                  <span className="gherkin-keyword">Then</span> transakcja jest zakończona sukcesem
                </code>
              </pre>
            </div>

            <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#92400E] dark:text-[#FCD34D] p-3 rounded-md text-xs">
              <p className="font-semibold">Konflikt z istniejącym backlogiem</p>
              <p>
                Story{" "}
                <a className="underline" href="#">
                  #PM-123
                </a>{" "}
                definiuje próg 3DS na 150 PLN. <br />
                Źródło:{" "}
                <span className="font-mono bg-gray-200 dark:bg-gray-700 px-1 rounded">
                  Checkout_v1.pdf
                </span>
              </p>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 bg-[#4F46E5] text-white rounded-md py-2 text-sm font-semibold hover:bg-indigo-700">
                  Eksportuj do Atlas
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TestDataView() {
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
                >
                  <option>payments.yaml#/Card</option>
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
                defaultValue="10"
              />
            </div>
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
          <h2 className="text-lg font-semibold">Podgląd danych</h2>
          <div className="flex items-center space-x-2">
            <button className="bg-[#4F46E5] hover:bg-[#3730A3] text-white rounded-md px-4 py-2 text-sm font-medium flex items-center space-x-2">
              <span className="material-icons text-base">refresh</span>
              <span>Generuj</span>
            </button>
            <div className="relative inline-block text-left">
              <button
                aria-expanded="true"
                aria-haspopup="true"
                className="inline-flex justify-center w-full rounded-md border border-[#E5E7EB] dark:border-[#374151] shadow-sm px-4 py-2 bg-white dark:bg-[#1F2937] text-sm font-medium text-[#1F2937] dark:text-[#F9FAFB] hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-[#4F46E5]"
                id="menu-button"
                type="button"
              >
                Eksportuj
                <span className="material-icons -mr-1 ml-2 h-5 w-5">expand_more</span>
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="flex-grow overflow-x-auto border border-[#E5E7EB] dark:border-[#374151] rounded-md">
          <table className="min-w-full divide-y divide-[#E5E7EB] dark:divide-[#374151] text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th
                  className="px-6 py-3 text-left font-medium text-[#6B7280] dark:text-[#9CA3AF] tracking-wider"
                  scope="col"
                >
                  card_number
                </th>
                <th
                  className="px-6 py-3 text-left font-medium text-[#6B7280] dark:text-[#9CA3AF] tracking-wider"
                  scope="col"
                >
                  expiry_date
                </th>
                <th
                  className="px-6 py-3 text-left font-medium text-[#6B7280] dark:text-[#9CA3AF] tracking-wider"
                  scope="col"
                >
                  cvv
                </th>
                <th
                  className="px-6 py-3 text-left font-medium text-[#6B7280] dark:text-[#9CA3AF] tracking-wider"
                  scope="col"
                >
                  currency
                </th>
                <th
                  className="px-6 py-3 text-left font-medium text-[#6B7280] dark:text-[#9CA3AF] tracking-wider"
                  scope="col"
                >
                  amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-[#1F2937] divide-y divide-[#E5E7EB] dark:divide-[#374151]">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">4992...7392</td>
                <td className="px-6 py-4 whitespace-nowrap">10/25</td>
                <td className="px-6 py-4 whitespace-nowrap">342</td>
                <td className="px-6 py-4 whitespace-nowrap">PLN</td>
                <td className="px-6 py-4 whitespace-nowrap">120.50</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">5102...3948</td>
                <td className="px-6 py-4 whitespace-nowrap">03/26</td>
                <td className="px-6 py-4 whitespace-nowrap">817</td>
                <td className="px-6 py-4 whitespace-nowrap">EUR</td>
                <td className="px-6 py-4 whitespace-nowrap">75.00</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">4242...4242</td>
                <td className="px-6 py-4 whitespace-nowrap">11/24</td>
                <td className="px-6 py-4 whitespace-nowrap">123</td>
                <td className="px-6 py-4 whitespace-nowrap">USD</td>
                <td className="px-6 py-4 whitespace-nowrap">99.99</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">3782...85007</td>
                <td className="px-6 py-4 whitespace-nowrap">12/27</td>
                <td className="px-6 py-4 whitespace-nowrap">1001</td>
                <td className="px-6 py-4 whitespace-nowrap">PLN</td>
                <td className="px-6 py-4 whitespace-nowrap">50.00</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">6011...0000</td>
                <td className="px-6 py-4 whitespace-nowrap">01/25</td>
                <td className="px-6 py-4 whitespace-nowrap">589</td>
                <td className="px-6 py-4 whitespace-nowrap">EUR</td>
                <td className="px-6 py-4 whitespace-nowrap">250.00</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-[#6B7280] dark:text-[#9CA3AF]">
                  ...
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-[#6B7280] dark:text-[#9CA3AF]">
                  ...
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-[#6B7280] dark:text-[#9CA3AF]">
                  ...
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-[#6B7280] dark:text-[#9CA3AF]">
                  ...
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-[#6B7280] dark:text-[#9CA3AF]">
                  ...
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="pt-4 text-right text-sm text-[#6B7280] dark:text-[#9CA3AF]">
          Wygenerowano 10 rekordów. Pokazano 5.
        </div>
      </div>
    </div>
  );
}

function VerifyView() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Weryfikator wymagań</h2>
          <p className="text-[#6B7280] dark:text-[#9CA3AF]">
            Analiza kompletności, spójności i niejednoznaczności
          </p>
        </div>
        <button className="bg-[#4F46E5] text-white rounded-md px-4 py-2 text-sm font-medium flex items-center space-x-2 hover:bg-opacity-90">
          <span className="material-icons text-base">refresh</span>
          <span>Uruchom ponownie</span>
        </button>
      </div>

      {/* Findings Table */}
      <div className="bg-white dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-lg">
        <div className="p-4 border-b border-[#E5E7EB] dark:border-[#374151]">
          <h3 className="font-semibold">Findings (3)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F9FAFB] dark:bg-[#111827]">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-[#6B7280] dark:text-[#9CA3AF]">
                  Typ
                </th>
                <th className="px-4 py-3 text-left font-medium text-[#6B7280] dark:text-[#9CA3AF]">
                  Ważność
                </th>
                <th className="px-4 py-3 text-left font-medium text-[#6B7280] dark:text-[#9CA3AF]">
                  Opis
                </th>
                <th className="px-4 py-3 text-left font-medium text-[#6B7280] dark:text-[#9CA3AF]">
                  Źródło
                </th>
                <th className="px-4 py-3 text-left font-medium text-[#6B7280] dark:text-[#9CA3AF]"></th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#E5E7EB] dark:border-[#374151]">
                <td className="px-4 py-3">Niespójność</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded-full text-xs font-medium severity-high">
                    High
                  </span>
                </td>
                <td className="px-4 py-3">
                  Limit płatności w dokumencie (100 PLN) vs. Story (150 PLN)
                </td>
                <td className="px-4 py-3 text-[#6B7280] dark:text-[#9CA3AF]">
                  Checkout_v2.pdf, US-123
                </td>
                <td className="px-4 py-3">
                  <button className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center space-x-1">
                    <span className="material-icons text-xs">add_task</span>
                    <span>Create Task</span>
                  </button>
                </td>
              </tr>
              <tr className="border-b border-[#E5E7EB] dark:border-[#374151]">
                <td className="px-4 py-3">Brak</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded-full text-xs font-medium severity-medium">
                    Medium
                  </span>
                </td>
                <td className="px-4 py-3">
                  Brak zdefiniowanych kryteriów akceptacji dla obsługi błędu 3DS
                </td>
                <td className="px-4 py-3 text-[#6B7280] dark:text-[#9CA3AF]">US-124</td>
                <td className="px-4 py-3">
                  <button className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center space-x-1">
                    <span className="material-icons text-xs">add_task</span>
                    <span>Create Task</span>
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3">Niejednoznaczność</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded-full text-xs font-medium severity-low">
                    Low
                  </span>
                </td>
                <td className="px-4 py-3">
                  Termin "natychmiast" jest nieprecyzyjny. Należy zdefiniować SLA
                </td>
                <td className="px-4 py-3 text-[#6B7280] dark:text-[#9CA3AF]">NFRs.md</td>
                <td className="px-4 py-3">
                  <button className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center space-x-1">
                    <span className="material-icons text-xs">add_task</span>
                    <span>Create Task</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Trace Matrix */}
      <div className="bg-white dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-lg">
        <div className="p-4 border-b border-[#E5E7EB] dark:border-[#374151]">
          <h3 className="font-semibold">Trace Matrix</h3>
        </div>
        <div className="p-4 grid grid-cols-3 gap-6">
          {/* Documents */}
          <div>
            <h4 className="font-medium mb-3">Dokumenty</h4>
            <div className="space-y-2">
              <div className="bg-[#EEF2FF] dark:bg-[#3730A3] text-[#3730A3] dark:text-white rounded-md p-3 text-sm font-medium">
                Checkout_v2.pdf
              </div>
              <div className="bg-[#F9FAFB] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-md p-3 text-sm">
                NFRs.md
              </div>
              <div className="bg-[#F9FAFB] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-md p-3 text-sm">
                payments.yaml
              </div>
            </div>
          </div>

          {/* Stories */}
          <div>
            <h4 className="font-medium mb-3">Stories</h4>
            <div className="space-y-2">
              <div className="bg-[#EEF2FF] dark:bg-[#3730A3] text-[#3730A3] dark:text-white rounded-md p-3 text-sm font-medium">
                US-123: Płatność &gt; 100 PLN
              </div>
              <div className="bg-[#EEF2FF] dark:bg-[#3730A3] text-[#3730A3] dark:text-white rounded-md p-3 text-sm font-medium">
                US-124: Obsługa błędów 3DS
              </div>
              <div className="bg-[#F9FAFB] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-md p-3 text-sm">
                US-125: Płatność cykliczna
              </div>
            </div>
          </div>

          {/* Releases */}
          <div>
            <h4 className="font-medium mb-3">Releasy</h4>
            <div className="space-y-2">
              <div className="bg-[#EEF2FF] dark:bg-[#3730A3] text-[#3730A3] dark:text-white rounded-md p-3 text-sm font-medium">
                R-101
              </div>
              <div className="bg-[#F9FAFB] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-md p-3 text-sm">
                R-102
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReleaseQAView() {
  return (
    <div className="flex flex-col gap-4 max-w-4xl mx-auto">
      {/* Header with Release Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold">Release Q&A</h2>
        <div className="flex items-center space-x-2">
          <label
            className="text-sm font-medium text-[#6B7280] dark:text-[#9CA3AF]"
            htmlFor="release-select"
          >
            Wersja
          </label>
          <div className="relative">
            <select
              className="w-full sm:w-auto bg-[#F9FAFB] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-md pl-3 pr-8 py-2 text-sm font-medium focus:ring-[#4F46E5] focus:border-[#4F46E5]"
              id="release-select"
            >
              <option>R-102 (SHOP) 3DS</option>
              <option>R-101 (SHOP) Limits</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#6B7280] dark:text-[#9CA3AF]">
              <span className="material-icons text-sm">unfold_more</span>
            </div>
          </div>
        </div>
      </div>

      {/* Q&A Card */}
      <div className="bg-[#F9FAFB] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-lg p-6">
        <div className="flex flex-col gap-6">
          {/* Suggested Questions */}
          <div className="flex flex-wrap gap-2">
            <button className="bg-[#E0E7FF] dark:bg-[#3730A3] text-[#3730A3] dark:text-white px-3 py-1.5 rounded-md text-sm font-medium">
              Co było w paczce?
            </button>
            <button className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-[#1F2937] dark:text-[#F9FAFB] px-3 py-1.5 rounded-md text-sm font-medium">
              Czy gate spełnione?
            </button>
            <button className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-[#1F2937] dark:text-[#F9FAFB] px-3 py-1.5 rounded-md text-sm font-medium">
              Co się zmieniło vs poprzedni?
            </button>
          </div>

          {/* Answer */}
          <div className="flex gap-4">
            <span className="material-icons text-[#4F46E5] mt-1">auto_awesome</span>
            <div className="flex-1 space-y-4">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p>
                  Wdrożenie mechanizmu 3D Secure dla transakcji kartowych powyżej 100 PLN.
                  Obejmuje to 3 user stories (SHOP-12, SHOP-15, SHOP-16) i aktualizację schematu
                  API. Zmiana dotyczy 5 plików konfiguracyjnych.
                </p>
              </div>

              {/* Sources and Links */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Źródła:</span>
                  <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">Atlas</span>
                  <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">Helix</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 text-[#4F46E5] hover:underline">
                    <span className="material-icons text-sm">launch</span>
                    <span>Otwórz w Helix</span>
                  </button>
                  <button className="flex items-center gap-1 text-[#4F46E5] hover:underline">
                    <span className="material-icons text-sm">launch</span>
                    <span>Otwórz w Atlas</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="relative">
        <textarea
          className="w-full bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-[#374151] rounded-lg p-3 pr-12 text-sm focus:ring-[#4F46E5] focus:border-[#4F46E5]"
          placeholder="Zadaj kolejne pytanie o release..."
          rows={2}
        />
        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#4F46E5]">
          <span className="material-icons">send</span>
        </button>
      </div>
    </div>
  );
}

function SettingsView() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left Column - Connectors */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Connectors</h2>
          <div className="space-y-4">
            {/* PM Connector */}
            <div className="bg-[#F9FAFB] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="material-icons text-[#4F46E5]">work_outline</span>
                <div>
                  <h3 className="font-medium">Syzio Atlas</h3>
                  <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                    Dane o backlogu i projektach, storkach
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm inline-flex items-center bg-[#D1FAE5] text-[#10B981] dark:bg-[#064E3B] dark:text-green-300 px-2 py-1 rounded-full">
                  <span className="material-icons text-sm mr-1">check_circle</span>
                  Connected
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input defaultChecked className="sr-only peer" type="checkbox" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#4F46E5]"></div>
                </label>
              </div>
            </div>

            {/* Dev Monitoring Connector */}
            <div className="bg-[#F9FAFB] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="material-icons text-[#4F46E5]">monitoring</span>
                <div>
                  <h3 className="font-medium">Syzio Helix</h3>
                  <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                    Dane o deploymentach
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm inline-flex items-center bg-[#D1FAE5] text-[#10B981] dark:bg-[#064E3B] dark:text-green-300 px-2 py-1 rounded-full">
                  <span className="material-icons text-sm mr-1">check_circle</span>
                  Connected
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input defaultChecked className="sr-only peer" type="checkbox" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#4F46E5]"></div>
                </label>
              </div>
            </div>

            {/* Document Repo Connector */}
            <div className="bg-[#F9FAFB] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="material-icons text-[#4F46E5]">folder_open</span>
                <div>
                  <h3 className="font-medium">Repo dokumentów</h3>
                  <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                    Analiza dokumentów PDF/MD
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm inline-flex items-center bg-[#FEE2E2] text-[#EF4444] dark:bg-[#991B1B] dark:text-red-300 px-2 py-1 rounded-full">
                  <span className="material-icons text-sm mr-1">cancel</span>
                  Not Connected
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input className="sr-only peer" type="checkbox" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#4F46E5]"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Rules and Dictionary */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Reguły i słownik</h2>

          {/* NFR Rules */}
          <div className="bg-[#F9FAFB] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-lg p-4">
            <h3 className="font-medium mb-2">NFR rules</h3>
            <div className="bg-white dark:bg-gray-800 rounded-md">
              <pre className="p-4 text-sm text-[#1F2937] dark:text-[#F9FAFB] font-mono rounded-md overflow-x-auto">
                <code className="language-yaml">
                  P95 &lt; 300ms{"\n"}
                  WCAG AA
                </code>
              </pre>
            </div>
          </div>

          {/* Domain Dictionary */}
          <div className="bg-[#F9FAFB] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-lg p-4 mt-4">
            <h3 className="font-medium mb-2">Słownik domeny</h3>
            <div className="bg-white dark:bg-gray-800 rounded-md">
              <pre className="p-4 text-sm text-[#1F2937] dark:text-[#F9FAFB] font-mono rounded-md overflow-x-auto">
                <code className="language-yaml">
                  payments{"\n"}
                  card{"\n"}
                  charge{"\n"}
                  3DS
                </code>
              </pre>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-6 text-right">
            <button className="bg-[#4F46E5] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#3730A3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4F46E5]">
              Zapisz zmiany
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
