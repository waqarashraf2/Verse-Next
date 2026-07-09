"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from 'next/image'
import logo from '../assets/logo.png'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY;

      setScrolled(currentScrollY > 20);
      setVisible(!scrollingDown || currentScrollY < 90 || isOpen);
      lastScrollY = currentScrollY;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <div className="fixed left-1/2 top-4 z-50 w-[calc(100%-28px)] max-w-7xl -translate-x-1/2">
      <motion.nav
        animate={{ y: visible ? 0 : -112, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.32, ease: "easeOut" }}
        className={`overflow-hidden transition-shadow duration-300 ${
          scrolled
            ? "bg-white/96 shadow-2xl shadow-[#071633]/14"
            : "bg-white/88 shadow-xl shadow-[#071633]/8"
        } rounded-t-2xl border border-white/70 border-b-0 text-[#071633] backdrop-blur-xl`}
      >
        <div className="mx-auto flex items-center justify-between px-4 py-2.5 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
              <Image
                src={logo}
                alt="Verse Next"
                width={148}
              />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-7 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[14px] font-semibold text-[#53627a] transition-colors hover:text-[#4d61b7]"
              >
                {item.label}
              </Link>
            ))}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/contact"
                className="block rounded-xl bg-[#071633] px-5 py-2.5 text-[14px] font-semibold text-white shadow-lg shadow-[#071633]/20 transition hover:bg-[#4d61b7]"
              >
                Get Free Consultation
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="text-[#071633] md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-[#4d61b7]/20 bg-white md:hidden"
            >
              <div className="space-y-2 px-4 py-4">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block rounded-xl px-3 py-3 text-sm font-semibold text-[#53627a] hover:bg-[#eef1ff] hover:text-[#071633]"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link href="/contact" className="mt-3 block w-full rounded-xl bg-[#071633] py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-[#4d61b7]" onClick={() => setIsOpen(false)}>
                  Get Free Consultation
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <motion.div
        animate={{ y: visible ? 0 : -68 }}
        transition={{ duration: 0.32, ease: "easeOut" }}
        className={`overflow-hidden rounded-b-2xl border border-t-0 border-white/70 bg-white/94 text-center shadow-xl shadow-[#071633]/12 backdrop-blur-xl ${
          visible ? "" : "rounded-t-2xl border-t"
        }`}
      >
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#4d61b7]/80 to-transparent" />
        <div className="truncate whitespace-nowrap px-4 py-2.5 text-[12px] font-semibold tracking-[0.05em] text-[#4d61b7] sm:text-[13px]">
          Verse Next Digital Company - Web Development | Software | SEO | Marketing | AI Automation
        </div>
      </motion.div>
    </div>
  );
};

export default Navbar;
