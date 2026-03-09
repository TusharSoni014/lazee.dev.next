"use client";

import { useState } from "react";
import { updateProjects } from "./actions";
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
  Video,
  Image as ImageIcon,
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
import clsx from "clsx";

const projectSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Project name is required"),
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
  videoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  stacks: z.string().optional(), // We'll parse this as comma-separated
  description: z.string().optional(),
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

export function ProjectSection({ projects, setProjects }: any) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempProj, setTempProj] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  const addProject = () => {
    const newProj = {
      id: crypto.randomUUID(),
      name: "",
      activeLink: "",
      githubLink: "",
      logoUrl: "",
      videoUrl: "",
      stacks: [],
      description: "",
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
                  <h3 className="text-xl font-black text-black uppercase">
                    {proj.name || "Untitled Project"}
                  </h3>
                  <div className="flex flex-wrap gap-3 mt-2">
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

              {proj.videoUrl && (
                <div
                  className="mt-2 border-[3px] border-black bg-black rounded-none overflow-hidden object-cover relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  style={{ paddingBottom: "56.25%", height: 0 }}
                >
                  {proj.videoUrl.includes("youtube.com") ||
                  proj.videoUrl.includes("youtu.be") ||
                  proj.videoUrl.includes("vimeo.com") ? (
                    <iframe
                      src={getEmbedUrl(proj.videoUrl)}
                      className="absolute top-0 left-0 w-full h-full border-none"
                      allowFullScreen
                      title={proj.name}
                    />
                  ) : (
                    <video
                      src={proj.videoUrl}
                      controls
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute top-0 left-0 w-full h-full object-cover"
                    />
                  )}
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

function getEmbedUrl(url: string) {
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const videoId =
      url.split("v=")[1]?.split("&")[0] || url.split("youtu.be/")[1];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  if (url.includes("vimeo.com")) {
    const videoId = url.split("vimeo.com/")[1];
    return `https://player.vimeo.com/video/${videoId}`;
  }
  return url;
}

function ProjectForm({ proj, onConfirm, onCancel, isLoading }: any) {
  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      id: proj.id,
      name: proj.name || "",
      activeLink: proj.activeLink || "",
      githubLink: proj.githubLink || "",
      logoUrl: proj.logoUrl || "",
      videoUrl: proj.videoUrl || "",
      stacks: proj.stacks || "",
      description: proj.description || "",
    },
  });

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
                <FormItem className="space-y-2">
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
            <FormField
              control={form.control}
              name="videoUrl"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[11px] font-black text-black uppercase tracking-widest pl-1">
                    Demo Video Link (Youtube/Vimeo)
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ""}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="h-[50px] w-full bg-white placeholder:text-zinc-400 focus:bg-orange-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-[3px] border-black"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
