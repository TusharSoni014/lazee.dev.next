"use client";

import { useState } from "react";
import { motion } from "motion/react";
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
} from "lucide-react";
import clsx from "clsx";

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
    <form action={handleSubmit} className="space-y-12">
      {/* Membership & Credits */}
      <div className="grid gap-8 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-[3px] border-black bg-blue-400 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <CreditCard className="w-6 h-6 text-black" />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tighter text-black font-heading">
                Membership
              </h3>
              <p className="text-xs font-bold text-black/70 uppercase tracking-tight">
                Current plan status
              </p>
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-4xl font-black text-black font-heading uppercase">
              {user.membership}
            </span>
            <span className="text-sm font-bold text-black/70 uppercase">
              plan
            </span>
          </div>
          {user.membership === "FREE" && (
            <button
              type="button"
              className="w-full border-[3px] border-black bg-white px-4 py-2 text-sm font-black uppercase tracking-widest text-black hover:bg-zinc-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
            >
              Upgrade to Pro
            </button>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="border-[3px] border-black bg-yellow-400 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Coins className="w-6 h-6 text-black" />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tighter text-black font-heading">
                Credits
              </h3>
              <p className="text-xs font-bold text-black/70 uppercase tracking-tight">
                For AI autofills
              </p>
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-4xl font-black text-black font-heading">
              {user.credits}
            </span>
            <span className="text-sm font-bold text-black/70 uppercase">
              available
            </span>
          </div>
          <p className="text-xs font-bold uppercase tracking-tight text-black/60 border-t-[3px] border-black/10 pt-4 mt-auto">
            2 credits per AI fill
          </p>
        </motion.div>
      </div>

      {/* Personal Info */}
      <Section title="Personal Information" icon={UserIcon} delay={0.2}>
        <div className="grid gap-6 md:grid-cols-3">
          <Input
            label="First Name"
            name="firstName"
            defaultValue={user.firstName}
            placeholder="John"
          />
          <Input
            label="Middle Name"
            name="middleName"
            defaultValue={user.middleName}
            placeholder=""
          />
          <Input
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
                  className="appearance-none h-[50px] w-28 rounded-none border-[3px] border-black bg-white px-4 py-2 text-sm font-bold text-black focus:outline-none focus:bg-orange-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
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
              <input
                name="phoneNumber"
                defaultValue={user.phoneNumber}
                placeholder="1234567890"
                className="h-[50px] flex-1 rounded-none border-[3px] border-black bg-white px-4 py-2 text-sm font-bold text-black placeholder:text-zinc-400 focus:outline-none focus:bg-orange-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>
          </div>
          <Input
            label="Country"
            name="country"
            defaultValue={user.country}
            placeholder="United States"
          />
        </div>
      </Section>

      {/* Professional */}
      <Section title="Professional Details" icon={Briefcase} delay={0.3}>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Current CTC</Label>
            <div className="flex gap-4">
              <div className="relative">
                <select
                  name="currency"
                  defaultValue={user.currency || "USD"}
                  className="appearance-none h-[50px] w-24 rounded-none border-[3px] border-black bg-white px-4 py-2 text-sm font-bold text-black focus:outline-none focus:bg-orange-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
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
              <input
                name="currentCtc"
                type="number"
                step="0.01"
                defaultValue={user.currentCtc}
                placeholder="100000"
                className="h-[50px] flex-1 rounded-none border-[3px] border-black bg-white px-4 py-2 text-sm font-bold text-black placeholder:text-zinc-400 focus:outline-none focus:bg-orange-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>
          </div>
          <Input
            label="Notice Period (Days)"
            name="noticePeriod"
            type="number"
            defaultValue={user.noticePeriod}
            placeholder="30"
          />
        </div>
        <div className="mt-6">
          <Input
            label="Resume URL"
            name="resumeUrl"
            defaultValue={user.resumeUrl}
            placeholder="https://..."
            icon={FileText}
          />
        </div>
      </Section>

      {/* Socials */}
      <Section title="Social Links" icon={Globe} delay={0.4}>
        <div className="grid gap-6 md:grid-cols-2">
          <Input
            label="LinkedIn"
            name="linkedin"
            defaultValue={user.linkedin}
            placeholder="https://linkedin.com/in/..."
            icon={Linkedin}
          />
          <Input
            label="GitHub"
            name="github"
            defaultValue={user.github}
            placeholder="https://github.com/..."
            icon={Github}
          />
          <Input
            label="Twitter"
            name="twitter"
            defaultValue={user.twitter}
            placeholder="https://twitter.com/..."
            icon={Twitter}
          />
          <Input
            label="Portfolio"
            name="portfolio"
            defaultValue={user.portfolio}
            placeholder="https://..."
            icon={LinkIcon}
          />
        </div>
      </Section>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex justify-end pt-8"
      >
        <button
          type="submit"
          disabled={loading}
          className={clsx(
            "flex items-center gap-3 border-[3px] border-black px-8 py-4 text-sm font-black uppercase tracking-widest text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]",
            loading
              ? "bg-zinc-400 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600",
          )}
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              Save Changes
            </>
          )}
        </button>
      </motion.div>
    </form>
  );
}

function Section({
  title,
  icon: Icon,
  children,
  delay,
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="border-[3px] border-black bg-white p-6 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
    >
      <div className="flex items-center gap-4 mb-8 border-b-[3px] border-black pb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-black bg-zinc-100">
          <Icon className="w-6 h-6 text-black" />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tighter text-black font-heading">
          {title}
        </h2>
      </div>
      {children}
    </motion.div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-black text-black mb-2 uppercase tracking-widest">
      {children}
    </label>
  );
}

function Input({ label, icon: Icon, className, ...props }: any) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      <div className="relative">
        <input
          className={clsx(
            "h-[50px] w-full rounded-none border-[3px] border-black bg-white px-4 py-2 text-sm font-bold text-black placeholder:text-zinc-400 focus:border-black focus:outline-none focus:bg-orange-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
            Icon && "pl-12",
          )}
          {...props}
        />
        {Icon && (
          <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center border-r-[3px] border-black bg-zinc-100">
            <Icon className="h-5 w-5 text-black" />
          </div>
        )}
      </div>
    </div>
  );
}
