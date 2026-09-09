"use client";

import React, { createContext, useContext, useState } from "react";
import { UserProfile, UserRole, Study, StudyEnrollmentSummary } from "@/types";

interface AuthContextType {
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  users: UserProfile[];
  studies: Study[];
  studySummaries: StudyEnrollmentSummary[];
  selectedStudyId: string;
  setSelectedStudyId: (id: string) => void;
  addUser: (user: Omit<UserProfile, "uid">) => void;
  updateUser: (uid: string, updates: Partial<UserProfile>) => void;
  deleteUser: (uid: string) => void;
  switchRole: (role: UserRole) => void;
  loginAsPersona: (email: string) => void;
  loading: boolean;
}

export const ADMIN_USER: UserProfile = {
  uid: "admin_user",
  first: "Dr.",
  last: "Jha",
  email: "drjha@neuriqiz.com",
  role: "SuperAdmin",
  site: "Global HQ",
  active: true,
  assignedStudies: ["SLT-206-C118", "MHT-2101-C01", "GAD-002-NEXUS", "SCZ-005-APOLLO", "XPF-010-BS01", "TEST-001-DEMO"],
};

export const PI_USER: UserProfile = {
  uid: "pi_user",
  first: "Dr. Elena",
  last: "Vance",
  email: "pi.vance@apex-trials.org",
  role: "PI",
  site: "Apex Medical Research Center",
  active: true,
  assignedStudies: ["SLT-206-C118", "MHT-2101-C01"],
};

export const CRO_USER: UserProfile = {
  uid: "cro_user",
  first: "Marcus",
  last: "Reynolds",
  email: "mreynolds@synapse-cro.com",
  role: "CRO",
  site: "Synapse Clinical Operations",
  active: true,
  assignedStudies: ["SLT-206-C118", "GAD-002-NEXUS"],
};

export const SPONSOR_USER: UserProfile = {
  uid: "sponsor_user",
  first: "Marcus",
  last: "DiFrisco",
  email: "mdinfrisco@meridianhelix.com",
  role: "Sponsor",
  site: "Solastis Bio / Meridian Helix",
  active: true,
  assignedStudies: ["SLT-206-C118", "XPF-010-BS01"],
};

const INITIAL_USERS: UserProfile[] = [ADMIN_USER, PI_USER, CRO_USER, SPONSOR_USER];

const INITIAL_STUDIES: Study[] = [
  {
    id: "SLT-206-C118",
    title: "Cerevastatin in Depressive Episodes Associated With Bipolar I or II Disorder (Bipolar Depression)",
    ind: "Bipolar I Disorder (ICD-10 F31.9)",
    phase: "Phase III",
    sponsor: "Solastis Bio",
    sponsorEmail: "clinical@solastis.com",
    target: 50,
    enrolled: 0,
    status: "Active",
  },
  {
    id: "ZP-010-BS01",
    title: "ZEPHYR Phase III Protocol",
    ind: "Bipolar Depression",
    phase: "Phase III",
    sponsor: "Zephyr Pharma",
    sponsorEmail: "trial@zephyr.com",
    target: 400,
    enrolled: 180,
    status: "Active",
  },
  {
    id: "MHT-2101-C01",
    title: "MYOGUARD-1 Phase III Clinical Protocol",
    ind: "Voss-Kellerman Congenital Myopathy (VKCM)",
    phase: "Phase III",
    sponsor: "Meridian Helix Therapeutics, Inc.",
    sponsorEmail: "mdinfrisco@meridianhelix.com",
    ip: "voskatagene lorparvovec (MHT-2101)",
    target: 24,
    enrolled: 0,
    status: "Active",
  },
];

