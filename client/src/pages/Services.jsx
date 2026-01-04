/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { 
  HeartPulse, 
  LifeBuoy, 
  Droplet, 
  ShieldCheck,
  PhoneCall,
  Users,
  Search,
  FileText,
  Bell,
  MessageSquare,
  MapPin,
  UserPlus,
  ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";

export const Services = () => {
  const services = [
    {
      icon: <HeartPulse size={36} />,
      title: "Blood Donation",
      desc: "Become a blood donor and save lives. Register once, donate regularly.",
      features: ["Safe Process", "Regular Updates", "Donor Community"],
      route: "/register",
      buttonText: "Register as Donor",
      color: "bg-red-50 border-red-100",
      iconColor: "text-red-600"
    },
    {
      icon: <Search size={36} />,
      title: "Find Donors",
      desc: "Search for blood donors by blood group, location, and availability.",
      features: ["Advanced Search", "Real-time Matching", "Contact Donors"],
      route: "/donors",
      buttonText: "Search Donors",
      color: "bg-blue-50 border-blue-100",
      iconColor: "text-blue-600"
    },
    {
      icon: <FileText size={36} />,
      title: "Blood Requests",
      desc: "Patients can create blood requests and find matching donors quickly.",
      features: ["Easy Request Form", "Donor Matching", "Status Tracking"],
      route: "/patient/create/request",
      buttonText: "Create Request",
      color: "bg-green-50 border-green-100",
      iconColor: "text-green-600",
      protected: true,
      role: "patient"
    },
    {
      icon: <LifeBuoy size={36} />,
      title: "Emergency Support",
      desc: "24/7 emergency assistance for urgent blood requirements.",
      features: ["Immediate Response", "Verified Donors", "Hospital Support"],
      route: "/contact",
      buttonText: "Contact Emergency",
      color: "bg-orange-50 border-orange-100",
      iconColor: "text-orange-600"
    },
  ];

  const features = [
    { 
      icon: <Users size={24} />, 
      text: "50,000+ Verified Donors",
      subtext: "Active donor community"
    },
    { 
      icon: <ShieldCheck size={24} />, 
      text: "Safe & Verified Process",
      subtext: "All donors are verified"
    },
    { 
      icon: <MapPin size={24} />, 
      text: "Location-based Matching",
      subtext: "Find donors near you"
    },
    { 
      icon: <Bell size={24} />, 
      text: "Real-time Notifications",
      subtext: "Instant updates on matches"
    },
  ];

  return (
    <div className="py-16 bg-white">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto px-4 text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-block mb-4"
        >
          <div className="bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
            <HeartPulse size={16} />
            Our Services
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-6"
        >
          How We Help Save Lives
        </motion.h2>

        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: 100 }}
          transition={{ duration: 0.8 }}
          className="h-1 bg-red-600 mx-auto mb-8 rounded-full"
        />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-gray-600 text-lg max-w-2xl mx-auto"
        >
          Connect donors with patients through our secure and efficient platform
        </motion.p>
      </div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto mb-16 px-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-50 p-6 rounded-xl border border-gray-100"
            >
              <div className="p-3 bg-white rounded-lg w-fit mb-4 border">
                {feature.icon}
              </div>
              <h4 className="font-bold text-gray-800 mb-1">{feature.text}</h4>
              <p className="text-gray-600 text-sm">{feature.subtext}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Services Grid */}
      <div className="max-w-6xl mx-auto px-4 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={`${service.color} rounded-2xl p-8 border shadow-sm hover:shadow-lg transition-all`}
            >
              <div className="flex items-start gap-6">
                <div className={`p-4 rounded-xl ${service.iconColor} bg-white border flex-shrink-0`}>
                  {service.icon}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6">
                    {service.desc}
                  </p>
                  
                  <div className="space-y-2 mb-8">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${service.iconColor} bg-current`}></div>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  {service.protected ? (
                    <div className="space-y-3">
                      <Link
                        to="/login"
                        className="inline-flex items-center gap-2 text-red-600 font-semibold hover:text-red-700 transition-colors"
                      >
                        Login to Access
                        <ChevronRight size={16} />
                      </Link>
                      <p className="text-sm text-gray-500">
                        Available for registered {service.role}s only
                      </p>
                    </div>
                  ) : (
                    <Link
                      to={service.route}
                      className="inline-flex items-center gap-2 bg-white border border-gray-300 hover:border-red-300 text-gray-800 hover:text-red-600 px-6 py-3 rounded-lg font-semibold hover:shadow-md transition-all group"
                    >
                      {service.buttonText}
                      <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-6xl mx-auto px-4 mb-20"
      >
        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-8 md:p-12 border border-red-100">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Simple Process, Big Impact
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Three easy steps to connect donors with patients in need
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Register",
                desc: "Sign up as a donor or patient",
                icon: <UserPlus size={24} />,
                color: "bg-red-100 text-red-600"
              },
              {
                step: "2",
                title: "Connect",
                desc: "Find matches based on blood type and location",
                icon: <Search size={24} />,
                color: "bg-blue-100 text-blue-600"
              },
              {
                step: "3",
                title: "Communicate",
                desc: "Get notifications and coordinate donation",
                icon: <MessageSquare size={24} />,
                color: "bg-green-100 text-green-600"
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 ${item.color} rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6`}>
                  {item.step}
                </div>
                <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                  {item.icon}
                </div>
                <h4 className="font-bold text-gray-800 mb-2">{item.title}</h4>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-4xl mx-auto px-4"
      >
        <div className="bg-red-600 text-white rounded-2xl p-8 md:p-12 text-center shadow-xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Make a Difference?
          </h2>
          
          <p className="text-white/90 max-w-2xl mx-auto mb-8 text-lg">
            Join our community of lifesavers. Every donation counts.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              <UserPlus size={20} />
              Register Now
            </Link>
            
            <Link
              to="/donors"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
            >
              <Search size={20} />
              Find Donors
            </Link>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/20">
            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <PhoneCall size={20} className="text-white/80" />
                <span className="text-sm">Emergency: 1800-123-4567</span>
              </div>
              <div className="h-4 w-px bg-white/30"></div>
              <Link 
                to="/contact" 
                className="text-sm hover:text-white/80 transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Services;