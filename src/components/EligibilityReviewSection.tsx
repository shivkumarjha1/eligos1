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
  Stethoscope 
} from "lucide-react";

const SAMPLE_REVIEWS: EligibilityReview[] = [
  {
    id: "REV-2026-001",
    studyId: "MHT-2101-C01",
    subjectId: "101-002",
    siteId: "Johns Hopkins Site 101",
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
    criteria: [
      { id: "inc1", code: "INC 01", description: "Age 18 to 65 years at time of screening consent", type: "Inclusion", met: true },
      { id: "inc2", code: "INC 02", description: "Confirmed genetic diagnosis of VKCM via CLIA laboratory", type: "Inclusion", met: true },
      { id: "exc1", code: "EXC 01", description: "AST or ALT > 3.0x Upper Limit of Normal (ULN)", type: "Exclusion", met: false },
      { id: "exc2", code: "EXC 02", description: "Prior exposure to gene therapy vector APO-lorparvovec", type: "Exclusion", met: false },
    ],
    overallComments: "Subject ready for final Sponsor eligibility sign-off.",
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
    criteria: [
      { id: "inc1", code: "INC 01", description: "Age 18 to 65 years at time of screening consent", type: "Inclusion", met: true },
      { id: "exc1", code: "EXC 01", description: "AST or ALT > 3.0x Upper Limit of Normal (ULN)", type: "Exclusion", met: false },
    ],
  },
];

