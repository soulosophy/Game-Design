import { ArrowRight, Crosshair, Sparkle, StackSimple, TrendUp } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { Link, useOutletContext } from "react-router-dom";

import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const statIconMap = [Crosshair, StackSimple, TrendUp];

export default function HomePage() {
  const { portfolio } = useOutletContext();

  const stats = [
    { label: "Project lanes", value: String(portfolio.project_categories.length) },
    { label: "Featured pieces", value: String(portfolio.projects.length) },
    { label: "Core skills", value: String(portfolio.resume.skills.length) },
  ];

  return (
    <div data-testid="home-page">
      <section className="relative isolate overflow-hidden px-6 py-24 sm:px-12 lg:min-h-[90vh] lg:px-24 lg:py-28" data-testid="hero-section">
        <div className="absolute inset-0 -z-20" data-testid="hero-image-layer">
          <img
            alt={portfolio.hero.name}
            className="h-full w-full object-cover object-center"
            data-testid="hero-image"
            src={portfolio.hero.hero_image}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.7)_45%,rgba(0,0,0,0.82)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,42,109,0.16),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(5,217,232,0.14),transparent_35%)]" />
        </div>

        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
            data-testid="hero-copy"
            initial={{ opacity: 0, y: 28 }}
            transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
          >
            <Badge
              className="rounded-none border border-primary/40 bg-primary/10 px-4 py-2 font-mono uppercase tracking-[0.25em] text-primary"
              data-testid="hero-badge"
              variant="outline"
            >
              Game designer
            </Badge>

            <h1 className="mt-8 text-4xl font-black uppercase tracking-[-0.05em] text-foreground sm:text-5xl lg:text-6xl" data-testid="hero-name">
              {portfolio.hero.name}
            </h1>
            <p className="mt-5 max-w-2xl text-lg font-medium text-secondary sm:text-xl" data-testid="hero-title">
              {portfolio.hero.title}
            </p>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-foreground/78 sm:text-base" data-testid="hero-tagline">
              {portfolio.hero.tagline}
            </p>
            <p className="mt-6 max-w-2xl font-mono text-xs uppercase tracking-[0.25em] text-accent" data-testid="hero-status">
              {portfolio.hero.status}
            </p>

            <div className="mt-10 flex flex-wrap gap-4" data-testid="hero-actions">
              <Button
                asChild
                className="rounded-none border border-primary/30 bg-primary px-7 py-6 font-mono uppercase tracking-[0.2em] text-white hover:bg-primary/90"
                data-testid="hero-projects-button"
              >
                <Link to="/projects">
                  View Projects
                  <ArrowRight size={16} />
                </Link>
              </Button>
              <Button
                asChild
                className="rounded-none border border-secondary/40 bg-secondary/10 px-7 py-6 font-mono uppercase tracking-[0.2em] text-secondary hover:bg-secondary/15 hover:text-secondary"
                data-testid="hero-contact-button"
                variant="outline"
              >
                <Link to="/contact">Open Contact</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="scanlines border border-accent/25 bg-black/75 p-6 shadow-[0_0_26px_rgba(1,255,195,0.12)]"
            data-testid="hero-terminal-panel"
            initial={{ opacity: 0, y: 28 }}
            transition={{ delay: 0.08, duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
          >
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent" data-testid="hero-panel-label">
              CURRENT BUILD
            </p>
            <h2 className="mt-4 text-2xl font-semibold uppercase tracking-[-0.03em] text-foreground" data-testid="hero-panel-title">
              Player-first design with cinematic tension
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-foreground/72" data-testid="hero-panel-copy">
              This portfolio is structured to highlight role, process, outcomes, and the exact categories your work belongs in.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3" data-testid="hero-stats-grid">
              {stats.map((stat, index) => {
                const Icon = statIconMap[index];

                return (
                  <div className="border border-white/10 bg-white/5 p-4" data-testid={`hero-stat-card-${index}`} key={stat.label}>
                    <Icon className="text-secondary" size={20} weight="duotone" />
                    <p className="mt-4 text-3xl font-semibold text-foreground" data-testid={`hero-stat-value-${index}`}>
                      {stat.value}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-foreground/60" data-testid={`hero-stat-label-${index}`}>
                      {stat.label}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 border-t border-white/10 pt-6" data-testid="hero-specialties-block">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary" data-testid="hero-specialties-label">
                Design signals
              </p>
              <div className="mt-4 flex flex-wrap gap-2" data-testid="hero-specialties-list">
                {portfolio.about.specialties.map((specialty, index) => (
                  <Badge
                    className="rounded-none border border-white/10 bg-white/5 px-3 py-2 text-left text-[11px] uppercase tracking-[0.15em] text-foreground/80"
                    data-testid={`hero-specialty-${index}`}
                    key={`${specialty}-${index}`}
                    variant="outline"
                  >
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-6 py-24 sm:px-12 lg:px-24 lg:py-28" data-testid="about-section">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="overflow-hidden border border-white/10 bg-black/55" data-testid="about-image-panel">
            <div className="aspect-[4/5] overflow-hidden" data-testid="about-image-wrap">
              <img
                alt="Game design workspace"
                className="h-full w-full object-cover object-center"
                data-testid="about-image"
                src={portfolio.about.image_url}
              />
            </div>
          </div>

          <div className="space-y-8" data-testid="about-copy-panel">
            <SectionHeading
              description={portfolio.about.detail}
              label="About"
              testId="about-heading"
              title={portfolio.about.headline}
            />

            <p className="max-w-2xl text-sm leading-relaxed text-foreground/78 sm:text-base" data-testid="about-intro">
              {portfolio.about.intro}
            </p>

            <div className="grid gap-6 md:grid-cols-2" data-testid="about-detail-grid">
              <div className="border border-secondary/20 bg-secondary/5 p-6" data-testid="about-specialties-card">
                <div className="flex items-center gap-3" data-testid="about-specialties-header">
                  <Sparkle className="text-secondary" size={20} weight="duotone" />
                  <p className="font-mono text-xs uppercase tracking-[0.25em] text-secondary" data-testid="about-specialties-title">
                    Specialties
                  </p>
                </div>
                <ul className="mt-5 space-y-3" data-testid="about-specialties-list">
                  {portfolio.about.specialties.map((specialty, index) => (
                    <li className="text-sm text-foreground/75" data-testid={`about-specialty-${index}`} key={`${specialty}-${index}`}>
                      {specialty}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border border-primary/20 bg-primary/5 p-6" data-testid="about-tools-card">
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary" data-testid="about-tools-title">
                  Toolkit
                </p>
                <div className="mt-5 flex flex-wrap gap-2" data-testid="about-tools-list">
                  {portfolio.about.tools.map((tool, index) => (
                    <Badge
                      className="rounded-none border border-primary/20 bg-transparent px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-primary"
                      data-testid={`about-tool-${index}`}
                      key={`${tool}-${index}`}
                      variant="outline"
                    >
                      {tool}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}