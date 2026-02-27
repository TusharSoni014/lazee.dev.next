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
                  className="h-auto py-3 bg-zinc-50"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500 font-bold text-xs" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isPending}
          className="w-full py-3 h-auto mt-1 tracking-widest"
        >
          {isPending ? "Joining..." : "Join Wishlist"}
        </Button>
      </form>
    </Form>
  );
}
