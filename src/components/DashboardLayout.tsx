'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { ReactNode } from 'react';

interface SidebarItem {
  label: string;
  icon: ReactNode;
  active: boolean;
  onClick: () => void;
}

interface DashboardLayoutProps {
  children: ReactNode;
  sidebarItems: SidebarItem[];
  onLogout: () => void;
  doctorName?: string;
}

export function DashboardLayout({
  children,
  sidebarItems,
  onLogout,
  doctorName,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-white rounded-lg shadow-lg text-gray-700"
        >
          {sidebarOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
        </motion.button>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        <motion.aside
          initial={{ x: -288 }}
          animate={{ x: sidebarOpen ? 0 : -288 }}
          transition={{ duration: 0.3 }}
          className="w-72 bg-gray-900 text-white lg:translate-x-0 fixed lg:relative h-full z-40 lg:z-0"
        >
          <div className="flex flex-col h-full">
            {/* Logo/Header */}
            <div className="p-6 border-b border-gray-800">
              <h1 className="text-2xl font-bold">MedBooking</h1>
              {doctorName && <p className="text-sm text-gray-400 mt-2">Dr. {doctorName}</p>}
            </div>

            {/* Nav Items */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
              {sidebarItems.map((item, index) => (
                <motion.button
                  key={index}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={item.onClick}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    item.active
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <div className="text-xl">{item.icon}</div>
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              ))}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-800">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition font-medium"
              >
                <FiLogOut className="w-5 h-5" />
                Logout
              </motion.button>
            </div>
          </div>
        </motion.aside>
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 overflow-auto lg:ml-0">
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="p-4 sm:p-6 md:p-8"
        >
          {children}
        </motion.main>
      </div>

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}
    </div>
  );
}
