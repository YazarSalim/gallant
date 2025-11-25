"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // useEffect(() => {
  //   const token = localStorage.getItem("token");

  //   if (!token) {
  //     router.replace("/login");
  //     return;
  //   }

  //   try {
  //     const payload = JSON.parse(atob(token.split(".")[1]));
  //     console.log(payload);
      

  //     if (payload.exp * 1000 < Date.now()) {
  //       // Token expired → remove and show modal
  //       localStorage.removeItem("token");
  //       localStorage.removeItem("user");
  //       setShowModal(true);
  //       return;
  //     }
  //   } catch (err) {
  //     localStorage.removeItem("token");
  //     localStorage.removeItem("user");
  //     router.replace("/login");
  //     return;
  //   }

  //   setIsLoading(false);
  // }, [router]);


  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    router.replace("/login");
    return;
  }

  let timeoutId: NodeJS.Timeout;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiryTime = payload.exp * 1000;
    const timeLeft = expiryTime - Date.now();

    if (timeLeft <= 0) {
      // Already expired
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setShowModal(true);
    } else {
      // Set a timeout to show modal when token expires
      timeoutId = setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setShowModal(true);
      }, timeLeft);
    }
  } catch (err) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/login");
    return;
  }

  setIsLoading(false);

  // Cleanup timeout on unmount
  return () => {
    if (timeoutId) clearTimeout(timeoutId);
  };
}, [router]);

  const handleLoginRedirect = () => {
    router.replace("/login");
  };

  if (isLoading) return null;

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md text-center">
            <h2 className="text-xl font-semibold mb-4">Session Expired</h2>
            <p className="mb-6">Your session has expired. Please login again.</p>
            <button
              onClick={handleLoginRedirect}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Login
            </button>
          </div>
        </div>
      )}
      {!showModal && children}
    </>
  );
};

export default ProtectedRoute;
