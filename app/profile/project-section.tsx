"use client";

import { useState, useEffect, useRef } from "react";
import { updateProjects, uploadProjectScreenshot, uploadProjectLogo, deleteProjectFile } from "./actions";
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
    <div className="border-[3px] border-black bg-white p-6 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex items-center gap-4 mb-8 border-b-[3px] border-black pb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-none border-[3px] border-black bg-zinc-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <Icon className="w-6 h-6 text-black" />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tighter text-black font-heading">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

export function ProjectSection({ projects, setProjects, membership }: any) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempProj, setTempProj] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
      stacks: [],
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
              console.error("Failed to delete project file from R2 on project deletion:", err);
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
    const stacksParsed = data.stacks
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
        setTempProj(null);
        toast.success("Project saved successfully");
        return { success: true };
      } else {
        toast.error(result.error || "Failed to save project");
        return { success: false, error: result.error || "Failed to save project" };
      }
    } catch (err: any) {
      setIsSaving(false);
      toast.error(err?.message || "Failed to save project");
      return { success: false, error: err?.message || "Failed to save project" };
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTempProj(null);
  };

  const editProject = (proj: any) => {
    setTempProj({
      ...proj,
      stacks: proj.stacks ? proj.stacks.join(", ") : "",
    });
    setEditingId(proj.id);
  };

  return (
    <Section title="Projects" icon={FolderGit2}>
      <div className="space-y-8">
        {projects.map((proj: any, index: number) => {
          if (editingId === proj.id && tempProj) {
            return (
              <ProjectForm
                key={tempProj.id}
                proj={tempProj}
                onConfirm={confirmProject}
                onCancel={cancelEdit}
                isLoading={isSaving}
                membership={membership}
              />
            );
          }

          return (
            <div
              key={proj.id || index}
              className={clsx(
                "border-[3px] border-black p-6 bg-zinc-50 relative group shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col gap-4",
                deletingId === proj.id && "opacity-60 pointer-events-none"
              )}
            >
              {deletingId === proj.id && (
                <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center gap-2 z-20">
                  <Loader2 className="w-8 h-8 animate-spin text-black" />
                  <span className="text-xs font-black uppercase tracking-wider text-black">Deleting Project...</span>
                </div>
              )}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 md:pr-24 min-w-0">
                  {proj.logoUrl && (
                    <div className="w-16 h-16 shrink-0 border-[3px] border-black overflow-hidden bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <img
                        src={getPublicImageUrl(proj.logoUrl)}
                        alt={proj.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-black text-black uppercase flex flex-wrap items-center gap-2">
                      <span className="truncate max-w-[200px] sm:max-w-none">{proj.name || "Untitled Project"}</span>
                      {proj.isTopProject && (
                        <span className="text-[10px] bg-orange-500 text-black px-2 py-0.5 border-2 border-black font-black uppercase tracking-widest shrink-0">
                          🏆 Top Pick
                        </span>
                      )}
                    </h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                      {proj.role && (
                        <span className="text-xs font-bold text-black uppercase tracking-widest bg-zinc-100 px-2 py-0.5 border border-black italic">
                          Role: {proj.role}
                        </span>
                      )}
                      {proj.duration && (
                        <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest bg-zinc-100 px-2 py-0.5 border border-black">
                          {proj.duration}
                        </span>
                      )}
                      {proj.activeLink && (
                        <a
                          href={proj.activeLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-xs font-bold text-blue-600 uppercase tracking-widest hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" /> Live Demo
                        </a>
                      )}
                      {proj.githubLink && (
                        <a
                          href={proj.githubLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-xs font-bold text-zinc-700 uppercase tracking-widest hover:underline"
                        >
                          <Github className="w-3 h-3" /> Codebase
                        </a>
                      )}
                    </div>
                    {proj.contribution && (
                      <p className="text-xs font-bold text-zinc-500 mt-2 uppercase tracking-wide">
                        <span className="text-black">Contribution:</span>{" "}
                        {proj.contribution}
                      </p>
                    )}
                  </div>
                </div>

                <div className={clsx(
                  "flex gap-2 shrink-0 self-end md:self-start transition-opacity z-10",
                  "md:absolute md:right-4 md:top-4",
                  deletingId === proj.id ? "opacity-100" : "md:opacity-0 md:group-hover:opacity-100"
                )}>
                  <Button
                    type="button"
                    disabled={!!deletingId || isSaving}
                    onClick={() => editProject(proj)}
                    className="bg-white border-[3px] border-black text-black hover:bg-orange-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] h-10 w-10 p-0 rounded-none transition-all disabled:opacity-50 disabled:pointer-events-none"
                    title="Edit Project"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    disabled={!!deletingId || isSaving}
                    onClick={() => removeProject(proj.id)}
                    className="bg-white border-[3px] border-black text-red-500 hover:text-red-600 hover:bg-red-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] h-10 w-10 p-0 rounded-none transition-all disabled:opacity-50 disabled:pointer-events-none"
                    title="Remove Project"
                  >
                    {deletingId === proj.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {proj.stacks && proj.stacks.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {proj.stacks.map((stack: string, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-1 text-[10px] font-black uppercase text-black bg-zinc-200 border-2 border-black"
                    >
                      {stack}
                    </span>
                  ))}
                </div>
              )}

              {proj.description && (
                <p className="text-sm text-zinc-700 whitespace-pre-wrap font-medium">
                  {proj.description}
                </p>
              )}

              {proj.screenshots && proj.screenshots.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">
                    Project Screenshots:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {proj.screenshots.map((url: string, idx: number) => {
                      const isActive = idx < (membership === "PRO" ? 10 : 3);
                      return (
                        <a
                          key={idx}
                          href={getPublicImageUrl(url)}
                          target="_blank"
                          rel="noreferrer"
                          className={clsx(
                            "relative aspect-video border-2 border-black overflow-hidden group shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all bg-zinc-100",
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
                              <span className="text-[8px] font-black text-white uppercase tracking-widest bg-red-600 px-1.5 py-0.5 border border-black">
                                Hidden (Free Limit)
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

        {editingId &&
          !projects.find((e: any) => e.id === editingId) &&
          tempProj && (
            <ProjectForm
              proj={tempProj}
              onConfirm={confirmProject}
              onCancel={cancelEdit}
              isLoading={isSaving}
              membership={membership}
            />
          )}

        {!editingId && (
          <Button
            type="button"
            onClick={addProject}
            className="w-full h-14 bg-white border-[3px] border-black text-black hover:bg-orange-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all rounded-none font-black uppercase tracking-widest flex items-center justify-center gap-2 text-lg mt-6"
          >
            <Plus className="w-6 h-6" />
            Add Project
          </Button>
        )}
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
  status: "idle" | "uploading_logo" | "uploading_screenshots" | "saving_db" | "success" | "error";
  currentUploadIndex: number;
  totalUploads: number;
  errorMessage?: string;
}

function ProjectForm({
  proj,
  onConfirm,
  onCancel,
  isLoading,
  membership,
}: any) {
  const [localLogo, setLocalLogo] = useState<LocalLogo | null>(() => {
    if (proj.logoUrl) {
      return { type: "existing", url: proj.logoUrl, previewUrl: proj.logoUrl };
    }
    return null;
  });

  const [localScreenshots, setLocalScreenshots] = useState<LocalScreenshot[]>(() => {
    return (proj.screenshots || []).map((url: string) => ({
      id: crypto.randomUUID(),
      type: "existing",
      url,
      previewUrl: url,
    }));
  });

  const [removedLogoUrl, setRemovedLogoUrl] = useState<string | null>(null);
  const [removedScreenshotUrls, setRemovedScreenshotUrls] = useState<string[]>([]);

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
      stacks: proj.stacks || "",
      description: proj.description || "",
      isTopProject: proj.isTopProject || false,
      screenshots: proj.screenshots || [],
    },
  });

  const screenshots = form.watch("screenshots") || [];
  const logoUrl = form.watch("logoUrl") || "";

  // Keep refs of current pending URLs so the unmount cleanup can access them without triggers
  const pendingUrlsRef = useRef<string[]>([]);
  
  useEffect(() => {
    const urls: string[] = [];
    localScreenshots.forEach(s => {
      if (s.type === "pending" && s.previewUrl.startsWith("blob:")) {
        urls.push(s.previewUrl);
      }
    });
    if (localLogo && localLogo.type === "pending" && localLogo.previewUrl.startsWith("blob:")) {
      urls.push(localLogo.previewUrl);
    }
    pendingUrlsRef.current = urls;
  }, [localScreenshots, localLogo]);

  useEffect(() => {
    return () => {
      // Clean up all pending URLs when form unmounts
      pendingUrlsRef.current.forEach(url => {
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
        toast.error(`Logo dimensions must be at most 512x512 pixels (selected: ${img.width}x${img.height}).`);
        URL.revokeObjectURL(img.src);
        e.target.value = "";
        return;
      }

      // Check if we already have a pending local logo to revoke
      if (localLogo && localLogo.type === "pending" && localLogo.previewUrl.startsWith("blob:")) {
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
    form.setValue("screenshots", updated.map(s => s.previewUrl), {
      shouldDirty: true,
    });
    toast.success(`Successfully loaded ${newScreenshots.length} screenshot(s) (pending save)!`);
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
      form.setValue("screenshots", newScreenshots.map(s => s.previewUrl), { shouldDirty: true });
    }
  };

  const deleteScreenshot = (index: number) => {
    const item = localScreenshots[index];
    if (item.type === "existing" && item.url) {
      setRemovedScreenshotUrls(prev => [...prev, item.url!]);
    } else if (item.type === "pending" && item.previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(item.previewUrl);
    }

    const updated = localScreenshots.filter((_, i) => i !== index);
    setLocalScreenshots(updated);
    form.setValue("screenshots", updated.map(s => s.previewUrl), { shouldDirty: true });
  };

  const handleSaveProject = async (values: z.infer<typeof projectSchema>) => {
    setSaveProgress({
      isOpen: true,
      status: "uploading_logo",
      currentUploadIndex: 0,
      totalUploads: 0,
    });

    let uploadedLogoUrl = (localLogo && localLogo.type === "existing") ? (localLogo.url || "") : "";

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
    const pendingScreenshots = localScreenshots.filter(s => s.type === "pending" && s.file);
    const totalToUpload = pendingScreenshots.length;
    
    setSaveProgress(prev => ({
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
        setSaveProgress(prev => ({
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
            throw new Error(result.error || `Failed to upload screenshot #${currentUploadedCount}`);
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
    setSaveProgress(prev => ({
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
        setSaveProgress(prev => ({
          ...prev,
          status: "success",
        }));

        // Clean up local blob URLs
        localScreenshots.forEach(s => {
          if (s.type === "pending" && s.previewUrl.startsWith("blob:")) {
            URL.revokeObjectURL(s.previewUrl);
          }
        });
        if (localLogo && localLogo.type === "pending" && localLogo.previewUrl.startsWith("blob:")) {
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
          setSaveProgress(prev => ({ ...prev, isOpen: false }));
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
    <div className="border-[3px] border-black p-6 md:p-8 bg-zinc-50 relative group shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
      <div className="flex border-b-[3px] border-black pb-4 mb-6">
        <h3 className="text-lg font-black uppercase tracking-widest">
          {proj.name ? `Editing: ${proj.name}` : "New Project"}
        </h3>
      </div>
      <Form {...form}>
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[11px] font-black text-black uppercase tracking-widest pl-1">
                    Project Name *
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPendingSave || isLoading}
                      placeholder="My Awesome App"
                      className="h-[50px] w-full bg-white placeholder:text-zinc-400 focus:bg-orange-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-[3px] border-black"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[11px] font-black text-black uppercase tracking-widest pl-1">
                    Your Role
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPendingSave || isLoading}
                      value={field.value || ""}
                      placeholder="Lead Developer"
                      className="h-[50px] w-full bg-white placeholder:text-zinc-400 focus:bg-orange-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-[3px] border-black"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[11px] font-black text-black uppercase tracking-widest pl-1">
                    Duration / Timeframe
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPendingSave || isLoading}
                      value={field.value || ""}
                      placeholder="Jan 2024 - Present"
                      className="h-[50px] w-full bg-white placeholder:text-zinc-400 focus:bg-orange-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-[3px] border-black"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contribution"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[11px] font-black text-black uppercase tracking-widest pl-1">
                    Key Contribution
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPendingSave || isLoading}
                      value={field.value || ""}
                      placeholder="Implemented Real-time Chat"
                      className="h-[50px] w-full bg-white placeholder:text-zinc-400 focus:bg-orange-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-[3px] border-black"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="activeLink"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[11px] font-black text-black uppercase tracking-widest pl-1">
                    Live Demo / Active Link
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPendingSave || isLoading}
                      value={field.value || ""}
                      placeholder="https://..."
                      className="h-[50px] w-full bg-white placeholder:text-zinc-400 focus:bg-orange-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-[3px] border-black"
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
                <FormItem className="space-y-2">
                  <FormLabel className="text-[11px] font-black text-black uppercase tracking-widest pl-1">
                    GitHub / Codebase
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPendingSave || isLoading}
                      value={field.value || ""}
                      placeholder="https://github.com/..."
                      className="h-[50px] w-full bg-white placeholder:text-zinc-400 focus:bg-orange-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-[3px] border-black"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem className="space-y-2 col-span-full md:col-span-1 border-[3px] border-black p-5 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <FormLabel className="text-[11px] font-black text-black uppercase tracking-widest pl-1 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4" /> Project Logo (Max 512x512, 1MB)
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
                          <div className="w-16 h-16 border-[3px] border-black overflow-hidden bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0">
                            <img
                              src={getPublicImageUrl(logoUrl)}
                              alt="Project Logo Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button
                              type="button"
                              disabled={isPendingSave || isLoading}
                              onClick={() => {
                                if (localLogo) {
                                  if (localLogo.type === "existing" && localLogo.url) {
                                    setRemovedLogoUrl(localLogo.url);
                                  } else if (localLogo.type === "pending" && localLogo.previewUrl.startsWith("blob:")) {
                                    URL.revokeObjectURL(localLogo.previewUrl);
                                  }
                                }
                                setLocalLogo(null);
                                form.setValue("logoUrl", "", { shouldDirty: true });
                              }}
                              className="bg-white border-[2px] border-black text-red-500 hover:text-red-600 hover:bg-red-50 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all h-9 px-3 text-xs font-bold uppercase disabled:opacity-50 disabled:pointer-events-none"
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-1" />
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
                                .getElementById(`project-logo-input-${proj.id}`)
                                ?.click()
                            }
                            className="bg-black text-white hover:bg-zinc-800 border-[2px] border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-1.5 h-10 px-4 text-xs font-black uppercase disabled:opacity-50 disabled:pointer-events-none"
                          >
                            <Upload className="w-3.5 h-3.5" />
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
            <div className="col-span-full border-[3px] border-black p-5 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-[2px] border-black pb-3 mb-4 gap-2">
                <h4 className="text-sm font-black uppercase tracking-wider text-black flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" /> Screenshots (
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
                      localScreenshots.length >= (membership === "PRO" ? 10 : 3)
                    }
                  />
                  <Button
                    type="button"
                    disabled={
                      isPendingSave ||
                      isLoading ||
                      localScreenshots.length >= (membership === "PRO" ? 10 : 3)
                    }
                    onClick={() =>
                      document
                        .getElementById(`project-screenshot-input-${proj.id}`)
                        ?.click()
                    }
                    size="sm"
                    className="bg-black text-white hover:bg-zinc-800 border-[2px] border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Add Screenshot
                  </Button>
                </div>
              </div>

              {membership === "FREE" && localScreenshots.length > 3 && (
                <div className="border-[2px] border-black bg-yellow-100 p-3 mb-4 text-xs font-bold text-black flex flex-col gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <p className="uppercase font-black text-[10px] text-orange-600">
                    ⚠️ Membership Limit Warning
                  </p>
                  <p>
                    You have {localScreenshots.length} screenshots, but only the
                    first 3 will be active on your free plan. Delete screenshots
                    or reorder them to bring your preferred screenshots to the
                    top.
                  </p>
                </div>
              )}

              {localScreenshots.length === 0 ? (
                <div className="border-[2px] border-dashed border-zinc-300 py-8 text-center bg-zinc-50">
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest italic">
                    No screenshots uploaded yet.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {localScreenshots.map((item, index: number) => {
                    const isActive = index < (membership === "PRO" ? 10 : 3);
                    const url = item.previewUrl;
                    return (
                      <div
                        key={item.id}
                        className={clsx(
                          "border-[2px] border-black p-3 bg-zinc-50 flex flex-col gap-3 relative shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]",
                          !isActive && "opacity-60",
                        )}
                      >
                        <div className="aspect-video w-full border-[2px] border-black overflow-hidden bg-white relative">
                          <img
                            src={getPublicImageUrl(url)}
                            alt={`Screenshot ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-2 left-2 bg-black text-white text-[9px] font-black border border-black px-1.5 py-0.5">
                            #{index + 1}
                          </span>
                          {!isActive && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-1 text-center">
                              <span className="text-[9px] font-black text-white uppercase tracking-widest bg-red-600 px-2 py-0.5 border border-black shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)]">
                                Inactive (Free Limit)
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between border-t border-dashed border-zinc-300 pt-2">
                          <div className="flex gap-1.5">
                            <Button
                              type="button"
                              disabled={index === 0 || isPendingSave || isLoading}
                              onClick={() => moveScreenshot(index, "up")}
                              className="h-8 w-8 p-0 bg-white border-[2px] border-black text-black hover:bg-zinc-100 rounded-none shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] disabled:opacity-40 disabled:shadow-none disabled:pointer-events-none"
                              title="Move Left / Up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              type="button"
                              disabled={index === localScreenshots.length - 1 || isPendingSave || isLoading}
                              onClick={() => moveScreenshot(index, "down")}
                              className="h-8 w-8 p-0 bg-white border-[2px] border-black text-black hover:bg-zinc-100 rounded-none shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] disabled:opacity-40 disabled:shadow-none disabled:pointer-events-none"
                              title="Move Right / Down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </Button>
                          </div>

                          <Button
                            type="button"
                            disabled={isPendingSave || isLoading}
                            onClick={() => deleteScreenshot(index)}
                            className="h-8 w-8 p-0 bg-white border-[2px] border-black text-red-500 hover:text-red-600 hover:bg-red-50 rounded-none shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:pointer-events-none"
                            title="Delete Screenshot"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-[11px] font-black text-black uppercase tracking-widest pl-1">
                  Tech Stack (Comma-separated)
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPendingSave || isLoading}
                    placeholder="React, Next.js, Tailwind CSS"
                    className="h-[50px] w-full bg-white placeholder:text-zinc-400 focus:bg-orange-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-[3px] border-black"
                  />
                </FormControl>
                <p className="text-xs font-bold text-zinc-500 pt-1">
                  Provide project stacks separated by commas.
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="space-y-2 mt-4">
                <FormLabel className="text-[11px] font-black text-black uppercase tracking-widest pl-1">
                  Project Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    disabled={isPendingSave || isLoading}
                    value={field.value || ""}
                    placeholder="Describe your project, your role, and the impact..."
                    className="min-h-[120px] w-full bg-white placeholder:text-zinc-400 focus:bg-orange-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-[3px] border-black rounded-none p-4"
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
              <FormItem className="flex flex-row items-center gap-3 space-x-0 space-y-0 rounded-none border-[3px] border-black p-4 bg-orange-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mt-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    disabled={isPendingSave || isLoading}
                    onCheckedChange={field.onChange}
                    className="border-[3px] border-black w-6 h-6 rounded-none data-[state=checked]:bg-black data-[state=checked]:text-white"
                  />
                </FormControl>
                <div className="space-y-1">
                  <FormLabel className="text-sm font-black text-black uppercase tracking-widest leading-none cursor-pointer">
                    Mark as Top Project 🌟
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          <div className="flex gap-4 mt-8 pt-6 border-t-[3px] border-black border-dashed">
            <Button
              type="button"
              onClick={form.handleSubmit(handleSaveProject)}
              disabled={isPendingSave || isLoading}
              className="flex-1 h-12 text-lg disabled:opacity-50 bg-black text-white hover:bg-zinc-800 border-[3px] border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all font-black uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5 mr-2" />
              Save Project
            </Button>
            <Button
              type="button"
              disabled={isPendingSave || isLoading}
              onClick={onCancel}
              variant="outline"
              className="flex-1 h-12 text-lg"
            >
              <X className="w-5 h-5" />
              Cancel
            </Button>
          </div>
        </div>
      </Form>

      {/* Multi-step loading modal */}
      <Dialog open={saveProgress.isOpen} onOpenChange={(open) => {
        if (!open && (saveProgress.status === "error" || saveProgress.status === "success")) {
          setSaveProgress(prev => ({ ...prev, isOpen: false }));
        }
      }}>
        <DialogContent 
          showCloseButton={saveProgress.status === "error" || saveProgress.status === "success"}
          className="sm:max-w-md border-4 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white text-black p-6"
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase tracking-wider text-black font-heading">
              Saving Project
            </DialogTitle>
            <DialogDescription className="text-zinc-600 font-medium">
              Please wait while we upload your files and update the database.
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 flex flex-col items-center justify-center gap-6">
            {saveProgress.status !== "success" && saveProgress.status !== "error" ? (
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
            ) : saveProgress.status === "success" ? (
              <div className="w-12 h-12 rounded-none border-[3px] border-black bg-green-500 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Check className="w-6 h-6 text-white stroke-[3px]" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-none border-[3px] border-black bg-red-500 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <X className="w-6 h-6 text-white stroke-[3px]" />
              </div>
            )}

            <div className="text-center space-y-2">
              <p className="text-sm font-black uppercase tracking-widest text-black">
                {saveProgress.status === "uploading_logo" && "Step 1: Uploading Logo"}
                {saveProgress.status === "uploading_screenshots" && 
                  `Step 2: Uploading Screenshots (${saveProgress.currentUploadIndex} of ${saveProgress.totalUploads})`}
                {saveProgress.status === "saving_db" && "Step 3: Saving to Database"}
                {saveProgress.status === "success" && "Project Saved Successfully!"}
                {saveProgress.status === "error" && "An Error Occurred"}
              </p>
              <p className="text-xs text-zinc-500 font-medium max-w-xs">
                {saveProgress.status === "uploading_logo" && "Transferring your project logo to Cloudflare R2..."}
                {saveProgress.status === "uploading_screenshots" && "Uploading your screenshot files to Cloudflare R2..."}
                {saveProgress.status === "saving_db" && "Updating your profile and project records in the database..."}
                {saveProgress.status === "success" && "Your project details and uploads have been successfully saved."}
                {saveProgress.status === "error" && (saveProgress.errorMessage || "Failed to save project. Please try again.")}
              </p>
            </div>

            <div className="w-full border-[3px] border-black p-4 bg-zinc-50 space-y-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center text-xs font-black uppercase">
                <span className="flex items-center gap-2">
                  {saveProgress.status === "uploading_logo" ? (
                    <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                  ) : ["uploading_screenshots", "saving_db", "success"].includes(saveProgress.status) ? (
                    <Check className="w-4 h-4 text-green-600 stroke-[3px]" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-black bg-zinc-200" />
                  )}
                  1. Project Logo Upload
                </span>
              </div>

              <div className="flex items-center text-xs font-black uppercase">
                <span className="flex items-center gap-2">
                  {saveProgress.status === "uploading_screenshots" ? (
                    <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                  ) : ["saving_db", "success"].includes(saveProgress.status) ? (
                    <Check className="w-4 h-4 text-green-600 stroke-[3px]" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-black bg-zinc-200" />
                  )}
                  2. Screenshot Uploads
                </span>
              </div>

              <div className="flex items-center text-xs font-black uppercase">
                <span className="flex items-center gap-2">
                  {saveProgress.status === "saving_db" ? (
                    <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                  ) : saveProgress.status === "success" ? (
                    <Check className="w-4 h-4 text-green-600 stroke-[3px]" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-black bg-zinc-200" />
                  )}
                  3. Database Save
                </span>
              </div>
            </div>
          </div>

          {saveProgress.status === "error" && (
            <DialogFooter className="mt-4">
              <Button
                onClick={() => setSaveProgress(prev => ({ ...prev, isOpen: false }))}
                className="w-full bg-black text-white hover:bg-zinc-800 border-[3px] border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all font-black uppercase tracking-widest text-sm py-2.5"
              >
                Close & Modify
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
