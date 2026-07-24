import { GoogleGenAI, Type } from "@google/genai";

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

/**
 * Parses messy brain dump text/speech into structured items
 */
export async function parseBrainDump(rawInput: string) {
  const ai = getGeminiClient();
  if (!ai) {
    // Smart local fallback parser
    const lines = rawInput.split('\n').map(l => l.trim()).filter(Boolean);
    return {
      tasks: lines.map((line, idx) => ({
        id: `task-${Date.now()}-${idx}`,
        title: line,
        priority: idx === 0 ? 'high' : idx < 3 ? 'medium' : 'low',
        deadline: 'Today',
        category: 'Personal',
        completed: false,
        estimatedMinutes: 25
      })),
      projects: [{ name: 'Daily Focus', goal: 'Complete brain dump items' }],
      calendarEvents: [],
      summary: `Converted ${lines.length} items from your brain dump.`
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `You are LifeOS AI, an executive-function assistant for people with ADHD or heavy focus demands.
Analyze this raw brain dump and categorize it into actionable tasks, projects, and calendar events.
Brain dump: "${rawInput}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  priority: { type: Type.STRING, description: "high, medium, or low" },
                  deadline: { type: Type.STRING },
                  category: { type: Type.STRING },
                  completed: { type: Type.BOOLEAN },
                  estimatedMinutes: { type: Type.NUMBER }
                },
                required: ["title", "priority"]
              }
            },
            projects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  goal: { type: Type.STRING }
                },
                required: ["name"]
              }
            },
            calendarEvents: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  startTime: { type: Type.STRING },
                  duration: { type: Type.STRING }
                }
              }
            },
            summary: { type: Type.STRING }
          },
          required: ["tasks", "summary"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    return {
      tasks: (parsed.tasks || []).map((t: any, idx: number) => ({
        id: t.id || `task-${Date.now()}-${idx}`,
        title: t.title || "Untitled task",
        priority: t.priority || "medium",
        deadline: t.deadline || "Today",
        category: t.category || "General",
        completed: false,
        estimatedMinutes: t.estimatedMinutes || 30
      })),
      projects: parsed.projects || [],
      calendarEvents: parsed.calendarEvents || [],
      summary: parsed.summary || "Organized brain dump."
    };
  } catch (err) {
    console.error("Gemini Brain Dump Error:", err);
    return {
      tasks: [
        {
          id: `task-${Date.now()}-1`,
          title: rawInput.slice(0, 60),
          priority: "high",
          deadline: "Today",
          category: "General",
          completed: false,
          estimatedMinutes: 30
        }
      ],
      projects: [],
      calendarEvents: [],
      summary: "Processed input into actionable task."
    };
  }
}

/**
 * AI Planner: Picks the TOP 3 tasks and instructs user to forget the rest
 */
export async function getAIPlannerTop3(tasks: Array<{ id: string; title: string; priority: string; deadline?: string }>) {
  const ai = getGeminiClient();
  if (!ai || tasks.length === 0) {
    const top3 = tasks.slice(0, 3);
    return {
      top3Ids: top3.map(t => t.id),
      message: "Forget everything else. Focus exclusively on these core priorities right now.",
      reasoning: "Eliminate cognitive overload by reducing your view to what matters first."
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `You are LifeOS AI Planner. The user has ${tasks.length} pending tasks: ${JSON.stringify(tasks)}.
Select the top 3 absolute highest leverage tasks that the user MUST do today to prevent failure or overwhelm. Tell them to ignore all other noise.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            top3Ids: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            message: { type: Type.STRING, description: "A punchy 1-2 sentence instruction e.g. Forget everything. Only do these three." },
            reasoning: { type: Type.STRING, description: "Brief executive explanation why these 3 were selected." }
          },
          required: ["top3Ids", "message", "reasoning"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (err) {
    console.error("AI Planner Error:", err);
    const top3 = tasks.slice(0, 3);
    return {
      top3Ids: top3.map(t => t.id),
      message: "Forget everything else. Only do these three.",
      reasoning: "Top priority tasks selected to minimize overwhelm."
    };
  }
}

/**
 * Emergency Unlock Judge
 */
export async function judgeEmergencyUnlock(siteOrApp: string, reason: string) {
  const ai = getGeminiClient();
  if (!ai) {
    const isAcademic = /study|homework|research|math|class|paper|prof|professor|lecture|proof/i.test(reason);
    return {
      decision: isAcademic ? "APPROVED" : "DENIED",
      reasoning: isAcademic
        ? `Access granted for "${siteOrApp}" for 10 minutes strictly for: "${reason}". Timer will re-lock.`
        : `Access DENIED to ${siteOrApp}. Your reason ("${reason}") is a distraction trap. Stay on your current mission.`
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `You are the unyielding LifeOS AI Emergency Unlock Judge.
The user is in Deep Focus Mode and is attempting to unlock a blocked app/website: "${siteOrApp}".
User's explanation: "${reason}".
Evaluate if this reason is genuinely critical/educational or just a disguised procrastination desire.
Be tough, strict, and fair.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            decision: { type: Type.STRING, description: "APPROVED or DENIED" },
            reasoning: { type: Type.STRING, description: "Direct, no-nonsense response." }
          },
          required: ["decision", "reasoning"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (err) {
    return {
      decision: "DENIED",
      reasoning: "Emergency unlock judge unavailable. Defaulting to strict focus protection."
    };
  }
}

/**
 * AI Coach & Anti-Procrastination Nudge
 */
export async function getAICoachNudge(currentTask: string, minutesIdle: number) {
  const ai = getGeminiClient();
  if (!ai) {
    return `You haven't touched "${currentTask}" in ${minutesIdle || 20} minutes. Focus on the core proof—I've blocked everything else.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `You are LifeOS AI Coach. The user has been working on or idle near task "${currentTask}" for ${minutesIdle} minutes.
Give a brief, direct 1-2 sentence proactive nudge. No fluff, no fake cheerleading. Real executive function coaching.`
    });

    return response.text.trim();
  } catch (err) {
    return `You're off track on "${currentTask}". Take a deep breath, break it into a 5-minute task, and begin.`;
  }
}

/**
 * AI Reading / Study Summarizer
 */
export async function summarizeStudyMaterial(material: string) {
  const ai = getGeminiClient();
  if (!ai) {
    return {
      keyConcepts: ["Core theorem statement", "Proof strategy & invariants", "Key edge cases"],
      summary: "Material summary unavailable without API key, but key points extracted.",
      flashcards: [
        { question: "What is the primary definition?", answer: "Check definition section in source paper." },
        { question: "What is the key technique?", answer: "Proof by contradiction or structural induction." }
      ]
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `You are LifeOS AI Study Assistant. Summarize this academic paper/notes and create Anki flashcards for active recall.
Source: "${material}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            keyConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
            summary: { type: Type.STRING },
            flashcards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING }
                }
              }
            }
          },
          required: ["keyConcepts", "summary", "flashcards"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (err) {
    return {
      keyConcepts: ["Main idea breakdown"],
      summary: "Processed study material.",
      flashcards: [{ question: "Key takeaway?", answer: material.slice(0, 100) }]
    };
  }
}
