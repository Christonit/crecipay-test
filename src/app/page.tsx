"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import db from "./firestore";
import { collection, getDocs, query, where } from "firebase/firestore";
import { TypographyH1 } from "../components/ui/typography";
import { AddPayment } from "../components/modals/add-contribution";
import { ContributionI } from "../lib/types";
import ContributionsTable from "../components/ContributionsTable";
import { GlobalContext } from "@/context";
import Divider from "@/components/layouts/divider";
import { parseDate } from "@/lib/utils";

export default function Home() {
  const [contributions, setContributions] = useState<ContributionI[]>([]);
  const { user } = useContext(GlobalContext) || {};
  const [total, setTotal] = useState(0);
  const [doneLoading, setDoneLoading] = useState(false);
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

    setDoneLoading(true);
    const res = await getDocs(q);
    const data = res.docs.map((doc) => doc.data());

    setContributions(data as ContributionI[]);
  };

  useEffect(() => {
    if (!user) return;
    fetchContributions(user.uid);
  }, [user]);

  useEffect(() => {
    if (!contributions) return;

    let total = 0;
    contributions.forEach((contribution) => {
      total += contribution.amount;
    });

    setTotal(total);
  }, [contributions]);

  useEffect(() => {
    document.title = "Contributions";
  }, []);
  return (
    <>
      <div className="flex flex-col gap-[4px] py-[16px]">
        <TypographyH1>Contributions</TypographyH1>

        <div className="flex gap-[12px] text-slate-900 text-base">
          <span>
            Current balance:
            {(total / 100).toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
            &nbsp;
            {contributions.length > 0 && (
              <>
                (last updated{" "}
                {parseDate(
                  contributions[0].submission_date.toLocaleString(),
                  "MM/dd/yyyy"
                )}
                )
              </>
            )}
          </span>
        </div>
      </div>

      <Divider />

      <div className="py-[16px]">
        <AddPayment />
      </div>

      <Divider />

      {doneLoading && (
        <div className="w-full block max-w-[90%] mx-auto">
          {contributions.length > 0 ? (
            <ContributionsTable contributions={contributions} />
          ) : (
            <div className="text-center text-lg text-slate-900 p-[64px] border border-slate-300 rounded-[12px] mt-[32px]">
              No contributions yet
            </div>
          )}
        </div>
      )}
    </>
  );
}

Home.requireAuth = true;
