import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../forms/CheckoutForm";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);
export function AddPayment() {
  const contribution_year = [
    new Date().getFullYear(),
    new Date().getFullYear() + 1,
    new Date().getFullYear() + 2,
  ];

  const [current_step, setCurrentStep] = useState(1);
  const [contribution, setContribution] = useState({
    amount: 0,
    year: new Date().getFullYear(),
  });

  const [clientSecret, setClientSecret] = useState("");
  const fetchClientSecret = () => {
    // Create a Checkout Session
    return fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: contribution.amount }),
    })
      .then((res: any) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        setCurrentStep(2);
      });
  };

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  console.log(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

  const handleNextStep = () => {
    if (
      contribution.amount > 0 &&
      contribution.year >= new Date().getFullYear()
    ) {
      console.log({ contribution });
      fetchClientSecret();
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">+ Add Contribution</Button>
      </DialogTrigger>
      <DialogContent className="max-[800px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl mb-[32px]">
            Add new contribution
          </DialogTitle>
        </DialogHeader>

        {current_step === 1 && (
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

              <div className="flex flex-col gap-[12px]">
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

            <DialogFooter>
              <Button onClick={handleNextStep}>Continue</Button>
            </DialogFooter>
          </>
        )}

        {clientSecret && current_step === 2 && (
          <>
            <Elements options={options} stripe={stripePromise}>
              <CheckoutForm />
            </Elements>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
