"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Search, HelpCircle, Lightbulb, Filter } from "lucide-react";

export interface FAQItem {
  id: string;
  studyId: string;
  studyCode: string;
  category: "Eligibility & Protocol" | "Safety & EKG" | "Investigational Product (IP)" | "Lab & Biomarkers";
  loggedDate: string;
  question: string;
  answer: string;
}

const FAQ_DATABASE: FAQItem[] = [
  // MHT-2101-C01 FAQs
  {
    id: "faq-1",
    studyId: "MHT-2101-C01",
    studyCode: "MHT-2101-C01",
    category: "Lab & Biomarkers",
    loggedDate: "2026-07-20",
    question: "When should central lab blood samples for cardiac Troponin be shipped?",
    answer: "Centrifuged plasma samples must be frozen at -80°C and shipped on dry ice to Central Lab within 48 hours of baseline draw.",
  },
  {
    id: "faq-2",
    studyId: "MHT-2101-C01",
    studyCode: "MHT-2101-C01",
    category: "Eligibility & Protocol",
    loggedDate: "2026-07-22",
    question: "Are subjects with prior gene therapy exposure eligible for MYOGUARD-1?",
    answer: "No. Prior exposure to AAV-based gene therapy vectors is a strict exclusion criterion under Protocol Section 4.2.",
  },
  {
    id: "faq-3",
    studyId: "MHT-2101-C01",
    studyCode: "MHT-2101-C01",
    category: "Safety & EKG",
    loggedDate: "2026-07-25",
    question: "What is the safety reporting window for Grade 3 ALT/AST elevations?",
    answer: "Grade 3 liver enzyme elevations must be logged in Safety Hub and reported to Lead Medical Monitor within 24 hours of lab receipt.",
  },

  // SLT-206-C118 Cerevastatin FAQs
  {
    id: "faq-4",
    studyId: "SLT-206-C118 Cerevastatin",
    studyCode: "SLT-206-C118",
    category: "Eligibility & Protocol",
    loggedDate: "2026-07-10",
    question: "What is the minimum baseline MADRS total score required at screening for Cerevastatin?",
    answer: "A baseline MADRS total score of ≥ 24 is required at both screening (Day -14 to -1) and Visit 1 baseline.",
  },
  {
    id: "faq-5",
    studyId: "SLT-206-C118 Cerevastatin",
    studyCode: "SLT-206-C118",
    category: "Safety & EKG",
    loggedDate: "2026-07-14",
    question: "How should QTcF interval prolongations > 480 ms be handled?",
    answer: "Repeat 12-lead ECG in triplicate. If average QTcF remains > 480 ms, discontinue dosing and initiate safety follow-up.",
  },
  {
    id: "faq-6",
    studyId: "SLT-206-C118 Cerevastatin",
    studyCode: "SLT-206-C118",
    category: "Investigational Product (IP)",
    loggedDate: "2026-07-18",
    question: "What is the recommended storage temperature for Cerevastatin capsules?",
    answer: "Store IP at controlled room temperature 20°C to 25°C (68°F to 77°F) with excursions permitted between 15°C and 30°C.",
  },

  // ZP-010-BS01 FAQs
  {
    id: "faq-7",
    studyId: "ZP-010-BS01",
    studyCode: "ZP-010-BS01",
    category: "Eligibility & Protocol",
    loggedDate: "2026-07-12",
    question: "What is the required washout period for prior antidepressant medications in the ZEPHYR study (ZP-010-BS01)?",
    answer: "A minimum 14-day washout period is required for standard SSRIs/SNRIs. Fluoxetine requires a 5-week (35-day) washout prior to Visit 2 baseline randomization.",
  },

  // GAD-002-NEXUS FAQs
  {
    id: "faq-8",
    studyId: "GAD-002-NEXUS",
    studyCode: "GAD-002-NEXUS",
    category: "Safety & EKG",
    loggedDate: "2026-07-15",
    question: "Are minor QTc prolongations acceptable at screening for NEXUS Phase II (GAD-002-NEXUS)?",
    answer: "Baseline QTc must be < 450 ms for males and < 470 ms for females. Any QTc > 480 ms requires immediate Medical Monitor review and exclusion.",
  },

  // SCZ-005-APOLLO FAQs
  {
    id: "faq-9",
    studyId: "SCZ-005-APOLLO",
    studyCode: "SCZ-005-APOLLO",
    category: "Investigational Product (IP)",
    loggedDate: "2026-07-18",
    question: "How should IP temperature excursions be handled during storage at site?",
    answer: "Quarantine the IP kit immediately at 2°C - 8°C. Do NOT dispense. Log an alert in Drug Accountability and notify the Lead CRA within 24 hours.",
  },
];

