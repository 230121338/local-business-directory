const DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const DAY_LABELS = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday"
};

export function getDayLabel(key) {
  return DAY_LABELS[key] || key;
}

export function getOrderedHours(hours = {}) {
  return ["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((key) => ({
    key,
    label: getDayLabel(key),
    value: hours[key] || "closed"
  }));
}

/**
 * Works out whether a business is open right now, based on the visitor's
 * local browser time. Falls back gracefully for entries like "by appointment"
 * or "closed" that aren't a strict time range.
 */
export function getOpenStatus(hours = {}) {
  const now = new Date();
  const todayKey = DAY_KEYS[now.getDay()];
  const todayValue = (hours[todayKey] || "closed").trim().toLowerCase();

  if (todayValue === "closed") {
    return { isOpen: false, label: "Closed today" };
  }

  if (!todayValue.includes("-")) {
    // e.g. "by appointment"
    return { isOpen: false, label: "By appointment" };
  }

  const [start, end] = todayValue.split("-").map((part) => part.trim());
  const [startH, startM] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);

  const minutesNow = now.getHours() * 60 + now.getMinutes();
  const minutesStart = startH * 60 + startM;
  const minutesEnd = endH * 60 + endM;

  const isOpen = minutesNow >= minutesStart && minutesNow <= minutesEnd;
  return {
    isOpen,
    label: isOpen ? "Open now" : "Closed now"
  };
}

export function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function formatPhoneForTel(phone) {
  return `+27${phone.replace(/^0/, "").replace(/\s+/g, "")}`;
}

export function formatWhatsAppLink(whatsapp, message = "") {
  const digits = whatsapp.replace(/\D/g, "");
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${text}`;
}

/**
 * Shared validation for the business submission form. Kept framework
 * agnostic so it can run both client-side (instant feedback) and,
 * later, server-side once a real backend is added.
 */
export function validateBusinessSubmission(values) {
  const errors = {};

  if (!values.name || values.name.trim().length < 2) {
    errors.name = "Business name must be at least 2 characters.";
  }
  if (!values.category) {
    errors.category = "Please select a category.";
  }
  if (!values.shortDescription || values.shortDescription.trim().length < 10) {
    errors.shortDescription = "Give a short description of at least 10 characters.";
  }
  if (!values.phone || !/^[0-9+\s]{7,15}$/.test(values.phone.trim())) {
    errors.phone = "Enter a valid South African phone number.";
  }
  if (!values.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (!values.area || values.area.trim().length < 2) {
    errors.area = "Enter the suburb, town or area.";
  }

  return errors;
}
