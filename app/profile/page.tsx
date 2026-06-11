import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfileForm from "./profile-form";
import { SignOutButton } from "@/components/SignOutButton";

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
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      resumes: { orderBy: { version: "desc" } },
      experiences: { orderBy: { startDate: "desc" } },
      projects: { orderBy: { createdAt: "desc" } },
    },
  });

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
