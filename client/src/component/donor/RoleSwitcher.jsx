import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function RoleSwitcher({
    userCurrentRoles,
    currentRole,
    onRoleSwitch,
    gradientFrom = "from-red-500",
    gradientTo = "to-red-600"
}) {
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);

    const allRoles = [
        { id: "donor", name: "Blood Donor", icon: "🩸", desc: "Want to donate blood?", color: "from-red-500 to-red-600" },
        { id: "patient", name: "Blood Recipient", icon: "🏥", desc: "Need blood urgently?", color: "from-blue-500 to-blue-600" }
    ];

    const handleRoleClick = (roleId) => {
        setSelectedRole(roleId);
        setShowRoleModal(true);
    };

    const confirmRoleSwitch = () => {
        if (!selectedRole) return;
        setShowRoleModal(false);
        onRoleSwitch(selectedRole);
        setSelectedRole(null);
    };

    return (
        <>
            <div className="bg-gray-50 rounded-xl p-4 border mb-6">
                <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-sm text-gray-600 mr-2">Your roles:</span>
                    {userCurrentRoles.map(role => (
                        <button
                            key={role.id}
                            onClick={() => handleRoleClick(role.id)}
                            className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-2 transition-all ${role.id === currentRole
                                    ? `bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white shadow-md`
                                    : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200'
                                }`}
                        >
                            <span>{role.icon}</span>
                            <span>{role.name}</span>
                            {role.id === currentRole && (
                                <span className="text-xs bg-white text-red-600 px-2 rounded-full">Active</span>
                            )}
                        </button>
                    ))}
                    {userCurrentRoles.length === 1 && (
                        <button
                            onClick={() => handleRoleClick(userCurrentRoles[0].id === 'donor' ? 'patient' : 'donor')}
                            className="px-3 py-1.5 rounded-full text-sm flex items-center gap-2 bg-white border-2 border-dashed border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-all"
                        >
                            <span>{userCurrentRoles[0].id === 'donor' ? '🏥' : '🩸'}</span>
                            <span>Unlock {userCurrentRoles[0].id === 'donor' ? 'Patient' : 'Donor'}</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Role Confirmation Modal */}
            <AnimatePresence>
                {showRoleModal && selectedRole && (
                    <div className="fixed top-0 left-0 w-screen h-screen bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4" onClick={() => {
                        setShowRoleModal(false);
                        setSelectedRole(null);
                    }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
                        >
                            <div className="text-center">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-4xl">{allRoles.find(r => r.id === selectedRole)?.icon}</span>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    {selectedRole === 'donor' ? 'Become a Blood Donor?' : 'Need Blood Urgently?'}
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    {selectedRole === 'donor'
                                        ? 'You can donate blood and help save lives in your community.'
                                        : 'Create blood requests and find matching donors instantly when you need help.'}
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setShowRoleModal(false);
                                            setSelectedRole(null);
                                        }}
                                        className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmRoleSwitch}
                                        className={`flex-1 px-4 py-3 bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white rounded-lg hover:opacity-90 font-semibold transition shadow-md`}
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}