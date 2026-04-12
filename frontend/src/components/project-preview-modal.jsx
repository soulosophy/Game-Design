import { useEffect } from "react";
import { X } from "lucide-react";

import { ProjectDetailView } from "@/components/project-detail-view";
import { Button } from "@/components/ui/button";

export const ProjectPreviewModal = ({ categoryLabel, onClose, project }) => {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (!project) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80] bg-black/80 px-4 py-6 backdrop-blur-md" data-testid={`project-preview-modal-${project.id}`} onClick={onClose}>
      <div className="mx-auto flex h-full max-w-5xl flex-col overflow-hidden border border-white/10 bg-[#070709]" data-testid={`project-preview-modal-panel-${project.id}`} onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-secondary" data-testid={`project-preview-modal-label-${project.id}`}>
            Project preview
          </p>
          <Button
            className="rounded-none border border-white/10 bg-transparent px-3 text-foreground/70 hover:border-primary/45 hover:bg-primary/10 hover:text-primary"
            data-testid={`project-preview-modal-close-${project.id}`}
            onClick={onClose}
            type="button"
            variant="outline"
          >
            <X size={16} />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6" data-testid={`project-preview-modal-body-${project.id}`}>
          <ProjectDetailView categoryLabel={categoryLabel} compact project={project} />
        </div>
      </div>
    </div>
  );
};