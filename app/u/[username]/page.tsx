import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { 
  Briefcase, 
  Globe, 
  Linkedin, 
  Github, 
  Twitter, 
  Link as LinkIcon, 
  Send,
  Calendar,
  ExternalLink,
  MapPin,
  Code,
  Mail,
  FileText,
  GraduationCap,
  Video,
  Fingerprint,
  Coins,
  Zap,
} from "lucide-react";
import { ElementType } from "react";
import { format } from "date-fns";
import { Metadata } from "next";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getS3Client } from "@/lib/s3";
import { Button } from "@/components/ui/button";
import { PublicProjects } from "./public-projects";
import { LazyVideoEmbed } from "@/components/LazyVideoEmbed";

const getYoutubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const getLoomId = (url: string) => {
  const regExp = /loom\.com\/(share|embed)\/([a-zA-Z0-9]+)/;
  const match = url.match(regExp);
  return match ? match[2] : null;
};

interface PublicProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export async function generateMetadata({ params }: PublicProfilePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const user = await prisma.user.findFirst({
    where: { username: resolvedParams.username.toLowerCase() },
  });

  if (!user) {
    return {
      title: "User Not Found",
    };
  }

  const fullName = [user.firstName, user.middleName, user.lastName].filter(Boolean).join(" ").trim() || user.name || user.username;
  
  return {
    title: fullName,
    description: `View ${fullName}'s professional profile on Lazee.dev. ${user.jobType || ""}`,
    openGraph: {
      title: `${fullName} | Lazee.dev`,
      description: `Check out ${fullName}'s portfolio and experience.`,
      images: user.image ? [user.image] : [],
    },
  };
}

