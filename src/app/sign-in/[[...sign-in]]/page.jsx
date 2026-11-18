import { SignIn } from "@clerk/nextjs";
import { Suspense } from "react";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="mb-6 text-center flex flex-col items-center">
          <img
            src="/logo.jpg"
            alt="Digitech Robotics Logo"
            className="w-16 h-16 rounded-full object-cover shadow-xl border-2 border-rose-500/40 mb-3"
          />
          <h1 className="text-2xl font-black text-white tracking-tight">
            Digitech <span className="text-rose-500">Robotics</span>
          </h1>
          <p className="text-xs text-rose-300 font-semibold tracking-wider uppercase mt-0.5">India Pvt. Ltd. &bull; ERP</p>
          <p className="text-xs text-slate-400 mt-1">Sign in with your registered official email</p>
        </div>
        <Suspense fallback={<div className="text-white text-sm">Loading sign-in...</div>}>
          <SignIn
            appearance={{
              elements: {
                card: "shadow-2xl border border-slate-800 bg-white",
                formButtonPrimary: "bg-rose-700 hover:bg-rose-800 text-white font-medium",
              },
            }}
          />
        </Suspense>
      </div>
    </div>
  );
}
