"use client";

import React from "react";
import { NavTabId } from "@/types";
import { 
  BarChart2, 
  FileText, 
  HelpCircle, 
  Lightbulb, 
  PhoneCall, 
  Users, 
  CheckSquare, 
  ClipboardList, 
  Shuffle, 
  Laptop, 
  Calendar, 
  ShieldAlert, 
  Crown, 
  FolderKanban, 
  UserCheck, 
  Sliders, 
  BookOpen, 
  FolderArchive, 
  Building2, 
  Pill, 
  FlaskConical, 
  Brain, 
  FileSearch, 
  FolderLock, 
  TrendingUp, 
  PieChart 
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

interface SidebarProps {
  activeTab: NavTabId;
  setActiveTab: (tab: NavTabId) => void;
}

interface NavSection {
  title: string;
  items: {
    id: NavTabId;
    label: string;
    icon: React.ReactNode;
    badge?: string;
    isAdminHighlight?: boolean;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === "SuperAdmin";
  const isPI = currentUser?.role === "PI";

  const allSections: NavSection[] = [
    {
      title: "OVERVIEW",
      items: [
        { id: "dashboard", label: "Dashboard", icon: <BarChart2 className="w-4 h-4 text-emerald-600" /> },
        { id: "protocol_compliance", label: "Protocol and Compliance", icon: <FileText className="w-4 h-4 text-amber-600" /> },
        { id: "study_communications", label: "Study Communications", icon: <HelpCircle className="w-4 h-4 text-rose-500" /> },
        { id: "study_faq_log", label: "Study FAQ Log", icon: <Lightbulb className="w-4 h-4 text-amber-400" /> },
        { id: "study_contacts", label: "Study Contacts", icon: <PhoneCall className="w-4 h-4 text-[#1D64EC]" /> },
      ],
    },
    {
      title: "SUBJECTS",
      items: [
        { id: "subject_list", label: "Subject List", icon: <Users className="w-4 h-4 text-blue-600" /> },
        { id: "eligibility_review", label: "Eligibility Review", icon: <CheckSquare className="w-4 h-4 text-emerald-600" /> },
        { id: "eligibility_meetings", label: "Eligibility Meetings", icon: <ClipboardList className="w-4 h-4 text-rose-600" /> },
        { id: "randomization", label: "Randomization", icon: <Shuffle className="w-4 h-4 text-slate-500" /> },
      ],
    },
    {
      title: "DATA COLLECTION",
      items: [
        { id: "edc_ecrf", label: "EDC / eCRF", icon: <Laptop className="w-4 h-4 text-amber-600" /> },
        { id: "visit_schedule", label: "Visit Schedule", icon: <Calendar className="w-4 h-4 text-rose-600" /> },
      ],
    },
    {
      title: "SAFETY",
      items: [
        { id: "safety_hub", label: "Safety Hub", icon: <ShieldAlert className="w-4 h-4 text-rose-600" />, badge: "2" },
      ],
    },
    {
      title: "ADMIN",
      items: [
        { id: "admin_dashboard", label: "Admin Dashboard", icon: <Crown className="w-4 h-4 text-amber-600" />, isAdminHighlight: true },
        { id: "study_management", label: "Study Management", icon: <FolderKanban className="w-4 h-4 text-[#1D64EC]" /> },
        { id: "user_management", label: "User Management", icon: <UserCheck className="w-4 h-4 text-blue-600" /> },
      ],
    },
    {
      title: "REFERENCE",
      items: [
        { id: "ie_library", label: "I/E Library", icon: <BookOpen className="w-4 h-4 text-rose-400" /> },
        { id: "document_vault", label: "Document Vault", icon: <FolderArchive className="w-4 h-4 text-slate-500" /> },
      ],
    },
    {
      title: "OPERATIONS",
      items: [
        { id: "site_management", label: "Site Management", icon: <Building2 className="w-4 h-4 text-slate-600" /> },
      ],
    },
    {
      title: "COMPLIANCE",
      items: [
        { id: "audit_trail", label: "Audit Trail", icon: <FileSearch className="w-4 h-4 text-amber-700" /> },
        { id: "regulatory_etmf", label: "Regulatory (eTMF)", icon: <FolderLock className="w-4 h-4 text-slate-500" /> },
        { id: "risk_monitoring", label: "Risk Monitoring", icon: <TrendingUp className="w-4 h-4 text-rose-500" /> },
      ],
    },
    {
      title: "REPORTS",
      items: [
        { id: "reports_analytics", label: "Reports & Analytics", icon: <PieChart className="w-4 h-4 text-emerald-600" /> },
      ],
    },
  ];

  const permissions = currentUser?.customPermissions || {};

  const isItemVisible = (itemId: NavTabId): boolean => {
    if (currentUser?.role === "SuperAdmin" || currentUser?.role === "Admin") return true;

    if (itemId === "admin_dashboard" || itemId === "study_management" || itemId === "user_management") {
      return !!permissions.adminDashboard;
    }
    if (itemId === "site_management") {
      return !isPI || !!permissions.siteManagement;
    }
    if (itemId === "audit_trail") {
      return !isPI || !!permissions.auditTrail;
    }
    if (itemId === "regulatory_etmf") {
      return !isPI || !!permissions.regulatoryEtmf;
    }
    if (itemId === "risk_monitoring") {
      return !isPI || !!permissions.riskMonitoring;
    }
    if (itemId === "reports_analytics") {
      return !isPI || !!permissions.reportsAnalytics;
    }
    return true;
  };

  const sections = allSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => isItemVisible(item.id)),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex-shrink-0 min-h-[calc(100vh-53px)] py-3 overflow-y-auto font-sans text-xs">
      {/* Persona Role Scope Banner */}
      <div className="mx-3 mb-3 px-2.5 py-2 bg-slate-50 rounded-lg border border-slate-200">
        <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">
          Active Persona Scope
        </div>
        <div className="font-extrabold text-xs text-slate-800 truncate mt-0.5">
          {currentUser?.first} {currentUser?.last}
        </div>
        <div className="text-[10px] font-semibold text-slate-600 truncate">
          {currentUser?.site}
        </div>
      </div>

      <div className="space-y-4 px-3">
        {sections.map((section) => (
          <div key={section.title} className="space-y-1">
            <h3 className="px-2 text-[10px] font-black text-gray-400 uppercase tracking-wider">
              {section.title}
            </h3>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-full transition-all font-semibold ${
                      isActive
                        ? "bg-[#FEF3C7] text-[#92400E] shadow-2xs font-extrabold"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.icon}
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="w-4 h-4 rounded-full bg-rose-600 text-white font-bold text-[9px] flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};
