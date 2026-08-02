import businesses from "@/data/businesses.json";
import categories from "@/data/categories.json";
import reviews from "@/data/reviews.json";

/**
 * Data access layer.
 *
 * Version 1 of LocalLink reads from the local JSON files bundled in /data,
 * exactly as described in the TRS (section 3.3 / 4.3). Every function below
 * is the seam to swap in a real database later: keep the function names and
 * shapes the same, and change only what happens inside them (e.g. call
 * Firestore instead of reading JSON) so the rest of the app never has to
 * change.
 */

export function getCategories() {
  return categories;
}

export function getCategoryById(id) {
  return categories.find((category) => category.id === id) || null;
}

export function getApprovedBusinesses() {
  return businesses.filter((business) => business.status === "approved");
}

export function getAllBusinesses() {
  return businesses;
}

export function getBusinessById(id) {
  return businesses.find((business) => business.id === id) || null;
}

export function getFeaturedBusinesses(limit = 4) {
  return getApprovedBusinesses()
    .filter((business) => business.featured)
    .slice(0, limit);
}

export function getBusinessesByCategory(categoryId) {
  return getApprovedBusinesses().filter(
    (business) => business.category === categoryId
  );
}

export function getApprovedReviewsForBusiness(businessId) {
  return reviews.filter(
    (review) => review.businessId === businessId && review.status === "approved"
  );
}

export function getAllReviews() {
  return reviews;
}

export function getAverageRating(businessId) {
  const businessReviews = getApprovedReviewsForBusiness(businessId);
  if (businessReviews.length === 0) return null;
  const total = businessReviews.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((total / businessReviews.length) * 10) / 10;
}

export function searchBusinesses({ query = "", category = "", area = "" } = {}) {
  const normalisedQuery = query.trim().toLowerCase();
  const normalisedArea = area.trim().toLowerCase();

  return getApprovedBusinesses().filter((business) => {
    const matchesQuery =
      normalisedQuery.length === 0 ||
      business.name.toLowerCase().includes(normalisedQuery) ||
      business.shortDescription.toLowerCase().includes(normalisedQuery) ||
      business.description.toLowerCase().includes(normalisedQuery);

    const matchesCategory = category.length === 0 || business.category === category;

    const matchesArea =
      normalisedArea.length === 0 ||
      business.area.toLowerCase().includes(normalisedArea) ||
      business.province.toLowerCase().includes(normalisedArea);

    return matchesQuery && matchesCategory && matchesArea;
  });
}
