import AuthForm from "@/components/AuthForm";
import { Bolt } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex flex-1 w-full min-h-[calc(100vh-4rem)]">
      {/* Left Side */}
      <div className="hidden lg:flex flex-col w-1/2 bg-[#f26c0d] items-start justify-center p-12 xl:p-20 relative overflow-hidden border-r-4 border-[#1c130d]">
        <div className="z-10 flex flex-col gap-6 max-w-xl">
          <h1 className="text-[#1c130d] text-7xl xl:text-8xl font-black leading-[0.9] tracking-tighter uppercase drop-shadow-sm font-heading">
            Welcome
            <br />
            Back
          </h1>
          <p className="text-[#1c130d] text-xl font-medium max-w-md border-l-4 border-[#1c130d] pl-4">
            The AI job filling platform that does the work so you don't have to.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-[#f8f7f5] dark:bg-[#221710] py-12 px-6 sm:p-12 md:p-20 relative">
        <div className="w-full max-w-md">
          <AuthForm />
        </div>
      </div>
    </div>
  );
}
