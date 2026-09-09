"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { EligibilityReview, CriterionCheck } from "@/types";
import { 
  ClipboardCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Plus, 
  ShieldAlert, 
  FileText, 
  Check, 
  UserCheck, 
  Building2, 
  Stethoscope,
  Printer,
  RotateCcw,
  AlertTriangle,
  FileCheck,
  Brain,
  Upload,
  Search,
  Lock,
  Trash2,
  Download,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  UserPlus
} from "lucide-react";

const PROTOCOL_CRITERIA_DATABASE: Record<string, CriterionCheck[]> = {
  "MHT-2101-C01": [
    { id: "inc1", code: "INC 01", description: "Age 18 to 65 years at time of screening consent", type: "Inclusion", met: true },
    { id: "inc2", code: "INC 02", description: "Confirmed genetic diagnosis of VKCM via CLIA laboratory", type: "Inclusion", met: true },
    { id: "inc3", code: "INC 03", description: "Willing and able to comply with scheduled visits, treatment plan, and lab tests", type: "Inclusion", met: true },
    { id: "exc1", code: "EXC 01", description: "AST or ALT > 3.0x Upper Limit of Normal (ULN)", type: "Exclusion", met: false },
    { id: "exc2", code: "EXC 02", description: "Prior exposure to gene therapy vector APO-lorparvovec", type: "Exclusion", met: false },
    { id: "exc3", code: "EXC 03", description: "Current or recent hepatic impairment or acute liver injury", type: "Exclusion", met: false },
  ],
  "SLT-206-C118": [
    { id: "inc1", code: "INC 01", description: "Diagnosis of Bipolar I or II Disorder (ICD-10 F31.9) per DSM-5 criteria", type: "Inclusion", met: true },
    { id: "inc2", code: "INC 02", description: "Baseline MADRS score ≥ 24 at screening evaluation", type: "Inclusion", met: true },
    { id: "inc3", code: "INC 03", description: "Stable doses of psychotropic medications for a minimum of 3 months prior to screening", type: "Inclusion", met: true },
    { id: "exc1", code: "EXC 01", description: "Significant suicidal ideation or behavior (C-SSRS Grade 4 or 5) within past 3 months", type: "Exclusion", met: false },
    { id: "exc2", code: "EXC 02", description: "Current treatment with strong CYP2D6 inhibitors or contraindicated psychotropics", type: "Exclusion", met: false },
  ],
  "ZP-010-BS01": [
    { id: "inc1", code: "INC 01", description: "Clinical diagnosis of Tardive Dyskinesia (TD) for at least 3 months", type: "Inclusion", met: true },
    { id: "inc2", code: "INC 02", description: "Eligible to receive VMAT2 inhibitor according to product labeling", type: "Inclusion", met: true },
    { id: "exc1", code: "EXC 01", description: "Treatment with botulinum toxin within past 3 months", type: "Exclusion", met: false },
  ],
};

interface StudySubjectOption {
  subjectId: string;
  studyId: string;
  ageSex: string;
  site: string;
  status: string;
}

const STUDY_SUBJECTS_REGISTRY: Record<string, StudySubjectOption[]> = {
  "MHT-2101-C01": [
    { subjectId: "100-101MHT", studyId: "MHT-2101-C01", ageSex: "35/F", site: "HomeSite", status: "ELIGIBLE" },
    { subjectId: "101-002", studyId: "MHT-2101-C01", ageSex: "42/F", site: "Apex Research", status: "IN REVIEW" },
    { subjectId: "101-005", studyId: "MHT-2101-C01", ageSex: "36/M", site: "Mount Sinai Site 102", status: "APPROVED" },
  ],
  "SLT-206-C118": [
    { subjectId: "101-002", studyId: "SLT-206-C118", ageSex: "42/F", site: "Johns Hopkins Site 101", status: "RANDOMIZED" },
    { subjectId: "101-005", studyId: "SLT-206-C118", ageSex: "36/M", site: "Mount Sinai Site 102", status: "IN REVIEW" },
  ],
  "ZP-010-BS01": [
    { subjectId: "ZP-201", studyId: "ZP-010-BS01", ageSex: "29/M", site: "Mayo Clinic Site 103", status: "SCREENED" },
    { subjectId: "ZP-204", studyId: "ZP-010-BS01", ageSex: "48/F", site: "Apex Research", status: "PENDING REVIEW" },
  ],
};

const SAMPLE_REVIEWS: EligibilityReview[] = [
  {
    id: "REV-2026-001",
    studyId: "MHT-2101-C01",
    subjectId: "101-002",
    siteId: "Apex Research (Boston)",
    submittedByUid: "pi_user",
    submittedByEmail: "pi.vance@apex-trials.org",
    submittedByName: "Dr. Elena Vance",
    submittedAt: "2026-09-02 14:20",
    status: "In Review",
    piApproval: {
      approved: true,
      by: "Dr. Elena Vance (PI)",
      at: "2026-09-02 14:25",
      comments: "Subject meets all primary inclusion criteria. Genetic marker confirmed.",
    },
    croApproval: {
      approved: true,
      by: "Marcus Reynolds (CRO)",
      at: "2026-09-03 09:10",
      comments: "Lab source documents verified against protocol requirements.",
    },
    criteria: PROTOCOL_CRITERIA_DATABASE["MHT-2101-C01"],
    overallComments: "Subject meets all protocol requirements. Ready for final Sponsor sign-off.",
  },
  {
    id: "REV-2026-002",
    studyId: "MHT-2101-C01",
    subjectId: "101-005",
    siteId: "Mount Sinai Site 102",
    submittedByUid: "pi_user",
    submittedByEmail: "pi.vance@apex-trials.org",
    submittedByName: "Dr. Elena Vance",
    submittedAt: "2026-09-05 11:00",
    status: "Approved",
    piApproval: {
      approved: true,
      by: "Dr. Elena Vance (PI)",
      at: "2026-09-05 11:05",
    },
    croApproval: {
      approved: true,
      by: "Marcus Reynolds (CRO)",
      at: "2026-09-06 10:15",
    },
    sponsorApproval: {
      approved: true,
      by: "Marcus DiFrisco (Sponsor)",
      at: "2026-09-06 16:40",
      comments: "Approved for enrollment & IP kit dispatch.",
    },
    criteria: PROTOCOL_CRITERIA_DATABASE["MHT-2101-C01"],
    overallComments: "Approved for Phase III enrollment.",
  },
];

interface MedicalMonitorWriteup {
  subjectId: string;
  studyId: string;
  indication: string;
  compiledAt: string;
  compiledBy: string;
  overallStatus: "APPROVED" | "SCREEN FAIL" | "PENDING REVIEW";
  parameters: Array<{
    name: string;
    patientValue: string;
    targetRequirement: string;
    status: "PASSED" | "VIOLATION";
  }>;
  narrative: string;
}

