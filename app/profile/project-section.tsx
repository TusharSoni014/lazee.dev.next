"use client";

import { useState, useEffect, useRef } from "react";
import {
  updateProjects,
  uploadProjectScreenshot,
  uploadProjectLogo,
  deleteProjectFile,
} from "./actions";
import { toast } from "@/components/ui/toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  FolderGit2,
  Edit2,
  Trash2,
  Plus,
  Check,
  X,
  Loader2,
  ExternalLink,
  Github,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  Upload,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import clsx from "clsx";
import { getPublicImageUrl } from "@/lib/utils";
import { useWindowWidth } from "@/hooks/useWindowWidth";

const projectSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Project name is required"),
  role: z.string().optional(),
  contribution: z.string().optional(),
  duration: z.string().optional(),
  activeLink: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  githubLink: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  logoUrl: z.string().optional().or(z.literal("")),
  stacks: z.string().optional(), // We'll parse this as comma-separated
  description: z.string().optional(),
  isTopProject: z.boolean().optional(),
  screenshots: z.array(z.string()).optional(),
});

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-6 md:p-8 shadow-xs transition-colors">
      <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex size-11 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 shrink-0">
          <Icon className="size-5" />
        </div>
        <h2 className="text-xl font-heading font-semibold text-zinc-900 dark:text-white tracking-tight">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

