"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Deviation } from "@/types";
import { AlertTriangle, Plus, CheckCircle, ShieldAlert } from "lucide-react";

const INITIAL_DEVIATIONS: Deviation[] = [
  {
    id: "DEV-101",
    studyId: "MHT-2101-C01",
    subjectId: "101-002",
    date: "2026-06-25",
    category: "Inclusion/Exclusion Violation",
    description: "Subject enrolled with platelet count 95,000/μL (protocol minimum requirement: 100,000/μL).",
    severity: "Major",
    status: "Approved",
  },
  {
    id: "DEV-102",
    studyId: "MHT-2101-C01",
    subjectId: "101-005",
    date: "2026-08-10",
    category: "Out-of-Window Visit",
    description: "Day 14 safety blood draw performed on Day 18 due to subject travel delay.",
    severity: "Minor",
    status: "Pending",
  },
];

export const DeviationsSection: React.FC = () => {
  const { currentUser } = useAuth();
  const [deviations, setDeviations] = useState<Deviation[]>(INITIAL_DEVIATIONS);
  const [showModal, setShowModal] = useState(false);

  const [subjectId, setSubjectId] = useState("");
  const [category, setCategory] = useState("Inclusion/Exclusion Violation");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<"Minor" | "Major" | "Critical">("Major");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectId || !description) return;

    const newDev: Deviation = {
      id: `DEV-${Date.now().toString().slice(-3)}`,
      studyId: "MHT-2101-C01",
      subjectId,
      date: new Date().toISOString().slice(0, 10),
      category,
      description,
      severity,
      status: "Pending",
    };

    setDeviations([newDev, ...deviations]);
    setShowModal(false);
    setSubjectId("");
    setDescription("");
  };

  const handleApprove = (id?: string) => {
    setDeviations((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "Approved" } : d))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            Protocol Deviation Tracker
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Log and review clinical protocol deviations, inclusion/exclusion waivers, and GCP safety exceptions.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm transition"
        >
          <Plus className="w-4 h-4" /> Log New Deviation
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-semibold uppercase border-b border-gray-200">
              <tr>
                <th className="px-5 py-3">Dev ID</th>
                <th className="px-5 py-3">Study / Subject</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Description</th>
                <th className="px-5 py-3">Severity</th>
                <th className="px-5 py-3 text-right">Status / Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {deviations.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-bold font-mono text-gray-900">{d.id}</td>
                  <td className="px-5 py-3">
                    <div className="font-bold text-gray-900">{d.subjectId}</div>
                    <div className="text-[10px] text-gray-400">{d.studyId}</div>
                  </td>
                  <td className="px-5 py-3 font-mono text-gray-600">{d.date}</td>
                  <td className="px-5 py-3 font-semibold text-gray-800">{d.category}</td>
                  <td className="px-5 py-3 max-w-xs text-gray-700">{d.description}</td>
                  <td className="px-5 py-3 font-bold">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] ${
                        d.severity === "Critical"
                          ? "bg-rose-100 text-rose-800 border border-rose-200"
                          : d.severity === "Major"
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : "bg-blue-100 text-blue-800 border border-blue-200"
                      }`}
                    >
                      {d.severity}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    {d.status === "Approved" ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-semibold border border-emerald-200">
                        <CheckCircle className="w-3 h-3" /> Approved
                      </span>
                    ) : (
                      <button
                        onClick={() => handleApprove(d.id)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded shadow-xs"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-gray-100">
            <h3 className="font-bold text-lg text-gray-900 border-b border-gray-100 pb-3">
              Log Protocol Deviation
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Subject ID *</label>
                <input
                  type="text"
                  required
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  placeholder="e.g. 101-002"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg max-w-full"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg max-w-full bg-white font-medium"
                >
                  <option value="Inclusion/Exclusion Violation">Inclusion/Exclusion Violation</option>
                  <option value="Out-of-Window Visit">Out-of-Window Visit</option>
                  <option value="Safety Lab Non-Compliance">Safety Lab Non-Compliance</option>
                  <option value="Dosing Error">Dosing Error</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Severity Level</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg max-w-full bg-white font-medium"
                >
                  <option value="Minor">Minor</option>
                  <option value="Major">Major</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Detailed Description *</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe deviation circumstances and impact..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg max-w-full"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                >
                  Save Deviation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
