"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/contexts/authContext";
import { doSignOut } from "@/components/firebase/auth";
import AddItemForm from "@/components/items/AddItemForm";
import ItemsList from "@/components/items/ItemsList";

export default function Home() {
  const router = useRouter();
  const { currentUser, userLoggedIn, loading } = useAuth();

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !userLoggedIn) {
      router.push("/login");
    }
  }, [userLoggedIn, loading, router]);

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Don't render if not logged in (will redirect)
  if (!userLoggedIn) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await doSignOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-xs text-gray-500">Welcome back!</p>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-3 px-4 py-2 bg-gray-100 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {currentUser?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {currentUser?.displayName ||
                      currentUser?.email?.split("@")[0]}
                  </p>
                  <p className="text-xs text-gray-500">
                    {currentUser?.emailVerified ? "Verified" : "Unverified"}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Hello,{" "}
                  {currentUser?.displayName ||
                    currentUser?.email?.split("@")[0]}
                  !
                </h1>
                <p className="text-indigo-100 text-lg">
                  Welcome to your personal dashboard. Manage your data and stay
                  organized.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
              <svg
                className="w-5 h-5 text-indigo-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Account Information</span>
            </h2>
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                currentUser?.emailVerified
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {currentUser?.emailVerified ? "Verified" : "Unverified"}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Email Address
                </label>
                <p className="text-gray-900 font-medium">
                  {currentUser?.email}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Display Name
                </label>
                <p className="text-gray-900 font-medium">
                  {currentUser?.displayName || "Not set"}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  User ID
                </label>
                <p className="text-gray-900 font-mono text-sm">
                  {currentUser?.uid}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Account Status
                </label>
                <p className="text-gray-900 font-medium">
                  {currentUser?.emailVerified
                    ? "Active"
                    : "Pending Verification"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Firestore Data Section */}
        <div className="space-y-8">
          <AddItemForm />
          <ItemsList />
        </div>
      </main>
    </div>
  );
}
