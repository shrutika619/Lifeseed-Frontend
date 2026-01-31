"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAllCities } from "@/app/services/clinic.service";

// ✅ Import API Engine for Logout Call
import api from "@/lib/axios"; 

// Icons
import { User, LogOut, ChevronDown } from "lucide-react";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { 
  selectUser, 
  selectIsAuthenticated, 
  logoutSuccess,
  fetchProfileDetails 
} from "@/redux/slices/authSlice";

const Navbar = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  console.log(user);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const conditionsDropdownRef = useRef(null);
  const clinicDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  const [clinicLinks, setClinicLinks] = useState({});

  const toggleDropdown = (menu) =>
    setOpenDropdown(openDropdown === menu ? null : menu);

  const closeDropdown = () => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  };

  /* ============================================================
      ✅ PROFILE FETCHING LOGIC
     ============================================================ */
  useEffect(() => {
    // Only fetch if authenticated AND we don't have profile details yet
    if (isAuthenticated && !user?.fullName) {
      dispatch(fetchProfileDetails());
    }
  }, [dispatch, isAuthenticated, user?.fullName]); 

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !conditionsDropdownRef.current?.contains(event.target) &&
        !clinicDropdownRef.current?.contains(event.target) &&
        !profileDropdownRef.current?.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const conditionLinks = {
    "Sexual Dysfunction": "sexual-dysfunction",
    "Erectile Dysfunction": "erectile-dysfunction",
    "Premature Ejaculation": "premature-ejaculation",
    "Delayed Ejaculation": "delayed-ejaculation",
    "Couple Sex Problems": "couple-sex-problems",
    "Low Sperm Count": "low-sperm-count",
  };

  // Fetch Cities
  useEffect(() => {
    const fetchCityData = async () => {
      try {
        const response = await getAllCities();
        // Handle various response structures safely
        const data = response?.data || response; 
        
        if (Array.isArray(data)) {
          const formattedLinks = data.reduce((acc, city) => {
            // Ensure city.name exists
            if (city?.name) {
                acc[city.name] = city.name.toLowerCase();
            }
            return acc;
          }, {});
          setClinicLinks(formattedLinks);
        }
      } catch (error) {
        console.error("Failed to fetch cities", error);
      }
    };
    fetchCityData();
  }, []);

  // ✅ LOGOUT HANDLER (UPDATED)
  const handleLogout = async () => {
    try {
      // 1. Call Backend to delete HTTP-Only Cookie
      await api.post('/auth/logout');
    } catch (error) {
      console.error("Logout API call failed", error);
    } finally {
      // 2. Clear Redux State (Client Side)
      dispatch(logoutSuccess());
      closeDropdown();
      
      // 3. Redirect
      router.push("/");
      router.refresh();
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" onClick={closeDropdown}>
          <img
            src="/Images/MEN10.svg"
            alt="MEN10 Logo"
            className="h-[50px] w-[122px]"
          />
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 font-medium text-gray-700">
          <li>
            <Link href="/" onClick={closeDropdown} className="hover:text-blue-600">
              Home
            </Link>
          </li>

          <li>
            <Link
              href="/about"
              onClick={closeDropdown}
              className="hover:text-blue-600"
            >
              About Us
            </Link>
          </li>

          {/* Conditions */}
          <li ref={conditionsDropdownRef} className="relative">
            <button
              onClick={() => toggleDropdown("conditions")}
              className="hover:text-blue-600"
            >
              Conditions We Treat ▾
            </button>
            {openDropdown === "conditions" && (
              <ul className="absolute left-0 mt-2 w-64 bg-[#F3F6FF] rounded-lg shadow-lg py-2">
                {Object.entries(conditionLinks).map(([label, path]) => (
                  <li key={path}>
                    <Link
                      href={`/conditionswetreat/${path}`}
                      onClick={closeDropdown}
                      className="block px-4 py-2 hover:text-blue-600"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* Clinic */}
          <li ref={clinicDropdownRef} className="relative">
            <button
              onClick={() => toggleDropdown("clinic")}
              className="hover:text-blue-600"
            >
              Clinic ▾
            </button>
            {openDropdown === "clinic" && (
              <ul className="absolute left-0 mt-2 w-64 bg-[#F3F6FF] rounded-lg shadow-lg py-2">
                {Object.entries(clinicLinks).map(([label, path]) => (
                  <li key={path}>
                    <Link
                      href={`/clinic/${path}`}
                      onClick={closeDropdown}
                      className="block px-4 py-2 hover:text-blue-600"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>

        {/* Right Section Desktop */}
        <div className="hidden md:flex items-center gap-4">
          
          {isAuthenticated ? (
            <div ref={profileDropdownRef} className="relative">
              {/* Profile Trigger Button */}
              <button
                onClick={() => toggleDropdown("profile")}
                className="flex items-center gap-2 hover:bg-gray-50 p-1 pr-2 rounded-full transition-colors border border-transparent hover:border-gray-100"
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border border-blue-50 flex-shrink-0">
                   {user?.profileImageUrl ? (
                      <img 
                        src={user.profileImageUrl} 
                        alt="User" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <User size={20} className="text-blue-600" />
                    )}
                </div>

                {/* Name Display */}
                <div className="flex flex-col items-start">
                   <span className="text-sm font-semibold text-gray-700 max-w-[100px] truncate leading-tight">
                     {user?.fullName || "User"}
                   </span>
                </div>
                
                <ChevronDown size={14} className="text-gray-400" />
              </button>

              {/* Dropdown Menu */}
              {openDropdown === "profile" && (
                <ul className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
                  <li className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800 truncate">{user?.fullName || "User"}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.mobileNo || user?.email}</p>
                  </li>
                  <li>
                    <Link
                      href="/profile"
                      onClick={closeDropdown}
                      className="block px-4 py-2 hover:bg-gray-50 text-sm text-gray-700"
                    >
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-50 flex items-center gap-2 text-sm"
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <Link href="/login" onClick={closeDropdown} className="hover:text-blue-600 font-medium">
              Login
            </Link>
          )}

          <Link
            href="/free-consultation"
            onClick={closeDropdown}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Now
          </Link>
        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-100">
          <ul className="flex flex-col gap-3 px-6 py-4 font-medium">
            <Link href="/" onClick={closeDropdown} className="py-1">Home</Link>
            <Link href="/about" onClick={closeDropdown} className="py-1">About Us</Link>

            {isAuthenticated ? (
              <>
                 <Link href="/profile" onClick={closeDropdown} className="flex items-center gap-2 py-1">
                    <User size={18} /> My Profile ({user?.fullName || "User"})
                 </Link>
                 <button onClick={handleLogout} className="text-red-600 text-left py-1 flex items-center gap-2">
                    <LogOut size={18} /> Logout
                 </button>
              </>
            ) : (
              <Link href="/login" onClick={closeDropdown} className="py-1 text-blue-600">Login</Link>
            )}

            <Link
              href="/free-consultation"
              onClick={closeDropdown}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center mt-2"
            >
              Start Now
            </Link>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;