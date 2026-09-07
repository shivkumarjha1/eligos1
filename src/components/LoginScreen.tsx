"use client";

import React, { useState } from "react";
import { useAuth, ADMIN_USER, PI_USER, CRO_USER, SPONSOR_USER } from "@/context/AuthContext";
import { UserRole } from "@/types";
import { ShieldCheck, Lock, Mail, UserCheck, ArrowRight, Building2, CheckCircle2 } from "lucide-react";

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const { switchRole, loginAsPersona } = useAuth();
  
  const [selectedRole, setSelectedRole] = useState<UserRole>("PI");
  const [email, setEmail] = useState("pi.vance@apex-trials.org");
  const [password, setPassword] = useState("••••••••••");
  const [inactivityAlert, setInactivityAlert] = useState(true);

  // Quick Persona Sign-in
  const handlePersonaClick = (role: UserRole, userEmail: string) => {
    setSelectedRole(role);
    setEmail(userEmail);
    switchRole(role);
    loginAsPersona(userEmail);
    onLoginSuccess();
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsPersona(email);
    switchRole(selectedRole);
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-[#EBF3FE] flex flex-col items-center justify-center p-4 font-sans text-slate-800">
      <div className="w-full max-w-xl space-y-6">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex items-center gap-3">
            {/* Logo Badge */}
            <div className="w-16 h-16 rounded-full bg-white border-2 border-emerald-400 p-2 shadow-sm flex items-center justify-center relative">
              <div className="w-full h-full rounded-full bg-emerald-50/60 flex flex-col justify-center gap-1 px-1.5">
                <div className="h-1 bg-emerald-500 rounded-full w-full relative">
                  <span className="absolute -right-1 -top-1 w-2.5 h-2.5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[7px] font-bold">✓</span>
                </div>
                <div className="h-1 bg-emerald-500 rounded-full w-4/5 relative">
                  <span className="absolute -right-1 -top-1 w-2.5 h-2.5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[7px] font-bold">✓</span>
                </div>
                <div className="h-1 bg-blue-500 rounded-full w-3/5 relative">
                  <span className="absolute -right-1 -top-1 w-2.5 h-2.5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[7px] font-bold">🔒</span>
                </div>
              </div>
            </div>

            <div className="text-left">
              <div className="text-4xl font-extrabold tracking-tight flex items-baseline">
                <span className="text-[#1D64EC]">Elig</span>
                <span className="text-[#059669]">OS</span>
                <span className="text-xs font-semibold align-super ml-0.5 text-gray-500">TM</span>
              </div>
              <div className="text-[10px] font-black text-[#1D64EC] tracking-wider uppercase mt-0.5">
                ELIGIBILITY OPERATING SYSTEM
              </div>
              <div className="text-[10px] text-emerald-700 font-medium tracking-tight">
                by NeuriQiz™ • Role-Based Clinical Portal
              </div>
            </div>
          </div>
        </div>

        {/* Dedicated Persona Quick Login Selection Cards */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-blue-100/60 space-y-5">
          <div className="space-y-1">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-600" />
              Select Dedicated Role Portal Login
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Click any clinical trial role persona below to instantly access your role-bound dashboard:
            </p>
          </div>

          {/* 4 Dedicated Persona Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* PI Login Card */}
            <div
              onClick={() => handlePersonaClick("PI", PI_USER.email)}
              className="bg-blue-50/70 border border-blue-200 hover:border-blue-500 rounded-2xl p-4 cursor-pointer transition hover:shadow-md group space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-600 text-white flex items-center gap-1">
                  🩺 Principal Investigator (PI)
                </span>
                <ArrowRight className="w-4 h-4 text-blue-600 opacity-0 group-hover:opacity-100 transition" />
              </div>
              <div className="font-extrabold text-slate-900 text-xs">{PI_USER.first} {PI_USER.last}</div>
              <div className="font-mono text-[11px] text-blue-800 font-medium">{PI_USER.email}</div>
              <div className="text-[10px] text-slate-500 font-semibold">{PI_USER.site}</div>
            </div>

            {/* CRO Login Card */}
            <div
              onClick={() => handlePersonaClick("CRO", CRO_USER.email)}
              className="bg-emerald-50/70 border border-emerald-200 hover:border-emerald-500 rounded-2xl p-4 cursor-pointer transition hover:shadow-md group space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white flex items-center gap-1">
                  📋 CRO Monitor (Lead CRA)
                </span>
                <ArrowRight className="w-4 h-4 text-emerald-600 opacity-0 group-hover:opacity-100 transition" />
              </div>
              <div className="font-extrabold text-slate-900 text-xs">{CRO_USER.first} {CRO_USER.last}</div>
              <div className="font-mono text-[11px] text-emerald-800 font-medium">{CRO_USER.email}</div>
              <div className="text-[10px] text-slate-500 font-semibold">{CRO_USER.site}</div>
            </div>

            {/* Sponsor Login Card */}
            <div
              onClick={() => handlePersonaClick("Sponsor", SPONSOR_USER.email)}
              className="bg-purple-50/70 border border-purple-200 hover:border-purple-500 rounded-2xl p-4 cursor-pointer transition hover:shadow-md group space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-600 text-white flex items-center gap-1">
                  💼 Sponsor Executive
                </span>
                <ArrowRight className="w-4 h-4 text-purple-600 opacity-0 group-hover:opacity-100 transition" />
              </div>
              <div className="font-extrabold text-slate-900 text-xs">{SPONSOR_USER.first} {SPONSOR_USER.last}</div>
              <div className="font-mono text-[11px] text-purple-800 font-medium">{SPONSOR_USER.email}</div>
              <div className="text-[10px] text-slate-500 font-semibold">{SPONSOR_USER.site}</div>
            </div>

            {/* System Admin Login Card */}
            <div
              onClick={() => handlePersonaClick("SuperAdmin", ADMIN_USER.email)}
              className="bg-amber-50/70 border border-amber-200 hover:border-amber-500 rounded-2xl p-4 cursor-pointer transition hover:shadow-md group space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-600 text-white flex items-center gap-1">
                  👑 System Admin
                </span>
                <ArrowRight className="w-4 h-4 text-amber-600 opacity-0 group-hover:opacity-100 transition" />
              </div>
              <div className="font-extrabold text-slate-900 text-xs">{ADMIN_USER.first} {ADMIN_USER.last}</div>
              <div className="font-mono text-[11px] text-amber-900 font-medium">{ADMIN_USER.email}</div>
              <div className="text-[10px] text-slate-500 font-semibold">{ADMIN_USER.site}</div>
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Or Sign In With Custom Email
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Manual Login Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">
                Account Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#1D64EC] hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              Sign In to EligOS Portal <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
