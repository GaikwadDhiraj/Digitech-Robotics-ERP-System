"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Camera,
  Trash2,
  Upload,
  X,
  Check,
  User,
  Sparkles,
  Image as ImageIcon,
} from "lucide-react";

export default function ProfilePhotoModal({ isOpen, onClose }) {
  const { currentUser, updateUserProfile } = useAuth();

  const [previewUrl, setPreviewUrl] = useState(currentUser?.avatarUrl || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  if (!isOpen || !currentUser) return null;

  // Preset professional avatar options for fast testing/selection
  const presetAvatars = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=250&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=250&auto=format&fit=crop&q=80",
  ];

  // Handle local file upload
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: "error", text: "Image size must be under 5MB." });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        setMessage({ type: "info", text: "Photo selected. Click 'Save Photo' to apply." });
      };
      reader.readAsDataURL(file);
    }
  };

  // Save new photo
  const handleSave = async (urlToSave = previewUrl) => {
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch(`/api/employees/${currentUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarUrl: urlToSave || null }),
      });

      const result = await res.json();
      if (result.success) {
        updateUserProfile({ avatarUrl: urlToSave || null });
        setMessage({ type: "success", text: urlToSave ? "Profile photo updated!" : "Profile photo removed!" });
        setTimeout(() => {
          onClose();
        }, 800);
      } else {
        setMessage({ type: "error", text: result.error || "Failed to update photo." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "An error occurred while updating profile photo." });
    } finally {
      setSaving(false);
    }
  };

  // Delete/Remove photo
  const handleDeletePhoto = async () => {
    if (!previewUrl && !currentUser?.avatarUrl) return;
    if (!window.confirm("Are you sure you want to remove your profile photo?")) return;
    setPreviewUrl("");
    await handleSave("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden">
        {/* Modal Header with DigiTech Brand Crimson Accent */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-linear-to-r from-rose-950 via-slate-900 to-rose-950 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-500/20 border border-rose-500/30 rounded-xl text-rose-300">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Profile Photo Manager</h3>
              <p className="text-[11px] text-slate-300">Upload, edit, or delete your avatar</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Notification feedback */}
          {message.text && (
            <div
              className={`p-3 rounded-xl text-xs font-medium ${
                message.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : message.type === "error"
                  ? "bg-rose-50 text-rose-800 border border-rose-200"
                  : "bg-indigo-50 text-indigo-800 border border-indigo-200"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Current Avatar Large Circular Preview */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative group">
              <div className="w-36 h-36 rounded-full overflow-hidden ring-4 ring-rose-500/30 shadow-2xl bg-slate-100 flex items-center justify-center">
                {previewUrl ? (
                  <img src={previewUrl} alt="Avatar preview" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <div className="w-full h-full rounded-full flex flex-col items-center justify-center font-black text-3xl text-rose-900 bg-rose-50">
                    <span>{currentUser?.name?.substring(0, 2).toUpperCase() || "EP"}</span>
                    <span className="text-[10px] text-rose-600 font-semibold mt-1">No Photo</span>
                  </div>
                )}
              </div>

              {/* Quick file trigger overlay icon */}
              <label
                htmlFor="photoUploadInput"
                className="absolute inset-0 rounded-full bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-semibold cursor-pointer"
              >
                <Camera className="w-7 h-7" />
              </label>
            </div>

            <div className="text-center mt-3">
              <div className="font-bold text-sm text-slate-900">{currentUser.name}</div>
              <div className="text-xs text-rose-700 font-medium">{currentUser.designation}</div>
            </div>
          </div>

          {/* Action Buttons: Choose File & Delete Photo */}
          <div className="grid grid-cols-2 gap-3">
            <input
              type="file"
              id="photoUploadInput"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="photoUploadInput"
              className="flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 transition cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-rose-700" />
              <span>Upload New Photo</span>
            </label>

            <button
              type="button"
              onClick={handleDeletePhoto}
              disabled={!previewUrl && !currentUser?.avatarUrl}
              className="flex items-center justify-center gap-2 py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition cursor-pointer disabled:opacity-40"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Photo</span>
            </button>
          </div>

          {/* Preset Avatars Choice */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Or Select Professional Preset:
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              {presetAvatars.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPreviewUrl(url)}
                  className={`w-11 h-11 rounded-xl overflow-hidden ring-2 transition hover:scale-105 cursor-pointer ${
                    previewUrl === url ? "ring-rose-600 scale-105 shadow-md" : "ring-slate-200 opacity-80 hover:opacity-100"
                  }`}
                >
                  <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave(previewUrl)}
              className="flex items-center gap-1.5 px-5 py-2 bg-linear-to-r from-rose-800 to-rose-900 hover:from-rose-700 hover:to-rose-800 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-950/20 transition cursor-pointer disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{saving ? "Saving..." : "Save Photo"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
