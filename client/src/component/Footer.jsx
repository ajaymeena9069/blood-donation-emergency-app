/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { 
  FaHeart, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaYoutube,
  FaArrowRight,
  FaShieldAlt,
  FaHeadset,
  FaQuestionCircle
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Find Donors", path: "/donors" },
    { name: "Services", path: "/services" },
    { name: "Blood Care", path: "/care" },
    { name: "Contact", path: "/contact" }
  ];

  const supportLinks = [
    { name: "FAQs", icon: <FaQuestionCircle /> },
    { name: "Privacy Policy", icon: <FaShieldAlt /> },
    { name: "Terms & Conditions", icon: <FaShieldAlt /> },
    { name: "Help Center", icon: <FaHeadset /> }
  ];

  const socialLinks = [
    { icon: <FaFacebookF />, name: "Facebook", color: "hover:text-blue-500" },
    { icon: <FaTwitter />, name: "Twitter", color: "hover:text-sky-400" },
    { icon: <FaInstagram />, name: "Instagram", color: "hover:text-pink-500" },
    { icon: <FaYoutube />, name: "YouTube", color: "hover:text-red-500" }
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Logo & Description */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20"></div>
                <div className="relative w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                  <FaHeart className="text-white text-xl" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Blood<span className="text-red-500">Care</span>+
                </h2>
                <p className="text-sm text-gray-400">Save Lives Together</p>
              </div>
            </div>

            <p className="text-gray-400 leading-relaxed">
              Connecting donors with those in need through our secure platform. 
              Every donation helps save multiple lives in your community.
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className={`w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:bg-gray-700 ${social.color} transition-all`}
                  whileHover={{ y: -3 }}
                  aria-label={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-bold text-white mb-6 pb-3 border-b border-gray-800">
              Quick Links
            </h3>
            <ul className="space-y-4">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors group"
                  >
                    <div className="w-2 h-2 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {link.name}
                    <FaArrowRight className="text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-bold text-white mb-6 pb-3 border-b border-gray-800">
              Support
            </h3>
            <ul className="space-y-4">
              {supportLinks.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-3 text-gray-400 hover:text-red-400 transition-colors cursor-pointer group"
                >
                  <div className="text-red-600 opacity-60 group-hover:opacity-100">
                    {link.icon}
                  </div>
                  <span>{link.name}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-bold text-white mb-6 pb-3 border-b border-gray-800">
              Contact Info
            </h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-900/30 rounded-lg flex items-center justify-center text-red-500 flex-shrink-0">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <p className="text-white font-medium">Location</p>
                  <p className="text-gray-400 text-sm">Jaipur, Rajasthan, India</p>
                </div>
              </li>
              
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-900/30 rounded-lg flex items-center justify-center text-red-500 flex-shrink-0">
                  <FaPhone />
                </div>
                <div>
                  <p className="text-white font-medium">Emergency Helpline</p>
                  <p className="text-gray-400 text-sm">+91 1800-123-4567</p>
                  <p className="text-xs text-red-400 mt-1">24/7 Available</p>
                </div>
              </li>
              
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-900/30 rounded-lg flex items-center justify-center text-red-500 flex-shrink-0">
                  <FaEnvelope />
                </div>
                <div>
                  <p className="text-white font-medium">Email</p>
                  <p className="text-gray-400 text-sm">support@bloodcare.com</p>
                </div>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Newsletter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="border-t border-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-lg font-bold text-white mb-2">Stay Updated</h4>
              <p className="text-gray-400 text-sm">Subscribe to our newsletter for updates</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-500 flex-1"
              />
              <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-900 bg-black/50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {new Date().getFullYear()} BloodCare+. All rights reserved. 
              <span className="mx-2">•</span>
              <span className="text-red-400">Donate Blood, Save Lives</span>
            </p>
            
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <span className="hidden md:inline">Made with</span>
              <FaHeart className="text-red-500 animate-pulse" />
              <span>to save lives</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}