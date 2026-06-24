"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useProfile, useProfileStatus } from "@/hooks/useProfile";
import { ResumeManager } from "./resume-manager";
import { updateProfile, updateExperiences, updateEducation } from "./actions";
import { ProjectSection } from "./project-section";
import { UsernameManager } from "./username-manager";
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
  Video,
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
  GraduationCap,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MonthYearPicker } from "@/components/ui/month-year-picker";
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
import phoneList from "@/lib/phone_list.json";
import { Combobox } from "@/components/ui/combobox";

function getFlagEmoji(countryCode: string) {
  if (!countryCode || countryCode.length !== 2) return "";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

const phoneOptions = phoneList.map((c) => ({
  value: c.dial_code,
  key: `${c.code}-${c.dial_code}`,
  label: (
    <span className="flex items-center gap-2">
      <span>{getFlagEmoji(c.code)}</span>
      <span>{c.dial_code}</span>
      <span className="text-zinc-500 font-normal">({c.name})</span>
    </span>
  ),
  displayLabel: (
    <span className="flex items-center gap-2">
      <span>{getFlagEmoji(c.code)}</span>
      <span>{c.dial_code}</span>
    </span>
  ),
  searchString: `${c.dial_code} ${c.name} ${c.code}`,
}));

const countryOptions = phoneList.map((c) => ({
  value: c.name,
  key: c.code,
  label: (
    <span className="flex items-center gap-2">
      <span>{getFlagEmoji(c.code)}</span>
      <span>{c.name}</span>
    </span>
  ),
  displayLabel: (
    <span className="flex items-center gap-2">
      <span>{getFlagEmoji(c.code)}</span>
      <span>{c.name}</span>
    </span>
  ),
  searchString: `${c.name} ${c.code}`,
}));

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

const personalSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last Name is required"),
  countryCode: z.string().optional(),
  phoneNumber: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  collegeName: z.string().optional(),
  contactEmail: z.string().email("Invalid email address").min(1, "Contact Email is required"),
});

const professionalSchema = z.object({
  jobType: z.string().optional().nullable(),
  currency: z.string().optional().nullable(),
  currentCtc: z.string()
    .transform((val) => (val === "" ? null : Number(val)))
    .refine((val) => val === null || !isNaN(val), { message: "Must be a number" })
    .nullable()
    .optional(),
  noticePeriod: z.string()
    .transform((val) => (val === "" ? null : parseInt(val, 10)))
    .refine((val) => val === null || !isNaN(val), { message: "Must be an integer" })
    .nullable()
    .optional(),
});

