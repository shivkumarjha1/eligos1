"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Deviation } from "@/types";
import { 
  ShieldAlert, 
  AlertTriangle, 
  ClipboardList, 
  Search, 
  Building2, 
  Plus, 
  Edit3, 
  Strikethrough, 
  X, 
  Check, 
  CheckCircle, 
  CheckCircle2, 
  HeartPulse, 
  Activity, 
  FileText, 
  Layers, 
  Download, 
  Sparkles, 
  Lock, 
  ShieldCheck,
  Eye
} from "lucide-react";

export interface AdverseEvent {
  id: string;
  studyId: string;
  subjectId: string;
  term: string; // e.g. "ALT Elevation", "Akathisia", "Headache"
  onsetDate: string;
  resolutionDate?: string;
  severity: "Mild" | "Moderate" | "Severe" | "Life-Threatening" | "Fatal";
  isSae: boolean;
  isAesiOrEci: boolean;
  type: "TEAE (Treatment Emergent)" | "Pre-existing Condition";
  status: "Active" | "Resolved" | "Ongoing" | "Under Evaluation";
  narrative: string;
  isStruckOut?: boolean;
}

export interface SafetyScheduleRow {
  id: string;
  assessment: string;
  screening: string;
  randomization: string;
  dbp: string;
  endTreatment: string;
  followUp: string;
  isStruckOut?: boolean;
}

export interface DiscontinuationTrigger {
  id: string;
  number: number;
  title: string;
  description: string;
  isStruckOut?: boolean;
}

const INITIAL_ADVERSE_EVENTS: Record<string, AdverseEvent[]> = {
  "SLT-206-C118": [
    {
      id: "AE-040",
      studyId: "SLT-206-C118",
      subjectId: "NT-079",
      term: "Suicidal Ideation Grade 3",
      onsetDate: "2026-04-01",
      severity: "Severe",
      isSae: true,
      isAesiOrEci: true,
      type: "TEAE (Treatment Emergent)",
      status: "Under Evaluation",
      narrative: "Subject reported C-SSRS score 4 during Week 4 visit. Medical monitor notified within 24h.",
    },
    {
      id: "AE-041",
      studyId: "SLT-206-C118",
      subjectId: "NT-085",
      term: "Alanine Aminotransferase (ALT) Elevation > 3x ULN",
      onsetDate: "2026-03-28",
      severity: "Moderate",
      isSae: false,
      isAesiOrEci: true,
      type: "TEAE (Treatment Emergent)",
      status: "Active",
      narrative: "ALT 145 U/L at Visit 3. Protocol EC-18 trigger evaluated. Repeat lab scheduled in 48h.",
    },
  ],
  "MHT-2101-C01": [
    {
      id: "AE-M01",
      studyId: "MHT-2101-C01",
      subjectId: "101-002",
      term: "Transient Myalgia",
      onsetDate: "2026-06-26",
      severity: "Mild",
      isSae: false,
      isAesiOrEci: false,
      type: "TEAE (Treatment Emergent)",
      status: "Resolved",
      narrative: "Mild localized muscle soreness following infusion, resolved spontaneously within 48h.",
    },
  ],
};

const INITIAL_DEVIATIONS: Deviation[] = [
  {
    id: "DEV-101",
    studyId: "SLT-206-C118",
    subjectId: "NT-085",
    date: "2026-04-01",
    category: "Out-of-Window Visit",
    description: "Week 4 clinical rating visit conducted on Day 31 (protocol window Day 28 ± 2 days).",
    severity: "Minor",
    status: "Approved",
  },
  {
    id: "DEV-102",
    studyId: "SLT-206-C118",
    subjectId: "NT-079",
    date: "2026-03-31",
    category: "Inclusion/Exclusion Waiver",
    description: "Subject baseline MADRS 23 enrolled under PI waiver (protocol minimum requirement: 24).",
    severity: "Major",
    status: "Pending",
  },
];

const INITIAL_SCHEDULE_ROWS: SafetyScheduleRow[] = [
  {
    id: "sch-1",
    assessment: "Triplicate 12-Lead ECG",
    screening: "✓ (Triplicate)",
    randomization: "✓ (Triplicate)",
    dbp: "—",
    endTreatment: "✓ (Triplicate)",
    followUp: "F1 Only",
  },
  {
    id: "sch-2",
    assessment: "C-SSRS Suicidality",
    screening: "✓ (Baseline)",
    randomization: "✓ (Since last)",
    dbp: "✓ (Every visit)",
    endTreatment: "✓ (Every visit)",
    followUp: "✓ (Every visit)",
  },
  {
    id: "sch-3",
    assessment: "YMRS Mania Scale",
    screening: "✓ (Threshold ≤ 12)",
    randomization: "✓ (Every visit)",
    dbp: "✓ (Every visit)",
    endTreatment: "✓ (Every visit)",
    followUp: "✓ (Every visit)",
  },
  {
    id: "sch-4",
    assessment: "AUA-SI (Urinary)",
    screening: "✓ (Baseline score)",
    randomization: "✓ (Every visit)",
    dbp: "V3, V5 Only",
    endTreatment: "✓ (Every visit)",
    followUp: "F2 Only",
  },
  {
    id: "sch-5",
    assessment: "Dilated Ophthalmology",
    screening: "✓ (BCVA, OCT RNFL)",
    randomization: "—",
    dbp: "—",
    endTreatment: "✓ (Within 2 weeks)",
    followUp: "—",
  },
  {
    id: "sch-6",
    assessment: "Urine Toxicology",
    screening: "Central Lab",
    randomization: "✓ (Confirm negative)",
    dbp: "—",
    endTreatment: "✓ (Every visit)",
    followUp: "—",
  },
];

