"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { InstallModal } from "./install-modal";
import { Button } from "./ui/button";

const faqs = [
  {
    question: "How does the AI autofill work?",
    answer:
      "Lazee.dev is a browser extension that automatically detects job application form fields and fills them using the profile data you've saved on lazee.dev. For AI-powered answers (like open-ended questions), it uses 2 credits per fill. Standard fields like name, email, phone, and socials are filled instantly for free — no credits needed.",
  },
  {
    question: "What job boards and ATS platforms are supported?",
    answer:
      "We currently support a select few major hiring platforms and job boards (including Greenhouse, Lever, and Workday) and are actively working on expanding to support more ATS platforms and career pages in the future. Works across Chrome, Firefox, and Edge.",
  },
  {
    question: "What is the credits system?",
    answer:
      "Credits power the AI-assisted fills. Every free account gets 200 credits per month, automatically refreshed. Each AI fill costs 2 credits. Pro users get 10,000 credits per month. Non-AI autofill (name, email, phone, social links, etc.) is completely free and unlimited on all plans.",
  },
  {
    question: "What's included in the Free vs Pro plan?",
    answer:
      "The Free plan includes 200 AI credits per month, unlimited basic profile data autofill, and basic AI suggestions. The Pro plan ($9/mo) gives you 10,000 credits per month, access to beta features, and priority support — perfect for serious job hunters applying at scale.",
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
    question: "When will the browser extension be available?",
    answer:
      "The extension is currently in development and releasing soon. You can sign up now to fill out your profile and be ready to hit the ground running the moment it goes live. Follow @TusharSoni014 on X (Twitter) for real-time dev logs and launch updates.",
  },
  {
    question: "What is the Public Profile feature?",
    answer:
      "You can set a custom username to get a shareable public profile link (e.g., lazee.dev/profile/yourusername). This lets you share your professional details publicly, making it easy to apply for jobs or share your profile with recruiters.",
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
        <div className="inline-block border-2 border-black bg-white px-3.5 py-1.5 text-xs font-black uppercase tracking-widest shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] mb-4">
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
              className={`bg-white border-[3px] border-black rounded-2xl overflow-hidden transition-all duration-200 ${
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
                    isOpen ? "rotate-180 bg-purple-600 text-white" : "bg-purple-50 text-purple-600"
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
                <div className="p-5 sm:p-6 pt-0 border-t-2 border-zinc-100 text-sm sm:text-base font-bold text-zinc-600 bg-zinc-50/50 leading-relaxed">
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
