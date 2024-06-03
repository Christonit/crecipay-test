"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import db from "./firestore";
import { auth } from "./firebase";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { TypographyH1 } from "../components/ui/typography";
import { AddPayment } from "../components/modals/add-contribution";
import { ContributionI } from "../lib/types";
import ContributionsTable from "../components/ContributionsTable";
import { GlobalContext } from "@/context";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

export default function Home() {
  const [contributions, setContributions] = useState<ContributionI[]>([]);
  const { user } = useContext(GlobalContext);

  useSession({
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
    if (!user) return;
    fetchContributions(user.uid);
  }, [user]);

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
