"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  Folder, 
  FolderOpen, 
  Upload, 
  Download, 
  Trash2, 
  Search, 
  X, 
  FileText, 
  Check, 
  ShieldCheck 
} from "lucide-react";

export interface VaultDocument {
  id: string;
  studyId: string;
  studyCode: string;
  title: string;
  filename: string;
  category: string;
  version: string;
  size: string;
  uploadedDate: string;
  uploadedBy: string;
}

const INITIAL_VAULT_DOCUMENTS: VaultDocument[] = [
  {
    id: "doc-1",
    studyId: "ZP-010-BS01",
    studyCode: "ZP-010-BS01",
    title: "ZP-010-B301_ZEPHYR_Sample_Protocol_v2.1.pdf",
    filename: "ZP-010-B301_ZEPHYR_Sample_Protocol_v2.1.pdf",
    category: "Protocol",
    version: "v2.1",
    size: "2.4MB",
    uploadedDate: "Apr 2, 2026",
    uploadedBy: "Dr. Jha",
  },
  {
    id: "doc-2",
    studyId: "SCZ-005-APOLLO",
    studyCode: "SCZ-005-APOLLO",
    title: "APOLLO_Protocol_SCZ-005-APOLLO.pdf",
    filename: "APOLLO_Protocol_SCZ-005-APOLLO.pdf",
    category: "Protocol",
    version: "v2.2",
    size: "0.1MB",
    uploadedDate: "Jun 30, 2026",
    uploadedBy: "Dr. Jha",
  },
  {
    id: "doc-3",
    studyId: "SLT-206-C118 Cerevastatin",
    studyCode: "SLT-206-C118 Cerevastatin",
    title: "SLT-206-C118_Sample_Protocol_v3.0.pdf",
    filename: "SLT-206-C118_Sample_Protocol_v3.0.pdf",
    category: "Protocol",
    version: "v2.2",
    size: "0.6MB",
    uploadedDate: "Jul 6, 2026",
    uploadedBy: "Dr. Jha",
  },
  {
    id: "doc-4",
    studyId: "XPF-010-BS01",
    studyCode: "XPF-010-BS01",
    title: "XPF-010-B301_Protocol_v3.0_17Sep2025 (1).pdf",
    filename: "XPF-010-B301_Protocol_v3.0_17Sep2025 (1).pdf",
    category: "Protocol",
    version: "v2.2",
    size: "0.7MB",
    uploadedDate: "Jul 1, 2026",
    uploadedBy: "Dr. Jha",
  },
  {
    id: "doc-5",
    studyId: "MHT-2101-C01",
    studyCode: "MHT-2101-C01",
    title: "MHT-2101-C01_MYOGUARD-1_Sample_GeneTherapy_Protocol.pdf",
    filename: "MHT-2101-C01_MYOGUARD-1_Sample_GeneTherapy_Protocol.pdf",
    category: "Protocol",
    version: "v2.2",
    size: "0.9MB",
    uploadedDate: "Jul 7, 2026",
    uploadedBy: "Dr. Jha",
  },
  {
    id: "doc-6",
    studyId: "GAD-002-NEXUS",
    studyCode: "GAD-002-NEXUS",
    title: "GAD-002-NEXUS_Protocol_v2.0.pdf",
    filename: "GAD-002-NEXUS_Protocol_v2.0.pdf",
    category: "Protocol",
    version: "v2.0",
    size: "1.2MB",
    uploadedDate: "May 15, 2026",
    uploadedBy: "Dr. Jha",
  },
];

