const DB_URL = process.env.FIREBASE_DB_URL;

function assertConfigured() {
  if (!DB_URL) {
    throw new Error("FIREBASE_DB_URL is not set in Vercel environment variables.");
  }
}

export async function getSubmittedBusinesses() {
  assertConfigured();
  const url = DB_URL + "/businesses.json";
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Could not reach the database.");
  }
  const data = await response.json();
  if (!data) return [];
  return Object.entries(data).map((entry) => {
    const id = entry[0];
    const value = entry[1];
    return Object.assign({ id: id }, value);
  });
}

export async function saveSubmittedBusiness(business) {
  assertConfigured();
  const url = DB_URL + "/businesses/" + business.id + ".json";
  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(business)
  });
  if (!response.ok) {
    throw new Error("Could not save the submission.");
  }
  return business;
}

export async function updateSubmittedBusinessStatus(id, status) {
  assertConfigured();
  const url = DB_URL + "/businesses/" + id + ".json";
  const response = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: status })
  });
  if (!response.ok) {
    throw new Error("Could not update the business.");
  }
  return response.json();
    }
