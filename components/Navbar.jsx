"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAllCities } from "@/app/services/clinic.service";
import { toast } from "sonner"; // ✅ Imported toast
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
import axios from "axios";

const Navbar = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const conditionsDropdownRef = useRef(null);
  const clinicDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  const [clinicLinks, setClinicLinks] = useState({});

  const toggleDropdown = (menu) =>
    setOpenDropdown(openDropdown === menu ? null : menu);

  const toggleMobileDropdown = (menu) =>
    setMobileDropdown(mobileDropdown === menu ? null : menu);

  const closeDropdown = () => {
    setOpenDropdown(null);
    setMobileDropdown(null);
    setMobileMenuOpen(false);
  };

  // ✅ UPDATED: Catch 404 Error and show toast ONLY once per session
  useEffect(() => {
    const checkProfile = async () => {
      if (isAuthenticated && !user?.fullName) {
        // Dispatch the thunk and wait for the result
        const resultAction = await dispatch(fetchProfileDetails());
        
        // If the action has an error (like a 404 from your API)
        if (resultAction.error || resultAction.payload?.error) {
          // Check session storage so we don't spam the user on every page load
          const hasShownToast = sessionStorage.getItem("missing_profile_toast");
          
          if (!hasShownToast) {
            toast.warning("Please complete your profile setup to continue.", {
               duration: 6000, // Show it a bit longer so they can read it
            });
            // Mark as shown for this session
            sessionStorage.setItem("missing_profile_toast", "true");
          }
        }
      }
    };

    checkProfile();
  }, [dispatch, isAuthenticated, user?.fullName]); 

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

  useEffect(() => {
    const fetchCityData = async () => {
      try {
        const response = await getAllCities();
        const data = response?.data || response; 
        
        if (Array.isArray(data)) {
          const formattedLinks = data.reduce((acc, city) => {
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

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (error) {
      console.error("Logout API call failed", error);
    } finally {
      dispatch(logoutSuccess());
      // ✅ Clear the session storage flag on logout so it triggers again if they log back in
      sessionStorage.removeItem("missing_profile_toast");
      closeDropdown();
      router.push("/");
      router.refresh();
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        
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

          <li>
            <Link
              href="/contact"
              onClick={closeDropdown}
              className="hover:text-blue-600"
            >
              Contact Us
            </Link>
          </li>
        </ul>

        {/* Right Section Desktop */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div ref={profileDropdownRef} className="relative">
              <button
                onClick={() => toggleDropdown("profile")}
                className="flex items-center gap-2 hover:bg-gray-50 p-1 pr-2 rounded-full transition-colors border border-transparent hover:border-gray-100"
              >
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

                <div className="flex flex-col items-start">
                   <span className="text-sm font-semibold text-gray-700 max-w-[100px] truncate leading-tight">
                     {user?.fullName || "User"}
                   </span>
                </div>
                
                <ChevronDown size={14} className="text-gray-400" />
              </button>

              {openDropdown === "profile" && (
                <ul className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-100">
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
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-100">
          <ul className="flex flex-col gap-1 px-6 py-4 font-medium">
            <li>
              <Link href="/" onClick={closeDropdown} className="block py-2">
                Home
              </Link>
            </li>
            
            <li>
              <Link href="/about" onClick={closeDropdown} className="block py-2">
                About Us
              </Link>
            </li>

            {/* Mobile: Conditions We Treat Dropdown */}
            <li>
              <button
                onClick={() => toggleMobileDropdown("conditions")}
                className="w-full flex items-center justify-between py-2 text-left text-gray-700"
              >
                <span>Conditions We Treat</span>
                <ChevronDown
                  size={16}
                  className={`text-gray-400 transition-transform duration-200 ${
                    mobileDropdown === "conditions" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {mobileDropdown === "conditions" && (
                <ul className="ml-3 mt-1 mb-2 bg-[#F3F6FF] rounded-lg py-1">
                  {Object.entries(conditionLinks).map(([label, path]) => (
                    <li key={path}>
                      <Link
                        href={`/conditionswetreat/${path}`}
                        onClick={closeDropdown}
                        className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* Mobile: Clinic Dropdown */}
            <li>
              <button
                onClick={() => toggleMobileDropdown("clinic")}
                className="w-full flex items-center justify-between py-2 text-left text-gray-700"
              >
                <span>Clinic</span>
                <ChevronDown
                  size={16}
                  className={`text-gray-400 transition-transform duration-200 ${
                    mobileDropdown === "clinic" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {mobileDropdown === "clinic" && (
                <ul className="ml-3 mt-1 mb-2 bg-[#F3F6FF] rounded-lg py-1">
                  {Object.entries(clinicLinks).map(([label, path]) => (
                    <li key={path}>
                      <Link
                        href={`/clinic/${path}`}
                        onClick={closeDropdown}
                        className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            <li>
              <Link href="/contact" onClick={closeDropdown} className="block py-2">
                Contact Us
              </Link>
            </li>

            {/* Mobile: Auth Section */}
            {isAuthenticated ? (
              <>
                <li className="border-t border-gray-100 mt-2 pt-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border border-blue-50 flex-shrink-0">
                      {user?.profileImageUrl ? (
                        <img
                          src={user.profileImageUrl}
                          alt="User"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User size={18} className="text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 truncate max-w-[180px]">
                        {user?.fullName || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate max-w-[180px]">
                        {user?.mobileNo || user?.email}
                      </p>
                    </div>
                  </div>
                </li>
                <li>
                  <Link
                    href="/profile"
                    onClick={closeDropdown}
                    className="block py-2 text-gray-700"
                  >
                    My Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 py-2 text-red-600 w-full text-left"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="border-t border-gray-100 mt-2 pt-3">
                <Link
                  href="/login"
                  onClick={closeDropdown}
                  className="block py-2 text-blue-600 font-medium"
                >
                  Login
                </Link>
              </li>
            )}

            <li>
              <Link
                href="/free-consultation"
                onClick={closeDropdown}
                className="block bg-blue-600 text-white px-4 py-2 rounded-lg text-center mt-2"
              >
                Start Now
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;