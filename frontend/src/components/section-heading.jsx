import { motion } from "framer-motion";

export const SectionHeading = ({ description, label, testId, title }) => {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl"
      data-testid={`${testId}-wrapper`}
      initial={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
    >
      <p
        className="font-mono text-xs uppercase tracking-[0.25em] text-secondary"
        data-testid={`${testId}-label`}
      >
        {label}
      </p>
      <h1
        className="mt-4 text-4xl font-black uppercase tracking-[-0.04em] text-foreground sm:text-5xl lg:text-6xl"
        data-testid={`${testId}-title`}
      >
        {title}
      </h1>
      <p
        className="mt-6 max-w-2xl text-sm leading-relaxed text-foreground/75 sm:text-base"
        data-testid={`${testId}-description`}
      >
        {description}
      </p>
    </motion.div>
  );
};