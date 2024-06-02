"use client";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import db from "./firestore";
import { auth } from "./firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

interface ContributionI {
  amount: number;
  contribution_year: number;
  funding_source: string;
  status: string;
  submission_date: {
    seconds: number;
    nanoseconds: number;
  };
  user: string;
}

export default function Home() {
  const [userId, setUserId] = useState<string>("");
  const [contributions, setContributions] = useState<ContributionI[]>([]);

  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/signin");
    },
  });

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      setUserId(uid);
    } else {
      console.log("No user is signed in.");
    }
  });

  const fetchContributions = async (userId: string) => {
    const q = query(
      collection(db, "contributions"),
      where("user", "==", userId)
    );
    const res = await getDocs(q);
    const data = res.docs.map((doc) => doc.data());

    setContributions(data as ContributionI[]);
  };
  useEffect(() => {
    if (!userId) return;
    fetchContributions(userId);
  }, [userId]);

  return (
    <div className="p-8">
      <div className="text-white">{session?.data?.user?.email}</div>
      <button className="text-white" onClick={() => signOut()}>
        Logout
      </button>
    </div>
  );
}

Home.requireAuth = true;
