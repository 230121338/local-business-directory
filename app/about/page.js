export const metadata = {
  title: "About — LocalLink"
};

export default function AboutPage() {
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-wide text-clay mb-2">
        About
      </p>
      <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-6">
        Built for word-of-mouth, at the scale of a whole country.
      </h1>

      <div className="prose-none space-y-5 text-ink/80 leading-relaxed">
        <p>
          Before LocalLink, finding a trustworthy plumber, tutor or hairdresser
          usually meant asking three neighbours and hoping one of them had a
          number saved. That system works, but it doesn't scale past the
          people you already know — and it leaves small businesses invisible
          to everyone outside their immediate circle.
        </p>
        <p>
          LocalLink exists to close that gap. It's a directory of real,
          independently run businesses across South African towns and
          cities — organised by trade, searchable by name or area, and rated
          by people who've actually walked through the door. Every listing is
          checked by a human before it goes live, so browsing the directory
          feels closer to a trusted recommendation than an open ad platform.
        </p>
        <p>
          For business owners, listing is meant to feel low-effort: fill in a
          short form, upload a photo if you have one, and a moderator takes it
          from there. For everyone searching, the goal is simple — help you
          find someone reliable, close by, faster than a group chat could.
        </p>
      </div>

      <div className="pin-divider mt-10 pt-8 grid gap-6 sm:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-semibold text-clay">8</p>
          <p className="text-sm text-ink/60 mt-1">Trade categories, with more added as the directory grows</p>
        </div>
        <div>
          <p className="font-display text-2xl font-semibold text-clay">9</p>
          <p className="text-sm text-ink/60 mt-1">Provinces represented in the current listings</p>
        </div>
        <div>
          <p className="font-display text-2xl font-semibold text-clay">100%</p>
          <p className="text-sm text-ink/60 mt-1">Of new listings reviewed by a moderator before publishing</p>
        </div>
      </div>
    </section>
  );
    }
