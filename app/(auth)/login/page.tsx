import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AuthForm from "@/components/AuthForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to Lazee.dev to sync your profile and browser extension.",
};

interface LoginPageProps {
  searchParams?: Promise<{
    callbackUrl?: string;
    extensionId?: string;
    [key: string]: string | string[] | undefined;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth();

  if (session?.user) {
    const params = await searchParams;
    const extensionId =
      typeof params?.extensionId === "string" ? params.extensionId : undefined;
    if (extensionId) {
      redirect(`/?extensionId=${extensionId}&logged_in=true`);
    }

    const callbackUrl =
      typeof params?.callbackUrl === "string" ? params.callbackUrl : undefined;
    if (
      callbackUrl &&
      callbackUrl.startsWith("/") &&
      !callbackUrl.startsWith("//")
    ) {
      redirect(callbackUrl);
    }

    redirect("/profile");
  }

  return (
    <div className="flex flex-1 w-full h-[calc(100dvh-4rem)] max-h-[calc(100dvh-4rem)] overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      {/* Left Column: Minimal Warm Mesh Gradient Card (Desktop Only) */}
      <div className="hidden lg:flex flex-col w-1/2 p-3 lg:p-4 xl:p-6 h-full justify-center">
        <div className="relative w-full h-full rounded-3xl overflow-hidden p-8 lg:p-12 xl:p-16 flex flex-col justify-center border border-orange-200/50 dark:border-orange-500/20 shadow-xl shadow-orange-500/5">
          {/* Base Warm Mesh Gradient Layers */}
          <div
            className="absolute inset-0 pointer-events-none select-none"
            style={{
              backgroundColor: "#fff6f0",
              backgroundImage: `
                radial-gradient(circle at 55% 72%, #f97316 0%, #fb923c 24%, #fdba74 46%, rgba(254, 215, 170, 0.45) 68%, transparent 88%),
                radial-gradient(circle at 85% 25%, rgba(253, 186, 116, 0.5) 0%, rgba(254, 215, 170, 0.25) 40%, transparent 70%),
                radial-gradient(circle at 15% 15%, #ffffff 0%, rgba(255, 247, 237, 0.85) 50%, transparent 85%),
                linear-gradient(165deg, #fffaf7 0%, #fff1e6 32%, #fedfcb 68%, #fed3b7 100%)
              `,
            }}
          />

          {/* Diffused Glow Blobs for Soft Depth */}
          <div className="absolute -bottom-16 left-[18%] w-[420px] h-[420px] rounded-full bg-[#f97316] opacity-85 blur-[90px] pointer-events-none" />
          <div className="absolute bottom-[20%] -right-12 w-[340px] h-[340px] rounded-full bg-[#fb923c] opacity-65 blur-[80px] pointer-events-none" />
          <div className="absolute -top-12 -left-12 w-[320px] h-[320px] rounded-full bg-white opacity-95 blur-[65px] pointer-events-none" />
          <div className="absolute top-[28%] right-[15%] w-[260px] h-[260px] rounded-full bg-[#fda472] opacity-40 blur-[75px] pointer-events-none" />

          {/* Clean Minimal Content */}
          <div className="relative z-10 max-w-lg">
            <p className="text-xs sm:text-sm font-mono font-medium uppercase tracking-widest text-orange-950/70 mb-3">
              One profile • Zero busywork
            </p>
            <h1 className="text-3xl sm:text-4xl xl:text-[44px] font-heading font-bold tracking-tight text-zinc-950 leading-[1.14] mb-4">
              Apply in seconds,{" "}
              <span className="font-serif italic font-normal text-orange-900">
                not hours.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-zinc-800/80 leading-relaxed font-sans max-w-md">
              Sync your profile, custom answers, and resume to autofill repetitive job applications with zero copy-pasting.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Centered Modern Authentication Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 h-full overflow-y-auto lg:overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(234,88,12,0.03),transparent_70%)] pointer-events-none" />

        <div className="w-full max-w-md relative z-10 my-auto">
          <AuthForm />
        </div>
      </div>
    </div>
  );
}
