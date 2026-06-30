"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiMenu, FiX, FiLogIn, FiLogOut } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import Logo from "@/components/brand/Logo";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Find Jobs", href: "/jobs" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout, phone, ready } = useAuth();
  const isHome = pathname === "/";
  const transparent = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-[var(--spacing-nav-height)] flex items-center transition-all duration-350 ${
          transparent
            ? "bg-transparent"
            : "bg-surface/92 backdrop-blur-md shadow-[0_1px_0_rgba(15,23,42,0.08)]"
        }`}
      >
        <div className="container-xl flex items-center justify-between gap-4 w-full">
          <Logo variant="dark" size="md" />

          {/* Desktop Links - Safely Hidden below lg viewports */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-sm text-sm font-semibold no-underline transition-colors duration-200 ${
                    active
                      ? transparent
                        ? "text-[#055A2B]"
                        : "text-gold-hover"
                      : transparent
                      ? "text-ink/70 hover:text-ink hover:bg-ink/5"
                      : "text-text-muted hover:text-ink hover:bg-ink/4"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Blocks */}
          <div className="hidden lg:flex items-center gap-2.5">
            {ready && isAuthenticated ? (
              <>
                <span className={`text-[13px] font-semibold ${transparent ? "text-ink/60" : "text-text-muted"}`}>
                  ···{phone?.slice(-4) ?? "····"}
                </span>
                <button
                  type="button"
                  className={`jj-btn jj-btn--ghost px-4 py-2 text-[13px] ${
                    transparent ? "text-ink border-ink/25" : ""
                  }`}
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                >
                  <FiLogOut size={15} /> Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="jj-btn jj-btn--gold px-5 py-2.5">
                <FiLogIn size={15} /> Login
              </Link>
            )}
          </div>

          {/* Mobile Burger Mechanism */}
          <button
            type="button"
            className={`lg:hidden bg-transparent border-none cursor-pointer p-2 rounded-sm transition-colors duration-200 ${
              transparent ? "text-ink" : "text-ink"
            }`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </header>

      {/* Backdrop overlay layer */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-ink/50 z-49 backdrop-blur-[2px] transition-opacity duration-300" 
          onClick={() => setMobileOpen(false)} 
          aria-hidden 
        />
      )}

      {/* Mobile Sidebar Drawer Layout Elements */}
      <div 
        className={`fixed top-0 right-0 h-full w-[300px] max-w-[85vw] bg-surface-elevated z-51 shadow-lg flex flex-col transition-transform duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-[18px_20px] border-b border-border-strong">
          <Logo size="sm" />
          <button 
            type="button" 
            onClick={() => setMobileOpen(false)} 
            className="bg-transparent border-none cursor-pointer text-text-muted p-1"
          >
            <FiX size={20} />
          </button>
        </div>

        <nav className="py-3 flex-1 overflow-y-auto">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-5 py-3 text-[15px] font-semibold no-underline transition-colors ${
                isActive(link.href) 
                  ? "text-gold-hover bg-gold-muted" 
                  : "text-ink hover:bg-ink/4"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-[16px_20px] border-top border-border-strong bg-surface/40">
          {ready && isAuthenticated ? (
            <button
              type="button"
              className="jj-btn jj-btn--ghost w-full py-3"
              onClick={() => {
                logout();
                setMobileOpen(false);
                router.push("/");
              }}
            >
              <FiLogOut size={14} /> Logout
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="jj-btn jj-btn--gold w-full py-3"
            >
              <FiLogIn size={14} /> Login
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
