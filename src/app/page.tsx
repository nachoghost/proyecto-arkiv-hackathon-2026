"use client";

import { useState } from "react";
import { MedtrailApp } from "@/components/medtrail-app";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");

  const isFormValid = email.includes("@") && password.length >= 4;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Simple validation for hackathon
    if (!email.includes("@")) {
      setError("Email inválido");
      return;
    }
    if (password.length < 4) {
      setError("La contraseña debe tener al menos 4 caracteres");
      return;
    }

    // Login successful
    setIsLoggedIn(true);
  };

  if (isLoggedIn) {
    return <MedtrailApp onLogout={() => setIsLoggedIn(false)} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-med-text mb-2">MedTrail</h1>
          <p className="text-med-muted">Historial clínico verificable</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-med-text mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-med-border bg-med-surface text-med-text placeholder:text-med-muted focus:outline-none focus:ring-2 focus:ring-med-secondary focus:border-transparent"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-med-text mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-med-border bg-med-surface text-med-text placeholder:text-med-muted focus:outline-none focus:ring-2 focus:ring-med-secondary focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            className={`w-full py-4 px-6 text-white font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-med-secondary focus:ring-offset-2 ${
              isFormValid
                ? "bg-med-secondary hover:bg-med-secondary-hover shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                : "bg-med-secondary/50 cursor-not-allowed"
            }`}
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
}
