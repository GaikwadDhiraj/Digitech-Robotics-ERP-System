"use client";

import { useEffect, useState } from "react";
import { Download, Smartphone, MonitorDown, X, Share, PlusSquare, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [installedSuccessfully, setInstalledSuccessfully] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("[PWA] Service Worker registered with scope:", reg.scope);
        })
        .catch((err) => {
          console.warn("[PWA] Service Worker registration failed:", err);
        });
    }

    // 2. Check if already running in standalone mode (installed)
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true ||
        document.referrer.includes("android-app://");
      setIsStandalone(isStandaloneMode);
    };

    checkStandalone();

    // 3. Detect iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice =
      /iphone|ipad|ipod/.test(userAgent) &&
      !window.MSStream &&
      !window.matchMedia("(display-mode: standalone)").matches;
    setIsIOS(isIosDevice);

    // 4. Capture beforeinstallprompt for Chrome / Edge / Android / PC
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Check session dismissal
      const dismissed = sessionStorage.getItem("pwa_install_dismissed");
      if (!dismissed) {
        setIsDismissed(false);
      }
    };

    // 5. Capture appinstalled event
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
      setInstalledSuccessfully(true);
      setTimeout(() => setInstalledSuccessfully(false), 5000);
      console.log("[PWA] Digitech ERP successfully installed!");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    if (!deferredPrompt) {
      // Fallback for browsers without direct prompt API (Firefox, Desktop Safari)
      alert(
        "To install Digitech ERP:\n\n• On Chrome/Edge (PC & Mac): Click the Install icon (computer with down arrow) in the browser address bar.\n• On Mobile: Tap the 3-dots browser menu and select 'Install app' or 'Add to Home screen'."
      );
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[PWA] Install prompt outcome: ${outcome}`);
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setIsDismissed(true);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("pwa_install_dismissed", "true");
    }
  };

  // If already running standalone or installed, don't show the banner
  if (isStandalone) {
    return null;
  }

  return (
    <>
      {/* Success Notification */}
      {installedSuccessfully && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-xs sm:text-sm font-semibold">
            Digitech ERP successfully installed to your device!
          </span>
        </div>
      )}

      {/* Floating Install Pill / Action Bar (Responsive across Mobile & Desktop) */}
      {!isDismissed && (
        <aside
          aria-label="Install Digitech ERP Application"
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-40 max-w-md bg-white/95 backdrop-blur-md border border-rose-200/80 shadow-2xl rounded-2xl p-3 sm:p-3.5 transition-all duration-300 hover:shadow-rose-900/10 hover:border-rose-300 animate-in fade-in slide-in-from-bottom-5"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7a1228] to-[#991b36] p-1.5 flex items-center justify-center shrink-0 shadow-md">
                <Image
                  src="/favicon.png"
                  alt="Digitech ERP"
                  width={28}
                  height={28}
                  className="rounded-md object-contain"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    Digitech ERP App
                  </h2>
                  <span className="hidden xs:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                    PC & Mobile
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">
                  Install for fast, native 1-click access
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleInstallClick}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#7a1228] to-[#991b36] hover:from-[#650e20] hover:to-[#83162d] shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer"
                title="Install Digitech ERP"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install</span>
              </button>

              <button
                onClick={handleDismiss}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                title="Dismiss for this session"
                aria-label="Dismiss banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Persistent subtle button if dismissed */}
      {isDismissed && (
        <button
          onClick={handleInstallClick}
          className="fixed bottom-4 right-4 z-40 bg-white/90 backdrop-blur border border-rose-200 text-[#7a1228] hover:bg-rose-50 p-2.5 sm:px-3.5 sm:py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 cursor-pointer group"
          title="Install Digitech ERP to your PC, Mac, iPhone, or Android"
          aria-label="Install App"
        >
          <div className="w-6 h-6 rounded-full bg-rose-100 text-[#7a1228] flex items-center justify-center group-hover:scale-110 transition-transform">
            <MonitorDown className="w-3.5 h-3.5" />
          </div>
          <span className="hidden sm:inline text-xs font-bold text-slate-700 group-hover:text-[#7a1228]">
            Install App
          </span>
        </button>
      )}

      {/* iOS Safari Instructions Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center pt-2 pb-4">
              <div className="w-14 h-14 rounded-2xl bg-[#7a1228] p-2 mx-auto mb-3 shadow-lg flex items-center justify-center">
                <Image
                  src="/favicon.png"
                  alt="Digitech ERP"
                  width={40}
                  height={40}
                  className="rounded-lg object-contain"
                />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Install Digitech ERP on iOS
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Install on your iPhone or iPad home screen in 2 quick steps:
              </p>
            </div>

            <div className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs text-slate-700">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-rose-100 text-[#7a1228] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  Tap the <strong className="text-slate-900">Share</strong> icon{" "}
                  <Share className="w-3.5 h-3.5 inline mx-1 text-sky-600" /> at the
                  bottom of Safari.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-rose-100 text-[#7a1228] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  Scroll down and tap{" "}
                  <strong className="text-slate-900">Add to Home Screen</strong>{" "}
                  <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-slate-700" />.
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-r from-[#7a1228] to-[#991b36] text-white text-xs font-bold hover:brightness-105 transition-all"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
