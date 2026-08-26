"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@mobarak.at");
  const [password, setPassword] = useState("");

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <form
        className="w-full max-w-md rounded-2xl border border-line bg-white p-8 shadow-[var(--shadow-card)]"
        onSubmit={(e) => {
          e.preventDefault();
          router.push("/admin");
        }}
      >
        <h1 className="mb-6 text-2xl font-bold">Admin Anmeldung</h1>
        <label className="mb-4 block text-sm">
          <span className="mb-1 block font-medium">E-Mail</span>
          <input
            className="w-full rounded-lg border border-line px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
        </label>
        <label className="mb-6 block text-sm">
          <span className="mb-1 block font-medium">Passwort</span>
          <input
            className="w-full rounded-lg border border-line px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
        </label>
        <button type="submit" className="w-full rounded-xl bg-brand-cta py-3 text-sm font-semibold text-white">
          Anmelden (Demo)
        </button>
      </form>
    </div>
  );
}
