"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export function Message() {
  const [message, setMessage] = useState<string | null>(null);
  const [show, setShow] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const msg = searchParams.get("message");
    if (msg) {
      setMessage(msg);
      setShow(true);

      // Hide message after 5 seconds
      setTimeout(() => {
        setShow(false);
        setMessage(null);
      }, 5000);
    }
  }, [searchParams]);

  if (!show || !message) return null;

  return (
    <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button
          onClick={() => {
            setShow(false);
            setMessage(null);
          }}
          className="ml-2 text-white hover:text-gray-200"
        >
          ×
        </button>
      </div>
    </div>
  );
}

