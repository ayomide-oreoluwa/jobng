"use client";

import Link from "next/link";
import { FiFacebook, FiXTwitter, FiInstagram, FiLinkedin } from "react-icons/fi";
import Logo from "@/components/brand/Logo";

const footerLinks = {
  explore: [
    { label: "Browse Jobs", href: "/jobs" },
    { label: "Login", href: "/login" },
    { label: "Forgot PIN", href: "/forgot-password" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
    { label: "FAQ", href: "/faq" },
  ],
};

const socials = [
  // { icon: FiFacebook, href: "#", label: "Facebook" },
  // { icon: FiXTwitter, href: "#", label: "X" },
  { icon: FiInstagram, href: "https://www.instagram.com/maekandex_communication_/", label: "Instagram" },
  { icon: FiLinkedin, href: "https://ng.linkedin.com/company/maekandexcommunication", label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="bg-[radial-gradient(ellipse_80%_80%_at_80%_0%,#CDEBB0_0%,transparent_55%),linear-gradient(200deg,#8DC63F_0%,#00A651_55%,#00863F_100%)] text-ink/70">
      {/* Main Grid Section */}
      <div className="container-xl pt-16 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr] gap-10">
          
          {/* Brand Info Column */}
          <div>
            <Logo variant="dark" size="md" />
            <p className="mt-5 text-sm line-clamp-3 leading-relaxed max-w-[300px] text-ink/65">
              Nigeria&apos;s job discovery platform. Subscribe via <strong className="text-[#055A2B] font-extrabold">*7098#</strong>, browse live listings, and land your next role.
            </p>
          </div>

          {/* Explore Links */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-ink mb-5">
              Explore
            </h3>
            <div className="flex flex-col gap-1.5">
              {footerLinks.explore.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className="text-sm text-ink/60 no-underline py-1 transition-colors duration-150 hover:text-ink"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-ink mb-5">
              Company
            </h3>
            <div className="flex flex-col gap-1.5">
              {footerLinks.company.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className="text-sm text-ink/60 no-underline py-1 transition-colors duration-150 hover:text-ink"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="border-t border-ink/12">
        <div className="container-xl flex flex-wrap items-center justify-between gap-3 py-5">
          <p className="text-[13px] text-ink/55 m-0">
            &copy; {new Date().getFullYear()} JustJobNG. All rights reserved.
          </p>
          
          {/* Social Icons Strip */}
          <div className="flex items-center gap-2">
            {socials.map(({ icon: Icon, href, label }) => (
              <a 
                key={label} 
                href={href} 
                aria-label={label} 
                className="w-8 h-8 rounded-full flex items-center justify-center bg-ink/8 text-ink/60 transition-all duration-200 hover:bg-ink hover:text-gold-hover"
              >
                <Icon size={13} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}