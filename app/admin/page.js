import AdminGate from "./AdminGate";
import { getAllBusinesses, getAllReviews, getCategories } from "@/lib/data";

export const metadata = {
  title: "Administrator portal — LocalLink"
};

export default function AdminPage() {
  const businesses = getAllBusinesses();
  const reviews = getAllReviews();
  const categories = getCategories();

  return (
    <AdminGate
      businesses={businesses}
      reviews={reviews}
      categories={categories}
    />
  );
  }
