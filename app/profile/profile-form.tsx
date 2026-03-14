"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useProfile } from "@/hooks/useProfile";
import { ResumeManager } from "./resume-manager";
import { updateProfile, updateExperiences } from "./actions";
import { ProjectSection } from "./project-section";
import { toast } from "@/components/ui/toast";
import {
  Loader2,
  Save,
  User as UserIcon,
  FileText,
  Globe,
  Briefcase,
  Linkedin,
  Github,
  Twitter,
  Link as LinkIcon,
  CreditCard,
  Coins,
  IdCard,
  Settings,
  Send,
} from "lucide-react";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import {
  Plus,
  Trash2,
  Calendar as CalendarIcon,
  Edit2,
  X,
  Check,
  Code,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const COUNTRY_CODES = [
  { code: "+1", name: "US/CA" },
  { code: "+44", name: "UK" },
  { code: "+91", name: "India" },
  { code: "+61", name: "Australia" },
  { code: "+86", name: "China" },
  { code: "+49", name: "Germany" },
  { code: "+33", name: "France" },
  { code: "+81", name: "Japan" },
];

const CURRENCIES = ["USD", "EUR", "GBP", "INR", "AUD", "CAD", "JPY"];

const JOB_TYPES = [
  "Software Engineering",
  "Frontend Development",
  "Backend Development",
  "Full Stack Development",
  "Mobile Development",
  "Web3 / Smart Contracts",
  "Blockchain Developer",
  "Cloud Architecture",
  "DevOps / SRE",
  "Cybersecurity",
  "Data Science / Engineering",
  "Machine Learning / AI",
  "Game Development",
  "Developer Relations",
  "Product Management",
  "Project Management",
  "UI/UX Design",
  "Graphic Design",
  "Marketing",
  "Sales",
  "Customer Support",
  "Human Resources",
  "Finance / Accounting",
  "Operations",
  "Other",
];

export default function ProfileForm({ user: initialUser }: { user: any }) {
  const { data: user, isLoading: isLoadingProfile } = useProfile(initialUser);
  const [loading, setLoading] = useState(false);
  const [experiences, setExperiences] = useState<any[]>(
    user?.experiences || [],
  );
  const [projects, setProjects] = useState<any[]>(user?.projects || []);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  if (!user) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data: any = Object.fromEntries(formData);
    data.skills = formData.getAll("skills") as string[];
    const result = await updateProfile(data);

    setLoading(false);
    if (result.success) {
      setIsDirty(false);
      toast.success("Profile updated successfully!");
    } else {
      toast.error("Failed to update profile.");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-10"
      onChange={() => setIsDirty(true)}
    >
      {/* Profile Header & Credits */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* User Identity & Membership */}
        <div className="lg:col-span-2 border-[3px] border-black bg-white p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-center gap-8">
          <div className="h-32 w-32 shrink-0 rounded-none border-[3px] border-black bg-[#fefaf6] flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative group">
            {user.image ? (
              <Image
                src={user.image}
                alt={`${user.firstName || ""} ${user.lastName || ""}`}
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-5xl font-black text-black uppercase">
                {user.firstName ? user.firstName[0] : ""}
                {user.lastName ? user.lastName[0] : ""}
                {!user.firstName && !user.lastName && (
                  <UserIcon className="w-12 h-12" />
                )}
              </span>
            )}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-black uppercase font-heading text-black tracking-tighter">
                {user.firstName || "Anonymous"} {user.lastName || "User"}
              </h2>
              <p className="text-sm font-bold text-zinc-600 uppercase tracking-widest mt-1">
                {user.email || "No Email"}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <div
                className={clsx(
                  "inline-flex items-center gap-2 border-[3px] border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                  user.membership === "PRO"
                    ? "bg-[linear-gradient(110deg,#FFD700_30%,#fffac7_50%,#FFD700_70%)] bg-[length:200%_100%] animate-[shimmer_2s_infinite_linear]"
                    : "bg-blue-400",
                )}
              >
                <CreditCard
                  className={clsx(
                    "w-5 h-5 text-black",
                    user.membership === "PRO" && "animate-pulse",
                  )}
                />
                <span className="font-black uppercase tracking-tight text-black flex items-center gap-2">
                  {user.membership} PLAN
                </span>
              </div>
              {user.membership === "FREE" ? (
                <Button
                  type="button"
                  size="sm"
                  className="bg-black text-white hover:bg-zinc-800 tracking-widest uppercase font-bold px-4 py-2 h-auto"
                >
                  Upgrade
                </Button>
              ) : (
                <Button
                  type="button"
                  size="icon"
                  className="bg-white border-[3px] border-black text-black hover:bg-zinc-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all rounded-none h-10 w-10 flex items-center justify-center"
                  title="Manage Subscription"
                >
                  <Settings className="w-5 h-5 text-black" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Credits Punch Card */}
        <div className="col-span-1 border-[3px] border-black bg-yellow-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col relative overflow-hidden">
          {/* Barcode Decor */}
          <div className="flex h-6 w-full opacity-60 space-x-1 px-6 pt-4 items-end justify-center">
            <div className="w-2 bg-black h-full"></div>
            <div className="w-1 bg-black h-full"></div>
            <div className="w-4 bg-black h-full"></div>
            <div className="w-1 bg-black h-full"></div>
            <div className="w-2 bg-black h-[80%]"></div>
            <div className="w-6 bg-black h-full"></div>
            <div className="w-1 bg-black h-full"></div>
            <div className="w-2 bg-black h-[60%]"></div>
            <div className="w-3 bg-black h-full"></div>
            <div className="w-1 bg-black h-full"></div>
            <div className="w-4 bg-black h-[90%]"></div>
          </div>

          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center mt-2">
            <h3 className="text-sm font-black uppercase tracking-widest text-black/80 mb-2">
              Credit Balance
            </h3>
            <div className="text-7xl font-black font-heading tracking-tighter text-black flex items-center justify-center">
              {Intl.NumberFormat("en-US", {
                notation: "compact",
                maximumFractionDigits: 1,
              })
                .format(user.credits || 0)
                .toLowerCase()}
              <span className="text-3xl ml-1 text-black">⚡</span>
            </div>
          </div>

          <div className="border-t-[3px] border-black border-dashed bg-white p-3 text-center">
            <p className="text-[11px] font-black uppercase tracking-widest text-black">
              2 CREDITS = 1 AI FILL
            </p>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <Section title="Personal Information" icon={IdCard}>
        <div className="grid gap-6 md:grid-cols-3">
          <ProfileInput
            label="First Name"
            name="firstName"
            defaultValue={user.firstName}
            placeholder="John"
          />
          <ProfileInput
            label="Middle Name"
            name="middleName"
            defaultValue={user.middleName}
            placeholder=""
          />
          <ProfileInput
            label="Last Name"
            name="lastName"
            defaultValue={user.lastName}
            placeholder="Doe"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 mt-6">
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <div className="flex gap-4">
              <div className="relative">
                <select
                  name="countryCode"
                  defaultValue={user.countryCode || "+1"}
                  className="appearance-none h-[50px] w-28 rounded-none border-[3px] border-black bg-zinc-100 px-4 py-2 text-sm font-bold text-black focus:outline-none focus:bg-orange-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                  <svg
                    className="w-4 h-4 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="square"
                      strokeLinejoin="miter"
                      strokeWidth="3"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              <Input
                name="phoneNumber"
                defaultValue={user.phoneNumber}
                placeholder="1234567890"
                className="h-[50px] flex-1 bg-zinc-100 placeholder:text-zinc-400"
              />
            </div>
          </div>
          <ProfileInput
            label="Country"
            name="country"
            defaultValue={user.country}
            placeholder="United States"
          />
        </div>
      </Section>

      {/* Professional */}
      <Section title="Professional Details" icon={Briefcase}>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Looking For Role</Label>
            <Select name="jobType" defaultValue={user.jobType || undefined}>
              <SelectTrigger className="h-[50px] w-full rounded-none border-[3px] border-black bg-zinc-100 px-4 py-2 text-sm font-bold text-black focus:outline-none focus:ring-0 focus:bg-orange-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] data-[state=open]:bg-orange-50">
                <SelectValue placeholder="Select Role Type" />
              </SelectTrigger>
              <SelectContent className="rounded-none border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                {JOB_TYPES.map((role) => (
                  <SelectItem
                    key={role}
                    value={role}
                    className="cursor-pointer font-bold focus:bg-orange-50 rounded-none"
                  >
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Current CTC</Label>
            <div className="flex gap-4">
              <div className="relative">
                <select
                  name="currency"
                  defaultValue={user.currency || "USD"}
                  className="appearance-none h-[50px] w-24 rounded-none border-[3px] border-black bg-zinc-100 px-4 py-2 text-sm font-bold text-black focus:outline-none focus:bg-orange-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  <svg
                    className="w-3 h-3 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="square"
                      strokeLinejoin="miter"
                      strokeWidth="3"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              <Input
                name="currentCtc"
                type="number"
                step="0.01"
                defaultValue={user.currentCtc}
                placeholder="100000"
                className="h-[50px] flex-1 bg-zinc-100 placeholder:text-zinc-400"
              />
            </div>
          </div>
          <ProfileInput
            label="Notice Period (Days)"
            name="noticePeriod"
            type="number"
            defaultValue={user.noticePeriod}
            placeholder="30"
          />
        </div>
      </Section>

      <div
        onChange={(e) => e.stopPropagation()}
        onInput={(e) => e.stopPropagation()}
      >
        <ExperienceSection
          experiences={experiences}
          setExperiences={setExperiences}
        />

        <ProjectSection projects={projects} setProjects={setProjects} />

        <ResumeManager
          resumes={user.resumes || []}
          membership={user.membership}
        />
      </div>

      <SkillsSection
        skills={user.skills || []}
        setDirty={() => setIsDirty(true)}
      />

      {/* Socials */}
      <Section title="Social Links" icon={Globe}>
        <div className="grid gap-6 md:grid-cols-2">
          <ProfileInput
            label="LinkedIn"
            name="linkedin"
            defaultValue={user.linkedin}
            placeholder="https://linkedin.com/in/..."
            icon={Linkedin}
          />
          <ProfileInput
            label="GitHub"
            name="github"
            defaultValue={user.github}
            placeholder="https://github.com/..."
            icon={Github}
          />
          <ProfileInput
            label="Twitter"
            name="twitter"
            defaultValue={user.twitter}
            placeholder="https://twitter.com/..."
            icon={Twitter}
          />
          <ProfileInput
            label="Portfolio"
            name="portfolio"
            defaultValue={user.portfolio}
            placeholder="https://..."
            icon={LinkIcon}
          />
          <ProfileInput
            label="Telegram"
            name="telegram"
            defaultValue={user.telegram}
            placeholder="https://t.me/..."
            icon={Send}
          />
          <ProfileInput
            label="Other Link"
            name="other"
            defaultValue={user.other}
            placeholder="https://..."
            icon={LinkIcon}
          />
        </div>
      </Section>

      {/* AI Settings */}
      <Section title="AI Settings" icon={Settings}>
        <div className="space-y-2">
          <Label>Specific Question Guidance (Optional)</Label>
          <Textarea
            name="specificQuestionGuidance"
            defaultValue={user.specificQuestionGuidance || ""}
            placeholder="Mention any extra and specific detail to provide for the AI..."
            className="min-h-[120px] w-full bg-zinc-100 placeholder:text-zinc-400 focus:bg-orange-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-[3px] border-black rounded-none p-4"
          />
          <p className="text-xs font-bold text-zinc-500 pt-1 uppercase tracking-widest">
            Mention extra and specific detail to provide for the AI.
          </p>
        </div>
      </Section>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="px-8 py-6 tracking-widest bg-orange-500 hover:bg-orange-600 border-[3px] border-black text-black font-black uppercase text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-5 w-5 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

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

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[11px] font-black text-black mb-2 uppercase tracking-widest pl-1">
      {children}
    </label>
  );
}

function ProfileInput({ label, icon: Icon, className, ...props }: any) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      <div className="relative group">
        <Input
          className={clsx(
            "h-[50px] w-full bg-zinc-100 placeholder:text-zinc-400 focus:bg-orange-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]",
            Icon && "pl-14",
          )}
          {...props}
        />
        {Icon && (
          <div className="absolute left-0 top-0 bottom-0 w-[50px] flex items-center justify-center border-r-[3px] border-black bg-zinc-200">
            <Icon className="h-5 w-5 text-black" />
          </div>
        )}
      </div>
    </div>
  );
}

