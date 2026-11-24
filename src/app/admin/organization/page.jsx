"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import DashboardShell from "@/components/DashboardShell";
import Pagination from "@/components/Pagination";
import { useAuth } from "@/context/AuthContext";
import {
  Building2,
  Plus,
  Search,
  Edit2,
  Trash2,
  Users,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  X,
  FileText,
  UserCheck,
  Sparkles,
  Layers,
  ArrowRight,
  User,
  Phone,
  Mail,
} from "lucide-react";

export default function AdminOrganizationPage() {
  const { employees } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 15;

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [deleteConfirmDept, setDeleteConfirmDept] = useState(null);
  const [selectedDeptForEmployees, setSelectedDeptForEmployees] = useState(null);
  const [deptEmployeeSearch, setDeptEmployeeSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState({ type: "", message: "" });

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    headName: "",
  });

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/departments");
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        setDepartments(result.data);
      }
    } catch (err) {
      console.error("Failed to fetch departments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const openAddModal = () => {
    setEditingDept(null);
    setFormData({
      name: "",
      code: "",
      description: "",
      headName: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (dept) => {
    setEditingDept(dept);
    setFormData({
      name: dept.name,
      code: dept.code,
      description: dept.description || "",
      headName: dept.headName || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      setNotification({ type: "error", message: "Department Name and Code are required." });
      return;
    }

    setSubmitting(true);
    try {
      const url = editingDept
        ? `/api/departments/${editingDept.id}`
        : "/api/departments";
      const method = editingDept ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (result.success) {
        setNotification({
          type: "success",
          message: editingDept
            ? `Department "${formData.name}" updated successfully.`
            : `New department "${formData.name}" created successfully.`,
        });
        setIsModalOpen(false);
        fetchDepartments();
      } else {
        setNotification({ type: "error", message: result.error || "Failed to save department." });
      }
    } catch (err) {
      setNotification({ type: "error", message: err.message || "An unexpected error occurred." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmDept) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/departments/${deleteConfirmDept.id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.success) {
        setNotification({
          type: "success",
          message: `Department "${deleteConfirmDept.name}" deleted successfully.`,
        });
        setDeleteConfirmDept(null);
        fetchDepartments();
      } else {
        setNotification({ type: "error", message: result.error || "Failed to delete department." });
      }
    } catch (err) {
      setNotification({ type: "error", message: err.message || "An unexpected error occurred." });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredDepts = departments.filter((d) => {
    const q = searchTerm.toLowerCase();
    return (
      d.name?.toLowerCase().includes(q) ||
      d.code?.toLowerCase().includes(q) ||
      d.headName?.toLowerCase().includes(q) ||
      d.description?.toLowerCase().includes(q)
    );
  });

  // Reset pagination on search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const paginatedDepts = filteredDepts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Staff belonging to clicked department
  const departmentStaff = selectedDeptForEmployees
    ? employees?.filter(
        (e) =>
          e.department?.toLowerCase() === selectedDeptForEmployees.name?.toLowerCase() ||
          (selectedDeptForEmployees.name === "Admin Department" && (e.department?.toLowerCase() === "administration" || e.role === "ADMIN"))
      ) || []
    : [];

  const filteredDeptStaff = departmentStaff.filter((emp) => {
    if (!deptEmployeeSearch.trim()) return true;
    const q = deptEmployeeSearch.toLowerCase();
    return (
      emp.name?.toLowerCase().includes(q) ||
      emp.employeeId?.toLowerCase().includes(q) ||
      emp.designation?.toLowerCase().includes(q) ||
      emp.email?.toLowerCase().includes(q)
    );
  });

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-rose-700 uppercase tracking-wider bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                Workforce Hierarchy
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Organization &amp; Departments
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manage enterprise divisions, robotics wings, and department leads across Digitech Robotics.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-rose-800 to-rose-700 hover:from-rose-900 hover:to-rose-800 text-white font-bold text-xs shadow-md shadow-rose-950/20 transition cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Department</span>
          </button>
        </div>

        {/* Notification Banner */}
        {notification.message && (
          <div
            className={`p-4 rounded-xl border text-xs sm:text-sm flex items-center justify-between gap-2.5 animate-in fade-in ${
              notification.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : "bg-rose-50 border-rose-200 text-rose-900"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {notification.type === "success" ? (
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <span>{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification({ type: "", message: "" })}
              className="p-1 rounded-lg hover:bg-black/5 text-slate-500 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Departments
              </span>
              <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">{departments.length}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Active business divisions</div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Staff Assigned
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">
              {employees?.filter((e) => e.role === "EMPLOYEE").length || 0}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Employees on roster</div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Organization Unit
              </span>
              <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">Digitech HQ</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Pune &bull; Maharashtra &bull; India</div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by department name, code (e.g. ROB-ENG), lead, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 transition"
            />
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="px-3 py-2 text-xs text-slate-500 hover:text-slate-800 transition"
            >
              Clear
            </button>
          )}
        </div>

        {/* Department Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading ? (
            <div className="col-span-full py-16 text-center text-slate-400 text-sm">
              Loading departments...
            </div>
          ) : filteredDepts.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-200 p-8">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <div className="font-bold text-slate-800 text-base">No departments found</div>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No departments match your search. Create one using the button above to populate the employee dropdown.
              </p>
              <button
                onClick={openAddModal}
                className="mt-4 px-4 py-2 rounded-xl bg-rose-700 text-white text-xs font-semibold hover:bg-rose-800 transition cursor-pointer"
              >
                Create Department
              </button>
            </div>
          ) : (
            paginatedDepts.map((dept) => {
              const assignedCount =
                employees?.filter(
                  (e) =>
                    e.department?.toLowerCase() === dept.name?.toLowerCase() ||
                    (dept.name === "Admin Department" && (e.department?.toLowerCase() === "administration" || e.role === "ADMIN"))
                ).length || 0;

              return (
                <div
                  key={dept.id}
                  onClick={() => setSelectedDeptForEmployees(dept)}
                  className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-rose-400 hover:shadow-lg transition-all flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-center font-bold text-xs shadow-xs">
                          {dept.code?.substring(0, 3)}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm group-hover:text-rose-800 transition flex items-center gap-1.5">
                            <span>{dept.name}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-rose-700 group-hover:translate-x-0.5 transition" />
                          </h3>
                          <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                            {dept.code}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => openEditModal(dept)}
                          title="Edit Department"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmDept(dept)}
                          title="Delete Department"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                      {dept.description || "No description provided for this department."}
                    </p>
                  </div>

                  {/* Footer details */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[11px] truncate max-w-[120px]" title={dept.headName}>
                        Lead: <strong>{dept.headName || "Not assigned"}</strong>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDeptForEmployees(dept);
                      }}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-850 border border-rose-200 hover:bg-rose-100 transition flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <span>{assignedCount} {assignedCount === 1 ? "Employee" : "Employees"}</span>
                      <ArrowRight className="w-3 h-3 text-rose-700" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalItems={filteredDepts.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
          itemLabel="departments"
          className="rounded-2xl border border-slate-200 bg-white"
        />
      </div>

      {/* CREATE / EDIT DEPARTMENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-800 flex items-center justify-center font-bold">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-extrabold text-slate-900 text-base">
                    {editingDept ? "Edit Department" : "Create Department"}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {editingDept ? "Update division details and leadership" : "Add a new department for Digitech ERP"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Department Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Robotics Engineering, AI Vision"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Department Code <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ROB-ENG, IND-AUTO, SFT-DEV"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
                />
                <p className="text-[10px] text-slate-400 mt-1">Short unique code used in employee IDs &amp; reports.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Head of Department / Lead (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dhiraj Gaikwad, Operations Lead"
                  value={formData.headName}
                  onChange={(e) => setFormData({ ...formData, headName: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Responsibilities, scope, robotics functions of this department..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-xl transition cursor-pointer disabled:opacity-50 shadow-md shadow-rose-950/20"
                >
                  {submitting ? "Saving..." : editingDept ? "Update Department" : "Create Department"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmDept && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base mb-1">Delete Department?</h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              Are you sure you want to delete <strong>{deleteConfirmDept.name}</strong> ({deleteConfirmDept.code})?
              This action cannot be undone.
            </p>
            <div className="flex items-center gap-2.5 justify-center">
              <button
                type="button"
                onClick={() => setDeleteConfirmDept(null)}
                className="flex-1 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={submitting}
                className="flex-1 px-4 py-2.5 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-xl transition cursor-pointer disabled:opacity-50"
              >
                {submitting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DEPARTMENT EMPLOYEES DIRECTORY MODAL */}
      {selectedDeptForEmployees && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[88vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-center font-bold text-sm shadow-xs">
                  {selectedDeptForEmployees.code || "DEP"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-extrabold text-slate-900 text-lg">
                      {selectedDeptForEmployees.name}
                    </h2>
                    <span className="text-xs font-mono font-bold bg-white text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                      {selectedDeptForEmployees.code}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Lead: <strong className="text-slate-700">{selectedDeptForEmployees.headName || "Not assigned"}</strong> &bull; {selectedDeptForEmployees.description || "Active business unit"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedDeptForEmployees(null);
                  setDeptEmployeeSearch("");
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Search & Count Sub-bar */}
            <div className="p-4 border-b border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={`Search employees in ${selectedDeptForEmployees.name}...`}
                  value={deptEmployeeSearch}
                  onChange={(e) => setDeptEmployeeSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 transition"
                />
              </div>

              <div className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 shrink-0">
                Total: <strong className="text-slate-900">{departmentStaff.length}</strong> {departmentStaff.length === 1 ? "Staff Member" : "Staff Members"}
              </div>
            </div>

            {/* Modal Content - Employee List */}
            <div className="flex-1 overflow-y-auto p-6">
              {filteredDeptStaff.length === 0 ? (
                <div className="text-center py-12 px-4 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                    <Users className="w-7 h-7" />
                  </div>
                  <div className="font-bold text-slate-800 text-base">
                    {deptEmployeeSearch ? "No matching employees found" : "No employees assigned to this department"}
                  </div>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {deptEmployeeSearch
                      ? `No team members match "${deptEmployeeSearch}". Try clearing your search.`
                      : `Assign employees to ${selectedDeptForEmployees.name} from the Employee Management portal.`}
                  </p>
                  {deptEmployeeSearch ? (
                    <button
                      onClick={() => setDeptEmployeeSearch("")}
                      className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 rounded-lg hover:bg-rose-100 transition cursor-pointer"
                    >
                      Clear search
                    </button>
                  ) : (
                    <Link
                      href="/admin/employees"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-700 text-white text-xs font-semibold hover:bg-rose-800 transition cursor-pointer shadow-xs"
                    >
                      <span>Add / Assign Employees</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                  {filteredDeptStaff.map((emp) => {
                    const isActive = emp.status === "ACTIVE";
                    return (
                      <div
                        key={emp.id}
                        className="p-4 hover:bg-slate-50/70 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        {/* Left: Avatar & Info */}
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-100 ring-2 ring-slate-200 shrink-0 flex items-center justify-center">
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
                              <h4 className="font-bold text-slate-900 text-sm">{emp.name}</h4>
                              {emp.role === "ADMIN" && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                                  <ShieldCheck className="w-3 h-3 text-rose-700" /> Admin
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-indigo-700 font-semibold">{emp.designation || "Staff"}</div>
                            <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                              ID: {emp.employeeId} &bull; {emp.email}
                            </div>
                          </div>
                        </div>

                        {/* Right: Contact & Status */}
                        <div className="flex flex-wrap items-center sm:justify-end gap-3 sm:gap-4 shrink-0 text-xs">
                          {emp.phone && (
                            <div className="flex items-center gap-1 text-slate-600 text-xs">
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              <span>{emp.phone}</span>
                            </div>
                          )}

                          {emp.salary && (
                            <div className="font-mono text-slate-700 font-semibold text-xs">
                              ₹{Number(emp.salary).toLocaleString("en-IN")}
                            </div>
                          )}

                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                              isActive
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : "bg-rose-50 text-rose-800 border-rose-200"
                            }`}
                          >
                            {emp.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs text-slate-500">
              <span>Showing team members belonging to <strong>{selectedDeptForEmployees.name}</strong></span>
              <button
                onClick={() => {
                  setSelectedDeptForEmployees(null);
                  setDeptEmployeeSearch("");
                }}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
