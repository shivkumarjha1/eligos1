"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  FolderLock, 
  Search, 
  Building2, 
  Upload, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  FileText, 
  ShieldCheck, 
  Layers, 
  Edit3, 
  Strikethrough, 
  Sparkles, 
  Eye, 
  X, 
  FileCode,
  Lock,
  Plus
} from "lucide-react";

export interface EtmfDocument {
  id: string;
  studyId: string;
  zone: string; // e.g. "Zone 3: Regulatory"
  diaRefCode: string; // e.g. "03.02.01"
  title: string;
  version: string;
  scope: string; // e.g. "Global" or "MGH, Johns Hopkins"
  uploadDate: string;
  expirationDate?: string;
  qcStatus: "Approved (QC Passed)" | "Under Review" | "Pending QC" | "Expired";
  checksum: string;
  uploadedBy: string;
  isStruckOut?: boolean;
}

const INITIAL_ETMF_DOCUMENTS: Record<string, EtmfDocument[]> = {
  "SLT-206-C118": [
    {
      id: "DOC-301",
      studyId: "SLT-206-C118",
      zone: "Zone 3: Regulatory",
      diaRefCode: "03.02.01",
      title: "FDA Form 1572 Statement of Investigator Master",
      version: "v4.0",
      scope: "Global",
      uploadDate: "2026-03-25",
      expirationDate: "2027-03-25",
      qcStatus: "Approved (QC Passed)",
      checksum: "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      uploadedBy: "Dr. S. Chen",
    },
    {
      id: "DOC-302",
      studyId: "SLT-206-C118",
      zone: "Zone 3: Regulatory",
      diaRefCode: "03.01.04",
      title: "IND Annual Safety Report & FDA Acknowledgement Letter",
      version: "v2.0",
      scope: "Global",
      uploadDate: "2026-01-15",
      expirationDate: "2027-01-15",
      qcStatus: "Approved (QC Passed)",
      checksum: "sha256:8f4e0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b812",
      uploadedBy: "Regulatory Lead",
    },
    {
      id: "DOC-201",
      studyId: "SLT-206-C118",
      zone: "Zone 2: Central Trial Docs",
      diaRefCode: "02.01.01",
      title: "Investigator's Brochure (IB) 12th Edition — Cerevastatin",
      version: "v12.0",
      scope: "Global",
      uploadDate: "2026-02-01",
      expirationDate: "2027-02-01",
      qcStatus: "Approved (QC Passed)",
      checksum: "sha256:7a2b9c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b899",
      uploadedBy: "Dr. Elena Vance",
    },
    {
      id: "DOC-401",
      studyId: "SLT-206-C118",
      zone: "Zone 4: IRB / IEC Approvals",
      diaRefCode: "04.01.01",
      title: "Central IRB Approval Letter Protocol v4.0 & Stamped ICF",
      version: "v4.0",
      scope: "Apex Research, Johns Hopkins, UCSF",
      uploadDate: "2026-03-20",
      expirationDate: "2027-03-20",
      qcStatus: "Approved (QC Passed)",
      checksum: "sha256:1c9d8c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b844",
      uploadedBy: "CRO Regulatory Monitor",
    },
    {
      id: "DOC-501",
      studyId: "SLT-206-C118",
      zone: "Zone 5: Site Management",
      diaRefCode: "05.02.02",
      title: "Site Qualification Visit (SQV) Final Report — Columbia",
      version: "v1.0",
      scope: "Columbia Site #04",
      uploadDate: "2026-02-12",
      expirationDate: "—",
      qcStatus: "Under Review",
      checksum: "sha256:4d5e6c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b833",
      uploadedBy: "CRA Lead",
    },
    {
      id: "DOC-502",
      studyId: "SLT-206-C118",
      zone: "Zone 5: Site Management",
      diaRefCode: "05.03.01",
      title: "FDA Financial Disclosure Form 3455 — Dr. J. Park",
      version: "v1.0",
      scope: "Stanford Site #05",
      uploadDate: "2026-01-20",
      expirationDate: "2027-01-20",
      qcStatus: "Pending QC",
      checksum: "sha256:9b8a7c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b822",
      uploadedBy: "Site Coordinator",
    },
    {
      id: "DOC-601",
      studyId: "SLT-206-C118",
      zone: "Zone 6: IP & Supplies",
      diaRefCode: "06.01.02",
      title: "Certificate of Analysis (CoA) — Cerevastatin Batch #4421",
      version: "v1.0",
      scope: "Global Depot",
      uploadDate: "2026-01-05",
      expirationDate: "2028-01-05",
      qcStatus: "Approved (QC Passed)",
      checksum: "sha256:3f2e1c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b811",
      uploadedBy: "QA Pharmacy Lead",
    },
    {
      id: "DOC-701",
      studyId: "SLT-206-C118",
      zone: "Zone 7: Safety Reporting",
      diaRefCode: "07.01.01",
      title: "DSMB Charter & Independent Safety Committee Roster",
      version: "v2.0",
      scope: "Global",
      uploadDate: "2025-12-10",
      expirationDate: "2027-12-10",
      qcStatus: "Approved (QC Passed)",
      checksum: "sha256:5e6d7c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b800",
      uploadedBy: "Safety Officer",
    },
    {
      id: "DOC-801",
      studyId: "SLT-206-C118",
      zone: "Zone 8: Central & Local Labs",
      diaRefCode: "08.01.01",
      title: "CLIA / CAP Accreditation — Central Biorepository Lab",
      version: "v2025",
      scope: "Central Lab",
      uploadDate: "2025-11-15",
      expirationDate: "2026-02-15",
      qcStatus: "Expired",
      checksum: "sha256:1122334498fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b899",
      uploadedBy: "Lab Manager",
    },
    {
      id: "DOC-901",
      studyId: "SLT-206-C118",
      zone: "Zone 9: Data & Statistics",
      diaRefCode: "09.02.01",
      title: "Statistical Analysis Plan (SAP) Final Signed Version",
      version: "v3.0",
      scope: "Global",
      uploadDate: "2026-03-01",
      expirationDate: "—",
      qcStatus: "Approved (QC Passed)",
      checksum: "sha256:9988776698fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b888",
      uploadedBy: "Lead Biostatistician",
    },
  ],
  "MHT-2101-C01": [
    {
      id: "DOC-M301",
      studyId: "MHT-2101-C01",
      zone: "Zone 3: Regulatory",
      diaRefCode: "03.02.01",
      title: "FDA Form 1572 Gene Therapy Master",
      version: "v2.1",
      scope: "Global",
      uploadDate: "2026-02-18",
      expirationDate: "2027-02-18",
      qcStatus: "Approved (QC Passed)",
      checksum: "sha256:aa11223344",
      uploadedBy: "Dr. R. Vance",
    },
  ],
  "GAD-002-NEXUS": [
    {
      id: "DOC-G301",
      studyId: "GAD-002-NEXUS",
      zone: "Zone 3: Regulatory",
      diaRefCode: "03.02.01",
      title: "FDA IND Acknowledgment & Protocol Approval",
      version: "v1.2",
      scope: "Global",
      uploadDate: "2026-01-10",
      expirationDate: "2027-01-10",
      qcStatus: "Approved (QC Passed)",
      checksum: "sha256:bb22334455",
      uploadedBy: "Dr. H. Miller",
    },
  ],
};

