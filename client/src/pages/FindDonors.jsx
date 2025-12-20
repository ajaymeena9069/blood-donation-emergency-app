import React, { useMemo, useState } from "react";
import {
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaUserCircle,
  FaSearch,
  FaTint,
  FaCheckCircle,
  FaTimesCircle,
  FaFilter
} from "react-icons/fa";
import { useGetAllDonorsQuery } from "../features/api/bloodApi";
import { useSelector } from "react-redux";
const BLOOD_GROUPS = ["All", "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const role = localStorage.getItem("role");
console.log(role);

export default function FindDonor() {
  const [search, setSearch] = useState("");
  const [bloodGroup, setBloodGroup] = useState("All");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const { data, isLoading } = useGetAllDonorsQuery();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Normalize API response
  const donors = useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.donors)) return data.donors;
    return [];
  }, [data]);

  // Filtering donors
  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    return donors.filter((d) => {
      const matchesSearch =
        d.name?.toLowerCase().includes(q) ||
        d.city?.toLowerCase().includes(q) ||
        d.bloodGroup?.toLowerCase().includes(q);

      const matchesBG = bloodGroup === "All" || d.bloodGroup === bloodGroup;
      const matchesAvail = !onlyAvailable || d.available === true;

      return matchesSearch && matchesBG && matchesAvail;
    });
  }, [donors, search, bloodGroup, onlyAvailable]);

  // Stats
  const totalDonors = donors.length;
  const availableDonors = donors.filter(d => d.available).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Find Blood Donors</h1>
        <p className="text-gray-600">
          Connect with donors in your area. Currently showing {filtered.length} donor{filtered.length !== 1 ? 's' : ''}.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Total Donors</p>
          <p className="text-2xl font-bold text-gray-800">{totalDonors}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Available Now</p>
          <p className="text-2xl font-bold text-green-600">{availableDonors}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Showing</p>
          <p className="text-2xl font-bold text-red-600">{filtered.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Blood Groups</p>
          <p className="text-2xl font-bold text-blue-600">{BLOOD_GROUPS.length - 1}</p>
        </div>
      </div>

      {/* Filters Card */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border">
        <div className="flex items-center gap-2 mb-4">
          <FaFilter className="text-red-600" />
          <h2 className="text-lg font-semibold text-gray-800">Filter Donors</h2>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <FaSearch />
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, city, or blood group..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition"
          />
        </div>

        {/* Filter Options */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Blood Group Select */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blood Group
            </label>
            <div className="relative">
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl appearance-none focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition"
              >
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg === "All" ? "All Blood Groups" : bg}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <FaTint className="text-red-600" />
              </div>
            </div>
          </div>

          {/* Availability Checkbox */}
          <div className="flex items-center">
            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="w-5 h-5 text-red-600 rounded"
              />
              <div>
                <span className="font-medium text-gray-700">Available Only</span>
                <p className="text-sm text-gray-500">Show donors who can donate now</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Results */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Donors ({filtered.length})
          </h2>
          {search && (
            <p className="text-sm text-gray-600">
              Searching for: "{search}"
            </p>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-600 mb-4"></div>
            <p className="text-gray-600">Loading donors...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm border">
            <div className="text-gray-400 mb-4">
              <FaUserCircle className="text-6xl mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Donors Found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {search || bloodGroup !== "All" || onlyAvailable
                ? "Try adjusting your filters or search term"
                : "No donors are registered in the system yet"}
            </p>
          </div>
        )}

        {/* Donor Cards */}
        <div className="space-y-4">
          {!isLoading && filtered.map((donor) => (
            <div
              key={donor._id}
              className="bg-white rounded-2xl shadow-md overflow-hidden border hover:shadow-lg transition-shadow"
            >
              <div className="p-5">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                      <FaUserCircle className="text-4xl text-red-600" />
                    </div>
                  </div>

                  {/* Donor Info */}
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{donor.name}</h3>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <span className="px-3 py-1 bg-red-100 text-red-700 font-bold rounded-full flex items-center gap-2">
                            <FaTint className="text-sm" />
                            {donor.bloodGroup}
                          </span>
                          
                          <span className="flex items-center gap-1 text-gray-600">
                            <FaMapMarkerAlt className="text-sm" />
                            {donor.city}
                          </span>
                          
                          <span className="text-gray-600">
                            {donor.age} years
                          </span>
                        </div>
                      </div>

                      {/* Availability Badge */}
                      <div className="flex flex-col items-start md:items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 ${
                          donor.available
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {donor.available ? (
                            <>
                              <FaCheckCircle className="text-green-600" />
                              Available
                            </>
                          ) : (
                            <>
                              <FaTimesCircle />
                              Not Available
                            </>
                          )}
                        </span>
                        <p className="text-xs text-gray-500">
                          {donor.lastDonation 
                            ? `Last donated: ${new Date(donor.lastDonation).toLocaleDateString()}`
                            : "No donation history"
                          }
                        </p>
                      </div>
                    </div>

                    {/* Contact Section */}
                    <div className="mt-4 pt-4 border-t">
                      {!isAuthenticated ? (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <p className="text-yellow-700 text-sm font-medium">
                            ⚠️ Please login as a patient to contact donors
                          </p>
                          <p className="text-yellow-600 text-xs mt-1">
                            This protects donor privacy and ensures secure communication
                          </p>
                        </div>
                      ) : role !== "patient" ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-red-700 text-sm font-medium">
                            ❗ Only patients can contact donors
                          </p>
                          <p className="text-red-600 text-xs mt-1">
                            Please switch to a patient account to contact donors
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-3">
                          <a
                            href={`tel:${donor.phone}`}
                            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition flex items-center gap-2 font-medium"
                          >
                            <FaPhoneAlt />
                            Call Now
                          </a>
                          
                          <a
                            href={`https://wa.me/${donor.phone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 font-medium"
                          >
                            <FaWhatsapp />
                            WhatsApp
                          </a>
                          
                          <p className="text-xs text-gray-500 mt-2 md:mt-0">
                            Contact donor directly for blood donation requests
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        {filtered.length > 0 && (
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-sm text-blue-700">
              💡 <strong>Note:</strong> Always verify donor availability before contacting. 
              Donors may not be available due to recent donations or personal reasons.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}