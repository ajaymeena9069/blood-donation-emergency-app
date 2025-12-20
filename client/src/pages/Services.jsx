/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { HeartPulse, LifeBuoy, Droplet, ShieldCheck } from "lucide-react";

export const Services = () => {
  const services = [
    {
      icon: <HeartPulse size={40} className="text-red-600" />,
      title: "Blood Donation",
      desc: "Donate blood to save lives. Our centers ensure a safe and seamless donation experience.",
    },
    {
      icon: <Droplet size={40} className="text-red-600" />,
      title: "Plasma Donation",
      desc: "Help patients fighting critical diseases by donating your life-saving plasma.",
    },
    {
      icon: <LifeBuoy size={40} className="text-red-600" />,
      title: "Emergency Support",
      desc: "Get immediate help in emergency blood requirements through real-time donor matching.",
    },
    {
      icon: <ShieldCheck size={40} className="text-red-600" />,
      title: "Health Checkups",
      desc: "All donors receive free health screening including BP, hemoglobin, pulse & wellness check.",
    },
  ];

  return (
    <div className="py-16 bg-gray-50">
      {/* Header Section */}
      <div className="text-center mb-14">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase text-gray-800"
        >
          Our Services
        </motion.h2>

        {/* Red Underline */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: 120 }}
          transition={{ duration: 0.6 }}
          className="h-[3px] bg-red-600 mx-auto mt-3 rounded-full"
        ></motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-gray-600 max-w-2xl mx-auto mt-6 text-base sm:text-lg"
        >
          We provide safe, reliable and modern healthcare support for donors and patients.
        </motion.p>
      </div>

      {/* Services Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-white p-8 shadow-md rounded-xl text-center hover:shadow-xl transition-all border border-gray-200"
          >
            <div className="flex justify-center mb-4">{service.icon}</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              {service.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">{service.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="mt-20 bg-red-600 text-white text-center py-12 px-6 rounded-2xl max-w-5xl mx-auto shadow-lg"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 uppercase">
          Ready to Become a Donor?
        </h2>
        <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg mb-6">
          Join our community and help save millions of lives by becoming a regular donor.
        </p>

        <button className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all shadow-md">
          Register Now
        </button>
      </motion.div>
    </div>
  );
};

export default Services;
