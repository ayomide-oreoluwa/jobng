"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiMenu, FiX, FiChevronDown, FiUser, FiLogIn, FiBriefcase,
} from "react-icons/fi";

const navLinks = [
  { label: "Home", href: "/" },
  {
    label: "Find Jobs",
    href: "/jobs",
    children: [
      { label: "All Jobs", href: "/jobs" },
      { label: "Featured Jobs", href: "/jobs?filter=featured" },
      { label: "Remote Jobs", href: "/jobs?type=Remote" },
      { label: "Part-Time Jobs", href: "/jobs?type=Part+Time" },
      { label: "Internships", href: "/jobs?type=Internship" },
    ],
  },
  { label: "Blog", href: "/blog" },
  { label: "About Us", href: "/about" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileSub, setOpenMobileSub] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const transparent = isHome && !scrolled;

  return (
    <>
      <header
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          background: transparent ? "transparent" : "#ffffff",
          boxShadow: transparent ? "none" : "0 1px 12px rgba(0,0,0,0.08)",
          transition: "background 0.3s ease, box-shadow 0.3s ease",
          height: 72,
          display: "flex", alignItems: "center",
        }}
      >
        <div
          style={{
            width: "100%", maxWidth: 1280,
            margin: "0 auto", padding: "0 1.5rem",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
            <div style={{ width: 34, height: 34, background: "#1967D2", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FiBriefcase style={{ color: "#fff", fontSize: 18 }} />
            </div>
            <span style={{ fontSize: 20, fontWeight: 800, color: transparent ? "#fff" : "#111827", letterSpacing: "-0.02em" }}>
              JustJobNG
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: "none", alignItems: "center", gap: 4 }} className="desktop-nav">
            {navLinks.map((link) => (
              <div
                key={link.label}
                style={{ position: "relative" }}
                onMouseEnter={() => setOpenDropdown(link.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={link.href}
                  style={{
                    display: "flex", alignItems: "center", gap: 4,
                    padding: "8px 14px", borderRadius: 8,
                    fontSize: 14, fontWeight: 500, textDecoration: "none",
                    color: transparent
                      ? (pathname === link.href ? "#fff" : "rgba(255,255,255,0.85)")
                      : (pathname === link.href || pathname.startsWith(link.href) && link.href !== "/" ? "#1967D2" : "#374151"),
                    background: "transparent",
                    transition: "color 0.2s, background 0.2s",
                  }}
                >
                  {link.label}
                  {link.children && (
                    <FiChevronDown
                      size={13}
                      style={{
                        transition: "transform 0.2s",
                        transform: openDropdown === link.label ? "rotate(180deg)" : "none",
                      }}
                    />
                  )}
                </Link>

                {link.children && openDropdown === link.label && (
                  <div
                    style={{
                      position: "absolute", top: "100%", left: 0, paddingTop: 8,
                      minWidth: 200, zIndex: 100,
                    }}
                  >
                    <div
                      style={{
                        background: "#fff", borderRadius: 12,
                        boxShadow: "0 8px 40px rgba(0,0,0,0.12)", border: "1px solid #f0f0f0",
                        overflow: "hidden", padding: "6px 0",
                      }}
                    >
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          style={{
                            display: "block", padding: "10px 16px",
                            fontSize: 14, color: "#374151",
                            textDecoration: "none",
                            transition: "background 0.15s, color 0.15s",
                          }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#eff6ff"; (e.currentTarget as HTMLElement).style.color = "#1967D2"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ""; (e.currentTarget as HTMLElement).style.color = "#374151"; }}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Actions */}
          <div style={{ display: "none", alignItems: "center", gap: 8, flexShrink: 0 }} className="desktop-actions">
            <Link
              href="/login"
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "#1967D2", color: "#fff",
                fontSize: 14, fontWeight: 600, textDecoration: "none",
                padding: "9px 20px", borderRadius: 10,
                boxShadow: "0 2px 8px rgba(25,103,210,0.25)",
              }}
            >
              <FiLogIn size={15} />
              Login / Register
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: 8, borderRadius: 8,
              color: transparent ? "#fff" : "#374151",
            }}
            className="mobile-menu-btn"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </header>

      {/* Inline responsive styles */}
      <style>{`
        @media (min-width: 1024px) {
          .desktop-nav   { display: flex !important; }
          .desktop-actions { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 40,
          }}
        />
      )}

      {/* Mobile Drawer */}
      <div
        style={{
          position: "fixed", top: 0, right: 0, height: "100%",
          width: 300, maxWidth: "85vw",
          background: "#fff", zIndex: 51,
          boxShadow: "-4px 0 30px rgba(0,0,0,0.15)",
          transform: mobileOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s ease",
          overflowY: "auto",
        }}
      >
        {/* Drawer header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", borderBottom: "1px solid #f0f0f0" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }} onClick={() => setMobileOpen(false)}>
            <div style={{ width: 30, height: 30, background: "#1967D2", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FiBriefcase style={{ color: "#fff", fontSize: 15 }} />
            </div>
            <span style={{ fontSize: 17, fontWeight: 800, color: "#111827" }}>JustJobNG</span>
          </Link>
          <button onClick={() => setMobileOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", padding: 4 }}>
            <FiX size={20} />
          </button>
        </div>

        {/* Nav Links */}
        <nav style={{ padding: "12px 0" }}>
          {navLinks.map((link) => (
            <div key={link.label}>
              {link.children ? (
                <>
                  <button
                    onClick={() => setOpenMobileSub(openMobileSub === link.label ? null : link.label)}
                    style={{
                      width: "100%", display: "flex", alignItems: "center",
                      justifyContent: "space-between", padding: "12px 20px",
                      background: "none", border: "none", cursor: "pointer",
                      fontSize: 15, fontWeight: 500, color: "#374151",
                      textAlign: "left",
                    }}
                  >
                    {link.label}
                    <FiChevronDown size={14} style={{ transform: openMobileSub === link.label ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                  </button>
                  {openMobileSub === link.label && (
                    <div style={{ background: "#f8fafc", borderLeft: "3px solid #1967D2", marginLeft: 20 }}>
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          style={{ display: "block", padding: "10px 20px", fontSize: 14, color: "#6b7280", textDecoration: "none" }}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: "block", padding: "12px 20px",
                    fontSize: 15, fontWeight: 500, textDecoration: "none",
                    color: pathname === link.href ? "#1967D2" : "#374151",
                    background: pathname === link.href ? "#eff6ff" : "transparent",
                  }}
                >
                  {link.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Mobile CTAs */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid #f0f0f0" }}>
          <Link
            href="/login"
            onClick={() => setMobileOpen(false)}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "12px", borderRadius: 10,
              background: "#1967D2", color: "#fff",
              fontSize: 14, fontWeight: 600, textDecoration: "none",
            }}
          >
            <FiUser size={14} /> Login / Register
          </Link>
        </div>
      </div>
    </>
  );
}
