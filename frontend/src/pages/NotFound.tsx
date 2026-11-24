import { Link, useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <img src="/illustrations/sn-404.webp" alt="" width={320} height={240} className="illus mx-auto mb-8 h-auto w-64" />
        <h1 className="font-display text-3xl font-semibold text-foreground">This path ends here</h1>
        <p className="mt-3 text-foreground/70">
          There is no page at <span className="font-mono text-sm">{location.pathname}</span>.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/" className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">Go home</Link>
          <Link to="/dashboard" className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:border-primary/60">Dashboard</Link>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
