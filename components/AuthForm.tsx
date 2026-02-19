"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Chrome, Mail, ArrowRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setIsLoading(true);
    try {
      const result = await signIn("nodemailer", {
        email,
        redirect: false,
        callbackUrl: "/",
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        setIsSent(true);
        toast.success("Magic link sent!");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      toast.error("Failed to sign in with Google");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      >
        <Card className="relative overflow-hidden border-[3px] border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
          <CardHeader className="pt-12 pb-8 text-center space-y-4">
            <div className="space-y-1">
              <CardTitle className="text-4xl font-black tracking-tight text-black font-heading line-height-1">
                {isSent ? "CHECK MAIL" : "GET STARTED"}
              </CardTitle>
              <CardDescription className="text-zinc-500 font-bold uppercase text-xs tracking-[0.1em]">
                {isSent
                  ? `Magic link on its way to ${email}`
                  : "Pick your path to productivity"}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-8 pb-12 px-8">
            <AnimatePresence mode="wait">
              {!isSent ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <Button
                    variant="outline"
                    className="group relative h-14 w-full border-[3px] border-black bg-white text-black hover:bg-zinc-100 transition-all duration-200 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                  >
                    <Chrome className="mr-3 h-5 w-5" />
                    <span className="font-black text-sm uppercase tracking-tight">
                      Continue with Google
                    </span>
                  </Button>

                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-x-0 border-t-[2px] border-black" />
                    <span className="relative bg-white px-4 text-[10px] font-black tracking-[0.2em] text-black">
                      OR
                    </span>
                  </div>

                  <form onSubmit={handleEmailLogin} className="space-y-4">
                    <div className="group relative">
                      <Input
                        id="email"
                        placeholder="NAME@DOMAIN.COM"
                        type="email"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-14 border-[3px] border-black bg-white px-6 text-black placeholder:text-zinc-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-orange-500 transition-colors rounded-none font-black text-sm uppercase"
                        disabled={isLoading}
                      />
                    </div>

                    <Button
                      className="h-14 w-full bg-orange-500 text-white font-black hover:bg-orange-600 active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all duration-200 rounded-none border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase tracking-tight text-sm group"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          Send Magic Link
                          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </span>
                      )}
                    </Button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-6"
                >
                  <div className="p-6 border-[3px] border-black bg-blue-50 text-black font-bold text-sm leading-relaxed uppercase tracking-tight">
                    Check your inbox. We sent a magic link. Click it to log in.
                  </div>
                  <Button
                    variant="link"
                    className="text-black font-black uppercase text-[10px] tracking-widest hover:text-orange-500"
                    onClick={() => setIsSent(false)}
                  >
                    ← USE DIFFERENT EMAIL
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>

          <CardFooter className="border-t-[3px] border-black bg-zinc-50 py-6 px-8 flex flex-col gap-2">
            <p className="w-full text-[9px] text-zinc-600 font-bold uppercase tracking-widest text-center">
              By joining, you agree to our{" "}
              <button className="underline hover:text-black">Terms</button> &{" "}
              <button className="underline hover:text-black">Privacy</button>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
