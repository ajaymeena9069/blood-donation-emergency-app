/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Droplet, Users } from "lucide-react";

export default function BloodCamps() {
  const camps = [
    {
      id: 1,
      title: "Jaipur Mega Blood Donation Camp",
      date: "25 Feb 2025",
      location: "SMS Hospital, Jaipur",
      donors: "150+ Donors Expected",
      image: "https://images.pexels.com/photos/8460348/pexels-photo-8460348.jpeg",
    },
    {
      id: 2,
      title: "Delhi Red Cross Blood Drive",
      date: "03 Mar 2025",
      location: "AIIMS, New Delhi",
      donors: "220+ Donors Expected",
      image: "https://images.pexels.com/photos/8460344/pexels-photo-8460344.jpeg",
    },
    {
      id: 3,
      title: "Mumbai Charity Blood Event",
      date: "10 Mar 2025",
      location: "Fortis Hospital, Mumbai",
      donors: "180+ Donors Expected",
      image: "https://images.pexels.com/photos/8460346/pexels-photo-8460346.jpeg",
    },
  ];

  return (
    <div className="pt-24">

      {/* HERO BANNER */}
      <section className="relative bg-[url('https://templates.bwlthemes.com/blood_donation/v_2/images/home_1_slider_2.jpg')] bg-cover bg-center bg-no-repeat py-24">
        <div className="absolute inset-0 bg-black/60"></div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative text-center text-white px-4"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase">
            Blood Donation Camps
          </h1>
          <div className="w-28 h-1 bg-red-600 mx-auto mt-4 rounded-full"></div>
          <p className="max-w-xl mx-auto mt-4 text-sm sm:text-base leading-relaxed">
            Join nearby blood donation camps and save lives around you.
          </p>
        </motion.div>
      </section>

      {/* SEARCH + FILTERS */}
      <div className="max-w-[1200px] mx-auto px-4 mt-12 mb-6">
        <div className="bg-white shadow-md p-6 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-6">

          <input
            type="text"
            placeholder="Search by location..."
            className="border p-3 rounded-lg focus:outline-none focus:border-red-600"
          />

          <input
            type="date"
            className="border p-3 rounded-lg focus:outline-none focus:border-red-600"
          />

          <button className="bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold py-3 transition-all">
            Search Camp
          </button>
        </div>
      </div>

      {/* CAMPS LIST */}
      <div className="max-w-[1200px] mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">

        {camps.map((camp) => (
          <motion.div
            key={camp.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            whileHover={{ scale: 1.03 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <img
              src={camp.image}
              alt={camp.title}
              className="h-48 w-full object-cover"
            />

            <div className="p-6 space-y-3">
              <h3 className="text-xl font-bold text-gray-800">{camp.title}</h3>

              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <Calendar className="w-4 h-4 text-red-600" />
                {camp.date}
              </div>

              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <MapPin className="w-4 h-4 text-red-600" />
                {camp.location}
              </div>

              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <Users className="w-4 h-4 text-red-600" />
                {camp.donors}
              </div>

              <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg mt-3 transition-all font-medium uppercase">
                Join Camp
              </button>
            </div>
          </motion.div>
        ))}

      </div>

    </div>
  );
}
