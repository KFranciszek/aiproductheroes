"use client";

import { useState } from "react";

export function SettingsViewExtended() {
  const [atlasConnected, setAtlasConnected] = useState(true);
  const [helixConnected, setHelixConnected] = useState(false);
  const [showAddSource, setShowAddSource] = useState(false);
  const [showAddDoc, setShowAddDoc] = useState(false);

  const externalSources = [
    { id: 1, name: "Jira", type: "PM Tool", status: "connected", lastSync: "2 min temu" },
    { id: 2, name: "Confluence", type: "Documentation", status: "connected", lastSync: "5 min temu" },
    { id: 3, name: "GitHub", type: "Code Repository", status: "connected", lastSync: "1 min temu" },
    { id: 4, name: "Slack", type: "Communication", status: "disconnected", lastSync: "nigdy" },
  ];

  const documents = [
    { id: 1, name: "Checkout_v2.pdf", type: "PDF", size: "2.4 MB", uploaded: "2025-10-10" },
    { id: 2, name: "payments.yaml", type: "YAML", size: "45 KB", uploaded: "2025-10-09" },
    { id: 3, name: "API_Spec.yaml", type: "YAML", size: "128 KB", uploaded: "2025-10-08" },
    { id: 4, name: "UserGuide.pdf", type: "PDF", size: "5.1 MB", uploaded: "2025-10-07" },
  ];

  return (
    <div className="space-y-6">
      {/* Syzio Integrations */}
      <div className="bg-[#F9FAFB] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Integracje Syzio</h2>
        <div className="space-y-4">
          {/* Syzio Atlas */}
          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-[#374151] rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="material-icons text-white">hub</span>
              </div>
              <div>
                <h3 className="font-semibold">Syzio Atlas</h3>
                <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Project Management & Backlog</p>
                {atlasConnected && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    ✓ Połączono • Ostatnia synchronizacja: 1 min temu
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {atlasConnected && (
                <button
                  onClick={() => alert("Synchronizacja z Atlas...\n(demo)")}
                  className="px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-[#E5E7EB] dark:border-[#374151] rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <span className="material-icons text-base">sync</span>
                </button>
              )}
              <button
                onClick={() => {
                  setAtlasConnected(!atlasConnected);
                  alert(atlasConnected ? "Rozłączono z Syzio Atlas" : "Połączono z Syzio Atlas!");
                }}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  atlasConnected
                    ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                    : "bg-[#4F46E5] text-white hover:bg-indigo-700"
                }`}
              >
                {atlasConnected ? "Rozłącz" : "Połącz"}
              </button>
            </div>
          </div>

          {/* Syzio Helix */}
          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-[#374151] rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="material-icons text-white">analytics</span>
              </div>
              <div>
                <h3 className="font-semibold">Syzio Helix</h3>
                <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">DevOps Monitoring & Metrics</p>
                {helixConnected && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    ✓ Połączono • Ostatnia synchronizacja: 30 sek temu
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {helixConnected && (
                <button
                  onClick={() => alert("Synchronizacja z Helix...\n(demo)")}
                  className="px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-[#E5E7EB] dark:border-[#374151] rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <span className="material-icons text-base">sync</span>
                </button>
              )}
              <button
                onClick={() => {
                  setHelixConnected(!helixConnected);
                  alert(helixConnected ? "Rozłączono z Syzio Helix" : "Połączono z Syzio Helix!");
                }}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  helixConnected
                    ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                    : "bg-[#4F46E5] text-white hover:bg-indigo-700"
                }`}
              >
                {helixConnected ? "Rozłącz" : "Połącz"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* External Sources */}
      <div className="bg-[#F9FAFB] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Źródła zewnętrzne</h2>
            <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Integracje z narzędziami zewnętrznymi</p>
          </div>
          <button
            onClick={() => setShowAddSource(!showAddSource)}
            className="px-4 py-2 text-sm font-medium bg-[#4F46E5] text-white rounded-md hover:bg-indigo-700 flex items-center space-x-2"
          >
            <span className="material-icons text-base">add</span>
            <span>Dodaj źródło</span>
          </button>
        </div>

        {showAddSource && (
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg animate-fade-in">
            <h3 className="font-semibold mb-3">Dostępne integracje:</h3>
            <div className="grid grid-cols-2 gap-2">
              {["Azure DevOps", "GitLab", "Notion", "Linear", "Asana", "Trello"].map((tool) => (
                <button
                  key={tool}
                  onClick={() => {
                    alert(`Łączenie z ${tool}...\n(demo - konfiguracja OAuth)`);
                    setShowAddSource(false);
                  }}
                  className="px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-[#374151] rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-left"
                >
                  {tool}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          {externalSources.map((source) => (
            <div
              key={source.id}
              className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-[#374151] rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <span className="material-icons text-[#6B7280] dark:text-[#9CA3AF]">
                  {source.type === "PM Tool" ? "task" : source.type === "Documentation" ? "description" : source.type === "Code Repository" ? "code" : "chat"}
                </span>
                <div>
                  <h4 className="font-medium text-sm">{source.name}</h4>
                  <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                    {source.type} • Ostatnia sync: {source.lastSync}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded ${
                    source.status === "connected"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                  }`}
                >
                  {source.status === "connected" ? "Połączono" : "Rozłączono"}
                </span>
                {source.status === "connected" ? (
                  <button
                    onClick={() => alert(`Konfiguracja ${source.name}\n(demo)`)}
                    className="p-1.5 text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1F2937] dark:hover:text-[#F9FAFB]"
                  >
                    <span className="material-icons text-base">settings</span>
                  </button>
                ) : (
                  <button
                    onClick={() => alert(`Łączenie z ${source.name}...\n(demo)`)}
                    className="px-3 py-1 text-xs bg-[#4F46E5] text-white rounded-md hover:bg-indigo-700"
                  >
                    Połącz
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Documentation Sources */}
      <div className="bg-[#F9FAFB] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Dokumentacja źródłowa</h2>
            <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Przesłane dokumenty i specyfikacje</p>
          </div>
          <button
            onClick={() => setShowAddDoc(!showAddDoc)}
            className="px-4 py-2 text-sm font-medium bg-[#4F46E5] text-white rounded-md hover:bg-indigo-700 flex items-center space-x-2"
          >
            <span className="material-icons text-base">upload_file</span>
            <span>Dodaj dokument</span>
          </button>
        </div>

        {showAddDoc && (
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg animate-fade-in">
            <h3 className="font-semibold mb-3">Prześlij nowy dokument</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Typ dokumentu</label>
                <select className="w-full bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-[#374151] rounded-md px-3 py-2 text-sm">
                  <option>Specyfikacja techniczna</option>
                  <option>Dokumentacja API</option>
                  <option>User Guide</option>
                  <option>Wymagania biznesowe</option>
                  <option>Inne</option>
                </select>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    alert("Wybierz plik do przesłania\n(demo - file upload)");
                    setShowAddDoc(false);
                  }}
                  className="flex-1 px-4 py-2 text-sm bg-[#4F46E5] text-white rounded-md hover:bg-indigo-700"
                >
                  Wybierz plik
                </button>
                <button
                  onClick={() => setShowAddDoc(false)}
                  className="px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-[#374151] rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Anuluj
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-[#374151] rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className="material-icons text-[#6B7280] dark:text-[#9CA3AF]">
                  {doc.type === "PDF" ? "picture_as_pdf" : "code"}
                </span>
                <div>
                  <h4 className="font-medium text-sm">{doc.name}</h4>
                  <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                    {doc.type} • {doc.size} • Przesłano: {doc.uploaded}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => alert(`Podgląd ${doc.name}\n(demo)`)}
                  className="p-1.5 text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1F2937] dark:hover:text-[#F9FAFB]"
                  title="Podgląd"
                >
                  <span className="material-icons text-base">visibility</span>
                </button>
                <button
                  onClick={() => alert(`Pobieranie ${doc.name}\n(demo)`)}
                  className="p-1.5 text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1F2937] dark:hover:text-[#F9FAFB]"
                  title="Pobierz"
                >
                  <span className="material-icons text-base">download</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Czy na pewno chcesz usunąć ${doc.name}?`)) {
                      alert(`Usunięto ${doc.name}\n(demo)`);
                    }
                  }}
                  className="p-1.5 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                  title="Usuń"
                >
                  <span className="material-icons text-base">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* General Settings */}
      <div className="bg-[#F9FAFB] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Ustawienia ogólne</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-sm">Automatyczna synchronizacja</h4>
              <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">Synchronizuj dane co 5 minut</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-sm">Powiadomienia</h4>
              <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">Otrzymuj alerty o konfliktach</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
