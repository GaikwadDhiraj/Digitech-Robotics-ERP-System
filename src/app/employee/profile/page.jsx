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
  Upload,
  FileText,
  Lock,
  Unlock,
  Eye,
  Trash2,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";

export default function EmployeeProfilePage() {
  const { currentUser, updateUserProfile } = useAuth();
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "", // Official Email (read-only for employee)
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
    resumeUrl: null,
    resumeName: null,
    aadharDocUrl: null,
    aadharDocName: null,
    panDocUrl: null,
    panDocName: null,
    bankDocUrl: null,
    bankDocName: null,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isRequestingBankUnlock, setIsRequestingBankUnlock] = useState(false);
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
        resumeUrl: currentUser.resumeUrl || null,
        resumeName: currentUser.resumeName || null,
        aadharDocUrl: currentUser.aadharDocUrl || null,
        aadharDocName: currentUser.aadharDocName || null,
        panDocUrl: currentUser.panDocUrl || null,
        panDocName: currentUser.panDocName || null,
        bankDocUrl: currentUser.bankDocUrl || null,
        bankDocName: currentUser.bankDocName || null,
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Generic File Upload Handler converting to Base64
  const handleFileUpload = (e, urlKey, nameKey) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("File exceeds 5MB size limit. Please upload a smaller document.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        [urlKey]: reader.result,
        [nameKey]: file.name,
      }));
      setSuccessMessage(`Document "${file.name}" attached successfully! Remember to click "Save Profile Changes".`);
      setTimeout(() => setSuccessMessage(""), 4000);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = (urlKey, nameKey) => {
    setFormData((prev) => ({
      ...prev,
      [urlKey]: null,
      [nameKey]: null,
    }));
  };

  const handleRequestBankUnlock = async () => {
    if (!currentUser?.id) return;
    setIsRequestingBankUnlock(true);
    setErrorMessage("");
    try {
      const res = await fetch(`/api/employees/${currentUser.id}/request-bank-edit`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        updateUserProfile(data.data);
        setSuccessMessage("Bank details unlock request sent to Administrator! You will be notified once unlocked.");
      } else {
        setErrorMessage(data.error || "Failed to send unlock request.");
      }
    } catch (err) {
      setErrorMessage("Error requesting bank details unlock.");
    } finally {
      setIsRequestingBankUnlock(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    // COMPULSORY CONTACT DETAILS VALIDATION
    if (!formData.phone || formData.phone.trim().length < 8) {
      setErrorMessage("Phone / Contact Number is compulsory. Please provide a valid phone number.");
      setIsSaving(false);
      setActiveTab("personal");
      return;
    }

    if (!formData.personalEmail || !formData.personalEmail.includes("@")) {
      setErrorMessage("Personal Email Address is compulsory. Please provide your personal email.");
      setIsSaving(false);
      setActiveTab("personal");
      return;
    }

    if (!formData.residentialAddress || formData.residentialAddress.trim().length < 5) {
      setErrorMessage("Permanent Residential Address is compulsory. Please provide your complete address.");
      setIsSaving(false);
      setActiveTab("address");
      return;
    }

    if (!formData.communicationAddress || formData.communicationAddress.trim().length < 5) {
      setErrorMessage("Communication / Current Address is compulsory.");
      setIsSaving(false);
      setActiveTab("address");
      return;
    }

    if (!formData.emergencyContact || formData.emergencyContact.trim().length < 3) {
      setErrorMessage("Emergency Contact details are compulsory. Please provide an emergency contact name and phone.");
      setIsSaving(false);
      setActiveTab("personal");
      return;
    }

    try {
      const res = await fetch(`/api/employees/${currentUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          isEmployeeSelfEdit: true,
        }),
      });

      const result = await res.json();
      if (result.success) {
        updateUserProfile(result.data);
        setSuccessMessage("Employee profile details and attached documents saved successfully!");
        setTimeout(() => setSuccessMessage(""), 5000);
      } else {
        setErrorMessage(result.error || "Failed to update profile.");
      }
    } catch (err) {
      setErrorMessage("An unexpected error occurred while saving profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const isBankLocked = currentUser?.bankDetailsLocked === true;
  const isBankEditRequested = currentUser?.bankEditRequested === true;

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
              Employee Profile
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Manage personal identity, contact info, KYC documents, resume, and bank account details.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold ${
                currentUser?.status === "ACTIVE"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-rose-50 text-rose-800 border border-rose-200"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              {currentUser?.status === "ACTIVE" ? "Active Account" : "Inactive Account"}
            </span>
          </div>
        </div>

        {/* Alerts / Notifications */}
        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-center justify-between gap-2.5 animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="font-semibold">{successMessage}</span>
            </div>
          </div>
        )}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-sm flex items-center justify-between gap-2.5 animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span className="font-semibold">{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Profile Card Banner with Large Circular Profile Photo */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="h-32 bg-linear-to-r from-rose-950 via-slate-900 to-rose-950 relative">
            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-white border border-white/20 shadow-xs">
              Employee ID: {currentUser?.employeeId || "DG-26-0001"}
            </div>
          </div>

          <div className="px-6 pb-6 pt-0 relative flex flex-col md:flex-row gap-6 items-start md:items-end -mt-16">
            {/* Circular Profile Photo with Increased Size */}
            <div className="relative group">
              <button
                type="button"
                onClick={() => setIsPhotoModalOpen(true)}
                title="Click to edit, upload, or delete profile photo"
                className="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-white bg-slate-100 overflow-hidden shadow-2xl relative cursor-pointer block hover:ring-4 hover:ring-rose-500/40 transition group"
              >
                {currentUser?.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-full h-full object-cover rounded-full transition group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full rounded-full flex items-center justify-center font-black text-3xl text-rose-900 bg-rose-50">
                    {currentUser?.name?.substring(0, 2).toUpperCase() || "EP"}
                  </div>
                )}

                {/* Hover overlay with Camera */}
                <div className="absolute inset-0 rounded-full bg-slate-950/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white">
                  <Camera className="w-6 h-6" />
                  <span className="text-[11px] font-bold mt-1">Change Photo</span>
                </div>
              </button>

              <div className="absolute bottom-1 right-1 p-2 bg-rose-700 text-white rounded-full shadow-lg border-2 border-white pointer-events-none">
                <Camera className="w-4 h-4" />
              </div>
            </div>

            {/* Profile Summary Details */}
            <div className="flex-1 space-y-1.5">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-black text-slate-900">{currentUser?.name}</h2>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-900 border border-rose-200">
                  {currentUser?.designation}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                  {currentUser?.department}
                </span>
              </div>
              <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-medium pt-1">
                <span className="flex items-center gap-1">
                  Official: <strong className="text-slate-800">{currentUser?.email}</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  Personal: <strong className="text-slate-800">{currentUser?.personalEmail || "Not provided"}</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  Phone: <strong className="text-slate-800">{currentUser?.phone || "Not provided"}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Photo Manager Modal */}
        <ProfilePhotoModal
          isOpen={isPhotoModalOpen}
          onClose={() => setIsPhotoModalOpen(false)}
        />

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          {[
            { id: "personal", label: "Personal & Contact Info", icon: UserCircle },
            { id: "kyc", label: "Aadhaar, PAN & Identity", icon: FileBadge },
            { id: "address", label: "Residential & Communication", icon: MapPin },
            { id: "bank", label: "Salary & Bank Account", icon: Landmark },
            { id: "employment", label: "Employment & CTC", icon: Briefcase },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  active
                    ? "bg-rose-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Profile Edit Forms */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* TAB 1: Personal & Contact Information (Includes Resume Upload) */}
          {activeTab === "personal" && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 lg:p-8 shadow-xs space-y-6 animate-in fade-in">
              <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">Personal & Contact Details</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Contact details are compulsory for company directory, payroll, and emergency communication.
                  </p>
                </div>
                <span className="text-xs font-bold text-rose-800 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full w-fit">
                  * Compulsory Section
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Full Legal Name - NON-EDITABLE for Employee */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                    <span>Full Legal Name</span>
                    <span className="text-[10px] font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Admin Managed
                    </span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    readOnly
                    disabled
                    className="w-full text-sm bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-600 font-semibold cursor-not-allowed"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Official name is locked by company admin.</p>
                </div>

                {/* Official Email - NON-EDITABLE for Employee */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                    <span>Official Email Address</span>
                    <span className="text-[10px] font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Admin Managed
                    </span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    readOnly
                    disabled
                    className="w-full text-sm bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-600 font-semibold cursor-not-allowed"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Official work email assigned by company admin.</p>
                </div>

                {/* Personal Email - COMPULSORY */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Personal Email Address <span className="text-rose-600 font-black">*</span>
                  </label>
                  <input
                    type="email"
                    name="personalEmail"
                    value={formData.personalEmail}
                    onChange={handleChange}
                    required
                    placeholder="john.personal@gmail.com"
                    className="w-full text-sm bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-rose-500 font-medium"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Required for emergency communications.</p>
                </div>

                {/* Phone Number - COMPULSORY */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Phone / Contact Number <span className="text-rose-600 font-black">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+91 98765 43210"
                    className="w-full text-sm bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-rose-500 font-medium"
                  />
                </div>

                {/* Emergency Contact - COMPULSORY */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Emergency Contact (Name & Phone) <span className="text-rose-600 font-black">*</span>
                  </label>
                  <input
                    type="text"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Ramesh Gaikwad (+91 98765 43210)"
                    className="w-full text-sm bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-rose-500 font-medium"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Date of Birth (DOB)
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full text-sm bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-rose-500 font-medium"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full text-sm bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-rose-500 font-medium"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                {/* Marital Status */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Marital Status
                  </label>
                  <select
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleChange}
                    className="w-full text-sm bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-rose-500 font-medium"
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>

                {/* Blood Group */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Blood Group
                  </label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="w-full text-sm bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-rose-500 font-medium"
                  >
                    {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* RESUME UPLOAD SECTION */}
              <div className="pt-4 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-rose-700" />
                  <span>Resume / Curriculum Vitae (CV)</span>
                </label>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {formData.resumeUrl ? (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">
                          {formData.resumeName || "Employee_Resume.pdf"}
                        </div>
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          ✓ Document Uploaded
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500">
                      No resume uploaded yet. Upload your latest updated resume (PDF, DOC, DOCX up to 5MB).
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    {formData.resumeUrl && (
                      <a
                        href={formData.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 transition shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-600" />
                        <span>View / Download</span>
                      </a>
                    )}

                    <label className="px-3.5 py-1.5 bg-rose-900 hover:bg-rose-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{formData.resumeUrl ? "Replace Resume" : "Upload Resume"}</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,image/*"
                        onChange={(e) => handleFileUpload(e, "resumeUrl", "resumeName")}
                        className="hidden"
                      />
                    </label>

                    {formData.resumeUrl && (
                      <button
                        type="button"
                        onClick={() => handleRemoveFile("resumeUrl", "resumeName")}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                        title="Remove uploaded resume"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Professional Bio */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Professional Bio / Profile Note
                </label>
                <textarea
                  name="bio"
                  rows="3"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Summary of experience, technical focus, robotics systems expertise..."
                  className="w-full text-sm bg-white border border-slate-200 rounded-xl p-3.5 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-rose-500 font-medium"
                />
              </div>
            </div>
          )}

          {/* TAB 2: Identification & KYC (Aadhaar & PAN with Document Uploads) */}
          {activeTab === "kyc" && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 lg:p-8 shadow-xs space-y-6 animate-in fade-in">
              <div className="pb-4 border-b border-slate-100">
                <h3 className="font-extrabold text-lg text-slate-900">Identification & Statutory KYC Documents</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Provide your official 12-digit Aadhaar number and 10-character PAN along with clear photo or PDF document uploads.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Aadhaar Card Section */}
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-rose-900 font-extrabold text-sm">
                      <FileBadge className="w-5 h-5 text-rose-700" />
                      <span>Aadhaar Card (UIDAI)</span>
                    </div>
                    {formData.aadharDocUrl && (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        ✓ Document Attached
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      12-Digit Aadhaar Number
                    </label>
                    <input
                      type="text"
                      name="aadharNumber"
                      value={formData.aadharNumber}
                      onChange={handleChange}
                      placeholder="1234 5678 9012"
                      maxLength={14}
                      className="w-full text-sm bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 font-mono font-bold text-slate-900 focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  {/* Aadhaar Document Upload */}
                  <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-xs text-slate-500 truncate">
                      {formData.aadharDocName || "Upload front & back copy (PDF/Image)"}
                    </div>

                    <div className="flex items-center gap-2">
                      {formData.aadharDocUrl && (
                        <a
                          href={formData.aadharDocUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1 shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-600" />
                          <span>View</span>
                        </a>
                      )}
                      <label className="px-3 py-1.5 bg-rose-900 hover:bg-rose-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{formData.aadharDocUrl ? "Replace" : "Upload Aadhaar"}</span>
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          onChange={(e) => handleFileUpload(e, "aadharDocUrl", "aadharDocName")}
                          className="hidden"
                        />
                      </label>
                      {formData.aadharDocUrl && (
                        <button
                          type="button"
                          onClick={() => handleRemoveFile("aadharDocUrl", "aadharDocName")}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* PAN Card Section */}
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-rose-900 font-extrabold text-sm">
                      <CreditCard className="w-5 h-5 text-rose-700" />
                      <span>Permanent Account Number (PAN)</span>
                    </div>
                    {formData.panDocUrl && (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        ✓ Document Attached
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      10-Character Alphanumeric PAN
                    </label>
                    <input
                      type="text"
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={handleChange}
                      placeholder="ABCDE1234F"
                      maxLength={10}
                      className="w-full text-sm bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 font-mono uppercase font-bold text-slate-900 focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  {/* PAN Document Upload */}
                  <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-xs text-slate-500 truncate">
                      {formData.panDocName || "Upload PAN card copy (PDF/Image)"}
                    </div>

                    <div className="flex items-center gap-2">
                      {formData.panDocUrl && (
                        <a
                          href={formData.panDocUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1 shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-600" />
                          <span>View</span>
                        </a>
                      )}
                      <label className="px-3 py-1.5 bg-rose-900 hover:bg-rose-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{formData.panDocUrl ? "Replace" : "Upload PAN"}</span>
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          onChange={(e) => handleFileUpload(e, "panDocUrl", "panDocName")}
                          className="hidden"
                        />
                      </label>
                      {formData.panDocUrl && (
                        <button
                          type="button"
                          onClick={() => handleRemoveFile("panDocUrl", "panDocName")}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Residential & Communication Addresses (COMPULSORY) */}
          {activeTab === "address" && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 lg:p-8 shadow-xs space-y-6 animate-in fade-in">
              <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">Residential & Communication Addresses</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Permanent residential address and correspondence address are compulsory for legal employment compliance.
                  </p>
                </div>
                <span className="text-xs font-bold text-rose-800 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full w-fit">
                  * Compulsory Section
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-rose-700" />
                    <span>Permanent Residential Address</span>
                    <span className="text-rose-600 font-black">*</span>
                  </label>
                  <textarea
                    name="residentialAddress"
                    rows="4"
                    required
                    value={formData.residentialAddress}
                    onChange={handleChange}
                    placeholder="House / Flat No, Street Name, Landmark, City, State, PIN Code"
                    className="w-full text-sm bg-white border border-slate-200 rounded-xl p-3.5 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-rose-500 font-medium leading-relaxed"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Proof of residence address as on Aadhaar card.</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-rose-700" />
                      <span>Communication / Present Address</span>
                      <span className="text-rose-600 font-black">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, communicationAddress: p.residentialAddress }))}
                      className="text-xs text-rose-800 hover:text-rose-950 font-bold hover:underline cursor-pointer"
                    >
                      Same as Permanent
                    </button>
                  </div>
                  <textarea
                    name="communicationAddress"
                    rows="4"
                    required
                    value={formData.communicationAddress}
                    onChange={handleChange}
                    placeholder="Present local address for courier, physical letters, and office contact"
                    className="w-full text-sm bg-white border border-slate-200 rounded-xl p-3.5 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-rose-500 font-medium leading-relaxed"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Current address where employee resides.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Salary & Bank Account Information (One-time editable, then locked) */}
          {activeTab === "bank" && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 lg:p-8 shadow-xs space-y-6 animate-in fade-in">
              <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-lg text-slate-900">
                      Salary & Bank Account Information
                    </h3>
                    {isBankLocked ? (
                      <span className="text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Lock className="w-3 h-3 text-amber-700" /> Locked
                      </span>
                    ) : (
                      <span className="text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        Editable (First-Time)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Direct deposit account for monthly salary credits, allowances, and business expenses.
                  </p>
                </div>

                <div className="p-2.5 bg-rose-50 text-rose-900 border border-rose-200 rounded-xl shrink-0">
                  <Landmark className="w-6 h-6" />
                </div>
              </div>

              {/* Bank Lock Warning & Unlock Request Feature */}
              {isBankLocked ? (
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-300 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-extrabold text-sm">
                        Bank Details Locked for Compliance
                      </div>
                      <p className="text-xs text-amber-800 mt-0.5">
                        As per company compliance, your bank details are locked after initial submission. If your account number or IFSC has changed, you can submit an unlock request to Admin.
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isBankEditRequested ? (
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-amber-900 border border-amber-300 shadow-2xs">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                        Unlock Request Pending Admin Review
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleRequestBankUnlock}
                        disabled={isRequestingBankUnlock}
                        className="px-4 py-2 bg-rose-900 hover:bg-rose-800 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
                      >
                        <Unlock className="w-3.5 h-3.5" />
                        <span>{isRequestingBankUnlock ? "Sending..." : "Request Admin to Unlock"}</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>First-Time Entry:</strong> Please fill your bank details carefully. Once saved, details will be locked and can only be modified via Admin permission.
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Account Holder Name (As per Bank)
                  </label>
                  <input
                    type="text"
                    name="bankAccountName"
                    value={formData.bankAccountName}
                    onChange={handleChange}
                    disabled={isBankLocked}
                    placeholder="Full name as printed on cheque"
                    className={`w-full text-sm rounded-xl px-3.5 py-2.5 font-medium border ${
                      isBankLocked
                        ? "bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed"
                        : "bg-white text-slate-900 border-slate-200 focus:ring-2 focus:ring-rose-500"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    disabled={isBankLocked}
                    placeholder="e.g. HDFC Bank / State Bank of India / ICICI"
                    className={`w-full text-sm rounded-xl px-3.5 py-2.5 font-medium border ${
                      isBankLocked
                        ? "bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed"
                        : "bg-white text-slate-900 border-slate-200 focus:ring-2 focus:ring-rose-500"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Bank Account Number
                  </label>
                  <input
                    type="text"
                    name="bankAccountNumber"
                    value={formData.bankAccountNumber}
                    onChange={handleChange}
                    disabled={isBankLocked}
                    placeholder="e.g. 50100234567890"
                    className={`w-full text-sm rounded-xl px-3.5 py-2.5 font-mono font-bold border ${
                      isBankLocked
                        ? "bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed"
                        : "bg-white text-slate-900 border-slate-200 focus:ring-2 focus:ring-rose-500"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Bank IFSC Code
                  </label>
                  <input
                    type="text"
                    name="bankIfscCode"
                    value={formData.bankIfscCode}
                    onChange={handleChange}
                    disabled={isBankLocked}
                    placeholder="e.g. HDFC0001234"
                    className={`w-full text-sm rounded-xl px-3.5 py-2.5 font-mono uppercase font-bold border ${
                      isBankLocked
                        ? "bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed"
                        : "bg-white text-slate-900 border-slate-200 focus:ring-2 focus:ring-rose-500"
                    }`}
                  />
                </div>
              </div>

              {/* Bank Related Document Upload (Cancelled Cheque / Passbook) */}
              <div className="pt-4 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-rose-700" />
                  <span>Bank Verification Document (Cancelled Cheque / Passbook / Statement)</span>
                </label>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {formData.bankDocUrl ? (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        <Landmark className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">
                          {formData.bankDocName || "Cancelled_Cheque.pdf"}
                        </div>
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          ✓ Document Uploaded
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500">
                      Upload a photo or scanned copy of your cancelled cheque or front page of passbook showing account number and IFSC code.
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    {formData.bankDocUrl && (
                      <a
                        href={formData.bankDocUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-600" />
                        <span>View Document</span>
                      </a>
                    )}

                    {!isBankLocked && (
                      <label className="px-3.5 py-1.5 bg-rose-900 hover:bg-rose-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{formData.bankDocUrl ? "Replace Document" : "Upload Document"}</span>
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          onChange={(e) => handleFileUpload(e, "bankDocUrl", "bankDocName")}
                          className="hidden"
                        />
                      </label>
                    )}

                    {formData.bankDocUrl && !isBankLocked && (
                      <button
                        type="button"
                        onClick={() => handleRemoveFile("bankDocUrl", "bankDocName")}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Employment & CTC (Strictly Admin Managed) */}
          {activeTab === "employment" && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 lg:p-8 shadow-xs space-y-6 animate-in fade-in">
              <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">Employment Details & Annual CTC</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Official job role, department, employee code, and compensation managed by Admin.
                  </p>
                </div>
                <span className="text-xs font-bold bg-rose-50 text-rose-900 border border-rose-200 px-3 py-1 rounded-full flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" /> Admin Controlled
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Designation
                  </div>
                  <div className="text-base font-extrabold text-slate-900 mt-1">
                    {currentUser?.designation || "Not Assigned"}
                  </div>
                  <div className="text-[11px] text-rose-700 mt-1 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Designated by Admin
                  </div>
                </div>

                <div className="p-5 bg-emerald-50/60 rounded-2xl border border-emerald-200">
                  <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    Annual Salary (CTC)
                  </div>
                  <div className="text-xl font-black text-emerald-950 mt-1">
                    ₹{Number(currentUser?.salary || 0).toLocaleString("en-IN")} / annum
                  </div>
                  <div className="text-[11px] text-emerald-700 mt-1 font-semibold">
                    Indian Rupees (INR) • Payroll Managed
                  </div>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Department
                  </div>
                  <div className="text-base font-extrabold text-slate-900 mt-1">
                    {currentUser?.department || "Robotics Engineering"}
                  </div>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Employee ID
                  </div>
                  <div className="text-base font-black font-mono text-slate-900 mt-1">
                    {currentUser?.employeeId}
                  </div>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Joining Date
                  </div>
                  <div className="text-base font-extrabold text-slate-900 mt-1">
                    {currentUser?.joinDate
                      ? new Date(currentUser.joinDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "N/A"}
                  </div>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Account Status
                  </div>
                  <div className="text-base font-extrabold text-slate-900 mt-1 flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        currentUser?.status === "ACTIVE" ? "bg-emerald-500" : "bg-rose-500"
                      }`}
                    />
                    <span>{currentUser?.status || "ACTIVE"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Action Floating / Bottom Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <span className="text-xs text-slate-500 font-medium">
              Ensure contact details and KYC documents are accurate.
            </span>

            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-7 py-3 bg-linear-to-r from-rose-800 to-rose-900 hover:from-rose-700 hover:to-rose-800 text-white font-bold text-sm rounded-xl shadow-md shadow-rose-950/20 transition-all disabled:opacity-60 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving Profile..." : "Save Profile Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}
