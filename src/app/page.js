"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminDashboard from "./components/adminDashboard";
import AdminLayout from "./components/adminLayouts";

export default function Home() {
  const [isLogin, setLoginStatus] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check authentication status (you might want to use a more secure method)
    const checkAuth = async () => {
      // Example: Check if there's a token in localStorage
      const token = localStorage.getItem('authToken');
      // Or you might want to make an API call to verify the token
      
      if (!token) {
        setLoginStatus(false);
        router.push('/login');
      } else {
        setLoginStatus(true);
      }
    };

    checkAuth();
  }, [router]);

  // Show loading state while checking auth status
  if (isLogin === null) {
    return <div>Loading...</div>;
  }

  // Only render dashboard if authenticated
  if (isLogin) {
    return (
      <div>
        <AdminLayout>
          <AdminDashboard />
        </AdminLayout>
      </div>
    );
  }

  // If not authenticated, the useEffect will handle the redirect
  // So we can return null or a loading message here
  return null;
}