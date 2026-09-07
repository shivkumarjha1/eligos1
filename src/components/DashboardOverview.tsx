"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  ClipboardCheck, 
  Users, 
  FolderKanban, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight 
} from "lucide-react";
import { NavTabId } from "@/types";

export const DashboardOverview: React.FC<{ onNavigate: (tab: NavTabId) => void }> = ({ onNavigate }) => {
  const { currentUser, users, studies } = useAuth();

  const role = currentUser?.role || "SuperAdmin";

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" /> Logged in as {role} • GCP Clinical Operations Platform
          </div>
          <h1 className="text-2xl font-black tracking-tight">
            Welcome back, {currentUser?.first} {currentUser?.last}
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            EligOS CTMS facilitates eligibility reviews across Principal Investigators (PI), Clinical Research Organizations (CRO), and Trial Sponsors with multi-party digital sign-offs.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigate("eligibility_review")}
          className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-gray-900">2 Active</div>
            <div className="text-xs font-medium text-gray-500">Eligibility Reviews</div>
          </div>
          <div className="mt-2 text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded w-fit font-semibold">
            1 Pending Sponsor Sign-off
          </div>
        </div>

        <div
          onClick={() => onNavigate("study_management")}
          className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <FolderKanban className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-gray-900">{studies.length} Protocols</div>
            <div className="text-xs font-medium text-gray-500">Active Clinical Trials</div>
          </div>
          <div className="mt-2 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded w-fit font-semibold">
            8 Enrolled in MHT-2101
          </div>
        </div>

        <div
          onClick={() => onNavigate("study_contacts")}
          className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-gray-900">{users.length} Users</div>
            <div className="text-xs font-medium text-gray-500">Assigned Team Contacts</div>
          </div>
          <div className="mt-2 text-[11px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded w-fit font-semibold">
            GCP Directory Isolated
          </div>
        </div>

        <div
          onClick={() => onNavigate("safety_hub")}
          className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-amber-600 transition" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-gray-900">2 Logged</div>
            <div className="text-xs font-medium text-gray-500">Protocol Deviations</div>
          </div>
          <div className="mt-2 text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded w-fit font-semibold">
            1 Major Deviation Approved
          </div>
        </div>
      </div>

      {/* Tri-party role breakdown */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <h3 className="text-sm font-bold text-gray-900 mb-3">Role Matrix & Platform Capabilities</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/40 space-y-1">
            <div className="font-bold text-purple-900">SuperAdmin / Admin</div>
            <p className="text-purple-800 text-[11px]">
              Full platform oversight, role assignment (Admin, PI, CRO, Sponsor), directory management, and system configuration.
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40 space-y-1">
            <div className="font-bold text-blue-900">Principal Investigator (PI)</div>
            <p className="text-blue-800 text-[11px]">
              Submit subject eligibility evaluations, verify inclusion/exclusion criteria, and manage site investigator listings.
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-1">
            <div className="font-bold text-emerald-900">CRO Monitor</div>
            <p className="text-emerald-800 text-[11px]">
              Verify source documents, approve eligibility submissions, track deviations, and update CRO monitor directory.
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 space-y-1">
            <div className="font-bold text-amber-900">Trial Sponsor</div>
            <p className="text-amber-800 text-[11px]">
              Final eligibility sign-off, enrollment authorization, protocol oversight, and update Sponsor directory listings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
