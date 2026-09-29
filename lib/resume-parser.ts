import type { PdfInspectionResult } from "@/lib/pdf-inspector";

export type FieldConfidence = "high" | "medium" | "low";

export type ParsedField<T> = {
  value: T;
  confidence: FieldConfidence;
};

export type ParsedExperience = {
  companyName: string;
  role?: string;
  location?: string;
  companyWebsite?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
};

export type ParsedEducation = {
  schoolName: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
};

export type ParsedProject = {
  name: string;
  role?: string;
  stacks?: string[];
  activeLink?: string;
  description?: string;
};

export type ParsedResumeProfile = {
  firstName?: ParsedField<string>;
  middleName?: ParsedField<string>;
  lastName?: ParsedField<string>;
  contactEmail?: ParsedField<string>;
  phoneNumber?: ParsedField<string>;
  countryCode?: ParsedField<string>;
  linkedin?: ParsedField<string>;
  github?: ParsedField<string>;
  twitter?: ParsedField<string>;
  portfolio?: ParsedField<string>;
  jobType?: ParsedField<string>;
  skills?: ParsedField<string[]>;
  experiences?: ParsedField<ParsedExperience[]>;
  educations?: ParsedField<ParsedEducation[]>;
  projects?: ParsedField<ParsedProject[]>;
  summary?: ParsedField<string>;
};

const MONTH =
  "(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)";

const DATE_RANGE_RE = new RegExp(
  `(${MONTH}\\.?\\s+\\d{4})\\s*[–—\\-to]+\\s*(${MONTH}\\.?\\s+\\d{4}|Present|Current|Now)`,
  "gi",
);

const EMAIL_RE = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
const PHONE_RE =
  /(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?)?\d{3,4}[\s.-]?\d{3,4}(?:[\s.-]?\d{1,4})?/g;

const SECTION_ALIASES: Record<string, string[]> = {
  summary: ["introduction", "summary", "about", "about me", "profile", "objective"],
  skills: ["skills", "technical skills", "core competencies", "technologies"],
  experience: [
    "experience",
    "work experience",
    "professional experience",
    "employment",
    "work history",
  ],
  education: ["education", "academic", "academics", "qualifications"],
  projects: ["projects", "personal projects", "selected projects", "portfolio"],
};

function normalizeWhitespace(text: string): string {
  return text.replace(/\r\n/g, "\n").replace(/\t/g, " ").trim();
}

function getCombinedMarkdown(inspection: PdfInspectionResult): string {
  const pageMarkdown = inspection.pagesMarkdown.pages
    .map((page) => page.markdown)
    .filter(Boolean)
    .join("\n\n");

  if (pageMarkdown.trim()) return normalizeWhitespace(pageMarkdown);

  const processedMarkdown = inspection.processed.markdown?.trim();
  if (processedMarkdown) return normalizeWhitespace(processedMarkdown);

  return normalizeWhitespace(inspection.plainText);
}

function extractSections(markdown: string): Map<string, string> {
  const sections = new Map<string, string>();
  const lines = markdown.split("\n");
  let currentKey = "_header";
  let currentContent: string[] = [];

  for (const line of lines) {
    const headingMatch = line.match(/^#{1,3}\s+(.+)$/);
    if (headingMatch) {
      sections.set(currentKey, currentContent.join("\n").trim());
      currentKey = headingMatch[1].trim().toLowerCase();
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }

  sections.set(currentKey, currentContent.join("\n").trim());
  return sections;
}

function findSection(sections: Map<string, string>, aliases: string[]): string {
  for (const [key, content] of sections.entries()) {
    const normalizedKey = key.toLowerCase();
    if (aliases.some((alias) => normalizedKey.includes(alias))) {
      return content;
    }
  }
  return "";
}

function parseName(markdown: string): Pick<
  ParsedResumeProfile,
  "firstName" | "middleName" | "lastName"
> {
  const h1Match = markdown.match(/^#\s+(.+)$/m);
  if (!h1Match) return {};

  const parts = h1Match[1]
    .replace(/\*+/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return {};
  if (parts.length === 1) {
    return {
      firstName: { value: parts[0], confidence: "medium" },
    };
  }
  if (parts.length === 2) {
    return {
      firstName: { value: parts[0], confidence: "high" },
      lastName: { value: parts[1], confidence: "high" },
    };
  }

  return {
    firstName: { value: parts[0], confidence: "high" },
    middleName: { value: parts.slice(1, -1).join(" "), confidence: "medium" },
    lastName: { value: parts[parts.length - 1], confidence: "high" },
  };
}

function parseHeadlineJobType(markdown: string): ParsedField<string> | undefined {
  const knownSectionTitles = new Set(
    Object.values(SECTION_ALIASES).flat(),
  );

  for (const match of markdown.matchAll(/^##\s+(.+)$/gm)) {
    const rawTitle = match[1].trim();
    const normalizedTitle = rawTitle.toLowerCase();
    const isKnownSection = [...knownSectionTitles].some((alias) =>
      normalizedTitle.includes(alias),
    );
    if (isKnownSection) continue;

    const headline = rawTitle
      .replace(/\*+/g, "")
      .split(/[—–|/]/)
      .map((part) => part.trim())
      .filter(Boolean)[0];

    if (headline) return { value: headline, confidence: "medium" };
  }

  return undefined;
}

function normalizeUrl(raw: string): string | null {
  const cleaned = raw.replace(/[>,.;)\]]+$/g, "").trim();
  if (!cleaned) return null;
  if (/^https?:\/\//i.test(cleaned)) return cleaned;
  if (/^[a-z0-9-]+(\.[a-z0-9-]+)+(?:\/[^\s]*)?$/i.test(cleaned)) {
    return `https://${cleaned}`;
  }
  return null;
}

function extractUrls(text: string): string[] {
  const urls = new Set<string>();
  const patterns = [
    /https?:\/\/[^\s<>)]+/gi,
    /(?:linkedin\.com\/[^\s<>)]+)/gi,
    /(?:github\.com\/[^\s<>)]+)/gi,
    /(?:twitter\.com\/[^\s<>)]+|x\.com\/[^\s<>)]+)/gi,
    /<u>([^<]+)<\/u>/gi,
  ];

  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      const candidate = match[1] ?? match[0];
      const normalized = normalizeUrl(candidate);
      if (normalized) urls.add(normalized);
    }
  }

  return [...urls];
}

