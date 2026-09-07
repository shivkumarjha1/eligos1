export type UserRole = 'SuperAdmin' | 'Admin' | 'PI' | 'CRO' | 'Sponsor';

export type NavTabId =
  // OVERVIEW
  | "dashboard"
  | "protocol_compliance"
  | "study_communications"
  | "study_faq_log"
  | "study_contacts"
  // SUBJECTS
  | "subject_list"
  | "eligibility_review"
  | "eligibility_meetings"
  | "randomization"
  // DATA COLLECTION
  | "edc_ecrf"
  | "visit_schedule"
  // SAFETY
  | "safety_hub"
  // ADMIN
  | "admin_dashboard"
  | "study_management"
  | "user_management"
  // REFERENCE
  | "ie_library"
  | "document_vault"
  // OPERATIONS
  | "site_management"
  | "drug_accountability"
  | "central_lab"
  | "neuroimaging"
  // COMPLIANCE
  | "audit_trail"
  | "regulatory_etmf"
  | "risk_monitoring"
  // REPORTS
  | "reports_analytics";

export interface UserModulePermissions {
  siteManagement?: boolean;
  auditTrail?: boolean;
  regulatoryEtmf?: boolean;
  riskMonitoring?: boolean;
  reportsAnalytics?: boolean;
  adminDashboard?: boolean;
}

export interface UserProfile {
  uid: string;
  first: string;
  last: string;
  email: string;
  role: UserRole;
  site?: string;
  active: boolean;
  assignedStudies: string[];
  customPermissions?: UserModulePermissions;
  authUid?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudyEnrollmentSummary {
  id: string;
  title: string;
  subtitle: string;
  status: "Active" | "Completed" | "Pending";
  enrolled: number;
  target: number;
  percentage: number;
}

export interface Study {
  id: string;
  title: string;
  ind?: string;
  phase: string;
  sponsor: string;
  sponsorEmail: string;
  ip?: string;
  target: number;
  enrolled: number;
  status: 'Active' | 'Pending' | 'Completed' | 'Suspended';
  protocolUrl?: string;
  protocolName?: string;
  mmpUrl?: string;
  mmpName?: string;
  mdrpUrl?: string;
  mdrpName?: string;
  createdAt?: string;
}

export interface SafetyAlgorithm {
  grade: string;
  severity: string;
  action: string;
}

export interface MMP {
  studyId: string;
  overview: string;
  monitorName: string;
  safetyEmail: string;
  safetyPhone: string;
  algorithms: SafetyAlgorithm[];
}

export interface MDRP {
  studyId: string;
  variables: string[];
  alerts: string[];
}

export interface Deviation {
  id?: string;
  studyId: string;
  subjectId: string;
  date: string;
  category: string;
  description: string;
  severity: 'Minor' | 'Major' | 'Critical';
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface CriterionCheck {
  id: string;
  code: string;
  description: string;
  type: 'Inclusion' | 'Exclusion';
  met: boolean;
  notes?: string;
}

export interface EligibilityReview {
  id: string;
  studyId: string;
  subjectId: string;
  siteId: string;
  submittedByUid: string;
  submittedByEmail: string;
  submittedByName: string;
  submittedAt: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'In Review';
  piApproval?: {
    approved: boolean;
    by: string;
    at: string;
    comments?: string;
  };
  croApproval?: {
    approved: boolean;
    by: string;
    at: string;
    comments?: string;
  };
  sponsorApproval?: {
    approved: boolean;
    by: string;
    at: string;
    comments?: string;
  };
  criteria: CriterionCheck[];
  overallComments?: string;
}
