"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import AnimatedFlowLines from "@/components/AnimatedFlowLines";
import {
  ShieldCheck,
  User,
  CheckCircle2,
  LogIn,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";

export default function HomePage() {
  const { isRealAdmin, currentUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col relative overflow-x-hidden selection:bg-[#7a1228] selection:text-white font-sans antialiased">
      {/* Dynamic Animated Flow Curved Lines matching official Digitech Robotics website */}
      <AnimatedFlowLines className="opacity-95" />

      {/* Ambient background glows for realistic lighting */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-rose-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-60 right-1/4 w-96 h-96 bg-amber-50/40 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* =========================================================================
          Signature Crimson Pill Navbar (Streamlined specifically for ERP Portal)
         ========================================================================= */}
      <div className="w-full max-w-6xl mx-auto pt-4 sm:pt-6 px-3 sm:px-6 relative z-30">
        <header className="bg-[#7a1228] text-white rounded-full px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between shadow-xl shadow-rose-950/20 border border-rose-900/40 backdrop-blur-md">
          {/* Left: Brand Pill with Logo */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white p-0.5 shadow-md flex items-center justify-center shrink-0">
              <img
                src="/logo.jpg"
                alt="Digitech Robotics Logo"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white group-hover:text-rose-100 transition">
                DigiTech Robotics
              </span>
              <span className="text-[9px] sm:text-[10px] text-rose-200 font-medium tracking-wide">
                India Pvt. Ltd. &bull; ERP Suite
              </span>
            </div>
          </Link>

          {/* Right: Auth Action / Portal Shortcut */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Show when="signed-in">
              <div className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full px-3 py-1.5 transition">
                <span className="text-[11px] font-semibold text-white hidden md:inline truncate max-w-[120px]">
                  {currentUser?.name || "User"}
                </span>
                <UserButton />
              </div>
              <Link
                href={isRealAdmin ? "/admin" : "/employee"}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-[#7a1228] font-bold text-xs hover:bg-rose-50 transition shadow-md shadow-black/10"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </Show>

            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="flex items-center gap-1.5 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-white text-[#7a1228] font-bold text-xs hover:bg-rose-50 transition shadow-md shadow-black/10 cursor-pointer">
                  <span>Sign In</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </SignInButton>
            </Show>

            {/* Mobile menu trigger */}
            <Show when="signed-in">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="sm:hidden p-1.5 rounded-full hover:bg-white/10 text-white transition cursor-pointer"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </Show>
          </div>
        </header>

        {/* Mobile Dropdown for Signed In Shortcuts */}
        {mobileMenuOpen && (
          <div className="sm:hidden mt-2 bg-[#7a1228] border border-rose-900 rounded-3xl p-4 text-white shadow-2xl flex flex-col space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between text-xs">
              <span className="text-rose-200">Logged in as {currentUser?.name || "User"}</span>
              <Link
                href={isRealAdmin ? "/admin" : "/employee"}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-1.5 rounded-full bg-white text-[#7a1228] font-bold text-xs"
              >
                Go to Dashboard &rarr;
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          Hero Section with Wireframe Curved Lines
         ========================================================================= */}
      <main className="flex-1 flex flex-col items-center justify-start pt-6 sm:pt-10 md:pt-14 pb-16 px-4 sm:px-6 relative z-10 max-w-7xl mx-auto w-full">
        {/* Subtle, reduced-size ERP Suite indicator badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50/90 border border-rose-200/90 text-[#7a1228] text-[10px] sm:text-[11px] font-semibold mb-3 shadow-2xs">
          <Sparkles className="w-3 h-3 text-[#7a1228]" />
          <span>Enterprise Resource Planning &amp; Workforce Suite</span>
        </div>

        {/* Giant Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-[#7a1228] tracking-tight text-center max-w-5xl leading-tight">
          Digitech Robotics
        </h1>

        {/* Official Tagline Subtitle */}
        <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-slate-600 max-w-2xl text-center leading-relaxed font-normal">
          Developing intelligent platforms for industrial automation, hands-on robotics training, AI/ML, and the factories of tomorrow.
        </p>

        {/* =========================================================================
            Interactive Portal Cards (Clean White Glassmorphism)
           ========================================================================= */}
        <div id="portals" className="mt-8 sm:mt-12 w-full max-w-4xl">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Enterprise Portals &amp; Operations
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-lg mx-auto">
              Secure, role-based gateway for Digitech Robotics personnel and administrators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full text-left">
            {/* Admin Console Card */}
            <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-[#7a1228] hover:shadow-2xl hover:shadow-rose-950/10 transition-all duration-300 group shadow-lg">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-[#7a1228] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-rose-50 text-[#7a1228] border border-rose-200">
                    Administrator
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#7a1228] transition">
                  Admin Console
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Workforce directory, registration of staff &amp; administrators, monthly attendance holiday rules, and sanctioning leave requests.
                </p>

                <ul className="mt-5 space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#7a1228] shrink-0" />
                    <span>Manage Staff &amp; Add Secondary Admins</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#7a1228] shrink-0" />
                    <span>Monthly Calendar &amp; Weekly Off Rules</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#7a1228] shrink-0" />
                    <span>Leave Approval with Absence Incharge Review</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-5 border-t border-slate-100">
                <Link
                  href="/admin"
                  className="w-full py-3 px-5 rounded-full bg-[#7a1228] hover:bg-[#600e1f] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-md shadow-rose-950/20 group-hover:shadow-lg"
                >
                  <span>Launch Admin Console</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Employee Portal Card */}
            <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-slate-800 hover:shadow-2xl hover:shadow-slate-900/10 transition-all duration-300 group shadow-lg">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                    <User className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-300">
                    Employee Self-Service
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 group-hover:text-slate-800 transition">
                  Employee Portal
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Interactive profile, KYC documents (Resume, Aadhaar, PAN, Bank Details), monthly calendar attendance tracking, and leave applications.
                </p>

                <ul className="mt-5 space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Personal Profile &amp; Document Vault</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Monthly Attendance &amp; Circular Ring Metrics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Apply for Leaves &amp; Check Real-time Status</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-5 border-t border-slate-100">
                <Link
                  href="/employee"
                  className="w-full py-3 px-5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-md shadow-slate-900/20 group-hover:shadow-lg"
                >
                  <span>Enter Employee Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* =========================================================================
          Clean White Footer
         ========================================================================= */}
      <footer className="border-t border-slate-200 bg-slate-50/70 py-6 px-4 relative z-10 text-center">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Digitech Robotics India Pvt. Ltd.</span>
            <span>&bull; All Rights Reserved</span>
          </div>
          <div className="flex items-center gap-6 text-[11px] font-medium text-slate-600">
            <span>Enterprise Resource Planning</span>
            <span>Secured with Clerk &amp; Neon DB</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
