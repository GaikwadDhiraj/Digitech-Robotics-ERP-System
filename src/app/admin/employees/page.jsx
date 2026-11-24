"use client";

import React, { useState, useEffect } from "react";
import DashboardShell from "@/components/DashboardShell";
import Pagination from "@/components/Pagination";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  Users,
  UserPlus,
  Search,
  Filter,
  Briefcase,
  Mail,
  Phone,
  Building,
  CheckCircle,
  AlertCircle,
  Edit2,
  Trash2,
  X,
  Shield,
  ShieldCheck,
  IndianRupee,
  Calendar,
  Sparkles,
  ChevronRight,
  Eye,
  CalendarDays,
  FileBadge,
  MapPin,
  Landmark,
  Power,
  ToggleLeft,
  ToggleRight,
  UserCheck,
  UserX,
  Lock,
  Unlock,
  Download,
  ExternalLink,
  FileText,
} from "lucide-react";

export default function AdminEmployeesPage() {
  const { employees, refreshUsers } = useAuth();
  const [employeeList, setEmployeeList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [selectedDesignation, setSelectedDesignation] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 15;

  // Modals
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [viewingProfile, setViewingProfile] = useState(null);
  const [viewingLeaveHistory, setViewingLeaveHistory] = useState(null);
  const [leaveHistoryRecords, setLeaveHistoryRecords] = useState([]);
  const [loadingLeaves, setLoadingLeaves] = useState(false);

  const [notification, setNotification] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  // Form State with all profile fields
  const [formData, setFormData] = useState({
    name: "",
    email: "", // Official Email
    personalEmail: "",
    phone: "",
    employeeId: "",
    department: "Engineering",
    designation: "",
    role: "EMPLOYEE",
    status: "ACTIVE", // Activate / Deactivate
    salary: "", // Annual CTC
    joinDate: "",
    dob: "",
    gender: "Male",
    maritalStatus: "Single",
    bloodGroup: "O+",
    aadharNumber: "",
    panNumber: "",
    residentialAddress: "",
    communicationAddress: "",
    bankAccountName: "",
    bankAccountNumber: "",
    bankIfscCode: "",
    bankName: "",
    emergencyContact: "",
    bio: "",
  });

  const [departmentsList, setDepartmentsList] = useState([]);

  useEffect(() => {
    setEmployeeList(employees);
  }, [employees]);

  useEffect(() => {
    fetch("/api/departments")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setDepartmentsList(data.data);
        }
      })
      .catch((err) => console.error("Error loading departments:", err));
  }, []);

  // Unique designations for filter dropdown
  const uniqueDesignations = Array.from(
    new Set(employeeList.map((e) => e.designation).filter(Boolean))
  );

  const departments = [
    "ALL",
    ...(departmentsList.length > 0
      ? departmentsList.map((d) => d.name)
      : ["Admin Department", "Robotics Engineering", "Industrial Automation", "Software Development", "Operations & HR", "Research & Development"]),
  ];
  if (!departments.includes("Admin Department")) {
    departments.splice(1, 0, "Admin Department");
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setEditingEmployee(null);
    const joinToday = new Date().toISOString().substring(0, 10);
    const yearShort = (new Date(joinToday).getFullYear() % 100).toString().padStart(2, "0");
    const count = employeeList.length + 1;
    const generatedId = `DG-${yearShort}-${String(count).padStart(4, "0")}`;
    const defaultDept = departmentsList.find((d) => d.name !== "Admin Department")?.name || "Robotics Engineering";
    setFormData({
      name: "",
      email: "",
      personalEmail: "",
      phone: "",
      employeeId: generatedId,
      department: defaultDept,
      designation: "",
      role: "EMPLOYEE",
      status: "ACTIVE",
      salary: "",
      joinDate: joinToday,
      dob: "",
      gender: "Male",
      maritalStatus: "Single",
      bloodGroup: "O+",
      aadharNumber: "",
      panNumber: "",
      residentialAddress: "",
      communicationAddress: "",
      bankAccountName: "",
      bankAccountNumber: "",
      bankIfscCode: "",
      bankName: "",
      emergencyContact: "",
      bio: "",
    });
    setIsAddEditModalOpen(true);
  };

  const handleUnlockBank = async (id, name) => {
    try {
      const res = await fetch(`/api/employees/${id}/unlock-bank`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setNotification({
          type: "success",
          message: `Bank account details successfully unlocked for ${name}! Employee can now edit details.`,
        });
        if (viewingProfile && viewingProfile.id === id) {
          setViewingProfile((prev) => ({
            ...prev,
            bankDetailsLocked: false,
            bankEditRequested: false,
          }));
        }
        refreshUsers();
      } else {
        setNotification({ type: "error", message: data.error || "Failed to unlock bank details." });
      }
    } catch (e) {
      setNotification({ type: "error", message: "Failed to unlock bank details." });
    }
  };

  const openEditModal = (emp) => {
    setEditingEmployee(emp);
    setFormData({
      name: emp.name || "",
      email: emp.email || "",
      personalEmail: emp.personalEmail || "",
      phone: emp.phone || "",
      employeeId: emp.employeeId || "",
      department: emp.department || "Engineering",
      designation: emp.designation || "",
      role: emp.role || "EMPLOYEE",
      status: emp.status || "ACTIVE",
      salary: emp.salary ? String(emp.salary) : "",
      joinDate: emp.joinDate ? emp.joinDate.substring(0, 10) : "",
      dob: emp.dob ? emp.dob.substring(0, 10) : "",
      gender: emp.gender || "Male",
      maritalStatus: emp.maritalStatus || "Single",
      bloodGroup: emp.bloodGroup || "O+",
      aadharNumber: emp.aadharNumber || "",
      panNumber: emp.panNumber || "",
      residentialAddress: emp.residentialAddress || "",
      communicationAddress: emp.communicationAddress || "",
      bankAccountName: emp.bankAccountName || emp.name || "",
      bankAccountNumber: emp.bankAccountNumber || "",
      bankIfscCode: emp.bankIfscCode || "",
      bankName: emp.bankName || "",
      emergencyContact: emp.emergencyContact || "",
      bio: emp.bio || "",
    });
    setIsAddEditModalOpen(true);
  };

  const handleSaveEmployee = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.designation) {
      setNotification({ type: "error", message: "Please fill Name, Official Email, and Designation." });
      return;
    }

    setSubmitting(true);
    setNotification({ type: "", message: "" });

    try {
      if (editingEmployee) {
        // Update employee
        const res = await fetch(`/api/employees/${editingEmployee.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const result = await res.json();
        if (result.success) {
          setNotification({ type: "success", message: `Updated details and designation for ${formData.name}.` });
          setIsAddEditModalOpen(false);
          refreshUsers();
        } else {
          setNotification({ type: "error", message: result.error || "Failed to update employee." });
        }
      } else {
        // Add new employee
        const res = await fetch("/api/employees", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const result = await res.json();
        if (result.success) {
          const successMsg = formData.role === "ADMIN"
            ? `Administrator ${formData.name} added successfully with Admin access!`
            : `New employee ${formData.name} added successfully with designation.`;
          setNotification({ type: "success", message: successMsg });
          setIsAddEditModalOpen(false);
          refreshUsers();
        } else {
          setNotification({ type: "error", message: result.error || "Failed to add employee." });
        }
      }
    } catch (err) {
      setNotification({ type: "error", message: "An unexpected error occurred." });
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle Activate / Deactivate Employee
  const handleToggleStatus = async (emp) => {
    try {
      const res = await fetch(`/api/employees/${emp.id}/toggle-status`, { method: "POST" });
      const result = await res.json();
      if (result.success) {
        setNotification({
          type: "success",
          message: `Employee ${emp.name} is now marked as ${result.data.status}.`,
        });
        refreshUsers();
      }
    } catch (err) {
      setNotification({ type: "error", message: "Failed to toggle status." });
    }
  };

  const handleDeleteEmployee = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete employee ${name}?`)) return;
    try {
      const res = await fetch(`/api/employees/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        setNotification({ type: "success", message: `Employee ${name} permanently deleted.` });
        refreshUsers();
      }
    } catch (err) {
      setNotification({ type: "error", message: "Failed to delete employee." });
    }
  };

  // Open Leave History Modal for specific employee
  const openLeaveHistoryModal = async (emp) => {
    setViewingLeaveHistory(emp);
    setLoadingLeaves(true);
    try {
      const res = await fetch(`/api/leaves?userId=${emp.id}`);
      const data = await res.json();
      if (data.success) {
        setLeaveHistoryRecords(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLeaves(false);
    }
  };

  // Filter employees by Search, Department, and Designation
  const filteredEmployees = employeeList.filter((emp) => {
    const matchesSearch =
      emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.personalEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.phone?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = selectedDept === "ALL" || emp.department === selectedDept;
    const matchesDesignation = selectedDesignation === "ALL" || emp.designation === selectedDesignation;

    return matchesSearch && matchesDept && matchesDesignation;
  });

  // Reset to page 1 whenever search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDept, selectedDesignation]);

  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                Admin Console
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
              Employee Management
            </h1>
            <p className="text-sm text-slate-500">
              Add employees, assign designation & CTC, activate/deactivate accounts, and inspect full profiles & leave histories.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs shadow-indigo-300 transition-all self-start sm:self-auto cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            Add New Employee
          </button>
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
            <div className="flex items-center gap-2.5">
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

        {/* Filters, Search & Designation Dropdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, ID, email, phone..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              />
            </div>

            {/* Filter by Designation */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs font-semibold text-slate-500 shrink-0 flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5" /> Designation:
              </span>
              <select
                value={selectedDesignation}
                onChange={(e) => setSelectedDesignation(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">All Designations ({uniqueDesignations.length})</option>
                {uniqueDesignations.map((desig) => (
                  <option key={desig} value={desig}>{desig}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Department Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Department:
            </span>
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  selectedDept === dept
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Employees Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-base">Workforce Directory</h3>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                {filteredEmployees.length} active records
              </span>
            </div>
            <div className="text-xs text-slate-400">Manage designations, activate profiles, or view leave logs</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-6">Employee</th>
                  <th className="py-3.5 px-4">Designation</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Annual CTC</th>
                  <th className="py-3.5 px-4">Status / Activation</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400">
                      No employees match your search or filter criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedEmployees.map((emp) => {
                    const isActive = emp.status === "ACTIVE";
                    return (
                      <tr key={emp.id} className="hover:bg-slate-50/60 transition group">
                        {/* Name & Avatar */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 ring-2 ring-indigo-500/10 shrink-0 flex items-center justify-center">
                              {emp.avatarUrl ? (
                                <img src={emp.avatarUrl} alt={emp.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-500 bg-slate-100">
                                  <User className="w-5 h-5 text-slate-500" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition">
                                  {emp.name}
                                </span>
                                {emp.role === "ADMIN" && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-850 border border-rose-300 flex items-center gap-1 shadow-2xs">
                                    <ShieldCheck className="w-3 h-3 text-rose-700" /> Admin
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 mt-0.5">
                                <span className="bg-slate-100 px-1.5 py-0.2 rounded font-medium">{emp.employeeId}</span>
                                <span>•</span>
                                <span>{emp.email}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Designation */}
                        <td className="py-4 px-4">
                          <span className="font-semibold text-slate-900 bg-indigo-50/70 text-indigo-900 px-2.5 py-1 rounded-lg border border-indigo-100">
                            {emp.designation || "Not Assigned"}
                          </span>
                        </td>

                        {/* Department */}
                        <td className="py-4 px-4 font-medium text-slate-600">
                          {emp.department}
                        </td>

                        {/* Annual CTC */}
                        <td className="py-4 px-4 font-mono font-semibold text-slate-800">
                          ₹{Number(emp.salary || 0).toLocaleString("en-IN")}
                        </td>

                        {/* Status & Activation Toggle */}
                        <td className="py-4 px-4">
                          <button
                            onClick={() => handleToggleStatus(emp)}
                            title={isActive ? "Click to Deactivate profile" : "Click to Activate profile"}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                              isActive
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                                : "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                            }`}
                          >
                            {isActive ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                            <span>{isActive ? "Active" : "Inactive"}</span>
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* View Full Profile */}
                            <button
                              onClick={() => setViewingProfile(emp)}
                              title="View Full Profile Details"
                              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* View Leave History */}
                            <button
                              onClick={() => openLeaveHistoryModal(emp)}
                              title="View Employee Leave History"
                              className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                            >
                              <CalendarDays className="w-4 h-4" />
                            </button>

                            {/* Edit Employee & Designation */}
                            <button
                              onClick={() => openEditModal(emp)}
                              title="Edit Designation & Info"
                              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            {/* Delete Employee / Admin (Protect Super Admin) */}
                            {emp.email?.toLowerCase() !== "dvgaikwad333@gmail.com" && (
                              <button
                                onClick={() => handleDeleteEmployee(emp.id, emp.name)}
                                title={emp.role === "ADMIN" ? "Delete Admin Account" : "Delete Employee"}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={filteredEmployees.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
            itemLabel="employees"
          />
        </div>

        {/* MODAL 1: Add or Edit Employee (All Requested Fields) */}
        {isAddEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">
                      {editingEmployee ? "Edit Employee & Designation" : "Add New Employee"}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Complete official credentials, assign designation, annual CTC, and activate profile.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddEditModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEmployee} className="p-6 space-y-6">
                {/* 1. Official & Organization Info */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-indigo-100">
                    <Briefcase className="w-4 h-4" /> Role, Organization & Designation Setup
                  </h4>

                  {/* Role Selector: Employee vs Administrator */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                    <label className="block text-xs font-bold text-slate-800 mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Shield className="w-4 h-4 text-rose-700" />
                        System Role (Admin Access Privilege) <span className="text-rose-500">*</span>
                      </span>
                      <span className="text-[11px] text-slate-500 font-normal">
                        Select whether this user is an Employee or System Administrator
                      </span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            role: "EMPLOYEE",
                            department: prev.department === "Admin Department" ? (departmentsList.find((d) => d.name !== "Admin Department")?.name || "Robotics Engineering") : prev.department,
                          }));
                        }}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition cursor-pointer ${
                          formData.role !== "ADMIN"
                            ? "bg-white border-indigo-500 text-indigo-950 shadow-xs ring-2 ring-indigo-500/20"
                            : "bg-white/60 border-slate-200 text-slate-600 hover:bg-white"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          formData.role !== "ADMIN" ? "bg-indigo-100 text-indigo-700 font-bold" : "bg-slate-100 text-slate-400"
                        }`}>
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-xs">Standard Employee</div>
                          <div className="text-[10px] text-slate-500">Access Employee Portal, profile, leaves & calendar</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            role: "ADMIN",
                            department: "Admin Department",
                            designation: prev.designation && prev.designation !== "Associate" ? prev.designation : "System Administrator",
                          }));
                        }}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition cursor-pointer ${
                          formData.role === "ADMIN"
                            ? "bg-rose-50 border-rose-600 text-rose-950 shadow-xs ring-2 ring-rose-500/20"
                            : "bg-white/60 border-slate-200 text-slate-600 hover:bg-white"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          formData.role === "ADMIN" ? "bg-rose-100 text-rose-800 font-bold" : "bg-slate-100 text-slate-400"
                        }`}>
                          <ShieldCheck className="w-4 h-4 text-rose-700" />
                        </div>
                        <div>
                          <div className="font-bold text-xs text-rose-900">System Administrator</div>
                          <div className="text-[10px] text-rose-700">Full Admin Console, add admins/employees & sanctions</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Employee ID <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="employeeId"
                        value={formData.employeeId}
                        onChange={handleInputChange}
                        required
                        className="w-full text-xs font-mono bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Designation (Admin Assigns) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="designation"
                        value={formData.designation}
                        onChange={handleInputChange}
                        placeholder={formData.role === "ADMIN" ? "e.g. System Administrator, Director" : "e.g. Lead Full Stack Engineer"}
                        required
                        className="w-full text-xs font-bold bg-white border border-slate-200 rounded-xl px-3 py-2 text-indigo-900 focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                        <span>Department</span>
                        <span className="text-[10px] text-rose-700 font-bold">From Organization</span>
                      </label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            department: val,
                            role: val === "Admin Department" || val === "Administration" ? "ADMIN" : prev.role,
                          }));
                        }}
                        className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-rose-500 font-medium"
                      >
                        <option value="Admin Department">Admin Department (ADM)</option>
                        {departmentsList.filter((d) => d.name !== "Admin Department" && d.name !== "Administration").map((d) => (
                          <option key={d.id} value={d.name}>
                            {d.name} ({d.code})
                          </option>
                        ))}
                        {departmentsList.length === 0 && (
                          <>
                            <option value="Robotics Engineering">Robotics Engineering (ROB-ENG)</option>
                            <option value="Industrial Automation">Industrial Automation (IND-AUTO)</option>
                            <option value="Software Development">Software Development (SFT-DEV)</option>
                            <option value="Operations & HR">Operations & HR (OPS-HR)</option>
                            <option value="Research & Development">Research & Development (RND-DEPT)</option>
                          </>
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                        <IndianRupee className="w-3 h-3 text-emerald-600" />
                        <span>Annual Salary (CTC in ₹ INR)</span>
                      </label>
                      <input
                        type="number"
                        name="salary"
                        value={formData.salary}
                        onChange={handleInputChange}
                        placeholder="e.g. 1200000 (₹12 LPA)"
                        className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-rose-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Account Status (Activate Profile)
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full text-xs font-bold bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="ACTIVE">ACTIVE (Profile Activated)</option>
                        <option value="INACTIVE">INACTIVE (Deactivated)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Date of Joining
                      </label>
                      <input
                        type="date"
                        name="joinDate"
                        value={formData.joinDate}
                        onChange={handleInputChange}
                        className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Personal Information */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
                    <Users className="w-4 h-4 text-indigo-600" /> Personal Details
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. John Doe"
                        required
                        className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Official Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john.doe@digitech.com"
                        required
                        className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Personal Email Address
                      </label>
                      <input
                        type="email"
                        name="personalEmail"
                        value={formData.personalEmail}
                        onChange={handleInputChange}
                        placeholder="john.personal@gmail.com"
                        className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Phone / Contact Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-rose-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Date of Birth (DOB)
                      </label>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleInputChange}
                        className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Marital Status
                      </label>
                      <select
                        name="maritalStatus"
                        value={formData.maritalStatus}
                        onChange={handleInputChange}
                        className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                      >
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Blood Group
                      </label>
                      <select
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleInputChange}
                        className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                      >
                        {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Emergency Contact
                      </label>
                      <input
                        type="text"
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={handleInputChange}
                        placeholder="e.g. Ramesh Gaikwad (+91 98765 43210)"
                        className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Statutory KYC */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
                    <FileBadge className="w-4 h-4 text-rose-600" /> Statutory KYC (Aadhaar &amp; PAN)
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        12-Digit Aadhaar Number
                      </label>
                      <input
                        type="text"
                        name="aadharNumber"
                        value={formData.aadharNumber}
                        onChange={handleInputChange}
                        placeholder="5432 1098 7654 (12 digits)"
                        className="w-full text-xs font-mono bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        10-Character PAN Number
                      </label>
                      <input
                        type="text"
                        name="panNumber"
                        value={formData.panNumber}
                        onChange={handleInputChange}
                        placeholder="ABCDE1234F (10 characters)"
                        className="w-full text-xs font-mono uppercase bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Residential & Communication Addresses */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
                    <MapPin className="w-4 h-4 text-rose-600" /> Addresses
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Residential Address (Permanent)
                      </label>
                      <textarea
                        name="residentialAddress"
                        rows="2"
                        value={formData.residentialAddress}
                        onChange={handleInputChange}
                        placeholder="e.g. Flat 402, Shivajinagar, Pune, Maharashtra 411005"
                        className="w-full text-xs bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Communication Address (Present)
                      </label>
                      <textarea
                        name="communicationAddress"
                        rows="2"
                        value={formData.communicationAddress}
                        onChange={handleInputChange}
                        placeholder="e.g. Flat 402, Shivajinagar, Pune, Maharashtra 411005"
                        className="w-full text-xs bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Bank Account Details */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
                    <Landmark className="w-4 h-4 text-emerald-600" /> Bank Account Details (Disbursements)
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Account Holder Name
                      </label>
                      <input
                        type="text"
                        name="bankAccountName"
                        value={formData.bankAccountName}
                        onChange={handleInputChange}
                        placeholder="Name as per passbook"
                        className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleInputChange}
                        placeholder="e.g. State Bank of India / HDFC Bank"
                        className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Account Number
                      </label>
                      <input
                        type="text"
                        name="bankAccountNumber"
                        value={formData.bankAccountNumber}
                        onChange={handleInputChange}
                        placeholder="e.g. 123456789012"
                        className="w-full text-xs font-mono bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        IFSC Code
                      </label>
                      <input
                        type="text"
                        name="bankIfscCode"
                        value={formData.bankIfscCode}
                        onChange={handleInputChange}
                        placeholder="e.g. SBIN0001234 / HDFC0004567"
                        className="w-full text-xs font-mono uppercase bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 sticky bottom-0 bg-white py-3">
                  <button
                    type="button"
                    onClick={() => setIsAddEditModalOpen(false)}
                    className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs shadow-indigo-300 transition cursor-pointer disabled:opacity-60"
                  >
                    {submitting ? "Saving..." : editingEmployee ? "Update Employee" : "Create Employee"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: View Full Employee Profile */}
        {viewingProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-100 ring-2 ring-indigo-500/20 shrink-0 shadow-xs flex items-center justify-center">
                    {viewingProfile.avatarUrl ? (
                      <img src={viewingProfile.avatarUrl} alt={viewingProfile.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500 bg-slate-100">
                        <User className="w-7 h-7 text-slate-500" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{viewingProfile.name}</h3>
                    <p className="text-xs text-indigo-600 font-semibold">{viewingProfile.designation}</p>
                  </div>
                </div>
                <button
                  onClick={() => setViewingProfile(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-5 text-xs">
                {/* Employment & CTC Summary */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Employee ID</span>
                    <div className="font-mono font-bold text-slate-800">{viewingProfile.employeeId}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Department</span>
                    <div className="font-bold text-slate-800">{viewingProfile.department}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Annual CTC</span>
                    <div className="font-bold text-emerald-700">₹{Number(viewingProfile.salary || 0).toLocaleString("en-IN")}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Status</span>
                    <div className={`font-bold ${viewingProfile.status === "ACTIVE" ? "text-emerald-700" : "text-rose-700"}`}>
                      {viewingProfile.status}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Official Email</span>
                    <div className="text-slate-800 truncate">{viewingProfile.email}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Role & Access</span>
                    <div className="font-bold">
                      {viewingProfile.role === "ADMIN" ? (
                        <span className="text-rose-700 flex items-center gap-1 font-bold">
                          <ShieldCheck className="w-3.5 h-3.5 text-rose-700" /> Administrator
                        </span>
                      ) : (
                        <span className="text-slate-700 font-medium">Standard Employee</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Personal Email</span>
                    <div className="text-slate-800 truncate">{viewingProfile.personalEmail || "—"}</div>
                  </div>
                </div>

                {/* Personal & Demographics */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="font-bold text-slate-900 border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-indigo-600" /> Personal Details
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase">DOB</span>
                      <div className="font-medium text-slate-700">{viewingProfile.dob ? new Date(viewingProfile.dob).toLocaleDateString() : "—"}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase">Gender</span>
                      <div className="font-medium text-slate-700">{viewingProfile.gender || "—"}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase">Marital Status</span>
                      <div className="font-medium text-slate-700">{viewingProfile.maritalStatus || "—"}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase">Blood Group</span>
                      <div className="font-bold text-rose-600">{viewingProfile.bloodGroup || "—"}</div>
                    </div>
                  </div>
                </div>

                {/* Statutory KYC */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="font-bold text-slate-900 border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                    <FileBadge className="w-3.5 h-3.5 text-purple-600" /> Statutory KYC Credentials
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-1">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase">Aadhaar Card Number</span>
                      <div className="font-mono font-bold text-slate-800">{viewingProfile.aadharNumber || "Not Provided"}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase">PAN Card Number</span>
                      <div className="font-mono font-bold text-slate-800">{viewingProfile.panNumber || "Not Provided"}</div>
                    </div>
                  </div>
                </div>

                {/* Addresses */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="font-bold text-slate-900 border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600" /> Address Records
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase">Residential Address</span>
                      <div className="text-slate-700 mt-0.5">{viewingProfile.residentialAddress || "—"}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase">Communication Address</span>
                      <div className="text-slate-700 mt-0.5">{viewingProfile.communicationAddress || "—"}</div>
                    </div>
                  </div>
                </div>

                {/* Bank Account Details & Lock Management */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Landmark className="w-3.5 h-3.5 text-emerald-600" /> Bank Account Details
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                          viewingProfile.bankDetailsLocked
                            ? "bg-amber-100 text-amber-900 border border-amber-300"
                            : "bg-emerald-100 text-emerald-900 border border-emerald-300"
                        }`}
                      >
                        {viewingProfile.bankDetailsLocked ? (
                          <>
                            <Lock className="w-2.5 h-2.5" /> Locked
                          </>
                        ) : (
                          <>
                            <Unlock className="w-2.5 h-2.5" /> Unlocked
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {viewingProfile.bankEditRequested && (
                    <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2 animate-in fade-in">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-xs">Unlock Request Pending</div>
                          <div className="text-[11px] text-amber-800">
                            Employee requested permission to update their bank account details.
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleUnlockBank(viewingProfile.id, viewingProfile.name)}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        <Unlock className="w-3 h-3" />
                        Grant Unlock Access
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase">Account Holder</span>
                      <div className="font-medium text-slate-800">{viewingProfile.bankAccountName || viewingProfile.name}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase">Bank Name</span>
                      <div className="font-medium text-slate-800">{viewingProfile.bankName || "—"}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase">Account Number</span>
                      <div className="font-mono font-bold text-slate-800">{viewingProfile.bankAccountNumber || "—"}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase">IFSC Code</span>
                      <div className="font-mono font-bold text-slate-800">{viewingProfile.bankIfscCode || "—"}</div>
                    </div>
                  </div>

                  {viewingProfile.bankDetailsLocked && !viewingProfile.bankEditRequested && (
                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleUnlockBank(viewingProfile.id, viewingProfile.name)}
                        className="text-[11px] font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer"
                      >
                        <Unlock className="w-3 h-3" />
                        Unlock for Employee Modification
                      </button>
                    </div>
                  )}
                </div>

                {/* 6. Employee Uploaded Documents */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 space-y-3">
                  <div className="font-bold text-slate-900 border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-rose-600" /> Employee Uploaded Documents
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {/* Resume */}
                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileText className="w-4 h-4 text-rose-700 shrink-0" />
                        <div className="truncate">
                          <div className="font-bold text-[11px] text-slate-900">Curriculum Vitae (Resume)</div>
                          <div className="text-[10px] text-slate-500 truncate">
                            {viewingProfile.resumeName || (viewingProfile.resumeUrl ? "Resume.pdf" : "Not uploaded yet")}
                          </div>
                        </div>
                      </div>
                      {viewingProfile.resumeUrl ? (
                        <a
                          href={viewingProfile.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          download={viewingProfile.resumeName || "Resume.pdf"}
                          className="px-2.5 py-1 text-[10px] font-bold text-white bg-rose-800 hover:bg-rose-900 rounded-lg flex items-center gap-1 shadow-2xs"
                        >
                          <Download className="w-3 h-3" /> View
                        </a>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-medium">Pending</span>
                      )}
                    </div>

                    {/* Aadhaar Document */}
                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileBadge className="w-4 h-4 text-purple-700 shrink-0" />
                        <div className="truncate">
                          <div className="font-bold text-[11px] text-slate-900">Aadhaar Card Document</div>
                          <div className="text-[10px] text-slate-500 truncate">
                            {viewingProfile.aadharDocName || (viewingProfile.aadharDocUrl ? "Aadhaar.pdf" : "Not uploaded yet")}
                          </div>
                        </div>
                      </div>
                      {viewingProfile.aadharDocUrl ? (
                        <a
                          href={viewingProfile.aadharDocUrl}
                          target="_blank"
                          rel="noreferrer"
                          download={viewingProfile.aadharDocName || "Aadhaar_Document"}
                          className="px-2.5 py-1 text-[10px] font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-lg flex items-center gap-1 shadow-2xs"
                        >
                          <Download className="w-3 h-3" /> View
                        </a>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-medium">Pending</span>
                      )}
                    </div>

                    {/* PAN Card Document */}
                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileBadge className="w-4 h-4 text-indigo-700 shrink-0" />
                        <div className="truncate">
                          <div className="font-bold text-[11px] text-slate-900">PAN Card Document</div>
                          <div className="text-[10px] text-slate-500 truncate">
                            {viewingProfile.panDocName || (viewingProfile.panDocUrl ? "PAN.pdf" : "Not uploaded yet")}
                          </div>
                        </div>
                      </div>
                      {viewingProfile.panDocUrl ? (
                        <a
                          href={viewingProfile.panDocUrl}
                          target="_blank"
                          rel="noreferrer"
                          download={viewingProfile.panDocName || "PAN_Document"}
                          className="px-2.5 py-1 text-[10px] font-bold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg flex items-center gap-1 shadow-2xs"
                        >
                          <Download className="w-3 h-3" /> View
                        </a>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-medium">Pending</span>
                      )}
                    </div>

                    {/* Bank Passbook / Cheque Document */}
                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <Landmark className="w-4 h-4 text-emerald-700 shrink-0" />
                        <div className="truncate">
                          <div className="font-bold text-[11px] text-slate-900">Cancelled Cheque / Passbook</div>
                          <div className="text-[10px] text-slate-500 truncate">
                            {viewingProfile.bankDocName || (viewingProfile.bankDocUrl ? "BankDoc.pdf" : "Not uploaded yet")}
                          </div>
                        </div>
                      </div>
                      {viewingProfile.bankDocUrl ? (
                        <a
                          href={viewingProfile.bankDocUrl}
                          target="_blank"
                          rel="noreferrer"
                          download={viewingProfile.bankDocName || "Bank_Document"}
                          className="px-2.5 py-1 text-[10px] font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg flex items-center gap-1 shadow-2xs"
                        >
                          <Download className="w-3 h-3" /> View
                        </a>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-medium">Pending</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 3: View Employee Leave History */}
        {viewingLeaveHistory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Leave History: {viewingLeaveHistory.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {viewingLeaveHistory.designation} • {viewingLeaveHistory.employeeId}
                  </p>
                </div>
                <button
                  onClick={() => setViewingLeaveHistory(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {loadingLeaves ? (
                  <div className="py-8 text-center text-xs text-slate-400">Loading leave records...</div>
                ) : leaveHistoryRecords.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No leave requests on record for this employee.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {leaveHistoryRecords.map((l) => (
                      <div key={l.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{l.leaveType}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            l.status === "APPROVED"
                              ? "bg-emerald-100 text-emerald-800"
                              : l.status === "REJECTED"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-800"
                          }`}>
                            {l.status}
                          </span>
                        </div>
                        <div className="text-slate-500 flex items-center gap-2">
                          <span>{l.daysCount} {l.daysCount === 1 ? "day" : "days"}</span>
                          <span>•</span>
                          <span>{new Date(l.startDate).toLocaleDateString()} to {new Date(l.endDate).toLocaleDateString()}</span>
                        </div>
                        <div className="text-slate-600 bg-white p-2 rounded-lg border border-slate-200/60">
                          <strong>Reason:</strong> {l.reason}
                        </div>
                        {l.actionNotes && (
                          <div className="text-slate-500 text-[11px]">
                            <strong>Remarks:</strong> {l.actionNotes} ({l.actionBy})
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
