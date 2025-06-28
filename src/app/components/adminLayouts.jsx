"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Link from "next/link";

import { Toaster } from "react-hot-toast";
import axios from "axios";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [startupCheck, setStartUpCheck] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    // Remove all auth-related items from localStorage
    localStorage.removeItem("authToken");

    // If using cookies, remove them (install js-cookie first)
    // Cookies.remove('auth_token');
    window.location.href = "/login";
  };
  useEffect(() => {
    axios
      .get(`https://66.94.97.165:4001/api/startup-check`)
      .then((res) => {
        setStartUpCheck(true);
      })
      .catch((err) => {
        setStartUpCheck(false);
      });
  }, []);

  const links = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Stores", href: "/stores" },
    { name: "Menu", href: "/menus" },
    { name: "Combos", href: "/combos" },
    { name: "Orders", href: "/orders" },
    { name: "Users", href: "/users" },
    { name: "Settings", href: "/settings" },
  ];

  // Determine the current page name based on pathname
  const currentPage =
    links.find((link) => pathname.startsWith(link.href))?.name ||
    "Admin Dashboard";

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
            <Link
              key={idx}
              href={link.href}
              className={`p-2 rounded transition-colors ${
                pathname.startsWith(link.href)
                  ? "bg-red-600 text-white"
                  : "hover:bg-red-500"
              }`}
            >
              {link.name}
            </Link>
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
              {sidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            <h1 className="font-bold text-xl text-gray-800">{currentPage}</h1>
          </div>
          <button
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
            onClick={() => {
              handleLogout();
            }}
          >
            Logout
          </button>
        </header>

        {/* Main Content */}
        {startupCheck ? (
          <>
            <main className="flex-1 overflow-y-auto p-6">{children}</main>
            <Toaster />
          </>
        ) : (
          "Loading"
        )}
      </div>
    </div>
  );
};

export default AdminLayout;
