import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

/** Plain header for the public pages (About, Contact). */
export default function PublicHeader() {
  return (
    <header className="border-b border-border">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-2xl text-foreground">Serenity</Link>
        <nav className="flex items-center gap-6 text-sm text-foreground/75">
          <Link to="/about" className="hover:text-primary">About</Link>
          <Link to="/contact" className="hover:text-primary">Contact</Link>
          <Link to="/auth" className="font-semibold text-primary hover:underline">Sign in</Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
