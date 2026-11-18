"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Building2,
  ShieldCheck,
  User,
  Users,
  CalendarCheck,
  UserCircle,
  CalendarPlus,
  CalendarDays,
  ArrowRight,
  Database,
  KeyRound,
  Sparkles,
  CheckCircle2,
  Layers,
  PieChart,
} from "lucide-react";

export default function HomePage() {
  const { switchRole } = useAuth();

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-lg text-white tracking-tight">Digitech ERP</span>
            <span className="ml-2 text-xs px-2 py-0.5 rounded-full font-mono bg-indigo-950 text-indigo-400 border border-indigo-800/60">
              v1.2
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-400 hidden sm:inline">Neon DB & Clerk Ready</span>
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Enterprise Resource Planning System
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-3xl leading-tight">
          Next-Gen ERP for <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-purple-300 to-pink-400">
            Staff, KYC & Attendance Operations
          </span>
        </h1>

        <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
          Manage employee profiles, designations, and leave sanctions with instant real-time status tracking, attendance calendar with circular analysis, and type-wise annual leave policies.
        </p>

        {/* Dashboard Selection Cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl text-left">
          {/* Admin Dashboard Card */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-purple-500/50 hover:bg-slate-800/90 transition group shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Administrator
                </span>
              </div>
              <h2 className="text-xl font-bold text-white group-hover:text-purple-300 transition">
                Admin Dashboard
              </h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Add employees with designations, Annual CTC, bank accounts, and KYC. Activate/deactivate accounts, define annual leave type policies, and sanction requests.
              </p>

              <ul className="mt-4 space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Employee Management (Designation, CTC & Profile Activation)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Type-wise Annual Leave Quotas (1 Jan - 31 Dec Auto-Assigned)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Leave Sanctioning with Absence Incharge Review</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Filters by Department & Designation, Profile & History Viewer</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-700/60">
              <Link
                href="/admin"
                onClick={() => switchRole("ADMIN")}
                className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-purple-600/30"
              >
                <span>Launch Admin Console</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Employee Dashboard Card */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-indigo-500/50 hover:bg-slate-800/90 transition group shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Staff Portal
                </span>
              </div>
              <h2 className="text-xl font-bold text-white group-hover:text-indigo-300 transition">
                Employee Dashboard
              </h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Manage personal profile, bank account & KYC. Apply for leaves with half-day toggle, incharge assignment, and track monthly attendance calendar with circular analysis.
              </p>

              <ul className="mt-4 space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Profile, Aadhaar, PAN, Bank Details & Address Records</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Leave Form with Incharge, Emergency Contact, Half-Day & Docs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Monthly Attendance Calendar (Present, Leaves, Offs, Holidays)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Circular Analysis & Dynamic Remaining Leave Balance Tracker</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-700/60">
              <Link
                href="/employee"
                onClick={() => switchRole("EMPLOYEE")}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-600/30"
              >
                <span>Launch Employee Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Integration Status Footer */}
        <div className="mt-12 p-4 bg-slate-800/40 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Database: <strong>PostgreSQL (Neon DB ready)</strong></span>
          </div>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-purple-400" />
            <span>Auth: <strong>Clerk integration ready</strong></span>
          </div>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-indigo-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">
              .jsx
            </span>
            <span>Next.js App Router (JavaScript / JSX)</span>
          </div>
        </div>
      </main>
    </div>
  );
}
