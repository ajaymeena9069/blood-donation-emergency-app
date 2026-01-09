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
  FaFilter,
  FaUserInjured,
  FaLock,
  FaUserShield,
  FaInfoCircle
} from "react-icons/fa";
import { useGetAllDonorsQuery } from "../features/api/bloodApi";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

const BLOOD_GROUPS = ["All", "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const CITIES = ["All"]; // You can populate this from your data

export default function FindDonor() {
  const [search, setSearch] = useState("");
  const [bloodGroup, setBloodGroup] = useState("All");
  const [city, setCity] = useState("All");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const { data, isLoading } = useGetAllDonorsQuery();
  const { user, token } = useSelector((state) => state.auth);
  const isAuthenticated = !!token;
  const userRoles = user?.role || [];
  const isPatient = userRoles.includes("patient");
  const isAdmin = userRoles.includes("admin");

  // Normalize donors data
  const donors = useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.donors)) return data.donors;
    return [];
  }, [data]);

  // Extract unique cities for filter
  const uniqueCities = useMemo(() => {
    const citiesSet = new Set(["All"]);
    donors.forEach(donor => {
      if (donor.city) citiesSet.add(donor.city);
    });
    return Array.from(citiesSet);
  }, [donors]);

  // Filter donors
  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    return donors.filter((d) => {
      const matchesSearch =
        d.name?.toLowerCase().includes(q) ||
        d.city?.toLowerCase().includes(q) ||
        d.bloodGroup?.toLowerCase().includes(q);

      const matchesBG = bloodGroup === "All" || d.bloodGroup === bloodGroup;
      const matchesCity = city === "All" || d.city === city;
      const matchesAvail = !onlyAvailable || d.available === true;

      return matchesSearch && matchesBG && matchesCity && matchesAvail;
    });
  }, [donors, search, bloodGroup, city, onlyAvailable]);

  // Stats
  const totalDonors = donors.length;
  const availableDonors = donors.filter(d => d.available).length;
  const totalCities = uniqueCities.length - 1;

  // Who can view contact info
  const canViewContactInfo = isAuthenticated && (isPatient || isAdmin);
  const canViewLimitedInfo = isAuthenticated && !isPatient && !isAdmin;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header with Role Info */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Blood Donors</h1>
            <p className="text-gray-600">
              Connect with {filtered.length} verified donor{filtered.length !== 1 ? 's' : ''} in our network
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {!isAuthenticated && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                <p className="text-red-700 text-sm font-medium">
                  <FaLock className="inline mr-1" />
                  Login required to view donor details
                </p>
              </div>
            )}
            {isAuthenticated && !canViewContactInfo && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
                <p className="text-yellow-700 text-sm font-medium">
                  <FaUserShield className="inline mr-1" />
                  Patient access needed for contact info
                </p>
              </div>
            )}
            {isPatient && (
              <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                <p className="text-green-700 text-sm font-medium">
                  <FaUserInjured className="inline mr-1" />
                  Patient access enabled
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Total Donors</p>
          <p className="text-2xl font-bold text-gray-900">{totalDonors}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Available Now</p>
          <p className="text-2xl font-bold text-green-600">{availableDonors}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Cities</p>
          <p className="text-2xl font-bold text-blue-600">{totalCities}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Showing</p>
          <p className="text-2xl font-bold text-red-600">{filtered.length}</p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-gray-100 rounded-lg">
            <FaFilter className="text-gray-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Filter Donors</h2>
            <p className="text-sm text-gray-500">Refine your search to find the right donor</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <FaSearch />
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search donors by name, city, or blood group..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition"
            />
          </div>

          {/* Filter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Blood Group Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blood Group
              </label>
              <div className="relative">
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg appearance-none focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition"
                >
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg === "All" ? "All Blood Groups" : bg}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <FaTint className="text-red-500" />
                </div>
              </div>
            </div>

            {/* City Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <div className="relative">
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg appearance-none focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition"
                >
                  {uniqueCities.map((city) => (
                    <option key={city} value={city}>
                      {city === "All" ? "All Cities" : city}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <FaMapMarkerAlt className="text-blue-500" />
                </div>
              </div>
            </div>

            {/* Availability Filter */}
            <div className="flex items-center">
              <label className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition w-full">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                  className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                />
                <div>
                  <span className="font-medium text-gray-900">Available Only</span>
                  <p className="text-sm text-gray-500">Show active donors</p>
                </div>
              </label>
            </div>
          </div>

          {/* Active Filters */}
          {(bloodGroup !== "All" || city !== "All" || onlyAvailable || search) && (
            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm font-medium text-gray-700 mb-2">Active Filters:</p>
              <div className="flex flex-wrap gap-2">
                {bloodGroup !== "All" && (
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm flex items-center gap-1">
                    <FaTint className="text-xs" />
                    {bloodGroup}
                    <button
                      onClick={() => setBloodGroup("All")}
                      className="ml-1 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </span>
                )}
                {city !== "All" && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1">
                    <FaMapMarkerAlt className="text-xs" />
                    {city}
                    <button
                      onClick={() => setCity("All")}
                      className="ml-1 text-blue-500 hover:text-blue-700"
                    >
                      ×
                    </button>
                  </span>
                )}
                {onlyAvailable && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1">
                    <FaCheckCircle className="text-xs" />
                    Available Only
                    <button
                      onClick={() => setOnlyAvailable(false)}
                      className="ml-1 text-green-500 hover:text-green-700"
                    >
                      ×
                    </button>
                  </span>
                )}
                {search && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-1">
                    <FaSearch className="text-xs" />
                    "{search}"
                    <button
                      onClick={() => setSearch("")}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </span>
                )}
                <button
                  onClick={() => {
                    setBloodGroup("All");
                    setCity("All");
                    setOnlyAvailable(false);
                    setSearch("");
                  }}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Donor Results
            <span className="text-gray-600 font-normal ml-2">({filtered.length})</span>
          </h2>
          {filtered.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              Sorted by availability and location
            </p>
          )}
        </div>

        {filtered.length > 0 && (
          <div className="text-sm text-gray-600">
            <FaInfoCircle className="inline mr-1" />
            {!isAuthenticated
              ? "Login to see donor details"
              : !canViewContactInfo
                ? "Switch to patient role for contact info"
                : "You can contact these donors directly"
            }
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12 bg-white rounded-xl border">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-600 mb-4"></div>
          <p className="text-gray-600">Loading donor database...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border shadow-sm">
          <div className="text-gray-300 mb-4">
            <FaUserCircle className="text-5xl mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No Donors Found
          </h3>
          <p className="text-gray-600 max-w-md mx-auto mb-4">
            {search || bloodGroup !== "All" || city !== "All" || onlyAvailable
              ? "Try adjusting your filters or search criteria"
              : "No donors are currently registered in the system"
            }
          </p>
          {(search || bloodGroup !== "All" || city !== "All" || onlyAvailable) && (
            <button
              onClick={() => {
                setBloodGroup("All");
                setCity("All");
                setOnlyAvailable(false);
                setSearch("");
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              Reset All Filters
            </button>
          )}
        </div>
      )}

      {/* Donor Grid */}
      {!isLoading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((donor) => (
            <div
              key={donor._id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                {/* Donor Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <FaUserCircle className="text-2xl text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{donor.name}</h3>
                      <p className="text-sm text-gray-500">{donor.age} years • {donor.gender}</p>
                    </div>
                  </div>

                  {/* Availability Badge */}
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${donor.available
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600"
                    }`}>
                    {donor.available ? "Available" : "Not Available"}
                  </div>
                </div>

                {/* Donor Details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaTint className="text-red-500" />
                      <span className="font-medium">Blood Group</span>
                    </div>
                    <span className="font-bold text-red-600">{donor.bloodGroup}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-blue-500" />
                      <span className="font-medium">Location</span>
                    </div>
                    <span className="text-gray-700">{donor.city}</span>
                  </div>

                  {/* Last Donation */}
                  {donor.lastDonation && (
                    <div className="text-sm text-gray-500 pt-2 border-t">
                      Last donated: {new Date(donor.lastDonation).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                  )}
                </div>

                {/* Contact Section */}
                <div className="mt-6 pt-5 border-t border-gray-100">
                  {!isAuthenticated ? (
                    <div className="text-center">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-yellow-700 font-medium">
                          <FaLock className="inline mr-1" />
                          Login Required
                        </p>
                        <p className="text-sm text-yellow-600 mt-1">
                          Sign in to view donor contact information
                        </p>
                        <NavLink
                          to="/login"
                          className="inline-block mt-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition text-sm font-medium"
                        >
                          Login Now
                        </NavLink>
                      </div>
                    </div>
                  ) : !canViewContactInfo ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-blue-700 font-medium">
                        <FaUserShield className="inline mr-1" />
                        Patient Access Required
                      </p>
                      <p className="text-sm text-blue-600 mt-1">
                        Only patients can contact donors for blood requests
                      </p>
                      <div className="flex gap-2 mt-2">
                        {isAdmin && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Admin View
                          </span>
                        )}
                        {canViewLimitedInfo && (
                          <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                            Limited Access
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-3">
                        Contact this donor:
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <a
                          href={`tel:${donor.phone}`}
                          className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-black transition flex items-center justify-center gap-2 font-medium"
                        >
                          <FaPhoneAlt />
                          Call
                        </a>
                        <a
                          href={`https://wa.me/${donor.phone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 font-medium"
                        >
                          <FaWhatsapp />
                          WhatsApp
                        </a>
                      </div>
                      <p className="text-xs text-gray-500 mt-3 text-center">
                        Please be respectful of donor's time and availability
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Footer */}
      {filtered.length > 0 && (
        <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-xl">
          <div className="flex items-start gap-3">
            <FaInfoCircle className="text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm text-gray-700">
                <strong>Important:</strong> Always verify donor availability before contacting.
                Donors may not be available due to recent donations (minimum 90-day gap required),
                health reasons, or personal commitments.
              </p>
              {isAuthenticated && !canViewContactInfo && (
                <p className="text-sm text-blue-600 mt-2">
                  💡 <strong>Tip:</strong> Switch to your patient role to access donor contact information.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}