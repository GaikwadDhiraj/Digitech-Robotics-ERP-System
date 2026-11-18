"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import DashboardShell from "@/components/DashboardShell";
import ProfilePhotoModal from "@/components/ProfilePhotoModal";
import { useAuth } from "@/context/AuthContext";
import {
  CalendarPlus,
  UserCircle,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  Calendar,
  CalendarDays,
  Briefcase,
  Building,
  Mail,
  ShieldCheck,
  Sparkles,
  Camera,
} from "lucide-react";

export default function EmployeeDashboard() {
  const { currentUser } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!currentUser?.id) return;
      try {
        const [leavesRes, balancesRes] = await Promise.all([
          fetch(`/api/leaves?userId=${currentUser.id}`),
          fetch(`/api/leave-balances?userId=${currentUser.id}&year=2026`),
        ]);
        const [leavesData, balancesData] = await Promise.all([
          leavesRes.json(),
          balancesRes.json(),
        ]);
        if (leavesData.success) setLeaves(leavesData.data);
        if (balancesData.success) setBalances(balancesData.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [currentUser]);

  const pendingLeaves = leaves.filter((l) => l.status === "PENDING");
  const approvedLeaves = leaves.filter((l) => l.status === "APPROVED");
  const rejectedLeaves = leaves.filter((l) => l.status === "REJECTED");

  const totalRemaining = balances.reduce((sum, b) => sum + b.remainingDays, 0);

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="bg-linear-to-r from-indigo-700 via-indigo-600 to-purple-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-indigo-600/15 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-white/90">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Employee Self-Service Portal
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, {currentUser?.name || "Employee"}!
              </h1>
              <p className="text-indigo-100 text-xs sm:text-sm max-w-xl">
                Designated as <strong className="text-white underline decoration-indigo-400">{currentUser?.designation}</strong> in {currentUser?.department || "Engineering"}. Check your attendance, leave balances, or manage your personal KYC profile.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/employee/leaves"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-700 font-bold text-xs shadow-md hover:bg-indigo-50 transition"
              >
                <CalendarPlus className="w-4 h-4" />
                Apply for Leave
              </Link>
              <Link
                href="/employee/calendar"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs border border-white/20 transition"
              >
                <CalendarDays className="w-4 h-4" />
                Monthly Calendar
              </Link>
              <Link
                href="/employee/profile"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs border border-white/20 transition"
              >
                <UserCircle className="w-4 h-4" />
                Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                Leaves Remaining
              </span>
              <div className="text-2xl font-black text-indigo-900 mt-1">
                {totalRemaining} Days
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Annual quota (1 Jan - 31 Dec)</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-amber-200 bg-linear-to-b from-amber-50/20 to-transparent p-5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                Pending Sanctions
              </span>
              <div className="text-2xl font-bold text-amber-900 mt-1">
                {pendingLeaves.length}
              </div>
              <p className="text-[11px] text-amber-600 mt-0.5">Awaiting admin review</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-emerald-200 bg-linear-to-b from-emerald-50/20 to-transparent p-5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                Approved Leaves
              </span>
              <div className="text-2xl font-bold text-emerald-900 mt-1">
                {approvedLeaves.length}
              </div>
              <p className="text-[11px] text-emerald-600 mt-0.5">Sanctioned leaves</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-rose-200 bg-linear-to-b from-rose-50/20 to-transparent p-5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider">
                Rejected Leaves
              </span>
              <div className="text-2xl font-bold text-rose-900 mt-1">
                {rejectedLeaves.length}
              </div>
              <p className="text-[11px] text-rose-600 mt-0.5">Check admin notes</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <XCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Content Section: Quick Profile Peek & Recent Leaves */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Profile Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Your Identity Summary</h3>
              <Link href="/employee/profile" className="text-xs text-indigo-600 hover:underline font-semibold">
                Edit
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsPhotoModalOpen(true)}
                title="Click to change profile photo"
                className="relative group w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 ring-2 ring-rose-500/20 hover:ring-rose-500 shrink-0 transition cursor-pointer shadow-xs"
              >
                {currentUser?.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover transition group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-black text-sm text-rose-900 bg-rose-50">
                    {currentUser?.name?.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                  <Camera className="w-4 h-4" />
                </div>
              </button>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{currentUser?.name}</h4>
                <div className="text-xs text-rose-700 font-semibold">{currentUser?.designation}</div>
              </div>
            </div>

            <div className="space-y-2 text-xs pt-2">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-400">Employee ID</span>
                <span className="font-mono font-semibold text-slate-700">{currentUser?.employeeId}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-400">Department</span>
                <span className="font-semibold text-slate-700">{currentUser?.department}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-400">Official Email</span>
                <span className="font-semibold text-slate-700 truncate max-w-[160px]">{currentUser?.email}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-400">Status</span>
                <span className="font-bold text-emerald-700">{currentUser?.status || "ACTIVE"}</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-400">Joined</span>
                <span className="font-semibold text-slate-700">
                  {currentUser?.joinDate ? new Date(currentUser.joinDate).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "N/A"}
                </span>
              </div>
            </div>

            <Link
              href="/employee/profile"
              className="w-full mt-2 py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 flex items-center justify-center gap-1.5 transition"
            >
              <span>Manage Profile & Bank KYC</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Recent Leave Requests */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs lg:col-span-2">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Recent Leave Applications</h3>
                <p className="text-xs text-slate-500">Track approval from your supervisor or admin</p>
              </div>
              <Link
                href="/employee/leaves"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-slate-400">Loading leave requests...</div>
            ) : leaves.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-xs">
                No leave requests filed yet. Click "Apply for Leave" above to get started.
              </div>
            ) : (
              <div className="space-y-3">
                {leaves.slice(0, 4).map((leave) => (
                  <div
                    key={leave.id}
                    className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{leave.leaveType}</span>
                        <span className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-600">
                          {leave.daysCount} {leave.daysCount === 1 ? "day" : leave.daysCount === 0.5 ? "half-day" : "days"}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        {new Date(leave.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} —{" "}
                        {new Date(leave.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {leave.status === "PENDING" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3 h-3" /> Pending
                        </span>
                      )}
                      {leave.status === "APPROVED" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle className="w-3 h-3" /> Approved
                        </span>
                      )}
                      {leave.status === "REJECTED" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          <XCircle className="w-3 h-3" /> Rejected
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Global Photo Manager */}
        <ProfilePhotoModal
          isOpen={isPhotoModalOpen}
          onClose={() => setIsPhotoModalOpen(false)}
        />
      </div>
    </DashboardShell>
  );
}
