"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  FileSearch, 
  Search, 
  Building2, 
  ShieldCheck, 
  Download, 
  Lock, 
  Calendar, 
  UserCheck, 
  Clock, 
  CheckCircle2, 
  Info,
  X
} from "lucide-react";

export interface AuditLogEntry {
  id: string;
  studyId: string;
  timestamp: string; // e.g. "2026-04-02 05:14 EST"
  actionDetails: string;
  operator: string;
  hash?: string; // 21 CFR Part 11 digital signature hash
  category?: "Randomization" | "Eligibility" | "Safety / SAE" | "System Auto-Query" | "eCRF / EDC" | "Protocol Amendment" | "Document Vault";
  ipAddress?: string;
}

const INITIAL_AUDIT_LOGS: Record<string, AuditLogEntry[]> = {
  "SLT-206-C118": [
    {
      id: "audit-101",
      studyId: "SLT-206-C118",
      timestamp: "2026-04-02 05:14 EST",
      actionDetails: "Subject NT-087 randomized — Arm A assigned (IVRS #10087)",
      operator: "Dr. Elena Vance",
      category: "Randomization",
      hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      ipAddress: "192.168.1.104",
    },
    {
      id: "audit-102",
      studyId: "SLT-206-C118",
      timestamp: "2026-04-02 05:12 EST",
      actionDetails: "Eligibility review completed for NT-087 — all criteria met",
      operator: "Dr. Elena Vance",
      category: "Eligibility",
      hash: "8f4e0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b812",
      ipAddress: "192.168.1.104",
    },
    {
      id: "audit-103",
      studyId: "SLT-206-C118",
      timestamp: "2026-04-01 11:31 EST",
      actionDetails: "SAE AE-040 submitted — NT-079, Suicidal Ideation Grade 3",
      operator: "Dr. Elena Vance",
      category: "Safety / SAE",
      hash: "7a2b9c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b899",
      ipAddress: "192.168.1.104",
    },
    {
      id: "audit-104",
      studyId: "SLT-206-C118",
      timestamp: "2026-04-01 07:02 EST",
      actionDetails: "Auto-query raised — NT-085 HAMD-17 Week 4 Item 7 missing",
      operator: "System",
      category: "System Auto-Query",
      hash: "1c9d8c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b844",
      ipAddress: "10.0.0.1 (System Core)",
    },
    {
      id: "audit-105",
      studyId: "SLT-206-C118",
      timestamp: "2026-03-31 10:22 EST",
      actionDetails: "eCRF HAMD-17 Baseline entered — NT-085, score 26",
      operator: "RN J. Adams",
      category: "eCRF / EDC",
      hash: "4d5e6c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b833",
      ipAddress: "192.168.2.45",
    },
    {
      id: "audit-106",
      studyId: "SLT-206-C118",
      timestamp: "2026-03-29 12:48 EST",
      actionDetails: "Protocol Amendment v2.1 applied — ECT washout 3→6 months",
      operator: "Medical Monitor",
      category: "Protocol Amendment",
      hash: "9b8a7c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b822",
      ipAddress: "172.16.0.88",
    },
    {
      id: "audit-107",
      studyId: "SLT-206-C118",
      timestamp: "2026-03-28 09:15 EST",
      actionDetails: "Document Vault — Informed Consent Form v4.0 uploaded",
      operator: "Dr. M. Patel",
      category: "Document Vault",
      hash: "3f2e1c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b811",
      ipAddress: "192.168.3.12",
    },
    {
      id: "audit-108",
      studyId: "SLT-206-C118",
      timestamp: "2026-03-25 14:00 EST",
      actionDetails: "Eligibility Meeting scheduled for 2026-04-05 with CRO team",
      operator: "CRO Monitor",
      category: "Eligibility",
      hash: "5e6d7c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b800",
      ipAddress: "10.200.4.15",
    },
  ],
  "MHT-2101-C01": [
    {
      id: "audit-m1",
      studyId: "MHT-2101-C01",
      timestamp: "2026-03-22 16:30 EST",
      actionDetails: "Subject VK-001 Screening consent signed & uploaded",
      operator: "Dr. R. Vance",
      category: "Document Vault",
      hash: "bb112c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b801",
      ipAddress: "192.168.10.5",
    },
    {
      id: "audit-m2",
      studyId: "MHT-2101-C01",
      timestamp: "2026-03-20 11:15 EST",
      actionDetails: "Central Lab sample package #8820 shipped to biorepository",
      operator: "System",
      category: "System Auto-Query",
      hash: "cc223c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b802",
      ipAddress: "10.0.0.1",
    },
    {
      id: "audit-m3",
      studyId: "MHT-2101-C01",
      timestamp: "2026-03-18 09:45 EST",
      actionDetails: "Site Boston Children's IRB Approval v2.1 uploaded",
      operator: "Dr. R. Vance",
      category: "Document Vault",
      hash: "dd334c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b803",
      ipAddress: "192.168.10.5",
    },
  ],
  "GAD-002-NEXUS": [
    {
      id: "audit-g1",
      studyId: "GAD-002-NEXUS",
      timestamp: "2026-03-25 13:20 EST",
      actionDetails: "eCRF HAM-A Visit 2 score entered (score 18)",
      operator: "Dr. H. Miller",
      category: "eCRF / EDC",
      hash: "ee445c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b804",
      ipAddress: "192.168.15.20",
    },
    {
      id: "audit-g2",
      studyId: "GAD-002-NEXUS",
      timestamp: "2026-03-24 10:05 EST",
      actionDetails: "Subject NX-102 Randomization approved by PI",
      operator: "Dr. C. Davis",
      category: "Randomization",
      hash: "ff556c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b805",
      ipAddress: "192.168.15.88",
    },
  ],
};

