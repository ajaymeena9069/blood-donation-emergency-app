import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import DonorRegister from "./DonorRegister";
import PatientRegister from "./PatientRegister";

export default function RegisterToggle() {
  const navigate = useNavigate();
  const location = useLocation();

  // Detect current URL on page load
  const [active, setActive] = useState("donor");

  useEffect(() => {
    if (location.pathname === "/register/patient") {
      setActive("patient");
    } else {
      setActive("donor");
    }
  }, [location.pathname]);

  // Runs when user clicks toggle
  const handleToggle = (mode) => {
    setActive(mode);
    navigate(`/register/${mode}`);
  };

  return (<>
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="p-8  w-[90%] max-w-xl flex flex-col justify-center mx-auto text-center"
    >
      {/* Toggle Buttons */}
      <div className="flex w-full  rounded-lg overflow-hidden">

        {/* Donor Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleToggle("donor")}
          className={`flex-1 py-3 font-medium transition-all
            ${active === "donor" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-600"}
          `}
        >
          Donor
        </motion.button>

        {/* Patient Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleToggle("patient")}
          className={`flex-1 py-3 font-medium transition-all
            ${active === "patient" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}
          `}
        >
          Patient
        </motion.button>

      </div>

    </motion.div>

    {active === "donor" && <DonorRegister />}
    {active === "patient" && <PatientRegister />}
  </>
  );
}
