"use client";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const links = [
    { name: "Dashboard", href: "#" },
    { name: "Stores", href: "#" },
    { name: "Menu", href: "#" },
    { name: "Combos", href: "#" },
    { name: "Orders", href: "#" },
    { name: "Users", href: "#" },
    { name: "Settings", href: "#" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-[#1c1c1c] text-white transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-center h-16 bg-red-600 font-bold text-lg">
          🍕 Resto Admin
        </div>
        <nav className="flex flex-col mt-4 space-y-2 px-4">
          {links.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              className="p-2 rounded hover:bg-red-500 transition-colors"
            >
              {link.name}
            </a>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="flex items-center justify-between bg-white shadow px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="text-gray-600 lg:hidden"
              aria-label="Toggle Sidebar"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <h1 className="font-bold text-xl text-gray-800">Admin Dashboard</h1>
          </div>
          <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition">
            Logout
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
