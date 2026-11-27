"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { 
  SignInButton, 
  SignUpButton, 
  Show, 
  UserButton 
} from "@clerk/nextjs";
import { 
  ShieldCheck, 
  User, 
  LogIn,
  Menu,
} from "lucide-react";

export default function Header({ onToggleMobileMenu }) {
  const { currentUser, role, isAdmin, isRealAdmin, switchRole } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between shadow-xs">
      {/* Left: Mobile Menu Button & Brand with DigiTech Robotics colors */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Hamburger Drawer Trigger */}
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 -ml-1 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link href="/" className="flex items-center gap-2.5">
          <img
            src="/logo.jpg"
            alt="Digitech Robotics India Pvt. Ltd."
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover shadow-md shadow-rose-950/20 border border-rose-200 shrink-0"
          />
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-extrabold text-sm sm:text-lg text-slate-900 tracking-tight">
                Digitech <span className="text-rose-700">Robotics</span>
              </span>
              <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-mono font-bold bg-rose-50 text-rose-800 border border-rose-200 hidden xs:inline">
                India Pvt. Ltd.
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 hidden sm:block">
              Enterprise Staff, Attendance &amp; Leave Management
            </p>
          </div>
        </Link>
      </div>

      {/* Right: Role Switcher & User Info */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Role Toggle Button - only visible if user is Real Admin */}
        {isRealAdmin ? (
          <div className="flex items-center bg-slate-100 p-0.5 sm:p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => switchRole("EMPLOYEE")}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                !isAdmin
                  ? "bg-white text-rose-900 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Switch to Employee View"
            >
              <User className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">Employee View</span>
              <span className="sm:hidden">Staff</span>
            </button>
            <button
              onClick={() => switchRole("ADMIN")}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                isAdmin
                  ? "bg-rose-800 text-white shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Switch to Admin View"
            >
              <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">Admin View</span>
              <span className="sm:hidden">Admin</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-[11px] sm:text-xs font-bold">
            <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Employee Portal</span>
            <span className="sm:hidden">Staff</span>
          </div>
        )}

        {/* Current User Info & Single Profile Image / Account Menu */}
        <div className="flex items-center gap-2.5 sm:gap-3 pl-2 sm:pl-3 border-l border-slate-200">
          <div className="hidden md:block text-right max-w-[150px] truncate">
            <div className="text-sm font-bold text-slate-900 leading-tight truncate">
              {currentUser?.name || "User"}
            </div>
            <div className="text-xs text-slate-500 flex items-center justify-end gap-1.5">
              <span className="truncate">{currentUser?.designation || "Staff"}</span>
              <span
                className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${
                  isAdmin ? "bg-rose-600" : "bg-emerald-500"
                }`}
              ></span>
            </div>
          </div>

          {/* Single Profile Avatar & Account Menu */}
          <Show when="signed-in">
            <UserButton />
          </Show>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 transition cursor-pointer">
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            </SignInButton>
          </Show>
        </div>
      </div>
    </header>
  );
}
