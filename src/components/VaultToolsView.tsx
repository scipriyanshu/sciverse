import React, { useState } from 'react';
import { Flashcard } from '../types/lifeos';
import { BookOpen, Sparkles, HelpCircle, CheckCircle, RotateCw, Calendar, FileText } from 'lucide-react';

interface VaultToolsViewProps {
  flashcards: Flashcard[];
  onAddFlashcards: (newCards: Flashcard[]) => void;
  onToggleMastered: (id: string) => void;
}

export const VaultToolsView: React.FC<VaultToolsViewProps> = ({
  flashcards,
  onAddFlashcards,
  onToggleMastered,
}) => {
  const [activeTab, setActiveTab] = useState<'study' | 'flashcards' | 'timeline'>('study');

  // Study Assistant State
  const [studyText, setStudyText] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryResult, setSummaryResult] = useState<{
    keyConcepts: string[];
    summary: string;
    flashcards: { question: string; answer: string }[];
  } | null>(null);

  // Flashcards state
  const [flippedMap, setFlippedMap] = useState<Record<string, boolean>>({});

  const handleStudySummarize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studyText.trim()) return;

    setIsSummarizing(true);
    setSummaryResult(null);

    try {
      const res = await fetch('/api/study-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ material: studyText.trim() }),
      });
      const data = await res.json();
      setSummaryResult(data);

      if (data.flashcards && data.flashcards.length > 0) {
        const generated: Flashcard[] = data.flashcards.map((f: any, idx: number) => ({
          id: `gen-${Date.now()}-${idx}`,
          question: f.question,
          answer: f.answer,
          mastered: false,
        }));
        onAddFlashcards(generated);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSummarizing(false);
    }
  };

  const toggleCardFlip = (id: string) => {
    setFlippedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-[#0A0A0A] flex flex-col justify-between">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        {/* Header Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h2 className="text-xs tracking-[0.4em] text-neutral-500 uppercase font-medium">
              Vault & AI Knowledge Engine
            </h2>
            <p className="text-2xl font-light text-white mt-1">
              Active recall, paper summarization, and long-term life perspective.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-neutral-900 border border-white/10 p-1.5 rounded-full">
            <button
              onClick={() => setActiveTab('study')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest cursor-pointer transition-all ${
                activeTab === 'study' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              AI Study Assistant
            </button>
            <button
              onClick={() => setActiveTab('flashcards')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest cursor-pointer transition-all ${
                activeTab === 'flashcards' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Anki Flashcards ({flashcards.length})
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest cursor-pointer transition-all ${
                activeTab === 'timeline' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Life Weeks
            </button>
          </div>
        </div>

        {/* Tab 1: AI Study Assistant */}
        {activeTab === 'study' && (
          <div className="space-y-6">
            <form onSubmit={handleStudySummarize} className="bg-neutral-900/40 border border-white/10 rounded-2xl p-6 space-y-4">
              <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 block">
                Research Paper & Homework Breakdown
              </span>

              <textarea
                value={studyText}
                onChange={(e) => setStudyText(e.target.value)}
                placeholder="Paste research paper text, proof, textbook chapter, or complex homework question..."
                rows={5}
                className="w-full bg-neutral-950 border border-white/10 rounded-xl p-4 text-sm text-white font-mono focus:outline-none focus:border-white/40 resize-none leading-relaxed"
              />

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setStudyText("Lebesgue measure extends Jordan measure by defining measure on a broader σ-algebra of sets using outer measure m*(A) = inf { sum vol(Qk) }.")}
                  className="text-[10px] font-mono text-neutral-500 hover:text-neutral-300 underline"
                >
                  Load Sample Paper Excerpt
                </button>

                <button
                  type="submit"
                  disabled={isSummarizing || !studyText.trim()}
                  className="bg-white text-black px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-40 shadow-lg"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  {isSummarizing ? 'Analyzing with Gemini...' : 'Generate Flashcards & Summary'}
                </button>
              </div>
            </form>

            {summaryResult && (
              <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-6 space-y-6 animate-fadeIn">
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-2">
                    Executive Summary
                  </h3>
                  <p className="text-sm text-neutral-200 leading-relaxed font-sans">{summaryResult.summary}</p>
                </div>

                {summaryResult.keyConcepts && summaryResult.keyConcepts.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-2">
                      Key Concepts
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {summaryResult.keyConcepts.map((kc, idx) => (
                        <span key={idx} className="bg-black border border-white/10 px-3 py-1 rounded-full text-xs font-mono text-neutral-300">
                          • {kc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Anki Flashcards */}
        {activeTab === 'flashcards' && (
          <div className="space-y-6">
            <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 block">
              Active Recall Deck — Click card to flip
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {flashcards.map((card) => {
                const isFlipped = flippedMap[card.id];
                return (
                  <div
                    key={card.id}
                    onClick={() => toggleCardFlip(card.id)}
                    className={`min-h-[160px] p-6 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      card.mastered
                        ? 'border-emerald-500/40 bg-emerald-950/20'
                        : isFlipped
                        ? 'border-white/30 bg-neutral-900'
                        : 'border-white/10 bg-neutral-900/50 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-500">
                          {isFlipped ? 'Answer' : 'Question Prompt'}
                        </span>
                        <RotateCw className="w-3.5 h-3.5 text-neutral-600" />
                      </div>
                      <p className="text-sm font-medium text-white leading-relaxed">
                        {isFlipped ? card.answer : card.question}
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                      <span className="text-[10px] font-mono text-neutral-500">
                        {isFlipped ? 'Click to show question' : 'Click to reveal answer'}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleMastered(card.id);
                        }}
                        className={`text-[10px] font-mono px-3 py-1 rounded-full border transition-all ${
                          card.mastered
                            ? 'bg-emerald-500 text-black border-emerald-500 font-bold'
                            : 'border-white/10 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {card.mastered ? 'Mastered ✓' : 'Mark Mastered'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Life Weeks Timeline */}
        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 block">
                Life in Weeks (4,000 Weeks Perspective)
              </span>
              <p className="text-xs text-neutral-400 mt-1">
                Each square represents 1 week of a 80-year lifespan. Filled squares are lived weeks. Perspective brings focus.
              </p>
            </div>

            <div className="bg-neutral-900/40 border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="grid grid-cols-26 gap-1 max-h-60 overflow-y-auto p-2">
                {Array.from({ length: 52 * 25 }).map((_, idx) => {
                  const isLived = idx < 52 * 21; // ~21 years lived
                  return (
                    <div
                      key={idx}
                      className={`w-2 h-2 rounded-[1px] ${
                        isLived ? 'bg-white/40' : 'bg-white/5 border border-white/5'
                      }`}
                    />
                  );
                })}
              </div>

              <div className="flex justify-between items-center text-xs font-mono text-neutral-500 pt-2 border-t border-white/5">
                <span>Age 0</span>
                <span>Age 21 (Present)</span>
                <span>Age 80</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
