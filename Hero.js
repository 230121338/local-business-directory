import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative border-b-2 border-ink bg-ink text-paper overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #FAF6EF 0, #FAF6EF 1px, transparent 1px, transparent 16px)"
        }}
        aria-hidden="true"
      />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-marigold mb-4">
          Your street, mapped by hand
        </p>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.05] max-w-2xl">
          Find the people who already know your neighbourhood.
        </h1>
        <p className="mt-5 text-paper/80 max-w-xl text-lg leading-relaxed">
          LocalLink is a directory built for word-of-mouth: real plumbers,
          tutors, kitchens and studios from towns across South Africa, rated
          by the people who've actually used them.
        </p>

        <form action="/businesses" method="GET" className="mt-8 flex flex-col sm:flex-row gap-3 max-w-xl">
          <label htmlFor="hero-search" className="sr-only">
            Search businesses
          </label>
          <input
            id="hero-search"
            name="q"
            type="text"
            placeholder="Try &ldquo;plumber&rdquo; or &ldquo;tutor in Soweto&rdquo;"
            className="flex-1 px-4 py-3 rounded-stall bg-paper text-ink placeholder:text-ink/40 border-2 border-paper focus:outline-none focus:border-marigold"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-marigold text-ink font-medium rounded-stall border-2 border-marigold hover:bg-clay hover:border-clay hover:text-paper transition-colors"
          >
            Search
          </button>
        </form>

        <div className="mt-6 flex flex-wrap gap-2 text-sm">
          <span className="text-paper/60">Popular:</span>
          {["Restaurants", "Plumbing", "Tutors", "Beauty"].map((term) => (
            <Link
              key={term}
              href={`/businesses?q=${encodeURIComponent(term)}`}
              className="text-paper/80 underline decoration-paper/30 underline-offset-4 hover:text-marigold hover:decoration-marigold"
            >
              {term}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
