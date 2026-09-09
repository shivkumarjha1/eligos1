"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { ChevronDown } from "lucide-react";

export const Header: React.FC<{ onOpenAddUser?: () => void; onLogout?: () => void }> = ({
  onLogout,
}) => {
  const { currentUser, selectedStudyId, setSelectedStudyId, studySummaries } = useAuth();

  const isAdmin = currentUser?.role === "SuperAdmin" || currentUser?.role === "Admin";
  const assignedCodes = currentUser?.assignedStudies || [];

  const visibleStudySummaries = React.useMemo(() => {
    if (isAdmin) return studySummaries;
    return studySummaries.filter((s) =>
      assignedCodes.some(
        (code) => s.id.includes(code) || s.subtitle.includes(code) || code.includes(s.id)
      )
    );
  }, [isAdmin, assignedCodes, studySummaries]);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 px-6 py-2.5 flex items-center justify-between shadow-2xs">
      {/* Left Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-white border-2 border-emerald-400 p-1 flex items-center justify-center shadow-xs">
          <div className="w-full h-full rounded-full bg-emerald-50 flex flex-col justify-center gap-0.5 px-1">
            <div className="h-0.5 bg-emerald-500 rounded-full w-full" />
            <div className="h-0.5 bg-emerald-500 rounded-full w-4/5" />
            <div className="h-0.5 bg-blue-500 rounded-full w-3/5" />
          </div>
        </div>
        <div className="flex items-baseline text-lg font-extrabold tracking-tight">
          <span className="text-[#1D64EC]">Elig</span>
          <span className="text-[#059669]">OS</span>
        </div>
      </div>

      {/* Center Study Selector Dropdown Pill */}
      <div className="relative">
        <select
          value={selectedStudyId}
          onChange={(e) => setSelectedStudyId(e.target.value)}
          className="appearance-none bg-white border border-gray-300 hover:border-gray-400 font-bold text-xs text-gray-800 rounded-lg px-3.5 py-1.5 pr-8 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs cursor-pointer max-w-full"
        >
          {visibleStudySummaries.map((s) => (
            <option key={s.id} value={s.subtitle}>
              {s.subtitle}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Right User Profile Info */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-xs font-extrabold text-gray-900 leading-tight">
            {currentUser?.first} {currentUser?.last}
          </div>
          <div className="text-[10px] font-bold flex items-center justify-end gap-1">
            {currentUser?.role === "SuperAdmin" && (
              <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded border border-amber-300">
                👑 SuperAdmin
              </span>
            )}
            {currentUser?.role === "PI" && (
              <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-300">
                🩺 Principal Investigator (PI)
              </span>
            )}
            {currentUser?.role === "CRO" && (
              <span className="bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded border border-indigo-300">
                🔍 CRO Monitor
              </span>
            )}
            {currentUser?.role === "Sponsor" && (
              <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded border border-blue-300">
                💼 Sponsor Executive
              </span>
            )}
          </div>
        </div>

        {/* User Initials Avatar */}
        <div
          className={`w-8 h-8 rounded-full text-white font-black flex items-center justify-center text-xs shadow-xs ${
            currentUser?.role === "PI"
              ? "bg-emerald-600"
              : currentUser?.role === "CRO"
              ? "bg-indigo-600"
              : currentUser?.role === "Sponsor"
              ? "bg-blue-600"
              : "bg-[#B48318]"
          }`}
        >
          {currentUser
            ? `${currentUser.first.replace(/[^a-zA-Z]/g, "")[0] || ""}${
                currentUser.last[0] || ""
              }`.toUpperCase()
            : "DJ"}
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="px-3 py-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-md shadow-2xs transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
};
