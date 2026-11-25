"use client";

import React from "react";
import Link from "next/link";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { useAuth } from "@/context/AuthContext";
import { ShieldAlert, LogOut, ArrowRight, Home } from "lucide-react";

export default function AccessDenied({ message }) {
  const { user } = useUser();
  const { isAuthorized, isRealAdmin } = useAuth();
  const email = user?.primaryEmailAddress?.emailAddress || "your account";

  // Check if user is an authorized employee trying to access admin
  const isEmployeeBlockedFromAdmin = isAuthorized && !isRealAdmin;

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-rose-950/60 border border-rose-800/60 flex items-center justify-center mx-auto mb-5 text-rose-500 shadow-lg shadow-rose-950/40">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h1 className="text-xl font-bold text-white mb-2">Access Restricted</h1>

        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          {message || (
            <>
              The email <strong className="text-white">{email}</strong> is not authorized to access this section of the Digitech Robotics ERP system.
            </>
          )}
        </p>

        <div className="flex flex-col gap-3">
          {/* If they are an authorized employee who visited /admin by mistake, give direct link to employee portal */}
          {isEmployeeBlockedFromAdmin && (
            <Link
              href="/employee"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition shadow-md shadow-emerald-950/30"
            >
              <span>Go to Employee Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}

          <div className="flex flex-col sm:flex-row gap-2.5">
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition border border-slate-700"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home Page</span>
            </Link>

            <SignOutButton redirectUrl="/sign-in">
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-medium text-xs transition cursor-pointer shadow-md shadow-rose-950/30">
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out / Switch</span>
              </button>
            </SignOutButton>
          </div>
        </div>
      </div>
    </div>
  );
}
