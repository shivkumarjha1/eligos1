"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  Shuffle, 
  AlertTriangle, 
  BarChart2, 
  Lock, 
  Check, 
  Save, 
  ShieldAlert, 
  Layers 
} from "lucide-react";

export const RandomizationSection: React.FC = () => {
  const { currentUser, selectedStudyId, setSelectedStudyId, studySummaries } = useAuth();

  const [activeTab, setActiveTab] = useState<"allocation" | "code_break" | "stratification">("allocation");

  // Configuration Panel state (Screenshot 1)
  const [blindingMode, setBlindingMode] = useState("Double-Blind (Masked Assignment)");
  const [hasRandomizedArms, setHasRandomizedArms] = useState(true);
  const [blindedPI, setBlindedPI] = useState(true);
  const [blindedSponsor, setBlindedSponsor] = useState(true);
  const [blindedCRO, setBlindedCRO] = useState(false);

  // Emergency Code Break state (Screenshot 2)
  const [codeBreakSubject, setCodeBreakSubject] = useState("");
  const [codeBreakReason, setCodeBreakReason] = useState("");
  const [codeBreakConfirm, setCodeBreakConfirm] = useState("");
  const [unblindedResult, setUnblindedResult] = useState<string | null>(null);

  // Permissions: Owned by PI and Admin
  const role = currentUser?.role || "PI";
  const canManageRandomization = role === "PI" || role === "SuperAdmin" || role === "Admin";
  const isAdmin = role === "SuperAdmin" || role === "Admin";

  const handleSaveConfig = () => {
    alert("Protocol Blinding & Randomization Configuration saved successfully!");
  };

  const handleExecuteCodeBreak = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeBreakSubject || !codeBreakReason) return;
    if (codeBreakConfirm.toUpperCase() !== "CONFIRM UNBLIND") {
      alert("Error: You must type CONFIRM UNBLIND in exact uppercase to authorize emergency code break.");
      return;
    }

    const result = `EMERGENCY UNBLIND COMPLETED: Subject ${codeBreakSubject} was assigned to Arm A: Cerevastatin (SLC-4421) 50mg. Audit log generated.`;
    setUnblindedResult(result);
    alert(result);
  };

  return (
    <div className="space-y-6 font-sans text-slate-800">
      {/* Header & Study Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Randomization Hub
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Protocol: <strong className="text-slate-800">{selectedStudyId.split(" ")[0]}</strong> · Indication: General Indication
          </p>
        </div>

        {/* Study Selector Dropdown */}
        <select
          value={selectedStudyId}
          onChange={(e) => setSelectedStudyId(e.target.value)}
          className="px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-extrabold text-slate-800 focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs max-w-full"
        >
          <option value="MHT-2101-C01 — MYOGUARD-1 Phase III">
            MHT-2101-C01 · MYOGUARD-1 Phase III
          </option>
          <option value="SLT-206-C118 Cerevastatin — Cerevastatin in I">
            SLT-206-C118 Cerevastatin — Cerevastatin in I
          </option>
          {studySummaries.map((s) => (
            <option key={s.id} value={s.subtitle}>
              {s.subtitle}
            </option>
          ))}
        </select>
      </div>

      {/* Sub-Tabs Pill Navigation Bar */}
      <div className="flex items-center gap-6 border-b border-slate-200 text-xs font-extrabold">
        <button
          onClick={() => setActiveTab("allocation")}
          className={`pb-3 flex items-center gap-1.5 border-b-2 transition ${
            activeTab === "allocation"
              ? "border-blue-600 text-blue-600 font-black"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Shuffle className="w-3.5 h-3.5" /> Enrollment & Allocation
        </button>

        <button
          onClick={() => setActiveTab("code_break")}
          className={`pb-3 flex items-center gap-1.5 border-b-2 transition ${
            activeTab === "code_break"
              ? "border-rose-600 text-rose-600 font-black"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> Emergency Code Break
        </button>

        <button
          onClick={() => setActiveTab("stratification")}
          className={`pb-3 flex items-center gap-1.5 border-b-2 transition ${
            activeTab === "stratification"
              ? "border-emerald-600 text-emerald-600 font-black"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5 text-emerald-600" /> Stratification & Blocks Monitor
        </button>
      </div>

      {/* Sub-Tab 1: Enrollment & Allocation (Screenshot 1) */}
      {activeTab === "allocation" && (
        <div className="space-y-6">
          {/* Top Gold Container: PROTOCOL BLINDING & RANDOMIZATION PARAMETERS */}
          <div className="bg-amber-50/40 border border-amber-300 rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="text-xs font-black text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
              <span>⚙️</span> PROTOCOL BLINDING & RANDOMIZATION PARAMETERS (SUPERADMIN CONFIGURATION PANEL)
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-4 flex-wrap">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Blinding Mode</label>
                  <select
                    value={blindingMode}
                    onChange={(e) => setBlindingMode(e.target.value)}
                    className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 max-w-full"
                  >
                    <option value="Double-Blind (Masked Assignment)">Double-Blind (Masked Assignment)</option>
                    <option value="Single-Blind (Investigator Masked)">Single-Blind (Investigator Masked)</option>
                    <option value="Open-Label (Unblinded)">Open-Label (Unblinded)</option>
                  </select>
                </div>

                <label className="flex items-center gap-2 font-bold text-slate-800 cursor-pointer pt-4">
                  <input
                    type="checkbox"
                    checked={hasRandomizedArms}
                    onChange={(e) => setHasRandomizedArms(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>Has Randomized Arms (vs. Single-Arm)</span>
                </label>

                <div className="pt-4">
                  <span className="text-slate-500 font-bold mr-2">Blinded User Roles:</span>
                  <label className="inline-flex items-center gap-1 font-bold text-slate-800 mr-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={blindedPI}
                      onChange={(e) => setBlindedPI(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>PI</span>
                  </label>
                  <label className="inline-flex items-center gap-1 font-bold text-slate-800 mr-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={blindedSponsor}
                      onChange={(e) => setBlindedSponsor(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>Sponsor</span>
                  </label>
                  <label className="inline-flex items-center gap-1 font-bold text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={blindedCRO}
                      onChange={(e) => setBlindedCRO(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>CRO</span>
                  </label>
                </div>
              </div>

              {canManageRandomization && (
                <button
                  onClick={handleSaveConfig}
                  className="px-5 py-2.5 bg-[#B47418] hover:bg-[#9B6212] text-white font-extrabold text-xs rounded-xl shadow-2xs transition"
                >
                  Save Configuration
                </button>
              )}
            </div>
          </div>

          {/* Three Summary Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs border-l-4 border-l-emerald-500">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                OPEN-LABEL TREATMENT
              </div>
              <div className="text-3xl font-black text-emerald-600 mt-1">0</div>
              <div className="text-[11px] font-medium text-slate-500 mt-0.5">Active Treatment Group</div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs border-l-4 border-l-slate-400">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                CONTROL GROUP
              </div>
              <div className="text-3xl font-black text-slate-700 mt-1">None</div>
              <div className="text-[11px] font-medium text-slate-500 mt-0.5">Single-arm Protocol</div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs border-l-4 border-l-purple-600">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                BLINDING PARAMETERS
              </div>
              <div className="text-3xl font-black text-purple-700 mt-1">Unblinded</div>
              <div className="text-[11px] font-medium text-slate-500 mt-0.5">Open-Label active enrollment</div>
            </div>
          </div>

          {/* Bottom Two Columns Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: PROTOCOL ALLOCATION PARAMETERS */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4 text-xs">
              <div className="text-xs font-black text-slate-500 uppercase tracking-wider">
                PROTOCOL ALLOCATION PARAMETERS
              </div>

              <div className="space-y-3 text-slate-700 font-medium">
                <div>
                  <strong className="text-slate-900 font-bold">Blinding Classification:</strong> OPEN-LABEL (UNBLINDED)
                </div>
                <div>
                  <strong className="text-slate-900 font-bold">Allocation Strata:</strong> Single-treatment arm enrollment. No randomization assignments.
                </div>
                <div>
                  <strong className="text-slate-900 font-bold">Treatment Duration:</strong> Administered per core protocol guidelines.
                </div>
                <div>
                  <strong className="text-slate-900 font-bold">Blinded Roles:</strong> None (open trial architecture)
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[10px] px-2.5 py-1 rounded-full">
                  OPEN LABEL ACTIVE
                </span>
                <span className="text-[11px] text-slate-500 font-medium">Centralized kit assignment only</span>
              </div>
            </div>

            {/* Right Column: RECENT ENROLLED & RANDOMIZED SUBJECTS */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
              <div className="text-xs font-black text-slate-500 uppercase tracking-wider">
                RECENT ENROLLED & RANDOMIZED SUBJECTS
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-400 font-black uppercase text-[10px] tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="px-4 py-2.5">SUBJECT</th>
                      <th className="px-4 py-2.5">DATE</th>
                      <th className="px-4 py-2.5">ARM</th>
                      <th className="px-4 py-2.5">RAND / KIT NO.</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={4} className="text-center py-12 text-slate-400 text-xs font-medium">
                        No subjects randomized yet in this study.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Emergency Code Break (Screenshot 2) */}
      {activeTab === "code_break" && (
        <div className="bg-white rounded-2xl border-2 border-rose-500 p-6 shadow-md space-y-6 text-xs">
          <div className="font-black text-sm text-rose-600 flex items-center gap-2 uppercase tracking-wider">
            <span>🚨</span> EMERGENCY CODE BREAK SAFETY PROTOCOL
          </div>

          <p className="text-slate-700 font-medium leading-relaxed">
            In accordance with <strong>ICH GCP E6 (R2)</strong> and <strong>21 CFR Part 11</strong>, unblinding a subject&apos;s treatment assignment is restricted to medical emergencies or when knowledge of the Investigational Product is critical for safety decisions. Unblinding triggers an immediate, permanent alert in the compliance log.
          </p>

          <form onSubmit={handleExecuteCodeBreak} className="space-y-4 max-w-xl">
            <div>
              <label className="block font-extrabold text-slate-800 mb-1">
                Select Randomized Subject ID *
              </label>
              <select
                required
                value={codeBreakSubject}
                onChange={(e) => setCodeBreakSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white font-extrabold text-slate-900 focus:ring-2 focus:ring-rose-500 max-w-full"
              >
                <option value="">-- Choose Subject --</option>
                <option value="101-002">101-002 (Randomized - Site 101)</option>
                <option value="101-005">101-005 (In Review - Site 102)</option>
              </select>
            </div>

            <div>
              <label className="block font-extrabold text-slate-800 mb-1">
                Clinical Justification / Primary Reason *
              </label>
              <select
                required
                value={codeBreakReason}
                onChange={(e) => setCodeBreakReason(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white font-extrabold text-slate-900 focus:ring-2 focus:ring-rose-500 max-w-full"
              >
                <option value="">-- Select Reason --</option>
                <option value="Medical Emergency / SAE Grade 3+">Medical Emergency / SAE Grade 3+</option>
                <option value="Unexpected Severe Adverse Reaction">Unexpected Severe Adverse Reaction</option>
                <option value="Emergency Surgical Intervention">Emergency Surgical Intervention</option>
                <option value="Other Regulatory Justification">Other Regulatory Justification</option>
              </select>
            </div>

            <div>
              <label className="block font-extrabold text-slate-800 mb-1">
                Safety Confirmation Check *
              </label>
              <p className="text-[11px] text-slate-500 mb-1 font-semibold">
                Type <strong className="text-slate-900 font-extrabold">CONFIRM UNBLIND</strong> in the box below to authorize this code break:
              </p>
              <input
                type="text"
                required
                value={codeBreakConfirm}
                onChange={(e) => setCodeBreakConfirm(e.target.value)}
                placeholder="CONFIRM UNBLIND"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-mono text-xs font-bold text-slate-900 focus:ring-2 focus:ring-rose-500 max-w-full"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <span>⚠️</span> Execute Emergency Code Break
            </button>
          </form>

          {unblindedResult && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl font-mono text-xs font-bold text-rose-900">
              {unblindedResult}
            </div>
          )}
        </div>
      )}

      {/* Sub-Tab 3: Stratification & Blocks Monitor (Screenshot 3) */}
      {activeTab === "stratification" && (
        <div className="space-y-6">
          {/* Card 1: PERMUTED RANDOMIZATION BLOCKS (BLOCK SIZE: 4) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4 text-xs">
            <div className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <span>📦</span> PERMUTED RANDOMIZATION BLOCKS (BLOCK SIZE: 4)
            </div>

            <p className="text-slate-500 font-medium text-[11px]">
              Blocks are concealed and populated sequentially. Each completed block of size 4 contains exactly 2 Active (Arm A) and 2 Placebo (Arm B) allocations in random sequence to ensure absolute balance.
            </p>

            <div className="space-y-3">
              {/* Block #1 */}
              <div className="p-4 bg-slate-50/60 rounded-xl border border-slate-200/70 flex flex-wrap items-center justify-between gap-4">
                <div className="font-extrabold text-slate-900">
                  Block #1
                  <span className="ml-2 text-[10px] text-blue-700 bg-blue-100 px-2 py-0.5 rounded font-bold">
                    🏆 Active (0/4 Filled)
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="px-3 py-2 bg-white border border-dashed border-slate-300 rounded-lg text-[10px] font-bold text-slate-400 text-center">Pending...</div>
                  <div className="px-3 py-2 bg-white border border-dashed border-slate-300 rounded-lg text-[10px] font-bold text-slate-400 text-center">Pending...</div>
                  <div className="px-3 py-2 bg-white border border-dashed border-slate-300 rounded-lg text-[10px] font-bold text-slate-400 text-center">Pending...</div>
                  <div className="px-3 py-2 bg-white border border-dashed border-slate-300 rounded-lg text-[10px] font-bold text-slate-400 text-center">Pending...</div>
                </div>
              </div>

              {/* Block #2 */}
              <div className="p-4 bg-slate-50/60 rounded-xl border border-slate-200/70 flex flex-wrap items-center justify-between gap-4">
                <div className="font-extrabold text-slate-900">
                  Block #2
                  <span className="ml-2 text-[10px] text-blue-700 bg-blue-100 px-2 py-0.5 rounded font-bold">
                    🏆 Active (0/4 Filled)
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="px-3 py-2 bg-white border border-dashed border-slate-300 rounded-lg text-[10px] font-bold text-slate-400 text-center">Pending...</div>
                  <div className="px-3 py-2 bg-white border border-dashed border-slate-300 rounded-lg text-[10px] font-bold text-slate-400 text-center">Pending...</div>
                  <div className="px-3 py-2 bg-white border border-dashed border-slate-300 rounded-lg text-[10px] font-bold text-slate-400 text-center">Pending...</div>
                  <div className="px-3 py-2 bg-white border border-dashed border-slate-300 rounded-lg text-[10px] font-bold text-slate-400 text-center">Pending...</div>
                </div>
              </div>

              {/* Block #3 */}
              <div className="p-4 bg-slate-50/60 rounded-xl border border-slate-200/70 flex flex-wrap items-center justify-between gap-4">
                <div className="font-extrabold text-slate-900">
                  Block #3
                  <span className="ml-2 text-[10px] text-blue-700 bg-blue-100 px-2 py-0.5 rounded font-bold">
                    🏆 Active (0/4 Filled)
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="px-3 py-2 bg-white border border-dashed border-slate-300 rounded-lg text-[10px] font-bold text-slate-400 text-center">Pending...</div>
                  <div className="px-3 py-2 bg-white border border-dashed border-slate-300 rounded-lg text-[10px] font-bold text-slate-400 text-center">Pending...</div>
                  <div className="px-3 py-2 bg-white border border-dashed border-slate-300 rounded-lg text-[10px] font-bold text-slate-400 text-center">Pending...</div>
                  <div className="px-3 py-2 bg-white border border-dashed border-slate-300 rounded-lg text-[10px] font-bold text-slate-400 text-center">Pending...</div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: STRATIFICATION STRATA BALANCES */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4 text-xs">
            <div className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <span>📊</span> STRATIFICATION STRATA BALANCES
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-400 font-black uppercase text-[10px] tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-3">STRATIFICATION FACTOR</th>
                    <th className="px-5 py-3">SUBGROUP / LOCATION</th>
                    <th className="px-5 py-3">ALLOCATIONS</th>
                    <th className="px-5 py-3">ARM A (ACTIVE)</th>
                    <th className="px-5 py-3">ARM B (PLACEBO)</th>
                    <th className="px-5 py-3">BALANCE RATIO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                  <tr className="hover:bg-slate-50/80">
                    <td className="px-5 py-3 font-extrabold text-slate-900">Site Stratum</td>
                    <td className="px-5 py-3">Apex Research (Boston)</td>
                    <td className="px-5 py-3">0</td>
                    <td className="px-5 py-3">0</td>
                    <td className="px-5 py-3">0</td>
                    <td className="px-5 py-3 font-bold text-emerald-700">Balanced (1:1)</td>
                  </tr>
                  <tr className="hover:bg-slate-50/80">
                    <td className="px-5 py-3 font-extrabold text-slate-900">Site Stratum</td>
                    <td className="px-5 py-3">Johns Hopkins</td>
                    <td className="px-5 py-3">0</td>
                    <td className="px-5 py-3">0</td>
                    <td className="px-5 py-3">0</td>
                    <td className="px-5 py-3 font-bold text-emerald-700">Balanced (1:1)</td>
                  </tr>
                  <tr className="hover:bg-slate-50/80">
                    <td className="px-5 py-3 font-extrabold text-slate-900">Severity Stratum</td>
                    <td className="px-5 py-3">HAMD Score ≥24 (Severe)</td>
                    <td className="px-5 py-3">0</td>
                    <td className="px-5 py-3">0</td>
                    <td className="px-5 py-3">0</td>
                    <td className="px-5 py-3 font-bold text-emerald-700">Balanced (1:1)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