export const DocumentVaultSection: React.FC = () => {
  const { selectedStudyId, setSelectedStudyId, studySummaries, currentUser } = useAuth();
  
  const [documents, setDocuments] = useState<VaultDocument[]>(INITIAL_VAULT_DOCUMENTS);
  const [selectedStudyFilter, setSelectedStudyFilter] = useState("All Assigned Studies");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State matching Screenshots 2 & 3
  const [showModal, setShowModal] = useState(false);
  const [docTitle, setDocTitle] = useState("");
  const [docCategory, setDocCategory] = useState("Protocol");
  const [docVersion, setDocVersion] = useState("v1.0");
  const [docFile, setDocFile] = useState<File | null>(null);

  const categoryFolders = [
    { name: "All Categories", icon: FolderOpen },
    { name: "Protocol", icon: Folder },
    { name: "IRB", icon: Folder },
    { name: "Regulatory", icon: Folder },
    { name: "Safety", icon: Folder },
    { name: "Training", icon: Folder },
    { name: "Lab", icon: Folder },
    { name: "Consent", icon: Folder },
    { name: "Medical Management Plan", icon: Folder },
    { name: "Medical Data Review Plan", icon: Folder },
    { name: "Investigator CV", icon: Folder },
    { name: "CRO Staff CV", icon: Folder },
    { name: "Sponsor Staff CV", icon: Folder },
    { name: "EDC / eCRF Documents", icon: Folder },
    { name: "Other", icon: Folder },
  ];

  // Filter documents dynamically per selected study & category
  const filteredDocuments = documents.filter((doc) => {
    const matchesStudy =
      selectedStudyFilter === "All Assigned Studies" ||
      doc.studyId.toLowerCase().includes(selectedStudyFilter.split(" ")[0].toLowerCase()) ||
      selectedStudyFilter.toLowerCase().includes(doc.studyCode.toLowerCase());

    const matchesCategory =
      selectedCategory === "All Categories" || doc.category === selectedCategory;

    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.filename.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStudy && matchesCategory && matchesSearch;
  });

  const getCategoryCount = (categoryName: string) => {
    if (categoryName === "All Categories") return filteredDocuments.length;
    return documents.filter((d) => {
      const matchesStudy =
        selectedStudyFilter === "All Assigned Studies" ||
        d.studyId.toLowerCase().includes(selectedStudyFilter.split(" ")[0].toLowerCase());
      return matchesStudy && d.category === categoryName;
    }).length;
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle) return;

    const newDoc: VaultDocument = {
      id: `doc-${Date.now().toString().slice(-3)}`,
      studyId: selectedStudyId,
      studyCode: selectedStudyId.split(" ")[0],
      title: docTitle,
      filename: docFile ? docFile.name : `${docTitle.replace(/\s+/g, "_")}.pdf`,
      category: docCategory,
      version: docVersion || "v1.0",
      size: docFile ? `${(docFile.size / (1024 * 1024)).toFixed(1)}MB` : "0.5MB",
      uploadedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      uploadedBy: `${currentUser?.first} ${currentUser?.last}`,
    };

    setDocuments([newDoc, ...documents]);
    setShowModal(false);
    setDocTitle("");
    setDocFile(null);
  };

  const handleDeleteDocument = (id: string) => {
    if (confirm("Are you sure you want to delete this document from the vault?")) {
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    }
  };

  return (
    <div className="space-y-6 font-sans text-slate-800">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Document Vault
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Secure regulatory binder and protocol repository
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1D64EC] hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-2xs transition"
        >
          <Upload className="w-4 h-4" /> Upload Document
        </button>
      </div>

      {/* Study Protocol Dropdown & Search Bar Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <label className="text-xs font-black text-slate-700 whitespace-nowrap">
            Study Protocol:
          </label>
          <select
            value={selectedStudyFilter}
            onChange={(e) => setSelectedStudyFilter(e.target.value)}
            className="px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-extrabold text-slate-900 focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs max-w-xs"
          >
            <option value="All Assigned Studies">📋 All Assigned Studies</option>
            <option value="SLT-206-C118 Cerevastatin">SLT-206-C118 Cerevastatin</option>
            <option value="MHT-2101-C01">MHT-2101-C01 MYOGUARD-1</option>
            <option value="ZP-010-BS01">ZP-010-BS01 ZEPHYR</option>
            {studySummaries.map((s) => (
              <option key={s.id} value={s.subtitle}>
                {s.subtitle}
              </option>
            ))}
          </select>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files inside this study by name..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:bg-white transition max-w-full"
          />
        </div>
      </div>

      {/* 13 Category Folder Cards Grid (Screenshot 1) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {categoryFolders.map((cat) => {
          const isSelected = selectedCategory === cat.name;
          const count = getCategoryCount(cat.name);
          const FolderIcon = cat.icon;

          return (
            <div
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start gap-3 ${
                isSelected
                  ? "border-blue-500 bg-blue-50/60 shadow-2xs font-extrabold"
                  : "border-slate-200/80 bg-white hover:border-slate-300"
              }`}
            >
              <FolderIcon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isSelected ? "text-blue-600" : "text-slate-400"}`} />
              <div className="space-y-0.5 truncate">
                <div className={`text-xs truncate ${isSelected ? "text-blue-900 font-extrabold" : "text-slate-800 font-bold"}`}>
                  {cat.name}
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  {count} files
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Documents List Table Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-xs font-black text-emerald-700 uppercase tracking-wider">
            <FolderOpen className="w-4 h-4 text-emerald-600" />
            <span>{selectedCategory.toUpperCase()}</span>
          </div>
          <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
            {filteredDocuments.length} files
          </span>
        </div>

        {filteredDocuments.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {filteredDocuments.map((doc) => (
              <div key={doc.id} className="py-3.5 flex flex-wrap items-center justify-between gap-4 hover:bg-slate-50/60 transition px-2 rounded-xl">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-extrabold text-xs text-slate-900">
                      {doc.title}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {doc.studyCode} · {doc.version} · {doc.size} · Uploaded {doc.uploadedDate} by {doc.uploadedBy}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert(`Downloading ${doc.filename}...`)}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-extrabold text-xs rounded-xl shadow-2xs transition"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-600" /> Download
                  </button>
                  <button
                    onClick={() => handleDeleteDocument(doc.id)}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-2xs transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-slate-400 font-medium space-y-2">
            <Folder className="w-8 h-8 text-slate-300 mx-auto" />
            <div>No documents found in {selectedCategory} for {selectedStudyFilter}.</div>
          </div>
        )}
      </div>

      {/* Upload Document Modal matching Screenshots 2 & 3 */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900">
                Upload Document to Vault
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4 text-xs">
              {/* Alert Pin Box matching Screenshots 2 & 3 */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between text-xs text-blue-900 font-semibold shadow-2xs">
                <span>📌 Files will be uploaded specifically to the active study context:</span>
                <strong className="text-blue-700 font-black ml-1">{selectedStudyId}</strong>
              </div>

              <div>
                <label className="block font-extrabold text-slate-800 mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="e.g. IRB Approval Letter"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-medium max-w-full"
                />
              </div>

              <div>
                <label className="block font-extrabold text-slate-800 mb-1">
                  Folder / Category *
                </label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white font-extrabold text-slate-900 focus:ring-2 focus:ring-blue-500 cursor-pointer max-w-full"
                >
                  <option value="Protocol">Protocol</option>
                  <option value="IRB">IRB</option>
                  <option value="Regulatory">Regulatory</option>
                  <option value="Safety">Safety</option>
                  <option value="Training">Training</option>
                  <option value="Lab">Lab</option>
                  <option value="Consent">Consent</option>
                  <option value="Medical Management Plan">Medical Management Plan</option>
                  <option value="Medical Data Review Plan">Medical Data Review Plan</option>
                  <option value="Investigator CV">Investigator CV</option>
                  <option value="CRO Staff CV">CRO Staff CV</option>
                  <option value="Sponsor Staff CV">Sponsor Staff CV</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-extrabold text-slate-800 mb-1">
                  Document Version
                </label>
                <input
                  type="text"
                  value={docVersion}
                  onChange={(e) => setDocVersion(e.target.value)}
                  placeholder="v1.0"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-mono max-w-full"
                />
              </div>

              <div>
                <label className="block font-extrabold text-slate-800 mb-1">
                  Select File *
                </label>
                <label className="w-full h-24 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition bg-slate-50 hover:bg-blue-50/50">
                  <Upload className="w-5 h-5 text-slate-400 mb-1" />
                  <span className="text-xs font-bold text-slate-600">
                    {docFile ? docFile.name : "Click to select file"}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setDocFile(e.target.files[0]);
                        if (!docTitle) setDocTitle(e.target.files[0].name);
                      }
                    }}
                  />
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-[#1D64EC] hover:bg-blue-700 rounded-xl shadow-2xs"
                >
                  Upload Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
