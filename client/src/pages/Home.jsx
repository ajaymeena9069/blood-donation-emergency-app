// Home.jsx
import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useGetHomeStatsQuery } from "../features/api/bloodApi";
import { useSelector } from "react-redux";
import {
  FaHeartbeat,
  FaTint,
  FaUsers,
  FaHospital,
  FaAmbulance,
  FaClock,
  FaCheckCircle,
  FaArrowRight,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaQuoteLeft,
  FaShieldAlt,
  FaHandHoldingHeart,
  FaCalendarCheck,
  FaChartLine,
  FaGlobeAsia,
  FaAward
} from "react-icons/fa";

export default function Home() {
  const navigate = useNavigate();
  const { data: statsData, isLoading } = useGetHomeStatsQuery();
  const { user } = useSelector((state) => state.auth);
  const { scrollYProgress } = useScroll();
  const [statsVisible, setStatsVisible] = useState(false);

  const totalDonors = statsData?.data?.totalDonors || 0;
  const availableDonors = statsData?.data?.availableDonors || 0;
  const livesSaved = statsData?.data?.livesSaved || 0;
  const bloodGroupStats = statsData?.data?.bloodGroupStats || [];
  const topCities = statsData?.data?.topCities || [];
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const stats = [
    { icon: FaUsers, value: totalDonors, label: "Registered Donors", color: "red", suffix: "+" },
    { icon: FaHeartbeat, value: availableDonors, label: "Available Now", color: "green", suffix: "+" },
    { icon: FaClock, value: "24/7", label: "Emergency Support", color: "orange", suffix: "" },
    { icon: FaAward, value: livesSaved, label: "Lives Saved", color: "indigo", suffix: "+" },
  ];

  const faqs = [
    {
      q: "Who can donate blood?",
      a: "Generally, anyone between 18-65 years, weighing at least 50kg, and in good health can donate blood."
    },
    {
      q: "How often can I donate?",
      a: "Men can donate every 3 months, while women can donate every 4 months. This ensures your body replenishes the blood cells."
    },
    {
      q: "Is blood donation safe?",
      a: "Absolutely! All equipment is sterile and used only once. The entire process is supervised by trained medical professionals."
    },
    {
      q: "How long does it take?",
      a: "The actual donation takes only 6-10 minutes. Including registration and screening, expect to spend about an hour."
    }
  ];

  return (
    <div className="min-h-screen w-full bg-white overflow-x-hidden">
      {/* Hero Section with Parallax */}
      <section className="relative h-screen w-full overflow-hidden">
        <motion.div
          style={{ scale: heroScale }}
          className="absolute inset-0 w-full h-full"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40 z-10" />
          <img
            src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Blood Donation"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Animated Blood Drops */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, 100, 0],
                opacity: [0, 0.5, 0],
                x: Math.sin(i) * 50
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                delay: i * 2
              }}
              className="absolute"
              style={{ left: `${20 + i * 15}%`, top: '-10%' }}
            >
              <FaTint className="text-red-500/20 text-4xl" />
            </motion.div>
          ))}
        </div>

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute inset-0 z-30 flex items-center justify-center"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="inline-block mb-6"
            >
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                <FaHeartbeat className="text-white text-4xl animate-pulse" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              Donate Blood.
              <br />
              <span className="text-red-500">Save Lives.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto"
            >
              Join <span className="text-red-500 font-bold">{totalDonors}+</span> heroes who are making a difference every day.
              Your single donation can save up to 3 lives.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to={user ? `/${user.activeRole}/dashboard` : "/register"}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 group"
                >
                  {user ? "Go to Dashboard" : "Become a Donor"}
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>

              <Link to="/services">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border-2 border-white/30 px-8 py-4 rounded-full text-lg font-semibold transition-all"
                >
                  Our Services
                </motion.button>
              </Link>
            </motion.div>

            {/* Emergency Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
              className="mt-12 inline-flex items-center gap-2 bg-red-600/30 backdrop-blur-md px-6 py-3 rounded-full border border-red-400/50"
            >
              <FaAmbulance className="text-red-300 animate-pulse" />
              <span className="text-sm text-white">Emergency? Call: </span>
              <a href="tel:1800-123-4567" className="text-white font-bold hover:text-red-200">
                1800-123-4567
              </a>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2" />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact in Numbers</h2>
            <div className="w-20 h-1 bg-white/50 mx-auto rounded-full" />
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                    <Icon className="text-2xl" />
                  </div>
                  <motion.div
                    initial={{ value: 0 }}
                    whileInView={{ value: stat.value }}
                    className="text-2xl font-bold mb-1"
                  >
                    {stat.value}{stat.suffix}
                  </motion.div>
                  <p className="text-sm text-white/80">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Blood Group Availability */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Available Blood Groups
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real-time availability of donors by blood type
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {bloodGroups.map((group, index) => {
              const bloodGroupData = bloodGroupStats.find(bg => bg.group === group);
              const count = bloodGroupData?.count || 0;
              const Icon = count > 0 ? FaCheckCircle : FaClock;

              return (
                <Link to={count > 0 ? `/find-donors?bloodGroup=${encodeURIComponent(group)}` : '#'} key={group}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className={`relative overflow-hidden rounded-2xl p-6 text-center cursor-pointer group
                      ${count > 0
                        ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-xl'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                  >
                  {/* Animated Background */}
                  {count > 0 && (
                    <motion.div
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 0.1, 0.3],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                      }}
                      className="absolute inset-0 bg-white/20 rounded-full blur-2xl"
                    />
                  )}

                  <h3 className={`text-3xl font-bold mb-2 relative z-10 ${count > 0 ? 'text-white' : 'text-gray-500'
                    }`}>{group}</h3>

                  <p className={`text-sm font-medium relative z-10 ${count > 0 ? 'text-white/90' : 'text-gray-500'
                    }`}>
                    {count} available
                  </p>

                  <Icon className={`absolute bottom-2 right-2 text-2xl ${count > 0 ? 'text-white/30' : 'text-gray-300'
                    }`} />
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-red-100 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to save a life
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: "Register",
                description: "Create your account and complete your donor profile with medical information.",
                icon: FaUsers,
                color: "red"
              },
              {
                step: 2,
                title: "Get Matched",
                description: "Receive notifications when patients need your blood type in your area.",
                icon: FaHeartbeat,
                color: "blue"
              },
              {
                step: 3,
                title: "Donate & Save",
                description: "Visit the donation center and save up to 3 lives with one donation.",
                icon: FaHandHoldingHeart,
                color: "green"
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ y: -10 }}
                  className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all group"
                >
                  {/* Step Number */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {item.step}
                  </div>

                  {/* Icon */}
                  <div className={`w-20 h-20 bg-${item.color}-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className={`text-${item.color}-600 text-3xl`} />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>

                  {/* Progress Line */}
                  {index < 2 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-300">
                      <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-400 rounded-full" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Donate */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Your Donation Matters
              </h2>

              <div className="space-y-6">
                {[
                  {
                    title: "Save Multiple Lives",
                    description: "One donation can save up to 3 lives. Your blood is separated into components that help different patients.",
                    icon: FaHeartbeat
                  },
                  {
                    title: "Emergency Ready",
                    description: "Blood shortages are common. Regular donors ensure hospitals are prepared for emergencies.",
                    icon: FaAmbulance
                  },
                  {
                    title: "Health Benefits",
                    description: "Regular donation improves cardiovascular health and helps maintain healthy iron levels.",
                    icon: FaChartLine
                  },
                  {
                    title: "Community Impact",
                    description: "Be part of a community that comes together to support those in need.",
                    icon: FaUsers
                  }
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="text-red-600 text-xl" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8"
              >
                <Link to="/services">
                  <button className="group flex items-center gap-2 text-red-600 font-semibold hover:text-red-700">
                    Explore our services
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Blood Donation"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                {/* Stats Overlay */}
                <div className="absolute bottom-6 left-6 right-6 grid grid-cols-3 gap-4">
                  <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 text-center border border-white/30">
                    <p className="text-2xl font-bold text-white">1 in 3</p>
                    <p className="text-xs text-white/80">Will need blood</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 text-center border border-white/30">
                    <p className="text-2xl font-bold text-white">2 sec</p>
                    <p className="text-xs text-white/80">Someone needs blood</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 text-center border border-white/30">
                    <p className="text-2xl font-bold text-white">38%</p>
                    <p className="text-xs text-white/80">Eligible donors</p>
                  </div>
                </div>
              </div>

              {/* Floating Card */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                }}
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <FaCheckCircle className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Available Now</p>
                    <p className="text-2xl font-bold text-gray-900">{availableDonors}+</p>
                    <p className="text-xs text-gray-500">Ready donors</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Top Cities */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Top Donor Cities
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our donors are spread across the country
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {topCities.map((cityData, index) => (
              <Link to={`/find-donors?city=${encodeURIComponent(cityData.city)}`} key={cityData.city}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all relative overflow-hidden group"
                >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-white mb-2">{cityData.city}</h3>
                  <p className="text-3xl font-bold text-red-600 group-hover:text-white mb-1">{cityData.count}</p>
                  <p className="text-sm text-gray-500 group-hover:text-white/80">Active Donors</p>
                </div>

                {/* Icon */}
                <FaMapMarkerAlt className="absolute bottom-4 right-4 text-3xl text-gray-200 group-hover:text-white/20 transition-colors" />
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about blood donation
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <details className="group">
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                    <h3 className="text-lg font-semibold text-gray-900 group-open:text-red-600">
                      {faq.q}
                    </h3>
                    <div className="w-6 h-6 flex items-center justify-center bg-red-100 rounded-full group-open:bg-red-600 transition-colors">
                      <span className="text-red-600 group-open:text-white transform group-open:rotate-45 transition-transform">+</span>
                    </div>
                  </summary>
                  <div className="px-6 pb-6 text-gray-600">
                    {faq.a}
                  </div>
                </details>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-red-800 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-white"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-red-100 mb-10 max-w-2xl mx-auto">
              Join thousands of donors who are saving lives every day. Your journey to becoming a hero starts here.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={user ? `/${user.activeRole}/dashboard` : "/register"}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-red-600 px-8 py-4 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 mx-auto"
                >
                  {user ? "Go to Dashboard" : "Become a Donor"}
                  <FaArrowRight />
                </motion.button>
              </Link>

              <Link to="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition-all"
                >
                  Contact Us
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>


    </div>
  );
}