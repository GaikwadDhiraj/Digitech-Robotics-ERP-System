"use client";

import React from "react";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { ShieldAlert, Mail, LogOut, ArrowLeft } from "lucide-react";

export default function AccessDenied({ message }) {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress || "your account";

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden">
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
              The email <strong className="text-white">{email}</strong> is not registered in the Digitech Robotics ERP system.
            </>
          )}
        </p>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 text-xs text-slate-400 text-left mb-6 space-y-2">
          <div className="flex items-center gap-2 text-slate-300 font-semibold">
            <Mail className="w-4 h-4 text-rose-400" />
            <span>Administrator Contact</span>
          </div>
          <p className="text-slate-300">
            Please ask your Administrator to register your official email address:
          </p>
          <div className="font-mono text-rose-300 bg-slate-900/80 p-2 rounded border border-slate-700">
            dvgaikwad333@gmail.com
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <SignOutButton redirectUrl="/sign-in">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-medium text-sm transition cursor-pointer shadow-md shadow-rose-950/30">
              <LogOut className="w-4 h-4" />
              Sign Out / Switch Account
            </button>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
}
