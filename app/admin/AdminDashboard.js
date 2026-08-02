"use client";

import { useMemo, useState } from "react";

const TABS = ["Overview", "Businesses", "Reviews"];

export default function AdminDashboard({ initialBusinesses, initialReviews, categories, onSignOut }) {
  const [businesses, setBusinesses] = useState(initialBusinesses);
  const [reviews, setReviews] = useState(initialReviews);
  const [tab, setTab] = useState("Overview");

  const stats = useMemo(() => {
    const approved = businesses.filter((b) => b.status === "approved").length;
    const pending = businesses.filter((b) => b.status === "pending").length;
    const rejected = businesses.filter((b) => b.status === "rejected").length;
    const pendingReviews = reviews.filter((r) => r.status === "pending").length;
    return { approved, pending, rejected, pendingReviews, total: businesses.length };
  }, [businesses, reviews]);

  function updateBusinessStatus(id, status) {
    // Demo note: this only updates in-memory state, so it resets on reload.
    // Once a real database is connected, this should call an API route
    // (e.g. PATCH /api/businesses/:id) that persists the change.
    setBusinesses((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
  }

  function updateReviewStatus(id, status) {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-clay mb-1">
            Administrator portal
          </p>
          <h1 className="font-display text-3xl font-semibold">Dashboard</h1>
        </div>
        <button
          onClick={onSignOut}
          className="text-sm font-medium text-ink/60 hover:text-clay"
        >
          Sign out
        </button>
      </div>

      <nav className="flex gap-2 mb-8 border-b border-line">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t ? "border-clay text-clay" : "border-transparent text-ink/60 hover:text-ink"
            }`}
          >
            {t}
          </button>
        ))}
      </nav>

      {tab === "Overview" && <OverviewTab stats={stats} categories={categories} businesses={businesses} />}
      {tab === "Businesses" && (
        <BusinessesTab businesses={businesses} onUpdateStatus={updateBusinessStatus} />
      )}
      {tab === "Reviews" && (
        <ReviewsTab reviews={reviews} businesses={businesses} onUpdateStatus={updateReviewStatus} />
      )}
    </section>
  );
}

function OverviewTab({ stats, categories, businesses }) {
  const byCategory = categories.map((category) => ({
    ...category,
    count: businesses.filter((b) => b.category === category.id).length
  }));

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Approved listings" value={stats.approved} tone="teal" />
        <StatCard label="Pending review" value={stats.pending} tone="marigold" />
        <StatCard label="Rejected" value={stats.rejected} tone="ink" />
        <StatCard label="Reviews awaiting moderation" value={stats.pendingReviews} tone="clay" />
      </div>

      <div>
        <h2 className="font-display text-lg font-semibold mb-3">Listings by category</h2>
        <div className="bg-white border-2 border-ink rounded-stall divide-y divide-line">
          {byCategory.map((c) => (
            <div key={c.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
              <span>{c.name}</span>
              <span className="font-mono text-ink/60">{c.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, tone }) {
  const toneClasses = {
    teal: "border-teal text-teal",
    marigold: "border-marigold-dark text-marigold-dark",
    clay: "border-clay text-clay",
    ink: "border-ink/30 text-ink/60"
  };
  return (
    <div className={`border-2 rounded-stall p-4 bg-white ${toneClasses[tone]}`}>
      <p className="font-display text-3xl font-semibold">{value}</p>
      <p className="text-xs font-mono uppercase tracking-wide mt-1 text-ink/60">{label}</p>
    </div>
  );
}

function BusinessesTab({ businesses, onUpdateStatus }) {
  const [filter, setFilter] = useState("pending");
  const filtered = filter === "all" ? businesses : businesses.filter((b) => b.status === filter);

  function exportCsv() {
    const header = ["Name", "Category", "Area", "Province", "Status", "Phone", "Email"];
    const rows = businesses.map((b) => [
      b.name, b.category, b.area, b.province, b.status, b.phone, b.email
    ]);
    downloadCsv("locallink-businesses.csv", header, rows);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex gap-2">
          {["pending", "approved", "rejected", "all"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wide rounded-stall border-2 ${
                filter === status ? "border-ink bg-ink text-paper" : "border-line text-ink/60"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <button
          onClick={exportCsv}
          className="text-sm font-medium text-clay hover:text-clay-dark"
        >
          Export all as CSV ↓
        </button>
      </div>

      <div className="bg-white border-2 border-ink rounded-stall overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-ink text-left">
              <th className="px-4 py-2.5 font-mono text-xs uppercase tracking-wide">Business</th>
              <th className="px-4 py-2.5 font-mono text-xs uppercase tracking-wide">Area</th>
              <th className="px-4 py-2.5 font-mono text-xs uppercase tracking-wide">Status</th>
              <th className="px-4 py-2.5 font-mono text-xs uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((business) => (
              <tr key={business.id} className="border-b border-line last:border-none">
                <td className="px-4 py-3 font-medium">{business.name}</td>
                <td className="px-4 py-3 text-ink/60">{business.area}</td>
                <td className="px-4 py-3">
                  <StatusPill status={business.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {business.status !== "approved" && (
                      <button
                        onClick={() => onUpdateStatus(business.id, "approved")}
                        className="px-2.5 py-1 text-xs font-medium border-2 border-teal text-teal rounded-stall hover:bg-teal hover:text-paper transition-colors"
                      >
                        Approve
                      </button>
                    )}
                    {business.status !== "rejected" && (
                      <button
                        onClick={() => onUpdateStatus(business.id, "rejected")}
                        className="px-2.5 py-1 text-xs font-medium border-2 border-clay text-clay rounded-stall hover:bg-clay hover:text-paper transition-colors"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-ink/50">
                  No businesses in this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReviewsTab({ reviews, businesses, onUpdateStatus }) {
  const [filter, setFilter] = useState("pending");
  const filtered = filter === "all" ? reviews : reviews.filter((r) => r.status === filter);

  function businessName(id) {
    return businesses.find((b) => b.id === id)?.name || "Unknown business";
  }

  function exportCsv() {
    const header = ["Business", "Reviewer", "Rating", "Comment", "Status", "Date"];
    const rows = reviews.map((r) => [
      businessName(r.businessId), r.userName, r.rating, r.comment, r.status, r.date
    ]);
    downloadCsv("locallink-reviews.csv", header, rows);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex gap-2">
          {["pending", "approved", "all"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wide rounded-stall border-2 ${
                filter === status ? "border-ink bg-ink text-paper" : "border-line text-ink/60"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <button
          onClick={exportCsv}
          className="text-sm font-medium text-clay hover:text-clay-dark"
        >
          Export all as CSV ↓
        </button>
      </div>

      <ul className="space-y-3">
        {filtered.map((review) => (
          <li key={review.id} className="bg-white border-2 border-ink rounded-stall p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{review.userName} <span className="text-ink/40 font-normal">on</span> {businessName(review.businessId)}</p>
                <p className="text-sm text-marigold-dark font-mono">{"★".repeat(review.rating)}</p>
                <p className="text-sm text-ink/70 mt-1">{review.comment}</p>
              </div>
              <StatusPill status={review.status} />
            </div>
            <div className="flex gap-2 mt-3">
              {review.status !== "approved" && (
                <button
                  onClick={() => onUpdateStatus(review.id, "approved")}
                  className="px-2.5 py-1 text-xs font-medium border-2 border-teal text-teal rounded-stall hover:bg-teal hover:text-paper transition-colors"
                >
                  Approve
                </button>
              )}
              {review.status !== "rejected" && (
                <button
                  onClick={() => onUpdateStatus(review.id, "rejected")}
                  className="px-2.5 py-1 text-xs font-medium border-2 border-clay text-clay rounded-stall hover:bg-clay hover:text-paper transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="text-center text-ink/50 py-8">No reviews in this filter.</li>
        )}
      </ul>
    </div>
  );
}

function StatusPill({ status }) {
  const styles = {
    approved: "border-teal text-teal bg-teal/10",
    pending: "border-marigold-dark text-marigold-dark bg-marigold/10",
    rejected: "border-clay text-clay bg-clay/10"
  };
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-mono uppercase tracking-wide rounded-stall border ${styles[status] || styles.pending}`}>
      {status}
    </span>
  );
}

function downloadCsv(filename, header, rows) {
  const escape = (value) => `"${String(value).replace(/"/g, '""')}"`;
  const csvContent = [header, ...rows]
    .map((row) => row.map(escape).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
