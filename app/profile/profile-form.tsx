"use client";

import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { ResumeManager } from "./resume-manager";
import { updateProfile } from "./actions";
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
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

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

export default function ProfileForm({ user: initialUser }: { user: any }) {
  const { data: user, isLoading: isLoadingProfile } = useProfile(initialUser);
  const [loading, setLoading] = useState(false);
  const [experiences, setExperiences] = useState<any[]>(
    user?.experiences || [],
  );

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
    const data = Object.fromEntries(formData);
    data.experiences = JSON.stringify(experiences);
    const result = await updateProfile(data);

    setLoading(false);
    if (result.success) {
      toast.success("Profile updated successfully!");
    } else {
      toast.error("Failed to update profile.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-10">
      {/* Profile Header & Credits */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* User Identity & Membership */}
        <div className="lg:col-span-2 border-[3px] border-black bg-white p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-center gap-8">
          <div className="h-32 w-32 shrink-0 rounded-none border-[3px] border-black bg-[#fefaf6] flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative group">
            <span className="text-5xl font-black text-black uppercase">
              {user.firstName ? user.firstName[0] : ""}
              {user.lastName ? user.lastName[0] : ""}
              {!user.firstName && !user.lastName && (
                <UserIcon className="w-12 h-12" />
              )}
            </span>
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

      <ExperienceSection
        experiences={experiences}
        setExperiences={setExperiences}
      />

      <ResumeManager
        resumes={user.resumes || []}
        membership={user.membership}
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

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter((exp: any) => exp.id !== id));
    if (editingId === id) cancelEdit();
  };

  const confirmExperience = () => {
    if (!tempExp) return;
    const exists = experiences.find((e: any) => e.id === tempExp.id);
    if (exists) {
      setExperiences(
        experiences.map((e: any) => (e.id === tempExp.id ? tempExp : e)),
      );
    } else {
      setExperiences([tempExp, ...experiences]);
    }
    setEditingId(null);
    setTempExp(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTempExp(null);
  };

  const editExperience = (exp: any) => {
    setTempExp({ ...exp });
    setEditingId(exp.id);
  };

  const updateTempExp = (field: string, value: any) => {
    if (tempExp) {
      setTempExp({ ...tempExp, [field]: value });
    }
  };

  return (
    <Section title="Experience" icon={Briefcase}>
      <div className="space-y-8">
        {experiences.map((exp: any, index: number) => {
          if (editingId === exp.id && tempExp) {
            return (
              <ExperienceForm
                key={tempExp.id}
                exp={tempExp}
                updateExperience={updateTempExp}
                onConfirm={confirmExperience}
                onCancel={cancelEdit}
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
              updateExperience={updateTempExp}
              onConfirm={confirmExperience}
              onCancel={cancelEdit}
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

function ExperienceForm({ exp, updateExperience, onConfirm, onCancel }: any) {
  return (
    <div className="border-[3px] border-black p-6 md:p-8 bg-zinc-50 relative group shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
      <div className="flex border-b-[3px] border-black pb-4 mb-6">
        <h3 className="text-lg font-black uppercase tracking-widest">
          {exp.companyName ? `Editing: ${exp.companyName}` : "New Experience"}
        </h3>
      </div>
      <div className="grid gap-6 md:grid-cols-2 mt-2">
        <div className="space-y-2">
          <Label>Company Name</Label>
          <Input
            value={exp.companyName}
            onChange={(e) => updateExperience("companyName", e.target.value)}
            placeholder="Acme Corp"
            className="h-[50px] w-full bg-white placeholder:text-zinc-400 focus:bg-orange-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-[3px] border-black"
          />
        </div>
        <div className="space-y-2">
          <Label>Company Website</Label>
          <Input
            value={exp.companyWebsite || ""}
            onChange={(e) => updateExperience("companyWebsite", e.target.value)}
            placeholder="https://..."
            className="h-[50px] w-full bg-white placeholder:text-zinc-400 focus:bg-orange-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-[3px] border-black"
          />
        </div>
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={clsx(
                  "w-full h-[50px] justify-start text-left font-normal border-[3px] border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white",
                  !exp.startDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {exp.startDate ? (
                  format(new Date(exp.startDate), "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 border-[3px] border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white z-100"
              align="start"
            >
              <Calendar
                mode="single"
                selected={exp.startDate ? new Date(exp.startDate) : undefined}
                onSelect={(date) => updateExperience("startDate", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2 flex flex-col justify-start">
          <Label>End Date</Label>
          {!exp.isCurrent ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={clsx(
                    "w-full h-[50px] justify-start text-left font-normal border-[3px] border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white",
                    !exp.endDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {exp.endDate ? (
                    format(new Date(exp.endDate), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 border-[3px] border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white z-100"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={exp.endDate ? new Date(exp.endDate) : undefined}
                  onSelect={(date) => updateExperience("endDate", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          ) : (
            <div className="h-[50px] w-full flex items-center px-4 border-[3px] border-black bg-zinc-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-zinc-500 font-bold">
              Present
            </div>
          )}
          <div className="flex items-center space-x-2 pt-2 h-5">
            <Checkbox
              id={`current-${exp.id}`}
              checked={exp.isCurrent}
              onCheckedChange={(checked) =>
                updateExperience("isCurrent", checked)
              }
              className="border-[3px] border-black rounded-none data-[state=checked]:bg-orange-500 data-[state=checked]:text-black"
            />
            <label
              htmlFor={`current-${exp.id}`}
              className="text-sm font-bold uppercase tracking-widest cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I currently work here
            </label>
          </div>
        </div>
        <div className="col-span-1 md:col-span-2 space-y-2 mt-2">
          <Label>Description</Label>
          <Textarea
            value={exp.description || ""}
            onChange={(e) => updateExperience("description", e.target.value)}
            placeholder="Describe your role and achievements..."
            className="min-h-[120px] w-full bg-white placeholder:text-zinc-400 focus:bg-orange-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-[3px] border-black rounded-none p-4"
          />
        </div>
      </div>
      <div className="flex gap-4 mt-8 pt-6 border-t-[3px] border-black border-dashed">
        <Button
          type="button"
          onClick={onConfirm}
          className="flex-1 h-12 text-lg"
        >
          <Check className="w-5 h-5" />
          Confirm
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
  );
}
