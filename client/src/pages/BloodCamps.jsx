/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { 
  FaHeart, 
  FaAppleAlt, 
  FaWater, 
  FaBed, 
  FaRunning,
  FaStethoscope,
  FaHandHoldingHeart,
  FaUserMd,
  FaClipboardCheck,
  FaCheckCircle
} from "react-icons/fa";

export default function BloodCare() {
  return (
    <>
      {/* HERO SECTION */}
      <section className="relative w-full min-h-[60vh] bg-gradient-to-r from-red-600 to-red-700 flex items-center">
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 h-full ">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white text-center w-full"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Blood Care & Health Tips
            </h1>
            
            <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Learn how to maintain healthy blood levels and prepare for blood donation
            </p>
          </motion.div>
        </div>
      </section>

      {/* PRE-DONATION TIPS */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Pre-Donation Preparation
            </h2>
            <div className="w-20 h-1 bg-red-600 mx-auto rounded-full mb-6"></div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Follow these tips before donating blood for a smooth experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <FaAppleAlt className="text-3xl" />,
                title: "Eat Healthy",
                tips: [
                  "Have a light meal 2-3 hours before donation",
                  "Include iron-rich foods like spinach, lentils",
                  "Avoid fatty foods for 24 hours"
                ],
                color: "text-green-600 bg-green-50"
              },
              {
                icon: <FaWater className="text-3xl" />,
                title: "Stay Hydrated",
                tips: [
                  "Drink plenty of water day before",
                  "Consume extra 500ml before donation",
                  "Avoid alcohol 24 hours before"
                ],
                color: "text-blue-600 bg-blue-50"
              },
              {
                icon: <FaBed className="text-3xl" />,
                title: "Rest Well",
                tips: [
                  "Get 7-8 hours sleep night before",
                  "Avoid heavy exercise before donation",
                  "Take it easy on donation day"
                ],
                color: "text-purple-600 bg-purple-50"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className={`w-16 h-16 ${item.color} rounded-full flex items-center justify-center mb-6 mx-auto`}>
                  {item.icon}
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                  {item.title}
                </h3>
                
                <ul className="space-y-3">
                  {item.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start gap-3">
                      <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-600">{tip}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* POST-DONATION CARE */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              After Donation Care
            </h2>
            <div className="w-20 h-1 bg-red-600 mx-auto rounded-full mb-6"></div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Important steps to take after donating blood
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                  <FaHandHoldingHeart className="text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Immediate Aftercare</h3>
              </div>
              
              <div className="space-y-4">
                {[
                  "Rest for 10-15 minutes at donation site",
                  "Drink plenty of fluids (juice, water)",
                  "Have the provided snacks",
                  "Keep bandage on for 4-6 hours",
                  "Avoid heavy lifting for 24 hours"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 text-sm font-bold">{index + 1}</span>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <FaStethoscope className="text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Next 24 Hours</h3>
              </div>
              
              <div className="space-y-4">
                {[
                  "Continue drinking extra fluids",
                  "Eat iron-rich meals",
                  "No alcohol for 24 hours",
                  "Avoid strenuous exercise",
                  "If feeling dizzy, sit or lie down"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-bold">{index + 1}</span>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* HEALTHY BLOOD TIPS */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Maintaining Healthy Blood
            </h2>
            <div className="w-20 h-1 bg-red-600 mx-auto rounded-full mb-6"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-red-50 rounded-xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <FaHeart className="text-2xl text-red-600" />
                <h3 className="text-xl font-bold text-gray-800">Iron-Rich Foods</h3>
              </div>
              
              <div className="space-y-4">
                {[
                  { name: "Spinach & Leafy Greens", benefit: "Rich in iron and folate" },
                  { name: "Lentils & Beans", benefit: "Plant-based iron source" },
                  { name: "Red Meat", benefit: "Heme iron (easily absorbed)" },
                  { name: "Nuts & Seeds", benefit: "Iron and vitamin E" },
                  { name: "Citrus Fruits", benefit: "Vitamin C helps iron absorption" }
                ].map((food, index) => (
                  <div key={index} className="flex justify-between items-center bg-white p-3 rounded-lg">
                    <span className="font-medium text-gray-800">{food.name}</span>
                    <span className="text-sm text-gray-600">{food.benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-blue-50 rounded-xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <FaRunning className="text-2xl text-blue-600" />
                <h3 className="text-xl font-bold text-gray-800">Lifestyle Tips</h3>
              </div>
              
              <div className="space-y-4">
                {[
                  "Regular exercise improves circulation",
                  "Stay hydrated throughout the day",
                  "Manage stress through meditation",
                  "Avoid smoking and limit alcohol",
                  "Get regular health checkups"
                ].map((tip, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white p-3 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold">{index + 1}</span>
                    </div>
                    <span className="text-gray-700">{tip}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Frequently Asked Questions
            </h2>
            <div className="w-20 h-1 bg-red-600 mx-auto rounded-full mb-6"></div>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                question: "How often can I donate blood?",
                answer: "You can donate whole blood every 56 days (8 weeks). Platelet donations can be made more frequently."
              },
              {
                question: "Is blood donation safe?",
                answer: "Yes, all equipment is sterile and used only once. The process is monitored by trained professionals."
              },
              {
                question: "How long does donation take?",
                answer: "The actual donation takes 8-10 minutes. Including registration and recovery, plan for about 1 hour."
              },
              {
                question: "Can I donate if I have tattoos?",
                answer: "Yes, if the tattoo was done at a licensed facility and is fully healed (usually 6-12 months)."
              },
              {
                question: "Will I feel weak after donating?",
                answer: "Most donors feel fine. Rest for 10-15 minutes, drink fluids, and avoid strenuous activity for 24 hours."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-red-600 font-bold">Q</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
              Ready to Donate?
            </h2>
            
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Now that you know how to prepare, take the next step and save lives
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Check Eligibility
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Find Donation Center
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}