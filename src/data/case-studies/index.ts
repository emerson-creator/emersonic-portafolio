import type { CaseStudy } from "./types";
import { prismStore } from "./prism-store";
import { mediaflowAi } from "./mediaflow-ai";
import { pulsemetrics } from "./pulsemetrics";

// Keys must match the slugs in projects.ts
export const caseStudies: Record<string, CaseStudy> = {
  "prism-store": prismStore,
  "mediaflow-ai": mediaflowAi,
  pulsemetrics,
};
