/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Contact() {
  return (
    <div className="pt-24">
      {/* HEADER */}
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase text-gray-800">
          Contact Us
        </h2>
        <div className="w-24 h-1 bg-red-600 mx-auto mt-3 rounded-full"></div>
        <p className="text-gray-600 max-w-xl mx-auto mt-4 text-sm sm:text-base leading-relaxed">
          We are here to help you 24/7. Get in touch with our support team.
        </p>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-[1200px] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* LEFT - CONTACT INFO */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white shadow-md rounded-xl p-8"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Reach Us</h3>

          <div className="space-y-6">
            {/* Phone */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center text-xl shadow-md">
                <FaPhoneAlt />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 text-lg">Phone</h4>
                <p className="text-gray-600 text-sm">+91 98765 43210</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center text-xl shadow-md">
                <FaEnvelope />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 text-lg">Email</h4>
                <p className="text-gray-600 text-sm">support@bloodhelp.org</p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center text-xl shadow-md">
                <FaMapMarkerAlt />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 text-lg">Location</h4>
                <p className="text-gray-600 text-sm">Jaipur, Rajasthan, India</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT - CONTACT FORM */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white shadow-md rounded-xl p-8"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Send Message</h3>

          <form className="space-y-5">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-600"
            />

            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-600"
            />

            <input
              type="text"
              placeholder="Subject"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-600"
            />

            <textarea
              rows="5"
              placeholder="Message"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-600"
            ></textarea>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              className="bg-red-600 text-white w-full py-3 rounded-lg font-semibold uppercase shadow-md hover:bg-red-700 transition-all"
            >
              Send Message
            </motion.button>
          </form>
        </motion.div>
      </div>

      {/* MAP SECTION */}
      <div className="max-w-[1200px] mx-auto px-4 mt-14 mb-10">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Find us on map</h3>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-lg"
        >
          <iframe
            title="map"
            className="w-full h-full"
            loading="lazy"
            allowFullScreen
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.26331811667!2d75.7885!3d26.8610!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db671f7e3dcd1%3A0x5f1f0e02cd30dba1!2sJaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1700000000000"
          ></iframe>
        </motion.div>
      </div>
    </div>
  );
}