const socialsSchema = z.object({
  linkedin: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  github: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  twitter: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  portfolio: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  telegram: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  other: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

const aiSettingsSchema = z.object({
  specificQuestionGuidance: z.string().optional(),
});

const coverLetterSchema = z.object({
  coverLetter: z.string().optional(),
});

interface FormInputProps {
  control: any;
  name: string;
  label: string;
  placeholder?: string;
  icon?: any;
  className?: string;
  type?: string;
}

function FormInput({ control, name, label, placeholder, icon: Icon, className, type = "text" }: FormInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={clsx("space-y-2", className)}>
          <FormLabel className="block text-[11px] font-black text-black uppercase tracking-widest pl-1">
            {label}
          </FormLabel>
          <FormControl>
            <div className="relative group">
              <Input
                type={type}
                {...field}
                value={field.value ?? ""}
                placeholder={placeholder}
                className={clsx(
                  "h-[50px] w-full bg-zinc-100 placeholder:text-zinc-400 focus:bg-orange-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-none border-[3px] border-black text-black",
                  Icon && "pl-14",
                )}
              />
              {Icon && (
                <div className="absolute left-0 top-0 bottom-0 w-[50px] flex items-center justify-center border-r-[3px] border-black bg-zinc-200">
                  <Icon className="h-5 w-5 text-black" />
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage className="text-[10px] font-black text-red-500 uppercase pl-1 mt-1" />
        </FormItem>
      )}
    />
  );
}

function PersonalInformationForm({
  user,
  refetchProfile,
  phoneOptions,
  countryOptions,
}: any) {
  const [isSaving, setIsSaving] = useState(false);

  const initialCountryCode = (() => {
    const initial = user?.countryCode || "+1";
    const clean = initial.startsWith("+") ? initial : `+${initial}`;
    const match = phoneList.find((c) => c.dial_code === clean);
    return match ? match.dial_code : clean;
  })();

  const initialCountry = (() => {
    const initial = user?.country || "";
    const exactMatch = phoneList.find(
      (c) =>
        c.name.toLowerCase() === initial.toLowerCase() ||
        c.code.toLowerCase() === initial.toLowerCase()
    );
    return exactMatch ? exactMatch.name : initial;
  })();

  const form = useForm<z.infer<typeof personalSchema>>({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      firstName: user.firstName || "",
      middleName: user.middleName || "",
      lastName: user.lastName || "",
      countryCode: initialCountryCode,
      phoneNumber: user.phoneNumber || "",
      country: initialCountry,
      city: user.city || "",
      collegeName: user.collegeName || "",
      contactEmail: user.contactEmail || user.email || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof personalSchema>) => {
    setIsSaving(true);
    const result = await updateProfile(values);
    setIsSaving(false);
    if (result.success) {
      refetchProfile();
      toast.success("Personal information updated successfully!");
    } else {
      toast.error(result.error || "Failed to update personal information.");
    }
  };

  return (
    <Section title="Personal Information" icon={IdCard}>
      <Form {...form}>
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <FormInput control={form.control} name="firstName" label="First Name" placeholder="John" />
            <FormInput control={form.control} name="middleName" label="MiddleName" placeholder="" />
            <FormInput control={form.control} name="lastName" label="Last Name" placeholder="Doe" />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="space-y-2 md:col-span-1">
                  <FormLabel className="block text-[11px] font-black text-black uppercase tracking-widest pl-1">
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Combobox
                        options={phoneOptions}
                        value={form.watch("countryCode") || ""}
                        onChange={(val) => form.setValue("countryCode", val)}
                        className="w-28 shrink-0"
                      />
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder="1234567890"
                        className="h-[50px] flex-1 bg-zinc-100 placeholder:text-zinc-400 rounded-none border-[3px] border-black text-black focus:bg-orange-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[10px] font-black text-red-500 uppercase pl-1 mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={() => (
                <FormItem className="space-y-2 md:col-span-1">
                  <FormLabel className="block text-[11px] font-black text-black uppercase tracking-widest pl-1">
                    Country
                  </FormLabel>
                  <FormControl>
                    <Combobox
                      options={countryOptions}
                      value={form.watch("country") || ""}
                      onChange={(val) => form.setValue("country", val)}
                      placeholder="Select Country"
                      searchPlaceholder="Search country..."
                    />
                  </FormControl>
                  <FormMessage className="text-[10px] font-black text-red-500 uppercase pl-1 mt-1" />
                </FormItem>
              )}
            />

            <FormInput
              control={form.control}
              name="city"
              label="City"
              placeholder="San Francisco"
              className="md:col-span-1"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <FormInput
              control={form.control}
              name="contactEmail"
              label="Contact Email"
              placeholder="your-contact-email@example.com"
              className="md:col-span-2"
            />
            <FormInput
              control={form.control}
              name="collegeName"
              label="College / University"
              placeholder="Stanford University"
              className="md:col-span-1"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="button"
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSaving}
              className="px-6 py-4 tracking-wider bg-orange-500 hover:bg-orange-600 border-[3px] border-black text-black font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all rounded-none"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Personal Info
                </>
              )}
            </Button>
          </div>
        </div>
      </Form>
    </Section>
  );
}

function ProfessionalDetailsForm({ user, refetchProfile }: any) {
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<z.infer<typeof professionalSchema>>({
    resolver: zodResolver(professionalSchema) as any,
    defaultValues: {
      jobType: user.jobType || "",
      currency: user.currency || "USD",
      currentCtc: (user.currentCtc !== null && user.currentCtc !== undefined ? String(user.currentCtc) : "") as any,
      noticePeriod: (user.noticePeriod !== null && user.noticePeriod !== undefined ? String(user.noticePeriod) : "") as any,
    },
  });

  const onSubmit = async (values: z.infer<typeof professionalSchema>) => {
    setIsSaving(true);
    const result = await updateProfile(values);
    setIsSaving(false);
    if (result.success) {
      refetchProfile();
      toast.success("Professional details updated successfully!");
    } else {
      toast.error(result.error || "Failed to update professional details.");
    }
  };

  return (
    <Section title="Professional Details" icon={Briefcase}>
      <Form {...form}>
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="jobType"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="block text-[11px] font-black text-black uppercase tracking-widest pl-1">
                    Looking For Role
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
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
                  </FormControl>
                  <FormMessage className="text-[10px] font-black text-red-500 uppercase pl-1 mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currentCtc"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="block text-[11px] font-black text-black uppercase tracking-widest pl-1">
                    Current CTC
                  </FormLabel>
                  <FormControl>
                    <div className="flex gap-4">
                      <div className="relative">
                        <select
                          value={form.watch("currency") || "USD"}
                          onChange={(e) => form.setValue("currency", e.target.value)}
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
                        type="number"
                        step="0.01"
                        {...field}
                        value={field.value ?? ""}
                        placeholder="100000"
                        className="h-[50px] flex-1 bg-zinc-100 placeholder:text-zinc-400 rounded-none border-[3px] border-black text-black focus:bg-orange-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[10px] font-black text-red-500 uppercase pl-1 mt-1" />
                </FormItem>
              )}
            />

            <FormInput
              control={form.control}
              name="noticePeriod"
              label="Notice Period (Days)"
              type="number"
              placeholder="30"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="button"
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSaving}
              className="px-6 py-4 tracking-wider bg-orange-500 hover:bg-orange-600 border-[3px] border-black text-black font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all rounded-none"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Professional Details
                </>
              )}
            </Button>
          </div>
        </div>
      </Form>
    </Section>
  );
}