export function ProjectSection({ projects, setProjects, membership }: any) {
  const width = useWindowWidth();
  const isMobile = width < 768;

  const Modal = isMobile ? Sheet : Dialog;
  const ModalContent = isMobile ? SheetContent : DialogContent;
  const ModalTitle = isMobile ? SheetTitle : DialogTitle;
  const ModalDescription = isMobile ? SheetDescription : DialogDescription;

  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempProj, setTempProj] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<any>(null);

  const addProject = () => {
    const newProj = {
      id: crypto.randomUUID(),
      name: "",
      role: "",
      contribution: "",
      duration: "",
      activeLink: "",
      githubLink: "",
      logoUrl: "",
      screenshots: [],
      stacks: "",
      description: "",
      isTopProject: false,
    };
    setTempProj(newProj);
    setEditingId(newProj.id);
  };

  const removeProject = async (id: string) => {
    setDeletingId(id);
    try {
      const projectToDelete = projects.find((proj: any) => proj.id === id);
      const newProjects = projects.filter((proj: any) => proj.id !== id);
      const result = await updateProjects(newProjects);

      if (result.success) {
        setProjects(newProjects);
        if (editingId === id) cancelEdit();
        toast.success("Project removed successfully");

        if (projectToDelete) {
          const filesToDelete = [
            projectToDelete.logoUrl,
            ...(projectToDelete.screenshots || []),
          ].filter(Boolean);

          for (const fileUrl of filesToDelete) {
            try {
              await deleteProjectFile(fileUrl);
            } catch (err) {
              console.error(
                "Failed to delete project file from R2 on project deletion:",
                err,
              );
            }
          }
        }
      } else {
        toast.error(result.error || "Failed to remove project");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to remove project");
    } finally {
      setDeletingId(null);
    }
  };

  const confirmProject = async (data: any) => {
    setIsSaving(true);
    let newProjects;

    // Parse stacks as array
    const stacksParsed = Array.isArray(data.stacks)
      ? data.stacks
      : typeof data.stacks === "string" && data.stacks
        ? data.stacks
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [];

    const projectData = {
      ...data,
      stacks: stacksParsed,
    };

    const exists = projects.find((p: any) => p.id === projectData.id);
    if (exists) {
      newProjects = projects.map((p: any) =>
        p.id === projectData.id ? projectData : p,
      );
    } else {
      newProjects = [projectData, ...projects];
    }

    // Ensure only one top project
    if (projectData.isTopProject) {
      newProjects = newProjects.map((p: any) => ({
        ...p,
        isTopProject: p.id === projectData.id,
      }));
    }

    try {
      const result = await updateProjects(newProjects);
      setIsSaving(false);

      if (result.success) {
        setProjects(newProjects);
        setEditingId(null);
        toast.success("Project saved successfully");
        return { success: true };
      } else {
        toast.error(result.error || "Failed to save project");
        return {
          success: false,
          error: result.error || "Failed to save project",
        };
      }
    } catch (err: any) {
      setIsSaving(false);
      toast.error(err?.message || "Failed to save project");
      return {
        success: false,
        error: err?.message || "Failed to save project",
      };
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const editProject = (proj: any) => {
    setTempProj({
      ...proj,
      stacks: Array.isArray(proj.stacks)
        ? proj.stacks.join(", ")
        : proj.stacks || "",
    });
    setEditingId(proj.id);
  };

  return (
    <Section title="Projects" icon={FolderGit2}>
      <div className="space-y-8">
        {projects.map((proj: any, index: number) => {
          return (
            <div
              key={proj.id || index}
              className={clsx(
                "group relative rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 p-5 sm:p-6 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col gap-4 min-w-0",
                deletingId === proj.id && "opacity-60 pointer-events-none",
              )}
            >
              {deletingId === proj.id && (
                <div className="absolute inset-0 bg-white/70 dark:bg-zinc-900/70 rounded-xl flex flex-col items-center justify-center gap-2 z-20">
                  <Loader2 className="size-6 animate-spin text-orange-600 dark:text-orange-400" />
                  <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    Deleting Project...
                  </span>
                </div>
              )}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 min-w-0">
                <div className="flex items-start gap-4 flex-1 md:pr-24 min-w-0">
                  {proj.logoUrl && (
                    <div className="size-14 shrink-0 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900 shadow-xs">
                      <img
                        src={getPublicImageUrl(proj.logoUrl)}
                        alt={proj.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-heading font-semibold text-zinc-900 dark:text-white flex flex-wrap items-center gap-2 break-words">
                      <span className="truncate max-w-[200px] sm:max-w-none">
                        {proj.name || "Untitled Project"}
                      </span>
                      {proj.isTopProject && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-orange-500/10 text-orange-700 dark:text-orange-400 px-2 py-0.5 rounded-full border border-orange-500/20">
                          Top Pick
                        </span>
                      )}
                    </h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 mt-1.5">
                      {proj.activeLink && (
                        <a
                          href={proj.activeLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-xs font-medium text-orange-600 dark:text-orange-400 hover:underline"
                        >
                          <ExternalLink className="size-3" /> Live Demo
                        </a>
                      )}
                      {proj.githubLink && (
                        <a
                          href={proj.githubLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                        >
                          <Github className="size-3" /> Codebase
                        </a>
                      )}
                    </div>
                    {proj.contribution && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 italic break-words">
                        &quot;{proj.contribution}&quot;
                      </p>
                    )}
                  </div>
                </div>

                <div
                  className={clsx(
                    "flex gap-1.5 shrink-0 self-end md:self-start transition-opacity z-10",
                    "md:absolute md:right-4 md:top-4",
                    deletingId === proj.id
                      ? "opacity-100"
                      : "md:opacity-0 md:group-hover:opacity-100",
                  )}
                >
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!!deletingId || isSaving}
                    onClick={() => editProject(proj)}
                    className="h-8 w-8 p-0 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                    title="Edit Project"
                  >
                    <Edit2 className="size-3.5" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    disabled={!!deletingId || isSaving}
                    onClick={() => setProjectToDelete(proj)}
                    className="h-8 w-8 p-0 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                    title="Remove Project"
                  >
                    {deletingId === proj.id ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="size-3.5" />
                    )}
                  </Button>
                </div>
              </div>

              {proj.stacks && (
                <div className="flex flex-wrap gap-1.5">
                  {(Array.isArray(proj.stacks)
                    ? proj.stacks
                    : typeof proj.stacks === "string"
                      ? proj.stacks
                          .split(",")
                          .map((s: string) => s.trim())
                          .filter(Boolean)
                      : []
                  ).map((stack: string, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 text-xs font-mono text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded-md border border-zinc-200/60 dark:border-zinc-700/60"
                    >
                      {stack}
                    </span>
                  ))}
                </div>
              )}

              {proj.description && (
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 whitespace-pre-wrap font-sans break-words leading-relaxed">
                  {proj.description}
                </p>
              )}

              {proj.screenshots && proj.screenshots.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  <p className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    Screenshots:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                    {proj.screenshots.map((url: string, idx: number) => {
                      const isActive = idx < (membership === "PRO" ? 10 : 3);
                      return (
                        <a
                          key={idx}
                          href={getPublicImageUrl(url)}
                          target="_blank"
                          rel="noreferrer"
                          className={clsx(
                            "relative aspect-video rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden group hover:border-zinc-300 dark:hover:border-zinc-600 transition-all bg-zinc-100 dark:bg-zinc-900",
                            !isActive && "opacity-55 grayscale",
                          )}
                        >
                          <img
                            src={getPublicImageUrl(url)}
                            alt={`${proj.name} screenshot ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {!isActive && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-1 text-center">
                              <span className="text-[9px] font-medium text-white bg-red-600/90 px-1.5 py-0.5 rounded">
                                Hidden (Free Plan)
                              </span>
                            </div>
                          )}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <Button
          type="button"
          onClick={addProject}
          className="w-full h-11 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-orange-500/50 dark:hover:border-orange-500/50 bg-zinc-50/50 dark:bg-zinc-900/30 hover:bg-orange-50/50 dark:hover:bg-orange-950/20 text-zinc-600 dark:text-zinc-400 hover:text-orange-600 dark:hover:text-orange-400 text-xs font-medium transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </Button>

        <Modal
          open={Boolean(editingId && tempProj)}
          onOpenChange={(open) => {
            if (!open && !isSaving) cancelEdit();
          }}
        >
          <ModalContent
            className={
              isMobile
                ? "p-0 max-h-[92dvh] flex flex-col rounded-t-3xl border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"
                : "sm:max-w-2xl max-h-[85dvh] p-0 sm:p-0 gap-0 flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-2xl"
            }
          >
            <div className="px-4 py-3 sm:py-3.5 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
              <ModalTitle className="text-lg font-heading font-semibold text-zinc-900 dark:text-white tracking-tight">
                {tempProj?.name ? `Edit Project` : "Add Project"}
              </ModalTitle>
              <ModalDescription className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                {tempProj?.name
                  ? `Update project details for ${tempProj.name}`
                  : "Showcase your work, tech stack, screenshots, and live demo."}
              </ModalDescription>
            </div>

            {tempProj && (
              <ProjectForm
                key={tempProj.id}
                proj={tempProj}
                onConfirm={confirmProject}
                onCancel={cancelEdit}
                isLoading={isSaving}
                membership={membership}
              />
            )}
          </ModalContent>
        </Modal>

        <Modal
          open={Boolean(projectToDelete)}
          onOpenChange={(open) => {
            if (!open && !deletingId) setProjectToDelete(null);
          }}
        >
          <ModalContent
            className={
              isMobile
                ? "p-6 flex flex-col rounded-t-3xl border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                : "sm:max-w-md p-6 flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl"
            }
          >
            <ModalTitle className="text-lg font-heading font-semibold text-zinc-900 dark:text-white tracking-tight">
              Delete Project
            </ModalTitle>
            <ModalDescription className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              Are you sure you want to delete &quot;{projectToDelete?.name}&quot;? This action cannot be undone.
            </ModalDescription>
            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setProjectToDelete(null)}
                disabled={!!deletingId}
                className="w-full sm:w-auto border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  if (projectToDelete) {
                    await removeProject(projectToDelete.id);
                    setProjectToDelete(null);
                  }
                }}
                disabled={!!deletingId}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
              >
                {deletingId ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Project"
                )}
              </Button>
            </div>
          </ModalContent>
        </Modal>
      </div>
    </Section>
  );
}

interface LocalScreenshot {
  id: string;
  type: "existing" | "pending";
  url?: string;
  file?: File;
  previewUrl: string;
}

interface LocalLogo {
  type: "existing" | "pending";
  url?: string;
  file?: File;
  previewUrl: string;
}

interface SaveProgress {
  isOpen: boolean;
  status:
    | "idle"
    | "uploading_logo"
    | "uploading_screenshots"
    | "saving_db"
    | "success"
    | "error";
  currentUploadIndex: number;
  totalUploads: number;
  errorMessage?: string;
}

const AVAILABLE_TECH_STACKS = [
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Python",
  "Node.js",
  "Tailwind CSS",
  "PostgreSQL",
  "MongoDB",
  "Docker",
  "AWS",
  "Git",
  "Go",
  "Rust",
  "Vue.js",
  "Angular",
  "Svelte",
  "FastAPI",
  "Django",
  "Flask",
  "Express",
  "NestJS",
  "GraphQL",
  "Redis",
  "MySQL",
  "SQLite",
  "Kubernetes",
  "CI/CD",
  "Firebase",
  "Supabase",
  "Prisma",
  "Drizzle",
  "HTML",
  "CSS",
  "Java",
  "Spring Boot",
  "C++",
  "C#",
  ".NET",
  "Ruby on Rails",
  "PHP",
  "Laravel",
];

function ProjectForm({
  proj,
  onConfirm,
  onCancel,
  isLoading,
  membership,
}: any) {
  const width = useWindowWidth();
  const isMobile = width < 768;
  const [localLogo, setLocalLogo] = useState<LocalLogo | null>(() => {
    if (proj.logoUrl) {
      return { type: "existing", url: proj.logoUrl, previewUrl: proj.logoUrl };
    }
    return null;
  });

  const [localScreenshots, setLocalScreenshots] = useState<LocalScreenshot[]>(
    () => {
      return (proj.screenshots || []).map((url: string) => ({
        id: crypto.randomUUID(),
        type: "existing",
        url,
        previewUrl: url,
      }));
    },
  );

  const [removedLogoUrl, setRemovedLogoUrl] = useState<string | null>(null);
  const [removedScreenshotUrls, setRemovedScreenshotUrls] = useState<string[]>(
    [],
  );

  const [saveProgress, setSaveProgress] = useState<SaveProgress>({
    isOpen: false,
    status: "idle",
    currentUploadIndex: 0,
    totalUploads: 0,
  });

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      id: proj.id,
      name: proj.name || "",
      role: proj.role || "",
      contribution: proj.contribution || "",
      duration: proj.duration || "",
      activeLink: proj.activeLink || "",
      githubLink: proj.githubLink || "",
      logoUrl: proj.logoUrl || "",
      stacks: Array.isArray(proj.stacks)
        ? proj.stacks.join(", ")
        : proj.stacks || "",
      description: proj.description || "",
      isTopProject: proj.isTopProject || false,
      screenshots: proj.screenshots || [],
    },
  });

  const [stackInput, setStackInput] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentStacksVal = form.watch("stacks");
  const selectedStacks = Array.isArray(currentStacksVal)
    ? currentStacksVal
    : typeof currentStacksVal === "string" && currentStacksVal
      ? currentStacksVal
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean)
      : [];

  const addStack = (stack: string) => {
    const trimmed = stack.trim();
    if (!trimmed) return;
    const exists = selectedStacks.some(
      (s) => s.toLowerCase() === trimmed.toLowerCase(),
    );
    if (exists) {
      setStackInput("");
      setIsDropdownOpen(false);
      return;
    }
    const newStacks = [...selectedStacks, trimmed];
    form.setValue("stacks", newStacks.join(", "), { shouldDirty: true });
    setStackInput("");
    setIsDropdownOpen(false);
  };

  const removeStack = (stackToRemove: string) => {
    const newStacks = selectedStacks.filter((s: string) => s !== stackToRemove);
    form.setValue("stacks", newStacks.join(", "), { shouldDirty: true });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredSuggestions = AVAILABLE_TECH_STACKS.filter((tech) => {
    const matchesSearch = tech.toLowerCase().includes(stackInput.toLowerCase());
    const isAlreadySelected = selectedStacks.some(
      (s) => s.toLowerCase() === tech.toLowerCase(),
    );
    return matchesSearch && !isAlreadySelected;
  });

  const showAddCustom =
    stackInput.trim() &&
    !AVAILABLE_TECH_STACKS.some(
      (t) => t.toLowerCase() === stackInput.trim().toLowerCase(),
    ) &&
    !selectedStacks.some(
      (s) => s.toLowerCase() === stackInput.trim().toLowerCase(),
    );

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (stackInput.trim()) {
        addStack(stackInput);
      }
    }
  };

  const screenshots = form.watch("screenshots") || [];
  const logoUrl = form.watch("logoUrl") || "";

  // Keep refs of current pending URLs so the unmount cleanup can access them without triggers
  const pendingUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    const urls: string[] = [];
    localScreenshots.forEach((s) => {
      if (s.type === "pending" && s.previewUrl.startsWith("blob:")) {
        urls.push(s.previewUrl);
      }
    });
    if (
      localLogo &&
      localLogo.type === "pending" &&
      localLogo.previewUrl.startsWith("blob:")
    ) {
      urls.push(localLogo.previewUrl);
    }
    pendingUrlsRef.current = urls;
  }, [localScreenshots, localLogo]);

  useEffect(() => {
    return () => {
      // Clean up all pending URLs when form unmounts
      pendingUrlsRef.current.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch (e) {
          console.error(e);
        }
      });
    };
  }, []);

  const isPendingSave = saveProgress.isOpen && saveProgress.status !== "error";

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Logo must be an image file.");
      e.target.value = "";
      return;
    }

    if (file.size > 1 * 1024 * 1024) {
      toast.error("Logo file size must be at most 1MB.");
      e.target.value = "";
      return;
    }

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      if (img.width > 512 || img.height > 512) {
        toast.error(
          `Logo dimensions must be at most 512x512 pixels (selected: ${img.width}x${img.height}).`,
        );
        URL.revokeObjectURL(img.src);
        e.target.value = "";
        return;
      }

      // Check if we already have a pending local logo to revoke
      if (
        localLogo &&
        localLogo.type === "pending" &&
        localLogo.previewUrl.startsWith("blob:")
      ) {
        URL.revokeObjectURL(localLogo.previewUrl);
      }

      // Track if we had an existing logo that's being replaced
      if (localLogo && localLogo.type === "existing" && localLogo.url) {
        setRemovedLogoUrl(localLogo.url);
      }

      setLocalLogo({
        type: "pending",
        file,
        previewUrl: img.src,
      });
      form.setValue("logoUrl", img.src, { shouldDirty: true });
      toast.success("Logo loaded successfully (pending save)!");
    };
    img.onerror = () => {
      toast.error("Failed to load image file.");
      e.target.value = "";
    };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const maxAllowed = membership === "PRO" ? 10 : 3;
    const currentCount = localScreenshots.length;
    const remainingSlots = maxAllowed - currentCount;

    if (remainingSlots <= 0) {
      toast.error(
        `You have already reached the limit of ${maxAllowed} screenshots.`,
      );
      e.target.value = "";
      return;
    }

    let filesToAdd = files;
    if (files.length > remainingSlots) {
      toast.info(
        `You can only add ${remainingSlots} more screenshot(s). Only the first ${remainingSlots} will be added.`,
      );
      filesToAdd = files.slice(0, remainingSlots);
    }

    const newScreenshots: LocalScreenshot[] = [];
    for (const file of filesToAdd) {
      if (!file.type.startsWith("image/")) {
        toast.error(`"${file.name}" is not an image file.`);
        continue;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error(`"${file.name}" exceeds the 2MB size limit.`);
        continue;
      }

      const previewUrl = URL.createObjectURL(file);
      newScreenshots.push({
        id: crypto.randomUUID(),
        type: "pending",
        file,
        previewUrl,
      });
    }

    if (newScreenshots.length === 0) {
      e.target.value = "";
      return;
    }

    const updated = [...localScreenshots, ...newScreenshots];
    setLocalScreenshots(updated);
    form.setValue(
      "screenshots",
      updated.map((s) => s.previewUrl),
      {
        shouldDirty: true,
      },
    );
    toast.success(
      `Successfully loaded ${newScreenshots.length} screenshot(s) (pending save)!`,
    );
    e.target.value = "";
  };

  const moveScreenshot = (index: number, direction: "up" | "down") => {
    const newScreenshots = [...localScreenshots];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newScreenshots.length) {
      const temp = newScreenshots[index];
      newScreenshots[index] = newScreenshots[targetIndex];
      newScreenshots[targetIndex] = temp;
      setLocalScreenshots(newScreenshots);
      form.setValue(
        "screenshots",
        newScreenshots.map((s) => s.previewUrl),
        { shouldDirty: true },
      );
    }
  };

  const deleteScreenshot = (index: number) => {
    const item = localScreenshots[index];
    if (item.type === "existing" && item.url) {
      setRemovedScreenshotUrls((prev) => [...prev, item.url!]);
    } else if (item.type === "pending" && item.previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(item.previewUrl);
    }

    const updated = localScreenshots.filter((_, i) => i !== index);
    setLocalScreenshots(updated);
    form.setValue(
      "screenshots",
      updated.map((s) => s.previewUrl),
      { shouldDirty: true },
    );
  };

  const handleSaveProject = async (values: z.infer<typeof projectSchema>) => {
    setSaveProgress({
      isOpen: true,
      status: "uploading_logo",
      currentUploadIndex: 0,
      totalUploads: 0,
    });

    let uploadedLogoUrl =
      localLogo && localLogo.type === "existing" ? localLogo.url || "" : "";

    // 1. Upload Logo if pending
    if (localLogo && localLogo.type === "pending" && localLogo.file) {
      try {
        const formData = new FormData();
        formData.append("file", localLogo.file);
        const result = await uploadProjectLogo(formData);
        if (result.success && result.url) {
          uploadedLogoUrl = result.url;
        } else {
          throw new Error(result.error || "Failed to upload logo");
        }
      } catch (err: any) {
        setSaveProgress({
          isOpen: true,
          status: "error",
          currentUploadIndex: 0,
          totalUploads: 0,
          errorMessage: `Logo Upload failed: ${err.message || "Unknown error"}`,
        });
        return;
      }
    }

    // 2. Upload Screenshots if pending
    const pendingScreenshots = localScreenshots.filter(
      (s) => s.type === "pending" && s.file,
    );
    const totalToUpload = pendingScreenshots.length;

    setSaveProgress((prev) => ({
      ...prev,
      status: "uploading_screenshots",
      currentUploadIndex: 0,
      totalUploads: totalToUpload,
    }));

    const finalScreenshotUrls: string[] = [];
    let currentUploadedCount = 0;

    for (let i = 0; i < localScreenshots.length; i++) {
      const item = localScreenshots[i];
      if (item.type === "existing" && item.url) {
        finalScreenshotUrls.push(item.url);
      } else if (item.type === "pending" && item.file) {
        currentUploadedCount++;
        setSaveProgress((prev) => ({
          ...prev,
          currentUploadIndex: currentUploadedCount,
        }));

        try {
          const formData = new FormData();
          formData.append("file", item.file);
          const result = await uploadProjectScreenshot(formData);
          if (result.success && result.url) {
            finalScreenshotUrls.push(result.url);
          } else {
            throw new Error(
              result.error ||
                `Failed to upload screenshot #${currentUploadedCount}`,
            );
          }
        } catch (err: any) {
          setSaveProgress({
            isOpen: true,
            status: "error",
            currentUploadIndex: currentUploadedCount,
            totalUploads: totalToUpload,
            errorMessage: `Screenshot Upload failed: ${err.message || "Unknown error"}`,
          });
          return;
        }
      }
    }

    // 3. Save to Database
    setSaveProgress((prev) => ({
      ...prev,
      status: "saving_db",
    }));

    try {
      const finalData = {
        ...values,
        logoUrl: uploadedLogoUrl,
        screenshots: finalScreenshotUrls,
      };

      const result = await onConfirm(finalData);
      if (result && result.success) {
        setSaveProgress((prev) => ({
          ...prev,
          status: "success",
        }));

        // Clean up local blob URLs
        localScreenshots.forEach((s) => {
          if (s.type === "pending" && s.previewUrl.startsWith("blob:")) {
            URL.revokeObjectURL(s.previewUrl);
          }
        });
        if (
          localLogo &&
          localLogo.type === "pending" &&
          localLogo.previewUrl.startsWith("blob:")
        ) {
          URL.revokeObjectURL(localLogo.previewUrl);
        }

        // Clean up removed files from R2
        if (removedLogoUrl) {
          try {
            await deleteProjectFile(removedLogoUrl);
          } catch (err) {
            console.error("Failed to delete old logo from R2:", err);
          }
        }
        for (const url of removedScreenshotUrls) {
          try {
            await deleteProjectFile(url);
          } catch (err) {
            console.error("Failed to delete removed screenshot from R2:", err);
          }
        }

        // Auto close after 1.5 seconds
        setTimeout(() => {
          setSaveProgress((prev) => ({ ...prev, isOpen: false }));
        }, 1500);
      } else {
        throw new Error(result?.error || "Failed to save project to database.");
      }
    } catch (err: any) {
      setSaveProgress({
        isOpen: true,
        status: "error",
        currentUploadIndex: currentUploadedCount,
        totalUploads: totalToUpload,
        errorMessage: `Database save failed: ${err.message || "Unknown error"}`,
      });
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSaveProject)}
          className="flex flex-col flex-1 min-h-0 overflow-hidden"
        >
          <div className="px-4 py-3.5 sm:py-4 space-y-3.5 flex-1 overflow-y-auto">
            <div className="grid gap-3.5 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-1.5 col-span-full">
                    <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Project Name *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPendingSave || isLoading}
                        placeholder="My Awesome App"
                        className="h-11 w-full bg-white dark:bg-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-3.5 md:grid-cols-2">
              <FormField
                control={form.control}
                name="contribution"
                render={({ field }) => (
                  <FormItem className="space-y-1.5 col-span-full">
                    <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Tagline (Optional)
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPendingSave || isLoading}
                        value={field.value || ""}
                        placeholder="A catchy one-liner tagline for your project"
                        className="h-11 w-full bg-white dark:bg-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-3.5 md:grid-cols-2">
              <FormField
                control={form.control}
                name="activeLink"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Live Demo / Active Link
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPendingSave || isLoading}
                        value={field.value || ""}
                        placeholder="https://..."
                        className="h-11 w-full bg-white dark:bg-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="githubLink"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      GitHub / Codebase
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPendingSave || isLoading}
                        value={field.value || ""}
                        placeholder="https://github.com/..."
                        className="h-11 w-full bg-white dark:bg-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-3.5 md:grid-cols-2">
              <FormField
                control={form.control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem className="space-y-2 col-span-full md:col-span-1 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900 shadow-xs">
                    <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                      <ImageIcon className="size-4" /> Project Logo (Max
                      512x512, 1MB)
                    </FormLabel>
                    <FormControl>
                      <div>
                        <input
                          type="file"
                          id={`project-logo-input-${proj.id}`}
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoChange}
                          disabled={isPendingSave || isLoading}
                        />
                        {logoUrl ? (
                          <div className="flex items-center gap-4 mt-2">
                            <div className="size-14 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900 shadow-xs shrink-0">
                              <img
                                src={getPublicImageUrl(logoUrl)}
                                alt="Project Logo Preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex flex-col gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={isPendingSave || isLoading}
                                onClick={() => {
                                  if (localLogo) {
                                    if (
                                      localLogo.type === "existing" &&
                                      localLogo.url
                                    ) {
                                      setRemovedLogoUrl(localLogo.url);
                                    } else if (
                                      localLogo.type === "pending" &&
                                      localLogo.previewUrl.startsWith("blob:")
                                    ) {
                                      URL.revokeObjectURL(localLogo.previewUrl);
                                    }
                                  }
                                  setLocalLogo(null);
                                  form.setValue("logoUrl", "", {
                                    shouldDirty: true,
                                  });
                                }}
                                className="h-8 px-3 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg"
                              >
                                <Trash2 className="size-3.5 mr-1" />
                                Remove Logo
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-2">
                            <Button
                              type="button"
                              disabled={isPendingSave || isLoading}
                              onClick={() =>
                                document
                                  .getElementById(
                                    `project-logo-input-${proj.id}`,
                                  )
                                  ?.click()
                              }
                              className="h-9 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-medium text-xs shadow-xs transition-all flex items-center gap-1.5"
                            >
                              <Upload className="size-3.5" />
                              Upload Logo
                            </Button>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Screenshots Manager */}
              <div className="col-span-full rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 bg-white dark:bg-zinc-900 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-4 gap-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                    <ImageIcon className="size-4" /> Screenshots (
                    {screenshots.length} / {membership === "PRO" ? 10 : 3})
                  </h4>
                  <div>
                    <input
                      type="file"
                      id={`project-screenshot-input-${proj.id}`}
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                      disabled={
                        isPendingSave ||
                        isLoading ||
                        localScreenshots.length >=
                          (membership === "PRO" ? 10 : 3)
                      }
                    />
                    <Button
                      type="button"
                      disabled={
                        isPendingSave ||
                        isLoading ||
                        localScreenshots.length >=
                          (membership === "PRO" ? 10 : 3)
                      }
                      onClick={() =>
                        document
                          .getElementById(`project-screenshot-input-${proj.id}`)
                          ?.click()
                      }
                      size="sm"
                      className="h-9 px-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-medium text-xs shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <Upload className="size-3.5" />
                      <span>Add Screenshot</span>
                    </Button>
                  </div>
                </div>

                {membership === "FREE" && localScreenshots.length > 3 && (
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200 p-3.5 mb-4 text-xs font-medium flex items-start gap-2.5">
                    <AlertCircle className="size-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                    <div>
                      <p className="font-semibold text-amber-900 dark:text-amber-100">
                        Membership Limit Notice
                      </p>
                      <p className="mt-0.5 text-zinc-600 dark:text-zinc-300">
                        You have {localScreenshots.length} screenshots, but only
                        the first 3 are active on the free plan.
                      </p>
                    </div>
                  </div>
                )}

                {localScreenshots.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 py-8 text-center bg-zinc-50/50 dark:bg-zinc-950/50">
                    <p className="text-xs text-zinc-400">
                      No screenshots uploaded yet.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {localScreenshots.map((item, index: number) => {
                      const isActive = index < (membership === "PRO" ? 10 : 3);
                      const url = item.previewUrl;
                      return (
                        <div
                          key={item.id}
                          className={clsx(
                            "rounded-xl border border-zinc-200 dark:border-zinc-800 p-2.5 bg-zinc-50/50 dark:bg-zinc-950/50 flex flex-col gap-2.5 relative shadow-xs",
                            !isActive && "opacity-60",
                          )}
                        >
                          <div className="aspect-video w-full rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900 relative">
                            <img
                              src={getPublicImageUrl(url)}
                              alt={`Screenshot ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute top-1.5 left-1.5 bg-zinc-900/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                              #{index + 1}
                            </span>
                            {!isActive && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-1 text-center">
                                <span className="text-[9px] font-medium text-white bg-red-600/90 px-1.5 py-0.5 rounded">
                                  Inactive
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between border-t border-zinc-200/60 dark:border-zinc-800 pt-2">
                            <div className="flex gap-1">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={
                                  index === 0 || isPendingSave || isLoading
                                }
                                onClick={() => moveScreenshot(index, "up")}
                                className="size-7 p-0 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300"
                                title="Move Left / Up"
                              >
                                <ArrowUp className="size-3" />
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={
                                  index === localScreenshots.length - 1 ||
                                  isPendingSave ||
                                  isLoading
                                }
                                onClick={() => moveScreenshot(index, "down")}
                                className="size-7 p-0 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300"
                                title="Move Right / Down"
                              >
                                <ArrowDown className="size-3" />
                              </Button>
                            </div>

                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              disabled={isPendingSave || isLoading}
                              onClick={() => deleteScreenshot(index)}
                              className="size-7 p-0 rounded-md text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                              title="Delete Screenshot"
                            >
                              <Trash2 className="size-3" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <FormField
              control={form.control}
              name="stacks"
              render={() => (
                <FormItem className="space-y-1.5 col-span-full">
                  <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Tech Stack
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-2" ref={dropdownRef}>
                      {/* Render selected tags */}
                      {selectedStacks.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                          {selectedStacks.map((stack: string, idx: number) => (
                            <span
                              key={`${stack}-${idx}`}
                              className="inline-flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/25 px-2.5 py-0.5 text-xs font-mono text-orange-700 dark:text-orange-400 rounded-md"
                            >
                              {stack}
                              <button
                                type="button"
                                disabled={isPendingSave || isLoading}
                                onClick={() => removeStack(stack)}
                                className="hover:text-red-500 transition-colors inline-flex items-center justify-center cursor-pointer"
                              >
                                <X className="size-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Input & suggestions dropdown container */}
                      <div className="relative">
                        <Input
                          disabled={isPendingSave || isLoading}
                          placeholder="Type tech stack (e.g. React, Docker) and select or press Enter"
                          value={stackInput}
                          onChange={(e) => {
                            setStackInput(e.target.value);
                            setIsDropdownOpen(true);
                          }}
                          onFocus={() => setIsDropdownOpen(true)}
                          onKeyDown={handleInputKeyDown}
                          className="h-11 w-full bg-white dark:bg-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium"
                        />

                        {/* Suggestions dropdown */}
                        {isDropdownOpen &&
                          (stackInput.trim() ||
                            filteredSuggestions.length > 0) && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl z-50 max-h-[220px] overflow-y-auto rounded-xl p-1">
                              {filteredSuggestions.map((tech, idx) => (
                                <button
                                  key={`${tech}-${idx}`}
                                  type="button"
                                  onClick={() => addStack(tech)}
                                  className="w-full text-left px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                                >
                                  {tech}
                                </button>
                              ))}
                              {showAddCustom && (
                                <button
                                  type="button"
                                  onClick={() => addStack(stackInput)}
                                  className="w-full text-left px-3 py-2 text-xs font-medium text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                                >
                                  <Plus className="size-3" />
                                  Add custom &quot;{stackInput.trim()}&quot;
                                </button>
                              )}
                            </div>
                          )}
                      </div>
                    </div>
                  </FormControl>
                  <p className="text-[11px] text-zinc-400 pt-0.5">
                    Type and press Enter to add a technology stack tag.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-1.5 mt-4">
                  <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Project Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={isPendingSave || isLoading}
                      value={field.value || ""}
                      placeholder="Describe your project, your role, and the impact..."
                      className="min-h-[120px] w-full bg-white dark:bg-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all border border-zinc-200 dark:border-zinc-800 rounded-xl p-3.5 text-sm font-medium"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isTopProject"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-3 space-x-0 space-y-0 rounded-xl border border-zinc-200 dark:border-zinc-800 p-3.5 bg-zinc-50/50 dark:bg-zinc-950/50 mt-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      disabled={isPendingSave || isLoading}
                      onCheckedChange={field.onChange}
                      className="size-4 accent-orange-600 rounded"
                    />
                  </FormControl>
                  <div className="space-y-1">
                    <FormLabel className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5 cursor-pointer">
                      <Sparkles className="size-3.5 text-orange-500" />
                      <span>Highlight as Top Project</span>
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div className="bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-zinc-800 px-4 py-2.5 sm:py-2.5 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 shrink-0">
            <Button
              type="button"
              disabled={isPendingSave || isLoading}
              onClick={onCancel}
              variant="outline"
              className="w-full sm:w-auto h-9 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-medium"
            >
              <X className="size-3.5 mr-1.5" />
              <span>Cancel</span>
            </Button>
            <Button
              type="submit"
              disabled={isPendingSave || isLoading}
              className="w-full sm:w-auto h-9 px-5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-medium text-xs shadow-xs active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
            >
              <Check className="size-3.5" />
              <span>{isMobile ? "Save" : "Save Project"}</span>
            </Button>
          </div>
        </form>
      </Form>

      {/* Multi-step loading modal */}
      <Dialog
        open={saveProgress.isOpen}
        onOpenChange={(open) => {
          if (
            !open &&
            (saveProgress.status === "error" ||
              saveProgress.status === "success")
          ) {
            setSaveProgress((prev) => ({ ...prev, isOpen: false }));
          }
        }}
      >
        <DialogContent
          showCloseButton={
            saveProgress.status === "error" || saveProgress.status === "success"
          }
          className="sm:max-w-sm rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 p-4 shadow-2xl z-[70]"
        >
          <DialogHeader>
            <DialogTitle className="text-base font-heading font-semibold text-zinc-900 dark:text-white">
              Saving Project
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Please wait while we upload your files and update your project
              records.
            </DialogDescription>
          </DialogHeader>

          <div className="py-2 flex flex-col items-center justify-center gap-3">
            {saveProgress.status !== "success" &&
            saveProgress.status !== "error" ? (
              <Loader2 className="size-8 text-orange-600 animate-spin" />
            ) : saveProgress.status === "success" ? (
              <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Check className="size-5 stroke-[2.5]" />
              </div>
            ) : (
              <div className="size-10 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center">
                <X className="size-5 stroke-[2.5]" />
              </div>
            )}

            <div className="text-center space-y-1">
              <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                {saveProgress.status === "uploading_logo" &&
                  "Step 1: Uploading Logo"}
                {saveProgress.status === "uploading_screenshots" &&
                  `Step 2: Uploading Screenshots (${saveProgress.currentUploadIndex} of ${saveProgress.totalUploads})`}
                {saveProgress.status === "saving_db" &&
                  "Step 3: Saving to Database"}
                {saveProgress.status === "success" &&
                  "Project Saved Successfully!"}
                {saveProgress.status === "error" && "An Error Occurred"}
              </p>
              <p className="text-xs text-zinc-500 max-w-xs">
                {saveProgress.status === "uploading_logo" &&
                  "Transferring project logo to storage..."}
                {saveProgress.status === "uploading_screenshots" &&
                  "Uploading screenshot assets..."}
                {saveProgress.status === "saving_db" &&
                  "Updating profile records in database..."}
                {saveProgress.status === "success" &&
                  "Project details have been saved."}
                {saveProgress.status === "error" &&
                  (saveProgress.errorMessage || "Failed to save project.")}
              </p>
            </div>

            <div className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 p-3.5 bg-zinc-50/50 dark:bg-zinc-950/50 space-y-2">
              <div className="flex items-center text-xs">
                <span className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                  {saveProgress.status === "uploading_logo" ? (
                    <Loader2 className="size-3.5 animate-spin text-orange-600" />
                  ) : [
                      "uploading_screenshots",
                      "saving_db",
                      "success",
                    ].includes(saveProgress.status) ? (
                    <Check className="size-3.5 text-emerald-600 stroke-[2.5]" />
                  ) : (
                    <div className="size-3.5 rounded-full border border-zinc-300 bg-zinc-200" />
                  )}
                  1. Logo Upload
                </span>
              </div>

              <div className="flex items-center text-xs">
                <span className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                  {saveProgress.status === "uploading_screenshots" ? (
                    <Loader2 className="size-3.5 animate-spin text-orange-600" />
                  ) : ["saving_db", "success"].includes(saveProgress.status) ? (
                    <Check className="size-3.5 text-emerald-600 stroke-[2.5]" />
                  ) : (
                    <div className="size-3.5 rounded-full border border-zinc-300 bg-zinc-200" />
                  )}
                  2. Screenshots
                </span>
              </div>

              <div className="flex items-center text-xs">
                <span className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                  {saveProgress.status === "saving_db" ? (
                    <Loader2 className="size-3.5 animate-spin text-orange-600" />
                  ) : saveProgress.status === "success" ? (
                    <Check className="size-3.5 text-emerald-600 stroke-[2.5]" />
                  ) : (
                    <div className="size-3.5 rounded-full border border-zinc-300 bg-zinc-200" />
                  )}
                  3. Database Record
                </span>
              </div>
            </div>
          </div>

          {saveProgress.status === "error" && (
            <DialogFooter className="mt-3 pt-0">
              <Button
                onClick={() =>
                  setSaveProgress((prev) => ({ ...prev, isOpen: false }))
                }
                className="w-full h-9 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-medium"
              >
                Close &amp; Modify
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