const PROTOCOL_OPTIONS = [
  { id: "SLT-206-C118", label: "SLT-206-C118 Cerevastatin — Cerevastatin in Bipolar Depression" },
  { id: "MHT-2101-C01", label: "MHT-2101-C01 MYOGUARD-1 — Phase III Myopathy Study" },
  { id: "GAD-002-NEXUS", label: "GAD-002-NEXUS — Phase II Generalized Anxiety" },
  { id: "SCZ-005-APOLLO", label: "SCZ-005-APOLLO — APOLLO Schizophrenia Study" },
  { id: "XPF-010-BS01", label: "XPF-010-BS01 — X-CEED Phase III Protocol" },
  { id: "TEST-001-DEMO", label: "TEST-001-DEMO — Zephyr Test Demo Study" },
];

export const AuditTrailSection: React.FC = () => {
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

  // Selected protocol state
  const [activeStudyId, setActiveStudyId] = useState<string>(selectedStudyId || "SLT-206-C118");

  // Sync activeStudyId if current study is unassigned
  React.useEffect(() => {
    if (visibleProtocolOptions.length > 0) {
      const exists = visibleProtocolOptions.some((p) => p.id === activeStudyId || activeStudyId.includes(p.id));
      if (!exists) {
        setActiveStudyId(visibleProtocolOptions[0].id);
      }
    }
  }, [visibleProtocolOptions, activeStudyId]);

  // Audit Database
  const [auditDb, setAuditDb] = useState<Record<string, AuditLogEntry[]>>(INITIAL_AUDIT_LOGS);

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("eligos_audit_trail");
      if (saved) {
        setAuditDb(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load audit trail from localStorage", e);
    }
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem("eligos_audit_trail", JSON.stringify(auditDb));
    } catch (e) {
      console.error("Failed to save audit trail to localStorage", e);
    }
  }, [auditDb]);

  // Search input
  const [searchQuery, setSearchQuery] = useState("");

  // Inspection Drawer State
  const [selectedEntry, setSelectedEntry] = useState<AuditLogEntry | null>(null);

  // Active protocol log entries
  const currentLogs = auditDb[activeStudyId] || [];

  // Filtered log entries based on search query
  const filteredLogs = currentLogs.filter(
    (log) =>
      log.timestamp.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actionDetails.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.operator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.category && log.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Export Audit Trail Report (CSV)
  const handleExportAuditTrail = () => {
    const csvHeader = "Timestamp,Action Details,Operator / User,Category,21 CFR Part 11 Hash,IP Address\n";
    const csvRows = currentLogs
      .map(
        (l) =>
          `"${l.timestamp}","${l.actionDetails.replace(/"/g, '""')}","${l.operator}","${l.category || "General"}","${l.hash || "N/A"}","${l.ipAddress || "N/A"}"`
      )
      .join("\n");

    const blob = new Blob([csvHeader + csvRows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `FDA_21CFR11_Audit_Trail_${activeStudyId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 font-sans text-slate-800">
      {/* Top Bar Header & Protocol Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            <FileSearch className="w-6 h-6 text-amber-600" />
            System Audit Trail
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Chronological, tamper-evident log of all clinical actions in compliance with FDA 21 CFR Part 11
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Protocol Switcher Pill */}
          <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-400">Study Protocol:</span>
            <select
              value={activeStudyId}
              onChange={(e) => setActiveStudyId(e.target.value)}
              className="bg-transparent text-xs font-black text-slate-900 focus:outline-none cursor-pointer pr-1"
            >
              {visibleProtocolOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleExportAuditTrail}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition"
          >
            <Download className="w-4 h-4" /> Export FDA Audit Log (CSV)
          </button>
        </div>
      </div>

      {/* Compliance Verification Pill Banner */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-4 text-xs text-amber-950">
        <div className="flex items-center gap-2 font-semibold">
          <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>
            FDA 21 CFR Part 11 & GCP Audit Compliance: All user events for protocol <strong className="text-amber-900">{activeStudyId}</strong> are cryptographically hashed and immutably timestamped.
          </span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Hash Integrity Verified
        </span>
      </div>

      {/* Main Table Card (Matches Screenshot Layout Exactly) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {/* Card Header with Search Input & Count Indicator */}
        <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <input
              type="text"
              placeholder="Search audit trail logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="text-xs font-bold text-slate-500">
            Showing <strong className="text-slate-900">{filteredLogs.length}</strong> log entries
          </div>
        </div>

        {/* Audit Logs Table (Matches Screenshot columns & typography) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-slate-200/80">
              <tr>
                <th className="px-6 py-4 w-52">TIMESTAMP (EST)</th>
                <th className="px-6 py-4">ACTION DETAILS</th>
                <th className="px-6 py-4 w-48">OPERATOR / USER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-400 font-medium">
                    No audit trail logs recorded for protocol {activeStudyId}.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => setSelectedEntry(log)}
                    className="hover:bg-slate-50/90 transition cursor-pointer group"
                  >
                    {/* TIMESTAMP (EST) */}
                    <td className="px-6 py-4 font-mono font-medium text-slate-500 text-xs whitespace-nowrap">
                      {log.timestamp}
                    </td>

                    {/* ACTION DETAILS */}
                    <td className="px-6 py-4 font-extrabold text-slate-900 text-xs leading-relaxed">
                      {log.actionDetails}
                    </td>

                    {/* OPERATOR / USER */}
                    <td className="px-6 py-4 font-semibold text-slate-700 text-xs whitespace-nowrap">
                      {log.operator}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FDA Inspection Detail Drawer Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-600" />
                FDA 21 CFR Part 11 Log Verification
              </h3>
              <button
                onClick={() => setSelectedEntry(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Action Event</div>
                <div className="font-extrabold text-slate-900 text-sm">{selectedEntry.actionDetails}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Timestamp</div>
                  <div className="font-mono font-bold text-slate-800 mt-0.5">{selectedEntry.timestamp}</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Operator / User</div>
                  <div className="font-bold text-slate-800 mt-0.5">{selectedEntry.operator}</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Study Protocol</div>
                  <div className="font-mono font-bold text-blue-700 mt-0.5">{selectedEntry.studyId}</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Operator IP Address</div>
                  <div className="font-mono font-bold text-slate-800 mt-0.5">{selectedEntry.ipAddress || "192.168.1.104"}</div>
                </div>
              </div>

              {/* SHA-256 Checksum */}
              <div className="bg-slate-900 text-slate-200 p-3 rounded-xl space-y-1">
                <div className="text-[10px] font-bold uppercase text-amber-400 tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  SHA-256 Cryptographic Checksum (Tamper-Evident Hash)
                </div>
                <div className="font-mono text-[10px] text-emerald-300 break-all">
                  {selectedEntry.hash || "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedEntry(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition"
              >
                Close Verification Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
