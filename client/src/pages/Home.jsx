/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <>
      {/* HERO SECTION - Already responsive */}
      <section className="relative w-full bg-[url('https://templates.bwlthemes.com/blood_donation/v_2/images/home_1_slider_2.jpg')] bg-cover bg-center bg-no-repeat overflow-hidden">
        <div className="max-w-[1200px] w-full aspect-[16/13.5] sm:aspect-[21/10] md:aspect-[18/8] lg:aspect-[16/7] xl:aspect-[16/8] ">
          <div className="absolute inset-0 bg-black/50"></div>

          {/* Animated Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="w-[80%] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center text-center text-white px-4 sm:px-8"
          >
            <h1 className="text-2xl sm:text-3xl uppercase md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-4">
              Donate Blood. Save Lives. Spread Hope.
            </h1>

            <p className="text-base lg:text-2xl max-w-2xl mb-6">
              A single blood donation can save up to three lives. Join our
              community of voluntary donors and become a part of someone's miracle.
            </p>

            <motion.button
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.95 }}
              className="bg-red-600 uppercase hover:bg-red-700 px-6 py-3 text-sm sm:text-base md:text-lg font-medium cursor-pointer shadow-md transition-all duration-300"
            >
              Become a Donor
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* DONATION PROCESS - Made Responsive */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">

          {/* Animated Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
              Donation Process
            </h2>

            {/* Underline Animation */}
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "60px" }}
              transition={{ duration: 0.6 }}
              className="h-1 bg-[#EF3D32] mx-auto mb-4 rounded-full opacity-80"
            ></motion.div>

            <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
              Follow these three simple steps to complete your donation safely and efficiently.
            </p>
          </motion.div>

          {/* Steps - Made Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">

            {[1, 2, 3].map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.7 }}
                viewport={{ once: true }}
                className="group overflow-hidden h-full flex flex-col transition-all"
              >
                <div className="relative">
                  <img
                    src={`https://templates.bwlthemes.com/blood_donation/v_2/images/process_${step}.jpg`}
                    alt="step"
                    className="w-full h-48 sm:h-56 md:h-64 object-cover"
                  />

                  <div
                    className="absolute bottom-0 right-0 
                    bg-[#ef3b32a3] text-white 
                    w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center 
                    text-3xl sm:text-4xl font-semibold 
                    rounded-tl-2xl sm:rounded-tl-3xl
                    transition-all duration-300 ease-out
                    group-hover:bg-[#EF3D32] group-hover:shadow-xl"
                  >
                    <h1>{step}</h1>
                  </div>
                </div>

                <div className="py-6 sm:py-8 bg-[#F8F9FA] px-4 sm:px-6 flex-grow">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">
                    {step === 1 ? "Registration" : step === 2 ? "Screening" : "Donation"}
                  </h3>

                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    {step === 1 &&
                      "Fill out a quick registration form so we can verify your details and prepare for a safe donation experience."}
                    {step === 2 &&
                      "A simple health screening ensures you are fit to donate. This includes checking iron levels and basic vitals."}
                    {step === 3 &&
                      "Relax comfortably while donating. The entire process is safe, painless, and takes just 6-10 minutes."}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY DONATE BLOOD - Made Responsive */}
      <section className="py-12 sm:py-16 md:py-20 bg-[#F8F9FA]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 text-center">

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4"
          >
            Why Donate Blood?
          </motion.h2>

          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "60px" }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="h-1 bg-[#EF3D32] mx-auto mb-8 sm:mb-10 rounded-full opacity-80"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: i * 0.2 }}
                viewport={{ once: true }}
                className="p-6 sm:p-8 bg-white shadow-md rounded-xl hover:shadow-xl transition-all"
              >
                <img
                  src={
                    i === 1
                      ? "https://cdn-icons-png.flaticon.com/512/2965/2965878.png"
                      : i === 2
                        ? "https://cdn-icons-png.flaticon.com/512/3900/3900413.png"
                        : "https://cdn-icons-png.flaticon.com/512/3082/3082038.png"
                  }
                  alt="why donate"
                  className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4"
                />

                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                  {i === 1 ? "Save Lives" : i === 2 ? "Help Community" : "Healthy Activity"}
                </h3>

                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {i === 1 &&
                    "Your small effort can save someone's entire life. One unit of blood can save 3 lives."}
                  {i === 2 &&
                    "Blood shortages are real. Regular donors help hospitals treat emergencies."}
                  {i === 3 &&
                    "Donating blood regularly improves cardiovascular health and reduces harmful iron levels."}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW BLOOD DONATION WORKS - Made Responsive */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4"
          >
            How Blood Donation Works
          </motion.h2>

          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "70px" }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="h-1 bg-red-600 mx-auto rounded-full mb-10 sm:mb-12 md:mb-14"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
            {[
              {
                img: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
                title: "1. Register",
                text: "Fill in your details and choose your donation center."
              },
              {
                img: "https://cdn-icons-png.flaticon.com/512/3050/3050525.png",
                title: "2. Quick Checkup",
                text: "A health professional checks basic vitals before donation."
              },
              {
                img: "https://cdn-icons-png.flaticon.com/512/2965/2965878.png",
                title: "3. Donate Blood",
                text: "The donation process takes around 10-15 minutes only."
              },
              {
                img: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
                title: "4. Save Lives",
                text: "Your blood is processed and used to save multiple lives."
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="bg-white p-6 sm:p-8 shadow-lg rounded-xl hover:shadow-xl transition-all text-center"
              >
                <img src={item.img} className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6" alt="step" />
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}