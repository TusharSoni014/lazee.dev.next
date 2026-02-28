import Link from "next/link";
import { ArrowLeft, CalendarDays, CheckSquare } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="flex flex-1 justify-center py-12 px-6">
      <div className="max-w-[800px] flex-1">
        {/* Back Link */}
        <Link
          className="inline-flex items-center gap-2 text-[#f26c0d] font-bold uppercase text-sm mb-8 group"
          href="/"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        {/* Title Section */}
        <div className="mb-12">
          <div className="inline-block bg-[#f26c0d] px-4 py-1 border-2 border-black shadow-[4px_4px_0px_0px_#000000] mb-4">
            <p className="text-white text-xs font-black uppercase tracking-widest">
              Legal Document
            </p>
          </div>
          <h1 className="text-6xl md:text-7xl font-black uppercase leading-[0.9] tracking-tighter mb-4 italic text-slate-900 dark:text-slate-100">
            Privacy <br />
            <span className="text-[#f26c0d]">Policy</span>
          </h1>
          <div className="flex items-center gap-4 border-t-2 border-black pt-4">
            <CalendarDays className="w-6 h-6 text-[#f26c0d]" />
            <p className="font-bold text-slate-600 dark:text-slate-400 uppercase text-sm">
              Last Updated: February 28, 2026
            </p>
          </div>
        </div>
        {/* Content Sections */}
        <div className="space-y-12">
          {/* Section 1 */}
          <section className="border-2 border-black bg-white dark:bg-slate-900 p-8 shadow-[4px_4px_0px_0px_#000000]">
            <div className="flex items-start gap-4 mb-4">
              <span className="text-4xl font-black text-[#f26c0d]/30">01</span>
              <h2 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-slate-100">
                Information We Collect
              </h2>
            </div>
            <div className="space-y-4 text-lg leading-relaxed font-bold text-slate-900 dark:text-slate-100">
              <p>
                To provide our services, we collect information you provide
                directly to us. This includes:
              </p>
              <ul className="list-none space-y-3">
                <li className="flex items-center gap-3">
                  <CheckSquare className="w-6 h-6 text-[#f26c0d]" />
                  <span>Account details (Name, email, usage preferences)</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckSquare className="w-6 h-6 text-[#f26c0d]" />
                  <span>Platform data to streamline your workflow</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckSquare className="w-6 h-6 text-[#f26c0d]" />
                  <span>Contact information and account credentials</span>
                </li>
              </ul>
            </div>
          </section>
          {/* Section 2 */}
          <section className="border-2 border-black bg-white dark:bg-slate-900 p-8 shadow-[4px_4px_0px_0px_#000000]">
            <div className="flex items-start gap-4 mb-4">
              <span className="text-4xl font-black text-[#f26c0d]/30">02</span>
              <h2 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-slate-100">
                How We Use Data
              </h2>
            </div>
            <p className="text-lg leading-relaxed font-bold text-slate-900 dark:text-slate-100">
              We utilize the collected information to automate your development
              process, personalize your experience, and improve our machine
              learning models. Your data is used exclusively to match you with
              optimal configurations and autofill components via our platform.
              We do not sell your personal information to third parties.
            </p>
          </section>
          {/* Section 3 */}
          <section className="border-2 border-black bg-white dark:bg-slate-900 p-8 shadow-[4px_4px_0px_0px_#000000]">
            <div className="flex items-start gap-4 mb-4">
              <span className="text-4xl font-black text-[#f26c0d]/30">03</span>
              <h2 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-slate-100">
                Data Protection
              </h2>
            </div>
            <p className="text-lg leading-relaxed font-bold text-slate-900 dark:text-slate-100">
              Security is our top priority. We implement industry-standard
              encryption protocols (AES-256) for all data at rest and TLS for
              data in transit. Access to your sensitive information is strictly
              limited to authorized personnel only, and we conduct regular
              security audits to ensure your data remains protected from
              unauthorized access or disclosure.
            </p>
          </section>
          {/* Section 4 */}
          <section className="border-2 border-black bg-[#f26c0d] p-8 shadow-[4px_4px_0px_0px_#000000] text-white">
            <div className="flex items-start gap-4 mb-4">
              <span className="text-4xl font-black text-white/40">04</span>
              <h2 className="text-3xl font-black uppercase tracking-tight">
                Contact Us
              </h2>
            </div>
            <p className="text-lg leading-relaxed font-bold mb-6">
              If you have questions about this Privacy Policy or our data
              practices, please reach out to our legal team.
            </p>
            <a
              className="inline-block bg-white text-[#f26c0d] px-6 py-3 border-2 border-black font-black uppercase hover:translate-x-1 hover:-translate-y-1 transition-transform shadow-[4px_4px_0px_0px_#000000]"
              href="mailto:privacy@lazee.dev"
            >
              privacy@lazee.dev
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
