"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useTransition } from "react";
import { toast } from "@/components/ui/toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

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
          return "Thanks! You have been added to the wishlist.";
        },
        error: (err) => err.message || "Failed to join waitlist.",
      });
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-3 group relative border-[3px] border-black bg-white p-4 sm:p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]"
      >
        <h3 className="text-lg font-black uppercase tracking-tight text-black text-center mb-1">
          Get Early Access
        </h3>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Enter your email..."
                  className="w-full border-2 border-black bg-zinc-50 px-4 py-3 text-sm font-bold text-black placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-0 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] h-auto"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500 font-bold text-xs" />
            </FormItem>
          )}
        />

        <button
          type="submit"
          disabled={isPending}
          className="w-full border-2 border-black bg-orange-500 px-4 py-3 text-sm font-black text-white hover:bg-orange-600 active:translate-x-[2px] active:translate-y-[2px] transition-all uppercase tracking-widest rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed mt-1"
        >
          {isPending ? "Joining..." : "Join Wishlist"}
        </button>
      </form>
    </Form>
  );
}