function SocialLinksForm({ user, refetchProfile }: any) {
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<z.infer<typeof socialsSchema>>({
    resolver: zodResolver(socialsSchema),
    defaultValues: {
      linkedin: user.linkedin || "",
      github: user.github || "",
      twitter: user.twitter || "",
      portfolio: user.portfolio || "",
      telegram: user.telegram || "",
      other: user.other || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof socialsSchema>) => {
    setIsSaving(true);
    const result = await updateProfile(values);
    setIsSaving(false);
    if (result.success) {
      refetchProfile();
      toast.success("Social links updated successfully!");
    } else {
      toast.error(result.error || "Failed to update social links.");
    }
  };

  return (
    <Section title="Social Links" icon={Globe}>
      <Form {...form}>
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <FormInput control={form.control} name="linkedin" label="LinkedIn" placeholder="https://linkedin.com/in/..." icon={Linkedin} />
            <FormInput control={form.control} name="github" label="GitHub" placeholder="https://github.com/..." icon={Github} />
            <FormInput control={form.control} name="twitter" label="Twitter" placeholder="https://twitter.com/..." icon={Twitter} />
            <FormInput control={form.control} name="portfolio" label="Portfolio" placeholder="https://..." icon={LinkIcon} />
            <FormInput control={form.control} name="telegram" label="Telegram" placeholder="https://t.me/..." icon={Send} />
            <FormInput control={form.control} name="other" label="Other Link" placeholder="https://..." icon={LinkIcon} />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="button"
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSaving}
              className="px-6 py-4 tracking-wider bg-orange-500 hover:bg-orange-600 border-[3px] border-black text-black font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all rounded-none"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Social Links
                </>
              )}
            </Button>
          </div>
        </div>
      </Form>
    </Section>
  );
}

function AiSettingsForm({ user, refetchProfile }: any) {
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<z.infer<typeof aiSettingsSchema>>({
    resolver: zodResolver(aiSettingsSchema),
    defaultValues: {
      specificQuestionGuidance: user.specificQuestionGuidance || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof aiSettingsSchema>) => {
    setIsSaving(true);
    const result = await updateProfile(values);
    setIsSaving(false);
    if (result.success) {
      refetchProfile();
      toast.success("AI Settings updated successfully!");
    } else {
      toast.error(result.error || "Failed to update AI Settings.");
    }
  };

  return (
    <Section title="AI Settings" icon={Settings}>
      <Form {...form}>
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="specificQuestionGuidance"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="block text-[11px] font-black text-black uppercase tracking-widest pl-1">
                  Specific Question Guidance (Optional)
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Mention any extra and specific detail to provide for the AI..."
                    className="min-h-[120px] w-full bg-zinc-100 placeholder:text-zinc-400 focus:bg-orange-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-[3px] border-black rounded-none p-4 font-bold text-black"
                  />
                </FormControl>
                <FormMessage className="text-[10px] font-black text-red-500 uppercase pl-1 mt-1" />
                <p className="text-xs font-bold text-zinc-500 pt-1 uppercase tracking-widest">
                  Mention extra and specific detail to provide for the AI.
                </p>
              </FormItem>
            )}
          />

          <div className="flex justify-end pt-2">
            <Button
              type="button"
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSaving}
              className="px-6 py-4 tracking-wider bg-orange-500 hover:bg-orange-600 border-[3px] border-black text-black font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all rounded-none"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save AI Settings
                </>
              )}
            </Button>
          </div>
        </div>
      </Form>
    </Section>
  );
}

function CoverLetterForm({ user, refetchProfile }: any) {
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<z.infer<typeof coverLetterSchema>>({
    resolver: zodResolver(coverLetterSchema),
    defaultValues: {
      coverLetter: user.coverLetter || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof coverLetterSchema>) => {
    setIsSaving(true);
    const result = await updateProfile(values);
    setIsSaving(false);
    if (result.success) {
      refetchProfile();
      toast.success("Cover letter updated successfully!");
    } else {
      toast.error(result.error || "Failed to update cover letter.");
    }
  };

  return (
    <Section title="Cover Letter" icon={FileText}>
      <Form {...form}>
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="coverLetter"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="block text-[11px] font-black text-black uppercase tracking-widest pl-1">
                  Default Cover Letter (Optional)
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Write your default cover letter here. This will be available in the extension's Profile tab for quick autofill on job applications..."
                    className="min-h-[200px] w-full bg-zinc-100 placeholder:text-zinc-400 focus:bg-orange-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-[3px] border-black rounded-none p-4 font-bold text-black"
                  />
                </FormControl>
                <FormMessage className="text-[10px] font-black text-red-500 uppercase pl-1 mt-1" />
              </FormItem>
            )}
          />

          <div className="flex justify-end pt-2">
            <Button
              type="button"
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSaving}
              className="px-6 py-4 tracking-wider bg-orange-500 hover:bg-orange-600 border-[3px] border-black text-black font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all rounded-none"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Cover Letter
                </>
              )}
            </Button>
          </div>
        </div>
      </Form>
    </Section>
  );
}

