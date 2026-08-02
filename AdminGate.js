"use client";

import { useState } from "react";
import AdminDashboard from "./AdminDashboard";

// Demo-only credential so reviewers can see the admin portal without a real
// backend. This is NOT secure and must not be relied on in production — see
// the "Turning this into a real backend" section of the README for how to
// replace it with proper authentication (e.g. NextAuth + hashed passwords,
// as described in TRS section 8).
const DEMO_PASSWORD = "locallink-admin";

export default function AdminGate({ businesses, reviews, categories }) {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (password === DEMO_PASSWORD) {
      setAuthed(true);
      setError("");
    } else {
      setError("Incorrect password. Try the demo password from the README.");
    }
  }

  if (authed) {
    return (
      <AdminDashboard
        initialBusinesses={businesses}
        initialReviews={reviews}
        categories={categories}
        onSignOut={() => setAuthed(false)}
      />
    );
  }

  return (
    <section className="max-w-sm mx-auto px-4 sm:px-6 py-20">
      <p className="font-mono text-xs uppercase tracking-wide text-clay mb-2 text-center">
        Administrator portal
      </p>
      <h1 className="font-display text-2xl font-semibold mb-6 text-center">
        Sign in to continue
      </h1>

      <form onSubmit={handleSubmit} className="bg-white border-2 border-ink rounded-stall p-5 space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-line rounded-stall focus:outline-none focus:border-clay"
            autoFocus
          />
          {error && <p className="text-xs text-clay-dark mt-1">{error}</p>}
        </div>
        <button
          type="submit"
          className="w-full px-5 py-2.5 bg-ink text-paper rounded-stall font-medium hover:bg-clay transition-colors"
        >
          Sign in
        </button>
        <p className="text-xs text-ink/50 text-center">
          Demo password: <span className="font-mono">locallink-admin</span>
        </p>
      </form>
    </section>
  );
}
