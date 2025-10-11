import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-black/10 dark:border-white/15 bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <p className="text-sm">© {new Date().getFullYear()} TravelGo</p>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/about" className="hover:underline">
            About
          </Link>
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Facebook
          </a>
        </div>
      </div>
    </footer>
  );
}