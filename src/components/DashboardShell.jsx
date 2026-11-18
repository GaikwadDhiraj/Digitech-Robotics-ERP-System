"use client";

import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import AccessDenied from "./AccessDenied";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function DashboardShell({ children }) {
  const { isLoading, isAuthorized, authError, isRealAdmin } = useAuth();
  const pathname = usePathname();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-slate-300 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
        <div className="text-sm font-medium tracking-wide">
          Verifying Digitech ERP Authorization...
        </div>
      </div>
    );
  }

  // If user is not authorized in DB (i.e. email not registered by Admin)
  if (authError || !isAuthorized) {
    return <AccessDenied message={authError} />;
  }

  // If a non-admin tries to access /admin routes directly
  if (pathname?.startsWith("/admin") && !isRealAdmin) {
    return (
      <AccessDenied message="Access Denied: You do not have Administrator permissions to access the Admin Portal. Please use the Employee Portal." />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
