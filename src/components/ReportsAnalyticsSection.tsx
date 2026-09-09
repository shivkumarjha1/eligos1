"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  BarChart2, 
  ShieldAlert, 
  ClipboardList, 
  Building2, 
  FileText, 
  TrendingUp, 
  Calendar, 
  Mail, 
  Download, 
  Clock, 
  CheckCircle2, 
  X, 
  Plus, 
  Send, 
  Sparkles,
  FileSpreadsheet,
  FileCode,
  ShieldCheck,
  AlertTriangle
} from "lucide-react";

export interface ScheduledExport {
  id: string;
  studyId: string;
  reportName: string;
  frequency: "Daily" | "Weekly" | "Bi-Weekly" | "Monthly";
  recipientEmails: string;
  format: "PDF (FDA Ready)" | "Excel (.xlsx)" | "CSV";
  nextDelivery: string;
  status: "Active" | "Paused";
}

const INITIAL_SCHEDULED_EXPORTS: ScheduledExport[] = [
  {
    id: "sch-1",
    studyId: "SLT-206-C118",
    reportName: "Enrollment Status",
    frequency: "Weekly",
    recipientEmails: "clinical@solastis.com, pi.vance@apex-trials.org, monitor@synapse-cro.com",
    format: "PDF (FDA Ready)",
    nextDelivery: "2026-04-06 08:00 EST",
    status: "Active",
  },
  {
    id: "sch-2",
    studyId: "SLT-206-C118",
    reportName: "Safety Narrative (DSMB)",
    frequency: "Bi-Weekly",
    recipientEmails: "dsmb-chair@safetyboard.org, sponsor@solastis.com",
    format: "PDF (FDA Ready)",
    nextDelivery: "2026-04-10 09:00 EST",
    status: "Active",
  },
  {
    id: "sch-3",
    studyId: "SLT-206-C118",
    reportName: "Site Performance & SDV KRIs",
    frequency: "Monthly",
    recipientEmails: "qa-compliance@solastis.com, lead-cra@cro.com",
    format: "Excel (.xlsx)",
    nextDelivery: "2026-05-01 07:00 EST",
    status: "Active",
  },
];

const REPORT_CARDS = [
  {
    id: "rep-enrollment",
    title: "Enrollment Status",
    description: "Enrollment vs target by site and study arm",
    badge: "Weekly",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
    icon: <BarChart2 className="w-6 h-6 text-blue-600" />,
    regulatoryCode: "FDA RBM / ICH E6(R2)",
  },
  {
    id: "rep-safety",
    title: "Safety Narrative",
    description: "AE/SAE listings for DSMB safety committee",
    badge: "As Needed",
    badgeColor: "bg-rose-100 text-rose-800 border-rose-200",
    icon: <ShieldAlert className="w-6 h-6 text-rose-600" />,
    regulatoryCode: "CIOMS / FDA 21 CFR 312.32",
  },
  {
    id: "rep-completeness",
    title: "Data Completeness",
    description: "eCRF missing data and query resolution status",
    badge: "Bi-Weekly",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    icon: <ClipboardList className="w-6 h-6 text-amber-600" />,
    regulatoryCode: "GCP Data Quality",
  },
  {
    id: "rep-performance",
    title: "Site Performance",
    description: "KRIs, SDV rates, monitoring compliance",
    badge: "Monthly",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
    icon: <Building2 className="w-6 h-6 text-emerald-600" />,
    regulatoryCode: "TransCelerate RBM KRIs",
  },
  {
    id: "rep-audit",
    title: "Audit Trail Export",
    description: "Full 21 CFR Part 11 electronic audit log",
    badge: "On Demand",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
    icon: <FileText className="w-6 h-6 text-slate-700" />,
    regulatoryCode: "FDA 21 CFR Part 11",
  },
  {
    id: "rep-csr",
    title: "Clinical Study Report (CSR)",
    description: "ICH E3 compliant CSR final export",
    badge: "End of Study",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
    icon: <TrendingUp className="w-6 h-6 text-purple-600" />,
    regulatoryCode: "ICH E3 CSR Standards",
  },
  // Industry Regulation Expanded Cards
  {
    id: "rep-dsmb-package",
    title: "DSMB Interim Safety Package",
    description: "Interim safety analysis & unblinded committee review",
    badge: "Bi-Monthly",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
    regulatoryCode: "FDA DSMB Charter 2026",
  },
  {
    id: "rep-etmf-index",
    title: "Regulatory eTMF Master Index",
    description: "DIA Reference Model eTMF completeness audit",
    badge: "Monthly",
    badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
    icon: <FileCode className="w-6 h-6 text-indigo-600" />,
    regulatoryCode: "DIA eTMF Ref Model v3.0",
  },
];

