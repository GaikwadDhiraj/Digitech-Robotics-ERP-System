"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
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
  LogIn,
  ShieldAlert,
} from "lucide-react";

export default function HomePage() {
  const { isRealAdmin, isAuthorized, authError, currentUser, isClerkSignedIn } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col selection:bg-rose-600 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-900 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <img
            src="/logo.jpg"
            alt="Digitech Robotics Logo"
            className="w-10 h-10 rounded-full object-cover shadow-lg shadow-rose-950/40 border border-rose-500/40"
          />
          <div>
            <span className="font-extrabold text-lg text-white tracking-tight">
              Digitech <span className="text-rose-500">Robotics</span>
            </span>
            <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full font-mono bg-rose-950 text-rose-300 border border-rose-800/60 font-bold">
              India Pvt. Ltd.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <Show when="signed-in">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 hidden sm:inline">
                Signed in as <strong className="text-white">{currentUser?.name || "User"}</strong>
              </span>
              <UserButton />
            </div>
          </Show>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-semibold text-xs transition cursor-pointer shadow-sm">
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </button>
            </SignInButton>
          </Show>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-start pt-4 sm:pt-6 pb-12 px-6 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs font-semibold mb-3 sm:mb-4">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          Digitech Robotics Enterprise Resource Planning
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-3xl leading-tight">
          Enterprise Workforce &amp; <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-500 via-rose-400 to-amber-300">
            Attendance Management
          </span>
        </h1>

        <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
          Secure, authenticated enterprise portal for Digitech Robotics. Only verified employees pre-registered by the Administrator can access system resources.
        </p>

        {/* Dashboard Selection Cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl text-left">
          {/* Admin Dashboard Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-rose-600/50 hover:bg-slate-900 transition group shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-950/60 border border-rose-800/60 text-rose-400 flex items-center justify-center shadow-xs">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-950 text-rose-300 border border-rose-800/80">
                  Administrator
                </span>
              </div>
              <h2 className="text-xl font-bold text-white group-hover:text-rose-400 transition">
                Admin Console
              </h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Reserved for <strong>dvgaikwad333@gmail.com</strong> and designated Administrators. Register new employees &amp; admins with official emails, configure leave policies, and sanction requests.
              </p>

              <ul className="mt-4 space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Add Employees &amp; Admins with Official Email &amp; KYC</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Annual Leave Policies (1 Jan - 31 Dec Auto-Assigned)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Leave Sanctioning with Absence Incharge Review</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-800">
              <Link
                href="/admin"
                className="w-full py-3 px-4 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-rose-950/40"
              >
                <span>Launch Admin Console</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Employee Dashboard Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-emerald-600/50 hover:bg-slate-900 transition group shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 flex items-center justify-center shadow-xs">
                  <User className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/80">
                  Staff Portal
                </span>
              </div>
              <h2 className="text-xl font-bold text-white group-hover:text-emerald-400 transition">
                Employee Portal
              </h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Accessible to employees registered with their official email address. View attendance circular analysis, apply for leaves, and update profile photo.
              </p>

              <ul className="mt-4 space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Interactive Profile &amp; KYC Verification</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Monthly Attendance Calendar &amp; Circular Ring</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Apply for Leaves (Half/Full Day + Absence Incharge)</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-800">
              <Link
                href="/employee"
                className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition border border-slate-700 hover:border-emerald-600"
              >
                <span>Enter Employee Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        Digitech Robotics ERP System &bull; Secured with Clerk Authentication &amp; Neon PostgreSQL
      </footer>
    </div>
  );
}
