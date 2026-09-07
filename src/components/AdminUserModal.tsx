"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { UserRole, UserProfile, UserModulePermissions } from "@/types";
import { X, UserPlus, ShieldCheck, CheckSquare, Edit2 } from "lucide-react";

interface AdminUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingUser?: UserProfile | null;
}

export const AdminUserModal: React.FC<AdminUserModalProps> = ({
  isOpen,
  onClose,
  editingUser,
}) => {
  const { addUser, updateUser, studies } = useAuth();

  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("PI");
  const [site, setSite] = useState("");
  const [selectedStudies, setSelectedStudies] = useState<string[]>(["MHT-2101-C01"]);
  const [permissions, setPermissions] = useState<UserModulePermissions>({
    siteManagement: false,
    auditTrail: false,
    regulatoryEtmf: false,
    riskMonitoring: false,
    reportsAnalytics: false,
    adminDashboard: false,
  });

  useEffect(() => {
    if (editingUser) {
      setFirst(editingUser.first || "");
      setLast(editingUser.last || "");
      setEmail(editingUser.email || "");
      setRole(editingUser.role || "PI");
      setSite(editingUser.site || "");
      setSelectedStudies(editingUser.assignedStudies || []);
      setPermissions(
        editingUser.customPermissions || {
          siteManagement: editingUser.role !== "PI",
          auditTrail: editingUser.role !== "PI",
          regulatoryEtmf: editingUser.role !== "PI",
          riskMonitoring: editingUser.role !== "PI",
          reportsAnalytics: editingUser.role !== "PI",
          adminDashboard: editingUser.role === "SuperAdmin" || editingUser.role === "Admin",
        }
      );
    } else {
      setFirst("");
      setLast("");
      setEmail("");
      setRole("PI");
      setSite("");
      setSelectedStudies(["SLT-206-C118", "MHT-2101-C01"]);
      setPermissions({
        siteManagement: false,
        auditTrail: false,
        regulatoryEtmf: false,
        riskMonitoring: false,
        reportsAnalytics: false,
        adminDashboard: false,
      });
    }
  }, [editingUser, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!first || !last || !email) return;

    if (editingUser) {
      updateUser(editingUser.uid, {
        first,
        last,
        email,
        role,
        site: site || "Clinical Trial Center",
        assignedStudies: selectedStudies,
        customPermissions: permissions,
      });
    } else {
      addUser({
        first,
        last,
        email,
        role,
        site: site || "Clinical Trial Center",
        active: true,
        assignedStudies: selectedStudies,
        customPermissions: permissions,
      });
    }

    onClose();
  };

  const toggleStudy = (id: string) => {
    setSelectedStudies((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const togglePermission = (key: keyof UserModulePermissions) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full my-8 overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2 font-bold text-lg">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <span>{editingUser ? "Edit User Roles & Protocol Permissions" : "Assign New User & Roles"}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">First Name *</label>
              <input
                type="text"
                required
                value={first}
                onChange={(e) => setFirst(e.target.value)}
                placeholder="e.g. Dr. Jane"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 max-w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Last Name *</label>
              <input
                type="text"
                required
                value={last}
                onChange={(e) => setLast(e.target.value)}
                placeholder="e.g. Smith"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 max-w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. jsmith@site.org"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 max-w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Assign Platform Role *</label>
              <select
                value={role}
                onChange={(e) => {
                  const newRole = e.target.value as UserRole;
                  setRole(newRole);
                  // Default module permissions based on role if not customized
                  if (newRole === "PI") {
                    setPermissions((p) => ({
                      ...p,
                      siteManagement: false,
                      auditTrail: false,
                      regulatoryEtmf: false,
                      riskMonitoring: false,
                      reportsAnalytics: false,
                    }));
                  } else {
                    setPermissions((p) => ({
                      ...p,
                      siteManagement: true,
                      auditTrail: true,
                      regulatoryEtmf: true,
                      riskMonitoring: true,
                      reportsAnalytics: true,
                    }));
                  }
                }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 max-w-full bg-white font-medium"
              >
                <option value="Admin">Admin (System Administrator)</option>
                <option value="PI">PI (Principal Investigator)</option>
                <option value="CRO">CRO (Clinical Research Organization Monitor)</option>
                <option value="Sponsor">Sponsor (Sponsor Study Lead)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Institution / Site Name</label>
              <input
                type="text"
                value={site}
                onChange={(e) => setSite(e.target.value)}
                placeholder="e.g. Apex Medical Research Center"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 max-w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Assigned Clinical Studies / Protocols</label>
            <div className="space-y-2 border border-gray-200 rounded-lg p-3 max-h-36 overflow-y-auto bg-slate-50/50">
              {studies.map((st) => (
                <label key={st.id} className="flex items-center gap-2 text-xs font-medium cursor-pointer text-gray-800 hover:text-blue-600">
                  <input
                    type="checkbox"
                    checked={selectedStudies.includes(st.id)}
                    onChange={() => toggleStudy(st.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>
                    <strong className="text-gray-900">{st.id}</strong> - {st.title}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Granular Module Permission Delegation */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">
              Admin Delegated Module Permissions
            </label>
            <p className="text-[11px] text-gray-500">
              Admin can specifically grant or revoke access to restricted modules (Site Management, Audit Trail, eTMF, Risk Monitoring, Reports):
            </p>
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs font-medium">
              <label className="flex items-center gap-2 cursor-pointer text-slate-800">
                <input
                  type="checkbox"
                  checked={!!permissions.siteManagement}
                  onChange={() => togglePermission("siteManagement")}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>🏢 Site Management</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-800">
                <input
                  type="checkbox"
                  checked={!!permissions.auditTrail}
                  onChange={() => togglePermission("auditTrail")}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>🔍 Audit Trail (Part 11)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-800">
                <input
                  type="checkbox"
                  checked={!!permissions.regulatoryEtmf}
                  onChange={() => togglePermission("regulatoryEtmf")}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>📂 Regulatory (eTMF)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-800">
                <input
                  type="checkbox"
                  checked={!!permissions.riskMonitoring}
                  onChange={() => togglePermission("riskMonitoring")}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>📈 Risk Monitoring (RACM)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-800">
                <input
                  type="checkbox"
                  checked={!!permissions.reportsAnalytics}
                  onChange={() => togglePermission("reportsAnalytics")}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>📊 Reports & Analytics</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-800">
                <input
                  type="checkbox"
                  checked={!!permissions.adminDashboard}
                  onChange={() => togglePermission("adminDashboard")}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>👑 Admin Dashboard</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition"
            >
              {editingUser ? <Edit2 className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
              {editingUser ? "Save User Updates" : "Save & Assign User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
