import { DownloadSimple, GraduationCap, SuitcaseSimple } from "@phosphor-icons/react";
import { useOutletContext } from "react-router-dom";

import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ResumePage() {
  const { portfolio } = useOutletContext();

  return (
    <div className="px-6 py-24 sm:px-12 lg:px-24 lg:py-28" data-testid="resume-page">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.72fr_1.28fr]">
        <aside className="space-y-8 lg:sticky lg:top-36 lg:self-start" data-testid="resume-sidebar">
          <SectionHeading
            description="A clean, recruiter-friendly resume section paired with a PDF button, so you can present the same story on-screen and in downloadable form."
            label="Resume"
            testId="resume-heading"
            title="Experience, skills, and design focus"
          />

          <div className="border border-white/10 bg-black/55 p-6" data-testid="resume-summary-card">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary" data-testid="resume-summary-label">
              Summary
            </p>
            <p className="mt-4 text-sm leading-relaxed text-foreground/75 sm:text-base" data-testid="resume-summary-copy">
              {portfolio.resume.summary}
            </p>

            <Button
              asChild
              className="mt-6 w-full rounded-none border border-primary/35 bg-primary px-5 py-6 font-mono uppercase tracking-[0.2em] text-white hover:bg-primary/90"
              data-testid="resume-download-button"
            >
              <a href={portfolio.resume.pdf_url} rel="noreferrer" target="_blank">
                <DownloadSimple size={16} />
                Download PDF
              </a>
            </Button>
          </div>

          <div className="border border-secondary/20 bg-secondary/5 p-6" data-testid="resume-skills-card">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-secondary" data-testid="resume-skills-label">
              Skills index
            </p>
            <div className="mt-5 flex flex-wrap gap-2" data-testid="resume-skills-list">
              {portfolio.resume.skills.map((skill, index) => (
                <Badge
                  className="rounded-none border border-secondary/20 bg-transparent px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-secondary"
                  data-testid={`resume-skill-${index}`}
                  key={`${skill}-${index}`}
                  variant="outline"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </aside>

        <div className="space-y-12" data-testid="resume-content-column">
          <section className="space-y-6" data-testid="resume-experience-section">
            <div className="flex items-center gap-3" data-testid="resume-experience-header">
              <SuitcaseSimple className="text-secondary" size={22} weight="duotone" />
              <h2 className="text-2xl font-semibold uppercase tracking-[-0.03em] text-foreground sm:text-3xl" data-testid="resume-experience-title">
                Experience
              </h2>
            </div>

            <div className="space-y-6 border-l border-secondary/35 pl-6" data-testid="resume-experience-timeline">
              {portfolio.resume.experience.map((item, index) => (
                <article className="relative border border-white/10 bg-black/55 p-6" data-testid={`resume-experience-card-${index}`} key={item.id}>
                  <span className="absolute -left-[33px] top-8 h-3 w-3 bg-secondary shadow-[0_0_18px_rgba(5,217,232,0.45)]" />
                  <p className="font-mono text-xs uppercase tracking-[0.25em] text-secondary" data-testid={`resume-experience-period-${index}`}>
                    {item.period}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold uppercase tracking-[-0.03em] text-foreground" data-testid={`resume-experience-role-${index}`}>
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-primary" data-testid={`resume-experience-organization-${index}`}>
                    {item.organization}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-foreground/75" data-testid={`resume-experience-description-${index}`}>
                    {item.description}
                  </p>
                  <ul className="mt-4 space-y-2" data-testid={`resume-experience-bullets-${index}`}>
                    {item.bullets.map((bullet, bulletIndex) => (
                      <li className="text-sm text-foreground/70" data-testid={`resume-experience-bullet-${index}-${bulletIndex}`} key={`${item.id}-${bulletIndex}`}>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section className="space-y-6" data-testid="resume-education-section">
            <div className="flex items-center gap-3" data-testid="resume-education-header">
              <GraduationCap className="text-primary" size={22} weight="duotone" />
              <h2 className="text-2xl font-semibold uppercase tracking-[-0.03em] text-foreground sm:text-3xl" data-testid="resume-education-title">
                Education
              </h2>
            </div>

            <div className="grid gap-6" data-testid="resume-education-grid">
              {portfolio.resume.education.map((item, index) => (
                <article className="border border-primary/20 bg-primary/5 p-6" data-testid={`resume-education-card-${index}`} key={item.id}>
                  <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary" data-testid={`resume-education-period-${index}`}>
                    {item.period}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold uppercase tracking-[-0.03em] text-foreground" data-testid={`resume-education-program-${index}`}>
                    {item.program}
                  </h3>
                  <p className="mt-2 text-sm text-foreground/78" data-testid={`resume-education-school-${index}`}>
                    {item.school}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-foreground/72" data-testid={`resume-education-details-${index}`}>
                    {item.details}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}