function classifySocialUrls(urls: string[]): Pick<
  ParsedResumeProfile,
  "linkedin" | "github" | "twitter" | "portfolio"
> {
  const result: Pick<
    ParsedResumeProfile,
    "linkedin" | "github" | "twitter" | "portfolio"
  > = {};

  for (const url of urls) {
    const lower = url.toLowerCase();
    if (lower.includes("linkedin.com")) {
      result.linkedin = { value: url, confidence: "high" };
    } else if (lower.includes("github.com")) {
      result.github = { value: url, confidence: "high" };
    } else if (lower.includes("twitter.com") || lower.includes("x.com")) {
      result.twitter = { value: url, confidence: "high" };
    } else if (!result.portfolio) {
      result.portfolio = { value: url, confidence: "medium" };
    }
  }

  return result;
}

function parseContactInfo(text: string): Pick<
  ParsedResumeProfile,
  "contactEmail" | "phoneNumber" | "countryCode"
> {
  const result: Pick<
    ParsedResumeProfile,
    "contactEmail" | "phoneNumber" | "countryCode"
  > = {};

  const emails = [...text.matchAll(EMAIL_RE)].map((match) => match[0]);
  if (emails.length > 0) {
    result.contactEmail = { value: emails[0], confidence: "high" };
  }

  const phoneCandidates = [...text.matchAll(PHONE_RE)]
    .map((match) => match[0].trim())
    .filter((phone) => phone.replace(/\D/g, "").length >= 10);

  if (phoneCandidates.length > 0) {
    const phone = phoneCandidates[0];
    result.phoneNumber = { value: phone.replace(/^\+/, ""), confidence: "medium" };
    if (phone.startsWith("+")) {
      const codeMatch = phone.match(/^\+(\d{1,3})/);
      if (codeMatch) {
        result.countryCode = { value: `+${codeMatch[1]}`, confidence: "medium" };
      }
    }
  }

  return result;
}

function parseSkills(section: string): ParsedField<string[]> | undefined {
  if (!section.trim()) return undefined;

  const withoutHeading = section.replace(/^[^:]+:\s*/m, "");
  const rawItems = withoutHeading
    .split(/[\n,;|•·]/)
    .map((item) =>
      item
        .replace(/^[-*]\s*/, "")
        .replace(/\*+/g, "")
        .trim(),
    )
    .filter((item) => item.length > 1 && item.length < 80);

  const skills = [...new Set(rawItems)];
  if (skills.length === 0) return undefined;

  return {
    value: skills,
    confidence: skills.length >= 5 ? "high" : "medium",
  };
}

function parseMonthYear(value: string): string | undefined {
  const match = value.match(
    new RegExp(`(${MONTH})\\.?\\s+(\\d{4})`, "i"),
  );
  if (!match) return undefined;

  const monthName = match[1].slice(0, 3).toLowerCase();
  const monthMap: Record<string, string> = {
    jan: "01",
    feb: "02",
    mar: "03",
    apr: "04",
    may: "05",
    jun: "06",
    jul: "07",
    aug: "08",
    sep: "09",
    oct: "10",
    nov: "11",
    dec: "12",
  };

  const month = monthMap[monthName.slice(0, 3)];
  if (!month) return undefined;
  return `${match[2]}-${month}-01`;
}

