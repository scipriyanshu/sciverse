import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Sparkles, Send, ArrowRight, CheckCircle2, ListPlus } from 'lucide-react';
import { Task } from '../types/lifeos';

interface BrainDumpViewProps {
  onAddConvertedTasks: (tasks: Task[]) => void;
}

export const BrainDumpView: React.FC<BrainDumpViewProps> = ({ onAddConvertedTasks }) => {
  const [rawText, setRawText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedData, setParsedData] = useState<{
    tasks: Task[];
    projects: { name: string; goal: string }[];
    calendarEvents: { title: string; startTime: string; duration: string }[];
    summary: string;
  } | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setRawText((prev) => prev + (prev ? ' ' : '') + transcript);
      };

      rec.onerror = (e: any) => {
        console.error('Speech recognition error', e);
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Voice speech recognition is not supported natively in this browser, but you can type or paste your brain dump below!");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const processBrainDump = async () => {
    if (!rawText.trim()) return;
    setIsProcessing(true);
    setParsedData(null);

    try {
      const res = await fetch('/api/brain-dump', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawInput: rawText.trim() }),
      });
      const data = await res.json();
      setParsedData(data);
    } catch (err) {
      console.error("Brain dump error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyTasks = () => {
    if (parsedData?.tasks && parsedData.tasks.length > 0) {
      onAddConvertedTasks(parsedData.tasks);
      setParsedData(null);
      setRawText('');
    }
  };

  return (
    <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-[#0A0A0A] flex flex-col justify-between">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        <div>
          <h2 className="text-xs tracking-[0.4em] text-neutral-500 uppercase font-medium">
            Brain Dump Engine
          </h2>
          <p className="text-2xl font-light text-white mt-2">
            Speak or type messy, unorganized thoughts. AI turns them into structured priorities.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">
              Raw Input Stream
            </span>
            <button
              onClick={toggleRecording}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
                isRecording
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
              }`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              {isRecording ? 'Listening...' : 'Press to Speak'}
            </button>
          </div>

          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="e.g. 'I need to email professor, read chapter 4 of Measure Theory, buy protein, call parents at 7pm, prep research paper outline...'"
            rows={5}
            className="w-full bg-neutral-950/80 border border-white/10 rounded-xl p-4 text-sm text-white font-mono focus:outline-none focus:border-white/40 resize-none leading-relaxed"
          />

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRawText("I need to email professor about exam. Read chapter 4 Measure Theory. Buy milk and protein. Call parents at 8pm.")}
                className="text-[10px] font-mono text-neutral-500 hover:text-neutral-300 underline"
              >
                Load Example
              </button>
              {rawText && (
                <button
                  type="button"
                  onClick={() => { setRawText(''); setParsedData(null); }}
                  className="text-[10px] font-mono text-neutral-500 hover:text-red-400"
                >
                  Clear
                </button>
              )}
            </div>

            <button
              onClick={processBrainDump}
              disabled={isProcessing || !rawText.trim()}
              className="bg-white text-black px-8 py-3 rounded-full text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-200 transition-colors flex items-center gap-2 disabled:opacity-40 cursor-pointer shadow-lg"
            >
              {isProcessing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  Structuring with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                  Process Brain Dump
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Output Preview */}
        {parsedData && (
          <div className="bg-neutral-900/80 border border-white/20 rounded-2xl p-6 md:p-8 space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">
                  AI Conversion Output
                </span>
                <h3 className="text-xl font-light text-white mt-1">
                  {parsedData.summary}
                </h3>
              </div>

              <button
                onClick={handleApplyTasks}
                className="bg-emerald-500 text-black px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-emerald-400 transition-colors flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <ListPlus className="w-4 h-4" />
                Add to My Missions
              </button>
            </div>

            {/* Extracted Tasks */}
            {parsedData.tasks && parsedData.tasks.length > 0 && (
              <div>
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-3">
                  Extracted Tasks ({parsedData.tasks.length})
                </h4>
                <div className="space-y-2">
                  {parsedData.tasks.map((task, idx) => (
                    <div
                      key={idx}
                      className="bg-black/60 border border-white/5 p-3.5 rounded-xl flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded border ${
                            task.priority === 'high'
                              ? 'bg-red-950 text-red-400 border-red-800'
                              : task.priority === 'medium'
                              ? 'bg-amber-950 text-amber-400 border-amber-800'
                              : 'bg-neutral-900 text-neutral-400 border-neutral-700'
                          }`}
                        >
                          {task.priority}
                        </span>
                        <span className="text-sm text-white font-medium">{task.title}</span>
                      </div>
                      <span className="text-xs font-mono text-neutral-400">{task.deadline || 'Today'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Extracted Projects / Calendar Events if any */}
            {parsedData.calendarEvents && parsedData.calendarEvents.length > 0 && (
              <div>
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-2">
                  Scheduled Calendar Slots
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {parsedData.calendarEvents.map((evt, idx) => (
                    <div key={idx} className="bg-black/40 border border-white/5 p-3 rounded-lg font-mono text-xs text-neutral-300">
                      <span className="text-white font-medium">{evt.title}</span> — {evt.startTime}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