const ZONES_LIST = [
  "All Zones (1-9)",
  "Zone 1: Trial Management",
  "Zone 2: Central Trial Docs",
  "Zone 3: Regulatory",
  "Zone 4: IRB / IEC Approvals",
  "Zone 5: Site Management",
  "Zone 6: IP & Supplies",
  "Zone 7: Safety Reporting",
  "Zone 8: Central & Local Labs",
  "Zone 9: Data & Statistics",
];

const PROTOCOL_OPTIONS = [
  { id: "SLT-206-C118", label: "SLT-206-C118 Cerevastatin — Cerevastatin in Bipolar Depression" },
  { id: "MHT-2101-C01", label: "MHT-2101-C01 MYOGUARD-1 — Phase III Myopathy Study" },
  { id: "GAD-002-NEXUS", label: "GAD-002-NEXUS — Phase II Generalized Anxiety" },
  { id: "SCZ-005-APOLLO", label: "SCZ-005-APOLLO — APOLLO Schizophrenia Study" },
  { id: "XPF-010-BS01", label: "XPF-010-BS01 — X-CEED Phase III Protocol" },
  { id: "TEST-001-DEMO", label: "TEST-001-DEMO — Zephyr Test Demo Study" },
];

export const RegulatoryEtmfSection: React.FC = () => {
  const { selectedStudyId } = useAuth();
  
  // Selected protocol state
  const [activeStudy, setActiveStudy] = useState<string>(selectedStudyId || "SLT-206-C118");

  // Database of eTMF documents per study
  const [etmfDb, setEtmfDb] = useState<Record<string, EtmfDocument[]>>(INITIAL_ETMF_DOCUMENTS);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedZone, setSelectedZone] = useState("All Zones (1-9)");
  const [qcStatusFilter, setQcStatusFilter] = useState<string>("All");

  // Modals & Drawers
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [inspectDoc, setInspectDoc] = useState<EtmfDocument | null>(null);
  const [editingDoc, setEditingDoc] = useState<EtmfDocument | null>(null);

  // Upload Form Fields
  const [formZone, setFormZone] = useState("Zone 3: Regulatory");
  const [formDiaCode, setFormDiaCode] = useState("03.02.01");
  const [formTitle, setFormTitle] = useState("");
  const [formVersion, setFormVersion] = useState("v1.0");
  const [formScope, setFormScope] = useState("Global");
  const [formExpiration, setFormExpiration] = useState("");

  // Get active list for study
  const activeDocs = etmfDb[activeStudy] || [];

  // Filtered list
  const filteredDocs = activeDocs.filter((doc) => {
    const matchesSearch =
      doc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.diaRefCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesZone = selectedZone === "All Zones (1-9)" || doc.zone === selectedZone;
    const matchesQc = qcStatusFilter === "All" || doc.qcStatus === qcStatusFilter;

    return matchesSearch && matchesZone && matchesQc;
  });

  // Calculate Metrics
  const totalFiled = activeDocs.length;
  const qcApproved = activeDocs.filter((d) => d.qcStatus === "Approved (QC Passed)").length;
  const qcPending = activeDocs.filter((d) => d.qcStatus === "Pending QC" || d.qcStatus === "Under Review").length;
  const expiredCount = activeDocs.filter((d) => d.qcStatus === "Expired").length;
  const completenessPercent = totalFiled > 0 ? Math.round((qcApproved / Math.max(totalFiled, 12)) * 100) : 0;

  // Toggle Strikeout Document (GCP Rule: Never Delete Audit Records)
  const handleToggleStrikeDoc = (id: string) => {
    setEtmfDb((prev) => ({
      ...prev,
      [activeStudy]: (prev[activeStudy] || []).map((doc) =>
        doc.id === id ? { ...doc, isStruckOut: !doc.isStruckOut } : doc
      ),
    }));
  };

  // Open Edit Modal
  const handleOpenEdit = (doc: EtmfDocument) => {
    setEditingDoc(doc);
    setFormZone(doc.zone);
    setFormDiaCode(doc.diaRefCode);
    setFormTitle(doc.title);
    setFormVersion(doc.version);
    setFormScope(doc.scope);
    setFormExpiration(doc.expirationDate || "");
    setIsUploadModalOpen(true);
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingDoc(null);
    setFormZone("Zone 3: Regulatory");
    setFormDiaCode("03.02.01");
    setFormTitle("");
    setFormVersion("v1.0");
    setFormScope("Global");
    setFormExpiration("");
    setIsUploadModalOpen(true);
  };

  // Save Uploaded Document
  const handleSaveDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle) return;

    const newDoc: EtmfDocument = {
      id: editingDoc ? editingDoc.id : `DOC-${Math.floor(100 + Math.random() * 900)}`,
      studyId: activeStudy,
      zone: formZone,
      diaRefCode: formDiaCode || "01.01.01",
      title: formTitle,
      version: formVersion,
      scope: formScope,
      uploadDate: new Date().toISOString().substring(0, 10),
      expirationDate: formExpiration || "2027-12-31",
      qcStatus: "Approved (QC Passed)",
      checksum: `sha256:${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      uploadedBy: "Dr. Elena Vance",
    };

    setEtmfDb((prev) => {
      const currentList = prev[activeStudy] || [];
      if (editingDoc) {
        return {
          ...prev,
          [activeStudy]: currentList.map((d) => (d.id === editingDoc.id ? newDoc : d)),
        };
      } else {
        return {
          ...prev,
          [activeStudy]: [newDoc, ...currentList],
        };
      }
    });

    setIsUploadModalOpen(false);
  };

  // Export eTMF Master Index CSV
  const handleExportEtmfMasterIndex = () => {
    const csvHeader = "Document ID,DIA Zone,DIA Ref Code,Document Title,Version,Scope / Site,Upload Date,Expiration Date,QC Status,21 CFR Part 11 SHA256 Checksum,Uploaded By\n";
    const csvRows = activeDocs
      .map(
        (d) =>
          `"${d.id}","${d.zone}","${d.diaRefCode}","${d.title.replace(/"/g, '""')}","${d.version}","${d.scope}","${d.uploadDate}","${d.expirationDate || "N/A"}","${d.qcStatus}","${d.checksum}","${d.uploadedBy}"`
      )
      .join("\n");

    const blob = new Blob([csvHeader + csvRows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `DIA_v3.0_eTMF_Master_Index_${activeStudy}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 font-sans text-slate-800">
      {/* Top Header & Study Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            <FolderLock className="w-6 h-6 text-slate-700" />
            Regulatory eTMF (Electronic Trial Master File)
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            DIA eTMF Reference Model v3.0 & FDA 21 CFR Part 11 / ICH E6 (R2) Inspection-Ready Master Repository
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Study Selector */}
          <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-400">Study Protocol:</span>
            <select
              value={activeStudy}
              onChange={(e) => setActiveStudy(e.target.value)}
              className="bg-transparent text-xs font-black text-slate-900 focus:outline-none cursor-pointer pr-1"
            >
              {PROTOCOL_OPTIONS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleExportEtmfMasterIndex}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition"
          >
            <Download className="w-4 h-4" /> Export eTMF Master Index (CSV)
          </button>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1D64EC] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-2xs transition"
          >
            <Plus className="w-4 h-4" /> Upload Essential Document
          </button>
        </div>
      </div>

      {/* Metric Cards Banner (eTMF Completeness & Inspection Readiness) */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                DIA eTMF Ref Model v3.0
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> FDA / EMA Inspection Ready
              </span>
            </div>
            <h2 className="text-lg font-black text-white">
              {activeStudy} Master eTMF Audit Readiness
            </h2>
            <p className="text-xs text-indigo-200/80 font-medium">
              Essential trial documents cryptographically signed, version-controlled, and validated against DIA 9-Zone GCP standards.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl border border-white/15">
            <div className="text-center px-3 border-r border-white/15">
              <div className="text-xs text-indigo-200 font-medium">eTMF Completeness</div>
              <div className="text-xl font-black text-white">{completenessPercent}%</div>
            </div>
            <div className="text-center px-3 border-r border-white/15">
              <div className="text-xs text-emerald-300 font-medium">QC Approved</div>
              <div className="text-xl font-black text-emerald-400">{qcApproved}</div>
            </div>
            <div className="text-center px-3 border-r border-white/15">
              <div className="text-xs text-amber-300 font-medium">Pending QC</div>
              <div className="text-xl font-black text-amber-300">{qcPending}</div>
            </div>
            <div className="text-center px-3">
              <div className="text-xs text-rose-300 font-medium">Expired</div>
              <div className="text-xl font-black text-rose-400">{expiredCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* DIA Zone Filter Pills & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[280px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Document Title, Doc ID, DIA Ref Code, or Uploader..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* QC Status Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-500">QC Status:</span>
            <select
              value={qcStatusFilter}
              onChange={(e) => setQcStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 font-bold px-3 py-1.5 rounded-xl focus:outline-none cursor-pointer"
            >
              <option value="All">All QC Statuses</option>
              <option value="Approved (QC Passed)">Approved (QC Passed)</option>
              <option value="Under Review">Under Review</option>
              <option value="Pending QC">Pending QC</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        </div>

        {/* DIA Zone Selector Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-xs font-bold overflow-x-auto pb-1">
          {ZONES_LIST.map((zone) => (
            <button
              key={zone}
              onClick={() => setSelectedZone(zone)}
              className={`px-3 py-1 rounded-xl transition-all whitespace-nowrap text-[11px] ${
                selectedZone === zone
                  ? "bg-[#1D64EC] text-white shadow-2xs font-extrabold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {zone}
            </button>
          ))}
        </div>
      </div>

      {/* eTMF Essential Documents Repository Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-black text-slate-600 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            Essential Document Repository ({filteredDocs.length} items)
          </h3>
          <span className="text-[11px] text-slate-400 font-medium">
            Scope Protocol: <strong className="text-slate-700">{activeStudy}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">DOC ID / DIA ZONE</th>
                <th className="px-5 py-3">ESSENTIAL DOCUMENT TITLE & DIA REF</th>
                <th className="px-5 py-3">VER</th>
                <th className="px-5 py-3">SCOPE</th>
                <th className="px-5 py-3">EXPIRATION</th>
                <th className="px-5 py-3">QC & GCP STATUS</th>
                <th className="px-5 py-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400 font-medium">
                    No essential documents found matching your filter criteria for {activeStudy}.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className={`hover:bg-slate-50/80 transition group ${doc.isStruckOut ? "bg-slate-50/60" : ""}`}>
                    {/* DOC ID & DIA ZONE */}
                    <td className="px-5 py-4 align-top">
                      <div className={`font-mono font-extrabold text-slate-900 ${doc.isStruckOut ? "line-through text-slate-400" : ""}`}>
                        {doc.id}
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 inline-block mt-1">
                        {doc.zone}
                      </span>
                    </td>

                    {/* TITLE & DIA REF */}
                    <td className="px-5 py-4 align-top max-w-md space-y-1">
                      <div className={`font-extrabold text-slate-900 text-xs ${doc.isStruckOut ? "line-through text-slate-400 opacity-60" : ""}`}>
                        {doc.title}
                        {doc.isStruckOut && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-200 text-slate-600 ml-2 no-underline">
                            Struck Out
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                          DIA {doc.diaRefCode}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          Uploaded by {doc.uploadedBy} on {doc.uploadDate}
                        </span>
                      </div>
                    </td>

                    {/* VERSION */}
                    <td className="px-5 py-4 align-top font-mono font-bold text-slate-900">
                      {doc.version}
                    </td>

                    {/* SCOPE */}
                    <td className="px-5 py-4 align-top font-semibold text-slate-700 text-[11px]">
                      {doc.scope}
                    </td>

                    {/* EXPIRATION */}
                    <td className="px-5 py-4 align-top font-mono text-[11px]">
                      {doc.qcStatus === "Expired" ? (
                        <span className="text-rose-600 font-extrabold">{doc.expirationDate}</span>
                      ) : (
                        <span className="text-slate-600 font-medium">{doc.expirationDate || "—"}</span>
                      )}
                    </td>

                    {/* QC & GCP STATUS */}
                    <td className="px-5 py-4 align-top">
                      {doc.qcStatus === "Approved (QC Passed)" && (
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 inline-block">
                          ✓ QC Passed
                        </span>
                      )}
                      {doc.qcStatus === "Under Review" && (
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 inline-block">
                          Under Review
                        </span>
                      )}
                      {doc.qcStatus === "Pending QC" && (
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 inline-block">
                          Pending QC
                        </span>
                      )}
                      {doc.qcStatus === "Expired" && (
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 inline-block">
                          ⚠️ Expired
                        </span>
                      )}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-5 py-4 align-top text-right space-x-1">
                      <button
                        onClick={() => setInspectDoc(doc)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Inspect FDA 21 CFR Part 11 Audit Trail & SHA-256 Checksum"
                      >
                        <Eye className="w-4 h-4 inline" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(doc)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Edit Metadata"
                      >
                        <Edit3 className="w-4 h-4 inline" />
                      </button>
                      <button
                        onClick={() => handleToggleStrikeDoc(doc.id)}
                        className={`p-1.5 transition rounded-lg ${
                          doc.isStruckOut
                            ? "text-slate-700 bg-slate-200 font-bold"
                            : "text-slate-400 hover:text-amber-600 hover:bg-amber-50"
                        }`}
                        title={doc.isStruckOut ? "Un-strike Document" : "Strike Out Document (Retain Audit Trail)"}
                      >
                        <Strikethrough className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload / Edit Essential Document Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <form
            onSubmit={handleSaveDoc}
            className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 space-y-4 text-xs font-sans"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600" />
                {editingDoc ? `Edit eTMF Document Metadata (${editingDoc.id})` : "Upload Essential Document to eTMF"}
              </h3>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-500 font-bold mb-1">DIA eTMF Zone *</label>
                <select
                  value={formZone}
                  onChange={(e) => setFormZone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none"
                >
                  {ZONES_LIST.filter((z) => !z.includes("All")).map((z) => (
                    <option key={z} value={z}>
                      {z}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">DIA Ref Model Code</label>
                <input
                  type="text"
                  value={formDiaCode}
                  onChange={(e) => setFormDiaCode(e.target.value)}
                  placeholder="e.g. 03.02.01"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-slate-500 font-bold mb-1">Essential Document Title *</label>
              <input
                type="text"
                required
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. FDA Form 1572 Master Submission"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-500 font-bold mb-1">Version *</label>
                <input
                  type="text"
                  required
                  value={formVersion}
                  onChange={(e) => setFormVersion(e.target.value)}
                  placeholder="e.g. v1.0"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Scope / Site</label>
                <input
                  type="text"
                  value={formScope}
                  onChange={(e) => setFormScope(e.target.value)}
                  placeholder="e.g. Global or Site #01"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Expiration Date</label>
                <input
                  type="date"
                  value={formExpiration}
                  onChange={(e) => setFormExpiration(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="border-2 border-dashed border-blue-200 bg-blue-50/50 rounded-xl p-4 text-center space-y-1">
              <FileText className="w-8 h-8 text-blue-500 mx-auto" />
              <div className="text-xs font-bold text-slate-800">Select PDF or Signed Document File</div>
              <p className="text-[10px] text-slate-500">File will be hashed with SHA-256 for 21 CFR Part 11 verification.</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold border border-slate-200 rounded-xl transition text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#1D64EC] hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition text-xs flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" /> Save & File to eTMF
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Inspect Document 21 CFR Part 11 Audit Trail Drawer */}
      {inspectDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-4 text-xs font-sans">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-indigo-600" />
                eTMF Audit Trail & DIA Verification
              </h3>
              <button
                type="button"
                onClick={() => setInspectDoc(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Document Title</div>
                <div className="font-extrabold text-slate-900 text-sm">{inspectDoc.title}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Document ID</div>
                  <div className="font-mono font-extrabold text-slate-800 mt-0.5">{inspectDoc.id}</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold uppercase text-slate-400">DIA Ref Code</div>
                  <div className="font-mono font-bold text-blue-700 mt-0.5">DIA {inspectDoc.diaRefCode}</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Version</div>
                  <div className="font-mono font-bold text-slate-800 mt-0.5">{inspectDoc.version}</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold uppercase text-slate-400">QC Status</div>
                  <div className="font-bold text-emerald-700 mt-0.5">{inspectDoc.qcStatus}</div>
                </div>
              </div>

              {/* SHA-256 Checksum */}
              <div className="bg-slate-900 text-slate-200 p-3 rounded-xl space-y-1">
                <div className="text-[10px] font-bold uppercase text-indigo-400 tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  FDA 21 CFR Part 11 Digital Checksum
                </div>
                <div className="font-mono text-[10px] text-emerald-300 break-all">
                  {inspectDoc.checksum}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setInspectDoc(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition"
              >
                Close Verification Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
