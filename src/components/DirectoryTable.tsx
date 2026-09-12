"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { UserProfile, UserRole } from "@/types";
import { ShieldCheck, Stethoscope, UserCheck, Building2, Edit2, Lock, Check } from "lucide-react";

export const DirectoryTable: React.FC = () => {
  const { users, currentUser, updateUser } = useAuth();
  const [editingUid, setEditingUid] = useState<string | null>(null);
  const [editSite, setEditSite] = useState("");

  const role = currentUser?.role || "PI";
  const isAdmin = role === "SuperAdmin" || role === "Admin";

  const canEditRecord = (userRecordRole: UserRole) => {
    if (isAdmin) return true;
    if (role === "PI" && userRecordRole === "PI") return true;
    if (role === "CRO" && userRecordRole === "CRO") return true;
    if (role === "Sponsor" && userRecordRole === "Sponsor") return true;
    return false;
  };

  const startEdit = (u: UserProfile) => {
    setEditingUid(u.uid);
    setEditSite(u.site || "");
  };

  const saveEdit = (uid: string) => {
    updateUser(uid, { site: editSite });
    setEditingUid(null);
  };

  const renderSection = (
    title: string,
    sectionRole: UserRole,
    icon: React.ReactNode,
    colorClass: string
  ) => {
    const list = users.filter((u) => u.role === sectionRole);
    const canEditSection = isAdmin || role === sectionRole;

    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden mb-6">
        <div className={`px-5 py-3.5 border-b border-gray-100 flex items-center justify-between ${colorClass}`}>
          <div className="flex items-center gap-2 font-bold text-sm text-gray-900">
            {icon}
            <span>{title}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/80 border border-gray-200">
              {list.length} Records
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
            {canEditSection ? (
              <span className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <Check className="w-3 h-3" /> Edit Permission Enabled
              </span>
            ) : (
              <span className="flex items-center gap-1 text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                <Lock className="w-3 h-3" /> View Only (GCP Isolation)
              </span>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase font-semibold border-b border-gray-100">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email Address</th>
                <th className="px-5 py-3">Site / Center</th>
                <th className="px-5 py-3">Assigned Studies</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {list.map((u) => {
                const isEditing = editingUid === u.uid;
                const allowedToEdit = canEditRecord(u.role);

                return (
                  <tr key={u.uid} className="hover:bg-gray-50/80 transition">
                    <td className="px-5 py-3 font-semibold text-gray-900">
                      {u.first} {u.last}
                    </td>
                    <td className="px-5 py-3 text-gray-600 font-mono">
                      <a
                        href={`mailto:${u.email}`}
                        className="text-blue-700 hover:text-blue-900 font-medium underline transition"
                        title={`Send email to ${u.email}`}
                      >
                        {u.email}
                      </a>
                    </td>
                    <td className="px-5 py-3 text-gray-800 font-medium">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editSite}
                          onChange={(e) => setEditSite(e.target.value)}
                          className="px-2 py-1 border border-blue-400 rounded focus:ring-1 focus:ring-blue-500 text-xs w-full max-w-full"
                        />
                      ) : (
                        u.site || "N/A"
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {u.assignedStudies.map((s) => (
                          <span
                            key={s}
                            className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-700 border border-gray-200"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right">
                      {allowedToEdit ? (
                        isEditing ? (
                          <button
                            onClick={() => saveEdit(u.uid)}
                            className="px-2.5 py-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded transition"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => startEdit(u)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition"
                          >
                            <Edit2 className="w-3 h-3" /> Edit Record
                          </button>
                        )
                      ) : (
                        <span className="text-gray-400 text-[11px] italic">Restricted</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4 flex items-start gap-3 text-xs text-blue-900">
        <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <div className="font-bold text-sm text-blue-950">GCP Directory Contact Isolation Matrix</div>
          <p className="mt-0.5 text-blue-800">
            Per GCP guidelines, PI can update Investigators, CRO can update CRO Monitors, Sponsor can update Sponsors, and Admin manages all listings.
          </p>
        </div>
      </div>

      {renderSection(
        "Investigators (PI Directory)",
        "PI",
        <Stethoscope className="w-4 h-4 text-blue-600" />,
        "bg-blue-50/50"
      )}

      {renderSection(
        "CRO Monitors Directory",
        "CRO",
        <UserCheck className="w-4 h-4 text-emerald-600" />,
        "bg-emerald-50/50"
      )}

      {renderSection(
        "Sponsors Directory",
        "Sponsor",
        <Building2 className="w-4 h-4 text-amber-600" />,
        "bg-amber-50/50"
      )}
    </div>
  );
};
