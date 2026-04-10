const makeId = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

export const clonePortfolio = (portfolio) =>
  JSON.parse(JSON.stringify(portfolio));

export const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || makeId("item");

export const createCategory = () => ({
  id: makeId("category"),
  label: "New Category",
  description: "Describe what type of work belongs in this project lane.",
});

export const createProject = (categoryId = "") => ({
  id: makeId("project"),
  title: "New Project",
  category_id: categoryId,
  summary: "Add a short overview of the project.",
  role: "Game Designer",
  year: "2026",
  outcome: "Describe the result, insight, or design win.",
  cover_image:
    "https://images.pexels.com/photos/5845255/pexels-photo-5845255.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  tools: ["Tool 1", "Tool 2"],
  detail_points: ["Add a design responsibility or outcome here."],
  featured: false,
});

export const createExperience = () => ({
  id: makeId("experience"),
  title: "Role Title",
  organization: "Studio / Team / Course",
  period: "2025 – Present",
  description: "Summarize the scope of this experience.",
  bullets: ["Add one achievement or responsibility."],
});

export const createEducation = () => ({
  id: makeId("education"),
  program: "Degree or Certificate",
  school: "School Name",
  period: "Expected 2026",
  details: "Add relevant coursework, honors, or focus areas.",
});

export const createLink = () => ({
  id: makeId("link"),
  label: "New Link",
  url: "https://",
});