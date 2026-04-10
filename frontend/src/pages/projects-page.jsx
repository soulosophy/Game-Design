import { useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";

export default function ProjectsPage() {
  const { portfolio } = useOutletContext();
  const [activeFilter, setActiveFilter] = useState("all");

  const groupedCategories = useMemo(() => {
    const visibleCategories =
      activeFilter === "all"
        ? portfolio.project_categories
        : portfolio.project_categories.filter((category) => category.id === activeFilter);

    return visibleCategories
      .map((category) => ({
        ...category,
        projects: portfolio.projects.filter((project) => project.category_id === category.id),
      }))
      .filter((category) => category.projects.length > 0);
  }, [activeFilter, portfolio.project_categories, portfolio.projects]);

  return (
    <div className="px-6 py-24 sm:px-12 lg:px-24 lg:py-28" data-testid="projects-page">
      <div className="mx-auto max-w-7xl space-y-14">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between" data-testid="projects-header-row">
          <SectionHeading
            description="Use the built-in categories to organize your work by design discipline. Filters narrow the view, while grouped sections keep the big picture readable."
            label="Projects"
            testId="projects-heading"
            title="Categorized work for every project lane"
          />

          <Button
            asChild
            className="rounded-none border border-secondary/35 bg-secondary/10 px-6 font-mono uppercase tracking-[0.2em] text-secondary hover:bg-secondary/15 hover:text-secondary"
            data-testid="projects-studio-button"
            variant="outline"
          >
            <Link to="/studio">Manage Projects</Link>
          </Button>
        </div>

        <div className="flex flex-wrap gap-3" data-testid="projects-filter-bar">
          <Button
            className={[
              "rounded-none border px-5 font-mono uppercase tracking-[0.18em]",
              activeFilter === "all"
                ? "border-primary/45 bg-primary text-white hover:bg-primary/90"
                : "border-white/10 bg-white/5 text-foreground/78 hover:border-secondary/45 hover:bg-secondary/10 hover:text-secondary",
            ].join(" ")}
            data-testid="projects-filter-all"
            onClick={() => setActiveFilter("all")}
            type="button"
            variant="outline"
          >
            All Projects
          </Button>

          {portfolio.project_categories.map((category) => (
            <Button
              className={[
                "rounded-none border px-5 font-mono uppercase tracking-[0.18em]",
                activeFilter === category.id
                  ? "border-primary/45 bg-primary text-white hover:bg-primary/90"
                  : "border-white/10 bg-white/5 text-foreground/78 hover:border-secondary/45 hover:bg-secondary/10 hover:text-secondary",
              ].join(" ")}
              data-testid={`projects-filter-${category.id}`}
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              type="button"
              variant="outline"
            >
              {category.label}
            </Button>
          ))}
        </div>

        <div className="space-y-16" data-testid="projects-grouped-sections">
          {groupedCategories.map((category) => (
            <section className="space-y-8" data-testid={`project-category-section-${category.id}`} key={category.id}>
              <div className="grid gap-4 border-b border-white/10 pb-6 lg:grid-cols-[0.6fr_1.4fr] lg:items-end">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.25em] text-secondary" data-testid={`project-category-label-${category.id}`}>
                    {category.label}
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold uppercase tracking-[-0.03em] text-foreground sm:text-3xl" data-testid={`project-category-title-${category.id}`}>
                    {category.label}
                  </h2>
                </div>
                <p className="max-w-2xl text-sm leading-relaxed text-foreground/72 sm:text-base" data-testid={`project-category-description-${category.id}`}>
                  {category.description}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2" data-testid={`project-category-grid-${category.id}`}>
                {category.projects.map((project) => (
                  <ProjectCard categoryLabel={category.label} key={project.id} project={project} />
                ))}
              </div>
            </section>
          ))}

          {groupedCategories.length === 0 ? (
            <div className="border border-dashed border-white/15 bg-white/5 p-8 text-center" data-testid="projects-empty-state">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-secondary" data-testid="projects-empty-label">
                No matches
              </p>
              <p className="mt-3 text-sm text-foreground/75" data-testid="projects-empty-copy">
                Add more categories or projects in the Studio to fill this section.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}