"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useTransition } from "react";
import { toast } from "@/components/ui/toast";
import { Zap, ArrowRight, Loader2, Users } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

export function EarlyAccessForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const { requestEarlyAccess } = await import("@/app/actions");
      const formData = new FormData();
      formData.append("email", values.email);

      const promise = requestEarlyAccess(formData);

      toast.promise(promise, {
        loading: "Joining waitlist...",
        success: (res) => {
          if (res.error) {
            throw new Error(res.error);
          }
          form.reset();
          return "Thanks! You have been added to the waitlist.";
        },
        error: (err) => err.message || "Failed to join waitlist.",
      });
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative w-full rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-6 sm:p-8 shadow-sm flex flex-col gap-5"
      >
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-orange-500/20 bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-medium">
            <Zap className="w-3.5 h-3.5" />
            <span>Priority Waitlist</span>
          </div>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
            Limited slots
          </span>
        </div>

        <div>
          <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Get Early Access
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Be the first to experience automated job applications and AI autofill.
          </p>
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormControl>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  className="h-11 px-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus-visible:ring-1 focus-visible:ring-orange-500 shadow-none"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500 text-xs mt-1" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full h-11 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-medium text-sm transition-all shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_16px_-4px_rgba(234,88,12,0.3)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2"
          disabled={isPending || !form.formState.isValid}
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Joining waitlist...</span>
            </>
          ) : (
            <>
              <span>Join Waitlist</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>

        <p className="text-center text-xs text-zinc-500 dark:text-zinc-400 flex items-center justify-center gap-1.5 pt-1">
          <Users className="w-3.5 h-3.5 text-zinc-400" />
          <span>Join 2,000+ developers already waiting</span>
        </p>
      </form>
    </Form>
  );
}
