"use client";

import React, { useState, useEffect, useMemo } from "react";
import DashboardShell from "@/components/DashboardShell";
import { useAuth } from "@/context/AuthContext";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  PieChart,
  CheckCircle,
  Clock,
  Briefcase,
  Flag,
  ArrowRight,
  CheckCircle2,
  CalendarDays,
  Percent,
} from "lucide-react";
import Link from "next/link";

export default function EmployeeCalendarPage() {
  const { currentUser } = useAuth();

  const [leaves, setLeaves] = useState([]);
  const [balances, setBalances] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  // Month & Year state (default November 2026 as per workspace date)
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState(10); // 0-indexed: 10 = November

  // Hover state for Circular Analysis
  const [hoveredSegment, setHoveredSegment] = useState(null); // 'present', 'approved_leave', 'pending_leave', 'holiday', 'weekend'

  const months = [
    { value: 0, label: "January" },
    { value: 1, label: "February" },
    { value: 2, label: "March" },
    { value: 3, label: "April" },
    { value: 4, label: "May" },
    { value: 5, label: "June" },
    { value: 6, label: "July" },
    { value: 7, label: "August" },
    { value: 8, label: "September" },
    { value: 9, label: "October" },
    { value: 10, label: "November" },
    { value: 11, label: "December" },
  ];

  const years = [2025, 2026, 2027];

  const loadData = async () => {
    if (!currentUser?.id) return;
    try {
      setLoading(true);
      const [leavesRes, balancesRes, holidaysRes] = await Promise.all([
        fetch(`/api/leaves?userId=${currentUser.id}`),
        fetch(`/api/leave-balances?userId=${currentUser.id}&year=${selectedYear}`),
        fetch("/api/holidays"),
      ]);

      const [leavesData, balancesData, holidaysData] = await Promise.all([
        leavesRes.json(),
        balancesRes.json(),
        holidaysRes.json(),
      ]);

      if (leavesData.success) setLeaves(leavesData.data);
      if (balancesData.success) setBalances(balancesData.data);
      if (holidaysData.success) setHolidays(holidaysData.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser, selectedYear]);

  // Navigate months
  const prevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((y) => y - 1);
    } else {
      setSelectedMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((y) => y + 1);
    } else {
      setSelectedMonth((m) => m + 1);
    }
  };

  const currentMonth = () => {
    setSelectedYear(2026);
    setSelectedMonth(10);
  };

  const monthName = `${months[selectedMonth].label} ${selectedYear}`;

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(selectedYear, selectedMonth, 1).getDay(); // 0 is Sunday
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(selectedYear, selectedMonth, 0).getDate();

    const days = [];

    // Prev month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        dayNumber: daysInPrevMonth - i,
        dateString: new Date(selectedYear, selectedMonth - 1, daysInPrevMonth - i).toISOString().split("T")[0],
        isCurrentMonth: false,
        isWeekend: false,
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(selectedYear, selectedMonth, day);
      const dayOfWeek = dateObj.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
      const dateString = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

      // Check for holiday
      const holiday = holidays.find((h) => h.date === dateString);

      // Check for leave
      const leave = leaves.find((l) => {
        const start = l.startDate.split("T")[0];
        const end = l.endDate.split("T")[0];
        return dateString >= start && dateString <= end;
      });

      days.push({
        dayNumber: day,
        dateString,
        isCurrentMonth: true,
        isWeekend,
        holiday,
        leave,
      });
    }

    // Next month padding to fill complete grid of 35 or 42
    const totalSlots = days.length > 35 ? 42 : 35;
    const remainingSlots = totalSlots - days.length;
    for (let i = 1; i <= remainingSlots; i++) {
      days.push({
        dayNumber: i,
        dateString: new Date(selectedYear, selectedMonth + 1, i).toISOString().split("T")[0],
        isCurrentMonth: false,
        isWeekend: false,
      });
    }

    return days;
  }, [selectedYear, selectedMonth, holidays, leaves]);

  // Compute Circular Analysis Breakdown for the month
  const analysis = useMemo(() => {
    const currentMonthDays = calendarDays.filter((d) => d.isCurrentMonth);
    const totalDays = currentMonthDays.length;

    let weekendCount = 0;
    let holidayCount = 0;
    let leaveApprovedCount = 0;
    let leavePendingCount = 0;
    const typeWiseLeaves = {};

    currentMonthDays.forEach((d) => {
      if (d.holiday) {
        holidayCount++;
      } else if (d.isWeekend) {
        weekendCount++;
      } else if (d.leave) {
        const weight = d.leave.isHalfDay ? 0.5 : 1;
        if (d.leave.status === "APPROVED") {
          leaveApprovedCount += weight;
        } else {
          leavePendingCount += weight;
        }
        typeWiseLeaves[d.leave.leaveType] = (typeWiseLeaves[d.leave.leaveType] || 0) + weight;
      }
    });

    const totalLeaves = leaveApprovedCount + leavePendingCount;
    const totalWorkingDays = Math.max(0, totalDays - weekendCount - holidayCount);
    const presentDays = Math.max(0, totalWorkingDays - leaveApprovedCount);
    const presentPercentage = totalWorkingDays > 0 ? ((presentDays / totalWorkingDays) * 100).toFixed(1) : 0;

    return {
      totalDays,
      weekendCount,
      holidayCount,
      totalWorkingDays,
      presentDays,
      presentPercentage,
      leaveApprovedCount,
      leavePendingCount,
      totalLeaves,
      typeWiseLeaves,
    };
  }, [calendarDays]);

  // Annual balance totals
  const totalAllocated = balances.reduce((sum, b) => sum + b.allocatedDays, 0);
  const totalRemaining = balances.reduce((sum, b) => sum + b.remainingDays, 0);

  // Circular SVG Donut parameters
  const circumference = 2 * Math.PI * 38; // r = 38 -> ~238.76

  // Donut segment lengths
  const totalDays = Math.max(1, analysis.totalDays);
  const presentStroke = (analysis.presentDays / totalDays) * circumference;
  const leaveApprovedStroke = (analysis.leaveApprovedCount / totalDays) * circumference;
  const leavePendingStroke = (analysis.leavePendingCount / totalDays) * circumference;
  const holidayStroke = (analysis.holidayCount / totalDays) * circumference;
  const weekendStroke = (analysis.weekendCount / totalDays) * circumference;

  // Offsets
  let currentOffset = 0;
  const presentOffset = 0;
  currentOffset += presentStroke;
  const leaveApprovedOffset = currentOffset;
  currentOffset += leaveApprovedStroke;
  const leavePendingOffset = currentOffset;
  currentOffset += leavePendingStroke;
  const holidayOffset = currentOffset;
  currentOffset += holidayStroke;
  const weekendOffset = currentOffset;

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-900 border border-rose-200">
                Attendance & Roster
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              Monthly Attendance & Circular Analysis
            </h1>
            <p className="text-sm text-slate-500">
              Interactive monthly calendar with direct month dropdown selector, hoverable circular analysis, and working days tracker.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/employee/leaves"
              className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-rose-800 to-rose-900 hover:from-rose-700 hover:to-rose-800 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-950/20 transition cursor-pointer"
            >
              <span>Apply for Leave</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Section 1: Interactive Circular Attendance Analysis with Hover Effects & Attractive Colors */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl">
                <PieChart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Circular Attendance Breakdown ({monthName})
                </h3>
                <p className="text-xs text-slate-500">
                  Hover on any circular ring segment or card below to highlight metrics.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                {analysis.presentPercentage}% Attendance Rate
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Interactive SVG Circular Donut with Hover Effects */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-linear-to-b from-slate-50/80 to-white rounded-3xl border border-slate-200/80 relative">
              <div className="relative w-52 h-52 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Base Track */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#f1f5f9"
                    strokeWidth="11"
                  />

                  {/* 1. Present Days (Attractive Emerald Green) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#10b981"
                    strokeWidth={hoveredSegment === "present" ? "14" : "11"}
                    strokeDasharray={`${presentStroke} ${circumference}`}
                    strokeDashoffset="0"
                    className="cursor-pointer transition-all duration-300 hover:opacity-100"
                    style={{
                      opacity: hoveredSegment && hoveredSegment !== "present" ? 0.35 : 1,
                      filter: hoveredSegment === "present" ? "drop-shadow(0 0 6px rgba(16, 185, 129, 0.6))" : "none",
                    }}
                    onMouseEnter={() => setHoveredSegment("present")}
                    onMouseLeave={() => setHoveredSegment(null)}
                  />

                  {/* 2. Approved Leaves (Warm Amber) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#f59e0b"
                    strokeWidth={hoveredSegment === "approved_leave" ? "14" : "11"}
                    strokeDasharray={`${leaveApprovedStroke} ${circumference}`}
                    strokeDashoffset={`-${leaveApprovedOffset}`}
                    className="cursor-pointer transition-all duration-300"
                    style={{
                      opacity: hoveredSegment && hoveredSegment !== "approved_leave" ? 0.35 : 1,
                      filter: hoveredSegment === "approved_leave" ? "drop-shadow(0 0 6px rgba(245, 158, 11, 0.6))" : "none",
                    }}
                    onMouseEnter={() => setHoveredSegment("approved_leave")}
                    onMouseLeave={() => setHoveredSegment(null)}
                  />

                  {/* 3. Pending Leaves (Soft Orange) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#fb923c"
                    strokeWidth={hoveredSegment === "pending_leave" ? "14" : "11"}
                    strokeDasharray={`${leavePendingStroke} ${circumference}`}
                    strokeDashoffset={`-${leavePendingOffset}`}
                    className="cursor-pointer transition-all duration-300"
                    style={{
                      opacity: hoveredSegment && hoveredSegment !== "pending_leave" ? 0.35 : 1,
                      filter: hoveredSegment === "pending_leave" ? "drop-shadow(0 0 6px rgba(251, 146, 60, 0.6))" : "none",
                    }}
                    onMouseEnter={() => setHoveredSegment("pending_leave")}
                    onMouseLeave={() => setHoveredSegment(null)}
                  />

                  {/* 4. Holidays (DigiTech Crimson / Ruby) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#e11d48"
                    strokeWidth={hoveredSegment === "holiday" ? "14" : "11"}
                    strokeDasharray={`${holidayStroke} ${circumference}`}
                    strokeDashoffset={`-${holidayOffset}`}
                    className="cursor-pointer transition-all duration-300"
                    style={{
                      opacity: hoveredSegment && hoveredSegment !== "holiday" ? 0.35 : 1,
                      filter: hoveredSegment === "holiday" ? "drop-shadow(0 0 6px rgba(225, 29, 72, 0.6))" : "none",
                    }}
                    onMouseEnter={() => setHoveredSegment("holiday")}
                    onMouseLeave={() => setHoveredSegment(null)}
                  />

                  {/* 5. Weekly Offs (Indigo Slate) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#6366f1"
                    strokeWidth={hoveredSegment === "weekend" ? "14" : "11"}
                    strokeDasharray={`${weekendStroke} ${circumference}`}
                    strokeDashoffset={`-${weekendOffset}`}
                    className="cursor-pointer transition-all duration-300"
                    style={{
                      opacity: hoveredSegment && hoveredSegment !== "weekend" ? 0.35 : 1,
                      filter: hoveredSegment === "weekend" ? "drop-shadow(0 0 6px rgba(99, 102, 241, 0.6))" : "none",
                    }}
                    onMouseEnter={() => setHoveredSegment("weekend")}
                    onMouseLeave={() => setHoveredSegment(null)}
                  />
                </svg>

                {/* Center Dynamic Label with Hover Updates */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none p-3 animate-in fade-in duration-200">
                  {hoveredSegment === "present" && (
                    <>
                      <span className="text-3xl font-black text-emerald-600">{analysis.presentDays}</span>
                      <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">Present Days</span>
                      <span className="text-[10px] text-emerald-600 font-bold">{analysis.presentPercentage}% rate</span>
                    </>
                  )}
                  {hoveredSegment === "approved_leave" && (
                    <>
                      <span className="text-3xl font-black text-amber-600">{analysis.leaveApprovedCount}</span>
                      <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider">Approved Leave</span>
                      <span className="text-[10px] text-amber-600 font-bold">{((analysis.leaveApprovedCount / totalDays) * 100).toFixed(1)}% of month</span>
                    </>
                  )}
                  {hoveredSegment === "pending_leave" && (
                    <>
                      <span className="text-3xl font-black text-orange-600">{analysis.leavePendingCount}</span>
                      <span className="text-[10px] font-black uppercase text-orange-800 tracking-wider">Pending Leave</span>
                      <span className="text-[10px] text-orange-600 font-bold">{((analysis.leavePendingCount / totalDays) * 100).toFixed(1)}% of month</span>
                    </>
                  )}
                  {hoveredSegment === "holiday" && (
                    <>
                      <span className="text-3xl font-black text-rose-600">{analysis.holidayCount}</span>
                      <span className="text-[10px] font-black uppercase text-rose-800 tracking-wider">Holidays</span>
                      <span className="text-[10px] text-rose-600 font-bold">{((analysis.holidayCount / totalDays) * 100).toFixed(1)}% of month</span>
                    </>
                  )}
                  {hoveredSegment === "weekend" && (
                    <>
                      <span className="text-3xl font-black text-indigo-600">{analysis.weekendCount}</span>
                      <span className="text-[10px] font-black uppercase text-indigo-800 tracking-wider">Weekly Offs</span>
                      <span className="text-[10px] text-indigo-600 font-bold">Sat & Sun</span>
                    </>
                  )}
                  {!hoveredSegment && (
                    <>
                      <span className="text-3xl font-black text-slate-900">{analysis.presentDays}</span>
                      <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Days Present</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-0.5">
                        {analysis.totalWorkingDays} Work Days
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-3 text-[11px] text-slate-400 font-medium text-center">
                Hover over colored arcs for details
              </div>
            </div>

            {/* Interactive Cards with Attractive Modern Colors */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {/* Card 1: Present (Attractive Green) */}
              <div
                onMouseEnter={() => setHoveredSegment("present")}
                onMouseLeave={() => setHoveredSegment(null)}
                className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  hoveredSegment === "present"
                    ? "bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500/30 scale-102 shadow-md"
                    : "bg-emerald-50/50 border-emerald-100 hover:border-emerald-300"
                }`}
              >
                <div className="flex items-center justify-between text-emerald-800">
                  <span className="text-xs font-bold uppercase tracking-wider">Present on Duty</span>
                  <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-black text-emerald-950">{analysis.presentDays} Days</div>
                  <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                    {analysis.presentPercentage}% working efficiency
                  </div>
                </div>
              </div>

              {/* Card 2: Approved Leaves (Amber) */}
              <div
                onMouseEnter={() => setHoveredSegment("approved_leave")}
                onMouseLeave={() => setHoveredSegment(null)}
                className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  hoveredSegment === "approved_leave"
                    ? "bg-amber-50 border-amber-400 ring-2 ring-amber-500/30 scale-102 shadow-md"
                    : "bg-amber-50/50 border-amber-100 hover:border-amber-300"
                }`}
              >
                <div className="flex items-center justify-between text-amber-800">
                  <span className="text-xs font-bold uppercase tracking-wider">Approved Leave</span>
                  <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-black text-amber-950">{analysis.leaveApprovedCount} Days</div>
                  <div className="text-[11px] text-amber-700 font-semibold mt-0.5">
                    Sanctioned by Admin
                  </div>
                </div>
              </div>

              {/* Card 3: Pending Leaves (Orange) */}
              <div
                onMouseEnter={() => setHoveredSegment("pending_leave")}
                onMouseLeave={() => setHoveredSegment(null)}
                className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  hoveredSegment === "pending_leave"
                    ? "bg-orange-50 border-orange-400 ring-2 ring-orange-500/30 scale-102 shadow-md"
                    : "bg-orange-50/50 border-orange-100 hover:border-orange-300"
                }`}
              >
                <div className="flex items-center justify-between text-orange-800">
                  <span className="text-xs font-bold uppercase tracking-wider">Pending Leave</span>
                  <div className="w-7 h-7 rounded-lg bg-orange-500 text-white flex items-center justify-center shadow-xs">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-black text-orange-950">{analysis.leavePendingCount} Days</div>
                  <div className="text-[11px] text-orange-700 font-semibold mt-0.5">
                    Awaiting admin review
                  </div>
                </div>
              </div>

              {/* Card 4: Holidays (DigiTech Crimson) */}
              <div
                onMouseEnter={() => setHoveredSegment("holiday")}
                onMouseLeave={() => setHoveredSegment(null)}
                className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  hoveredSegment === "holiday"
                    ? "bg-rose-50 border-rose-400 ring-2 ring-rose-500/30 scale-102 shadow-md"
                    : "bg-rose-50/50 border-rose-100 hover:border-rose-300"
                }`}
              >
                <div className="flex items-center justify-between text-rose-800">
                  <span className="text-xs font-bold uppercase tracking-wider">Holidays</span>
                  <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-xs">
                    <Flag className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-black text-rose-950">{analysis.holidayCount} Days</div>
                  <div className="text-[11px] text-rose-700 font-semibold mt-0.5">
                    Official company holidays
                  </div>
                </div>
              </div>

              {/* Card 5: Weekly Offs (Indigo) */}
              <div
                onMouseEnter={() => setHoveredSegment("weekend")}
                onMouseLeave={() => setHoveredSegment(null)}
                className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  hoveredSegment === "weekend"
                    ? "bg-indigo-50 border-indigo-400 ring-2 ring-indigo-500/30 scale-102 shadow-md"
                    : "bg-indigo-50/50 border-indigo-100 hover:border-indigo-300"
                }`}
              >
                <div className="flex items-center justify-between text-indigo-800">
                  <span className="text-xs font-bold uppercase tracking-wider">Weekly Offs</span>
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                    <CalendarDays className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-black text-indigo-950">{analysis.weekendCount} Days</div>
                  <div className="text-[11px] text-indigo-700 font-semibold mt-0.5">
                    Saturday & Sunday
                  </div>
                </div>
              </div>

              {/* Card 6: Total Scheduled Working Days */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Working</span>
                  <div className="w-7 h-7 rounded-lg bg-slate-700 text-white flex items-center justify-center shadow-xs">
                    <Briefcase className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-black text-slate-900">{analysis.totalWorkingDays} Days</div>
                  <div className="text-[11px] text-slate-500 font-semibold mt-0.5">
                    Excluding weekends & holidays
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Type-wise Leaves Breakdown Pill Strip */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Type-wise Leaves in {monthName}:
            </span>
            {Object.keys(analysis.typeWiseLeaves).length === 0 ? (
              <span className="text-xs text-slate-500 italic">No leaves taken in this month.</span>
            ) : (
              Object.entries(analysis.typeWiseLeaves).map(([type, count]) => (
                <span
                  key={type}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200"
                >
                  <span>{type}:</span>
                  <strong className="text-amber-950 font-black">{count} {count === 1 ? "day" : "days"}</strong>
                </span>
              ))
            )}
          </div>
        </div>

        {/* Section 2: Remaining Annual Leaves Analysis (1 Jan - 31 Dec) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-700" />
              <h3 className="font-bold text-base text-slate-900">
                Annual Leave Balances Analysis (1 Jan - 31 Dec {selectedYear})
              </h3>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Overall Balance: <strong className="text-rose-800 font-bold">{totalRemaining} days</strong> remaining out of {totalAllocated} allocated
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {balances.map((b) => {
              const pct = b.allocatedDays > 0 ? (b.remainingDays / b.allocatedDays) * 100 : 0;
              return (
                <div key={b.id} className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 space-y-3 hover:border-rose-300 transition">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{b.leaveType}</span>
                    <span className="text-xs font-black text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-lg">
                      {b.remainingDays} Left
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Used: <strong className="text-slate-800">{b.usedDays}</strong></span>
                      <span>Allocated: <strong className="text-slate-800">{b.allocatedDays}</strong></span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-rose-700 h-full rounded-full transition-all"
                        style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Monthly Interactive Calendar Grid with Month & Year Dropdown */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Calendar Toolbar with Month & Year Dropdowns */}
          <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-linear-to-r from-rose-950 via-slate-900 to-rose-950 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-500/20 border border-rose-500/30 text-rose-200 rounded-xl shadow-xs">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-white">{monthName}</h3>
                <p className="text-xs text-slate-300">Select any month to inspect attendance records</p>
              </div>
            </div>

            {/* Direct Month & Year Dropdowns */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Month Dropdown */}
              <div className="relative">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:outline-hidden cursor-pointer"
                >
                  {months.map((m) => (
                    <option key={m.value} value={m.value} className="text-slate-900 bg-white">
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year Dropdown */}
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:outline-hidden cursor-pointer"
                >
                  {years.map((y) => (
                    <option key={y} value={y} className="text-slate-900 bg-white">
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              {/* Today / Current Month Quick Button */}
              <button
                onClick={currentMonth}
                className="px-3 py-2 text-xs font-bold text-rose-200 bg-rose-900/60 hover:bg-rose-900 border border-rose-700/60 rounded-xl transition cursor-pointer"
              >
                Current Month
              </button>

              {/* Prev / Next Arrows */}
              <div className="flex items-center bg-white/10 border border-white/20 rounded-xl p-0.5">
                <button
                  onClick={prevMonth}
                  className="p-1.5 text-white hover:bg-white/20 rounded-lg transition cursor-pointer"
                  title="Previous Month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-1.5 text-white hover:bg-white/20 rounded-lg transition cursor-pointer"
                  title="Next Month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-100/70 text-center text-xs font-bold text-slate-500 py-2.5">
            <span className="text-rose-600">Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span className="text-indigo-600">Sat</span>
          </div>

          {/* 7-column Calendar Cells */}
          <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 bg-slate-50/20">
            {calendarDays.map((cell, idx) => {
              const isLeave = !!cell.leave;
              const isHoliday = !!cell.holiday;
              const isOff = cell.isWeekend;

              return (
                <div
                  key={idx}
                  className={`min-h-[110px] p-2 flex flex-col justify-between transition ${
                    !cell.isCurrentMonth
                      ? "bg-slate-50/80 text-slate-300"
                      : isHoliday
                      ? "bg-rose-50/40"
                      : isLeave
                      ? "bg-amber-50/40"
                      : isOff
                      ? "bg-slate-100/40"
                      : "bg-white hover:bg-emerald-50/20"
                  }`}
                >
                  {/* Top Bar in Cell */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        !cell.isCurrentMonth
                          ? "text-slate-300"
                          : cell.isWeekend
                          ? "text-indigo-600 font-extrabold"
                          : "text-slate-800"
                      }`}
                    >
                      {cell.dayNumber}
                    </span>

                    {/* Quick Badge */}
                    {cell.isCurrentMonth && isOff && !isHoliday && (
                      <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-100">
                        Off
                      </span>
                    )}
                  </div>

                  {/* Cell Content: Holiday or Leave */}
                  <div className="mt-1 flex-1 flex flex-col justify-center">
                    {cell.isCurrentMonth && isHoliday && (
                      <div className="p-1 rounded-lg bg-rose-100 border border-rose-200 text-rose-900 text-[10px] font-bold leading-tight">
                        <span className="flex items-center gap-1">
                          <Flag className="w-2.5 h-2.5 text-rose-600 shrink-0" />
                          <span className="truncate">{cell.holiday.name}</span>
                        </span>
                      </div>
                    )}

                    {cell.isCurrentMonth && isLeave && (
                      <div
                        className={`p-1 rounded-lg border text-[10px] font-bold leading-tight ${
                          cell.leave.status === "APPROVED"
                            ? "bg-emerald-100 border-emerald-300 text-emerald-900"
                            : "bg-amber-100 border-amber-300 text-amber-900"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="truncate">{cell.leave.leaveType}</span>
                          <span className="text-[8px] uppercase">{cell.leave.isHalfDay ? "Half" : "Full"}</span>
                        </div>
                        <div className="text-[9px] font-medium opacity-80">
                          {cell.leave.status === "APPROVED" ? "Approved" : "Pending"}
                        </div>
                      </div>
                    )}

                    {cell.isCurrentMonth && !isHoliday && !isLeave && !isOff && (
                      <div className="text-[10px] text-emerald-700 font-bold text-center bg-emerald-50/70 border border-emerald-100/80 rounded py-0.5">
                        Present
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Calendar Legend */}
          <div className="p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-semibold text-slate-800">Status Legend:</span>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="font-semibold text-emerald-800">Present (Duty Verified)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span>Approved Leave</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-orange-400" />
                <span>Pending Leave</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-600" />
                <span>Company / National Holiday</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-indigo-500" />
                <span>Weekly Off (Sat/Sun)</span>
              </div>
            </div>

            <div className="text-slate-400 text-[11px] font-medium">
              Annual Period: 1 Jan - 31 Dec {selectedYear}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
