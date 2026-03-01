"use client";

import { useState } from "react";
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

export default function ProfileForm({ user }: { user: any }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);

    const data = Object.fromEntries(formData);
    const result = await updateProfile(data);

    setLoading(false);
    if (result.success) {
      toast.success("Profile updated successfully!");
    } else {
      toast.error("Failed to update profile.");
    }
  }

  return (
    <form action={handleSubmit} className="space-y-10">
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
              {user.credits}
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
