"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { useDispatch } from "react-redux"; 
import { logoutSuccess } from "@/redux/slices/authSlice"; 
import { toast } from "sonner"; 
import { Bell, Menu, User, LogOut, ChevronDown } from "lucide-react";

// ✅ Import the centralized Logout Service
import { logoutUser } from "@/app/services/auth.service"; 

const AdminHeaderPage = ({ 
  role = "Admin", 
  title = "Dashboard", 
  userName = "User",
  userPhone = "9999999999",
  notificationCount = 10,
  onMenuToggle,
  onLogout,
  onProfileClick,
  onNotificationClick
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const router = useRouter();
  const dispatch = useDispatch();

  const handleMenuClick = () => {
    if (onMenuToggle) {
      onMenuToggle();
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // ✅ UPDATED LOGOUT LOGIC (Using Service)
  const handleLogout = async () => {
    setIsDropdownOpen(false); 

    try {
      // 1. Call the service to clear HttpOnly cookies and notify backend
      const result = await logoutUser();
      
      if (result.success) {
        toast.success("Logged out successfully");
      } else {
        console.warn("Server logout returned false, forcing local logout");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast.info("Logging out locally..."); 
    } finally {
      // 2. Clear Redux Store
      dispatch(logoutSuccess());

      // 3. Trigger parent callback
      if (onLogout) {
        onLogout();
      }

      // 4. Redirect to Admin Login
      router.push("/admin/login");
    }
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    if (onProfileClick) {
      onProfileClick();
    }
  };

  const handleNotificationClick = () => {
    if (onNotificationClick) {
      onNotificationClick();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="flex justify-between items-center px-4 sm:px-6 py-3">
        {/* Left: Hamburger Menu (Mobile) + Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors active:bg-gray-200"
            aria-label="Toggle menu"
            type="button"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>

          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">{title}</h1>
        </div>

        {/* Right: Notification & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notification Icon */}
          <button 
            onClick={handleNotificationClick}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
            {notificationCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
                {notificationCount > 99 ? '99+' : notificationCount}
              </span>
            )}
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={toggleDropdown}
              className="flex items-center gap-2 hover:bg-gray-50 rounded-lg transition-colors p-1"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm sm:text-base">
                {userName.charAt(0).toUpperCase()}
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform hidden sm:block ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 animate-dropdown">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-800">{userName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{userPhone}</p>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <button
                    onClick={handleProfileClick}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User className="w-4 h-4 text-gray-500" />
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes dropdown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-dropdown {
          animation: dropdown 0.2s ease-out;
        }
      `}</style>
    </header>
  );
};

export default AdminHeaderPage;