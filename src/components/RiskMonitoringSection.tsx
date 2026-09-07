"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  TrendingUp, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Building2, 
  Plus, 
  Edit3, 
  Strikethrough, 
  Download, 
  Sparkles, 
  Sliders, 
  X, 
  FileText,
  Activity
} from "lucide-react";

export interface SiteRiskScore {
  siteName: string;
  piName: string;
  riskLevel: "HIGH" | "MEDIUM" | "LOW";
  scorePercentage: number; // 0 to 100
  openBreaches: number;
}

export interface KriMetric {
  id: string;
  metric: string;
  threshold: string;
  current: string;
  status: "OK" | "Watch" | "Breach";
  category: "Safety" | "Data Quality" | "Protocol Compliance" | "Site Velocity";
  protocolRequirementRef: string;
  isStruckOut?: boolean;
}

const INITIAL_RACM_DATABASE: Record<string, { sites: SiteRiskScore[]; kris: KriMetric[] }> = {
  "SLT-206-C118": {
    sites: [
      {
        siteName: "Columbia",
        piName: "Dr. A. Wright",
        riskLevel: "HIGH",
        scorePercentage: 75,
        openBreaches: 2,
      },
      {
        siteName: "Johns Hopkins",
        piName: "Dr. M. Patel",
        riskLevel: "MEDIUM",
        scorePercentage: 45,
        openBreaches: 1,
      },
      {
        siteName: "Apex Research",
        piName: "Dr. Elena Vance",
        riskLevel: "LOW",
        scorePercentage: 20,
        openBreaches: 0,
      },
      {
        siteName: "UCSF",
        piName: "Dr. L. Kim",
        riskLevel: "LOW",
        scorePercentage: 15,
        openBreaches: 0,
      },
      {
        siteName: "Stanford",
        piName: "Dr. J. Park",
        riskLevel: "MEDIUM",
        scorePercentage: 40,
        openBreaches: 1,
      },
    ],
    kris: [
      {
        id: "kri-1",
        metric: "Protocol Deviations / 100 visits",
        threshold: "<5",
        current: "3.2",
        status: "OK",
        category: "Protocol Compliance",
        protocolRequirementRef: "Section 6.1 (Deviations Log)",
      },
      {
        id: "kri-2",
        metric: "Data Entry Lag (days)",
        threshold: "<5",
        current: "4.1",
        status: "Watch",
        category: "Data Quality",
        protocolRequirementRef: "Section 7.4 (eCRF Timelines)",
      },
      {
        id: "kri-3",
        metric: "Query Resolution Time (days)",
        threshold: "<10",
        current: "12.3",
        status: "Breach",
        category: "Data Quality",
        protocolRequirementRef: "Section 7.5 (Data Management Plan)",
      },
      {
        id: "kri-4",
        metric: "SAE Reporting Compliance",
        threshold: "100%",
        current: "95%",
        status: "Breach",
        category: "Safety",
        protocolRequirementRef: "Section 8.2 (24-Hour SAE Rule)",
      },
      {
        id: "kri-5",
        metric: "Informed Consent Amendment Lag",
        threshold: "<14 days",
        current: "6 days",
        status: "OK",
        category: "Protocol Compliance",
        protocolRequirementRef: "Section 10.1 (IRB Re-consent)",
      },
    ],
  },
  "MHT-2101-C01": {
    sites: [
      {
        siteName: "Boston Children's Hospital",
        piName: "Dr. R. Vance",
        riskLevel: "LOW",
        scorePercentage: 15,
        openBreaches: 0,
      },
      {
        siteName: "CHOP Philadelphia",
        piName: "Dr. E. Thorne",
        riskLevel: "MEDIUM",
        scorePercentage: 35,
        openBreaches: 1,
      },
    ],
    kris: [
      {
        id: "kri-m1",
        metric: "Vector Shipping Temperature Excursions",
        threshold: "0",
        current: "0",
        status: "OK",
        category: "Safety",
        protocolRequirementRef: "Section 4.3 (Cold-chain IP Storage)",
      },
      {
        id: "kri-m2",
        metric: "6MWT Primary Assessment Completeness",
        threshold: "100%",
        current: "92%",
        status: "Watch",
        category: "Data Quality",
        protocolRequirementRef: "Section 5.2 (Motor Assessments)",
      },
    ],
  },
  "GAD-002-NEXUS": {
    sites: [
      {
        siteName: "NYU Langone Health",
        piName: "Dr. H. Miller",
        riskLevel: "LOW",
        scorePercentage: 10,
        openBreaches: 0,
      },
      {
        siteName: "Duke University Medical Center",
        piName: "Dr. C. Davis",
        riskLevel: "HIGH",
        scorePercentage: 80,
        openBreaches: 3,
      },
    ],
    kris: [
      {
        id: "kri-g1",
        metric: "Screen Failure Rate",
        threshold: "<40%",
        current: "48%",
        status: "Breach",
        category: "Site Velocity",
        protocolRequirementRef: "Section 3.1 (Inclusion Screening)",
      },
      {
        id: "kri-g2",
        metric: "Concomitant Benzo Prohibition Violations",
        threshold: "0",
        current: "1",
        status: "Breach",
        category: "Protocol Compliance",
        protocolRequirementRef: "Section 3.2.1 (Prohibited Meds)",
      },
    ],
  },
};

