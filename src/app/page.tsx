"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import db from "./firestore";
import { auth } from "./firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { TypographyH1 } from "../components/ui/typography";
import { AddPayment } from "../components/modals/add-contribution";
import { ContributionI } from "../lib/types";
import ContributionsTable from "../components/ContributionsTable";
export default function Home() {
  const [userId, setUserId] = useState<string>("");
  const [contributions, setContributions] = useState<ContributionI[]>([]);
  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/signin");
    },
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
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log("User is signed in.", uid);
        setUserId(uid);
      } else {
        console.log("No user is signed in.");
      }
    });
  }, []);
  useEffect(() => {
    if (!userId) return;
    fetchContributions(userId);
  }, [userId]);

  return (
    <>
      <div className="flex flex-col gap-[12px]">
        <TypographyH1>Contributions</TypographyH1>

        <div className="flex gap-[12px]">
          <span> Current balance: $1,100.00 (last updated 04/24/2024)</span>
        </div>
      </div>

      <hr />

      <AddPayment />
      <hr />

      <ContributionsTable contributions={contributions} />
    </>
  );
}

Home.requireAuth = true;
