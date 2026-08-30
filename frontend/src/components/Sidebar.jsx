"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const [name, setName] = useState("");

  useEffect(() => {
    const user_name = localStorage.getItem("user_name");
    setName(user_name);
  }, []);

  const links = [
    { name: "Document Chat", href: "/document-chat", icon: "description" },
    { name: "Report Comparison", href: "/comparison", icon: "compare_arrows" },
    { name: "Report Analysis", href: "/report-analysis", icon: "analytics" },
    { name: "Profile Settings", href: "/settings", icon: "settings" },
  ];

  return (
    <aside className="bg-slate-950 h-screen w-72 flex-col fixed left-0 top-0 border-r border-slate-800 hidden lg:flex z-50 text-white">
      <div className="p-8 h-20 flex flex-col justify-center border-b border-slate-800/50">
        <h1 className="text-2xl font-black tracking-tight">
          <Link href="/">
            Diagnostic <span className="text-cyan-400">AI</span>
          </Link>
        </h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "text-cyan-400 bg-cyan-500/10 font-bold border border-cyan-500/20 shadow-sm"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white border border-transparent"
              }`}
            >
              <span className="material-symbols-outlined text-xl">
                {link.icon}
              </span>
              <span className="text-base">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <Link
        href="/"
        className="inline-flex items-center gap-2  border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm font-medium text-cyan-400 backdrop-blur-md transition-all duration-300 hover:border-cyan-400 hover:bg-slate-800 hover:text-cyan-300"
      >
        <span className="material-symbols-outlined">arrow_back</span>
        Back to Home
      </Link>
      <div className="p-6 border-t border-slate-800 bg-slate-950/50">
        <div className="flex items-center gap-3 px-2">
          <div className="rounded-4xl border text-lg font-bold bg-cyan-400 text-background border-slate-400 px-2">
            {name[0]}
          </div>
          <div className="overflow-hidden">
            <p className="font-bold text-base text-white truncate">{name}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
