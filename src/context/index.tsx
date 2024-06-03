"use client";
import React, { createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import db from "@/app/firestore";
import { auth } from "@/app/firebase";
interface GlobalContextType {
  message: string | null;
  messageType: string;
  updateMessage: (newMessage: string, newMessageType: string) => void;
  clearMessage: () => void;
  user: { uid: string; email: string } | undefined;
}

export const GlobalContext = createContext<GlobalContextType | undefined>(
  undefined
);

export const GlobalProvider: React.FC<{
  children: React.ReactNode | React.ReactNode[];
}> = ({ children }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<string>("");

  const [user, setUser] = useState<{
    uid: string;
    email: string;
  }>();

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
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log("User is signed in.", uid);
        setUser({
          uid: uid,
          email: user.email || "",
        });
      } else {
        console.log("No user is signed in.");
      }
    });
  }, []);

  return (
    <GlobalContext.Provider
      value={{ message, messageType, updateMessage, clearMessage, user }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
