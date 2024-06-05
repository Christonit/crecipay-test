import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";

export function AddPayment() {
  const contribution_year = [
    new Date().getFullYear(),
    new Date().getFullYear() + 1,
    new Date().getFullYear() + 2,
  ];

  const router = useRouter();
  const [contribution, setContribution] = useState({
    amount: 0,
    year: new Date().getFullYear(),
  });

  const handleNextStep = () => {
    if (
      contribution.amount > 0 &&
      contribution.year >= new Date().getFullYear()
    ) {
      router.push(
        "/contributions/checkout?amount=" +
          contribution.amount +
          "&year=" +
          contribution.year
      );
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>+ Add Contribution</Button>
      </DialogTrigger>
      <DialogContent className="max-[800px] bg-[#ffffff] z-50 border-slate-300 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl mb-[32px]">
            Add new contribution
          </DialogTitle>
        </DialogHeader>

        <>
          <div className="flex flex-col gap-[32px] mb-[32px]">
            <div className="flex flex-col gap-[12px]">
              <Label htmlFor="contribution">Contribution</Label>
              <Input
                type="number"
                id="contribution"
                placeholder="$000"
                className="w-full"
                onChange={(e) =>
                  setContribution({
                    ...contribution,
                    amount: Number(e.target.value),
                  })
                }
              />
            </div>

            <div className="flex flex-col gap-[12px] relative z-[2]">
              <Label htmlFor="contribution_year">Contribution year</Label>
              <Select
                onValueChange={(value) =>
                  setContribution({ ...contribution, year: Number(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a valid contribution year" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {contribution_year.map((year) => (
                    <SelectItem value={String(year)}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="z-[-1]">
            <Button
              onClick={handleNextStep}
              disabled={!contribution.amount || !contribution.year}
            >
              Continue
            </Button>
          </DialogFooter>
        </>
      </DialogContent>
    </Dialog>
  );
}
