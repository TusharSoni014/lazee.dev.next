"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useProfile, useProfileStatus } from "@/hooks/useProfile";
import { useDebounceCallback } from "@/hooks/useDebounce";
import { ResumeManager } from "./resume-manager";
import { ResumeAutofillUpload } from "./resume-autofill-upload";
import { updateProfile, updateExperiences, updateEducation } from "./actions";
import { ProjectSection } from "./project-section";
import { UsernameManager } from "./username-manager";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { useResumeStore } from "@/store/useResumeStore";
import { toast } from "@/components/ui/toast";
import Loading from "@/components/loading";
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
  Zap,
  IdCard,
  Settings,
  Send,
  Video,
  Plus,
  Trash2,
  Calendar as CalendarIcon,
  Edit2,
  X,
  Check,
  Copy,
  Code,
  GraduationCap,
  ChevronDown,
} from "lucide-react";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
      <span className="font-medium">{c.dial_code}</span>
      <span className="text-zinc-500 dark:text-zinc-400 font-normal">
        ({c.name})
      </span>
    </span>
  ),
  displayLabel: (
    <span className="flex items-center gap-1.5">
      <span>{getFlagEmoji(c.code)}</span>
      <span>{c.dial_code}</span>
    </span>
  ),
  searchString: `${c.dial_code} ${c.name} ${c.code}`,
}));

const countryOptions = phoneList.map((c) => ({
  value: c.name,
  key: `${c.code}-${c.name}`,
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
  searchString: `${c.name} ${c.code} ${c.dial_code}`,
}));

const JOB_TYPES = [
  "Software Engineer",
  "Frontend Engineer",
  "Backend Engineer",
  "Full Stack Engineer",
  "Mobile Engineer (iOS/Android)",
  "DevOps / SRE Engineer",
  "Data Scientist / ML Engineer",
  "Product Manager",
  "Engineering Manager",
  "UI/UX Designer",
  "QA / Test Engineer",
  "Security Engineer",
  "Other",
];

const CURRENCIES = ["USD", "INR", "EUR", "GBP", "CAD", "AUD"];

const personalSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  countryCode: z.string().min(1, "Country code is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  collegeName: z.string().optional(),
  contactEmail: z
    .string()
    .email("Must be a valid email")
    .optional()
    .or(z.literal("")),
  postalCode: z.string().optional(),
  genderSelect: z.string().optional(),
  genderCustom: z.string().optional(),
  veteranStatusSelect: z.string().optional(),
  veteranStatusCustom: z.string().optional(),
  disabilityStatusSelect: z.string().optional(),
  disabilityStatusCustom: z.string().optional(),
});

const professionalSchema = z.object({
  jobType: z.string().optional(),
  currency: z.string().optional(),
  currentCtc: z.preprocess((val) => {
    if (val === "" || val === null || val === undefined) return null;
    const num = Number(val);
    return isNaN(num) ? null : num;
  }, z.number().nullable().optional()),
  noticePeriod: z.preprocess((val) => {
    if (val === "" || val === null || val === undefined) return null;
    const num = Number(val);
    return isNaN(num) ? null : num;
  }, z.number().nullable().optional()),
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

function FormInput({
  control,
  name,
  label,
  placeholder,
  icon: Icon,
  className,
  type = "text",
}: FormInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={clsx("space-y-1.5", className)}>
          <FormLabel className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            {label}
          </FormLabel>
          <FormControl>
            <div className="relative group">
              {Icon && (
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 dark:text-zinc-500">
                  <Icon className="h-4 w-4" />
                </div>
              )}
              <Input
                type={type}
                {...field}
                value={field.value ?? ""}
                placeholder={placeholder}
                className={clsx(
                  "h-11 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 px-3.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 transition-colors focus:bg-white dark:focus:bg-zinc-900 focus:border-orange-500 dark:focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 shadow-2xs",
                  Icon && "pl-10",
                )}
              />
            </div>
          </FormControl>
          <FormMessage className="text-xs font-medium text-rose-500 dark:text-rose-400 mt-1" />
        </FormItem>
      )}
    />
  );
}

function getPersonalFormValues(user: any) {
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
        c.code.toLowerCase() === initial.toLowerCase(),
    );
    return exactMatch ? exactMatch.name : initial;
  })();

  const standardGenders = ["Male", "Female"];
  const dbGender = user?.gender || "";
  const initialGenderSelect = standardGenders.includes(dbGender)
    ? dbGender
    : dbGender
      ? "Other"
      : "";
  const initialGenderCustom = initialGenderSelect === "Other" ? dbGender : "";

  const standardVeterans = [
    "I am not a protected veteran",
    "I identify as one or more of the classifications of a protected veteran",
    "I don't wish to answer",
  ];
  const dbVeteran = user?.veteranStatus || "";
  const initialVeteranSelect = standardVeterans.includes(dbVeteran)
    ? dbVeteran
    : dbVeteran
      ? "Other"
      : "";
  const initialVeteranCustom =
    initialVeteranSelect === "Other" ? dbVeteran : "";

  const standardDisabilities = [
    "Yes, I have a disability, or have had one in the past",
    "No, I do not have a disability and have not had one in the past",
    "I do not want to answer",
  ];
  const dbDisability = user?.disabilityStatus || "";
  const initialDisabilitySelect = standardDisabilities.includes(dbDisability)
    ? dbDisability
    : dbDisability
      ? "Other"
      : "";
  const initialDisabilityCustom =
    initialDisabilitySelect === "Other" ? dbDisability : "";

  return {
    firstName: user?.firstName || "",
    middleName: user?.middleName || "",
    lastName: user?.lastName || "",
    countryCode: initialCountryCode,
    phoneNumber: user?.phoneNumber || "",
    country: initialCountry,
    city: user?.city || "",
    collegeName: user?.collegeName || "",
    contactEmail: user?.contactEmail || user?.email || "",
    postalCode: user?.postalCode || "",
    genderSelect: initialGenderSelect,
    genderCustom: initialGenderCustom,
    veteranStatusSelect: initialVeteranSelect,
    veteranStatusCustom: initialVeteranCustom,
    disabilityStatusSelect: initialDisabilitySelect,
    disabilityStatusCustom: initialDisabilityCustom,
  };
}

