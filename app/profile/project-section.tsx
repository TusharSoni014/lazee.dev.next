"use client";

import { useState } from "react";
import { updateProjects, uploadProjectScreenshot } from "./actions";
import { toast } from "@/components/ui/toast";
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
  logoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
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
    const newProjects = projects.filter((proj: any) => proj.id !== id);
    setProjects(newProjects);
    if (editingId === id) cancelEdit();
    await updateProjects(newProjects);
    toast.success("Project removed");
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

    const result = await updateProjects(newProjects);
    setIsSaving(false);

    if (result.success) {
      setProjects(newProjects);
      setEditingId(null);
      setTempProj(null);
      toast.success("Project saved successfully");
    } else {
      toast.error("Failed to save project");
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
              className="border-[3px] border-black p-6 bg-zinc-50 relative group shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col gap-4"
            >
              <div className="absolute right-4 top-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <Button
                  type="button"
                  onClick={() => editProject(proj)}
                  className="bg-white border-[3px] border-black text-black hover:bg-orange-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] h-10 w-10 p-0 rounded-none transition-all"
                  title="Edit Project"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  onClick={() => removeProject(proj.id)}
                  className="bg-white border-[3px] border-black text-red-500 hover:text-red-600 hover:bg-red-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] h-10 w-10 p-0 rounded-none transition-all"
                  title="Remove Project"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-start gap-4">
                {proj.logoUrl && (
                  <div className="w-16 h-16 shrink-0 border-[3px] border-black overflow-hidden bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <img
                      src={proj.logoUrl}
                      alt={proj.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 pr-24">
                  <h3 className="text-xl font-black text-black uppercase flex items-center gap-2">
                    {proj.name || "Untitled Project"}
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
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className={clsx(
                            "relative aspect-video border-2 border-black overflow-hidden group shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all bg-zinc-100",
                            !isActive && "opacity-55 grayscale",
                          )}
                        >
                          <img
                            src={url}
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

function ProjectForm({
  proj,
  onConfirm,
  onCancel,
  isLoading,
  membership,
}: any) {
  const [isUploading, setIsUploading] = useState(false);

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const maxAllowed = membership === "PRO" ? 10 : 3;
    const currentCount = screenshots.length;
    const remainingSlots = maxAllowed - currentCount;

    if (remainingSlots <= 0) {
      toast.error(
        `You have already reached the limit of ${maxAllowed} screenshots.`,
      );
      e.target.value = "";
      return;
    }

    let filesToUpload = files;
    if (files.length > remainingSlots) {
      toast.info(
        `You can only upload ${remainingSlots} more screenshot(s). Only the first ${remainingSlots} will be uploaded.`,
      );
      filesToUpload = files.slice(0, remainingSlots);
    }

    const validFiles: File[] = [];
    for (const file of filesToUpload) {
      if (!file.type.startsWith("image/")) {
        toast.error(`"${file.name}" is not an image file.`);
        continue;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error(`"${file.name}" exceeds the 2MB size limit.`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) {
      e.target.value = "";
      return;
    }

    setIsUploading(true);

    const successfulUrls: string[] = [];
    let successCount = 0;

    for (const file of validFiles) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const result = await uploadProjectScreenshot(formData);
        if (result.success && result.url) {
          successfulUrls.push(result.url);
          successCount++;
        } else {
          toast.error(`Failed to upload "${file.name}": ${result.error || "Upload failed"}`);
        }
      } catch (err) {
        toast.error(`Failed to upload "${file.name}": Network or server error`);
      }
    }

    setIsUploading(false);

    if (successfulUrls.length > 0) {
      const current = form.getValues("screenshots") || [];
      form.setValue("screenshots", [...current, ...successfulUrls], {
        shouldDirty: true,
      });
      toast.success(`Successfully uploaded ${successCount} screenshot(s)!`);
    }

    e.target.value = "";
  };

  const moveScreenshot = (index: number, direction: "up" | "down") => {
    const current = form.getValues("screenshots") || [];
    const newScreenshots = [...current];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newScreenshots.length) {
      const temp = newScreenshots[index];
      newScreenshots[index] = newScreenshots[targetIndex];
      newScreenshots[targetIndex] = temp;
      form.setValue("screenshots", newScreenshots, { shouldDirty: true });
    }
  };

  const deleteScreenshot = (index: number) => {
    const current = form.getValues("screenshots") || [];
    const newScreenshots = current.filter((_, i) => i !== index);
    form.setValue("screenshots", newScreenshots, { shouldDirty: true });
  };

  const onSubmit = (values: z.infer<typeof projectSchema>) => {
    onConfirm(values);
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
                <FormItem className="space-y-2 col-span-full md:col-span-1">
                  <FormLabel className="text-[11px] font-black text-black uppercase tracking-widest pl-1">
                    Logo URL (Square)
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ""}
                      placeholder="https://..."
                      className="h-[50px] w-full bg-white placeholder:text-zinc-400 focus:bg-orange-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-[3px] border-black"
                    />
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
                      isUploading ||
                      screenshots.length >= (membership === "PRO" ? 10 : 3)
                    }
                  />
                  <Button
                    type="button"
                    disabled={
                      isUploading ||
                      screenshots.length >= (membership === "PRO" ? 10 : 3)
                    }
                    onClick={() =>
                      document
                        .getElementById(`project-screenshot-input-${proj.id}`)
                        ?.click()
                    }
                    size="sm"
                    className="bg-black text-white hover:bg-zinc-800 border-[2px] border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-1.5"
                  >
                    {isUploading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    {isUploading ? "Uploading..." : "Upload Screenshot"}
                  </Button>
                </div>
              </div>

              {membership === "FREE" && screenshots.length > 3 && (
                <div className="border-[2px] border-black bg-yellow-100 p-3 mb-4 text-xs font-bold text-black flex flex-col gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <p className="uppercase font-black text-[10px] text-orange-600">
                    ⚠️ Membership Limit Warning
                  </p>
                  <p>
                    You have {screenshots.length} screenshots, but only the
                    first 3 will be active on your free plan. Delete screenshots
                    or reorder them to bring your preferred screenshots to the
                    top.
                  </p>
                </div>
              )}

              {screenshots.length === 0 ? (
                <div className="border-[2px] border-dashed border-zinc-300 py-8 text-center bg-zinc-50">
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest italic">
                    No screenshots uploaded yet.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {screenshots.map((url: string, index: number) => {
                    const isActive = index < (membership === "PRO" ? 10 : 3);
                    return (
                      <div
                        key={index}
                        className={clsx(
                          "border-[2px] border-black p-3 bg-zinc-50 flex flex-col gap-3 relative shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]",
                          !isActive && "opacity-60",
                        )}
                      >
                        <div className="aspect-video w-full border-[2px] border-black overflow-hidden bg-white relative">
                          <img
                            src={url}
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
                              disabled={index === 0}
                              onClick={() => moveScreenshot(index, "up")}
                              className="h-8 w-8 p-0 bg-white border-[2px] border-black text-black hover:bg-zinc-100 rounded-none shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] disabled:opacity-40 disabled:shadow-none"
                              title="Move Left / Up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              type="button"
                              disabled={index === screenshots.length - 1}
                              onClick={() => moveScreenshot(index, "down")}
                              className="h-8 w-8 p-0 bg-white border-[2px] border-black text-black hover:bg-zinc-100 rounded-none shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] disabled:opacity-40 disabled:shadow-none"
                              title="Move Right / Down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </Button>
                          </div>

                          <Button
                            type="button"
                            onClick={() => deleteScreenshot(index)}
                            className="h-8 w-8 p-0 bg-white border-[2px] border-black text-red-500 hover:text-red-600 hover:bg-red-50 rounded-none shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
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
              onClick={form.handleSubmit(onSubmit)}
              disabled={isLoading}
              className="flex-1 h-12 text-lg disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Check className="w-5 h-5 mr-2" />
              )}
              {isLoading ? "Saving..." : "Confirm"}
            </Button>
            <Button
              type="button"
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
    </div>
  );
}
