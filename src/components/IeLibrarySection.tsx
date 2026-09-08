"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  BookOpen, 
  Search, 
  Filter, 
  Plus, 
  Upload, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Strikethrough, 
  Download, 
  Sparkles, 
  FileCode, 
  Layers, 
  RefreshCw, 
  X, 
  Check, 
  AlertCircle, 
  Building2,
  Lock
} from "lucide-react";

export interface Criterion {
  id: string; // e.g. "INC-01"
  studyId: string;
  type: "Inclusion" | "Exclusion";
  category: "Demographics" | "Diagnostic" | "Severity" | "Laboratory" | "Psychiatric" | "Concomitant Meds" | "Safety" | "Administrative";
  title: string;
  description: string;
  protocolSection: string;
  isMandatory: boolean;
  waiverAllowed: boolean;
  parsedAt: string;
  isStruckOut?: boolean;
}

// Preset parsed criteria for each study protocol
const INITIAL_CRITERIA_DATABASE: Record<string, Criterion[]> = {
  "SLT-206-C118": [
    {
      id: "INC-01",
      studyId: "SLT-206-C118",
      type: "Inclusion",
      category: "Demographics",
      title: "Age Eligibility Range",
      description: "Male or female adult participants aged 18 to 65 years inclusive at the time of signing informed consent.",
      protocolSection: "Section 5.1.1",
      isMandatory: true,
      waiverAllowed: false,
      parsedAt: "2026-03-25 10:14:02",
    },
    {
      id: "INC-02",
      studyId: "SLT-206-C118",
      type: "Inclusion",
      category: "Diagnostic",
      title: "DSM-5 Bipolar I or II Diagnosis",
      description: "Primary clinical diagnosis of Bipolar I or Bipolar II Disorder (DSM-5 / ICD-10 F31.9), currently experiencing a Major Depressive Episode without psychotic features.",
      protocolSection: "Section 5.1.2",
      isMandatory: true,
      waiverAllowed: false,
      parsedAt: "2026-03-25 10:14:02",
    },
    {
      id: "INC-03",
      studyId: "SLT-206-C118",
      type: "Inclusion",
      category: "Severity",
      title: "MADRS Depression Severity Score",
      description: "Montgomery-Åsberg Depression Rating Scale (MADRS) total score ≥ 24 at Screening and Baseline (Visit 1).",
      protocolSection: "Section 5.1.3",
      isMandatory: true,
      waiverAllowed: false,
      parsedAt: "2026-03-25 10:14:02",
    },
    {
      id: "INC-04",
      studyId: "SLT-206-C118",
      type: "Inclusion",
      category: "Severity",
      title: "HAMD-17 Depressed Mood Score",
      description: "Hamilton Depression Rating Scale (HAMD-17) Item 1 (Depressed Mood) score ≥ 2 at Screening.",
      protocolSection: "Section 5.1.4",
      isMandatory: true,
      waiverAllowed: false,
      parsedAt: "2026-03-25 10:14:02",
    },
    {
      id: "INC-05",
      studyId: "SLT-206-C118",
      type: "Inclusion",
      category: "Administrative",
      title: "PCP / Psychiatrist Consent Contact",
      description: "Subject agrees to allow study staff to contact their primary care physician or treating psychiatrist to confirm medical history and coordinate safety follow-up.",
      protocolSection: "Section 5.1.5",
      isMandatory: true,
      waiverAllowed: true,
      parsedAt: "2026-03-25 10:14:02",
    },
    {
      id: "EXC-01",
      studyId: "SLT-206-C118",
      type: "Exclusion",
      category: "Psychiatric",
      title: "Psychotic & Cognitive Comorbidities",
      description: "Lifetime history or current diagnosis of Schizophrenia, Schizoaffective Disorder, Major Neurocognitive Disorder, or severe Personality Disorder.",
      protocolSection: "Section 5.2.1",
      isMandatory: true,
      waiverAllowed: false,
      parsedAt: "2026-03-25 10:14:02",
    },
    {
      id: "EXC-02",
      studyId: "SLT-206-C118",
      type: "Exclusion",
      category: "Safety",
      title: "Active Suicidal Risk (C-SSRS)",
      description: "Active suicidal ideation with intent/plan (C-SSRS suicidal ideation score 4 or 5 in past 6 months) or any suicide attempt in past 12 months.",
      protocolSection: "Section 5.2.2",
      isMandatory: true,
      waiverAllowed: false,
      parsedAt: "2026-03-25 10:14:02",
    },
    {
      id: "EXC-03",
      studyId: "SLT-206-C118",
      type: "Exclusion",
      category: "Laboratory",
      title: "Hepatic Transaminase Elevation",
      description: "Serum ALT or AST > 3.0x Upper Limit of Normal (ULN) or total bilirubin > 1.5x ULN at screening laboratory assessment.",
      protocolSection: "Section 5.2.3",
      isMandatory: true,
      waiverAllowed: false,
      parsedAt: "2026-03-25 10:14:02",
    },
    {
      id: "EXC-04",
      studyId: "SLT-206-C118",
      type: "Exclusion",
      category: "Concomitant Meds",
      title: "Prohibited Psychotropic / CYP3A4 Inhibitors",
      description: "Use of MAOIs, strong CYP3A4 inhibitors (e.g. ketoconazole, clarithromycin), or changes in mood stabilizer dosage within 28 days prior to Baseline.",
      protocolSection: "Section 5.2.4",
      isMandatory: true,
      waiverAllowed: false,
      parsedAt: "2026-03-25 10:14:02",
    },
    {
      id: "EXC-05",
      studyId: "SLT-206-C118",
      type: "Exclusion",
      category: "Safety",
      title: "Substance Use & Drug Screen Positive",
      description: "Positive Urine Drug Screen (UDS) for non-prescribed controlled substances (opiates, cocaine, amphetamines, PCP) or alcohol dependence within 90 days.",
      protocolSection: "Section 5.2.5",
      isMandatory: true,
      waiverAllowed: true,
      parsedAt: "2026-03-25 10:14:02",
    },
  ],
  "MHT-2101-C01": [
    {
      id: "INC-01",
      studyId: "MHT-2101-C01",
      type: "Inclusion",
      category: "Diagnostic",
      title: "Confirmed VKCM Genetic Mutation",
      description: "Genetically confirmed Voss-Kellerman Congenital Myopathy (VKCM) with documented pathogenic mutation in the VKCM-1 gene.",
      protocolSection: "Section 4.1.1",
      isMandatory: true,
      waiverAllowed: false,
      parsedAt: "2026-02-18 14:20:00",
    },
    {
      id: "INC-02",
      studyId: "MHT-2101-C01",
      type: "Inclusion",
      category: "Demographics",
      title: "Pediatric & Young Adult Age Range",
      description: "Participants aged 12 to 55 years at Screening.",
      protocolSection: "Section 4.1.2",
      isMandatory: true,
      waiverAllowed: false,
      parsedAt: "2026-02-18 14:20:00",
    },
    {
      id: "EXC-01",
      studyId: "MHT-2101-C01",
      type: "Exclusion",
      category: "Safety",
      title: "Invasive Mechanical Ventilation Dependency",
      description: "Requirement for continuous invasive mechanical ventilation > 16 hours/day.",
      protocolSection: "Section 4.2.1",
      isMandatory: true,
      waiverAllowed: false,
      parsedAt: "2026-02-18 14:20:00",
    },
    {
      id: "EXC-02",
      studyId: "MHT-2101-C01",
      type: "Exclusion",
      category: "Concomitant Meds",
      title: "Prior AAV Gene Therapy Transfer",
      description: "Previous exposure to any investigational adeno-associated virus (AAV) gene therapy product.",
      protocolSection: "Section 4.2.2",
      isMandatory: true,
      waiverAllowed: false,
      parsedAt: "2026-02-18 14:20:00",
    },
  ],
  "GAD-002-NEXUS": [
    {
      id: "INC-01",
      studyId: "GAD-002-NEXUS",
      type: "Inclusion",
      category: "Diagnostic",
      title: "Generalized Anxiety Disorder (DSM-5)",
      description: "Primary diagnosis of GAD with Hamilton Anxiety Rating Scale (HAM-A) score ≥ 20 at screening.",
      protocolSection: "Section 3.1.1",
      isMandatory: true,
      waiverAllowed: false,
      parsedAt: "2026-01-10 09:30:00",
    },
    {
      id: "EXC-01",
      studyId: "GAD-002-NEXUS",
      type: "Exclusion",
      category: "Concomitant Meds",
      title: "Recent Benzodiazepine Usage",
      description: "Use of systemic benzodiazepines within 14 days prior to baseline randomization.",
      protocolSection: "Section 3.2.1",
      isMandatory: true,
      waiverAllowed: false,
      parsedAt: "2026-01-10 09:30:00",
    },
  ],
};

