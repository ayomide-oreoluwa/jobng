"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiInstagram, FiLinkedin } from "react-icons/fi";
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
  { icon: FiInstagram, href: "https://www.instagram.com/maekandex_communication_/", label: "Instagram" },
  { icon: FiLinkedin, href: "https://ng.linkedin.com/company/maekandexcommunication", label: "LinkedIn" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
};

export default function Footer() {
  return (
    <footer className="relative bg-[#0A0A0C] border-t border-[var(--border)] mt-20">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="container-xl mx-auto px-4 md:px-6 pt-16 pb-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <motion.div variants={itemVariants} className="md:col-span-2 flex flex-col items-start">
            <Logo variant="light" size="md" />
            <p className="mt-5 text-[14px] leading-relaxed max-w-sm text-[var(--text-muted)]">
              Nigeria&apos;s job discovery platform. Subscribe via <strong className="text-[var(--gold)] font-extrabold">*7098#</strong>, browse live listings, and land your next role.
            </p>
          </motion.div>

          {/* Explore Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-white mb-5 relative inline-block">
              Explore
              <span className="absolute -bottom-1 left-0 w-1/2 h-[2px] bg-[var(--gold)] rounded-full"></span>
            </h3>
            <div className="flex flex-col gap-3">
              {footerLinks.explore.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className="text-[14px] text-[var(--text-muted)] font-medium w-fit no-underline py-1 transition-all duration-200 hover:text-[var(--gold)] hover:translate-x-1"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Company Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-white mb-5 relative inline-block">
              Company
              <span className="absolute -bottom-1 left-0 w-1/2 h-[2px] bg-[var(--gold)] rounded-full"></span>
            </h3>
            <div className="flex flex-col gap-3">
              {footerLinks.company.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className="text-[14px] text-[var(--text-muted)] font-medium w-fit no-underline py-1 transition-all duration-200 hover:text-[var(--gold)] hover:translate-x-1"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom Legal Bar */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="container-xl mx-auto px-4 md:px-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-5 py-6 border-t border-[var(--border)]"
      >
        <p className="text-[13px] text-[var(--text-muted)] m-0 text-center sm:text-left">
          &copy; {new Date().getFullYear()} JustJobNG. All rights reserved.
        </p>
        
        {/* Social Icons Strip */}
        <div className="flex items-center gap-3">
          {socials.map(({ icon: Icon, href, label }) => (
            <a 
              key={label} 
              href={href} 
              aria-label={label} 
              target="_blank"            
              rel="noopener noreferrer" 
              className="w-9 h-9 rounded-lg flex items-center justify-center bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-muted)] transition-all duration-300 hover:border-[var(--gold)] hover:text-[var(--gold)] hover:-translate-y-0.5"
            >
              <Icon size={15} />
            </a>
          ))}
        </div>
      </motion.div>
    </footer>
  );
}