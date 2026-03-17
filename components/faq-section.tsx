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
      "We support all major hiring platforms including Workday, Greenhouse, Lever, Ashby, and LinkedIn Easy Apply. We're constantly expanding support for new ATS platforms and company career pages. Works across Chrome, Firefox, and Edge.",
  },
  {
    question: "What is the credits system?",
    answer:
      "Credits power the AI-assisted fills. Every free account gets 200 credits per month, automatically refreshed. Each AI fill costs 2 credits. Pro users get 10,000 credits per month. Non-AI autofill (name, email, phone, social links, etc.) is completely free and unlimited on all plans.",
  },
  {
    question: "What's included in the Free vs Pro plan?",
    answer:
      "The Free plan includes 200 AI credits per month, unlimited basic profile data autofill, and basic AI suggestions. The Pro plan ($9/mo) gives you 10,000 credits per month, Bulk Apply Mode, access to beta features, and priority support — perfect for serious job hunters applying at scale.",
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
    <>
      {/* Hero Section */}
      <section className="w-full border-4 border-black bg-[#E0E7FF] px-6 py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-black uppercase leading-none tracking-tight text-black md:text-6xl lg:text-7xl">
            Stop Filling Forms.
            <br />
            Start Getting Hired.
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg font-medium text-slate-800 md:text-xl">
            The brutal truth? Manual applications are a waste of time. Automate
            your job search with AI precision.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <InstallModal>
              <button className="flex h-14 min-w-[200px] items-center justify-center border-2 border-black bg-[#1254a1] px-8 text-lg font-black uppercase text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all active:translate-y-0 active:shadow-none">
                Get Started Free
              </button>
            </InstallModal>
            <button className="flex h-14 min-w-[200px] items-center justify-center border-2 border-black bg-white px-8 text-lg font-black uppercase text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all active:translate-y-0 active:shadow-none">
              View Demo
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        id="faq"
        className="w-full max-w-4xl mx-auto py-24 px-4 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="inline-block bg-[#00bcd4] border-[3px] border-black px-4 py-1 mb-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
            <h2 className="text-black text-lg font-bold uppercase tracking-wide">
              Got Questions?
            </h2>
          </div>
          <h2 className="text-black text-4xl md:text-5xl lg:text-7xl font-black leading-tight mb-6 uppercase">
            Frequently
            <br />
            Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`bg-white border-[3px] border-black transition-all duration-200 ${
                  isOpen
                    ? "shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] translate-y-[-2px] translate-x-[-2px]"
                    : "hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] hover:translate-x-[-1px]"
                }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className="text-xl md:text-2xl font-black text-black">
                    {faq.question}
                  </span>
                  <div
                    className={`flex items-center justify-center w-10 h-10 border-[3px] border-black rounded-full transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-[#ff6b00]" : "bg-[#ffeb3b]"
                    }`}
                  >
                    {isOpen ? (
                      <Minus className="w-5 h-5 text-black" />
                    ) : (
                      <Plus className="w-5 h-5 text-black" />
                    )}
                  </div>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="p-6 pt-0 border-t-[3px] border-black text-lg font-medium text-black/80 bg-zinc-50">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full border-4 border-black bg-[#FFDE00] px-6 py-20">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <h2 className="mb-4 text-3xl font-black uppercase leading-tight text-black md:text-5xl">
            Ready to automate your search?
          </h2>
          <p className="mb-8 max-w-xl text-lg font-bold text-slate-800">
            Stop wasting hours filling out forms manually. Get the job you
            deserve faster.
          </p>
          <InstallModal>
            <Button
              className="max-w-[260px] w-full py-6 text-lg"
              variant="outline"
            >
              Install Now - Free
            </Button>
          </InstallModal>
        </div>
      </section>
    </>
  );
}
