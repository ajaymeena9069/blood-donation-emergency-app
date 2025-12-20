/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-gray-300 pt-16 pb-10">
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* LOGO + ABOUT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold text-white mb-4">
            Blood<span className="text-red-500">Help</span>
          </h2>
          <p className="text-sm leading-relaxed">
            We connect donors with those in need to save lives.  
            Your contribution can create a big impact.
          </p>
        </motion.div>

        {/* QUICK LINKS */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-3">
            {["Home", "Find Donor", "Become Donor", "About Us", "Contact"].map(
              (link, index) => (
                <li
                  key={index}
                  className="hover:text-red-500 transition cursor-pointer"
                >
                  {link}
                </li>
              )
            )}
          </ul>
        </motion.div>

        {/* SUPPORT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
          <ul className="space-y-3">
            <li className="hover:text-red-500 transition cursor-pointer">
              FAQs
            </li>
            <li className="hover:text-red-500 transition cursor-pointer">
              Privacy Policy
            </li>
            <li className="hover:text-red-500 transition cursor-pointer">
              Terms & Conditions
            </li>
            <li className="hover:text-red-500 transition cursor-pointer">
              Help Center
            </li>
          </ul>
        </motion.div>

        {/* CONTACT INFO */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: true }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li>📍 Jaipur, Rajasthan, India</li>
            <li>📧 support@bloodhelp.com</li>
            <li>📞 +91 98765 43210</li>
          </ul>
        </motion.div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 mt-12 pt-6">
        <p className="text-center text-sm text-gray-400">
          © {new Date().getFullYear()} BloodHelp — All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
