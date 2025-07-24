import React, { useState, useContext } from "react";
import { Outlet, NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../App";
const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout } = useContext(AuthContext);

  // Navigation items
  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Employees", href: "/employees", icon: "Users" },
    { name: "Departments", href: "/departments", icon: "Building2" },
  ];

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  // Desktop Sidebar Component
const DesktopSidebar = () => (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0">
      <div className="glass-sidebar flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-primary-600">
              <ApperIcon name="Users" className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-primary-700 bg-clip-text text-transparent">
              HR Manager
            </h1>
          </div>
        </div>
        <nav className="mt-8 flex-1 px-4 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-cyan-50 to-primary-50 text-primary-700 border-l-4 border-primary-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <ApperIcon
                    name={item.icon}
                    className={cn(
                      "mr-3 h-5 w-5 transition-colors",
                      isActive ? "text-primary-600" : "text-gray-400 group-hover:text-gray-600"
                    )}
                  />
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        
        {/* Logout Button */}
        <div className="px-4 pb-4">
          <button
            onClick={logout}
            className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-all duration-200"
          >
            <ApperIcon name="LogOut" className="mr-3 h-5 w-5 text-gray-400" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );

  // Mobile Sidebar Component
const MobileSidebar = () => (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-40 bg-gray-600 bg-opacity-75"
            onClick={closeMobileMenu}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl"
          >
            <div className="flex flex-col h-full pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center justify-between flex-shrink-0 px-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-primary-600">
                    <ApperIcon name="Users" className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-primary-700 bg-clip-text text-transparent">
                    HR Manager
                  </h1>
                </div>
                <button
                  onClick={closeMobileMenu}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                >
                  <ApperIcon name="X" className="h-5 w-5" />
                </button>
              </div>
              <nav className="mt-8 flex-1 px-4 space-y-2">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      cn(
                        "group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                        isActive
                          ? "bg-gradient-to-r from-cyan-50 to-primary-50 text-primary-700 border-l-4 border-primary-600"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <ApperIcon
                          name={item.icon}
                          className={cn(
                            "mr-3 h-5 w-5 transition-colors",
                            isActive ? "text-primary-600" : "text-gray-400 group-hover:text-gray-600"
                          )}
                        />
                        {item.name}
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>
              
              {/* Mobile Logout Button */}
              <div className="px-4 pb-4">
                <button
                  onClick={() => {
                    logout();
                    closeMobileMenu();
                  }}
                  className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-all duration-200"
                >
                  <ApperIcon name="LogOut" className="mr-3 h-5 w-5 text-gray-400" />
                  Logout
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <div className="h-screen flex bg-gray-50">
      <DesktopSidebar />
      <MobileSidebar />
      
      <div className="flex flex-col flex-1 lg:pl-64">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <ApperIcon name="Menu" className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-primary-600">
              <ApperIcon name="Users" className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-600 to-primary-700 bg-clip-text text-transparent">
              HR Manager
            </h1>
          </div>
          <div className="w-10" /> {/* Spacer for balance */}
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;