/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaHeadset,
  FaPaperPlane,
  FaCheckCircle,
  FaArrowRight
} from "react-icons/fa";

export default function Contact() {
  const contactInfo = [
    {
      icon: <FaPhoneAlt />,
      title: "Emergency Helpline",
      details: ["+91 1800-123-4567", "+91 98765 43210"],
      description: "24/7 emergency support",
      color: "bg-red-100 text-red-600",
      highlight: true
    },
    {
      icon: <FaEnvelope />,
      title: "Email Support",
      details: ["support@bloodcare.com", "emergency@bloodcare.com"],
      description: "Response within 24 hours",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: <FaMapMarkerAlt />,
      title: "Location",
      details: ["Jaipur, Rajasthan", "India"],
      description: "Headquarters",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: <FaClock />,
      title: "Working Hours",
      details: ["Mon-Sun: 24/7", "Emergency: Always Available"],
      description: "Round the clock support",
      color: "bg-purple-100 text-purple-600"
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted");
  };

  return (
    <div className="pt-20 pb-20">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-block mb-4"
        >
          <div className="bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
            <FaHeadset />
            Contact Support
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-6"
        >
          Get in Touch with Us
          <span className="block text-red-600">We're Here to Help</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-600 text-lg max-w-2xl mx-auto"
        >
          Whether you need emergency blood support or have questions about donations,
          our team is available 24/7 to assist you.
        </motion.p>
      </div>

      {/* Contact Info Cards */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto px-4 mb-16"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border ${info.highlight ? 'border-red-200' : 'border-gray-100'}`}
            >
              <div className={`w-14 h-14 rounded-xl ${info.color} flex items-center justify-center text-xl mb-4`}>
                {info.icon}
              </div>

              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {info.title}
              </h3>

              <div className="space-y-1 mb-3">
                {info.details.map((detail, idx) => (
                  <p key={idx} className="text-gray-700 font-medium">
                    {detail}
                  </p>
                ))}
              </div>

              <p className="text-sm text-gray-500">
                {info.description}
              </p>

              {info.highlight && (
                <div className="mt-4 inline-flex items-center gap-2 bg-red-50 text-red-700 text-sm px-3 py-1 rounded-full">
                  <FaCheckCircle />
                  <span>Emergency Support</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Contact Form & Info */}
      <div className="max-w-6xl mx-auto px-4 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-red-100 rounded-lg">
                <FaPaperPlane className="text-red-600 text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Send us a Message</h2>
                <p className="text-gray-600">We'll respond as soon as possible</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2">Your Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Subject *</label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="emergency">Emergency Blood Requirement</option>
                  <option value="donor">Become a Donor</option>
                  <option value="support">Technical Support</option>
                  <option value="general">General Inquiry</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Your Message *</label>
                <textarea
                  rows="5"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                <FaPaperPlane />
                Send Message
                <FaArrowRight />
              </motion.button>
            </form>
          </motion.div>

          {/* Quick Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Emergency Box */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <FaHeadset className="text-2xl" />
                <div>
                  <h3 className="text-xl font-bold">Emergency Support</h3>
                  <p className="text-red-100 text-sm">Available 24/7</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold">1800-123-4567</p>
                <p className="text-red-100">Call for urgent blood requirements</p>
              </div>
            </div>

            {/* FAQ Link */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Need Help?</h3>
              <ul className="space-y-3">
                {[
                  "How to request blood urgently?",
                  "Donor registration process",
                  "Emergency response time",
                  "Contacting hospitals"
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors cursor-pointer">
                    <FaArrowRight className="text-xs" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Response Time */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FaCheckCircle className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Response Time</h3>
                  <p className="text-sm text-gray-600">We guarantee quick response</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Emergency:</span>
                  <span className="font-bold text-green-600">Immediate</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">General:</span>
                  <span className="font-bold">Within 24 hours</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Map Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto px-4"
      >
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b">
            <h3 className="text-xl font-bold text-gray-800">Find Us</h3>
            <p className="text-gray-600">Our headquarters location</p>
          </div>

          <div className="h-64 md:h-80">
            <iframe
              title="map"
              className="w-full h-full"
              loading="lazy"
              allowFullScreen
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.26331811667!2d75.7885!3d26.8610!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db671f7e3dcd1%3A0x5f1f0e02cd30dba1!2sJaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1700000000000"
              style={{ border: 0 }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}