export const EligibilityReviewSection: React.FC = () => {
  const { currentUser, selectedStudyId } = useAuth();
  
  // Role checks
  const role = currentUser?.role || "PI";
  const isPI = role === "PI";
  const isCRO = role === "CRO";
  const isSponsor = role === "Sponsor";
  const isAdmin = role === "Admin" || role === "SuperAdmin";
  const canAccessMedicalBoard = isCRO || isSponsor || isAdmin;
  const canLoadSubject = isPI || isAdmin; // PI and Admin can load subjects. CRO/Sponsor cannot.

  // Active cascaded study and subject state
  const [activeStudyId, setActiveStudyId] = useState<string>(selectedStudyId || "MHT-2101-C01");
  const [activeSubjectId, setActiveSubjectId] = useState<string>("");

  // Helper to load and merge subjects from both eligos_subjects_registry and eligos_registry_subjects
  const loadMergedRegistry = (): Record<string, StudySubjectOption[]> => {
    let registry: Record<string, StudySubjectOption[]> = { ...STUDY_SUBJECTS_REGISTRY };
    if (typeof window !== "undefined") {
      const savedRegistry = localStorage.getItem("eligos_subjects_registry");
      if (savedRegistry) {
        try {
          registry = { ...registry, ...JSON.parse(savedRegistry) };
        } catch (e) {
          console.error("Failed to load saved subjects registry", e);
        }
      }

      const savedList = localStorage.getItem("eligos_registry_subjects");
      if (savedList) {
        try {
          const list: any[] = JSON.parse(savedList);
          list.forEach((sub) => {
            const code = sub.studyId ? sub.studyId.split(" ")[0] : (sub.studyTitle ? sub.studyTitle.split(" ")[0] : "SLT-206-C118");
            const opt: StudySubjectOption = {
              subjectId: sub.subjectId,
              studyId: code,
              ageSex: sub.ageSex || "35/F",
              site: sub.site || "HomeSite",
              status: sub.status || "SCREENED",
            };
            const currentCodeArr = registry[code] || [];
            if (!currentCodeArr.some((o) => o.subjectId === opt.subjectId)) {
              registry[code] = [opt, ...currentCodeArr];
            }
            if (sub.studyTitle && sub.studyTitle !== code) {
              const currentTitleArr = registry[sub.studyTitle] || [];
              if (!currentTitleArr.some((o) => o.subjectId === opt.subjectId)) {
                registry[sub.studyTitle] = [opt, ...currentTitleArr];
              }
            }
          });
        } catch (e) {
          console.error("Failed to merge registered subjects list", e);
        }
      }
    }
    return registry;
  };

  // Subjects Registry State
  const [subjectsRegistry, setSubjectsRegistry] = useState<Record<string, StudySubjectOption[]>>(loadMergedRegistry);

  // Save subjectsRegistry to localStorage on change
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("eligos_subjects_registry", JSON.stringify(subjectsRegistry));
    }
  }, [subjectsRegistry]);

  // Listen for storage / custom subject registration events to auto-refresh subjects
  React.useEffect(() => {
    const handleUpdate = () => {
      setSubjectsRegistry(loadMergedRegistry());
    };
    window.addEventListener("eligos_subject_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("eligos_subject_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // View Mode: 'checklist' for PI, default 'medical_board' for CRO/Sponsor/Admin
  const [viewMode, setViewMode] = useState<"checklist" | "medical_board">(
    canAccessMedicalBoard ? "medical_board" : "checklist"
  );

  // PI Checklist State
  const [reviews, setReviews] = useState<EligibilityReview[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("eligos_eligibility_reviews");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to load saved eligibility reviews", e);
        }
      }
    }
    return SAMPLE_REVIEWS;
  });

  // Save reviews to localStorage on change
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("eligos_eligibility_reviews", JSON.stringify(reviews));
    }
  }, [reviews]);

  const [selectedReview, setSelectedReview] = useState<EligibilityReview | null>(SAMPLE_REVIEWS[0]);

  // Modal states for Interactive Evaluation Wizard
  const [showEvalModal, setShowEvalModal] = useState(false);
  const [modalSubjectId, setModalSubjectId] = useState("");
  const [modalSiteId, setModalSiteId] = useState("Apex Research (Boston)");
  const [modalStudyId, setModalStudyId] = useState("MHT-2101-C01");
  const [evalCriteria, setEvalCriteria] = useState<CriterionCheck[]>(
    PROTOCOL_CRITERIA_DATABASE["MHT-2101-C01"]
  );
  const [medicalNotes, setMedicalNotes] = useState("");

  // CRO & Sponsor Medical Monitor Board State
  const [boardSearch, setBoardSearch] = useState("");
  const [selectedBoardFilter, setSelectedBoardFilter] = useState<"ALL" | "SCREENING" | "PENDING" | "APPROVED" | "SCREEN_FAIL">("ALL");
  const [stagedFiles, setStagedFiles] = useState<Array<{ name: string; size: string }>>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [compiledWriteup, setCompiledWriteup] = useState<MedicalMonitorWriteup | null>(null);

  const canPIApprove = isPI || isAdmin;
  const canCROApprove = isCRO || isAdmin;
  const canSponsorApprove = isSponsor || isAdmin;

  // Sync activeStudyId with selectedStudyId from AuthContext
  React.useEffect(() => {
    if (selectedStudyId) {
      const code = selectedStudyId.split(" ")[0];
      if (selectedStudyId.includes("SLT") || selectedStudyId.includes("Cerevastatin")) {
        setActiveStudyId("SLT-206-C118");
      } else if (selectedStudyId.includes("MHT") || selectedStudyId.includes("MYOGUARD")) {
        setActiveStudyId("MHT-2101-C01");
      } else if (selectedStudyId.includes("ZP") || selectedStudyId.includes("ZEPHYR")) {
        setActiveStudyId("ZP-010-BS01");
      } else {
        setActiveStudyId(code || selectedStudyId);
      }
    }
  }, [selectedStudyId]);

  // Filter available subjects based on active study selector (handling codes and full titles)
  const availableSubjects = React.useMemo(() => {
    const studyCode = activeStudyId.split(" ")[0];
    const directArr = subjectsRegistry[activeStudyId] || subjectsRegistry[studyCode] || [];

    const extraSubjects: StudySubjectOption[] = [];
    Object.keys(subjectsRegistry).forEach((key) => {
      if (key.includes(studyCode) || studyCode.includes(key.split(" ")[0])) {
        (subjectsRegistry[key] || []).forEach((sub) => {
          if (!directArr.some((d) => d.subjectId === sub.subjectId) && !extraSubjects.some((e) => e.subjectId === sub.subjectId)) {
            extraSubjects.push(sub);
          }
        });
      }
    });

    return [...directArr, ...extraSubjects];
  }, [subjectsRegistry, activeStudyId]);

  // Auto-sync reviews with availableSubjects if a subject is missing from reviews
  React.useEffect(() => {
    if (availableSubjects.length > 0) {
      setReviews((prevReviews) => {
        let updated = false;
        const newReviews = [...prevReviews];
        availableSubjects.forEach((sub) => {
          const exists = newReviews.some(
            (r) => r.subjectId === sub.subjectId && (r.studyId === sub.studyId || sub.studyId.includes(r.studyId) || r.studyId.includes(sub.studyId))
          );
          if (!exists) {
            updated = true;
            const studyCode = sub.studyId.split(" ")[0];
            const criteria = PROTOCOL_CRITERIA_DATABASE[studyCode] || PROTOCOL_CRITERIA_DATABASE["MHT-2101-C01"];
            newReviews.push({
              id: `REV-2026-${sub.subjectId.replace(/[^a-zA-Z0-9]/g, "")}`,
              studyId: sub.studyId,
              subjectId: sub.subjectId,
              siteId: sub.site || "Apex Research",
              submittedByUid: currentUser?.uid || "pi_user",
              submittedByEmail: currentUser?.email || "pi.vance@apex-trials.org",
              submittedByName: `${currentUser?.first || "Dr. Elena"} ${currentUser?.last || "Vance"}`,
              submittedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
              status: sub.status === "ELIGIBLE" || sub.status === "APPROVED" ? "Approved" : "In Review",
              piApproval: sub.status === "ELIGIBLE" || sub.status === "APPROVED" ? {
                approved: true,
                by: `${currentUser?.first || "Dr. Elena"} ${currentUser?.last || "Vance"} (PI)`,
                at: new Date().toISOString().slice(0, 16).replace("T", " "),
                comments: "Subject registered and verified."
              } : undefined,
              criteria: criteria,
              overallComments: `Subject ${sub.subjectId} registered under protocol ${sub.studyId}. Eligibility review initialized.`,
            });
          }
        });
        return updated ? newReviews : prevReviews;
      });
    }
  }, [availableSubjects, currentUser]);

  // Active subject object metadata
  const selectedSubjectMeta = availableSubjects.find((s) => s.subjectId === activeSubjectId);

  // Dynamic calculation of stat counts
  const screeningCount = availableSubjects.filter((s) => s.status === "SCREENED" || s.status === "SCREENING").length;
  const pendingCount = availableSubjects.filter((s) => s.status === "IN REVIEW" || s.status === "PENDING REVIEW" || s.status === "PENDING").length;
  const approvedCount = availableSubjects.filter((s) => s.status === "APPROVED" || s.status === "ELIGIBLE" || s.status === "RANDOMIZED").length;
  const screenFailCount = availableSubjects.filter((s) => s.status === "SCREEN FAIL" || s.status === "REJECTED").length;

  // Filter reviews by selected study & subject
  const studyReviews = reviews.filter(
    (r) => (r.studyId === activeStudyId || activeStudyId.includes(r.studyId) || r.studyId.includes(activeStudyId.split(" ")[0])) &&
           (!activeSubjectId || r.subjectId === activeSubjectId)
  );

  // Auto-select initial review when study queue changes
  React.useEffect(() => {
    if (studyReviews.length > 0 && (!selectedReview || !studyReviews.some((r) => r.id === selectedReview.id))) {
      setSelectedReview(studyReviews[0]);
    }
  }, [studyReviews]);

  // Handle Study Selection Change
  const handleStudyChange = (studyId: string) => {
    setActiveStudyId(studyId);
    setActiveSubjectId(""); // Reset subject selection mandatory context
    setCompiledWriteup(null);
  };

  // Toggle criterion value in evaluation modal
  const handleToggleCriterion = (id: string, val: boolean) => {
    setEvalCriteria((prev) =>
      prev.map((c) => (c.id === id ? { ...c, met: val } : c))
    );
  };

  // Calculate live eligibility
  const calculateEligibility = (criteriaList: CriterionCheck[]) => {
    const failedInclusions = criteriaList.filter((c) => c.type === "Inclusion" && !c.met);
    const failedExclusions = criteriaList.filter((c) => c.type === "Exclusion" && c.met);
    const isEligible = failedInclusions.length === 0 && failedExclusions.length === 0;

    return {
      isEligible,
      failedInclusions,
      failedExclusions,
      failedCount: failedInclusions.length + failedExclusions.length,
    };
  };

  const currentEvalResult = calculateEligibility(evalCriteria);

  const handleApproveStage = (reviewId: string, stage: "pi" | "cro" | "sponsor") => {
    const timestamp = new Date().toISOString().slice(0, 16).replace("T", " ");
    const userName = `${currentUser?.first} ${currentUser?.last}`;

    setReviews((prev) =>
      prev.map((r) => {
        if (r.id !== reviewId) return r;
        const updated = { ...r };
        if (stage === "pi") {
          updated.piApproval = { approved: true, by: `${userName} (PI)`, at: timestamp };
        } else if (stage === "cro") {
          updated.croApproval = { approved: true, by: `${userName} (CRO)`, at: timestamp };
        } else if (stage === "sponsor") {
          updated.sponsorApproval = { approved: true, by: `${userName} (Sponsor)`, at: timestamp };
          updated.status = "Approved";
        }
        return updated;
      })
    );

    if (selectedReview?.id === reviewId) {
      setSelectedReview((prev) => {
        if (!prev) return null;
        const updated = { ...prev };
        if (stage === "pi") {
          updated.piApproval = { approved: true, by: `${userName} (PI)`, at: timestamp };
        } else if (stage === "cro") {
          updated.croApproval = { approved: true, by: `${userName} (CRO)`, at: timestamp };
        } else if (stage === "sponsor") {
          updated.sponsorApproval = { approved: true, by: `${userName} (Sponsor)`, at: timestamp };
          updated.status = "Approved";
        }
        return updated;
      });
    }
  };

  // PI & Admin Subject Registration Handler
  const handleCreateReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalSubjectId) return;

    const exists = availableSubjects.some((s) => s.subjectId.toLowerCase() === modalSubjectId.toLowerCase());
    if (exists) {
      alert(`GCP Alert: Subject ID ${modalSubjectId} is already registered under study ${modalStudyId}.`);
      return;
    }

    const newSub: StudySubjectOption = {
      subjectId: modalSubjectId,
      studyId: modalStudyId,
      ageSex: "35/F",
      site: modalSiteId,
      status: "IN REVIEW",
    };

    setSubjectsRegistry((prev) => ({
      ...prev,
      [modalStudyId]: [newSub, ...(prev[modalStudyId] || [])],
    }));

    // Sync to eligos_registry_subjects as well so Subject List tab stays in sync
    if (typeof window !== "undefined") {
      try {
        const rawList = localStorage.getItem("eligos_registry_subjects");
        const list = rawList ? JSON.parse(rawList) : [];
        const regObj = {
          id: `sub-reg-${Date.now().toString().slice(-3)}`,
          subjectId: modalSubjectId,
          studyId: modalStudyId.split(" ")[0],
          studyTitle: modalStudyId,
          indication: "Active Clinical Protocol",
          ageSex: "35/F",
          diagnosis: "Screening Evaluation",
          status: "IN REVIEW",
          site: modalSiteId,
          lastVisit: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        };
        if (!list.some((item: any) => item.subjectId === modalSubjectId && item.studyId === modalStudyId.split(" ")[0])) {
          localStorage.setItem("eligos_registry_subjects", JSON.stringify([regObj, ...list]));
        }
        window.dispatchEvent(new Event("eligos_subject_updated"));
        window.dispatchEvent(new Event("storage"));
      } catch (err) {
        console.error("Failed to sync to eligos_registry_subjects", err);
      }
    }

    const result = calculateEligibility(evalCriteria);

    const newRev: EligibilityReview = {
      id: `REV-${Date.now().toString().slice(-4)}`,
      studyId: modalStudyId,
      subjectId: modalSubjectId,
      siteId: modalSiteId,
      submittedByUid: currentUser?.uid || "user",
      submittedByEmail: currentUser?.email || "pi.vance@apex-trials.org",
      submittedByName: `${currentUser?.first} ${currentUser?.last}`,
      submittedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      status: result.isEligible ? "In Review" : "Rejected",
      piApproval: {
        approved: result.isEligible,
        by: `${currentUser?.first} ${currentUser?.last} (PI)`,
        at: new Date().toISOString().slice(0, 16).replace("T", " "),
        comments: result.isEligible ? "PI verified all I/E criteria." : "PI noted ineligible criteria.",
      },
      criteria: evalCriteria,
      overallComments: medicalNotes || (result.isEligible ? "Subject meets all primary inclusion/exclusion criteria." : "Subject failed eligibility check."),
    };

    setReviews([newRev, ...reviews]);
    setSelectedReview(newRev);
    setActiveStudyId(modalStudyId);
    setActiveSubjectId(modalSubjectId);
    setShowEvalModal(false);

    setModalSubjectId("");
    setMedicalNotes("");
  };

  const handlePrintSummary = () => {
    window.print();
  };

  // CRO/Sponsor Medical Monitor Handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeSubjectId) {
      alert("Mandatory Context Action: Please select a Subject from the header dropdown before uploading source documents.");
      return;
    }
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((f) => ({
        name: f.name,
        size: `${(f.size / (1024 * 1024)).toFixed(2)} MB`,
      }));
      setStagedFiles([...stagedFiles, ...newFiles]);
    }
  };

  const handleRunEligibilityReview = () => {
    if (!activeSubjectId) {
      alert("Mandatory Subject Context: No eligibility review can be performed without selecting a Subject. Please select a Subject in Study above.");
      return;
    }
    if (stagedFiles.length === 0) {
      alert("Please upload or stage at least one patient source document (PDF, DOCX, image, TXT) to run Medical Monitor eligibility review.");
      return;
    }

    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      const userName = `${currentUser?.first} ${currentUser?.last} (${currentUser?.role})`;

      setCompiledWriteup({
        subjectId: activeSubjectId,
        studyId: activeStudyId,
        indication: activeStudyId.includes("MHT")
          ? "Voss-Kellerman Congenital Myopathy (VKCM)"
          : activeStudyId.includes("SLT")
          ? "Bipolar I Disorder (ICD-10 F31.9)"
          : "Bipolar Depression",
        compiledAt: new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }),
        compiledBy: userName,
        overallStatus: "APPROVED",
        parameters: [
          { name: "MADRS Total Score", patientValue: "26.0 (Screening)", targetRequirement: "≥ 20.0 Baseline", status: "PASSED" },
          { name: "Thyroid Stimulating Hormone (TSH)", patientValue: "1.15 x ULN", targetRequirement: "0.85 – 1.5x ULN", status: "PASSED" },
          { name: "Hepatic ALT / AST Ratio", patientValue: "1.42 x ULN", targetRequirement: "< 3.0x ULN", status: "PASSED" },
          { name: "QTcF Interval (Electrocardiogram)", patientValue: "418 ms", targetRequirement: "< 450ms (M) / 470ms (F)", status: "PASSED" },
          { name: "C-SSRS Suicidal Ideation Grade", patientValue: "Grade 0 (Absent)", targetRequirement: "Grade < 4", status: "PASSED" },
        ],
        narrative: `Automated Medical Monitor Compliance Audit: Patient file logs for Subject ${activeSubjectId} parsed cleanly. All key clinical trial metrics (MADRS, TSH, ALT/AST, QTcF) conform to protocol thresholds with zero exclusion flags. Source lab records validated against 21 CFR Part 11 requirements. Recommended for final trial approval.`,
      });
    }, 1200);
  };

  const activeIndication = activeStudyId.includes("MHT")
    ? "Voss-Kellerman Congenital Myopathy (VKCM)"
    : activeStudyId.includes("SLT")
    ? "Bipolar I Disorder (ICD-10 F31.9)"
    : "Bipolar Depression";

  return (
    <div className="space-y-6 font-sans text-slate-800">
      {/* 1. TOP HEADER & SEARCH BAR BLOCK (MOVED TO TOP PER USER DIRECTIVE) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            Eligibility Review Board
          </h2>
          <p className="text-xs text-slate-500 font-bold mt-0.5">
            Clinical Trial Eligibility System (CTES) • Indication: <span className="text-blue-700 font-extrabold">{activeIndication}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={boardSearch}
              onChange={(e) => setBoardSearch(e.target.value)}
              placeholder="Search ID, site, PI..."
              className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 w-64 focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
          </div>

          {/* Mode Switcher for CRO / Sponsor / Admin */}
          {canAccessMedicalBoard ? (
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode("medical_board")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-black text-xs transition ${
                  viewMode === "medical_board"
                    ? "bg-[#1D64EC] text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Brain className="w-3.5 h-3.5" /> Medical Monitor Board
              </button>

              <button
                onClick={() => setViewMode("checklist")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-black text-xs transition ${
                  viewMode === "checklist"
                    ? "bg-[#1D64EC] text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <ClipboardCheck className="w-3.5 h-3.5" /> PI Checklist
              </button>
            </div>
          ) : (
            <div className="text-xs font-extrabold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
              PI Assessment Mode
            </div>
          )}

          {/* Subject Loading Action: RESTRICTED TO PI & ADMIN ONLY */}
          {canLoadSubject ? (
            <button
              onClick={() => {
                setModalStudyId(activeStudyId);
                setShowEvalModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#1D64EC] hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-2xs transition"
            >
              <UserPlus className="w-4 h-4" /> + Load / Register Subject
            </button>
          ) : (
            <div className="text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" /> Subject Loading: Restricted to PI & Admin
            </div>
          )}
        </div>
      </div>

      {/* 2. STAT SUMMARY CARDS BAR */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div 
          onClick={() => setSelectedBoardFilter("ALL")}
          className={`bg-white p-4 rounded-2xl border cursor-pointer transition shadow-2xs ${
            selectedBoardFilter === "ALL" ? "border-amber-400 ring-2 ring-amber-400/30" : "border-slate-200/80 hover:border-slate-300"
          }`}
        >
          <div className="text-[11px] font-black text-slate-500 uppercase tracking-wider">ALL REGISTERED</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{availableSubjects.length} <span className="text-xs font-normal text-slate-400">subjects</span></div>
        </div>

        <div 
          onClick={() => setSelectedBoardFilter("SCREENING")}
          className={`bg-white p-4 rounded-2xl border cursor-pointer transition shadow-2xs ${
            selectedBoardFilter === "SCREENING" ? "border-blue-500 ring-2 ring-blue-500/30" : "border-slate-200/80 hover:border-slate-300"
          }`}
        >
          <div className="text-[11px] font-black text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span> SCREENING
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">{screeningCount} <span className="text-xs font-normal text-slate-400">subjects</span></div>
        </div>

        <div 
          onClick={() => setSelectedBoardFilter("PENDING")}
          className={`bg-white p-4 rounded-2xl border cursor-pointer transition shadow-2xs ${
            selectedBoardFilter === "PENDING" ? "border-amber-500 ring-2 ring-amber-500/30" : "border-slate-200/80 hover:border-slate-300"
          }`}
        >
          <div className="text-[11px] font-black text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span> PENDING REVIEW
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">{pendingCount} <span className="text-xs font-normal text-slate-400">subjects</span></div>
        </div>

        <div 
          onClick={() => setSelectedBoardFilter("APPROVED")}
          className={`bg-white p-4 rounded-2xl border cursor-pointer transition shadow-2xs ${
            selectedBoardFilter === "APPROVED" ? "border-emerald-500 ring-2 ring-emerald-500/30" : "border-slate-200/80 hover:border-slate-300"
          }`}
        >
          <div className="text-[11px] font-black text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span> APPROVED
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">{approvedCount} <span className="text-xs font-normal text-slate-400">subjects</span></div>
        </div>

        <div 
          onClick={() => setSelectedBoardFilter("SCREEN_FAIL")}
          className={`bg-white p-4 rounded-2xl border cursor-pointer transition shadow-2xs ${
            selectedBoardFilter === "SCREEN_FAIL" ? "border-rose-500 ring-2 ring-rose-500/30" : "border-slate-200/80 hover:border-slate-300"
          }`}
        >
          <div className="text-[11px] font-black text-rose-600 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span> SCREEN FAIL
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">{screenFailCount} <span className="text-xs font-normal text-slate-400">subjects</span></div>
        </div>
      </div>

      {/* 3. CASCADED STUDY PROTOCOL & SUBJECT SELECTOR CARD */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        {/* Cascaded Selection Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Step 1: Select Study Protocol */}
          <div>
            <label className="block text-xs font-black text-slate-800 mb-1.5 uppercase tracking-wider flex items-center justify-between">
              <span>1. SELECT STUDY PROTOCOL *</span>
              <span className="text-[10px] text-blue-700 font-bold">{activeIndication}</span>
            </label>
            <select
              value={activeStudyId}
              onChange={(e) => handleStudyChange(e.target.value)}
              className="w-full px-4 py-2.5 bg-blue-50/70 border border-blue-300 rounded-xl text-xs font-extrabold text-slate-900 focus:ring-2 focus:ring-blue-500 cursor-pointer max-w-full"
            >
              <option value="MHT-2101-C01">MHT-2101-C01 — MYOGUARD-1 Phase III</option>
              <option value="SLT-206-C118">SLT-206-C118 — Cerevastatin Phase III</option>
              <option value="ZP-010-BS01">ZP-010-BS01 — ZEPHYR Phase III</option>
            </select>
          </div>

          {/* Step 2: Select Subject in Study (DEPENDENT) */}
          <div>
            <label className="block text-xs font-black text-slate-800 mb-1.5 uppercase tracking-wider flex items-center justify-between">
              <span>2. SELECT SUBJECT IN STUDY *</span>
              <span className="text-[10px] text-slate-500 font-medium">({availableSubjects.length} registered subjects)</span>
            </label>
            <select
              value={activeSubjectId}
              onChange={(e) => {
                setActiveSubjectId(e.target.value);
                setCompiledWriteup(null);
              }}
              className={`w-full px-4 py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer max-w-full ${
                !activeSubjectId
                  ? "bg-amber-50 border border-amber-300 text-amber-900 focus:ring-2 focus:ring-amber-500"
                  : "bg-emerald-50/80 border border-emerald-300 text-emerald-900 focus:ring-2 focus:ring-emerald-500"
              }`}
            >
              <option value="">-- Select Subject in Study (Required) --</option>
              {availableSubjects.map((sub) => (
                <option key={sub.subjectId} value={sub.subjectId}>
                  Subject {sub.subjectId} ({sub.ageSex} • {sub.site} • {sub.status})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mandatory Subject Selection Context Alert Banner */}
        {!activeSubjectId ? (
          <div className="bg-amber-50 border border-amber-300/80 rounded-xl p-3.5 text-xs text-amber-900 font-medium flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                <strong>Mandatory Context Directive:</strong> No eligibility evaluation can be performed without selecting a Subject. Please select a Subject from the dropdown above.
              </span>
            </div>
            <span className="text-[10px] font-black uppercase bg-amber-200/80 text-amber-900 px-2.5 py-1 rounded-md flex-shrink-0">
              Awaiting Subject Selection
            </span>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-300/80 rounded-xl p-3.5 text-xs text-emerald-900 font-medium flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>
                Active Subject Context Loaded: <strong className="font-extrabold text-emerald-950">Subject {selectedSubjectMeta?.subjectId}</strong> ({selectedSubjectMeta?.ageSex} • {selectedSubjectMeta?.site} • {selectedSubjectMeta?.status})
              </span>
            </div>
            <span className="text-[10px] font-black uppercase bg-emerald-200/80 text-emerald-900 px-2.5 py-1 rounded-md flex-shrink-0">
              Context Ready
            </span>
          </div>
        )}
      </div>

      {/* VIEW MODE 1: CRO & SPONSOR MEDICAL MONITOR ELIGIBILITY REVIEW BOARD */}
      {viewMode === "medical_board" && canAccessMedicalBoard && (
        <div className="space-y-6">
          {/* Perform Eligibility Review (Medical Monitor) Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            {/* Card Header */}
            <div className="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  Perform Eligibility Review (Medical Monitor)
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Upload source logs (PDF, DOCX, image, TXT) to parse clinical parameters against study criteria.
                </p>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-xs font-extrabold shadow-2xs">
                <Lock className="w-3.5 h-3.5 text-amber-600" /> Safe & Secure Client Processing
              </span>
            </div>

            {/* Main Content Grid: Left Controls (1/3) vs Right Writeup Report (2/3) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
              {/* Left Column Controls */}
              <div className="p-6 space-y-5 bg-slate-50/30">
                {/* Drag & Drop Upload Zone */}
                <div>
                  <label className="block text-xs font-black text-slate-800 mb-2">Stage Source Documents</label>
                  <label className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition block space-y-2 ${
                    !activeSubjectId
                      ? "bg-slate-100 border-slate-300 opacity-60 cursor-not-allowed"
                      : "border-slate-300 hover:border-blue-500 bg-white hover:bg-blue-50/30"
                  }`}>
                    <input 
                      type="file" 
                      multiple 
                      disabled={!activeSubjectId}
                      accept=".pdf,.docx,.txt,.png,.jpg" 
                      onChange={handleFileUpload} 
                      className="hidden" 
                    />
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-extrabold text-slate-800">
                      Drag & drop files or <span className="text-blue-600 underline">browse</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">PDF, Word doc, txt, images up to 100MB</p>
                  </label>
                </div>

                {/* Staged File List */}
                {stagedFiles.length > 0 && (
                  <div className="space-y-1.5 bg-white p-3 rounded-xl border border-slate-200 text-xs">
                    <div className="font-extrabold text-slate-700 text-[11px] uppercase tracking-wider">Staged Documents ({stagedFiles.length})</div>
                    {stagedFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0">
                        <span className="font-bold text-slate-800 truncate max-w-[150px]">{file.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{file.size}</span>
                        <button
                          onClick={() => setStagedFiles(stagedFiles.filter((_, i) => i !== idx))}
                          className="p-1 text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Run Eligibility Review Action Button (GATED BY SUBJECT CONTEXT) */}
                <button
                  onClick={handleRunEligibilityReview}
                  disabled={isAnalyzing || !activeSubjectId}
                  className={`w-full py-3 font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 ${
                    !activeSubjectId
                      ? "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
                      : "bg-[#1D64EC] hover:bg-blue-700 text-white"
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin" /> Analyzing Clinical Parameters...
                    </>
                  ) : !activeSubjectId ? (
                    <>
                      🚫 Select a Subject First
                    </>
                  ) : (
                    <>
                      🧠 Run Eligibility review
                    </>
                  )}
                </button>

                {/* Study Protocol Criteria Context Box */}
                <div className="bg-slate-100/90 rounded-2xl p-4 border border-slate-200 text-xs space-y-2">
                  <div className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
                    STUDY PROTOCOL CRITERIA CONTEXT
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span>Study: <strong className="text-blue-700 font-extrabold">{activeStudyId}</strong></span>
                    <span>Indication: <strong className="text-slate-800 font-extrabold">{activeIndication}</strong></span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600 font-medium leading-relaxed">
                    <strong className="text-slate-800 font-extrabold block mb-0.5">Key parameters:</strong>
                    {activeStudyId.includes("MHT") ? (
                      <span>CLIA Genetic Confirmation • AST/ALT &lt; 3.0x ULN • Vector Naive • Age 18-65</span>
                    ) : activeStudyId.includes("SLT") ? (
                      <span>MADRS ≥ 24 • TSH 0.85-1.5x ULN • ALT/AST &lt; 3.0x ULN • C-SSRS &lt; Grade 4</span>
                    ) : (
                      <span>MADRS ≥ 20 • TSH 0.85-1.5x ULN • ALT/AST &lt; 3.0x ULN • QTcF &lt; 450ms (M)/470ms (F)</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Medical Monitor Writeup Report */}
              <div className="lg:col-span-2 p-6 flex flex-col justify-between min-h-[460px]">
                <div>
                  <div className="text-xs font-black text-slate-800 uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center justify-between">
                    <span>MEDICAL MONITOR WRITEUP REPORT</span>
                    {compiledWriteup && (
                      <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-300">
                        {compiledWriteup.overallStatus}
                      </span>
                    )}
                  </div>

                  {!activeSubjectId ? (
                    /* Mandatory Subject Gating Empty State */
                    <div className="py-20 text-center space-y-3">
                      <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                        <AlertTriangle className="w-7 h-7" />
                      </div>
                      <h4 className="font-extrabold text-slate-800 text-sm">No Subject Selected</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium leading-relaxed">
                        Please select a study protocol and a subject from the header dropdowns above to initiate eligibility assessment.
                      </p>
                    </div>
                  ) : !compiledWriteup ? (
                    /* Default Empty State when subject selected but not compiled */
                    <div className="py-20 text-center space-y-3">
                      <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                        <FileText className="w-7 h-7" />
                      </div>
                      <h4 className="font-extrabold text-slate-800 text-sm">No Eligibility Review Compiled</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium leading-relaxed">
                        Stage patient file logs for Subject <strong>{activeSubjectId}</strong> on the left and select "Run Eligibility review" to compile audit report.
                      </p>
                    </div>
                  ) : (
                    /* Compiled Writeup View */
                    <div className="py-4 space-y-5">
                      <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div>
                          <div className="font-black text-emerald-900 text-sm">
                            Medical Monitor Eligibility Assessment: PASSED
                          </div>
                          <p className="text-emerald-700 font-medium mt-0.5">
                            Subject ID: <strong className="font-extrabold">{compiledWriteup.subjectId}</strong> • Compiled by {compiledWriteup.compiledBy} on {compiledWriteup.compiledAt}
                          </p>
                        </div>
                        <button
                          onClick={handlePrintSummary}
                          className="px-3.5 py-1.5 bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-900 font-bold rounded-xl shadow-2xs transition flex items-center gap-1.5"
                        >
                          <Printer className="w-3.5 h-3.5 text-emerald-700" /> Export Writeup PDF
                        </button>
                      </div>

                      <div className="space-y-2">
                        <div className="text-xs font-black text-slate-700 uppercase tracking-wider">
                          Extracted Clinical Parameter Audit
                        </div>
                        <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                          <table className="w-full text-left">
                            <thead className="bg-slate-50 text-slate-500 font-black uppercase text-[10px] tracking-wider border-b border-slate-200">
                              <tr>
                                <th className="px-4 py-2.5">CLINICAL PARAMETER</th>
                                <th className="px-4 py-2.5">PATIENT VALUE</th>
                                <th className="px-4 py-2.5">PROTOCOL REQUIREMENT</th>
                                <th className="px-4 py-2.5 text-center">COMPLIANCE</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium">
                              {compiledWriteup.parameters.map((p, i) => (
                                <tr key={i} className="hover:bg-slate-50">
                                  <td className="px-4 py-2.5 font-bold text-slate-900">{p.name}</td>
                                  <td className="px-4 py-2.5 font-semibold text-slate-800">{p.patientValue}</td>
                                  <td className="px-4 py-2.5 text-slate-600">{p.targetRequirement}</td>
                                  <td className="px-4 py-2.5 text-center font-extrabold">
                                    <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-[10px] border border-emerald-300">
                                      ✓ {p.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1 text-xs">
                        <div className="font-black text-slate-900 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-purple-600" /> Automated Compliance Narrative Writeup
                        </div>
                        <p className="text-slate-700 font-medium leading-relaxed">
                          {compiledWriteup.narrative}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => alert(`Screen fail status recorded for Subject ${compiledWriteup.subjectId}.`)}
                          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-2xs transition"
                        >
                          Issue Screen Fail
                        </button>
                        <button
                          onClick={() => alert(`Subject ${compiledWriteup.subjectId} successfully approved by Medical Monitor.`)}
                          className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-2xs transition"
                        >
                          Approve Subject Eligibility
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Bar */}
                <div className="pt-4 border-t border-slate-100 text-[11px] font-bold text-slate-500 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-400" /> Protocol {activeStudyId} • 21 CFR Part 11 eSign-captured
                  </span>
                  <span>System Audit Log ID: CTES-2026-9912</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: PI SUBJECT INCLUSION/EXCLUSION CHECKLIST & TRI-PARTY MATRIX */}
      {(viewMode === "checklist" || !canAccessMedicalBoard) && (
        <div className="space-y-6">
          {/* Top Banner & Action */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-[#1D64EC]" />
                Eligibility Reviews & Multi-Stage Approvals
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Tri-party Sign-off Engine: PI Criteria Evaluation ➔ CRO Verification ➔ Sponsor Final Sign-off
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePrintSummary}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-2xs transition"
              >
                <Printer className="w-4 h-4 text-slate-600" /> Print / Export Summary
              </button>

              {canPIApprove && (
                <button
                  onClick={() => {
                    handleStudyChange(activeStudyId);
                    setShowEvalModal(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1D64EC] hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition"
                >
                  <Plus className="w-4 h-4" /> Evaluate & Submit Subject Review
                </button>
              )}
            </div>
          </div>

          {/* Main Grid: Left Review Queue + Right Review Detail */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Review Queue (1/3 width) */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 space-y-3">
              <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-100">
                <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
                  SUBJECT REVIEW QUEUE ({studyReviews.length})
                </span>
                <span className="text-[10px] font-bold bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                  {activeStudyId}
                </span>
              </div>

              <div className="space-y-2">
                {studyReviews.length > 0 ? (
                  studyReviews.map((rev) => {
                    const isSelected = selectedReview?.id === rev.id;
                    const evalRes = calculateEligibility(rev.criteria);

                    return (
                      <div
                        key={rev.id}
                        onClick={() => setSelectedReview(rev)}
                        className={`p-3.5 rounded-xl border transition cursor-pointer space-y-1.5 ${
                          isSelected
                            ? "border-blue-500 bg-blue-50/70 shadow-2xs"
                            : "border-slate-200/80 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-extrabold text-slate-900 text-sm">Subject {rev.subjectId}</span>
                          <span
                            className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                              rev.status === "Approved"
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                : rev.status === "Rejected"
                                ? "bg-rose-100 text-rose-800 border border-rose-300"
                                : "bg-amber-100 text-amber-800 border border-amber-300"
                            }`}
                          >
                            {rev.status}
                          </span>
                        </div>

                        <div className="text-xs text-slate-600 font-medium">{rev.siteId}</div>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                          <span>Protocol: {rev.studyId}</span>
                          <span>{rev.submittedAt.slice(0, 10)}</span>
                        </div>

                        <div className="pt-1">
                          {evalRes.isEligible ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> ELIGIBLE
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                              <XCircle className="w-3 h-3 text-rose-600" /> NOT ELIGIBLE ({evalRes.failedCount} Failed)
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-slate-400 text-xs font-medium space-y-1">
                    <div>No pending eligibility reviews for protocol {activeStudyId}.</div>
                    <div className="text-[10px]">Click "+ Load / Register Subject" to register and evaluate a subject.</div>
                  </div>
                )}
              </div>
            </div>

            {/* Right 2 Columns: Selected Review Detail & Approvals (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
              {selectedReview ? (
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-6">
                  {/* Header Info */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-2xl font-black text-slate-900">
                          Subject ID: {selectedReview.subjectId}
                        </h3>
                        <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-bold border border-slate-200">
                          {selectedReview.id}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        Submitted by <strong className="text-slate-800">{selectedReview.submittedByName}</strong> ({selectedReview.submittedByEmail}) on {selectedReview.submittedAt}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Overall Review Status</div>
                      <div className="text-base font-black text-blue-700 uppercase tracking-wide">
                        {selectedReview.status}
                      </div>
                    </div>
                  </div>

                  {/* Multi-Stage Sign-off Pipeline Visualizer */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                    <div className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center justify-between">
                      <span>TRI-PARTY SIGN-OFF MATRIX</span>
                      <span className="text-[10px] text-slate-500 font-normal">Protocol-bound FDA Audit Lock</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Step 1: PI */}
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs space-y-2">
                        <div className="flex items-center justify-between font-extrabold text-slate-900">
                          <span className="flex items-center gap-1.5">
                            <Stethoscope className="w-4 h-4 text-blue-600" /> 1. PI Sign-off
                          </span>
                          {selectedReview.piApproval?.approved ? (
                            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                          ) : (
                            <Clock className="w-4.5 h-4.5 text-amber-500" />
                          )}
                        </div>
                        {selectedReview.piApproval?.approved ? (
                          <div className="text-[11px] text-slate-600 font-medium space-y-0.5">
                            <div className="font-bold text-emerald-700">Verified & Approved</div>
                            <div>By: {selectedReview.piApproval.by}</div>
                            <div className="text-slate-400 text-[10px]">{selectedReview.piApproval.at}</div>
                          </div>
                        ) : canPIApprove ? (
                          <button
                            onClick={() => handleApproveStage(selectedReview.id, "pi")}
                            className="w-full mt-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-lg text-xs transition shadow-2xs"
                          >
                            Sign-off as PI
                          </button>
                        ) : (
                          <div className="text-[11px] text-slate-400 italic">Pending PI Signature</div>
                        )}
                      </div>

                      {/* Step 2: CRO */}
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs space-y-2">
                        <div className="flex items-center justify-between font-extrabold text-slate-900">
                          <span className="flex items-center gap-1.5">
                            <UserCheck className="w-4 h-4 text-emerald-600" /> 2. CRO Monitor
                          </span>
                          {selectedReview.croApproval?.approved ? (
                            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                          ) : (
                            <Clock className="w-4.5 h-4.5 text-amber-500" />
                          )}
                        </div>
                        {selectedReview.croApproval?.approved ? (
                          <div className="text-[11px] text-slate-600 font-medium space-y-0.5">
                            <div className="font-bold text-emerald-700">Verified & Approved</div>
                            <div>By: {selectedReview.croApproval.by}</div>
                            <div className="text-slate-400 text-[10px]">{selectedReview.croApproval.at}</div>
                          </div>
                        ) : canCROApprove ? (
                          <button
                            onClick={() => handleApproveStage(selectedReview.id, "cro")}
                            className="w-full mt-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg text-xs transition shadow-2xs"
                          >
                            Verify as CRO
                          </button>
                        ) : (
                          <div className="text-[11px] text-slate-400 italic">Pending CRO Verification</div>
                        )}
                      </div>

                      {/* Step 3: Sponsor */}
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs space-y-2">
                        <div className="flex items-center justify-between font-extrabold text-slate-900">
                          <span className="flex items-center gap-1.5">
                            <Building2 className="w-4 h-4 text-amber-600" /> 3. Sponsor Sign-off
                          </span>
                          {selectedReview.sponsorApproval?.approved ? (
                            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                          ) : (
                            <Clock className="w-4.5 h-4.5 text-amber-500" />
                          )}
                        </div>
                        {selectedReview.sponsorApproval?.approved ? (
                          <div className="text-[11px] text-slate-600 font-medium space-y-0.5">
                            <div className="font-bold text-emerald-700">Final Sign-off Granted</div>
                            <div>By: {selectedReview.sponsorApproval.by}</div>
                            <div className="text-slate-400 text-[10px]">{selectedReview.sponsorApproval.at}</div>
                          </div>
                        ) : canSponsorApprove ? (
                          <button
                            onClick={() => handleApproveStage(selectedReview.id, "sponsor")}
                            className="w-full mt-1 py-2 bg-amber-600 hover:bg-amber-700 text-white font-extrabold rounded-lg text-xs transition shadow-2xs"
                          >
                            Approve as Sponsor
                          </button>
                        ) : (
                          <div className="text-[11px] text-slate-400 italic">Pending Sponsor Approval</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Protocol Criteria Evaluation Table */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                      PROTOCOL INCLUSION / EXCLUSION VERIFICATION
                    </h4>
                    <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 font-black uppercase text-[10px] tracking-wider border-b border-slate-200">
                          <tr>
                            <th className="px-4 py-3">CODE</th>
                            <th className="px-4 py-3">CATEGORY</th>
                            <th className="px-4 py-3">PROTOCOL REQUIREMENT</th>
                            <th className="px-4 py-3 text-center">EVALUATION STATUS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {selectedReview.criteria.map((c) => (
                            <tr key={c.id} className="hover:bg-slate-50">
                              <td className="px-4 py-3 font-extrabold text-slate-900">{c.code}</td>
                              <td className="px-4 py-3 font-bold">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                                    c.type === "Inclusion"
                                      ? "bg-blue-100 text-blue-800 border border-blue-200"
                                      : "bg-rose-100 text-rose-800 border border-rose-200"
                                  }`}
                                >
                                  {c.type}
                                </span>
                              </td>
                              <td className="px-4 py-3 font-medium text-slate-800">{c.description}</td>
                              <td className="px-4 py-3 text-center font-extrabold">
                                {c.type === "Inclusion" ? (
                                  c.met ? (
                                    <span className="text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-300">
                                      ✓ MET
                                    </span>
                                  ) : (
                                    <span className="text-rose-800 bg-rose-100/80 px-2.5 py-0.5 rounded-full border border-rose-300">
                                      ✗ NOT MET
                                    </span>
                                  )
                                ) : !c.met ? (
                                  <span className="text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-300">
                                    ✓ ABSENT (CLEAR)
                                  </span>
                                ) : (
                                  <span className="text-rose-800 bg-rose-100/80 px-2.5 py-0.5 rounded-full border border-rose-300">
                                    ⚠ VIOLATION PRESENT
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {selectedReview.overallComments && (
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-1">
                      <div className="font-extrabold text-slate-900">Medical Reviewer Notes</div>
                      <p className="text-slate-700 font-medium">{selectedReview.overallComments}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 font-medium">
                  Select a subject review from the left queue to evaluate approvals.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE PI / ADMIN INCLUSION & EXCLUSION EVALUATION & SUBJECT REGISTRATION MODAL */}
      {showEvalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-6 overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-900 px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5 font-extrabold text-base">
                <FileCheck className="w-5 h-5 text-blue-300" />
                <span>Register & Evaluate Subject Inclusion & Exclusion Criteria</span>
              </div>
              <button
                onClick={() => setShowEvalModal(false)}
                className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Instruction Notice Banner */}
            <div className="bg-amber-50 border-b border-amber-200/80 px-6 py-3 text-xs text-amber-900 font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                <strong>PI / Admin Directive:</strong> Registering a subject initializes their eligibility assessment. Select "YES" for Met Inclusions and "NO" for Absent Exclusions.
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateReviewSubmit} className="p-6 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-extrabold text-slate-800 mb-1">Select Study Protocol *</label>
                  <select
                    value={modalStudyId}
                    onChange={(e) => {
                      setModalStudyId(e.target.value);
                      const base = PROTOCOL_CRITERIA_DATABASE[e.target.value] || PROTOCOL_CRITERIA_DATABASE["MHT-2101-C01"];
                      setEvalCriteria(base.map((c) => ({ ...c })));
                    }}
                    className="w-full px-3 py-2 bg-blue-50/80 border border-blue-300 rounded-xl text-xs font-extrabold text-slate-900 max-w-full"
                  >
                    <option value="MHT-2101-C01">MHT-2101-C01 (MYOGUARD-1 Phase III)</option>
                    <option value="SLT-206-C118">SLT-206-C118 (Cerevastatin Phase III)</option>
                    <option value="ZP-010-BS01">ZP-010-BS01 (ZEPHYR Phase III)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-extrabold text-slate-800 mb-1">Subject Screening ID *</label>
                  <input
                    type="text"
                    required
                    value={modalSubjectId}
                    onChange={(e) => setModalSubjectId(e.target.value)}
                    placeholder="e.g. 101-008"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 max-w-full"
                  />
                </div>

                <div>
                  <label className="block font-extrabold text-slate-800 mb-1">Clinical Trial Site</label>
                  <input
                    type="text"
                    value={modalSiteId}
                    onChange={(e) => setModalSiteId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 max-w-full"
                  />
                </div>
              </div>

              {/* Interactive I/E Checklist Items */}
              <div className="space-y-3">
                <div className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center justify-between">
                  <span>CRITERIA EVALUATION CHECKLIST ({evalCriteria.length} Criteria)</span>
                  <span className="text-[10px] text-slate-500 font-normal">Interactive PI Assessment</span>
                </div>

                <div className="space-y-2.5">
                  {evalCriteria.map((c, idx) => (
                    <div key={c.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-100/80 transition">
                      <div className="flex items-start gap-2.5 flex-1">
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-black text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <strong className="text-slate-900 font-extrabold">{c.code}</strong>
                            <span className={`px-2 py-0.2 rounded text-[9px] font-black ${c.type === "Inclusion" ? "bg-blue-100 text-blue-800" : "bg-rose-100 text-rose-800"}`}>
                              {c.type}
                            </span>
                          </div>
                          <p className="text-slate-700 font-medium text-xs leading-snug">{c.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {c.type === "Inclusion" ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleToggleCriterion(c.id, true)}
                              className={`px-3.5 py-1.5 rounded-full font-bold text-xs transition ${c.met ? "bg-emerald-600 text-white shadow-2xs font-extrabold" : "bg-slate-200 text-slate-600 hover:bg-slate-300"}`}
                            >
                              Yes (Met)
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleCriterion(c.id, false)}
                              className={`px-3.5 py-1.5 rounded-full font-bold text-xs transition ${!c.met ? "bg-rose-600 text-white shadow-2xs font-extrabold" : "bg-slate-200 text-slate-600 hover:bg-slate-300"}`}
                            >
                              No (Not Met)
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleToggleCriterion(c.id, false)}
                              className={`px-3.5 py-1.5 rounded-full font-bold text-xs transition ${!c.met ? "bg-emerald-600 text-white shadow-2xs font-extrabold" : "bg-slate-200 text-slate-600 hover:bg-slate-300"}`}
                            >
                              No (Absent / Clear)
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleCriterion(c.id, true)}
                              className={`px-3.5 py-1.5 rounded-full font-bold text-xs transition ${c.met ? "bg-rose-600 text-white shadow-2xs font-extrabold" : "bg-slate-200 text-slate-600 hover:bg-slate-300"}`}
                            >
                              Yes (Violation Present)
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* LIVE ELIGIBILITY CALCULATION ENGINE RESULTS BANNER */}
              <div className="pt-2">
                {currentEvalResult.isEligible ? (
                  <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 text-emerald-900 space-y-1 shadow-2xs">
                    <div className="flex items-center gap-2 font-black text-sm text-emerald-800">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Preliminary Assessment Result: ELIGIBLE</span>
                    </div>
                    <p className="text-xs text-emerald-700 font-medium">
                      Subject meets all protocol inclusion criteria and has zero exclusion violations. Ready for PI signature and submission to CRO verification.
                    </p>
                  </div>
                ) : (
                  <div className="bg-rose-50 border border-rose-300 rounded-xl p-4 text-rose-900 space-y-2 shadow-2xs">
                    <div className="flex items-center gap-2 font-black text-sm text-rose-800">
                      <XCircle className="w-5 h-5 text-rose-600" />
                      <span>Preliminary Assessment Result: NOT ELIGIBLE ({currentEvalResult.failedCount} Failed Criteria)</span>
                    </div>
                    <div className="text-xs font-semibold text-rose-700">Failed Criteria Details:</div>
                    <ul className="list-disc list-inside text-xs text-rose-800 space-y-0.5 font-medium">
                      {currentEvalResult.failedInclusions.map((c) => (
                        <li key={c.id}>Inclusion Failure: <strong>{c.code}</strong> — {c.description}</li>
                      ))}
                      {currentEvalResult.failedExclusions.map((c) => (
                        <li key={c.id}>Exclusion Violation: <strong>{c.code}</strong> — {c.description}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* PI Medical Notes */}
              <div>
                <label className="block font-extrabold text-slate-800 mb-1">PI / Admin Medical Reviewer Notes</label>
                <textarea
                  rows={3}
                  value={medicalNotes}
                  onChange={(e) => setMedicalNotes(e.target.value)}
                  placeholder="Enter medical rationale, source document verification notes, or screening laboratory details..."
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 max-w-full"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEvalModal(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 font-black text-white bg-[#1D64EC] hover:bg-blue-700 rounded-xl shadow-md transition text-xs"
                >
                  Register Subject & Complete Evaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
