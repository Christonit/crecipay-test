"use client";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import db from "./firestore";
import { auth } from "./firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { TypographyH1 } from "../components/ui/typography";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddPayment } from "../components/modals/add-contribution";
import { Button } from "../components/ui/button";
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
  const [showAddContribution, toggleAddContributionModal] = useState(false);
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

      <Table>
        <TableHeader className="w-full">
          <TableCell>Amount</TableCell>
          <TableCell>Submission Date</TableCell>
          <TableCell>Funding Source</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Contribution Year</TableCell>
        </TableHeader>
        <TableBody>
          {contributions.map((contribution, index) => (
            <TableRow key={index}>
              <TableCell className="max-w-[200px]">
                ${contribution.amount}
              </TableCell>
              <TableCell>
                {contribution.submission_date.toLocaleString()}
              </TableCell>
              <TableCell>{contribution.funding_source}</TableCell>
              <TableCell>{contribution.status}</TableCell>
              <TableCell>{contribution.contribution_year}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

Home.requireAuth = true;
