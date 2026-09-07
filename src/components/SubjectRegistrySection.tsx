"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Search, Plus, Download, X, Trash2, Eye } from "lucide-react";

export interface RegistrySubject {
  id: string;
  subjectId: string;
  studyId: string;
  studyTitle: string;
  indication: string;
  ageSex: string;
  diagnosis: string;
  status: "ELIGIBLE" | "SCREENED" | "IN REVIEW" | "RANDOMIZED" | "SCREEN FAILED";
  site: string;
  lastVisit: string;
}

const INITIAL_REGISTRY_SUBJECTS: RegistrySubject[] = [
  {
    id: "sub-reg-1",
    subjectId: "100-101MHT",
    studyId: "MHT-2101-C01",
    studyTitle: "MHT-2101-C01 — MYOGUARD-1 Phase III",
    indication: "MHT-2101-C01 • Voss-Kellerman Congenital Myopathy (VKCM)",
    ageSex: "35/F",
    diagnosis: "Voss-Kellerman Congenital Myopathy (VKCM)",
    status: "ELIGIBLE",
    site: "HomeSite",
    lastVisit: "Jul 6, 2026",
  },
  {
    id: "sub-reg-2",
    subjectId: "101-002",
    studyId: "SLT-206-C118",
    studyTitle: "SLT-206-C118 Cerevastatin — Cerevastatin in I",
    indication: "SLT-206-C118 • Bipolar I Disorder (ICD-10 F31.9)",
    ageSex: "42/F",
    diagnosis: "Bipolar I Disorder (ICD-10 F31.9)",
    status: "RANDOMIZED",
    site: "Johns Hopkins Site 101",
    lastVisit: "Jul 12, 2026",
  },
  {
    id: "sub-reg-3",
    subjectId: "101-005",
    studyId: "SLT-206-C118",
    studyTitle: "SLT-206-C118 Cerevastatin — Cerevastatin in I",
    indication: "SLT-206-C118 • Bipolar I Disorder (ICD-10 F31.9)",
    ageSex: "36/M",
    diagnosis: "Bipolar I Disorder (ICD-10 F31.9)",
    status: "IN REVIEW",
    site: "Mount Sinai Site 102",
    lastVisit: "Aug 10, 2026",
  },
  {
    id: "sub-reg-4",
    subjectId: "ZP-201",
    studyId: "ZP-010-BS01",
    studyTitle: "ZP-010-BS01 (ZEPHYR Phase III)",
    indication: "ZP-010-BS01 • Bipolar Depression",
    ageSex: "29/M",
    diagnosis: "Treatment-Resistant Bipolar Depression",
    status: "SCREENED",
    site: "Mayo Clinic Site 103",
    lastVisit: "Aug 15, 2026",
  },
];