function PersonalInformationForm({
  user,
  refetchProfile,
  phoneOptions,
  countryOptions,
}: any) {
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<z.infer<typeof personalSchema>>({
    resolver: zodResolver(personalSchema),
    defaultValues: getPersonalFormValues(user),
  });

  const onSubmit = async (values: z.infer<typeof personalSchema>) => {
    const snapshotBefore = JSON.stringify(form.getValues());
    setIsSaving(true);
    const payload = {
      firstName: values.firstName,
      middleName: values.middleName,
      lastName: values.lastName,
      countryCode: values.countryCode,
      phoneNumber: values.phoneNumber,
      country: values.country,
      city: values.city,
      collegeName: values.collegeName,
      contactEmail: values.contactEmail,
      postalCode: values.postalCode || null,
      gender:
        values.genderSelect === "Other"
          ? values.genderCustom
          : values.genderSelect || null,
      veteranStatus:
        values.veteranStatusSelect === "Other"
          ? values.veteranStatusCustom
          : values.veteranStatusSelect || null,
      disabilityStatus:
        values.disabilityStatusSelect === "Other"
          ? values.disabilityStatusCustom
          : values.disabilityStatusSelect || null,
    };
    const result = await updateProfile(payload);
    setIsSaving(false);
    if (result.success) {
      refetchProfile();
      // Only reset if user hasn't typed new input during the save
      if (JSON.stringify(form.getValues()) === snapshotBefore) {
        form.reset(values);
      }
    } else {
      toast.error(result.error || "Failed to update personal information.");
    }
  };

  const debouncedSubmit = useDebounceCallback(() => {
    form.handleSubmit(onSubmit)();
  }, 1000);

  const watchedValues = form.watch();
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    if (form.formState.isDirty && !isSaving) {
      debouncedSubmit();
    }
  }, [watchedValues, form.formState.isDirty, debouncedSubmit, isSaving]);

  useEffect(() => {
    if (user && !form.formState.isDirty) {
      form.reset(getPersonalFormValues(user));
    }
  }, [user, form]);

  return (
    <Section
      title="Personal Information"
      icon={IdCard}
      hasAutoSave={true}
      isSaving={isSaving}
      isDirty={form.formState.isDirty}
    >
      <Form {...form}>
        <div className="space-y-6">
          <div className="grid gap-5 md:grid-cols-3">
            <FormInput
              control={form.control}
              name="firstName"
              label="First Name"
              placeholder="John"
            />
            <FormInput
              control={form.control}
              name="middleName"
              label="Middle Name (Optional)"
              placeholder=""
            />
            <FormInput
              control={form.control}
              name="lastName"
              label="Last Name"
              placeholder="Doe"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="space-y-1.5 md:col-span-1">
                  <FormLabel className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Combobox
                        options={phoneOptions}
                        value={form.watch("countryCode") || ""}
                        onChange={(val) =>
                          form.setValue("countryCode", val, {
                            shouldDirty: true,
                          })
                        }
                        className="w-32 shrink-0"
                      />
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder="1234567890"
                        className="h-11 flex-1 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 px-3.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 shadow-2xs transition-colors focus:bg-white dark:focus:bg-zinc-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs font-medium text-rose-500 dark:text-rose-400 mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={() => (
                <FormItem className="space-y-1.5 md:col-span-1">
                  <FormLabel className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    Country
                  </FormLabel>
                  <FormControl>
                    <Combobox
                      options={countryOptions}
                      value={form.watch("country") || ""}
                      onChange={(val) =>
                        form.setValue("country", val, { shouldDirty: true })
                      }
                      placeholder="Select Country"
                      searchPlaceholder="Search country..."
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-medium text-rose-500 dark:text-rose-400 mt-1" />
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

          <div className="grid gap-5 md:grid-cols-3">
            <FormInput
              control={form.control}
              name="contactEmail"
              label="Contact Email"
              placeholder="your-contact-email@example.com"
              className="md:col-span-1"
            />
            <FormInput
              control={form.control}
              name="collegeName"
              label="College / University"
              placeholder="Stanford University"
              className="md:col-span-1"
            />
            <FormInput
              control={form.control}
              name="postalCode"
              label="Postal Code / ZIP"
              placeholder="94103"
              className="md:col-span-1"
            />
          </div>

          <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-6 mt-6">
            <h4 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4">
              Demographics / EEOC (Optional)
            </h4>
            <div className="space-y-5">
              {/* Gender */}
              <div className="grid gap-5 md:grid-cols-3 items-end">
                <FormField
                  control={form.control}
                  name="genderSelect"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5 md:col-span-1">
                      <FormLabel className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                        Gender
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(val) => field.onChange(val)}
                          value={field.value || undefined}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">
                              Other (Specify)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-xs font-medium text-rose-500 dark:text-rose-400 mt-1" />
                    </FormItem>
                  )}
                />
                {form.watch("genderSelect") === "Other" && (
                  <FormInput
                    control={form.control}
                    name="genderCustom"
                    label="Specify Gender"
                    placeholder="Non-binary / Custom gender"
                    className="md:col-span-2"
                  />
                )}
              </div>

              {/* Veteran Status */}
              <div className="grid gap-5 md:grid-cols-3 items-end">
                <FormField
                  control={form.control}
                  name="veteranStatusSelect"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5 md:col-span-2">
                      <FormLabel className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                        Veteran Status
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(val) => field.onChange(val)}
                          value={field.value || undefined}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Veteran Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="I am not a protected veteran">
                              I am not a protected veteran
                            </SelectItem>
                            <SelectItem value="I identify as one or more of the classifications of a protected veteran">
                              I identify as one or more of the classifications
                              of a protected veteran
                            </SelectItem>
                            <SelectItem value="I don't wish to answer">
                              I don&apos;t wish to answer
                            </SelectItem>
                            <SelectItem value="Other">
                              Other (Specify)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-xs font-medium text-rose-500 dark:text-rose-400 mt-1" />
                    </FormItem>
                  )}
                />
                {form.watch("veteranStatusSelect") === "Other" && (
                  <FormInput
                    control={form.control}
                    name="veteranStatusCustom"
                    label="Specify Veteran Status"
                    placeholder="Enter custom veteran status"
                    className="md:col-span-1"
                  />
                )}
              </div>

              {/* Disability Status */}
              <div className="grid gap-5 md:grid-cols-3 items-end">
                <FormField
                  control={form.control}
                  name="disabilityStatusSelect"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5 md:col-span-2">
                      <FormLabel className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                        Disability Status
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(val) => field.onChange(val)}
                          value={field.value || undefined}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Disability Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes, I have a disability, or have had one in the past">
                              Yes, I have a disability, or have had one in the
                              past
                            </SelectItem>
                            <SelectItem value="No, I do not have a disability and have not had one in the past">
                              No, I do not have a disability and have not had
                              one in the past
                            </SelectItem>
                            <SelectItem value="I do not want to answer">
                              I do not want to answer
                            </SelectItem>
                            <SelectItem value="Other">
                              Other (Specify)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-xs font-medium text-rose-500 dark:text-rose-400 mt-1" />
                    </FormItem>
                  )}
                />
                {form.watch("disabilityStatusSelect") === "Other" && (
                  <FormInput
                    control={form.control}
                    name="disabilityStatusCustom"
                    label="Specify Disability Status"
                    placeholder="Enter custom disability status"
                    className="md:col-span-1"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </Form>
    </Section>
  );
}

