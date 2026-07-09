"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowUpRight,
  Filter,
  Calendar,
  Users,
  Target,
  Zap,
  BarChart3,
  Code,
  Palette,
  Smartphone,
  Globe,
  ShoppingCart,
  Shield,
  Cloud,
  Sparkles,
  Star,
  TrendingUp,
  Eye,
  Download,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react";

// ========== PORTFOLIO PAGE ==========
export default function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6;

  const filters = [
    { id: "all", label: "All Projects" },
    { id: "web", label: "Web Development" },
    { id: "mobile", label: "Mobile Apps" },
    { id: "ecommerce", label: "E-commerce" },
    { id: "design", label: "UI/UX Design" },
    { id: "marketing", label: "Digital Marketing" },
  ];

  const projects = [
    {
      id: 1,
      title: "Fintech Analytics Dashboard",
      category: "web",
      client: "FinCorp Solutions",
      description: "A comprehensive financial analytics platform with real-time data visualization and predictive insights for enterprise clients.",
      technologies: ["Next.js", "TypeScript", "D3.js", "Tailwind", "PostgreSQL"],
      results: ["+45% User Engagement", "2.5x Faster Insights", "99.9% Uptime"],
      year: "2023",
      duration: "4 Months",
      team: "8 Members",
      color: "#4d61b7",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop",
      challenges: ["Real-time data processing", "Complex visualization", "Security compliance"],
      solutions: ["Built custom data pipelines", "Implemented interactive charts", "Added multi-layer security"]
    },
    {
      id: 2,
      title: "E-commerce Luxury Store",
      category: "ecommerce",
      client: "Luxury Brands Inc",
      description: "High-end e-commerce platform with AR product previews, personalized recommendations, and seamless checkout experience.",
      technologies: ["React", "Node.js", "MongoDB", "Stripe", "Redis"],
      results: ["+300% Sales", "4.8 Star Rating", "2M+ Revenue"],
      year: "2023",
      duration: "6 Months",
      team: "12 Members",
      color: "#6f7ed1",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop",
      challenges: ["High traffic handling", "Payment security", "Inventory management"],
      solutions: ["Scalable architecture", "PCI compliance", "Real-time sync"]
    },
    {
      id: 3,
      title: "Healthcare Mobile App",
      category: "mobile",
      client: "HealthFirst Medical",
      description: "Telemedicine platform connecting patients with doctors through video consultations, prescription management, and health tracking.",
      technologies: ["React Native", "Firebase", "WebRTC", "AWS", "GraphQL"],
      results: ["50K+ Downloads", "4.9 App Store", "95% Satisfaction"],
      year: "2023",
      duration: "5 Months",
      team: "10 Members",
      color: "#071633",
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop",
      challenges: ["HIPAA compliance", "Real-time video", "Cross-platform"],
      solutions: ["End-to-end encryption", "Optimized streaming", "Unified codebase"]
    },
    {
      id: 4,
      title: "SaaS Project Management",
      category: "web",
      client: "TeamFlow Tech",
      description: "Collaborative project management tool with AI-powered task allocation, time tracking, and resource management.",
      technologies: ["Vue.js", "Python", "PostgreSQL", "Django", "Docker"],
      results: ["+200% Productivity", "10K+ Users", "40% Time Saved"],
      year: "2022",
      duration: "8 Months",
      team: "15 Members",
      color: "#4d61b7",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop",
      challenges: ["Complex workflows", "Team collaboration", "Data synchronization"],
      solutions: ["Intuitive UI", "Real-time updates", "Conflict resolution"]
    },
    {
      id: 5,
      title: "Real Estate Platform",
      category: "web",
      client: "Prime Properties",
      description: "Interactive real estate marketplace with 3D property tours, mortgage calculator, and agent matching system.",
      technologies: ["Next.js", "Three.js", "Mapbox", "NestJS", "MongoDB"],
      results: ["+80% Lead Conversion", "3D View Engagement", "25% Faster Sales"],
      year: "2022",
      duration: "7 Months",
      team: "14 Members",
      color: "#6f7ed1",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop",
      challenges: ["3D rendering", "Location services", "Lead management"],
      solutions: ["WebGL optimization", "Geospatial queries", "CRM integration"]
    },
    {
      id: 6,
      title: "Fitness Tracking App",
      category: "mobile",
      client: "FitLife",
      description: "Comprehensive fitness app with workout plans, nutrition tracking, progress analytics, and social features.",
      technologies: ["Flutter", "Node.js", "MongoDB", "Firebase", "TensorFlow"],
      results: ["100K+ Active Users", "4.7 Rating", "30% Retention"],
      year: "2022",
      duration: "6 Months",
      team: "11 Members",
      color: "#071633",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop",
      challenges: ["Wearable integration", "Personalization", "Social features"],
      solutions: ["Bluetooth SDK", "AI recommendations", "Community building"]
    },
    {
      id: 7,
      title: "Educational Platform",
      category: "web",
      client: "EduTech Solutions",
      description: "Online learning platform with interactive courses, progress tracking, and certification system for professional development.",
      technologies: ["React", "Django", "PostgreSQL", "WebSocket", "AWS"],
      results: ["500+ Courses", "95% Completion", "Industry Recognition"],
      year: "2021",
      duration: "9 Months",
      team: "18 Members",
      color: "#4d61b7",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&auto=format&fit=crop",
      challenges: ["Content delivery", "User engagement", "Certification"],
      solutions: ["CDN optimization", "Gamification", "Blockchain verification"]
    },
    {
      id: 8,
      title: "Food Delivery Service",
      category: "mobile",
      client: "QuickBite",
      description: "Food delivery app with real-time order tracking, restaurant management, and intelligent delivery routing.",
      technologies: ["React Native", "Express.js", "MongoDB", "Socket.io", "Google Maps"],
      results: ["+150% Orders", "20min Avg Delivery", "4.8 Customer Rating"],
      year: "2021",
      duration: "5 Months",
      team: "13 Members",
      color: "#6f7ed1",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&auto=format&fit=crop",
      challenges: ["Real-time tracking", "Multi-vendor", "Delivery optimization"],
      solutions: ["Live location", "Vendor portal", "Route algorithms"]
    },
    {
      id: 9,
      title: "Travel Booking Platform",
      category: "web",
      client: "Wanderlust Travel",
      description: "All-in-one travel booking platform with flight, hotel, and activity reservations with personalized recommendations.",
      technologies: ["Angular", "Spring Boot", "MySQL", "Redis", "Elasticsearch"],
      results: ["+120% Bookings", "Global Reach", "Award Winning"],
      year: "2021",
      duration: "10 Months",
      team: "20 Members",
      color: "#071633",
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop",
      challenges: ["Multi-provider integration", "Dynamic pricing", "Global payments"],
      solutions: ["API aggregation", "Price engine", "Multi-currency"]
    },
  ];

  const filteredProjects = activeFilter === "all" 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-white">
      {/* ========== Cursor Effect ========== */}
      {/* ========== HERO SECTION ========== */}
      <section className="verse-wave-section relative py-32 overflow-hidden">
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
              <span>Showcase of Excellence</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#071633] mb-6">
              Our <span className="text-[#4d61b7]">Portfolio</span>
            </h1>
            
            <p className="text-xl text-[#64748B] mb-10 max-w-3xl mx-auto">
              Explore our successful projects that demonstrate our expertise in 
              delivering innovative digital solutions across various industries.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto mt-12">
              {[
                { value: projects.length, label: "Projects", icon: Target, color: "#4d61b7" },
                { value: "98%", label: "Success Rate", icon: Star, color: "#6f7ed1" },
                { value: "50+", label: "Happy Clients", icon: Users, color: "#071633" },
                { value: "3M+", label: "Users Impacted", icon: TrendingUp, color: "#4d61b7" },
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

      {/* ========== FILTER SECTION ========== */}
      <section className="verse-wave-section py-12 bg-gray-50 top-20 z-30 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Filter className="text-[#64748B]" />
              <span className="text-[#071633] font-medium">Filter by:</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => {
                    setActiveFilter(filter.id);
                    setCurrentPage(1);
                  }}
                  className={`px-5 py-2.5 rounded-lg text-[14px] transition-all ${
                    activeFilter === filter.id
                      ? "bg-[#071633] text-white shadow-lg"
                      : "bg-white text-[#263a5c] border border-gray-200 hover:border-[#071633]"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            
            <div className="text-sm text-[#64748B]">
              Showing {filteredProjects.length} projects
            </div>
          </div>
        </div>
      </section>

      {/* ========== PORTFOLIO GRID ========== */}
      <section className="verse-wave-section py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {currentProjects.length > 0 ? (
              <motion.div
                key={activeFilter + currentPage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {currentProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedProject(project)}
                    className="group cursor-pointer"
                  >
                    <div className="h-full bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-[#4d61b7] transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                      {/* Project Image */}
                      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                        <div 
                          className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                          style={{ backgroundImage: `url(${project.image})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Category Badge */}
                        <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-sm font-medium text-white backdrop-blur-sm bg-black/30">
                          {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
                        </div>
                        
                        {/* View Project */}
                        <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Eye className="text-white" size={20} />
                        </div>
                      </div>

                      {/* Project Content */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-[#071633] mb-2 group-hover:text-[#4d61b7] transition-colors">
                              {project.title}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-[#64748B]">
                              <Calendar size={14} />
                              <span>{project.year}</span>
                              <span>•</span>
                              <span>{project.duration}</span>
                            </div>
                          </div>
                          
                          <div className="px-3 py-1 rounded-lg text-sm font-medium" style={{ 
                            backgroundColor: `${project.color}10`,
                            color: project.color
                          }}>
                            {project.client}
                          </div>
                        </div>

                        <p className="text-[#64748B] mb-6 line-clamp-2">
                          {project.description}
                        </p>

                        {/* Technologies */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {project.technologies.slice(0, 3).map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 text-[#64748B]"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 3 && (
                            <span className="px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 text-[#64748B]">
                              +{project.technologies.length - 3} more
                            </span>
                          )}
                        </div>

                        {/* Results */}
                        <div className="pt-6 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <div className="space-y-2">
                              {project.results.slice(0, 2).map((result, idx) => (
                                <div key={idx} className="flex items-center text-sm">
                                  <div className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: project.color }} />
                                  <span className="text-[#64748B]">{result}</span>
                                </div>
                              ))}
                            </div>
                            
                            <div className="flex items-center text-[#4d61b7] font-medium group-hover:gap-3 transition-all">
                              <span>Case Study</span>
                              <ArrowUpRight className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <Target className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-[#071633] mb-3">No Projects Found</h3>
                <p className="text-[#64748B] max-w-md mx-auto">
                  No projects available in this category. Please select another filter.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ========== PAGINATION ========== */}
          {filteredProjects.length > projectsPerPage && (
            <div className="flex justify-center items-center gap-4 mt-16">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#071633] transition-colors"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex items-center gap-2">
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => paginate(idx + 1)}
                    className={`w-10 h-10 rounded-lg font-medium ${
                      currentPage === idx + 1
                        ? "bg-[#071633] text-white"
                        : "text-[#263a5c] hover:bg-gray-100"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#071633] transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section className="verse-wave-section py-32 bg-gradient-to-br from-[#071633] to-[#263a5c] mb-2">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Let's create something amazing together. Share your project ideas with us.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="px-8 py-4 bg-white text-[#071633] font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg flex items-center justify-center group">
                <MessageSquare className="mr-3" size={20} />
                Discuss Project
                <ArrowUpRight className="ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
              
              <Link href="/contact" className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center">
                <Download className="mr-3" size={20} />
                Request Portfolio
              </Link>
            </div>

            {/* Contact Info */}
            <div className="mt-16 pt-8 border-t border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-2">Quick Start</div>
                  <div className="text-gray-300">Initial consultation within 24 hours</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-2">Transparent Process</div>
                  <div className="text-gray-300">Regular updates and clear communication</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-2">Proven Results</div>
                  <div className="text-gray-300">Track record of successful deliveries</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========== PROJECT DETAIL MODAL ========== */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                {/* Modal Header */}
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-4 py-1.5 rounded-full text-sm font-medium" style={{ 
                        backgroundColor: `${selectedProject.color}15`,
                        color: selectedProject.color
                      }}>
                        {selectedProject.category.toUpperCase()}
                      </span>
                      <div className="text-sm text-[#64748B]">
                        {selectedProject.year} • {selectedProject.duration} • {selectedProject.team}
                      </div>
                    </div>
                    
                    <h3 className="text-4xl font-bold text-[#071633] mb-2">{selectedProject.title}</h3>
                    <div className="text-xl text-[#64748B] mb-4">{selectedProject.client}</div>
                    
                    <p className="text-lg text-[#64748B] max-w-3xl">
                      {selectedProject.description}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:border-[#071633] transition-colors flex-shrink-0"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="grid lg:grid-cols-3 gap-8 mb-12">
                  {/* Technologies */}
                  <div className="lg:col-span-2">
                    <h4 className="text-2xl font-bold text-[#071633] mb-6 pb-3 border-b border-gray-200">
                      Technologies Used
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {selectedProject.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-[#64748B]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Results */}
                  <div>
                    <h4 className="text-2xl font-bold text-[#071633] mb-6 pb-3 border-b border-gray-200">
                      Key Results
                    </h4>
                    <div className="space-y-4">
                      {selectedProject.results.map((result, idx) => (
                        <div key={idx} className="flex items-center">
                          <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: selectedProject.color }} />
                          <span className="text-[#64748B]">{result}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Challenges & Solutions */}
                <div className="grid lg:grid-cols-2 gap-8 mb-12">
                  <div>
                    <h4 className="text-2xl font-bold text-[#071633] mb-6 pb-3 border-b border-gray-200">
                      Challenges
                    </h4>
                    <div className="space-y-4">
                      {selectedProject.challenges.map((challenge, idx) => (
                        <div key={idx} className="flex items-start">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-0.5" 
                                style={{ backgroundColor: `${selectedProject.color}10` }}>
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedProject.color }} />
                          </div>
                          <span className="text-[#64748B]">{challenge}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-2xl font-bold text-[#071633] mb-6 pb-3 border-b border-gray-200">
                      Our Solutions
                    </h4>
                    <div className="space-y-4">
                      {selectedProject.solutions.map((solution, idx) => (
                        <div key={idx} className="flex items-start">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-0.5" 
                                style={{ backgroundColor: `${selectedProject.color}10` }}>
                            <Zap size={12} style={{ color: selectedProject.color }} />
                          </div>
                          <span className="text-[#64748B]">{solution}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="pt-8 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/contact" className="flex-1 px-8 py-4 bg-[#071633] text-white font-semibold rounded-xl hover:bg-[#263a5c] transition-colors flex items-center justify-center group">
                      <MessageSquare className="mr-3" size={20} />
                      Discuss Similar Project
                      <ArrowUpRight className="ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Link>
                    
                    <button
                      type="button"
                      onClick={() => setSelectedProject(null)}
                      className="flex-1 px-8 py-4 bg-white text-[#071633] font-semibold rounded-xl border-2 border-gray-200 hover:border-[#071633] transition-colors flex items-center justify-center"
                    >
                      Close Case Study
                    </button>
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
