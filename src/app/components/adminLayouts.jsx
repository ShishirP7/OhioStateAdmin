"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  Store,
  Pizza,
  Users,
  Shield,
  FolderKanban,
  FileText,
  UserCog,
  User,
  ChefHat,
} from "lucide-react";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import axios from "axios";

const roleConfig = {
  superadmin: {
    icon: <Shield className="w-4 h-4" />,
    color: "bg-purple-600",
    title: "Super Admin",
  },
  admin: {
    icon: <UserCog className="w-4 h-4" />,
    color: "bg-blue-600",
    title: "Administrator",
  },
  manager: {
    icon: <User className="w-4 h-4" />,
    color: "bg-green-600",
    title: "Manager",
  },
  cook: {
    icon: <ChefHat className="w-4 h-4" />,
    color: "bg-orange-600",
    title: "Kitchen Staff",
  },
};

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    window.location.href = "/login";
  };

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem("authToken");
      const savedRole = localStorage.getItem("userRole");

      if (savedRole) setUserRole(savedRole);
      if (!token) return router.push("/login");

      try {
        const { data } = await axios.get(
          "https://api.ohiostatepizzas.com/api/employees/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (data.role) {
          setUserRole(data.role);
          localStorage.setItem("userRole", data.role);
        }
      } catch (error) {
        router.push("/login");
      }
    };

    verifyAuth();
  }, [router]);

  const links = [
    {
      name: "Dashboard",
      href: "/",
      icon: <LayoutDashboard size={18} />,
      exact: true,
    },
    { name: "Stores", href: "/stores", icon: <Store size={18} /> },
    { name: "Menu", href: "/menus", icon: <Pizza size={18} /> },
    { name: "Combos", href: "/combos", icon: <FolderKanban size={18} /> },
    { name: "Orders", href: "/orders", icon: <FileText size={18} /> },
    { name: "Users", href: "/users", icon: <Users size={18} /> },
    { name: "Settings", href: "/settings", icon: <Shield size={18} /> },
  ];

  const currentPage =
    links.find((link) =>
      link.exact ? pathname === link.href : pathname.startsWith(link.href)
    )?.name || "Resto Admin";

  const roleInfo = roleConfig[userRole?.toLowerCase()] || {};

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Backdrop (for mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-20"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-[#1c1c1c] text-white transition-transform duration-200 ease-in-out z-30 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-20 bg-red-600 font-bold text-lg">
            🍕 Resto Admin
          </div>

          {userRole ? (
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <div
                  className={`${
                    roleConfig[userRole.toLowerCase()]?.color || "bg-gray-600"
                  } text-white rounded-full w-10 h-10 flex items-center justify-center`}
                >
                  {roleConfig[userRole.toLowerCase()]?.icon || (
                    <User className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    {roleConfig[userRole.toLowerCase()]?.title || userRole}
                  </p>
                  <p className="text-xs text-gray-400 capitalize">{userRole}</p>
                </div>
              </div>
            </div>
          ) : null}

          <nav className="flex-1 overflow-y-auto py-4 px-2">
            {links.map((link) => {
              const isActive = link.exact
                ? pathname === link.href
                : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-3 p-3 rounded transition-colors mb-1 ${
                    isActive ? "bg-red-600 text-white" : "hover:bg-gray-800"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="sticky top-0 bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleSidebar}
                className="text-gray-600 lg:hidden"
                aria-label="Toggle Sidebar"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <h1 className="font-bold text-xl text-gray-800">{currentPage}</h1>
            </div>

            <div className="flex items-center gap-4">
              <span className="hidden sm:inline text-sm text-gray-600">
                Role:{" "}
                <span className="font-medium capitalize">
                  {userRole || "Unknown"}
                </span>
              </span>
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>

        <Toaster position="top-right" />
      </div>
    </div>
  );
};

export default AdminLayout;
