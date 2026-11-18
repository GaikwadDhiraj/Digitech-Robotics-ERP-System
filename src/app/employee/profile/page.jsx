"use client";

import React, { useState, useEffect } from "react";
import DashboardShell from "@/components/DashboardShell";
import ProfilePhotoModal from "@/components/ProfilePhotoModal";
import { useAuth } from "@/context/AuthContext";
import {
  UserCircle,
  Mail,
  Phone,
  Building,
  Briefcase,
  Calendar,
  MapPin,
  CreditCard,
  FileBadge,
  Save,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  IndianRupee,
  Heart,
  Droplet,
  Landmark,
  Camera,
} from "lucide-react";

export default function EmployeeProfilePage() {
  const { currentUser, updateUserProfile } = useAuth();
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "", // Official Email
    personalEmail: "",
    phone: "",
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

  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState("personal");

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        personalEmail: currentUser.personalEmail || "",
        phone: currentUser.phone || "",
        dob: currentUser.dob ? currentUser.dob.substring(0, 10) : "",
        gender: currentUser.gender || "Male",
        maritalStatus: currentUser.maritalStatus || "Single",
        bloodGroup: currentUser.bloodGroup || "O+",
        aadharNumber: currentUser.aadharNumber || "",
        panNumber: currentUser.panNumber || "",
        residentialAddress: currentUser.residentialAddress || currentUser.address || "",
        communicationAddress: currentUser.communicationAddress || currentUser.residentialAddress || "",
        bankAccountName: currentUser.bankAccountName || currentUser.name || "",
        bankAccountNumber: currentUser.bankAccountNumber || "",
        bankIfscCode: currentUser.bankIfscCode || "",
        bankName: currentUser.bankName || "",
        emergencyContact: currentUser.emergencyContact || "",
        bio: currentUser.bio || "",
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const res = await fetch(`/api/employees/${currentUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (result.success) {
        updateUserProfile(result.data);
        setSuccessMessage("Employee profile details updated successfully!");
        setTimeout(() => setSuccessMessage(""), 4000);
      } else {
        setErrorMessage(result.error || "Failed to update profile.");
      }
    } catch (err) {
      setErrorMessage("An unexpected error occurred while saving profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Employee Profile</h1>
            <p className="text-sm text-slate-500">
              Manage personal identity, bank accounts, residential address, and view organization details.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              currentUser?.status === "ACTIVE"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-rose-50 text-rose-700 border border-rose-200"
            }`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              {currentUser?.status === "ACTIVE" ? "Active Account" : "Inactive Account"}
            </span>
          </div>
        </div>

        {/* Notifications */}
        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {/* Profile Card Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="h-28 bg-linear-to-r from-rose-950 via-slate-900 to-rose-900 relative">
            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono font-medium text-white border border-white/20">
              ID: {currentUser?.employeeId || "EMP-000"}
            </div>
          </div>

          <div className="px-6 pb-6 pt-0 relative flex flex-col md:flex-row gap-6 items-start md:items-end -mt-12">
            <div className="relative group">
              <button
                type="button"
                onClick={() => setIsPhotoModalOpen(true)}
                title="Click to edit, upload, or delete profile photo"
                className="w-24 h-24 rounded-2xl border-4 border-white bg-slate-100 overflow-hidden shadow-lg relative cursor-pointer block hover:ring-2 hover:ring-rose-500 transition group"
              >
                {currentUser?.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-full h-full object-cover transition group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-black text-2xl text-rose-900 bg-rose-50">
                    {currentUser?.name?.substring(0, 2).toUpperCase() || "EP"}
                  </div>
                )}

                {/* Hover overlay with Camera icon */}
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white">
                  <Camera className="w-5 h-5" />
                  <span className="text-[9px] font-bold mt-0.5">Edit Photo</span>
                </div>
              </button>

              <div className="absolute -bottom-1 -right-1 p-1.5 bg-rose-600 text-white rounded-full shadow-md border-2 border-white pointer-events-none">
                <Camera className="w-3 h-3" />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-xl font-bold text-slate-900">{currentUser?.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                  {currentUser?.designation}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                  {currentUser?.department}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>Official: <strong className="text-slate-700">{currentUser?.email}</strong></span>
                <span>•</span>
                <span>Personal: <strong className="text-slate-700">{currentUser?.personalEmail || "Not provided"}</strong></span>
                <span>•</span>
                <span>Phone: <strong className="text-slate-700">{currentUser?.phone || "Not provided"}</strong></span>
              </p>
            </div>
          </div>
        </div>

        {/* Profile Photo Manager Modal */}
        <ProfilePhotoModal
          isOpen={isPhotoModalOpen}
          onClose={() => setIsPhotoModalOpen(false)}
        />

        {/* Profile Tabs Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          {[
            { id: "personal", label: "Personal & Contact", icon: UserCircle },
            { id: "kyc", label: "Aadhaar, PAN & Identity", icon: FileBadge },
            { id: "address", label: "Residential & Communication", icon: MapPin },
            { id: "bank", label: "Bank Account Details", icon: Landmark },
            { id: "employment", label: "Employment & CTC", icon: Briefcase },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  active
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Forms */}
        <form onSubmit={handleSubmit}>
          {/* TAB 1: Personal & Contact */}
          {activeTab === "personal" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5 animate-in fade-in">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="font-bold text-base text-slate-900">Personal Information</h3>
                <p className="text-xs text-slate-500">Update your personal contact details, gender, DOB, and blood group.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Official Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900"
                    title="Official work email"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Personal Email Address
                  </label>
                  <input
                    type="email"
                    name="personalEmail"
                    value={formData.personalEmail}
                    onChange={handleChange}
                    placeholder="john.personal@gmail.com"
                    className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Phone / Contact Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Date of Birth (DOB)
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Marital Status
                  </label>
                  <select
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleChange}
                    className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Blood Group
                  </label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  >
                    {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Emergency Contact (Name & Phone)
                  </label>
                  <input
                    type="text"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    placeholder="e.g. Ramesh Gaikwad (+91 98765 43210)"
                    className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Professional Bio / Profile Note
                </label>
                <textarea
                  name="bio"
                  rows="3"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Summary of experience, technical focus, and interests..."
                  className="w-full text-xs bg-white border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          {/* TAB 2: Identification & KYC */}
          {activeTab === "kyc" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5 animate-in fade-in">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="font-bold text-base text-slate-900">Identification & KYC Documents</h3>
                <p className="text-xs text-slate-500">Statutory identification credentials required for employee compliance.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
                    <FileBadge className="w-4 h-4" />
                    <span>Aadhaar Card Number</span>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      12-Digit Aadhaar Number
                    </label>
                    <input
                      type="text"
                      name="aadharNumber"
                      value={formData.aadharNumber}
                      onChange={handleChange}
                      placeholder="1234 5678 9012"
                      maxLength={14}
                      className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2.5 font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">Used for PF, ESIC and national identity verification.</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                  <div className="flex items-center gap-2 text-purple-700 font-bold text-xs uppercase tracking-wider">
                    <FileBadge className="w-4 h-4" />
                    <span>PAN (Permanent Account Number)</span>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      10-Character Alphanumeric PAN
                    </label>
                    <input
                      type="text"
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={handleChange}
                      placeholder="ABCDE1234F"
                      maxLength={10}
                      className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2.5 font-mono uppercase text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">Required for income tax withholding (TDS) and Form 16.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Addresses */}
          {activeTab === "address" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5 animate-in fade-in">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="font-bold text-base text-slate-900">Residential & Communication Address</h3>
                <p className="text-xs text-slate-500">Provide both permanent residential address and present correspondence address.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                    Permanent Residential Address
                  </label>
                  <textarea
                    name="residentialAddress"
                    rows="4"
                    value={formData.residentialAddress}
                    onChange={handleChange}
                    placeholder="House/Flat No, Street, Landmark, City, State, PIN/ZIP"
                    className="w-full text-xs bg-white border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-purple-600" />
                      Communication / Current Address
                    </label>
                    <button
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, communicationAddress: p.residentialAddress }))}
                      className="text-[11px] text-indigo-600 hover:underline font-medium"
                    >
                      Same as Permanent
                    </button>
                  </div>
                  <textarea
                    name="communicationAddress"
                    rows="4"
                    value={formData.communicationAddress}
                    onChange={handleChange}
                    placeholder="Current address for official letters, courier and communication"
                    className="w-full text-xs bg-white border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Bank Account Details */}
          {activeTab === "bank" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5 animate-in fade-in">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900">Salary & Bank Account Information</h3>
                  <p className="text-xs text-slate-500">Bank account details where monthly payroll and reimbursements are disbursed.</p>
                </div>
                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                  <Landmark className="w-5 h-5" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Account Holder Name (As per Bank Records)
                  </label>
                  <input
                    type="text"
                    name="bankAccountName"
                    value={formData.bankAccountName}
                    onChange={handleChange}
                    placeholder="Full name as printed on passbook/cheque"
                    className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    placeholder="e.g. HDFC Bank / Chase / State Bank"
                    className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Bank Account Number
                  </label>
                  <input
                    type="text"
                    name="bankAccountNumber"
                    value={formData.bankAccountNumber}
                    onChange={handleChange}
                    placeholder="e.g. 001234567890"
                    className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2.5 font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    IFSC / Routing Code
                  </label>
                  <input
                    type="text"
                    name="bankIfscCode"
                    value={formData.bankIfscCode}
                    onChange={handleChange}
                    placeholder="e.g. HDFC0001234"
                    className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2.5 font-mono uppercase text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Employment & CTC (Admin Controlled) */}
          {activeTab === "employment" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5 animate-in fade-in">
              <div className="pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-slate-900">Employment Details & Annual CTC</h3>
                  <span className="text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                    Admin Managed
                  </span>
                </div>
                <p className="text-xs text-slate-500">Designation and annual salary package (CTC) assigned by company management.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                    Designation (Admin Assigned)
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-1">
                    {currentUser?.designation || "Not Assigned"}
                  </div>
                  <div className="text-[10px] text-indigo-600 mt-1 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Designated by Admin
                  </div>
                </div>

                <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                  <div className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
                    Annual Salary (CTC)
                  </div>
                  <div className="text-lg font-extrabold text-emerald-900 mt-1">
                    ₹{Number(currentUser?.salary || 0).toLocaleString("en-IN")} / annum (INR)
                  </div>
                  <div className="text-[10px] text-emerald-700 mt-1 font-medium">
                    Configured by Admin / Payroll
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                    Department
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-1">
                    {currentUser?.department || "Engineering"}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                    Employee ID
                  </div>
                  <div className="text-sm font-bold font-mono text-slate-900 mt-1">
                    {currentUser?.employeeId}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                    Joining Date
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-1">
                    {currentUser?.joinDate
                      ? new Date(currentUser.joinDate).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "N/A"}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                    Account Status
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${currentUser?.status === "ACTIVE" ? "bg-emerald-500" : "bg-rose-500"}`} />
                    <span>{currentUser?.status || "ACTIVE"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Action Footer */}
          <div className="mt-6 flex items-center justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs shadow-indigo-300 transition-all disabled:opacity-60 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Saving Profile..." : "Save Profile Changes"}
            </button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}
