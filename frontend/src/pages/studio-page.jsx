import { useEffect, useState } from "react";
import { Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { useOutletContext } from "react-router-dom";

import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  clonePortfolio,
  createCategory,
  createEducation,
  createExperience,
  createLink,
  createProject,
} from "@/lib/studio-helpers";

const inputClassName =
  "rounded-none border-white/10 bg-white/5 text-foreground placeholder:text-foreground/35 focus-visible:ring-secondary";

const textareaClassName =
  "min-h-[120px] rounded-none border-white/10 bg-white/5 text-foreground placeholder:text-foreground/35 focus-visible:ring-secondary";

function StudioPanel({ action, children, description, testId, title }) {
  return (
    <section className="space-y-5 border border-white/10 bg-black/55 p-6" data-testid={testId}>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between" data-testid={`${testId}-header`}>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-secondary" data-testid={`${testId}-label`}>
            Studio panel
          </p>
          <h2 className="mt-3 text-2xl font-semibold uppercase tracking-[-0.03em] text-foreground" data-testid={`${testId}-title`}>
            {title}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-foreground/72" data-testid={`${testId}-description`}>
            {description}
          </p>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function FieldGroup({ children, label, testId }) {
  return (
    <div className="space-y-2" data-testid={`${testId}-group`}>
      <label className="block font-mono text-xs uppercase tracking-[0.2em] text-foreground/65" data-testid={`${testId}-label`}>
        {label}
      </label>
      {children}
    </div>
  );
}

function StringListEditor({ addLabel, items, onAdd, onChange, onRemove, testId, title }) {
  return (
    <div className="space-y-4 border border-white/10 bg-white/5 p-4" data-testid={testId}>
      <div className="flex flex-wrap items-center justify-between gap-3" data-testid={`${testId}-header`}>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-secondary" data-testid={`${testId}-title`}>
          {title}
        </p>
        <Button
          className="rounded-none border border-secondary/35 bg-secondary/10 px-4 font-mono uppercase tracking-[0.18em] text-secondary hover:bg-secondary/15"
          data-testid={`${testId}-add-button`}
          onClick={onAdd}
          type="button"
          variant="outline"
        >
          <Plus size={14} />
          {addLabel}
        </Button>
      </div>

      <div className="space-y-3" data-testid={`${testId}-items`}>
        {items.map((item, index) => (
          <div className="flex gap-3" data-testid={`${testId}-item-${index}`} key={`${testId}-${index}`}>
            <Input
              className={inputClassName}
              data-testid={`${testId}-input-${index}`}
              onChange={(event) => onChange(index, event.target.value)}
              type="text"
              value={item}
            />
            <Button
              className="rounded-none border border-white/10 bg-transparent px-3 text-foreground/70 hover:border-primary/45 hover:bg-primary/10 hover:text-primary"
              data-testid={`${testId}-remove-button-${index}`}
              onClick={() => onRemove(index)}
              type="button"
              variant="outline"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, testId, value }) {
  return (
    <div className="border border-white/10 bg-white/5 p-5" data-testid={testId}>
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-secondary" data-testid={`${testId}-label`}>
        {label}
      </p>
      <p className="mt-4 text-4xl font-semibold text-foreground" data-testid={`${testId}-value`}>
        {value}
      </p>
    </div>
  );
}

export default function StudioPage() {
  const { messages, onRefresh, onSavePortfolio, portfolio, saving } = useOutletContext();
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    setDraft(clonePortfolio(portfolio));
  }, [portfolio]);

  if (!draft) {
    return null;
  }

  const mutateDraft = (recipe) => {
    setDraft((current) => {
      const next = clonePortfolio(current);
      recipe(next);
      return next;
    });
  };

  const updateTopLevelSection = (section, key, value) => {
    mutateDraft((next) => {
      next[section][key] = value;
    });
  };

  const handleSave = async () => {
    await onSavePortfolio(draft);
  };

  const handleReset = () => {
    setDraft(clonePortfolio(portfolio));
  };

  return (
    <div className="px-6 py-24 sm:px-12 lg:px-24 lg:py-28" data-testid="studio-page">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between" data-testid="studio-header-row">
          <SectionHeading
            description="Edit every public-facing section from one place. Replace the starter content, add categories and projects, update the resume timeline, and collect contact messages in the inbox."
            label="Content studio"
            testId="studio-heading"
            title="Update your portfolio without guesswork"
          />

          <div className="flex flex-wrap gap-3" data-testid="studio-header-actions">
            <Button
              className="rounded-none border border-white/10 bg-white/5 px-5 font-mono uppercase tracking-[0.18em] text-foreground/75 hover:border-secondary/45 hover:bg-secondary/10 hover:text-secondary"
              data-testid="studio-refresh-button"
              onClick={onRefresh}
              type="button"
              variant="outline"
            >
              <RotateCcw size={15} />
              Refresh
            </Button>
            <Button
              className="rounded-none border border-white/10 bg-white/5 px-5 font-mono uppercase tracking-[0.18em] text-foreground/75 hover:border-primary/45 hover:bg-primary/10 hover:text-primary"
              data-testid="studio-reset-button"
              onClick={handleReset}
              type="button"
              variant="outline"
            >
              <RotateCcw size={15} />
              Reset draft
            </Button>
            <Button
              className="rounded-none border border-primary/30 bg-primary px-5 font-mono uppercase tracking-[0.18em] text-white hover:bg-primary/90"
              data-testid="studio-save-button"
              disabled={saving}
              onClick={handleSave}
              type="button"
            >
              <Save size={15} />
              {saving ? "Saving..." : "Save portfolio"}
            </Button>
          </div>
        </div>

        <Tabs className="space-y-6" defaultValue="overview" data-testid="studio-tabs">
          <TabsList className="h-auto flex-wrap gap-2 rounded-none border border-white/10 bg-black/45 p-2" data-testid="studio-tabs-list">
            {[
              ["overview", "Overview"],
              ["hero", "Hero/About"],
              ["projects", "Projects"],
              ["resume", "Resume"],
              ["contact", "Contact"],
              ["inbox", "Inbox"],
            ].map(([value, label]) => (
              <TabsTrigger
                className="rounded-none border border-transparent px-4 py-2 font-mono uppercase tracking-[0.18em] data-[state=active]:border-secondary/35 data-[state=active]:bg-secondary/10 data-[state=active]:text-secondary"
                data-testid={`studio-tab-${value}`}
                key={value}
                value={value}
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent className="space-y-6" data-testid="studio-overview-tab" value="overview">
            <div className="grid gap-4 md:grid-cols-4" data-testid="studio-overview-grid">
              <StatCard label="Categories" testId="studio-overview-categories" value={draft.project_categories.length} />
              <StatCard label="Projects" testId="studio-overview-projects" value={draft.projects.length} />
              <StatCard label="Resume entries" testId="studio-overview-resume" value={draft.resume.experience.length + draft.resume.education.length} />
              <StatCard label="Inbox messages" testId="studio-overview-inbox" value={messages.length} />
            </div>

            <StudioPanel
              description="Recommended order: replace hero copy, swap the about image, define project lanes, update the project cards, then finish with your resume PDF URL and contact links."
              testId="studio-guide-panel"
              title="Suggested workflow"
            >
              <div className="flex flex-wrap gap-3" data-testid="studio-guide-list">
                {[
                  "Hero copy",
                  "About details",
                  "Project categories",
                  "Project cards",
                  "Resume timeline",
                  "Contact links",
                ].map((item, index) => (
                  <Badge
                    className="rounded-none border border-white/10 bg-white/5 px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-foreground/80"
                    data-testid={`studio-guide-item-${index}`}
                    key={item}
                    variant="outline"
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            </StudioPanel>
          </TabsContent>

          <TabsContent className="space-y-6" data-testid="studio-hero-tab" value="hero">
            <StudioPanel
              description="This controls the landing page hero and the about section. Paste your real name, positioning statement, and imagery here."
              testId="studio-hero-panel"
              title="Hero and about"
            >
              <div className="grid gap-5 md:grid-cols-2" data-testid="studio-hero-grid">
                <FieldGroup label="Name" testId="studio-hero-name">
                  <Input className={inputClassName} data-testid="studio-hero-name-input" onChange={(event) => updateTopLevelSection("hero", "name", event.target.value)} type="text" value={draft.hero.name} />
                </FieldGroup>
                <FieldGroup label="Title" testId="studio-hero-title">
                  <Input className={inputClassName} data-testid="studio-hero-title-input" onChange={(event) => updateTopLevelSection("hero", "title", event.target.value)} type="text" value={draft.hero.title} />
                </FieldGroup>
                <FieldGroup label="Tagline" testId="studio-hero-tagline">
                  <Textarea className={textareaClassName} data-testid="studio-hero-tagline-input" onChange={(event) => updateTopLevelSection("hero", "tagline", event.target.value)} value={draft.hero.tagline} />
                </FieldGroup>
                <FieldGroup label="Status line" testId="studio-hero-status">
                  <Textarea className={textareaClassName} data-testid="studio-hero-status-input" onChange={(event) => updateTopLevelSection("hero", "status", event.target.value)} value={draft.hero.status} />
                </FieldGroup>
                <FieldGroup label="Hero image URL" testId="studio-hero-image">
                  <Input className={inputClassName} data-testid="studio-hero-image-input" onChange={(event) => updateTopLevelSection("hero", "hero_image", event.target.value)} type="url" value={draft.hero.hero_image} />
                </FieldGroup>
                <FieldGroup label="About headline" testId="studio-about-headline">
                  <Input className={inputClassName} data-testid="studio-about-headline-input" onChange={(event) => updateTopLevelSection("about", "headline", event.target.value)} type="text" value={draft.about.headline} />
                </FieldGroup>
                <FieldGroup label="About intro" testId="studio-about-intro">
                  <Textarea className={textareaClassName} data-testid="studio-about-intro-input" onChange={(event) => updateTopLevelSection("about", "intro", event.target.value)} value={draft.about.intro} />
                </FieldGroup>
                <FieldGroup label="About detail" testId="studio-about-detail">
                  <Textarea className={textareaClassName} data-testid="studio-about-detail-input" onChange={(event) => updateTopLevelSection("about", "detail", event.target.value)} value={draft.about.detail} />
                </FieldGroup>
                <FieldGroup label="About image URL" testId="studio-about-image">
                  <Input className={inputClassName} data-testid="studio-about-image-input" onChange={(event) => updateTopLevelSection("about", "image_url", event.target.value)} type="url" value={draft.about.image_url} />
                </FieldGroup>
              </div>

              <div className="grid gap-5 md:grid-cols-2" data-testid="studio-about-lists-grid">
                <StringListEditor
                  addLabel="Add specialty"
                  items={draft.about.specialties}
                  onAdd={() => mutateDraft((next) => next.about.specialties.push("New specialty"))}
                  onChange={(index, value) => mutateDraft((next) => { next.about.specialties[index] = value; })}
                  onRemove={(index) => mutateDraft((next) => { next.about.specialties.splice(index, 1); })}
                  testId="studio-about-specialties"
                  title="Specialties"
                />
                <StringListEditor
                  addLabel="Add tool"
                  items={draft.about.tools}
                  onAdd={() => mutateDraft((next) => next.about.tools.push("New tool"))}
                  onChange={(index, value) => mutateDraft((next) => { next.about.tools[index] = value; })}
                  onRemove={(index) => mutateDraft((next) => { next.about.tools.splice(index, 1); })}
                  testId="studio-about-tools"
                  title="Tools"
                />
              </div>
            </StudioPanel>
          </TabsContent>

          <TabsContent className="space-y-6" data-testid="studio-projects-tab" value="projects">
            <StudioPanel
              action={
                <Button
                  className="rounded-none border border-secondary/35 bg-secondary/10 px-5 font-mono uppercase tracking-[0.18em] text-secondary hover:bg-secondary/15"
                  data-testid="studio-add-category-button"
                  onClick={() => mutateDraft((next) => next.project_categories.push(createCategory()))}
                  type="button"
                  variant="outline"
                >
                  <Plus size={14} />
                  Add category
                </Button>
              }
              description="Categories power the filter buttons and grouped project sections on the public Projects page."
              testId="studio-categories-panel"
              title="Project categories"
            >
              <div className="space-y-4" data-testid="studio-categories-list">
                {draft.project_categories.map((category, index) => (
                  <div className="grid gap-4 border border-white/10 bg-white/5 p-4 md:grid-cols-[1fr_1fr_auto]" data-testid={`studio-category-card-${index}`} key={category.id}>
                    <FieldGroup label="Label" testId={`studio-category-label-${index}`}>
                      <Input className={inputClassName} data-testid={`studio-category-label-input-${index}`} onChange={(event) => mutateDraft((next) => { next.project_categories[index].label = event.target.value; })} type="text" value={category.label} />
                    </FieldGroup>
                    <FieldGroup label="ID" testId={`studio-category-id-${index}`}>
                      <Input className={inputClassName} data-testid={`studio-category-id-input-${index}`} onChange={(event) => mutateDraft((next) => { next.project_categories[index].id = event.target.value; })} type="text" value={category.id} />
                    </FieldGroup>
                    <div className="flex items-end">
                      <Button
                        className="rounded-none border border-white/10 bg-transparent px-4 text-foreground/70 hover:border-primary/45 hover:bg-primary/10 hover:text-primary"
                        data-testid={`studio-category-remove-button-${index}`}
                        onClick={() => mutateDraft((next) => { next.project_categories.splice(index, 1); })}
                        type="button"
                        variant="outline"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                    <div className="md:col-span-3">
                      <FieldGroup label="Description" testId={`studio-category-description-${index}`}>
                        <Textarea className={textareaClassName} data-testid={`studio-category-description-input-${index}`} onChange={(event) => mutateDraft((next) => { next.project_categories[index].description = event.target.value; })} value={category.description} />
                      </FieldGroup>
                    </div>
                  </div>
                ))}
              </div>
            </StudioPanel>

            <StudioPanel
              action={
                <Button
                  className="rounded-none border border-primary/35 bg-primary/10 px-5 font-mono uppercase tracking-[0.18em] text-primary hover:bg-primary/15"
                  data-testid="studio-add-project-button"
                  onClick={() => mutateDraft((next) => next.projects.push(createProject(next.project_categories[0]?.id ?? "")))}
                  type="button"
                  variant="outline"
                >
                  <Plus size={14} />
                  Add project
                </Button>
              }
              description="Project cards drive the public project gallery. Add your role, category, summary, image, tools, and bullet points here."
              testId="studio-project-panel"
              title="Project cards"
            >
              <div className="space-y-6" data-testid="studio-project-list">
                {draft.projects.map((project, index) => (
                  <article className="space-y-5 border border-white/10 bg-white/5 p-5" data-testid={`studio-project-card-${index}`} key={project.id}>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary" data-testid={`studio-project-kicker-${index}`}>
                          Project {index + 1}
                        </p>
                        <h3 className="mt-2 text-xl font-semibold uppercase tracking-[-0.03em] text-foreground" data-testid={`studio-project-title-display-${index}`}>
                          {project.title}
                        </h3>
                      </div>
                      <Button
                        className="rounded-none border border-white/10 bg-transparent px-4 text-foreground/70 hover:border-primary/45 hover:bg-primary/10 hover:text-primary"
                        data-testid={`studio-project-remove-button-${index}`}
                        onClick={() => mutateDraft((next) => { next.projects.splice(index, 1); })}
                        type="button"
                        variant="outline"
                      >
                        <Trash2 size={14} />
                        Remove
                      </Button>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2" data-testid={`studio-project-grid-${index}`}>
                      <FieldGroup label="Title" testId={`studio-project-title-${index}`}>
                        <Input className={inputClassName} data-testid={`studio-project-title-input-${index}`} onChange={(event) => mutateDraft((next) => { next.projects[index].title = event.target.value; })} type="text" value={project.title} />
                      </FieldGroup>
                      <FieldGroup label="Project ID" testId={`studio-project-id-${index}`}>
                        <Input className={inputClassName} data-testid={`studio-project-id-input-${index}`} onChange={(event) => mutateDraft((next) => { next.projects[index].id = event.target.value; })} type="text" value={project.id} />
                      </FieldGroup>
                      <FieldGroup label="Category" testId={`studio-project-category-${index}`}>
                        <select
                          className={`${inputClassName} flex h-9 w-full px-3 py-2 text-sm`}
                          data-testid={`studio-project-category-input-${index}`}
                          onChange={(event) => mutateDraft((next) => { next.projects[index].category_id = event.target.value; })}
                          value={project.category_id}
                        >
                          {draft.project_categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.label}
                            </option>
                          ))}
                        </select>
                      </FieldGroup>
                      <FieldGroup label="Role" testId={`studio-project-role-${index}`}>
                        <Input className={inputClassName} data-testid={`studio-project-role-input-${index}`} onChange={(event) => mutateDraft((next) => { next.projects[index].role = event.target.value; })} type="text" value={project.role} />
                      </FieldGroup>
                      <FieldGroup label="Year" testId={`studio-project-year-${index}`}>
                        <Input className={inputClassName} data-testid={`studio-project-year-input-${index}`} onChange={(event) => mutateDraft((next) => { next.projects[index].year = event.target.value; })} type="text" value={project.year} />
                      </FieldGroup>
                      <FieldGroup label="Featured" testId={`studio-project-featured-${index}`}>
                        <select
                          className={`${inputClassName} flex h-9 w-full px-3 py-2 text-sm`}
                          data-testid={`studio-project-featured-input-${index}`}
                          onChange={(event) => mutateDraft((next) => { next.projects[index].featured = event.target.value === "true"; })}
                          value={String(project.featured)}
                        >
                          <option value="true">Featured</option>
                          <option value="false">Standard</option>
                        </select>
                      </FieldGroup>
                      <div className="md:col-span-2">
                        <FieldGroup label="Summary" testId={`studio-project-summary-${index}`}>
                          <Textarea className={textareaClassName} data-testid={`studio-project-summary-input-${index}`} onChange={(event) => mutateDraft((next) => { next.projects[index].summary = event.target.value; })} value={project.summary} />
                        </FieldGroup>
                      </div>
                      <div className="md:col-span-2">
                        <FieldGroup label="Outcome" testId={`studio-project-outcome-${index}`}>
                          <Textarea className={textareaClassName} data-testid={`studio-project-outcome-input-${index}`} onChange={(event) => mutateDraft((next) => { next.projects[index].outcome = event.target.value; })} value={project.outcome} />
                        </FieldGroup>
                      </div>
                      <div className="md:col-span-2">
                        <FieldGroup label="Cover image URL" testId={`studio-project-image-${index}`}>
                          <Input className={inputClassName} data-testid={`studio-project-image-input-${index}`} onChange={(event) => mutateDraft((next) => { next.projects[index].cover_image = event.target.value; })} type="url" value={project.cover_image} />
                        </FieldGroup>
                      </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2" data-testid={`studio-project-lists-${index}`}>
                      <StringListEditor
                        addLabel="Add tool"
                        items={project.tools}
                        onAdd={() => mutateDraft((next) => next.projects[index].tools.push("New tool"))}
                        onChange={(itemIndex, value) => mutateDraft((next) => { next.projects[index].tools[itemIndex] = value; })}
                        onRemove={(itemIndex) => mutateDraft((next) => { next.projects[index].tools.splice(itemIndex, 1); })}
                        testId={`studio-project-tools-${index}`}
                        title="Tools"
                      />
                      <StringListEditor
                        addLabel="Add bullet"
                        items={project.detail_points}
                        onAdd={() => mutateDraft((next) => next.projects[index].detail_points.push("New bullet"))}
                        onChange={(itemIndex, value) => mutateDraft((next) => { next.projects[index].detail_points[itemIndex] = value; })}
                        onRemove={(itemIndex) => mutateDraft((next) => { next.projects[index].detail_points.splice(itemIndex, 1); })}
                        testId={`studio-project-points-${index}`}
                        title="Detail bullets"
                      />
                    </div>
                  </article>
                ))}
              </div>
            </StudioPanel>
          </TabsContent>

          <TabsContent className="space-y-6" data-testid="studio-resume-tab" value="resume">
            <StudioPanel
              description="Keep the on-page resume and the downloadable PDF aligned so recruiters can scan and save the same story."
              testId="studio-resume-panel"
              title="Resume overview"
            >
              <div className="grid gap-5 md:grid-cols-2" data-testid="studio-resume-grid">
                <FieldGroup label="Resume summary" testId="studio-resume-summary">
                  <Textarea className={textareaClassName} data-testid="studio-resume-summary-input" onChange={(event) => updateTopLevelSection("resume", "summary", event.target.value)} value={draft.resume.summary} />
                </FieldGroup>
                <FieldGroup label="PDF URL" testId="studio-resume-pdf">
                  <Input className={inputClassName} data-testid="studio-resume-pdf-input" onChange={(event) => updateTopLevelSection("resume", "pdf_url", event.target.value)} type="url" value={draft.resume.pdf_url} />
                </FieldGroup>
              </div>

              <StringListEditor
                addLabel="Add skill"
                items={draft.resume.skills}
                onAdd={() => mutateDraft((next) => next.resume.skills.push("New skill"))}
                onChange={(index, value) => mutateDraft((next) => { next.resume.skills[index] = value; })}
                onRemove={(index) => mutateDraft((next) => { next.resume.skills.splice(index, 1); })}
                testId="studio-resume-skills"
                title="Skills"
              />
            </StudioPanel>

            <StudioPanel
              action={
                <Button
                  className="rounded-none border border-secondary/35 bg-secondary/10 px-5 font-mono uppercase tracking-[0.18em] text-secondary hover:bg-secondary/15"
                  data-testid="studio-add-experience-button"
                  onClick={() => mutateDraft((next) => next.resume.experience.push(createExperience()))}
                  type="button"
                  variant="outline"
                >
                  <Plus size={14} />
                  Add experience
                </Button>
              }
              description="Add internships, coursework leadership, jams, or collaboration roles that prove your process and impact."
              testId="studio-experience-panel"
              title="Experience timeline"
            >
              <div className="space-y-5" data-testid="studio-experience-list">
                {draft.resume.experience.map((item, index) => (
                  <article className="space-y-5 border border-white/10 bg-white/5 p-5" data-testid={`studio-experience-card-${index}`} key={item.id}>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <p className="font-mono text-xs uppercase tracking-[0.25em] text-secondary" data-testid={`studio-experience-label-${index}`}>
                        Experience {index + 1}
                      </p>
                      <Button
                        className="rounded-none border border-white/10 bg-transparent px-4 text-foreground/70 hover:border-primary/45 hover:bg-primary/10 hover:text-primary"
                        data-testid={`studio-experience-remove-button-${index}`}
                        onClick={() => mutateDraft((next) => { next.resume.experience.splice(index, 1); })}
                        type="button"
                        variant="outline"
                      >
                        <Trash2 size={14} />
                        Remove
                      </Button>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2" data-testid={`studio-experience-grid-${index}`}>
                      <FieldGroup label="Title" testId={`studio-experience-title-${index}`}>
                        <Input className={inputClassName} data-testid={`studio-experience-title-input-${index}`} onChange={(event) => mutateDraft((next) => { next.resume.experience[index].title = event.target.value; })} type="text" value={item.title} />
                      </FieldGroup>
                      <FieldGroup label="Organization" testId={`studio-experience-organization-${index}`}>
                        <Input className={inputClassName} data-testid={`studio-experience-organization-input-${index}`} onChange={(event) => mutateDraft((next) => { next.resume.experience[index].organization = event.target.value; })} type="text" value={item.organization} />
                      </FieldGroup>
                      <FieldGroup label="Period" testId={`studio-experience-period-${index}`}>
                        <Input className={inputClassName} data-testid={`studio-experience-period-input-${index}`} onChange={(event) => mutateDraft((next) => { next.resume.experience[index].period = event.target.value; })} type="text" value={item.period} />
                      </FieldGroup>
                      <FieldGroup label="Entry ID" testId={`studio-experience-id-${index}`}>
                        <Input className={inputClassName} data-testid={`studio-experience-id-input-${index}`} onChange={(event) => mutateDraft((next) => { next.resume.experience[index].id = event.target.value; })} type="text" value={item.id} />
                      </FieldGroup>
                      <div className="md:col-span-2">
                        <FieldGroup label="Description" testId={`studio-experience-description-${index}`}>
                          <Textarea className={textareaClassName} data-testid={`studio-experience-description-input-${index}`} onChange={(event) => mutateDraft((next) => { next.resume.experience[index].description = event.target.value; })} value={item.description} />
                        </FieldGroup>
                      </div>
                    </div>

                    <StringListEditor
                      addLabel="Add bullet"
                      items={item.bullets}
                      onAdd={() => mutateDraft((next) => next.resume.experience[index].bullets.push("New bullet"))}
                      onChange={(itemIndex, value) => mutateDraft((next) => { next.resume.experience[index].bullets[itemIndex] = value; })}
                      onRemove={(itemIndex) => mutateDraft((next) => { next.resume.experience[index].bullets.splice(itemIndex, 1); })}
                      testId={`studio-experience-bullets-${index}`}
                      title="Bullets"
                    />
                  </article>
                ))}
              </div>
            </StudioPanel>

            <StudioPanel
              action={
                <Button
                  className="rounded-none border border-primary/35 bg-primary/10 px-5 font-mono uppercase tracking-[0.18em] text-primary hover:bg-primary/15"
                  data-testid="studio-add-education-button"
                  onClick={() => mutateDraft((next) => next.resume.education.push(createEducation()))}
                  type="button"
                  variant="outline"
                >
                  <Plus size={14} />
                  Add education
                </Button>
              }
              description="Education cards can cover your degree, certifications, honors, or any relevant game design training."
              testId="studio-education-panel"
              title="Education"
            >
              <div className="space-y-5" data-testid="studio-education-list">
                {draft.resume.education.map((item, index) => (
                  <article className="grid gap-5 border border-white/10 bg-white/5 p-5 md:grid-cols-2" data-testid={`studio-education-card-${index}`} key={item.id}>
                    <FieldGroup label="Program" testId={`studio-education-program-${index}`}>
                      <Input className={inputClassName} data-testid={`studio-education-program-input-${index}`} onChange={(event) => mutateDraft((next) => { next.resume.education[index].program = event.target.value; })} type="text" value={item.program} />
                    </FieldGroup>
                    <FieldGroup label="School" testId={`studio-education-school-${index}`}>
                      <Input className={inputClassName} data-testid={`studio-education-school-input-${index}`} onChange={(event) => mutateDraft((next) => { next.resume.education[index].school = event.target.value; })} type="text" value={item.school} />
                    </FieldGroup>
                    <FieldGroup label="Period" testId={`studio-education-period-${index}`}>
                      <Input className={inputClassName} data-testid={`studio-education-period-input-${index}`} onChange={(event) => mutateDraft((next) => { next.resume.education[index].period = event.target.value; })} type="text" value={item.period} />
                    </FieldGroup>
                    <FieldGroup label="Entry ID" testId={`studio-education-id-${index}`}>
                      <Input className={inputClassName} data-testid={`studio-education-id-input-${index}`} onChange={(event) => mutateDraft((next) => { next.resume.education[index].id = event.target.value; })} type="text" value={item.id} />
                    </FieldGroup>
                    <div className="md:col-span-2">
                      <FieldGroup label="Details" testId={`studio-education-details-${index}`}>
                        <Textarea className={textareaClassName} data-testid={`studio-education-details-input-${index}`} onChange={(event) => mutateDraft((next) => { next.resume.education[index].details = event.target.value; })} value={item.details} />
                      </FieldGroup>
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                      <Button
                        className="rounded-none border border-white/10 bg-transparent px-4 text-foreground/70 hover:border-primary/45 hover:bg-primary/10 hover:text-primary"
                        data-testid={`studio-education-remove-button-${index}`}
                        onClick={() => mutateDraft((next) => { next.resume.education.splice(index, 1); })}
                        type="button"
                        variant="outline"
                      >
                        <Trash2 size={14} />
                        Remove
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            </StudioPanel>
          </TabsContent>

          <TabsContent className="space-y-6" data-testid="studio-contact-tab" value="contact">
            <StudioPanel
              description="These fields update the public contact page, including the direct cards, availability message, and external links."
              testId="studio-contact-panel"
              title="Contact details"
            >
              <div className="grid gap-5 md:grid-cols-2" data-testid="studio-contact-grid">
                <FieldGroup label="Intro" testId="studio-contact-intro">
                  <Textarea className={textareaClassName} data-testid="studio-contact-intro-input" onChange={(event) => updateTopLevelSection("contact", "intro", event.target.value)} value={draft.contact.intro} />
                </FieldGroup>
                <FieldGroup label="Availability" testId="studio-contact-availability">
                  <Textarea className={textareaClassName} data-testid="studio-contact-availability-input" onChange={(event) => updateTopLevelSection("contact", "availability", event.target.value)} value={draft.contact.availability} />
                </FieldGroup>
                <FieldGroup label="Email" testId="studio-contact-email">
                  <Input className={inputClassName} data-testid="studio-contact-email-input" onChange={(event) => updateTopLevelSection("contact", "email", event.target.value)} type="email" value={draft.contact.email} />
                </FieldGroup>
                <FieldGroup label="Location" testId="studio-contact-location">
                  <Input className={inputClassName} data-testid="studio-contact-location-input" onChange={(event) => updateTopLevelSection("contact", "location", event.target.value)} type="text" value={draft.contact.location} />
                </FieldGroup>
              </div>
            </StudioPanel>

            <StudioPanel
              action={
                <Button
                  className="rounded-none border border-secondary/35 bg-secondary/10 px-5 font-mono uppercase tracking-[0.18em] text-secondary hover:bg-secondary/15"
                  data-testid="studio-add-link-button"
                  onClick={() => mutateDraft((next) => next.contact.links.push(createLink()))}
                  type="button"
                  variant="outline"
                >
                  <Plus size={14} />
                  Add link
                </Button>
              }
              description="Add LinkedIn, itch.io, GitHub, ArtStation, or any other public profile you want visitors to open from the contact page."
              testId="studio-links-panel"
              title="External links"
            >
              <div className="space-y-4" data-testid="studio-links-list">
                {draft.contact.links.map((link, index) => (
                  <div className="grid gap-4 border border-white/10 bg-white/5 p-4 md:grid-cols-[1fr_1.4fr_auto]" data-testid={`studio-link-card-${index}`} key={link.id}>
                    <FieldGroup label="Label" testId={`studio-link-label-${index}`}>
                      <Input className={inputClassName} data-testid={`studio-link-label-input-${index}`} onChange={(event) => mutateDraft((next) => { next.contact.links[index].label = event.target.value; })} type="text" value={link.label} />
                    </FieldGroup>
                    <FieldGroup label="URL" testId={`studio-link-url-${index}`}>
                      <Input className={inputClassName} data-testid={`studio-link-url-input-${index}`} onChange={(event) => mutateDraft((next) => { next.contact.links[index].url = event.target.value; })} type="url" value={link.url} />
                    </FieldGroup>
                    <div className="flex items-end">
                      <Button
                        className="rounded-none border border-white/10 bg-transparent px-4 text-foreground/70 hover:border-primary/45 hover:bg-primary/10 hover:text-primary"
                        data-testid={`studio-link-remove-button-${index}`}
                        onClick={() => mutateDraft((next) => { next.contact.links.splice(index, 1); })}
                        type="button"
                        variant="outline"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </StudioPanel>
          </TabsContent>

          <TabsContent className="space-y-6" data-testid="studio-inbox-tab" value="inbox">
            <StudioPanel
              description="Messages sent from the public contact form appear here so you can track incoming interest."
              testId="studio-inbox-panel"
              title="Portfolio inbox"
            >
              {messages.length > 0 ? (
                <Table className="border border-white/10" data-testid="studio-inbox-table">
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent" data-testid="studio-inbox-header-row">
                      <TableHead className="font-mono text-xs uppercase tracking-[0.18em] text-secondary" data-testid="studio-inbox-head-name">Name</TableHead>
                      <TableHead className="font-mono text-xs uppercase tracking-[0.18em] text-secondary" data-testid="studio-inbox-head-email">Email</TableHead>
                      <TableHead className="font-mono text-xs uppercase tracking-[0.18em] text-secondary" data-testid="studio-inbox-head-interest">Interest</TableHead>
                      <TableHead className="font-mono text-xs uppercase tracking-[0.18em] text-secondary" data-testid="studio-inbox-head-message">Message</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody data-testid="studio-inbox-body">
                    {messages.map((message, index) => (
                      <TableRow className="border-white/10 hover:bg-white/5" data-testid={`studio-inbox-row-${index}`} key={message.id}>
                        <TableCell data-testid={`studio-inbox-name-${index}`}>{message.name}</TableCell>
                        <TableCell data-testid={`studio-inbox-email-${index}`}>{message.email}</TableCell>
                        <TableCell data-testid={`studio-inbox-interest-${index}`}>{message.project_interest}</TableCell>
                        <TableCell className="max-w-md text-sm leading-relaxed" data-testid={`studio-inbox-message-${index}`}>{message.message}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="border border-dashed border-white/15 bg-white/5 p-8 text-center" data-testid="studio-inbox-empty-state">
                  <p className="font-mono text-xs uppercase tracking-[0.25em] text-secondary" data-testid="studio-inbox-empty-label">
                    Inbox is quiet
                  </p>
                  <p className="mt-3 text-sm text-foreground/75" data-testid="studio-inbox-empty-copy">
                    Submit the public contact form to see messages land here.
                  </p>
                </div>
              )}
            </StudioPanel>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}