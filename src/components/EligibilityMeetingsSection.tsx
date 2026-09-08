"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Plus, 
  X, 
  Copy, 
  Mail, 
  Save, 
  Info, 
  Video, 
  Check 
} from "lucide-react";

export interface EligibilityMeetingRecord {
  id: string;
  studyId: string;
  date: string;
  time: string;
  status: "UPCOMING" | "COMPLETED" | "CANCELLED";
  attendees: string;
  subjectsReviewed: string[];
  outcomes: string;
  notes?: string;
  recipients?: string;
  format?: string;
  duration?: string;
}

const INITIAL_MEETINGS: EligibilityMeetingRecord[] = [
  {
    id: "mtg-101",
    studyId: "ZP-010-BS01",
    date: "Oct 7, 2025",
    time: "10:00 AM",
    status: "COMPLETED",
    attendees: "Dr. Harwood (Medical Monitor), CRA Owens (Site 101), CRA Reyes (Site 102, 103), Sponsor Rep",
    subjectsReviewed: ["101-001", "102-001"],
    outcomes: "101-001: ELIGIBLE — All criteria met per ZP- • 102-001: Pending — Repeat TSH and ALT required",
    notes: "IC-5 confirmation for 101-001 (MINI/Bipolarity Index). Lab queries for 102-001 (TSH/ALT).",
  },
  {
    id: "mtg-102",
    studyId: "ZP-010-BS01",
    date: "Oct 14, 2025",
    time: "10:00 AM",
    status: "COMPLETED",
    attendees: "Dr. Harwood (Medical Monitor), CRA Owens (Sites 101,104), CRA Reyes (Site 103), Sponsor Rep, Regulatory",
    subjectsReviewed: ["103-001", "104-001"],
    outcomes: "103-001: SCREEN FAILED — EC-8: MADRS improvement • 104-001: Pending — EC-24: QTcF 458 msec. Rep",
    notes: "103-001: MADRS improvement review (EC-8). 104-001: QTcF 458 msec review (EC-24).",
  },
];

