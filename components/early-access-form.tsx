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
        className="relative w-full border-[4px] border-black bg-white p-8 sm:p-10 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-6"
      >
        {/* Badge */}
        <div className="absolute -top-5 -right-2 sm:-top-6 sm:-right-6 bg-[#ff6b00] text-white px-5 py-2 text-sm sm:text-base font-black tracking-widest border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-3 uppercase">
          Get Early Access
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Enter your email..."
                  className="h-16 px-4 text-lg sm:text-xl font-bold border-[3px] border-black rounded-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-[#f4f4f5] text-black placeholder:text-gray-500"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500 font-bold text-sm mt-1" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          variant="default"
          className="text-white py-6"
          disabled={isPending || !form.formState.isValid}
        >
          {isPending ? "JOINING..." : "JOIN WAITLIST"}
        </Button>

        <p className="text-center text-[#4b5563] font-bold text-base sm:text-lg mt-2 flex items-center justify-center gap-2">
          <svg
            className="w-4 h-4 text-[#4b5563] fill-current"
            viewBox="0 0 24 24"
          >
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          Join 2,000+ developers waiting
        </p>
      </form>
    </Form>
  );
}
