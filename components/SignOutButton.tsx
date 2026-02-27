"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  return (
    <Button
      variant="destructive"
      size="lg"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="w-full max-w-xs tracking-widest text-white"
    >
      Sign Out
    </Button>
  );
}
