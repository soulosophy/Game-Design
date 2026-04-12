import { motion } from "framer-motion";
import { ArrowSquareOut } from "@phosphor-icons/react";

import { Badge } from "@/components/ui/badge";

export const ProjectCard = ({ categoryLabel, onOpen, project }) => {
  return (
    <motion.button
      animate={{ opacity: 1, y: 0 }}
      className={[
        "group overflow-hidden border border-white/10 bg-black/55 text-left shadow-[0_0_22px_rgba(0,0,0,0.25)] transition-transform duration-300 hover:-translate-y-1 hover:border-secondary/55 hover:shadow-[0_0_26px_rgba(5,217,232,0.14)]",
        project.featured ? "md:col-span-2" : "",
      ].join(" ")}
      data-testid={`project-card-button-${project.id}`}
      initial={{ opacity: 0, y: 18 }}
      onClick={() => onOpen(project)}
      transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
      type="button"
    >
      <div className="relative aspect-[16/10] overflow-hidden" data-testid={`project-image-wrap-${project.id}`}>
        <img
          alt={project.title}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
          data-testid={`project-image-${project.id}`}
          src={project.cover_image}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_20%,rgba(0,0,0,0.9)_100%)]" />
        <div className="absolute bottom-0 left-0 flex w-full flex-wrap items-center gap-3 px-5 py-4">
          <Badge
            className="rounded-none border border-secondary/40 bg-secondary/10 px-3 py-1 font-mono uppercase tracking-[0.2em] text-secondary"
            data-testid={`project-category-${project.id}`}
            variant="outline"
          >
            {categoryLabel}
          </Badge>
          <span
            className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/65"
            data-testid={`project-year-${project.id}`}
          >
            {project.year}
          </span>
        </div>
      </div>

      <div className="space-y-5 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3
              className="text-2xl font-semibold uppercase tracking-[-0.03em] text-foreground"
              data-testid={`project-title-${project.id}`}
            >
              {project.title}
            </h3>
            <p
              className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-primary"
              data-testid={`project-role-${project.id}`}
            >
              {project.role}
            </p>
          </div>
          {project.featured ? (
            <span
              className="border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.25em] text-primary"
              data-testid={`project-featured-${project.id}`}
            >
              Featured
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-secondary" data-testid={`project-open-label-${project.id}`}>
          <ArrowSquareOut size={14} />
          <span>Open project</span>
        </div>

        <p className="text-sm leading-relaxed text-foreground/75 sm:text-base" data-testid={`project-summary-${project.id}`}>
          {project.summary}
        </p>

        <div className="border-l border-secondary/45 pl-4" data-testid={`project-outcome-wrap-${project.id}`}>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-secondary" data-testid={`project-outcome-label-${project.id}`}>
            Outcome
          </p>
          <p className="mt-2 text-sm text-foreground/75" data-testid={`project-outcome-${project.id}`}>
            {project.outcome}
          </p>
        </div>

        <ul className="space-y-2" data-testid={`project-points-${project.id}`}>
          {project.detail_points.map((point, index) => (
            <li className="flex gap-3 text-sm text-foreground/70" data-testid={`project-point-${project.id}-${index}`} key={`${project.id}-${index}`}>
              <span className="mt-1 h-2 w-2 bg-accent shadow-[0_0_14px_rgba(1,255,195,0.55)]" />
              <span>{point}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-2" data-testid={`project-tools-${project.id}`}>
          {project.tools.map((tool, index) => (
            <Badge
              className="rounded-none border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.15em] text-foreground/80"
              data-testid={`project-tool-${project.id}-${index}`}
              key={`${project.id}-${tool}-${index}`}
              variant="outline"
            >
              {tool}
            </Badge>
          ))}
        </div>
      </div>
    </motion.button>
  );
};