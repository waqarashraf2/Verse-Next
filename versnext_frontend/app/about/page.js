"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Users,
  Target,
  Award,
  Clock,
  Shield,
  Globe,
  Heart,
  Sparkles,
  Zap,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  MessageSquare,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Facebook,
  Music2,
  GitBranch,
  Layers,
  Cpu,
  Palette,
  Code,
  BarChart3,
  Users as TeamIcon,
  Rocket,
  Star,
  Trophy,
  BookOpen,
  Lightbulb
} from "lucide-react";

// ========== TEAM MEMBER COMPONENT ==========
const TeamMember = ({ member, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group"
    >
      <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-[#4d61b7] transition-all duration-500 hover:shadow-xl hover:-translate-y-2">
        {/* Profile Image */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-2xl mx-auto overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
            {/* Placeholder for image - you can replace with actual images */}
            <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white" 
                 style={{ backgroundColor: member.color }}>
              {member.name.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
          
          {/* Hover Effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
            className="absolute -top-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center text-white"
            style={{ backgroundColor: member.color }}
          >
            <ArrowRight size={20} />
          </motion.div>
        </div>

        {/* Member Info */}
        <div className="text-center">
          <h4 className="text-xl font-bold text-[#071633] mb-1">{member.name}</h4>
          <div className="text-[#4d61b7] font-medium mb-3">{member.position}</div>
          <p className="text-[#64748B] text-sm mb-4">{member.bio}</p>
          
          {/* Expertise */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {member.expertise.slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg text-xs font-medium"
                style={{ 
                  backgroundColor: `${member.color}10`,
                  color: member.color
                }}
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Experience */}
          <div className="flex items-center justify-center gap-4 text-sm text-[#64748B]">
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{member.experience}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-[#64748B]" />
            <div className="flex items-center gap-1">
              <Trophy size={14} />
              <span>{member.projects}+ projects</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ========== ABOUT PAGE ==========
export default function AboutPage() {
  const [activeValue, setActiveValue] = useState(0);

  const values = [
    {
      id: 1,
      title: "Excellence",
      description: "We strive for perfection in everything we do, delivering work that exceeds expectations.",
      icon: Star,
      color: "#4d61b7"
    },
    {
      id: 2,
      title: "Innovation",
      description: "Constantly pushing boundaries with creative solutions and cutting-edge technology.",
      icon: Zap,
      color: "#6f7ed1"
    },
    {
      id: 3,
      title: "Integrity",
      description: "Honest communication and ethical practices form the foundation of our relationships.",
      icon: Shield,
      color: "#071633"
    },
    {
      id: 4,
      title: "Collaboration",
      description: "Working together with clients as partners to achieve shared success.",
      icon: Users,
      color: "#4d61b7"
    },
    {
      id: 5,
      title: "Growth",
      description: "Continuously learning and evolving to stay ahead in the digital landscape.",
      icon: TrendingUp,
      color: "#6f7ed1"
    },
    {
      id: 6,
      title: "Impact",
      description: "Creating solutions that make a meaningful difference for our clients and their customers.",
      icon: Target,
      color: "#071633"
    },
  ];

  const team = [
    {
      id: 1,
      name: "Waqar Ashraf",
      position: "CEO & Founder",
      bio: "Full stack web app and software developer leading digital strategy, product architecture, and delivery.",
      expertise: ["Full Stack", "Web Apps", "Software"],
      experience: "12 Years",
      projects: 150,
      color: "#4d61b7"
    },
    {
      id: 2,
      name: "Chudary Qaser",
      position: "CTO",
      bio: "Full stack web app and software developer focused on scalable systems, APIs, and emerging technologies.",
      expertise: ["Full Stack", "APIs", "AI/ML"],
      experience: "9 Years",
      projects: 120,
      color: "#6f7ed1"
    },
    {
      id: 3,
      name: "Iqra Nawaz",
      position: "Graphic Designer",
      bio: "Creative graphic designer focused on brand visuals, social media creatives, and polished marketing assets.",
      expertise: ["Branding", "Social Design", "Creatives"],
      experience: "8 Years",
      projects: 95,
      color: "#071633"
    },
    {
      id: 4,
      name: "Burhan Ishafaq",
      position: "AI Video Editor",
      bio: "AI video editor creating modern video content, motion edits, reels, and AI-assisted visual storytelling.",
      expertise: ["AI Video", "Reels", "Motion"],
      experience: "7 Years",
      projects: 110,
      color: "#4d61b7"
    },
    {
      id: 5,
      name: "Manat Zahra",
      position: "SEO & Social Media Specialist",
      bio: "SEO and social media specialist helping brands grow through search visibility, content planning, and campaigns.",
      expertise: ["SEO", "Social Media", "Content"],
      experience: "6 Years",
      projects: 85,
      color: "#6f7ed1"
    },
    {
      id: 6,
      name: "Umair",
      position: "Video Editor & Grapher",
      bio: "Video editor and grapher producing clean edits, commercial visuals, brand reels, and visual content.",
      expertise: ["Video Editing", "Graphy", "Reels"],
      experience: "5 Years",
      projects: 70,
      color: "#071633"
    },
  ];

  const milestones = [
    { year: "2018", event: "Company Founded", description: "Started with 3 team members" },
    { year: "2019", event: "First Major Client", description: "Partnered with Fortune 500 company" },
    { year: "2020", event: "Team Expansion", description: "Grew to 15 team members" },
    { year: "2021", event: "Award Recognition", description: "Won Digital Agency of the Year" },
    { year: "2022", event: "Global Expansion", description: "Served clients in 10+ countries" },
    { year: "2023", event: "Innovation Lab", description: "Launched R&D division" },
  ];

  const socialLinks = [
    {
      icon: Linkedin,
      label: "LinkedIn",
      color: "#0077B5",
      href: "https://www.linkedin.com/company/verse-next/posts/?feedView=all",
    },
    {
      icon: Music2,
      label: "TikTok",
      color: "#111827",
      href: "https://www.tiktok.com/@verse.next?_r=1&_t=ZS-97m7D4rkex8",
    },
    {
      icon: Facebook,
      label: "Facebook",
      color: "#1877F2",
      href: "https://www.facebook.com/share/1CtTCcqZBe/",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* ========== Cursor Effect ========== */}
      {/* ========== HERO SECTION ========== */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50" />
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-64 h-64 border-2 border-[#4d61b7] rounded-full" />
          <div className="absolute bottom-20 right-10 w-80 h-80 border-2 border-[#6f7ed1] rounded-full" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-2 border-[#071633] rotate-45" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6f7ed1]/10 text-[#071633] text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Our Story & Vision</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#071633] mb-6">
              About <span className="text-[#4d61b7]">Versenext</span>
            </h1>
            
            <p className="text-xl text-[#64748B] mb-10 max-w-3xl mx-auto">
              We are a team of passionate innovators dedicated to transforming 
              businesses through cutting-edge digital solutions and strategic insight.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto mt-12">
              {[
                { value: "6+", label: "Years Experience", icon: Clock, color: "#4d61b7" },
                { value: "50+", label: "Team Members", icon: TeamIcon, color: "#6f7ed1" },
                { value: "250+", label: "Projects", icon: Trophy, color: "#071633" },
                { value: "98%", label: "Satisfaction", icon: Heart, color: "#4d61b7" },
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    className="text-center"
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: `${stat.color}10` }}>
                      <Icon size={24} style={{ color: stat.color }} />
                    </div>
                    <div className="text-3xl font-bold text-[#071633]">{stat.value}</div>
                    <div className="text-sm text-[#64748B]">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========== OUR STORY SECTION ========== */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 text-[#64748B] text-sm font-medium mb-4">
                <div className="w-8 h-px bg-[#263a5c]" />
                OUR JOURNEY
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-[#071633] mb-6">
                From Vision to <span className="text-[#4d61b7]">Reality</span>
              </h2>
              
              <p className="text-lg text-[#64748B] mb-8">
                Founded in 2018, Versenext began with a simple vision: to help businesses 
                thrive in the digital age. What started as a small team of three has grown 
                into a full-service digital agency serving clients worldwide.
              </p>
              
              <p className="text-lg text-[#64748B] mb-12">
                Our journey has been defined by a commitment to excellence, innovation, 
                and meaningful client relationships. We believe that technology should 
                serve business goals, not the other way around.
              </p>

              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: "Global", label: "Client Reach", icon: Globe },
                  { value: "24/7", label: "Support", icon: Shield },
                  { value: "Agile", label: "Methodology", icon: GitBranch },
                  { value: "Award", label: "Winning", icon: Award },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                        <Icon className="text-[#4d61b7]" size={24} />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-[#071633]">{item.value}</div>
                        <div className="text-sm text-[#64748B]">{item.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Milestones Timeline */}
              <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#4d61b7] via-[#6f7ed1] to-[#071633]" />
                
                {/* Milestones */}
                <div className="space-y-12">
                  {milestones.map((milestone, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="relative pl-16"
                    >
                      {/* Dot */}
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2">
                        <div className="w-12 h-12 rounded-full border-4 border-white bg-gradient-to-r from-[#4d61b7] to-[#6f7ed1] flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-sm">{milestone.year}</span>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <h3 className="text-xl font-bold text-[#071633] mb-2">{milestone.event}</h3>
                        <p className="text-[#64748B]">{milestone.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== OUR VALUES SECTION ========== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 text-[#64748B] text-sm font-medium mb-4">
              <div className="w-12 h-px bg-[#263a5c]" />
              OUR CORE VALUES
              <div className="w-12 h-px bg-[#263a5c]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#071633] mb-6">
              What Drives <span className="text-[#6f7ed1]">Us</span>
            </h2>
            <p className="text-lg text-[#64748B]">
              These principles guide every decision we make and every solution we create
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onMouseEnter={() => setActiveValue(value.id)}
                  className={`group cursor-pointer transition-all duration-300 ${
                    activeValue === value.id ? 'transform scale-105' : ''
                  }`}
                >
                  <div className="h-full bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-[#4d61b7] transition-all duration-300 hover:shadow-xl">
                    {/* Icon */}
                    <motion.div
                      animate={{ 
                        rotate: activeValue === value.id ? 360 : 0,
                        scale: activeValue === value.id ? 1.1 : 1
                      }}
                      transition={{ duration: 0.5 }}
                      className="w-16 h-16 rounded-xl flex items-center justify-center mb-6"
                      style={{ backgroundColor: `${value.color}10` }}
                    >
                      <Icon size={32} style={{ color: value.color }} />
                    </motion.div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-[#071633] mb-4">{value.title}</h3>
                    <p className="text-[#64748B]">{value.description}</p>

                    {/* Active Indicator */}
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: activeValue === value.id ? '100%' : '0%' }}
                      transition={{ duration: 0.3 }}
                      className="h-1 mt-6 rounded-full"
                      style={{ backgroundColor: value.color }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== OUR TEAM SECTION ========== */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 text-[#64748B] text-sm font-medium mb-4">
              <div className="w-12 h-px bg-[#263a5c]" />
              MEET THE TEAM
              <div className="w-12 h-px bg-[#263a5c]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#071633] mb-6">
              The Minds Behind <span className="text-[#4d61b7]">Versenext</span>
            </h2>
            <p className="text-lg text-[#64748B]">
              A diverse team of experts united by passion for innovation and excellence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <TeamMember key={member.id} member={member} index={index} />
            ))}
          </div>

          {/* Team Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 bg-gradient-to-r from-[#071633] to-[#263a5c] rounded-2xl p-8"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "15+", label: "Nationalities", icon: Globe },
                { value: "40%", label: "Women in Tech", icon: Users },
                { value: "8", label: "Time Zones", icon: Clock },
                { value: "100+", label: "Certifications", icon: BookOpen },
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="text-center">
                    <Icon className="text-white mx-auto mb-4" size={32} />
                    <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-gray-300">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========== EXPERTISE SECTION ========== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 text-[#64748B] text-sm font-medium mb-4">
              <div className="w-12 h-px bg-[#263a5c]" />
              OUR EXPERTISE
              <div className="w-12 h-px bg-[#263a5c]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#071633] mb-6">
              Areas of <span className="text-[#6f7ed1]">Expertise</span>
            </h2>
            <p className="text-lg text-[#64748B]">
              Comprehensive digital capabilities to meet all your business needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Technology",
                description: "Modern tech stack and development methodologies",
                icon: Cpu,
                color: "#4d61b7",
                items: ["Web Development", "Mobile Apps", "Cloud", "DevOps"]
              },
              {
                title: "Design",
                description: "User-centered design and brand development",
                icon: Palette,
                color: "#6f7ed1",
                items: ["UI/UX Design", "Brand Identity", "Product Design", "Motion Graphics"]
              },
              {
                title: "Strategy",
                description: "Data-driven business and digital strategies",
                icon: BarChart3,
                color: "#071633",
                items: ["Digital Transformation", "Growth Strategy", "Analytics", "Consulting"]
              },
              {
                title: "Marketing",
                description: "Performance marketing and brand growth",
                icon: TrendingUp,
                color: "#4d61b7",
                items: ["SEO", "Social Media", "Content", "Paid Advertising"]
              },
            ].map((area, idx) => {
              const Icon = area.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group"
                >
                  <div className="h-full bg-white rounded-2xl p-8 border border-gray-200 hover:border-[#4d61b7] transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: `${area.color}10` }}>
                      <Icon size={32} style={{ color: area.color }} />
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-[#071633] mb-3">{area.title}</h3>
                    <p className="text-[#64748B] mb-6">{area.description}</p>

                    {/* Items */}
                    <div className="space-y-2">
                      {area.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex items-center text-sm">
                          <CheckCircle className="mr-3 flex-shrink-0" size={16} style={{ color: area.color }} />
                          <span className="text-[#64748B]">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section className="py-32 bg-gradient-to-br from-[#071633] to-[#263a5c] mb-2">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Let's Build Something <span className="text-[#6f7ed1]">Great</span> Together
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Ready to partner with a team that's passionate about your success?
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="px-8 py-4 bg-white text-[#071633] font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg flex items-center justify-center group">
                <MessageSquare className="mr-3" size={20} />
                Start Conversation
                <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link href="/contact" className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center">
                <Calendar className="mr-3" size={20} />
                Visit Our Office
              </Link>
            </div>

            {/* Contact Info */}
            <div className="mt-16 pt-8 border-t border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <MapPin className="text-[#6f7ed1]" size={20} />
                    <div className="text-white font-medium">Lahore, Pakistan</div>
                  </div>
                  <div className="text-gray-300">Head Office</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Mail className="text-[#4d61b7]" size={20} />
                    <div className="text-white font-medium">team@versenext.com | versanext@gmail.com</div>
                  </div>
                  <div className="text-gray-300">Email Us Anytime</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Phone className="text-white" size={20} />
                    <div className="text-white font-medium">+92 3211417347</div>
                  </div>
                  <div className="text-gray-300">24/7 Support Available</div>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex justify-center gap-6 mt-8">
                {socialLinks.map((social, idx) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={idx}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-xl flex items-center justify-center hover:scale-110 transition-transform"
                      style={{ backgroundColor: `${social.color}15` }}
                      aria-label={social.label}
                    >
                      <Icon size={20} style={{ color: social.color }} />
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
