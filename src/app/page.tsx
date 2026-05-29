"use client";

import { useState } from "react";
import { MedtrailApp } from "@/components/medtrail-app";
import { LandingPage } from "@/components/landing-page";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (isLoggedIn) {
    return <MedtrailApp onLogout={() => setIsLoggedIn(false)} />;
  }

  return <LandingPage onLoginSuccess={() => setIsLoggedIn(true)} />;
}
