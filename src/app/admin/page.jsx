"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import DashboardShell from "@/components/DashboardShell";
import { useAuth } from "@/context/AuthContext";
import {
  Users,
  CalendarCheck,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  UserPlus,
  Shield,
  Briefcase,
  AlertTriangle,
  Building,
  Check,
  X,
  Sparkles,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { employees, currentUser } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loadingLeaves, setLoadingLeaves] = useState(true);
  const [quickActionLoading, setQuickActionLoading] = useState(null);

  const fetchLeaves = async () => {
    try {
      setLoadingLeaves(true);
      const res = await fetch("/api/leaves");
      const result = await res.json();
      if (result.success) {
        setLeaves(result.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLeaves(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleQuickSanction = async (leaveId, status) => {
    setQuickActionLoading(leaveId);
    try {
      const res = await fetch(`/api/leaves/${leaveId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          actionNotes: status === "APPROVED" ? "Approved from dashboard quick action" : "Rejected from dashboard quick action",
          actionBy: currentUser?.name || "Admin",
        }),
      });
      const result = await res.json();
      if (result.success) {
        fetchLeaves();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setQuickActionLoading(null);
    }
  };

  const pendingLeaves = leaves.filter((l) => l.status === "PENDING");
  const approvedLeaves = leaves.filter((l) => l.status === "APPROVED");
  const totalEmployees = employees.length;

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-linear-to-r from-purple-800 via-indigo-800 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-purple-900/10 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-purple-200">
                <Shield className="w-3.5 h-3.5 text-purple-300" />
                Administrative Command Center
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Admin Dashboard Overview
              </h1>
              <p className="text-purple-100 text-xs sm:text-sm max-w-xl">
                Manage your workforce directory, designate employee positions, and sanction or reject leave requests in real time.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/admin/employees"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-purple-900 font-bold text-xs shadow-md hover:bg-purple-50 transition"
              >
                <UserPlus className="w-4 h-4" />
                Manage Employees
              </Link>
              <Link
                href="/admin/leaves"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-700/60 hover:bg-purple-700 text-white font-medium text-xs border border-purple-500/30 transition"
              >
                <CalendarCheck className="w-4 h-4" />
                Leave Sanctions ({pendingLeaves.length})
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Staff
              </span>
              <div className="text-2xl font-bold text-slate-900 mt-1">{totalEmployees}</div>
              <p className="text-[11px] text-slate-500 mt-0.5">Active employees in system</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-linear-to-b from-amber-50/20 to-transparent shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                Pending Sanctions
              </span>
              <div className="text-2xl font-bold text-amber-900 mt-1">{pendingLeaves.length}</div>
              <p className="text-[11px] text-amber-600 mt-0.5">Leaves awaiting action</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-200 bg-linear-to-b from-emerald-50/20 to-transparent shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                Approved Leaves
              </span>
              <div className="text-2xl font-bold text-emerald-900 mt-1">{approvedLeaves.length}</div>
              <p className="text-[11px] text-emerald-600 mt-0.5">Sanctioned leaves</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Departments
              </span>
              <div className="text-2xl font-bold text-slate-900 mt-1">6</div>
              <p className="text-[11px] text-slate-500 mt-0.5">Engineering, Design, HR...</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Building className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Action Center: Pending Leave Sanctions */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <div>
                <h3 className="font-bold text-base text-slate-900">Priority: Pending Leave Approvals</h3>
                <p className="text-xs text-slate-500">Quickly approve or reject employee leave requests</p>
              </div>
            </div>
            <Link
              href="/admin/leaves"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>View All ({pendingLeaves.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loadingLeaves ? (
            <div className="p-12 text-center text-xs text-slate-400">Loading pending requests...</div>
          ) : pendingLeaves.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-1">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
              <div className="font-semibold text-slate-800 text-sm">No Pending Leave Sanctions</div>
              <p className="text-xs text-slate-400">All leave requests have been reviewed and sanctioned.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {pendingLeaves.slice(0, 5).map((leave) => (
                <div key={leave.id} className="p-5 hover:bg-slate-50/60 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 ring-2 ring-indigo-500/10 shrink-0">
                      {leave.user?.avatarUrl ? (
                        <img src={leave.user.avatarUrl} alt={leave.user.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-indigo-700 bg-indigo-50">
                          {leave.user?.name?.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{leave.user?.name}</span>
                        <span className="text-xs px-2 py-0.2 rounded-full font-medium bg-slate-100 text-slate-600">
                          {leave.user?.designation}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 mt-1 flex items-center gap-2">
                        <span className="font-semibold text-indigo-700">{leave.leaveType}</span>
                        <span>•</span>
                        <span>{leave.daysCount} {leave.daysCount === 1 ? "day" : "days"}</span>
                        <span>•</span>
                        <span>
                          {new Date(leave.startDate).toLocaleDateString()} — {new Date(leave.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1 italic">
                        "{leave.reason}"
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                    <button
                      onClick={() => handleQuickSanction(leave.id, "REJECTED")}
                      disabled={quickActionLoading === leave.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs transition cursor-pointer disabled:opacity-50"
                    >
                      <X className="w-3.5 h-3.5" />
                      Reject
                    </button>
                    <button
                      onClick={() => handleQuickSanction(leave.id, "APPROVED")}
                      disabled={quickActionLoading === leave.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition cursor-pointer disabled:opacity-50"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Employees Table Preview */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Recently Added Employees</h3>
              <p className="text-xs text-slate-500">Employee designations and departments</p>
            </div>
            <Link
              href="/admin/employees"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>Manage All Staff</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {employees.slice(0, 3).map((emp) => (
              <div key={emp.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-white ring-1 ring-slate-200 shrink-0">
                  {emp.avatarUrl ? (
                    <img src={emp.avatarUrl} alt={emp.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-xs text-indigo-700">
                      {emp.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-xs text-slate-900 truncate">{emp.name}</div>
                  <div className="text-[11px] text-indigo-600 truncate font-medium">{emp.designation}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{emp.employeeId}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