export const StudyFAQLogSection: React.FC = () => {
  const { selectedStudyId } = useAuth();
  
  const [faqs, setFaqs] = useState<FAQItem[]>(FAQ_DATABASE);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showAddModal, setShowAddModal] = useState(false);

  const [formQuestion, setFormQuestion] = useState("");
  const [formAnswer, setFormAnswer] = useState("");
  const [formCategory, setFormCategory] = useState<FAQItem["category"]>("Eligibility & Protocol");

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("eligos_faq_log");
      if (saved) {
        setFaqs(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load FAQs from localStorage", e);
    }
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem("eligos_faq_log", JSON.stringify(faqs));
    } catch (e) {
      console.error("Failed to save FAQs to localStorage", e);
    }
  }, [faqs]);

  const categories = [
    "All",
    "Eligibility & Protocol",
    "Safety & EKG",
    "Investigational Product (IP)",
    "Lab & Biomarkers",
  ];

  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formQuestion || !formAnswer) return;

    const newFaq: FAQItem = {
      id: `faq-${Date.now()}`,
      studyId: selectedStudyId,
      studyCode: selectedStudyId.split(" ")[0],
      category: formCategory,
      loggedDate: new Date().toISOString().slice(0, 10),
      question: formQuestion,
      answer: formAnswer,
    };

    setFaqs([newFaq, ...faqs]);
    setShowAddModal(false);
    setFormQuestion("");
    setFormAnswer("");
  };

  // Scoped strictly to the selected study in header dropdown
  const studyScopedFaqs = faqs.filter((item) => {
    const studyMatches =
      selectedStudyId.toLowerCase().includes(item.studyCode.toLowerCase()) ||
      selectedStudyId.toLowerCase().includes(item.studyId.toLowerCase()) ||
      item.studyId.toLowerCase().includes(selectedStudyId.split(" ")[0].toLowerCase());
    return studyMatches;
  });

  // Apply search & category filter
  const filteredFaqs = (studyScopedFaqs.length > 0 ? studyScopedFaqs : faqs).filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 font-sans text-slate-800">
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            <span className="text-amber-500">💡</span> Study FAQ Log
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Frequently asked questions, protocol clarification guidance, and operational FAQs for active clinical studies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            + Add FAQ / Log Query
          </button>
          <div className="bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-900">
            Scoped Protocol: <span className="text-blue-600 font-extrabold">{selectedStudyId}</span>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions, protocols, or keywords..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition max-w-full"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* FAQ Items List */}
      <div className="space-y-4">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-3"
            >
              {/* Category & Study Badge Row */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-blue-600">
                  {faq.category}
                </span>
                <span className="text-slate-400 font-mono text-[11px] font-semibold">
                  Study: <strong className="text-slate-700">{faq.studyCode}</strong> • Logged: {faq.loggedDate}
                </span>
              </div>

              {/* Question */}
              <div className="flex items-start gap-2 text-sm font-extrabold text-slate-900 leading-snug">
                <span className="text-rose-500 font-black text-base flex-shrink-0">?</span>
                <span>{faq.question}</span>
              </div>

              {/* Answer Box */}
              <div className="bg-slate-50 border-l-4 border-l-blue-600 border-y border-r border-slate-200/70 p-4 rounded-r-xl text-xs text-slate-700 font-medium leading-relaxed">
                {faq.answer}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-400 space-y-2">
            <HelpCircle className="w-8 h-8 text-slate-300 mx-auto" />
            <div className="text-xs font-semibold text-slate-600">
              No FAQs found matching &quot;{searchQuery}&quot; for study protocol {selectedStudyId}.
            </div>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-slate-100 font-sans">
            <h3 className="font-bold text-lg text-slate-900 border-b border-slate-100 pb-3">
              Add New Study FAQ / Query Guidance
            </h3>
            <form onSubmit={handleAddFaq} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white font-semibold max-w-full"
                >
                  <option value="Eligibility & Protocol">Eligibility & Protocol</option>
                  <option value="Safety & EKG">Safety & EKG</option>
                  <option value="Investigational Product (IP)">Investigational Product (IP)</option>
                  <option value="Lab & Biomarkers">Lab & Biomarkers</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Question / Query Title *</label>
                <input
                  type="text"
                  required
                  value={formQuestion}
                  onChange={(e) => setFormQuestion(e.target.value)}
                  placeholder="e.g. What is the baseline lab requirement?"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-medium max-w-full"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Answer / Guidance *</label>
                <textarea
                  rows={4}
                  required
                  value={formAnswer}
                  onChange={(e) => setFormAnswer(e.target.value)}
                  placeholder="Provide protocol guidance..."
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-medium max-w-full"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-extrabold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
                >
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
