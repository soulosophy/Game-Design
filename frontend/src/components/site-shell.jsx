import { House, PaperPlaneTilt, TerminalWindow, UserSquare } from "@phosphor-icons/react";
import { Files, FolderOpen } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/", label: "Home/About", icon: House },
  { to: "/projects", label: "Projects", icon: FolderOpen },
  { to: "/resume", label: "Resume", icon: Files },
  { to: "/contact", label: "Contact", icon: PaperPlaneTilt },
  { to: "/studio", label: "Studio", icon: TerminalWindow },
];

const navLinkClassName = ({ isActive }) =>
  [
    "inline-flex items-center gap-2 border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors duration-300",
    isActive
      ? "bg-secondary text-background shadow-[0_0_18px_rgba(5,217,232,0.35)]"
      : "bg-black/30 text-foreground/80 hover:border-secondary/70 hover:text-secondary",
  ].join(" ");

export const SiteShell = ({
  portfolio,
  messages,
  onRefresh,
  onSavePortfolio,
  onSubmitContact,
  saving,
}) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground" data-testid="site-shell">
      <div className="pointer-events-none absolute inset-0 cyber-grid" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_top_left,rgba(255,42,109,0.25),transparent_45%),radial-gradient(circle_at_top_right,rgba(5,217,232,0.2),transparent_40%)]" />
      <div className="pointer-events-none absolute left-[-10rem] top-[22rem] h-[18rem] w-[18rem] rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute right-[-10rem] top-[8rem] h-[22rem] w-[22rem] rounded-full bg-secondary/15 blur-3xl" />

      <header
        className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl"
        data-testid="portfolio-header"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 sm:px-12 lg:px-24">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <NavLink className="group flex items-center gap-3" data-testid="brand-link" to="/">
              <div className="flex h-12 w-12 items-center justify-center border border-secondary/40 bg-black/60 text-secondary shadow-[0_0_24px_rgba(5,217,232,0.18)] transition-transform duration-300 group-hover:-translate-y-0.5">
                <UserSquare size={24} weight="duotone" />
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-secondary" data-testid="brand-kicker">
                  GAME DESIGN PORTFOLIO
                </p>
                <p className="text-lg font-semibold uppercase tracking-[0.08em] text-foreground" data-testid="brand-name">
                  {portfolio.hero.name}
                </p>
              </div>
            </NavLink>

            <div className="flex flex-col items-start gap-3 lg:items-end">
              <p className="max-w-xl text-sm text-foreground/70" data-testid="header-status-copy">
                {portfolio.hero.status}
              </p>
              <Button
                asChild
                className="rounded-none border border-primary/30 bg-primary px-6 font-mono uppercase tracking-[0.2em] text-white hover:bg-primary/90"
                data-testid="header-studio-button"
              >
                <NavLink to="/studio">Edit Content</NavLink>
              </Button>
            </div>
          </div>

          <nav className="flex flex-wrap gap-2" data-testid="header-navigation">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink className={navLinkClassName} data-testid={`nav-link-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} key={to} to={to}>
                <Icon size={16} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="relative z-10" data-testid="site-main-content">
        <Outlet
          context={{
            messages,
            onRefresh,
            onSavePortfolio,
            onSubmitContact,
            portfolio,
            saving,
          }}
        />
      </main>

      <footer className="relative z-10 border-t border-white/10 bg-black/40" data-testid="portfolio-footer">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 sm:px-12 lg:flex-row lg:items-center lg:justify-between lg:px-24">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-secondary" data-testid="footer-label">
              GAME DESIGN SHOWCASE
            </p>
            <p className="mt-2 max-w-xl text-sm text-foreground/65" data-testid="footer-copy">
              Built to spotlight projects, process, and a resume without guesswork.
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm text-foreground/55" data-testid="footer-meta">
            <span data-testid="footer-updated-label">Last sync:</span>
            <span data-testid="footer-updated-value">{new Date(portfolio.updated_at).toLocaleString()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};