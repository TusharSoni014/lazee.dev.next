export default function ProfileLoading() {
  return (
    <div className="relative min-h-screen bg-[#fefaf6] pb-20">
      <div
        className="fixed inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      <div className="relative z-10 container mx-auto max-w-5xl px-4 py-12 md:py-20">
        {/* Header skeleton */}
        <div className="mb-12 flex flex-col items-center text-center">
          <div className="h-12 w-80 bg-zinc-200 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-pulse" />
          <div className="mt-4 h-6 w-96 bg-zinc-100 border-[3px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] animate-pulse" />
        </div>

        {/* Form skeleton cards */}
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border-[3px] border-black bg-white p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="h-8 w-48 bg-zinc-200 border-[2px] border-black mb-6 animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="space-y-2">
                    <div className="h-4 w-24 bg-zinc-100 animate-pulse" />
                    <div className="h-12 w-full bg-zinc-50 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