const INITIAL_TRIGGERS: DiscontinuationTrigger[] = [
  {
    id: "trig-1",
    number: 1,
    title: "Subject Request",
    description: "Participant requests discontinuation of study drug for any reason.",
  },
  {
    id: "trig-2",
    number: 2,
    title: "Maculopathy Finding",
    description: "Acquired vitreiform maculopathy, drug-related RPE abnormalities, or other ophthalmologic findings.",
  },
  {
    id: "trig-3",
    number: 3,
    title: "Cardiac Conduction",
    description: "Any change in cardiac rhythm or AV conduction that constitutes a threat to participant safety.",
  },
  {
    id: "trig-4",
    number: 4,
    title: "QTcF Prolongation",
    description: "Documented QTcF prolongation > 500 msec, verified by triplicate measurements.",
  },
  {
    id: "trig-5",
    number: 5,
    title: "Blood Pressure Limits",
    description: "Persistent systolic BP > 180 mmHg or dBP > 110 mmHg, verified by 3 successive measurements.",
  },
  {
    id: "trig-6",
    number: 6,
    title: "Pregnancy Confirmed",
    description: "Confirmation of pregnancy during the study from a positive serum pregnancy test.",
  },
  {
    id: "trig-7",
    number: 7,
    title: "Suicidal Ideation/Behavior",
    description: "Occurrence of significant suicidal ideation (C-SSRS score ≥ 4) or self-harm behavior.",
  },
  {
    id: "trig-8",
    number: 8,
    title: "Mania Emergence",
    description: "Occurrence of mania indicated by a Young Mania Rating Scale (YMRS) score > 20.",
  },
  {
    id: "trig-9",
    number: 9,
    title: "Hepatic Impairment",
    description: "ALT/AST levels > 3 times the upper limit of normal (ULN) or Child-Pugh score > 6.",
  },
];

const PROTOCOL_OPTIONS = [
  { 
    id: "SLT-206-C118", 
    label: "SLT-206-C118 Cerevastatin · Cerevastatin in Depressive Episodes Associated With Bipolar I or II Disorder (Bipolar Depression)" 
  },
  { 
    id: "MHT-2101-C01", 
    label: "MHT-2101-C01 MYOGUARD-1 · MYOGUARD-1 Phase III Voss-Kellerman Congenital Myopathy" 
  },
  { 
    id: "GAD-002-NEXUS", 
    label: "GAD-002-NEXUS · NEXUS Phase II Generalized Anxiety Disorder Protocol" 
  },
  { 
    id: "SCZ-005-APOLLO", 
    label: "SCZ-005-APOLLO · APOLLO Phase II Schizophrenia Study" 
  },
  { 
    id: "XPF-010-BS01", 
    label: "XPF-010-BS01 · X-CEED Phase III Bipolar Depression Protocol" 
  },
  { 
    id: "TEST-001-DEMO", 
    label: "TEST-001-DEMO · Zephyr Test Demo Study" 
  },
];