const PROTOCOL_OPTIONS = [
  { id: "SLT-206-C118", label: "SLT-206-C118 — Cerevastatin in Bipolar I/II Depression", version: "v4.0 (2026-03)" },
  { id: "MHT-2101-C01", label: "MHT-2101-C01 — MYOGUARD-1 VKCM Gene Therapy", version: "v2.1 (2026-02)" },
  { id: "GAD-002-NEXUS", label: "GAD-002-NEXUS — NEXUS Phase II GAD Protocol", version: "v1.2 (2026-01)" },
  { id: "SCZ-005-APOLLO", label: "SCZ-005-APOLLO — APOLLO Schizophrenia Study", version: "v1.0 (2025-11)" },
  { id: "XPF-010-BS01", label: "XPF-010-BS01 — X-CEED Phase III Protocol", version: "v3.0 (2025-12)" },
  { id: "TEST-001-DEMO", label: "TEST-001-DEMO — Zephyr Test Demo Study", version: "v1.0 (2026-04)" },
];

export const IeLibrarySection: React.FC = () => {
  const { currentUser } = useAuth();
  
  // Selected protocol state
  const [selectedStudy, setSelectedStudy] = useState("SLT-206-C118");

  // Database of criteria
  const [criteriaDb, setCriteriaDb] = useState<Record<string, Criterion[]>>(INITIAL_CRITERIA_DATABASE);

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("eligos_ie_criteria");
      if (saved) {
        setCriteriaDb(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load I/E criteria from localStorage", e);
    }
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem("eligos_ie_criteria", JSON.stringify(criteriaDb));
    } catch (e) {
      console.error("Failed to save I/E criteria to localStorage", e);
    }
  }, [criteriaDb]);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"All" | "Inclusion" | "Exclusion">("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [mandatoryFilter, setMandatoryFilter] = useState<"All" | "Mandatory" | "Waiver">("All");

  // Modals
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [parseLog, setParseLog] = useState<string[]>([]);

  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingCriterion, setEditingCriterion] = useState<Criterion | null>(null);

  // Form fields for Add/Edit
  const [formId, setFormId] = useState("");
  const [formType, setFormType] = useState<"Inclusion" | "Exclusion">("Inclusion");
  const [formCategory, setFormCategory] = useState<Criterion["category"]>("Diagnostic");
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formSection, setFormSection] = useState("");
  const [formMandatory, setFormMandatory] = useState(true);
  const [formWaiver, setFormWaiver] = useState(false);

  // Current study criteria list
  const activeCriteria = criteriaDb[selectedStudy] || [];

  // Filtered criteria list
  const filteredCriteria = activeCriteria.filter((c) => {
    const matchesSearch = 
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.protocolSection.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === "All" || c.type === typeFilter;
    const matchesCategory = categoryFilter === "All" || c.category === categoryFilter;
    const matchesMandatory = 
      mandatoryFilter === "All" || 
      (mandatoryFilter === "Mandatory" && c.isMandatory) ||
      (mandatoryFilter === "Waiver" && c.waiverAllowed);

    return matchesSearch && matchesType && matchesCategory && matchesMandatory;
  });

  // Calculate counts
  const totalInclusion = activeCriteria.filter((c) => c.type === "Inclusion").length;
  const totalExclusion = activeCriteria.filter((c) => c.type === "Exclusion").length;

  // Open Edit Modal
  const handleOpenEdit = (criterion: Criterion) => {
    setEditingCriterion(criterion);
    setFormId(criterion.id);
    setFormType(criterion.type);
    setFormCategory(criterion.category);
    setFormTitle(criterion.title);
    setFormDescription(criterion.description);
    setFormSection(criterion.protocolSection);
    setFormMandatory(criterion.isMandatory);
    setFormWaiver(criterion.waiverAllowed);
    setShowAddEditModal(true);
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingCriterion(null);
    const nextIncNum = totalInclusion + 1;
    setFormId(`INC-0${nextIncNum}`);
    setFormType("Inclusion");
    setFormCategory("Diagnostic");
    setFormTitle("");
    setFormDescription("");
    setFormSection("Section 5.1");
    setFormMandatory(true);
    setFormWaiver(false);
    setShowAddEditModal(true);
  };

  // Save Criterion
  const handleSaveCriterion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formDescription) return;

    const newCriterion: Criterion = {
      id: formId,
      studyId: selectedStudy,
      type: formType,
      category: formCategory,
      title: formTitle,
      description: formDescription,
      protocolSection: formSection || "Section 5.0",
      isMandatory: formMandatory,
      waiverAllowed: formWaiver,
      parsedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
    };

    setCriteriaDb((prev) => {
      const currentList = prev[selectedStudy] || [];
      if (editingCriterion) {
        return {
          ...prev,
          [selectedStudy]: currentList.map((item) => (item.id === editingCriterion.id ? newCriterion : item)),
        };
      } else {
        return {
          ...prev,
          [selectedStudy]: [newCriterion, ...currentList],
        };
      }
    });

    setShowAddEditModal(false);
  };

  // Toggle Strikeout Criterion (GCP Rule: Never Delete Audit Records)
  const handleToggleStrikeCriterion = (id: string) => {
    setCriteriaDb((prev) => ({
      ...prev,
      [selectedStudy]: (prev[selectedStudy] || []).map((item) =>
        item.id === id ? { ...item, isStruckOut: !item.isStruckOut } : item
      ),
    }));
  };

  // Simulate Protocol PDF Parser Execution
  const handleSimulateParser = () => {
    setIsParsing(true);
    setParseLog([
      "📄 File uploaded: Protocol_Document_v4.0_FINAL.pdf (14.2 MB)",
      "🔍 Extracting raw text from Section 5 (Eligibility Criteria)...",
      "🤖 Running AI NLP Parser (Gemini Clinical Engine v2.4)...",
      "✅ Identified 5 Inclusion Criteria & 5 Exclusion Criteria",
      "⚙️ Mapping logic parameters to GCP Compliance Rules...",
      "✨ Database synchronized successfully!"
    ]);

    setTimeout(() => {
      setIsParsing(false);
      // Ensure dataset has full SLT-206-C118 criteria
      setCriteriaDb((prev) => ({
        ...prev,
        [selectedStudy]: INITIAL_CRITERIA_DATABASE["SLT-206-C118"],
      }));
      setShowUploadModal(false);
    }, 2500);
  };

  // Export JSON/CSV
  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeCriteria, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${selectedStudy}_IE_Library_Rules.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 font-sans text-slate-800">
      {/* Top Header & Protocol Selection */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-rose-500" />
            Inclusion / Exclusion (I/E) Library
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Protocol-specific parsed rulebook automatically generated from uploaded Clinical Trial Protocols.
          </p>
        </div>

        {/* Study Protocol Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-400">Study Protocol:</span>
            <select
              value={selectedStudy}
              onChange={(e) => setSelectedStudy(e.target.value)}
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
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
          >
            <Upload className="w-4 h-4" /> Upload & Parse Protocol PDF
          </button>
        </div>
      </div>

      {/* Banner / Protocol Stats Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <FileCode className="w-48 h-48 text-white" />
        </div>

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/30 text-blue-200 border border-blue-400/30">
                {selectedStudy} Protocol Rules
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI Parsed & Verified
              </span>
            </div>
            <h2 className="text-lg font-black text-white">
              {PROTOCOL_OPTIONS.find((p) => p.id === selectedStudy)?.label}
            </h2>
            <p className="text-xs text-blue-200/80 font-medium">
              Version: {PROTOCOL_OPTIONS.find((p) => p.id === selectedStudy)?.version} • Last Parsed Sync: Mar 25, 2026
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl border border-white/15">
            <div className="text-center px-3 border-r border-white/15">
              <div className="text-xs text-blue-200 font-medium">Total Criteria</div>
              <div className="text-xl font-black text-white">{activeCriteria.length}</div>
            </div>
            <div className="text-center px-3 border-r border-white/15">
              <div className="text-xs text-emerald-300 font-medium">Inclusion</div>
              <div className="text-xl font-black text-emerald-400">{totalInclusion}</div>
            </div>
            <div className="text-center px-3">
              <div className="text-xs text-rose-300 font-medium">Exclusion</div>
              <div className="text-xl font-black text-rose-400">{totalExclusion}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left: Search input */}
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search criteria by ID, title, description, or protocol section..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
              title="Download Structured Rulebook"
            >
              <Download className="w-3.5 h-3.5" /> Export Rules (JSON)
            </button>

            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
            >
              <Plus className="w-4 h-4" /> Add Custom Criterion
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          {/* Type Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl font-bold">
            <button
              onClick={() => setTypeFilter("All")}
              className={`px-3 py-1 rounded-lg transition ${
                typeFilter === "All" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setTypeFilter("Inclusion")}
              className={`px-3 py-1 rounded-lg transition flex items-center gap-1 ${
                typeFilter === "Inclusion" ? "bg-emerald-600 text-white shadow-2xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <CheckCircle2 className="w-3 h-3" /> Inclusion ({totalInclusion})
            </button>
            <button
              onClick={() => setTypeFilter("Exclusion")}
              className={`px-3 py-1 rounded-lg transition flex items-center gap-1 ${
                typeFilter === "Exclusion" ? "bg-rose-600 text-white shadow-2xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <XCircle className="w-3 h-3" /> Exclusion ({totalExclusion})
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1">
            <span className="text-slate-400 font-semibold">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 font-bold px-2.5 py-1 rounded-lg focus:outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Demographics">Demographics</option>
              <option value="Diagnostic">Diagnostic</option>
              <option value="Severity">Severity</option>
              <option value="Laboratory">Laboratory</option>
              <option value="Psychiatric">Psychiatric</option>
              <option value="Concomitant Meds">Concomitant Meds</option>
              <option value="Safety">Safety</option>
              <option value="Administrative">Administrative</option>
            </select>
          </div>

          {/* Mandatory Filter */}
          <div className="flex items-center gap-1">
            <span className="text-slate-400 font-semibold">Strictness:</span>
            <select
              value={mandatoryFilter}
              onChange={(e) => setMandatoryFilter(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 text-slate-800 font-bold px-2.5 py-1 rounded-lg focus:outline-none"
            >
              <option value="All">All Strictness</option>
              <option value="Mandatory">Strict Mandatory Only</option>
              <option value="Waiver">Waiver Permitted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Criteria Library Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-black text-slate-600 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            Parsed Criteria Database ({filteredCriteria.length} entries)
          </h3>
          <span className="text-[11px] text-slate-400 font-medium">
            Showing criteria for study: <strong className="text-slate-700">{selectedStudy}</strong>
          </span>
        </div>

        {filteredCriteria.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">No matching criteria found</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your search query, clearing filters, or uploading a protocol PDF to parse criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3">Code / Type</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Title & Rule Description</th>
                  <th className="px-5 py-3">Protocol Ref</th>
                  <th className="px-5 py-3">Strictness</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCriteria.map((c) => (
                  <tr key={c.id} className={`hover:bg-slate-50/80 transition group ${c.isStruckOut ? "bg-slate-50/60" : ""}`}>
                    {/* Code & Type */}
                    <td className="px-5 py-4 align-top">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[11px] ${
                            c.isStruckOut
                              ? "bg-slate-200 text-slate-500 border border-slate-300"
                              : c.type === "Inclusion"
                              ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                              : "bg-rose-100 text-rose-700 border border-rose-300"
                          }`}
                        >
                          {c.type === "Inclusion" ? "✓" : "✕"}
                        </span>
                        <div>
                          <div className={`font-extrabold font-mono text-slate-900 ${c.isStruckOut ? "line-through text-slate-400" : ""}`}>
                            {c.id}
                          </div>
                          <div
                            className={`text-[10px] font-bold ${
                              c.isStruckOut
                                ? "text-slate-400 line-through"
                                : c.type === "Inclusion"
                                ? "text-emerald-600"
                                : "text-rose-600"
                            }`}
                          >
                            {c.type}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4 align-top">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 inline-block">
                        {c.category}
                      </span>
                    </td>

                    {/* Title & Description */}
                    <td className="px-5 py-4 align-top space-y-1 max-w-md">
                      <div className={`font-extrabold text-slate-900 text-xs flex items-center gap-2 ${c.isStruckOut ? "line-through text-slate-400 opacity-60" : ""}`}>
                        {c.title}
                        {c.isStruckOut && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-200 text-slate-600 no-underline">
                            Struck Out
                          </span>
                        )}
                      </div>
                      <p className={`text-slate-600 font-medium text-[11px] leading-relaxed ${c.isStruckOut ? "line-through text-slate-400 opacity-60" : ""}`}>
                        {c.description}
                      </p>
                    </td>

                    {/* Protocol Ref */}
                    <td className="px-5 py-4 align-top">
                      <div className="font-mono text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 inline-block">
                        {c.protocolSection}
                      </div>
                    </td>

                    {/* Strictness */}
                    <td className="px-5 py-4 align-top space-y-1">
                      {c.isMandatory && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200 block w-fit">
                          Strict Mandatory
                        </span>
                      )}
                      {c.waiverAllowed && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800 border border-blue-200 block w-fit">
                          Waiver Permitted
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 align-top text-right space-x-1">
                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Edit Criterion"
                      >
                        <Edit3 className="w-4 h-4 inline" />
                      </button>
                      <button
                        onClick={() => handleToggleStrikeCriterion(c.id)}
                        className={`p-1.5 transition rounded-lg ${
                          c.isStruckOut
                            ? "text-slate-700 bg-slate-200 font-bold"
                            : "text-slate-400 hover:text-amber-600 hover:bg-amber-50"
                        }`}
                        title={c.isStruckOut ? "Un-strike Criterion" : "Strike Out Criterion (Retain Audit Log)"}
                      >
                        <Strikethrough className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Protocol PDF Parser Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                Upload & AI Parse Protocol PDF
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-blue-200 bg-blue-50/50 rounded-2xl p-6 text-center space-y-2">
                <FileText className="w-10 h-10 text-blue-500 mx-auto" />
                <div className="text-xs font-bold text-slate-800">
                  Select Clinical Protocol PDF Document
                </div>
                <p className="text-[11px] text-slate-500">
                  Upload complete PDF (Section 5 Inclusion & Exclusion criteria will be automatically extracted and structured).
                </p>
                <div className="pt-2">
                  <span className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs inline-block cursor-pointer">
                    Browse Local File System
                  </span>
                </div>
              </div>

              {/* Parsing Log Progress */}
              {isParsing && (
                <div className="bg-slate-900 text-emerald-400 rounded-xl p-4 font-mono text-[11px] space-y-1.5 max-h-40 overflow-y-auto border border-slate-800">
                  {parseLog.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSimulateParser}
                disabled={isParsing}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2"
              >
                {isParsing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Parsing PDF...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Start AI Protocol Parsing
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Criterion Modal */}
      {showAddEditModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <form
            onSubmit={handleSaveCriterion}
            className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 border border-slate-200 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-600" />
                {editingCriterion ? `Edit Criterion (${formId})` : "Add Custom Criterion"}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddEditModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-500 font-bold mb-1">Criterion Code / ID</label>
                <input
                  type="text"
                  required
                  value={formId}
                  onChange={(e) => setFormId(e.target.value)}
                  placeholder="e.g. INC-06 or EXC-07"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Criteria Type</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none"
                >
                  <option value="Inclusion">Inclusion Criterion (✓)</option>
                  <option value="Exclusion">Exclusion Criterion (✕)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Category / Domain</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none"
                >
                  <option value="Demographics">Demographics</option>
                  <option value="Diagnostic">Diagnostic</option>
                  <option value="Severity">Severity</option>
                  <option value="Laboratory">Laboratory</option>
                  <option value="Psychiatric">Psychiatric</option>
                  <option value="Concomitant Meds">Concomitant Meds</option>
                  <option value="Safety">Safety</option>
                  <option value="Administrative">Administrative</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Protocol Section Ref</label>
                <input
                  type="text"
                  value={formSection}
                  onChange={(e) => setFormSection(e.target.value)}
                  placeholder="e.g. Section 5.1.4"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 font-bold mb-1">Short Title / Name</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Hepatic Transaminase Upper Threshold"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Full Parsed Clinical Logic / Description</label>
                <textarea
                  rows={3}
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Detailed rule requirements extracted from protocol..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formMandatory}
                    onChange={(e) => setFormMandatory(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-bold text-slate-700">Strict Mandatory (Disqualifying)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formWaiver}
                    onChange={(e) => setFormWaiver(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-bold text-slate-700">Waiver Permitted (with PI Sign-off)</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddEditModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                Save Criterion
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
