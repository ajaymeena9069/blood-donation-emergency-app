import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserPlus, FaUserCircle, FaEnvelope, FaPhone, FaTint, FaMapMarkerAlt, FaCalendarAlt, FaVenusMars, FaUserShield, FaHeartbeat, FaHospital, FaSpinner, FaKey, FaCopy, FaCheck } from "react-icons/fa";
import { useAdminCreateUserMutation } from "../../features/api/bloodApi";

export default function AddNewUserModal({ isOpen, onClose, onAddUser }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        bloodGroup: '',
        city: '',
        age: '',
        gender: '',
        role: 'donor'
    });
    const [error, setError] = useState('');
    const [generatedPassword, setGeneratedPassword] = useState('');
    const [copied, setCopied] = useState(false);
    const [createUser, { isLoading }] = useAdminCreateUserMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setGeneratedPassword('');
        setCopied(false);

        try {
            const response = await createUser(formData).unwrap();
            
            if (response.success) {
                const password = response.data.defaultPassword;
                setGeneratedPassword(password);
                
                // Auto copy to clipboard
                try {
                    await navigator.clipboard.writeText(password);
                    setCopied(true);
                } catch (err) {
                    console.error('Failed to copy:', err);
                }
                
                // Show password for 5 seconds then close
                setTimeout(() => {
                    setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        bloodGroup: '',
                        city: '',
                        age: '',
                        gender: '',
                        role: 'donor'
                    });
                    setGeneratedPassword('');
                    setCopied(false);
                    onAddUser();
                }, 5000);
            }
        } catch (err) {
            setError(err?.data?.message || 'Failed to create user');
        }
    };

    const handleCopyPassword = async () => {
        try {
            await navigator.clipboard.writeText(generatedPassword);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                        <FaUserPlus className="text-white text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white">Add New User</h3>
                                        <p className="text-green-100 text-sm">Create a new user account</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="text-white/80 hover:text-white transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            {error && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                    {error}
                                </div>
                            )}

                            {generatedPassword && (
                                <div className="mb-4 p-4 bg-green-50 border-2 border-green-300 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <FaKey className="text-green-600 text-xl mt-1" />
                                        <div className="flex-1">
                                            <p className="font-semibold text-green-900 mb-1">User Created Successfully!</p>
                                            <p className="text-sm text-green-700 mb-2">Default Password {copied && '(Copied to clipboard!)'}:</p>
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 bg-white p-2 rounded border border-green-300 font-mono text-sm break-all">
                                                    {generatedPassword}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={handleCopyPassword}
                                                    className="p-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                                                    title="Copy password"
                                                >
                                                    {copied ? <FaCheck /> : <FaCopy />}
                                                </button>
                                            </div>
                                            <p className="text-xs text-green-600 mt-2">
                                                {copied ? '✓ Password copied! ' : ''}Closing in 5 seconds...
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FaUserCircle className="inline mr-1" /> Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                        placeholder="Enter full name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FaEnvelope className="inline mr-1" /> Email *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                        placeholder="Enter email"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FaPhone className="inline mr-1" /> Phone *
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                        placeholder="Enter phone number"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FaTint className="inline mr-1" /> Blood Group
                                    </label>
                                    <select
                                        value={formData.bloodGroup}
                                        onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                    >
                                        <option value="">Select Blood Group</option>
                                        {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                                            <option key={bg} value={bg}>{bg}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FaMapMarkerAlt className="inline mr-1" /> City
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                        placeholder="Enter city"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FaCalendarAlt className="inline mr-1" /> Age
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.age}
                                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                        placeholder="Enter age"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FaVenusMars className="inline mr-1" /> Gender
                                    </label>
                                    <select
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FaUserShield className="inline mr-1" /> Role *
                                    </label>
                                    <select
                                        required
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                    >
                                        <option value="donor">Donor</option>
                                        <option value="patient">Patient</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl border border-green-200">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                        {formData.role === 'donor' && <FaHeartbeat className="text-green-600" />}
                                        {formData.role === 'patient' && <FaHospital className="text-blue-600" />}
                                        {formData.role === 'admin' && <FaUserShield className="text-purple-600" />}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Role Information</p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {formData.role === 'donor' && 'Donors can donate blood and respond to blood requests.'}
                                            {formData.role === 'patient' && 'Patients can create blood requests and find matching donors.'}
                                            {formData.role === 'admin' && 'Admins have full access to manage users, requests, and platform settings.'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-semibold transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 font-semibold transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <><FaSpinner className="animate-spin" /> Creating...</>
                                    ) : (
                                        <><FaUserPlus /> Create User</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}