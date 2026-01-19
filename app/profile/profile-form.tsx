"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { updateProfile } from "./actions";
import {
  Loader2,
  Save,
  User as UserIcon,
  FileText,
  Phone,
  Globe,
  Briefcase,
  DollarSign,
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
  // Add more as needed
];

const CURRENCIES = ["USD", "EUR", "GBP", "INR", "AUD", "CAD", "JPY"];

export default function ProfileForm({ user }: { user: any }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setSuccess(false);

    const data = Object.fromEntries(formData);
    const result = await updateProfile(data);

    setLoading(false);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      {/* Membership & Credits */}
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-full bg-purple-500/10 text-purple-400">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Membership</h3>
              <p className="text-sm text-zinc-400">Current plan status</p>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">
              {user.membership}
            </span>
            <span className="text-sm text-zinc-500">plan</span>
          </div>
          {user.membership === "FREE" && (
            <button
              type="button"
              className="mt-4 text-sm font-medium text-purple-400 hover:text-purple-300"
            >
              Upgrade to Pro &rarr;
            </button>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-full bg-yellow-500/10 text-yellow-400">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Credits</h3>
              <p className="text-sm text-zinc-400">For AI autofills</p>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">
              {user.credits}
            </span>
            <span className="text-sm text-zinc-500">available</span>
          </div>
          <p className="mt-4 text-xs text-zinc-500">2 credits per AI fill</p>
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
            <div className="flex gap-2">
              <select
                name="countryCode"
                defaultValue={user.countryCode || "+1"}
                className="w-24 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-white focus:outline-none focus:ring-0"
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.name})
                  </option>
                ))}
              </select>
              <input
                name="phoneNumber"
                defaultValue={user.phoneNumber}
                placeholder="1234567890"
                className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-white focus:outline-none focus:ring-0"
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
            <div className="flex gap-2">
              <select
                name="currency"
                defaultValue={user.currency || "USD"}
                className="w-24 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-white focus:outline-none focus:ring-0"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <input
                name="currentCtc"
                type="number"
                step="0.01"
                defaultValue={user.currentCtc}
                placeholder="100000"
                className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-white focus:outline-none focus:ring-0"
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
        className="flex justify-end pt-4"
      >
        <button
          type="submit"
          disabled={loading}
          className={clsx(
            "flex items-center gap-2 rounded-full px-8 py-3 text-sm font-semibold text-white transition-all",
            loading
              ? "bg-zinc-800 cursor-not-allowed"
              : "bg-white text-black hover:bg-zinc-200",
          )}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </button>
      </motion.div>

      {success && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-8 right-8 rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3 text-green-400"
        >
          Profile updated successfully
        </motion.div>
      )}
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
      className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <Icon className="w-5 h-5 text-zinc-400" />
        <h2 className="text-xl font-semibold text-zinc-200">{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
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
            "w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-white focus:outline-none focus:ring-0 transition-colors",
            Icon && "pl-10",
          )}
          {...props}
        />
        {Icon && (
          <Icon className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
        )}
      </div>
    </div>
  );
}