export const SafetyHubSection: React.FC = () => {
  const { currentUser } = useAuth();
  
  // Selected protocol state
  const [activeStudy, setActiveStudy] = useState<string>("SLT-206-C118");

  // Sub-Navigation Tabs State
  const [activeTab, setActiveTab] = useState<
    "registry" | "aesi" | "signals" | "guidelines" | "deviations"
  >("registry");

  // Adverse Events Database
  const [aeDb, setAeDb] = useState<Record<string, AdverseEvent[]>>(INITIAL_ADVERSE_EVENTS);

  // Deviations Database
  const [deviations, setDeviations] = useState<Deviation[]>(INITIAL_DEVIATIONS);

  // Safety Schedule Rows
  const [scheduleRows, setScheduleRows] = useState<SafetyScheduleRow[]>(INITIAL_SCHEDULE_ROWS);

  // Discontinuation Triggers
  const [triggers, setTriggers] = useState<DiscontinuationTrigger[]>(INITIAL_TRIGGERS);

  React.useEffect(() => {
    try {
      const savedAe = localStorage.getItem("eligos_safety_ae_db");
      if (savedAe) setAeDb(JSON.parse(savedAe));

      const savedDev = localStorage.getItem("eligos_safety_deviations");
      if (savedDev) setDeviations(JSON.parse(savedDev));

      const savedSch = localStorage.getItem("eligos_safety_schedule");
      if (savedSch) setScheduleRows(JSON.parse(savedSch));

      const savedTrig = localStorage.getItem("eligos_safety_triggers");
      if (savedTrig) setTriggers(JSON.parse(savedTrig));
    } catch (e) {
      console.error("Failed to load safety hub state from localStorage", e);
    }
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem("eligos_safety_ae_db", JSON.stringify(aeDb));
    } catch (e) {
      console.error("Failed to save AE db to localStorage", e);
    }
  }, [aeDb]);

  React.useEffect(() => {
    try {
      localStorage.setItem("eligos_safety_deviations", JSON.stringify(deviations));
    } catch (e) {
      console.error("Failed to save safety deviations to localStorage", e);
    }
  }, [deviations]);

  React.useEffect(() => {
    try {
      localStorage.setItem("eligos_safety_schedule", JSON.stringify(scheduleRows));
    } catch (e) {
      console.error("Failed to save safety schedule to localStorage", e);
    }
  }, [scheduleRows]);

  React.useEffect(() => {
    try {
      localStorage.setItem("eligos_safety_triggers", JSON.stringify(triggers));
    } catch (e) {
      console.error("Failed to save safety triggers to localStorage", e);
    }
  }, [triggers]);

  // Modals State
  const [showAeModal, setShowAeModal] = useState(false);
  const [showDevModal, setShowDevModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showTriggerModal, setShowTriggerModal] = useState(false);

  // Form States for Log New Adverse Event
  const [aeSubjectId, setAeSubjectId] = useState("");
  const [aeTerm, setAeTerm] = useState("");
  const [aeOnset, setAeOnset] = useState(new Date().toISOString().substring(0, 10));
  const [aeSeverity, setAeSeverity] = useState<AdverseEvent["severity"]>("Moderate");
  const [aeIsSae, setAeIsSae] = useState(false);
  const [aeIsAesi, setAeIsAesi] = useState(false);
  const [aeType, setAeType] = useState<AdverseEvent["type"]>("TEAE (Treatment Emergent)");
  const [aeNarrative, setAeNarrative] = useState("");

  // Form States for Log New Deviation
  const [devSubjectId, setDevSubjectId] = useState("");
  const [devCategory, setDevCategory] = useState("Inclusion/Exclusion Violation");
  const [devDescription, setDevDescription] = useState("");
  const [devSeverity, setDevSeverity] = useState<"Minor" | "Major" | "Critical">("Major");

  // Form States for Schedule Row
  const [schAssessment, setSchAssessment] = useState("");
  const [schScreening, setSchScreening] = useState("✓ (Baseline)");
  const [schRandomization, setSchRandomization] = useState("✓ (Every visit)");

  // Form States for Trigger
  const [trigTitle, setTrigTitle] = useState("");
  const [trigDesc, setTrigDesc] = useState("");

  // Active Adverse Events for current study
  const currentAeList = aeDb[activeStudy] || [];

  // AESI / ECI filtered list
  const currentAesiList = currentAeList.filter((a) => a.isAesiOrEci);

  // Active Deviations for current study
  const currentDeviations = deviations.filter((d) => d.studyId === activeStudy || activeStudy.includes(d.studyId) || d.studyId === "SLT-206-C118");

  // Metric counts
  const sae24hCount = currentAeList.filter((a) => a.isSae).length;
  const aesiCount = currentAesiList.length;

  // Toggle Strikeout Adverse Event
  const handleToggleStrikeAe = (id: string) => {
    setAeDb((prev) => ({
      ...prev,
      [activeStudy]: (prev[activeStudy] || []).map((a) =>
        a.id === id ? { ...a, isStruckOut: !a.isStruckOut } : a
      ),
    }));
  };

  // Toggle Strikeout Schedule Row
  const handleToggleStrikeSchedule = (id: string) => {
    setScheduleRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isStruckOut: !r.isStruckOut } : r))
    );
  };

  // Toggle Strikeout Trigger
  const handleToggleStrikeTrigger = (id: string) => {
    setTriggers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isStruckOut: !t.isStruckOut } : t))
    );
  };

  // Submit AE Form
  const handleSubmitAe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aeSubjectId || !aeTerm) return;

    const newAe: AdverseEvent = {
      id: `AE-0${Math.floor(42 + Math.random() * 50)}`,
      studyId: activeStudy,
      subjectId: aeSubjectId,
      term: aeTerm,
      onsetDate: aeOnset,
      severity: aeSeverity,
      isSae: aeIsSae,
      isAesiOrEci: aeIsAesi || aeIsSae,
      type: aeType,
      status: "Under Evaluation",
      narrative: aeNarrative || "Adverse event reported and under medical review.",
    };

    setAeDb((prev) => ({
      ...prev,
      [activeStudy]: [newAe, ...(prev[activeStudy] || [])],
    }));

    setShowAeModal(false);
    setAeSubjectId("");
    setAeTerm("");
    setAeNarrative("");
  };

  // Submit Deviation Form
  const handleSubmitDev = (e: React.FormEvent) => {
    e.preventDefault();
    if (!devSubjectId || !devDescription) return;

    const newDev: Deviation = {
      id: `DEV-${Math.floor(103 + Math.random() * 90)}`,
      studyId: activeStudy,
      subjectId: devSubjectId,
      date: new Date().toISOString().substring(0, 10),
      category: devCategory,
      description: devDescription,
      severity: devSeverity,
      status: "Pending",
    };

    setDeviations([newDev, ...deviations]);
    setShowDevModal(false);
    setDevSubjectId("");
    setDevDescription("");
  };

  // Approve Deviation
  const handleApproveDev = (id?: string) => {
    setDeviations((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "Approved" } : d))
    );
  };

  // Submit Schedule Row
  const handleSubmitSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schAssessment) return;
    const newRow: SafetyScheduleRow = {
      id: `sch-${Date.now()}`,
      assessment: schAssessment,
      screening: schScreening,
      randomization: schRandomization,
      dbp: "✓ (Every visit)",
      endTreatment: "✓ (Every visit)",
      followUp: "F1 Only",
    };
    setScheduleRows([...scheduleRows, newRow]);
    setShowScheduleModal(false);
    setSchAssessment("");
  };

  // Submit Trigger Card
  const handleSubmitTrigger = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trigTitle || !trigDesc) return;
    const newTrig: DiscontinuationTrigger = {
      id: `trig-${Date.now()}`,
      number: triggers.length + 1,
      title: trigTitle,
      description: trigDesc,
    };
    setTriggers([...triggers, newTrig]);
    setShowTriggerModal(false);
    setTrigTitle("");
    setTrigDesc("");
  };

  return (
    <div className="space-y-6 font-sans text-slate-800">
      {/* Title & Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-rose-600" />
          Safety Hub & Signal Monitor
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Record Adverse Events, Serious Adverse Events (SAEs), and track special clinical interests
        </p>
      </div>

      {/* Select Study Protocol Filter (Exact Match to Screenshots) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
        <select
          value={activeStudy}
          onChange={(e) => setActiveStudy(e.target.value)}
          className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer shadow-2xs"
        >
          {PROTOCOL_OPTIONS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sub-Navigation Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab("registry")}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "registry"
              ? "bg-[#1D64EC] text-white shadow-2xs font-extrabold"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80"
          }`}
        >
          📋 Adverse Events Registry ({currentAeList.length})
        </button>

        <button
          onClick={() => setActiveTab("aesi")}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "aesi"
              ? "bg-[#1D64EC] text-white shadow-2xs font-extrabold"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80"
          }`}
        >
          🔍 AESI & ECI Flags ({currentAesiList.length})
        </button>

        <button
          onClick={() => setActiveTab("signals")}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "signals"
              ? "bg-[#1D64EC] text-white shadow-2xs font-extrabold"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80"
          }`}
        >
          🛡️ Medical Monitor Signals & Alerts
        </button>

        <button
          onClick={() => setActiveTab("guidelines")}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "guidelines"
              ? "bg-[#1D64EC] text-white shadow-2xs font-extrabold"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80"
          }`}
        >
          🛡️ Protocol Safety Guidelines
        </button>

        <button
          onClick={() => setActiveTab("deviations")}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "deviations"
              ? "bg-[#1D64EC] text-white shadow-2xs font-extrabold"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80"
          }`}
        >
          ⚠️ Protocol Deviations Tracker ({currentDeviations.length})
        </button>
      </div>

      {/* TAB 1: ADVERSE EVENTS REGISTRY (Screenshot 1) */}
      {activeTab === "registry" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden space-y-4 p-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">
              ADVERSE EVENTS LOG
            </h3>
            <button
              onClick={() => setShowAeModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1D64EC] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
            >
              <Plus className="w-3.5 h-3.5" /> Log New Adverse Event (AE/SAE)
            </button>
          </div>

          {currentAeList.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 font-medium">
              No adverse events logged for this study.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/70 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">EVENT ID</th>
                    <th className="px-4 py-3">SUBJECT ID</th>
                    <th className="px-4 py-3">ADVERSE EVENT TERM</th>
                    <th className="px-4 py-3">ONSET DATE</th>
                    <th className="px-4 py-3">SEVERITY</th>
                    <th className="px-4 py-3">SERIOUS (SAE)</th>
                    <th className="px-4 py-3">AESI/ECI</th>
                    <th className="px-4 py-3">TYPE</th>
                    <th className="px-4 py-3">STATUS</th>
                    <th className="px-4 py-3">NARRATIVE</th>
                    <th className="px-4 py-3 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentAeList.map((ae) => (
                    <tr key={ae.id} className={`hover:bg-slate-50/80 transition ${ae.isStruckOut ? "bg-slate-50/60" : ""}`}>
                      <td className="px-4 py-3 font-mono font-extrabold text-slate-900">{ae.id}</td>
                      <td className="px-4 py-3 font-bold text-slate-800">{ae.subjectId}</td>
                      <td className={`px-4 py-3 font-extrabold text-slate-900 ${ae.isStruckOut ? "line-through text-slate-400 opacity-60" : ""}`}>
                        {ae.term}
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-600">{ae.onsetDate}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            ae.severity === "Severe" || ae.severity === "Life-Threatening" || ae.severity === "Fatal"
                              ? "bg-rose-100 text-rose-800 border border-rose-200"
                              : ae.severity === "Moderate"
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : "bg-blue-100 text-blue-800 border border-blue-200"
                          }`}
                        >
                          {ae.severity}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold">
                        {ae.isSae ? (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-rose-600 text-white font-extrabold">
                            SAE YES
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">No</span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-bold">
                        {ae.isAesiOrEci ? (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-900 border border-amber-300 font-extrabold">
                            AESI
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">No</span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-600 text-[11px]">{ae.type}</td>
                      <td className="px-4 py-3 font-bold text-slate-800">{ae.status}</td>
                      <td className={`px-4 py-3 max-w-xs text-slate-600 font-medium truncate ${ae.isStruckOut ? "line-through text-slate-400 opacity-60" : ""}`} title={ae.narrative}>
                        {ae.narrative}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleToggleStrikeAe(ae.id)}
                          className={`p-1 transition rounded ${
                            ae.isStruckOut
                              ? "text-slate-700 bg-slate-200 font-bold"
                              : "text-slate-400 hover:text-amber-600 hover:bg-amber-50"
                          }`}
                          title={ae.isStruckOut ? "Un-strike AE" : "Strike Out AE (Retain Audit Record)"}
                        >
                          <Strikethrough className="w-3.5 h-3.5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: AESI & ECI FLAGS (Screenshot 2) */}
      {activeTab === "aesi" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden space-y-4 p-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">
              ADVERSE EVENTS OF SPECIAL INTEREST (AESI) &amp; EVENTS OF CLINICAL INTEREST (ECI)
            </h3>
          </div>

          {/* Yellow Regulatory Notice Box */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5 flex items-center gap-2 text-xs text-amber-950 font-semibold">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              <strong className="text-amber-900">Regulatory Notice:</strong> These events are flagged for secondary evaluation to identify compound safety signals.
            </span>
          </div>

          {currentAesiList.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 font-medium">
              No adverse events logged for this study.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/70 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">EVENT ID</th>
                    <th className="px-4 py-3">SUBJECT ID</th>
                    <th className="px-4 py-3">ADVERSE EVENT TERM</th>
                    <th className="px-4 py-3">ONSET DATE</th>
                    <th className="px-4 py-3">SEVERITY</th>
                    <th className="px-4 py-3">SERIOUS (SAE)</th>
                    <th className="px-4 py-3">AESI/ECI</th>
                    <th className="px-4 py-3">TYPE</th>
                    <th className="px-4 py-3">STATUS</th>
                    <th className="px-4 py-3">NARRATIVE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentAesiList.map((ae) => (
                    <tr key={ae.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3 font-mono font-extrabold text-slate-900">{ae.id}</td>
                      <td className="px-4 py-3 font-bold text-slate-800">{ae.subjectId}</td>
                      <td className="px-4 py-3 font-extrabold text-slate-900">{ae.term}</td>
                      <td className="px-4 py-3 font-mono text-slate-600">{ae.onsetDate}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          {ae.severity}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold">
                        {ae.isSae ? (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-rose-600 text-white font-extrabold">
                            SAE YES
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">No</span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-bold">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-900 border border-amber-300 font-extrabold">
                          AESI/ECI
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-600 text-[11px]">{ae.type}</td>
                      <td className="px-4 py-3 font-bold text-slate-800">{ae.status}</td>
                      <td className="px-4 py-3 max-w-xs text-slate-600 font-medium truncate" title={ae.narrative}>
                        {ae.narrative}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MEDICAL MONITOR SIGNALS & ALERTS (Screenshot 3) */}
      {activeTab === "signals" && (
        <div className="space-y-6">
          {/* Top 3 KPI Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: SAE ALERTS (24H WINDOW) */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                SAE ALERTS (24H WINDOW)
              </div>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-black text-rose-600">{sae24hCount}</div>
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-rose-600" /> {sae24hCount} Active Signals
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Requires CIOMS reporting within 24 hours of site awareness
              </p>
            </div>

            {/* Card 2: PREGNANCY LOGS */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                PREGNANCY LOGS
              </div>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-black text-purple-700">0</div>
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
                  🤰 Active Protocols
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Mandatory study drug discontinuation and surveillance
              </p>
            </div>

            {/* Card 3: SPECIAL INTEREST FLAGS */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                SPECIAL INTEREST FLAGS
              </div>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-black text-amber-600">{aesiCount}</div>
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                  <Search className="w-3 h-3 text-amber-600" /> Signal Tracking
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Events of special clinical interest monitored by Safety Board
              </p>
            </div>
          </div>

          {/* Main Container: SAFETY SIGNAL INTELLIGENCE SUMMARY */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <div className="text-xs font-black text-slate-400 uppercase tracking-wider">
              SAFETY SIGNAL INTELLIGENCE SUMMARY
            </div>

            <div className="space-y-3 text-xs">
              {/* Signal Box 1 */}
              <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-4 text-rose-950 font-medium leading-relaxed">
                <strong className="text-rose-900 font-black">Elevated ALT Signal Flagged:</strong> ALT elevations satisfy criteria for Exclusion EC-18 / Safety ECI. Hold dose and repeat labs within 48h.
              </div>

              {/* Signal Box 2 */}
              <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-4 text-purple-950 font-medium leading-relaxed">
                <strong className="text-purple-900 font-black">Pregnancy Discontinuation Protocol:</strong> Confirm pregnancy results. Protocol 5.2 mandate: immediately withdraw investigational product, complete Early Termination visit, and log follow-up pregnancy tracking sheet.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PROTOCOL SAFETY GUIDELINES (Screenshot 4) */}
      {activeTab === "guidelines" && (
        <div className="space-y-6">
          {/* Top Section Card: STUDY OBJECTIVES & ENDPOINTS */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">
                {activeStudy} SAFETY OBJECTIVES &amp; ENDPOINTS
              </h3>
              <button className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition">
                <Edit3 className="w-3.5 h-3.5" /> Edit Endpoints
              </button>
            </div>

            <p className="text-xs text-slate-500 font-medium">
              The primary safety objective is to evaluate the safety and tolerability of investigational product. Key endpoints tracked:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs text-slate-700 font-medium">
              <ul className="space-y-1.5 list-disc list-inside">
                <li>Severity and frequency of TEAEs, SAEs, AEs, and ECIs.</li>
                <li>Triplicate 12-lead ECGs (triplicate readings taken within 15 minutes).</li>
                <li>Suicidal ideation &amp; behavior monitored using C-SSRS at every visit.</li>
                <li>Optical coherence tomography (OCT) for RNFL thickness &amp; macula abnormalities.</li>
              </ul>
              <ul className="space-y-1.5 list-disc list-inside">
                <li>Potentially clinically significant abnormalities in vital signs &amp; weight.</li>
                <li>Changes in manic symptoms as measured by Young Mania Rating Scale (YMRS).</li>
                <li>Changes in urological symptoms as measured by the AUA-SI.</li>
                <li>Comprehensive clinical chemistry, hematology, and endocrinology labs.</li>
              </ul>
            </div>
          </div>

          {/* Middle Table Card: PROTOCOL-SPECIFIED SAFETY MONITORING SCHEDULE */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">
                PROTOCOL-SPECIFIED SAFETY MONITORING SCHEDULE
              </h3>
              <button
                onClick={() => setShowScheduleModal(true)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg transition"
              >
                <Plus className="w-3.5 h-3.5" /> Add Schedule Row
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">ASSESSMENT</th>
                    <th className="px-4 py-3">SCREENING (V1)</th>
                    <th className="px-4 py-3">RANDOMIZATION (V2)</th>
                    <th className="px-4 py-3">DBP (V3-V5)</th>
                    <th className="px-4 py-3">END TREATMENT (V6)</th>
                    <th className="px-4 py-3">FOLLOW-UP (F1-F2)</th>
                    <th className="px-4 py-3 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {scheduleRows.map((r) => (
                    <tr key={r.id} className={`hover:bg-slate-50/80 transition ${r.isStruckOut ? "bg-slate-50/60" : ""}`}>
                      <td className={`px-4 py-3 font-extrabold text-slate-900 ${r.isStruckOut ? "line-through text-slate-400 opacity-60" : ""}`}>{r.assessment}</td>
                      <td className="px-4 py-3 font-semibold text-slate-700">{r.screening}</td>
                      <td className="px-4 py-3 font-semibold text-slate-700">{r.randomization}</td>
                      <td className="px-4 py-3 font-semibold text-slate-700">{r.dbp}</td>
                      <td className="px-4 py-3 font-semibold text-slate-700">{r.endTreatment}</td>
                      <td className="px-4 py-3 font-semibold text-slate-700">{r.followUp}</td>
                      <td className="px-4 py-3 text-right space-x-1">
                        <button
                          onClick={() => handleToggleStrikeSchedule(r.id)}
                          className={`p-1 transition rounded ${
                            r.isStruckOut
                              ? "text-slate-700 bg-slate-200 font-bold"
                              : "text-slate-400 hover:text-amber-600 hover:bg-amber-50"
                          }`}
                          title={r.isStruckOut ? "Un-strike Row" : "Strike Out Row"}
                        >
                          <Strikethrough className="w-3.5 h-3.5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Card: MANDATORY STUDY DRUG DISCONTINUATION TRIGGERS */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-black text-rose-600 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                MANDATORY STUDY DRUG DISCONTINUATION TRIGGERS
              </h3>
              <button
                onClick={() => setShowTriggerModal(true)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 hover:text-rose-900 bg-rose-50 px-3 py-1.5 rounded-lg transition"
              >
                <Plus className="w-3.5 h-3.5" /> Add Trigger
              </button>
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-900 font-semibold">
              <strong className="font-extrabold text-rose-950">Protocol Section 8.3 Mandate:</strong> Study drug MUST be immediately and permanently withdrawn if any of the following safety events occur:
            </div>

            {/* Grid of 9 Discontinuation Trigger Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {triggers.map((trig) => (
                <div
                  key={trig.id}
                  className={`bg-rose-50/40 border border-rose-200 rounded-xl p-4 space-y-1.5 relative group ${
                    trig.isStruckOut ? "bg-slate-50 opacity-60" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className={`font-extrabold text-rose-900 text-xs ${trig.isStruckOut ? "line-through text-slate-400" : ""}`}>
                      {trig.number}. {trig.title}
                    </div>
                    <button
                      onClick={() => handleToggleStrikeTrigger(trig.id)}
                      className="text-slate-400 hover:text-amber-600 p-0.5 rounded transition"
                      title="Toggle Strikeout"
                    >
                      <Strikethrough className="w-3.5 h-3.5 inline" />
                    </button>
                  </div>
                  <p className={`text-[11px] text-rose-950 font-medium leading-relaxed ${trig.isStruckOut ? "line-through text-slate-400" : ""}`}>
                    {trig.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PROTOCOL DEVIATIONS TRACKER (User Specific Requirement) */}
      {activeTab === "deviations" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Protocol Deviations Tracker ({currentDeviations.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Log and review clinical protocol deviations, inclusion/exclusion waivers, and GCP safety exceptions.
              </p>
            </div>
            <button
              onClick={() => setShowDevModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1D64EC] hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition"
            >
              <Plus className="w-4 h-4" /> Log New Deviation
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-400 font-extrabold uppercase border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3">Dev ID</th>
                    <th className="px-5 py-3">Subject ID</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Category</th>
                    <th className="px-5 py-3">Description</th>
                    <th className="px-5 py-3">Severity</th>
                    <th className="px-5 py-3 text-right">Status / Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentDeviations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-8 text-center text-slate-400 font-medium">
                        No protocol deviations logged for study {activeStudy}.
                      </td>
                    </tr>
                  ) : (
                    currentDeviations.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-50">
                        <td className="px-5 py-3 font-bold font-mono text-slate-900">{d.id}</td>
                        <td className="px-5 py-3 font-bold text-slate-900">{d.subjectId}</td>
                        <td className="px-5 py-3 font-mono text-slate-600">{d.date}</td>
                        <td className="px-5 py-3 font-semibold text-slate-800">{d.category}</td>
                        <td className="px-5 py-3 max-w-xs text-slate-700">{d.description}</td>
                        <td className="px-5 py-3 font-bold">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] ${
                              d.severity === "Critical"
                                ? "bg-rose-100 text-rose-800 border border-rose-200"
                                : d.severity === "Major"
                                ? "bg-amber-100 text-amber-800 border border-amber-200"
                                : "bg-blue-100 text-blue-800 border border-blue-200"
                            }`}
                          >
                            {d.severity}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right">
                          {d.status === "Approved" ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded text-[11px] font-semibold border border-emerald-200">
                              <CheckCircle className="w-3 h-3" /> Approved
                            </span>
                          ) : (
                            <button
                              onClick={() => handleApproveDev(d.id)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded shadow-xs"
                            >
                              Approve Deviation
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Log New Adverse Event Modal */}
      {showAeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <form
            onSubmit={handleSubmitAe}
            className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-4 text-xs font-sans"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                Log New Adverse Event (AE/SAE)
              </h3>
              <button
                type="button"
                onClick={() => setShowAeModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-500 font-bold mb-1">Subject ID *</label>
                <input
                  type="text"
                  required
                  value={aeSubjectId}
                  onChange={(e) => setAeSubjectId(e.target.value)}
                  placeholder="e.g. NT-085"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Onset Date *</label>
                <input
                  type="date"
                  required
                  value={aeOnset}
                  onChange={(e) => setAeOnset(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-500 font-bold mb-1">Adverse Event Term (MedDRA) *</label>
              <input
                type="text"
                required
                value={aeTerm}
                onChange={(e) => setAeTerm(e.target.value)}
                placeholder="e.g. Alanine Aminotransferase Elevation"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-500 font-bold mb-1">Severity *</label>
                <select
                  value={aeSeverity}
                  onChange={(e) => setAeSeverity(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none"
                >
                  <option value="Mild">Mild</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Severe">Severe</option>
                  <option value="Life-Threatening">Life-Threatening</option>
                  <option value="Fatal">Fatal</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Event Classification</label>
                <select
                  value={aeType}
                  onChange={(e) => setAeType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none"
                >
                  <option value="TEAE (Treatment Emergent)">TEAE (Treatment Emergent)</option>
                  <option value="Pre-existing Condition">Pre-existing Condition</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={aeIsSae}
                  onChange={(e) => setAeIsSae(e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded"
                />
                <span className="font-bold text-rose-900">Serious Adverse Event (SAE)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={aeIsAesi}
                  onChange={(e) => setAeIsAesi(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded"
                />
                <span className="font-bold text-amber-900">AESI / ECI Flag</span>
              </label>
            </div>

            <div>
              <label className="block text-slate-500 font-bold mb-1">Medical Narrative</label>
              <textarea
                rows={3}
                value={aeNarrative}
                onChange={(e) => setAeNarrative(e.target.value)}
                placeholder="Clinical details, action taken with study product, and outcome..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAeModal(false)}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold border border-slate-200 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#1D64EC] hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition"
              >
                Save &amp; File Adverse Event Log
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Log New Deviation Modal */}
      {showDevModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <form
            onSubmit={handleSubmitDev}
            className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 text-xs font-sans"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                Log New Protocol Deviation
              </h3>
              <button
                type="button"
                onClick={() => setShowDevModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-500 font-bold mb-1">Subject ID *</label>
                <input
                  type="text"
                  required
                  value={devSubjectId}
                  onChange={(e) => setDevSubjectId(e.target.value)}
                  placeholder="e.g. NT-085"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Category *</label>
                <select
                  value={devCategory}
                  onChange={(e) => setDevCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none"
                >
                  <option value="Inclusion/Exclusion Violation">Inclusion/Exclusion Violation</option>
                  <option value="Out-of-Window Visit">Out-of-Window Visit</option>
                  <option value="Prohibited Medication">Prohibited Medication</option>
                  <option value="Informed Consent Violation">Informed Consent Violation</option>
                  <option value="Dosing Error">Dosing Error</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Severity *</label>
                <select
                  value={devSeverity}
                  onChange={(e) => setDevSeverity(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none"
                >
                  <option value="Minor">Minor</option>
                  <option value="Major">Major</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={devDescription}
                  onChange={(e) => setDevDescription(e.target.value)}
                  placeholder="Provide detailed description of deviation..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowDevModal(false)}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold border border-slate-200 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#1D64EC] hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition"
              >
                Submit Deviation Record
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Schedule Row Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <form
            onSubmit={handleSubmitSchedule}
            className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 text-xs font-sans"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                Add Safety Schedule Row
              </h3>
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-500 font-bold mb-1">Assessment Name *</label>
                <input
                  type="text"
                  required
                  value={schAssessment}
                  onChange={(e) => setSchAssessment(e.target.value)}
                  placeholder="e.g. Holter ECG 24H"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Screening (V1) Timing</label>
                <input
                  type="text"
                  value={schScreening}
                  onChange={(e) => setSchScreening(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Randomization (V2) Timing</label>
                <input
                  type="text"
                  value={schRandomization}
                  onChange={(e) => setSchRandomization(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold border border-slate-200 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#1D64EC] hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition"
              >
                Save Schedule Row
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Discontinuation Trigger Modal */}
      {showTriggerModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <form
            onSubmit={handleSubmitTrigger}
            className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 text-xs font-sans"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                Add Drug Discontinuation Trigger
              </h3>
              <button
                type="button"
                onClick={() => setShowTriggerModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-500 font-bold mb-1">Trigger Title *</label>
                <input
                  type="text"
                  required
                  value={trigTitle}
                  onChange={(e) => setTrigTitle(e.target.value)}
                  placeholder="e.g. Severe Neutropenia"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Trigger Mandate Description *</label>
                <textarea
                  rows={3}
                  required
                  value={trigDesc}
                  onChange={(e) => setTrigDesc(e.target.value)}
                  placeholder="Specify exact protocol clinical criteria..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowTriggerModal(false)}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold border border-slate-200 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs transition"
              >
                Save Trigger Mandate
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
