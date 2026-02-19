import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#fefaf6] px-6 py-12 selection:bg-orange-500 selection:text-white">
      {/* Decorative Grid Pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
        }}
      />

      {/* Dynamic Retro Shapes */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-[10%] left-[5%] w-[300px] h-[300px] rounded-full border-[3px] border-orange-500/20 rotate-12" />
        <div className="absolute bottom-[15%] right-[5%] w-[250px] h-[250px] border-[3px] border-blue-500/20 -rotate-12" />
      </div>

      <div className="relative z-10 mb-10 flex flex-col items-center gap-4">
        <div className="h-12 w-12 bg-orange-500 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center transform -rotate-3 hover:rotate-0 transition-transform duration-300">
          <span className="text-white font-black text-2xl">L</span>
        </div>
        <p className="text-zinc-600 font-medium max-w-[280px] text-center">
          Jump back into the fastest application workflow.
        </p>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <AuthForm />
      </div>

      <div className="relative z-10 mt-16 text-center">
        <p className="text-[10px] text-black/40 font-black tracking-[0.2em] uppercase mb-8">
          Accelerating engineers at
        </p>
        <div className="flex flex-wrap justify-center gap-10 opacity-30 grayscale contrast-125">
          <span className="text-lg font-black font-heading">GOOGLE</span>
          <span className="text-lg font-black font-heading">META</span>
          <span className="text-lg font-black font-heading">STRIPE</span>
          <span className="text-lg font-black font-heading">VERCEL</span>
        </div>
      </div>
    </div>
  );
}