function getProfessionalFormValues(user: any) {
  return {
    jobType: user?.jobType || "",
    currency: user?.currency || "USD",
    currentCtc: (user?.currentCtc !== null && user?.currentCtc !== undefined
      ? String(user.currentCtc)
      : "") as any,
    noticePeriod: (user?.noticePeriod !== null &&
    user?.noticePeriod !== undefined
      ? String(user.noticePeriod)
      : "") as any,
  };
}

function ProfessionalDetailsForm({ user, refetchProfile }: any) {
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<z.infer<typeof professionalSchema>>({
    resolver: zodResolver(professionalSchema) as any,
    defaultValues: getProfessionalFormValues(user),
  });

  const onSubmit = async (values: z.infer<typeof professionalSchema>) => {
    const snapshotBefore = JSON.stringify(form.getValues());
    setIsSaving(true);
    const result = await updateProfile(values);
    setIsSaving(false);
    if (result.success) {
      refetchProfile();
      // Only reset if user hasn't typed new input during the save
      if (JSON.stringify(form.getValues()) === snapshotBefore) {
        form.reset({
          jobType: values.jobType || "",
          currency: values.currency || "USD",
          currentCtc: (values.currentCtc !== null &&
          values.currentCtc !== undefined
            ? String(values.currentCtc)
            : "") as any,
          noticePeriod: (values.noticePeriod !== null &&
          values.noticePeriod !== undefined
            ? String(values.noticePeriod)
            : "") as any,
        });
      }
    } else {
      toast.error(result.error || "Failed to update professional details.");
    }
  };

  const debouncedSubmit = useDebounceCallback(() => {
    form.handleSubmit(onSubmit)();
  }, 1000);

  const watchedValues = form.watch();
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    if (form.formState.isDirty && !isSaving) {
      debouncedSubmit();
    }
  }, [watchedValues, form.formState.isDirty, debouncedSubmit, isSaving]);

  useEffect(() => {
    if (user && !form.formState.isDirty) {
      form.reset(getProfessionalFormValues(user));
    }
  }, [user, form]);

  return (
    <Section
      title="Professional Details"
      icon={Briefcase}
      hasAutoSave={true}
      isSaving={isSaving}
      isDirty={form.formState.isDirty}
    >
      <Form {...form}>
        <div className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="jobType"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    Looking For Role
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(val) => field.onChange(val)}
                      value={field.value || undefined}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Role Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {JOB_TYPES.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-xs font-medium text-rose-500 dark:text-rose-400 mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currentCtc"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    Current CTC
                  </FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <div className="relative">
                        <select
                          value={form.watch("currency") || "USD"}
                          onChange={(e) =>
                            form.setValue("currency", e.target.value, {
                              shouldDirty: true,
                            })
                          }
                          className="appearance-none h-11 w-24 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 px-3 text-sm font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 shadow-2xs transition-colors cursor-pointer"
                        >
                          {CURRENCIES.map((c) => (
                            <option
                              key={c}
                              value={c}
                              className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                            >
                              {c}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
                          <ChevronDown className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        value={field.value ?? ""}
                        placeholder="100000"
                        className="h-11 flex-1 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 px-3.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 shadow-2xs transition-colors focus:bg-white dark:focus:bg-zinc-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs font-medium text-rose-500 dark:text-rose-400 mt-1" />
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
    const snapshotBefore = JSON.stringify(form.getValues());
    setIsSaving(true);
    const result = await updateProfile(values);
    setIsSaving(false);
    if (result.success) {
      refetchProfile();
      if (JSON.stringify(form.getValues()) === snapshotBefore) {
        form.reset(values);
      }
    } else {
      toast.error(result.error || "Failed to update social links.");
    }
  };

  const debouncedSubmit = useDebounceCallback(() => {
    form.handleSubmit(onSubmit)();
  }, 1000);

  const watchedValues = form.watch();
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    if (form.formState.isDirty && !isSaving) {
      debouncedSubmit();
    }
  }, [watchedValues, form.formState.isDirty, debouncedSubmit, isSaving]);

  useEffect(() => {
    if (user && !form.formState.isDirty) {
      form.reset({
        linkedin: user.linkedin || "",
        github: user.github || "",
        twitter: user.twitter || "",
        portfolio: user.portfolio || "",
        telegram: user.telegram || "",
        other: user.other || "",
      });
    }
  }, [user, form]);

  return (
    <Section
      title="Social Links"
      icon={Globe}
      hasAutoSave={true}
      isSaving={isSaving}
      isDirty={form.formState.isDirty}
    >
      <Form {...form}>
        <div className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            <FormInput
              control={form.control}
              name="linkedin"
              label="LinkedIn"
              placeholder="https://linkedin.com/in/..."
              icon={Linkedin}
            />
            <FormInput
              control={form.control}
              name="github"
              label="GitHub"
              placeholder="https://github.com/..."
              icon={Github}
            />
            <FormInput
              control={form.control}
              name="twitter"
              label="Twitter / X"
              placeholder="https://x.com/..."
              icon={Twitter}
            />
            <FormInput
              control={form.control}
              name="portfolio"
              label="Portfolio"
              placeholder="https://..."
              icon={LinkIcon}
            />
            <FormInput
              control={form.control}
              name="telegram"
              label="Telegram"
              placeholder="https://t.me/..."
              icon={Send}
            />
            <FormInput
              control={form.control}
              name="other"
              label="Other Link"
              placeholder="https://..."
              icon={LinkIcon}
            />
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
    const snapshotBefore = JSON.stringify(form.getValues());
    setIsSaving(true);
    const result = await updateProfile(values);
    setIsSaving(false);
    if (result.success) {
      refetchProfile();
      if (JSON.stringify(form.getValues()) === snapshotBefore) {
        form.reset(values);
      }
    } else {
      toast.error(result.error || "Failed to update AI Settings.");
    }
  };

  const debouncedSubmit = useDebounceCallback(() => {
    form.handleSubmit(onSubmit)();
  }, 1000);

  const watchedValues = form.watch();
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    if (form.formState.isDirty && !isSaving) {
      debouncedSubmit();
    }
  }, [watchedValues, form.formState.isDirty, debouncedSubmit, isSaving]);

  useEffect(() => {
    if (user && !form.formState.isDirty) {
      form.reset({
        specificQuestionGuidance: user.specificQuestionGuidance || "",
      });
    }
  }, [user, form]);

  return (
    <Section
      title="AI Settings"
      icon={Settings}
      hasAutoSave={true}
      isSaving={isSaving}
      isDirty={form.formState.isDirty}
    >
      <Form {...form}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="specificQuestionGuidance"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Specific Question Guidance (Optional)
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Mention any extra and specific detail to provide for the AI autofill engine..."
                    className="min-h-[120px] w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 p-3.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:border-orange-500 dark:focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 shadow-2xs transition-colors"
                  />
                </FormControl>
                <FormMessage className="text-xs font-medium text-rose-500 dark:text-rose-400 mt-1" />
                <p className="text-xs text-zinc-400 dark:text-zinc-500 pt-0.5 font-normal">
                  Give custom instructions to the AI when generating answers for
                  job application questions.
                </p>
              </FormItem>
            )}
          />
        </div>
      </Form>
    </Section>
  );
}

