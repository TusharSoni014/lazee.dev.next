"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { MessageSquare, Send, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";

const FEEDBACK_TYPES = [
  { value: "feature", label: "Feature Request" },
  { value: "bug", label: "Bug Report" },
  { value: "add_ats", label: "Add ATS Support" },
  { value: "appreciation", label: "Appreciation" },
  { value: "other", label: "Other" },
];

export default function FeedbackPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "feature",
    message: "",
  });

  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        name: session.user?.name || "",
        email: session.user?.email || "",
      }));
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Feedback submitted successfully! Thank you.");
        setFormData({
          ...formData,
          message: "",
        });
      } else {
        toast.error(data.error || "Failed to submit feedback.");
      }
    } catch (error) {
      console.error("Submit Error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-tight hover:translate-x-[-4px] transition-transform"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-[3px] border-black bg-white p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-none border-[3px] border-black bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <MessageSquare className="w-8 h-8 text-black" />
          </div>
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-black font-heading leading-none">
              Feedback
            </h1>
            <p className="text-zinc-600 font-bold uppercase tracking-widest text-xs mt-2">
              Help us make Lazee.dev even better
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-[11px] font-black uppercase tracking-widest pl-1"
              >
                Name
              </Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-[11px] font-black uppercase tracking-widest pl-1"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="bg-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="type"
              className="text-[11px] font-black uppercase tracking-widest pl-1"
            >
              Feedback Type
            </Label>
            <Select
              value={formData.type}
              onValueChange={(val) => setFormData({ ...formData, type: val })}
            >
              <SelectTrigger className="h-[50px] w-full rounded-none border-[3px] border-black bg-white px-4 py-2 text-sm font-bold text-black focus:outline-none focus:ring-0 focus:bg-orange-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] data-[state=open]:bg-orange-50">
                <SelectValue placeholder="Select Feedback Type" />
              </SelectTrigger>
              <SelectContent className="rounded-none border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                {FEEDBACK_TYPES.map((type) => (
                  <SelectItem
                    key={type.value}
                    value={type.value}
                    className="cursor-pointer font-bold focus:bg-orange-50 rounded-none"
                  >
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="message"
              className="text-[11px] font-black uppercase tracking-widest pl-1"
            >
              Message
            </Label>
            <Textarea
              id="message"
              required
              placeholder="Tell us what you think..."
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="min-h-[200px] w-full bg-white placeholder:text-zinc-400 focus:bg-orange-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-[3px] border-black rounded-none p-4"
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-16 bg-black text-white hover:bg-zinc-800 border-[3px] border-black font-black uppercase text-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-6 w-6" />
                  Submit Feedback
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