const INITIAL_STUDY_SUMMARIES: StudyEnrollmentSummary[] = [
  {
    id: "SLT-206-C118",
    title: "Cerevastatin in Depressive Episodes Associated With Bipolar I or II Disorder (Bipolar Depression)",
    subtitle: "SLT-206-C118 Cerevastatin • Bipolar I Disorder (ICD-10 F31.9) • Phase III",
    status: "Active",
    enrolled: 0,
    target: 50,
    percentage: 0,
  },
  {
    id: "MHT-2101-C01",
    title: "MYOGUARD-1 Phase III",
    subtitle: "MHT-2101-C01 • Voss-Kellerman Congenital Myopathy (VKCM) • Phase III",
    status: "Active",
    enrolled: 0,
    target: 24,
    percentage: 0,
  },
  {
    id: "GAD-002-NEXUS",
    title: "NEXUS Phase II",
    subtitle: "GAD-002-NEXUS • Generalized Anxiety • Phase II",
    status: "Active",
    enrolled: 45,
    target: 150,
    percentage: 30,
  },
  {
    id: "SCZ-005-APOLLO",
    title: "APOLLO Phase II",
    subtitle: "SCZ-005-APOLLO • Schizophrenia • Phase II",
    status: "Active",
    enrolled: 12,
    target: 200,
    percentage: 6,
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(ADMIN_USER);
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [studies, setStudies] = useState<Study[]>(INITIAL_STUDIES);
  const [studySummaries, setStudySummaries] = useState<StudyEnrollmentSummary[]>(INITIAL_STUDY_SUMMARIES);
  const [selectedStudyId, setSelectedStudyId] = useState<string>("SLT-206-C118");
  const [loading, setLoading] = useState(false);

  // Load state from localStorage on initial render
  React.useEffect(() => {
    try {
      const savedUsers = localStorage.getItem("eligos_users");
      if (savedUsers) {
        setUsers(JSON.parse(savedUsers));
      }
      const savedCurrentUser = localStorage.getItem("eligos_current_user");
      if (savedCurrentUser) {
        setCurrentUser(JSON.parse(savedCurrentUser));
      }
      const savedStudy = localStorage.getItem("eligos_selected_study");
      if (savedStudy) {
        setSelectedStudyId(savedStudy);
      }
    } catch (e) {
      console.error("Failed to load auth state from localStorage", e);
    }
  }, []);

  // Sync users to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem("eligos_users", JSON.stringify(users));
    } catch (e) {
      console.error("Failed to save users to localStorage", e);
    }
  }, [users]);

  // Sync currentUser to localStorage
  React.useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem("eligos_current_user", JSON.stringify(currentUser));
      }
    } catch (e) {
      console.error("Failed to save current user to localStorage", e);
    }
  }, [currentUser]);

  // Sync selectedStudyId to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem("eligos_selected_study", selectedStudyId);
    } catch (e) {
      console.error("Failed to save selected study to localStorage", e);
    }
  }, [selectedStudyId]);

  // Enforce study assignment scope for non-admin current users
  React.useEffect(() => {
    if (currentUser && currentUser.role !== "SuperAdmin" && currentUser.role !== "Admin") {
      const assigned = currentUser.assignedStudies || [];
      if (assigned.length > 0) {
        const isCurrentSelectedAssigned = assigned.some(
          (code) => selectedStudyId.includes(code) || code.includes(selectedStudyId.split(" ")[0])
        );
        if (!isCurrentSelectedAssigned) {
          const firstAssigned = assigned[0];
          const matchedSummary = studySummaries.find(
            (s) => s.id.includes(firstAssigned) || s.subtitle.includes(firstAssigned)
          );
          setSelectedStudyId(matchedSummary ? matchedSummary.subtitle : firstAssigned);
        }
      }
    }
  }, [currentUser, selectedStudyId, studySummaries]);

  const switchRole = (role: UserRole) => {
    const userInState = users.find((u) => u.role === role);
    if (userInState) {
      setCurrentUser(userInState);
    } else if (role === "PI") setCurrentUser(PI_USER);
    else if (role === "CRO") setCurrentUser(CRO_USER);
    else if (role === "Sponsor") setCurrentUser(SPONSOR_USER);
    else setCurrentUser(ADMIN_USER);
  };

  const loginAsPersona = (email: string) => {
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
    } else if (email.includes("pi")) {
      const piInState = users.find((u) => u.role === "PI");
      setCurrentUser(piInState || PI_USER);
    } else if (email.includes("cro") || email.includes("synapse") || email.includes("reynolds")) {
      const croInState = users.find((u) => u.role === "CRO");
      setCurrentUser(croInState || CRO_USER);
    } else if (email.includes("sponsor") || email.includes("meridian")) {
      const sponsorInState = users.find((u) => u.role === "Sponsor");
      setCurrentUser(sponsorInState || SPONSOR_USER);
    } else {
      const adminInState = users.find((u) => u.role === "SuperAdmin" || u.role === "Admin");
      setCurrentUser(adminInState || ADMIN_USER);
    }
  };

  const addUser = (userData: Omit<UserProfile, "uid">) => {
    const newUser: UserProfile = {
      ...userData,
      uid: `user_${Date.now()}`,
    };
    setUsers((prev) => [...prev, newUser]);
  };

  const updateUser = (uid: string, updates: Partial<UserProfile>) => {
    setUsers((prev) => {
      const updatedList = prev.map((u) => (u.uid === uid ? { ...u, ...updates } : u));
      return updatedList;
    });
    if (currentUser?.uid === uid) {
      setCurrentUser((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const deleteUser = (uid: string) => {
    setUsers((prev) => prev.filter((u) => u.uid !== uid));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        studies,
        studySummaries,
        selectedStudyId,
        setSelectedStudyId,
        addUser,
        updateUser,
        deleteUser,
        switchRole,
        loginAsPersona,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
