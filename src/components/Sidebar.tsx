"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk, useOrganization, useUser } from "@clerk/nextjs";
import {
  ClipboardList,
  Users,
  Settings,
  Flame,
  LayoutDashboard,
  PlusCircle,
  LogOut,
  Building2,
  CreditCard,
  Menu,
  X,
  BookOpen,
} from "lucide-react";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/inspections", label: "Inspections", icon: ClipboardList },
  { href: "/inspections/new", label: "New Inspection", icon: PlusCircle },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/guide", label: "Getting Started", icon: BookOpen },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const { user } = useUser();
  const { organization } = useOrganization();

  return (
    <>
      {/* Company name */}
      {(organization?.name || user?.fullName) && (
        <div className="px-5 py-3 border-b border-amber-800">
          <div className="flex items-center gap-2 text-xs text-amber-200">
            <Building2 className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate font-medium">
              {organization?.name ?? user?.fullName}
            </span>
          </div>
        </div>
      )}

      {/* Nav links */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
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

      {/* User + sign out */}
      <div className="px-4 py-4 border-t border-amber-800 space-y-2">
        {user && (
          <div className="text-xs text-amber-300 truncate px-1">
            {user.primaryEmailAddress?.emailAddress}
          </div>
        )}
        <button
          onClick={() => signOut({ redirectUrl: "/sign-in" })}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-xs text-amber-200 hover:bg-amber-800 hover:text-white transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign out
        </button>
        <div className="text-xs text-amber-600 px-1">NFPA 211 · CSIA Standards</div>
      </div>
    </>
  );
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ── Desktop sidebar (md+) ─────────────────────────────────────────── */}
      <aside className="hidden md:flex w-56 shrink-0 bg-amber-900 text-amber-50 flex-col min-h-screen">
        <div className="flex items-center gap-2 px-5 py-5 border-b border-amber-800">
          <Flame className="w-6 h-6 text-amber-300" />
          <span className="font-semibold text-sm leading-tight">
            Chimney<br />Inspection Pro
          </span>
        </div>
        <NavLinks />
      </aside>

      {/* ── Mobile top bar ────────────────────────────────────────────────── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-amber-900 text-amber-50 flex items-center justify-between px-4 py-3 shadow-lg">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-amber-300" />
          <span className="font-semibold text-sm">Chimney Inspection Pro</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-md hover:bg-amber-800 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* ── Mobile drawer overlay ─────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile drawer panel ───────────────────────────────────────────── */}
      <div
        className={`md:hidden fixed top-0 left-0 z-50 h-full w-64 bg-amber-900 text-amber-50 flex flex-col transform transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-amber-800">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-300" />
            <span className="font-semibold text-sm">Chimney Inspection Pro</span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-md hover:bg-amber-800 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <NavLinks onNavigate={() => setMobileOpen(false)} />
      </div>
    </>
  );
}