export default function ProfileForm({
  user: initialUser,
  paymentSuccess = false,
}: {
  user: any;
  paymentSuccess?: boolean;
}) {
  const { data: user, isLoading: isLoadingProfile, refetch: refetchProfile } = useProfile(initialUser);
  const { data: status, refetch: refetchStatus } = useProfileStatus({
    membership: initialUser.membership,
    credits: initialUser.credits,
    dodoCustomerId: initialUser.dodoCustomerId,
  });

  const displayName = 
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() || 
    user?.name || 
    "Anonymous User";

  const initials = (() => {
    if (!user) return "";
    if (user.firstName || user.lastName) {
      return `${user.firstName ? user.firstName[0] : ""}${user.lastName ? user.lastName[0] : ""}`.toUpperCase();
    }
    if (user.name) {
      const parts = user.name.trim().split(/\s+/);
      if (parts.length > 1) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
      }
      return parts[0][0]?.toUpperCase() || "";
    }
    return "";
  })();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [activating, setActivating] = useState(paymentSuccess);
  const [experiences, setExperiences] = useState<any[]>(
    user?.experiences || [],
  );
  const [projects, setProjects] = useState<any[]>(user?.projects || []);
  const [educations, setEducations] = useState<any[]>(user?.educations || []);

  useEffect(() => {
    if (user) {
      if (user.experiences) setExperiences(user.experiences);
      if (user.projects) setProjects(user.projects);
      if (user.educations) setEducations(user.educations);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      window.postMessage({ type: "LAZEE_SYNC_AUTH" }, window.location.origin);
    }
  }, [user]);

  // Poll for Pro membership after a successful payment redirect
  useEffect(() => {
    if (!paymentSuccess) return;

    // Clean up the URL query params immediately to keep the address bar clean
    const url = new URL(window.location.href);
    let changed = false;
    for (const key of ["payment", "subscription_id", "status", "email"]) {
      if (url.searchParams.has(key)) {
        url.searchParams.delete(key);
        changed = true;
      }
    }
    if (changed) {
      window.history.replaceState({}, "", url.toString());
    }

    if (status?.membership === "PRO") {
      setActivating(false);
      return;
    }
    let tries = 0;
    const MAX_TRIES = 20;
    const interval = setInterval(async () => {
      tries++;
      try {
        await refetchStatus();
      } catch {}
      if (tries >= MAX_TRIES) {
        clearInterval(interval);
        setActivating(false);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [paymentSuccess, status?.membership, refetchStatus]);

  if (!user) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  async function handleUpgrade() {
    setIsCheckingOut(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_cart: [
            { product_id: "pdt_0NayYkMQdxcLwDxT4hxDk", quantity: 1 },
          ],
          customer: {
            email: user.email,
            name:
              [user.firstName, user.lastName].filter(Boolean).join(" ") ||
              user.name ||
              user.email,
          },
          return_url: `${window.location.origin}/profile?payment=success`,
        }),
      });
      if (!res.ok) throw new Error("Failed to create checkout session");
      const { checkout_url } = await res.json();
      window.location.href = checkout_url;
    } catch {
      toast.error("Could not start checkout. Please try again.");
      setIsCheckingOut(false);
    }
  }

  function handleManageSubscription() {
    if (!status?.dodoCustomerId) {
      toast.error("No subscription found.");
      return;
    }
    window.location.href = `/api/customer-portal?customer_id=${status.dodoCustomerId}`;
  }

  return (
    <div className="space-y-10">
      {/* Payment Success Banner */}
      {activating && status?.membership !== "PRO" && (
        <div className="flex items-center gap-4 border-[3px] border-black bg-yellow-400 px-6 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <Loader2 className="w-5 h-5 shrink-0 animate-spin text-black" />
          <div>
            <p className="font-black uppercase text-black tracking-tight">
              Activating your Pro subscription...
            </p>
            <p className="text-sm font-bold text-black/70">
              Payment received. Your credits and Pro badge will appear in a
              moment — hang tight!
            </p>
          </div>
        </div>
      )}
      {activating && status?.membership === "PRO" && (
        <div className="flex items-center gap-4 border-[3px] border-black bg-green-400 px-6 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <Check className="w-5 h-5 shrink-0 text-black" strokeWidth={3} />
          <p className="font-black uppercase text-black tracking-tight">
            You&apos;re now Pro! Your 10,000 credits are ready.
          </p>
        </div>
      )}
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
                {initials || <UserIcon className="w-12 h-12" />}
              </span>
            )}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-black uppercase font-heading text-black tracking-tighter">
                {displayName}
              </h2>
              <p className="text-sm font-bold text-zinc-600 uppercase tracking-widest mt-1">
                {user.email || "No Email"}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <div
                className={clsx(
                  "inline-flex items-center gap-2 border-[3px] border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                  status?.membership === "PRO"
                    ? "bg-[linear-gradient(110deg,#FFD700_30%,#fffac7_50%,#FFD700_70%)] bg-[length:200%_100%] animate-shimmer"
                    : "bg-blue-400",
                )}
              >
                <CreditCard
                  className={clsx(
                    "w-5 h-5 text-black",
                    status?.membership === "PRO" && "animate-pulse",
                  )}
                />
                <span className="font-black uppercase tracking-tight text-black flex items-center gap-2">
                  {status?.membership} PLAN
                </span>
              </div>
              {status?.membership === "FREE" ? (
                <Button
                  type="button"
                  size="sm"
                  onClick={handleUpgrade}
                  disabled={isCheckingOut}
                  className="bg-black text-white hover:bg-zinc-800 tracking-widest uppercase font-bold px-4 py-2 h-auto disabled:opacity-60"
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Redirecting...
                    </>
                  ) : (
                    "Upgrade to Pro"
                  )}
                </Button>
              ) : (
                <Button
                  type="button"
                  size="icon"
                  onClick={handleManageSubscription}
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
              {Intl.NumberFormat("en-US").format(status?.credits ?? 0)}
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

      {/* Username / Public Profile Link */}
      <UsernameManager
        currentUsername={user.username}
        resumes={user.resumes || []}
        contactEmail={user.contactEmail}
        currentEmail={user.email}
      />

      <PersonalInformationForm
        user={user}
        refetchProfile={refetchProfile}
        phoneOptions={phoneOptions}
        countryOptions={countryOptions}
      />

      <ProfessionalDetailsForm
        user={user}
        refetchProfile={refetchProfile}
      />

      <div
        className="space-y-10"
        onChange={(e) => e.stopPropagation()}
        onInput={(e) => e.stopPropagation()}
      >
        <ExperienceSection
          experiences={experiences}
          setExperiences={setExperiences}
          refetchProfile={refetchProfile}
        />

        <EducationSection
          educations={educations}
          setEducations={setEducations}
          refetchProfile={refetchProfile}
        />

        <ProjectSection
          projects={projects}
          setProjects={setProjects}
          membership={status?.membership || "FREE"}
        />

        <ResumeManager
          resumes={user.resumes || []}
          membership={status?.membership || "FREE"}
        />
      </div>

      <SkillsSection
        skills={user.skills || []}
        refetchProfile={refetchProfile}
      />

      <SocialLinksForm
        user={user}
        refetchProfile={refetchProfile}
      />

      <IntroVideoForm
        user={user}
        refetchProfile={refetchProfile}
      />

      <AiSettingsForm
        user={user}
        refetchProfile={refetchProfile}
      />

      <CoverLetterForm
        user={user}
        refetchProfile={refetchProfile}
      />
    </div>
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

function ExperienceSection({ experiences, setExperiences, refetchProfile }: any) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempExp, setTempExp] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
    setDeletingId(id);
    const newExperiences = experiences.filter((exp: any) => exp.id !== id);
    try {
      const result = await updateExperiences(newExperiences);
      if (result.success) {
        setExperiences(newExperiences);
        if (editingId === id) cancelEdit();
        toast.success("Experience removed");
        refetchProfile();
      } else {
        toast.error("Failed to remove experience");
      }
    } catch {
      toast.error("Failed to remove experience");
    } finally {
      setDeletingId(null);
    }
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
      refetchProfile();
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
              <div className={clsx(
                "absolute right-4 top-4 flex gap-2 transition-opacity",
                deletingId === exp.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              )}>
                <Button
                  type="button"
                  onClick={() => editExperience(exp)}
                  disabled={deletingId === exp.id}
                  className="bg-white border-[3px] border-black text-black hover:bg-orange-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] h-10 w-10 p-0 rounded-none transition-all disabled:opacity-50"
                  title="Edit Experience"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  onClick={() => removeExperience(exp.id)}
                  disabled={!!deletingId}
                  className="bg-white border-[3px] border-black text-red-500 hover:text-red-600 hover:bg-red-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] h-10 w-10 p-0 rounded-none transition-all disabled:opacity-50"
                  title="Remove Experience"
                >
                  {deletingId === exp.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
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

const educationSchema = z.object({
  id: z.string().optional(),
  schoolName: z.string().min(1, "School / College name is required"),
  degree: z.string().optional(),
  fieldOfStudy: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  isCurrent: z.boolean(),
  description: z.string().optional(),
});

function EducationSection({ educations, setEducations, refetchProfile }: any) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempEdu, setTempEdu] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const addEducation = () => {
    const newEdu = {
      id: crypto.randomUUID(),
      schoolName: "",
      degree: "",
      fieldOfStudy: "",
      startDate: new Date(),
      endDate: null,
      isCurrent: false,
      description: "",
    };
    setTempEdu(newEdu);
    setEditingId(newEdu.id);
  };

  const removeEducation = async (id: string) => {
    setDeletingId(id);
    const newEducations = educations.filter((edu: any) => edu.id !== id);
    try {
      const result = await updateEducation(newEducations);
      if (result.success) {
        setEducations(newEducations);
        if (editingId === id) cancelEdit();
        toast.success("Education removed");
        refetchProfile();
      } else {
        toast.error("Failed to remove education");
      }
    } catch {
      toast.error("Failed to remove education");
    } finally {
      setDeletingId(null);
    }
  };

  const confirmEducation = async (data: any) => {
    setIsSaving(true);
    let newEducations;
    const exists = educations.find((e: any) => e.id === data.id);
    if (exists) {
      newEducations = educations.map((e: any) =>
        e.id === data.id ? data : e,
      );
    } else {
      newEducations = [data, ...educations];
    }

    // Sort before saving
    newEducations.sort((a: any, b: any) => {
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

    const result = await updateEducation(newEducations);
    setIsSaving(false);

    if (result.success) {
      setEducations(newEducations);
      setEditingId(null);
      setTempEdu(null);
      toast.success("Education saved successfully");
      refetchProfile();
    } else {
      toast.error("Failed to save education");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTempEdu(null);
  };

  const editEducation = (edu: any) => {
    setTempEdu({ ...edu });
    setEditingId(edu.id);
  };

  const sortedEducations = [...educations].sort((a: any, b: any) => {
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
    <Section title="Education" icon={GraduationCap}>
      <div className="space-y-8">
        {sortedEducations.map((edu: any, index: number) => {
          if (editingId === edu.id && tempEdu) {
            return (
              <EducationForm
                key={tempEdu.id}
                edu={tempEdu}
                onConfirm={confirmEducation}
                onCancel={cancelEdit}
                isLoading={isSaving}
              />
            );
          }

          return (
            <div
              key={edu.id || index}
              className="border-[3px] border-black p-6 bg-zinc-50 relative group shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col gap-2"
            >
              <div className={clsx(
                "absolute right-4 top-4 flex gap-2 transition-opacity",
                deletingId === edu.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              )}>
                <Button
                  type="button"
                  onClick={() => editEducation(edu)}
                  disabled={deletingId === edu.id}
                  className="bg-white border-[3px] border-black text-black hover:bg-orange-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] h-10 w-10 p-0 rounded-none transition-all disabled:opacity-50"
                  title="Edit Education"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  onClick={() => removeEducation(edu.id)}
                  disabled={!!deletingId}
                  className="bg-white border-[3px] border-black text-red-500 hover:text-red-600 hover:bg-red-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] h-10 w-10 p-0 rounded-none transition-all disabled:opacity-50"
                  title="Remove Education"
                >
                  {deletingId === edu.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <h3 className="text-xl font-black text-black uppercase pr-24">
                {edu.schoolName || "Untitled Institution"}
              </h3>
              {edu.degree && (
                <p className="text-sm font-bold text-black uppercase tracking-wider">
                  {edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                </p>
              )}
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">
                {edu.startDate
                  ? format(new Date(edu.startDate), "MMM yyyy")
                  : "N/A"}{" "}
                -{" "}
                {edu.isCurrent
                  ? "Present"
                  : edu.endDate
                    ? format(new Date(edu.endDate), "MMM yyyy")
                    : "N/A"}
              </p>
              {edu.description && (
                <p className="text-sm text-zinc-700 mt-4 whitespace-pre-wrap font-medium">
                  {edu.description}
                </p>
              )}
            </div>
          );
        })}

        {editingId &&
          !educations.find((e: any) => e.id === editingId) &&
          tempEdu && (
            <EducationForm
              edu={tempEdu}
              onConfirm={confirmEducation}
              onCancel={cancelEdit}
              isLoading={isSaving}
            />
          )}

        {!editingId && (
          <Button
            type="button"
            onClick={addEducation}
            className="w-full h-14 bg-white border-[3px] border-black text-black hover:bg-orange-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all rounded-none font-black uppercase tracking-widest flex items-center justify-center gap-2 text-lg mt-6"
          >
            <Plus className="w-6 h-6" />
            Add Education
          </Button>
        )}
      </div>
    </Section>
  );
}

function EducationForm({ edu, onConfirm, onCancel, isLoading }: any) {
  const form = useForm<z.infer<typeof educationSchema>>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      id: edu.id,
      schoolName: edu.schoolName || "",
      degree: edu.degree || "",
      fieldOfStudy: edu.fieldOfStudy || "",
      startDate: edu.startDate ? new Date(edu.startDate) : undefined,
      endDate: edu.endDate ? new Date(edu.endDate) : undefined,
      isCurrent: edu.isCurrent || false,
      description: edu.description || "",
    },
  });

  const onSubmit = (values: z.infer<typeof educationSchema>) => {
    onConfirm(values);
  };

  return (
    <div className="border-[3px] border-black p-6 md:p-8 bg-zinc-50 relative group shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
      <div className="flex border-b-[3px] border-black pb-4 mb-6">
        <h3 className="text-lg font-black uppercase tracking-widest">
          {edu.schoolName ? `Editing: ${edu.schoolName}` : "New Education"}
        </h3>
      </div>
      <Form {...form}>
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 mt-2">
            <FormField
              control={form.control}
              name="schoolName"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[11px] font-black text-black uppercase tracking-widest pl-1">
                    School / College Name *
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Stanford University"
                      className="h-[50px] w-full bg-white placeholder:text-zinc-400 focus:bg-orange-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-[3px] border-black"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="degree"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[11px] font-black text-black uppercase tracking-widest pl-1">
                    Degree / Certification
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Bachelor of Science"
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
              name="fieldOfStudy"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[11px] font-black text-black uppercase tracking-widest pl-1">
                    Field of Study
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Computer Science"
                      className="h-[50px] w-full bg-white placeholder:text-zinc-400 focus:bg-orange-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-[3px] border-black"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-end h-[50px] pb-3 pl-2">
              <FormField
                control={form.control}
                name="isCurrent"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          if (checked) {
                            form.setValue("endDate", undefined);
                          }
                        }}
                        className="h-6 w-6 rounded-none border-[3px] border-black data-[state=checked]:bg-orange-500 data-[state=checked]:text-black"
                      />
                    </FormControl>
                    <FormLabel className="text-xs font-black uppercase text-black tracking-widest select-none cursor-pointer">
                      Currently Studying Here
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mt-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="space-y-2 flex flex-col">
                  <FormLabel className="text-[11px] font-black text-black uppercase tracking-widest pl-1">
                    Start Date
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={clsx(
                            "h-[50px] w-full justify-start text-left font-bold rounded-none border-[3px] border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                            !field.value && "text-zinc-400"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 shrink-0 text-black" />
                          {field.value ? (
                            format(field.value, "MMM yyyy")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-none border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <MonthYearPicker
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!form.watch("isCurrent") && (
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="space-y-2 flex flex-col">
                    <FormLabel className="text-[11px] font-black text-black uppercase tracking-widest pl-1">
                      End Date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={clsx(
                              "h-[50px] w-full justify-start text-left font-bold rounded-none border-[3px] border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                              !field.value && "text-zinc-400"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 shrink-0 text-black" />
                            {field.value ? (
                              format(field.value, "MMM yyyy")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-none border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <MonthYearPicker
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="space-y-2 mt-4">
                <FormLabel className="text-[11px] font-black text-black uppercase tracking-widest pl-1">
                  Description / Details
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Relevant coursework, achievements, or activities..."
                    className="min-h-[100px] w-full bg-white placeholder:text-zinc-400 focus:bg-orange-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-[3px] border-black rounded-none p-4 font-bold text-black"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-4 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="px-6 py-4 tracking-wider bg-white hover:bg-zinc-100 border-[3px] border-black text-black font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all rounded-none"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={form.handleSubmit(onSubmit)}
              disabled={isLoading}
              className="px-6 py-4 tracking-wider bg-orange-500 hover:bg-orange-600 border-[3px] border-black text-black font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all rounded-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Confirm Education
                </>
              )}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}

const videoHelpers = {
  getYoutubeId: (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  },
  getLoomId: (url: string) => {
    const regExp = /loom\.com\/(share|embed)\/([a-zA-Z0-9]+)/;
    const match = url.match(regExp);
    return match ? match[2] : null;
  }
};

const introVideoSchema = z.object({
  introVideo: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        return !!videoHelpers.getYoutubeId(val) || !!videoHelpers.getLoomId(val);
      },
      { message: "Must be a valid YouTube or Loom video link" }
    ),
});

function IntroVideoForm({ user, refetchProfile }: any) {
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<z.infer<typeof introVideoSchema>>({
    resolver: zodResolver(introVideoSchema),
    defaultValues: {
      introVideo: user.introVideo || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof introVideoSchema>) => {
    setIsSaving(true);
    const result = await updateProfile(values);
    setIsSaving(false);
    if (result.success) {
      refetchProfile();
      toast.success("Intro video updated successfully!");
    } else {
      toast.error(result.error || "Failed to update intro video.");
    }
  };

  const introVideoVal = form.watch("introVideo") || "";
  const ytId = videoHelpers.getYoutubeId(introVideoVal);
  const lId = videoHelpers.getLoomId(introVideoVal);
  const embedUrl = ytId 
    ? `https://www.youtube.com/embed/${ytId}` 
    : lId 
      ? `https://www.loom.com/embed/${lId}` 
      : null;

  return (
    <Section title="Intro Video" icon={Video}>
      <Form {...form}>
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="introVideo"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="block text-[11px] font-black text-black uppercase tracking-widest pl-1">
                  Intro Video Link (YouTube or Loom)
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="https://www.youtube.com/watch?v=... or https://www.loom.com/share/..."
                    className="h-[50px] w-full bg-zinc-100 placeholder:text-zinc-400 focus:bg-orange-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-[3px] border-black rounded-none px-4 font-bold text-black"
                  />
                </FormControl>
                <FormMessage className="text-[10px] font-black text-red-500 uppercase pl-1 mt-1" />
                <p className="text-xs font-bold text-zinc-500 pt-1 uppercase tracking-widest">
                  Provide a YouTube link or Loom link to introduce yourself.
                </p>
              </FormItem>
            )}
          />

          {embedUrl ? (
            <div className="mt-6">
              <p className="text-[11px] font-black text-black uppercase tracking-widest mb-2 pl-1">Video Preview:</p>
              <div className="aspect-video w-full max-w-2xl border-[3px] border-black bg-zinc-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                <iframe
                  src={embedUrl}
                  className="absolute inset-0 w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                />
              </div>
            </div>
          ) : (
            introVideoVal && (
              <div className="mt-6 border-[3px] border-dashed border-red-400 bg-red-50 p-4 text-center">
                <p className="text-xs font-bold text-red-500 uppercase tracking-wider">
                  Please enter a valid YouTube (watch / youtu.be) or Loom (share) link.
                </p>
              </div>
            )
          )}

          <div className="flex justify-end pt-2">
            <Button
              type="button"
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSaving || !form.formState.isValid}
              className="px-6 py-4 tracking-wider bg-orange-500 hover:bg-orange-600 border-[3px] border-black text-black font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all rounded-none"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Intro Video
                </>
              )}
            </Button>
          </div>
        </div>
      </Form>
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
                            format(field.value, "MMM yyyy")
                          ) : (
                            <span>Select month</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 rounded-none border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                      align="start"
                    >
                      <MonthYearPicker
                        value={field.value}
                        onChange={field.onChange}
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
                            format(field.value, "MMM yyyy")
                          ) : (
                            <span>
                              {form.watch("isCurrent")
                                ? "Present"
                                : "Select month"}
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
                      <MonthYearPicker
                        value={field.value}
                        onChange={field.onChange}
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
  refetchProfile,
}: {
  skills: string[];
  refetchProfile: () => Promise<any>;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set(initialSkills));
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSelected(new Set(initialSkills));
  }, [initialSkills]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await updateProfile({ skills: Array.from(selected) });
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Skills updated successfully!");
        await refetchProfile();
      }
    } catch (err) {
      toast.error("Failed to save skills.");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredSkills = AVAILABLE_SKILLS.filter((skill) =>
    skill.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Section title="Technical Skills" icon={Code}>
      <div className="space-y-6">
        {/* Existing skills container */}
        <div className="w-full min-h-[80px] border-[3px] border-black p-4 bg-zinc-50 flex flex-wrap gap-2 items-center shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05)]">
          {selected.size > 0 ? (
            Array.from(selected).map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 bg-yellow-300 border-[2px] border-black px-2.5 py-1 text-xs font-black uppercase text-black"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => {
                    const next = new Set(selected);
                    next.delete(skill);
                    setSelected(next);
                  }}
                  className="ml-1 hover:bg-black hover:text-white rounded-full p-[1px] transition-colors inline-flex items-center justify-center"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))
          ) : (
            <span className="text-zinc-500 font-bold uppercase tracking-widest text-xs py-2 pl-1">
              No skills selected. Click &quot;Add Skills&quot; below to add.
            </span>
          )}
        </div>

        {/* Add Skills Button and Popover */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="h-[50px] inline-flex items-center gap-2 border-[3px] border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 bg-white py-3 px-6 font-black uppercase text-xs text-black transition-all"
              >
                <Plus className="h-4 w-4 text-black border-black border-2 rounded-none p-0 bg-yellow-400" />
                Add Skills
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[280px] p-0 border-[3px] border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white z-50"
              align="start"
            >
              <div className="p-3 border-b-[3px] border-black bg-zinc-50">
                <Input
                  type="text"
                  placeholder="Search skills..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-10 w-full bg-white placeholder:text-zinc-400 border-[2px] border-black rounded-none px-3 py-1 font-bold text-xs"
                />
              </div>
              <div className="max-h-60 overflow-y-auto p-4 flex flex-col gap-3">
                {filteredSkills.length > 0 ? (
                  filteredSkills.map((skill) => {
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
                  })
                ) : (
                  <p className="text-zinc-500 font-bold uppercase text-xs text-center py-2">
                    No matching skills
                  </p>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Save Button */}
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="h-[50px] px-6 py-4 tracking-wider bg-orange-500 hover:bg-orange-600 border-[3px] border-black text-black font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all rounded-none"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Skills
              </>
            )}
          </Button>
        </div>
      </div>
    </Section>
  );
}
