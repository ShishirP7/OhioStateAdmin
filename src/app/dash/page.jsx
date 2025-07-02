"use client";
import React from "react";
import AdminLayout from "../components/adminLayouts";
import Lottie from "lottie-react";
import MaintainanceAnimation from "../../../Assets/Maintainance.json";

export default function Dashboard() {

  return (
    <AdminLayout>
      <div className="flex flex-col items-center justify-center ">
        <div>
            <Lottie animationData={MaintainanceAnimation} loop={true} />
        </div>
      </div>
    </AdminLayout>
  );
}
