import { SignUp } from "@clerk/nextjs";
import { Suspense } from "react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-black text-white tracking-tight">
            DigiTech <span className="text-rose-500">ERP</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">Create your enterprise account</p>
        </div>
        <Suspense fallback={<div className="text-white text-sm">Loading sign-up...</div>}>
          <SignUp
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
