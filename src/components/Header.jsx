"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import ProfilePhotoModal from "@/components/ProfilePhotoModal";
import { 
  SignInButton, 
  SignUpButton, 
  Show, 
  UserButton 
} from "@clerk/nextjs";
import { 
  ShieldCheck, 
  User, 
  Users, 
  ArrowLeftRight, 
  Building2, 
  ChevronDown,
  Camera,
  LogIn,
} from "lucide-react";

export default function Header() {
  const { currentUser, role, isAdmin, isRealAdmin, switchRole, switchEmployeeUser, employees } = useAuth();
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-xs">
      {/* Left: Brand with DigiTech Robotics colors */}
      <div className="flex items-center gap-3">
        <img
          src="/logo.jpg"
          alt="Digitech Robotics India Pvt. Ltd."
          className="w-10 h-10 rounded-full object-cover shadow-md shadow-rose-950/20 border border-rose-200"
        />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg text-slate-900 tracking-tight">
              Digitech <span className="text-rose-700">Robotics</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-rose-50 text-rose-800 border border-rose-200">
              India Pvt. Ltd.
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Enterprise Staff, Attendance & Leave Management</p>
        </div>
      </div>

      {/* Right: Role Switcher & User Info */}
      <div className="flex items-center gap-4">
        {/* Role Toggle Button - only visible if user is Real Admin */}
        {isRealAdmin ? (
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => switchRole("EMPLOYEE")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                !isAdmin
                  ? "bg-white text-rose-900 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Employee View
            </button>
            <button
              onClick={() => switchRole("ADMIN")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                isAdmin
                  ? "bg-rose-800 text-white shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin View
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold">
            <User className="w-3.5 h-3.5 text-emerald-600" />
            Employee Portal
          </div>
        )}

        {/* Current User Badge with Photo Editor on Click */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <button
            type="button"
            onClick={() => setIsPhotoModalOpen(true)}
            title="Click to edit, upload, or delete profile photo"
            className="relative group w-9 h-9 rounded-full bg-slate-200 overflow-hidden ring-2 ring-rose-500/30 hover:ring-rose-600 transition cursor-pointer shadow-xs"
          >
            {currentUser?.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-xs text-rose-900 bg-rose-100">
                {currentUser?.name?.substring(0, 2).toUpperCase() || "US"}
              </div>
            )}
            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
              <Camera className="w-3.5 h-3.5" />
            </div>
          </button>

          <div className="hidden sm:block text-left">
            <div className="text-sm font-semibold text-slate-900 leading-tight">
              {currentUser?.name || "Loading..."}
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <span>{currentUser?.designation || "Staff"}</span>
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${isAdmin ? "bg-rose-600" : "bg-emerald-500"}`}></span>
            </div>
          </div>

          {/* Clerk Auth Integration */}
          <div className="pl-2 border-l border-slate-200">
            <Show when="signed-in">
              <UserButton />
            </Show>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 transition cursor-pointer">
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In
                </button>
              </SignInButton>
            </Show>
          </div>
        </div>
      </div>

      {/* Global Profile Photo Manager Modal */}
      <ProfilePhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
      />
    </header>
  );
}
