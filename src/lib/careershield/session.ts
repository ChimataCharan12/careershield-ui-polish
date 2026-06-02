import { create } from "zustand";
import { persist } from "zustand/middleware";

export type RiskLevel = "High" | "Medium" | "Low";

export interface HistoryRecord {
  id: string;
  date: string;
  time: string;
  type: "Risk Prediction" | "Skill Gap" | "Recommendations" | "Bulk Analysis";
  riskLevel: RiskLevel;
  riskScore: number;
  skillMatch: number;
  missingSkillsCount: number;
  missingSkills: string[];
  recommendations: string[];
  status: "In Progress" | "Completed";
  summary: string;
}

interface SessionState {
  currentSessionId: string;
  sessionStarted: string;
  sessionStatus: "In Progress" | "Completed";
  history: HistoryRecord[];
  riskResult: {
    score: number;
    level: RiskLevel;
    confidence: number;
    factors: string[];
  } | null;
  skillGapResult: {
    role: string;
    matchScore: number;
    matched: string[];
    partial: string[];
    missing: string[];
  } | null;
  bulkResult: {
    total: number;
    high: number;
    medium: number;
    low: number;
  } | null;
  newAnalysis: () => void;
  setRiskResult: (r: SessionState["riskResult"]) => void;
  setSkillGapResult: (r: SessionState["skillGapResult"]) => void;
  setBulkResult: (r: SessionState["bulkResult"]) => void;
  addHistory: (rec: Omit<HistoryRecord, "id" | "date" | "time">) => void;
}

const nextId = (history: HistoryRecord[], current: string) => {
  const nums = [current, ...history.map((h) => h.id)]
    .map((s) => parseInt(s.replace(/\D/g, ""), 10))
    .filter((n) => !isNaN(n));
  const max = nums.length ? Math.max(...nums) : 0;
  return "S" + String(max + 1).padStart(3, "0");
};

const nowDate = () =>
  new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
const nowTime = () =>
  new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

export const useSession = create<SessionState>()(
  persist(
    (set, get) => ({
      currentSessionId: "S001",
      sessionStarted: nowDate() + " " + nowTime(),
      sessionStatus: "In Progress",
      history: [],
      riskResult: null,
      skillGapResult: null,
      bulkResult: null,
      newAnalysis: () => {
        const { currentSessionId, history } = get();
        const id = nextId(history, currentSessionId);
        set({
          currentSessionId: id,
          sessionStarted: nowDate() + " " + nowTime(),
          sessionStatus: "In Progress",
          riskResult: null,
          skillGapResult: null,
          bulkResult: null,
        });
      },
      setRiskResult: (r) => set({ riskResult: r }),
      setSkillGapResult: (r) => set({ skillGapResult: r }),
      setBulkResult: (r) => set({ bulkResult: r }),
      addHistory: (rec) => {
        const { history, currentSessionId } = get();
        const exists = history.find((h) => h.id === currentSessionId);
        const newRec: HistoryRecord = {
          id: currentSessionId,
          date: nowDate(),
          time: nowTime(),
          ...rec,
        };
        const filtered = exists
          ? history.map((h) => (h.id === currentSessionId ? { ...h, ...newRec } : h))
          : [newRec, ...history];
        set({ history: filtered.slice(0, 20) });
      },
    }),
    { name: "careershield-session" }
  )
);
