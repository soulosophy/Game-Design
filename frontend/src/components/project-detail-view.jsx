import { ArrowSquareOut } from "@phosphor-icons/react";

import { ProjectMediaGallery } from "@/components/project-media-gallery";
import { Badge } from "@/components/ui/badge";

export const ProjectDetailView = ({ categoryLabel, compact = false, project }) => {
  return (
    <div className="space-y-10" data-testid={`project-detail-view-${project.id}`}>
      <div className={`grid gap-8 ${compact ? "" : "lg:grid-cols-[1.05fr_0.95fr] lg:items-start"}`} data-testid={`project-detail-hero-${project.id}`}>
        <div className="overflow-hidden border border-white/10 bg-black/60" data-testid={`project-detail-image-wrap-${project.id}`}>
          <img
            alt={project.title}
            className="aspect-[16/10] w-full object-cover object-center"
            data-testid={`project-detail-image-${project.id}`}
            src={project.cover_image}
          />
        </div>

        <div className="space-y-6" data-testid={`project-detail-copy-${project.id}`}>
          <div className="flex flex-wrap items-center gap-3">
            <Badge
              className="rounded-none border border-secondary/30 bg-secondary/10 px-3 py-1 font-mono uppercase tracking-[0.2em] text-secondary"
              data-testid={`project-detail-category-${project.id}`}
              variant="outline"
            >
              {categoryLabel}
            </Badge>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/60" data-testid={`project-detail-year-${project.id}`}>
              {project.year}
            </span>
          </div>

          <div>
            <h1 className={`${compact ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl lg:text-6xl"} font-black uppercase tracking-[-0.05em] text-foreground`} data-testid={`project-detail-title-${project.id}`}>
              {project.title}
            </h1>
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.25em] text-primary" data-testid={`project-detail-role-${project.id}`}>
              {project.role}
            </p>
          </div>

          <p className="text-sm leading-relaxed text-foreground/76 sm:text-base" data-testid={`project-detail-summary-${project.id}`}>
            {project.summary}
          </p>

          <div className="border-l border-primary/45 pl-4" data-testid={`project-detail-outcome-wrap-${project.id}`}>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary" data-testid={`project-detail-outcome-label-${project.id}`}>
              Outcome
            </p>
            <p className="mt-3 text-sm leading-relaxed text-foreground/74" data-testid={`project-detail-outcome-${project.id}`}>
              {project.outcome}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2" data-testid={`project-detail-metadata-${project.id}`}>
            <div className="border border-white/10 bg-white/5 p-4" data-testid={`project-detail-tools-${project.id}`}>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-secondary" data-testid={`project-detail-tools-label-${project.id}`}>
                Tools
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tools.map((tool, index) => (
                  <Badge
                    className="rounded-none border border-white/10 bg-transparent px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-foreground/80"
                    data-testid={`project-detail-tool-${project.id}-${index}`}
                    key={`${project.id}-tool-${index}`}
                    variant="outline"
                  >
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="border border-white/10 bg-white/5 p-4" data-testid={`project-detail-media-meta-${project.id}`}>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent" data-testid={`project-detail-media-label-${project.id}`}>
                Media assets
              </p>
              <p className="mt-4 text-4xl font-semibold text-foreground" data-testid={`project-detail-media-count-${project.id}`}>
                {(project.media_items || []).length}
              </p>
              <p className="mt-2 text-sm text-foreground/68" data-testid={`project-detail-media-copy-${project.id}`}>
                Images, videos, and PDFs attached to this project.
              </p>
            </div>
          </div>

          <div className="border border-white/10 bg-black/60 p-5" data-testid={`project-detail-points-${project.id}`}>
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-secondary" data-testid={`project-detail-points-label-${project.id}`}>
                Design highlights
              </p>
              <ArrowSquareOut className="text-secondary" size={16} />
            </div>
            <ul className="mt-4 space-y-3">
              {project.detail_points.map((point, index) => (
                <li className="text-sm text-foreground/74" data-testid={`project-detail-point-${project.id}-${index}`} key={`${project.id}-point-${index}`}>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <ProjectMediaGallery mediaItems={project.media_items || []} testIdPrefix={`project-detail-media-${project.id}`} />
    </div>
  );
};