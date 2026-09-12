"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";
import { Plus, Edit2, Trash2, Download, Phone, Mail, X } from "lucide-react";

export interface ContactRecord {
  id: string;
  studyId: string;
  section: "PI" | "CRO" | "Sponsor";
  name: string;
  title: string;
  phone: string;
  email: string;
  dateOn: string;
  dateOff: string; // 'Active' or date string e.g. '15-Dec-24'
  cvApproved: "Approved" | "No Approval Required" | "Pending";
}

const INITIAL_CONTACTS: ContactRecord[] = [
  // PI Contacts
  {
    id: "c-101",
    studyId: "ZP-010-BS01",
    section: "PI",
    name: "Dr. Arthur Pendleton",
    title: "Principal Investigator",
    phone: "(919) 555-0114",
    email: "dr._arthur.pendleton@researchinstitution.org",
    dateOn: "12-Jan-23",
    dateOff: "Active",
    cvApproved: "Approved",
  },
  {
    id: "c-102",
    studyId: "ZP-010-BS01",
    section: "PI",
    name: "Melissa Jenkins, RN",
    title: "Lead Study Coordinator",
    phone: "(919) 555-0234",
    email: "m.jenkins@researchinstitution.org",
    dateOn: "15-Jan-23",
    dateOff: "Active",
    cvApproved: "Approved",
  },
  {
    id: "c-103",
    studyId: "ZP-010-BS01",
    section: "PI",
    name: "Jonathan Miller",
    title: "Sub-Investigator",
    phone: "(919) 555-0356",
    email: "j.miller@researchinstitution.org",
    dateOn: "01-Feb-23",
    dateOff: "15-Dec-24",
    cvApproved: "No Approval Required",
  },

  // CRO Contacts
  {
    id: "c-201",
    studyId: "ZP-010-BS01",
    section: "CRO",
    name: "Lydia Vance",
    title: "CRA (Clinical Research Associate)",
    phone: "(904) 459-7954",
    email: "lydia.vance@crohealthsolutions.com",
    dateOn: "07-Jan-22",
    dateOff: "Active",
    cvApproved: "Approved",
  },
  {
    id: "c-202",
    studyId: "ZP-010-BS01",
    section: "CRO",
    name: "Oliver Queen",
    title: "CRA (Clinical Research Associate)",
    phone: "(904) 459-7941",
    email: "oliver.queen@crohealthsolutions.com",
    dateOn: "19-Feb-22",
    dateOff: "Active",
    cvApproved: "Approved",
  },
  {
    id: "c-203",
    studyId: "ZP-010-BS01",
    section: "CRO",
    name: "Bruce Wayne",
    title: "SSU & Regulatory Specialist",
    phone: "(919) 745-7934",
    email: "bruce.wayne@crohealthsolutions.com",
    dateOn: "27-Aug-22",
    dateOff: "Active",
    cvApproved: "Approved",
  },
  {
    id: "c-204",
    studyId: "ZP-010-BS01",
    section: "CRO",
    name: "Theresa Scott",
    title: "Clinical Operations Lead",
    phone: "(757) 484-7954",
    email: "theresa.scott@crohealthsolutions.com",
    dateOn: "15-Oct-22",
    dateOff: "05-Nov-24",
    cvApproved: "Approved",
  },

  // Sponsor Contacts
  {
    id: "c-301",
    studyId: "ZP-010-BS01",
    section: "Sponsor",
    name: "Dr. Allison Carter",
    title: "Medical Director",
    phone: "(904) 459-7948",
    email: "dr._allison.carter@altapharma.com",
    dateOn: "10-Jun-22",
    dateOff: "Active",
    cvApproved: "Approved",
  },
  {
    id: "c-302",
    studyId: "ZP-010-BS01",
    section: "Sponsor",
    name: "Clarissa Montgomery",
    title: "Sponsor Contracts Manager",
    phone: "(902) 509-7934",
    email: "c.montgomery@altapharma.com",
    dateOn: "01-Aug-22",
    dateOff: "Active",
    cvApproved: "No Approval Required",
  },
  {
    id: "c-303",
    studyId: "ZP-010-BS01",
    section: "Sponsor",
    name: "Edward Cullen",
    title: "Clinical Scientist",
    phone: "(775) 324-7934",
    email: "e.cullen@altapharma.com",
    dateOn: "24-Jun-22",
    dateOff: "Active",
    cvApproved: "Approved",
  },
];

