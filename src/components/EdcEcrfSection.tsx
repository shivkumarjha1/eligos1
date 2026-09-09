"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  FileText, 
  Calendar, 
  Upload, 
  Lock, 
  Save, 
  Paperclip, 
  CheckCircle2, 
  ShieldCheck 
} from "lucide-react";

export interface VisitLogItem {
  id: string;
  visitName: string;
  dayOffset: string;
  dayDeltaDays: number; // offset from screening start date
  requiredProcedures: string;
  status: "Draft" | "Locked" | "Submitted";
  actualVisitDate?: string;
  notes: string;
  attachedFiles: string[];
}

const SAMPLE_SUBJECT_MAP: Record<string, { studyId: string; studyTitle: string; screeningStartDate: string; site: string }> = {
  "100-101SLT": {
    studyId: "SLT-206-C118",
    studyTitle: "SLT-206-C118 Cerevastatin (Bipolar Depression)",
    screeningStartDate: "2026-04-02",
    site: "Site HomeSite",
  },
  "101-002": {
    studyId: "SLT-206-C118",
    studyTitle: "SLT-206-C118 Cerevastatin (Bipolar Depression)",
    screeningStartDate: "2026-06-25",
    site: "Johns Hopkins Site 101",
  },
  "100-101MHT": {
    studyId: "MHT-2101-C01",
    studyTitle: "MHT-2101-C01 MYOGUARD-1 Phase III",
    screeningStartDate: "2026-07-06",
    site: "HomeSite",
  },
};

const INITIAL_VISITS: VisitLogItem[] = [
  {
    id: "v-1",
    visitName: "Screening",
    dayOffset: "Day -14 to Day -1",
    dayDeltaDays: -14,
    requiredProcedures: "Informed Consent, Medical History, Vitals, ECG, Labs, C-SSRS",
    status: "Draft",
    notes: "",
    attachedFiles: [],
  },
  {
    id: "v-2",
    visitName: "Baseline (V1)",
    dayOffset: "Day 1",
    dayDeltaDays: 0,
    requiredProcedures: "Vitals, Randomization, Drug Dispensing, C-SSRS, Safety Check",
    status: "Draft",
    notes: "",
    attachedFiles: [],
  },
  {
    id: "v-3",
    visitName: "Week 2 (V2)",
    dayOffset: "Day 15 ± 2",
    dayDeltaDays: 14,
    requiredProcedures: "Vitals, Pill Count, C-SSRS, AE Review",
    status: "Draft",
    notes: "",
    attachedFiles: [],
  },
  {
    id: "v-4",
    visitName: "Week 4 (V3)",
    dayOffset: "Day 29 ± 2",
    dayDeltaDays: 28,
    requiredProcedures: "Vitals, ECG, C-SSRS, MADRS, HAMD-17, AE Review",
    status: "Draft",
    notes: "",
    attachedFiles: [],
  },
  {
    id: "v-5",
    visitName: "Week 6 (V4)",
    dayOffset: "Day 43 ± 2",
    dayDeltaDays: 42,
    requiredProcedures: "Vitals, Neuroimaging, PK Count, C-SSRS, MADRS, HAMD-17 (Primary Endpoint)",
    status: "Draft",
    notes: "",
    attachedFiles: [],
  },
];