export const SubjectRegistrySection: React.FC = () => {
  const { currentUser, selectedStudyId, setSelectedStudyId, studySummaries } = useAuth();
  
  const [subjects, setSubjects] = useState<RegistrySubject[]>(INITIAL_REGISTRY_SUBJECTS);
  
  // Selected protocol filter state
  const [selectedProtocolFilter, setSelectedProtocolFilter] = useState("MHT-2101-C01 — MYOGUARD-1 Phase III");
  
  // Search & filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [siteFilter, setSiteFilter] = useState("All Sites");

  // Modal state
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [modalStudy, setModalStudy] = useState("MHT-2101-C01 — MYOGUARD-1 Phase III");
  const [modalSubjectId, setModalSubjectId] = useState("");
  const [modalAge, setModalAge] = useState("35");
  const [modalSex, setModalSex] = useState("F");
  const [modalDiagnosis, setModalDiagnosis] = useState("Voss-Kellerman Congenital Myopathy (VKCM)");
  const [modalSite, setModalSite] = useState("HomeSite");
  const [modalStatus, setModalStatus] = useState<"ELIGIBLE" | "SCREENED" | "IN REVIEW" | "RANDOMIZED">("ELIGIBLE");

  // Permission check: Registration allowed ONLY for PI and Admin
  const role = currentUser?.role || "PI";
  const canRegisterSubject = role === "PI" || role === "SuperAdmin" || role === "Admin";

  // Filter subjects based on selected protocol, search query, status, site
  const filteredSubjects = subjects.filter((s) => {
    const matchesProtocol =
      !selectedProtocolFilter ||
      s.studyTitle.toLowerCase().includes(selectedProtocolFilter.toLowerCase()) ||
      s.studyId.toLowerCase().includes(selectedProtocolFilter.split(" ")[0].toLowerCase());

    const matchesSearch =
      s.subjectId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.diagnosis.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All Statuses" || s.status === statusFilter;

    const matchesSite =
      siteFilter === "All Sites" || s.site === siteFilter;

    return matchesProtocol && matchesSearch && matchesStatus && matchesSite;
  });

  const activeIndicationText =
    selectedProtocolFilter.includes("MHT-2101-C01")
      ? "MHT-2101-C01 • Voss-Kellerman Congenital Myopathy (VKCM)"
      : selectedProtocolFilter.includes("SLT-206-C118")
      ? "SLT-206-C118 • Bipolar I Disorder (ICD-10 F31.9)"
      : selectedProtocolFilter.includes("ZP-010-BS01")
      ? "ZP-010-BS01 • Bipolar Depression Phase III"
      : "Active Clinical Protocol Specification";

  const handleRegisterSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalSubjectId) return;

    // GCP Uniqueness Check per protocol
    const exists = subjects.some(
      (s) => s.subjectId.toLowerCase() === modalSubjectId.toLowerCase() && s.studyTitle === modalStudy
    );

    if (exists) {
      alert(`GCP Alert: Subject ID ${modalSubjectId} is already registered under this protocol.`);
      return;
    }

    const newSub: RegistrySubject = {
      id: `sub-reg-${Date.now().toString().slice(-3)}`,
      subjectId: modalSubjectId,
      studyId: modalStudy.split(" ")[0],
      studyTitle: modalStudy,
      indication: activeIndicationText,
      ageSex: `${modalAge}/${modalSex}`,
      diagnosis: modalDiagnosis,
      status: modalStatus,
      site: modalSite,
      lastVisit: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };

    setSubjects([newSub, ...subjects]);
    setShowRegisterModal(false);
    setModalSubjectId("");
  };

  const handleDeleteSubject = (id: string) => {
    if (confirm("Are you sure you want to delete this registered subject record?")) {
      setSubjects((prev) => prev.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="space-y-6 font-sans text-slate-800">
      {/* Title Header & Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Subject Registry
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Filter and manage enrolled trial subjects across assigned study protocols
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-extrabold text-xs rounded-xl shadow-2xs transition">
            Export CSV
          </button>

          {/* Registration functionality enabled for PI & Admin ONLY */}
          {canRegisterSubject && (
            <button
              onClick={() => setShowRegisterModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1D64EC] hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-2xs transition"
            >
              <Plus className="w-4 h-4" /> Register New Subject
            </button>
          )}
        </div>
      </div>

      {/* Card Row 1: Select Study Protocol Filter & Protocol Details */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-black text-slate-700 mb-2">
            Select Study Protocol Filter
          </label>
          <select
            value={selectedProtocolFilter}
            onChange={(e) => setSelectedProtocolFilter(e.target.value)}
            className="w-full px-4 py-3 bg-[#EBF3FE]/70 border border-blue-200 rounded-xl text-xs font-extrabold text-slate-900 focus:ring-2 focus:ring-blue-500 cursor-pointer max-w-full"
          >
            <option value="MHT-2101-C01 — MYOGUARD-1 Phase III">
              MHT-2101-C01 — MYOGUARD-1 Phase III
            </option>
            <option value="SLT-206-C118 Cerevastatin — Cerevastatin in I">
              SLT-206-C118 Cerevastatin — Cerevastatin in I
            </option>
            <option value="ZP-010-BS01 (ZEPHYR Phase III)">
              ZP-010-BS01 (ZEPHYR Phase III)
            </option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-black text-slate-700 mb-2">
            Protocol & Indication Details
          </label>
          <div className="w-full px-4 py-3 bg-slate-100/80 border border-slate-200 rounded-xl text-xs font-bold text-slate-700">
            {activeIndicationText}
          </div>
        </div>
      </div>

      {/* Card Row 2: Search, Filters, and Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Subject ID..."
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 w-52 max-w-full"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer max-w-full"
            >
              <option value="All Statuses">All Statuses</option>
              <option value="ELIGIBLE">ELIGIBLE</option>
              <option value="SCREENED">SCREENED</option>
              <option value="IN REVIEW">IN REVIEW</option>
              <option value="RANDOMIZED">RANDOMIZED</option>
            </select>

            <select
              value={siteFilter}
              onChange={(e) => setSiteFilter(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer max-w-full"
            >
              <option value="All Sites">All Sites</option>
              <option value="HomeSite">HomeSite</option>
              <option value="Johns Hopkins Site 101">Johns Hopkins Site 101</option>
              <option value="Mount Sinai Site 102">Mount Sinai Site 102</option>
            </select>
          </div>

          <div className="text-xs font-extrabold text-slate-500">
            Showing <span className="text-slate-900 font-black">{filteredSubjects.length}</span> subjects
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 font-black uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">SUBJECT ID</th>
                <th className="px-5 py-3">STUDY PROTOCOL</th>
                <th className="px-5 py-3">AGE/SEX</th>
                <th className="px-5 py-3">DIAGNOSIS</th>
                <th className="px-5 py-3">STATUS</th>
                <th className="px-5 py-3">SITE</th>
                <th className="px-5 py-3">LAST VISIT</th>
                <th className="px-5 py-3 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSubjects.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-5 py-3.5 font-black text-slate-900">{s.subjectId}</td>
                  <td className="px-5 py-3.5">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                      {s.studyId}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-bold text-slate-700">{s.ageSex}</td>
                  <td className="px-5 py-3.5 font-medium text-slate-800">{s.diagnosis}</td>
                  <td className="px-5 py-3.5">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-black bg-slate-100 text-slate-700 border border-slate-200">
                      {s.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-slate-700">{s.site}</td>
                  <td className="px-5 py-3.5 font-mono text-slate-500">{s.lastVisit}</td>
                  <td className="px-5 py-3.5 text-center space-x-1">
                    <button
                      onClick={() => alert(`Viewing subject record for ${s.subjectId}`)}
                      className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-extrabold text-[10px] rounded-md shadow-2xs"
                    >
                      View
                    </button>
                    {canRegisterSubject && (
                      <button
                        onClick={() => handleDeleteSubject(s.id)}
                        className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[10px] rounded-full shadow-2xs"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: 1st Select Study, then Register Subject */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">
                Register New Trial Subject
              </h3>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterSubject} className="space-y-4 text-xs">
              {/* Step 1: MUST SELECT STUDY PROTOCOL FIRST */}
              <div>
                <label className="block font-black text-slate-800 mb-1">
                  1. Select Study Protocol *
                </label>
                <select
                  value={modalStudy}
                  onChange={(e) => {
                    setModalStudy(e.target.value);
                    if (e.target.value.includes("MHT-2101-C01")) {
                      setModalDiagnosis("Voss-Kellerman Congenital Myopathy (VKCM)");
                    } else if (e.target.value.includes("SLT-206-C118")) {
                      setModalDiagnosis("Bipolar I Disorder (ICD-10 F31.9)");
                    } else {
                      setModalDiagnosis("Bipolar Depression");
                    }
                  }}
                  className="w-full px-3.5 py-2.5 bg-blue-50/70 border border-blue-300 rounded-xl text-xs font-extrabold text-slate-900 focus:ring-2 focus:ring-blue-500 max-w-full"
                >
                  <option value="MHT-2101-C01 — MYOGUARD-1 Phase III">
                    MHT-2101-C01 — MYOGUARD-1 Phase III
                  </option>
                  <option value="SLT-206-C118 Cerevastatin — Cerevastatin in I">
                    SLT-206-C118 Cerevastatin — Cerevastatin in I
                  </option>
                  <option value="ZP-010-BS01 (ZEPHYR Phase III)">
                    ZP-010-BS01 (ZEPHYR Phase III)
                  </option>
                </select>
              </div>

              {/* Step 2: Subject Details */}
              <div>
                <label className="block font-black text-slate-800 mb-1">
                  2. Subject ID *
                </label>
                <input
                  type="text"
                  required
                  value={modalSubjectId}
                  onChange={(e) => setModalSubjectId(e.target.value)}
                  placeholder="e.g. 100-101MHT"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl font-mono text-xs font-bold max-w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={modalAge}
                    onChange={(e) => setModalAge(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs max-w-full"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sex</label>
                  <select
                    value={modalSex}
                    onChange={(e) => setModalSex(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white font-bold max-w-full"
                  >
                    <option value="F">Female (F)</option>
                    <option value="M">Male (M)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Diagnosis</label>
                <input
                  type="text"
                  value={modalDiagnosis}
                  onChange={(e) => setModalDiagnosis(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs max-w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Trial Site</label>
                  <input
                    type="text"
                    value={modalSite}
                    onChange={(e) => setModalSite(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs max-w-full"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Initial Status</label>
                  <select
                    value={modalStatus}
                    onChange={(e) => setModalStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white font-bold max-w-full"
                  >
                    <option value="ELIGIBLE">ELIGIBLE</option>
                    <option value="SCREENED">SCREENED</option>
                    <option value="IN REVIEW">IN REVIEW</option>
                    <option value="RANDOMIZED">RANDOMIZED</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-[#1D64EC] hover:bg-blue-700 rounded-xl shadow-2xs"
                >
                  Register Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