function ExperienceSection({ experiences, setExperiences }: any) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempExp, setTempExp] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  const addExperience = () => {
    const newExp = {
      id: crypto.randomUUID(),
      companyName: "",
      companyWebsite: "",
      startDate: new Date(),
      endDate: null,
      isCurrent: false,
      description: "",
    };
    setTempExp(newExp);
    setEditingId(newExp.id);
  };

  const removeExperience = async (id: string) => {
    const newExperiences = experiences.filter((exp: any) => exp.id !== id);
    setExperiences(newExperiences);
    if (editingId === id) cancelEdit();
    await updateExperiences(newExperiences);
    toast.success("Experience removed");
  };

  const confirmExperience = async (data: any) => {
    setIsSaving(true);
    let newExperiences;
    const exists = experiences.find((e: any) => e.id === data.id);
    if (exists) {
      newExperiences = experiences.map((e: any) =>
        e.id === data.id ? data : e,
      );
    } else {
      newExperiences = [data, ...experiences];
    }

    // Sort before saving
    newExperiences.sort((a: any, b: any) => {
      const dateA = a.isCurrent
        ? new Date().getTime()
        : a.endDate
          ? new Date(a.endDate).getTime()
          : 0;
      const dateB = b.isCurrent
        ? new Date().getTime()
        : b.endDate
          ? new Date(b.endDate).getTime()
          : 0;
      return dateB - dateA;
    });

    const result = await updateExperiences(newExperiences);
    setIsSaving(false);

    if (result.success) {
      setExperiences(newExperiences);
      setEditingId(null);
      setTempExp(null);
      toast.success("Experience saved successfully");
    } else {
      toast.error("Failed to save experience");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTempExp(null);
  };

  const editExperience = (exp: any) => {
    setTempExp({ ...exp });
    setEditingId(exp.id);
  };

  const sortedExperiences = [...experiences].sort((a: any, b: any) => {
    const dateA = a.isCurrent
      ? new Date().getTime()
      : a.endDate
        ? new Date(a.endDate).getTime()
        : 0;
    const dateB = b.isCurrent
      ? new Date().getTime()
      : b.endDate
        ? new Date(b.endDate).getTime()
        : 0;
    return dateB - dateA;
  });

  return (
    <Section title="Experience" icon={Briefcase}>
      <div className="space-y-8">
        {sortedExperiences.map((exp: any, index: number) => {
          if (editingId === exp.id && tempExp) {
            return (
              <ExperienceForm
                key={tempExp.id}
                exp={tempExp}
                onConfirm={confirmExperience}
                onCancel={cancelEdit}
                isLoading={isSaving}
              />
            );
          }

          return (
            <div
              key={exp.id || index}
              className="border-[3px] border-black p-6 bg-zinc-50 relative group shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col gap-2"
            >
              <div className="absolute right-4 top-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  type="button"
                  onClick={() => editExperience(exp)}
                  className="bg-white border-[3px] border-black text-black hover:bg-orange-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] h-10 w-10 p-0 rounded-none transition-all"
                  title="Edit Experience"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  onClick={() => removeExperience(exp.id)}
                  className="bg-white border-[3px] border-black text-red-500 hover:text-red-600 hover:bg-red-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] h-10 w-10 p-0 rounded-none transition-all"
                  title="Remove Experience"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <h3 className="text-xl font-black text-black uppercase pr-24">
                {exp.companyName || "Untitled Company"}
              </h3>
              {exp.companyWebsite && (
                <a
                  href={exp.companyWebsite}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-600 underline font-bold uppercase tracking-widest block w-fit"
                >
                  {exp.companyWebsite}
                </a>
              )}
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">
                {exp.startDate
                  ? format(new Date(exp.startDate), "MMM yyyy")
                  : "N/A"}{" "}
                -{" "}
                {exp.isCurrent
                  ? "Present"
                  : exp.endDate
                    ? format(new Date(exp.endDate), "MMM yyyy")
                    : "N/A"}
              </p>
              {exp.description && (
                <p className="text-sm text-zinc-700 mt-4 whitespace-pre-wrap font-medium">
                  {exp.description}
                </p>
              )}
            </div>
          );
        })}

        {editingId &&
          !experiences.find((e: any) => e.id === editingId) &&
          tempExp && (
            <ExperienceForm
              exp={tempExp}
              onConfirm={confirmExperience}
              onCancel={cancelEdit}
              isLoading={isSaving}
            />
          )}

        {!editingId && (
          <Button
            type="button"
            onClick={addExperience}
            className="w-full h-14 bg-white border-[3px] border-black text-black hover:bg-orange-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all rounded-none font-black uppercase tracking-widest flex items-center justify-center gap-2 text-lg mt-6"
          >
            <Plus className="w-6 h-6" />
            Add Experience
          </Button>
        )}
      </div>
    </Section>
  );
}