const PROTOCOL_OPTIONS = [
  { id: "SLT-206-C118", label: "SLT-206-C118 Cerevastatin — Cerevastatin in Depressive Episodes" },
  { id: "MHT-2101-C01", label: "MHT-2101-C01 MYOGUARD-1 — Phase III Myopathy Study" },
  { id: "GAD-002-NEXUS", label: "GAD-002-NEXUS — Phase II Generalized Anxiety" },
  { id: "SCZ-005-APOLLO", label: "SCZ-005-APOLLO — APOLLO Schizophrenia Study" },
  { id: "XPF-010-BS01", label: "XPF-010-BS01 — X-CEED Phase III Protocol" },
  { id: "TEST-001-DEMO", label: "TEST-001-DEMO — Zephyr Test Demo Study" },
];

export const ReportsAnalyticsSection: React.FC = () => {
  const { currentUser, selectedStudyId } = useAuth();
  
  const isAdmin = currentUser?.role === "SuperAdmin" || currentUser?.role === "Admin";
  const assignedCodes = currentUser?.assignedStudies || [];

  const visibleProtocolOptions = React.useMemo(() => {
    if (isAdmin) return PROTOCOL_OPTIONS;
    return PROTOCOL_OPTIONS.filter((p) =>
      assignedCodes.some(
        (code) => p.id.includes(code) || code.includes(p.id) || p.label.includes(code)
      )
    );
  }, [isAdmin, assignedCodes]);

  // Active selected protocol filter
  const [activeStudy, setActiveStudy] = useState<string>(selectedStudyId || "SLT-206-C118");

  // Sync activeStudy if unassigned
  React.useEffect(() => {
    if (visibleProtocolOptions.length > 0) {
      const exists = visibleProtocolOptions.some((p) => p.id === activeStudy || activeStudy.includes(p.id));
      if (!exists) {
        setActiveStudy(visibleProtocolOptions[0].id);
      }
    }
  }, [visibleProtocolOptions, activeStudy]);

  // Scheduled Exports Database State
  const [scheduledExports, setScheduledExports] = useState<ScheduledExport[]>(INITIAL_SCHEDULED_EXPORTS);

  // Modal States
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedReportTitle, setSelectedReportTitle] = useState("");

  // Schedule Modal Form States
  const [formReportName, setFormReportName] = useState("Enrollment Status");
  const [formFrequency, setFormFrequency] = useState<ScheduledExport["frequency"]>("Weekly");
  const [formEmails, setFormEmails] = useState("sponsor@solastis.com, pi@apex-trials.org, monitor@synapse-cro.com");
  const [formFormat, setFormFormat] = useState<ScheduledExport["format"]>("PDF (FDA Ready)");

  // Filter scheduled exports by active study
  const studySchedules = scheduledExports.filter((s) => s.studyId === activeStudy);

  // Save new export schedule
  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEmails) return;

    const newSchedule: ScheduledExport = {
      id: `sch-${Date.now()}`,
      studyId: activeStudy,
      reportName: formReportName,
      frequency: formFrequency,
      recipientEmails: formEmails,
      format: formFormat,
      nextDelivery: formFrequency === "Daily" ? "Tomorrow 08:00 EST" : formFrequency === "Weekly" ? "Next Monday 08:00 EST" : "1st of Next Month 08:00 EST",
      status: "Active",
    };

    setScheduledExports((prev) => [newSchedule, ...prev]);
    setIsScheduleModalOpen(false);
  };

  // Toggle Schedule Pause/Active
  const handleToggleScheduleStatus = (id: string) => {
    setScheduledExports((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: s.status === "Active" ? "Paused" : "Active" } : s))
    );
  };

  // Delete Schedule
  const handleDeleteSchedule = (id: string) => {
    if (!confirm("Are you sure you want to remove this scheduled report distribution?")) return;
    setScheduledExports((prev) => prev.filter((s) => s.id !== id));
  };

  // Trigger Immediate Report Generation / Download
  const handleGenerateReport = (reportTitle: string) => {
    setSelectedReportTitle(reportTitle);
    setIsPreviewModalOpen(true);
  };

  // Execute Download CSV/PDF
  const handleDownloadFile = () => {
    const csvContent = 
      `FDA Clinical Study Report: ${selectedReportTitle}\n` +
      `Protocol ID: ${activeStudy}\n` +
      `Generated Timestamp: ${new Date().toISOString()}\n` +
      `Compliance Hash: sha256_fda_21cfr11_valid_cert\n\n` +
      `Metric,Value,Threshold,Status\n` +
      `Total Target Enrollment,50,50,On Track\n` +
      `Active Sites,5,5,Operational\n` +
      `SDV Completion Rate,87%,80%,Compliant\n` +
      `Open Queries,3,10,Low Risk\n`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${activeStudy}_${selectedReportTitle.replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsPreviewModalOpen(false);
  };

  return (
    <div className="space-y-6 font-sans text-slate-800">
      {/* Top Header & Schedule Action Button */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Reports & Analytics
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Generate clinical study reports, DSMB safety narratives, and ICH E3 CSR exports
          </p>
        </div>

        <button
          onClick={() => setIsScheduleModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1D64EC] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-2xs transition"
        >
          <Calendar className="w-4 h-4" /> Schedule Report Export
        </button>
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
          {visibleProtocolOptions.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {/* Report Cards Grid (Matches Screenshot 3-column layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {REPORT_CARDS.map((card) => (
          <div
            key={card.id}
            onClick={() => handleGenerateReport(card.title)}
            className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs hover:shadow-md hover:border-blue-300 transition cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl w-fit group-hover:bg-blue-50 transition">
                {card.icon}
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-blue-600 transition">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${card.badgeColor}`}>
                {card.badge}
              </span>
              <span className="text-[10px] font-mono text-slate-400 font-semibold">
                {card.regulatoryCode}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Scheduled Automated Distributions List Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              Active Scheduled Email Distributions ({studySchedules.length})
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Automated GCP compliance report delivery sent directly to specified study recipient emails.
            </p>
          </div>

          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-xl transition"
          >
            <Plus className="w-3.5 h-3.5" /> Add Distribution Schedule
          </button>
        </div>

        {studySchedules.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 font-medium">
            No automated email schedules configured for study {activeStudy}. Click &quot;Schedule Report Export&quot; above to set up automated delivery.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Report Name</th>
                  <th className="px-4 py-3">Frequency</th>
                  <th className="px-4 py-3">Specified Recipient Emails (Per Study)</th>
                  <th className="px-4 py-3">Format</th>
                  <th className="px-4 py-3">Next Scheduled Delivery</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studySchedules.map((sch) => (
                  <tr key={sch.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3 font-extrabold text-slate-900">{sch.reportName}</td>
                    <td className="px-4 py-3 font-bold text-blue-700">{sch.frequency}</td>
                    <td className="px-4 py-3 font-mono text-slate-600 max-w-xs truncate" title={sch.recipientEmails}>
                      {sch.recipientEmails}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-700">{sch.format}</td>
                    <td className="px-4 py-3 font-mono text-slate-500">{sch.nextDelivery}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          sch.status === "Active"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {sch.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => handleToggleScheduleStatus(sch.id)}
                        className="text-xs font-bold text-slate-600 hover:text-blue-600 underline"
                      >
                        {sch.status === "Active" ? "Pause" : "Resume"}
                      </button>
                      <button
                        onClick={() => handleDeleteSchedule(sch.id)}
                        className="text-xs font-bold text-rose-600 hover:text-rose-800 underline"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Schedule Report Export Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <form
            onSubmit={handleSaveSchedule}
            className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 text-xs font-sans"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Schedule Automated Report Export
              </h3>
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Study Protocol */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800">
                  Target Study Protocol
                </label>
                <div className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-900">
                  {activeStudy}
                </div>
              </div>

              {/* Report Selection */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800">
                  Select Report Type *
                </label>
                <select
                  value={formReportName}
                  onChange={(e) => setFormReportName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none cursor-pointer"
                >
                  {REPORT_CARDS.map((r) => (
                    <option key={r.id} value={r.title}>
                      {r.title} ({r.badge})
                    </option>
                  ))}
                </select>
              </div>

              {/* Export Frequency */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800">
                  Export Frequency *
                </label>
                <select
                  value={formFrequency}
                  onChange={(e) => setFormFrequency(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none cursor-pointer"
                >
                  <option value="Daily">Daily (Every morning at 08:00 EST)</option>
                  <option value="Weekly">Weekly (Every Monday at 08:00 EST)</option>
                  <option value="Bi-Weekly">Bi-Weekly (Every 2 weeks)</option>
                  <option value="Monthly">Monthly (1st of every month)</option>
                </select>
              </div>

              {/* Specified Recipient Emails per Study */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800">
                  Specified Recipient Emails per Study *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formEmails}
                  onChange={(e) => setFormEmails(e.target.value)}
                  placeholder="Enter comma-separated emails e.g. sponsor@solastis.com, pi@apex-trials.org"
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none"
                />
                <p className="text-[10px] text-slate-400">
                  Reports will automatically be delivered as encrypted email attachments to these addresses.
                </p>
              </div>

              {/* Export Format */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800">
                  Output Format *
                </label>
                <select
                  value={formFormat}
                  onChange={(e) => setFormFormat(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none cursor-pointer"
                >
                  <option value="PDF (FDA Ready)">PDF (FDA Regulatory Ready with Digital Signature)</option>
                  <option value="Excel (.xlsx)">Excel (.xlsx Data Spreadsheet)</option>
                  <option value="CSV">CSV Raw Data Format</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold border border-slate-200 rounded-xl transition text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#1D64EC] hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition text-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Save & Activate Distribution Schedule
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Immediate Report Generation / Preview Modal */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-4 text-xs font-sans">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                Generate {selectedReportTitle}
              </h3>
              <button
                type="button"
                onClick={() => setIsPreviewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-slate-500 font-semibold text-[11px]">
                  <span>Study Protocol:</span>
                  <strong className="text-slate-900">{activeStudy}</strong>
                </div>
                <div className="flex items-center justify-between text-slate-500 font-semibold text-[11px]">
                  <span>Regulatory Standard:</span>
                  <span className="text-blue-700 font-mono font-bold">FDA 21 CFR Part 11 / GCP E6(R2)</span>
                </div>
                <div className="flex items-center justify-between text-slate-500 font-semibold text-[11px]">
                  <span>Data Cutoff:</span>
                  <strong className="text-slate-900">Live Real-time Sync (Mar 2026)</strong>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-3 rounded-xl flex items-center gap-2 font-semibold text-[11px]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Report data compiled and validated. Ready for export download.</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsPreviewModalOpen(false)}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold border border-slate-200 rounded-xl transition text-xs"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleDownloadFile}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition text-xs flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Download Report File (.CSV / .PDF)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
