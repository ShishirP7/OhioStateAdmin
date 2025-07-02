"use client";
import React from "react";
import AdminLayout from "../app/components/adminLayouts";
import Lottie from "lottie-react";
import MaintainanceAnimation from "../../Assets/Maintainance.json";

export default function Home() {

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
