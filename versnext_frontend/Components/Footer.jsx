import { Facebook, Linkedin, Music2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import logo from "../assets/logo.png";

const Footer = () => {
  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const services = [
    { label: "Web Development", href: "/services" },
    { label: "SEO Services", href: "/services" },
    { label: "Digital Marketing", href: "/services" },
    { label: "Video Editing", href: "/services" },
    { label: "AI Automation", href: "/services" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/share/1CtTCcqZBe/", label: "Facebook" },
    { icon: Linkedin, href: "https://www.linkedin.com/company/verse-next/posts/?feedView=all", label: "LinkedIn" },
    { icon: Music2, href: "https://www.tiktok.com/@verse.next?_r=1&_t=ZS-97m7D4rkex8", label: "TikTok" },
  ];

  return (
    <footer className="border-t border-white/10 bg-[#071633] pt-16 pb-8 text-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <div className="mb-6 flex items-center">
              <div className="rounded-xl border border-white/10 bg-white px-3 py-2 shadow-lg shadow-black/10">
                <Image src={logo} alt="Verse Next" width={178} className="h-auto w-[150px] sm:w-[178px]" />
              </div>
            </div>
            <p className="mb-6 text-slate-300">
              Building premium websites, software, SEO systems, marketing campaigns, and AI automation for growing businesses.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/8 text-slate-200 transition hover:bg-[#d7a915] hover:text-[#071633]"
                    aria-label={social.label}
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 border-b border-[#d7a915]/30 pb-3 text-xl font-bold">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-300 transition hover:text-[#d7a915]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-6 border-b border-[#d7a915]/30 pb-3 text-xl font-bold">Services</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.label}>
                  <Link
                    href={service.href}
                    className="text-slate-300 transition hover:text-[#d7a915]"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-6 border-b border-[#d7a915]/30 pb-3 text-xl font-bold">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/8 text-[#d7a915]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-slate-300">
                  Karachi, Pakistan
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/8 text-[#d7a915]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <p className="text-slate-300">
                  +92 3211417347
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/8 text-[#d7a915]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-slate-300">
                  team@versenext.com
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-white/10 pt-8 text-center text-slate-400">
          <p>&copy; {new Date().getFullYear()} Verse Next. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
