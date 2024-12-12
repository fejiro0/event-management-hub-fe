'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const withAdminProtection = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();

    useEffect(() => {
      // Check if there's a token in localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        // If no token, redirect to the login page
        router.push("/login");
        return;
      }

      // Decode the token to get user info
      const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode JWT token
      const userRole = decodedToken.role; // Assuming the role is stored in the token

      // If the user is not an admin, redirect them to the home page or a different route
      if (userRole !== "admin") {
        router.push("/"); // Redirect to the home page if not an admin
      }
    }, []);

    // If the user is not an admin, nothing is rendered. Otherwise, the wrapped component is rendered.
    return <WrappedComponent {...props} />;
  };
};

export default withAdminProtection;
