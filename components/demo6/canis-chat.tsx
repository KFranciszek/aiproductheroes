"use client";

import { useState } from "react";
import { useData } from "@/lib/demo6/data-context";
import { useUI } from "@/lib/demo6/ui-context";
import { SuggestionBanner } from "./suggestion-banner";
import { toast } from "sonner";

export function CanisChat() {
  const { chatThreads, addMessageToThread } = useData();
  const { selectedThreadId, setSelectedThreadId } = useUI();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const currentThread = chatThreads.find(t => t.id === selectedThreadId);
  const messages = currentThread?.messages || [];

  const handleSend = async () => {
    if (!message.trim() || !selectedThreadId) return;

    const userMessage = message;
    setMessage("");
    setIsLoading(true);

    // Add user message
    addMessageToThread(selectedThreadId, "user", userMessage);

    // Simulate AI response
    setTimeout(() => {
      addMessageToThread(selectedThreadId, "ai", "Dodaję AC do scenariuszy negatywnych. Chcesz wysłać do PM?");
      setIsLoading(false);
    }, 500);
  };

  const handleAction = (action: string) => {
    toast.success(`Akcja: ${action}`, {
      description: "Funkcja zostanie wkrótce zaimplementowana",
    });
  };

  return (
    <div className="space-y-4">
      <SuggestionBanner
        suggestionId="chat-upload-doc"
        title="Wskazówka"
        description="Przeciągnij dokument PDF aby Canis mógł odpowiadać na pytania o jego zawartość"
        actionLabel="Prześlij dokument"
        onAction={() => toast.info("Funkcja upload będzie dostępna wkrótce")}
      />
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
        {/* Threads Sidebar */}
        <div className="col-span-1 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-4">
          <h2 className="text-sm font-semibold mb-2">Wątki</h2>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4">ACME / SHOP</p>
          <ul className="space-y-2">
            {chatThreads.map(thread => (
              <li key={thread.id}>
                <button
                  className={`w-full flex items-center space-x-2 p-2 rounded-md transition-colors ${
                    selectedThreadId === thread.id
                      ? 'bg-primary-light dark:bg-primary-dark text-primary-dark dark:text-white font-medium'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-text-secondary-light dark:text-text-secondary-dark'
                  }`}
                  onClick={() => setSelectedThreadId(thread.id)}
                >
                  <span className="material-icons text-sm">chat_bubble_outline</span>
                  <span className="truncate text-sm">{thread.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Chat Area */}
        <div className="col-span-1 md:col-span-2 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg flex flex-col p-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="font-semibold">Chat Canis</h2>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">RAG nad dokumentacją i backlogiem</p>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">Docs</span>
              <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">API</span>
              <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">PM</span>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto mb-4 space-y-4 max-h-[400px]">
            {messages.map((msg, i) => (
              <div key={i} className="space-y-2">
                {msg.role === "ai" && (
                  <div className="flex items-start space-x-2">
                    <span className="material-icons text-primary text-base mt-0.5">auto_awesome</span>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                )}
                {msg.role === "user" && (
                  <div className="text-sm text-right">
                    <p>{msg.content}</p>
                  </div>
                )}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="flex flex-wrap gap-2 text-sm">
                    {msg.citations.map((cite, ci) => (
                      <span
                        key={ci}
                        className="bg-primary-light dark:bg-primary-dark text-primary-dark dark:text-white px-2 py-1 rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                        title={`${cite.fragment} (Confidence: ${(cite.confidence * 100).toFixed(0)}%)`}
                      >
                        {cite.source}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start space-x-2 animate-pulse">
                <span className="material-icons text-primary text-base mt-0.5">auto_awesome</span>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Canis myśli...</p>
              </div>
            )}
          </div>

          <div className="mt-4">
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Zadaj pytanie lub wklej fragment dokumentu..."
                rows={3}
                className="w-full bg-white dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-lg p-3 pr-24 text-sm focus:ring-primary focus:border-primary resize-none"
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
                  className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary disabled:opacity-50"
                >
                  <span className="material-icons">send</span>
                </button>
                <button
                  onClick={() => handleAction("Settings")}
                  className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary"
                >
                  <span className="material-icons">tune</span>
                </button>
                <button
                  onClick={() => handleAction("Upload")}
                  className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary"
                >
                  <span className="material-icons">upload_file</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sources Panel */}
        <div className="col-span-1 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-4">
          <h2 className="text-sm font-semibold mb-2">Źródła</h2>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4">Najtrafniejsze fragmenty</p>
          <div className="space-y-3">
            <div className="border border-border-light dark:border-border-dark rounded-lg p-3 text-sm">
              <p className="font-medium">Checkout_v2.pdf</p>
              <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs">„3DS wymagany powyżej 100 PLN..."</p>
            </div>
            <div className="border border-border-light dark:border-border-dark rounded-lg p-3 text-sm">
              <p className="font-medium">payments.yaml</p>
              <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs font-mono">threeDS: default: true</p>
            </div>
            <div className="border border-border-light dark:border-border-dark rounded-lg p-3 text-sm">
              <p className="font-medium">Pricing.md</p>
              <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs">„Limit 1500 PLN"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
