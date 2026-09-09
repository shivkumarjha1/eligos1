"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  Search, 
  Plus, 
  Mail, 
  Paperclip, 
  Send, 
  X, 
  UserCheck, 
  Building2, 
  Stethoscope, 
  MessageSquare,
  Inbox,
  SendHorizontal,
  Star,
  FileEdit,
  Archive,
  CheckSquare,
  CornerUpLeft,
  ReplyAll,
  Forward,
  Trash2,
  Filter,
  ShieldCheck,
  AlertCircle,
  Clock,
  Sparkles
} from "lucide-react";

export type CommFolder = "inbox" | "sent" | "saved" | "drafts" | "archive";

export interface CommunicationMessage {
  id: string;
  senderName: string;
  senderRole: "PI" | "CRO" | "Sponsor" | "Admin";
  text: string;
  timestamp: string;
  attachmentName?: string;
}

export interface CommunicationThread {
  id: string;
  studyId: string;
  subjectId?: string;
  topicHeader: string;
  targetSite: string;
  createdBy: string;
  createdByRole: "PI" | "CRO" | "Sponsor" | "Admin";
  recipients: string[]; // ["PI", "CRO", "Sponsor", "Admin"]
  toEmails?: string; // Semicolon separated email addresses (e.g. pi.vance@apex-trials.org; mreynolds@synapse-cro.com)
  ccRecipients?: string;
  createdAt: string;
  isSaved?: boolean;
  isDraft?: boolean;
  isArchived?: boolean;
  isUnread?: boolean;
  messages: CommunicationMessage[];
}

const INITIAL_THREADS: CommunicationThread[] = [
  {
    id: "comm-001",
    studyId: "SLT-206-C118",
    subjectId: "101-002",
    topicHeader: "Screening Baseline MADRS Score Clarification",
    targetSite: "Apex Research (Boston)",
    createdBy: "Dr. Elena Vance",
    createdByRole: "PI",
    recipients: ["CRO", "Sponsor"],
    toEmails: "mreynolds@synapse-cro.com; mdinfrisco@meridianhelix.com",
    ccRecipients: "regulatory@apex-trials.org",
    createdAt: "2026-09-06 10:15",
    isSaved: true,
    isDraft: false,
    isUnread: true,
    messages: [
      {
        id: "msg-1",
        senderName: "Dr. Elena Vance",
        senderRole: "PI",
        text: "Subject 101-002 completed MADRS evaluation with baseline score 28. Requesting CRO confirmation for randomization eligibility.",
        timestamp: "2026-09-06 10:15",
      },
      {
        id: "msg-2",
        senderName: "Marcus Reynolds",
        senderRole: "CRO",
        text: "Source documents verified. Baseline MADRS score of 28 satisfies protocol inclusion threshold (≥24). Proceeding to Sponsor sign-off.",
        timestamp: "2026-09-06 11:30",
        attachmentName: "MADRS_Source_Verification.pdf",
      },
    ],
  },
  {
    id: "comm-002",
    studyId: "SLT-206-C118",
    subjectId: undefined,
    topicHeader: "Protocol Amendment v4.0 ECG Window Guidance",
    targetSite: "All Sites",
    createdBy: "Marcus DiFrisco",
    createdByRole: "Sponsor",
    recipients: ["PI", "CRO", "Admin"],
    ccRecipients: "clinical-ops@solastis.com",
    createdAt: "2026-09-05 14:00",
    isSaved: false,
    isDraft: false,
    isUnread: false,
    messages: [
      {
        id: "msg-10",
        senderName: "Marcus DiFrisco",
        senderRole: "Sponsor",
        text: "Please note that Protocol Amendment v4.0 allows ECG collection within a +/- 2 day window for Visit 3. Let us know if any site queries arise.",
        timestamp: "2026-09-05 14:00",
        attachmentName: "Protocol_Amendment_v4.0_Summary.pdf",
      },
    ],
  },
  {
    id: "comm-003",
    studyId: "SLT-206-C118",
    subjectId: "101-005",
    topicHeader: "Urgent: Safety Hub AESI Liver Enzyme Escalation Alert",
    targetSite: "Mount Sinai Site 102",
    createdBy: "Dr. Jha",
    createdByRole: "Admin",
    recipients: ["PI", "CRO", "Sponsor"],
    ccRecipients: "safety-desk@solastis.com",
    createdAt: "2026-09-04 09:30",
    isSaved: true,
    isDraft: false,
    isUnread: false,
    messages: [
      {
        id: "msg-20",
        senderName: "Dr. Jha",
        senderRole: "Admin",
        text: "Automated alert: Subject 101-005 ALT lab reading exceeded 3.0x ULN. Please review protocol drug discontinuation trigger checklist immediately.",
        timestamp: "2026-09-04 09:30",
      },
    ],
  },
  {
    id: "comm-004",
    studyId: "SLT-206-C118",
    subjectId: "102-001",
    topicHeader: "[DRAFT] Query on Excluded Concomitant Antidepressant Washout",
    targetSite: "Johns Hopkins Site 101",
    createdBy: "Dr. Jha",
    createdByRole: "Admin",
    recipients: ["PI", "CRO"],
    ccRecipients: "",
    createdAt: "2026-09-07 16:20",
    isSaved: false,
    isDraft: true,
    isUnread: false,
    messages: [
      {
        id: "msg-30",
        senderName: "Dr. Jha",
        senderRole: "Admin",
        text: "Draft message text: Requesting 14-day washout verification for SSRI prior to screening Visit 1 consent...",
        timestamp: "2026-09-07 16:20",
      },
    ],
  },
];

