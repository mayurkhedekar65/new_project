"use client";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#0f172a_0%,#020617_60%,#000000_100%)]" />

      <div className="absolute top-16 left-16 w-112.5 h-112.5rounded-full bg-cyan-500/15 blur-[160px] animate-pulse" />

      <div className="absolute bottom-20 right-16 w-100 h-100 rounded-full bg-blue-600/15 blur-[160px] animate-pulse [animation-delay:1s]" />

      <div className="absolute top-1/2 left-1/2 w-75 h-75 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400/10 blur-[120px]" />

      <div className="relative flex items-center justify-center">
  
        <div className="w-28 h-28 rounded-full border-[3px] border-cyan-500/20 border-t-cyan-400 animate-spin"></div>

        <div className="absolute w-20 h-20 rounded-full border-[3px] border-blue-500/20 border-b-blue-400 animate-[spin_2s_linear_reverse_infinite]"></div>

        <div className="absolute w-5 h-5 rounded-full bg-cyan-300"></div>
      </div>
    </div>
  );
}