import { useState } from "react";
import { ArrowSquareOut, EnvelopeSimple, MapPinLine, PaperPlaneTilt } from "@phosphor-icons/react";
import { toast } from "sonner";
import { useOutletContext } from "react-router-dom";

import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const emptyForm = {
  name: "",
  email: "",
  project_interest: "",
  message: "",
};

export default function ContactPage() {
  const { onSubmitContact, portfolio } = useOutletContext();
  const [formData, setFormData] = useState(emptyForm);
  const [isSending, setIsSending] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsSending(true);
      await onSubmitContact(formData);
      toast.success("Message sent to your portfolio inbox.");
      setFormData(emptyForm);
    } catch (error) {
      console.error(error);
      toast.error("Couldn’t send your message.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="px-6 py-24 sm:px-12 lg:px-24 lg:py-28" data-testid="contact-page">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-8" data-testid="contact-details-column">
          <SectionHeading
            description="Show your direct channels and let visitors drop a message straight into the portfolio inbox."
            label="Contact"
            testId="contact-heading"
            title="Let recruiters, collaborators, and mentors reach you"
          />

          <div className="border border-white/10 bg-black/55 p-6" data-testid="contact-intro-card">
            <p className="text-sm leading-relaxed text-foreground/76 sm:text-base" data-testid="contact-intro-copy">
              {portfolio.contact.intro}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2" data-testid="contact-info-grid">
            <div className="border border-secondary/20 bg-secondary/5 p-5" data-testid="contact-email-card">
              <EnvelopeSimple className="text-secondary" size={22} weight="duotone" />
              <p className="mt-4 font-mono text-xs uppercase tracking-[0.25em] text-secondary" data-testid="contact-email-label">
                Email
              </p>
              <a className="mt-3 block text-sm text-foreground/85 hover:text-secondary" data-testid="contact-email-value" href={`mailto:${portfolio.contact.email}`}>
                {portfolio.contact.email}
              </a>
            </div>

            <div className="border border-primary/20 bg-primary/5 p-5" data-testid="contact-location-card">
              <MapPinLine className="text-primary" size={22} weight="duotone" />
              <p className="mt-4 font-mono text-xs uppercase tracking-[0.25em] text-primary" data-testid="contact-location-label">
                Location
              </p>
              <p className="mt-3 text-sm text-foreground/85" data-testid="contact-location-value">
                {portfolio.contact.location}
              </p>
            </div>
          </div>

          <div className="border border-accent/20 bg-accent/5 p-6" data-testid="contact-availability-card">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent" data-testid="contact-availability-label">
              Availability
            </p>
            <p className="mt-4 text-sm leading-relaxed text-foreground/78" data-testid="contact-availability-value">
              {portfolio.contact.availability}
            </p>
          </div>

          <div className="space-y-4" data-testid="contact-links-list">
            {portfolio.contact.links.map((link, index) => (
              <Button
                asChild
                className="w-full justify-between rounded-none border border-white/10 bg-white/5 px-5 py-6 text-left font-mono uppercase tracking-[0.18em] text-foreground/80 hover:border-secondary/45 hover:bg-secondary/10 hover:text-secondary"
                data-testid={`contact-link-${index}`}
                key={link.id}
                variant="outline"
              >
                <a href={link.url} rel="noreferrer" target="_blank">
                  <span>{link.label}</span>
                  <ArrowSquareOut size={16} />
                </a>
              </Button>
            ))}
          </div>
        </div>

        <form className="scanlines border border-white/10 bg-black/65 p-6 sm:p-8" data-testid="contact-form" onSubmit={handleSubmit}>
          <div className="flex items-center gap-3" data-testid="contact-form-header">
            <PaperPlaneTilt className="text-secondary" size={22} weight="duotone" />
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-secondary" data-testid="contact-form-label">
                Portfolio inbox
              </p>
              <h2 className="mt-2 text-2xl font-semibold uppercase tracking-[-0.03em] text-foreground" data-testid="contact-form-title">
                Send a message
              </h2>
            </div>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2" data-testid="contact-form-grid">
            <div data-testid="contact-form-name-group">
              <label className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-foreground/65" data-testid="contact-form-name-label" htmlFor="contact-name">
                Name
              </label>
              <Input
                className="rounded-none border-white/10 bg-white/5 text-foreground placeholder:text-foreground/35 focus-visible:ring-secondary"
                data-testid="contact-form-name-input"
                id="contact-name"
                name="name"
                onChange={handleChange}
                placeholder="Your name"
                required
                type="text"
                value={formData.name}
              />
            </div>

            <div data-testid="contact-form-email-group">
              <label className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-foreground/65" data-testid="contact-form-email-label" htmlFor="contact-email">
                Email
              </label>
              <Input
                className="rounded-none border-white/10 bg-white/5 text-foreground placeholder:text-foreground/35 focus-visible:ring-secondary"
                data-testid="contact-form-email-input"
                id="contact-email"
                name="email"
                onChange={handleChange}
                placeholder="you@example.com"
                required
                type="email"
                value={formData.email}
              />
            </div>

            <div className="sm:col-span-2" data-testid="contact-form-interest-group">
              <label className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-foreground/65" data-testid="contact-form-interest-label" htmlFor="contact-interest">
                Project interest
              </label>
              <Input
                className="rounded-none border-white/10 bg-white/5 text-foreground placeholder:text-foreground/35 focus-visible:ring-secondary"
                data-testid="contact-form-interest-input"
                id="contact-interest"
                name="project_interest"
                onChange={handleChange}
                placeholder="Internship, collaboration, playtest, portfolio review..."
                required
                type="text"
                value={formData.project_interest}
              />
            </div>

            <div className="sm:col-span-2" data-testid="contact-form-message-group">
              <label className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-foreground/65" data-testid="contact-form-message-label" htmlFor="contact-message">
                Message
              </label>
              <Textarea
                className="min-h-[180px] rounded-none border-white/10 bg-white/5 text-foreground placeholder:text-foreground/35 focus-visible:ring-secondary"
                data-testid="contact-form-message-input"
                id="contact-message"
                name="message"
                onChange={handleChange}
                placeholder="Share what you’re looking for, your timeline, or the type of role you have in mind."
                required
                value={formData.message}
              />
            </div>
          </div>

          <Button
            className="mt-8 w-full rounded-none border border-primary/30 bg-primary px-6 py-6 font-mono uppercase tracking-[0.2em] text-white hover:bg-primary/90"
            data-testid="contact-form-submit-button"
            disabled={isSending}
            type="submit"
          >
            {isSending ? "Sending..." : "Send message"}
          </Button>
        </form>
      </div>
    </div>
  );
}