function CoverLetterForm({ user, refetchProfile }: any) {
  const width = useWindowWidth();
  const isMobile = width < 768;
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const form = useForm<z.infer<typeof coverLetterSchema>>({
    resolver: zodResolver(coverLetterSchema),
    defaultValues: {
      coverLetter: user.coverLetter || "",
    },
  });

  const handleCopy = async () => {
    const text = form.getValues("coverLetter") || "";
    if (!text.trim()) {
      toast.error("No cover letter to copy.");
      return;
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      setCopied(true);
      toast.success("Cover letter copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy cover letter.");
    }
  };

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
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="coverLetter"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Default Cover Letter (Optional)
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Write your default cover letter here. This will be available in the extension's Profile tab for quick autofill on job applications..."
                    className="min-h-[180px] w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 p-3.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:border-orange-500 dark:focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 shadow-2xs transition-colors"
                  />
                </FormControl>
                <FormMessage className="text-xs font-medium text-rose-500 dark:text-rose-400 mt-1" />
              </FormItem>
            )}
          />

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 w-full">
            <Button
              type="button"
              variant="outline"
              onClick={handleCopy}
              className="h-10 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Cover Letter</span>
                </>
              )}
            </Button>

            <Button
              type="button"
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSaving}
              className="h-10 px-5 rounded-xl bg-orange-600 hover:bg-orange-500 active:scale-[0.98] text-white text-xs font-medium shadow-xs shadow-orange-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  {isMobile ? "Save" : "Save Cover Letter"}
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
  const {
    data: user,
    isLoading: isLoadingProfile,
    refetch: refetchProfile,
  } = useProfile(initialUser);
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

  if (!user || isLoadingProfile) {
    return (
      <div className="flex justify-center py-12">
        <Loading fullPage={false} message="Loading candidate profile..." />
      </div>
    );
  }

  useEffect(() => {
    useResumeStore.getState().setResumes(user?.resumes || []);
  }, [user?.resumes]);

  async function handleUpgrade() {
    setIsCheckingOut(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_cart: [
            {
              product_id:
                process.env.NEXT_PUBLIC_DODO_PAYMENTS_PRODUCT_ID ||
                "pdt_0NayYkMQdxcLwDxT4hxDk",
              quantity: 1,
            },
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
    <div className="space-y-8">
      {/* Payment Success Banner */}
      {activating && status?.membership !== "PRO" && (
        <div className="flex items-center gap-3.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 dark:bg-amber-500/15 p-4 text-amber-800 dark:text-amber-300 shadow-xs backdrop-blur-xs">
          <Loader2 className="w-5 h-5 shrink-0 animate-spin text-amber-600 dark:text-amber-400" />
          <div>
            <p className="font-semibold text-sm tracking-tight text-amber-950 dark:text-amber-200">
              Activating your Pro subscription...
            </p>
            <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-0.5">
              Payment received. Your credits and Pro badge will appear in a
              moment — hang tight!
            </p>
          </div>
        </div>
      )}
      {activating && status?.membership === "PRO" && (
        <div className="flex items-center gap-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-500/15 p-4 text-emerald-800 dark:text-emerald-300 shadow-xs backdrop-blur-xs">
          <Check className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <p className="font-semibold text-sm tracking-tight text-emerald-950 dark:text-emerald-200">
            You&apos;re now Pro! Your 10,000 credits are ready.
          </p>
        </div>
      )}

      <ResumeAutofillUpload />

      {/* Profile Header & Credits */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* User Identity & Membership */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-6 md:p-8 shadow-xs flex flex-col md:flex-row items-center gap-6 relative overflow-hidden backdrop-blur-xs">
          <div className="h-24 w-24 md:h-28 md:w-28 shrink-0 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800/80 flex items-center justify-center shadow-xs overflow-hidden relative group">
            {user.image ? (
              <Image
                src={user.image}
                alt={`${user.firstName || ""} ${user.lastName || ""}`}
                width={112}
                height={112}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl md:text-4xl font-semibold text-zinc-700 dark:text-zinc-300 uppercase">
                {initials || <UserIcon className="w-10 h-10 text-zinc-400" />}
              </span>
            )}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <div className="flex-1 text-center md:text-left space-y-3 min-w-0">
            <div className="min-w-0">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 break-words">
                {displayName}
              </h2>
              <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 font-normal mt-0.5 break-all">
                {user.email || "No Email"}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-1">
              <div
                className={clsx(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border shadow-2xs",
                  status?.membership === "PRO"
                    ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700",
                )}
              >
                <CreditCard
                  className={clsx(
                    "w-3.5 h-3.5",
                    status?.membership === "PRO"
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-zinc-500 dark:text-zinc-400",
                  )}
                />
                <span className="tracking-wide">{status?.membership} PLAN</span>
              </div>
              {status?.membership === "FREE" ? (
                <Button
                  type="button"
                  size="sm"
                  onClick={handleUpgrade}
                  disabled={isCheckingOut}
                  className="h-8 px-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 active:scale-[0.98] text-white text-xs font-medium shadow-xs shadow-orange-600/20 transition-all disabled:opacity-60"
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
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
                  className="h-8 w-8 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 shadow-2xs transition-colors flex items-center justify-center"
                  title="Manage Subscription"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Credits Bento Metric Card */}
        <div className="col-span-1 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-6 shadow-xs flex flex-col justify-between relative overflow-hidden backdrop-blur-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 flex items-center justify-center shadow-2xs">
                <Zap className="w-4 h-4 fill-orange-500/20 text-orange-500" />
              </div>
              <h3 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Credit Balance
              </h3>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Active
            </span>
          </div>

          <div className="my-6 min-w-0">
            <div className="text-4xl sm:text-5xl font-bold font-mono tracking-tight text-zinc-900 dark:text-zinc-50 flex items-baseline gap-1.5">
              <span>
                {Intl.NumberFormat("en-US").format(status?.credits ?? 0)}
              </span>
              <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 font-sans tracking-normal">
                credits
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span>2 credits = 1 AI auto-fill</span>
            <span className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500">
              Auto-sync
            </span>
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

      <ProfessionalDetailsForm user={user} refetchProfile={refetchProfile} />

      <div
        className="space-y-8"
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
          onUpgrade={handleUpgrade}
        />
      </div>

      <SkillsSection
        skills={user.skills || []}
        refetchProfile={refetchProfile}
      />

      <SocialLinksForm user={user} refetchProfile={refetchProfile} />

      <IntroVideoForm user={user} refetchProfile={refetchProfile} />

      <AiSettingsForm user={user} refetchProfile={refetchProfile} />

      <CoverLetterForm user={user} refetchProfile={refetchProfile} />
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  children,
  isSaving,
  isDirty,
  hasAutoSave = false,
  className,
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
  isSaving?: boolean;
  isDirty?: boolean;
  hasAutoSave?: boolean;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-6 md:p-8 shadow-xs relative backdrop-blur-xs transition-colors",
        className,
      )}
    >
      <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10 text-orange-600 dark:text-orange-400 shadow-2xs shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          {title}
        </h2>
        {hasAutoSave && (
          <div className="ml-auto flex items-center gap-2">
            {isSaving ? (
              <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 dark:text-zinc-500">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-500" />
                Saving...
              </span>
            ) : !isDirty ? (
              <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                Saved
              </span>
            ) : null}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
      {children}
    </label>
  );
}

function ProfileInput({ label, icon: Icon, className, ...props }: any) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 dark:text-zinc-500">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <Input
          className={clsx(
            "h-11 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 px-3.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 transition-colors focus:bg-white dark:focus:bg-zinc-900 focus:border-orange-500 dark:focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 shadow-2xs",
            Icon && "pl-10",
          )}
          {...props}
        />
      </div>
    </div>
  );
}

function ExperienceSection({
  experiences,
  setExperiences,
  refetchProfile,
}: any) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempExp, setTempExp] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expToDelete, setExpToDelete] = useState<any>(null);

  const width = useWindowWidth();
  const isMobile = width < 768;

  const Modal = isMobile ? Sheet : Dialog;
  const ModalContent = isMobile ? SheetContent : DialogContent;
  const ModalTitle = isMobile ? SheetTitle : DialogTitle;
  const ModalDescription = isMobile ? SheetDescription : DialogDescription;

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
      toast.success("Experience saved successfully");
      refetchProfile();
    } else {
      toast.error("Failed to save experience");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
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
      <div className="space-y-4">
        {sortedExperiences.map((exp: any, index: number) => {
          return (
            <div
              key={exp.id || index}
              className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/60 p-5 md:p-6 transition-all duration-200 hover:border-zinc-300 dark:hover:border-zinc-700 relative group min-w-0 shadow-2xs"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 min-w-0">
                <div className="space-y-1 md:pr-24 min-w-0 flex-1">
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 break-words">
                    {exp.companyName || "Untitled Company"}
                  </h3>
                  {exp.role && (
                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {exp.role}
                    </p>
                  )}
                  {exp.companyWebsite && (
                    <a
                      href={exp.companyWebsite}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-orange-600 dark:text-orange-400 hover:underline font-medium block w-fit break-all"
                    >
                      {exp.companyWebsite}
                    </a>
                  )}
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                    {exp.startDate
                      ? format(new Date(exp.startDate), "MMM yyyy")
                      : "N/A"}{" "}
                    -{" "}
                    {exp.isCurrent
                      ? "Present"
                      : exp.endDate
                        ? format(new Date(exp.endDate), "MMM yyyy")
                        : "N/A"}
                    {exp.location && ` • ${exp.location}`}
                  </p>
                </div>

                <div
                  className={clsx(
                    "flex gap-1.5 shrink-0 self-end md:self-start transition-opacity z-10",
                    "md:absolute md:right-4 md:top-4",
                    deletingId === exp.id
                      ? "opacity-100"
                      : "md:opacity-0 md:group-hover:opacity-100",
                  )}
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => editExperience(exp)}
                    disabled={deletingId === exp.id}
                    className="h-8 w-8 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 shadow-2xs transition-colors disabled:opacity-50"
                    title="Edit Experience"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setExpToDelete(exp)}
                    disabled={!!deletingId}
                    className="h-8 w-8 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:border-rose-200 dark:hover:border-rose-900/40 shadow-2xs transition-colors disabled:opacity-50"
                    title="Remove Experience"
                  >
                    {deletingId === exp.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </Button>
                </div>
              </div>
              {exp.description && (
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-3 whitespace-pre-wrap font-normal leading-relaxed break-words">
                  {exp.description}
                </p>
              )}
            </div>
          );
        })}

        <Button
          type="button"
          onClick={addExperience}
          className="w-full h-11 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-orange-500/50 dark:hover:border-orange-500/50 bg-zinc-50/50 dark:bg-zinc-900/30 hover:bg-orange-50/50 dark:hover:bg-orange-950/20 text-zinc-600 dark:text-zinc-400 hover:text-orange-600 dark:hover:text-orange-400 text-xs font-medium transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Experience
        </Button>

        <Modal
          open={Boolean(editingId && tempExp)}
          onOpenChange={(open) => {
            if (!open && !isSaving) cancelEdit();
          }}
        >
          <ModalContent
            className={
              isMobile
                ? "p-0 max-h-[90dvh] flex flex-col rounded-t-3xl border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"
                : "sm:max-w-xl max-h-[85dvh] p-0 sm:p-0 gap-0 flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-2xl"
            }
          >
            <div className="px-4 py-3 sm:py-3.5 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
              <ModalTitle className="text-lg font-heading font-semibold text-zinc-900 dark:text-white tracking-tight">
                {tempExp?.companyName ? `Edit Experience` : "Add Experience"}
              </ModalTitle>
              <ModalDescription className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                {tempExp?.companyName
                  ? `Update role details and achievements for ${tempExp.companyName}`
                  : "Add your work history, company details, and responsibilities."}
              </ModalDescription>
            </div>

            {tempExp && (
              <ExperienceForm
                key={tempExp.id}
                exp={tempExp}
                onConfirm={confirmExperience}
                onCancel={cancelEdit}
                isLoading={isSaving}
              />
            )}
          </ModalContent>
        </Modal>

        <Modal
          open={Boolean(expToDelete)}
          onOpenChange={(open) => {
            if (!open && !deletingId) setExpToDelete(null);
          }}
        >
          <ModalContent
            className={
              isMobile
                ? "p-6 flex flex-col rounded-t-3xl border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                : "sm:max-w-md p-6 flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl"
            }
          >
            <ModalTitle className="text-lg font-heading font-semibold text-zinc-900 dark:text-white tracking-tight">
              Delete Experience
            </ModalTitle>
            <ModalDescription className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              Are you sure you want to delete &quot;{expToDelete?.companyName}&quot;? This action cannot be undone.
            </ModalDescription>
            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setExpToDelete(null)}
                disabled={!!deletingId}
                className="w-full sm:w-auto border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  if (expToDelete) {
                    await removeExperience(expToDelete.id);
                    setExpToDelete(null);
                  }
                }}
                disabled={!!deletingId}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
              >
                {deletingId ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Experience"
                )}
              </Button>
            </div>
          </ModalContent>
        </Modal>
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
  const [eduToDelete, setEduToDelete] = useState<any>(null);

  const width = useWindowWidth();
  const isMobile = width < 768;

  const Modal = isMobile ? Sheet : Dialog;
  const ModalContent = isMobile ? SheetContent : DialogContent;
  const ModalTitle = isMobile ? SheetTitle : DialogTitle;
  const ModalDescription = isMobile ? SheetDescription : DialogDescription;

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
      newEducations = educations.map((e: any) => (e.id === data.id ? data : e));
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
      toast.success("Education saved successfully");
      refetchProfile();
    } else {
      toast.error("Failed to save education");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
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
      <div className="space-y-4">
        {sortedEducations.map((edu: any, index: number) => {
          return (
            <div
              key={edu.id || index}
              className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/60 p-5 md:p-6 transition-all duration-200 hover:border-zinc-300 dark:hover:border-zinc-700 relative group min-w-0 shadow-2xs"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 min-w-0">
                <div className="space-y-1 md:pr-24 min-w-0 flex-1">
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 break-words">
                    {edu.schoolName || "Untitled Institution"}
                  </h3>
                  {edu.degree && (
                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 break-words">
                      {edu.degree}
                      {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                    </p>
                  )}
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
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
                </div>

                <div
                  className={clsx(
                    "flex gap-1.5 shrink-0 self-end md:self-start transition-opacity z-10",
                    "md:absolute md:right-4 md:top-4",
                    deletingId === edu.id
                      ? "opacity-100"
                      : "md:opacity-0 md:group-hover:opacity-100",
                  )}
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => editEducation(edu)}
                    disabled={deletingId === edu.id}
                    className="h-8 w-8 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 shadow-2xs transition-colors disabled:opacity-50"
                    title="Edit Education"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setEduToDelete(edu)}
                    disabled={!!deletingId}
                    className="h-8 w-8 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:border-rose-200 dark:hover:border-rose-900/40 shadow-2xs transition-colors disabled:opacity-50"
                    title="Remove Education"
                  >
                    {deletingId === edu.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </Button>
                </div>
              </div>
              {edu.description && (
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-3 whitespace-pre-wrap font-normal leading-relaxed break-words">
                  {edu.description}
                </p>
              )}
            </div>
          );
        })}

        <Button
          type="button"
          onClick={addEducation}
          className="w-full h-11 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-orange-500/50 dark:hover:border-orange-500/50 bg-zinc-50/50 dark:bg-zinc-900/30 hover:bg-orange-50/50 dark:hover:bg-orange-950/20 text-zinc-600 dark:text-zinc-400 hover:text-orange-600 dark:hover:text-orange-400 text-xs font-medium transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Education
        </Button>

        <Modal
          open={Boolean(editingId && tempEdu)}
          onOpenChange={(open) => {
            if (!open && !isSaving) cancelEdit();
          }}
        >
          <ModalContent
            className={
              isMobile
                ? "p-0 max-h-[90dvh] flex flex-col rounded-t-3xl border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"
                : "sm:max-w-xl max-h-[85dvh] p-0 sm:p-0 gap-0 flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-2xl"
            }
          >
            <div className="px-4 py-3 sm:py-3.5 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
              <ModalTitle className="text-lg font-heading font-semibold text-zinc-900 dark:text-white tracking-tight">
                {tempEdu?.schoolName ? `Edit Education` : "Add Education"}
              </ModalTitle>
              <ModalDescription className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                {tempEdu?.schoolName
                  ? `Update academic details for ${tempEdu.schoolName}`
                  : "Add your degree, school or university, field of study, and years."}
              </ModalDescription>
            </div>

            {tempEdu && (
              <EducationForm
                key={tempEdu.id}
                edu={tempEdu}
                onConfirm={confirmEducation}
                onCancel={cancelEdit}
                isLoading={isSaving}
              />
            )}
          </ModalContent>
        </Modal>

        <Modal
          open={Boolean(eduToDelete)}
          onOpenChange={(open) => {
            if (!open && !deletingId) setEduToDelete(null);
          }}
        >
          <ModalContent
            className={
              isMobile
                ? "p-6 flex flex-col rounded-t-3xl border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                : "sm:max-w-md p-6 flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl"
            }
          >
            <ModalTitle className="text-lg font-heading font-semibold text-zinc-900 dark:text-white tracking-tight">
              Delete Education
            </ModalTitle>
            <ModalDescription className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              Are you sure you want to delete &quot;{eduToDelete?.schoolName}&quot;? This action cannot be undone.
            </ModalDescription>
            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setEduToDelete(null)}
                disabled={!!deletingId}
                className="w-full sm:w-auto border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  if (eduToDelete) {
                    await removeEducation(eduToDelete.id);
                    setEduToDelete(null);
                  }
                }}
                disabled={!!deletingId}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
              >
                {deletingId ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Education"
                )}
              </Button>
            </div>
          </ModalContent>
        </Modal>
      </div>
    </Section>
  );
}

