"use client";

import React, { useState, useEffect } from "react";
import DashboardShell from "@/components/DashboardShell";
import Pagination from "@/components/Pagination";
import { useAuth } from "@/context/AuthContext";
import {
  CalendarCheck,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Check,
  X,
  Search,
  Filter,
  User,
  Calendar,
  MessageSquare,
  ShieldCheck,
  FileText,
  RefreshCw,
  Sparkles,
  Plus,
  Settings,
  Paperclip,
  MapPin,
  Phone,
  Layers,
  Edit2,
  Trash2,
  Award,
  LogIn,
  LogOut,
  CalendarDays,
  Sun,
  Briefcase,
  Flag,
  PlusCircle,
  RotateCcw,
  CheckCheck,
} from "lucide-react";

export default function AdminLeaveSanctionsPage() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("requests"); // "requests" | "compoff" | "policies" | "calendar"
  const [leaves, setLeaves] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [compOffs, setCompOffs] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [calendarSetting, setCalendarSetting] = useState({
    weeklyOffDay: "SUNDAY",
    defaultStartTime: "09:15 AM",
    defaultEndTime: "06:30 PM",
  });
  const [calendarMonth, setCalendarMonth] = useState(10); // 10 = November 2026
  const [calendarYear, setCalendarYear] = useState(2026);

  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [searchTerm, setSearchTerm] = useState("");
  const [requestsPage, setRequestsPage] = useState(1);
  const [compOffPage, setCompOffPage] = useState(1);
  const ITEMS_PER_PAGE = 15;

  // Sanction Modal (Regular Leave)
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Comp Off Claims State & Sanction Modal
  const [selectedCompOff, setSelectedCompOff] = useState(null);
  const [compOffNotes, setCompOffNotes] = useState("");
  const [compOffStatusFilter, setCompOffStatusFilter] = useState("PENDING");
  const [compOffActionLoading, setCompOffActionLoading] = useState(false);

  // Policy Modal
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [policyForm, setPolicyForm] = useState({
    name: "",
    code: "",
    defaultDaysPerYear: 12,
    description: "",
    color: "rose",
  });
  const [savingPolicy, setSavingPolicy] = useState(false);

  // Calendar Holiday & Work Override Modal
  const [isHolidayModalOpen, setIsHolidayModalOpen] = useState(false);
  const [holidayForm, setHolidayForm] = useState({
    name: "",
    date: "",
    type: "COMPANY",
    isWorkingDay: false,
  });
  const [savingHoliday, setSavingHoliday] = useState(false);
  const [savingSetting, setSavingSetting] = useState(false);

  const [notification, setNotification] = useState({ type: "", message: "" });

  const openAddPolicyModal = () => {
    setEditingPolicy(null);
    setPolicyForm({
      name: "",
      code: "",
      defaultDaysPerYear: 12,
      description: "",
      color: "rose",
    });
    setIsPolicyModalOpen(true);
  };

  const openEditPolicyModal = (pol) => {
    setEditingPolicy(pol);
    setPolicyForm({
      name: pol.name,
      code: pol.code,
      defaultDaysPerYear: pol.defaultDaysPerYear,
      description: pol.description || "",
      color: pol.color || "rose",
    });
    setIsPolicyModalOpen(true);
  };

  // Delete Leave Policy
  const handleDeletePolicy = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the leave type "${name}"? This will remove it from all employee annual quotas.`)) return;

    try {
      const res = await fetch(`/api/leave-policies/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        setNotification({
          type: "success",
          message: `Leave policy "${name}" has been deleted.`,
        });
        loadData();
      } else {
        setNotification({ type: "error", message: result.error || "Failed to delete policy." });
      }
    } catch (err) {
      setNotification({ type: "error", message: "Failed to delete leave policy." });
    }
  };

  // Fetch leaves, policies, comp-offs, holidays & calendar settings
  const loadData = async () => {
    try {
      setLoading(true);
      const [leavesRes, policiesRes, compOffsRes, holidaysRes, settingsRes] = await Promise.all([
        fetch("/api/leaves"),
        fetch("/api/leave-policies"),
        fetch("/api/comp-offs"),
        fetch("/api/holidays"),
        fetch("/api/calendar-settings"),
      ]);

      const [leavesData, policiesData, compOffsData, holidaysData, settingsData] = await Promise.all([
        leavesRes.json(),
        policiesRes.json(),
        compOffsRes.json(),
        holidaysRes.json(),
        settingsRes.json(),
      ]);

      if (leavesData.success) setLeaves(leavesData.data);
      if (policiesData.success) setPolicies(policiesData.data);
      if (compOffsData.success) setCompOffs(compOffsData.data);
      if (holidaysData.success) setHolidays(holidaysData.data);
      if (settingsData.success) setCalendarSetting(settingsData.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Calendar Management Handlers
  const handleSaveCalendarSetting = async (newWeeklyOff) => {
    setSavingSetting(true);
    try {
      const res = await fetch("/api/calendar-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weeklyOffDay: newWeeklyOff || calendarSetting.weeklyOffDay,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCalendarSetting(data.data);
        setNotification({
          type: "success",
          message: `Weekly Off setting updated to "${newWeeklyOff || calendarSetting.weeklyOffDay}". Employee monthly attendance roster synchronized!`,
        });
        loadData();
      }
    } catch (e) {
      setNotification({ type: "error", message: "Failed to update calendar settings." });
    } finally {
      setSavingSetting(false);
    }
  };

  const handleSaveHoliday = async (e) => {
    e.preventDefault();
    if (!holidayForm.name || !holidayForm.date) {
      alert("Please provide Holiday Name and Date.");
      return;
    }
    setSavingHoliday(true);
    try {
      const res = await fetch("/api/holidays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(holidayForm),
      });
      const data = await res.json();
      if (data.success) {
        setNotification({
          type: "success",
          message: holidayForm.isWorkingDay
            ? `Special Working Day declared for ${holidayForm.date}!`
            : `Holiday "${holidayForm.name}" added successfully!`,
        });
        setIsHolidayModalOpen(false);
        setHolidayForm({ name: "", date: "", type: "COMPANY", isWorkingDay: false });
        loadData();
      } else {
        alert(data.error || "Failed to add holiday.");
      }
    } catch (e) {
      alert("Error saving holiday.");
    } finally {
      setSavingHoliday(false);
    }
  };

  const handleDeleteHoliday = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the calendar?`)) return;
    try {
      const res = await fetch(`/api/holidays?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setNotification({ type: "success", message: `Holiday "${name}" removed.` });
        loadData();
      }
    } catch (e) {
      setNotification({ type: "error", message: "Failed to delete holiday." });
    }
  };

  const handleToggleWorkingDay = async (dateStr, isAlreadyWorkingDay) => {
    try {
      const res = await fetch("/api/holidays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: isAlreadyWorkingDay ? "Weekend / Holiday Off" : "Special Working Day",
          date: dateStr,
          type: "SPECIAL_DAY",
          isWorkingDay: !isAlreadyWorkingDay,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNotification({
          type: "success",
          message: !isAlreadyWorkingDay
            ? `Date ${dateStr} declared as an official WORKING DAY!`
            : `Date ${dateStr} reset to non-working holiday!`,
        });
        loadData();
      }
    } catch (e) {
      setNotification({ type: "error", message: "Failed to update day override." });
    }
  };

  const openAddHolidayModal = (prefilledDate = "") => {
    setHolidayForm({
      name: "",
      date: prefilledDate || `${calendarYear}-${String(calendarMonth + 1).padStart(2, "0")}-01`,
      type: "COMPANY",
      isWorkingDay: false,
    });
    setIsHolidayModalOpen(true);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle Sanction Action (Approve / Reject)
  const handleSanctionAction = async (leaveId, newStatus) => {
    setActionLoading(true);
    setNotification({ type: "", message: "" });

    try {
      const res = await fetch(`/api/leaves/${leaveId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          actionNotes: adminNotes.trim() || (newStatus === "APPROVED" ? "Approved by Admin." : "Rejected by Admin."),
          actionBy: currentUser?.name || "Admin User",
        }),
      });

      const result = await res.json();
      if (result.success) {
        setNotification({
          type: "success",
          message: `Leave request has been marked as ${newStatus}!`,
        });
        setSelectedLeave(null);
        setAdminNotes("");
        loadData();
      } else {
        setNotification({ type: "error", message: result.error || "Failed to update status." });
      }
    } catch (err) {
      setNotification({ type: "error", message: "An unexpected error occurred while sanctioning." });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Sanction Action for Comp Off claims
  const handleSanctionCompOff = async (claimId, newStatus) => {
    setCompOffActionLoading(true);
    setNotification({ type: "", message: "" });

    try {
      const res = await fetch(`/api/comp-offs/${claimId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          actionNotes: compOffNotes.trim() || (newStatus === "APPROVED" ? "Approved by Admin. 1 Day credited to Compensatory Leave balance." : "Rejected by Admin."),
          actionBy: currentUser?.name || "Admin (Dhiraj Gaikwad)",
        }),
      });

      const result = await res.json();
      if (result.success) {
        setNotification({
          type: "success",
          message:
            newStatus === "APPROVED"
              ? "Comp Off claim approved! Exactly +1 complementary leave has been credited to employee's profile leave balance."
              : "Comp Off claim has been rejected.",
        });
        setSelectedCompOff(null);
        setCompOffNotes("");
        loadData();
      } else {
        setNotification({ type: "error", message: result.error || "Failed to update Comp Off claim." });
      }
    } catch (err) {
      setNotification({ type: "error", message: "An unexpected error occurred while sanctioning Comp Off." });
    } finally {
      setCompOffActionLoading(false);
    }
  };

  // Handle Create or Update Leave Policy
  const handleSavePolicy = async (e) => {
    e.preventDefault();
    if (!policyForm.name || !policyForm.defaultDaysPerYear) {
      setNotification({ type: "error", message: "Please provide policy name and days quota." });
      return;
    }

    setSavingPolicy(true);
    try {
      if (editingPolicy) {
        // Update Policy
        const res = await fetch(`/api/leave-policies/${editingPolicy.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(policyForm),
        });
        const result = await res.json();
        if (result.success) {
          setNotification({
            type: "success",
            message: `Leave type "${policyForm.name}" updated! Employee balances adjusted accordingly.`,
          });
          setIsPolicyModalOpen(false);
          loadData();
        } else {
          setNotification({ type: "error", message: result.error || "Failed to update policy." });
        }
      } else {
        // Create Policy
        const res = await fetch("/api/leave-policies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(policyForm),
        });

        const result = await res.json();
        if (result.success) {
          setNotification({
            type: "success",
            message: `Leave type "${policyForm.name}" created and automatically assigned to each employee for 1 Jan - 31 Dec 2026!`,
          });
          setIsPolicyModalOpen(false);
          loadData();
        } else {
          setNotification({ type: "error", message: result.error || "Failed to save policy." });
        }
      }
    } catch (err) {
      setNotification({ type: "error", message: "Failed to save leave policy." });
    } finally {
      setSavingPolicy(false);
    }
  };

  const openSanctionModal = (leave) => {
    setSelectedLeave(leave);
    setAdminNotes(leave.actionNotes || "");
  };

  const openCompOffSanctionModal = (claim) => {
    setSelectedCompOff(claim);
    setCompOffNotes(claim.actionNotes || "");
  };

  // Stats calculation - Leave Requests
  const totalRequests = leaves.length;
  const pendingRequests = leaves.filter((l) => l.status === "PENDING").length;
  const approvedRequests = leaves.filter((l) => l.status === "APPROVED").length;
  const rejectedRequests = leaves.filter((l) => l.status === "REJECTED").length;

  // Stats calculation - Comp Off Claims
  const totalCompOffs = compOffs.length;
  const pendingCompOffs = compOffs.filter((c) => c.status === "PENDING").length;
  const approvedCompOffs = compOffs.filter((c) => c.status === "APPROVED").length;
  const rejectedCompOffs = compOffs.filter((c) => c.status === "REJECTED").length;

  // Filter leaves
  const filteredLeaves = leaves.filter((leave) => {
    const matchesStatus = statusFilter === "ALL" || leave.status === statusFilter;
    const matchesSearch =
      leave.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.user?.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.leaveType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.inchargePerson?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Filter comp offs
  const filteredCompOffs = compOffs.filter((c) => {
    const matchesStatus = compOffStatusFilter === "ALL" || c.status === compOffStatusFilter;
    const matchesSearch =
      c.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.user?.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.reason?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Reset pagination on filter or search changes
  useEffect(() => {
    setRequestsPage(1);
  }, [statusFilter, searchTerm]);

  useEffect(() => {
    setCompOffPage(1);
  }, [compOffStatusFilter, searchTerm]);

  const paginatedLeaves = filteredLeaves.slice(
    (requestsPage - 1) * ITEMS_PER_PAGE,
    requestsPage * ITEMS_PER_PAGE
  );

  const paginatedCompOffs = filteredCompOffs.slice(
    (compOffPage - 1) * ITEMS_PER_PAGE,
    compOffPage * ITEMS_PER_PAGE
  );

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                Admin Workflow
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
              Leave Sanctions & Annual Policy
            </h1>
            <p className="text-sm text-slate-500">
              Sanction employee requests and manage type-wise annual leave quotas auto-assigned from 1 Jan to 31 Dec.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openAddPolicyModal}
              className="flex items-center gap-2 px-3.5 py-2 bg-linear-to-r from-rose-800 to-rose-900 hover:from-rose-700 hover:to-rose-800 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-950/20 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Leave Type Policy
            </button>
            <button
              onClick={loadData}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:border-slate-300 rounded-xl transition shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Notifications */}
        {notification.message && (
          <div
            className={`p-4 rounded-xl border text-sm flex items-center justify-between gap-2.5 animate-in fade-in ${
              notification.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-rose-50 border-rose-200 text-rose-800"
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === "success" ? (
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <span className="font-medium">{notification.message}</span>
            </div>
            <button onClick={() => setNotification({ type: "", message: "" })} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Top View Selector Tabs: Leave Requests vs Comp Off Claims vs Annual Policies */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab("requests")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === "requests"
                ? "bg-rose-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Leave Requests ({pendingRequests} Pending)</span>
          </button>

          <button
            onClick={() => setActiveTab("compoff")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === "compoff"
                ? "bg-rose-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Comp Off Claims ({pendingCompOffs} Pending)</span>
          </button>

          <button
            onClick={() => setActiveTab("policies")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === "policies"
                ? "bg-rose-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Annual Leave Policies (1 Jan - 31 Dec)</span>
          </button>

          <button
            onClick={() => setActiveTab("calendar")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === "calendar"
                ? "bg-rose-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Manage Monthly Calendar & Roster</span>
          </button>
        </div>

        {/* VIEW 1: LEAVE REQUESTS */}
        {activeTab === "requests" && (
          <div className="space-y-6 animate-in fade-in">
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                onClick={() => setStatusFilter("ALL")}
                className={`p-5 rounded-2xl border cursor-pointer transition ${
                  statusFilter === "ALL"
                    ? "bg-indigo-50/50 border-indigo-300 ring-2 ring-indigo-500/20"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Total Requests
                  </span>
                  <FileText className="w-4 h-4 text-slate-400" />
                </div>
                <div className="text-2xl font-bold text-slate-900 mt-2">{totalRequests}</div>
                <div className="text-[11px] text-slate-400 mt-1">All employee submissions</div>
              </div>

              <div
                onClick={() => setStatusFilter("PENDING")}
                className={`p-5 rounded-2xl border cursor-pointer transition ${
                  statusFilter === "PENDING"
                    ? "bg-amber-50/70 border-amber-300 ring-2 ring-amber-500/20"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                    Action Required
                  </span>
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl font-bold text-amber-900 mt-2">{pendingRequests}</div>
                <div className="text-[11px] text-amber-700 mt-1 font-medium">Pending sanction</div>
              </div>

              <div
                onClick={() => setStatusFilter("APPROVED")}
                className={`p-5 rounded-2xl border cursor-pointer transition ${
                  statusFilter === "APPROVED"
                    ? "bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/20"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                    Approved
                  </span>
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold text-emerald-900 mt-2">{approvedRequests}</div>
                <div className="text-[11px] text-emerald-700 mt-1 font-medium">Sanctioned leaves</div>
              </div>

              <div
                onClick={() => setStatusFilter("REJECTED")}
                className={`p-5 rounded-2xl border cursor-pointer transition ${
                  statusFilter === "REJECTED"
                    ? "bg-rose-50/70 border-rose-300 ring-2 ring-rose-500/20"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider">
                    Rejected
                  </span>
                  <XCircle className="w-4 h-4 text-rose-600" />
                </div>
                <div className="text-2xl font-bold text-rose-900 mt-2">{rejectedRequests}</div>
                <div className="text-[11px] text-rose-700 mt-1 font-medium">Denied requests</div>
              </div>
            </div>

            {/* Search & Tabs */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by employee, leave type, reason..."
                  className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>

              <div className="flex items-center gap-1.5 w-full md:w-auto bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setStatusFilter("PENDING")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    statusFilter === "PENDING"
                      ? "bg-white text-amber-800 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Pending ({pendingRequests})
                </button>
                <button
                  onClick={() => setStatusFilter("APPROVED")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    statusFilter === "APPROVED"
                      ? "bg-white text-emerald-800 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Approved ({approvedRequests})
                </button>
                <button
                  onClick={() => setStatusFilter("REJECTED")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    statusFilter === "REJECTED"
                      ? "bg-white text-rose-800 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Rejected ({rejectedRequests})
                </button>
                <button
                  onClick={() => setStatusFilter("ALL")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    statusFilter === "ALL"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  All
                </button>
              </div>
            </div>

            {/* Requests List */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-base">Employee Leave Applications</h3>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {filteredLeaves.length} displayed
                  </span>
                </div>
                <div className="text-xs text-slate-400">Review absence incharge, duration, and sanction</div>
              </div>

              {loading ? (
                <div className="p-12 text-center text-slate-400 text-xs">Loading leave requests...</div>
              ) : filteredLeaves.length === 0 ? (
                <div className="p-12 text-center text-slate-500 space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                    <CalendarCheck className="w-6 h-6" />
                  </div>
                  <div className="font-semibold text-slate-800 text-sm">No Leave Requests Found</div>
                  <p className="text-xs text-slate-400">
                    {statusFilter === "PENDING"
                      ? "All pending leave requests have been reviewed!"
                      : "No leave requests found for this filter."}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {paginatedLeaves.map((leave) => {
                    const isPending = leave.status === "PENDING";
                    const isApproved = leave.status === "APPROVED";
                    const isRejected = leave.status === "REJECTED";

                    return (
                      <div key={leave.id} className="p-6 hover:bg-slate-50/50 transition">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          {/* Left: Employee Info */}
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 ring-2 ring-indigo-500/10 shrink-0">
                              {leave.user?.avatarUrl ? (
                                <img src={leave.user.avatarUrl} alt={leave.user.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center font-bold text-indigo-700 bg-indigo-50">
                                  {leave.user?.name?.substring(0, 2).toUpperCase() || "EM"}
                                </div>
                              )}
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 text-sm">{leave.user?.name}</span>
                                <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                  {leave.user?.employeeId}
                                </span>
                                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-indigo-50 text-indigo-700">
                                  {leave.user?.designation}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                                <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                                  {leave.leaveType}
                                </span>
                                <span className="font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                                  {leave.daysCount} {leave.daysCount === 1 ? "day" : leave.daysCount === 0.5 ? "half-day" : "days"}
                                </span>
                                {leave.isHalfDay && (
                                  <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.2 rounded font-medium">
                                    {leave.halfDayType === "FIRST_HALF" ? "First Half (Morning)" : "Second Half (Afternoon)"}
                                  </span>
                                )}
                                <span className="flex items-center gap-1 text-slate-500">
                                  <Calendar className="w-3.5 h-3.5" />
                                  {new Date(leave.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} —{" "}
                                  {new Date(leave.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                </span>
                              </div>

                              {/* Absence incharge & Contact info */}
                              {(leave.inchargePerson || leave.contactDuringLeave || leave.documentName) && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100 max-w-2xl">
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
                                    <div className="sm:col-span-2 flex items-center gap-1 text-indigo-700 font-medium">
                                      <Paperclip className="w-3 h-3" />
                                      <span>Attached Document: {leave.documentName}</span>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Reason */}
                              <div className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100 max-w-2xl">
                                <span className="font-semibold text-slate-700">Reason:</span> {leave.reason}
                              </div>

                              {/* Admin Remarks if already sanctioned */}
                              {leave.actionNotes && (
                                <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
                                  <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                                  <span>Remarks ({leave.actionBy}): {leave.actionNotes}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Right: Status Badge & Action Controls */}
                          <div className="flex flex-col sm:flex-row lg:flex-col items-end gap-3 shrink-0">
                            <div>
                              {isPending && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                  <Clock className="w-3.5 h-3.5" />
                                  Pending Approval
                                </span>
                              )}
                              {isApproved && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  Approved
                                </span>
                              )}
                              {isRejected && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
                                  <XCircle className="w-3.5 h-3.5" />
                                  Rejected
                                </span>
                              )}
                            </div>

                            {/* Sanction Trigger */}
                            {isPending ? (
                              <button
                                onClick={() => openSanctionModal(leave)}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition cursor-pointer"
                              >
                                Sanction Leave
                              </button>
                            ) : (
                              <button
                                onClick={() => openSanctionModal(leave)}
                                className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline decoration-slate-300 cursor-pointer"
                              >
                                Update Decision
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <Pagination
                currentPage={requestsPage}
                totalItems={filteredLeaves.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setRequestsPage}
                itemLabel="leave requests"
              />
            </div>
          </div>
        )}

        {/* VIEW 2: COMP OFF CLAIMS & SANCTIONING */}
        {activeTab === "compoff" && (
          <div className="space-y-6 animate-in fade-in">
            {/* Comp Off Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                onClick={() => setCompOffStatusFilter("ALL")}
                className={`p-5 rounded-2xl border cursor-pointer transition ${
                  compOffStatusFilter === "ALL"
                    ? "bg-rose-50/50 border-rose-300 ring-2 ring-rose-500/20"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Claims</span>
                  <Award className="w-5 h-5 text-slate-400" />
                </div>
                <div className="mt-2 text-2xl font-bold text-slate-900">{totalCompOffs}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Off-day attendance claims</div>
              </div>

              <div
                onClick={() => setCompOffStatusFilter("PENDING")}
                className={`p-5 rounded-2xl border cursor-pointer transition ${
                  compOffStatusFilter === "PENDING"
                    ? "bg-amber-50/70 border-amber-300 ring-2 ring-amber-500/20"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Pending Sanction</span>
                  <Clock className="w-5 h-5 text-amber-500" />
                </div>
                <div className="mt-2 text-2xl font-bold text-amber-950">{pendingCompOffs}</div>
                <div className="text-[11px] text-amber-700 mt-0.5">Awaiting admin review</div>
              </div>

              <div
                onClick={() => setCompOffStatusFilter("APPROVED")}
                className={`p-5 rounded-2xl border cursor-pointer transition ${
                  compOffStatusFilter === "APPROVED"
                    ? "bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/20"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Approved (+1 Credited)</span>
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="mt-2 text-2xl font-bold text-emerald-950">{approvedCompOffs}</div>
                <div className="text-[11px] text-emerald-700 mt-0.5">+1 Comp Off added to balance</div>
              </div>

              <div
                onClick={() => setCompOffStatusFilter("REJECTED")}
                className={`p-5 rounded-2xl border cursor-pointer transition ${
                  compOffStatusFilter === "REJECTED"
                    ? "bg-rose-50/70 border-rose-300 ring-2 ring-rose-500/20"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider">Rejected</span>
                  <XCircle className="w-5 h-5 text-rose-500" />
                </div>
                <div className="mt-2 text-2xl font-bold text-rose-950">{rejectedCompOffs}</div>
                <div className="text-[11px] text-rose-700 mt-0.5">Not sanctioned for leave</div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                {["ALL", "PENDING", "APPROVED", "REJECTED"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setCompOffStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                      compOffStatusFilter === status
                        ? "bg-rose-900 text-white shadow-2xs"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {status === "ALL" ? "All Claims" : status.charAt(0) + status.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search employee, ID or reason..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Comp Off Claims List */}
            <div className="space-y-4">
              {filteredCompOffs.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-xs">
                  <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-200">
                    <Award className="w-7 h-7 text-rose-800" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">No Comp Off Claims Found</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    When employees attend office on weekends or official holidays, their claims for complementary leave will appear here for your sanction.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {paginatedCompOffs.map((claim) => {
                    const claimDate = new Date(claim.date);
                    const formattedDate = claimDate.toLocaleDateString("en-IN", {
                      weekday: "long",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    });

                    return (
                      <div
                        key={claim.id}
                        className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 p-5 shadow-xs transition"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          {/* Left: Employee Info */}
                          <div className="flex items-start gap-3.5">
                            <div className="w-11 h-11 rounded-xl bg-linear-to-tr from-rose-900 to-rose-700 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                              {claim.user?.name ? claim.user.name.charAt(0) : "E"}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-extrabold text-sm text-slate-900">{claim.user?.name || "Employee"}</span>
                                <span className="font-mono text-xs font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                                  {claim.user?.employeeId || "Digitech-Emp"}
                                </span>
                                <span className="text-xs text-slate-500">
                                  {claim.user?.designation || "Staff"} • {claim.user?.department || "General"}
                                </span>
                              </div>

                              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                                <span className="flex items-center gap-1 font-bold text-slate-800">
                                  <Calendar className="w-3.5 h-3.5 text-rose-700" />
                                  Worked On: {formattedDate}
                                </span>
                                <span className="flex items-center gap-1 text-emerald-800 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                                  <LogIn className="w-3 h-3 text-emerald-600" />
                                  In: {claim.entryTime}
                                </span>
                                <span className="flex items-center gap-1 text-emerald-800 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                                  <LogOut className="w-3 h-3 text-emerald-600" />
                                  Out: {claim.exitTime}
                                </span>
                                <span className="text-slate-500 font-medium">
                                  ({claim.hoursWorked} Hours Worked)
                                </span>
                              </div>

                              <div className="mt-3 p-3 bg-slate-50/80 rounded-xl border border-slate-100 text-xs text-slate-700">
                                <span className="font-bold text-slate-800">Duty / Task Details:</span> {claim.reason}
                              </div>

                              {claim.actionNotes && (
                                <div className="mt-2 text-xs text-slate-500 italic">
                                  <strong>Admin Remarks:</strong> {claim.actionNotes} ({claim.actionBy} on {claim.actionDate ? new Date(claim.actionDate).toLocaleDateString("en-IN") : ""})
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Right: Status & Sanction Actions */}
                          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                            <div>
                              {claim.status === "PENDING" && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
                                  <Clock className="w-3 h-3 text-amber-600" />
                                  Awaiting Sanction
                                </span>
                              )}
                              {claim.status === "APPROVED" && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-200">
                                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                                  Approved (+1 Day Credited)
                                </span>
                              )}
                              {claim.status === "REJECTED" && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-900 border border-rose-200">
                                  <XCircle className="w-3 h-3 text-rose-600" />
                                  Rejected
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              {claim.status === "PENDING" ? (
                                <button
                                  onClick={() => openCompOffSanctionModal(claim)}
                                  className="px-4 py-2 bg-linear-to-r from-rose-800 to-rose-900 hover:from-rose-700 hover:to-rose-800 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
                                >
                                  <ShieldCheck className="w-4 h-4" />
                                  Sanction Claim
                                </button>
                              ) : (
                                <button
                                  onClick={() => openCompOffSanctionModal(claim)}
                                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline decoration-slate-300 cursor-pointer"
                                >
                                  Update Decision
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <Pagination
                currentPage={compOffPage}
                totalItems={filteredCompOffs.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setCompOffPage}
                itemLabel="comp off claims"
              />
            </div>
          </div>
        )}

        {/* VIEW 3: ANNUAL LEAVE POLICIES (1 Jan - 31 Dec) */}
        {activeTab === "policies" && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <h3 className="font-bold text-base text-slate-900">
                    Annual Leave Policies & Quotas (1 Jan - 31 Dec)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Each leave type defined here is directly and automatically assigned to all employees for the annual cycle.
                </p>
              </div>

              <button
                onClick={openAddPolicyModal}
                className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-rose-800 to-rose-900 hover:from-rose-700 hover:to-rose-800 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer self-start"
              >
                <Plus className="w-4 h-4" />
                Add New Leave Policy
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {policies.map((pol) => (
                <div key={pol.id} className="p-5 rounded-2xl border border-slate-200/90 bg-slate-50/70 flex flex-col justify-between space-y-4 hover:border-rose-300 hover:shadow-xs transition group">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-lg">
                        {pol.code}
                      </span>
                      {/* Action buttons: Edit & Delete Policy */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditPolicyModal(pol)}
                          title="Edit Leave Policy & Quota"
                          className="p-1 text-slate-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePolicy(pol.id, pol.name)}
                          title="Delete Leave Policy"
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <h4 className="font-bold text-base text-slate-900">{pol.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {pol.description || "Company standard annual leave allocation."}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 uppercase font-semibold">Days / Year</span>
                      <div className="text-xl font-black text-rose-950">{pol.defaultDaysPerYear} Days</div>
                    </div>
                    <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                      1 Jan - 31 Dec Cycle
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 4: MANAGE MONTHLY CALENDAR & WORK ROSTER */}
        {activeTab === "calendar" && (
          <div className="space-y-6 animate-in fade-in">
            {/* CARD 1: Organization Weekly Off Rule Configuration */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">
                      Organization Weekly Off Configuration
                    </h3>
                    <p className="text-xs text-slate-500">
                      Configure standard non-working days. By default, all Sundays are holidays/off and remaining days are working days.
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold text-rose-900 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full w-fit">
                  Active Rule: {calendarSetting.weeklyOffDay === "SUNDAY" ? "All Sundays Off" : calendarSetting.weeklyOffDay === "SATURDAY_SUNDAY" ? "Saturday & Sunday Off" : "Sunday + Alt Saturdays"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                {[
                  {
                    id: "SUNDAY",
                    title: "Every Sunday (Default)",
                    desc: "All Sundays are weekly off. Mon - Sat are scheduled working days (6-day workweek).",
                  },
                  {
                    id: "SATURDAY_SUNDAY",
                    title: "Saturday & Sunday",
                    desc: "Both Saturday and Sunday are weekly off. Mon - Fri are working days (5-day workweek).",
                  },
                  {
                    id: "SUNDAY_ALT_SATURDAY",
                    title: "Every Sunday + Alternate Saturdays",
                    desc: "All Sundays off plus 2nd & 4th Saturdays off. Remaining days are regular working days.",
                  },
                ].map((opt) => {
                  const isSelected = calendarSetting.weeklyOffDay === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSaveCalendarSetting(opt.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                        isSelected
                          ? "bg-rose-50/70 border-rose-400 ring-2 ring-rose-500/20 shadow-xs"
                          : "bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-slate-900">{opt.title}</span>
                          {isSelected ? (
                            <span className="w-5 h-5 rounded-full bg-rose-700 text-white flex items-center justify-center text-xs font-black">
                              ✓
                            </span>
                          ) : (
                            <span className="w-4 h-4 rounded-full border border-slate-300" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{opt.desc}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-700">Click to apply</span>
                        {isSelected && <span className="font-black text-rose-800">Currently Active</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CARD 2: Interactive Monthly Calendar & Day-Wise Roster */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              {/* Header / Month Switcher */}
              <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-linear-to-r from-rose-950 via-slate-900 to-rose-950 text-white">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-rose-500/20 border border-rose-500/30 text-rose-200 rounded-xl">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-white">
                      Roster Calendar: {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][calendarMonth]} {calendarYear}
                    </h3>
                    <p className="text-xs text-slate-300">
                      Declare custom holidays or override any day as a working day. Syncs instantly with employees.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Month Dropdown */}
                  <select
                    value={calendarMonth}
                    onChange={(e) => setCalendarMonth(parseInt(e.target.value, 10))}
                    className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs rounded-xl px-3 py-2 cursor-pointer focus:outline-hidden"
                  >
                    {[
                      { v: 0, l: "January" }, { v: 1, l: "February" }, { v: 2, l: "March" },
                      { v: 3, l: "April" }, { v: 4, l: "May" }, { v: 5, l: "June" },
                      { v: 6, l: "July" }, { v: 7, l: "August" }, { v: 8, l: "September" },
                      { v: 9, l: "October" }, { v: 10, l: "November" }, { v: 11, l: "December" },
                    ].map((m) => (
                      <option key={m.v} value={m.v} className="text-slate-900 bg-white">
                        {m.l}
                      </option>
                    ))}
                  </select>

                  {/* Year Dropdown */}
                  <select
                    value={calendarYear}
                    onChange={(e) => setCalendarYear(parseInt(e.target.value, 10))}
                    className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs rounded-xl px-3 py-2 cursor-pointer focus:outline-hidden"
                  >
                    {[2025, 2026, 2027].map((y) => (
                      <option key={y} value={y} className="text-slate-900 bg-white">
                        {y}
                      </option>
                    ))}
                  </select>

                  {/* Add Holiday Button */}
                  <button
                    onClick={() => openAddHolidayModal()}
                    className="px-3.5 py-2 bg-rose-800 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Custom Holiday</span>
                  </button>
                </div>
              </div>

              {/* Day of Week Header */}
              <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-100 text-center text-xs font-black text-slate-600 py-3">
                <span className="text-rose-700">SUN (Weekly Off)</span>
                <span>MON</span>
                <span>TUE</span>
                <span>WED</span>
                <span>THU</span>
                <span>FRI</span>
                <span className="text-indigo-700">SAT</span>
              </div>

              {/* Calendar Grid of Month Days */}
              <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 bg-slate-50/30">
                {(() => {
                  const firstDayIndex = new Date(calendarYear, calendarMonth, 1).getDay();
                  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
                  const cells = [];

                  // Prev month padding
                  for (let i = 0; i < firstDayIndex; i++) {
                    cells.push(
                      <div key={`prev-${i}`} className="min-h-[110px] p-2 bg-slate-50/70 text-slate-300 flex flex-col justify-between">
                        <span className="text-xs font-medium"></span>
                      </div>
                    );
                  }

                  // Month days
                  for (let d = 1; d <= daysInMonth; d++) {
                    const dateObj = new Date(calendarYear, calendarMonth, d);
                    const dayOfWeek = dateObj.getDay();
                    const dateString = `${calendarYear}-${String(calendarMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

                    // Check default weekly off
                    let isDefaultWeeklyOff = false;
                    if (calendarSetting.weeklyOffDay === "SUNDAY") {
                      isDefaultWeeklyOff = dayOfWeek === 0;
                    } else if (calendarSetting.weeklyOffDay === "SATURDAY_SUNDAY") {
                      isDefaultWeeklyOff = dayOfWeek === 0 || dayOfWeek === 6;
                    } else if (calendarSetting.weeklyOffDay === "SUNDAY_ALT_SATURDAY") {
                      const weekNum = Math.ceil(d / 7);
                      isDefaultWeeklyOff = dayOfWeek === 0 || (dayOfWeek === 6 && (weekNum === 2 || weekNum === 4));
                    }

                    // Check holiday or override
                    const holiday = holidays.find((h) => h.date === dateString);
                    const isForcedWorkingDay = holiday && holiday.isWorkingDay === true;
                    const isDeclaredHoliday = holiday && holiday.isWorkingDay === false;

                    const isActualWorkingDay = isForcedWorkingDay || (!isDefaultWeeklyOff && !isDeclaredHoliday);

                    cells.push(
                      <div
                        key={`day-${d}`}
                        className={`min-h-[115px] p-2.5 flex flex-col justify-between transition ${
                          isDeclaredHoliday
                            ? "bg-rose-50/50 hover:bg-rose-50"
                            : isForcedWorkingDay
                            ? "bg-emerald-50/70 hover:bg-emerald-50"
                            : isDefaultWeeklyOff
                            ? "bg-slate-100/60 hover:bg-slate-100/90"
                            : "bg-white hover:bg-slate-50/80"
                        }`}
                      >
                        {/* Top: Day Number and Badge */}
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-black ${
                              dayOfWeek === 0
                                ? "text-rose-700"
                                : dayOfWeek === 6
                                ? "text-indigo-700"
                                : "text-slate-800"
                            }`}
                          >
                            {d}
                          </span>

                          <div>
                            {isDeclaredHoliday && (
                              <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-rose-200 text-rose-900 border border-rose-300">
                                Holiday
                              </span>
                            )}
                            {isForcedWorkingDay && (
                              <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-950 border border-emerald-300">
                                Working Day
                              </span>
                            )}
                            {!holiday && isDefaultWeeklyOff && (
                              <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                                Off Day
                              </span>
                            )}
                            {!holiday && !isDefaultWeeklyOff && (
                              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
                                Working
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Middle: Name of Holiday if present */}
                        <div className="mt-1 flex-1 flex flex-col justify-center">
                          {holiday ? (
                            <div
                              className={`p-1.5 rounded-lg border text-[10px] font-bold leading-tight ${
                                isForcedWorkingDay
                                  ? "bg-emerald-100 border-emerald-300 text-emerald-950"
                                  : "bg-rose-100 border-rose-300 text-rose-950"
                              }`}
                            >
                              <div className="flex items-center gap-1 truncate">
                                {isForcedWorkingDay ? (
                                  <Briefcase className="w-3 h-3 text-emerald-700 shrink-0" />
                                ) : (
                                  <Flag className="w-3 h-3 text-rose-700 shrink-0" />
                                )}
                                <span className="truncate">{holiday.name}</span>
                              </div>
                              <div className="text-[9px] opacity-75 font-medium mt-0.5">
                                {isForcedWorkingDay ? "Duty declared by Admin" : holiday.type}
                              </div>
                            </div>
                          ) : isDefaultWeeklyOff ? (
                            <div className="text-[10px] text-slate-500 font-medium italic text-center py-1">
                              Weekly Off
                            </div>
                          ) : (
                            <div className="text-[10px] text-emerald-800 font-medium text-center py-1">
                              Standard Office
                            </div>
                          )}
                        </div>

                        {/* Bottom: Quick Admin Controls */}
                        <div className="mt-2 pt-1 border-t border-black/5 flex items-center justify-between gap-1">
                          {isActualWorkingDay ? (
                            <button
                              type="button"
                              onClick={() => openAddHolidayModal(dateString)}
                              className="text-[9px] font-bold text-rose-800 hover:text-rose-950 hover:underline cursor-pointer"
                              title="Declare this day as a holiday"
                            >
                              + Holiday
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleToggleWorkingDay(dateString, false)}
                              className="text-[9px] font-bold text-emerald-800 hover:text-emerald-950 hover:underline cursor-pointer"
                              title="Declare this off-day as a mandatory working day"
                            >
                              Force Work
                            </button>
                          )}

                          {holiday && (
                            <button
                              type="button"
                              onClick={() => handleDeleteHoliday(holiday.id, holiday.name)}
                              className="text-[9px] text-slate-400 hover:text-rose-600 transition cursor-pointer"
                              title="Delete holiday / reset to default"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  }

                  return cells;
                })()}
              </div>

              {/* Roster Legend */}
              <div className="p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-4">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="font-bold text-slate-900">Roster Legend:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span>Regular Office Working Day</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-600" />
                    <span>Official / National / Festival Holiday</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-slate-400" />
                    <span>Weekly Off (Scheduled Non-Working)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-600" />
                    <span className="font-bold text-emerald-800">Special Working Day (Admin Override)</span>
                  </div>
                </div>

                <div className="text-slate-400 text-xs">
                  Active Year: {calendarYear}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: Sanction Dialog */}
        {selectedLeave && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
                    <CalendarCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">Sanction Leave Request</h3>
                    <p className="text-xs text-slate-500">Approve or reject employee leave</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedLeave(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Employee & Leave Summary */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">{selectedLeave.user?.name}</span>
                    <span className="font-mono text-xs text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {selectedLeave.user?.employeeId}
                    </span>
                  </div>
                  <div className="text-slate-600">
                    <span className="font-medium text-slate-800">{selectedLeave.user?.designation}</span> ({selectedLeave.user?.department})
                  </div>
                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-slate-700">
                    <span>
                      <strong>{selectedLeave.leaveType}</strong> ({selectedLeave.daysCount} {selectedLeave.daysCount === 0.5 ? "half-day" : "days"})
                    </span>
                    <span className="font-medium">
                      {new Date(selectedLeave.startDate).toLocaleDateString()} — {new Date(selectedLeave.endDate).toLocaleDateString()}
                    </span>
                  </div>

                  {selectedLeave.inchargePerson && (
                    <div className="text-slate-600">
                      <strong>Absence Incharge:</strong> {selectedLeave.inchargePerson}
                    </div>
                  )}

                  {selectedLeave.contactDuringLeave && (
                    <div className="text-slate-600">
                      <strong>Contact during leave:</strong> {selectedLeave.contactDuringLeave}
                    </div>
                  )}

                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="font-semibold text-slate-800">Reason:</span> {selectedLeave.reason}
                  </div>
                </div>

                {/* Remarks */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Admin Remarks / Sanction Notes (Optional)
                  </label>
                  <textarea
                    rows="3"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="e.g. Approved. Please handover pending sprints before leaving..."
                    className="w-full text-xs bg-white border border-slate-200 rounded-xl p-3 text-slate-900 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Approve vs Reject */}
                <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleSanctionAction(selectedLeave.id, "REJECTED")}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition disabled:opacity-60 cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject Leave
                  </button>

                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleSanctionAction(selectedLeave.id, "APPROVED")}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs shadow-emerald-300 transition disabled:opacity-60 cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve Leave
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: Add / Edit Leave Policy */}
        {isPolicyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-linear-to-r from-rose-950 via-slate-900 to-rose-950 text-white">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-500/20 border border-rose-500/30 text-rose-200 rounded-xl">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">
                      {editingPolicy ? "Edit Leave Policy & Quota" : "Add Leave Type Policy"}
                    </h3>
                    <p className="text-xs text-slate-300">Auto-assigns to all employees (1 Jan - 31 Dec)</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsPolicyModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSavePolicy} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Leave Type Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={policyForm.name}
                    onChange={(e) => setPolicyForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Maternity Leave / Compensatory Off"
                    required
                    className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Code (Short)
                    </label>
                    <input
                      type="text"
                      value={policyForm.code}
                      onChange={(e) => setPolicyForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
                      placeholder="e.g. ML"
                      maxLength={4}
                      className="w-full text-xs font-mono uppercase bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Annual Days Quota <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={policyForm.defaultDaysPerYear}
                      onChange={(e) => setPolicyForm((p) => ({ ...p, defaultDaysPerYear: parseFloat(e.target.value) || 0 }))}
                      placeholder="12"
                      required
                      min={1}
                      className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Policy Description
                  </label>
                  <textarea
                    rows="3"
                    value={policyForm.description}
                    onChange={(e) => setPolicyForm((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Describe purpose and eligibility rules..."
                    className="w-full text-xs bg-white border border-slate-200 rounded-xl p-3 text-slate-900 focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPolicyModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingPolicy}
                    className="px-5 py-2.5 bg-linear-to-r from-rose-800 to-rose-900 hover:from-rose-700 hover:to-rose-800 text-white font-bold text-xs rounded-xl shadow-xs transition disabled:opacity-60 cursor-pointer"
                  >
                    {savingPolicy
                      ? "Saving..."
                      : editingPolicy
                      ? "Update Policy & Balances"
                      : "Assign to All Employees"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* MODAL: Sanction Comp Off Claim */}
        {selectedCompOff && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-linear-to-r from-rose-950 via-slate-900 to-rose-950 text-white">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-500/20 border border-rose-500/30 text-rose-200 rounded-xl">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">Sanction Compensatory Off Claim</h3>
                    <p className="text-xs text-rose-200">
                      Off-Day Duty • Approving directly credits +1 leave day
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCompOff(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{selectedCompOff.user?.name}</h4>
                      <p className="text-xs text-slate-500">
                        {selectedCompOff.user?.employeeId} • {selectedCompOff.user?.department}
                      </p>
                    </div>
                    <span className="font-mono text-xs font-bold text-rose-900 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-lg">
                      {selectedCompOff.hoursWorked} Hours
                    </span>
                  </div>

                  <div className="text-xs text-slate-700 flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 border-t border-slate-200/60">
                    <span>
                      Date: <strong>{new Date(selectedCompOff.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</strong>
                    </span>
                    <span>
                      In: <strong>{selectedCompOff.entryTime}</strong> | Out: <strong>{selectedCompOff.exitTime}</strong>
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 pt-1">
                    <span className="font-semibold text-slate-800">Reason:</span> {selectedCompOff.reason}
                  </div>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    When you click <strong>Approve (+1 Comp Off Day)</strong>, exactly 1 complementary leave will be credited to this employee&apos;s annual leave balance for year 2026.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Admin Sanction Remarks / Notes (Optional)
                  </label>
                  <textarea
                    rows="3"
                    value={compOffNotes}
                    onChange={(e) => setCompOffNotes(e.target.value)}
                    placeholder="Enter approval notes or rejection rationale..."
                    className="w-full text-xs bg-white border border-slate-200 rounded-xl p-3 text-slate-900 focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    disabled={compOffActionLoading}
                    onClick={() => handleSanctionCompOff(selectedCompOff.id, "REJECTED")}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition disabled:opacity-60 cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject Claim
                  </button>

                  <button
                    type="button"
                    disabled={compOffActionLoading}
                    onClick={() => handleSanctionCompOff(selectedCompOff.id, "APPROVED")}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-linear-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs shadow-xs transition disabled:opacity-60 cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve (+1 Comp Off Day)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: Add Holiday / Working Day Override */}
        {isHolidayModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-linear-to-r from-rose-950 via-slate-900 to-rose-950 text-white">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-500/20 border border-rose-500/30 text-rose-200 rounded-xl">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">Calendar Override / Holiday</h3>
                    <p className="text-xs text-rose-200">
                      Configure official holiday or working day
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsHolidayModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveHoliday} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Holiday / Event Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={holidayForm.name}
                    onChange={(e) => setHolidayForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Independence Day, Annual Tech Day"
                    className="w-full text-xs bg-white border border-slate-200 rounded-xl p-3 text-slate-900 focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={holidayForm.date}
                    onChange={(e) => setHolidayForm((f) => ({ ...f, date: e.target.value }))}
                    className="w-full text-xs bg-white border border-slate-200 rounded-xl p-3 text-slate-900 focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Holiday Category
                  </label>
                  <select
                    value={holidayForm.type}
                    onChange={(e) => setHolidayForm((f) => ({ ...f, type: e.target.value }))}
                    className="w-full text-xs bg-white border border-slate-200 rounded-xl p-3 text-slate-900 focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="NATIONAL">National Holiday (Mandatory Gazetted)</option>
                    <option value="FESTIVAL">Festival Holiday</option>
                    <option value="COMPANY">Company Holiday / Foundation Day</option>
                    <option value="SPECIAL_DAY">Special Day</option>
                  </select>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={holidayForm.isWorkingDay}
                      onChange={(e) => setHolidayForm((f) => ({ ...f, isWorkingDay: e.target.checked }))}
                      className="w-4 h-4 rounded border-slate-300 text-rose-800 focus:ring-rose-500"
                    />
                    <span>Declare as Special Working Day (Duty Day)</span>
                  </label>
                  <p className="text-[11px] text-slate-500 mt-1 pl-6.5">
                    Check this if you want to turn a weekend off or festival day into an active duty day with standard punch-in expectations.
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsHolidayModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingHoliday}
                    className="px-5 py-2.5 bg-linear-to-r from-rose-800 to-rose-900 hover:from-rose-700 hover:to-rose-800 text-white font-bold text-xs rounded-xl shadow-xs transition disabled:opacity-60 cursor-pointer"
                  >
                    {savingHoliday ? "Saving..." : "Save Calendar Event"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
