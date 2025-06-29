"use client";
import React from "react";
import AdminLayout from "../components/adminLayouts";
import Lottie from "lottie-react";
import MaintainanceAnimation from "../../../Assets/Maintainance.json";

export default function Dashboard() {
  return (
    <AdminLayout>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Under Maintenance</h1>
        <div className="w-80 h-80">
          <Lottie animationData={MaintainanceAnimation} loop={true} />
        </div>
      </div>
    </AdminLayout>
  );
}
