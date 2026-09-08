"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Study } from "@/types";
import { Plus, Edit2, Trash2, X, FlaskConical } from "lucide-react";

export interface ExtendedStudy extends Study {
  cro?: string;
  croMonitorEmail?: string;
  description?: string;
}

const INITIAL_MANAGEMENT_STUDIES: ExtendedStudy[] = [
  {
    id: "GAD-002-NEXUS",
    title: "NEXUS Phase II Protocol",
    ind: "Generalized Anxiety",
    phase: "Phase II",
    sponsor: "Nexus Biopharma",
    sponsorEmail: "sponsor@nexus-bio.com",
    ip: "NEX-102",
    target: 150,
    enrolled: 45,
    status: "Active",
  },
  {
    id: "MHT-2101-C01",
    title: "MYOGUARD-1 Phase III",
    ind: "Voss-Kellerman Congenital Myopathy (VKCM)",
    phase: "Phase III",
    sponsor: "Meridian Helix Therapeutics, Inc.",
    sponsorEmail: "mdinfrisco@meridianhelix.com",
    ip: "voskatagene lorparvovec (MHT-2101)",
    target: 24,
    enrolled: 0,
    status: "Active",
  },
  {
    id: "SCZ-005-APOLLO",
    title: "APOLLO Phase II Protocol",
    ind: "Schizophrenia",
    phase: "Phase II",
    sponsor: "Apollo Biopharma Ltd.",
    sponsorEmail: "clinical@apollo-bio.com",
    ip: "APO-8821",
    target: 200,
    enrolled: 12,
    status: "Active",
  },
  {
    id: "SLT-206-C118",
    title: "SLT-206-C118 Cerevastatin",
    ind: "Bipolar I Disorder (ICD-10 F31.9)",
    phase: "Phase III",
    sponsor: "Solastis Therapeutics Inc",
    sponsorEmail: "clinical@solastis.com",
    ip: "Cerevastatin (SLC-4421)",
    target: 50,
    enrolled: 0,
    status: "Active",
  },
  {
    id: "TEST-001-DEMO",
    title: "TEST DEMO STUDY",
    ind: "Bipolar Depression",
    phase: "Phase III",
    sponsor: "Zephyr",
    sponsorEmail: "demo@zephyr.com",
    ip: "—",
    target: 100,
    enrolled: 0,
    status: "Active",
  },
  {
    id: "XPF-010-BS01",
    title: "X-CEED Phase III Protocol",
    ind: "Bipolar Depression",
    phase: "Phase III",
    sponsor: "X-Ceed Therapeutics",
    sponsorEmail: "info@xceed-tx.com",
    ip: "XPF-010",
    target: 500,
    enrolled: 6,
    status: "Active",
  },
];

