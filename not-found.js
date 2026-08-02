import Link from "next/link";

export default function NotFound() {
  return (
    <section className="max-w-lg mx-auto px-4 sm:px-6 py-24 text-center">
      <p className="font-mono text-xs uppercase tracking-wide text-clay mb-2">
        404
      </p>
      <h1 className="font-display text-3xl font-semibold mb-3">
        This listing has moved on
      </h1>
      <p className="text-ink/70 mb-6">
        The page you're looking for doesn't exist, or the business may have
        been removed from the directory.
      </p>
      <Link
        href="/businesses"
        className="inline-block px-5 py-2.5 bg-ink text-paper rounded-stall font-medium hover:bg-clay transition-colors"
      >
        Browse all businesses
      </Link>
    </section>
  );
}
