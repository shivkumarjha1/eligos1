"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle2, Download } from "lucide-react";

export const TrialDashboard: React.FC = () => {
  const { selectedStudyId } = useAuth();

  const clinicalLogs = [
    {
      id: "log1",
      action: "System invitation prepared via Outlook Web for drshiv@gmail.com",
      timestamp: "2026-06-30 01:57",
      by: "Dr. Jha",
    },
    {
      id: "log2",
      action: "Subject 100-100 checklist item [imaging] marked as COMPLETE",
      timestamp: "2026-07-01 11:13",
      by: "Kavita Jha",
    },
    {
      id: "log3",
      action: "eCRF HAMD-17 Baseline entered — NT-085, score 26",
      timestamp: "2026-03-31 14:22",
      by: "RN J. Adams",
    },
    {
      id: "log4",
      action: "Subject 100-100 checklist item [imaging] marked as COMPLETE",
      timestamp: "2026-07-03 12:40",
      by: "Kavita Jha",
    },
    {
      id: "log5",
      action: "SAE AE-040 submitted — NT-079, Suicidal Ideation Grade 3",
      timestamp: "2026-04-01 15:31",
      by: "Dr. Elena Vance",
    },
  ];

  return (
    <div className="space-y-6 font-sans text-slate-800">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900">Trial Dashboard</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Global statistics and clinical activities overview</p>
      </div>

      {/* Selected Protocol Context Green Banner */}
      <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-2.5 text-xs text-emerald-900 font-semibold">
          <span>📊</span>
          <span>Selected Protocol Context:</span>
          <span className="bg-emerald-200/70 text-emerald-950 px-2.5 py-1 rounded-full font-extrabold text-xs">
            SLT-206-C118 Cerevastatin
          </span>
        </div>
        <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#B47418] hover:bg-[#9B6212] text-white font-bold text-xs rounded-xl shadow-xs transition">
          <Download className="w-3.5 h-3.5" />
          Export Study Data (Excel)
        </button>
      </div>

      {/* Top 4 KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: TOTAL SCREENED */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs border-l-4 border-l-blue-600">
          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            TOTAL SCREENED
          </div>
          <div className="text-3xl font-black text-blue-600 mt-1">1</div>
          <div className="text-[11px] font-medium text-slate-500 mt-0.5">
            Subjects screened for SLT-206-C118 Cerevastatin
          </div>
        </div>

        {/* Card 2: RANDOMIZED (ENROLLED) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs border-l-4 border-l-emerald-500">
          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            RANDOMIZED (ENROLLED)
          </div>
          <div className="text-3xl font-black text-emerald-600 mt-1">0</div>
          <div className="text-[11px] font-medium text-slate-500 mt-0.5">Stratified arm assigned</div>
        </div>

        {/* Card 3: PENDING REVIEWS */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs border-l-4 border-l-amber-500">
          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            PENDING REVIEWS
          </div>
          <div className="text-3xl font-black text-amber-500 mt-1">1</div>
          <div className="text-[11px] font-medium text-slate-500 mt-0.5">Eligibility / data checks</div>
        </div>

        {/* Card 4: SCREEN FAILED */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs border-l-4 border-l-rose-500">
          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            SCREEN FAILED
          </div>
          <div className="text-3xl font-black text-rose-600 mt-1">0</div>
          <div className="text-[11px] font-medium text-slate-500 mt-0.5">SF rate: 0% of screened</div>
        </div>
      </div>

      {/* 3 Main Grid Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: STUDY ENROLLMENT PROGRESS */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
          <div className="text-xs font-black text-slate-500 uppercase tracking-wider">
            STUDY ENROLLMENT PROGRESS
          </div>

          <div className="space-y-3">
            {/* GAD-002-NEXUS */}
            <div className="p-3 bg-slate-50/60 rounded-xl border border-slate-200/70 flex items-center justify-between text-xs">
              <span className="font-extrabold text-blue-600 text-[11px]">GAD-002-NEXUS</span>
              <span className="font-bold text-slate-700 text-[11px]">0 / 0 (0%)</span>
            </div>

            {/* MHT-2101-C01 */}
            <div className="p-3 bg-slate-50/60 rounded-xl border border-slate-200/70 flex items-center justify-between text-xs">
              <span className="font-extrabold text-blue-600 text-[11px]">MHT-2101-C01</span>
              <span className="font-bold text-slate-700 text-[11px]">0 / 0 (0%)</span>
            </div>

            {/* SCZ-005-APOLLO */}
            <div className="p-3 bg-slate-50/60 rounded-xl border border-slate-200/70 flex items-center justify-between text-xs">
              <span className="font-extrabold text-blue-600 text-[11px]">SCZ-005-APOLLO</span>
              <span className="font-bold text-slate-700 text-[11px]">0 / 0 (0%)</span>
            </div>

            {/* SLT-206-C118 Cerevastatin (Active Highlight Box) */}
            <div className="p-3.5 bg-blue-50/50 rounded-xl border-2 border-blue-400 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-emerald-700 text-[11px]">SLT-206-C118 Cerevastatin</span>
                <span className="text-slate-700 text-[11px]">0 / 0 (0%)</span>
              </div>
              <button className="w-full py-1.5 bg-white border border-blue-300 hover:bg-blue-50 text-blue-700 font-bold text-[10px] rounded-lg shadow-2xs flex items-center justify-center gap-1.5 transition">
                <Download className="w-3 h-3" />
                Export SLT-206-C118 Cerevastatin Excel
              </button>
            </div>

            {/* TEST DEMO STUDY */}
            <div className="p-3 bg-slate-50/60 rounded-xl border border-slate-200/70 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-800 text-[11px]">TEST DEMO STUDY</span>
                <span className="bg-blue-100 text-blue-800 text-[9px] font-bold px-1.5 py-0.5 rounded">
                  TEST-001-DEMO
                </span>
              </div>
              <span className="font-bold text-slate-700 text-[11px]">0 / 100 (0%)</span>
            </div>

            {/* XPF-010-BS01 */}
            <div className="p-3 bg-slate-50/60 rounded-xl border border-slate-200/70 flex items-center justify-between text-xs">
              <span className="font-extrabold text-blue-600 text-[11px]">XPF-010-BS01</span>
              <span className="font-bold text-slate-700 text-[11px]">0 / 0 (0%)</span>
            </div>
          </div>
        </div>

        {/* Column 2: STUDY COMMUNICATIONS */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="text-xs font-black text-slate-500 uppercase tracking-wider">
            STUDY COMMUNICATIONS
          </div>

          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black shadow-sm">
              ✓
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">All messages answered</div>
              <div className="text-xs text-slate-400 mt-1">Your study communications are up to date!</div>
            </div>
          </div>
        </div>

        {/* Column 3: RECENT CLINICAL LOGS (SLT-206-C118 CEREVASTATIN) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
          <div className="text-xs font-black text-slate-500 uppercase tracking-wider">
            RECENT CLINICAL LOGS (SLT-206-C118 CEREVASTATIN)
          </div>

          <div className="space-y-4 text-xs">
            {clinicalLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-2.5">
                <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-1.5" />
                <div className="space-y-0.5">
                  <div className="font-extrabold text-slate-900 leading-tight">
                    {log.action}
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">
                    {log.timestamp} • logged by <strong className="text-slate-700">{log.by}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
