"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  Plus, 
  X, 
  Building2, 
  Edit3, 
  Strikethrough, 
  Search, 
  Upload, 
  FileSpreadsheet, 
  Download, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw,
  Sparkles
} from "lucide-react";

export interface SiteRecord {
  id: string;
  studyId: string;
  name: string;
  piName: string;
  irbStatus: "Approved" | "Pending" | "Under Review" | "Expired";
  enrolled: number;
  target: number;
  sdvPercentage: string; // e.g. "94%" or "—"
  lastMonitoring: string; // e.g. "Mar 20"
  status: "Active" | "Under Review" | "Initiated" | "Suspended" | "Closed";
  isStruckOut?: boolean;
}

const INITIAL_SITES_DATABASE: Record<string, SiteRecord[]> = {
  "SLT-206-C118": [
    {
      id: "site-1",
      studyId: "SLT-206-C118",
      name: "Apex Research",
      piName: "Dr. Elena Vance",
      irbStatus: "Approved",
      enrolled: 28,
      target: 36,
      sdvPercentage: "94%",
      lastMonitoring: "Mar 20",
      status: "Active",
    },
    {
      id: "site-2",
      studyId: "SLT-206-C118",
      name: "Johns Hopkins",
      piName: "Dr. M. Patel",
      irbStatus: "Approved",
      enrolled: 21,
      target: 36,
      sdvPercentage: "78%",
      lastMonitoring: "Mar 15",
      status: "Active",
    },
    {
      id: "site-3",
      studyId: "SLT-206-C118",
      name: "UCSF",
      piName: "Dr. L. Kim",
      irbStatus: "Approved",
      enrolled: 17,
      target: 36,
      sdvPercentage: "91%",
      lastMonitoring: "Mar 10",
      status: "Active",
    },
    {
      id: "site-4",
      studyId: "SLT-206-C118",
      name: "Columbia",
      piName: "Dr. A. Wright",
      irbStatus: "Approved",
      enrolled: 7,
      target: 36,
      sdvPercentage: "61%",
      lastMonitoring: "Feb 15",
      status: "Under Review",
    },
    {
      id: "site-5",
      studyId: "SLT-206-C118",
      name: "Stanford",
      piName: "Dr. J. Park",
      irbStatus: "Pending",
      enrolled: 2,
      target: 36,
      sdvPercentage: "—",
      lastMonitoring: "Jan 22",
      status: "Initiated",
    },
  ],
  "MHT-2101-C01": [
    {
      id: "site-m1",
      studyId: "MHT-2101-C01",
      name: "Boston Children's Hospital",
      piName: "Dr. R. Vance",
      irbStatus: "Approved",
      enrolled: 4,
      target: 8,
      sdvPercentage: "88%",
      lastMonitoring: "Mar 18",
      status: "Active",
    },
    {
      id: "site-m2",
      studyId: "MHT-2101-C01",
      name: "CHOP Philadelphia",
      piName: "Dr. E. Thorne",
      irbStatus: "Approved",
      enrolled: 3,
      target: 8,
      sdvPercentage: "92%",
      lastMonitoring: "Mar 12",
      status: "Active",
    },
  ],
  "GAD-002-NEXUS": [
    {
      id: "site-g1",
      studyId: "GAD-002-NEXUS",
      name: "NYU Langone Health",
      piName: "Dr. H. Miller",
      irbStatus: "Approved",
      enrolled: 15,
      target: 25,
      sdvPercentage: "95%",
      lastMonitoring: "Mar 22",
      status: "Active",
    },
    {
      id: "site-g2",
      studyId: "GAD-002-NEXUS",
      name: "Duke University Medical Center",
      piName: "Dr. C. Davis",
      irbStatus: "Approved",
      enrolled: 12,
      target: 25,
      sdvPercentage: "89%",
      lastMonitoring: "Mar 05",
      status: "Active",
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

export const SiteManagementSection: React.FC = () => {
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

  // Database of sites per study protocol
  const [sitesDatabase, setSitesDatabase] = useState<Record<string, SiteRecord[]>>(INITIAL_SITES_DATABASE);

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("eligos_site_management");
      if (saved) {
        setSitesDatabase(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load sites database from localStorage", e);
    }
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem("eligos_site_management", JSON.stringify(sitesDatabase));
    } catch (e) {
      console.error("Failed to save sites database to localStorage", e);
    }
  }, [sitesDatabase]);

  // Single Add / Edit Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<SiteRecord | null>(null);

  // Bulk Upload Modal State
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [parsedBulkSites, setParsedBulkSites] = useState<Omit<SiteRecord, "id" | "studyId">[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [fileError, setFileError] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");

  // Form States for Single Add / Edit
  const [formSiteName, setFormSiteName] = useState("");
  const [formPiName, setFormPiName] = useState("");
  const [formIrbStatus, setFormIrbStatus] = useState<SiteRecord["irbStatus"]>("Approved");
  const [formSiteStatus, setFormSiteStatus] = useState<SiteRecord["status"]>("Active");
  const [formEnrolled, setFormEnrolled] = useState<number>(0);
  const [formTarget, setFormTarget] = useState<number>(36);
  const [formSdv, setFormSdv] = useState<string>("—");
  const [formLastMonitoring, setFormLastMonitoring] = useState<string>("");

  // Search filter
  const [searchQuery, setSearchQuery] = useState("");

  // Get current active list of sites for the protocol
  const currentSites = sitesDatabase[activeStudyId] || [];

  // Filtered sites
  const filteredSites = currentSites.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.piName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingSite(null);
    setFormSiteName("");
    setFormPiName("");
    setFormIrbStatus("Approved");
    setFormSiteStatus("Active");
    setFormEnrolled(0);
    setFormTarget(36);
    setFormSdv("—");
    setFormLastMonitoring("");
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (site: SiteRecord) => {
    setEditingSite(site);
    setFormSiteName(site.name);
    setFormPiName(site.piName);
    setFormIrbStatus(site.irbStatus);
    setFormSiteStatus(site.status);
    setFormEnrolled(site.enrolled);
    setFormTarget(site.target);
    setFormSdv(site.sdvPercentage);
    setFormLastMonitoring(site.lastMonitoring);
    setIsAddModalOpen(true);
  };

  // Toggle Strikeout Site (GCP Rule: Never Delete Clinical Audit Records)
  const handleToggleStrikeSite = (id: string) => {
    setSitesDatabase((prev) => ({
      ...prev,
      [activeStudyId]: (prev[activeStudyId] || []).map((s) =>
        s.id === id ? { ...s, isStruckOut: !s.isStruckOut } : s
      ),
    }));
  };

  // Submit Single Site Form
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSiteName || !formPiName) return;

    const newRecord: SiteRecord = {
      id: editingSite ? editingSite.id : `site-${Date.now()}`,
      studyId: activeStudyId,
      name: formSiteName,
      piName: formPiName,
      irbStatus: formIrbStatus,
      status: formSiteStatus,
      enrolled: Number(formEnrolled),
      target: Number(formTarget),
      sdvPercentage: formSdv || "—",
      lastMonitoring: formLastMonitoring || "Mar 20",
    };

    setSitesDatabase((prev) => {
      const list = prev[activeStudyId] || [];
      if (editingSite) {
        return {
          ...prev,
          [activeStudyId]: list.map((item) => (item.id === editingSite.id ? newRecord : item)),
        };
      } else {
        return {
          ...prev,
          [activeStudyId]: [...list, newRecord],
        };
      }
    });

    setIsAddModalOpen(false);
  };

  // Download Sample CSV Template
  const handleDownloadSampleCsv = () => {
    const csvContent = 
      "Site Name,PI Name,IRB Status,Enrolled,Target,SDV %,Last Monitoring Date,Site Status\n" +
      "Mayo Clinic,Dr. K. Vance,Approved,14,36,95%,Mar 24,Active\n" +
      "Cleveland Clinic,Dr. R. Gupta,Approved,19,36,88%,Mar 22,Active\n" +
      "Cedars-Sinai Medical Center,Dr. T. O'Connor,Approved,11,36,76%,Mar 19,Active\n" +
      "Vanderbilt Health,Dr. S. Al-Mansoor,Pending,3,36,—,Feb 28,Initiated\n" +
      "Mount Sinai Hospital,Dr. H. Goldberg,Approved,8,36,64%,Feb 10,Under Review\n";

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `EligOS_Sites_Import_Template.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Parse CSV File Content
  const parseCsvText = (text: string) => {
    setFileError("");
    const lines = text.split(/\r\n|\n/).filter((line) => line.trim() !== "");
    if (lines.length <= 1) {
      setFileError("CSV file appears to be empty or missing data rows.");
      return;
    }

    const parsed: Omit<SiteRecord, "id" | "studyId">[] = [];

    // Skip header line
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(",").map((col) => col.trim().replace(/^"(.*)"$/, "$1"));
      if (row.length >= 2 && row[0]) {
        const siteName = row[0];
        const piName = row[1] || "Dr. Unassigned";
        const irbStatusRaw = row[2] || "Approved";
        const enrolledNum = parseInt(row[3] || "0", 10) || 0;
        const targetNum = parseInt(row[4] || "36", 10) || 36;
        const sdvRaw = row[5] || "—";
        const lastMonRaw = row[6] || "Mar 20";
        const siteStatusRaw = row[7] || "Active";

        // Map valid statuses
        const validIrb: SiteRecord["irbStatus"] = ["Approved", "Pending", "Under Review", "Expired"].includes(irbStatusRaw as any)
          ? (irbStatusRaw as any)
          : "Approved";

        const validSiteStatus: SiteRecord["status"] = ["Active", "Under Review", "Initiated", "Suspended", "Closed"].includes(siteStatusRaw as any)
          ? (siteStatusRaw as any)
          : "Active";

        parsed.push({
          name: siteName,
          piName,
          irbStatus: validIrb,
          enrolled: enrolledNum,
          target: targetNum,
          sdvPercentage: sdvRaw,
          lastMonitoring: lastMonRaw,
          status: validSiteStatus,
        });
      }
    }

    if (parsed.length === 0) {
      setFileError("Could not extract valid site records from file. Please check column format.");
    } else {
      setParsedBulkSites(parsed);
    }
  };

  // Handle File Input Change
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setIsParsing(true);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      setTimeout(() => {
        parseCsvText(text);
        setIsParsing(false);
      }, 600);
    };
    reader.readAsText(file);
  };

  // Load Preset Demo Data in Bulk Modal
  const handleLoadDemoBulkData = () => {
    setUploadedFileName("Bulk_Sites_Batch_2026.csv");
    setIsParsing(true);
    setTimeout(() => {
      setParsedBulkSites([
        {
          name: "Mayo Clinic",
          piName: "Dr. K. Vance",
          irbStatus: "Approved",
          enrolled: 14,
          target: 36,
          sdvPercentage: "95%",
          lastMonitoring: "Mar 24",
          status: "Active",
        },
        {
          name: "Cleveland Clinic",
          piName: "Dr. R. Gupta",
          irbStatus: "Approved",
          enrolled: 19,
          target: 36,
          sdvPercentage: "88%",
          lastMonitoring: "Mar 22",
          status: "Active",
        },
        {
          name: "Cedars-Sinai Medical Center",
          piName: "Dr. T. O'Connor",
          irbStatus: "Approved",
          enrolled: 11,
          target: 36,
          sdvPercentage: "76%",
          lastMonitoring: "Mar 19",
          status: "Active",
        },
        {
          name: "Vanderbilt Health",
          piName: "Dr. S. Al-Mansoor",
          irbStatus: "Pending",
          enrolled: 3,
          target: 36,
          sdvPercentage: "—",
          lastMonitoring: "Feb 28",
          status: "Initiated",
        },
        {
          name: "Mount Sinai Hospital",
          piName: "Dr. H. Goldberg",
          irbStatus: "Approved",
          enrolled: 8,
          target: 36,
          sdvPercentage: "64%",
          lastMonitoring: "Feb 10",
          status: "Under Review",
        },
      ]);
      setIsParsing(false);
    }, 500);
  };

  // Confirm Import Parsed Sites
  const handleConfirmBulkImport = () => {
    if (parsedBulkSites.length === 0) return;

    const newRecords: SiteRecord[] = parsedBulkSites.map((item, idx) => ({
      id: `site-bulk-${Date.now()}-${idx}`,
      studyId: activeStudyId,
      ...item,
    }));

    setSitesDatabase((prev) => ({
      ...prev,
      [activeStudyId]: [...(prev[activeStudyId] || []), ...newRecords],
    }));

    setIsBulkModalOpen(false);
    setParsedBulkSites([]);
    setUploadedFileName("");
  };

  // SDV percentage color helper
  const getSdvColorClass = (sdv: string) => {
    if (sdv === "—" || !sdv) return "text-slate-400 font-medium";
    const num = parseInt(sdv.replace("%", ""), 10);
    if (isNaN(num)) return "text-slate-700 font-bold";
    if (num >= 90) return "text-emerald-600 font-extrabold";
    if (num >= 75) return "text-amber-600 font-extrabold";
    return "text-rose-600 font-extrabold";
  };

  return (
    <div className="space-y-6 font-sans text-slate-800">
      {/* Title & Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Site Management
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Protocol-bound clinical sites, IRB approvals, enrollment metrics, and SDV monitoring status.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Study Selector Pill */}
          <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-400">Study:</span>
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

          {/* Bulk Upload CSV / Excel Button */}
          <button
            onClick={() => {
              setParsedBulkSites([]);
              setUploadedFileName("");
              setFileError("");
              setIsBulkModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-2xs transition"
          >
            <FileSpreadsheet className="w-4 h-4" /> Bulk Import Excel / CSV
          </button>

          {/* Single Add Site Button */}
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1D64EC] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-2xs transition"
          >
            <Plus className="w-4 h-4" /> Add Site
          </button>
        </div>
      </div>

      {/* Main Table Card Container (Exact styling as Screenshot 1) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {/* Search & Stats Header */}
        <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by site name, PI investigator, or status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div className="text-xs text-slate-500 font-semibold">
            Total Sites Enrolled: <strong className="text-slate-900">{filteredSites.length}</strong>
          </div>
        </div>

        {/* Sites Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-slate-200/80">
              <tr>
                <th className="px-6 py-4">SITE</th>
                <th className="px-6 py-4">PI</th>
                <th className="px-6 py-4">IRB</th>
                <th className="px-6 py-4">ENROLLED</th>
                <th className="px-6 py-4">TARGET</th>
                <th className="px-6 py-4">SDV%</th>
                <th className="px-6 py-4">LAST MONITORING</th>
                <th className="px-6 py-4">STATUS</th>
                <th className="px-6 py-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSites.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-slate-400 font-medium">
                    No clinical sites registered for protocol {activeStudyId}. Click &quot;Add Site&quot; or &quot;Bulk Import Excel / CSV&quot; to add sites.
                  </td>
                </tr>
              ) : (
                filteredSites.map((site) => (
                  <tr key={site.id} className="hover:bg-slate-50/80 transition group">
                    {/* SITE NAME */}
                    <td className="px-6 py-4 font-extrabold text-slate-900 text-xs">
                      {site.name}
                    </td>

                    {/* PI INVESTIGATOR */}
                    <td className="px-6 py-4 font-semibold text-slate-700 text-xs">
                      {site.piName}
                    </td>

                    {/* IRB STATUS BADGE */}
                    <td className="px-6 py-4">
                      {site.irbStatus === "Approved" ? (
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100/90 text-emerald-800 border border-emerald-200/80 inline-block">
                          Approved
                        </span>
                      ) : site.irbStatus === "Pending" ? (
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100/90 text-amber-800 border border-amber-200/80 inline-block">
                          Pending
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-rose-100/90 text-rose-800 border border-rose-200/80 inline-block">
                          {site.irbStatus}
                        </span>
                      )}
                    </td>

                    {/* ENROLLED */}
                    <td className="px-6 py-4 font-bold text-slate-900 text-xs">
                      {site.enrolled}
                    </td>

                    {/* TARGET */}
                    <td className="px-6 py-4 font-bold text-slate-600 text-xs">
                      {site.target}
                    </td>

                    {/* SDV% */}
                    <td className={`px-6 py-4 text-xs ${getSdvColorClass(site.sdvPercentage)}`}>
                      {site.sdvPercentage}
                    </td>

                    {/* LAST MONITORING */}
                    <td className="px-6 py-4 font-semibold text-slate-600 text-xs">
                      {site.lastMonitoring}
                    </td>

                    {/* STATUS BADGE */}
                    <td className="px-6 py-4">
                      {site.status === "Active" && (
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 inline-block">
                          Active
                        </span>
                      )}
                      {site.status === "Under Review" && (
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 inline-block">
                          Under Review
                        </span>
                      )}
                      {site.status === "Initiated" && (
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 inline-block">
                          Initiated
                        </span>
                      )}
                      {site.status === "Suspended" && (
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 inline-block">
                          Suspended
                        </span>
                      )}
                      {site.status === "Closed" && (
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 inline-block">
                          Closed
                        </span>
                      )}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-4 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEditModal(site)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 transition rounded-lg hover:bg-blue-50"
                        title="Edit Site"
                      >
                        <Edit3 className="w-3.5 h-3.5 inline" />
                      </button>
                      <button
                        onClick={() => handleToggleStrikeSite(site.id)}
                        className={`p-1.5 transition rounded-lg ${
                          site.isStruckOut
                            ? "text-slate-700 bg-slate-200 font-bold"
                            : "text-slate-400 hover:text-amber-600 hover:bg-amber-50"
                        }`}
                        title={site.isStruckOut ? "Un-strike Site" : "Strike Out Site (Retain Audit Record)"}
                      >
                        <Strikethrough className="w-3.5 h-3.5 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Upload Excel / CSV Modal */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden space-y-4 p-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                Bulk Import Clinical Sites (Excel / CSV)
              </h3>
              <button
                type="button"
                onClick={() => setIsBulkModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Protocol Context Banner */}
            <div className="bg-blue-50 border border-blue-200/80 rounded-xl p-3 flex items-center justify-between gap-4 text-xs text-blue-900">
              <div className="flex items-center gap-2 font-semibold">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>Target Study Protocol: <strong className="text-slate-900">{activeStudyId}</strong></span>
              </div>
              <button
                type="button"
                onClick={handleDownloadSampleCsv}
                className="inline-flex items-center gap-1 text-[11px] font-extrabold text-blue-700 hover:text-blue-900 bg-white px-2.5 py-1 rounded-lg border border-blue-200 shadow-2xs transition"
              >
                <Download className="w-3 h-3" /> Download Sample CSV Template
              </button>
            </div>

            {/* Dropzone & File Input */}
            <div className="border-2 border-dashed border-emerald-200 bg-emerald-50/40 rounded-2xl p-6 text-center space-y-3">
              <FileSpreadsheet className="w-10 h-10 text-emerald-500 mx-auto" />
              <div className="space-y-1">
                <div className="text-xs font-extrabold text-slate-800">
                  {uploadedFileName ? `File Selected: ${uploadedFileName}` : "Upload Excel (.xlsx, .csv) File"}
                </div>
                <p className="text-[11px] text-slate-500">
                  Column Headers required: Site Name, PI Name, IRB Status, Enrolled, Target, SDV %, Last Monitoring Date, Site Status
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <label className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition inline-flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" /> Browse Excel / CSV File
                  <input
                    type="file"
                    accept=".csv, .xlsx, .xls, .txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={handleLoadDemoBulkData}
                  className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 text-xs rounded-xl transition inline-flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Load Sample Batch Data
                </button>
              </div>
            </div>

            {/* Parsing error notice */}
            {fileError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{fileError}</span>
              </div>
            )}

            {/* Parsing Progress Spinner */}
            {isParsing && (
              <div className="p-4 text-center text-xs text-slate-600 font-semibold flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin" /> Parsing file and validating columns...
              </div>
            )}

            {/* Parsed Preview Table */}
            {parsedBulkSites.length > 0 && !isParsing && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Parsed Sites Preview ({parsedBulkSites.length} sites ready to import):</span>
                </div>
                <div className="border border-slate-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-500 font-extrabold uppercase text-[10px]">
                      <tr>
                        <th className="px-3 py-2">Site Name</th>
                        <th className="px-3 py-2">PI Investigator</th>
                        <th className="px-3 py-2">IRB</th>
                        <th className="px-3 py-2">Enrolled / Target</th>
                        <th className="px-3 py-2">SDV %</th>
                        <th className="px-3 py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {parsedBulkSites.map((s, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="px-3 py-2 font-bold text-slate-900">{s.name}</td>
                          <td className="px-3 py-2 font-medium text-slate-700">{s.piName}</td>
                          <td className="px-3 py-2 font-bold text-emerald-700">{s.irbStatus}</td>
                          <td className="px-3 py-2 font-mono text-slate-800">{s.enrolled} / {s.target}</td>
                          <td className="px-3 py-2 font-bold text-slate-700">{s.sdvPercentage}</td>
                          <td className="px-3 py-2 font-bold text-blue-700">{s.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsBulkModalOpen(false)}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold border border-slate-200 rounded-xl text-xs transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBulkImport}
                disabled={parsedBulkSites.length === 0}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-xs text-xs transition inline-flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Import {parsedBulkSites.length} Sites into Protocol
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Single Add / Edit Clinical Site Modal (Exact layout & fields as Screenshot 2) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingSite ? "Edit Clinical Site" : "Add Clinical Site"}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitForm} className="p-6 space-y-4 text-xs font-sans">
              {/* Site Name */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800">
                  Site Name *
                </label>
                <input
                  type="text"
                  required
                  value={formSiteName}
                  onChange={(e) => setFormSiteName(e.target.value)}
                  placeholder="e.g. UCSF, Stanford"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* PI Name */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800">
                  PI Name (Investigator) *
                </label>
                <input
                  type="text"
                  required
                  value={formPiName}
                  onChange={(e) => setFormPiName(e.target.value)}
                  placeholder="e.g. Dr. J. Park"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Grid 2 cols: IRB Status & Site Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">
                    IRB Status
                  </label>
                  <select
                    value={formIrbStatus}
                    onChange={(e) => setFormIrbStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                  >
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">
                    Site Status
                  </label>
                  <select
                    value={formSiteStatus}
                    onChange={(e) => setFormSiteStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Initiated">Initiated</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Grid 2 cols: Enrolled & Target */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">
                    Enrolled *
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={formEnrolled}
                    onChange={(e) => setFormEnrolled(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">
                    Target *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formTarget}
                    onChange={(e) => setFormTarget(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Grid 2 cols: SDV % & Last Monitoring Date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">
                    SDV % (e.g. 94%)
                  </label>
                  <input
                    type="text"
                    value={formSdv}
                    onChange={(e) => setFormSdv(e.target.value)}
                    placeholder="—"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">
                    Last Monitoring Date
                  </label>
                  <input
                    type="text"
                    value={formLastMonitoring}
                    onChange={(e) => setFormLastMonitoring(e.target.value)}
                    placeholder="e.g. Mar 20"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold border border-slate-200 rounded-xl transition text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1D64EC] hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition text-xs"
                >
                  {editingSite ? "Save Changes" : "Add Site"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
