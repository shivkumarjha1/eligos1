"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Check, AlertCircle, Clock, Minus } from "lucide-react";

type StatusType = "complete" | "due" | "future" | "na";

interface MatrixCell {
  status: StatusType;
}

interface AssessmentRow {
  assessment: string;
  cells: Record<string, MatrixCell>;
}

export const VisitScheduleTrackerSection: React.FC = () => {
  const { selectedStudyId, setSelectedStudyId, studySummaries } = useAuth();
  const [selectedSubjectId, setSelectedSubjectId] = useState("100-101SLT");

  const visitsList = [
    { key: "screening", name: "SCREENING", date: "JUL 5, 26" },
    { key: "v1", name: "BASELINE (V1)", date: "JUL 19, 26" },
    { key: "v2", name: "WEEK 2 (V2)", date: "AUG 2, 26" },
    { key: "v3", name: "WEEK 4 (V3)", date: "AUG 16, 26" },
    { key: "v4", name: "WEEK 6 (V4)", date: "AUG 30, 26" },
    { key: "v5", name: "WEEK 8 (V5)", date: "SEP 13, 26" },
    { key: "w12", name: "WEEK 12", date: "OCT 11, 26" },
    { key: "eot", name: "EOT", date: "OCT 25, 26" },
    { key: "followup", name: "FOLLOW-UP", date: "NOV 8, 26" },
  ];

  const assessmentRows: AssessmentRow[] = [
    {
      assessment: "Informed Consent",
      cells: {
        screening: { status: "complete" },
        v1: { status: "na" },
        v2: { status: "na" },
        v3: { status: "na" },
        v4: { status: "na" },
        v5: { status: "na" },
        w12: { status: "na" },
        eot: { status: "na" },
        followup: { status: "na" },
      },
    },
    {
      assessment: "Demographics",
      cells: {
        screening: { status: "complete" },
        v1: { status: "na" },
        v2: { status: "na" },
        v3: { status: "na" },
        v4: { status: "na" },
        v5: { status: "na" },
        w12: { status: "na" },
        eot: { status: "na" },
        followup: { status: "na" },
      },
    },
    {
      assessment: "Medical/Psych History",
      cells: {
        screening: { status: "complete" },
        v1: { status: "na" },
        v2: { status: "na" },
        v3: { status: "na" },
        v4: { status: "na" },
        v5: { status: "na" },
        w12: { status: "na" },
        eot: { status: "na" },
        followup: { status: "na" },
      },
    },
    {
      assessment: "Vital Signs",
      cells: {
        screening: { status: "complete" },
        v1: { status: "complete" },
        v2: { status: "due" },
        v3: { status: "future" },
        v4: { status: "future" },
        v5: { status: "future" },
        w12: { status: "future" },
        eot: { status: "future" },
        followup: { status: "future" },
      },
    },
    {
      assessment: "HAMD-17",
      cells: {
        screening: { status: "complete" },
        v1: { status: "complete" },
        v2: { status: "due" },
        v3: { status: "future" },
        v4: { status: "future" },
        v5: { status: "future" },
        w12: { status: "na" },
        eot: { status: "future" },
        followup: { status: "na" },
      },
    },
    {
      assessment: "C-SSRS",
      cells: {
        screening: { status: "complete" },
        v1: { status: "complete" },
        v2: { status: "due" },
        v3: { status: "future" },
        v4: { status: "future" },
        v5: { status: "future" },
        w12: { status: "future" },
        eot: { status: "future" },
        followup: { status: "future" },
      },
    },
    {
      assessment: "Concomitant Meds",
      cells: {
        screening: { status: "complete" },
        v1: { status: "complete" },
        v2: { status: "due" },
        v3: { status: "future" },
        v4: { status: "future" },
        v5: { status: "future" },
        w12: { status: "future" },
        eot: { status: "future" },
        followup: { status: "future" },
      },
    },
    {
      assessment: "AE / SAE log",
      cells: {
        screening: { status: "na" },
        v1: { status: "complete" },
        v2: { status: "due" },
        v3: { status: "future" },
        v4: { status: "future" },
        v5: { status: "future" },
        w12: { status: "future" },
        eot: { status: "future" },
        followup: { status: "future" },
      },
    },
    {
      assessment: "Drug Dispensing",
      cells: {
        screening: { status: "na" },
        v1: { status: "complete" },
        v2: { status: "due" },
        v3: { status: "future" },
        v4: { status: "future" },
        v5: { status: "future" },
        w12: { status: "na" },
        eot: { status: "na" },
        followup: { status: "na" },
      },
    },
    {
      assessment: "Lab Panel",
      cells: {
        screening: { status: "complete" },
        v1: { status: "complete" },
        v2: { status: "na" },
        v3: { status: "future" },
        v4: { status: "na" },
        v5: { status: "future" },
        w12: { status: "na" },
        eot: { status: "future" },
        followup: { status: "na" },
      },
    },
    {
      assessment: "ECG (12-lead)",
      cells: {
        screening: { status: "complete" },
        v1: { status: "complete" },
        v2: { status: "na" },
        v3: { status: "na" },
        v4: { status: "na" },
        v5: { status: "future" },
        w12: { status: "na" },
        eot: { status: "future" },
        followup: { status: "na" },
      },
    },
    {
      assessment: "Neuroimaging (fMRI)",
      cells: {
        screening: { status: "na" },
        v1: { status: "complete" },
        v2: { status: "na" },
        v3: { status: "na" },
        v4: { status: "na" },
        v5: { status: "future" },
        w12: { status: "na" },
        eot: { status: "na" },
        followup: { status: "na" },
      },
    },
  ];

  const renderStatusIcon = (status: StatusType) => {
    switch (status) {
      case "complete":
        return (
          <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs mx-auto">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        );
      case "due":
        return (
          <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-black text-xs mx-auto">
            !
          </div>
        );
      case "future":
        return (
          <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-black text-[11px] mx-auto">
            R
          </div>
        );
      case "na":
      default:
        return (
          <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold text-xs mx-auto">
            <Minus className="w-3 h-3" />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 font-sans text-slate-800">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900">
          Visit Schedule Tracker
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Clinical assessments matrix and data capture completion tracker
        </p>
      </div>

      {/* Select Protocol & Select Subject + Legend Bar Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-6 flex-1">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
              SELECT STUDY PROTOCOL
            </label>
            <select
              value={selectedStudyId}
              onChange={(e) => setSelectedStudyId(e.target.value)}
              className="px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-extrabold text-slate-900 focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs max-w-full"
            >
              <option value="SLT-206-C118 Cerevastatin ()">
                SLT-206-C118 Cerevastatin ()
              </option>
              <option value="MHT-2101-C01 — MYOGUARD-1 Phase III">
                MHT-2101-C01 — MYOGUARD-1 Phase III
              </option>
              {studySummaries.map((s) => (
                <option key={s.id} value={s.subtitle}>
                  {s.subtitle}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
              SELECT SUBJECT
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-extrabold text-slate-900 focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs max-w-full"
            >
              <option value="100-101SLT">100-101SLT (ELIGIBLE)</option>
              <option value="101-002">101-002 (RANDOMIZED)</option>
              <option value="100-101MHT">100-101MHT (ELIGIBLE)</option>
            </select>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-bold text-slate-600 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">
              ✓
            </span>
            <span>Complete</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-extrabold text-[10px]">
              !
            </span>
            <span>Due / Open Window</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-black text-[10px]">
              R
            </span>
            <span>Required (Future)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold text-[10px]">
              -
            </span>
            <span>N/A</span>
          </div>
        </div>
      </div>

      {/* Main Matrix Table Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5 font-black text-slate-400 uppercase text-[10px] tracking-wider">
                  ASSESSMENT
                </th>
                {visitsList.map((v) => (
                  <th key={v.key} className="px-3 py-3.5 text-center">
                    <div className="font-extrabold text-slate-700 text-[11px] whitespace-nowrap">
                      {v.name}
                    </div>
                    <div className="font-bold text-[9px] text-slate-400 uppercase tracking-wider">
                      {v.date}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
              {assessmentRows.map((row) => (
                <tr key={row.assessment} className="hover:bg-slate-50/80 transition">
                  <td className="px-5 py-3 font-extrabold text-slate-900">{row.assessment}</td>
                  {visitsList.map((v) => {
                    const cell = row.cells[v.key] || { status: "na" };
                    return (
                      <td key={v.key} className="px-3 py-3 text-center">
                        {renderStatusIcon(cell.status)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
