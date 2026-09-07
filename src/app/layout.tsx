import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "EligOS CTMS | Clinical Trial Eligibility Review Platform",
  description: "GCP-compliant Eligibility Review Platform for PIs, CROs, and Sponsors",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
