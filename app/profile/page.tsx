import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfileForm from "./profile-form";
import { SignOutButton } from "@/components/SignOutButton";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/");
  }

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
          Profile
        </h1>
        <p className="text-zinc-400">
          Manage your account settings and profile information.
        </p>
      </div>

      <ProfileForm user={user} />

      <div className="border-t border-zinc-200 mt-12 pt-8 dark:border-zinc-800">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Account Actions
        </h2>
        <SignOutButton />
      </div>
    </div>
  );
}