export const EdcEcrfSection: React.FC = () => {
  const { currentUser, selectedStudyId, setSelectedStudyId, studySummaries } = useAuth();
  
  const [selectedSubjectId, setSelectedSubjectId] = useState("100-101SLT");
  const [visits, setVisits] = useState<VisitLogItem[]>(INITIAL_VISITS);

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("eligos_edc_visits");
      if (saved) {
        setVisits(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load eCRF visits from localStorage", e);
    }
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem("eligos_edc_visits", JSON.stringify(visits));
    } catch (e) {
      console.error("Failed to save eCRF visits to localStorage", e);
    }
  }, [visits]);

  const activeSubjectInfo = SAMPLE_SUBJECT_MAP[selectedSubjectId] || {
    studyId: selectedStudyId,
    studyTitle: selectedStudyId,
    screeningStartDate: "2026-04-02",
    site: "Site HomeSite",
  };

  // Helper to compute dynamic calendar date based on screening start date
  const computeScheduledDate = (screeningStartDateStr: string, dayDelta: number) => {
    const baseDate = new Date(screeningStartDateStr);
    baseDate.setDate(baseDate.getDate() + dayDelta);
    return baseDate.toISOString().slice(0, 10);
  };

  const handleUpdateNotes = (visitId: string, text: string) => {
    setVisits((prev) =>
      prev.map((v) => (v.id === visitId ? { ...v, notes: text } : v))
    );
  };

  const handleUpdateActualDate = (visitId: string, dateStr: string) => {
    setVisits((prev) =>
      prev.map((v) => (v.id === visitId ? { ...v, actualVisitDate: dateStr } : v))
    );
  };

  const handleToggleLock = (visitId: string) => {
    setVisits((prev) =>
      prev.map((v) =>
        v.id === visitId
          ? { ...v, status: v.status === "Locked" ? "Draft" : "Locked" }
          : v
      )
    );
  };

  const handleUploadFile = (visitId: string) => {
    const fileName = prompt("Enter evidence file name (e.g. Lab_Report_V1.pdf):", "Lab_Report_V1.pdf");
    if (!fileName) return;
    setVisits((prev) =>
      prev.map((v) =>
        v.id === visitId
          ? { ...v, attachedFiles: [...v.attachedFiles, fileName] }
          : v
      )
    );
  };

  return (
    <div className="space-y-6 font-sans text-slate-800">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
          <span>📋</span> eCRF & EDC Visit Logger
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Document visit clinical notes and upload evidence attachments per protocol schedule
        </p>
      </div>

      {/* Select Study Protocol & Select Subject Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-black text-slate-700 mb-2">
            Select Study Protocol
          </label>
          <select
            value={selectedStudyId}
            onChange={(e) => setSelectedStudyId(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-xs font-extrabold text-slate-900 focus:ring-2 focus:ring-blue-500 cursor-pointer max-w-full"
          >
            {studySummaries
              .filter((s) =>
                currentUser?.role === "SuperAdmin" || currentUser?.role === "Admin"
                  ? true
                  : (currentUser?.assignedStudies || []).some(
                      (code) => s.id.includes(code) || s.subtitle.includes(code) || code.includes(s.id)
                    )
              )
              .map((s) => (
                <option key={s.id} value={s.subtitle}>
                  {s.subtitle}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-black text-slate-700 mb-2">
            Select Subject
          </label>
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-xs font-extrabold text-slate-900 focus:ring-2 focus:ring-blue-500 cursor-pointer max-w-full"
          >
            <option value="100-101SLT">100-101SLT (Site HomeSite ·)</option>
            <option value="101-002">101-002 (Johns Hopkins Site 101)</option>
            <option value="100-101MHT">100-101MHT (HomeSite)</option>
          </select>
        </div>
      </div>

      {/* Subject Protocol Context Banner */}
      <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs text-blue-950 shadow-2xs">
        <div className="flex flex-wrap items-center gap-3 font-semibold">
          <span>📋 Subject <strong className="text-blue-700 font-extrabold">{selectedSubjectId}</strong></span>
          <span>· Protocol: <strong className="text-blue-900 font-bold">{activeSubjectInfo.studyTitle}</strong></span>
          <span className="flex items-center gap-1 text-slate-700 font-bold bg-blue-100 px-2.5 py-0.5 rounded-full">
            <span>📅</span> Study Start Date (Screening): <strong className="text-blue-900 font-mono">{activeSubjectInfo.screeningStartDate}</strong>
          </span>
        </div>
        <div className="font-extrabold text-blue-800 text-[11px]">
          eCRF Compliance Audited (21 CFR Part 11)
        </div>
      </div>

      {/* Visit Schedule Cards List */}
      <div className="space-y-6">
        {visits.map((v) => {
          const dynamicCalendarDate = computeScheduledDate(activeSubjectInfo.screeningStartDate, v.dayDeltaDays);

          return (
            <div
              key={v.id}
              className={`bg-white rounded-2xl border-2 p-6 shadow-2xs space-y-4 transition ${
                v.status === "Locked" ? "border-slate-300 bg-slate-50/40" : "border-blue-200/80 hover:border-blue-400"
              }`}
            >
              {/* Card Header Row */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-900">{v.visitName}</h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        v.status === "Locked"
                          ? "bg-slate-200 text-slate-800"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      ✏️ {v.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 font-medium flex items-center gap-2 flex-wrap">
                    <span>📋 Required: {v.requiredProcedures}</span>
                    <span className="text-rose-600 font-extrabold flex items-center gap-1">
                      <span>🎯</span> Protocol Scheduled Date: Start of Study ({v.dayOffset}) [{dynamicCalendarDate}]
                    </span>
                  </div>
                </div>

                {/* Right Date & Lock Controls */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Actual Visit Date</label>
                    <input
                      type="date"
                      value={v.actualVisitDate || ""}
                      onChange={(e) => handleUpdateActualDate(v.id, e.target.value)}
                      className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-mono max-w-full"
                    />
                  </div>
                  <button
                    onClick={() => handleToggleLock(v.id)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 text-white font-extrabold text-xs rounded-xl shadow-2xs transition ${
                      v.status === "Locked"
                        ? "bg-slate-700 hover:bg-slate-800"
                        : "bg-[#059669] hover:bg-emerald-700"
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{v.status === "Locked" ? "Unlock Visit" : "Lock Visit"}</span>
                  </button>
                </div>
              </div>

              {/* Card Body: Observations Notes & Evidence Attachment Boxes */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
                {/* Left Box: Observations & Visit Notes */}
                <div className="space-y-2">
                  <label className="block font-extrabold text-slate-700">Observations & Visit Notes</label>
                  <textarea
                    rows={4}
                    disabled={v.status === "Locked"}
                    value={v.notes}
                    onChange={(e) => handleUpdateNotes(v.id, e.target.value)}
                    placeholder="Enter visit observation notes, patient diaries, vitals summary..."
                    className="w-full px-4 py-3 border border-slate-300 rounded-2xl text-xs focus:ring-2 focus:ring-blue-500 max-w-full bg-white disabled:bg-slate-100"
                  />
                  <button
                    onClick={() => alert(`Saved notes for ${v.visitName}`)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#B47418] hover:bg-[#9B6212] text-white font-extrabold text-xs rounded-xl shadow-2xs transition"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Log Notes
                  </button>
                </div>

                {/* Right Box: Attached Evidence (Logs/Lab Reports/Forms) */}
                <div className="space-y-2 flex flex-col justify-between">
                  <label className="block font-extrabold text-slate-700">Attached Evidence (Logs/Lab Reports/Forms)</label>
                  
                  <div className="flex-1 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-2">
                    {v.attachedFiles.length > 0 ? (
                      <div className="w-full space-y-1 text-left">
                        {v.attachedFiles.map((file, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 font-bold text-blue-700">
                            <Paperclip className="w-3.5 h-3.5" />
                            <span>{file}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-slate-400 font-medium text-xs">
                        No clinical files attached to this visit.
                      </div>
                    )}
                  </div>

                  <button
                    disabled={v.status === "Locked"}
                    onClick={() => handleUploadFile(v.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1D64EC] hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-2xs transition disabled:opacity-50"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload Evidence File
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
