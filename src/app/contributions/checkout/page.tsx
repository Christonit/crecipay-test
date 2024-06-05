"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { redirect, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/forms/CheckoutForm";
import { Button } from "@/components/ui/button";
import Head from "next/head";
export default function Home() {
  const search_params = useSearchParams();
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
  );

  const [errorMessage, setErrorMessage] = useState(null);
  const router = useRouter();

  useSession({
    required: true,
    onUnauthenticated() {
      redirect("/signin");
    },
  });

  const [clientSecret, setClientSecret] = useState("");
  const fetchClientSecret = async () => {
    const res = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: search_params?.get("amount") }),
    });

    if (errorMessage) setErrorMessage(null);
    const data = await res.json();

    if (res.status === 200) setClientSecret(data.clientSecret);

    if (res.status !== 200) setErrorMessage(data.message);
  };

  const appearance = {
    theme: "stripe" as "stripe" | "night" | "flat" | undefined,
  };
  const options = {
    clientSecret,
    appearance,
  };

  useEffect(() => {
    if (!clientSecret) fetchClientSecret();
  }, [clientSecret]);

  useEffect(() => {
    document.title = "Checkout | CreciPay";
  }, []);

  return (
    <>
      <div className="w-full px-[16px] py-[32px] lg:p-[64px] relative">
        {search_params?.get("redirect_status") !== "succeeded" && (
          <Button
            className="absolute top-4 left-4"
            onClick={() => router.push("/")}
          >
            Go back
          </Button>
        )}

        <div className="max-w-[400px] mx-auto w-full">
          {errorMessage && (
            <>
              <div
                id="payment-message"
                className="text-base text-[#FF2626] p-[24px] bg-[#FFCACA] border-[2px] rounded-[12px] border-[#FF2626] mb-[32px] text-center"
              >
                {errorMessage}
              </div>

              <Button
                className="mx-auto block"
                onClick={() => router.push("/")}
              >
                Go back
              </Button>
            </>
          )}
        </div>
        {clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        )}
      </div>
    </>
  );
}

Home.requireAuth = true;
