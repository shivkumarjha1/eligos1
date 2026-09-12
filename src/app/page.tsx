"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { AdminDashboard } from "@/components/AdminDashboard";
import { TrialDashboard } from "@/components/TrialDashboard";
import { ProtocolComplianceSection } from "@/components/ProtocolComplianceSection";
import { StudyCommunicationsSection } from "@/components/StudyCommunicationsSection";
import { StudyFAQLogSection } from "@/components/StudyFAQLogSection";
import { StudyContactsDirectorySection } from "@/components/StudyContactsDirectorySection";
import { SubjectRegistrySection } from "@/components/SubjectRegistrySection";
import { EligibilityMeetingsSection } from "@/components/EligibilityMeetingsSection";
import { RandomizationSection } from "@/components/RandomizationSection";
import { EdcEcrfSection } from "@/components/EdcEcrfSection";
import { VisitScheduleTrackerSection } from "@/components/VisitScheduleTrackerSection";
import { DocumentVaultSection } from "@/components/DocumentVaultSection";
import { IeLibrarySection } from "@/components/IeLibrarySection";
import { StudyManagementSection } from "@/components/StudyManagementSection";
import { SiteManagementSection } from "@/components/SiteManagementSection";
import { AuditTrailSection } from "@/components/AuditTrailSection";
import { ReportsAnalyticsSection } from "@/components/ReportsAnalyticsSection";
import { RiskMonitoringSection } from "@/components/RiskMonitoringSection";
import { RegulatoryEtmfSection } from "@/components/RegulatoryEtmfSection";
import { SafetyHubSection } from "@/components/SafetyHubSection";
import { AdminUserModal } from "@/components/AdminUserModal";
import { DashboardOverview } from "@/components/DashboardOverview";
import { EligibilityReviewSection } from "@/components/EligibilityReviewSection";
import { DirectoryTable } from "@/components/DirectoryTable";
import { DeviationsSection } from "@/components/DeviationsSection";
import { LoginScreen } from "@/components/LoginScreen";
import { useAuth } from "@/context/AuthContext";
import { UserProfile, NavTabId } from "@/types";
import { ShieldCheck, UserPlus, Trash2, Edit2, Settings } from "lucide-react";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default logged in as requested
  const [activeTab, setActiveTab] = useState<NavTabId>("admin_dashboard");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const { users, currentUser, deleteUser } = useAuth();

  const permissions = currentUser?.customPermissions || {};
  const isPI = currentUser?.role === "PI";

  const isTabRestricted = (tab: NavTabId): boolean => {
    if (currentUser?.role === "SuperAdmin" || currentUser?.role === "Admin") return false;
    if (tab === "admin_dashboard" || tab === "study_management" || tab === "user_management") {
      return !permissions.adminDashboard;
    }
    if (tab === "site_management") return isPI && !permissions.siteManagement;
    if (tab === "audit_trail") return isPI && !permissions.auditTrail;
    if (tab === "regulatory_etmf") return isPI && !permissions.regulatoryEtmf;
    if (tab === "risk_monitoring") return isPI && !permissions.riskMonitoring;
    if (tab === "reports_analytics") return isPI && !permissions.reportsAnalytics;
    if (tab === "document_vault") return isPI && !permissions.documentVault;
    return false;
  };

  // Auto-redirect user away from restricted tabs if access is revoked
  React.useEffect(() => {
    if (isTabRestricted(activeTab)) {
      setActiveTab("dashboard");
    }
  }, [currentUser, activeTab]);

  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  const renderTabContent = () => {
    if (isTabRestricted(activeTab)) {
      return (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-xl font-bold">
            🚫
          </div>
          <h2 className="text-base font-extrabold text-rose-900">Access Restricted</h2>
          <p className="text-xs text-rose-700 max-w-md mx-auto font-medium">
            This module is restricted by the Platform Administrator for your user profile and role assignment.
          </p>
        </div>
      );
    }

    switch (activeTab) {
      case "admin_dashboard":
        return <AdminDashboard />;
      case "dashboard":
        return <TrialDashboard />;
      case "protocol_compliance":
        return <ProtocolComplianceSection />;
      case "study_communications":
        return <StudyCommunicationsSection />;
      case "study_faq_log":
        return <StudyFAQLogSection />;
      case "subject_list":
        return <SubjectRegistrySection />;
      case "eligibility_review":
        return <EligibilityReviewSection />;
      case "eligibility_meetings":
        return <EligibilityMeetingsSection />;
      case "randomization":
        return <RandomizationSection />;
      case "edc_ecrf":
        return <EdcEcrfSection />;
      case "visit_schedule":
        return <VisitScheduleTrackerSection />;
      case "ie_library":
        return <IeLibrarySection />;
      case "document_vault":
        return <DocumentVaultSection />;
      case "study_contacts":
        return <StudyContactsDirectorySection onNavigate={setActiveTab} />;
      case "study_management":
        return <StudyManagementSection />;
      case "site_management":
        return <SiteManagementSection />;
      case "audit_trail":
        return <AuditTrailSection />;
      case "regulatory_etmf":
        return <RegulatoryEtmfSection />;
      case "reports_analytics":
        return <ReportsAnalyticsSection />;
      case "risk_monitoring":
        return <RiskMonitoringSection />;
      case "safety_hub":
        return <SafetyHubSection />;
      case "user_management":
        return (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-purple-600" />
                  User & Role Assignment Management
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Admin Dashboard: Create, edit, and assign roles (Admin, PI, CRO, Sponsor) with specific protocol access.
                </p>
              </div>
              <button
                onClick={() => setIsAddUserOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm transition"
              >
                <UserPlus className="w-4 h-4" /> Assign New User & Role
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500 font-semibold uppercase border-b border-gray-200">
                    <tr>
                      <th className="px-5 py-3">Full Name</th>
                      <th className="px-5 py-3">Email Address</th>
                      <th className="px-5 py-3">Assigned Role</th>
                      <th className="px-5 py-3">Site / Center</th>
                      <th className="px-5 py-3">Assigned Protocols</th>
                      <th className="px-5 py-3">Delegated Module Access</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((u) => {
                      const p = u.customPermissions || {};
                      const isFullAdmin = u.role === "SuperAdmin" || u.role === "Admin";
                      return (
                        <tr key={u.uid} className="hover:bg-gray-50">
                          <td className="px-5 py-3 font-bold text-gray-900">
                            {u.first} {u.last}
                          </td>
                          <td className="px-5 py-3 font-mono text-gray-600">
                            <a
                              href={`mailto:${u.email}`}
                              className="text-blue-600 hover:text-blue-800 font-semibold underline transition cursor-pointer"
                              title={`Send email to ${u.email}`}
                            >
                              {u.email}
                            </a>
                          </td>
                          <td className="px-5 py-3 font-bold">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] ${
                                u.role === "SuperAdmin" || u.role === "Admin"
                                  ? "bg-purple-100 text-purple-800 border border-purple-200"
                                  : u.role === "PI"
                                  ? "bg-blue-100 text-blue-800 border border-blue-200"
                                  : u.role === "CRO"
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                  : "bg-amber-100 text-amber-800 border border-amber-200"
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-gray-700 font-medium">{u.site || "Global"}</td>
                          <td className="px-5 py-3">
                            <div className="flex flex-wrap gap-1">
                              {u.assignedStudies.map((s) => (
                                <span key={s} className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex flex-wrap gap-1">
                              {isFullAdmin ? (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-purple-100 text-purple-700">
                                  Full Platform Access
                                </span>
                              ) : (
                                <>
                                  {(p.siteManagement || u.role !== "PI") && (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                      Site Mgmt
                                    </span>
                                  )}
                                  {(p.auditTrail || u.role !== "PI") && (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                      Audit Trail
                                    </span>
                                  )}
                                  {(p.regulatoryEtmf || u.role !== "PI") && (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                                      eTMF
                                    </span>
                                  )}
                                  {(p.riskMonitoring || u.role !== "PI") && (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                                      RACM
                                    </span>
                                  )}
                                  {(p.reportsAnalytics || u.role !== "PI") && (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                      Reports
                                    </span>
                                  )}
                                  {u.role === "PI" &&
                                    !p.siteManagement &&
                                    !p.auditTrail &&
                                    !p.regulatoryEtmf &&
                                    !p.riskMonitoring &&
                                    !p.reportsAnalytics && (
                                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium text-slate-400 italic">
                                        Restricted (PI Standard)
                                      </span>
                                    )}
                                </>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => {
                                  setEditingUser(u);
                                  setIsAddUserOpen(true);
                                }}
                                className="p-1 text-slate-500 hover:text-blue-600 rounded transition"
                                title="Edit Role & Permissions"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>

                              {u.uid !== currentUser?.uid ? (
                                <button
                                  onClick={() => deleteUser(u.uid)}
                                  className="p-1 text-gray-400 hover:text-rose-600 rounded transition"
                                  title="Delete User"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              ) : (
                                <span className="text-[10px] text-gray-400 font-medium italic ml-1">Active</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center space-y-3">
            <h2 className="text-lg font-bold text-gray-900 capitalize">
              {activeTab.replace("_", " ")}
            </h2>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              This module is active and ready for trial data entry and protocol management.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header
        onOpenAddUser={() => {
          setEditingUser(null);
          setIsAddUserOpen(true);
        }}
        onLogout={() => setIsAuthenticated(false)}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {renderTabContent()}
          </div>
        </main>
      </div>

      <AdminUserModal
        isOpen={isAddUserOpen}
        editingUser={editingUser}
        onClose={() => {
          setIsAddUserOpen(false);
          setEditingUser(null);
        }}
      />
    </div>
  );
}
