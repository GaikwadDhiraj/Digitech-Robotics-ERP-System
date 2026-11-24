"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  UserCircle,
  CalendarPlus,
  CalendarDays,
  Shield,
  Briefcase,
  ChevronRight,
  Sparkles,
  Building2,
  X,
} from "lucide-react";

export default function Sidebar({ isMobileOpen = false, onCloseMobile }) {
  const pathname = usePathname();
  const { role, isAdmin } = useAuth();

  const adminNav = [
    {
      title: "Admin Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      badge: "Overview",
    },
    {
      title: "Employee Management",
      href: "/admin/employees",
      icon: Users,
      badge: "Staff Directory",
    },
    {
      title: "Organization",
      href: "/admin/organization",
      icon: Building2,
      badge: "Departments",
    },
    {
      title: "Leave Sanctions",
      href: "/admin/leaves",
      icon: CalendarCheck,
      badge: "Approve & Quota",
    },
  ];

  const employeeNav = [
    {
      title: "Employee Dashboard",
      href: "/employee",
      icon: LayoutDashboard,
      badge: "Home",
    },
    {
      title: "My Profile",
      href: "/employee/profile",
      icon: UserCircle,
      badge: "KYC & Details",
    },
    {
      title: "Leave Requests",
      href: "/employee/leaves",
      icon: CalendarPlus,
      badge: "Apply & Status",
    },
    {
      title: "Monthly Calendar",
      href: "/employee/calendar",
      icon: CalendarDays,
      badge: "Attendance & Circular",
    },
  ];

  const navItems = isAdmin ? adminNav : employeeNav;

  const content = (
    <div className="flex flex-col h-full bg-slate-950 text-slate-300 w-64 md:w-64 border-r border-slate-900 overflow-y-auto">
      {/* Mobile Drawer Header with Close Button */}
      <div className="md:hidden p-4 border-b border-slate-900 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.jpg" alt="Logo" className="w-6 h-6 rounded-full" />
          <span className="font-bold text-xs text-white">Digitech Robotics</span>
        </div>
        <button
          type="button"
          onClick={onCloseMobile}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Role Banner */}
      <div className="p-4 border-b border-slate-900">
        <div
          className={`p-3 rounded-2xl border flex items-center gap-3 ${
            isAdmin
              ? "bg-rose-950/40 border-rose-900/50 text-rose-300"
              : "bg-rose-950/30 border-rose-900/40 text-rose-200"
          }`}
        >
          <div className="p-2 rounded-xl bg-linear-to-tr from-rose-900 to-rose-700 text-white shadow-xs">
            {isAdmin ? <Shield className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-white">
              {isAdmin ? "Admin Console" : "Employee Portal"}
            </div>
            <div className="text-[11px] text-slate-400">
              {isAdmin ? "Full Workforce Oversight" : "Staff Self-Service"}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5">
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onCloseMobile?.()}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? "bg-linear-to-r from-rose-900 via-rose-800 to-rose-900 text-white shadow-md shadow-rose-950/40 font-bold border border-rose-700/50"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition ${
                    isActive ? "text-rose-300" : "text-slate-400 group-hover:text-slate-200"
                  }`}
                />
                <span>{item.title}</span>
              </div>
              <ChevronRight
                className={`w-3.5 h-3.5 transition-transform ${
                  isActive ? "rotate-90 text-rose-300" : "text-slate-600 group-hover:translate-x-0.5"
                }`}
              />
            </Link>
          );
        })}
      </nav>

      {/* Footer Info Box */}
      <div className="p-4 border-t border-slate-900">
        <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>DigiTech Robotics ERP</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Annual leave quotas auto-assigned (1 Jan - 31 Dec). Physical AI &amp; Automation Suite.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex shrink-0 h-full z-30">
        {content}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 md:hidden animate-in fade-in duration-200"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Slide-over Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out md:hidden shadow-2xl ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {content}
      </aside>
    </>
  );
}
