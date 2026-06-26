"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { InstallModal } from "./install-modal";
import { Button } from "./ui/button";

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
      "All core autofill features are 100% free! The Free plan gives you unlimited profile data autofill, 200 AI credits per month, and works on 100+ platforms. The Pro plan ($9/mo) gives you 10,000 AI credits per month, access to the Bulk AI Fill feature (autofill entire applications with one click), and priority support.",
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
      className="w-full max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8 mb-12"
    >
      <div className="flex flex-col items-center mb-16 text-center">
        <div className="inline-block border-2 border-black bg-white px-3.5 py-1.5 text-xs font-black uppercase tracking-widest shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] mb-4 rounded-none">
          FAQ
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black leading-tight mb-4 uppercase text-black">
          Frequently <br className="sm:hidden" />
          Asked Questions
        </h2>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={`bg-white border-[3px] border-black rounded-none overflow-hidden transition-all duration-200 ${
                isOpen
                  ? "shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5"
                  : "hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5"
              }`}
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-5 sm:p-6 text-left focus:outline-none cursor-pointer"
              >
                <span className="text-base sm:text-lg font-black text-black leading-snug pr-4">
                  {faq.question}
                </span>
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 border-black transition-all duration-200 shrink-0 ${
                    isOpen ? "rotate-180 bg-orange-500 text-white" : "bg-orange-50 text-orange-500"
                  }`}
                >
                  {isOpen ? (
                    <Minus className="w-4 h-4" strokeWidth={3} />
                  ) : (
                    <Plus className="w-4 h-4" strokeWidth={3} />
                  )}
                </div>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-5 sm:p-6 pt-0 border-t-2 border-zinc-100 text-sm sm:text-base font-bold text-zinc-600 bg-zinc-50/50 leading-relaxed rounded-none">
                  {faq.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
