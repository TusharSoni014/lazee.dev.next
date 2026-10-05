"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  createJobAction,
  updateJobAction,
  type JobInput,
} from "./actions";
import { toast } from "sonner";
import { Loader2, Briefcase, Plus, Save } from "lucide-react";

export interface JobRecord {
  id: string;
  title: string;
  department?: string | null;
  location: string;
  type: string;
  workplaceType: string;
  compensation?: string | null;
  experience?: string | null;
  description: string;
  requirements?: string | null;
  isOpen: boolean;
  applyEmail: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface JobAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobToEdit?: JobRecord | null;
  onSuccess?: () => void;
}

export function JobAdminModal({
  isOpen,
  onClose,
  jobToEdit,
  onSuccess,
}: JobAdminModalProps) {
  const isEditing = Boolean(jobToEdit);

  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("Engineering");
  const [location, setLocation] = useState("Remote");
  const [type, setType] = useState("Full-time");
  const [workplaceType, setWorkplaceType] = useState("Remote");
  const [compensation, setCompensation] = useState("");
  const [experience, setExperience] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [jobStatusOpen, setJobStatusOpen] = useState(true);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (jobToEdit) {
      setTitle(jobToEdit.title || "");
      setDepartment(jobToEdit.department || "Engineering");
      setLocation(jobToEdit.location || "Remote");
      setType(jobToEdit.type || "Full-time");
      setWorkplaceType(jobToEdit.workplaceType || "Remote");
      setCompensation(jobToEdit.compensation || "");
      setExperience(jobToEdit.experience || "");
      setDescription(jobToEdit.description || "");
      setRequirements(jobToEdit.requirements || "");
      setJobStatusOpen(jobToEdit.isOpen ?? true);
    } else {
      setTitle("");
      setDepartment("Engineering");
      setLocation("Remote");
      setType("Full-time");
      setWorkplaceType("Remote");
      setCompensation("");
      setExperience("");
      setDescription("");
      setRequirements("");
      setJobStatusOpen(true);
    }
  }, [jobToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a job title.");
      return;
    }
    if (!location.trim()) {
      toast.error("Please enter a job location.");
      return;
    }
    if (!description.trim()) {
      toast.error("Please enter a job description.");
      return;
    }

    setLoading(true);

    const payload: JobInput = {
      title: title.trim(),
      department: department.trim() || "Engineering",
      location: location.trim(),
      type: type.trim() || "Full-time",
      workplaceType: workplaceType.trim() || "Remote",
      compensation: compensation.trim() || undefined,
      experience: experience.trim() || undefined,
      description: description.trim(),
      requirements: requirements.trim() || undefined,
      isOpen: jobStatusOpen,
    };

    try {
      if (isEditing && jobToEdit) {
        const res = await updateJobAction(jobToEdit.id, payload);
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success("Job posting updated successfully!");
          onClose();
          onSuccess?.();
        }
      } else {
        const res = await createJobAction(payload);
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success("Job posting published successfully!");
          onClose();
          onSuccess?.();
        }
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !loading && onClose()}>
      <DialogContent className="max-w-2xl w-[94vw] sm:w-full max-h-[92vh] overflow-y-auto p-4 sm:p-6 rounded-2xl">
        <DialogHeader className="space-y-1.5 text-left border-b border-zinc-100 dark:border-zinc-800 pb-3.5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-orange-600 dark:text-orange-500 bg-orange-500/10 px-2.5 py-1 rounded-full w-fit">
            <Briefcase className="size-3.5" />
            <span>Admin Controls</span>
          </div>
          <DialogTitle className="text-lg sm:text-xl font-bold font-heading text-zinc-950 dark:text-zinc-50">
            {isEditing ? "Edit Job Posting" : "Create New Job Posting"}
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400">
            {isEditing
              ? "Update details, compensation, requirements, or toggle visibility."
              : "Post a new career opening directly onto the Lazee careers board."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Title & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Job Title <span className="text-rose-500">*</span>
              </label>
              <Input
                placeholder="e.g. Senior Full-Stack Engineer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="h-10 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Department
              </label>
              <Input
                placeholder="e.g. Engineering, Product, Growth"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="h-10 text-sm"
              />
            </div>
          </div>

          {/* Location & Workplace Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Location <span className="text-rose-500">*</span>
              </label>
              <Input
                placeholder="e.g. Remote (Worldwide)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="h-10 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Workplace Type
              </label>
              <select
                value={workplaceType}
                onChange={(e) => setWorkplaceType(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/20 focus-visible:border-orange-500"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Employment Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/20 focus-visible:border-orange-500"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>

          {/* Compensation & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Compensation / Salary Range
              </label>
              <Input
                placeholder="e.g. $120k - $160k or ₹20 - ₹35 LPA"
                value={compensation}
                onChange={(e) => setCompensation(e.target.value)}
                className="h-10 text-sm font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Experience Level
              </label>
              <Input
                placeholder="e.g. 2-5 years / High Agency"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="h-10 text-sm"
              />
            </div>
          </div>

          {/* Open / Closed Status Toggle */}
          <div className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60">
            <div className="pr-3">
              <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                Public Listing Status
              </p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                {jobStatusOpen
                  ? "Active — Public visitors can discover and apply."
                  : "Closed — Hidden from public visitors."}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={jobStatusOpen}
                onChange={(e) => setJobStatusOpen(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-300 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
            </label>
          </div>

          {/* Job Description */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Role Description &amp; Mission <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] font-mono text-zinc-400">Plain text / Markdown</span>
            </div>
            <Textarea
              rows={4}
              placeholder="Describe the mission, challenges to solve, daily responsibilities..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="text-sm resize-y min-h-[100px]"
            />
          </div>

          {/* Requirements & Qualifications */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Requirements &amp; Tech Stack
              </label>
              <span className="text-[10px] font-mono text-zinc-400">Optional</span>
            </div>
            <Textarea
              rows={3}
              placeholder="e.g. Next.js, TypeScript, PostgreSQL, Chrome Extensions, high-agency..."
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              className="text-sm resize-y min-h-[80px]"
            />
          </div>

          {/* Footer actions */}
          <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-end pt-2 gap-2 border-t border-zinc-100 dark:border-zinc-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={loading}
              className="w-full sm:w-auto text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={loading}
              className="w-full sm:w-auto text-xs font-semibold gap-1.5"
            >
              {loading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : isEditing ? (
                <>
                  <Save className="size-3.5" />
                  <span>Update Posting</span>
                </>
              ) : (
                <>
                  <Plus className="size-3.5" />
                  <span>Publish Role</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
