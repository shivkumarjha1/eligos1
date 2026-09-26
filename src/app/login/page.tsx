"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginScreen } from "@/components/LoginScreen";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { currentUser, loginAsPersona } = useAuth();

  const handleLoginSuccess = () => {
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-[#EBF3FE]">
      <LoginScreen onLoginSuccess={handleLoginSuccess} />
    </main>
  );
}
