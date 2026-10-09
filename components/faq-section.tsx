"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const faqs = [
  {
    question: "How does the AI autofill work?",
    answer:
      "Lazee.dev is a browser extension that automatically detects job application fields and autofills them using your saved profile details. Basic autofill (names, contact info, experience, skills, social profiles) is completely free and unlimited forever without ever needing a subscription. AI-assisted answers (for custom, open-ended questions) draw from your profile context and use 2 credits per field.",
  },
  {
    question: "What job boards and ATS platforms are supported?",
    answer:
      "We are compatible with 100+ job boards. We officially support major hiring platforms like Greenhouse, Lever, SmartRecruiters, Y Combinator (Work at a Startup), Glassdoor, Wellfound, Notion, Airtable, Google Forms, Tally, and Gmail compose, with new ones added daily. Works across Chrome, Firefox, and Edge.",
  },
  {
    question: "What is the credits system?",
    answer:
      "Credits power the AI-assisted fills. Every free account gets 200 credits per month refreshed automatically. Each AI fill costs 2 credits. Pro users get 10,000 credits per month. Non-AI autofill (your profile data, resumes, links) is completely free and unlimited for all users without any subscription.",
  },
  {
    question: "What's included in the Free vs Pro plan?",
    answer:
      "All core autofill features are 100% free! The Free plan gives you unlimited profile data autofill, 200 AI credits per month, and works on 100+ platforms. The Pro plan ($9/mo) gives you 10,000 AI credits per month, access to the Express AI Fill feature (autofill entire applications with one click), and priority support.",
  },
  {
    question: "What profile data can I store and autofill?",
    answer:
      "You can store a comprehensive profile including your name, phone number, country, job type preference, current CTC, notice period, work experience, projects, skills, multiple resumes, social links (LinkedIn, GitHub, Twitter, Portfolio, Telegram), a default cover letter, and custom AI guidance notes. All of this is available for autofill via the extension.",
  },
  {
    question: "Can I store and use multiple resumes?",
    answer:
      "Yes! Lazee.dev supports managing multiple resume versions from your profile. You can upload different resumes (e.g., tailored for different roles) and switch between them directly from the extension when applying.",
  },
  {
    question: "How can I install the browser extension?",
    answer:
      "The browser extension is live and available! You can install it directly from the Chrome Web Store (for Chrome, Edge, and other Chromium browsers) or the Firefox Add-ons store (for Firefox). Simply click any of the download buttons on this page to install it instantly.",
  },
  {
    question: "What is the Public Profile feature?",
    answer:
      "You can set a custom username to get a shareable public profile link (e.g., lazee.dev/u/yourusername). This lets you share your professional details publicly, making it easy to apply for jobs or share your profile with recruiters.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="w-full max-w-3xl mx-auto py-12 sm:py-16 px-4 sm:px-6 my-8 scroll-mt-20"
    >
      <div className="flex flex-col items-center mb-12 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-mono font-medium mb-3">
          <span>Frequently Answered</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Frequently Asked Questions
        </h2>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-2">
          Everything you need to know about security, schemas, and automation.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden transition-all shadow-2xs hover:border-zinc-300 dark:hover:border-zinc-700"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left focus:outline-none cursor-pointer gap-4"
              >
                <span className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
                  {faq.question}
                </span>
                <div
                  className={`size-6 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-orange-600 bg-orange-50 dark:bg-orange-950/40" : "text-zinc-400"
                  }`}
                >
                  <ChevronDown className="size-4" strokeWidth={2} />
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-900 leading-relaxed pt-3">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
