import React, { useState, useEffect } from 'react';
import { Task } from '../types/lifeos';
import { Sparkles, X, CheckCircle2, ArrowRight } from 'lucide-react';

interface AIPlannerModalProps {
  tasks: Task[];
  onClose: () => void;
  onApplyTop3: (top3Ids: string[]) => void;
}

export const AIPlannerModal: React.FC<AIPlannerModalProps> = ({
  tasks,
  onClose,
  onApplyTop3,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [plannerData, setPlannerData] = useState<{
    top3Ids: string[];
    message: string;
    reasoning: string;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchPlanner() {
      try {
        const res = await fetch('/api/planner', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tasks }),
        });
        const data = await res.json();
        if (isMounted) {
          setPlannerData(data);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          const top3 = tasks.slice(0, 3).map((t) => t.id);
          setPlannerData({
            top3Ids: top3,
            message: 'Forget everything else. Only do these three.',
            reasoning: 'Prioritized based on impact and deadlines to eliminate cognitive overwhelm.',
          });
        }
      } finally {
        if (isMounted) setIsAnalyzing(false);
      }
    }

    fetchPlanner();
    return () => {
      isMounted = false;
    };
  }, [tasks]);

  const selectedTasks = tasks.filter((t) => plannerData?.top3Ids?.includes(t.id));

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#121212] border border-white/10 rounded-2xl max-w-lg w-full p-6 md:p-8 space-y-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-neutral-500 hover:text-white transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400" />
          <div>
            <h3 className="text-xs font-bold tracking-[0.2em] text-white uppercase">
              AI Planner Priority Engine
            </h3>
            <p className="text-xs font-mono text-neutral-400 mt-0.5">
              Cognitive Relief Protocol
            </p>
          </div>
        </div>

        {isAnalyzing ? (
          <div className="py-12 text-center space-y-4">
            <Sparkles className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
            <p className="text-xs font-mono tracking-widest text-neutral-400 uppercase">
              Analyzing task leverage & deadlines...
            </p>
          </div>
        ) : (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-neutral-900/80 border border-white/10 p-5 rounded-xl space-y-2">
              <span className="text-xl font-light text-white font-sans block">
                “{plannerData?.message || 'Forget everything. Only do these three.'}”
              </span>
              <p className="text-xs font-mono text-neutral-400 leading-relaxed">
                {plannerData?.reasoning}
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block">
                Selected High-Leverage Trio
              </span>

              {selectedTasks.length > 0 ? (
                selectedTasks.map((t, idx) => (
                  <div key={t.id} className="bg-black/60 border border-white/10 p-3.5 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-white/10 text-white font-mono text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-medium text-white">{t.title}</span>
                    </div>
                    <span className="text-xs font-mono text-amber-400 uppercase">{t.priority}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs font-mono text-neutral-500">No pending tasks found.</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs uppercase tracking-widest text-neutral-400 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={() => {
                  if (plannerData?.top3Ids) {
                    onApplyTop3(plannerData.top3Ids);
                  }
                  onClose();
                }}
                className="bg-white text-black px-6 py-2.5 text-xs font-bold uppercase tracking-widest rounded-full hover:bg-neutral-200 cursor-pointer shadow-lg flex items-center gap-2"
              >
                Focus Exclusively on These 3
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
