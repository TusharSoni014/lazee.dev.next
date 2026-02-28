import Link from "next/link";
import { ArrowLeft, CheckSquare } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="flex-1 px-6 py-12 md:px-20 lg:px-60 xl:px-80">
      <div className="mb-12">
        <Link
          className="inline-flex items-center gap-2 text-sm font-bold uppercase bg-white dark:bg-slate-900 border-2 border-black px-4 py-1 mb-6 hover:bg-[#f26c0d]/10 dark:hover:bg-[#f26c0d]/10"
          href="/"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        <h1 className="text-5xl md:text-7xl font-black uppercase leading-none mb-4 tracking-tighter italic">
          Terms <span className="text-[#f26c0d]">&amp;</span> Conditions
        </h1>
        <div className="inline-block bg-black text-white px-3 py-1 font-bold text-sm uppercase">
          Last updated: February 2026
        </div>
      </div>
      <section className="space-y-6">
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 border-[3px] border-black shadow-[4px_4px_0px_0px_#000000]">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-[#f26c0d] text-white w-8 h-8 flex items-center justify-center font-black border-2 border-black">
              1
            </span>
            <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-slate-100">
              Acceptance of Terms
            </h2>
          </div>
          <div className="space-y-4 text-lg leading-relaxed font-bold text-slate-900 dark:text-slate-100">
            <p>
              By accessing or using Lazee.dev, you agree to be bound by these
              Terms and Conditions and our Privacy Policy. If you do not agree
              to these terms, you must not use our services.
            </p>
            <p>
              We reserve the right to change, modify, or revise these terms at
              any time. Your continued use of the platform after changes are
              posted constitutes your acceptance of the new terms.
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 border-[3px] border-black shadow-[4px_4px_0px_0px_#000000]">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-[#f26c0d] text-white w-8 h-8 flex items-center justify-center font-black border-2 border-black">
              2
            </span>
            <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-slate-100">
              User Accounts
            </h2>
          </div>
          <div className="space-y-4 text-lg leading-relaxed font-bold text-slate-900 dark:text-slate-100">
            <p>
              To access certain features of Lazee.dev, you may be required to
              register for an account. You are responsible for:
            </p>
            <ul className="list-none space-y-2">
              <li className="flex items-start gap-2">
                <CheckSquare className="w-6 h-6 text-[#f26c0d] font-black" />
                Maintaining the confidentiality of your account credentials.
              </li>
              <li className="flex items-start gap-2">
                <CheckSquare className="w-6 h-6 text-[#f26c0d] font-black" />
                All activities that occur under your account.
              </li>
              <li className="flex items-start gap-2">
                <CheckSquare className="w-6 h-6 text-[#f26c0d] font-black" />
                Notifying us immediately of any unauthorized use of your
                account.
              </li>
            </ul>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 border-[3px] border-black shadow-[4px_4px_0px_0px_#000000]">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-[#f26c0d] text-white w-8 h-8 flex items-center justify-center font-black border-2 border-black">
              3
            </span>
            <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-slate-100">
              Platform Integration Usage
            </h2>
          </div>
          <div className="space-y-4 text-lg leading-relaxed font-bold text-slate-900 dark:text-slate-100">
            <p>
              Our platform integrations are designed to enhance your development
              workflow. Usage of our tools is subject to:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#f8f7f5] dark:bg-slate-800 border-2 border-black p-4">
                <h3 className="font-black uppercase mb-2">Permissions</h3>
                <p className="text-sm">
                  The tools may require permissions to interact with your code
                  editors and API endpoints as documented in our setup guide.
                </p>
              </div>
              <div className="bg-[#f8f7f5] dark:bg-slate-800 border-2 border-black p-4">
                <h3 className="font-black uppercase mb-2">Updates</h3>
                <p className="text-sm">
                  Updates may be pushed automatically. You agree to receive
                  these updates to ensure proper functionality and security.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#f26c0d]/10 border-[#f26c0d] p-6 md:p-8 border-[3px] shadow-[4px_4px_0px_0px_#000000]">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-[#f26c0d] text-white w-8 h-8 flex items-center justify-center font-black border-2 border-black">
              4
            </span>
            <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-slate-100">
              Pro Subscription &amp; Credits
            </h2>
          </div>
          <div className="space-y-4 text-lg leading-relaxed font-bold text-slate-900 dark:text-slate-100">
            <p>
              Certain advanced features require a Pro Subscription or individual
              Credits. Please note:
            </p>
            <ul className="list-none space-y-3">
              <li className="bg-white dark:bg-slate-900 border-2 border-black p-3">
                <strong className="uppercase text-[#f26c0d]">Billing:</strong>{" "}
                Subscriptions are billed in advance on a recurring basis
                (monthly or annually).
              </li>
              <li className="bg-white dark:bg-slate-900 border-2 border-black p-3">
                <strong className="uppercase text-[#f26c0d]">Refunds:</strong>{" "}
                Credits and subscription fees are generally non-refundable
                unless required by law.
              </li>
              <li className="bg-white dark:bg-slate-900 border-2 border-black p-3">
                <strong className="uppercase text-[#f26c0d]">
                  Usage Limits:
                </strong>{" "}
                Pro plans may have rate limits to prevent abuse and ensure
                system stability.
              </li>
            </ul>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 border-[3px] border-black shadow-[4px_4px_0px_0px_#000000]">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-[#f26c0d] text-white w-8 h-8 flex items-center justify-center font-black border-2 border-black">
              5
            </span>
            <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-slate-100">
              Termination
            </h2>
          </div>
          <div className="space-y-4 text-lg leading-relaxed font-bold text-slate-900 dark:text-slate-100">
            <p>
              We may terminate or suspend your account and access to our
              services immediately, without prior notice or liability, for any
              reason, including without limitation if you breach the Terms.
            </p>
            <p>
              Upon termination, your right to use the service will immediately
              cease. All provisions of the Terms which by their nature should
              survive termination shall survive.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
