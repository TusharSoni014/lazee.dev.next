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
  Phone,
  FileText,
  Folder,
  Sparkles,
  GraduationCap,
  Video
} from "lucide-react";
import { ElementType } from "react";
import { format } from "date-fns";
import clsx from "clsx";
import { Metadata } from "next";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getS3Client } from "@/lib/s3";
import { ProjectCarousel } from "@/components/ProjectCarousel";
import { getPublicImageUrl } from "@/lib/utils";
import phoneList from "@/lib/phone_list.json";

function getFlagEmoji(countryCode: string) {
  if (!countryCode || countryCode.length !== 2) return "";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

function getFlagAndDialCode(dialCode: string) {
  if (!dialCode) return "";
  const cleanDialCode = dialCode.trim();
  const match = phoneList.find((c) => c.dial_code === cleanDialCode);
  if (match) {
    return `${getFlagEmoji(match.code)} ${cleanDialCode}`;
  }
  return cleanDialCode;
}

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

const BADGE_COLORS = [
  "bg-orange-100 hover:bg-orange-200",
  "bg-yellow-100 hover:bg-yellow-200",
  "bg-cyan-100 hover:bg-cyan-200",
  "bg-amber-100 hover:bg-amber-200",
  "bg-pink-100 hover:bg-pink-200",
  "bg-emerald-100 hover:bg-emerald-200",
];



export async function generateMetadata({ params }: PublicProfilePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const user = await prisma.user.findFirst({
    where: { username: resolvedParams.username.toLowerCase() },
  });

  if (!user) {
    return {
      title: "User Not Found | Lazee.dev",
    };
  }

  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.name || user.username;
  
  return {
    title: `${fullName} | Lazee.dev Profile`,
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
    const end = exp.isCurrent
      ? new Date()
      : exp.endDate
      ? new Date(exp.endDate)
      : new Date();

    const startYear = start.getFullYear();
    const startMonth = start.getMonth();
    const endYear = end.getFullYear();
    const endMonth = end.getMonth();

    const months = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
    if (months > 0) {
      totalMonths += months;
    }
  });

  if (totalMonths <= 0) return null;

  const years = Math.floor(totalMonths / 12);
  const remainingMonths = totalMonths % 12;

  const yearsStr = years > 0 ? `${years} ${years === 1 ? "year" : "years"}` : "";
  const monthsStr =
    remainingMonths > 0
      ? `${remainingMonths} ${remainingMonths === 1 ? "month" : "months"}`
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

  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.name || "Anonymous User";
  const totalExperienceString = calculateTotalExperience(user.experiences);

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
    <div className="min-h-screen bg-[#fefaf6] selection:bg-orange-500 selection:text-white overflow-x-hidden pb-16">
      {/* Background Dots Pattern */}
      <div
        className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 container mx-auto max-w-5xl px-4 py-8 md:py-16">
        
        {/* Header Hero Section */}
        <div className="relative mb-8 border-[4px] border-black bg-white p-6 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden transition-all duration-300">
          {/* Grid background effect */}
          <div 
            className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
              backgroundSize: "20px 20px"
            }}
          />

          {/* Window control circles in top-right */}
          <div className="absolute top-4 right-4 hidden md:flex items-center gap-1.5 z-10">
            <span className="w-3.5 h-3.5 rounded-full border-2 border-black bg-red-400"></span>
            <span className="w-3.5 h-3.5 rounded-full border-2 border-black bg-yellow-400"></span>
            <span className="w-3.5 h-3.5 rounded-full border-2 border-black bg-green-400"></span>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-10">
            {/* Avatar block */}
            <div className="h-44 w-44 shrink-0 rounded-none border-[4px] border-black bg-[#fefaf6] flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={fullName}
                  width={176}
                  height={176}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-6xl font-black text-black">
                  {user.firstName ? user.firstName[0] : ""}
                  {user.lastName ? user.lastName[0] : ""}
                </span>
              )}
            </div>

            {/* Title / Badges */}
            <div className="flex-1 text-center md:text-left space-y-4 min-w-0">
              <div className="space-y-2">
                {/* PRO Badge */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                  <span className="inline-flex items-center gap-1 border-[2px] border-black px-2.5 py-0.5 bg-orange-500 text-black font-black uppercase text-[10px] tracking-widest shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)]">
                    @{user.username}
                  </span>
                  {user.membership === "PRO" && (
                    <span className="relative inline-flex items-center gap-1 px-2.5 py-0.5 bg-yellow-300 text-black border-[2px] border-black font-black uppercase text-[10px] tracking-widest shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] hover:scale-105 transition-all select-none">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-500"></span>
                      </span>
                      PRO MEMBER
                    </span>
                  )}
                </div>

                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase font-heading text-black tracking-tighter leading-none italic truncate py-1">
                  {fullName}
                </h1>

                {/* Info Pills */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-1">
                  {user.jobType && (
                    <div className="inline-flex items-center gap-1.5 border-[2px] border-black px-2.5 py-1 bg-cyan-200 text-black font-bold uppercase text-[10px] tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <Briefcase className="w-3.5 h-3.5 text-black" />
                      {user.jobType}
                    </div>
                  )}
                  {(user.city || user.country) && (
                    <div className="inline-flex items-center gap-1.5 border-[2px] border-black px-2.5 py-1 bg-orange-200 text-black font-bold uppercase text-[10px] tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <Globe className="w-3.5 h-3.5 text-black" />
                      {[user.city, user.country].filter(Boolean).join(", ")}
                    </div>
                  )}
                  {user.noticePeriod !== null && (
                    <div className="inline-flex items-center gap-1.5 border-[2px] border-black px-2.5 py-1 bg-emerald-200 text-black font-bold uppercase text-[10px] tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <Calendar className="w-3.5 h-3.5 text-black" />
                      {user.noticePeriod === 0 ? "Immediate" : `${user.noticePeriod}d Notice`}
                    </div>
                  )}
                </div>
              </div>

              {/* Social Link strip */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
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

        {/* Dynamic Asymmetrical Grid */}
        <div className="grid gap-8 lg:grid-cols-3 items-start">
          
          {/* LEFT COLUMN: Sticky Sidebar */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
            
            {/* Quick Actions & Contact */}
            <div className="border-[4px] border-black bg-white p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-lg font-black uppercase tracking-tighter text-black border-b-[2px] border-black pb-2 mb-4 italic flex items-center gap-2">
                <Send className="w-5 h-5" /> Contact & Info
              </h2>
              <div className="space-y-4">
                {(user.contactEmail || user.email) && (
                  <a
                    href={`mailto:${user.contactEmail || user.email}`}
                    className="w-full flex items-center justify-center gap-2 bg-[#ff6b00] text-white font-black uppercase text-xs tracking-wider border-[3px] border-black py-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all text-center"
                  >
                    <Mail className="w-4 h-4 text-white" />
                    Email Me
                  </a>
                )}
                {generatedResumeUrl && (
                  <a
                    href={generatedResumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-[#ffeb3b] text-black font-black uppercase text-xs tracking-wider border-[3px] border-black py-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all text-center"
                  >
                    <FileText className="w-4 h-4" />
                    View Resume
                  </a>
                )}

                <div className="pt-2 space-y-2.5">
                  {(user.contactEmail || user.email) && (
                    <div className="flex items-center gap-2.5 text-xs font-bold text-zinc-700 break-all">
                      <Mail className="w-4 h-4 text-black shrink-0" />
                      <span>{user.contactEmail || user.email}</span>
                    </div>
                  )}
                  {user.phoneNumber && (
                    <div className="flex items-center gap-2.5 text-xs font-bold text-zinc-700">
                      <Phone className="w-4 h-4 text-black shrink-0" />
                      <span>
                        {user.countryCode ? `${getFlagAndDialCode(user.countryCode)} ` : ""}
                        {user.phoneNumber}
                      </span>
                    </div>
                  )}
                  {(user.city || user.country) && (
                    <div className="flex items-center gap-2.5 text-xs font-bold text-zinc-700">
                      <MapPin className="w-4 h-4 text-black shrink-0" />
                      <span>Based in {[user.city, user.country].filter(Boolean).join(", ")}</span>
                    </div>
                  )}
                  {user.collegeName && (
                    <div className="flex items-center gap-2.5 text-xs font-bold text-zinc-700">
                      <GraduationCap className="w-4 h-4 text-black shrink-0" />
                      <span>{user.collegeName}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Skills Card */}
            <div className="border-[4px] border-black bg-white p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-lg font-black uppercase tracking-tighter text-black border-b-[2px] border-black pb-2 mb-4 italic flex items-center gap-2">
                <Code className="w-5 h-5" /> Skills & Tech
              </h2>
              <div className="flex flex-wrap gap-2.5">
                {user.skills && user.skills.length > 0 ? (
                  user.skills.map((skill, index) => {
                    const badgeBg = BADGE_COLORS[index % BADGE_COLORS.length];
                    return (
                      <span
                        key={skill}
                        className={clsx(
                          "border-[2px] border-black px-2.5 py-1 text-black font-black uppercase text-[10px] tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:scale-105 transition-all",
                          badgeBg
                        )}
                      >
                        {skill}
                      </span>
                    );
                  })
                ) : (
                  <p className="text-zinc-500 font-bold uppercase text-xs italic">No skills listed</p>
                )}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Experience, Stats, & Projects */}
          <div className="lg:col-span-2 space-y-6">

            {/* Summary Stats Panel */}
            <div className="grid grid-cols-3 gap-4">
              <div className="border-[3px] border-black bg-orange-100 p-4 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-2xl md:text-3xl font-black text-black">
                  {user.projects.length}
                </div>
                <div className="text-[9px] md:text-[10px] font-black text-zinc-600 uppercase tracking-wider mt-1">
                  Projects
                </div>
              </div>
              <div className="border-[3px] border-black bg-yellow-100 p-4 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-2xl md:text-3xl font-black text-black">
                  {user.experiences.length}
                </div>
                <div className="text-[9px] md:text-[10px] font-black text-zinc-600 uppercase tracking-wider mt-1">
                  Experiences
                </div>
              </div>
              <div className="border-[3px] border-black bg-cyan-100 p-4 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-2xl md:text-3xl font-black text-black">
                  {user.skills.length}
                </div>
                <div className="text-[9px] md:text-[10px] font-black text-zinc-600 uppercase tracking-wider mt-1">
                  Skills
                </div>
              </div>
            </div>
            
            {/* Intro Video Embed */}
            {user.introVideo && (
              (() => {
                const ytId = getYoutubeId(user.introVideo);
                const lId = getLoomId(user.introVideo);
                const embedUrl = ytId 
                  ? `https://www.youtube.com/embed/${ytId}` 
                  : lId 
                    ? `https://www.loom.com/embed/${lId}` 
                    : null;
                
                if (!embedUrl) return null;

                return (
                  <div className="border-[4px] border-black bg-white p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-black border-b-[3px] border-black pb-3 mb-6 italic flex items-center gap-2.5">
                      <Video className="w-6 h-6 text-black shrink-0" /> Intro Video
                    </h2>
                    <div className="aspect-video w-full border-[3px] border-black bg-zinc-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                      <iframe
                        src={embedUrl}
                        className="absolute inset-0 w-full h-full"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      />
                    </div>
                  </div>
                );
              })()
            )}

            {/* Experience Timeline Section */}
            <div className="border-[4px] border-black bg-white p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-black border-b-[3px] border-black pb-3 mb-6 italic flex items-center justify-between gap-2.5">
                <span className="flex items-center gap-2.5">
                  <Briefcase className="w-6 h-6 text-black" /> Work Experience
                </span>
                {totalExperienceString && (
                  <span className="inline-flex items-center border-[2px] border-black px-2.5 py-1 bg-yellow-100 text-black font-black uppercase text-[10px] md:text-xs tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] not-italic">
                    {totalExperienceString}
                  </span>
                )}
              </h2>
              <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[3px] before:bg-black">
                {user.experiences.length > 0 ? (
                  user.experiences.map((exp) => (
                    <div key={exp.id} className="relative pl-8 group">
                      {/* Timeline circle node */}
                      <div className="absolute left-[3px] top-1.5 h-[19px] w-[19px] border-[3px] border-black bg-[#ffeb3b] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] group-hover:bg-[#ff6b00] transition-colors duration-200" />
                      
                      <div className="space-y-1.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h3 className="text-base md:text-lg font-black uppercase text-black leading-tight">
                            {exp.role} <span className="text-orange-500">@</span> {exp.companyName}
                          </h3>
                          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 shrink-0 text-black" />
                            <span>
                              {exp.startDate ? format(new Date(exp.startDate), "MMM yyyy") : "N/A"} - {exp.isCurrent ? "Present" : exp.endDate ? format(new Date(exp.endDate), "MMM yyyy") : "N/A"}
                            </span>
                          </div>
                        </div>

                        {/* Location / Meta */}
                        <div className="flex flex-wrap items-center gap-3">
                          {exp.location && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
                              <MapPin className="w-3.5 h-3.5" />
                              {exp.location}
                            </span>
                          )}
                          {exp.companyWebsite && (
                            <a 
                              href={exp.companyWebsite} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-800 underline uppercase tracking-wider"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Website
                            </a>
                          )}
                        </div>

                        {exp.description && (
                          <p className="text-sm text-zinc-700 font-medium leading-relaxed pt-1 whitespace-pre-line text-justify">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-zinc-500 font-bold uppercase text-xs italic pl-4">No experience listed</p>
                )}
              </div>
            </div>

            {/* Education Timeline Section */}
            {user.educations && user.educations.length > 0 && (
              <div className="border-[4px] border-black bg-white p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-black border-b-[3px] border-black pb-3 mb-6 italic flex items-center gap-2.5">
                  <GraduationCap className="w-6 h-6 text-black shrink-0" /> Education
                </h2>
                <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[3px] before:bg-black">
                  {user.educations.map((edu) => (
                    <div key={edu.id} className="relative pl-8 group">
                      <div className="absolute left-[3px] top-1.5 h-[19px] w-[19px] border-[3px] border-black bg-[#ffeb3b] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] group-hover:bg-[#ff6b00] transition-colors duration-200" />
                      
                      <div className="space-y-1.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h3 className="text-base md:text-lg font-black uppercase text-black leading-tight">
                            {edu.degree || edu.fieldOfStudy || "Education"}{edu.schoolName ? ` at ${edu.schoolName}` : ""}
                          </h3>
                          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 shrink-0 text-black" />
                            <span>
                              {edu.startDate ? format(new Date(edu.startDate), "MMM yyyy") : "N/A"} - {edu.isCurrent ? "Present" : edu.endDate ? format(new Date(edu.endDate), "MMM yyyy") : "N/A"}
                            </span>
                          </div>
                        </div>

                        {(edu.degree || edu.fieldOfStudy) && (
                          <div className="text-xs font-bold text-zinc-600 uppercase tracking-wide">
                            {edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                          </div>
                        )}

                        {edu.description && (
                          <p className="text-sm text-zinc-700 font-medium leading-relaxed pt-1 whitespace-pre-line text-justify">
                            {edu.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Featured Projects Section */}
            <div className="border-[4px] border-black bg-white p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-black border-b-[3px] border-black pb-3 mb-6 italic flex items-center gap-2.5">
                <Folder className="w-6 h-6 text-black" /> Projects & Creations
              </h2>
              <div className="grid gap-6">
                {user.projects.length > 0 ? (
                  user.projects.map((project) => (
                    <div 
                      key={project.id} 
                      className={clsx(
                        "group border-[3px] border-black bg-white shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all overflow-hidden",
                        project.isTopProject && "border-orange-500 shadow-orange-500/20"
                      )}
                    >
                      {/* Window Header bar (Retro Folder Style) */}
                      <div className={clsx(
                        "flex items-center justify-between border-b-[3px] border-black px-4 py-2 bg-zinc-50",
                        project.isTopProject && "bg-orange-50 border-orange-500"
                      )}>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full border border-black bg-red-400"></span>
                          <span className="w-2.5 h-2.5 rounded-full border border-black bg-yellow-400"></span>
                          <span className="w-2.5 h-2.5 rounded-full border border-black bg-green-400"></span>
                        </div>
                        {project.isTopProject && (
                          <span className="inline-flex items-center gap-1 bg-orange-500 text-black text-[9px] font-black px-2 py-0.5 border-[2px] border-black uppercase tracking-wider shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] select-none animate-pulse">
                            <Sparkles className="w-2.5 h-2.5 fill-black" /> Featured Project
                          </span>
                        )}
                      </div>

                      {/* Card Body */}
                      <div className="p-5 space-y-4">
                        <div className="space-y-1">
                          <h3 className="text-lg md:text-xl font-black uppercase text-black leading-tight italic">
                            {project.name}
                          </h3>
                          
                          {/* Project details list (Role, Duration) */}
                          <div className="flex flex-wrap items-center gap-3 text-[10px] font-black text-zinc-500 uppercase tracking-wider">
                            {project.role && (
                              <span className="inline-flex items-center gap-1.5 border border-zinc-300 px-2 py-0.5 bg-zinc-100 text-zinc-700">
                                Role: {project.role}
                              </span>
                            )}
                            {project.duration && (
                              <span className="inline-flex items-center gap-1.5 border border-zinc-300 px-2 py-0.5 bg-zinc-100 text-zinc-700">
                                Duration: {project.duration}
                              </span>
                            )}
                          </div>
                        </div>

                        {project.description && (
                          <p className="text-sm text-zinc-700 font-medium leading-relaxed">
                            {project.description}
                          </p>
                        )}

                        {project.contribution && (
                          <div className="border-[2px] border-dashed border-black bg-[#fafafa] p-3 text-xs text-zinc-700 font-medium space-y-1">
                            <p className="font-black uppercase text-[9px] text-black tracking-wider">My Contributions:</p>
                            <p className="leading-relaxed whitespace-pre-line">{project.contribution}</p>
                          </div>
                        )}

                        {/* Stacks tags */}
                        {project.stacks && project.stacks.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {project.stacks.map((stack) => (
                              <span key={stack} className="text-[9px] font-black border border-black bg-zinc-100 text-zinc-700 uppercase tracking-widest px-2 py-0.5">
                                #{stack}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Screenshots Carousel/Grid */}
                        {(() => {
                          const maxScreenshots = user.membership === "PRO" ? 10 : 3;
                          const activeScreenshots = (project.screenshots || [])
                            .slice(0, maxScreenshots)
                            .map((url) => getPublicImageUrl(url));

                          if (activeScreenshots.length === 0) return null;

                          return (
                            <div className="space-y-2 mt-4 pt-1">
                              <p className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Project Media / Screenshots:</p>
                              {activeScreenshots.length >= 3 ? (
                                <ProjectCarousel screenshots={activeScreenshots} />
                              ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  {activeScreenshots.map((url, idx) => (
                                    <a
                                      key={idx}
                                      href={url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="relative aspect-video border-[3px] border-black bg-zinc-100 overflow-hidden group shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                                    >
                                      <img
                                        src={url}
                                        alt={`${project.name} screenshot ${idx + 1}`}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                      />
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })()}

                        {/* Project Actions */}
                        <div className="flex gap-4 pt-4 border-t border-zinc-100">
                          {project.activeLink && (
                            <a 
                              href={project.activeLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-[10px] font-black text-black border-b-[2px] border-black hover:bg-black hover:text-white px-1 py-0.5 transition-colors uppercase tracking-widest"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              Live Demo
                            </a>
                          )}
                          {project.githubLink && (
                            <a 
                              href={project.githubLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-[10px] font-black text-black border-b-[2px] border-black hover:bg-black hover:text-white px-1 py-0.5 transition-colors uppercase tracking-widest"
                            >
                              <Github className="w-3.5 h-3.5" />
                              Source Code
                            </a>
                          )}
                        </div>
                      </div>

                    </div>
                  ))
                ) : (
                  <p className="text-zinc-500 font-bold uppercase text-xs italic pl-4">No projects listed</p>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Viral Brand Footer Banner */}
        <div className="mt-12 border-[4px] border-black bg-[#ffeb3b] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-black uppercase text-black italic leading-none">
              Tired of typing job applications? ⚡
            </h3>
            <p className="text-xs font-bold text-black/80 uppercase tracking-tight">
              Auto-fill job applications in seconds using AI. Create your own portfolio on Lazee.dev.
            </p>
          </div>
          <a
            href="https://lazee.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 w-full md:w-auto text-center bg-black text-white font-black uppercase text-xs tracking-wider border-[3px] border-black px-6 py-3.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
          >
            Get Lazee.dev Pro
          </a>
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
      className="h-10 w-10 flex items-center justify-center border-[3px] border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all md:h-11 md:w-11 group"
      aria-label={label}
    >
      <Icon className="w-4.5 h-4.5 text-black group-hover:text-orange-500 transition-colors" />
    </a>
  );
}

