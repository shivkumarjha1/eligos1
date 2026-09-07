"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Search, Plus, Filter, UserCheck, ShieldCheck, Download } from "lucide-react";

export interface SubjectRecord {
  id: string;
  subjectId: string;
  studyId: string;
  siteName: string;
  screeningDate: string;
  randomizationDate?: string;
  status: "Screened" | "In Review" | "Randomized" | "Screen Failed" | "Discontinued";
  armAssigned?: string;
  age: number;
  gender: "Male" | "Female";
  madrsBaseline?: number;
}

const INITIAL_SUBJECTS: SubjectRecord[] = [
  {
    id: "sub-101",
    subjectId: "101-002",
    studyId: "SLT-206-C118 Cerevastatin",
    siteName: "Johns Hopkins Site 101",
    screeningDate: "2026-06-25",
    randomizationDate: "2026-07-02",
    status: "Randomized",
    armAssigned: "Arm A: Cerevastatin 50mg",
    age: 42,
    gender: "Female",
    madrsBaseline: 28,
  },
  {
    id: "sub-102",
    subjectId: "101-005",
    studyId: "SLT-206-C118 Cerevastatin",
    siteName: "Mount Sinai Site 102",
    screeningDate: "2026-08-10",
    status: "In Review",
    age: 36,
    gender: "Male",
    madrsBaseline: 26,
  },
  {
    id: "sub-103",
    subjectId: "102-001",
    studyId: "SLT-206-C118 Cerevastatin",
    siteName: "Mayo Clinic Site 103",
    screeningDate: "2026-08-14",
    status: "Screened",
    age: 51,
    gender: "Female",
    madrsBaseline: 25,
  },
  {
    id: "sub-104",
    subjectId: "101-001",
    studyId: "SLT-206-C118 Cerevastatin",
    siteName: "Johns Hopkins Site 101",
    screeningDate: "2026-05-12",
    status: "Screen Failed",
    age: 67,
    gender: "Male",
    madrsBaseline: 18, // < 24 threshold
  },
];

export const SubjectListSection: React.FC = () => {
  const { selectedStudyId } = useAuth();
  
  const [subjects, setSubjects] = useState<SubjectRecord[]>(INITIAL_SUBJECTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredSubjects = subjects.filter((s) => {
    const matchesSearch =
      s.subjectId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.siteName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || s.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 font-sans text-slate-800">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Subject Registry & Screening List
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Subject enrollment tracking and GCP bound protocol isolation for <strong className="text-slate-800">{selectedStudyId}</strong>
          </p>
        </div>

        <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1D64EC] hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-2xs transition">
          <Plus className="w-3.5 h-3.5" /> Screen New Subject
        </button>
      </div>

      {/* GCP Bound Constraint Alert */}
      <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-4 flex items-center justify-between text-xs text-emerald-900 shadow-2xs">
        <div className="flex items-center gap-2 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>GCP Subject-Study Bound Active: Subject IDs are locked to protocol {selectedStudyId} and cannot be migrated.</span>
        </div>
        <button className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-emerald-300 text-emerald-800 font-bold text-[11px] rounded-lg shadow-2xs">
          <Download className="w-3 h-3" /> Export List (CSV)
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Subject ID or Site Name..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white max-w-full"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 cursor-pointer max-w-full"
          >
            <option value="All">All Statuses</option>
            <option value="Screened">Screened</option>
            <option value="In Review">In Review</option>
            <option value="Randomized">Randomized</option>
            <option value="Screen Failed">Screen Failed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Subject ID</th>
                <th className="px-6 py-3.5">Site Name</th>
                <th className="px-6 py-3.5">Demographics</th>
                <th className="px-6 py-3.5">Screening Date</th>
                <th className="px-6 py-3.5">MADRS Baseline</th>
                <th className="px-6 py-3.5">Arm Allocation</th>
                <th className="px-6 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSubjects.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-6 py-3.5 font-extrabold font-mono text-slate-900">{s.subjectId}</td>
                  <td className="px-6 py-3.5 font-medium text-slate-700">{s.siteName}</td>
                  <td className="px-6 py-3.5 font-semibold text-slate-800">{s.age}y / {s.gender}</td>
                  <td className="px-6 py-3.5 font-mono text-slate-600">{s.screeningDate}</td>
                  <td className="px-6 py-3.5 font-extrabold text-slate-900">
                    {s.madrsBaseline ? `${s.madrsBaseline} pts` : "N/A"}
                  </td>
                  <td className="px-6 py-3.5 font-semibold text-blue-700">
                    {s.armAssigned || "Unassigned"}
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold ${
                        s.status === "Randomized"
                          ? "bg-emerald-100 text-emerald-800"
                          : s.status === "In Review"
                          ? "bg-amber-100 text-amber-800"
                          : s.status === "Screen Failed"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
