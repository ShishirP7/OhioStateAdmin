"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Lottie from "lottie-react";
import LoadingAnimation from "../../Assets/Loading.json";
import axios from "axios";

const rolePermissions = {
  admin: {
    dashboard: true,
    stores: true,
    menus: true,
    combos: true,
    orders: true,
    users: true,
    settings: true,
  },
  manager: {
    dashboard: true,
    stores: false,
    menus: true,
    combos: true,
    orders: true,
    users: false,
    settings: false,
  },
};

export default function RouteGuard({ children, requiredPermissions }) {
  const pathname = usePathname();
  const [authStatus, setAuthStatus] = useState("checking");
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setAuthStatus("unauthenticated");
        return;
      }

      try {
        const response = await axios.get(
          "https://api.ohiostatepizzas.com/api/employees/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const role = response.data.role || "manager";
        setUserRole(role);
        localStorage.setItem("userRole", role);

        // Verify route permission
        const currentRouteKey = getRouteKey(pathname);
        if (currentRouteKey && !rolePermissions[role]?.[currentRouteKey]) {
          setAuthStatus("unauthorized");
          return;
        }

        // Verify additional permissions if provided
        if (requiredPermissions) {
          // Check if user's role is included in requiredPermissions
          if (!requiredPermissions.includes(role)) {
            setAuthStatus("unauthorized");
            return;
          }
        }

        setAuthStatus("authenticated");
      } catch (error) {
        console.error("Authentication failed:", error);
        localStorage.removeItem("authToken");
        localStorage.removeItem("userRole");
        setAuthStatus("unauthenticated");
      }
    };

    verifyAuth();
  }, [pathname, requiredPermissions]);

  const getRouteKey = (path) => {
    // Remove query params and hash
    const cleanPath = path.split('?')[0].split('#')[0];
    
    const routeMap = {
      '/dashboard': 'dashboard',
      '/stores': 'stores',
      '/menus': 'menus',
      '/combos': 'combos',
      '/orders': 'orders',
      '/users': 'users',
      '/settings': 'settings',
      '/': 'dashboard',
    };

    // Exact match first
    if (routeMap[cleanPath]) {
      return routeMap[cleanPath];
    }

    // Check for nested routes
    for (const [routePath, key] of Object.entries(routeMap)) {
      if (routePath !== '/' && cleanPath.startsWith(routePath + '/')) {
        return key;
      }
    }

    return null;
  };

  if (authStatus === "checking") {
    return (
      <div className="flex items-center justify-center h-[90%]">
        <div className="w-32 h-32">
          <Lottie animationData={LoadingAnimation} loop={true} />
        </div>
      </div>
    );
  }

  if (authStatus === "unauthenticated") {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">
            Authentication Required
          </h2>
          <p className="mb-4">You need to be logged in to access this page.</p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (authStatus === "unauthorized") {
    return (
      <div className="flex flex-col items-center justify-center h-[90%]">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">
            Access Denied
          </h2>
          <p className="mb-4">You are not authorized to view this page.</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => (window.location.href = "/")}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("authToken");
                localStorage.removeItem("userRole");
                window.location.href = "/login";
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}