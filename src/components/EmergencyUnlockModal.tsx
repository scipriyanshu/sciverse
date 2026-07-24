import React, { useState } from 'react';
import { ShieldAlert, Sparkles, X, CheckCircle2, XCircle } from 'lucide-react';

interface EmergencyUnlockModalProps {
  targetName: string;
  onClose: () => void;
  onGrantPass: (targetName: string) => void;
}

export const EmergencyUnlockModal: React.FC<EmergencyUnlockModalProps> = ({
  targetName,
  onClose,
  onGrantPass,
}) => {
  const [reason, setReason] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<{
    decision: 'APPROVED' | 'DENIED';
    reasoning: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    setIsEvaluating(true);
    setResult(null);

    try {
      const res = await fetch('/api/emergency-unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteOrApp: targetName, reason: reason.trim() }),
      });
      const data = await res.json();
      setResult(data);

      if (data.decision === 'APPROVED') {
        onGrantPass(targetName);
      }
    } catch (err) {
      console.error("Emergency unlock error:", err);
      setResult({
        decision: 'DENIED',
        reasoning: 'System judge unavailable. Defaulting to strict focus shield protection.'
      });
    } finally {
      setIsEvaluating(false);
    }
  };

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
          <ShieldAlert className="w-6 h-6 text-amber-500" />
          <div>
            <h3 className="text-sm font-bold tracking-[0.2em] text-white uppercase">
              Emergency Unlock Request
            </h3>
            <p className="text-xs font-mono text-neutral-400 mt-0.5">
              Target: <span className="text-white font-medium">{targetName}</span>
            </p>
          </div>
        </div>

        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs text-neutral-300 leading-relaxed font-sans">
              To request a temporary 10-minute bypass, you must justify your intent to the AI Executive Judge. Unnecessary distraction reasons will be rejected.
            </p>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-2">
                Why do you need to unlock {targetName}?
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. 'I need to watch a 5-minute video lecture on Lebesgue integration proof for Measure Theory class...'"
                rows={4}
                required
                className="w-full bg-neutral-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-white/40 resize-none font-mono"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs uppercase tracking-widest text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isEvaluating || !reason.trim()}
                className="bg-white text-black px-6 py-2.5 text-xs font-bold uppercase tracking-widest rounded-full hover:bg-neutral-200 disabled:opacity-40 transition-colors flex items-center gap-2 cursor-pointer"
              >
                {isEvaluating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    Evaluating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                    Submit to AI Judge
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6 animate-fadeIn">
            <div className={`p-4 rounded-xl border flex items-start gap-3 ${
              result.decision === 'APPROVED'
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-red-950/40 border-red-500/40 text-red-300'
            }`}>
              {result.decision === 'APPROVED' ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
              )}
              <div>
                <span className="text-xs font-mono font-bold tracking-widest uppercase block">
                  Verdict: {result.decision}
                </span>
                <p className="text-xs mt-1.5 leading-relaxed font-sans text-neutral-200">
                  {result.reasoning}
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="bg-white text-black px-6 py-2 text-xs font-bold uppercase tracking-widest rounded-full hover:bg-neutral-200"
              >
                Acknowledge
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
