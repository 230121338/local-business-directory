"use client";

import { useState } from "react";
import RatingStars from "@/components/RatingStars";

export default function ReviewsSection({ businessId, initialReviews }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ userName: "", rating: 5, comment: "" });

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: name === "rating" ? Number(value) : value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!form.userName.trim() || !form.comment.trim()) return;

    // v1 note: this only updates local page state so the review appears
    // instantly for this visit. Once a real backend is connected (see
    // README), this should POST to an API route that saves the review with
    // status "pending" until an administrator approves it.
    const newReview = {
      id: `local-${Date.now()}`,
      businessId,
      userName: form.userName.trim(),
      rating: form.rating,
      comment: form.comment.trim(),
      status: "approved",
      date: new Date().toISOString().slice(0, 10)
    };

    setReviews((prev) => [newReview, ...prev]);
    setForm({ userName: "", rating: 5, comment: "" });
    setShowForm(false);
    setSubmitted(true);
  }

  return (
    <div className="pin-divider mt-8 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-semibold">
          Reviews ({reviews.length})
        </h2>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="text-sm font-medium text-clay hover:text-clay-dark"
        >
          {showForm ? "Cancel" : "Write a review"}
        </button>
      </div>

      {submitted && (
        <p className="text-sm text-teal bg-teal/10 border border-teal/30 rounded-stall px-3 py-2 mb-4">
          Thanks — your review has been added below.
        </p>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border-2 border-ink rounded-stall p-4 mb-6 space-y-3">
          <div>
            <label htmlFor="userName" className="block text-sm font-medium mb-1">Your name</label>
            <input
              id="userName"
              name="userName"
              type="text"
              value={form.userName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-line rounded-stall focus:outline-none focus:border-clay"
            />
          </div>

          <div>
            <label htmlFor="rating" className="block text-sm font-medium mb-1">Rating</label>
            <select
              id="rating"
              name="rating"
              value={form.rating}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-line rounded-stall bg-white focus:outline-none focus:border-clay"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>{n} star{n > 1 ? "s" : ""}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="comment" className="block text-sm font-medium mb-1">Your review</label>
            <textarea
              id="comment"
              name="comment"
              rows={3}
              value={form.comment}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-line rounded-stall focus:outline-none focus:border-clay"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2 bg-ink text-paper rounded-stall font-medium hover:bg-clay transition-colors"
          >
            Submit review
          </button>
        </form>
      )}

      {reviews.length === 0 ? (
        <p className="text-ink/60 text-sm">
          No reviews yet — be the first to share how it went.
        </p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((review) => (
            <li key={review.id} className="border-b border-line pb-4 last:border-none">
              <div className="flex items-center justify-between">
                <p className="font-medium">{review.userName}</p>
                <RatingStars rating={review.rating} />
              </div>
              <p className="text-sm text-ink/70 mt-1">{review.comment}</p>
              <p className="text-xs text-ink/40 font-mono mt-1">{review.date}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
