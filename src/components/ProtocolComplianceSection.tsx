"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  FileText, 
  Users, 
  AlertTriangle, 
  Activity, 
  ShieldAlert, 
  Upload, 
  Edit3, 
  Plus, 
  Strikethrough, 
  Check, 
  X, 
  ChevronRight,
  Lock
} from "lucide-react";

export const ProtocolComplianceSection: React.FC = () => {
  const { currentUser, selectedStudyId } = useAuth();
  const role = currentUser?.role || "PI";
  const canUploadProtocol = role === "Sponsor" || role === "CRO" || role === "SuperAdmin" || role === "Admin";
  const [activeSubTab, setActiveSubTab] = useState<
    "specification" | "meetings" | "deviations" | "mmp" | "mdrp"
  >("specification");

  const [assessmentSchedule, setAssessmentSchedule] = useState([
    { visit: "Screening", timing: "Day -14 to Day -1", procedures: "Informed Consent, Medical History, Vitals, ECG, Labs, MADRS, HAMD-17, C-SSRS" },
    { visit: "Baseline (V1)", timing: "Day 1", procedures: "Vitals, Randomization, Drug Dispensing, C-SSRS, MADRS, HAMD-17, Safety Check" },
    { visit: "Week 2 (V2)", timing: "Day 14 ± 2", procedures: "Vitals, PK Count, C-SSRS, MADRS, HAMD-17, AE Review" },
    { visit: "Week 4 (V3)", timing: "Day 28 ± 2", procedures: "Vitals, ECG, C-SSRS, MADRS, HAMD-17, AE Review" },
    { visit: "Week 6 (V4)", timing: "Day 42 ± 2", procedures: "Vitals, Neuroimaging, PK Count, C-SSRS, MADRS, HAMD-17 (Primary Endpoint)" },
    { visit: "Week 8 (V5)", timing: "Day 56 ± 3", procedures: "Vitals, Labs, PK Count, C-SSRS, MADRS, HAMD-17, Safety Follow-up" },
  ]);

  return (
    <div className="space-y-6 font-sans text-slate-800">
      {/* Title & Top Right Context Banner */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Protocol and Compliance
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Cerevastatin in Depressive Episodes Associated With Bipolar I or II Disorder (Bipolar Depression) Protocol [SLT-206-C118] Version 4.0 (2026-03)
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="text-right text-[11px] text-slate-500">
            <span className="font-semibold text-slate-400">Sample Study:</span>{" "}
            <strong className="text-slate-800 font-extrabold">SLT-206-C118 Cerevastatin — Cerevastatin in Depressive Episodes...</strong>
          </div>
          <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-2xs text-xs transition">
            Select Another Study
          </button>
        </div>
      </div>

      {/* Sub-Tabs Pill Navigation Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveSubTab("specification")}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold transition ${
            activeSubTab === "specification"
              ? "bg-[#1D64EC] text-white shadow-xs"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Protocol Specification
        </button>

        <button
          onClick={() => setActiveSubTab("meetings")}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold transition ${
            activeSubTab === "meetings"
              ? "bg-[#1D64EC] text-white shadow-xs"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          Medical Monitoring Meetings
        </button>

        <button
          onClick={() => setActiveSubTab("deviations")}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold transition ${
            activeSubTab === "deviations"
              ? "bg-[#1D64EC] text-white shadow-xs"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          Protocol Deviations
        </button>

        <button
          onClick={() => setActiveSubTab("mmp")}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold transition ${
            activeSubTab === "mmp"
              ? "bg-[#1D64EC] text-white shadow-xs"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          Medical Management Plan (MMP)
        </button>

        <button
          onClick={() => setActiveSubTab("mdrp")}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold transition ${
            activeSubTab === "mdrp"
              ? "bg-[#1D64EC] text-white shadow-xs"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          Medical Data Review Plan (MDRP)
        </button>
      </div>

      {/* Light Blue PDF Warning Banner */}
      <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-3.5 flex items-center justify-between gap-4 text-xs text-blue-900 shadow-2xs">
        <div className="flex items-center gap-2 font-semibold">
          <span>⚠️</span>
          <span>No Protocol PDF has been uploaded for this study. Click upload on the right to configure.</span>
        </div>
        {canUploadProtocol ? (
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-2xs transition">
            <Upload className="w-3.5 h-3.5" />
            Upload Protocol PDF
          </button>
        ) : (
          <div className="text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-400" /> Upload Restricted (Sponsor/CRO/Admin)
          </div>
        )}
      </div>

      {/* Main Tab Content */}
      {activeSubTab === "specification" && (
        <div className="space-y-6">
          {/* Card Row 1: Left STUDY PARAMETERS, Right AMENDMENT LOGS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Card: STUDY PARAMETERS (2/3 width) */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
              <div className="text-xs font-black text-slate-500 uppercase tracking-wider">
                STUDY PARAMETERS
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-xs">
                <div>
                  <div className="text-slate-400 font-semibold">Protocol ID</div>
                  <div className="font-extrabold text-slate-900 text-sm mt-0.5">SLT-206-C118 Cerevastatin</div>
                </div>

                <div>
                  <div className="text-slate-400 font-semibold">Title</div>
                  <div className="font-bold text-slate-900 mt-0.5">
                    Cerevastatin in Depressive Episodes Associated With Bipolar I or II Disorder (Bipolar Depression)
                  </div>
                </div>

                <div>
                  <div className="text-slate-400 font-semibold">Phase</div>
                  <div className="font-extrabold text-slate-900 mt-0.5">Phase III</div>
                </div>

                <div>
                  <div className="text-slate-400 font-semibold">Sponsor</div>
                  <div className="font-bold text-slate-900 mt-0.5">Solastis Therapeutics Inc</div>
                </div>

                <div>
                  <div className="text-slate-400 font-semibold">IP Product</div>
                  <div className="font-bold text-slate-900 mt-0.5">Cerevastatin (SLC-4421)</div>
                </div>

                <div>
                  <div className="text-slate-400 font-semibold">Indication</div>
                  <div className="font-bold text-slate-900 mt-0.5">Bipolar I Disorder (ICD-10 F31.9)</div>
                </div>

                <div>
                  <div className="text-slate-400 font-semibold">Target Enrollment</div>
                  <div className="font-extrabold text-slate-900 mt-0.5">50 subjects</div>
                </div>

                <div>
                  <div className="text-slate-400 font-semibold">Current Enrolled</div>
                  <div className="font-extrabold text-slate-900 mt-0.5">0</div>
                </div>
              </div>
            </div>

            {/* Right Card: AMENDMENT LOGS (1/3 width) */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
              <div className="text-xs font-black text-slate-500 uppercase tracking-wider">
                AMENDMENT LOGS
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-extrabold text-slate-900">
                      v4.0 — ECT exclusion removed & 6 months SAE
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                      Mar 25, 2026 • Approved by FDA
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-extrabold text-slate-900">
                      v3.0 — Neuroimaging sub-study added, C-SSRS added
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                      Jan 10, 2026 • Approved
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-extrabold text-slate-900">v1.0 — Original Protocol</div>
                    <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                      Sep 1, 2024 • Original
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card Row 2: STUDY OBJECTIVES */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-black text-slate-500 uppercase tracking-wider">
                STUDY OBJECTIVES
              </div>
              <button className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition">
                <Edit3 className="w-3 h-3" /> Edit Objectives
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-1.5 bg-slate-50/60 p-4 rounded-xl border border-slate-200/60">
                <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <span>📌</span> PRIMARY OBJECTIVE
                </div>
                <p className="text-slate-700 font-medium leading-relaxed">
                  To evaluate the efficacy of oral daily dose SLT-206 compared with placebo in reducing depressive symptoms in participants with Bipolar I or II Depression, as measured by the change from baseline in the MADRS total score at Week 6.
                </p>
              </div>

              <div className="space-y-1.5 bg-slate-50/60 p-4 rounded-xl border border-slate-200/60">
                <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <span>🎯</span> SECONDARY OBJECTIVES
                </div>
                <p className="text-slate-700 font-medium leading-relaxed">
                  To evaluate the safety, tolerability, and key secondary efficacy outcomes including CGI-S improvement, HAMD-17 total score change, and suicidal ideation monitoring via C-SSRS.
                </p>
              </div>
            </div>
          </div>

          {/* Card Row 3: SCHEDULE OF ASSESSMENTS */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-black text-slate-500 uppercase tracking-wider">
                SCHEDULE OF ASSESSMENTS
              </div>
              <button className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition">
                <Plus className="w-3 h-3" /> Add Visit Slot
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">VISIT / SEGMENT</th>
                    <th className="px-4 py-3">PROTOCOL TIMING</th>
                    <th className="px-4 py-3">REQUIRED PROCEDURES & EVALUATIONS</th>
                    <th className="px-4 py-3 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {assessmentSchedule.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3 font-extrabold text-slate-900">{item.visit}</td>
                      <td className="px-4 py-3 font-mono font-medium text-slate-600">{item.timing}</td>
                      <td className="px-4 py-3 text-slate-700 font-medium">{item.procedures}</td>
                      <td className="px-4 py-3 text-right space-x-1">
                        <button className="p-1 text-slate-400 hover:text-blue-600 transition" title="Edit">
                          <Edit3 className="w-3.5 h-3.5 inline" />
                        </button>
                        <button className="p-1 text-slate-400 hover:text-amber-600 transition" title="Strike Out (Deprecate)">
                          <Strikethrough className="w-3.5 h-3.5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Card Row 4: PERMITTED & PROHIBITED MEDICATIONS */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-black text-slate-500 uppercase tracking-wider">
                PERMITTED & PROHIBITED MEDICATIONS
              </div>
              <button className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition">
                <Edit3 className="w-3 h-3" /> Edit Meds List
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Left Column: Permitted */}
              <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-2xl p-5 space-y-3">
                <div className="font-extrabold text-emerald-900 flex items-center gap-1.5 text-xs">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                  <span>CONCOMITANT MEDICATIONS PERMITTED</span>
                </div>
                <ul className="space-y-2 text-emerald-950 font-medium list-disc list-inside">
                  <li>Stable dose non-psychoactive medications for chronic medical conditions (hypertension, diabetes, thyroid).</li>
                  <li>Rescue medications for insomnia (zolpidem up to 10mg as needed), not within 8 hours of clinical rating visits.</li>
                </ul>
              </div>

              {/* Right Column: Prohibited */}
              <div className="bg-rose-50/70 border border-rose-200/90 rounded-2xl p-5 space-y-3">
                <div className="font-extrabold text-rose-900 flex items-center gap-1.5 text-xs">
                  <X className="w-4 h-4 text-rose-600 stroke-[3]" />
                  <span>PROHIBITED CONCOMITANT THERAPY</span>
                </div>
                <ul className="space-y-2 text-rose-950 font-medium list-disc list-inside">
                  <li>Antidepressants started or changed within 4 weeks; monoamine oxidase inhibitors (MAOIs)/atypical antipsychotics.</li>
                  <li>Electroconvulsive Therapy (ECT) or Transcranial Magnetic Stimulation (TMS) within 6 months.</li>
                  <li>Systemic strong CYP3A4 inhibitors (ketoconazole, clarithromycin).</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Card Row 5: INCLUSION / EXCLUSION CRITERIA */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-black text-slate-500 uppercase tracking-wider">
                INCLUSION / EXCLUSION CRITERIA (EXTRACT FROM PROTOCOL)
              </div>
              <button className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 transition">
                <Plus className="w-3 h-3" /> Add Criterion / Edit
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Inclusion Criteria */}
              <div className="space-y-3">
                <div className="font-extrabold text-emerald-700 uppercase tracking-wider text-[11px]">
                  INCLUSION CRITERIA
                </div>
                <ul className="space-y-2 text-slate-800 font-medium">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Age 18-65 at screening</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>DSM-5 diagnosis of Bipolar I or II disorder, currently in major depressive episode</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>MADRS score ≥ 24 at screening and baseline</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Permission to contact Primary Care Physician or Psychiatrist</span>
                  </li>
                </ul>
              </div>

              {/* Exclusion Criteria */}
              <div className="space-y-3">
                <div className="font-extrabold text-rose-700 uppercase tracking-wider text-[11px]">
                  EXCLUSION CRITERIA
                </div>
                <ul className="space-y-2 text-slate-800 font-medium">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">✕</span>
                    <span>Lifetime diagnosis of schizophrenia, schizoaffective disorder, or dementia</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">✕</span>
                    <span>Active substance abuse with urine drug screen (UDS) + in past 3 months</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">✕</span>
                    <span>Substantial risk of suicide (suicide attempt or active plan in past 6 months)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">✕</span>
                    <span>ALT or AST &gt; 3x ULN at screening</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
