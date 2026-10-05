"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Briefcase,
  MapPin,
  Clock,
  Plus,
  Pencil,
  Trash2,
  Mail,
  ChevronDown,
  Shield,
  ToggleLeft,
  ToggleRight,
  Loader2,
  Copy,
  Check,
  Building2,
  Send,
  Layers,
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
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Departments for filtering
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

  const handleCopyEmail = (job: JobRecord) => {
    navigator.clipboard.writeText("careers@lazee.dev");
    setCopiedId(job.id);
    toast.success("careers@lazee.dev copied to clipboard");
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const getApplyMailto = (job: JobRecord) => {
    const subject = encodeURIComponent(`Application: ${job.title} — [Your Name]`);
    const body = encodeURIComponent(
      `Hi Lazee Team,\n\nI am applying for the ${job.title} role.\n\n` +
      `• Portfolio / GitHub: \n` +
      `• LinkedIn / Profile: \n` +
      `• Relevant proof of work: \n\n` +
      `Quick 2-line intro:\n\n` +
      `Best,\n[Your Name]`
    );
    return `mailto:careers@lazee.dev?subject=${subject}&body=${body}`;
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
      {/* Admin Command Bar */}
      {isAdmin && (
        <div className="rounded-2xl border border-orange-500/30 bg-orange-500/5 dark:bg-orange-950/20 p-4 sm:p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Shield className="size-4" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-bold font-heading text-zinc-900 dark:text-zinc-100">
                    Admin Portal Active
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-700 dark:text-orange-300 font-semibold">
                    Admin Session
                  </span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Manage postings, edit requirements, or toggle public status.
                </p>
              </div>
            </div>

            <Button
              type="button"
              size="sm"
              onClick={() => setIsCreateOpen(true)}
              className="text-xs font-semibold gap-1.5 shadow-xs shrink-0 w-full sm:w-auto cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>Post New Role</span>
            </Button>
          </div>

          {/* Status filter tabs for admin */}
          <div className="flex flex-wrap items-center gap-2 pt-3 mt-3 border-t border-orange-500/15">
            <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 mr-1">
              Filter by status:
            </span>
            <button
              type="button"
              onClick={() => setFilterStatus("all")}
              className={`text-xs font-medium px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                filterStatus === "all"
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold"
                  : "bg-white/80 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800"
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
                  : "bg-white/80 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800"
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
                  : "bg-white/80 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800"
              }`}
            >
              <span className="size-1.5 rounded-full bg-zinc-400" />
              <span>Closed ({closedCount})</span>
            </button>
          </div>
        </div>
      )}

      {/* Public Department Filters (When multiple departments exist) */}
      {departments.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
          <button
            type="button"
            onClick={() => setSelectedDept("all")}
            className={`px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer shrink-0 ${
              selectedDept === "all"
                ? "bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400 font-semibold shadow-2xs"
                : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60"
            }`}
          >
            All Departments ({initialJobs.length})
          </button>
          {departments.map((dept) => {
            const count = initialJobs.filter((j) => j.department === dept).length;
            return (
              <button
                key={dept}
                type="button"
                onClick={() => setSelectedDept(dept)}
                className={`px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer shrink-0 ${
                  selectedDept === dept
                    ? "bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400 font-semibold shadow-2xs"
                    : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60"
                }`}
              >
                {dept} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Job Cards List */}
      {filteredJobs.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-8 sm:p-12 text-center space-y-4 shadow-xs">
          <div className="size-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 flex items-center justify-center mx-auto">
            <Briefcase className="size-6" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base sm:text-lg font-heading font-bold text-zinc-900 dark:text-zinc-100">
              {isAdmin
                ? "No Job Postings Found"
                : "No Open Roles Matching Your Filter"}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
              {isAdmin
                ? 'No job openings found under this criteria. Click "Post New Role" to create an opening.'
                : "We run a lean, highly focused engineering crew. If you are an exceptional developer or reverse engineer, pitch your own thesis in the Wildcard section!"}
            </p>
          </div>

          {isAdmin && (
            <Button
              type="button"
              size="sm"
              onClick={() => setIsCreateOpen(true)}
              className="text-xs font-semibold gap-1.5 shadow-xs"
            >
              <Plus className="size-3.5" />
              <span>Post New Role</span>
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-5">
          {filteredJobs.map((job) => {
            const isExpanded = Boolean(expandedIds[job.id]);
            const isToggling = togglingId === job.id;
            const isCopied = copiedId === job.id;

            return (
              <div
                key={job.id}
                className={`rounded-2xl border transition-all duration-200 bg-white dark:bg-zinc-900/60 overflow-hidden shadow-xs hover:shadow-sm ${
                  job.isOpen
                    ? "border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                    : "border-zinc-200/60 dark:border-zinc-800/60 opacity-75"
                }`}
              >
                {/* Header area */}
                <div className="p-4 sm:p-6 space-y-3.5">
                  {/* Top line: Status, Dept, Workplace & Admin Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      {/* Status indicator */}
                      {job.isOpen ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Active Role</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700">
                          <span className="size-1.5 rounded-full bg-zinc-400" />
                          <span>Closed</span>
                        </span>
                      )}

                      {job.department && (
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200/80 dark:border-zinc-800">
                          {job.department}
                        </span>
                      )}

                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200/80 dark:border-zinc-800">
                        {job.type}
                      </span>

                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                        {job.workplaceType}
                      </span>
                    </div>

                    {/* Admin Action Buttons (When logged in as Admin) */}
                    {isAdmin && (
                      <div className="flex items-center gap-1 self-start sm:self-auto bg-zinc-100/80 dark:bg-zinc-800/80 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700 shrink-0">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(job)}
                          disabled={isToggling}
                          title={job.isOpen ? "Mark as Closed" : "Mark as Open"}
                          className="h-7 px-2 text-xs gap-1 cursor-pointer"
                        >
                          {isToggling ? (
                            <Loader2 className="size-3 animate-spin" />
                          ) : job.isOpen ? (
                            <>
                              <ToggleRight className="size-3.5 text-emerald-500" />
                              <span className="text-[11px]">Close</span>
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="size-3.5 text-zinc-400" />
                              <span className="text-[11px]">Open</span>
                            </>
                          )}
                        </Button>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setJobToEdit(job)}
                          title="Edit Job"
                          className="h-7 px-2 text-xs gap-1 cursor-pointer"
                        >
                          <Pencil className="size-3 text-zinc-600 dark:text-zinc-300" />
                          <span className="text-[11px]">Edit</span>
                        </Button>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setJobToDelete(job)}
                          title="Delete Job"
                          className="h-7 px-1.5 text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                        >
                          <Trash2 className="size-3" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => toggleExpand(job.id)}
                    className="text-lg sm:text-xl font-heading font-bold text-zinc-950 dark:text-zinc-50 cursor-pointer hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                  >
                    {job.title}
                  </h3>

                  {/* Metadata Row: Location, Compensation, Experience */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-600 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-zinc-400 shrink-0" />
                      <span>{job.location}</span>
                    </div>

                    {job.compensation && (
                      <div className="flex items-center font-mono font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
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

                  {/* Collapsed Description Teaser */}
                  {!isExpanded && (
                    <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans line-clamp-2">
                      {job.description}
                    </p>
                  )}

                  {/* Toggle Accordion Trigger Button */}
                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => toggleExpand(job.id)}
                      className="text-xs font-mono font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 flex items-center gap-1.5 transition-colors cursor-pointer group"
                    >
                      <span>{isExpanded ? "Collapse Role Details" : "View Full Details & Requirements"}</span>
                      <ChevronDown
                        className={`size-3.5 transition-transform duration-200 group-hover:translate-y-0.5 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Expanded Accordion Body with Motion */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      key="details"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40"
                    >
                      <div className="p-4 sm:p-6 space-y-6">
                        {/* Scope & Description */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-200 flex items-center gap-1.5">
                            <Layers className="size-3.5 text-orange-500" />
                            <span>Role Scope &amp; Responsibilities</span>
                          </h4>
                          <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans whitespace-pre-line pl-1 sm:pl-5">
                            {job.description}
                          </div>
                        </div>

                        {/* Requirements & Tech Stack */}
                        {job.requirements && (
                          <div className="space-y-2 pt-4 border-t border-zinc-200/60 dark:border-zinc-800">
                            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-200 flex items-center gap-1.5">
                              <Building2 className="size-3.5 text-orange-500" />
                              <span>Required Capabilities &amp; Stack</span>
                            </h4>
                            <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans whitespace-pre-line pl-1 sm:pl-5">
                              {job.requirements}
                            </div>
                          </div>
                        )}

                        {/* Direct Application Box */}
                        <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
                          <div className="space-y-1">
                            <h5 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100">
                              Ready to build with us?
                            </h5>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                              Send your GitHub or proof of work to{" "}
                              <span className="font-mono text-zinc-900 dark:text-zinc-200 font-medium">
                                careers@lazee.dev
                              </span>
                            </p>
                          </div>

                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                            {/* Copy Email Button */}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleCopyEmail(job)}
                              className="text-xs font-semibold gap-1.5 h-9 cursor-pointer"
                            >
                              {isCopied ? (
                                <>
                                  <Check className="size-3.5 text-emerald-500" />
                                  <span>Email Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="size-3.5 text-zinc-500" />
                                  <span>Copy Address</span>
                                </>
                              )}
                            </Button>

                            {/* Direct Mailto Apply */}
                            <Button
                              asChild
                              size="sm"
                              className="text-xs font-semibold gap-1.5 h-9 shadow-xs cursor-pointer"
                            >
                              <a
                                href={getApplyMailto(job)}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Send className="size-3.5" />
                                <span>Apply via Email</span>
                              </a>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
