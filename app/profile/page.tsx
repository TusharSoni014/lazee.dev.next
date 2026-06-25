import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfileForm from "./profile-form";
import { SignOutButton } from "@/components/SignOutButton";
import { Lock, FileText, Sparkles, Globe, Key, UserCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ payment?: string; status?: string }>;
}) {
  const params = await searchParams;
  // Detect success from our own ?payment=success OR from Dodo's appended ?status=active
  const paymentSuccess =
    params.payment === "success" || params.status === "active";
  const session = await auth();

  if (!session?.user?.email) {
    return (
      <div className="relative min-h-screen bg-[#fefaf6] selection:bg-orange-500 selection:text-white pb-20 overflow-x-hidden">
        {/* Background Dots Pattern */}
        <div
          className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 container mx-auto max-w-2xl px-4 py-16 md:py-28 flex flex-col items-center">
          
          {/* Main Card */}
          <div className="w-full border-[4px] border-black bg-white p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden transition-all duration-300">
            {/* Grid background effect */}
            <div 
              className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
                backgroundSize: "20px 20px"
              }}
            />

            {/* Top row window control circles */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 z-10">
              <span className="w-3 h-3 rounded-full border border-black bg-red-400"></span>
              <span className="w-3 h-3 rounded-full border border-black bg-yellow-400"></span>
              <span className="w-3 h-3 rounded-full border border-black bg-green-400"></span>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
              
              {/* Lock Icon Block */}
              <div className="h-16 w-16 rounded-none border-[3px] border-black bg-orange-100 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black">
                <Lock className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-black italic leading-none">
                  Sign In Required
                </h1>
                <p className="text-xs font-black text-zinc-500 uppercase tracking-widest">
                  Create or manage your lazee.dev profile
                </p>
              </div>

              {/* Informative list */}
              <div className="w-full border-t-2 border-dashed border-black pt-6 text-left space-y-4">
                <p className="text-sm font-extrabold text-black uppercase tracking-tight text-center mb-2">
                  What you can do with a Lazee.dev profile:
                </p>
                <div className="grid gap-3.5 text-xs font-bold text-zinc-700">
                  <div className="flex items-start gap-3 p-2.5 border-2 border-black bg-orange-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <UserCheck className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-black text-black uppercase tracking-wide">Personal Details & Socials</p>
                      <p className="text-zinc-600 mt-0.5">Securely store your name, contact email, notice period, and social media handles.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-2.5 border-2 border-black bg-yellow-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <FileText className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-black text-black uppercase tracking-wide">Resume Manager</p>
                      <p className="text-zinc-600 mt-0.5">Upload and manage multiple resume versions. Instantly choose the active one during autofills.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-2.5 border-2 border-black bg-cyan-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Globe className="w-4 h-4 text-cyan-650 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-black text-black uppercase tracking-wide">Shareable Public Profile Page</p>
                      <p className="text-zinc-600 mt-0.5">Claim a neat `/u/username` link to share your portfolio, experiences, and projects with recruiters.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-2.5 border-2 border-black bg-purple-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-black text-black uppercase tracking-wide">Custom AI guidance</p>
                      <p className="text-zinc-600 mt-0.5">Write custom guidelines to direct the AI how to automatically respond to open-ended job questions.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Login CTA Button */}
              <div className="w-full pt-4">
                <a
                  href="/login"
                  className="w-full flex items-center justify-center gap-2 bg-orange-500 text-black font-black uppercase text-sm tracking-wider border-[3px] border-black py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all text-center cursor-pointer select-none"
                >
                  <Key className="w-4 h-4 shrink-0" />
                  Log In or Sign Up
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }

  let user = null;
  const maxRetries = 3;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
          resumes: { orderBy: { version: "desc" } },
          experiences: { orderBy: { startDate: "desc" } },
          projects: { orderBy: { createdAt: "desc" } },
        },
      });
      break; // Success, exit retry loop
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      const isTransient = code === "ECONNRESET" || code === "ETIMEDOUT" || code === "EPIPE";
      if (isTransient && attempt < maxRetries) {
        console.warn(`Profile DB query failed (attempt ${attempt}/${maxRetries}): ${code}. Retrying...`);
        await new Promise((r) => setTimeout(r, 500 * attempt));
        continue;
      }
      throw err; // Non-transient or exhausted retries
    }
  }

  if (!user) {
    redirect("/");
  }

  return (
    <div className="relative min-h-screen bg-[#fefaf6] selection:bg-orange-500 selection:text-white pb-20">
      {/* Background Pattern */}
      <div
        className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 container mx-auto max-w-5xl px-4 py-12 md:py-20">
        <div className="mb-12 flex flex-col items-center text-center">
          <h1 className="text-4xl font-black tracking-tighter text-black sm:text-6xl font-heading uppercase italic">
            Your{" "}
            <span className="text-orange-500 underline decoration-[3px] underline-offset-4">
              Profile
            </span>
          </h1>
          <p className="mt-4 max-w-lg text-lg font-bold text-zinc-700 uppercase tracking-tight">
            Manage your account settings, membership, and personal details.
          </p>
        </div>

        <ProfileForm user={user} paymentSuccess={paymentSuccess} />

        <div className="mt-16 flex flex-col items-center border-t-[3px] border-black pt-8">
          <h2 className="mb-6 text-2xl font-black uppercase tracking-tighter text-black font-heading">
            Account Actions
          </h2>
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
