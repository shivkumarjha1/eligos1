"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";

export const AdminDashboard: React.FC = () => {
  const { studySummaries } = useAuth();

  return (
    <div className="space-y-6 font-sans text-slate-800">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900">Admin Dashboard</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">System Overview & Study Metrics</p>
      </div>

      {/* Top 4 KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: ACTIVE STUDIES */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs border-l-4 border-l-amber-500">
          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            ACTIVE STUDIES
          </div>
          <div className="text-3xl font-black text-amber-500 mt-1">6</div>
          <div className="text-[11px] font-medium text-slate-500 mt-0.5">Global protocols active</div>
        </div>

        {/* Card 2: ACTIVE USERS */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs border-l-4 border-l-cyan-500">
          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            ACTIVE USERS
          </div>
          <div className="text-3xl font-black text-cyan-600 mt-1">5</div>
          <div className="text-[11px] font-medium text-slate-500 mt-0.5">Users in system database</div>
        </div>

        {/* Card 3: TOTAL ENROLLMENT */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs border-l-4 border-l-emerald-500">
          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            TOTAL ENROLLMENT
          </div>
          <div className="text-3xl font-black text-emerald-600 mt-1">243</div>
          <div className="text-[11px] font-medium text-slate-500 mt-0.5">Across all active protocols</div>
        </div>

        {/* Card 4: AVG ENROLLMENT RATE */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs border-l-4 border-l-purple-600">
          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            AVG ENROLLMENT RATE
          </div>
          <div className="text-3xl font-black text-purple-700 mt-1">14%</div>
          <div className="text-[11px] font-medium text-slate-500 mt-0.5">Average progress against targets</div>
        </div>
      </div>

      {/* STUDY ENROLLMENT SUMMARY Section Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-6">
        <div className="text-xs font-black text-slate-500 uppercase tracking-wider">
          STUDY ENROLLMENT SUMMARY
        </div>

        <div className="space-y-6">
          {studySummaries.map((item) => (
            <div key={item.id} className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900">{item.title}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === "Active"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-medium mt-0.5">{item.subtitle}</div>
                </div>

                <div className="text-right">
                  <div className="text-base font-black text-slate-900">{item.enrolled}</div>
                  <div className="text-[11px] text-slate-400 font-medium">
                    {item.percentage}% of {item.target}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(item.percentage, item.enrolled > 0 ? 1 : 0)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