export const StudyCommunicationsSection: React.FC = () => {
  const { currentUser, selectedStudyId, studySummaries } = useAuth();

  const [threads, setThreads] = useState<CommunicationThread[]>(INITIAL_THREADS);

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("eligos_study_communications");
      if (saved) {
        setThreads(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load communications from localStorage", e);
    }
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem("eligos_study_communications", JSON.stringify(threads));
    } catch (e) {
      console.error("Failed to save communications to localStorage", e);
    }
  }, [threads]);

  const [activeFolder, setActiveFolder] = useState<CommFolder>("inbox");
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>("comm-001");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSubject, setFilterSubject] = useState("All Discussions");

  // New Compose Modal states
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [editingDraftId, setEditingDraftId] = useState<string | null>(null);
  
  // Compose Form Fields
  const [composeToRoles, setComposeToRoles] = useState<string[]>(["PI", "CRO"]);
  const [composeToEmails, setComposeToEmails] = useState("pi.vance@apex-trials.org; mreynolds@synapse-cro.com");
  const [composeCc, setComposeCc] = useState("");
  const [composeStudy, setComposeStudy] = useState(selectedStudyId);
  const [composeSubjectId, setComposeSubjectId] = useState("");
  const [composeTopic, setComposeTopic] = useState("");
  const [composeTargetSite, setComposeTargetSite] = useState("Apex Research (Boston)");
  const [composeBody, setComposeBody] = useState("");
  const [composeAttachment, setComposeAttachment] = useState<string | null>(null);

  // Inline Reply state
  const [replyText, setReplyText] = useState("");
  const [replyAttachment, setReplyAttachment] = useState<string | null>(null);

  const userRole = currentUser?.role || "Admin";
  const userName = currentUser ? `${currentUser.first} ${currentUser.last}` : "Dr. Jha";

  // Filter threads by current folder & search query & active study
  const folderThreads = threads.filter((t) => {
    // Protocol binding check
    const matchesStudy = t.studyId.includes(selectedStudyId) || selectedStudyId.includes(t.studyId);

    // Folder filtering logic
    let matchesFolder = false;
    if (activeFolder === "inbox") {
      matchesFolder = !t.isDraft && !t.isArchived && (t.createdBy !== userName || t.recipients.includes(userRole));
    } else if (activeFolder === "sent") {
      matchesFolder = !t.isDraft && !t.isArchived && (t.createdBy === userName || t.createdByRole === userRole);
    } else if (activeFolder === "saved") {
      matchesFolder = Boolean(t.isSaved) && !t.isDraft;
    } else if (activeFolder === "drafts") {
      matchesFolder = Boolean(t.isDraft);
    } else if (activeFolder === "archive") {
      matchesFolder = Boolean(t.isArchived);
    }

    // Search query matching
    const matchesSearch =
      !searchQuery ||
      t.topicHeader.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.createdBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.toEmails && t.toEmails.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.messages.some((m) => m.text.toLowerCase().includes(searchQuery.toLowerCase()));

    // Subject binding filter
    const matchesSubjectFilter =
      filterSubject === "All Discussions" ||
      (filterSubject === "With Subject" ? Boolean(t.subjectId) : t.subjectId === filterSubject);

    return matchesStudy && matchesFolder && matchesSearch && matchesSubjectFilter;
  });

  const selectedThread = threads.find((t) => t.id === selectedThreadId);

  // Folder Counts
  const inboxCount = threads.filter((t) => !t.isDraft && !t.isArchived && t.isUnread).length;
  const sentCount = threads.filter((t) => !t.isDraft && !t.isArchived && (t.createdBy === userName || t.createdByRole === userRole)).length;
  const savedCount = threads.filter((t) => t.isSaved && !t.isDraft).length;
  const draftsCount = threads.filter((t) => t.isDraft).length;

  const handleOpenCompose = (draft?: CommunicationThread) => {
    if (draft) {
      setEditingDraftId(draft.id);
      setComposeToRoles(draft.recipients || ["PI", "CRO"]);
      setComposeToEmails(draft.toEmails || "");
      setComposeCc(draft.ccRecipients || "");
      setComposeStudy(draft.studyId || selectedStudyId);
      setComposeSubjectId(draft.subjectId || "");
      setComposeTopic(draft.topicHeader.replace("[DRAFT] ", ""));
      setComposeTargetSite(draft.targetSite || "All Sites");
      setComposeBody(draft.messages[0]?.text || "");
      setComposeAttachment(draft.messages[0]?.attachmentName || null);
    } else {
      setEditingDraftId(null);
      setComposeToRoles(["PI", "CRO"]);
      setComposeToEmails("pi.vance@apex-trials.org; mreynolds@synapse-cro.com");
      setComposeCc("");
      setComposeStudy(selectedStudyId);
      setComposeSubjectId("");
      setComposeTopic("");
      setComposeTargetSite("Apex Research (Boston)");
      setComposeBody("");
      setComposeAttachment(null);
    }
    setShowComposeModal(true);
  };

  const toggleRecipientRole = (role: string) => {
    if (role === "ALL") {
      setComposeToRoles(["PI", "CRO", "Sponsor", "Admin"]);
      return;
    }
    setComposeToRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeTopic || !composeBody) return;

    const newThread: CommunicationThread = {
      id: editingDraftId || `comm-${Date.now().toString().slice(-4)}`,
      studyId: composeStudy,
      subjectId: composeSubjectId || undefined,
      topicHeader: composeTopic,
      targetSite: composeTargetSite,
      createdBy: userName,
      createdByRole: userRole as any,
      recipients: composeToRoles.length > 0 ? composeToRoles : ["PI", "CRO"],
      toEmails: composeToEmails,
      ccRecipients: composeCc,
      createdAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      isSaved: false,
      isDraft: false,
      isUnread: false,
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderName: userName,
          senderRole: userRole as any,
          text: composeBody,
          timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
          attachmentName: composeAttachment || undefined,
        },
      ],
    };

    if (editingDraftId) {
      setThreads((prev) => prev.map((t) => (t.id === editingDraftId ? newThread : t)));
    } else {
      setThreads([newThread, ...threads]);
    }

    setSelectedThreadId(newThread.id);
    setShowComposeModal(false);
    setActiveFolder("sent");
  };

  const handleSaveDraft = () => {
    if (!composeTopic && !composeBody) return;

    const draftThread: CommunicationThread = {
      id: editingDraftId || `comm-${Date.now().toString().slice(-4)}`,
      studyId: composeStudy,
      subjectId: composeSubjectId || undefined,
      topicHeader: composeTopic.startsWith("[DRAFT]") ? composeTopic : `[DRAFT] ${composeTopic || "Untitled Discussion"}`,
      targetSite: composeTargetSite,
      createdBy: userName,
      createdByRole: userRole as any,
      recipients: composeToRoles,
      toEmails: composeToEmails,
      ccRecipients: composeCc,
      createdAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      isSaved: false,
      isDraft: true,
      isUnread: false,
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderName: userName,
          senderRole: userRole as any,
          text: composeBody || "Draft text...",
          timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
          attachmentName: composeAttachment || undefined,
        },
      ],
    };

    if (editingDraftId) {
      setThreads((prev) => prev.map((t) => (t.id === editingDraftId ? draftThread : t)));
    } else {
      setThreads([draftThread, ...threads]);
    }

    setShowComposeModal(false);
    setActiveFolder("drafts");
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText || !selectedThreadId) return;

    const newMsg: CommunicationMessage = {
      id: `msg-${Date.now()}`,
      senderName: userName,
      senderRole: userRole as any,
      text: replyText,
      timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
      attachmentName: replyAttachment || undefined,
    };

    setThreads((prev) =>
      prev.map((t) =>
        t.id === selectedThreadId
          ? { ...t, messages: [...t.messages, newMsg], isUnread: false }
          : t
      )
    );

    setReplyText("");
    setReplyAttachment(null);
  };

  const toggleStarThread = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setThreads((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isSaved: !t.isSaved } : t))
    );
  };

  const toggleArchiveThread = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setThreads((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isArchived: !t.isArchived } : t))
    );
  };

  return (
    <div className="space-y-5 font-sans text-slate-800">
      {/* Title & Outlook Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
              Study Communications Hub
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 font-bold">
                Outlook-Style Portal
              </span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Multi-role messaging platform for PI, CRO, Sponsor, and Site Monitors • Protocol <strong className="text-slate-800">{selectedStudyId}</strong>
            </p>
          </div>
        </div>

        <button
          onClick={() => handleOpenCompose()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1D64EC] hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition transform active:scale-95"
        >
          <Plus className="w-4 h-4" /> New Message / Compose
        </button>
      </div>

      {/* Main Outlook 3-Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[680px]">
        {/* Pane 1: Outlook Left Navigation Folders (2/12 width) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-3 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="px-2 pt-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
              MAIL FOLDERS
            </div>

            <nav className="space-y-1 text-xs">
              <button
                onClick={() => setActiveFolder("inbox")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition font-bold ${
                  activeFolder === "inbox"
                    ? "bg-blue-50 text-blue-700 font-black shadow-2xs border border-blue-200/60"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Inbox className="w-4 h-4 text-blue-600" />
                  <span>Inbox</span>
                </div>
                {inboxCount > 0 && (
                  <span className="px-2 py-0.5 text-[10px] bg-blue-600 text-white rounded-full font-black">
                    {inboxCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveFolder("sent")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition font-bold ${
                  activeFolder === "sent"
                    ? "bg-blue-50 text-blue-700 font-black shadow-2xs border border-blue-200/60"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <SendHorizontal className="w-4 h-4 text-emerald-600" />
                  <span>Sent Messages</span>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">{sentCount}</span>
              </button>

              <button
                onClick={() => setActiveFolder("saved")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition font-bold ${
                  activeFolder === "saved"
                    ? "bg-blue-50 text-blue-700 font-black shadow-2xs border border-blue-200/60"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <span>Saved / Starred</span>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">{savedCount}</span>
              </button>

              <button
                onClick={() => setActiveFolder("drafts")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition font-bold ${
                  activeFolder === "drafts"
                    ? "bg-blue-50 text-blue-700 font-black shadow-2xs border border-blue-200/60"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileEdit className="w-4 h-4 text-purple-600" />
                  <span>Drafts</span>
                </div>
                {draftsCount > 0 && (
                  <span className="px-2 py-0.5 text-[10px] bg-purple-600 text-white rounded-full font-black">
                    {draftsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveFolder("archive")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition font-bold ${
                  activeFolder === "archive"
                    ? "bg-blue-50 text-blue-700 font-black shadow-2xs border border-blue-200/60"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Archive className="w-4 h-4 text-slate-500" />
                  <span>Archive</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Quick Active Persona Scope Indicator */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Sender Account</div>
            <div className="font-extrabold text-slate-900 text-xs">{userName}</div>
            <div className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
              <span className="px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 text-[9px]">
                {userRole}
              </span>
              <span>{currentUser?.site || "Global HQ"}</span>
            </div>
          </div>
        </div>

        {/* Pane 2: Middle Thread List (4/12 width) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-blue-600" />
              {activeFolder.toUpperCase()} ({folderThreads.length})
            </h2>
            <span className="text-[10px] font-bold text-slate-400">
              Protocol: {selectedStudyId}
            </span>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sender, topic, or message..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white max-w-full"
            />
          </div>

          {/* Subject Binding Filter */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium text-[11px] whitespace-nowrap">Filter Subject:</span>
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer max-w-full"
            >
              <option value="All Discussions">All Subjects</option>
              <option value="101-002">Subject 101-002</option>
              <option value="101-005">Subject 101-005</option>
              <option value="102-001">Subject 102-001</option>
              <option value="With Subject">With Bound Subject</option>
            </select>
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {folderThreads.length > 0 ? (
              folderThreads.map((thread) => {
                const isSelected = selectedThreadId === thread.id;
                const lastMsg = thread.messages[thread.messages.length - 1];

                return (
                  <div
                    key={thread.id}
                    onClick={() => {
                      if (thread.isDraft) {
                        handleOpenCompose(thread);
                      } else {
                        setSelectedThreadId(thread.id);
                        setThreads((prev) =>
                          prev.map((t) => (t.id === thread.id ? { ...t, isUnread: false } : t))
                        );
                      }
                    }}
                    className={`p-3.5 rounded-xl border transition cursor-pointer space-y-2 relative ${
                      isSelected
                        ? "border-blue-500 bg-blue-50/70 shadow-2xs"
                        : thread.isUnread
                        ? "border-blue-300 bg-white font-bold"
                        : "border-slate-200/80 bg-white hover:border-slate-300"
                    }`}
                  >
                    {/* Header Row */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 truncate max-w-[190px]">
                        {thread.isUnread && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />
                        )}
                        <span className="font-extrabold text-slate-900 truncate">
                          {thread.createdBy}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-bold">
                          {thread.createdByRole}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {lastMsg?.timestamp.slice(11, 16)}
                      </span>
                    </div>

                    {/* Topic Line */}
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {thread.topicHeader}
                    </div>

                    {/* Recipient Badges Line */}
                    <div className="flex flex-wrap items-center gap-1 text-[10px] text-slate-500">
                      <span className="font-semibold text-slate-400">To:</span>
                      {thread.recipients.map((r) => (
                        <span key={r} className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-bold border border-slate-200 text-[9px]">
                          {r}
                        </span>
                      ))}
                      {thread.subjectId && (
                        <span className="ml-auto bg-blue-100 text-blue-800 text-[9px] font-extrabold px-1.5 py-0.2 rounded">
                          Subject: {thread.subjectId}
                        </span>
                      )}
                    </div>

                    {/* Preview Snippet */}
                    <p className="text-[11px] text-slate-600 line-clamp-2 font-medium leading-relaxed">
                      {lastMsg?.text}
                    </p>

                    {/* Footer Actions / Flags */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px]">
                      <span className="text-slate-400 font-medium">{thread.targetSite}</span>

                      <div className="flex items-center gap-2">
                        {thread.isDraft && (
                          <span className="px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 font-black text-[9px]">
                            DRAFT
                          </span>
                        )}
                        <button
                          onClick={(e) => toggleStarThread(thread.id, e)}
                          className="p-1 hover:text-amber-500 text-slate-400 transition"
                          title="Star / Save Message"
                        >
                          <Star className={`w-3.5 h-3.5 ${thread.isSaved ? "fill-amber-400 text-amber-500" : ""}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-16 text-slate-400 space-y-2">
                <MessageSquare className="w-8 h-8 text-slate-300 stroke-[1.5]" />
                <div className="text-xs font-medium">
                  No messages found in <strong className="text-slate-600 capitalize">{activeFolder}</strong> folder.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pane 3: Reading Pane / Thread Detail View (5/12 width) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 flex flex-col justify-between">
          {selectedThread ? (
            <div className="flex-1 flex flex-col justify-between space-y-5">
              {/* Reading Header Bar */}
              <div className="border-b border-slate-200 pb-4 space-y-3">
                {/* Action Toolbar */}
                <div className="flex items-center justify-between gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleStarThread(selectedThread.id)}
                      className={`p-1.5 rounded-lg transition ${selectedThread.isSaved ? "bg-amber-100 text-amber-700 font-bold" : "hover:bg-slate-200 text-slate-600"}`}
                      title="Star / Save Message"
                    >
                      <Star className={`w-4 h-4 ${selectedThread.isSaved ? "fill-amber-500 text-amber-500" : ""}`} />
                    </button>
                    <button
                      onClick={() => toggleArchiveThread(selectedThread.id)}
                      className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition"
                      title="Archive Thread"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-400 font-bold">
                      {selectedThread.id}
                    </span>
                  </div>
                </div>

                {/* Subject Title */}
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 leading-snug">
                    {selectedThread.topicHeader}
                  </h2>
                </div>

                {/* Metadata Grid */}
                <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100 text-xs space-y-1.5 font-medium">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">From:</span>
                    <span className="font-extrabold text-slate-900">
                      {selectedThread.createdBy} ({selectedThread.createdByRole})
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <span className="text-slate-500 whitespace-nowrap pt-0.5">To:</span>
                    <div className="flex flex-wrap items-center gap-1.5 justify-end text-right">
                      {selectedThread.recipients.map((r) => (
                        <span key={r} className="px-2 py-0.2 bg-blue-100 text-blue-800 font-extrabold rounded text-[10px]">
                          {r}
                        </span>
                      ))}
                      {selectedThread.toEmails && (
                        <span className="font-mono text-slate-700 text-[11px] font-semibold break-all">
                          {selectedThread.toEmails}
                        </span>
                      )}
                    </div>
                  </div>

                  {selectedThread.ccRecipients && (
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-slate-500 whitespace-nowrap">Cc:</span>
                      <span className="font-mono text-slate-600 text-[11px] text-right break-all">{selectedThread.ccRecipients}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px]">
                    <span>Site: <strong className="text-slate-800">{selectedThread.targetSite}</strong></span>
                    {selectedThread.subjectId && (
                      <span>Subject ID: <strong className="text-blue-700">{selectedThread.subjectId}</strong></span>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages History List */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {selectedThread.messages.map((msg) => (
                  <div key={msg.id} className="bg-slate-50/90 p-4 rounded-xl border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900">{msg.senderName}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                            msg.senderRole === "PI"
                              ? "bg-blue-100 text-blue-800"
                              : msg.senderRole === "CRO"
                              ? "bg-emerald-100 text-emerald-800"
                              : msg.senderRole === "Sponsor"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {msg.senderRole}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{msg.timestamp}</span>
                    </div>

                    <p className="text-xs text-slate-800 font-medium leading-relaxed whitespace-pre-line">
                      {msg.text}
                    </p>

                    {msg.attachmentName && (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-blue-700 shadow-2xs">
                        <Paperclip className="w-3.5 h-3.5 text-blue-600" />
                        <span>{msg.attachmentName}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Reply Box Component */}
              <form onSubmit={handleSendReply} className="pt-3 border-t border-slate-200 space-y-2">
                <div className="relative">
                  <textarea
                    rows={3}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your response to all thread participants..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white max-w-full font-medium"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer transition">
                    <Paperclip className="w-3.5 h-3.5" />
                    <span className="text-[11px]">{replyAttachment || "Attach File"}</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) setReplyAttachment(e.target.files[0].name);
                      }}
                    />
                  </label>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#1D64EC] hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-2xs transition"
                  >
                    <Send className="w-3.5 h-3.5" /> Send Reply
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 text-slate-400 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <Mail className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div className="text-xs font-medium text-slate-500">
                Select a message thread from the middle pane to view conversation history
              </div>
            </div>
          )}
        </div>
      </div>

      {/* OUTLOOK-STYLE COMPOSE / DRAFT MODAL */}
      {showComposeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-6 overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            {/* Outlook Header */}
            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5 font-bold text-base">
                <Mail className="w-5 h-5 text-blue-400" />
                <span>{editingDraftId ? "Edit Saved Draft Discussion" : "New Study Message / Discussion"}</span>
              </div>
              <button
                onClick={() => setShowComposeModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Compose Form */}
            <form onSubmit={handleSendMessage} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              {/* TO Field (Recipient Roles & Semicolon-Separated Emails) */}
              <div className="space-y-2 bg-blue-50/60 p-3.5 rounded-xl border border-blue-200/80">
                <div className="flex items-center justify-between">
                  <label className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-blue-600" />
                    TO (Recipient Roles) *
                  </label>
                  <button
                    type="button"
                    onClick={() => toggleRecipientRole("ALL")}
                    className="text-[10px] font-black text-blue-600 hover:underline"
                  >
                    + Select All Roles
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 font-bold">
                  <label className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border cursor-pointer transition ${composeToRoles.includes("PI") ? "bg-blue-600 text-white border-blue-600 shadow-2xs" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`}>
                    <input
                      type="checkbox"
                      checked={composeToRoles.includes("PI")}
                      onChange={() => toggleRecipientRole("PI")}
                      className="hidden"
                    />
                    <span>🩺 PI (Principal Investigator)</span>
                  </label>

                  <label className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border cursor-pointer transition ${composeToRoles.includes("CRO") ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`}>
                    <input
                      type="checkbox"
                      checked={composeToRoles.includes("CRO")}
                      onChange={() => toggleRecipientRole("CRO")}
                      className="hidden"
                    />
                    <span>📋 CRO Monitor</span>
                  </label>

                  <label className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border cursor-pointer transition ${composeToRoles.includes("Sponsor") ? "bg-purple-600 text-white border-purple-600 shadow-2xs" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`}>
                    <input
                      type="checkbox"
                      checked={composeToRoles.includes("Sponsor")}
                      onChange={() => toggleRecipientRole("Sponsor")}
                      className="hidden"
                    />
                    <span>💼 Sponsor Executive</span>
                  </label>

                  <label className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border cursor-pointer transition ${composeToRoles.includes("Admin") ? "bg-amber-600 text-white border-amber-600 shadow-2xs" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`}>
                    <input
                      type="checkbox"
                      checked={composeToRoles.includes("Admin")}
                      onChange={() => toggleRecipientRole("Admin")}
                      className="hidden"
                    />
                    <span>👑 Admin</span>
                  </label>
                </div>

                {/* Direct TO Semicolon-Separated Emails */}
                <div className="pt-2 border-t border-blue-200/60 space-y-1">
                  <label className="block text-xs font-bold text-slate-800">
                    Direct Email Addresses (TO) — <em className="text-slate-500 font-normal">separated with a semicolon (;)</em>
                  </label>
                  <input
                    type="text"
                    value={composeToEmails}
                    onChange={(e) => setComposeToEmails(e.target.value)}
                    placeholder="e.g. pi.vance@apex-trials.org; mreynolds@synapse-cro.com; sponsor@solastis.com"
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 max-w-full font-mono text-slate-900"
                  />
                </div>
              </div>

              {/* CC Field */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Cc Email Addresses — <em className="text-slate-500 font-normal">separated with a semicolon (;)</em>
                </label>
                <input
                  type="text"
                  value={composeCc}
                  onChange={(e) => setComposeCc(e.target.value)}
                  placeholder="e.g. medicalmonitor@solastis.com; regulatory@cro.com"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 max-w-full font-mono text-slate-800"
                />
              </div>

              {/* Study & Subject Tag */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Clinical Protocol *</label>
                  <select
                    value={composeStudy}
                    onChange={(e) => setComposeStudy(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs bg-white font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 max-w-full"
                  >
                    {studySummaries
                      .filter((s) =>
                        currentUser?.role === "SuperAdmin" || currentUser?.role === "Admin"
                          ? true
                          : (currentUser?.assignedStudies || []).some(
                              (code) => s.id.includes(code) || s.subtitle.includes(code) || code.includes(s.id)
                            )
                      )
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.id} — {s.title}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bound Subject ID (Optional)</label>
                  <select
                    value={composeSubjectId}
                    onChange={(e) => setComposeSubjectId(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs bg-white font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 max-w-full"
                  >
                    <option value="">-- No Subject Bound --</option>
                    <option value="101-002">Subject 101-002</option>
                    <option value="101-005">Subject 101-005</option>
                    <option value="102-001">Subject 102-001</option>
                  </select>
                </div>
              </div>

              {/* Topic Header & Target Site */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject / Topic Header *</label>
                  <input
                    type="text"
                    required
                    value={composeTopic}
                    onChange={(e) => setComposeTopic(e.target.value)}
                    placeholder="e.g. Protocol amendment question, custom query..."
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 max-w-full"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Site</label>
                  <select
                    value={composeTargetSite}
                    onChange={(e) => setComposeTargetSite(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs bg-white font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 max-w-full"
                  >
                    <option value="Apex Research (Boston)">Apex Research (Boston)</option>
                    <option value="Johns Hopkins Site 101">Johns Hopkins Site 101</option>
                    <option value="Mount Sinai Site 102">Mount Sinai Site 102</option>
                    <option value="All Sites">All Sites</option>
                  </select>
                </div>
              </div>

              {/* Message Body */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Message Text *</label>
                <textarea
                  rows={5}
                  required
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  placeholder="Describe the discrepancy, rescheduling, or query details..."
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 max-w-full font-medium"
                />
              </div>

              {/* Attach File */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Attach Source Document / PDF (Optional)</label>
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl font-bold text-slate-700 cursor-pointer transition">
                  <Paperclip className="w-3.5 h-3.5 text-blue-600" />
                  <span>{composeAttachment ? composeAttachment : "Choose File"}</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) setComposeAttachment(e.target.files[0].name);
                    }}
                  />
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold rounded-xl transition"
                >
                  <FileEdit className="w-3.5 h-3.5" /> Save to Drafts
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowComposeModal(false)}
                    className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2 font-extrabold text-white bg-[#1D64EC] hover:bg-blue-700 rounded-xl shadow-md transition"
                  >
                    <Send className="w-3.5 h-3.5" /> Send Message
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