const experienceSchema = z.object({
  id: z.string().optional(),
  companyName: z.string().min(1, "Company name is required"),
  role: z.string().min(1, "Job title is required"),
  location: z.string().optional(),
  companyWebsite: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  isCurrent: z.boolean(),
  description: z.string().optional(),
});

function ExperienceForm({ exp, onConfirm, onCancel, isLoading }: any) {
  const form = useForm<z.infer<typeof experienceSchema>>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      id: exp.id,
      companyName: exp.companyName || "",
      role: exp.role || "",
      location: exp.location || "",
      companyWebsite: exp.companyWebsite || "",
      startDate: exp.startDate ? new Date(exp.startDate) : undefined,
      endDate: exp.endDate ? new Date(exp.endDate) : undefined,
      isCurrent: exp.isCurrent || false,
      description: exp.description || "",
    },
  });

  const onSubmit = (values: z.infer<typeof experienceSchema>) => {
    onConfirm(values);
  };

  return (
    <div className="border-[3px] border-black p-6 md:p-8 bg-zinc-50 relative group shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
      <div className="flex border-b-[3px] border-black pb-4 mb-6">
        <h3 className="text-lg font-black uppercase tracking-widest">
          {exp.companyName ? `Editing: ${exp.companyName}` : "New Experience"}
        </h3>
      </div>
      <Form {...form}>
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 mt-2">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[11px] font-black text-black uppercase tracking-widest pl-1">
                    Company Name *
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Google"
                      className="h-[50px] w-full bg-white placeholder:text-zinc-400 focus:bg-orange-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-[3px] border-black"
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
                    Job Title / Role *
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Senior Full Stack Engineer"
                      className="h-[50px] w-full bg-white placeholder:text-zinc-400 focus:bg-orange-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-[3px] border-black"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2 mt-4">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[11px] font-black text-black uppercase tracking-widest pl-1">
                    Location
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ""}
                      placeholder="Remote / San Francisco"
                      className="h-[50px] w-full bg-white placeholder:text-zinc-400 focus:bg-orange-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-[3px] border-black"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyWebsite"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[11px] font-black text-black uppercase tracking-widest pl-1">
                    Company Website
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
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-[11px] font-black text-black uppercase tracking-widest pl-1 mb-2">
                    Start Date
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={clsx(
                            "h-[50px] w-full pl-3 text-left font-bold rounded-none border-[3px] border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                            !field.value && "text-zinc-500",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 rounded-none border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-[11px] font-black text-black uppercase tracking-widest pl-1 mb-2">
                    End Date
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          disabled={form.watch("isCurrent")}
                          className={clsx(
                            "h-[50px] w-full pl-3 text-left font-bold rounded-none border-[3px] border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                            !field.value && "text-zinc-500",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>
                              {form.watch("isCurrent")
                                ? "Present"
                                : "Pick a date"}
                            </span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 rounded-none border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="isCurrent"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-3 space-x-0 space-y-0 rounded-none border-[3px] border-black p-4 bg-orange-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      if (checked) form.setValue("endDate", undefined);
                    }}
                    className="border-[3px] border-black w-6 h-6 rounded-none data-[state=checked]:bg-black data-[state=checked]:text-white"
                  />
                </FormControl>
                <div className="space-y-1">
                  <FormLabel className="text-sm font-black text-black uppercase tracking-widest leading-none cursor-pointer">
                    I currently work here
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-[11px] font-black text-black uppercase tracking-widest pl-1">
                  Job Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Describe your role, responsibilities, and achievements..."
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

const AVAILABLE_SKILLS = [
  "Frontend",
  "Backend",
  "Full Stack",
  "DevOps",
  "React",
  "Next.js",
  "Vue.js",
  "Angular",
  "Svelte",
  "Node.js",
  "Express",
  "NestJS",
  "Python",
  "Django",
  "Flask",
  "FastAPI",
  "Java",
  "Spring Boot",
  "Go",
  "Rust",
  "C++",
  "C#",
  ".NET",
  "Ruby on Rails",
  "PHP",
  "Laravel",
  "Zustand",
  "Redux",
  "MobX",
  "Recoil",
  "React Native",
  "Flutter",
  "Swift",
  "Kotlin",
  "TypeScript",
  "JavaScript",
  "HTML",
  "CSS",
  "Tailwind CSS",
  "Material UI",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Redis",
  "GraphQL",
  "REST API",
  "Docker",
  "Kubernetes",
  "AWS",
  "Google Cloud",
  "Azure",
  "CI/CD",
  "Git",
  "Linux",
  "UI/UX Design",
  "Figma",
];

function SkillsSection({
  skills: initialSkills,
  setDirty,
}: {
  skills: string[];
  setDirty: () => void;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set(initialSkills));
  const [open, setOpen] = useState(false);

  return (
    <Section title="Technical Skills" icon={Code}>
      <div className="space-y-4">
        {Array.from(selected).map((skill) => (
          <input key={skill} type="hidden" name="skills" value={skill} />
        ))}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full h-auto min-h-[50px] justify-between text-left font-normal border-[3px] border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white whitespace-normal py-3 px-4"
            >
              <div className="flex flex-wrap gap-2">
                {selected.size > 0 ? (
                  Array.from(selected).map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 bg-yellow-300 border-[2px] border-black px-2 py-1 text-xs font-black uppercase text-black"
                    >
                      {skill}
                      <X
                        className="ml-1 h-3 w-3 cursor-pointer hover:bg-black hover:text-white rounded-full p-[1px] transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          const next = new Set(selected);
                          next.delete(skill);
                          setSelected(next);
                          setDirty();
                        }}
                      />
                    </span>
                  ))
                ) : (
                  <span className="text-zinc-500 font-bold uppercase tracking-widest text-sm">
                    Select skills...
                  </span>
                )}
              </div>
              <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50 text-black border-black border-2 rounded-none p-0 bg-yellow-400" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[var(--radix-popover-trigger-width)] p-0 border-[3px] border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-h-80 overflow-y-auto bg-white"
            align="start"
          >
            <div className="p-4 flex flex-col gap-3">
              {AVAILABLE_SKILLS.map((skill) => {
                const isSelected = selected.has(skill);
                return (
                  <div key={skill} className="flex items-center space-x-3">
                    <Checkbox
                      id={`skill-${skill}`}
                      checked={isSelected}
                      onCheckedChange={(checked) => {
                        const next = new Set(selected);
                        if (checked) {
                          next.add(skill);
                        } else {
                          next.delete(skill);
                        }
                        setSelected(next);
                        setDirty();
                      }}
                      className="border-[2px] border-black rounded-none data-[state=checked]:bg-black text-white h-5 w-5 shrink-0"
                    />
                    <label
                      htmlFor={`skill-${skill}`}
                      className="text-sm font-bold uppercase tracking-wide leading-none cursor-pointer select-none"
                    >
                      {skill}
                    </label>
                  </div>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </Section>
  );
}
