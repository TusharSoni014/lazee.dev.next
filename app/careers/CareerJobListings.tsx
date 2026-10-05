"use client";

import { useState } from "react";
import {
  Briefcase,
  MapPin,
  Clock,
  Plus,
  Pencil,
  Trash2,
  Mail,
  ChevronDown,
  ChevronUp,
  Shield,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobAdminModal, type JobRecord } from "./JobAdminModal";
import { JobDeleteDialog } from "./JobDeleteDialog";
import { deleteJobAction, toggleJobStatusAction } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CareerJobListingsProps {
  initialJobs: JobRecord[];
  isAdmin: boolean;
}

export function CareerJobListings({
  initialJobs,
  isAdmin,
}: CareerJobListingsProps) {
  const router = useRouter();
  const [filterStatus, setFilterStatus] = useState<"all" | "open" | "closed">(
    "all",
  );
  const [selectedDept, setSelectedDept] = useState<string>("all");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState<JobRecord | null>(null);
  const [jobToDelete, setJobToDelete] = useState<JobRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  // Filter jobs
  const departments = Array.from(
    new Set(
      initialJobs
        .map((j) => j.department)
        .filter((d): d is string => Boolean(d && d.trim())),
    ),
  );

  const filteredJobs = initialJobs.filter((job) => {
    // If not admin, only show open jobs
    if (!isAdmin && !job.isOpen) return false;

    // Admin filter
    if (isAdmin) {
      if (filterStatus === "open" && !job.isOpen) return false;
      if (filterStatus === "closed" && job.isOpen) return false;
    }

    // Dept filter
    if (selectedDept !== "all" && job.department !== selectedDept) return false;

    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleStatus = async (job: JobRecord) => {
    setTogglingId(job.id);
    try {
      const res = await toggleJobStatusAction(job.id);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(
          res.isOpen
            ? `"${job.title}" is now Open`
            : `"${job.title}" is now Closed`,
        );
        router.refresh();
      }
    } catch {
      toast.error("Failed to toggle status");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!jobToDelete) return;
    setIsDeleting(true);
    try {
      const res = await deleteJobAction(jobToDelete.id);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Job posting deleted");
        setJobToDelete(null);
        router.refresh();
      }
    } catch {
      toast.error("Failed to delete job");
    } finally {
      setIsDeleting(false);
    }
  };

  const openCount = initialJobs.filter((j) => j.isOpen).length;
  const closedCount = initialJobs.length - openCount;

  return (
    <div className="space-y-6">
      {/* Admin Control Bar (Visible exclusively to Admin) */}
      {isAdmin && (
        <div className="rounded-2xl border-2 border-orange-500/40 bg-orange-500/5 dark:bg-orange-950/20 p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Shield className="size-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold font-heading text-zinc-900 dark:text-zinc-100">
                    Admin Portal
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-700 dark:text-orange-300 font-semibold">
                    techandrow@gmail.com
                  </span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  You have exclusive permissions to post, edit, close, and
                  delete job openings.
                </p>
              </div>
            </div>

            <Button
              type="button"
              size="sm"
              onClick={() => setIsCreateOpen(true)}
              className="text-xs font-semibold gap-1.5 shadow-xs shrink-0 self-start sm:self-auto"
            >
              <Plus className="size-3.5" />
              <span>Post New Opening</span>
            </Button>
          </div>

          {/* Status filter tabs for admin */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-orange-500/15">
            <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 mr-1">
              Filter:
            </span>
            <button
              type="button"
              onClick={() => setFilterStatus("all")}
              className={`text-xs font-medium px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                filterStatus === "all"
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold"
                  : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800"
              }`}
            >
              All ({initialJobs.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus("open")}
              className={`text-xs font-medium px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                filterStatus === "open"
                  ? "bg-emerald-600 text-white font-semibold"
                  : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800"
              }`}
            >
              <span className="size-1.5 rounded-full bg-emerald-500" />
              <span>Open ({openCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus("closed")}
              className={`text-xs font-medium px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                filterStatus === "closed"
                  ? "bg-zinc-700 text-white font-semibold"
                  : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800"
              }`}
            >
              <span className="size-1.5 rounded-full bg-zinc-400" />
              <span>Closed ({closedCount})</span>
            </button>
          </div>
        </div>
      )}

      {/* Public Department Filters (if more than 1 dept) */}
      {departments.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            type="button"
            onClick={() => setSelectedDept("all")}
            className={`px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
              selectedDept === "all"
                ? "bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400 font-semibold"
                : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900"
            }`}
          >
            All Departments
          </button>
          {departments.map((dept) => (
            <button
              key={dept}
              type="button"
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                selectedDept === dept
                  ? "bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400 font-semibold"
                  : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      )}

      {/* Job Cards List */}
      {filteredJobs.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 text-center space-y-4 shadow-xs">
          <div className="size-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-zinc-400 flex items-center justify-center mx-auto">
            <Briefcase className="size-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              {isAdmin
                ? "No Job Postings Found"
                : "No Open Positions Right Now"}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
              {isAdmin
                ? 'You haven\'t posted any jobs under this filter yet. Click "Post New Opening" to add your first job posting.'
                : "We are keeping our core team lean and automated. However, we always welcome high-agency builders. Pitch yourself in Section 03 below!"}
            </p>
          </div>

          {isAdmin && (
            <Button
              type="button"
              size="sm"
              onClick={() => setIsCreateOpen(true)}
              className="text-xs font-semibold gap-1.5"
            >
              <Plus className="size-3.5" />
              <span>Post New Opening</span>
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => {
            const isExpanded = Boolean(expandedIds[job.id]);
            const isToggling = togglingId === job.id;

            return (
              <div
                key={job.id}
                className={`rounded-2xl border transition-all duration-200 bg-white dark:bg-zinc-950 overflow-hidden shadow-xs ${
                  job.isOpen
                    ? "border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                    : "border-zinc-200/60 dark:border-zinc-900 opacity-80"
                }`}
              >
                {/* Header row */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Status Badge */}
                        {job.isOpen ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Open</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700">
                            <span className="size-1.5 rounded-full bg-zinc-400" />
                            <span>Closed</span>
                          </span>
                        )}

                        {job.department && (
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-800">
                            {job.department}
                          </span>
                        )}

                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-800">
                          {job.type}
                        </span>

                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                          {job.workplaceType}
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-heading font-bold text-zinc-900 dark:text-zinc-50">
                        {job.title}
                      </h3>
                    </div>

                    {/* Admin Action Buttons (Exclusively visible to Admin) */}
                    {isAdmin ? (
                      <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-auto bg-zinc-50 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200/80 dark:border-zinc-800">
                        {/* Quick Toggle Status */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(job)}
                          disabled={isToggling}
                          title={
                            job.isOpen ? "Close this job" : "Re-open this job"
                          }
                          className="h-8 px-2.5 text-xs gap-1.5"
                        >
                          {isToggling ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : job.isOpen ? (
                            <>
                              <ToggleRight className="size-4 text-emerald-500" />
                              <span className="hidden sm:inline">Close</span>
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="size-4 text-zinc-400" />
                              <span className="hidden sm:inline">Open</span>
                            </>
                          )}
                        </Button>

                        {/* Edit Button */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setJobToEdit(job)}
                          title="Edit Job"
                          className="h-8 px-2.5 text-xs gap-1"
                        >
                          <Pencil className="size-3.5 text-zinc-600 dark:text-zinc-300" />
                          <span className="hidden sm:inline">Edit</span>
                        </Button>

                        {/* Delete Button */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setJobToDelete(job)}
                          title="Delete Job"
                          className="h-8 px-2 text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    ) : (
                      /* Regular User: Direct Apply via mailto in new tab */
                      <Button
                        asChild
                        className="text-xs font-semibold gap-1.5 shadow-xs shrink-0 self-start sm:self-auto cursor-pointer"
                      >
                        <a
                          href="mailto:careers@lazee.dev"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Mail className="size-3.5" />
                          <span>Apply</span>
                        </a>
                      </Button>
                    )}
                  </div>

                  {/* Badges / Meta row: Location, Compensation, Experience */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-600 dark:text-zinc-400 pt-1 border-t border-zinc-100 dark:border-zinc-900">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-zinc-400 shrink-0" />
                      <span>{job.location}</span>
                    </div>

                    {job.compensation && (
                      <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-medium font-mono">
                        <span>{job.compensation}</span>
                      </div>
                    )}

                    {job.experience && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="size-3.5 text-zinc-400 shrink-0" />
                        <span>{job.experience}</span>
                      </div>
                    )}
                  </div>

                  {/* Short Description */}
                  <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans whitespace-pre-line">
                    {isExpanded ? (
                      <div>
                        <div className="mb-4">{job.description}</div>
                        {job.requirements && (
                          <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-900 space-y-2">
                            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">
                              Requirements &amp; Tech Stack:
                            </h4>
                            <div className="text-xs text-zinc-600 dark:text-zinc-400 whitespace-pre-line">
                              {job.requirements}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        {job.description.length > 200
                          ? `${job.description.slice(0, 200)}...`
                          : job.description}
                      </div>
                    )}
                  </div>

                  {/* Bottom bar: Expand toggle & Apply button */}
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-900">
                    <button
                      type="button"
                      onClick={() => toggleExpand(job.id)}
                      className="text-xs font-mono font-medium text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {isExpanded ? (
                        <>
                          <span>Show Less</span>
                          <ChevronUp className="size-3.5" />
                        </>
                      ) : (
                        <>
                          <span>View Full Job Details</span>
                          <ChevronDown className="size-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Admin Modals */}
      {isAdmin && (
        <>
          {/* Create Job Modal */}
          <JobAdminModal
            isOpen={isCreateOpen}
            onClose={() => setIsCreateOpen(false)}
            onSuccess={() => router.refresh()}
          />

          {/* Edit Job Modal */}
          <JobAdminModal
            isOpen={Boolean(jobToEdit)}
            jobToEdit={jobToEdit}
            onClose={() => setJobToEdit(null)}
            onSuccess={() => router.refresh()}
          />

          {/* Delete Dialog */}
          <JobDeleteDialog
            isOpen={Boolean(jobToDelete)}
            jobTitle={jobToDelete?.title || ""}
            isDeleting={isDeleting}
            onConfirm={handleDeleteConfirm}
            onClose={() => setJobToDelete(null)}
          />
        </>
      )}
    </div>
  );
}
