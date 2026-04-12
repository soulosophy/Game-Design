import { Plus, Trash2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const inputClassName =
  "rounded-none border-white/10 bg-white/5 text-foreground placeholder:text-foreground/35 focus-visible:ring-secondary";

export const ProjectMediaManager = ({
  mediaItems,
  onAddUrlMedia,
  onChangeMedia,
  onRemoveMedia,
  onUploadFile,
  projectId,
  uploading,
}) => {
  return (
    <div className="space-y-4 border border-white/10 bg-black/45 p-4" data-testid={`studio-project-media-${projectId}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-secondary" data-testid={`studio-project-media-label-${projectId}`}>
            Media library
          </p>
          <p className="mt-2 text-sm text-foreground/68" data-testid={`studio-project-media-copy-${projectId}`}>
            Add image, video, and PDF items by URL or upload them directly.
          </p>
        </div>

        <Button
          className="rounded-none border border-secondary/35 bg-secondary/10 px-4 font-mono uppercase tracking-[0.18em] text-secondary hover:bg-secondary/15"
          data-testid={`studio-project-media-add-url-${projectId}`}
          onClick={onAddUrlMedia}
          type="button"
          variant="outline"
        >
          <Plus size={14} />
          Add URL item
        </Button>
      </div>

      <div className="border border-white/10 bg-white/5 p-4" data-testid={`studio-project-media-upload-panel-${projectId}`}>
        <label className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-foreground/65" data-testid={`studio-project-media-upload-label-${projectId}`} htmlFor={`project-upload-${projectId}`}>
          Upload image, video, or PDF
        </label>
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <Input
            accept="image/*,video/*,.pdf,application/pdf"
            className={`${inputClassName} file:mr-4 file:rounded-none file:border-0 file:bg-primary file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-[0.18em] file:text-white`}
            data-testid={`studio-project-media-upload-input-${projectId}`}
            id={`project-upload-${projectId}`}
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (file) {
                await onUploadFile(file);
                event.target.value = "";
              }
            }}
            type="file"
          />
          <div className="inline-flex items-center gap-2 text-sm text-foreground/68" data-testid={`studio-project-media-upload-status-${projectId}`}>
            <Upload size={16} />
            <span>{uploading ? "Uploading... then save the portfolio to publish it" : "Direct uploads are supported here"}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4" data-testid={`studio-project-media-items-${projectId}`}>
        {mediaItems.length > 0 ? (
          mediaItems.map((item, index) => (
            <div className="grid gap-4 border border-white/10 bg-white/5 p-4 md:grid-cols-[0.8fr_1fr_1.5fr_auto]" data-testid={`studio-project-media-card-${projectId}-${index}`} key={item.id}>
              <div>
                <label className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-foreground/65" data-testid={`studio-project-media-type-label-${projectId}-${index}`}>
                  Type
                </label>
                <select
                  className={`${inputClassName} flex h-9 w-full px-3 py-2 text-sm`}
                  data-testid={`studio-project-media-type-input-${projectId}-${index}`}
                  onChange={(event) => onChangeMedia(index, "type", event.target.value)}
                  value={item.type}
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="pdf">PDF</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-foreground/65" data-testid={`studio-project-media-title-label-${projectId}-${index}`}>
                  Title
                </label>
                <Input
                  className={inputClassName}
                  data-testid={`studio-project-media-title-input-${projectId}-${index}`}
                  onChange={(event) => onChangeMedia(index, "title", event.target.value)}
                  type="text"
                  value={item.title}
                />
              </div>

              <div>
                <label className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-foreground/65" data-testid={`studio-project-media-url-label-${projectId}-${index}`}>
                  {item.source === "upload" ? "Stored file" : "Media URL"}
                </label>
                <Input
                  className={inputClassName}
                  data-testid={`studio-project-media-url-input-${projectId}-${index}`}
                  onChange={(event) => onChangeMedia(index, "url", event.target.value)}
                  readOnly={item.source === "upload"}
                  type="text"
                  value={item.url}
                />
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-foreground/50" data-testid={`studio-project-media-source-${projectId}-${index}`}>
                  Source: {item.source}
                </p>
              </div>

              <div className="flex items-end">
                <Button
                  className="rounded-none border border-white/10 bg-transparent px-4 text-foreground/70 hover:border-primary/45 hover:bg-primary/10 hover:text-primary"
                  data-testid={`studio-project-media-remove-button-${projectId}-${index}`}
                  onClick={() => onRemoveMedia(index)}
                  type="button"
                  variant="outline"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="border border-dashed border-white/15 bg-white/5 p-5 text-sm text-foreground/68" data-testid={`studio-project-media-empty-${projectId}`}>
            No media added yet. Upload a file or add a media URL.
          </div>
        )}
      </div>
    </div>
  );
};