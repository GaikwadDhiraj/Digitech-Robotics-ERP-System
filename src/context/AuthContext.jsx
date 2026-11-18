"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

const AuthContext = createContext();

const ADMIN_EMAIL = "dvgaikwad333@gmail.com";

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [role, setRole] = useState("EMPLOYEE"); // "ADMIN" or "EMPLOYEE"
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Clerk User hook
  const { isLoaded: isClerkLoaded, isSignedIn: isClerkSignedIn, user: clerkUser } = useUser();

  // Fetch employees list from DB (accessible to authenticated users)
  const refreshUsers = async () => {
    try {
      const res = await fetch("/api/employees");
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        setEmployees(result.data);
        return result.data;
      }
    } catch (err) {
      console.error("Failed to load users:", err);
    }
    return [];
  };

  // Sync Clerk authenticated user to DB immediately upon login
  useEffect(() => {
    if (!isClerkLoaded) return;

    if (!isClerkSignedIn) {
      setCurrentUser(null);
      setIsAuthorized(false);
      setAuthError(null);
      setIsLoading(false);
      return;
    }

    if (isClerkSignedIn && clerkUser) {
      const email = clerkUser.primaryEmailAddress?.emailAddress;
      const name =
        clerkUser.fullName ||
        [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
        email?.split("@")[0] ||
        "Employee User";
      const avatarUrl = clerkUser.imageUrl;
      const clerkId = clerkUser.id;

      if (email) {
        setIsLoading(true);
        fetch("/api/auth/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clerkId, email, name, avatarUrl }),
        })
          .then(async (res) => {
            const resData = await res.json();
            if (res.ok && resData.success && resData.user) {
              setCurrentUser(resData.user);
              setIsAuthorized(true);
              setAuthError(null);

              // Set role
              const userRole = resData.user.role || (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? "ADMIN" : "EMPLOYEE");
              setRole(userRole);
              localStorage.setItem("digitech_erp_role", userRole);
              localStorage.setItem("digitech_erp_user_id", resData.user.id);

              // Refresh list so newly verified employee appears
              refreshUsers();
            } else {
              // Access denied (user email not registered by admin)
              setIsAuthorized(false);
              setAuthError(resData.message || "Your official email is not registered in the system.");
              setCurrentUser(null);
            }
          })
          .catch((err) => {
            console.error("Failed to sync logged-in email to database:", err);
            setAuthError("Failed to communicate with authentication server.");
            setIsAuthorized(false);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    }
  }, [isClerkLoaded, isClerkSignedIn, clerkUser?.id]);

  const switchRole = (newRole) => {
    // Only real ADMIN can switch to ADMIN view
    const isRealAdmin =
      currentUser?.role === "ADMIN" ||
      currentUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

    if (newRole === "ADMIN" && !isRealAdmin) {
      alert("Access Denied: Only administrators can access Admin view.");
      return;
    }

    setRole(newRole);
    localStorage.setItem("digitech_erp_role", newRole);
  };

  const switchEmployeeUser = (employeeId) => {
    // Admin can preview specific employees
    if (currentUser?.role === "ADMIN") {
      const selected = employees.find((e) => e.id === employeeId);
      if (selected) {
        setCurrentUser(selected);
      }
    }
  };

  const updateUserProfile = (updatedData) => {
    setCurrentUser((prev) => ({ ...prev, ...updatedData }));
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === currentUser?.id ? { ...emp, ...updatedData } : emp))
    );
  };

  const isRealAdmin =
    currentUser?.role === "ADMIN" ||
    currentUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        employees,
        refreshUsers,
        role,
        isAdmin: isRealAdmin && role === "ADMIN",
        isRealAdmin,
        isAuthorized,
        authError,
        switchRole,
        switchEmployeeUser,
        updateUserProfile,
        isLoading,
        clerkUser,
        isClerkSignedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
