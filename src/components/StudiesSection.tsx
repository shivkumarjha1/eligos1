"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Study, MMP, MDRP } from "@/types";
import { FolderKanban, FileText, ShieldAlert, Download, Activity, CheckCircle } from "lucide-react";

const SAMPLE_MMP: MMP = {
  studyId: "MHT-2101-C01",
  overview: "Medical Management Plan outlining dose modifications, liver toxicity management algorithms, and safety reporting escalations.",
  monitorName: "Dr. Elizabeth Vance",
  safetyEmail: "safety@eligos.io",
  safetyPhone: "+1 (800) 555-SAFE",
  algorithms: [
    {
      grade: "Grade 1 (Mild)",
      severity: "ALT/AST > ULN to 3x ULN",
      action: "Continue therapy, repeat safety labs in 72 hours.",
    },
    {
      grade: "Grade 2 (Moderate)",
      severity: "ALT/AST > 3x to 5x ULN",
      action: "Hold investigational product, notify CRO Monitor & Sponsor Safety within 24h.",
    },
    {
      grade: "Grade 3 (Severe)",
      severity: "ALT/AST > 5x ULN or Total Bilirubin > 2x ULN",
      action: "Permanently discontinue IP, trigger immediate SAE protocol workflow.",
    },
  ],
};

const SAMPLE_MDRP: MDRP = {
  studyId: "MHT-2101-C01",
  variables: [
    "Hepatic Function: ALT, AST, Total Bilirubin, Alkaline Phosphatase",
    "Cardiac Safety: Continuous 12-lead ECG (QTcF intervals)",
    "Hematology: Absolute Neutrophil Count (ANC), Platelet count",
  ],
  alerts: [
    "Severe Liver Injury Alert: ALT > 3x ULN with Total Bilirubin > 2x ULN",
    "ECG Alert: Absolute QTcF > 500 ms or increase > 60 ms from baseline",
  ],
};

export const StudiesSection: React.FC = () => {
  const { studies } = useAuth();
  const [activeStudy] = useState<Study>(studies[0]);
  const [activeTab, setActiveTab] = useState<"protocol" | "mmp" | "mdrp">("protocol");

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
              {activeStudy.phase}
            </span>
            <h2 className="text-xl font-bold text-gray-900">{activeStudy.title}</h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Protocol ID: <span className="font-mono font-bold text-gray-800">{activeStudy.id}</span> • Sponsor: {activeStudy.sponsor}
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="bg-gray-50 px-3 py-2 rounded-xl border border-gray-200 text-center">
            <div className="text-gray-400 font-semibold">Target Enrollment</div>
            <div className="text-base font-bold text-gray-900">{activeStudy.target} Subjects</div>
          </div>
          <div className="bg-blue-50 px-3 py-2 rounded-xl border border-blue-200 text-center">
            <div className="text-blue-600 font-semibold">Enrolled</div>
            <div className="text-base font-bold text-blue-900">{activeStudy.enrolled} Enrolled</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("protocol")}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition ${
            activeTab === "protocol"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          Protocol & Documents
        </button>
        <button
          onClick={() => setActiveTab("mmp")}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition ${
            activeTab === "mmp"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          Medical Management Plan (MMP)
        </button>
        <button
          onClick={() => setActiveTab("mdrp")}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition ${
            activeTab === "mdrp"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          Medical Data Review Plan (MDRP)
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "protocol" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div className="font-bold text-sm text-gray-900">Clinical Protocol PDF</div>
            <div className="text-xs text-gray-500 font-mono">{activeStudy.protocolName}</div>
            <button className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs rounded-xl transition">
              <Download className="w-3.5 h-3.5" /> Download Protocol
            </button>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <div className="font-bold text-sm text-gray-900">Medical Management Plan</div>
            <div className="text-xs text-gray-500 font-mono">{activeStudy.mmpName}</div>
            <button className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs rounded-xl transition">
              <Download className="w-3.5 h-3.5" /> Download MMP
            </button>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="font-bold text-sm text-gray-900">Data Review Plan (MDRP)</div>
            <div className="text-xs text-gray-500 font-mono">{activeStudy.mdrpName}</div>
            <button className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs rounded-xl transition">
              <Download className="w-3.5 h-3.5" /> Download MDRP
            </button>
          </div>
        </div>
      )}

      {activeTab === "mmp" && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-base font-bold text-gray-900">Medical Management Plan (MMP)</h3>
            <p className="text-xs text-gray-500 mt-1">{SAMPLE_MMP.overview}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200">
              <div className="text-gray-400 font-semibold">Lead Medical Monitor</div>
              <div className="font-bold text-gray-900 text-sm mt-0.5">{SAMPLE_MMP.monitorName}</div>
            </div>
            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200">
              <div className="text-gray-400 font-semibold">24/7 Safety Email</div>
              <div className="font-mono font-bold text-blue-700 text-sm mt-0.5">{SAMPLE_MMP.safetyEmail}</div>
            </div>
            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200">
              <div className="text-gray-400 font-semibold">Emergency Safety Phone</div>
              <div className="font-mono font-bold text-gray-900 text-sm mt-0.5">{SAMPLE_MMP.safetyPhone}</div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Toxicity Escalation & Management Algorithms
            </h4>
            <div className="space-y-3">
              {SAMPLE_MMP.algorithms.map((alg, i) => (
                <div key={i} className="p-4 rounded-xl border border-gray-200 bg-slate-50/50 space-y-1 text-xs">
                  <div className="flex items-center justify-between font-bold text-gray-900">
                    <span className="text-blue-700 font-semibold">{alg.grade}</span>
                    <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-200 font-mono">
                      {alg.severity}
                    </span>
                  </div>
                  <p className="text-gray-700 font-medium pt-1 border-t border-gray-200/60 mt-1">
                    <strong>Action Required:</strong> {alg.action}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "mdrp" && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-base font-bold text-gray-900">Medical Data Review Plan (MDRP)</h3>
            <p className="text-xs text-gray-500 mt-1">
              Safety monitoring variables, laboratory threshold alerts, and review frequency rules.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Primary Review Variables
              </h4>
              <ul className="space-y-2 text-xs">
                {SAMPLE_MDRP.variables.map((v, i) => (
                  <li key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 font-medium">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Threshold Safety Alerts
              </h4>
              <ul className="space-y-2 text-xs">
                {SAMPLE_MDRP.alerts.map((a, i) => (
                  <li key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 font-semibold">
                    <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
