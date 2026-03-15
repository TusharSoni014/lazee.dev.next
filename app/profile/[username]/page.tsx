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
  Code
} from "lucide-react";
import { format } from "date-fns";
import clsx from "clsx";
import { Metadata } from "next";

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

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const resolvedParams = await params;
  const { username } = resolvedParams;

  const user = await prisma.user.findFirst({
    where: { username: username.toLowerCase() },
    include: {
      experiences: { orderBy: { startDate: "desc" } },
      projects: { orderBy: [{ isTopProject: "desc" }, { createdAt: "desc" }] },
    },
  });

  if (!user) {
    notFound();
  }

  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.name || "Anonymous User";

  return (
    <div className="min-h-screen bg-[#fefaf6] selection:bg-orange-500 selection:text-white overflow-x-hidden">
      {/* Background Pattern */}
      <div
        className="fixed inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 container mx-auto max-w-4xl px-4 py-8 md:py-16">
        {/* Header Section */}
        <div className="mb-12 border-[4px] border-black bg-white p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-center gap-10">
          <div className="h-40 w-40 shrink-0 rounded-none border-[4px] border-black bg-[#fefaf6] flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative group">
            {user.image ? (
              <Image
                src={user.image}
                alt={fullName}
                width={160}
                height={160}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-6xl font-black text-black">
                {user.firstName ? user.firstName[0] : ""}
                {user.lastName ? user.lastName[0] : ""}
              </span>
            )}
          </div>

          <div className="flex-1 text-center md:text-left space-y-4 min-w-0">
            <div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase font-heading text-black tracking-tighter leading-none italic truncate">
                {fullName}
              </h1>
              <div className="mt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                <div className="inline-flex items-center gap-2 border-[2px] border-black px-3 py-1 bg-orange-500 text-black font-bold uppercase text-xs tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  @{user.username}
                </div>
                {user.jobType && (
                  <div className="inline-flex items-center gap-2 border-[2px] border-black px-3 py-1 bg-blue-400 text-black font-bold uppercase text-xs tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Briefcase className="w-3 h-3" />
                    {user.jobType}
                  </div>
                )}
                {user.country && (
                  <div className="inline-flex items-center gap-2 border-[2px] border-black px-3 py-1 bg-white text-black font-bold uppercase text-xs tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Globe className="w-3 h-3" />
                    {user.country}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
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
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Info & Skills */}
          <div className="lg:col-span-1 space-y-8">
            {/* Skills */}
            <Section title="Skills" icon={Code}>
              <div className="flex flex-wrap gap-2">
                {user.skills.length > 0 ? (
                  user.skills.map((skill) => (
                    <span
                      key={skill}
                      className="border-[2px] border-black px-3 py-1 bg-white text-black font-bold uppercase text-[10px] tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-zinc-500 font-bold uppercase text-xs italic">No skills listed</p>
                )}
              </div>
            </Section>
          </div>

          {/* Right Column - Experience & Projects */}
          <div className="md:col-span-2 space-y-10">
            {/* Experience */}
            <Section title="Experience" icon={Briefcase}>
              <div className="space-y-6">
                {user.experiences.length > 0 ? (
                  user.experiences.map((exp) => (
                    <div key={exp.id} className="relative pl-6 border-l-[3px] border-black pb-4 last:pb-0">
                      <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-none border-[3px] border-black bg-orange-500" />
                      <div className="space-y-1">
                        <h3 className="text-lg font-black uppercase text-black leading-none">
                          {exp.role} @ {exp.companyName}
                        </h3>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          {exp.startDate ? format(new Date(exp.startDate), "MMM yyyy") : "N/A"} - {exp.isCurrent ? "Present" : exp.endDate ? format(new Date(exp.endDate), "MMM yyyy") : "N/A"}
                        </p>
                        {exp.description && (
                          <p className="text-sm text-zinc-700 mt-3 font-medium line-clamp-4 leading-normal">
                            {exp.description}
                          </p>
                        )}
                        {exp.companyWebsite && (
                          <a 
                            href={exp.companyWebsite} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 underline uppercase tracking-widest pt-2"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Visit Company
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-zinc-500 font-bold uppercase text-xs italic">No experience listed</p>
                )}
              </div>
            </Section>

            {/* Projects */}
            <Section title="Featured Projects" icon={Globe}>
              <div className="grid gap-6">
                {user.projects.length > 0 ? (
                  user.projects.map((project) => (
                    <div 
                      key={project.id} 
                      className={clsx(
                        "group border-[3px] border-black p-5 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all",
                        project.isTopProject && "bg-orange-50 border-orange-500 shadow-orange-500/20"
                      )}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-black uppercase text-black italic">
                          {project.name}
                        </h3>
                        {project.isTopProject && (
                          <span className="bg-orange-500 text-black text-[9px] font-black px-2 py-0.5 border-[2px] border-black uppercase tracking-tighter shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-zinc-700 font-medium mb-4 line-clamp-3">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.stacks.map((stack) => (
                          <span key={stack} className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                            #{stack}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-4">
                        {project.activeLink && (
                          <a 
                            href={project.activeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-[10px] font-bold text-black border-b-[2px] border-black hover:bg-black hover:text-white px-1 transition-colors uppercase tracking-widest"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Live Demo
                          </a>
                        )}
                        {project.githubLink && (
                          <a 
                            href={project.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-[10px] font-bold text-black border-b-[2px] border-black hover:bg-black hover:text-white px-1 transition-colors uppercase tracking-widest"
                          >
                            <Github className="w-3 h-3" />
                            Source Code
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-zinc-500 font-bold uppercase text-xs italic">No projects listed</p>
                )}
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="border-[4px] border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-full">
      <div className="flex items-center gap-3 mb-6 border-b-[3px] border-black pb-3">
        <Icon className="w-6 h-6 text-black" />
        <h2 className="text-xl font-black uppercase tracking-tighter text-black font-heading italic">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

function SocialLink({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="h-10 w-10 flex items-center justify-center border-[3px] border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all md:h-12 md:w-12 group"
      aria-label={label}
    >
      <Icon className="w-5 h-5 text-black group-hover:text-orange-500 transition-colors" />
    </a>
  );
}
