import Link from "next/link";

const links = [
  { href: "/businesses", label: "Browse" },
  { href: "/submit", label: "List your business" },
  { href: "/about", label: "About" }
];

export default function Navbar() {
  return (
    <header className="border-b border-line bg-paper/95 backdrop-blur sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="w-8 h-8 bg-ink text-paper flex items-center justify-center font-mono text-sm font-medium rounded-stall group-hover:bg-clay transition-colors">
            LL
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">
            LocalLink
          </span>
        </Link>

        <nav className="hidden sm:flex items-center gap-6 font-medium text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-ink/80 hover:text-clay transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/admin"
            className="px-3 py-1.5 border border-ink/20 rounded-stall text-ink/70 hover:border-clay hover:text-clay transition-colors font-mono text-xs uppercase tracking-wide"
          >
            Admin
          </Link>
        </nav>

        <Link
          href="/submit"
          className="sm:hidden px-3 py-1.5 bg-clay text-paper text-sm font-medium rounded-stall"
        >
          List
        </Link>
      </div>
    </header>
  );
}
