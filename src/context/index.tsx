"use client";
import React, { createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/firebase";
import { useSession } from "next-auth/react";
interface GlobalContextType {
  message: string | null;
  messageType: string;
  updateMessage: (newMessage: string, newMessageType: string) => void;
  clearMessage: () => void;
  user: { uid: string; email: string };
}

export const GlobalContext = createContext<GlobalContextType | undefined>(
  undefined
);

export const GlobalProvider: React.FC<{
  children: React.ReactNode | React.ReactNode[];
}> = ({ children }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<string>("");
  const session = useSession();
  const [user, setUser] = useState<{ uid: string; email: string }>({
    uid: "",
    email: "",
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (message) {
      timeoutId = setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [message]);

  const updateMessage = (newMessage: string, newMessageType: string) => {
    setMessage(newMessage);
    setMessageType(newMessageType);
  };

  const clearMessage = () => {
    setMessage(null);
  };

  useEffect(() => {
    if (!session || session.status === "unauthenticated") return;
    if (session.data) {
      setUser(session.data.user as { uid: string; email: string });
    }
  }, [session]);

  const payload = { message, messageType, updateMessage, clearMessage, user };
  return (
    <GlobalContext.Provider value={payload}>{children}</GlobalContext.Provider>
  );
};
