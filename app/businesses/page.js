import Link from "next/link";
import BusinessCard from "@/components/BusinessCard";
import { getCategories, searchBusinesses } from "@/lib/data";

export const metadata = {
  title: "Browse businesses — LocalLink"
};

export default function BusinessesPage({ searchParams }) {
  const query = searchParams?.q || "";
  const category = searchParams?.category || "";
  const area = searchParams?.area || "";

  const categories = getCategories();
  const results = searchBusinesses({ query, category, area });
  const activeCategory = categories.find((c) => c.id === category);
  const hasFilters = Boolean(query || category || area);

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <p className="font-mono text-xs uppercase tracking-wide text-clay mb-2">
        Directory
      </p>
      <h1 className="font-display text-3xl font-semibold mb-6">
        Browse businesses
      </h1>

      <form
        method="GET"
        className="bg-white border-2 border-ink rounded-stall p-4 sm:p-5 grid gap-3 sm:grid-cols-[2fr_1fr_1fr_auto] mb-8"
      >
        <div>
          <label htmlFor="q" className="sr-only">Search</label>
          <input
            id="q"
            name="q"
            type="text"
            defaultValue={query}
            placeholder="Search by name or keyword"
            className="w-full px-3 py-2 border border-line rounded-stall focus:outline-none focus:border-clay"
          />
        </div>

        <div>
          <label htmlFor="category" className="sr-only">Category</label>
          <select
            id="category"
            name="category"
            defaultValue={category}
            className="w-full px-3 py-2 border border-line rounded-stall bg-white focus:outline-none focus:border-clay"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="area" className="sr-only">Area</label>
          <input
            id="area"
            name="area"
            type="text"
            defaultValue={area}
            placeholder="Area or province"
            className="w-full px-3 py-2 border border-line rounded-stall focus:outline-none focus:border-clay"
          />
        </div>

        <button
          type="submit"
          className="px-5 py-2 bg-ink text-paper rounded-stall font-medium hover:bg-clay transition-colors"
        >
          Filter
        </button>
      </form>

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-ink/60">
          {results.length} {results.length === 1 ? "business" : "businesses"} found
          {activeCategory ? <> in <span className="text-ink font-medium">{activeCategory.name}</span></> : null}
        </p>
        {hasFilters && (
          <Link href="/businesses" className="text-sm text-clay hover:text-clay-dark font-medium">
            Clear filters
          </Link>
        )}
      </div>

      {results.length === 0 ? (
        <div className="border-2 border-dashed border-line rounded-stall p-10 text-center">
          <p className="font-display text-xl font-semibold mb-2">
            Nothing matches yet
          </p>
          <p className="text-ink/60 max-w-md mx-auto">
            Try a broader keyword, clear the area filter, or browse every
            category from the homepage instead.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      )}
    </section>
  );
    }