const PROTOCOL_OPTIONS = [
  { id: "SLT-206-C118", label: "SLT-206-C118 Cerevastatin — Cerevastatin in Depressive Episodes" },
  { id: "MHT-2101-C01", label: "MHT-2101-C01 MYOGUARD-1 — Phase III Myopathy Study" },
  { id: "GAD-002-NEXUS", label: "GAD-002-NEXUS — Phase II Generalized Anxiety" },
  { id: "SCZ-005-APOLLO", label: "SCZ-005-APOLLO — APOLLO Schizophrenia Study" },
  { id: "XPF-010-BS01", label: "XPF-010-BS01 — X-CEED Phase III Protocol" },
  { id: "TEST-001-DEMO", label: "TEST-001-DEMO — Zephyr Test Demo Study" },
];

export const RiskMonitoringSection: React.FC = () => {
  const { selectedStudyId } = useAuth();
  
  // Selected protocol state
  const [activeStudy, setActiveStudy] = useState<string>(selectedStudyId || "SLT-206-C118");

  // Database of RACM per study
  const [racmDb, setRacmDb] = useState<Record<string, { sites: SiteRiskScore[]; kris: KriMetric[] }>>(
    INITIAL_RACM_DATABASE
  );

  // Modal States
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [editingKri, setEditingKri] = useState<KriMetric | null>(null);

  // KRI Form States
  const [formMetric, setFormMetric] = useState("");
  const [formThreshold, setFormThreshold] = useState("<5");
  const [formCurrent, setFormCurrent] = useState("0");
  const [formStatus, setFormStatus] = useState<KriMetric["status"]>("OK");
  const [formCategory, setFormCategory] = useState<KriMetric["category"]>("Protocol Compliance");
  const [formRef, setFormRef] = useState("Section 5.0");

  // Active protocol data
  const currentData = racmDb[activeStudy] || {
    sites: [
      { siteName: "Site 101", piName: "Dr. Investigator", riskLevel: "LOW", scorePercentage: 15, openBreaches: 0 }
    ],
    kris: [
      { id: "kri-default", metric: "Protocol Deviations / 100 visits", threshold: "<5", current: "2.1", status: "OK", category: "Protocol Compliance", protocolRequirementRef: "Section 6.0" }
    ]
  };

  // Open Create KRI
  const handleOpenCreateKri = () => {
    setEditingKri(null);
    setFormMetric("");
    setFormThreshold("<5");
    setFormCurrent("0");
    setFormStatus("OK");
    setFormCategory("Protocol Compliance");
    setFormRef("Section 6.1");
    setIsConfigModalOpen(true);
  };

  // Open Edit KRI
  const handleOpenEditKri = (kri: KriMetric) => {
    setEditingKri(kri);
    setFormMetric(kri.metric);
    setFormThreshold(kri.threshold);
    setFormCurrent(kri.current);
    setFormStatus(kri.status);
    setFormCategory(kri.category);
    setFormRef(kri.protocolRequirementRef);
    setIsConfigModalOpen(true);
  };

  // Toggle Strikeout KRI (GCP Rule: Never Delete Audit Records)
  const handleToggleStrikeKri = (id: string) => {
    setRacmDb((prev) => {
      const studyObj = prev[activeStudy] || { sites: [], kris: [] };
      return {
        ...prev,
        [activeStudy]: {
          ...studyObj,
          kris: studyObj.kris.map((k) => (k.id === id ? { ...k, isStruckOut: !k.isStruckOut } : k)),
        },
      };
    });
  };

  // Save KRI Form
  const handleSaveKri = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMetric) return;

    const newKri: KriMetric = {
      id: editingKri ? editingKri.id : `kri-${Date.now()}`,
      metric: formMetric,
      threshold: formThreshold,
      current: formCurrent,
      status: formStatus,
      category: formCategory,
      protocolRequirementRef: formRef,
    };

    setRacmDb((prev) => {
      const studyObj = prev[activeStudy] || { sites: [], kris: [] };
      const currentKris = studyObj.kris;
      const updatedKris = editingKri
        ? currentKris.map((k) => (k.id === editingKri.id ? newKri : k))
        : [...currentKris, newKri];

      return {
        ...prev,
        [activeStudy]: {
          ...studyObj,
          kris: updatedKris,
        },
      };
    });

    setIsConfigModalOpen(false);
  };

  // Export Risk Monitoring Summary CSV
  const handleExportRiskReport = () => {
    const csvContent = 
      `ICH E6 R2 Risk-Based Monitoring (RACM) Report\n` +
      `Study Protocol: ${activeStudy}\n` +
      `Generated: ${new Date().toISOString()}\n\n` +
      `KEY RISK INDICATORS (KRIS)\n` +
      `KRI Metric,Threshold,Current Value,Status,Category,Protocol Ref\n` +
      currentData.kris.map((k) => `"${k.metric}","${k.threshold}","${k.current}","${k.status}","${k.category}","${k.protocolRequirementRef}"`).join("\n") +
      `\n\nSITE RISK SCORES\n` +
      `Site Name,PI Name,Risk Level,Risk Score %\n` +
      currentData.sites.map((s) => `"${s.siteName}","${s.piName}","${s.riskLevel}","${s.scorePercentage}%"`).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ICH_E6_RACM_Risk_Report_${activeStudy}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 font-sans text-slate-800">
      {/* Title & Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-rose-600" />
            Risk-Based Monitoring (RACM)
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            ICH E6 R2 — Key Risk Indicators (KRIs) and site risk scores bound by study protocol
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportRiskReport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
          >
            <Download className="w-4 h-4" /> Export RACM Report (CSV)
          </button>

          <button
            onClick={handleOpenCreateKri}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1D64EC] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-2xs transition"
          >
            <Sliders className="w-4 h-4" /> Configure Protocol KRIs
          </button>
        </div>
      </div>

      {/* Select Study Protocol Filter Card (Exact Match to Screenshot) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
        <label className="block text-xs font-bold text-slate-800">
          Select Study Protocol Filter
        </label>
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

      {/* Two-Column Grid (Exact Layout as Screenshot) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column Card: SITE RISK SCORES */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">
              SITE RISK SCORES
            </h3>
            <span className="text-[11px] font-extrabold text-slate-400">
              Protocol: <strong className="text-slate-700">{activeStudy}</strong>
            </span>
          </div>

          <div className="space-y-6">
            {currentData.sites.map((site, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="font-extrabold text-slate-900 flex items-center gap-2">
                    <span>{site.siteName}</span>
                    <span className="text-[11px] font-normal text-slate-400">({site.piName})</span>
                  </div>

                  {site.riskLevel === "HIGH" && (
                    <span className="text-rose-600 font-extrabold text-xs">HIGH</span>
                  )}
                  {site.riskLevel === "MEDIUM" && (
                    <span className="text-amber-600 font-extrabold text-xs">MEDIUM</span>
                  )}
                  {site.riskLevel === "LOW" && (
                    <span className="text-emerald-600 font-extrabold text-xs">LOW</span>
                  )}
                </div>

                {/* Progress Bar Track */}
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      site.riskLevel === "HIGH"
                        ? "bg-rose-500"
                        : site.riskLevel === "MEDIUM"
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${site.scorePercentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column Card: KEY RISK INDICATORS (KRIS) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">
              KEY RISK INDICATORS (KRIS)
            </h3>

            <button
              onClick={handleOpenCreateKri}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-800 transition flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add KRI Rule
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-slate-200/80">
                <tr>
                  <th className="px-3 py-3">KRI METRIC</th>
                  <th className="px-3 py-3">THRESHOLD</th>
                  <th className="px-3 py-3">CURRENT</th>
                  <th className="px-3 py-3">STATUS</th>
                  <th className="px-3 py-3 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentData.kris.map((kri) => (
                  <tr key={kri.id} className={`hover:bg-slate-50/80 transition group ${kri.isStruckOut ? "bg-slate-50/60" : ""}`}>
                    {/* KRI METRIC */}
                    <td className="px-3 py-3.5">
                      <div className={`font-extrabold text-slate-900 ${kri.isStruckOut ? "line-through text-slate-400 opacity-60" : ""}`}>
                        {kri.metric}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">{kri.protocolRequirementRef}</div>
                    </td>

                    {/* THRESHOLD */}
                    <td className={`px-3 py-3.5 font-bold text-slate-600 ${kri.isStruckOut ? "line-through text-slate-400" : ""}`}>
                      {kri.threshold}
                    </td>

                    {/* CURRENT */}
                    <td className={`px-3 py-3.5 font-mono font-extrabold text-slate-900 ${kri.isStruckOut ? "line-through text-slate-400" : ""}`}>
                      {kri.current}
                    </td>

                    {/* STATUS BADGE */}
                    <td className="px-3 py-3.5">
                      {kri.isStruckOut ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-200 text-slate-600 line-through inline-block">
                          Struck Out
                        </span>
                      ) : kri.status === "OK" ? (
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 inline-block">
                          OK
                        </span>
                      ) : kri.status === "Watch" ? (
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 inline-block">
                          Watch
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 inline-block">
                          Breach
                        </span>
                      )}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-3 py-3.5 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEditKri(kri)}
                        className="p-1 text-slate-400 hover:text-blue-600 transition"
                        title="Edit KRI"
                      >
                        <Edit3 className="w-3.5 h-3.5 inline" />
                      </button>
                      <button
                        onClick={() => handleToggleStrikeKri(kri.id)}
                        className={`p-1 transition rounded ${
                          kri.isStruckOut
                            ? "text-slate-700 bg-slate-200 font-bold"
                            : "text-slate-400 hover:text-amber-600 hover:bg-amber-50"
                        }`}
                        title={kri.isStruckOut ? "Un-strike KRI" : "Strike Out KRI (Retain Audit Record)"}
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
      </div>

      {/* Configure Protocol Risk Thresholds Modal */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <form
            onSubmit={handleSaveKri}
            className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 text-xs font-sans"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-blue-600" />
                {editingKri ? "Edit Protocol Key Risk Indicator" : "Configure Protocol KRI"}
              </h3>
              <button
                type="button"
                onClick={() => setIsConfigModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800">
                  Target Protocol
                </label>
                <div className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-900">
                  {activeStudy}
                </div>
              </div>

              {/* KRI Metric Name */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800">
                  KRI Metric Name *
                </label>
                <input
                  type="text"
                  required
                  value={formMetric}
                  onChange={(e) => setFormMetric(e.target.value)}
                  placeholder="e.g. Protocol Deviations / 100 visits"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Protocol Requirement Reference */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800">
                  Protocol Requirement Section Ref
                </label>
                <input
                  type="text"
                  value={formRef}
                  onChange={(e) => setFormRef(e.target.value)}
                  placeholder="e.g. Section 6.1 (Safety Protocol)"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
                />
              </div>

              {/* Grid 2 cols: Threshold & Current */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">
                    Threshold Value *
                  </label>
                  <input
                    type="text"
                    required
                    value={formThreshold}
                    onChange={(e) => setFormThreshold(e.target.value)}
                    placeholder="e.g. <5 or 100%"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">
                    Current Observed Value
                  </label>
                  <input
                    type="text"
                    value={formCurrent}
                    onChange={(e) => setFormCurrent(e.target.value)}
                    placeholder="e.g. 3.2 or 95%"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Grid 2 cols: Status & Category */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">
                    Risk Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="OK">OK (Compliant)</option>
                    <option value="Watch">Watch (Warning)</option>
                    <option value="Breach">Breach (Threshold Exceeded)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="Protocol Compliance">Protocol Compliance</option>
                    <option value="Safety">Safety</option>
                    <option value="Data Quality">Data Quality</option>
                    <option value="Site Velocity">Site Velocity</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsConfigModalOpen(false)}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold border border-slate-200 rounded-xl transition text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#1D64EC] hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition text-xs"
              >
                Save Protocol KRI Threshold
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
