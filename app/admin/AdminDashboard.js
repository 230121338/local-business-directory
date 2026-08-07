"use client";

import { useEffect, useMemo, useState } from "react";

const TABS = ["Overview", "Businesses", "Reviews"];

export default function AdminDashboard(props) {
  const [businesses, setBusinesses] = useState(props.initialBusinesses);
  const [reviews, setReviews] = useState(props.initialReviews);
  const [tab, setTab] = useState("Overview");
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(function () {
    async function loadSubmissions() {
      try {
        const response = await fetch("/api/businesses", { cache: "no-store" });
        const body = await response.json();
        if (!response.ok) {
          throw new Error(body.error || "Could not load submissions.");
        }
        const submitted = body.businesses || [];
        setBusinesses(function (prev) {
          const existingIds = prev.map(function (b) { return b.id; });
          const newOnes = submitted.filter(function (b) { return existingIds.indexOf(b.id) === -1; });
          return prev.concat(newOnes);
        });
      } catch (error) {
        setFetchError(error.message);
      }
      setLoadingSubmissions(false);
    }
    loadSubmissions();
  }, []);

  const stats = useMemo(function () {
    const approved = businesses.filter(function (b) { return b.status === "approved"; }).length;
    const pending = businesses.filter(function (b) { return b.status === "pending"; }).length;
    const rejected = businesses.filter(function (b) { return b.status === "rejected"; }).length;
    const pendingReviews = reviews.filter(function (r) { return r.status === "pending"; }).length;
    return { approved: approved, pending: pending, rejected: rejected, pendingReviews: pendingReviews, total: businesses.length };
  }, [businesses, reviews]);

  async function updateBusinessStatus(id, status) {
    setBusinesses(function (prev) {
      return prev.map(function (b) { return b.id === id ? Object.assign({}, b, { status: status }) : b; });
    });

    const isSubmitted = id.indexOf("sub-") === 0;
    if (isSubmitted) {
      try {
        await fetch("/api/businesses/" + id, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: status })
        });
      } catch (error) {
        setFetchError("Could not save that change to the database.");
      }
    }
  }

  function updateReviewStatus(id, status) {
    setReviews(function (prev) {
      return prev.map(function (r) { return r.id === id ? Object.assign({}, r, { status: status }) : r; });
    });
  }

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-clay mb-1">Administrator portal</p>
          <h1 className="font-display text-3xl font-semibold">Dashboard</h1>
        </div>
        <button onClick={props.onSignOut} className="text-sm font-medium text-ink/60 hover:text-clay">Sign out</button>
      </div>

      {loadingSubmissions && <p className="text-sm text-ink/50 mb-4">Checking for new submissions...</p>}
      {fetchError && <p className="text-sm text-clay-dark bg-clay/10 border border-clay/30 rounded-stall px-3 py-2 mb-4">{fetchError}</p>}

      <nav className="flex gap-2 mb-8 border-b border-line">
        {TABS.map(function (t) {
          return (
            <button key={t} onClick={function () { setTab(t); }} className={"px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors " + (tab === t ? "border-clay text-clay" : "border-transparent text-ink/60 hover:text-ink")}>
              {t}
            </button>
          );
        })}
      </nav>

      {tab === "Overview" && <OverviewTab stats={stats} categories={props.categories} businesses={businesses} />}
      {tab === "Businesses" && <BusinessesTab businesses={businesses} onUpdateStatus={updateBusinessStatus} />}
      {tab === "Reviews" && <ReviewsTab reviews={reviews} businesses={businesses} onUpdateStatus={updateReviewStatus} />}
    </section>
  );
}

