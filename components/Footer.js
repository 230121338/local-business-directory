import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-line mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid gap-8 sm:grid-cols-3">
        <div>
          <p className="font-display text-lg font-semibold">LocalLink</p>
          <p className="text-sm text-ink/70 mt-2 max-w-xs">
            A community-built directory helping South African neighbourhoods
            find businesses they can trust, one street at a time.
          </p>
        </div>

        <div className="text-sm">
          <p className="font-mono text-xs uppercase tracking-wide text-ink/50 mb-3">
            Directory
          </p>
          <ul className="space-y-2">
            <li><Link href="/businesses" className="hover:text-clay">Browse businesses</Link></li>
            <li><Link href="/submit" className="hover:text-clay">List your business</Link></li>
            <li><Link href="/about" className="hover:text-clay">About LocalLink</Link></li>
          </ul>
        </div>

        <div className="text-sm">
          <p className="font-mono text-xs uppercase tracking-wide text-ink/50 mb-3">
            For businesses
          </p>
          <ul className="space-y-2">
            <li><Link href="/admin" className="hover:text-clay">Administrator sign in</Link></li>
            <li><a href="mailto:hello@locallink.co.za" className="hover:text-clay">hello@locallink.co.za</a></li>
          </ul>
        </div>
      </div>
      <div className="pin-divider max-w-6xl mx-auto px-4 sm:px-6 py-4 text-xs text-ink/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <p>© {new Date().getFullYear()} LocalLink Community Business Directory.</p>
        <p>Built with Next.js, React and Tailwind CSS.</p>
      </div>
    </footer>
  );
}