function parseDateRange(rangeText: string): {
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
} {
  const match = rangeText.match(
    new RegExp(
      `(${MONTH}\\.?\\s+\\d{4})\\s*[–—\\-to]+\\s*(${MONTH}\\.?\\s+\\d{4}|Present|Current|Now)`,
      "i",
    ),
  );
  if (!match) return {};

  const startDate = parseMonthYear(match[1]);
  const endRaw = match[2];
  const isCurrent = /present|current|now/i.test(endRaw);
  const endDate = isCurrent ? undefined : parseMonthYear(endRaw);

  return { startDate, endDate, isCurrent };
}

function splitByDateRanges(section: string): Array<{ body: string; range: string }> {
  const chunks: Array<{ body: string; range: string }> = [];
  let lastIndex = 0;

  for (const match of section.matchAll(DATE_RANGE_RE)) {
    const index = match.index ?? 0;
    const range = match[0];
    const body = section.slice(lastIndex, index).trim();
    if (body) chunks.push({ body, range });
    lastIndex = index + range.length;
  }

  const tail = section.slice(lastIndex).trim();
  if (tail) chunks.push({ body: tail, range: "" });

  return chunks;
}

function parseRoleCompany(body: string): Pick<ParsedExperience, "companyName" | "role"> {
  const cleaned = body.replace(/\*+/g, "").trim();
  let companyName = cleaned;
  let role: string | undefined = undefined;

  const pipeParts = cleaned.split("|").map((s) => s.trim()).filter(Boolean);
  if (pipeParts.length >= 2) {
    companyName = pipeParts[0];
    role = pipeParts[1];
  } else {
    const dashMatch = cleaned.match(/^(.+?)\s*[—–-]\s*(.+?)(?:$|\n)/);
    if (dashMatch) {
      companyName = dashMatch[1];
      role = dashMatch[2];
    } else {
      const atMatch = cleaned.match(/^(.+?)\s+at\s+(.+?)(?:$|\n)/i);
      if (atMatch) {
        role = atMatch[1];
        companyName = atMatch[2];
      }
    }
  }

  if (companyName && companyName.length > 50) {
    const sentences = companyName.split(". ");
    const lastPart = sentences[sentences.length - 1].trim();
    if (lastPart) {
      companyName = lastPart;
    } else {
      const doubleSpace = companyName.split("  ");
      const lastDoubleSpace = doubleSpace[doubleSpace.length - 1].trim();
      if (lastDoubleSpace) {
        companyName = lastDoubleSpace;
      }
    }
  }

  companyName = companyName.replace(/^[-•*\s]+/, "").trim();

  return { companyName, role };
}

function parseExperiences(section: string): ParsedField<ParsedExperience[]> | undefined {
  if (!section.trim()) return undefined;

  const lines = section.split("\n");
  const entries: ParsedExperience[] = [];
  let currentExp: ParsedExperience | null = null;
  let currentDesc: string[] = [];

  for (let line of lines) {
    const match = line.match(DATE_RANGE_RE);
    if (match) {
      if (currentExp) {
        currentExp.description = currentDesc.join("\n").trim();
        entries.push(currentExp);
      }

      const dateStr = match[0];
      const withoutDate = line.replace(DATE_RANGE_RE, "").trim();

      let companyNameFromPrevLine = "";
      if (currentDesc.length > 0) {
        const prevLine = currentDesc[currentDesc.length - 1].trim();
        if (!/^[-•*]/.test(prevLine) && prevLine.length < 80 && !withoutDate.includes("|")) {
          companyNameFromPrevLine = currentDesc.pop()!;
        }
      }

      const fullHeader = companyNameFromPrevLine
        ? companyNameFromPrevLine + " | " + withoutDate
        : withoutDate;

      const { companyName, role } = parseRoleCompany(fullHeader);
      currentExp = {
        companyName: companyName || fullHeader,
        role,
        ...parseDateRange(dateStr),
      };
      currentDesc = [];
    } else {
      if (currentExp) {
        currentDesc.push(line);
      } else {
        currentDesc.push(line);
      }
    }
  }

  if (currentExp) {
    currentExp.description = currentDesc.join("\n").trim();
    entries.push(currentExp);
  }

  if (entries.length === 0) return undefined;
  return {
    value: entries,
    confidence: "medium",
  };
}

