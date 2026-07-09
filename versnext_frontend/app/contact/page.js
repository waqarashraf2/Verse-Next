"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  CheckCircle,
  Users,
  Headphones,
  Sparkles,
  ArrowRight,
  Calendar,
  FileText,
  Shield,
  Zap,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Linkedin,
  Facebook,
  Music2
} from "lucide-react";

// ========== FAQ ITEM COMPONENT ==========
const FAQItem = ({ faq, index, isOpen, toggleFAQ }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="border border-gray-200 rounded-xl overflow-hidden hover:border-[#4d61b7] transition-colors"
    >
      <button
        onClick={() => toggleFAQ(index)}
        className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between text-left bg-white hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center bg-[#071633]/5">
            <span className="text-[#071633] font-bold text-sm sm:text-base">{index + 1}</span>
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-[#071633] text-left pr-2">{faq.question}</h3>
        </div>
        <div className="flex-shrink-0 ml-2 sm:ml-4">
          {isOpen ? (
            <ChevronUp className="text-[#4d61b7] w-5 h-5" />
          ) : (
            <ChevronDown className="text-[#64748B] w-5 h-5" />
          )}
        </div>
      </button>
      
      <motion.div
        initial={false}
        animate={{ 
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="px-4 sm:px-6 pb-4 sm:pb-5 pt-2 border-t border-gray-100">
          <div className="pl-0 sm:pl-14">
            <p className="text-[#64748B] leading-relaxed text-sm sm:text-base">{faq.answer}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ========== CONTACT PAGE ==========
export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(null);

  const services = [
    "Web Development",
    "Mobile App Development",
    "UI/UX Design",
    "Digital Marketing",
    "SEO Optimization",
    "Brand Strategy",
    "E-commerce Solutions",
    "Other"
  ];

  const contactInfo = [
    {
      icon: MapPin,
      title: "Head Office",
      details: ["Lahore, Pakistan", "Remote worldwide support", "Serving clients globally"],
      color: "#4d61b7",
      description: "Main office for Verse Next operations"
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["team@versenext.com", "versanext@gmail.com", "careers@versenext.com"],
      color: "#6f7ed1",
      description: "We respond within 24 hours"
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["+92 3365968297", "+92 3211417347", "+92 348 4918543"],
      color: "#071633",
      description: "24/7 customer support"
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Mon-Fri: 9AM - 6PM", "Sat: 10AM - 4PM", "Sunday: Closed"],
      color: "#4d61b7",
      description: "Based on PKT timezone"
    },
  ];

  const faqs = [
    {
      question: "What is your typical project timeline?",
      answer: "Project timelines vary based on complexity. Simple websites take 4-6 weeks, while complex applications can take 3-6 months. We provide detailed timelines during our initial consultation."
    },
    {
      question: "Do you work with international clients?",
      answer: "Yes, we work with clients worldwide. Our team operates across multiple time zones to ensure seamless communication and timely delivery."
    },
    {
      question: "Can we discuss project details before commercial terms?",
      answer: "Yes. We first understand the service, business goal, website structure, content needs, timeline, and technical requirements. Commercial details are discussed after the discovery conversation."
    },
    {
      question: "What industries do you specialize in?",
      answer: "We have expertise across multiple industries including FinTech, E-commerce, Healthcare, Education, SaaS, and Enterprise solutions."
    },
    {
      question: "What is your process for starting a new project?",
      answer: "Our process begins with a discovery call, followed by a detailed proposal, planning phase, development, testing, and launch. We maintain regular communication throughout."
    },
    {
      question: "Do you provide ongoing support after project completion?",
      answer: "Yes, we offer various support packages including maintenance, updates, hosting, and technical support to ensure your solution continues to perform optimally."
    }
  ];

  const socialLinks = [
    {
      icon: Linkedin,
      label: "LinkedIn",
      color: "#0077B5",
      followers: "Company updates",
      href: "https://www.linkedin.com/company/verse-next/posts/?feedView=all",
    },
    {
      icon: Music2,
      label: "TikTok",
      color: "#111827",
      followers: "Short videos",
      href: "https://www.tiktok.com/@verse.next?_r=1&_t=ZS-97m7D4rkex8",
    },
    {
      icon: Facebook,
      label: "Facebook",
      color: "#1877F2",
      followers: "Social posts",
      href: "https://www.facebook.com/share/1CtTCcqZBe/",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/project-inquiry`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          full_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company_name: formData.company,
          service_needed: formData.service,
          project_budget: "",
          project_details: formData.message,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    // ✅ Success
    setIsSubmitted(true);
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      service: "",
      message: "",
    });

  } catch (error) {
    console.error("Contact form error:", error);
    alert(error.message || "Failed to submit form");
  } finally {
    setIsSubmitting(false);
  }
};


  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* ========== Cursor Effect ========== */}
      {/* ========== HERO SECTION ========== */}
      <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50" />
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-4 sm:top-20 sm:left-10 w-40 h-40 sm:w-64 sm:h-64 border-2 border-[#4d61b7] rounded-full" />
          <div className="absolute bottom-10 right-4 sm:bottom-20 sm:right-10 w-48 h-48 sm:w-80 sm:h-80 border-2 border-[#6f7ed1] rounded-full" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-40 sm:h-40 border-2 border-[#071633] rotate-45" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#6f7ed1]/10 text-[#071633] text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Get in Touch</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#071633] mb-4 sm:mb-6 px-2">
              Let's <span className="text-[#4d61b7]">Connect</span>
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-[#64748B] mb-8 sm:mb-10 max-w-3xl mx-auto px-4">
              Ready to transform your digital presence? Share your project details 
              and our team will get back to you within 24 hours.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto mt-8 sm:mt-12 px-2">
              {[
                { value: "24h", label: "Response Time", icon: Zap, color: "#4d61b7" },
                { value: "100%", label: "Confidential", icon: Shield, color: "#6f7ed1" },
                { value: "01", label: "Discovery Call", icon: Lightbulb, color: "#071633" },
                { value: "50+", label: "Experts Ready", icon: Users, color: "#4d61b7" },
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
                    <div 
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3" 
                      style={{ backgroundColor: `${stat.color}10` }}
                    >
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: stat.color }} />
                    </div>
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-[#071633]">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-[#64748B]">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========== CONTACT FORM & INFO ========== */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white px-2 sm:px-0">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Left Column - Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-1 order-2 lg:order-1"
              >
                {/* Contact Information Cards */}
                <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                  {contactInfo.map((info, idx) => {
                    const Icon = info.icon;
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-gradient-to-br from-white to-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 hover:border-[#4d61b7] transition-all duration-300 hover:shadow-lg"
                      >
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div 
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${info.color}10` }}
                          >
                            <Icon className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: info.color }} />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg sm:text-xl font-bold text-[#071633] mb-2 sm:mb-3">{info.title}</h3>
                            <div className="space-y-1 sm:space-y-2">
                              {info.details.map((detail, i) => (
                                <p key={i} className="text-sm sm:text-base text-[#64748B]">{detail}</p>
                              ))}
                            </div>
                            <p className="text-xs sm:text-sm text-[#64748B] mt-2 sm:mt-3">{info.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Support Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-r from-[#071633] to-[#263a5c] rounded-xl sm:rounded-2xl p-6 sm:p-8"
                >
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl bg-[#6f7ed1] flex items-center justify-center flex-shrink-0">
                      <Headphones className="text-white w-7 h-7 sm:w-8 sm:h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">24/7 Support</h3>
                      <p className="text-gray-300 text-sm sm:text-base">Always here to help you</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <a
                      href="mailto:team@versenext.com"
                      className="block w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-[#071633] font-semibold rounded-lg hover:bg-gray-100 transition-colors text-center text-sm sm:text-base"
                    >
                      Email Support
                    </a>
                    <a
                      href="tel:+923211417347"
                      className="block w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-transparent border border-white sm:border-2 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors text-center text-sm sm:text-base"
                    >
                      Emergency Call
                    </a>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right Column - Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-2 order-1 lg:order-2 mb-8 lg:mb-0"
              >
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-200 shadow-lg">
                  <div className="mb-6 sm:mb-10">
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#071633] mb-2 sm:mb-3">Send us a message</h2>
                    <p className="text-[#64748B] text-sm sm:text-base">Fill out the form below and we'll get back to you within 24 hours</p>
                  </div>

                  {isSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8 sm:py-12"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                        <CheckCircle className="text-green-600 w-8 h-8 sm:w-10 sm:h-10" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-[#071633] mb-2 sm:mb-3">Message Sent Successfully!</h3>
                      <p className="text-[#64748B] mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base">
                        Thank you for contacting us. Our team will review your message and get back to you within 24 hours.
                      </p>
                      <button
                        onClick={() => setIsSubmitted(false)}
                        className="px-6 sm:px-8 py-2.5 sm:py-3 bg-[#071633] text-white font-semibold rounded-lg hover:bg-[#263a5c] transition-colors inline-flex items-center gap-2 text-sm sm:text-base"
                      >
                        <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                        Send Another Message
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                      {/* Personal Information */}
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-[#071633] mb-4 sm:mb-6 pb-2 sm:pb-3 border-b border-gray-200">Personal Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div className="col-span-1 sm:col-span-2 md:col-span-1">
                            <label className="block text-sm font-medium text-[#071633] mb-1.5 sm:mb-2">
                              Full Name *
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                              className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl border border-gray-300 focus:border-[#4d61b7] focus:ring-2 focus:ring-[#4d61b7]/20 outline-none transition-all bg-white text-sm sm:text-base"
                              placeholder="John Doe"
                            />
                          </div>
                          
                          <div className="col-span-1 sm:col-span-2 md:col-span-1">
                            <label className="block text-sm font-medium text-[#071633] mb-1.5 sm:mb-2">
                              Email Address *
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl border border-gray-300 focus:border-[#4d61b7] focus:ring-2 focus:ring-[#4d61b7]/20 outline-none transition-all bg-white text-sm sm:text-base"
                              placeholder="john@company.com"
                            />
                          </div>

                          <div className="col-span-1 sm:col-span-2 md:col-span-1">
                            <label className="block text-sm font-medium text-[#071633] mb-1.5 sm:mb-2">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl border border-gray-300 focus:border-[#4d61b7] focus:ring-2 focus:ring-[#4d61b7]/20 outline-none transition-all bg-white text-sm sm:text-base"
                              placeholder="+92 300 1234567"
                            />
                          </div>
                          
                          <div className="col-span-1 sm:col-span-2 md:col-span-1">
                            <label className="block text-sm font-medium text-[#071633] mb-1.5 sm:mb-2">
                              Company Name
                            </label>
                            <input
                              type="text"
                              name="company"
                              value={formData.company}
                              onChange={handleChange}
                              className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl border border-gray-300 focus:border-[#4d61b7] focus:ring-2 focus:ring-[#4d61b7]/20 outline-none transition-all bg-white text-sm sm:text-base"
                              placeholder="Your Company Inc."
                            />
                          </div>
                        </div>
                      </div>

                      {/* Project Information */}
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-[#071633] mb-4 sm:mb-6 pb-2 sm:pb-3 border-b border-gray-200">Project Information</h3>
                        <div className="mb-4 sm:mb-6">
                          <div>
                            <label className="block text-sm font-medium text-[#071633] mb-1.5 sm:mb-2">
                              Service Needed *
                            </label>
                            <select
                              name="service"
                              value={formData.service}
                              onChange={handleChange}
                              required
                              className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl border border-gray-300 focus:border-[#4d61b7] focus:ring-2 focus:ring-[#4d61b7]/20 outline-none transition-all bg-white text-sm sm:text-base"
                            >
                              <option value="">Select a service</option>
                              {services.map((service, idx) => (
                                <option key={idx} value={service}>{service}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[#071633] mb-1.5 sm:mb-2">
                            Project Details *
                          </label>
                          <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows="4"
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl border border-gray-300 focus:border-[#4d61b7] focus:ring-2 focus:ring-[#4d61b7]/20 outline-none transition-all bg-white resize-none text-sm sm:text-base"
                            placeholder="Tell us about your project, goals, timeline, and any specific requirements..."
                          />
                        </div>
                      </div>

                      {/* Submit Section */}
                      <div className="pt-4 sm:pt-6 border-t border-gray-200">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
                          <div className="text-xs sm:text-sm text-[#64748B] w-full sm:w-auto mb-4 sm:mb-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span>Your information is secure and confidential</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span>No spam. We respect your privacy</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="px-6 sm:px-8 py-2.5 sm:py-3 bg-[#071633] text-white font-semibold rounded-lg sm:rounded-xl hover:bg-[#263a5c] transition-colors flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                            >
                              {isSubmitting ? (
                                <>
                                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 sm:mr-3" />
                                  Sending...
                                </>
                              ) : (
                                <>
                                  Send Message
                                  <Send className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform" />
                                </>
                              )}
                            </button>
                            
                            <Link
                              href="/contact"
                              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-[#071633] font-semibold rounded-lg sm:rounded-xl border border-gray-300 sm:border-2 hover:border-[#071633] transition-colors flex items-center justify-center text-sm sm:text-base"
                            >
                              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                              Schedule Call
                            </Link>
                          </div>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FAQ SECTION ========== */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 px-2 sm:px-0">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-10 sm:mb-16 px-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#6f7ed1]/10 text-[#071633] text-xs sm:text-sm font-medium mb-3 sm:mb-4">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Common Questions</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#071633] mb-4 sm:mb-6">
                Frequently Asked <span className="text-[#4d61b7]">Questions</span>
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-[#64748B] max-w-2xl mx-auto">
                Find answers to common questions about our services, process, and partnerships
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4 px-2 sm:px-0">
              {faqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  faq={faq}
                  index={index}
                  isOpen={openFAQ === index}
                  toggleFAQ={toggleFAQ}
                />
              ))}
            </div>

            <div className="text-center mt-8 sm:mt-12">
              <Link href="/contact" className="px-4 sm:px-6 py-2 sm:py-3 bg-white text-[#071633] font-semibold rounded-lg border border-gray-200 sm:border-2 hover:border-[#071633] transition-colors inline-flex items-center gap-2 text-sm sm:text-base">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                View All FAQs
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========== SOCIAL & NEWSLETTER SECTION ========== */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white px-2 sm:px-0">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
              {/* Social Media */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="bg-gradient-to-br from-[#071633] to-[#263a5c] rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10">
                  <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-[#6f7ed1] flex items-center justify-center">
                      <Users className="text-white w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white">Connect With Our Community</h3>
                      <p className="text-gray-300 text-sm sm:text-base">Follow us for updates and insights</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {socialLinks.map((social, idx) => {
                      const Icon = social.icon;
                      return (
                        <a
                          key={idx}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white/10 hover:bg-white/20 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 transition-all duration-300 group"
                        >
                          <div className="flex items-center gap-3 sm:gap-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: social.color }}>
                              <Icon className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <div className="flex-1">
                              <div className="text-white font-semibold text-sm sm:text-base">{social.label}</div>
                              <div className="text-gray-400 text-xs sm:text-sm">{social.followers} followers</div>
                            </div>
                            <ArrowRight className="text-white w-3 h-3 sm:w-4 sm:h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </motion.div>

              {/* Newsletter */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 border border-gray-200 shadow-lg">
                  <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-[#4d61b7] flex items-center justify-center">
                      <Mail className="text-white w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-[#071633]">Stay Updated</h3>
                      <p className="text-[#64748B] text-sm sm:text-base">Get the latest insights in your inbox</p>
                    </div>
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-[#071633] mb-1.5 sm:mb-2">Email Address</label>
                      <input
                        type="email"
                        placeholder="your@email.com"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl border border-gray-300 focus:border-[#4d61b7] focus:ring-2 focus:ring-[#4d61b7]/20 outline-none transition-all bg-white text-sm sm:text-base"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[#071633] mb-1.5 sm:mb-2">Interests (Optional)</label>
                      <div className="flex flex-wrap gap-2">
                        {["Web Development", "Marketing", "Design", "Business"].map((interest, idx) => (
                          <label key={idx} className="inline-flex items-center">
                            <input type="checkbox" className="hidden peer" />
                            <span className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium bg-gray-100 text-[#64748B] peer-checked:bg-[#4d61b7] peer-checked:text-white cursor-pointer transition-colors">
                              {interest}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <a href="mailto:team@versenext.com" className="w-full px-6 sm:px-8 py-2.5 sm:py-3 md:py-4 bg-[#071633] text-white font-semibold rounded-lg sm:rounded-xl hover:bg-[#263a5c] transition-colors flex items-center justify-center group text-sm sm:text-base">
                      Subscribe to Newsletter
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform" />
                    </a>

                    <p className="text-xs sm:text-sm text-[#64748B] text-center">
                      We send 1-2 emails per month with valuable insights. No spam, unsubscribe anytime.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FINAL CTA SECTION ========== */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-[#071633] to-[#263a5c] px-2 sm:px-0">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center px-2"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#4d61b7] to-[#6f7ed1] flex items-center justify-center mx-auto mb-6 sm:mb-8">
              <MessageSquare className="text-white w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Let's Start Your <span className="text-[#6f7ed1]">Project</span> Today
            </h2>
            
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-8 sm:mb-10 max-w-2xl mx-auto">
              Contact us now for a focused discovery conversation and let's create something amazing together.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link href="/contact" className="px-6 sm:px-8 py-2.5 sm:py-3 md:py-4 bg-white text-[#071633] font-semibold rounded-lg sm:rounded-xl hover:bg-gray-100 transition-colors shadow-lg flex items-center justify-center group text-sm sm:text-base">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                Start Discovery Call
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link href="/contact" className="px-6 sm:px-8 py-2.5 sm:py-3 md:py-4 bg-transparent border border-white sm:border-2 text-white font-semibold rounded-lg sm:rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center text-sm sm:text-base">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                Book a Meeting
              </Link>
            </div>

            {/* Guarantee Badges */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 mt-10 sm:mt-12 md:mt-16">
              {[
                { text: "24h Response", icon: Zap },
                { text: "Discovery First", icon: Lightbulb },
                { text: "Clear Scope", icon: Shield },
                { text: "Satisfaction Guaranteed", icon: CheckCircle },
              ].map((badge, idx) => {
                const Icon = badge.icon;
                return (
                  <div key={idx} className="flex items-center gap-1.5 sm:gap-2 text-white text-xs sm:text-sm">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>{badge.text}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