export const EligibilityMeetingsSection: React.FC = () => {
  const { currentUser, selectedStudyId } = useAuth();
  const [meetings, setMeetings] = useState<EligibilityMeetingRecord[]>(INITIAL_MEETINGS);

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("eligos_eligibility_meetings");
      if (saved) {
        setMeetings(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load meetings from localStorage", e);
    }
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem("eligos_eligibility_meetings", JSON.stringify(meetings));
    } catch (e) {
      console.error("Failed to save meetings to localStorage", e);
    }
  }, [meetings]);

  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Modal Form States matching Screenshots 2 & 3
  const [meetingDate, setMeetingDate] = useState("2026-10-20");
  const [meetingTime, setMeetingTime] = useState("10:00 AM");
  const [meetingDuration, setMeetingDuration] = useState("1 hour");
  const [meetingFormat, setMeetingFormat] = useState("Video call");
  const [recipients, setRecipients] = useState("monitor@sponsor.com, pi@site.com");
  const [ccRecipients, setCcRecipients] = useState("regulatory@cro.com");
  const [attendeesInput, setAttendeesInput] = useState("Dr. Vance (MM), CRA Navarro, Sponsor Rep");
  const [subjectsInput, setSubjectsInput] = useState("101-001, 102-001");
  const [agendaInput, setAgendaInput] = useState("Protocol deviation review, Safety update...");
  const [senderName, setSenderName] = useState("Clinical Operations Team");

  // Role permissions: CRO and Admin can schedule meetings
  const role = currentUser?.role || "CRO";
  const canScheduleMeeting = role === "CRO" || role === "SuperAdmin" || role === "Admin";

  const upcomingMeetings = meetings.filter((m) => m.status === "UPCOMING");
  const completedMeetings = meetings.filter((m) => m.status === "COMPLETED");

  const formattedDateString = meetingDate
    ? new Date(meetingDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "Oct 20, 2026";

  // Live Email Preview Text matching Screenshots 2 & 3
  const liveEmailPreviewText = `Subject: Eligibility Review Meeting — ${formattedDateString}

Dear Team,

Please find below the meeting invitation for the upcoming Eligibility Review Meeting.

----------------------------------------
MEETING DETAILS
----------------------------------------
Date: ${formattedDateString}
Time: ${meetingTime} ET
Duration: ${meetingDuration}
Format: ${meetingFormat}
Attendees: ${attendeesInput || "See distribution list"}
----------------------------------------

AGENDA
----------------------------------------
1. Review of subject eligibility status updates since last meeting
2. Medical Monitor determinations — eligible, screen failed, or escalation
3. Site follow-up action items and responsibilities
4. Next meeting date and pending actions
${agendaInput ? `5. Additional: ${agendaInput}` : ""}

----------------------------------------
PREPARATION
----------------------------------------
- CRAs: Ensure all subject data is up to date in EDC. Submit RFIs 48 hours before the meeting.
- Sites/PIs: Respond to all open queries before the meeting. Confirm availability of Signant scores, lab results, ECG reports, and imaging.
- Sponsor/Medical Monitor: Review subject summaries in the eligibility tracker before the meeting.

----------------------------------------
REGULATORY NOTICE
----------------------------------------
All eligibility determinations are subject to 21 CFR Part 11 eSignature requirements. Final approval communications will be sent separately.

Please confirm your attendance by replying to this email.

Best regards,
${senderName || "Clinical Operations Team"}

----------------------------------------
Auto-generated by NeuriQiz(tm) CTES. Confidential - authorized study personnel only.`;

  const handleSaveMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    const subjectsArray = subjectsInput.split(",").map((s) => s.trim()).filter(Boolean);

    const newMeeting: EligibilityMeetingRecord = {
      id: `mtg-${Date.now().toString().slice(-3)}`,
      studyId: selectedStudyId,
      date: formattedDateString,
      time: meetingTime,
      status: "UPCOMING",
      attendees: attendeesInput || "CRO, PI, Sponsor Representatives",
      subjectsReviewed: subjectsArray.length > 0 ? subjectsArray : ["101-001"],
      outcomes: "Scheduled for eligibility review and sign-off",
      notes: `Agenda: ${agendaInput || "Standard eligibility review"}`,
      recipients,
      format: meetingFormat,
      duration: meetingDuration,
    };

    setMeetings([newMeeting, ...meetings]);
    setShowModal(false);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(liveEmailPreviewText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 font-sans text-slate-800">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            <span>📋</span> Eligibility Review Meetings
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            ZP-010-BS01 meeting log tied to calendar dates · Sponsor/CRO/MM review
          </p>
        </div>

        {canScheduleMeeting && (
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1D64EC] hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-2xs transition"
          >
            <Plus className="w-4 h-4" /> Schedule Meeting
          </button>
        )}
      </div>

      {/* Blue Section Info Banner */}
      <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 flex items-start gap-2.5 text-xs text-blue-950 font-semibold shadow-2xs">
        <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          Per Section 6.1.4: Eligibility reviewed by investigator, CRO medical/scientific team, and sponsor. All three must agree — if not, subject does not proceed to Visit 2.
        </div>
      </div>

      {/* Upper 2 Cards Grid: UPCOMING & RECENT COMPLETED */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card: 📅 UPCOMING */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-wider">
            <span>📅</span> UPCOMING
          </div>

          {upcomingMeetings.length > 0 ? (
            <div className="space-y-3">
              {upcomingMeetings.map((m) => (
                <div key={m.id} className="p-4 bg-blue-50/50 rounded-xl border border-blue-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-extrabold text-slate-900">
                    <span>{m.date} at {m.time} ({m.duration || "1 hr"})</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-100 text-blue-800 font-extrabold">
                      {m.status}
                    </span>
                  </div>
                  <div className="text-slate-600 font-medium">
                    {m.attendees} · {m.subjectsReviewed.length} subjects ({m.subjectsReviewed.join(", ")})
                  </div>
                  <div className="text-slate-700 text-[11px] font-semibold">{m.notes}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-xs font-medium text-slate-400">
              No upcoming meetings.
            </div>
          )}
        </div>

        {/* Right Card: ✅ RECENT COMPLETED */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-black text-emerald-600 uppercase tracking-wider">
            <span>✅</span> RECENT COMPLETED
          </div>

          <div className="space-y-3 text-xs">
            {completedMeetings.map((m) => (
              <div key={m.id} className="p-4 bg-slate-50/60 rounded-xl border border-slate-200/70 space-y-1.5">
                <div className="flex items-center justify-between font-extrabold text-slate-900">
                  <span className="text-sm">{m.date}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-extrabold">
                    COMPLETED
                  </span>
                </div>
                <div className="text-slate-500 font-medium text-[11px]">
                  {m.attendees.split(",").length} attendees · {m.subjectsReviewed.length} subjects
                </div>
                <div className="text-slate-700 font-medium text-xs pt-1 border-t border-slate-100">
                  {m.notes}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lower Card: All Eligibility Review Meetings Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
        <div className="text-xs font-black text-slate-500 uppercase tracking-wider">
          All Eligibility Review Meetings
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 font-black uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">DATE</th>
                <th className="px-5 py-3">STATUS</th>
                <th className="px-5 py-3">ATTENDEES</th>
                <th className="px-5 py-3">SUBJECTS REVIEWED</th>
                <th className="px-5 py-3">OUTCOMES</th>
                <th className="px-5 py-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {meetings.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-5 py-3.5 font-extrabold text-slate-900">{m.date}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        m.status === "COMPLETED"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-700 max-w-xs font-medium">{m.attendees}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {m.subjectsReviewed.map((sub) => (
                        <span
                          key={sub}
                          className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-200"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-700 font-medium max-w-md">{m.outcomes}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => alert(`Viewing details for meeting on ${m.date}`)}
                      className="px-3 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-extrabold text-[11px] rounded-md shadow-2xs"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Eligibility Review Meeting Modal matching Screenshots 2 & 3 */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-black text-lg text-slate-900">
                  Schedule Eligibility Review Meeting
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Fill in details — email preview updates live as you type
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Two-Column Body */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
              {/* Left Column: MEETING DETAILS Form */}
              <form onSubmit={handleSaveMeeting} className="space-y-4">
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider">
                  MEETING DETAILS
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Date *</label>
                    <input
                      type="date"
                      required
                      value={meetingDate}
                      onChange={(e) => setMeetingDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-medium max-w-full"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Time</label>
                    <input
                      type="text"
                      value={meetingTime}
                      onChange={(e) => setMeetingTime(e.target.value)}
                      placeholder="10:00 AM"
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-medium max-w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Duration</label>
                    <select
                      value={meetingDuration}
                      onChange={(e) => setMeetingDuration(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white font-medium max-w-full"
                    >
                      <option value="30 mins">30 mins</option>
                      <option value="45 mins">45 mins</option>
                      <option value="1 hour">1 hour</option>
                      <option value="1.5 hours">1.5 hours</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Format</label>
                    <select
                      value={meetingFormat}
                      onChange={(e) => setMeetingFormat(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white font-medium max-w-full"
                    >
                      <option value="Video call">Video call</option>
                      <option value="Phone conference">Phone conference</option>
                      <option value="In-person">In-person</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">To: Recipients *</label>
                  <input
                    type="text"
                    required
                    value={recipients}
                    onChange={(e) => setRecipients(e.target.value)}
                    placeholder="monitor@sponsor.com, pi@site.com"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-medium max-w-full"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">CC</label>
                  <input
                    type="text"
                    value={ccRecipients}
                    onChange={(e) => setCcRecipients(e.target.value)}
                    placeholder="regulatory@cro.com"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-medium max-w-full"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Attendees / Roles</label>
                  <input
                    type="text"
                    value={attendeesInput}
                    onChange={(e) => setAttendeesInput(e.target.value)}
                    placeholder="Dr. Vance (MM), CRA Navarro, Sponsor Rep"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-medium max-w-full"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subjects to Review</label>
                  <input
                    type="text"
                    value={subjectsInput}
                    onChange={(e) => setSubjectsInput(e.target.value)}
                    placeholder="101-001, 102-001 (comma-separated)"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-medium max-w-full"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Additional Agenda Items</label>
                  <textarea
                    rows={3}
                    value={agendaInput}
                    onChange={(e) => setAgendaInput(e.target.value)}
                    placeholder="Protocol deviation review, Safety update..."
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-medium max-w-full"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">From / Sender Name</label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Clinical Operations Team"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-medium max-w-full"
                  />
                </div>

                {/* Modal Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-3.5 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-1 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied!" : "Copy Email"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      window.location.href = `mailto:${recipients}?subject=Eligibility Review Meeting&body=${encodeURIComponent(liveEmailPreviewText)}`;
                    }}
                    className="inline-flex items-center gap-1 px-3.5 py-2 bg-[#1D64EC] hover:bg-blue-700 text-white font-bold rounded-xl shadow-2xs transition"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Open in Mail</span>
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1 px-4 py-2 bg-[#059669] hover:bg-emerald-700 text-white font-bold rounded-xl shadow-2xs transition"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save to Log</span>
                  </button>
                </div>
              </form>

              {/* Right Column: LIVE EMAIL PREVIEW */}
              <div className="space-y-2 flex flex-col">
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider">
                  LIVE EMAIL PREVIEW
                </div>

                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-4 font-mono text-[11px] text-slate-700 whitespace-pre-wrap leading-relaxed overflow-y-auto max-h-[500px]">
                  {liveEmailPreviewText}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