export const StudyContactsDirectorySection: React.FC = () => {
  const { currentUser, selectedStudyId, setSelectedStudyId, studySummaries } = useAuth();
  
  // Persistent Contacts State
  const [contacts, setContacts] = useState<ContactRecord[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("eligos_contacts");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to load saved contacts", e);
        }
      }
    }
    return INITIAL_CONTACTS;
  });

  // Save contacts to localStorage on change
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("eligos_contacts", JSON.stringify(contacts));
    }
  }, [contacts]);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalSection, setModalSection] = useState<"PI" | "CRO" | "Sponsor">("PI");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formName, setFormName] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formDateOn, setFormDateOn] = useState("01-Jan-26");
  const [formDateOff, setFormDateOff] = useState("Active");
  const [formCvApproved, setFormCvApproved] = useState<"Approved" | "No Approval Required" | "Pending">("Approved");

  const userRole = currentUser?.role || "PI";
  const isAdmin = userRole === "SuperAdmin" || userRole === "Admin";

  // Permissions logic
  const canEditSection = (section: "PI" | "CRO" | "Sponsor") => {
    if (isAdmin) return true;
    if (userRole === "PI" && section === "PI") return true;
    if (userRole === "CRO" && section === "CRO") return true;
    if (userRole === "Sponsor" && section === "Sponsor") return true;
    return false;
  };

  const handleOpenAddModal = (section: "PI" | "CRO" | "Sponsor") => {
    setModalSection(section);
    setEditingId(null);
    setFormName("");
    setFormTitle("");
    setFormPhone("");
    setFormEmail("");
    setFormDateOn("01-Jan-26");
    setFormDateOff("Active");
    setFormCvApproved("Approved");
    setShowModal(true);
  };

  const handleOpenEditModal = (contact: ContactRecord) => {
    setModalSection(contact.section);
    setEditingId(contact.id);
    setFormName(contact.name);
    setFormTitle(contact.title);
    setFormPhone(contact.phone);
    setFormEmail(contact.email);
    setFormDateOn(contact.dateOn);
    setFormDateOff(contact.dateOff);
    setFormCvApproved(contact.cvApproved);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail) return;

    if (editingId) {
      setContacts((prev) =>
        prev.map((c) =>
          c.id === editingId
            ? {
                ...c,
                name: formName,
                title: formTitle,
                phone: formPhone,
                email: formEmail,
                dateOn: formDateOn,
                dateOff: formDateOff,
                cvApproved: formCvApproved,
              }
            : c
        )
      );
    } else {
      const newContact: ContactRecord = {
        id: `c-${Date.now().toString().slice(-3)}`,
        studyId: selectedStudyId,
        section: modalSection,
        name: formName,
        title: formTitle,
        phone: formPhone,
        email: formEmail,
        dateOn: formDateOn,
        dateOff: formDateOff,
        cvApproved: formCvApproved,
      };
      setContacts([...contacts, newContact]);
    }

    setShowModal(false);
  };

  const renderContactTable = (
    title: string,
    section: "PI" | "CRO" | "Sponsor"
  ) => {
    const isAllowed = canEditSection(section);
    // Filter contacts for current study or show default protocol set
    const sectionContacts = contacts.filter((c) => c.section === section);

    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-slate-900">{title}</h2>

          {isAllowed && (
            <button
              onClick={() => handleOpenAddModal(section)}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#1D64EC] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-2xs transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add Contact
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Telephone</th>
                <th className="px-6 py-3">Email Address</th>
                <th className="px-6 py-3">Date On Project</th>
                <th className="px-6 py-3">Date Off Project</th>
                <th className="px-6 py-3">CV Approval</th>
                {isAllowed && <th className="px-6 py-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sectionContacts.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-6 py-3 font-extrabold text-slate-900">{c.name}</td>
                  <td className="px-6 py-3 text-slate-600 font-medium">{c.title}</td>
                  <td className="px-6 py-3 text-slate-800 font-mono">
                    <a
                      href={`tel:${c.phone}`}
                      className="inline-flex items-center gap-1 hover:text-emerald-700 transition"
                      title={`Call ${c.phone}`}
                    >
                      <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{c.phone}</span>
                    </a>
                  </td>
                  <td className="px-6 py-3 font-mono">
                    <a
                      href={`mailto:${c.email}`}
                      className="inline-flex items-center gap-1.5 text-blue-700 hover:text-blue-900 font-medium underline transition"
                      title={`Send email to ${c.email}`}
                    >
                      <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{c.email}</span>
                    </a>
                  </td>
                  <td className="px-6 py-3 text-slate-600 font-medium">{c.dateOn}</td>
                  <td className="px-6 py-3 font-medium">
                    {c.dateOff === "Active" ? (
                      <span className="text-slate-600 font-semibold">Active</span>
                    ) : (
                      <span className="text-rose-600 font-bold">{c.dateOff}</span>
                    )}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        c.cvApproved === "Approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {c.cvApproved}
                    </span>
                  </td>
                  {isAllowed && (
                    <td className="px-6 py-3 text-right space-x-1.5">
                      <button
                        onClick={() => alert(`Downloading CV for ${c.name}...`)}
                        className="inline-flex items-center gap-0.5 px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 font-extrabold text-[10px] rounded border border-blue-200"
                        title="Download CV"
                      >
                        <Download className="w-3 h-3" /> CV
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(c)}
                        className="inline-flex items-center gap-0.5 px-2 py-1 bg-amber-50 text-amber-800 hover:bg-amber-100 font-extrabold text-[10px] rounded border border-amber-200"
                        title="Edit Contact"
                      >
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="inline-flex items-center gap-0.5 px-2 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 font-extrabold text-[10px] rounded border border-rose-200"
                        title="Delete Contact"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 font-sans text-slate-800">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900">
          Study Contacts Directory
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Key investigator site, CRO, and Sponsor personnel assigned to study protocols
        </p>
      </div>

      {/* SELECT STUDY PROTOCOL Dropdown Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-2">
        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider">
          SELECT STUDY PROTOCOL
        </label>
        <select
          value={selectedStudyId}
          onChange={(e) => setSelectedStudyId(e.target.value)}
          className="w-full max-w-md px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-extrabold text-slate-800 focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs"
        >
          {studySummaries
            .filter((s) =>
              currentUser?.role === "SuperAdmin" || currentUser?.role === "Admin"
                ? true
                : (currentUser?.assignedStudies || []).some(
                    (code) => s.id.includes(code) || s.subtitle.includes(code) || code.includes(s.id)
                  )
            )
            .map((s) => (
              <option key={s.id} value={s.subtitle}>
                {s.subtitle}
              </option>
            ))}
        </select>
      </div>

      {/* Three Contact Tables */}
      {renderContactTable("Principal Investigator (PI) Site Contacts", "PI")}
      {renderContactTable("CRO (Clinical Research Associate & Operations) Contacts", "CRO")}
      {renderContactTable("Sponsor Contacts", "Sponsor")}

      {/* Add / Edit Contact Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">
                {editingId ? "Edit" : "Add New"} {modalSection} Contact
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveContact} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Dr. Arthur Pendleton"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs max-w-full"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Title / Role</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Principal Investigator"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs max-w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Telephone</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="(919) 555-0114"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs max-w-full"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="email@site.org"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs max-w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date On Project</label>
                  <input
                    type="text"
                    value={formDateOn}
                    onChange={(e) => setFormDateOn(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs max-w-full"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date Off Project</label>
                  <input
                    type="text"
                    value={formDateOff}
                    onChange={(e) => setFormDateOff(e.target.value)}
                    placeholder="Active"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs max-w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">CV Approval Status</label>
                <select
                  value={formCvApproved}
                  onChange={(e) => setFormCvApproved(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white font-bold max-w-full"
                >
                  <option value="Approved">Approved</option>
                  <option value="No Approval Required">No Approval Required</option>
                  <option value="Pending">Pending</option>
                </select>
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
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
