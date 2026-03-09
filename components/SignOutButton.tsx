"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function SignOutButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      if (
        typeof window !== "undefined" &&
        window.chrome?.runtime?.sendMessage
      ) {
        const extensionId = localStorage.getItem("lazeeExtensionId");
        if (extensionId) {
          window.chrome.runtime.sendMessage(
            extensionId,
            { type: "LAZEE_AUTH_LOGOUT" },
            () => {
              localStorage.removeItem("lazeeExtensionId");
            },
          );
        }
      }
    } catch (e) {
      console.debug("Failed to notify extension on sign out", e);
    }

    await signOut({ callbackUrl: "/" });
  };

  return (
    <Button
      variant="destructive"
      size="lg"
      onClick={handleSignOut}
      disabled={isLoading}
      className="w-full max-w-xs tracking-widest text-white"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing out...
        </>
      ) : (
        "Sign Out"
      )}
    </Button>
  );
}
