'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminPage } from "@/app/admin/page"

export default function withAdminAuth(AdminPage) {
  return function AdminProtectedPage(props) {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem("authToken");
      const userRole = localStorage.getItem("userRole"); // Assume userRole is stored in localStorage after login

      // Check if the user is logged in and has admin privileges
      if (!token || userRole !== "admin") {
        router.push("/"); // Redirect to the landing page or login page
      }
    }, []);

    return <Component {...props} />;
  };
}