function EducationForm({ edu, onConfirm, onCancel, isLoading }: any) {
  const width = useWindowWidth();
  const isMobile = width < 768;
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col flex-1 min-h-0 overflow-hidden"
      >
        <div className="px-4 py-3.5 sm:py-4 space-y-3.5 flex-1 overflow-y-auto">
          <div className="grid gap-3.5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="schoolName"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    School / College Name *
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Stanford University" />
                  </FormControl>
                  <FormMessage className="text-xs font-medium text-rose-500 dark:text-rose-400 mt-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="degree"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    Degree / Certification
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Bachelor of Science" />
                  </FormControl>
                  <FormMessage className="text-xs font-medium text-rose-500 dark:text-rose-400 mt-1" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-3.5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="fieldOfStudy"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    Field of Study
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Computer Science" />
                  </FormControl>
                  <FormMessage className="text-xs font-medium text-rose-500 dark:text-rose-400 mt-1" />
                </FormItem>
              )}
            />
            <div className="flex items-end h-11 pb-2">
              <FormField
                control={form.control}
                name="isCurrent"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2.5 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          if (checked) {
                            form.setValue("endDate", undefined);
                          }
                        }}
                        className="data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                      />
                    </FormControl>
                    <FormLabel className="text-xs font-medium text-zinc-700 dark:text-zinc-300 select-none cursor-pointer">
                      Currently Studying Here
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid gap-3.5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="space-y-1.5 flex flex-col">
                  <FormLabel className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    Start Date
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={clsx(
                            "h-11 w-full justify-start text-left font-normal rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 text-sm shadow-2xs hover:bg-zinc-50 dark:hover:bg-zinc-800/60",
                            !field.value && "text-zinc-400 dark:text-zinc-500",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 shrink-0 text-zinc-400" />
                          {field.value ? (
                            format(field.value, "MMM yyyy")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg">
                      <MonthYearPicker
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage className="text-xs font-medium text-rose-500 dark:text-rose-400 mt-1" />
                </FormItem>
              )}
            />

            {!form.watch("isCurrent") && (
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="space-y-1.5 flex flex-col">
                    <FormLabel className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      End Date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={clsx(
                              "h-11 w-full justify-start text-left font-normal rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 text-sm shadow-2xs hover:bg-zinc-50 dark:hover:bg-zinc-800/60",
                              !field.value && "text-zinc-400 dark:text-zinc-500",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 shrink-0 text-zinc-400" />
                            {field.value ? (
                              format(field.value, "MMM yyyy")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg">
                        <MonthYearPicker
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-xs font-medium text-rose-500 dark:text-rose-400 mt-1" />
                  </FormItem>
                )}
              />
            )}
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Description / Details (Optional)
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Relevant coursework, achievements, or activities..."
                    className="min-h-[90px] w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 shadow-2xs"
                  />
                </FormControl>
                <FormMessage className="text-xs font-medium text-rose-500 dark:text-rose-400 mt-1" />
              </FormItem>
            )}
          />
        </div>

        <div className="bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-zinc-800 px-4 py-2.5 sm:py-2.5 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="w-full sm:w-auto h-9 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-medium"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto h-9 px-5 rounded-xl bg-orange-600 hover:bg-orange-500 active:scale-[0.98] text-white text-xs font-medium shadow-xs shadow-orange-600/20 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check className="size-3.5 mr-1" />
                <span>{isMobile ? "Save" : "Save Education"}</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

const videoHelpers = {
  getYoutubeId: (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  },
  getLoomId: (url: string) => {
    const regExp = /loom\.com\/(share|embed)\/([a-zA-Z0-9]+)/;
    const match = url.match(regExp);
    return match ? match[2] : null;
  },
};

const introVideoSchema = z.object({
  introVideo: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        return (
          !!videoHelpers.getYoutubeId(val) || !!videoHelpers.getLoomId(val)
        );
      },
      { message: "Must be a valid YouTube or Loom video link" },
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
    const snapshotBefore = JSON.stringify(form.getValues());
    setIsSaving(true);
    const result = await updateProfile(values);
    setIsSaving(false);
    if (result.success) {
      refetchProfile();
      if (JSON.stringify(form.getValues()) === snapshotBefore) {
        form.reset(values);
      }
    } else {
      toast.error(result.error || "Failed to update intro video.");
    }
  };

  const debouncedSubmit = useDebounceCallback(() => {
    form.handleSubmit(onSubmit)();
  }, 1000);

  const watchedValues = form.watch();
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    if (form.formState.isDirty && form.formState.isValid && !isSaving) {
      debouncedSubmit();
    }
  }, [
    watchedValues,
    form.formState.isDirty,
    form.formState.isValid,
    debouncedSubmit,
    isSaving,
  ]);

  useEffect(() => {
    if (user && !form.formState.isDirty) {
      form.reset({
        introVideo: user.introVideo || "",
      });
    }
  }, [user, form]);

  const introVideoVal = form.watch("introVideo") || "";
  const ytId = videoHelpers.getYoutubeId(introVideoVal);
  const lId = videoHelpers.getLoomId(introVideoVal);
  const embedUrl = ytId
    ? `https://www.youtube.com/embed/${ytId}`
    : lId
      ? `https://www.loom.com/embed/${lId}`
      : null;

  return (
    <Section
      title="Intro Video"
      icon={Video}
      hasAutoSave={true}
      isSaving={isSaving}
      isDirty={form.formState.isDirty}
    >
      <Form {...form}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="introVideo"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Intro Video Link (YouTube or Loom)
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="https://www.youtube.com/watch?v=... or https://www.loom.com/share/..."
                  />
                </FormControl>
                <FormMessage className="text-xs font-medium text-rose-500 dark:text-rose-400 mt-1" />
                <p className="text-xs text-zinc-400 dark:text-zinc-500 pt-0.5 font-normal">
                  Provide a YouTube link or Loom link to introduce yourself to
                  hiring managers.
                </p>
              </FormItem>
            )}
          />

          {embedUrl ? (
            <div className="mt-4">
              <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Video Preview:
              </p>
              <div className="aspect-video w-full max-w-2xl rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-900 shadow-sm relative overflow-hidden">
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
              <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-center">
                <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
                  Please enter a valid YouTube (watch / youtu.be) or Loom
                  (share) link.
                </p>
              </div>
            )
          )}
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
  const width = useWindowWidth();
  const isMobile = width < 768;
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col flex-1 min-h-0 overflow-hidden"
      >
        <div className="px-4 py-3.5 sm:py-4 space-y-3.5 flex-1 overflow-y-auto">
          <div className="grid gap-3.5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    Company Name *
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Google" />
                  </FormControl>
                  <FormMessage className="text-xs font-medium text-rose-500 dark:text-rose-400 mt-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    Job Title / Role *
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Senior Full Stack Engineer" />
                  </FormControl>
                  <FormMessage className="text-xs font-medium text-rose-500 dark:text-rose-400 mt-1" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-3.5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    Location
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ""}
                      placeholder="Remote / San Francisco"
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-medium text-rose-500 dark:text-rose-400 mt-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyWebsite"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    Company Website
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ""}
                      placeholder="https://..."
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-medium text-rose-500 dark:text-rose-400 mt-1" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-3.5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="space-y-1.5 flex flex-col">
                  <FormLabel className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    Start Date
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={clsx(
                            "h-11 w-full justify-start text-left font-normal rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 text-sm shadow-2xs hover:bg-zinc-50 dark:hover:bg-zinc-800/60",
                            !field.value && "text-zinc-400 dark:text-zinc-500",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 shrink-0 text-zinc-400" />
                          {field.value ? (
                            format(field.value, "MMM yyyy")
                          ) : (
                            <span>Select month</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg"
                      align="start"
                    >
                      <MonthYearPicker
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage className="text-xs font-medium text-rose-500 dark:text-rose-400 mt-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="space-y-1.5 flex flex-col">
                  <FormLabel className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    End Date
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          disabled={form.watch("isCurrent")}
                          className={clsx(
                            "h-11 w-full justify-start text-left font-normal rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 text-sm shadow-2xs hover:bg-zinc-50 dark:hover:bg-zinc-800/60",
                            !field.value && "text-zinc-400 dark:text-zinc-500",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 shrink-0 text-zinc-400" />
                          {field.value ? (
                            format(field.value, "MMM yyyy")
                          ) : (
                            <span>
                              {form.watch("isCurrent")
                                ? "Present"
                                : "Select month"}
                            </span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg"
                      align="start"
                    >
                      <MonthYearPicker
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage className="text-xs font-medium text-rose-500 dark:text-rose-400 mt-1" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="isCurrent"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-3 shadow-2xs">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      if (checked) form.setValue("endDate", undefined);
                    }}
                    className="data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                  />
                </FormControl>
                <FormLabel className="text-xs font-medium text-zinc-700 dark:text-zinc-300 select-none cursor-pointer">
                  I currently work here
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Job Description (Optional)
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Describe your role, responsibilities, and achievements..."
                    className="min-h-[100px] w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 shadow-2xs"
                  />
                </FormControl>
                <FormMessage className="text-xs font-medium text-rose-500 dark:text-rose-400 mt-1" />
              </FormItem>
            )}
          />
        </div>

        <div className="bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-zinc-800 px-4 py-2.5 sm:py-2.5 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="w-full sm:w-auto h-9 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-medium"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto h-9 px-5 rounded-xl bg-orange-600 hover:bg-orange-500 active:scale-[0.98] text-white text-xs font-medium shadow-xs shadow-orange-600/20 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check className="size-3.5 mr-1" />
                <span>{isMobile ? "Save" : "Save Experience"}</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
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
  const [skillInput, setSkillInput] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelected(new Set(initialSkills));
  }, [initialSkills]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const debouncedSave = useDebounceCallback(async (skillsToSave: string[]) => {
    setIsSaving(true);
    try {
      const res = await updateProfile({ skills: skillsToSave });
      if (res.error) {
        toast.error(res.error);
      } else {
        await refetchProfile();
      }
    } catch {
      toast.error("Failed to save skills.");
    } finally {
      setIsSaving(false);
    }
  }, 1000);

  const hasMounted = useRef(false);

  const isDirty =
    selected.size !== initialSkills.length ||
    Array.from(selected).some((skill) => !initialSkills.includes(skill));

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    if (isDirty && !isSaving) {
      debouncedSave(Array.from(selected));
    }
  }, [selected, initialSkills, debouncedSave, isDirty, isSaving]);

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    if (!selected.has(trimmed)) {
      const next = new Set(selected);
      next.add(trimmed);
      setSelected(next);
    }
    setSkillInput("");
    setIsDropdownOpen(false);
  };

  const filteredSuggestions = AVAILABLE_SKILLS.filter((skill) => {
    const matchesSearch = skill
      .toLowerCase()
      .includes(skillInput.toLowerCase());
    const isAlreadySelected = Array.from(selected).some(
      (s) => s.toLowerCase() === skill.toLowerCase(),
    );
    return matchesSearch && !isAlreadySelected;
  });

  const showAddCustom =
    skillInput.trim() &&
    !AVAILABLE_SKILLS.some(
      (s) => s.toLowerCase() === skillInput.trim().toLowerCase(),
    ) &&
    !Array.from(selected).some(
      (s) => s.toLowerCase() === skillInput.trim().toLowerCase(),
    );

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (skillInput.trim()) {
        addSkill(skillInput);
      }
    }
  };

  return (
    <Section
      title="Technical Skills"
      icon={Code}
      hasAutoSave={true}
      isSaving={isSaving}
      isDirty={isDirty}
      className={isDropdownOpen ? "z-20" : "z-10"}
    >
      <div className="space-y-4">
        {/* Selected skills tags */}
        <div className="w-full min-h-[72px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 p-3 flex flex-wrap gap-2 items-center">
          {selected.size > 0 ? (
            Array.from(selected).map((skill, idx) => (
              <span
                key={`${skill}-${idx}`}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/80 shadow-2xs transition-colors"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => {
                    const next = new Set(selected);
                    next.delete(skill);
                    setSelected(next);
                  }}
                  className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-sm transition-colors inline-flex items-center justify-center"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))
          ) : (
            <span className="text-zinc-400 dark:text-zinc-500 text-xs py-2 pl-1 font-normal">
              No skills selected. Type below to add skills.
            </span>
          )}
        </div>

        {/* Input & suggestions dropdown */}
        <div ref={dropdownRef} className="relative z-30">
          <Input
            placeholder="Type a skill (e.g. React, Docker) and select or press Enter to add"
            value={skillInput}
            onChange={(e) => {
              setSkillInput(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            onKeyDown={handleInputKeyDown}
            className="h-11 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 px-3.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 shadow-2xs"
          />

          {/* Suggestions dropdown */}
          {isDropdownOpen &&
            (skillInput.trim() || filteredSuggestions.length > 0) && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg z-50 max-h-[220px] overflow-y-auto rounded-xl p-1.5 space-y-0.5">
                {filteredSuggestions.map((skill, idx) => (
                  <button
                    key={`${skill}-${idx}`}
                    type="button"
                    onClick={() => addSkill(skill)}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer"
                  >
                    {skill}
                  </button>
                ))}
                {showAddCustom && (
                  <button
                    type="button"
                    onClick={() => addSkill(skillInput)}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add custom &quot;{skillInput.trim()}&quot;
                  </button>
                )}
                {filteredSuggestions.length === 0 && !showAddCustom && (
                  <p className="text-zinc-400 dark:text-zinc-500 text-xs text-center py-3">
                    No matching skills
                  </p>
                )}
              </div>
            )}
        </div>

        <p className="text-xs text-zinc-400 dark:text-zinc-500 font-normal">
          Select from suggestions or type and press Enter to add a custom skill.
        </p>
      </div>
    </Section>
  );
}