function parseProjects(section: string): ParsedField<ParsedProject[]> | undefined {
  if (!section.trim()) return undefined;

  const lines = section.split("\n");
  const projects: ParsedProject[] = [];
  let currentProject: ParsedProject | null = null;
  let currentDesc: string[] = [];

  for (let line of lines) {
    const cleanedLine = line.replace(/\*+/g, "").trim();
    const isHeader =
      cleanedLine.includes("|") &&
      !/^[-•*]/.test(line.trim()) &&
      cleanedLine.length < 150;

    if (isHeader) {
      if (currentProject) {
        currentProject.description = currentDesc.join("\n").trim();
        projects.push(currentProject);
      }

      const titleMatch = cleanedLine.match(/^(.+?)\s*\|\s*(.+?)(?:$|\n|\|)/);
      const urls = extractUrls(line);

      if (titleMatch) {
        currentProject = {
          name: titleMatch[1].trim(),
          stacks: titleMatch[2]
            .split(",")
            .map((i) => i.trim())
            .filter(Boolean),
          activeLink: urls[0] || undefined,
        };
      } else {
        currentProject = {
          name: cleanedLine,
          activeLink: urls[0] || undefined,
        };
      }
      currentDesc = [];
    } else {
      if (currentProject) {
        currentDesc.push(line);
      } else if (!/^[-•*]/.test(line.trim()) && currentDesc.length === 0) {
        const urls = extractUrls(line);
        currentProject = {
          name: cleanedLine,
          activeLink: urls[0] || undefined,
        };
        currentDesc = [];
      }
    }
  }

  if (currentProject) {
    currentProject.description = currentDesc.join("\n").trim();
    projects.push(currentProject);
  }

  if (projects.length === 0) return undefined;
  return { value: projects, confidence: "medium" };
}

function parseEducations(section: string): ParsedField<ParsedEducation[]> | undefined {
  if (!section.trim()) return undefined;

  const chunks = splitByDateRanges(section);
  const educations: ParsedEducation[] = [];

  for (const chunk of chunks) {
    const dateInfo = chunk.range ? parseDateRange(chunk.range) : {};
    const body = chunk.body.replace(/\*+/g, "").trim();
    if (!body) continue;

    const degreeMatch = body.match(/^(.+?),\s*(.+)$/);
    educations.push({
      schoolName: degreeMatch?.[2]?.trim() || body,
      degree: degreeMatch?.[1]?.trim(),
      ...dateInfo,
    });
  }

  if (educations.length === 0) {
    const lines = section
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    for (const line of lines) {
      educations.push({ schoolName: line.replace(/\*+/g, "").trim() });
    }
  }

  if (educations.length === 0) return undefined;
  return { value: educations, confidence: "medium" };
}

export function parseResumeFromInspection(
  inspection: PdfInspectionResult,
): ParsedResumeProfile {
  const markdown = getCombinedMarkdown(inspection);
  const sections = extractSections(markdown);
  const headerAndContact = `${sections.get("_header") || ""}\n${markdown}`;

  const urls = extractUrls(headerAndContact);
  const socials = classifySocialUrls(urls);

  return {
    ...parseName(markdown),
    ...parseContactInfo(headerAndContact),
    ...socials,
    jobType: parseHeadlineJobType(markdown),
    summary: (() => {
      const summary = findSection(sections, SECTION_ALIASES.summary);
      return summary
        ? { value: summary.replace(/\*+/g, "").trim(), confidence: "medium" as const }
        : undefined;
    })(),
    skills: parseSkills(findSection(sections, SECTION_ALIASES.skills)),
    experiences: parseExperiences(findSection(sections, SECTION_ALIASES.experience)),
    educations: parseEducations(findSection(sections, SECTION_ALIASES.education)),
    projects: parseProjects(findSection(sections, SECTION_ALIASES.projects)),
  };
}

export type ResumeAutofillSummary = {
  filled: string[];
  skipped: string[];
};

export function summarizeParsedResume(parsed: ParsedResumeProfile): ResumeAutofillSummary {
  const filled: string[] = [];
  const skipped: string[] = [];

  const track = (label: string, field?: ParsedField<unknown>) => {
    if (field?.value !== undefined && field.value !== null) {
      if (Array.isArray(field.value) && field.value.length === 0) {
        skipped.push(label);
      } else if (typeof field.value === "string" && !field.value.trim()) {
        skipped.push(label);
      } else {
        filled.push(label);
      }
    } else {
      skipped.push(label);
    }
  };

  track("First name", parsed.firstName);
  track("Last name", parsed.lastName);
  track("Email", parsed.contactEmail);
  track("Phone", parsed.phoneNumber);
  track("LinkedIn", parsed.linkedin);
  track("GitHub", parsed.github);
  track("Portfolio", parsed.portfolio);
  track("Job type", parsed.jobType);
  track("Skills", parsed.skills);
  track("Experience", parsed.experiences);
  track("Education", parsed.educations);
  track("Projects", parsed.projects);

  return { filled, skipped };
}
