"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Folder,
  Star,
  ExternalLink,
  Github,
  LayoutGrid,
  List,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { ProjectCarousel } from "@/components/ProjectCarousel";
import { getPublicImageUrl } from "@/lib/utils";

export interface PublicProject {
  id: string;
  name: string;
  role: string | null;
  contribution: string | null;
  duration: string | null;
  activeLink: string | null;
  githubLink: string | null;
  logoUrl: string | null;
  screenshots: string[];
  stacks: string[] | string;
  description: string | null;
  isTopProject: boolean;
  createdAt?: Date | string;
}

interface PublicProjectsProps {
  projects: PublicProject[];
  membership?: string;
}

export function PublicProjects({ projects, membership = "FREE" }: PublicProjectsProps) {
  const [viewMode, setViewMode] = useState<"grid" | "detailed">("grid");
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [selectedProject, setSelectedProject] = useState<PublicProject | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const windowWidth = useWindowWidth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const isMobile = mounted && windowWidth < 768;

  const openProjectDetails = (project: PublicProject) => {
    // If a close animation cleanup was pending, cancel it
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    // Set project right before opening
    setSelectedProject(project);
    setIsOpen(true);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Keep selectedProject intact during exit animation (300ms)
      // so the modal never blanks out while closing.
      // Clear it after exit animation completes so content is clean before next open.
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
      closeTimerRef.current = setTimeout(() => {
        setSelectedProject(null);
        closeTimerRef.current = null;
      }, 350);
    }
  };

  // Normalize stacks array helper
  const getProjectStacks = (proj: PublicProject): string[] => {
    if (Array.isArray(proj.stacks)) {
      return proj.stacks.map((s) => s?.trim()).filter(Boolean);
    }
    if (typeof proj.stacks === "string" && proj.stacks.trim()) {
      return proj.stacks.split(",").map((s) => s?.trim()).filter(Boolean);
    }
    return [];
  };

  // Extract top tech stacks across all projects
  const topStacks = useMemo(() => {
    const counts = new Map<string, number>();
    projects.forEach((p) => {
      getProjectStacks(p).forEach((s) => {
        counts.set(s, (counts.get(s) || 0) + 1);
      });
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name]) => name);
  }, [projects]);

  const featuredCount = useMemo(
    () => projects.filter((p) => p.isTopProject).length,
    [projects]
  );

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Filter tab
      if (filter === "featured" && !project.isTopProject) return false;
      if (filter !== "all" && filter !== "featured") {
        const stacks = getProjectStacks(project).map((s) => s.toLowerCase());
        if (!stacks.includes(filter.toLowerCase())) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = project.name?.toLowerCase().includes(q);
        const roleMatch = project.role?.toLowerCase().includes(q);
        const contributionMatch = project.contribution?.toLowerCase().includes(q);
        const descMatch = project.description?.toLowerCase().includes(q);
        const stacksMatch = getProjectStacks(project).some((s) =>
          s.toLowerCase().includes(q)
        );
        if (!nameMatch && !roleMatch && !contributionMatch && !descMatch && !stacksMatch) {
          return false;
        }
      }

      return true;
    });
  }, [projects, filter, searchQuery]);

  // Initial display limit: 4 for grid, 3 for detailed
  const displayLimit = viewMode === "grid" ? 4 : 3;
  const isFiltering = filter !== "all" || searchQuery.trim().length > 0;
  const shouldTruncate = !isFiltering && !showAll && filteredProjects.length > displayLimit;
  const visibleProjects = shouldTruncate
    ? filteredProjects.slice(0, displayLimit)
    : filteredProjects;

  const maxScreenshots = membership === "PRO" ? 10 : 3;

  const renderProjectDetails = (
    HeaderComponent: typeof DialogHeader | typeof SheetHeader,
    TitleComponent: typeof DialogTitle | typeof SheetTitle,
    DescriptionComponent: typeof DialogDescription | typeof SheetDescription
  ) => {
    if (!selectedProject) return null;
    const logo = selectedProject.logoUrl
      ? getPublicImageUrl(selectedProject.logoUrl)
      : null;
    const projectStacks = getProjectStacks(selectedProject);
    const hasDetails = Boolean(
      selectedProject.role ||
      selectedProject.contribution ||
      selectedProject.duration
    );

    return (
      <div className="space-y-6 text-left">
        {/* Modal / Drawer Header */}
        <HeaderComponent className="space-y-3 text-left">
          <div className={`flex gap-3.5 ${hasDetails ? "items-start" : "items-center"}`}>
            {logo ? (
              <div className="size-14 shrink-0 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-1.5 shadow-2xs overflow-hidden flex items-center justify-center">
                <img
                  src={logo}
                  alt={selectedProject.name}
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
            ) : (
              <div className="size-14 shrink-0 rounded-xl border border-orange-500/20 bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center shadow-2xs">
                <Folder className="size-6" />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <TitleComponent className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white leading-tight">
                  {selectedProject.name}
                </TitleComponent>
                {selectedProject.isTopProject && (
                  <span className="inline-flex items-center gap-1 bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-medium px-2.5 py-0.5 rounded-full border border-orange-500/20 select-none">
                    <Star className="size-3 fill-current" />
                    Featured
                  </span>
                )}
              </div>

              {hasDetails && (
                <DescriptionComponent className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  {[
                    selectedProject.role,
                    selectedProject.contribution,
                    selectedProject.duration ? `(${selectedProject.duration})` : null,
                  ]
                    .filter(Boolean)
                    .join(" • ")}
                </DescriptionComponent>
              )}
            </div>
          </div>

          {/* Action Links */}
          {(selectedProject.activeLink || selectedProject.githubLink) && (
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              {selectedProject.activeLink && (
                <Button asChild size="sm" className="text-xs gap-1.5">
                  <a
                    href={selectedProject.activeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="size-3.5" />
                    Live Demo
                  </a>
                </Button>
              )}
              {selectedProject.githubLink && (
                <Button asChild variant="outline" size="sm" className="text-xs gap-1.5">
                  <a
                    href={selectedProject.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="size-3.5" />
                    Source Code
                  </a>
                </Button>
              )}
            </div>
          )}
        </HeaderComponent>

        {/* Screenshot Carousel */}
        {selectedProject.screenshots && selectedProject.screenshots.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Project Gallery ({selectedProject.screenshots.length} media):
            </p>
            <ProjectCarousel
              screenshots={selectedProject.screenshots
                .slice(0, maxScreenshots)
                .map((url) => getPublicImageUrl(url))}
            />
          </div>
        )}

        {/* Description */}
        {selectedProject.description && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider font-mono">
              Overview
            </h4>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
              {selectedProject.description}
            </p>
          </div>
        )}

        {/* Stacks */}
        {projectStacks.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider font-mono">
              Technologies &amp; Stacks
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {projectStacks.map((stack, idx) => (
                <span
                  key={`${stack}-${idx}`}
                  className="text-xs font-medium rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 px-2.5 py-1"
                >
                  #{stack}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-5 sm:p-6 md:p-8 shadow-xs">
      {/* Header with Title & Controls */}
      <div className="flex flex-col gap-4 pb-5 mb-6 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
              <Folder className="size-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight">
                Projects &amp; Creations
              </h2>
            </div>
            <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
              {projects.length}
            </span>
          </div>

          {/* View Mode Toggle */}
          <div className="inline-flex items-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-800/80 p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                viewMode === "grid"
                  ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
              title="Compact Grid View"
            >
              <LayoutGrid className="size-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("detailed")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                viewMode === "detailed"
                  ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
              title="Detailed Timeline View"
            >
              <List className="size-3.5" />
              <span className="hidden sm:inline">Detailed</span>
            </button>
          </div>
        </div>

        {/* Filter Pills & Instant Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                filter === "all"
                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-2xs"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              All ({projects.length})
            </button>

            {featuredCount > 0 && (
              <button
                type="button"
                onClick={() => setFilter("featured")}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  filter === "featured"
                    ? "bg-orange-600 dark:bg-orange-500 text-white shadow-2xs"
                    : "bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-500/20 hover:bg-orange-500/15"
                }`}
              >
                <Star className="size-3 fill-current" />
                Featured ({featuredCount})
              </button>
            )}

            {topStacks.map((stack) => (
              <button
                key={stack}
                type="button"
                onClick={() => setFilter(filter === stack ? "all" : stack)}
                className={`hidden md:inline-flex px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  filter === stack
                    ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
              >
                #{stack}
              </button>
            ))}
          </div>

          {/* Search bar when user has multiple projects */}
          {projects.length >= 3 && (
            <div className="relative min-w-[180px] sm:w-56 shrink-0">
              <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 pl-8 pr-7 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Empty State */}
      {visibleProjects.length === 0 && (
        <div className="rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 p-8 text-center space-y-2">
          <Folder className="size-8 mx-auto text-zinc-400" />
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            No projects found
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
            {searchQuery
              ? `No projects matched "${searchQuery}". Try a different search keyword.`
              : "No projects match the selected filter."}
          </p>
          {isFiltering && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFilter("all");
                setSearchQuery("");
              }}
              className="mt-2 text-xs"
            >
              Reset Filters
            </Button>
          )}
        </div>
      )}

      {/* GRID & DETAILED VIEWS with Smooth Mode-Wait Transition to Eliminate Flicker */}
      <AnimatePresence mode="wait" initial={false}>
        {viewMode === "grid" && visibleProjects.length > 0 && (
          <motion.div
            key="projects-grid-view"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5"
          >
            {visibleProjects.map((project) => {
              const stacks = getProjectStacks(project);
              const activeScreenshots = (project.screenshots || [])
                .slice(0, maxScreenshots)
                .map((url) => getPublicImageUrl(url));
              const hasMedia = activeScreenshots.length > 0;
              const logo = project.logoUrl ? getPublicImageUrl(project.logoUrl) : null;
              const hasSubtitle = Boolean(project.role || project.contribution);

              return (
                <div
                  key={`grid-${project.id}`}
                  className="group relative flex flex-col justify-between rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/40 hover:bg-white dark:hover:bg-zinc-900/80 hover:border-zinc-300 dark:hover:border-zinc-700 p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-all duration-200"
                >
                  <div className="space-y-3">
                    {/* Top Row: Logo + Titles + Featured Badge */}
                    <div className={`flex gap-3.5 min-w-0 ${hasSubtitle ? "items-start" : "items-center"}`}>
                      {/* Project Logo */}
                      {logo ? (
                        <div className="size-11 sm:size-12 shrink-0 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-1 shadow-2xs overflow-hidden flex items-center justify-center">
                          <img
                            src={logo}
                            alt={`${project.name} logo`}
                            className="w-full h-full object-contain rounded-lg"
                          />
                        </div>
                      ) : (
                        <div className="size-11 sm:size-12 shrink-0 rounded-xl border border-orange-500/20 bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center shadow-2xs">
                          <Folder className="size-5" />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100 leading-tight truncate">
                            {project.name}
                          </h3>
                          {project.isTopProject && (
                            <span className="inline-flex items-center gap-1 bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-medium px-2 py-0.5 rounded-full border border-orange-500/20 select-none shrink-0">
                              <Star className="size-2.5 fill-current" />
                              Featured
                            </span>
                          )}
                        </div>

                        {project.role && (
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                            {project.role}
                            {project.contribution && ` • ${project.contribution}`}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Description preview */}
                    {project.description && (
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-2">
                        {project.description}
                      </p>
                    )}

                    {/* Compact Screenshot Preview Strip if media exists */}
                    {hasMedia && (
                      <div
                        onClick={() => openProjectDetails(project)}
                        className="relative aspect-video w-full rounded-lg border border-zinc-200/80 dark:border-zinc-800 overflow-hidden bg-zinc-950/5 dark:bg-black/30 group/thumb cursor-pointer shadow-2xs"
                      >
                        <img
                          src={activeScreenshots[0]}
                          alt={`${project.name} thumbnail`}
                          className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 text-white text-[11px] font-medium backdrop-blur-xs">
                            <Maximize2 className="size-3" />
                            View Gallery ({activeScreenshots.length})
                          </span>
                        </div>
                        {activeScreenshots.length > 1 && (
                          <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-xs text-white px-2 py-0.5 rounded-md font-mono text-[10px] font-medium border border-white/10">
                            +{activeScreenshots.length - 1} more
                          </div>
                        )}
                      </div>
                    )}

                    {/* Stacks tags (compact) */}
                    {stacks.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {stacks.slice(0, 4).map((stack, idx) => (
                          <span
                            key={`${stack}-${idx}`}
                            className="text-[10px] font-medium rounded-md bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/80 text-zinc-700 dark:text-zinc-300 px-1.5 py-0.5"
                          >
                            #{stack}
                          </span>
                        ))}
                        {stacks.length > 4 && (
                          <span className="text-[10px] font-medium text-zinc-400 self-center">
                            +{stacks.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Footer action bar */}
                  <div className="flex items-center justify-between gap-2 pt-3 mt-3 border-t border-zinc-200/60 dark:border-zinc-800/80">
                    <div className="flex items-center gap-3">
                      {project.activeLink && (
                        <a
                          href={project.activeLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-orange-600 dark:text-orange-400 hover:underline"
                        >
                          <ExternalLink className="size-3" />
                          Live Demo
                        </a>
                      )}
                      {project.githubLink && (
                        <a
                          href={project.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                        >
                          <Github className="size-3" />
                          Code
                        </a>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => openProjectDetails(project)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-orange-600 dark:text-zinc-400 dark:hover:text-orange-400 transition-colors cursor-pointer"
                    >
                      Details
                    </button>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {viewMode === "detailed" && visibleProjects.length > 0 && (
          <motion.div
            key="projects-detailed-view"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="grid gap-6"
          >
            {visibleProjects.map((project) => {
              const stacks = getProjectStacks(project);
              const activeScreenshots = (project.screenshots || [])
                .slice(0, maxScreenshots)
                .map((url) => getPublicImageUrl(url));
              const logo = project.logoUrl ? getPublicImageUrl(project.logoUrl) : null;
              const hasSubtitle = Boolean(project.role || project.contribution || project.duration);

              return (
                <div
                  key={`detailed-${project.id}`}
                  className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/40 p-5 md:p-6 shadow-2xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                >
                  {/* Header with Logo */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className={`flex gap-3.5 min-w-0 ${hasSubtitle ? "items-start" : "items-center"}`}>
                      {logo ? (
                        <div className="size-12 sm:size-14 shrink-0 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-1.5 shadow-2xs overflow-hidden flex items-center justify-center">
                          <img
                            src={logo}
                            alt={`${project.name} logo`}
                            className="w-full h-full object-contain rounded-lg"
                          />
                        </div>
                      ) : (
                        <div className="size-12 sm:size-14 shrink-0 rounded-xl border border-orange-500/20 bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center shadow-2xs">
                          <Folder className="size-6" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
                          {project.name}
                        </h3>
                        {project.role && (
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                            {project.role}
                            {project.contribution && ` • ${project.contribution}`}
                            {project.duration && ` (${project.duration})`}
                          </p>
                        )}
                      </div>
                    </div>

                    {project.isTopProject && (
                      <span className="inline-flex items-center gap-1 bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-orange-500/20 select-none shrink-0">
                        <Star className="size-3 fill-current" />
                        Featured
                      </span>
                    )}
                  </div>

                  {project.description && (
                    <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3 whitespace-pre-line">
                      {project.description}
                    </p>
                  )}

                  {/* Stacks tags */}
                  {stacks.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {stacks.map((stack, idx) => (
                        <span
                          key={`${stack}-${idx}`}
                          className="text-[11px] font-medium rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 px-2 py-0.5"
                        >
                          #{stack}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Screenshots Carousel/Grid */}
                  {activeScreenshots.length > 0 && (
                    <div className="space-y-2 mt-4 pt-1">
                      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                        <ImageIcon className="size-3.5 text-orange-500" />
                        Media &amp; Screenshots:
                      </p>
                      {activeScreenshots.length >= 3 ? (
                        <ProjectCarousel screenshots={activeScreenshots} />
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {activeScreenshots.map((url, idx) => (
                            <a
                              key={idx}
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="relative aspect-video rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 overflow-hidden group shadow-2xs"
                            >
                              <img
                                src={url}
                                alt={`${project.name} screenshot ${idx + 1}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Project Actions */}
                  <div className="flex items-center justify-between gap-4 pt-4 border-t border-zinc-200/80 dark:border-zinc-800 mt-4">
                    <div className="flex items-center gap-4">
                      {project.activeLink && (
                        <a
                          href={project.activeLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-orange-600 dark:text-orange-400 hover:underline"
                        >
                          <ExternalLink className="size-3.5" />
                          Live Demo
                        </a>
                      )}
                      {project.githubLink && (
                        <a
                          href={project.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
                        >
                          <Github className="size-3.5" />
                          Source Code
                        </a>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => openProjectDetails(project)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-orange-600 dark:text-zinc-400 dark:hover:text-orange-400 transition-colors cursor-pointer"
                    >
                      Details
                    </button>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progressive Disclosure / View More Button */}
      {!isFiltering && filteredProjects.length > displayLimit && (
        <div className="mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800 flex justify-center">
          <Button
            variant="outline"
            size="default"
            onClick={() => setShowAll((prev) => !prev)}
            className="text-xs font-medium gap-2 cursor-pointer shadow-2xs hover:border-orange-500/40"
          >
            {showAll ? (
              <>
                <ChevronUp className="size-4" />
                <span>Show Fewer Projects</span>
              </>
            ) : (
              <>
                <ChevronDown className="size-4" />
                <span>
                  Show All {filteredProjects.length} Projects ({filteredProjects.length - displayLimit} more)
                </span>
              </>
            )}
          </Button>
        </div>
      )}

      {/* Project Case Study / Screenshot Modal (Desktop Modal & Mobile Drawer) */}
      {isMobile ? (
        <Sheet
          open={isOpen}
          onOpenChange={handleOpenChange}
        >
          <SheetContent className="max-h-[88dvh] overflow-y-auto p-5 sm:p-6 rounded-t-3xl border-t border-zinc-200 dark:border-zinc-800">
            <div className="w-10 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full mx-auto mb-4 shrink-0" />
            {renderProjectDetails(SheetHeader, SheetTitle, SheetDescription)}
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog
          open={isOpen}
          onOpenChange={handleOpenChange}
        >
          <DialogContent className="max-w-2xl sm:max-w-3xl max-h-[90vh] overflow-y-auto p-6 md:p-8 rounded-2xl border-zinc-200 dark:border-zinc-800">
            {renderProjectDetails(DialogHeader, DialogTitle, DialogDescription)}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
