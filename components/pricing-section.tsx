import { Check, X } from "lucide-react";

export function PricingSection() {
  return (
    <div className="flex flex-col items-center w-full max-w-[1400px] mx-auto animate-fade-in-up [animation-delay:800ms] mb-20 px-4 md:px-8">
      <div className="mx-auto w-full max-w-5xl">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="inline-block border-2 border-black bg-white px-3 py-1 text-xs font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-4">
            Simple Pricing
          </div>
          <h2 className="mb-4 text-4xl font-black uppercase leading-none md:text-6xl text-black">
            Stop Wasting Time <br />
            <span className="bg-[#ff6b00] px-2 text-black">Applying</span>
          </h2>
          <p className="mx-auto max-w-xl text-lg font-medium text-slate-600">
            Choose the plan that fits your job hunting speed. No hidden fees,
            cancel anytime.
          </p>
        </div>

        {/* Pricing Cards Container */}
        <div className="grid gap-8 md:grid-cols-2 md:items-start max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="group relative flex flex-col rounded-none border-4 border-black bg-white p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1">
            <div className="mb-6">
              <h3 className="mb-2 text-lg font-black uppercase tracking-wider text-slate-500">
                For Job Hunters
              </h3>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black tracking-tighter text-black">
                  Free
                </span>
                <span className="text-xl font-bold text-slate-500">/mo</span>
              </div>
              <p className="mt-4 text-sm font-medium text-slate-600">
                Perfect for casually browsing and applying to a few select
                roles.
              </p>
            </div>
            <ul className="mb-8 flex flex-col gap-4 grow">
              <li className="flex items-center gap-3">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-none border-2 border-black bg-green-400">
                  <Check
                    className="w-4 h-4 text-black font-bold"
                    strokeWidth={3}
                  />
                </div>
                <span className="font-bold text-black text-base">
                  Auto-fill applications
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-none border-2 border-black bg-green-400">
                  <Check
                    className="w-4 h-4 text-black font-bold"
                    strokeWidth={3}
                  />
                </div>
                <span className="font-bold text-black text-base">
                  Basic AI suggestions
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-none border-2 border-black bg-green-400">
                  <Check
                    className="w-4 h-4 text-black font-bold"
                    strokeWidth={3}
                  />
                </div>
                <span className="font-bold text-black text-base">
                  50 applications/mo
                </span>
              </li>
              <li className="flex items-center gap-3 opacity-40">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-none border-2 border-slate-300 bg-slate-100">
                  <X
                    className="w-4 h-4 text-slate-400 font-bold"
                    strokeWidth={3}
                  />
                </div>
                <span className="font-medium text-slate-400 line-through text-base">
                  Bulk Apply
                </span>
              </li>
            </ul>
            <button className="w-full border-2 border-black bg-white py-3 text-center text-sm font-black uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black hover:bg-slate-50 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all">
              Get Started Free
            </button>
          </div>

          {/* Pro Plan */}
          <div className="relative flex flex-col rounded-none border-4 border-black bg-[#ff6b00] p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1">
            {/* Badge */}
            <div className="absolute -right-2 -top-6 rotate-3 border-2 border-black bg-white px-4 py-1 font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black text-sm">
              Best Value
            </div>
            <div className="mb-6">
              <h3 className="mb-2 text-lg font-black uppercase tracking-wider text-black/70">
                For Power Users
              </h3>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black tracking-tighter text-black">
                  $9
                </span>
                <span className="text-xl font-bold text-black/70">/mo</span>
              </div>
              <p className="mt-4 text-sm font-bold text-black/80">
                Supercharge your job search with unlimited power and automation.
              </p>
            </div>
            <ul className="mb-8 flex flex-col gap-4 grow">
              <li className="flex items-center gap-3">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-none border-2 border-black bg-white">
                  <Check
                    className="w-4 h-4 text-black font-bold"
                    strokeWidth={3}
                  />
                </div>
                <span className="font-bold text-black text-base">
                  Everything in Free
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-none border-2 border-black bg-white">
                  <Check
                    className="w-4 h-4 text-black font-bold"
                    strokeWidth={3}
                  />
                </div>
                <span className="font-bold text-black text-base">
                  Bulk Apply Mode
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-none border-2 border-black bg-white">
                  <Check
                    className="w-4 h-4 text-black font-bold"
                    strokeWidth={3}
                  />
                </div>
                <span className="font-bold text-black text-base">
                  Priority Support
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-none border-2 border-black bg-white">
                  <Check
                    className="w-4 h-4 text-black font-bold"
                    strokeWidth={3}
                  />
                </div>
                <span className="font-bold text-black text-base">
                  Unlimited applications
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-none border-2 border-black bg-white">
                  <Check
                    className="w-4 h-4 text-black font-bold"
                    strokeWidth={3}
                  />
                </div>
                <span className="font-bold text-black text-base">
                  Cover Letter Generator
                </span>
              </li>
            </ul>
            <button className="w-full border-2 border-black bg-black py-3 text-center text-sm font-black uppercase tracking-wider text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-800 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all">
              Go Pro Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