export const StudyManagementSection: React.FC = () => {
  const { currentUser } = useAuth();
  
  const [studiesList, setStudiesList] = useState<ExtendedStudy[]>(INITIAL_MANAGEMENT_STUDIES);

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("eligos_management_studies");
      if (saved) {
        setStudiesList(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load studies from localStorage", e);
    }
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem("eligos_management_studies", JSON.stringify(studiesList));
    } catch (e) {
      console.error("Failed to save studies to localStorage", e);
    }
  }, [studiesList]);
  
  // Modal state (Screenshots 2 & 3)
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formProtocolNum, setFormProtocolNum] = useState("");
  const [formSponsor, setFormSponsor] = useState("");
  const [formCro, setFormCro] = useState("");
  const [formSponsorEmail, setFormSponsorEmail] = useState("");
  const [formCroEmail, setFormCroEmail] = useState("");
  const [formPhase, setFormPhase] = useState("Phase III");
  const [formIndication, setFormIndication] = useState("Bipolar I Disorder (F31.9)");
  const [formTarget, setFormTarget] = useState<number | "">("");
  const [formIpName, setFormIpName] = useState("");
  const [formStatus, setFormStatus] = useState<"Planning" | "Active" | "Completed" | "Suspended">("Planning");
  const [formDescription, setFormDescription] = useState("");

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormTitle("");
    setFormProtocolNum("");
    setFormSponsor("");
    setFormCro("");
    setFormSponsorEmail("");
    setFormCroEmail("");
    setFormPhase("Phase III");
    setFormIndication("Bipolar I Disorder (F31.9)");
    setFormTarget("");
    setFormIpName("");
    setFormStatus("Planning");
    setFormDescription("");
    setShowModal(true);
  };

  const handleOpenEditModal = (s: ExtendedStudy) => {
    setEditingId(s.id);
    setFormTitle(s.title);
    setFormProtocolNum(s.id);
    setFormSponsor(s.sponsor);
    setFormCro(s.cro || "");
    setFormSponsorEmail(s.sponsorEmail || "");
    setFormCroEmail(s.croMonitorEmail || "");
    setFormPhase(s.phase || "Phase III");
    setFormIndication(s.ind || "Bipolar I Disorder (F31.9)");
    setFormTarget(s.target);
    setFormIpName(s.ip || "");
    setFormStatus(s.status as any);
    setFormDescription(s.description || "");
    setShowModal(true);
  };

  const handleDeleteStudy = (id: string) => {
    if (confirm("Are you sure you want to delete this study protocol?")) {
      setStudiesList((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleSaveStudy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formProtocolNum || !formSponsor || !formSponsorEmail || !formTarget) {
      alert("Please fill out all required fields marked with *");
      return;
    }

    if (editingId) {
      setStudiesList((prev) =>
        prev.map((s) =>
          s.id === editingId
            ? {
                ...s,
                id: formProtocolNum,
                title: formTitle,
                sponsor: formSponsor,
                cro: formCro,
                sponsorEmail: formSponsorEmail,
                croMonitorEmail: formCroEmail,
                phase: formPhase,
                ind: formIndication,
                target: Number(formTarget),
                ip: formIpName || "—",
                status: formStatus === "Planning" ? "Pending" : (formStatus as any),
                description: formDescription,
              }
            : s
        )
      );
    } else {
      const newStudy: ExtendedStudy = {
        id: formProtocolNum,
        title: formTitle,
        sponsor: formSponsor,
        cro: formCro,
        sponsorEmail: formSponsorEmail,
        croMonitorEmail: formCroEmail,
        phase: formPhase,
        ind: formIndication,
        target: Number(formTarget),
        enrolled: 0,
        ip: formIpName || "—",
        status: formStatus === "Planning" ? "Pending" : (formStatus as any),
        description: formDescription,
      };
      setStudiesList([...studiesList, newStudy]);
    }

    setShowModal(false);
  };

  return (
    <div className="space-y-6 font-sans text-slate-800">
      {/* Title Header & Create Button */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Study Management
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Register and manage clinical protocols
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#B47418] hover:bg-[#9B6212] text-white font-extrabold text-xs rounded-xl shadow-2xs transition"
        >
          <Plus className="w-4 h-4" /> Create New Study
        </button>
      </div>

      {/* 2-Column Grid of Study Cards (Screenshots 1 & 3) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {studiesList.map((study) => {
          const completionPercentage = study.target > 0 ? Math.round((study.enrolled / study.target) * 100) : 0;

          return (
            <div
              key={study.id}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4 relative hover:shadow-md transition group"
            >
              {/* Top Row: Icon + Title + Action Buttons */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">
                    🔬
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-sm text-slate-900">{study.title}</h3>
                      {study.status === "Active" && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 font-medium mt-0.5">
                      {study.id} · {study.phase} · {study.ind}
                    </div>
                  </div>
                </div>

                {/* Edit & Delete Action Buttons (Screenshot 3) */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(study)}
                    className="px-3 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-extrabold text-xs rounded-xl shadow-2xs transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteStudy(study.id)}
                    className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-2xs transition"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Metadata Row: Sponsor & IP */}
              <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                <div>
                  <div className="text-slate-400 font-bold text-[11px]">Sponsor</div>
                  <div className="font-extrabold text-slate-800 mt-0.5">{study.sponsor}</div>
                </div>

                <div>
                  <div className="text-slate-400 font-bold text-[11px]">IP</div>
                  <div className="font-bold text-slate-800 mt-0.5">{study.ip || "—"}</div>
                </div>
              </div>

              {/* Enrollment Progress */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-bold text-[11px]">Enrolled</span>
                  <span className="text-slate-400 font-bold text-[11px]">{completionPercentage}% enrollment complete</span>
                </div>
                <div className="text-sm font-black text-slate-900">
                  {study.enrolled} / {study.target}
                </div>

                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(completionPercentage, study.enrolled > 0 ? 1 : 0)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create / Edit New Study Modal (Screenshot 2) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-black text-lg text-slate-900">
                {editingId ? "Edit Study Protocol" : "Create New Study"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveStudy} className="p-6 space-y-4 text-xs">
              {/* Row 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-extrabold text-slate-700 mb-1">Study Title *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. MYOGUARD-1 Phase III"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-medium max-w-full"
                  />
                </div>

                <div>
                  <label className="block font-extrabold text-slate-700 mb-1">Protocol Number *</label>
                  <input
                    type="text"
                    required
                    value={formProtocolNum}
                    onChange={(e) => setFormProtocolNum(e.target.value)}
                    placeholder="e.g. MHT-2101-C01"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-mono max-w-full"
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-extrabold text-slate-700 mb-1">Sponsor *</label>
                  <input
                    type="text"
                    required
                    value={formSponsor}
                    onChange={(e) => setFormSponsor(e.target.value)}
                    placeholder="e.g. Meridian Helix Therapeutics"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-medium max-w-full"
                  />
                </div>

                <div>
                  <label className="block font-extrabold text-slate-700 mb-1">CRO</label>
                  <input
                    type="text"
                    value={formCro}
                    onChange={(e) => setFormCro(e.target.value)}
                    placeholder="e.g. IQVIA"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-medium max-w-full"
                  />
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-extrabold text-slate-700 mb-1">Sponsor Reviewer Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formSponsorEmail}
                    onChange={(e) => setFormSponsorEmail(e.target.value)}
                    placeholder="e.g. sponsor@domain.com"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-medium max-w-full"
                  />
                </div>

                <div>
                  <label className="block font-extrabold text-slate-700 mb-1">CRO Monitor Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formCroEmail}
                    onChange={(e) => setFormCroEmail(e.target.value)}
                    placeholder="e.g. monitor@domain.com"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-medium max-w-full"
                  />
                </div>
              </div>

              {/* Row 4 (3 columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-extrabold text-slate-700 mb-1">Phase</label>
                  <select
                    value={formPhase}
                    onChange={(e) => setFormPhase(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white font-extrabold max-w-full"
                  >
                    <option value="Phase I">Phase I</option>
                    <option value="Phase II">Phase II</option>
                    <option value="Phase III">Phase III</option>
                    <option value="Phase IV">Phase IV</option>
                  </select>
                </div>

                <div>
                  <label className="block font-extrabold text-slate-700 mb-1">Indication</label>
                  <select
                    value={formIndication}
                    onChange={(e) => setFormIndication(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white font-extrabold max-w-full"
                  >
                    <option value="Bipolar I Disorder (F31.9)">Bipolar I Disorder (F31.9)</option>
                    <option value="Voss-Kellerman Congenital Myopathy (VKCM)">VKCM Myopathy</option>
                    <option value="Generalized Anxiety">Generalized Anxiety</option>
                    <option value="Schizophrenia">Schizophrenia</option>
                  </select>
                </div>

                <div>
                  <label className="block font-extrabold text-slate-700 mb-1">Target Enrollment *</label>
                  <input
                    type="number"
                    required
                    value={formTarget}
                    onChange={(e) => setFormTarget(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="e.g. 50"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-bold max-w-full"
                  />
                </div>
              </div>

              {/* Row 5 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-extrabold text-slate-700 mb-1">IP Name</label>
                  <input
                    type="text"
                    value={formIpName}
                    onChange={(e) => setFormIpName(e.target.value)}
                    placeholder="e.g. Cerevastatin (SLC-4421)"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-medium max-w-full"
                  />
                </div>

                <div>
                  <label className="block font-extrabold text-slate-700 mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white font-extrabold max-w-full"
                  >
                    <option value="Planning">Planning</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              {/* Row 6 */}
              <div>
                <label className="block font-extrabold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Enter protocol background, objectives summary..."
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-medium max-w-full"
                />
              </div>

              {/* Footer Actions */}
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
                  className="px-5 py-2 font-extrabold text-white bg-[#B47418] hover:bg-[#9B6212] rounded-xl shadow-2xs"
                >
                  {editingId ? "Save Changes" : "Create Study"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
