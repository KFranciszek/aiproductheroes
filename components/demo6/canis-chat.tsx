"use client";

import { useState } from "react";
import { Send, Sparkles, SlidersHorizontal, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useData } from "@/lib/demo6/data-context";
import { useUI } from "@/lib/demo6/ui-context";
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
    <div className="grid gap-4 md:grid-cols-12">
      {/* Threads Sidebar */}
      <Card className="md:col-span-3 p-4">
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Wątki</h3>
          <p className="text-sm text-muted-foreground">ACME / SHOP</p>
        </div>
        <ScrollArea className="h-[400px]">
          <div className="space-y-1">
            {chatThreads.map(thread => (
              <Button
                key={thread.id}
                variant={selectedThreadId === thread.id ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSelectedThreadId(thread.id)}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                <span className="truncate">{thread.title}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Chat Area */}
      <Card className="md:col-span-6 p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Chat Canis</h3>
            <p className="text-sm text-muted-foreground">RAG nad dokumentacją i backlogiem</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline">Docs</Badge>
            <Badge variant="outline">API</Badge>
            <Badge variant="outline">PM</Badge>
          </div>
        </div>

        <ScrollArea className="h-[320px] mb-4">
          <div className="space-y-3 pr-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[90%] rounded-xl p-3 animate-fade-in ${
                  msg.role === "ai"
                    ? "bg-muted/40"
                    : "bg-primary/10 ml-auto"
                }`}
              >
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </div>
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {msg.citations.map((cite, ci) => (
                      <Popover key={ci}>
                        <PopoverTrigger asChild>
                          <Badge variant="outline" className="text-xs cursor-pointer hover:bg-accent">
                            {cite.source}
                          </Badge>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="space-y-2">
                            <h4 className="font-semibold text-sm">{cite.source}</h4>
                            <p className="text-sm text-muted-foreground">{cite.fragment}</p>
                            <div className="text-xs text-muted-foreground">
                              Confidence: {(cite.confidence * 100).toFixed(0)}%
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="max-w-[90%] rounded-xl p-3 bg-muted/40 animate-pulse-subtle">
                <div className="text-sm text-muted-foreground">Canis myśli...</div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex items-start gap-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Zadaj pytanie lub wklej fragment dokumentu..."
            className="min-h-[60px] resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <div className="flex flex-col gap-2">
            <Button onClick={handleSend} disabled={isLoading || !message.trim()}>
              <Send className="h-4 w-4" />
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60">
                <div className="flex flex-col gap-2">
                  <Button variant="ghost" onClick={() => handleAction("Generate Story")}>
                    Generate Story
                  </Button>
                  <Button variant="ghost" onClick={() => handleAction("Verify")}>
                    Verify Requirements
                  </Button>
                  <Button variant="ghost" onClick={() => handleAction("Test Data")}>
                    Generate Test Data
                  </Button>
                  <Button variant="ghost" onClick={() => handleAction("Release Q&A")}>
                    Ask about Release
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            <Button variant="outline" size="icon">
              <Upload className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Sources Panel */}
      <Card className="md:col-span-3 p-4">
        <div className="mb-4">
          <h3 className="font-semibold">Źródła</h3>
          <p className="text-sm text-muted-foreground">Najtrafniejsze fragmenty</p>
        </div>
        <div className="space-y-3 text-sm">
          <div className="rounded-xl border p-3 bg-muted/30">
            <div className="font-semibold mb-1">Checkout_v2.pdf</div>
            <div className="text-muted-foreground">„3DS wymagany powyżej 100 PLN…"</div>
          </div>
          <div className="rounded-xl border p-3 bg-muted/30">
            <div className="font-semibold mb-1">payments.yaml</div>
            <div className="text-muted-foreground font-mono text-xs">threeDS: default: true</div>
          </div>
          <div className="rounded-xl border p-3 bg-muted/30">
            <div className="font-semibold mb-1">Pricing.md</div>
            <div className="text-muted-foreground">„Limit 1500 PLN"</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
