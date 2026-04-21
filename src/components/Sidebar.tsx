"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  Users,
  Settings,
  Flame,
  LayoutDashboard,
  PlusCircle,
} from "lucide-react";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/inspections", label: "Inspections", icon: ClipboardList },
  { href: "/inspections/new", label: "New Inspection", icon: PlusCircle },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 bg-amber-900 text-amber-50 flex flex-col min-h-screen">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-amber-800">
        <Flame className="w-6 h-6 text-amber-300" />
        <span className="font-semibold text-sm leading-tight">
          Chimney<br />Inspection Pro
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                active
                  ? "bg-amber-700 text-white font-medium"
                  : "text-amber-200 hover:bg-amber-800 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-5 py-4 text-xs text-amber-400 border-t border-amber-800">
        NFPA 211 · CSIA Standards
      </div>
    </aside>
  );
}
