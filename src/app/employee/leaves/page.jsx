"use client";

import React, { useState, useEffect } from "react";
import DashboardShell from "@/components/DashboardShell";
import Pagination from "@/components/Pagination";
import { useAuth } from "@/context/AuthContext";
import {
  CalendarPlus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  FileText,
  User,
  MapPin,
  Phone,
  Upload,
  Paperclip,
  CheckCircle2,
  RefreshCw,
  Info,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function EmployeeLeavePage() {
  const { currentUser } = useAuth();

  const [leaves, setLeaves] = useState([]);
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState({ type: "", message: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 15;

  const paginatedLeaves = leaves.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const [formData, setFormData] = useState({
    leaveType: "Casual Leave",
    startDate: "",
    endDate: "",
    isHalfDay: false,
    halfDayType: "FIRST_HALF",
    daysCount: 1,
    reason: "",
    inchargePerson: "",
    contactDuringLeave: "",
    documentName: "",
  });

  // Fetch employee leaves and leave balances
  const loadData = async () => {
    if (!currentUser?.id) return;
    try {
      setLoading(true);
      const [leavesRes, balancesRes] = await Promise.all([
        fetch(`/api/leaves?userId=${currentUser.id}`),
        fetch(`/api/leave-balances?userId=${currentUser.id}&year=2026`),
      ]);

      const leavesData = await leavesRes.json();
      const balancesData = await balancesRes.json();

      if (leavesData.success) setLeaves(leavesData.data);
      if (balancesData.success) setBalances(balancesData.data);
    } catch (err) {
      console.error("Failed to load leave records:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  // Recalculate duration when dates or half-day flag change
  const handleDateChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    if (updated.startDate && updated.endDate) {
      const start = new Date(updated.startDate);
      const end = new Date(updated.endDate);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      if (diffDays === 1 && updated.isHalfDay) {
        updated.daysCount = 0.5;
      } else {
        updated.daysCount = diffDays > 0 ? diffDays : 1;
        if (diffDays > 1) {
          updated.isHalfDay = false; // Half day is only applicable for single-day leaves
        }
      }
    }
    setFormData(updated);
  };

  const handleHalfDayToggle = (isHalf) => {
    setFormData((prev) => ({
      ...prev,
      isHalfDay: isHalf,
      daysCount: isHalf ? 0.5 : 1,
      // If toggled to half day, ensure endDate equals startDate
      endDate: isHalf && prev.startDate ? prev.startDate : prev.endDate,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "startDate" || name === "endDate") {
      handleDateChange(name, value);
    } else if (type === "checkbox") {
      if (name === "isHalfDay") {
        handleHalfDayToggle(checked);
      } else {
        setFormData((prev) => ({ ...prev, [name]: checked }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Mock document file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        documentName: file.name,
        documentUrl: `/uploads/${file.name}`,
      }));
    }
  };

  // Check remaining leaves for currently selected leave type
  const selectedBalance = balances.find((b) => b.leaveType === formData.leaveType);
  const remainingDays = selectedBalance ? selectedBalance.remainingDays : 0;
  const isUnlimitedType =
    formData.leaveType === "On Duty Leave" ||
    formData.leaveType === "In Duty Leave" ||
    selectedBalance?.isUnlimited;
  const isCompOffType =
    formData.leaveType === "Compensatory Off" ||
    formData.leaveType === "Comp Off" ||
    selectedBalance?.isCompOff;

  const handleSubmitLeave = async (e) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate || !formData.reason.trim()) {
      setNotification({ type: "error", message: "Please fill in start date, end date, and reason." });
      return;
    }

    // Comp Off validation (must have valid, unexpired balance within 60 days)
    if (isCompOffType && remainingDays <= 0) {
      setNotification({
        type: "error",
        message:
          "You have 0 valid Compensatory Off days. Compensatory off is only valid for 60 days from the day worked and cannot be used after expiry.",
      });
      return;
    }

    if (!isUnlimitedType && formData.daysCount > remainingDays) {
      if (
        !window.confirm(
          `Warning: Your request of ${formData.daysCount} day(s) exceeds your remaining balance of ${remainingDays} day(s) for ${formData.leaveType}. Do you still wish to submit for admin review?`
        )
      ) {
        return;
      }
    }

    setSubmitting(true);
    setNotification({ type: "", message: "" });

    try {
      const res = await fetch("/api/leaves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          leaveType: formData.leaveType,
          startDate: formData.startDate,
          endDate: formData.endDate,
          daysCount: formData.daysCount,
          isHalfDay: formData.isHalfDay,
          halfDayType: formData.isHalfDay ? formData.halfDayType : null,
          reason: formData.reason,
          inchargePerson: formData.inchargePerson,
          contactDuringLeave: formData.contactDuringLeave,
          documentName: formData.documentName,
          documentUrl: formData.documentUrl,
        }),
      });

      const result = await res.json();
      if (result.success) {
        setNotification({
          type: "success",
          message: "Leave application submitted successfully! Waiting for admin sanction.",
        });
        setFormData({
          leaveType: "Casual Leave",
          startDate: "",
          endDate: "",
          isHalfDay: false,
          halfDayType: "FIRST_HALF",
          daysCount: 1,
          reason: "",
          inchargePerson: "",
          contactDuringLeave: "",
          documentName: "",
        });
        loadData();
      } else {
        setNotification({ type: "error", message: result.error || "Failed to submit leave." });
      }
    } catch (err) {
      setNotification({ type: "error", message: "An unexpected error occurred while submitting." });
    } finally {
      setSubmitting(false);
    }
  };

  // Stats
  const totalCount = leaves.length;
  const pendingCount = leaves.filter((l) => l.status === "PENDING").length;
  const approvedCount = leaves.filter((l) => l.status === "APPROVED").length;
  const rejectedCount = leaves.filter((l) => l.status === "REJECTED").length;

  const isSingleDay = formData.startDate && formData.endDate && formData.startDate === formData.endDate;

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Leave Management</h1>
            <p className="text-sm text-slate-500">
              Apply for leave, check assigned annual quotas, and monitor whether your leave is approved or rejected.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/employee/calendar"
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 rounded-xl transition"
            >
              <Calendar className="w-3.5 h-3.5" />
              Monthly Attendance & Circular Analysis
            </Link>
            <button
              onClick={loadData}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:border-slate-300 rounded-xl transition shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Notifications */}
        {notification.message && (
          <div
            className={`p-4 rounded-xl border text-sm flex items-center gap-2.5 animate-in fade-in ${
              notification.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-rose-50 border-rose-200 text-rose-800"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        )}

        {/* Annual Leave Balances Assigned by Admin (1 Jan - 31 Dec) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-sm text-slate-900">Your Annual Leave Balances (1 Jan - 31 Dec 2026)</h3>
            </div>
            <span className="text-[11px] font-medium text-slate-400">Assigned automatically by Admin</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {balances.map((bal) => {
              const isUnlimited =
                bal.isUnlimited ||
                bal.leaveType === "On Duty Leave" ||
                bal.leaveType === "In Duty Leave";
              const isCompOff =
                bal.isCompOff ||
                bal.leaveType === "Compensatory Off" ||
                bal.leaveType === "Comp Off";
              const percentRemaining = bal.allocatedDays > 0 ? (bal.remainingDays / bal.allocatedDays) * 100 : 0;
              return (
                <div key={bal.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800">{bal.leaveType}</span>
                    <div className="flex items-baseline gap-1 mt-2">
                      {isUnlimited ? (
                        <span className="text-xl font-black text-sky-600">No Limit</span>
                      ) : (
                        <>
                          <span className="text-2xl font-black text-indigo-600">{bal.remainingDays}</span>
                          <span className="text-xs text-slate-400">/ {bal.allocatedDays} remaining</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="mt-3">
                    {isUnlimited ? (
                      <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
                        <span>Used: {bal.usedDays} days</span>
                        <span className="text-sky-600 font-bold">Unlimited</span>
                      </div>
                    ) : (
                      <>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-indigo-600 h-full rounded-full transition-all"
                            style={{ width: `${Math.min(100, Math.max(0, percentRemaining))}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
                          <span>Used: {bal.usedDays}</span>
                          <span>{isCompOff ? "Valid for 60 Days" : `Total: ${bal.allocatedDays}`}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Section: Form & History */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Apply For Leave Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
                  <CalendarPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Apply for Leave</h3>
                  <p className="text-[11px] text-slate-500">Provide details for supervisor sanction</p>
                </div>
              </div>

              <form onSubmit={handleSubmitLeave} className="space-y-4">
                {/* Leave Type */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Leave Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="leaveType"
                    value={formData.leaveType}
                    onChange={handleInputChange}
                    className="w-full text-xs font-medium bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  >
                    {balances.length > 0 ? (
                      balances.map((b) => {
                        const isUnlimited =
                          b.isUnlimited ||
                          b.leaveType === "On Duty Leave" ||
                          b.leaveType === "In Duty Leave";
                        const isCompOff =
                          b.isCompOff ||
                          b.leaveType === "Compensatory Off" ||
                          b.leaveType === "Comp Off";
                        return (
                          <option key={b.id} value={b.leaveType}>
                            {b.leaveType}{" "}
                            {isUnlimited
                              ? "(No Limit / Unlimited)"
                              : isCompOff
                              ? `(${b.remainingDays} days left • Valid 60 Days)`
                              : `(${b.remainingDays} days left)`}
                          </option>
                        );
                      })
                    ) : (
                      <>
                        <option value="Casual Leave">Casual Leave</option>
                        <option value="Sick Leave">Sick Leave</option>
                        <option value="Annual Leave">Annual Leave</option>
                        <option value="Emergency Leave">Emergency Leave</option>
                        <option value="On Duty Leave">On Duty Leave (No Limit)</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Start Date <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                      className="w-full text-xs bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      End Date <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required
                      min={formData.startDate}
                      className="w-full text-xs bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Single Day Checkbox: Full Day vs Half Day */}
                {isSingleDay && (
                  <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-indigo-900 flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="isHalfDay"
                          checked={formData.isHalfDay}
                          onChange={handleInputChange}
                          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>Apply as Half Day (0.5 day)</span>
                      </label>
                      <span className="text-[10px] font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
                        {formData.isHalfDay ? "0.5 Day" : "Full Day"}
                      </span>
                    </div>

                    {formData.isHalfDay && (
                      <div className="flex items-center gap-3 pt-1">
                        <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                          <input
                            type="radio"
                            name="halfDayType"
                            value="FIRST_HALF"
                            checked={formData.halfDayType === "FIRST_HALF"}
                            onChange={handleInputChange}
                            className="text-indigo-600 focus:ring-indigo-500"
                          />
                          <span>First Half (Morning)</span>
                        </label>
                        <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                          <input
                            type="radio"
                            name="halfDayType"
                            value="SECOND_HALF"
                            checked={formData.halfDayType === "SECOND_HALF"}
                            onChange={handleInputChange}
                            className="text-indigo-600 focus:ring-indigo-500"
                          />
                          <span>Second Half (Afternoon)</span>
                        </label>
                      </div>
                    )}
                  </div>
                )}

                {/* Duration Badge */}
                <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs">
                  <span className="text-slate-500 font-medium">Leave Duration:</span>
                  <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    {formData.daysCount} {formData.daysCount === 1 ? "Day" : "Days"}
                  </span>
                </div>

                {/* Person in charge in absence (optional) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      Person in Charge in Absence
                    </span>
                    <span className="text-[10px] font-normal text-slate-400">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="inchargePerson"
                    value={formData.inchargePerson}
                    onChange={handleInputChange}
                    placeholder="e.g. Teammate Name / Employee ID"
                    className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Address and contact number during leave */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    Address & Contact Number During Leave
                  </label>
                  <input
                    type="text"
                    name="contactDuringLeave"
                    value={formData.contactDuringLeave}
                    onChange={handleInputChange}
                    placeholder="e.g. Pune Residence, +91 98765 43210"
                    className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Upload document (optional) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                      Upload Supporting Document
                    </span>
                    <span className="text-[10px] font-normal text-slate-400">(Optional - Medical/Tickets)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="docUpload"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="docUpload"
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50/50 rounded-xl text-xs text-slate-600 font-medium cursor-pointer transition"
                    >
                      <Upload className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{formData.documentName ? formData.documentName : "Choose PDF / Image File"}</span>
                    </label>
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Reason for Leave <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    name="reason"
                    rows="3"
                    value={formData.reason}
                    onChange={handleInputChange}
                    placeholder="Provide justification for requested leave..."
                    required
                    className="w-full text-xs bg-white border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs shadow-indigo-300 transition-all disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CalendarPlus className="w-4 h-4" />
                  {submitting ? "Submitting Application..." : "Submit Leave Application"}
                </button>
              </form>
            </div>
          </div>

          {/* Leave History & Status List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900">Your Leave History & Sanction Status</h3>
                  <p className="text-xs text-slate-500">
                    Live approval status from Admin with absence incharge details.
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">
                  {leaves.length} Submissions
                </span>
              </div>

              {loading ? (
                <div className="p-12 text-center text-slate-400 text-xs">Loading leave history...</div>
              ) : leaves.length === 0 ? (
                <div className="p-12 text-center text-slate-500 space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div className="font-semibold text-slate-800 text-sm">No Leave Applications Found</div>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    You have not submitted any leave applications yet. Fill the form on the left to apply.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {paginatedLeaves.map((leave) => {
                    const isPending = leave.status === "PENDING";
                    const isApproved = leave.status === "APPROVED";
                    const isRejected = leave.status === "REJECTED";

                    return (
                      <div key={leave.id} className="p-5 hover:bg-slate-50/70 transition space-y-2.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <span className="font-bold text-sm text-slate-900">{leave.leaveType}</span>
                            <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                              {leave.daysCount} {leave.daysCount === 1 ? "day" : leave.daysCount === 0.5 ? "half-day" : "days"}
                            </span>
                            {leave.isHalfDay && (
                              <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.2 rounded font-medium">
                                {leave.halfDayType === "FIRST_HALF" ? "First Half (AM)" : "Second Half (PM)"}
                              </span>
                            )}
                          </div>

                          {/* Status Badge */}
                          <div>
                            {isPending && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                <Clock className="w-3.5 h-3.5" />
                                Pending Approval
                              </span>
                            )}
                            {isApproved && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <CheckCircle className="w-3.5 h-3.5" />
                                Leave Approved
                              </span>
                            )}
                            {isRejected && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                <XCircle className="w-3.5 h-3.5" />
                                Leave Rejected
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Dates & Submissions */}
                        <div className="text-xs text-slate-600 flex flex-wrap items-center gap-x-4 gap-y-1">
                          <span className="font-medium text-slate-700 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {new Date(leave.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            {!leave.isHalfDay && ` — ${new Date(leave.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
                          </span>
                          <span className="text-slate-400">
                            Applied: {new Date(leave.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        </div>

                        {/* Additional Incharge & Contact Details */}
                        {(leave.inchargePerson || leave.contactDuringLeave || leave.documentName) && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            {leave.inchargePerson && (
                              <div>
                                <span className="font-semibold text-slate-500">Incharge in absence:</span>{" "}
                                <span className="text-slate-800 font-medium">{leave.inchargePerson}</span>
                              </div>
                            )}
                            {leave.contactDuringLeave && (
                              <div>
                                <span className="font-semibold text-slate-500">Contact during leave:</span>{" "}
                                <span className="text-slate-800 font-medium">{leave.contactDuringLeave}</span>
                              </div>
                            )}
                            {leave.documentName && (
                              <div className="sm:col-span-2 flex items-center gap-1.5 text-indigo-700 font-medium">
                                <Paperclip className="w-3 h-3" />
                                <span>Attached: {leave.documentName}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Reason */}
                        <div className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100">
                          <span className="font-semibold text-slate-700">Reason:</span> {leave.reason}
                        </div>

                        {/* Admin Action Feedback (Remarks) */}
                        {leave.actionNotes && (
                          <div className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                            isApproved
                              ? "bg-emerald-50/50 border-emerald-200/60 text-emerald-900"
                              : "bg-rose-50/50 border-rose-200/60 text-rose-900"
                          }`}>
                            <Info className="w-4 h-4 shrink-0 mt-0.5 text-slate-500" />
                            <div>
                              <div className="font-semibold text-[11px] uppercase tracking-wider text-slate-500">
                                Admin Remarks ({leave.actionBy || "Admin"})
                              </div>
                              <p className="mt-0.5">{leave.actionNotes}</p>
                              {leave.actionDate && (
                                <div className="text-[10px] text-slate-400 mt-1">
                                  Sanctioned on: {new Date(leave.actionDate).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <Pagination
                currentPage={currentPage}
                totalItems={leaves.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setCurrentPage}
                itemLabel="leave records"
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