function calculateTotalExperience(
  experiences: {
    startDate: Date | null;
    endDate: Date | null;
    isCurrent: boolean;
  }[]
): string | null {
  let totalMonths = 0;

  experiences.forEach((exp) => {
    if (!exp.startDate) return;
    const start = new Date(exp.startDate);
    const end = exp.isCurrent || !exp.endDate ? new Date() : new Date(exp.endDate);

    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());
    if (months > 0) totalMonths += months;
  });

  if (totalMonths === 0) return null;

  const years = Math.floor(totalMonths / 12);
  const remainingMonths = totalMonths % 12;

  const yearsStr = years > 0 ? `${years} yr${years > 1 ? "s" : ""}` : "";
  const monthsStr =
    remainingMonths > 0
      ? `${remainingMonths} mo${remainingMonths > 1 ? "s" : ""}`
      : "";

  return [yearsStr, monthsStr].filter(Boolean).join(" ");
}

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const resolvedParams = await params;
  const { username } = resolvedParams;

  const user = await prisma.user.findFirst({
    where: { username: username.toLowerCase() },
    include: {
      experiences: { orderBy: { startDate: "desc" } },
      projects: { orderBy: [{ isTopProject: "desc" }, { createdAt: "desc" }] },
      resumes: { orderBy: { version: "desc" } },
      educations: { orderBy: { startDate: "desc" } },
    },
  });

  if (!user) {
    notFound();
  }

  const fullName = [user.firstName, user.middleName, user.lastName].filter(Boolean).join(" ").trim() || user.name || "Anonymous User";
  const totalExperienceString = calculateTotalExperience(user.experiences);

  // Resolve public educations:
  // If user has only 1 education, it automatically shows on public profile.
  // Otherwise, filter by isPublic !== false.
  const userEducations = user.educations || [];
  const publicEducations = userEducations.filter((edu) =>
    userEducations.length === 1 ? true : edu.isPublic !== false
  );

  const rawCollege =
    publicEducations[0]?.schoolName ||
    (user.collegeName && user.collegeName.trim() && user.collegeName !== "NA" && user.collegeName !== "N/A"
      ? user.collegeName
      : null);
  const displayCollege = rawCollege?.trim() || "NA";

  // Generate primary resume presigned URL
  const primaryResume = user.resumes.find(r => r.isPrimary) || user.resumes[0];
  let generatedResumeUrl = user.resumeUrl || null;

  if (primaryResume) {
    try {
      const { s3, bucketName } = getS3Client();
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: primaryResume.key,
      });
      // Expires in 1 hour
      generatedResumeUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    } catch (error) {
      console.error("Failed to generate presigned URL for public profile resume:", error);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-orange-500 selection:text-white pb-16 relative">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/5 via-transparent to-transparent" />

      <div className="relative z-10 container mx-auto max-w-5xl px-4 py-8 md:py-14">
        
        {/* Header Hero Card */}
        <div className="relative mb-8 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-6 md:p-10 shadow-xs overflow-hidden backdrop-blur-xs">
          {/* Subtle glow in corner */}
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-orange-500/5 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-8">
            {/* Avatar block */}
            <div className="h-28 w-28 md:h-36 md:w-36 shrink-0 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800/80 flex items-center justify-center shadow-xs overflow-hidden relative group">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={fullName}
                  width={144}
                  height={144}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl md:text-5xl font-semibold text-zinc-700 dark:text-zinc-300 uppercase">
                  {user.firstName ? user.firstName[0] : ""}
                  {user.lastName ? user.lastName[0] : ""}
                </span>
              )}
            </div>

            {/* Title / Badges */}
            <div className="flex-1 text-center md:text-left space-y-3 min-w-0">
              <div className="space-y-1.5">
                {/* Username & PRO Badge */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                    @{user.username}
                  </span>
                  {user.membership === "PRO" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                      </span>
                      PRO MEMBER
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight truncate py-0.5">
                  {fullName}
                </h1>

                {/* Info Pills */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-0.5">
                  {user.jobType && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-700/80">
                      <Briefcase className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                      {user.jobType}
                    </div>
                  )}
                  {(user.city || user.country) && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-700/80">
                      <Globe className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                      {[user.city, user.country].filter(Boolean).join(", ")}
                    </div>
                  )}
                  {user.noticePeriod !== null && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-700/80">
                      <Calendar className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                      {user.noticePeriod === 0 ? "Immediate" : `${user.noticePeriod}d Notice`}
                    </div>
                  )}
                  {user.currentCtc !== null && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-700/80">
                      <Coins className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                      {user.currency || "USD"} {Number(user.currentCtc).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>

              {/* Social Link strip */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
                {user.linkedin && (
                  <SocialLink href={user.linkedin} icon={Linkedin} label="LinkedIn" />
                )}
                {user.github && (
                  <SocialLink href={user.github} icon={Github} label="GitHub" />
                )}
                {user.twitter && (
                  <SocialLink href={user.twitter} icon={Twitter} label="Twitter" />
                )}
                {user.portfolio && (
                  <SocialLink href={user.portfolio} icon={LinkIcon} label="Portfolio" />
                )}
                {user.telegram && (
                  <SocialLink href={`https://t.me/${user.telegram.replace('@', '')}`} icon={Send} label="Telegram" />
                )}
                {user.other && (
                  <SocialLink href={user.other} icon={LinkIcon} label="Other Links" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid gap-6 lg:grid-cols-3 items-start">
          
          {/* LEFT COLUMN: Sidebar */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-20">
            
            {/* Quick Actions & Contact */}
            <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-5 md:p-6 shadow-xs backdrop-blur-xs">
              <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 pb-3 mb-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
                <Send className="w-4 h-4 text-orange-500" /> Contact &amp; Resume
              </h2>
              <div className="space-y-3">
                {(user.contactEmail || user.email) && (
                  <Button asChild size="default" className="w-full text-xs">
                    <a href={`mailto:${user.contactEmail || user.email}`}>
                      <Mail className="size-3.5" />
                      Email Me
                    </a>
                  </Button>
                )}
                {generatedResumeUrl && (
                  <Button asChild variant="outline" size="default" className="w-full text-xs">
                    <a
                      href={generatedResumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FileText className="size-3.5 text-zinc-500" />
                      View Primary Resume
                    </a>
                  </Button>
                )}

                <div className="pt-2 space-y-2 border-t border-zinc-100 dark:border-zinc-800">
                  {(user.contactEmail || user.email) && (
                    <div className="flex items-center gap-2.5 text-xs text-zinc-600 dark:text-zinc-400 break-all font-normal">
                      <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>{user.contactEmail || user.email}</span>
                    </div>
                  )}
                  {(user.city || user.country) && (
                    <div className="flex items-center gap-2.5 text-xs text-zinc-600 dark:text-zinc-400 font-normal">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>Based in {[user.city, user.country].filter(Boolean).join(", ")}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2.5 text-xs text-zinc-600 dark:text-zinc-400 font-normal">
                    <GraduationCap className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>{displayCollege}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Card */}
            <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-5 md:p-6 shadow-xs backdrop-blur-xs">
              <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 pb-3 mb-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
                <Code className="w-4 h-4 text-orange-500" /> Skills &amp; Tech
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {user.skills && user.skills.length > 0 ? (
                  Array.from(
                    new Set(
                      (user.skills as string[])
                        .map((s: string) => s?.trim())
                        .filter(Boolean)
                    )
                  ).map((skill, idx) => (
                    <span
                      key={`${skill}-${idx}`}
                      className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200/80 dark:border-zinc-700/80"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-zinc-400 dark:text-zinc-500 text-xs font-normal">No skills listed</p>
                )}
              </div>
            </div>

            {/* Demographics / EEOC Card */}
            {(user.gender || user.veteranStatus || user.disabilityStatus) && (
              <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-5 md:p-6 shadow-xs backdrop-blur-xs">
                <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 pb-3 mb-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-orange-500" /> Demographics &amp; EEOC
                </h2>
                <div className="space-y-3">
                  {user.gender && (
                    <div className="space-y-1">
                      <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Gender</span>
                      <div className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 text-zinc-800 dark:text-zinc-200 text-xs font-medium">
                        {user.gender}
                      </div>
                    </div>
                  )}
                  {user.veteranStatus && (
                    <div className="space-y-1">
                      <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Veteran Status</span>
                      <div className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 text-zinc-800 dark:text-zinc-200 text-xs font-medium">
                        {user.veteranStatus}
                      </div>
                    </div>
                  )}
                  {user.disabilityStatus && (
                    <div className="space-y-1">
                      <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Disability Status</span>
                      <div className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 text-zinc-800 dark:text-zinc-200 text-xs font-medium">
                        {user.disabilityStatus}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: Experience, Stats, & Projects */}
          <div className="lg:col-span-2 space-y-6">

            {/* Summary Stats Panel */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-4 text-center shadow-xs">
                <div className="text-2xl md:text-3xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
                  {user.projects.length}
                </div>
                <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mt-0.5">
                  Projects
                </div>
              </div>
              <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-4 text-center shadow-xs">
                <div className="text-2xl md:text-3xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
                  {user.experiences.length}
                </div>
                <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mt-0.5">
                  Experiences
                </div>
              </div>
              <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-4 text-center shadow-xs">
                <div className="text-2xl md:text-3xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
                  {user.skills.length}
                </div>
                <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mt-0.5">
                  Skills
                </div>
              </div>
            </div>
            
            {/* Intro Video Embed */}
            {user.introVideo && (getYoutubeId(user.introVideo) || getLoomId(user.introVideo)) && (
              <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-6 md:p-8 shadow-xs">
                <h2 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 pb-3 mb-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
                  <Video className="w-4 h-4 text-orange-500 shrink-0" /> Intro Video
                </h2>
                <LazyVideoEmbed
                  url={user.introVideo}
                  title={`${fullName}'s Intro Video`}
                />
              </div>
            )}

            {/* Experience Timeline Section */}
            <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-6 md:p-8 shadow-xs">
              <h2 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 pb-3 mb-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2.5">
                <span className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-orange-500" /> Work Experience
                </span>
                {totalExperienceString && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                    {totalExperienceString}
                  </span>
                )}
              </h2>
              <div className="space-y-6 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-zinc-200 dark:before:bg-zinc-800">
                {user.experiences.length > 0 ? (
                  user.experiences.map((exp) => (
                    <div key={exp.id} className="relative pl-7 group">
                      {/* Timeline node */}
                      <div className="absolute left-[1px] top-2 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-zinc-900 bg-orange-500 shadow-2xs" />
                      
                      <div className="space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                          <h3 className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
                            {exp.role} <span className="text-orange-500 font-normal">at</span> {exp.companyName}
                          </h3>
                          <div className="text-xs text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5 shrink-0">
                            <Calendar className="w-3 h-3 text-zinc-400" />
                            <span>
                              {exp.startDate ? format(new Date(exp.startDate), "MMM yyyy") : "N/A"} - {exp.isCurrent ? "Present" : exp.endDate ? format(new Date(exp.endDate), "MMM yyyy") : "N/A"}
                            </span>
                          </div>
                        </div>

                        {/* Location / Meta */}
                        <div className="flex flex-wrap items-center gap-3 pt-0.5">
                          {exp.location && (
                            <span className="inline-flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                              <MapPin className="w-3 h-3 text-zinc-400" />
                              {exp.location}
                            </span>
                          )}
                          {exp.companyWebsite && (
                            <a 
                              href={exp.companyWebsite} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400 hover:underline"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Website
                            </a>
                          )}
                        </div>

                        {exp.description && (
                          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed pt-1 whitespace-pre-line">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-zinc-400 dark:text-zinc-500 text-xs font-normal pl-4">No experience listed</p>
                )}
              </div>
            </div>

            {/* Education Timeline Section */}
            {publicEducations.length > 0 && (
              <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-6 md:p-8 shadow-xs">
                <h2 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 pb-3 mb-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-orange-500" /> Education
                </h2>
                <div className="space-y-6 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-zinc-200 dark:before:bg-zinc-800">
                  {publicEducations.map((edu) => (
                    <div key={edu.id} className="relative pl-7 group">
                      <div className="absolute left-[1px] top-2 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-zinc-900 bg-orange-500 shadow-2xs" />
                      
                      <div className="space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                          <h3 className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
                            {edu.schoolName || edu.degree || edu.fieldOfStudy || "Education"}
                          </h3>
                          <div className="text-xs text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5 shrink-0">
                            <Calendar className="w-3 h-3 text-zinc-400" />
                            <span>
                              {edu.startDate ? format(new Date(edu.startDate), "MMM yyyy") : "N/A"} - {edu.isCurrent ? "Present" : edu.endDate ? format(new Date(edu.endDate), "MMM yyyy") : "N/A"}
                            </span>
                          </div>
                        </div>

                        {(edu.degree || edu.fieldOfStudy) && (
                          <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                            {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(" in ")}
                          </div>
                        )}

                        {edu.description && (
                          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed pt-1 whitespace-pre-line">
                            {edu.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects Section */}
            <PublicProjects
              projects={user.projects}
              membership={user.membership}
            />

          </div>
        </div>

        {/* Brand Footer Banner */}
        <div className="mt-12 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 text-white p-6 md:p-8 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="size-6 rounded-md bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-white tracking-tight">
                Tired of typing job applications?
              </h3>
            </div>
            <p className="text-xs text-zinc-400 max-w-xl font-normal">
              Auto-fill repetitive job application forms in seconds across Greenhouse, Lever, Workday, and Ashby with Lazee.dev.
            </p>
          </div>
          <Button asChild size="default" className="shrink-0 w-full md:w-auto px-5 text-xs">
            <a
              href="https://lazee.dev"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get Lazee Free
            </a>
          </Button>
        </div>

      </div>
    </div>
  );
}

function SocialLink({ href, icon: Icon, label }: { href: string; icon: ElementType; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="h-9 w-9 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/80 hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 text-zinc-600 dark:text-zinc-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors shadow-2xs cursor-pointer"
      aria-label={label}
    >
      <Icon className="w-4 h-4" />
    </a>
  );
}
