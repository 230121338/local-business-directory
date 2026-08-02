import Link from "next/link";
import Hero from "@/components/Hero";
import BusinessCard from "@/components/BusinessCard";
import { getFeaturedBusinesses, getCategories, getApprovedBusinesses } from "@/lib/data";

export default function HomePage() {
  const featured = getFeaturedBusinesses(4);
  const categories = getCategories();
  const totalBusinesses = getApprovedBusinesses().length;

  return (
    <>
      <Hero />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-clay mb-1">
              01 — On the board this week
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold">
              Featured listings
            </h2>
          </div>
          <Link
            href="/businesses"
            className="hidden sm:inline text-sm font-medium text-clay hover:text-clay-dark"
          >
            View all {totalBusinesses} businesses →
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>

        <Link
          href="/businesses"
          className="sm:hidden mt-6 inline-block text-sm font-medium text-clay"
        >
          View all {totalBusinesses} businesses →
        </Link>
      </section>

      <section className="border-y-2 border-ink bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
          <p className="font-mono text-xs uppercase tracking-wide text-clay mb-1">
            02 — Browse by trade
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold mb-8">
            What are you looking for?
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/businesses?category=${category.id}`}
                className="group p-5 border-2 border-ink/15 rounded-stall hover:border-ink hover:shadow-plaque-sm transition-all bg-paper"
              >
                <p className="font-display text-lg font-semibold group-hover:text-clay transition-colors">
                  {category.name}
                </p>
                <p className="text-sm text-ink/60 mt-1 leading-relaxed">
                  {category.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="font-mono text-xs uppercase tracking-wide text-clay mb-2">
          03 — Own a business?
        </p>
        <h2 className="font-display text-2xl sm:text-3xl font-semibold max-w-xl mx-auto">
          Get found by neighbours who are already looking for what you offer.
        </h2>
        <p className="text-ink/70 mt-3 max-w-lg mx-auto">
          Listing takes a few minutes. Our team reviews every submission
          before it goes live, so the directory stays trustworthy.
        </p>
        <Link
          href="/submit"
          className="inline-block mt-6 px-6 py-3 bg-ink text-paper rounded-stall font-medium hover:bg-clay transition-colors"
        >
          List your business
        </Link>
      </section>
    </>
  );
}