export const EligibilityReviewSection: React.FC = () => {
  const { currentUser } = useAuth();
  const [reviews, setReviews] = useState<EligibilityReview[]>(SAMPLE_REVIEWS);
  const [selectedReview, setSelectedReview] = useState<EligibilityReview | null>(SAMPLE_REVIEWS[0]);
  const [showNewModal, setShowNewModal] = useState(false);

  // Form state for new review
  const [subjectId, setSubjectId] = useState("");
  const [siteId, setSiteId] = useState("Johns Hopkins Site 101");
  const [incAge, setIncAge] = useState(true);
  const [incGenetic, setIncGenetic] = useState(true);
  const [excAst, setExcAst] = useState(false);
  const [notes, setNotes] = useState("");

  const role = currentUser?.role || "PI";
  const canPIApprove = role === "PI" || role === "SuperAdmin" || role === "Admin";
  const canCROApprove = role === "CRO" || role === "SuperAdmin" || role === "Admin";
  const canSponsorApprove = role === "Sponsor" || role === "SuperAdmin" || role === "Admin";

  const handleApproveStage = (reviewId: string, stage: "pi" | "cro" | "sponsor") => {
    const timestamp = new Date().toLocaleString();
    const userName = `${currentUser?.first} ${currentUser?.last}`;

    setReviews((prev) =>
      prev.map((r) => {
        if (r.id !== reviewId) return r;
        const updated = { ...r };
        if (stage === "pi") {
          updated.piApproval = { approved: true, by: userName, at: timestamp };
        } else if (stage === "cro") {
          updated.croApproval = { approved: true, by: userName, at: timestamp };
        } else if (stage === "sponsor") {
          updated.sponsorApproval = { approved: true, by: userName, at: timestamp };
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
          updated.piApproval = { approved: true, by: userName, at: timestamp };
        } else if (stage === "cro") {
          updated.croApproval = { approved: true, by: userName, at: timestamp };
        } else if (stage === "sponsor") {
          updated.sponsorApproval = { approved: true, by: userName, at: timestamp };
          updated.status = "Approved";
        }
        return updated;
      });
    }
  };

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectId) return;

    // GCP Subject Uniqueness Check: ensure subject ID is unique to this study protocol
    const exists = reviews.some((r) => r.subjectId.toLowerCase() === subjectId.toLowerCase());
    if (exists) {
      alert("GCP Constraint Alert: Subject ID already registered under this study protocol. Subject IDs cannot be duplicated or migrated.");
      return;
    }

    const newRev: EligibilityReview = {
      id: `REV-${Date.now().toString().slice(-4)}`,
      studyId: "MHT-2101-C01",
      subjectId,
      siteId,
      submittedByUid: currentUser?.uid || "user",
      submittedByEmail: currentUser?.email || "user@site.org",
      submittedByName: `${currentUser?.first} ${currentUser?.last}`,
      submittedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      status: "In Review",
      piApproval: {
        approved: true,
        by: `${currentUser?.first} ${currentUser?.last} (PI)`,
        at: new Date().toISOString().slice(0, 16).replace("T", " "),
      },
      criteria: [
        { id: "inc1", code: "INC 01", description: "Age 18 to 65 years at time of screening consent", type: "Inclusion", met: incAge },
        { id: "inc2", code: "INC 02", description: "Confirmed genetic diagnosis of VKCM via CLIA laboratory", type: "Inclusion", met: incGenetic },
        { id: "exc1", code: "EXC 01", description: "AST or ALT > 3.0x Upper Limit of Normal (ULN)", type: "Exclusion", met: excAst },
      ],
      overallComments: notes,
    };

    setReviews([newRev, ...reviews]);
    setSelectedReview(newRev);
    setShowNewModal(false);
    setSubjectId("");
    setNotes("");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-blue-600" />
            Eligibility Reviews & Multi-Stage Approvals
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Tri-party Sign-off Engine: PI Submission ➔ CRO Verification ➔ Sponsor Final Sign-off
          </p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm transition"
        >
          <Plus className="w-4 h-4" /> Submit Subject Review
        </button>
      </div>

      {/* Main Grid: List + Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Review List */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-4 space-y-3">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider px-2">
            Subject Review Queue ({reviews.length})
          </div>

          <div className="space-y-2">
            {reviews.map((rev) => {
              const isSelected = selectedReview?.id === rev.id;
              return (
                <div
                  key={rev.id}
                  onClick={() => setSelectedReview(rev)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? "border-blue-500 bg-blue-50/60 shadow-xs"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-gray-900">Subject {rev.subjectId}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        rev.status === "Approved"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : "bg-amber-100 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {rev.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">{rev.siteId}</div>
                  <div className="text-[11px] text-gray-400 mt-2 flex items-center justify-between border-t border-gray-100 pt-2">
                    <span>Protocol: {rev.studyId}</span>
                    <span>{rev.submittedAt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Selected Review Detail & Approvals */}
        <div className="lg:col-span-2 space-y-6">
          {selectedReview ? (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 space-y-6">
              {/* Header Info */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      Subject ID: {selectedReview.subjectId}
                    </h3>
                    <span className="text-xs font-mono bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-200">
                      {selectedReview.id}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Submitted by {selectedReview.submittedByName} ({selectedReview.submittedByEmail}) on {selectedReview.submittedAt}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold text-gray-400">Overall Status</div>
                  <div className="text-sm font-black text-blue-700 uppercase tracking-wide">
                    {selectedReview.status}
                  </div>
                </div>
              </div>

              {/* Multi-Stage Sign-off Pipeline Visualizer */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Tri-Party Sign-off Matrix
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Step 1: PI */}
                  <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center justify-between font-bold text-gray-900">
                      <span className="flex items-center gap-1.5"><Stethoscope className="w-3.5 h-3.5 text-blue-600" /> 1. PI Sign-off</span>
                      {selectedReview.piApproval?.approved ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-amber-500" />
                      )}
                    </div>
                    {selectedReview.piApproval?.approved ? (
                      <div className="text-[11px] text-gray-600">
                        <div className="font-semibold text-emerald-700">Verified & Approved</div>
                        <div>By: {selectedReview.piApproval.by}</div>
                        <div className="text-gray-400">{selectedReview.piApproval.at}</div>
                      </div>
                    ) : canPIApprove ? (
                      <button
                        onClick={() => handleApproveStage(selectedReview.id, "pi")}
                        className="w-full mt-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-[11px] transition"
                      >
                        Sign-off as PI
                      </button>
                    ) : (
                      <div className="text-[11px] text-gray-400 italic">Pending PI Signature</div>
                    )}
                  </div>

                  {/* Step 2: CRO */}
                  <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center justify-between font-bold text-gray-900">
                      <span className="flex items-center gap-1.5"><UserCheck className="w-3.5 h-3.5 text-emerald-600" /> 2. CRO Monitor</span>
                      {selectedReview.croApproval?.approved ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-amber-500" />
                      )}
                    </div>
                    {selectedReview.croApproval?.approved ? (
                      <div className="text-[11px] text-gray-600">
                        <div className="font-semibold text-emerald-700">Verified & Approved</div>
                        <div>By: {selectedReview.croApproval.by}</div>
                        <div className="text-gray-400">{selectedReview.croApproval.at}</div>
                      </div>
                    ) : canCROApprove ? (
                      <button
                        onClick={() => handleApproveStage(selectedReview.id, "cro")}
                        className="w-full mt-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[11px] transition"
                      >
                        Verify as CRO
                      </button>
                    ) : (
                      <div className="text-[11px] text-gray-400 italic">Pending CRO Review</div>
                    )}
                  </div>

                  {/* Step 3: Sponsor */}
                  <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center justify-between font-bold text-gray-900">
                      <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-amber-600" /> 3. Sponsor Sign-off</span>
                      {selectedReview.sponsorApproval?.approved ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-amber-500" />
                      )}
                    </div>
                    {selectedReview.sponsorApproval?.approved ? (
                      <div className="text-[11px] text-gray-600">
                        <div className="font-semibold text-emerald-700">Final Enrollment Approved</div>
                        <div>By: {selectedReview.sponsorApproval.by}</div>
                        <div className="text-gray-400">{selectedReview.sponsorApproval.at}</div>
                      </div>
                    ) : canSponsorApprove ? (
                      <button
                        onClick={() => handleApproveStage(selectedReview.id, "sponsor")}
                        className="w-full mt-1 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded text-[11px] transition"
                      >
                        Approve as Sponsor
                      </button>
                    ) : (
                      <div className="text-[11px] text-gray-400 italic">Pending Sponsor Approval</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Protocol Criteria Evaluation Table */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  Protocol Inclusion / Exclusion Verification
                </h4>
                <div className="border border-gray-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 font-semibold uppercase border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-2.5">Code</th>
                        <th className="px-4 py-2.5">Category</th>
                        <th className="px-4 py-2.5">Protocol Requirement</th>
                        <th className="px-4 py-2.5 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedReview.criteria.map((c) => (
                        <tr key={c.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2.5 font-bold text-gray-900">{c.code}</td>
                          <td className="px-4 py-2.5 font-semibold">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] ${
                                c.type === "Inclusion"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-rose-100 text-rose-800"
                              }`}
                            >
                              {c.type}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-gray-700">{c.description}</td>
                          <td className="px-4 py-2.5 text-center font-bold">
                            {c.type === "Inclusion" ? (
                              c.met ? (
                                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">MET</span>
                              ) : (
                                <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">NOT MET</span>
                              )
                            ) : !c.met ? (
                              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">ABSENT (CLEAR)</span>
                            ) : (
                              <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">VIOLATION</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {selectedReview.overallComments && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-xs">
                  <div className="font-bold text-gray-700 mb-1">Medical Reviewer Notes</div>
                  <p className="text-gray-600">{selectedReview.overallComments}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400">
              Select a subject review from the left queue to evaluate approvals.
            </div>
          )}
        </div>
      </div>

      {/* New Subject Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-gray-100">
            <h3 className="font-bold text-lg text-gray-900 border-b border-gray-100 pb-3">
              Submit New Subject Eligibility Review
            </h3>

            <form onSubmit={handleCreateReview} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Subject Screening ID *</label>
                <input
                  type="text"
                  required
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  placeholder="e.g. 101-008"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono max-w-full"
                />
                <p className="text-[10px] text-gray-500 mt-1">
                  * GCP Constraint: Subject ID must be unique and bound strictly to protocol MHT-2101-C01.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Clinical Trial Site</label>
                <input
                  type="text"
                  value={siteId}
                  onChange={(e) => setSiteId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs max-w-full"
                />
              </div>

              <div className="space-y-2 border border-gray-200 rounded-xl p-3 bg-gray-50">
                <div className="font-bold text-gray-800">Criteria Checkpoints</div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={incAge}
                    onChange={(e) => setIncAge(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>INC 01: Age 18-65 at consent</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={incGenetic}
                    onChange={(e) => setIncGenetic(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>INC 02: Confirmed genetic diagnosis of VKCM</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={excAst}
                    onChange={(e) => setExcAst(e.target.checked)}
                    className="rounded text-rose-600"
                  />
                  <span className="text-rose-700">EXC 01: AST/ALT &gt; 3x ULN (Check if violation present)</span>
                </label>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">PI Medical Notes</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter medical notes regarding screening baseline..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs max-w-full"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
