/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CheckCircle, AlertTriangle, Info, ShieldAlert } from "lucide-react";

// -----------------------------------------
// 🔥 PREDEFINED MESSAGES (EDIT HERE)
// -----------------------------------------
const messages = {
    auth: {
        loginSuccess: "Login successful 🎉",
        loginFailed: "Invalid email or password ❌",
        registerSuccess: "Account created successfully 🎊",
        registerFailed: "Registration failed. Try again ❌",
    },
    donor: {
        statusUpdated: "Donor status updated ✔",
        notEligible: "You are not eligible to donate right now ⚠",
    },
    request: {
        requestSent: "Blood request sent successfully 🩸",
        requestFailed: "Request could not be submitted ❌",
        requestUpdated: "Request status updated ✔",
    },
    general: {
        error: "Something went wrong ❌",
        success: "Operation completed successfully ✔",
        info: "Here is some information ℹ",
        warning: "Please check the details ⚠",
    }
};

// Helper function
export const getMessage = (section, key) => {
    return messages?.[section]?.[key] || "";
};

// -----------------------------------------
// 🔥 MODERN FLASH MESSAGE
// -----------------------------------------
const FlashMessage = ({ flash, setFlash }) => {
    const [progress, setProgress] = useState(100);

    const { type = "error", message = "" } = flash || {};

    const onClose = () => {
        if (setFlash) {
            setFlash({ type: "", message: "" });
        }
    };

    // Auto close + progress animation
    useEffect(() => {
        if (message) {
            setProgress(100);

            const duration = 3000; // 3 seconds
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev <= 0) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - (100 / (duration / 30));
                });
            }, 30);

            const timeout = setTimeout(() => {
                onClose();
            }, duration);

            return () => {
                clearInterval(interval);
                clearTimeout(timeout);
            };
        }
    }, [message]);

    if (!message) return null;

    const getStyles = () => {
        switch (type) {
            case "success":
                return {
                    bg: "bg-gradient-to-r from-green-500 to-green-600 backdrop-blur-xl",
                    icon: <CheckCircle size={22} />,
                };
            case "warning":
                return {
                    bg: "bg-gradient-to-r from-yellow-500 to-yellow-600 backdrop-blur-xl",
                    icon: <AlertTriangle size={22} />,
                };
            case "info":
                return {
                    bg: "bg-gradient-to-r from-blue-500 to-blue-600 backdrop-blur-xl",
                    icon: <Info size={22} />,
                };
            default:
                return {
                    bg: "bg-gradient-to-r from-red-500 to-red-600 backdrop-blur-xl",
                    icon: <ShieldAlert size={22} />,
                };
        }
    };

    const style = getStyles();

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className={` fixed top-8 left-1/2 -translate-x-1/2 min-w-[330px] max-w-[90%] px-6 py-4 text-white rounded-2xl shadow-2xl border border-white/20 flex items-center gap-4 ${style.bg} z-50 backdrop-blur-xl`}
            >
                <span className="text-white drop-shadow-lg">{style.icon}</span>

                <p className="font-semibold tracking-wide text-[15px] drop-shadow-lg">
                    {message}
                </p>

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 w-full h-[4px] bg-white/20 rounded-b-2xl overflow-hidden">
                    <motion.div
                        initial={{ width: "100%" }}
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: "linear" }}
                        className="h-full bg-white"
                    ></motion.div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default FlashMessage;