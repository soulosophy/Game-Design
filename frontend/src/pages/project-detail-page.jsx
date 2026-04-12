import { ArrowLeft } from "@phosphor-icons/react";
import { Link, useOutletContext, useParams } from "react-router-dom";

import { ProjectDetailView } from "@/components/project-detail-view";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";

export default function ProjectDetailPage() {
  const { portfolio } = useOutletContext();
  const { projectId } = useParams();

  const project = portfolio.projects.find((item) => item.id === projectId);
  const category = portfolio.project_categories.find((item) => item.id === project?.category_id);

  if (!project) {
    return (
      <div className="px-6 py-24 sm:px-12 lg:px-24 lg:py-28" data-testid="project-detail-missing-page">
        <div className="mx-auto max-w-4xl space-y-8">
          <SectionHeading
            description="The project you’re looking for wasn’t found. Head back to the Projects page to choose another case study."
            label="Project"
            testId="project-detail-missing-heading"
            title="Project not found"
          />
          <Button
            asChild
            className="rounded-none border border-secondary/35 bg-secondary/10 px-6 font-mono uppercase tracking-[0.2em] text-secondary hover:bg-secondary/15"
            data-testid="project-detail-missing-back-button"
            variant="outline"
          >
            <Link to="/projects">Back to Projects</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-24 sm:px-12 lg:px-24 lg:py-28" data-testid={`project-detail-page-${project.id}`}>
      <div className="mx-auto max-w-7xl space-y-8">
        <Button
          asChild
          className="rounded-none border border-white/10 bg-white/5 px-5 font-mono uppercase tracking-[0.18em] text-foreground/75 hover:border-secondary/45 hover:bg-secondary/10 hover:text-secondary"
          data-testid="project-detail-back-button"
          variant="outline"
        >
          <Link to="/projects">
            <ArrowLeft size={16} />
            Back to Projects
          </Link>
        </Button>

        <ProjectDetailView categoryLabel={category?.label ?? "Project"} project={project} />
      </div>
    </div>
  );
}