"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Code, 
  Search, 
  TrendingUp, 
  Video, 
  Users, 
  Globe,
  Palette,
  Smartphone,
  Shield,
  Cloud,
  BarChart3,
  Zap,
  Target,
  Layers,
  Cpu,
  GitBranch,
  Sparkles,
  CheckCircle,
  ArrowRight,
  MessageSquare,
  Calendar,
  FileText,
  Headphones,
  Award,
  Clock,
  Star,
  X
} from "lucide-react";

// ========== SERVICES PAGE ==========
export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    document.body.style.overflow = selectedService ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedService]);

  const services = [
    {
      id: 1,
      title: "Web Development",
      description: "Custom web applications built with modern technologies for optimal performance and scalability.",
      icon: Code,
      features: ["Next.js/React", "TypeScript", "Performance Optimization", "API Integration", "E-commerce Solutions"],
      process: ["Discovery", "Design", "Development", "Testing", "Launch"],
      color: "#4d61b7",
      expertise: ["Frontend", "Backend", "Full-Stack"]
    },
    {
      id: 2,
      title: "SEO Optimization",
      description: "Comprehensive SEO strategies to improve search rankings and drive sustainable organic traffic.",
      icon: Search,
      features: ["Technical SEO", "Content Strategy", "Keyword Research", "Analytics", "Local SEO"],
      process: ["Audit", "Strategy", "Implementation", "Monitoring", "Optimization"],
      color: "#6f7ed1",
      expertise: ["On-Page SEO", "Off-Page SEO", "Technical SEO"]
    },
    {
      id: 3,
      title: "Digital Marketing",
      description: "Data-driven marketing campaigns across all digital channels for maximum ROI and growth.",
      icon: TrendingUp,
      features: ["Social Media", "PPC Campaigns", "Email Marketing", "Content Marketing", "Analytics"],
      process: ["Strategy", "Campaign Setup", "Execution", "Analysis", "Optimization"],
      color: "#071633",
      expertise: ["Paid Advertising", "Social Media", "Content Strategy"]
    },
    {
      id: 4,
      title: "Video Production",
      description: "Professional video editing and animation services for commercials and social media content.",
      icon: Video,
      features: ["2D/3D Animation", "Motion Graphics", "Color Grading", "Sound Design", "Script Writing"],
      process: ["Concept", "Scripting", "Production", "Editing", "Delivery"],
      color: "#4d61b7",
      expertise: ["Animation", "Editing", "Production"]
    },
    {
      id: 5,
      title: "Social Media Management",
      description: "Complete social media management including content creation and community engagement.",
      icon: Users,
      features: ["Content Calendar", "Community Management", "Analytics", "Ad Campaigns", "Brand Voice"],
      process: ["Audit", "Strategy", "Content Creation", "Engagement", "Reporting"],
      color: "#6f7ed1",
      expertise: ["Content Creation", "Community Management", "Analytics"]
    },
    {
      id: 6,
      title: "Brand Strategy",
      description: "Develop a strong brand identity that resonates with your target audience and drives loyalty.",
      icon: Globe,
      features: ["Brand Identity", "Market Research", "Positioning", "Visual Design", "Messaging"],
      process: ["Research", "Strategy", "Design", "Implementation", "Guidelines"],
      color: "#071633",
      expertise: ["Brand Identity", "Market Research", "Visual Design"]
    },
    {
      id: 7,
      title: "UI/UX Design",
      description: "User-centered design solutions that enhance user experience and drive conversions.",
      icon: Palette,
      features: ["Wireframing", "Prototyping", "User Testing", "Design Systems", "Mobile Design"],
      process: ["Research", "Wireframes", "Design", "Testing", "Handoff"],
      color: "#4d61b7",
      expertise: ["UI Design", "UX Research", "Prototyping"]
    },
    {
      id: 8,
      title: "Mobile App Development",
      description: "Native and cross-platform mobile applications for iOS and Android platforms.",
      icon: Smartphone,
      features: ["iOS & Android", "React Native", "App Store Optimization", "Push Notifications", "Security"],
      process: ["Planning", "Design", "Development", "Testing", "Deployment"],
      color: "#6f7ed1",
      expertise: ["iOS Development", "Android Development", "Cross-Platform"]
    },
    {
      id: 9,
      title: "Cybersecurity Solutions",
      description: "Comprehensive security measures to protect your digital assets and customer data.",
      icon: Shield,
      features: ["Security Audits", "Penetration Testing", "Compliance", "Monitoring", "Incident Response"],
      process: ["Assessment", "Planning", "Implementation", "Monitoring", "Maintenance"],
      color: "#071633",
      expertise: ["Security Audits", "Compliance", "Monitoring"]
    },
    {
      id: 10,
      title: "Cloud Infrastructure",
      description: "Cloud solutions for scalability, reliability, and optimized performance.",
      icon: Cloud,
      features: ["AWS/Azure/GCP", "Serverless", "Kubernetes", "Migration", "Optimization"],
      process: ["Assessment", "Architecture", "Migration", "Optimization", "Support"],
      color: "#4d61b7",
      expertise: ["AWS", "Azure", "Kubernetes"]
    },
    {
      id: 11,
      title: "Business Intelligence",
      description: "Transform data into actionable insights with advanced analytics and reporting.",
      icon: BarChart3,
      features: ["Data Visualization", "Predictive Analytics", "Dashboards", "KPI Tracking", "Reporting"],
      process: ["Data Collection", "Analysis", "Visualization", "Insights", "Reporting"],
      color: "#6f7ed1",
      expertise: ["Data Analysis", "Visualization", "Reporting"]
    },
    {
      id: 12,
      title: "Digital Transformation",
      description: "End-to-end digital transformation strategies for legacy system modernization.",
      icon: Zap,
      features: ["Strategy", "Implementation", "Training", "Support", "Optimization"],
      process: ["Assessment", "Roadmap", "Implementation", "Training", "Support"],
      color: "#071633",
      expertise: ["Strategy", "Implementation", "Change Management"]
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* ========== Cursor Effect ========== */}

      {/* ========== HERO SECTION ========== */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50" />
        
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-5">
          {Array.from({ length: 20 }, (_, i) => ({
            id: i,
            width: ((i * 37) % 200) + 50,
            height: ((i * 53) % 200) + 50,
            left: (i * 29) % 100,
            top: (i * 47) % 100,
          })).map((item) => (
            <div
              key={item.id}
              className="absolute rounded-full"
              style={{
                background: `radial-gradient(circle, ${
                  item.id % 3 === 0 ? '#4d61b7' : item.id % 3 === 1 ? '#6f7ed1' : '#071633'
                }20, transparent)`,
                width: item.width,
                height: item.height,
                left: `${item.left}%`,
                top: `${item.top}%`,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6f7ed1]/10 text-[#071633] text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Comprehensive Digital Solutions</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#071633] mb-6">
              Our <span className="text-[#4d61b7]">Services</span>
            </h1>
            
            <p className="text-xl text-[#64748B] mb-10 max-w-3xl mx-auto">
              We deliver end-to-end digital solutions that combine technical 
              excellence with strategic insight to drive measurable business results.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto mt-12">
              {[
                { value: "12+", label: "Services", icon: Layers, color: "#4d61b7" },
                { value: "98%", label: "Satisfaction", icon: Star, color: "#6f7ed1" },
                { value: "24/7", label: "Support", icon: Headphones, color: "#071633" },
                { value: "50+", label: "Experts", icon: Award, color: "#4d61b7" },
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

      {/* ========== SERVICES GRID ========== */}
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
              WHAT WE OFFER
              <div className="w-12 h-px bg-[#263a5c]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#071633] mb-6">
              Comprehensive Digital Services
            </h2>
            <p className="text-lg text-[#64748B]">
              Each service is tailored to meet your specific business needs and objectives
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => setSelectedService(service)}
                  className="group cursor-pointer"
                >
                  <div className="h-full bg-white rounded-2xl p-8 border border-gray-200 hover:border-[#4d61b7] transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                    {/* Icon & Badge */}
                    <div className="flex items-start justify-between mb-6">
                      <motion.div
                        whileHover={{ rotate: 5, scale: 1.1 }}
                        className="w-16 h-16 rounded-xl flex items-center justify-center relative"
                        style={{ backgroundColor: `${service.color}10` }}
                      >
                        <Icon size={32} style={{ color: service.color }} />
                        
                        {/* Floating dots */}
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="absolute -top-2 -right-2 w-4 h-4 rounded-full"
                          style={{ backgroundColor: service.color }}
                        />
                      </motion.div>
                      
                      <div className="flex flex-wrap gap-2">
                        {service.expertise.slice(0, 2).map((exp, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 rounded-full text-xs font-medium"
                            style={{ 
                              backgroundColor: `${service.color}15`,
                              color: service.color
                            }}
                          >
                            {exp}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-[#071633] mb-4 group-hover:text-[#4d61b7] transition-colors">
                      {service.title}
                    </h3>
                    
                    <p className="text-[#64748B] mb-6">
                      {service.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-2 mb-8">
                      {service.features.slice(0, 4).map((feature, idx) => (
                        <div key={idx} className="flex items-center">
                          <div className="w-1.5 h-1.5 rounded-full mr-3" style={{ backgroundColor: service.color }} />
                          <span className="text-sm text-[#64748B]">{feature}</span>
                        </div>
                      ))}
                      {service.features.length > 4 && (
                        <div className="text-sm text-[#64748B] ml-5">+{service.features.length - 4} more features</div>
                      )}
                    </div>

                    {/* Process Steps */}
                    <div className="pt-6 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#64748B]" />
                          <span className="text-sm text-[#64748B]">{service.process.length} phases</span>
                        </div>
                        
                        <div className="flex items-center text-[#4d61b7] font-medium group-hover:gap-3 transition-all">
                          <span>Explore</span>
                          <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== PROCESS SECTION ========== */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <div className="inline-flex items-center gap-2 text-[#64748B] text-sm font-medium mb-4">
              <div className="w-12 h-px bg-[#263a5c]" />
              OUR PROCESS
              <div className="w-12 h-px bg-[#263a5c]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#071633] mb-6">
              How We Work
            </h2>
            <p className="text-lg text-[#64748B]">
              A structured approach that ensures quality, transparency, and success
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {[
              { step: "01", title: "Discovery", description: "Understanding your business goals and requirements", icon: Target },
              { step: "02", title: "Planning", description: "Creating detailed strategy and project roadmap", icon: FileText },
              { step: "03", title: "Execution", description: "Developing and implementing the solution", icon: Cpu },
              { step: "04", title: "Testing", description: "Quality assurance and performance testing", icon: CheckCircle },
              { step: "05", title: "Delivery", description: "Launch and ongoing support & maintenance", icon: Zap },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Connecting Line */}
                  {index < 4 && (
                    <div className="hidden lg:block absolute top-12 left-3/4 w-full h-0.5 bg-gray-200" />
                  )}
                  
                  <div className="relative bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
                    {/* Step Number */}
                    <div className="absolute -top-4 left-8 w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg" 
                         style={{ backgroundColor: index === 0 ? "#071633" : index === 1 ? "#4d61b7" : index === 2 ? "#6f7ed1" : index === 3 ? "#071633" : "#4d61b7" }}>
                      {item.step}
                    </div>
                    
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 mt-4" 
                         style={{ backgroundColor: `${index === 0 ? "#071633" : index === 1 ? "#4d61b7" : index === 2 ? "#6f7ed1" : index === 3 ? "#071633" : "#4d61b7"}10` }}>
                      <Icon size={32} style={{ color: index === 0 ? "#071633" : index === 1 ? "#4d61b7" : index === 2 ? "#6f7ed1" : index === 3 ? "#071633" : "#4d61b7" }} />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-[#071633] mb-4">{item.title}</h3>
                    <p className="text-[#64748B]">{item.description}</p>
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
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Let's discuss how our services can help you achieve your digital goals
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="px-8 py-4 bg-white text-[#071633] font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg flex items-center justify-center group">
                <MessageSquare className="mr-3" size={20} />
                Start Conversation
                <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link href="/contact" className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center">
                <Calendar className="mr-3" size={20} />
                Schedule Meeting
              </Link>
            </div>

            {/* Contact Info */}
            <div className="mt-16 pt-8 border-t border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-2">Quick Response</div>
                  <div className="text-gray-300">Within 24 hours guaranteed</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-2">Free Consultation</div>
                  <div className="text-gray-300">No commitment required</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-2">Custom Proposal</div>
                  <div className="text-gray-300">Tailored to your needs</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========== SERVICE DETAIL MODAL ========== */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] grid place-items-center overflow-y-auto bg-[#071633]/70 px-3 py-5 backdrop-blur-sm sm:px-6 sm:py-8"
            onClick={() => setSelectedService(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.2 }}
              className="flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/80 bg-white shadow-2xl shadow-[#071633]/35 max-h-[calc(100vh-40px)] sm:max-h-[calc(100vh-64px)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex flex-shrink-0 items-start justify-between gap-4 border-b border-gray-200 bg-white px-5 py-5 sm:px-8 sm:py-6">
                <div className="flex min-w-0 items-start gap-4 sm:gap-6">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl sm:h-20 sm:w-20" 
                          style={{ backgroundColor: `${selectedService.color}10` }}>
                    <selectedService.icon className="h-7 w-7 sm:h-10 sm:w-10" style={{ color: selectedService.color }} />
                  </div>
                  
                  <div className="min-w-0">
                    <h3 className="text-2xl font-bold leading-tight text-[#071633] sm:text-3xl">{selectedService.title}</h3>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#64748B] sm:text-base">{selectedService.description}</p>
                    
                    <div className="mt-4 flex flex-wrap gap-2">
                      {selectedService.expertise.map((exp, idx) => (
                        <span
                          key={idx}
                          className="rounded-full px-3 py-1.5 text-xs font-medium sm:text-sm"
                          style={{ 
                            backgroundColor: `${selectedService.color}15`,
                            color: selectedService.color
                          }}
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedService(null)}
                  className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-gray-200 text-[#071633] transition hover:border-[#071633] hover:bg-gray-50"
                  aria-label="Close service details"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
                {/* Modal Content */}
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Features */}
                  <div>
                    <h4 className="text-xl font-bold text-[#071633] mb-6 pb-3 border-b border-gray-200">
                      Key Features
                    </h4>
                    <div className="space-y-4">
                      {selectedService.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-0.5" 
                                style={{ backgroundColor: `${selectedService.color}10` }}>
                            <CheckCircle size={14} style={{ color: selectedService.color }} />
                          </div>
                          <span className="text-[#64748B]">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Process */}
                  <div>
                    <h4 className="text-xl font-bold text-[#071633] mb-6 pb-3 border-b border-gray-200">
                      Our Process
                    </h4>
                    <div className="space-y-6">
                      {selectedService.process.map((step, idx) => (
                        <div key={idx} className="flex items-start">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center mr-4 flex-shrink-0 font-bold text-white" 
                                style={{ backgroundColor: selectedService.color }}>
                            {idx + 1}
                          </div>
                          <div>
                            <div className="font-semibold text-[#071633] mb-1">{step}</div>
                            <div className="text-sm text-[#64748B]">
                              Detailed implementation of {step.toLowerCase()} phase
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/contact" className="flex-1 px-8 py-4 bg-[#071633] text-white font-semibold rounded-xl hover:bg-[#263a5c] transition-colors flex items-center justify-center group">
                      <MessageSquare className="mr-3" size={20} />
                      Discuss Project
                      <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    
                    <Link href="/contact" className="flex-1 px-8 py-4 bg-white text-[#071633] font-semibold rounded-xl border-2 border-gray-200 hover:border-[#071633] transition-colors flex items-center justify-center">
                      <Calendar className="mr-3" size={20} />
                      Schedule Call
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
