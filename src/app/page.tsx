"use client";

import { useState } from "react";
import { MedtrailApp } from "@/components/medtrail-app";
import { LandingPage } from "@/components/landing-page";
import { PatientView } from "@/components/patient-view";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<"doctor" | "patient">("doctor");

  if (isLoggedIn) {
    if (userRole === "doctor") {
      return <MedtrailApp onLogout={() => setIsLoggedIn(false)} />;
    } else {
      return <PatientView onLogout={() => setIsLoggedIn(false)} />;
    }
  }

  return <LandingPage onLoginSuccess={(role) => { setIsLoggedIn(true); setUserRole(role); }} />;
}