function OverviewTab(props) {
  const byCategory = props.categories.map(function (category) {
    const count = props.businesses.filter(function (b) { return b.category === category.id; }).length;
    return Object.assign({}, category, { count: count });
  });

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Approved listings" value={props.stats.approved} tone="teal" />
        <StatCard label="Pending review" value={props.stats.pending} tone="marigold" />
        <StatCard label="Rejected" value={props.stats.rejected} tone="ink" />
        <StatCard label="Reviews awaiting moderation" value={props.stats.pendingReviews} tone="clay" />
      </div>

      <div>
        <h2 className="font-display text-lg font-semibold mb-3">Listings by category</h2>
        <div className="bg-white border-2 border-ink rounded-stall divide-y divide-line">
          {byCategory.map(function (c) {
            return (
              <div key={c.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                <span>{c.name}</span>
                <span className="font-mono text-ink/60">{c.count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard(props) {
  const toneClasses = {
    teal: "border-teal text-teal",
    marigold: "border-marigold-dark text-marigold-dark",
    clay: "border-clay text-clay",
    ink: "border-ink/30 text-ink/60"
  };
  return (
    <div className={"border-2 rounded-stall p-4 bg-white " + toneClasses[props.tone]}>
      <p className="font-display text-3xl font-semibold">{props.value}</p>
      <p className="text-xs font-mono uppercase tracking-wide mt-1 text-ink/60">{props.label}</p>
    </div>
  );
}

function BusinessesTab(props) {
  const [filter, setFilter] = useState("pending");
  const filtered = filter === "all" ? props.businesses : props.businesses.filter(function (b) { return b.status === filter; });

  function exportCsv() {
    const header = ["Name", "Category", "Area", "Province", "Status", "Phone", "Email"];
    const rows = props.businesses.map(function (b) {
      return [b.name, b.category, b.area, b.province, b.status, b.phone, b.email];
    });
    downloadCsv("locallink-businesses.csv", header, rows);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex gap-2">
          {["pending", "approved", "rejected", "all"].map(function (status) {
            return (
              <button key={status} onClick={function () { setFilter(status); }} className={"px-3 py-1.5 text-xs font-mono uppercase tracking-wide rounded-stall border-2 " + (filter === status ? "border-ink bg-ink text-paper" : "border-line text-ink/60")}>
                {status}
              </button>
            );
          })}
        </div>
        <button onClick={exportCsv} className="text-sm font-medium text-clay hover:text-clay-dark">Export all as CSV ↓</button>
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
            {filtered.map(function (business) {
              return (
                <tr key={business.id} className="border-b border-line last:border-none">
                  <td className="px-4 py-3 font-medium">{business.name}</td>
                  <td className="px-4 py-3 text-ink/60">{business.area}</td>
                  <td className="px-4 py-3"><StatusPill status={business.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {business.status !== "approved" && (
                        <button onClick={function () { props.onUpdateStatus(business.id, "approved"); }} className="px-2.5 py-1 text-xs font-medium border-2 border-teal text-teal rounded-stall hover:bg-teal hover:text-paper transition-colors">Approve</button>
                      )}
                      {business.status !== "rejected" && (
                        <button onClick={function () { props.onUpdateStatus(business.id, "rejected"); }} className="px-2.5 py-1 text-xs font-medium border-2 border-clay text-clay rounded-stall hover:bg-clay hover:text-paper transition-colors">Reject</button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-ink/50">No businesses in this filter.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReviewsTab(props) {
  const [filter, setFilter] = useState("pending");
  const filtered = filter === "all" ? props.reviews : props.reviews.filter(function (r) { return r.status === filter; });

  function businessName(id) {
    const found = props.businesses.filter(function (b) { return b.id === id; })[0];
    return found ? found.name : "Unknown business";
  }

  function exportCsv() {
    const header = ["Business", "Reviewer", "Rating", "Comment", "Status", "Date"];
    const rows = props.reviews.map(function (r) {
      return [businessName(r.businessId), r.userName, r.rating, r.comment, r.status, r.date];
    });
    downloadCsv("locallink-reviews.csv", header, rows);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex gap-2">
          {["pending", "approved", "all"].map(function (status) {
            return (
              <button key={status} onClick={function () { setFilter(status); }} className={"px-3 py-1.5 text-xs font-mono uppercase tracking-wide rounded-stall border-2 " + (filter === status ? "border-ink bg-ink text-paper" : "border-line text-ink/60")}>
                {status}
              </button>
            );
          })}
        </div>
        <button onClick={exportCsv} className="text-sm font-medium text-clay hover:text-clay-dark">Export all as CSV ↓</button>
      </div>

      <ul className="space-y-3">
        {filtered.map(function (review) {
          return (
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
                  <button onClick={function () { props.onUpdateStatus(review.id, "approved"); }} className="px-2.5 py-1 text-xs font-medium border-2 border-teal text-teal rounded-stall hover:bg-teal hover:text-paper transition-colors">Approve</button>
                )}
                {review.status !== "rejected" && (
                  <button onClick={function () { props.onUpdateStatus(review.id, "rejected"); }} className="px-2.5 py-1 text-xs font-medium border-2 border-clay text-clay rounded-stall hover:bg-clay hover:text-paper transition-colors">Remove</button>
                )}
              </div>
            </li>
          );
        })}
        {filtered.length === 0 && <li className="text-center text-ink/50 py-8">No reviews in this filter.</li>}
      </ul>
    </div>
  );
}

function StatusPill(props) {
  const styles = {
    approved: "border-teal text-teal bg-teal/10",
    pending: "border-marigold-dark text-marigold-dark bg-marigold/10",
    rejected: "border-clay text-clay bg-clay/10"
  };
  return (
    <span className={"inline-block px-2 py-0.5 text-xs font-mono uppercase tracking-wide rounded-stall border " + (styles[props.status] || styles.pending)}>
      {props.status}
    </span>
  );
}

function downloadCsv(filename, header, rows) {
  function escapeValue(value) {
    return '"' + String(value).replace(/"/g, '""') + '"';
  }
  const allRows = [header].concat(rows);
  const csvLines = allRows.map(function (row) {
    return row.map(escapeValue).join(",");
  });
  const csvContent = csvLines.join("\n");

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
