"use client";

import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="h-8 w-8 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
    );
  }

  if (session) {
    return (
      <Link
        href="/profile"
        className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-white/10 transition-all hover:ring-purple-500"
      >
        {session.user?.image ? (
          <Image
            src={session.user.image}
            alt={session.user.name || "User"}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-r from-purple-600 to-pink-600 text-xs font-bold text-white">
            {session.user?.email?.[0]?.toUpperCase() || "U"}
          </div>
        )}
      </Link>
    );
  }

  return (
    <Button asChild variant="default">
      <Link href="/login">LOG IN</Link>
    </Button>
  );
}
