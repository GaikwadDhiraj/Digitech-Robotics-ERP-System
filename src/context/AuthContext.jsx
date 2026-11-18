"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [role, setRole] = useState("EMPLOYEE"); // "ADMIN" or "EMPLOYEE"
  const [isLoading, setIsLoading] = useState(true);

  // Fetch employees list to populate users
  const refreshUsers = async () => {
    try {
      const res = await fetch("/api/employees");
      const result = await res.json();
      if (result.success && result.data.length > 0) {
        setEmployees(result.data);
        
        // Restore from localStorage or default
        const savedRole = localStorage.getItem("digitech_erp_role") || "EMPLOYEE";
        const savedUserId = localStorage.getItem("digitech_erp_user_id");

        setRole(savedRole);

        if (savedRole === "ADMIN") {
          const adminUser = result.data.find((e) => e.role === "ADMIN") || result.data[0];
          setCurrentUser(adminUser);
        } else {
          const empUser = result.data.find((e) => e.id === savedUserId) || result.data.find((e) => e.role === "EMPLOYEE") || result.data[0];
          setCurrentUser(empUser);
        }
      }
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUsers();
  }, []);

  const switchRole = (newRole) => {
    setRole(newRole);
    localStorage.setItem("digitech_erp_role", newRole);
    if (newRole === "ADMIN") {
      const adminUser = employees.find((e) => e.role === "ADMIN") || {
        id: "admin-1",
        employeeId: "ADM-001",
        name: "Admin User",
        email: "admin@digitech.com",
        designation: "System Administrator",
        role: "ADMIN",
        department: "Administration",
      };
      setCurrentUser(adminUser);
      localStorage.setItem("digitech_erp_user_id", adminUser.id);
    } else {
      const empUser = employees.find((e) => e.role === "EMPLOYEE") || employees[0];
      if (empUser) {
        setCurrentUser(empUser);
        localStorage.setItem("digitech_erp_user_id", empUser.id);
      }
    }
  };

  const switchEmployeeUser = (employeeId) => {
    const selected = employees.find((e) => e.id === employeeId);
    if (selected) {
      setCurrentUser(selected);
      setRole(selected.role);
      localStorage.setItem("digitech_erp_role", selected.role);
      localStorage.setItem("digitech_erp_user_id", selected.id);
    }
  };

  const updateUserProfile = (updatedData) => {
    setCurrentUser((prev) => ({ ...prev, ...updatedData }));
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === currentUser?.id ? { ...emp, ...updatedData } : emp))
    );
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        employees,
        refreshUsers,
        role,
        isAdmin: role === "ADMIN",
        switchRole,
        switchEmployeeUser,
        updateUserProfile,
        isLoading,
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
